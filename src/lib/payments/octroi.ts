import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { getPlan } from './plans';
import { calculerFinPeriode } from './subscription';

/**
 * Octroi et révocation d'accès — le cœur de la fulfilment, appelé par les deux
 * webhooks. Toutes les fonctions sont idempotentes : un webhook rejoué ne doit
 * jamais prolonger l'abonnement une seconde fois.
 */

type ClientAdmin = ReturnType<typeof createAdminClient>;

// ─────────────────────────────────────────────────────────────────────────
// Déduplication des événements
// ─────────────────────────────────────────────────────────────────────────

/**
 * Enregistre l'événement et indique s'il avait DÉJÀ été traité.
 *
 * L'insertion elle-même fait office de verrou : la clé primaire
 * (provider, event_id) rejette le doublon, ce qui reste correct même si deux
 * livraisons simultanées passent le test au même instant.
 */
export async function evenementDejaTraite(
  admin: ClientAdmin,
  fournisseur: string,
  eventId: string
): Promise<boolean> {
  const { error } = await admin
    .from('processed_events')
    .insert({ provider: fournisseur, event_id: eventId });

  if (!error) return false;

  // 23505 = violation de contrainte d'unicité → l'événement est un rejeu.
  if (error.code === '23505') return true;

  console.error('[octroi] écriture de processed_events impossible', error);
  // En cas d'erreur inattendue on laisse passer : mieux vaut un traitement
  // en double, rattrapé par les garde-fous ci-dessous, qu'un paiement ignoré.
  return false;
}

/**
 * Retire le verrou de déduplication.
 *
 * L'insertion dans `processed_events` a lieu AVANT le traitement, car c'est
 * elle qui sert de verrou atomique contre les livraisons concurrentes. Mais si
 * le traitement échoue ensuite, le verrou empêcherait la nouvelle tentative du
 * fournisseur d'aboutir — et le paiement serait perdu. On le libère donc sur
 * les chemins d'échec. Le double-octroi reste impossible : `accorderAcces` est
 * protégé par sa clause `status = 'pending'`.
 */
export async function libererEvenement(
  admin: ClientAdmin,
  fournisseur: string,
  eventId: string
): Promise<void> {
  const { error } = await admin
    .from('processed_events')
    .delete()
    .eq('provider', fournisseur)
    .eq('event_id', eventId);

  if (error) console.error('[octroi] libération du verrou impossible', error);
}

// ─────────────────────────────────────────────────────────────────────────
// Octroi
// ─────────────────────────────────────────────────────────────────────────

export interface ResultatOctroi {
  ok: boolean;
  motif?: string;
  finPeriode?: string;
}

/**
 * Valide un paiement et prolonge l'accès de l'apprenant.
 *
 * `finPeriodeImposee` est fournie par Stripe, qui fait autorité sur les dates
 * de son propre abonnement. Pour Moneroo, la date est calculée ici à partir de
 * la durée du plan.
 */
export async function accorderAcces(params: {
  admin: ClientAdmin;
  paymentId: string;
  transactionId: string;
  montantAnnonce?: number;
  deviseAnnoncee?: string;
  finPeriodeImposee?: Date;
}): Promise<ResultatOctroi> {
  const { admin, paymentId } = params;

  const { data: paiement } = await admin
    .from('payments')
    .select('id, user_id, plan_id, amount, currency, status, provider')
    .eq('id', paymentId)
    .single();

  if (!paiement) return { ok: false, motif: 'Paiement introuvable.' };

  // Garde-fou 1 : contrôle d'altération du montant. Le webhook annonce un
  // montant ; s'il diffère de celui posé au checkout, on refuse.
  if (params.montantAnnonce !== undefined && params.montantAnnonce !== paiement.amount) {
    console.error('[octroi] montant divergent', {
      paymentId,
      attendu: paiement.amount,
      recu: params.montantAnnonce,
    });
    return { ok: false, motif: 'Montant du webhook différent du montant attendu.' };
  }
  if (params.deviseAnnoncee && params.deviseAnnoncee.toUpperCase() !== paiement.currency) {
    console.error('[octroi] devise divergente', { paymentId, attendue: paiement.currency });
    return { ok: false, motif: 'Devise du webhook différente de la devise attendue.' };
  }

  // Garde-fou 2 : transition de statut protégée par la clause WHERE. Deux
  // livraisons concurrentes ne peuvent pas franchir cette étape toutes les deux.
  const { data: transition } = await admin
    .from('payments')
    .update({
      status: 'completed',
      provider_transaction_id: params.transactionId,
      webhook_received_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentId)
    .eq('status', 'pending')
    .select('id');

  if (!transition || transition.length === 0) {
    return { ok: true, motif: 'Paiement déjà traité.' };
  }

  const plan = getPlan(paiement.plan_id);
  if (!plan) return { ok: false, motif: `Formule inconnue : ${paiement.plan_id}.` };

  const { data: profil } = await admin
    .from('profiles')
    .select('current_period_end, bonus_7j_accorde')
    .eq('id', paiement.user_id)
    .single();

  // Bonus d'acquisition : 7 jours offerts au tout premier paiement, en plus
  // de la durée achetée. Un renouvellement anticipé empile sur la période en
  // cours plutôt que de l'écraser.
  const calcul = calculerFinPeriode({
    profil: {
      current_period_end: profil?.current_period_end ?? null,
      bonus_7j_accorde: profil?.bonus_7j_accorde ?? false,
    },
    dureeMois: plan.dureeMois,
  });

  // Stripe fait autorité sur les dates de son propre abonnement : quand il
  // impose une fin de période, le bonus est déjà intégré côté Stripe.
  const finPeriode = params.finPeriodeImposee ?? calcul.fin;
  const bonusApplique = params.finPeriodeImposee ? false : calcul.bonusApplique;

  const { error: erreurProfil } = await admin
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_plan: plan.id,
      subscription_provider: paiement.provider,
      subscription_currency: paiement.currency,
      subscription_tier: 'premium',
      current_period_end: finPeriode.toISOString(),
      cancel_at_period_end: false,
      // Le bonus est marqué comme consommé dès le premier paiement, quel que
      // soit le fournisseur : il ne sera plus jamais réattribué.
      bonus_7j_accorde: true,
      updated_at: new Date().toISOString(),
    })
    .eq('id', paiement.user_id);

  if (erreurProfil) {
    console.error('[octroi] mise à jour du profil impossible', erreurProfil);
    return { ok: false, motif: 'Profil non mis à jour.' };
  }

  const echeance = finPeriode.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  await notifier(admin, paiement.user_id, {
    titre: 'Abonnement activé 🎉',
    message: bonusApplique
      ? `Votre ${plan.nom} est actif jusqu'au ${echeance}, vos 7 jours offerts inclus. Bon apprentissage !`
      : `Votre ${plan.nom} est actif jusqu'au ${echeance}. Bon apprentissage !`,
  });

  return { ok: true, finPeriode: finPeriode.toISOString() };
}

/** Marque un paiement comme échoué, sans toucher à l'accès en cours. */
export async function enregistrerEchec(
  admin: ClientAdmin,
  paymentId: string,
  motif: string
): Promise<void> {
  await admin
    .from('payments')
    .update({
      status: 'failed',
      failure_reason: motif.slice(0, 500),
      webhook_received_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', paymentId)
    .eq('status', 'pending');
}

// ─────────────────────────────────────────────────────────────────────────
// Cycle de vie Stripe
// ─────────────────────────────────────────────────────────────────────────

/** Prolonge l'accès à chaque échéance réglée (`invoice.paid`, renouvellement). */
export async function prolongerDepuisStripe(
  admin: ClientAdmin,
  abonnementId: string,
  finPeriode: Date
): Promise<void> {
  const { error } = await admin
    .from('profiles')
    .update({
      subscription_status: 'active',
      subscription_tier: 'premium',
      current_period_end: finPeriode.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', abonnementId);

  if (error) console.error('[octroi] prolongation Stripe impossible', error);
}

/**
 * Fin définitive d'un abonnement Stripe.
 *
 * On ne coupe rien sur `cancel_at_period_end` : l'apprenant a payé sa période
 * en cours et la conserve jusqu'au bout. Seul `customer.subscription.deleted`
 * déclenche la révocation.
 */
export async function revoquerAbonnementStripe(
  admin: ClientAdmin,
  abonnementId: string
): Promise<void> {
  const { error } = await admin
    .from('profiles')
    .update({
      subscription_status: 'free',
      subscription_tier: 'free',
      cancel_at_period_end: false,
      stripe_subscription_id: null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', abonnementId);

  if (error) console.error('[octroi] révocation Stripe impossible', error);
}

// ─────────────────────────────────────────────────────────────────────────
// Notification in-app
// ─────────────────────────────────────────────────────────────────────────

async function notifier(
  admin: ClientAdmin,
  userId: string,
  contenu: { titre: string; message: string }
): Promise<void> {
  const { error } = await admin.from('notifications').insert({
    user_id: userId,
    title: contenu.titre,
    message: contenu.message,
    source: 'abonnement',
    action_url: '/mon-compte?tab=subscription',
  });

  // Une notification manquée ne doit jamais faire échouer un paiement réussi.
  if (error) console.error('[octroi] notification non enregistrée', error);
}
