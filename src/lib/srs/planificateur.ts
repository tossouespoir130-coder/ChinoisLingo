/**
 * Planificateur de répétition espacée, calqué sur Anki (algorithme SM-2,
 * réglages par défaut d'Anki).
 *
 * Module pur, sans dépendance au navigateur ni à Supabase : il reçoit l'état
 * d'une carte et la note donnée, et renvoie le nouvel état.
 *
 * - Nouvelle carte : étapes d'apprentissage 1 min puis 10 min, puis la carte
 *   « sort » de l'apprentissage avec un intervalle de 1 jour (4 jours si
 *   « Facile »).
 * - Carte en révision : l'intervalle est multiplié par la facilité (250 % au
 *   départ). « Difficile » ×1,2 et −15 points de facilité, « Facile » ×1,3 en
 *   plus et +15 points ; « À revoir » compte un oubli, retire 20 points et
 *   renvoie la carte en réapprentissage (étape de 10 min).
 * - Les révisions tombent au jour près, avec un changement de jour à 4 h du
 *   matin comme dans Anki.
 */

export type Note = 'again' | 'hard' | 'good' | 'easy';

export type EtatPlanification = 'apprentissage' | 'revision' | 'reapprentissage';

export interface EtatCarte {
  hanzi: string;
  etat: EtatPlanification;
  /** Index de l'étape courante (apprentissage / réapprentissage). */
  etape: number;
  /** Intervalle en jours (cartes en révision ; intervalle repris après un oubli). */
  intervalleJours: number;
  /** Facilité en pour mille : 2500 = 250 %. */
  facilite: number;
  /** Date (ISO) à partir de laquelle la carte est due. */
  echeance: string;
  nbRevisions: number;
  nbOublis: number;
  premiereRevision: string;
  derniereRevision: string;
}

const MINUTE = 60_000;
const JOUR = 86_400_000;

export const REGLAGES = {
  etapesApprentissageMin: [1, 10],
  etapesReapprentissageMin: [10],
  intervalleSortieJours: 1,
  intervalleFacileJours: 4,
  faciliteInitiale: 2500,
  faciliteMinimale: 1300,
  bonusFacile: 1.3,
  multiplicateurDifficile: 1.2,
  intervalleMaxJours: 36500,
  /** Heure du changement de jour (comme Anki). */
  heureNouveauJour: 4,
  /** Une carte en apprentissage due dans moins de 20 min peut être montrée en avance. */
  avanceApprentissageMin: 20,
} as const;

/** Début du « jour Anki » (4 h du matin, heure locale) contenant `date`. */
export function debutDuJour(date: Date): Date {
  const d = new Date(date);
  if (d.getHours() < REGLAGES.heureNouveauJour) d.setDate(d.getDate() - 1);
  d.setHours(REGLAGES.heureNouveauJour, 0, 0, 0);
  return d;
}

/** Échéance d'une révision : début du jour situé `jours` jours plus tard. */
function echeanceEnJours(maintenant: Date, jours: number): Date {
  const d = debutDuJour(maintenant);
  d.setDate(d.getDate() + jours);
  return d;
}

function borner(jours: number): number {
  return Math.min(REGLAGES.intervalleMaxJours, Math.max(1, Math.round(jours)));
}

/** État d'une carte jamais étudiée, au moment où on la voit pour la première fois. */
export function nouvelleCarte(hanzi: string, maintenant: Date): EtatCarte {
  const iso = maintenant.toISOString();
  return {
    hanzi,
    etat: 'apprentissage',
    etape: 0,
    intervalleJours: 0,
    facilite: REGLAGES.faciliteInitiale,
    echeance: iso,
    nbRevisions: 0,
    nbOublis: 0,
    premiereRevision: iso,
    derniereRevision: iso,
  };
}

/** Délai (en minutes) appliqué par « Difficile » à l'étape courante. */
function delaiDifficile(etapes: readonly number[], etape: number): number {
  if (etape === 0 && etapes.length > 1) return (etapes[0] + etapes[1]) / 2;
  if (etapes.length === 1) return Math.min(etapes[0] * 1.5, etapes[0] + 1440);
  return etapes[etape];
}

/**
 * Applique une note à une carte et renvoie son nouvel état.
 * `carte` vaut `null` pour une carte jamais étudiée.
 */
export function noter(carte: EtatCarte | null, hanzi: string, note: Note, maintenant: Date): EtatCarte {
  const base = carte ?? nouvelleCarte(hanzi, maintenant);
  const suivante: EtatCarte = {
    ...base,
    nbRevisions: base.nbRevisions + 1,
    derniereRevision: maintenant.toISOString(),
  };
  const dans = (minutes: number) => new Date(maintenant.getTime() + minutes * MINUTE).toISOString();

  // ── Apprentissage et réapprentissage : on avance dans les étapes ──
  if (base.etat === 'apprentissage' || base.etat === 'reapprentissage') {
    const reapprentissage = base.etat === 'reapprentissage';
    const etapes = reapprentissage ? REGLAGES.etapesReapprentissageMin : REGLAGES.etapesApprentissageMin;
    const etape = Math.min(base.etape, etapes.length - 1);

    // Sortie vers la révision avec l'intervalle donné.
    const sortir = (jours: number): EtatCarte => ({
      ...suivante,
      etat: 'revision',
      etape: 0,
      intervalleJours: borner(jours),
      echeance: echeanceEnJours(maintenant, borner(jours)).toISOString(),
    });

    switch (note) {
      case 'again':
        return { ...suivante, etape: 0, echeance: dans(etapes[0]) };
      case 'hard':
        return { ...suivante, etape, echeance: dans(delaiDifficile(etapes, etape)) };
      case 'good':
        if (etape + 1 < etapes.length) {
          return { ...suivante, etape: etape + 1, echeance: dans(etapes[etape + 1]) };
        }
        return sortir(reapprentissage ? base.intervalleJours : REGLAGES.intervalleSortieJours);
      case 'easy':
        return sortir(reapprentissage ? base.intervalleJours + 1 : REGLAGES.intervalleFacileJours);
    }
  }

  // ── Révision ──
  const intervalle = Math.max(1, base.intervalleJours);
  const retardJours = Math.max(0, Math.floor((maintenant.getTime() - new Date(base.echeance).getTime()) / JOUR));
  const facilite = base.facilite / 1000;

  if (note === 'again') {
    return {
      ...suivante,
      etat: 'reapprentissage',
      etape: 0,
      nbOublis: base.nbOublis + 1,
      facilite: Math.max(REGLAGES.faciliteMinimale, base.facilite - 200),
      // Intervalle repris à la sortie du réapprentissage (Anki : 0 % → 1 jour).
      intervalleJours: 1,
      echeance: dans(REGLAGES.etapesReapprentissageMin[0]),
    };
  }

  const difficile = borner(Math.max(intervalle + 1, intervalle * REGLAGES.multiplicateurDifficile));
  const bien = borner(Math.max(difficile + 1, (intervalle + retardJours / 2) * facilite));
  const facile = borner(Math.max(bien + 1, (intervalle + retardJours) * facilite * REGLAGES.bonusFacile));

  const jours = note === 'hard' ? difficile : note === 'good' ? bien : facile;
  const nouvelleFacilite =
    note === 'hard'
      ? Math.max(REGLAGES.faciliteMinimale, base.facilite - 150)
      : note === 'easy'
        ? base.facilite + 150
        : base.facilite;

  return {
    ...suivante,
    etat: 'revision',
    facilite: nouvelleFacilite,
    intervalleJours: jours,
    echeance: echeanceEnJours(maintenant, jours).toISOString(),
  };
}

/** Libellé court d'un délai, affiché sous chaque bouton (« 1 min », « 10 min », « 4 j »…). */
export function libelleDelai(depuis: Date, echeanceIso: string): string {
  const ms = Math.max(0, new Date(echeanceIso).getTime() - depuis.getTime());
  const minutes = Math.round(ms / MINUTE);
  if (minutes < 1) return '< 1 min';
  if (minutes < 60) return `${minutes} min`;
  const heures = minutes / 60;
  // Au-delà de 12 h, on raisonne en jours (une révision « demain » affiche « 1 j », comme Anki).
  if (heures < 12) return `${Math.round(heures)} h`;
  const jours = Math.max(1, Math.round(ms / JOUR));
  if (jours < 30) return `${jours} j`;
  if (jours < 365) return `${Math.round((jours / 30) * 10) / 10} mois`.replace('.', ',');
  return `${Math.round((jours / 365) * 10) / 10} an${jours >= 730 ? 's' : ''}`.replace('.', ',');
}

/** La carte est-elle due (révision : à partir du début de son jour ; apprentissage : à la minute près) ? */
export function estDue(carte: EtatCarte, maintenant: Date, avanceMin = 0): boolean {
  return new Date(carte.echeance).getTime() <= maintenant.getTime() + avanceMin * MINUTE;
}
