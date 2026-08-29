import {
  UserProfile,
  UserStreak,
  WordOfTheDay,
  DashboardPerformanceData,
  CommunityLeaderboardEntry,
  RecentContentItem,
} from '../types';

export const mockCurrentUser: UserProfile = {
  id: 'usr_espoir_001',
  email: 'espoir@business-chine.com',
  display_name: 'Espoir Chinois',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  timezone: 'Africa/Lome',
  leaderboard_opt_in: true,
  pinyin_visible: true,
  translation_visible: true,
  created_at: '2026-01-15T00:00:00Z',
};

export const mockUserStreak: UserStreak = {
  current: 18,
  best: 34,
  lastActivityDate: new Date().toISOString().split('T')[0],
  history: [
    { dayLabel: 'Lun', fullDay: 'Lundi', date: '2026-08-20', active: true, count: 4 },
    { dayLabel: 'Mar', fullDay: 'Mardi', date: '2026-08-21', active: true, count: 6 },
    { dayLabel: 'Mer', fullDay: 'Mercredi', date: '2026-08-22', active: true, count: 3 },
    { dayLabel: 'Jeu', fullDay: 'Jeudi', date: '2026-08-23', active: true, count: 5 },
    { dayLabel: 'Ven', fullDay: 'Vendredi', date: '2026-08-24', active: true, count: 8 },
    { dayLabel: 'Sam', fullDay: 'Samedi', date: '2026-08-25', active: true, count: 7 },
    { dayLabel: 'Dim', fullDay: 'Dimanche', date: '2026-08-26', active: true, count: 2 },
  ],
};

import { getDailyWord } from './dailyWords';
export { getDailyWord, dailyWordsCatalog } from './dailyWords';

export const mockWordOfTheDay: WordOfTheDay = getDailyWord();

export const mockPerformanceData: Record<'week' | 'month' | 'year', DashboardPerformanceData> = {
  week: {
    timeframe: 'week',
    overallScore: 88,
    scoreChange: '+18%',
    recentLessonsCount: 14,
    chartData: [
      { label: 'Lun', masteredWords: 422, studyTimeHours: 1.2, retentionRate: 89.5 },
      { label: 'Mar', masteredWords: 426, studyTimeHours: 1.8, retentionRate: 90.2 },
      { label: 'Mer', masteredWords: 430, studyTimeHours: 1.5, retentionRate: 91.0 },
      { label: 'Jeu', masteredWords: 434, studyTimeHours: 2.1, retentionRate: 91.5 },
      { label: 'Ven', masteredWords: 438, studyTimeHours: 2.4, retentionRate: 91.8 },
      { label: 'Sam', masteredWords: 440, studyTimeHours: 2.8, retentionRate: 92.2 },
      { label: 'Dim', masteredWords: 440, studyTimeHours: 1.6, retentionRate: 92.4 },
    ],
  },
  month: {
    timeframe: 'month',
    overallScore: 92,
    scoreChange: '+24%',
    recentLessonsCount: 42,
    chartData: [
      { label: 'Jan', masteredWords: 110, studyTimeHours: 12, retentionRate: 72.0 },
      { label: 'Fév', masteredWords: 165, studyTimeHours: 18, retentionRate: 78.5 },
      { label: 'Mar', masteredWords: 210, studyTimeHours: 22, retentionRate: 81.0 },
      { label: 'Avr', masteredWords: 280, studyTimeHours: 29, retentionRate: 84.5 },
      { label: 'Mai', masteredWords: 330, studyTimeHours: 32, retentionRate: 87.0 },
      { label: 'Juin', masteredWords: 380, studyTimeHours: 36, retentionRate: 89.5 },
      { label: 'Juil', masteredWords: 415, studyTimeHours: 38, retentionRate: 91.2 },
      { label: 'Août', masteredWords: 440, studyTimeHours: 42, retentionRate: 92.4 },
    ],
  },
  year: {
    timeframe: 'year',
    overallScore: 94,
    scoreChange: '+36%',
    recentLessonsCount: 186,
    chartData: [
      { label: '2023', masteredWords: 60, studyTimeHours: 45, retentionRate: 65.0 },
      { label: '2024', masteredWords: 180, studyTimeHours: 140, retentionRate: 78.0 },
      { label: '2025', masteredWords: 320, studyTimeHours: 260, retentionRate: 86.0 },
      { label: '2026', masteredWords: 440, studyTimeHours: 380, retentionRate: 92.4 },
    ],
  },
};

export const mockLeaderboard: CommunityLeaderboardEntry[] = [
  {
    id: 'lead_1',
    display_name: 'Aminata Diallo',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    progress_pct: 94,
    streak_days: 42,
    words_mastered: 520,
    country_code: 'SN',
  },
  {
    id: 'lead_2',
    display_name: 'Espoir Chinois',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    progress_pct: 88,
    streak_days: 18,
    words_mastered: 440,
    country_code: 'TG',
    is_current_user: true,
  },
  {
    id: 'lead_3',
    display_name: 'Koffi Mensah',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    progress_pct: 76,
    streak_days: 12,
    words_mastered: 380,
    country_code: 'CI',
  },
  {
    id: 'lead_4',
    display_name: 'Fatou Traoré',
    avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    progress_pct: 65,
    streak_days: 9,
    words_mastered: 290,
    country_code: 'ML',
  },
];

export const mockRecentActivities: RecentContentItem[] = [
  {
    id: 'act_1',
    slug: 'podcast-claire-chine',
    title: 'Podcast HSK 1 : L’Histoire de Claire en Chine',
    subtitle: 'Épisode 2 : Claire à l’aéroport (9 leçons)',
    type: 'Formation',
    progressPct: 45,
    lastActivity: 'Aujourd’hui',
    infoBadge: 'Leçon 2 / 9',
    linkHref: '/formation?course=course_claire_hsk1&lesson=claire_ep2',
  },
  {
    id: 'act_2',
    slug: 'chanson-dans-mon-chant',
    title: 'Dans Mon Chant (我的歌声里)',
    subtitle: 'Wanting Qu • Pop au piano [HSK 3]',
    type: 'Chanson',
    progressPct: 80,
    lastActivity: 'Aujourd’hui',
    infoBadge: 'Paroles & Vidéo',
    linkHref: '/ecoute-lecture?id=chanson_wode_geshengli',
  },
  {
    id: 'act_3',
    slug: 'chanson-lueurs-monde',
    title: 'Les Lueurs de ce Monde (人间烟火)',
    subtitle: 'Cheng Xiang • Poésie du Jiangnan [HSK 3]',
    type: 'Chanson',
    progressPct: 100,
    lastActivity: 'Hier',
    infoBadge: '✓ Terminé',
    linkHref: '/ecoute-lecture?id=chanson_renjian_yanhuo',
  },
  {
    id: 'act_4',
    slug: 'article-apprendre-confiance',
    title: 'Apprendre le Chinois avec Confiance',
    subtitle: 'Espoir Chinois • Conseils & 4 tons [HSK 1]',
    type: 'Article',
    progressPct: 100,
    lastActivity: 'Hier',
    infoBadge: '✓ Terminé',
    linkHref: '/ecoute-lecture?id=article_podcast_1',
  },
  {
    id: 'act_5',
    slug: 'dialogue-negociation-pro',
    title: 'Négociation & Prix en Chine',
    subtitle: 'Dialogue Katia & Espoir Chinois [HSK 2]',
    type: 'Dialogue',
    progressPct: 60,
    lastActivity: 'Il y a 2 jours',
    infoBadge: 'Bilingue audio',
    linkHref: '/ecoute-lecture?id=dialogue_3',
  },
  {
    id: 'act_6',
    slug: 'livre-secrets-commerce-chine',
    title: 'Les Secrets du Commerce avec la Chine',
    subtitle: 'Guide complet import-export Afrique-Asie',
    type: 'Livre',
    progressPct: 35,
    lastActivity: 'Il y a 3 jours',
    infoBadge: 'Chapitre 3',
    linkHref: '/livres',
  },
];

