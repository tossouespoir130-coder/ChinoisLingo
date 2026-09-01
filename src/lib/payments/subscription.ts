/**
 * Lecture de l'état d'abonnement d'un profil.
 *
 * Modèle : freemium permanent. Deux états seulement.
 *   • gratuit — l'état par défaut, sans limite de durée, avec les quotas
 *     définis dans `acces.ts`.
 *   • premium — une période payée est en cours (`current_period_end` à venir).
 *
 * Il n'y a plus d'essai à durée limitée : les 7 jours sont devenus un bonus
 * offert au premier paiement.
 *
 * Fonctions pures, sans réseau ni secret : utilisables côté client comme côté
 * serveur.
 */

import { Profile } from '@/lib/supabase/types';
import {
  Devise,
  Fournisseur,
  Plan,
  BONUS_PREMIER_PAIEMENT_JOURS,
  getPlan,
} from './plans';

export type StatutAbonnement = 'gratuit' | 'premium';

export interface EtatAbonnement {
  statut: StatutAbonnement;
  /**
   * Une période PAYÉE est-elle en cours ?
   * Décrit uniquement la facturation — c'est ce qu'affiche Mon compte.
   * Ne pas l'utiliser pour verrouiller du contenu : voir `accesComplet`.
   */
  estAbonne: boolean;
  /** Le compte porte-t-il le rôle administrateur ? */
  estAdmin: boolean;
  /**
   * Droit d'accès à l'intégralité du catalogue.
   *
   * C'est LA valeur que doivent consulter tous les verrous de contenu.
   * Un administrateur l'obtient sans abonnement ni date d'expiration ; pour
   * tout autre compte elle vaut exactement `estAbonne`, donc la logique
   * d'abonnement existante est inchangée.
   */
  accesComplet: boolean;
  /** Fin de la période payée. `null` au palier gratuit. */
  finPeriode: Date | null;
  /** Jours pleins restants avant la fin de l'abonnement. 0 au palier gratuit. */
  joursRestants: number;
  plan: Plan | undefined;
  devise: Devise | null;
  fournisseur: Fournisseur | null;
  /** Stripe : résilié mais encore actif jusqu'à la fin de période. */
  resiliationProgrammee: boolean;
  /** Le bonus de bienvenue est-il encore à gagner ? Alimente l'accroche. */
  bonusDisponible: boolean;
}

const ETAT_GRATUIT: EtatAbonnement = {
  statut: 'gratuit',
  estAbonne: false,
  estAdmin: false,
  accesComplet: false,
  finPeriode: null,
  joursRestants: 0,
  plan: undefined,
  devise: null,
  fournisseur: null,
  resiliationProgrammee: false,
  bonusDisponible: true,
};

function versDate(valeur: string | null | undefined): Date | null {
  if (!valeur) return null;
  const d = new Date(valeur);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Calcule l'état d'abonnement à partir du profil Supabase.
 * `maintenant` est injectable pour rendre les calculs testables.
 */
export function lireEtatAbonnement(
  profile: Profile | null,
  maintenant: Date = new Date(),
  /**
   * Rôle confirmé par le serveur, quand il est disponible.
   *
   * `profile.role` provient déjà de Supabase et un déclencheur empêche un
   * utilisateur de se promouvoir lui-même ; cet argument permet néanmoins de
   * faire primer la réponse authentifiée de `/api/moi/acces`, qui recalcule
   * le rôle côté serveur avec la clé service_role.
   */
  roleServeur?: string | null
): EtatAbonnement {
  if (!profile) return ETAT_GRATUIT;

  const finPeriode = versDate(profile.current_period_end);
  const estAbonne = finPeriode !== null && finPeriode.getTime() > maintenant.getTime();

  const joursRestants = estAbonne
    ? Math.ceil((finPeriode!.getTime() - maintenant.getTime()) / 86_400_000)
    : 0;

  const devise =
    profile.subscription_currency === 'XOF' || profile.subscription_currency === 'EUR'
      ? profile.subscription_currency
      : null;

  const fournisseur =
    profile.subscription_provider === 'moneroo' ||
    profile.subscription_provider === 'stripe'
      ? profile.subscription_provider
      : null;

  const estAdmin = (roleServeur ?? profile.role) === 'admin';

  return {
    statut: estAbonne ? 'premium' : 'gratuit',
    estAbonne,
    estAdmin,
    // Le rôle ouvre l'accès sans condition de date ni de paiement.
    accesComplet: estAbonne || estAdmin,
    finPeriode,
    joursRestants,
    plan: profile.subscription_plan ? getPlan(profile.subscription_plan) : undefined,
    devise,
    fournisseur,
    resiliationProgrammee: profile.cancel_at_period_end === true,
    bonusDisponible: profile.bonus_7j_accorde !== true,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Calcul des périodes payées
// ─────────────────────────────────────────────────────────────────────────

/**
 * Point de départ d'une nouvelle période payée.
 *
 * Un renouvellement anticipé empile sur la période en cours plutôt que de
 * l'écraser : personne ne perd de jours déjà payés.
 */
export function debutNouvellePeriode(
  profile: Pick<Profile, 'current_period_end'>,
  maintenant: Date = new Date()
): Date {
  const finActuelle = versDate(profile.current_period_end);
  return finActuelle && finActuelle.getTime() > maintenant.getTime()
    ? finActuelle
    : maintenant;
}

/**
 * Ajoute `mois` mois à une date, en gérant le débordement de fin de mois
 * (31 janvier + 1 mois → 28/29 février, et non le 2 ou 3 mars).
 */
export function ajouterMois(date: Date, mois: number): Date {
  const resultat = new Date(date.getTime());
  const jourInitial = resultat.getDate();
  resultat.setMonth(resultat.getMonth() + mois);
  if (resultat.getDate() < jourInitial) {
    // On a débordé sur le mois suivant : on recule au dernier jour du mois visé.
    resultat.setDate(0);
  }
  return resultat;
}

export function ajouterJours(date: Date, jours: number): Date {
  const d = new Date(date.getTime());
  d.setDate(d.getDate() + jours);
  return d;
}

/**
 * Fin de période accordée pour un achat.
 *
 * Le bonus de bienvenue ne s'applique qu'au tout premier paiement — c'est une
 * prime d'acquisition, pas une remise permanente sur les renouvellements.
 */
export function calculerFinPeriode(params: {
  profil: Pick<Profile, 'current_period_end' | 'bonus_7j_accorde'>;
  dureeMois: number;
  maintenant?: Date;
}): { fin: Date; bonusApplique: boolean } {
  const maintenant = params.maintenant ?? new Date();
  const debut = debutNouvellePeriode(params.profil, maintenant);

  let fin = ajouterMois(debut, params.dureeMois);

  const bonusApplique =
    params.profil.bonus_7j_accorde !== true && BONUS_PREMIER_PAIEMENT_JOURS > 0;
  if (bonusApplique) {
    fin = ajouterJours(fin, BONUS_PREMIER_PAIEMENT_JOURS);
  }

  return { fin, bonusApplique };
}

/** Formatage court d'une échéance, ex. « 14 septembre 2026 ». */
export function formaterEcheance(date: Date | null): string {
  if (!date) return '—';
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
