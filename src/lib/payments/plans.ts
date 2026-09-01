/**
 * Catalogue tarifaire ChinoisLingo.
 *
 * Source de vérité unique des prix, partagée par l'interface et les routes API.
 * Aucun secret ici : ce fichier est importable côté navigateur.
 *
 * Deux grilles, deux fournisseurs :
 *   • FCFA (XOF) → Moneroo, Mobile Money + carte, marché local.
 *     Paiement ponctuel : Moneroo ne fait pas de prélèvement récurrent, l'accès
 *     est donc un « pass » à durée fixe que l'utilisateur reconduit lui-même.
 *   • EUR         → Stripe, carte, diaspora et international.
 *     Vrai abonnement à renouvellement automatique.
 */

export type PlanId = 'mensuel' | 'semestriel' | 'annuel';
export type Devise = 'XOF' | 'EUR';
export type Fournisseur = 'moneroo' | 'stripe';

export interface Plan {
  id: PlanId;
  /** Libellé affiché sur la carte de tarif. */
  nom: string;
  /** Durée d'accès accordée, en mois. */
  dureeMois: number;
  /**
   * Montant dans la plus petite unité de la devise.
   * XOF est une devise sans décimale : 8888 = 8 888 FCFA.
   * EUR est en centimes : 1399 = 13,99 €.
   */
  montant: Record<Devise, number>;
  /** Mis en avant visuellement dans la grille. */
  populaire?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'mensuel',
    nom: 'Pass Mensuel',
    dureeMois: 1,
    montant: { XOF: 8888, EUR: 1399 },
  },
  {
    id: 'semestriel',
    nom: 'Pass 6 Mois',
    dureeMois: 6,
    montant: { XOF: 39999, EUR: 5999 },
    populaire: true,
  },
  {
    id: 'annuel',
    nom: 'Pass Annuel',
    dureeMois: 12,
    montant: { XOF: 69999, EUR: 9999 },
  },
];

/**
 * Jours offerts au PREMIER paiement, en plus de la durée achetée.
 * Sert d'accroche : « abonne-toi aujourd'hui et obtiens 7 jours en plus ».
 * Passer cette valeur à 0 désactive le bonus sans autre modification.
 */
export const BONUS_PREMIER_PAIEMENT_JOURS = 7;

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

/** Le fournisseur est déterminé par la devise choisie. */
export function fournisseurPourDevise(devise: Devise): Fournisseur {
  return devise === 'XOF' ? 'moneroo' : 'stripe';
}

/**
 * Formate un montant exprimé dans la plus petite unité.
 *   formaterMontant(8888, 'XOF')  → « 8 888 FCFA »
 *   formaterMontant(1399, 'EUR')  → « 13,99 € »
 */
export function formaterMontant(montant: number, devise: Devise): string {
  if (devise === 'XOF') {
    return `${montant.toLocaleString('fr-FR')} FCFA`;
  }
  return `${(montant / 100).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

/** Prix ramené au mois, pour l'argument « soit X par mois ». */
export function prixMensuelEquivalent(plan: Plan, devise: Devise): string {
  const parMois = Math.round(plan.montant[devise] / plan.dureeMois);
  return formaterMontant(parMois, devise);
}

/**
 * Économie réalisée face au tarif mensuel, en pourcentage.
 * Retourne 0 pour le plan mensuel lui-même.
 */
export function economiePourcent(plan: Plan, devise: Devise): number {
  const mensuel = PLANS.find((p) => p.id === 'mensuel');
  if (!mensuel || plan.id === 'mensuel') return 0;
  const pleinTarif = mensuel.montant[devise] * plan.dureeMois;
  return Math.round(((pleinTarif - plan.montant[devise]) / pleinTarif) * 100);
}
