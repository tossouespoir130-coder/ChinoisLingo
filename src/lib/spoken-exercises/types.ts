import { CombinatorySlot, CombinatoryOption } from '@/lib/combination/combinationEngine';

export interface SpokenWordToken {
  hanzi: string;
  pinyin: string;
  french: string;
  colorTheme?: 'purple' | 'emerald' | 'amber' | 'blue' | 'rose' | 'indigo' | 'teal';
  audioUrl?: string;
}

export interface FeaturedExampleSentence {
  id: string;
  hanzi: string;
  pinyin: string;
  french: string;
  slotSelections: Record<string, string>;
  audioUrl?: string;
}

export interface SpokenExerciseSubStep {
  id: string;
  subStepNumber: number;
  title: string;
  mobileSlotId: string;
  allowedOptionIds?: string[];
  pedagogicalText: string;
  didYouKnow?: {
    title: string;
    content: string;
  };
  tip?: string;
  featuredExamples: FeaturedExampleSentence[];
  otherOptions: CombinatoryOption[];
  otherOptionsTitle?: string;
}

export interface SpokenExerciseModel {
  id: string;
  level: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6';
  episodeNumber: number;
  titleFr: string; // Titre français uniquement sur la carte du catalogue
  imageUrl?: string; // Image d'illustration de la carte
  typicalSentence: {
    hanzi: string;
    pinyin: string;
    french: string;
    tokens: SpokenWordToken[];
    audioUrl?: string;
  };
  slots: CombinatorySlot[];
  frenchSentenceBuilder: (selected: CombinatoryOption[]) => string;
  punctuation?: {
    hanzi?: string;
    pinyin?: string;
  };
  structureInsight?: string;
  pedagogicalMethod: {
    title: string;
    corePrinciple: string;
    comparisonFr: string;
  };
  subSteps: SpokenExerciseSubStep[];
  finale: {
    title: string;
    pedagogicalText: string;
    totalExpectedCombinations: number;
  };
  miniChallenge: string;
  nextEpisode: {
    titleFr: string;
    teaser: string;
    isLocked: boolean;
  };
  rawNewWords: SpokenWordToken[]; // 生词
  isGratuit: boolean;
  isTest: boolean;
  datePublication?: string;
  // Combinaisons réelles autorisées (filtrage strict de cohérence sémantique dans la vraie vie)
  validCombinations?: Array<{
    id: string;
    slotSelections: Record<string, string>;
    hanzi: string;
    pinyin: string;
    french: string;
    audioUrl?: string;
  }>;
  // Association naturelle par défaut entre cases (ex: quand on choisit "café", la case verbe s'associe à "boire")
  pairedSlotDefaults?: Record<string, Record<string, Record<string, string>>>;
}
