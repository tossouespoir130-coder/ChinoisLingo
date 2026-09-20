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

/** Identifiants des histoires ouvertes au palier gratuit : séries (« Mon chat », « Vie en Chine : Business ») + 2 histoires individuelles */
export const HISTOIRES_GRATUITES_IDS = [
  'series_mon_chat',
  'series_vie_chine_business',
  'histoire_journee_wang_ming',
  'histoire_chat_li_yue',
];

/** Nombre maximum d'épisodes/parties accessibles par série au palier gratuit */
export const EPISODES_GRATUITS_SERIE_MAX = 3;

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
 * Pour les histoires : 1 série (« Mon chat ») et 2 histoires individuelles.
 * Pour les autres rubriques : les N premiers contenus par ordre HSK croissant.
 */
export function contenuAccessible(
  type: string,
  rang: number,
  accesComplet: boolean,
  itemId?: string
): boolean {
  if (accesComplet) return true;
  if (type === 'histoires' && itemId) {
    return HISTOIRES_GRATUITES_IDS.includes(itemId);
  }
  const quota = QUOTA_GRATUIT[type as ContentTypeAcces];
  return quota !== undefined && rang < quota;
}

/** Un épisode / partie d'une série est-il accessible ? */
export function episodeAccessible(
  episodeIndex: number,
  accesComplet: boolean
): boolean {
  if (accesComplet) return true;
  return episodeIndex < EPISODES_GRATUITS_SERIE_MAX;
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
    `${QUOTA_GRATUIT.chansons} chansons, ${QUOTA_GRATUIT.dialogues} dialogues, ${QUOTA_GRATUIT.articles} articles et la série Mon chat (3 parties) + 2 histoires`,
    'Le vocabulaire HSK 1 en entier',
    `${FORMATIONS_GRATUITES.length} formations pour débuter`,
  ];
}
