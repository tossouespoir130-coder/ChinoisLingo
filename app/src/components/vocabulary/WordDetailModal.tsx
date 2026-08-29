'use client';

import React, { useState } from 'react';
import { Portal } from '@/components/ui/Portal';
import {
  X,
  Volume2,
  Bookmark,
  Check,
  Sparkles,
  Info,
  Layers,
  BookOpen
} from 'lucide-react';
import { VocabularyWord } from '@/lib/mock/vocabulary';
import { HSKDictionaryEntry } from '@/lib/data/hskCompleteDictionary';
import { tatoebaCorpusByHanzi } from '@/lib/data/tatoebaCorpus';
import { getVerifiedTripleForWord } from '@/lib/data/hskSentencesDatabase';
import { usePreferences } from '@/context/PreferencesContext';

interface WordDetailModalProps {
  word: VocabularyWord | HSKDictionaryEntry | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (wordId: string) => void;
}

export interface DetailedExample {
  levelLabel: string;
  levelTier: 'Débutant' | 'Intermédiaire' | 'Avancé';
  levelNumber: 1 | 2 | 3;
  hanzi: string;
  pinyin: string;
  french: string;
  contextNote: string;
  source: 'tatoeba' | 'official_hsk' | 'corpus_verified';
}

/**
 * Calcule l'intitulé de niveau progressif en fonction du nombre total de phrases certifiées (jusqu'à 5).
 */
function getProgressiveLevelLabel(idx: number, total: number): string {
  if (total === 1) return 'Exemple Certifié';
  if (total === 2) return idx === 0 ? 'HSK 1–2 • Débutant' : 'HSK 4–6 • Avancé';
  if (total === 3) return idx === 0 ? 'HSK 1–2 • Débutant' : idx === 1 ? 'HSK 3–4 • Intermédiaire' : 'HSK 5–6 • Avancé';
  if (total === 4) return idx === 0 ? 'HSK 1 • Débutant' : idx === 1 ? 'HSK 2–3 • Élémentaire' : idx === 2 ? 'HSK 4 • Intermédiaire' : 'HSK 5–6 • Avancé';
  
  const labels = [
    'HSK 1 • Débutant',
    'HSK 2 • Élémentaire',
    'HSK 3 • Intermédiaire',
    'HSK 4 • Intermédiaire Sup.',
    'HSK 5–6 • Avancé & Business',
  ];
  return labels[idx] || `Niveau ${idx + 1}`;
}

/**
 * Récupère jusqu'à 5 phrases d'exemples progressives 100% validées et certifiées
 * ordonnées de la plus simple à la plus complexe (HSK 1 à HSK 5-6).
 * Règle stricte : si un mot n'a pas de phrase certifiée, retourne [] (zéro faux exemple).
 */
export function generateWordExamples(word: VocabularyWord | HSKDictionaryEntry): DetailedExample[] {
  const hz = word.hanzi;

  // 1. Si présent dans le corpus Tatoeba vérifié (jusqu'à 5 phrases ordonnées)
  if (tatoebaCorpusByHanzi[hz] && tatoebaCorpusByHanzi[hz].length > 0) {
    const items = tatoebaCorpusByHanzi[hz].slice(0, 5);
    return items.map((item, idx) => ({
      levelLabel: getProgressiveLevelLabel(idx, items.length),
      levelTier: item.levelTier,
      levelNumber: (idx + 1) as any,
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      french: item.french,
      contextNote: item.contextNote,
      source: 'tatoeba',
    }));
  }

  // 2. Base de données statique pré-compilée du projet (Tatoeba / hskhsk / BCC)
  const triple = getVerifiedTripleForWord(hz);
  if (triple) {
    const rawList: Array<{ hanzi: string; pinyin: string; french: string; contextNote: string; source: 'tatoeba' | 'official_hsk' | 'corpus_verified'; tier: 'Débutant' | 'Intermédiaire' | 'Avancé' }> = [];

    if (triple.beginner && triple.beginner.hanzi) {
      rawList.push({ ...triple.beginner, tier: 'Débutant' });
    }

    if (triple.intermediate && triple.intermediate.hanzi) {
      rawList.push({ ...triple.intermediate, tier: 'Intermédiaire' });
    }

    if (triple.advanced && triple.advanced.hanzi) {
      rawList.push({ ...triple.advanced, tier: 'Avancé' });
    }

    const total = rawList.length;
    return rawList.map((item, idx) => ({
      levelLabel: getProgressiveLevelLabel(idx, total),
      levelTier: item.tier,
      levelNumber: (idx + 1) as any,
      hanzi: item.hanzi,
      pinyin: item.pinyin,
      french: item.french,
      contextNote: item.contextNote,
      source: item.source,
    }));
  }

  // 3. Si c'est un mot personnalisé avec un exemple authentique saisi par l'utilisateur
  const rawExHanzi = (word as any).exampleHanzi || '';
  const rawExFrench = (word as any).exampleFrench || '';
  const isMeta =
    rawExHanzi.includes('重点必考词汇') ||
    rawExHanzi.includes('必考词汇') ||
    rawExFrench.includes('exprime l\'idée de') ||
    rawExFrench.includes('Le terme «') ||
    rawExFrench.includes('dans le contexte du HSK');

  if (rawExHanzi && !isMeta) {
    return [
      {
        levelLabel: 'Exemple Personnalisé',
        levelTier: 'Débutant',
        levelNumber: 1,
        hanzi: rawExHanzi,
        pinyin: (word as any).examplePinyin || '',
        french: rawExFrench || rawExHanzi,
        contextNote: 'Exemple enregistré dans votre carnet personnel.',
        source: 'corpus_verified',
      },
    ];
  }

  return [];
}

export function WordDetailModal({
  word,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}: WordDetailModalProps) {
  const { showPinyin, showFrenchTranslation, audioSpeed } = usePreferences();
  const [playingIdx, setPlayingIdx] = useState<number | 'word' | null>(null);

  if (!isOpen || !word) return null;

  const examples = generateWordExamples(word);

  const playAudio = (text: string, identifier: number | 'word') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = identifier === 'word' ? (parseFloat(audioSpeed) || 0.75) : (parseFloat(audioSpeed) || 0.85);

      setPlayingIdx(identifier);
      utterance.onend = () => setPlayingIdx(null);
      utterance.onerror = () => setPlayingIdx(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'HSK 1': return 'bg-[#00897B] text-white';
      case 'HSK 2': return 'bg-[#0288D1] text-white';
      case 'HSK 3': return 'bg-[#6200EE] text-white';
      case 'HSK 4': return 'bg-[#3F51B5] text-white';
      case 'HSK 5': return 'bg-[#8E24AA] text-white';
      case 'HSK 6': return 'bg-[#D81B60] text-white';
      default: return 'bg-[#6200EE] text-white';
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="nixtio-card w-full max-w-xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E0E0E0] dark:border-[#2D2D2D] flex items-center justify-between bg-white dark:bg-[#1E1E1E]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] block">
                  Fiche Vocabulaire Détaillée
                </span>
                <span className="text-xs text-[#757575] dark:text-[#A0A0A0] font-medium">
                  {word.category || 'Vocabulaire Chinois'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave(word.id)}
                type="button"
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 btn-press ${
                  isSaved
                    ? 'bg-[#E91E63] text-white shadow-xs'
                    : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] border border-[#E0E0E0] dark:border-[#333333] hover:text-[#212121] dark:hover:text-white'
                }`}
                title={isSaved ? 'Enregistré dans Mes Mots' : 'Ajouter à Mes Mots'}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Enregistré' : 'Enregistrer'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#757575] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Word Banner Hero Display */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#FAFAFA] to-white dark:from-[#252525] dark:to-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] flex items-center justify-between gap-4 shadow-xs">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${getLevelColor(word.level)}`}>
                    {word.level || 'HSK'}
                  </span>
                  {word.category && (
                    <span className="text-[10px] font-bold text-[#757575] dark:text-[#A0A0A0] px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5">
                      {word.category}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3 pt-1">
                  <h2 className="font-hanzi font-black text-4xl sm:text-5xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
                    {word.hanzi}
                  </h2>
                  {showPinyin && (
                    <span className="font-pinyin text-lg sm:text-2xl font-bold text-[#6200EE] dark:text-[#BB86FC]">
                      {word.pinyin}
                    </span>
                  )}
                </div>

                {showFrenchTranslation && (
                  <p className="font-display font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5] pt-0.5">
                    {word.french}
                  </p>
                )}
              </div>

              {/* Pronunciation Audio Button */}
              <button
                type="button"
                onClick={() => playAudio(word.hanzi, 'word')}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all btn-press shrink-0 ${
                  playingIdx === 'word'
                    ? 'bg-[#6200EE] text-white scale-95 shadow-md shadow-[#6200EE]/30 animate-pulse'
                    : 'bg-[#6200EE] hover:bg-[#3700B3] text-white hover:scale-105 shadow-sm shadow-[#6200EE]/25'
                }`}
                title="Écouter la prononciation du mot"
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            {/* Context & Business Tip */}
            {word.businessTip && (
              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#6200EE] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] block">
                    Contexte & Astuce d&apos;Usage
                  </span>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed mt-0.5">
                    {word.businessTip}
                  </p>
                </div>
              </div>
            )}

            {/* Progressive Example Sentences Section (Only if verified examples exist) */}
            {examples.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#212121] dark:text-[#F5F5F5] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#E91E63]" />
                    <span>Exemples de Phrases Certifiés</span>
                  </h4>
                  <span className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                    {examples.length} exemple{examples.length > 1 ? 's' : ''} certifié{examples.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-3">
                  {examples.map((ex, idx) => {
                    const isPlaying = playingIdx === idx;

                    return (
                      <div
                        key={`${ex.levelTier}_${idx}`}
                        className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-2.5 hover:border-[#6200EE]/30 transition-all shadow-2xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20">
                              {ex.levelLabel}
                            </span>

                            {(ex.source === 'tatoeba' || ex.source === 'corpus_verified') && (
                              <span 
                                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#00897B] text-white shadow-xs" 
                                title="Phrase certifiée vérifiée (Corpus Tatoeba / BCC)"
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}

                            {ex.source === 'official_hsk' && (
                              <span 
                                className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#6200EE] text-white shadow-xs" 
                                title="Phrase certifiée (Base officielle HSK)"
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => playAudio(ex.hanzi, idx)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all btn-press ${
                              isPlaying
                                ? 'bg-[#6200EE] text-white animate-pulse'
                                : 'bg-white dark:bg-[#252525] text-[#212121] dark:text-[#F5F5F5] border border-[#E0E0E0] dark:border-[#333333] hover:bg-[#6200EE]/10 hover:text-[#6200EE]'
                            }`}
                            title="Écouter la phrase"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Écouter</span>
                          </button>
                        </div>

                        {/* Hanzi, Pinyin, French */}
                        <div className="space-y-0.5">
                          <div className="font-hanzi text-base sm:text-lg font-bold text-[#212121] dark:text-[#F5F5F5] leading-snug">
                            {ex.hanzi}
                          </div>
                          {showPinyin && (
                            <div className="font-pinyin text-xs font-semibold text-[#6200EE] dark:text-[#BB86FC]">
                              {ex.pinyin}
                            </div>
                          )}
                          {showFrenchTranslation && (
                            <div className="text-xs text-[#757575] dark:text-[#A0A0A0] font-medium italic pt-0.5">
                              « {ex.french} »
                            </div>
                          )}
                        </div>

                        {/* Contextual Note */}
                        <div className="text-[10px] text-[#757575] dark:text-[#A0A0A0] bg-white dark:bg-[#252525] p-2 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D]">
                          💡 {ex.contextNote}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
