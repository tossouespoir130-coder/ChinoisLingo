export type ExerciseRubriqueId = 'true_false' | 'matching' | 'dialogue_questions';

/**
 * Nombre de séries gratuites offertes par rubrique et par niveau.
 * Source de vérité unique pour les exercices HSK.
 * Modifiable directement ici pour ajuster la politique freemium globale.
 */
export const SERIES_GRATUITES_PAR_RUBRIQUE = 3;

export interface RubriqueConfig {
  id: ExerciseRubriqueId;
  nom: string;
  nomZh: string;
  description: string;
  questionsParSerie: number;
  seuilReussite: number; // Nombre de points requis (ex. 4 sur 5, 2 sur 3)
  seriesGratuites: number; // Nombre de séries gratuites par niveau (ex: 3)
  niveauxDisponibles: string[]; // ex: ['HSK 1', 'HSK 2']
  iconName: 'HelpCircle' | 'Image' | 'Headphones';
  imageUrl?: string;
  badgeColor: string;
}

export const CONFIG_RUBRIQUES: Record<ExerciseRubriqueId, RubriqueConfig> = {
  true_false: {
    id: 'true_false',
    nom: 'Vrai ou Faux ?',
    nomZh: '听力判断',
    description: 'Une image et un mot ou phrase entendus : déterminez si l’illustration correspond.',
    questionsParSerie: 5,
    seuilReussite: 4, // 4 bonnes réponses sur 5 requises
    seriesGratuites: SERIES_GRATUITES_PAR_RUBRIQUE,
    niveauxDisponibles: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'],
    iconName: 'HelpCircle',
    imageUrl: '/images/exercices/rubriques/rubrique_vrai_faux.png',
    badgeColor: '#00BFA5',
  },
  matching: {
    id: 'matching',
    nom: 'Images & Dialogues',
    nomZh: '听力配对',
    description: 'Associez 3 dialogues courts à 3 illustrations distinctes (1 point si les 3 sont justes).',
    questionsParSerie: 3,
    seuilReussite: 2, // 2 bonnes réponses sur 3 requises
    seriesGratuites: SERIES_GRATUITES_PAR_RUBRIQUE,
    niveauxDisponibles: ['HSK 1', 'HSK 2'],
    iconName: 'Image',
    imageUrl: '/images/exercices/rubriques/rubrique_matching.png',
    badgeColor: '#6200EE',
  },
  dialogue_questions: {
    id: 'dialogue_questions',
    nom: 'Dialogues & Questions',
    nomZh: '对话理解',
    description: 'Dialogue ou monologue sans image, une question ciblée et 3 choix (A, B, C).',
    questionsParSerie: 3,
    seuilReussite: 2, // 2 bonnes réponses sur 3 requises
    seriesGratuites: SERIES_GRATUITES_PAR_RUBRIQUE,
    niveauxDisponibles: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6'],
    iconName: 'Headphones',
    imageUrl: '/images/exercices/rubriques/rubrique_dialogue_questions.png',
    badgeColor: '#0288D1',
  },
};

/**
 * Détermine si une série est gratuite en fonction de son ordre fixe dans la rubrique (orderInRubrique).
 * Les `seriesGratuites` premières séries (ordre 1, 2, 3...) sont gratuites.
 */
export function estSerieGratuite(orderInRubrique: number, rubriqueId?: ExerciseRubriqueId): boolean {
  const limite = rubriqueId && CONFIG_RUBRIQUES[rubriqueId]
    ? CONFIG_RUBRIQUES[rubriqueId].seriesGratuites
    : SERIES_GRATUITES_PAR_RUBRIQUE;
  return orderInRubrique >= 1 && orderInRubrique <= limite;
}

/**
 * Détermine si une série est réussie en comparant le score au nombre de points requis.
 * Utilise la configuration de la rubrique si connue, ou se base sur le total de questions.
 */
export function estSerieReussieParRubrique(
  score: number,
  totalQuestions: number,
  rubriqueId?: ExerciseRubriqueId | string
): boolean {
  if (totalQuestions <= 0) return false;
  if (rubriqueId && CONFIG_RUBRIQUES[rubriqueId as ExerciseRubriqueId]) {
    const config = CONFIG_RUBRIQUES[rubriqueId as ExerciseRubriqueId];
    return score >= config.seuilReussite;
  }
  // Règle par défaut proportionnelle : 5 questions -> 4, 3 questions -> 2
  if (totalQuestions === 5) return score >= 4;
  if (totalQuestions === 3) return score >= 2;
  return score * 3 >= totalQuestions * 2;
}

/**
 * Détermine si le score est un score parfait.
 */
export function estScoreParfait(
  score: number,
  totalQuestions: number,
  rubriqueId?: ExerciseRubriqueId | string
): boolean {
  if (rubriqueId && CONFIG_RUBRIQUES[rubriqueId as ExerciseRubriqueId]) {
    return score === CONFIG_RUBRIQUES[rubriqueId as ExerciseRubriqueId].questionsParSerie;
  }
  return score === totalQuestions;
}
