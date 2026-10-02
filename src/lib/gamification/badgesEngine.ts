import { ALL_BADGES, UserBadgeProgress } from './badgesData';
import { Profile } from '@/lib/supabase/types';

export interface BadgeEvaluationContext {
  profile: Profile | null;
  savedWordsCount?: number;
  completedContentsMap?: Record<string, { isCompleted: boolean; isFavorite: boolean }>;
  isStreakFreezeActive?: boolean;
}

export function evaluateUserBadges(ctx: BadgeEvaluationContext): UserBadgeProgress[] {
  const { profile, savedWordsCount, completedContentsMap, isStreakFreezeActive } = ctx;

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
