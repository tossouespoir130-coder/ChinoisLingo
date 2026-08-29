export type Role = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  role: Role;
  timezone: string;
  leaderboard_opt_in: boolean;
  pinyin_visible: boolean;
  translation_visible: boolean;
  created_at: string;
}

export interface UserStreak {
  current: number;
  best: number;
  lastActivityDate: string;
  history: { dayLabel: string; fullDay: string; date: string; active: boolean; count: number }[];
}

export interface ExampleSentenceTier {
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  levelNumber: 1 | 2 | 3;
  hanzi: string;
  pinyin: string;
  french: string;
  contextNote: string;
}

export interface WordOfTheDay {
  id: string;
  hanzi: string;
  pinyin: string;
  french: string;
  category: string;
  businessContext: string;
  exampleSentences: ExampleSentenceTier[];
  audioUrl?: string;
}

export interface DashboardPerformanceData {
  timeframe: 'week' | 'month' | 'year';
  overallScore: number;
  scoreChange: string;
  recentLessonsCount: number;
  chartData: {
    label: string;
    masteredWords: number; // Mots maîtrisés (Barres - Axe de gauche)
    studyTimeHours: number; // Temps d'étude en heures (Barres - Axe de gauche)
    retentionRate: number;  // Taux de rétention % (Ligne superposée - Axe de droite)
    savedWords?: number;
    theory?: number;
    practice?: number;
    lexicon?: number;
  }[];
}

export interface CommunityLeaderboardEntry {
  id: string;
  display_name: string;
  avatar_url: string;
  progress_pct: number;
  streak_days: number;
  words_mastered: number;
  country_code?: string;
  is_current_user?: boolean;
}

export type RecentContentType = 'Formation' | 'Chanson' | 'Livre' | 'Dialogue' | 'Article' | 'Podcast' | 'Lecture';

export interface RecentContentItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  type: RecentContentType;
  progressPct: number;
  lastActivity: string;
  infoBadge: string;
  linkHref: string;
}

export interface AudioToken {
  hanzi: string;
  pinyin: string;
  startMs: number;
  endMs: number;
}

export interface AudioSentence {
  idx: number;
  hanzi: string;
  pinyin: string;
  fr: string;
  startMs: number;
  endMs: number;
  tokens: AudioToken[];
}

export interface ReadingEpisode {
  id: string;
  slug: string;
  title: string;
  summary: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Business Master';
  type: 'histoire' | 'dialogue' | 'article' | 'podcast';
  durationMinutes: number;
  coverImage: string;
  isFree: boolean;
  audioUrl: string;
  sentences: AudioSentence[];
  publishedAt: string;
}

export interface Flashcard {
  id: string;
  themeId: string;
  hanzi: string;
  pinyin: string;
  french: string;
  audioUrl?: string;
  exampleSentence?: {
    hanzi: string;
    pinyin: string;
    french: string;
  };
  srsLevel?: number;
  isKnown?: boolean;
}

export interface VocabTheme {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  cardCount: number;
  masteredCount: number;
  themeColor: 'rose' | 'lavender' | 'blue' | 'mint';
  isLocked: boolean;
}

export interface CatalogItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coverUrl: string;
  priceXOF: number;
  externalSalesUrl: string;
  badge?: string;
  author: string;
}
