import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';
import { urlDeBase } from '@/lib/payments/session-serveur';
import { getPlan, Plan } from '@/lib/payments/plans';
import { configurationEmailPrete, envoyerEmail } from './resend';
import { lienDesabonnement } from './desabonnement';
import {
  ContenuEmail,
  DonneesEcheance,
  JOURS_RAPPEL,
  modeleConfirmation,
  modeleExpiration,
  modeleRappelJ3,
  modeleRappelJ7,
  modeleRelance,
} from './modeles';

/**
 * E-mails d'abonnement.
 *
 *   • Confirmation à l'activation — Mobile Money uniquement : Stripe envoie
 *     déjà ses propres reçus.
 *   • Série d'échéance : 7 jours et 3 jours avant, le jour même, puis 3 et 7
 *     jours après si l'apprenant n'a pas renouvelé. Elle concerne les
 *     abonnements qui ne se renouvellent pas seuls : Mobile Money (Moneroo ne
 *     reconduit rien) et cartes dont l'apprenant a annulé le renouvellement.
 *
 * Renouveler arrête la série d'elle-même : l'échéance recule, ou la carte
 * reprend son renouvellement automatique, et l'apprenant sort des fenêtres.
 *
 * Aucune fonction ne lève d'exception : comme pour les notifications in-app,
 * un e-mail manqué ne doit jamais faire échouer un paiement ni la tâche
 * planifiée.
 */

type ClientAdmin = ReturnType<typeof createAdminClient>;
type TypeEcheance = 'rappel_j7' | 'rappel_j3' | 'expiration_j0' | 'relance_j3' | 'relance_j7';
type TypeEmail = 'confirmation' | TypeEcheance;

const TYPES_ECHEANCE: TypeEcheance[] = [
  'rappel_j7',
  'rappel_j3',
  'expiration_j0',
  'relance_j3',
  'relance_j7',
];

const JOUR_MS = 86_400_000;

/** Jours après l'échéance où partent les relances. */
const JOURS_RELANCE = { j3: 3, j7: 7 } as const;

/** Au-delà, la série est close : plus aucun e-mail pour cette échéance. */
const FIN_DE_SERIE_JOURS = 13;

/**
 * Plafond d'envois par exécution, pour tenir dans la durée maximale de la
 * route. Le surplus éventuel part le lendemain : chaque fenêtre dure
 * plusieurs jours.
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
// Série d'échéance
// ─────────────────────────────────────────────────────────────────────────

/** Écart en jours calendaires (UTC) entre la date d'échéance et aujourd'hui. */
export function ecartJours(fin: Date, maintenant: Date): number {
  const jour = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.round((jour(fin) - jour(maintenant)) / JOUR_MS);
}

/**
 * Quel e-mail de la série doit partir pour une échéance donnée ? `null` hors
 * série.
 *
 * Des fenêtres plutôt que des jours exacts : Vercel ne garantit ni qu'une
 * exécution planifiée a bien lieu, ni qu'elle n'a lieu qu'une fois. Un
 * e-mail manqué un jour part donc le lendemain, et le registre empêche tout
 * doublon :
 *   7 à 4 jours avant → rappel J-7        3 à 1 jour avant → rappel J-3
 *   jour J à J+2      → échéance          J+3 à J+6        → relance J+3
 *   J+7 à J+13        → relance J+7       au-delà          → plus rien
 */
export function emailDu(
  finPeriode: Date,
  maintenant: Date
): { type: TypeEcheance; ecart: number } | null {
  const ecart = ecartJours(finPeriode, maintenant);
  if (ecart > JOURS_RAPPEL.j7) return null;
  if (ecart > JOURS_RAPPEL.j3) return { type: 'rappel_j7', ecart };
  if (ecart >= 1) return { type: 'rappel_j3', ecart };
  if (ecart > -JOURS_RELANCE.j3) return { type: 'expiration_j0', ecart };
  if (ecart > -JOURS_RELANCE.j7) return { type: 'relance_j3', ecart };
  if (ecart >= -FIN_DE_SERIE_JOURS) return { type: 'relance_j7', ecart };
  return null;
}

/**
 * Un abonnement par carte non annulé se renouvelle seul : son échéance ne
 * menace rien, aucune série ne le concerne.
 */
function seRenouvelleSeul(profil: {
  subscription_provider: string | null;
  cancel_at_period_end: boolean;
  stripe_subscription_id: string | null;
}): boolean {
  return (
    profil.subscription_provider === 'stripe' &&
    !profil.cancel_at_period_end &&
    profil.stripe_subscription_id !== null
  );
}

/** Les e-mails postérieurs à l'échéance invitent à se réabonner : ce sont des messages commerciaux. */
function estRelance(type: TypeEcheance): boolean {
  return type === 'relance_j3' || type === 'relance_j7';
}

function contenuPour(type: TypeEcheance, donnees: DonneesEcheance): ContenuEmail {
  switch (type) {
    case 'rappel_j7':
      return modeleRappelJ7(donnees);
    case 'rappel_j3':
      return modeleRappelJ3(donnees);
    case 'expiration_j0':
      return modeleExpiration(donnees);
    case 'relance_j3':
      return modeleRelance(donnees, false);
    case 'relance_j7':
      return modeleRelance(donnees, true);
  }
}

export interface BilanRappels {
  /** Abonnés dans une fenêtre de la série. */
  candidats: number;
  envoyes: number;
  dejaEnvoyes: number;
  echecs: number;
  erreur?: string;
}

/** Tâche quotidienne : un e-mail par abonné dont l'échéance tombe dans une fenêtre. */
export async function envoyerRappelsEcheance(
  admin: ClientAdmin,
  maintenant: Date = new Date()
): Promise<BilanRappels> {
  const bilan: BilanRappels = { candidats: 0, envoyes: 0, dejaEnvoyes: 0, echecs: 0 };

  // Un jour de marge de chaque côté : `emailDu` tranche ensuite au jour près.
  const debut = new Date(maintenant.getTime() - (FIN_DE_SERIE_JOURS + 1) * JOUR_MS).toISOString();
  const horizon = new Date(maintenant.getTime() + (JOURS_RAPPEL.j7 + 1) * JOUR_MS).toISOString();

  const { data: profils, error: erreurProfils } = await admin
    .from('profiles')
    .select(
      'id, email, first_name, full_name, subscription_plan, subscription_provider, subscription_currency, cancel_at_period_end, stripe_subscription_id, current_period_end, relances_desactivees'
    )
    .in('subscription_provider', ['moneroo', 'stripe'])
    .gt('current_period_end', debut)
    .lte('current_period_end', horizon)
    .limit(1000);

  if (erreurProfils) {
    console.error('[emails] lecture des échéances impossible', erreurProfils);
    return { ...bilan, erreur: 'Lecture des échéances impossible.' };
  }

  // E-mails déjà partis pour ces échéances. Les écarter d'emblée évite de
  // repasser par le verrou pour chacun, jour après jour.
  const { data: dejaPartis, error: erreurRegistre } = await admin
    .from('emails_abonnement')
    .select('user_id, type, echeance')
    .in('type', TYPES_ECHEANCE)
    .gt('echeance', debut)
    .lte('echeance', horizon);

  if (erreurRegistre) {
    // Le plus souvent : migration du registre pas encore appliquée.
    console.error('[emails] registre des envois illisible', erreurRegistre);
    return { ...bilan, erreur: 'Registre des envois illisible.' };
  }

  const cle = (userId: string, type: string, echeance: string) =>
    `${userId}|${type}|${new Date(echeance).getTime()}`;
  const dejaFaits = new Set((dejaPartis ?? []).map((e) => cle(e.user_id, e.type, e.echeance)));

  const aTraiter: {
    profil: NonNullable<typeof profils>[number];
    echeance: string;
    finPeriode: Date;
    type: TypeEcheance;
    ecart: number;
  }[] = [];

  for (const profil of profils ?? []) {
    if (!profil.current_period_end || seRenouvelleSeul(profil)) continue;
    const finPeriode = new Date(profil.current_period_end);
    const email = emailDu(finPeriode, maintenant);
    if (!email) continue;

    // Refus exprimé depuis un e-mail : seules les relances commerciales
    // s'arrêtent, les messages de service continuent.
    if (profil.relances_desactivees && estRelance(email.type)) continue;

    aTraiter.push({ profil, echeance: profil.current_period_end, finPeriode, ...email });
  }

  // Les e-mails les plus proches de l'échéance d'abord : si le plafond est
  // atteint, ce sont les moins urgents qui attendent le lendemain.
  aTraiter.sort((a, b) => Math.abs(a.ecart) - Math.abs(b.ecart));

  const base = urlDeBase();

  for (const { profil, echeance, finPeriode, type, ecart } of aTraiter) {
    bilan.candidats++;

    if (dejaFaits.has(cle(profil.id, type, echeance))) {
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

    const donnees: DonneesEcheance = {
      base,
      prenom: prenomDe(profil),
      nomPlan: getPlan(profil.subscription_plan ?? '')?.nom ?? 'Pass ChinoisLingo',
      finPeriode,
      ecart,
      terminee: finPeriode.getTime() <= maintenant.getTime(),
      moyen: profil.subscription_provider === 'stripe' ? 'carte' : 'mobile_money',
      devise: profil.subscription_currency === 'EUR' ? 'EUR' : 'XOF',
      // Lien légal de désabonnement : uniquement sur les relances commerciales.
      desabonnement: estRelance(type) ? lienDesabonnement(base, profil.id) : undefined,
    };

    const contenu = contenuPour(type, donnees);
    const issue = await envoyerUneFois(admin, {
      userId: profil.id,
      type,
      echeance,
      destinataire,
      contenu,
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
