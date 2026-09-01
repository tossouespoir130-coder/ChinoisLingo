/**
 * Droits d'accès du palier gratuit — source de vérité unique.
 *
 * ChinoisLingo est en freemium permanent : après inscription, tout le monde
 * garde un accès gratuit illimité dans le temps, mais restreint en volume.
 * L'abonnement paie l'ouverture complète du catalogue.
 *
 * Ajouter du contenu ne demande AUCUNE retouche ici : les quotas s'appliquent
 * par rang dans chaque rubrique. Le 4ᵉ article ajouté sera automatiquement
 * réservé aux abonnés.
 */

import { ContentTypeAcces } from './types-acces';

/**
 * Nombre de contenus offerts par rubrique d'Écoute & Lecture.
 * 0 = rubrique entièrement réservée aux abonnés.
 */
export const QUOTA_GRATUIT: Record<ContentTypeAcces, number> = {
  chansons: 3,
  articles: 3,
  histoires: 3,
  dialogues: 3,
  podcasts: 0,
  videos: 0,
};

/** Formations ouvertes au palier gratuit, par identifiant de cours. */
export const FORMATIONS_GRATUITES = [
  'course_initiation_5_cours',   // Initiation au Chinois en 5 Vidéos
  'course_claire_hsk1',          // Podcast HSK 1 : L'Histoire de Claire en Chine
  'course_30_phrases',           // 30 Phrases Indispensables pour Débuter en Chinois
];

/** Niveaux de vocabulaire ouverts au palier gratuit. */
export const NIVEAUX_GRATUITS = ['HSK 1'];

// ─────────────────────────────────────────────────────────────────────────
// Règles d'accès
// ─────────────────────────────────────────────────────────────────────────

/**
 * Un contenu d'Écoute & Lecture est-il accessible ?
 *
 * `accesComplet` vient de `EtatAbonnement.accesComplet` : il est vrai pour un
 * abonné ET pour un administrateur. Ne jamais lui passer `estAbonne`, qui
 * ignorerait le rôle.
 *
 * `rang` est la position (à partir de 0) du contenu DANS SA RUBRIQUE, telle
 * qu'elle est affichée — c'est-à-dire après le tri par niveau HSK croissant.
 * Les contenus offerts sont donc toujours les plus faciles.
 */
export function contenuAccessible(
  type: string,
  rang: number,
  accesComplet: boolean
): boolean {
  if (accesComplet) return true;
  const quota = QUOTA_GRATUIT[type as ContentTypeAcces];
  return quota !== undefined && rang < quota;
}

/** Une formation est-elle accessible ? */
export function formationAccessible(courseId: string, accesComplet: boolean): boolean {
  return accesComplet || FORMATIONS_GRATUITES.includes(courseId);
}

/** Un niveau de vocabulaire est-il accessible ? */
export function niveauAccessible(niveau: string, accesComplet: boolean): boolean {
  return accesComplet || NIVEAUX_GRATUITS.includes(niveau);
}

/**
 * Une rubrique entière est-elle fermée au palier gratuit ?
 * Sert à afficher un cadenas sur l'onglet plutôt que sur chaque carte.
 */
export function rubriqueFermee(type: string, accesComplet: boolean): boolean {
  if (accesComplet) return false;
  return QUOTA_GRATUIT[type as ContentTypeAcces] === 0;
}

/** Résumé lisible du palier gratuit, pour l'argumentaire commercial. */
export function resumeOffreGratuite(): string[] {
  return [
    `${QUOTA_GRATUIT.chansons} chansons, ${QUOTA_GRATUIT.dialogues} dialogues, ${QUOTA_GRATUIT.articles} articles et ${QUOTA_GRATUIT.histoires} histoires`,
    'Le vocabulaire HSK 1 en entier',
    `${FORMATIONS_GRATUITES.length} formations pour débuter`,
  ];
}
