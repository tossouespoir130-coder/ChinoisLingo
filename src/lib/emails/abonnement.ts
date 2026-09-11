import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { urlDeBase } from '@/lib/payments/session-serveur';
import { getPlan, Plan } from '@/lib/payments/plans';
import { configurationEmailPrete, envoyerEmail } from './resend';
import {
  ContenuEmail,
  JOURS_RAPPEL,
  modeleConfirmation,
  modeleRappelJ3,
  modeleRappelJ7,
} from './modeles';

/**
 * E-mails d'abonnement — réservés aux abonnés Mobile Money (Moneroo).
 *
 * Moneroo ne reconduit rien : sans rappel, l'apprenant découvre la fin de son
 * accès en se heurtant à un cadenas. Les abonnés Stripe ne reçoivent rien
 * d'ici : leur carte est prélevée automatiquement et Stripe envoie ses
 * propres reçus.
 *
 * Aucune fonction ne lève d'exception : comme pour les notifications in-app,
 * un e-mail manqué ne doit jamais faire échouer un paiement ni la tâche
 * planifiée.
 */

type ClientAdmin = ReturnType<typeof createAdminClient>;
type TypeEmail = 'confirmation' | 'rappel_j7' | 'rappel_j3';
type TypeRappel = Exclude<TypeEmail, 'confirmation'>;

const JOUR_MS = 86_400_000;

/**
 * Plafond d'envois par exécution, pour tenir dans la durée maximale de la
 * route. Le surplus éventuel part le lendemain : chaque fenêtre de rappel
 * dure plusieurs jours.
 */
const ENVOIS_MAX_PAR_EXECUTION = 80;

/** Resend accepte 10 requêtes par seconde : on reste nettement en dessous. */
const PAUSE_ENTRE_ENVOIS_MS = 150;

// ─────────────────────────────────────────────────────────────────────────
// Confirmation d'activation
// ─────────────────────────────────────────────────────────────────────────

/**
 * Appelée par l'octroi juste après le passage du paiement en « completed » —
 * transition qui ne réussit qu'une fois par paiement.
 */
export async function envoyerConfirmationAbonnement(
  admin: ClientAdmin,
  params: {
    userId: string;
    paymentId: string;
    destinataire: string;
    prenom: string | null;
    plan: Plan;
    /** Montant déjà formaté, ex. « 8 888 FCFA ». */
    montant: string;
    finPeriode: Date;
    bonusJours: number;
  }
): Promise<void> {
  if (!configurationEmailPrete()) {
    console.error('[emails] Resend non configuré : confirmation non envoyée', params.userId);
    return;
  }

  await envoyerUneFois(admin, {
    userId: params.userId,
    type: 'confirmation',
    echeance: params.finPeriode.toISOString(),
    destinataire: params.destinataire,
    paymentId: params.paymentId,
    contenu: modeleConfirmation({
      base: urlDeBase(),
      prenom: params.prenom,
      nomPlan: params.plan.nom,
      montant: params.montant,
      finPeriode: params.finPeriode,
      bonusJours: params.bonusJours,
    }),
  });
}

// ─────────────────────────────────────────────────────────────────────────
// Rappels avant échéance
// ─────────────────────────────────────────────────────────────────────────

/**
 * Quel rappel doit partir pour une échéance donnée ? `null` hors fenêtre.
 *
 * Des fenêtres plutôt que des jours exacts : Vercel ne garantit ni qu'une
 * exécution planifiée a bien lieu, ni qu'elle n'a lieu qu'une fois. Un rappel
 * manqué un jour part donc le lendemain avec le bon décompte, et le registre
 * empêche tout doublon. Même arrondi que `lireEtatAbonnement`, pour que
 * l'e-mail et la page Mon compte annoncent le même nombre de jours.
 */
export function rappelDu(
  finPeriode: Date,
  maintenant: Date
): { type: TypeRappel; joursRestants: number } | null {
  const joursRestants = Math.ceil((finPeriode.getTime() - maintenant.getTime()) / JOUR_MS);
  if (joursRestants <= 0) return null;
  if (joursRestants <= JOURS_RAPPEL.j3) return { type: 'rappel_j3', joursRestants };
  if (joursRestants <= JOURS_RAPPEL.j7) return { type: 'rappel_j7', joursRestants };
  return null;
}

export interface BilanRappels {
  /** Abonnés Mobile Money dans une fenêtre de rappel. */
  candidats: number;
  envoyes: number;
  dejaEnvoyes: number;
  echecs: number;
  erreur?: string;
}

/** Tâche quotidienne : prévient les abonnés Mobile Money avant leur échéance. */
export async function envoyerRappelsEcheance(
  admin: ClientAdmin,
  maintenant: Date = new Date()
): Promise<BilanRappels> {
  const bilan: BilanRappels = { candidats: 0, envoyes: 0, dejaEnvoyes: 0, echecs: 0 };

  const debut = maintenant.toISOString();
  const horizon = new Date(maintenant.getTime() + JOURS_RAPPEL.j7 * JOUR_MS).toISOString();

  // Seul compte le fournisseur de la période EN COURS : un apprenant passé à
  // Stripe, ou revenu au palier gratuit, sort de lui-même de la sélection.
  const { data: profils, error: erreurProfils } = await admin
    .from('profiles')
    .select('id, email, first_name, full_name, subscription_plan, current_period_end')
    .eq('subscription_provider', 'moneroo')
    .gt('current_period_end', debut)
    .lte('current_period_end', horizon)
    // Échéances les plus proches d'abord : si le plafond est atteint, ce sont
    // les rappels les moins urgents qui attendent le lendemain.
    .order('current_period_end', { ascending: true })
    .limit(1000);

  if (erreurProfils) {
    console.error('[emails] lecture des échéances impossible', erreurProfils);
    return { ...bilan, erreur: 'Lecture des échéances impossible.' };
  }

  // Rappels déjà partis pour ces échéances. Les écarter d'emblée évite de
  // repasser par le verrou pour chacun, jour après jour.
  const { data: dejaPartis, error: erreurRegistre } = await admin
    .from('emails_abonnement')
    .select('user_id, type, echeance')
    .in('type', ['rappel_j7', 'rappel_j3'])
    .gt('echeance', debut)
    .lte('echeance', horizon);

  if (erreurRegistre) {
    // Le plus souvent : migration 20260911090000 pas encore appliquée.
    console.error('[emails] registre des envois illisible', erreurRegistre);
    return { ...bilan, erreur: 'Registre des envois illisible.' };
  }

  const cle = (userId: string, type: string, echeance: string) =>
    `${userId}|${type}|${new Date(echeance).getTime()}`;
  const dejaFaits = new Set((dejaPartis ?? []).map((e) => cle(e.user_id, e.type, e.echeance)));

  const base = urlDeBase();

  for (const profil of profils ?? []) {
    if (!profil.current_period_end) continue;

    const finPeriode = new Date(profil.current_period_end);
    const rappel = rappelDu(finPeriode, maintenant);
    if (!rappel) continue;

    bilan.candidats++;

    if (dejaFaits.has(cle(profil.id, rappel.type, profil.current_period_end))) {
      bilan.dejaEnvoyes++;
      continue;
    }

    if (bilan.envoyes >= ENVOIS_MAX_PAR_EXECUTION) continue;

    const destinataire = await adresseDe(admin, profil);
    if (!destinataire) {
      console.error('[emails] aucune adresse pour', profil.id);
      bilan.echecs++;
      continue;
    }

    const donnees = {
      base,
      prenom: prenomDe(profil),
      nomPlan: getPlan(profil.subscription_plan ?? '')?.nom ?? 'Pass ChinoisLingo',
      finPeriode,
      joursRestants: rappel.joursRestants,
    };

    const issue = await envoyerUneFois(admin, {
      userId: profil.id,
      type: rappel.type,
      echeance: profil.current_period_end,
      destinataire,
      contenu: rappel.type === 'rappel_j3' ? modeleRappelJ3(donnees) : modeleRappelJ7(donnees),
    });

    if (issue === 'envoye') {
      bilan.envoyes++;
      await pause(PAUSE_ENTRE_ENVOIS_MS);
    } else if (issue === 'deja_envoye') {
      bilan.dejaEnvoyes++;
    } else {
      bilan.echecs++;
    }
  }

  return bilan;
}

// ─────────────────────────────────────────────────────────────────────────
// Outils
// ─────────────────────────────────────────────────────────────────────────

type IssueEnvoi = 'envoye' | 'deja_envoye' | 'echec';

/**
 * Envoie un e-mail au plus une fois pour une échéance donnée.
 *
 * Même principe que `processed_events` : l'insertion dans le registre fait
 * office de verrou, la contrainte d'unicité rejetant toute seconde tentative
 * — y compris deux exécutions simultanées de la tâche planifiée. Si l'envoi
 * échoue, la ligne est retirée pour que l'exécution suivante retente.
 */
async function envoyerUneFois(
  admin: ClientAdmin,
  params: {
    userId: string;
    type: TypeEmail;
    echeance: string;
    destinataire: string;
    paymentId?: string;
    contenu: ContenuEmail;
  }
): Promise<IssueEnvoi> {
  const { data: ligne, error } = await admin
    .from('emails_abonnement')
    .insert({
      user_id: params.userId,
      type: params.type,
      echeance: params.echeance,
      destinataire: params.destinataire,
      payment_id: params.paymentId ?? null,
    })
    .select('id')
    .single();

  if (error || !ligne) {
    // 23505 = violation d'unicité : cet e-mail est déjà parti.
    if (error?.code === '23505') return 'deja_envoye';
    console.error('[emails] registre des envois inaccessible', error);
    return 'echec';
  }

  const resultat = await envoyerEmail({ a: params.destinataire, ...params.contenu });

  if (!resultat.ok) {
    console.error('[emails] envoi impossible', {
      type: params.type,
      userId: params.userId,
      erreur: resultat.erreur,
    });
    const { error: erreurLiberation } = await admin
      .from('emails_abonnement')
      .delete()
      .eq('id', ligne.id);
    if (erreurLiberation) {
      console.error('[emails] libération du verrou impossible', erreurLiberation);
    }
    return 'echec';
  }

  await admin.from('emails_abonnement').update({ resend_id: resultat.id }).eq('id', ligne.id);
  return 'envoye';
}

/** Prénom pour la formule d'appel ; `null` donne un simple « Bonjour, ». */
export function prenomDe(profil: {
  first_name: string | null;
  full_name: string | null;
}): string | null {
  return profil.first_name?.trim() || profil.full_name?.trim().split(/\s+/)[0] || null;
}

/** L'adresse du profil, sinon celle du compte d'authentification. */
async function adresseDe(
  admin: ClientAdmin,
  profil: { id: string; email: string | null }
): Promise<string | null> {
  if (profil.email) return profil.email;
  const { data } = await admin.auth.admin.getUserById(profil.id);
  return data.user?.email ?? null;
}

function pause(ms: number): Promise<void> {
  return new Promise((resoudre) => setTimeout(resoudre, ms));
}
