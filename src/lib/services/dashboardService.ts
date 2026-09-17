import { createClient } from '@/lib/supabase/client';
import { fetchUserSavedWords } from './vocabularyService';
import { fetchContentProgress, fetchCourseProgress } from './progressService';
import { fetchUserProfile } from './profileService';
import { getLocalRecentActivities, resolveContentDetails } from './activityTrackingService';

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
      studyTimeMinutes: number;
      studyTimeHours?: number;
    }>;
    month: Array<{
      label: string;
      masteredWords: number;
      studyTimeMinutes: number;
      studyTimeHours?: number;
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

  // Recent Real Activities (No generic fallback text)
  let recentActivities: RealDashboardStats['recentActivities'] = [];

  const completedLessonKeys = Object.keys(courseProgress).filter((k) => courseProgress[k]);
  const completedContentKeys = Object.keys(contentProgress).filter((k) => contentProgress[k]?.isCompleted);

  // 1. Priorité absolue aux activités récemment ouvertes ou étudiées localement
  const localActivities = getLocalRecentActivities();
  const seenIds = new Set<string>();

  localActivities.forEach((act) => {
    if (!seenIds.has(act.id)) {
      seenIds.add(act.id);
      recentActivities.push({
        ...act,
        isCompleted: !!act.isCompleted,
      });
    }
  });

  // 2. Compléter avec les leçons et contenus complétés en base de données avec leurs VRAIS titres résolus
  if (recentActivities.length < 3) {
    completedLessonKeys.forEach((lessonId) => {
      if (recentActivities.length >= 3 || seenIds.has(lessonId)) return;
      seenIds.add(lessonId);
      const resolved = resolveContentDetails(lessonId);
      if (resolved) {
        recentActivities.push({
          id: `course-${lessonId}`,
          title: resolved.title || 'Formation Vidéo',
          category: 'Formation',
          categoryBadge: resolved.categoryBadge || 'FORMATION VIDÉO',
          hskLevel: resolved.hskLevel || 'Tous Niveaux',
          progressPercentage: 100,
          duration: resolved.duration || '15 min',
          thumbnailUrl: resolved.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
          href: resolved.href || `/formation?lesson=${lessonId}`,
          isCompleted: true,
        });
      }
    });

    completedContentKeys.forEach((contentId) => {
      if (recentActivities.length >= 3 || seenIds.has(contentId)) return;
      seenIds.add(contentId);
      const resolved = resolveContentDetails(contentId);
      if (resolved) {
        recentActivities.push({
          id: `content-${contentId}`,
          title: resolved.title || 'Session d’Immersion',
          category: resolved.category || 'Chanson',
          categoryBadge: resolved.categoryBadge || 'IMMERSION',
          hskLevel: resolved.hskLevel || 'HSK 1',
          progressPercentage: 100,
          duration: resolved.duration || '5 min',
          thumbnailUrl: resolved.thumbnailUrl || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&auto=format&fit=crop&q=80',
          href: resolved.href || `/ecoute-lecture?id=${contentId}`,
          isCompleted: true,
        });
      }
    });
  }

  // 3. Fallback élégant si le compte est 100% neuf sans aucune activité
  if (recentActivities.length === 0) {
    recentActivities.push(
      {
        id: 'chanson_star',
        title: 'L’Étoile la Plus Brillante (夜空中最亮的星)',
        category: 'Chanson',
        categoryBadge: 'CHANSON IMMERSIVE',
        hskLevel: 'HSK 3',
        progressPercentage: 60,
        duration: '4 min 12',
        thumbnailUrl: 'https://img.youtube.com/vi/-uzuhqQIaTM/hqdefault.jpg',
        href: '/ecoute-lecture?type=chansons&id=chanson_star',
        isCompleted: false,
      },
      {
        id: 'dialogue_restaurant',
        title: 'Commander au Restaurant (在饭馆点菜)',
        category: 'Dialogue',
        categoryBadge: 'ORAL & IMMERSION',
        hskLevel: 'HSK 2',
        progressPercentage: 35,
        duration: '4 min',
        thumbnailUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80',
        href: '/ecoute-lecture?type=dialogues&id=dialogue_restaurant',
        isCompleted: false,
      },
      {
        id: 'prononciation-tons',
        title: 'Les 4 Tons du Mandarin',
        category: 'Formation',
        categoryBadge: 'FORMATION VIDÉO',
        hskLevel: 'Débutant',
        progressPercentage: 35,
        duration: '18 min',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
        href: '/formation?course=prononciation-tons',
        isCompleted: false,
      }
    );
  }

  // Limiter à 3 éléments maximum pour la carte Continuer
  recentActivities = recentActivities.slice(0, 3);

  /**
   * Courbes construites depuis `daily_activity` + minutes locales temps réel.
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

  // Intégrer les minutes trackées localement pour aujourd'hui et hier si non encore synchronisées
  if (typeof window !== 'undefined') {
    const todayStr = cle(new Date());
    const localTodayMin = Number(localStorage.getItem(`chinoislingo_study_min_${todayStr}`) || '0');
    if (localTodayMin > 0) {
      const existing = parJour.get(todayStr);
      parJour.set(todayStr, {
        minutes: Math.max(existing?.minutes ?? 0, localTodayMin),
        mots: existing?.mots ?? 0,
      });
    }
  }

  // Les 7 derniers jours, du plus ancien au plus récent
  const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  let totalCalculatedMinutes = 0;

  const weekChart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayKey = cle(d);
    const e = parJour.get(dayKey);
    let minutes = Math.round(e?.minutes ?? 0);

    // Vérification locale pour le jour si présent dans localStorage
    if (typeof window !== 'undefined') {
      const localMin = Number(localStorage.getItem(`chinoislingo_study_min_${dayKey}`) || '0');
      if (localMin > minutes) minutes = localMin;
    }

    totalCalculatedMinutes += minutes;

    return {
      label: JOURS[d.getDay()],
      masteredWords: e?.mots ?? 0,
      studyTimeMinutes: minutes,
      studyTimeHours: Number((minutes / 60).toFixed(1)),
    };
  });

  // Les 4 dernières semaines, cumulées depuis les mêmes lignes réelles
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
    const roundedMinutes = Math.round(minutes);
    return {
      label: `Sem ${i + 1}`,
      masteredWords: mots,
      studyTimeMinutes: roundedMinutes,
      studyTimeHours: Number((roundedMinutes / 60).toFixed(1)),
    };
  });

  const finalTotalMinutesLearned = Math.max(totalMinutesLearned, totalCalculatedMinutes);

  return {
    streakDays,
    totalMinutesLearned: finalTotalMinutesLearned,
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
