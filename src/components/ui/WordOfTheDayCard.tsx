'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Volume2, Sparkles, Bookmark, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { getDailyWord } from '@/lib/mock/dashboard';
import { usePreferences } from '@/context/PreferencesContext';
import { addSavedWord, removeSavedWord, fetchUserSavedWords } from '@/lib/services/vocabularyService';
import confetti from 'canvas-confetti';

export function WordOfTheDayCard() {
  const { showPinyin, showFrenchTranslation, audioSpeed } = usePreferences();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showSentences, setShowSentences] = useState(false);

  // Mot du jour calculé automatiquement toutes les 24h à minuit
  const dailyWord = useMemo(() => getDailyWord(), []);

  useEffect(() => {
    // Vérifier si le mot du jour est déjà enregistré dans Supabase
    fetchUserSavedWords().then((words) => {
      if (words.some((w) => w.hanzi === dailyWord.hanzi)) {
        setIsSaved(true);
      }
    });
  }, [dailyWord]);

  const handleToggleSave = async () => {
    if (isSaved) {
      setIsSaved(false);
      await removeSavedWord(dailyWord.id);
    } else {
      setIsSaved(true);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#E91E63', '#6200EE', '#03DAC5'],
        });
      } catch {}
      await addSavedWord({
        hanzi: dailyWord.hanzi,
        pinyin: dailyWord.pinyin,
        french: dailyWord.french,
        example: dailyWord.exampleSentences[0]?.hanzi,
        note: dailyWord.exampleSentences[0]?.french,
        source_type: 'hsk',
      });
    }
  };

  const playAudio = (text: string, isSentence = false, sentenceIdx = 0) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = isSentence ? (parseFloat(audioSpeed) || 0.82) : (parseFloat(audioSpeed) || 0.75);

      if (isSentence) {
        setPlayingSentenceIdx(sentenceIdx);
        utterance.onend = () => setPlayingSentenceIdx(null);
        utterance.onerror = () => setPlayingSentenceIdx(null);
      } else {
        setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const levelBadges = {
    Débutant: 'bg-[#1B5E20]/15 text-[#1B5E20] dark:text-[#81C784] border-[#1B5E20]/25',
    Intermédiaire: 'bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] border-[#FFC107]/25',
    Avancé: 'bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] border-[#6200EE]/25',
  };

  return (
    <div className="nixtio-card p-5 sm:p-6 relative overflow-hidden bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] transition-all duration-300">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E91E63]/15 dark:bg-[#E91E63]/25 text-[#E91E63] dark:text-[#F06292] flex items-center justify-center shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E91E63] dark:text-[#F06292]">
              Mot du Jour • Vocabulaire
            </span>
            <span className="block text-xs text-[#757575] dark:text-[#A0A0A0] font-medium">
              {dailyWord.category}
            </span>
          </div>
        </div>

        <button
          onClick={handleToggleSave}
          type="button"
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all btn-press cursor-pointer ${
            isSaved
              ? 'bg-[#E91E63] text-white shadow-xs'
              : 'bg-black/[0.03] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
          title={isSaved ? 'Mot enregistré dans mes cartes' : 'Enregistrer dans mes cartes'}
        >
          {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Character Display */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h3 className="font-hanzi font-black text-4xl sm:text-5xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
              {dailyWord.hanzi}
            </h3>
            {showPinyin && (
              <span className="font-pinyin text-lg sm:text-xl font-semibold text-[#6200EE] dark:text-[#BB86FC]">
                {dailyWord.pinyin}
              </span>
            )}
          </div>
          {showFrenchTranslation && (
            <p className="text-sm sm:text-base font-semibold text-[#212121] dark:text-[#F5F5F5] mt-1">
              {dailyWord.french}
            </p>
          )}
        </div>

        {/* Audio Pronounce Button */}
        <button
          onClick={() => playAudio(dailyWord.hanzi)}
          type="button"
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all btn-press cursor-pointer ${
            isPlaying
              ? 'bg-[#6200EE] text-white scale-95 shadow-md shadow-[#6200EE]/30 animate-pulse'
              : 'bg-[#6200EE] hover:bg-[#3700B3] text-white hover:scale-105 active:scale-95 shadow-sm shadow-[#6200EE]/25'
          }`}
          aria-label="Écouter la prononciation du mot"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Domain Context & Usage Tip */}
      <div className="mt-4 p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#E91E63] shrink-0 mt-0.5" />
        <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
          {dailyWord.businessContext}
        </p>
      </div>

      {/* Expandable Example Sentences Button */}
      <div className="mt-3.5 pt-2 border-t border-[#E0E0E0] dark:border-[#2D2D2D]">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowSentences((prev) => !prev);
          }}
          type="button"
          aria-expanded={showSentences}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#6200EE]/5 dark:bg-[#6200EE]/10 hover:bg-[#6200EE]/15 dark:hover:bg-[#6200EE]/20 active:scale-[0.99] border border-[#6200EE]/20 text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] transition-all duration-200 cursor-pointer select-none group btn-press shadow-2xs"
        >
          <span className="flex items-center gap-2">
            <span>{showSentences ? 'Masquer les exemples' : 'Exemples'}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/25 font-semibold text-[#6200EE] dark:text-[#BB86FC]">
              3 phrases
            </span>
          </span>
          {showSentences ? (
            <ChevronUp className="w-4 h-4 text-[#6200EE] dark:text-[#BB86FC] pointer-events-none transition-transform" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#6200EE] dark:text-[#BB86FC] pointer-events-none transition-transform group-hover:translate-y-0.5" />
          )}
        </button>

        {showSentences && (
          <div className="mt-3 space-y-3 animate-fadeIn">
            {dailyWord.exampleSentences.map((tier, idx) => (
              <div
                key={tier.level}
                className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs space-y-2 transition-all hover:border-[#6200EE]/30"
              >
                {/* Tier Badge & Audio */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${levelBadges[tier.level]}`}>
                    Niveau {tier.levelNumber} — {tier.level}
                  </span>

                  <button
                    onClick={() => playAudio(tier.hanzi, true, idx)}
                    type="button"
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all btn-press cursor-pointer ${
                      playingSentenceIdx === idx
                        ? 'bg-[#6200EE] text-white animate-pulse'
                        : 'bg-white dark:bg-[#252525] text-[#212121] dark:text-[#F5F5F5] border border-[#E0E0E0] dark:border-[#333333] hover:bg-[#6200EE]/10'
                    }`}
                    title="Écouter la phrase"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Écouter</span>
                  </button>
                </div>

                {/* Hanzi, Pinyin, French */}
                <div>
                  <div className="font-hanzi text-sm sm:text-base font-bold text-[#212121] dark:text-[#F5F5F5] leading-snug">
                    {tier.hanzi}
                  </div>
                  {showPinyin && (
                    <div className="font-pinyin text-[11px] sm:text-xs text-[#6200EE] dark:text-[#BB86FC] font-semibold mt-0.5">
                      {tier.pinyin}
                    </div>
                  )}
                  {showFrenchTranslation && (
                    <div className="text-xs text-[#757575] dark:text-[#A0A0A0] font-medium italic mt-1">
                      « {tier.french} »
                    </div>
                  )}
                </div>

                {/* Contextual Note */}
                <div className="text-[10px] text-[#757575] dark:text-[#6E6E6E] bg-white dark:bg-[#1E1E1E] p-2 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D]">
                  💡 {tier.contextNote}
                </div>
              </div>
            ))}

            {/* Bouton rapide pour refermer */}
            <button
              onClick={() => setShowSentences(false)}
              type="button"
              className="w-full py-1.5 text-center text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0] hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors cursor-pointer"
            >
              ▲ Replier les exemples
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
