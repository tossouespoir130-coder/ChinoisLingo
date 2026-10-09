import { estSerieReussieParRubrique } from '@/lib/exercices/configRubriques';
import { ALL_BADGES, UserBadgeProgress } from './badgesData';
import { Profile } from '@/lib/supabase/types';

export interface BadgeEvaluationContext {
  profile: Profile | null;
  savedWordsCount?: number;
  completedContentsMap?: Record<string, { isCompleted: boolean; isFavorite: boolean }>;
  exerciseResultsMap?: Record<string, { score: number; totalQuestions: number; percentage: number; bestScore: number }>;
  isStreakFreezeActive?: boolean;
}

export function evaluateUserBadges(ctx: BadgeEvaluationContext): UserBadgeProgress[] {
  const { profile, savedWordsCount, completedContentsMap, exerciseResultsMap, isStreakFreezeActive } = ctx;

  const totalWords = savedWordsCount ?? (profile?.total_words_mastered || 0);
  const streakDays = Math.max(profile?.streak_days || 0, profile?.max_streak || 0);
  const totalMinutes = profile?.total_minutes_learned || 0;

  // Calcul du nombre de contenus complétés par type
  let completedCount = 0;
  let completedSongs = 0;
  let completedStories = 0;

  if (completedContentsMap) {
    Object.entries(completedContentsMap).forEach(([id, val]) => {
      if (val.isCompleted) {
        completedCount++;
        if (
          id.includes('chanson') ||
          id.startsWith('song_') ||
          id.includes('haoxiangni') ||
          id.includes('shaonian') ||
          id.includes('women_buyiyang') ||
          id.includes('tonghua') ||
          id.includes('yueliang') ||
          id.includes('pengyou') ||
          id.includes('chengdu') ||
          id.includes('duanqiao') ||
          id.includes('nanshuo')
        ) {
          completedSongs++;
        }
        if (
          id.includes('ep') ||
          id.includes('histoire') ||
          id.includes('article') ||
          id.includes('chat') ||
          id.includes('xiaobai')
        ) {
          completedStories++;
        }
      }
    });
  }

  // Calcul des exercices réussis (selon seuil de la rubrique) et parfaits (100% / score égal au total de questions)
  let completedExercises = 0;
  let perfectExercises = 0;
  let passedExercises = 0;

  if (exerciseResultsMap) {
    Object.values(exerciseResultsMap).forEach((r) => {
      completedExercises++;
      const best = r.bestScore ?? r.score;
      if (estSerieReussieParRubrique(best, r.totalQuestions)) passedExercises++;
      if (best === r.totalQuestions || r.percentage === 100) perfectExercises++;
    });
  }

  return ALL_BADGES.map((badge) => {
    let current = 0;

    switch (badge.id) {
      // ⏱️ Temps d'étude & Business
      case 'study_time_30m':
      case 'study_time_2h':
      case 'study_time_5h':
      case 'study_time_10h':
      case 'study_time_25h':
      case 'study_time_50h':
      case 'study_time_100h':
      case 'business_starter':
      case 'business_trade_practice':
      case 'business_negotiation_mastery':
      case 'business_china_expertise':
        current = Math.min(totalMinutes, badge.maxProgress);
        break;

      // 🔥 Séries
      case 'streak_3_days':
      case 'streak_7_days':
      case 'streak_14_days':
      case 'streak_30_days':
      case 'streak_60_days':
      case 'streak_100_days':
      case 'streak_365_days':
        current = Math.min(streakDays, badge.maxProgress);
        break;

      // 📚 Vocabulaire
      case 'words_1':
      case 'words_25':
      case 'words_50':
      case 'words_100':
      case 'words_250':
      case 'words_500':
      case 'words_1000':
        current = Math.min(totalWords, badge.maxProgress);
        break;

      // 🎧 Immersion & Musique
      case 'first_immersion':
        current = completedCount >= 1 ? 1 : 0;
        break;

      case 'music_lover':
        current = Math.min(completedSongs, badge.maxProgress);
        break;

      case 'avid_reader':
        current = Math.min(completedStories, badge.maxProgress);
        break;

      case 'auditor_30':
      case 'auditor_60':
      case 'immersion_master_100':
        current = Math.min(completedCount, badge.maxProgress);
        break;

      // ❄️ Protection
      case 'streak_freeze_guardian':
        current = isStreakFreezeActive !== false ? 1 : 0;
        break;

      // 🎧 Exercices & Écoute HSK
      case 'hsk_exercise_first':
        current = completedExercises >= 1 ? 1 : 0;
        break;
      case 'hsk_exercise_perfect':
        current = perfectExercises >= 1 ? 1 : 0;
        break;
      case 'hsk_exercise_5_series':
        current = Math.min(passedExercises, 5);
        break;
      case 'hsk_exercise_15_series':
        current = Math.min(passedExercises, 15);
        break;
      case 'hsk_exercise_30_series':
        current = Math.min(passedExercises, 30);
        break;

      default:
        current = 0;
    }

    const isUnlocked = current >= badge.maxProgress;
    const progressPercent = Math.min(100, Math.round((current / badge.maxProgress) * 100));

    return {
      ...badge,
      isUnlocked,
      currentProgress: current,
      progressPercent,
    };
  });
}

/**
 * Identifie le prochain défi le plus proche d'être débloqué par l'apprenant.
 */
export function findNextChallengeBadge(evaluatedBadges: UserBadgeProgress[]): UserBadgeProgress | null {
  const locked = evaluatedBadges.filter((b) => !b.isUnlocked);
  if (locked.length === 0) return null;

  // Trier par progression décroissante, puis par étape la plus proche
  locked.sort((a, b) => {
    if (b.progressPercent !== a.progressPercent) {
      return b.progressPercent - a.progressPercent;
    }
    return a.stepInTrack - b.stepInTrack;
  });

  return locked[0];
}

/**
 * Formate un texte d'encouragement dynamique pour le prochain défi.
 */
export function getNextChallengeRemainingText(badge: UserBadgeProgress): string {
  const remaining = Math.max(0, badge.maxProgress - badge.currentProgress);

  if (badge.targetUnit === 'minutes') {
    if (remaining >= 60) {
      const h = Math.floor(remaining / 60);
      const m = remaining % 60;
      return m > 0 ? `Plus que ${h}h ${m}m d’étude` : `Plus que ${h}h d’étude`;
    }
    return `Plus que ${remaining} min d’étude`;
  }

  if (badge.targetUnit === 'jours') {
    return `Plus que ${remaining} ${remaining > 1 ? 'jours consécutifs' : 'jour'}`;
  }

  if (badge.targetUnit === 'mots') {
    return `Plus que ${remaining} ${remaining > 1 ? 'mots à maîtriser' : 'mot à maîtriser'}`;
  }

  return `Plus que ${remaining} ${remaining > 1 ? 'contenus à valider' : 'contenu à valider'}`;
}

/**
 * Calcule le rang et titre honorifique de l'apprenant selon ses points XP totaux.
 */
export function getLearnerRank(totalXp: number): { title: string; rankTier: string; icon: string; nextTarget: number } {
  if (totalXp < 500) return { title: 'Novice du Mandarin', rankTier: 'Rang I', icon: '🌱', nextTarget: 500 };
  if (totalXp < 2000) return { title: 'Voyageur Intrépide', rankTier: 'Rang II', icon: '🚀', nextTarget: 2000 };
  if (totalXp < 5000) return { title: 'Praticien Assidu', rankTier: 'Rang III', icon: '⚡', nextTarget: 5000 };
  if (totalXp < 10000) return { title: 'Polyglotte des Affaires', rankTier: 'Rang IV', icon: '💎', nextTarget: 10000 };
  return { title: 'Grand Maître ChinoisLingo', rankTier: 'Rang V', icon: '👑', nextTarget: 25000 };
}


