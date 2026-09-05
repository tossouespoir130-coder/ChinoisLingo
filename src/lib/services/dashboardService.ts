import { createClient } from '@/lib/supabase/client';
import { fetchUserSavedWords } from './vocabularyService';
import { fetchContentProgress, fetchCourseProgress } from './progressService';
import { fetchUserProfile } from './profileService';

export interface RealDashboardStats {
  streakDays: number;
  totalMinutesLearned: number;
  totalWordsMastered: number;
  totalSavedWords: number;
  completedLessonsCount: number;
  completedMediaCount: number;
  hskProgress: {
    hsk1: { total: number; mastered: number; percentage: number };
    hsk2: { total: number; mastered: number; percentage: number };
    hsk3: { total: number; mastered: number; percentage: number };
    hsk4: { total: number; mastered: number; percentage: number };
    hsk5: { total: number; mastered: number; percentage: number };
    hsk6: { total: number; mastered: number; percentage: number };
  };
  recentActivities: Array<{
    id: string;
    title: string;
    category: string;
    categoryBadge: string;
    hskLevel: string;
    progressPercentage: number;
    duration: string;
    thumbnailUrl: string;
    href: string;
    isCompleted: boolean;
  }>;
  chartData: {
    week: Array<{
      label: string;
      masteredWords: number;
      studyTimeHours: number;
    }>;
    month: Array<{
      label: string;
      masteredWords: number;
      studyTimeHours: number;
    }>;
  };
}

const HSK_TOTALS = {
  hsk1: 150,
  hsk2: 150,
  hsk3: 300,
  hsk4: 600,
  hsk5: 1300,
  hsk6: 2500,
};

export async function fetchRealDashboardStats(): Promise<RealDashboardStats> {
  const [profile, savedWords, contentProgress, courseProgress] = await Promise.all([
    fetchUserProfile(),
    fetchUserSavedWords(),
    fetchContentProgress(),
    fetchCourseProgress(),
  ]);

  const streakDays = profile?.streak_days || 1;
  const totalMinutesLearned = profile?.total_minutes_learned || 15;
  const totalSavedWords = savedWords.length;
  const masteredWordsList = savedWords.filter((w) => (w.mastery_level || 0) >= 3);
  const totalWordsMastered = Math.max(profile?.total_words_mastered || 0, masteredWordsList.length);

  // Calculate real HSK progression
  const hskCounts = {
    hsk1: 0,
    hsk2: 0,
    hsk3: 0,
    hsk4: 0,
    hsk5: 0,
    hsk6: 0,
  };

  savedWords.forEach((w) => {
    const lvl = (w as any).hsk_level?.toLowerCase() || 'hsk1';
    if (lvl in hskCounts) {
      hskCounts[lvl as keyof typeof hskCounts]++;
    } else {
      hskCounts.hsk1++;
    }
  });

  const hskProgress = {
    hsk1: {
      total: HSK_TOTALS.hsk1,
      mastered: hskCounts.hsk1,
      percentage: Math.min(100, Math.round((hskCounts.hsk1 / HSK_TOTALS.hsk1) * 100)),
    },
    hsk2: {
      total: HSK_TOTALS.hsk2,
      mastered: hskCounts.hsk2,
      percentage: Math.min(100, Math.round((hskCounts.hsk2 / HSK_TOTALS.hsk2) * 100)),
    },
    hsk3: {
      total: HSK_TOTALS.hsk3,
      mastered: hskCounts.hsk3,
      percentage: Math.min(100, Math.round((hskCounts.hsk3 / HSK_TOTALS.hsk3) * 100)),
    },
    hsk4: {
      total: HSK_TOTALS.hsk4,
      mastered: hskCounts.hsk4,
      percentage: Math.min(100, Math.round((hskCounts.hsk4 / HSK_TOTALS.hsk4) * 100)),
    },
    hsk5: {
      total: HSK_TOTALS.hsk5,
      mastered: hskCounts.hsk5,
      percentage: Math.min(100, Math.round((hskCounts.hsk5 / HSK_TOTALS.hsk5) * 100)),
    },
    hsk6: {
      total: HSK_TOTALS.hsk6,
      mastered: hskCounts.hsk6,
      percentage: Math.min(100, Math.round((hskCounts.hsk6 / HSK_TOTALS.hsk6) * 100)),
    },
  };

  // Recent Real Activities
  const recentActivities: RealDashboardStats['recentActivities'] = [];

  const completedLessonKeys = Object.keys(courseProgress).filter((k) => courseProgress[k]);
  const completedContentKeys = Object.keys(contentProgress).filter((k) => contentProgress[k]?.isCompleted);

  // If user has real activities in database
  if (completedLessonKeys.length > 0 || completedContentKeys.length > 0) {
    completedLessonKeys.slice(0, 2).forEach((lessonId) => {
      recentActivities.push({
        id: `course-${lessonId}`,
        title: `Formation Vidéo`,
        category: 'Formation',
        categoryBadge: 'FORMATION VIDÉO',
        hskLevel: 'Tous Niveaux',
        progressPercentage: 100,
        duration: '15 min',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
        href: `/formation?lesson=${lessonId}`,
        isCompleted: true,
      });
    });

    completedContentKeys.slice(0, 2).forEach((contentId) => {
      let targetType = 'chansons';
      if (contentId.startsWith('dialogue_')) targetType = 'dialogues';
      else if (contentId.startsWith('article_')) targetType = 'articles';
      else if (contentId.startsWith('histoire_')) targetType = 'histoires';
      else if (contentId.startsWith('podcast_')) targetType = 'podcasts';

      recentActivities.push({
        id: `content-${contentId}`,
        title: `Ressource Écoute & Lecture`,
        category: targetType === 'chansons' ? 'Chanson' : targetType === 'dialogues' ? 'Dialogue' : 'Article',
        categoryBadge: 'IMMERSION',
        hskLevel: 'HSK 1',
        progressPercentage: 100,
        duration: '5 min',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&auto=format&fit=crop&q=80',
        href: `/ecoute-lecture?type=${targetType}&id=${contentId}`,
        isCompleted: true,
      });
    });
  }

  // Fallback defaults for new users
  if (recentActivities.length === 0) {
    recentActivities.push(
      {
        id: 'default-1',
        title: 'Masterclass : Les 4 Tons du Mandarin',
        category: 'Formation',
        categoryBadge: 'FORMATION VIDÉO',
        hskLevel: 'Débutant',
        progressPercentage: completedLessonKeys.length > 0 ? 100 : 35,
        duration: '18 min',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
        href: '/formation?course=prononciation-tons',
        isCompleted: completedLessonKeys.length > 0,
      },
      {
        id: 'default-2',
        title: 'Chanson : L’Étoile la Plus Brillante',
        category: 'Chanson',
        categoryBadge: 'CHANSON IMMERSIVE',
        hskLevel: 'HSK 3',
        progressPercentage: completedContentKeys.length > 0 ? 100 : 60,
        duration: '4 min',
        thumbnailUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&auto=format&fit=crop&q=80',
        href: '/ecoute-lecture?type=chansons&id=chanson_star',
        isCompleted: completedContentKeys.length > 0,
      },
      {
        id: 'default-3',
        title: 'Dialogue : Commander au Restaurant',
        category: 'Dialogue',
        categoryBadge: 'ORAL & IMMERSION',
        hskLevel: 'HSK 1',
        progressPercentage: 10,
        duration: '6 min',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80',
        href: '/ecoute-lecture?type=dialogues&id=dialogue_restaurant',
        isCompleted: false,
      }
    );
  }

  /**
   * Courbes construites depuis `daily_activity`, l'historique REEL.
   *
   * L'ancienne version repartissait le total de minutes sur les jours de la
   * semaine et inventait un taux de retention (85 + fraction x 10) : la courbe
   * paraissait credible mais ne mesurait rien. Un compte neuf affiche
   * desormais une courbe vide, qui se remplit au fil de l'usage.
   */
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: historique } = user
    ? await supabase
        .from('daily_activity')
        .select('jour, minutes, mots_maitrises')
        .eq('user_id', user.id)
        .order('jour', { ascending: true })
        .limit(400)
    : { data: [] };

  const parJour = new Map<string, { minutes: number; mots: number }>();
  (historique ?? []).forEach((l: { jour: string; minutes: number | null; mots_maitrises: number | null }) => {
    parJour.set(l.jour, { minutes: l.minutes ?? 0, mots: l.mots_maitrises ?? 0 });
  });

  const cle = (d: Date) => d.toISOString().split('T')[0];

  // Les 7 derniers jours, du plus ancien au plus recent.
  const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const weekChart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const e = parJour.get(cle(d));
    return {
      label: JOURS[d.getDay()],
      masteredWords: e?.mots ?? 0,
      studyTimeHours: Number(((e?.minutes ?? 0) / 60).toFixed(1)),
    };
  });

  // Les 4 dernieres semaines, cumulees depuis les memes lignes reelles.
  const monthChart = Array.from({ length: 4 }, (_, i) => {
    const fin = new Date();
    fin.setDate(fin.getDate() - (3 - i) * 7);
    const debut = new Date(fin);
    debut.setDate(debut.getDate() - 6);

    let minutes = 0;
    let mots = 0;
    for (let d = new Date(debut); d <= fin; d.setDate(d.getDate() + 1)) {
      const e = parJour.get(cle(d));
      if (e) {
        minutes += e.minutes;
        mots = Math.max(mots, e.mots);
      }
    }
    return {
      label: `Sem ${i + 1}`,
      masteredWords: mots,
      studyTimeHours: Number((minutes / 60).toFixed(1)),
    };
  });

  return {
    streakDays,
    totalMinutesLearned,
    totalWordsMastered,
    totalSavedWords,
    completedLessonsCount: completedLessonKeys.length,
    completedMediaCount: completedContentKeys.length,
    hskProgress,
    recentActivities,
    chartData: {
      week: weekChart,
      month: monthChart,
    },
  };
}
