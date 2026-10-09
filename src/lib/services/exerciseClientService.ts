import { createClient } from '@/lib/supabase/client';
import type { 
  ClientExerciseSet, 
  ClientExerciseQuestion, 
  ExerciseSeriesFormat, 
  ExerciseQuestionType,
  ServerDialogueLine,
  ServerMatchingImageItem,
  ServerMatchingDialogueItem
} from '@/lib/server/exercisesCorrection';

export type { ClientExerciseSet, ClientExerciseQuestion, ExerciseSeriesFormat, ExerciseQuestionType };

export interface StartExerciseResponse {
  attemptId: string;
  exercise: ClientExerciseSet;
}

export interface AnswerResponse {
  isCorrect: boolean;
  // Type 'choice'
  correctChoiceId?: string;
  dialogue?: ServerDialogueLine[];
  question?: { hanzi: string; pinyin: string; french: string };
  // Type 'true_false'
  correctValue?: boolean;
  audioText?: { hanzi: string; pinyin: string; french: string };
  imageContent?: { hanzi: string; pinyin: string; french: string };
  // Type 'matching_images'
  correctMatches?: Record<string, string>;
  images?: ServerMatchingImageItem[];
  dialogues?: Array<{ id: string; dialogue: ServerDialogueLine[] }>;
  // Commun
  explanationFr: string;
  keyVocabulary?: Array<{ hanzi: string; pinyin: string; french: string }>;
}

export interface FinishExerciseResponse {
  score: number;
  totalQuestions: number;
  percentage: number;
  bestScore: number;
  isSucceed: boolean;
  isNewBestScore: boolean;
  /** `false` pour une tentative locale (base indisponible) : résultat non enregistré. */
  enregistre?: boolean;
}

export interface ReviewMistakesResponse {
  exerciseId: string;
  totalErrors: number;
  reviewQuestions: Array<{
    id: string;
    orderNumber: number;
    type?: ExerciseQuestionType;
    audioUrl?: string;
    question?: {
      hanzi: string;
      pinyin: string;
      french: string;
    };
    choices?: Array<{ id: string; label: string; hanzi: string; pinyin?: string; french?: string }>;
    correctChoiceId?: string;
    dialogue?: ServerDialogueLine[];
    imageUrl?: string;
    imageAlt?: string;
    audioText?: { hanzi: string; pinyin: string; french: string };
    imageContent?: { hanzi: string; pinyin: string; french: string };
    correctValue?: boolean;
    images?: ServerMatchingImageItem[];
    dialogues?: ServerMatchingDialogueItem[];
    correctMatches?: Record<string, string>;
    explanationFr: string;
    keyVocabulary: Array<{ hanzi: string; pinyin: string; french: string }>;
    /** Réponse donnée par l'apprenant lors de la tentative. */
    votreReponse?: {
      selectedChoiceId: string | null;
      selectedBoolean: boolean | null;
      selectedMatches: Record<string, string> | null;
    };
  }>;
}

export interface UserExerciseResultItem {
  score: number;
  totalQuestions: number;
  percentage: number;
  bestScore: number;
  timeSpentSeconds: number;
  completedAt: string | null;
}

/**
 * Résultat d'un appel : comme les autres services, aucune exception n'est
 * levée — une erreur réseau ou serveur devient `{ ok: false, erreur }`.
 */
export type ResultatApi<T> = { ok: true; data: T } | { ok: false; erreur: string };

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || '';
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function appelerApi<T>(url: string, init: RequestInit, erreurParDefaut: string): Promise<ResultatApi<T>> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(url, { ...init, headers });
    const data = await res.json().catch(() => null);
    if (!res.ok || data === null) {
      return { ok: false, erreur: (data && typeof data.erreur === 'string' && data.erreur) || erreurParDefaut };
    }
    return { ok: true, data: data as T };
  } catch (err) {
    console.error(`Erreur réseau ${url} :`, err);
    return { ok: false, erreur: 'Connexion impossible. Vérifiez votre réseau et réessayez.' };
  }
}

export function demarrerExerciceApi(exerciseId: string): Promise<ResultatApi<StartExerciseResponse>> {
  return appelerApi(
    '/api/exercices/demarrer',
    { method: 'POST', body: JSON.stringify({ exerciseId }) },
    'Impossible de démarrer l’exercice.'
  );
}

export function repondreQuestionApi(
  attemptId: string,
  questionId: string,
  payload: {
    selectedChoiceId?: string;
    selectedBoolean?: boolean;
    selectedMatches?: Record<string, string>;
  }
): Promise<ResultatApi<AnswerResponse>> {
  return appelerApi(
    '/api/exercices/repondre',
    { method: 'POST', body: JSON.stringify({ attemptId, questionId, ...payload }) },
    'Impossible d’enregistrer la réponse.'
  );
}

/** `exerciseId` et `localScore` ne servent qu'aux tentatives locales (non enregistrées). */
export function terminerExerciceApi(
  attemptId: string,
  timeSpentSeconds: number,
  exerciseId: string,
  localScore: number
): Promise<ResultatApi<FinishExerciseResponse>> {
  return appelerApi(
    '/api/exercices/terminer',
    { method: 'POST', body: JSON.stringify({ attemptId, timeSpentSeconds, exerciseId, localScore }) },
    'Impossible de finaliser l’exercice.'
  );
}

/** Ferme une tentative quittée avant la fin (sans effet sur les scores). */
export async function abandonnerExerciceApi(attemptId: string): Promise<void> {
  await appelerApi('/api/exercices/abandonner', { method: 'POST', body: JSON.stringify({ attemptId }) }, '');
}

export function revoirErreursApi(exerciseId: string): Promise<ResultatApi<ReviewMistakesResponse>> {
  return appelerApi(
    '/api/exercices/revoir-erreurs',
    { method: 'POST', body: JSON.stringify({ exerciseId }) },
    'Impossible de charger le mode révision.'
  );
}

export async function fetchUserExerciseResultsApi(): Promise<Record<string, UserExerciseResultItem>> {
  const res = await appelerApi<{ resultats?: Record<string, UserExerciseResultItem> }>(
    '/api/exercices/resultats',
    { method: 'GET' },
    ''
  );
  return res.ok ? res.data.resultats || {} : {};
}

export async function fetchExercisesCatalogApi(): Promise<ClientExerciseSet[]> {
  const res = await appelerApi<{ catalog?: ClientExerciseSet[] }>('/api/exercices/catalogue', { method: 'GET' }, '');
  return res.ok ? res.data.catalog || [] : [];
}
