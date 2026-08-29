'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { VocabularyWord } from '@/lib/mock/vocabulary';
import { usePreferences } from '@/context/PreferencesContext';
import { tatoebaCorpusByHanzi } from '@/lib/data/tatoebaCorpus';
import { getVerifiedTripleForWord } from '@/lib/data/hskSentencesDatabase';
import { 
  Volume2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Trophy, 
  Lightbulb,
  CornerDownLeft,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Abréviations grammaticales normalisées et épurées
 */
function formatGrammarCategory(cat?: string): string {
  if (!cat) return '';
  const c = cat.toLowerCase().trim();
  if (c.includes('adverbe') || c === 'adv') return 'adv.';
  if (c.includes('adjectif') || c === 'adj') return 'adj.';
  if (c.includes('verbe') || c === 'v') return 'v.';
  if (c.includes('nom') || c === 'n') return 'n.';
  if (c.includes('pronom') || c === 'pron') return 'pron.';
  if (c.includes('préposition') || c.includes('preposition') || c === 'prep') return 'prép.';
  if (c.includes('conjonction') || c === 'conj') return 'conj.';
  if (c.includes('particule') || c === 'part') return 'part.';
  if (c.includes('classificateur') || c === 'cl') return 'cl.';
  if (c.includes('numéral') || c.includes('nombre') || c === 'num') return 'num.';
  return cat;
}

/**
 * Récupère l'exemple vérifié et certifié pour la carte flashcard 3D.
 */
function getFlashcardVerifiedExample(word?: VocabularyWord) {
  if (!word) return null;
  const hz = word.hanzi;

  // 1. Corpus Tatoeba
  if (tatoebaCorpusByHanzi[hz] && tatoebaCorpusByHanzi[hz].length > 0) {
    const ex = tatoebaCorpusByHanzi[hz][0];
    return {
      hanzi: ex.hanzi,
      pinyin: ex.pinyin,
      french: ex.french,
    };
  }

  // 2. Base statique certifiée
  const triple = getVerifiedTripleForWord(hz);
  if (triple) {
    const ex = triple.beginner || triple.intermediate || triple.advanced;
    if (ex && ex.hanzi) {
      return {
        hanzi: ex.hanzi,
        pinyin: ex.pinyin,
        french: ex.french,
      };
    }
  }

  // 3. Si le mot contient une phrase réelle non-méta
  const rawHanzi = word.exampleHanzi || '';
  const rawFrench = word.exampleFrench || '';
  const isMetaTemplate =
    rawHanzi.includes('重点必考词汇') ||
    rawHanzi.includes('必考词汇') ||
    rawFrench.includes('exprime l\'idée de') ||
    rawFrench.includes('Le terme «') ||
    rawFrench.includes('dans le contexte du HSK');

  if (rawHanzi && rawFrench && !isMetaTemplate) {
    return {
      hanzi: word.exampleHanzi,
      pinyin: word.examplePinyin || '',
      french: word.exampleFrench,
    };
  }

  return null;
}

interface FlashcardSessionProps {
  words: VocabularyWord[];
  themeTitle: string;
  onFinish?: () => void;
}

export function FlashcardSession({ words, themeTitle, onFinish }: FlashcardSessionProps) {
  const { 
    showPinyin, 
    showFrenchTranslation, 
    audioSpeed, 
    autoPlayAudio,
    cardsPerSession, 
    reviewOrder, 
    cardFrontFace, 
    showExampleSentence 
  } = usePreferences();

  // Prepare ordered/shuffled and limited words based on user preferences
  const sessionWords = useMemo(() => {
    let list = [...words];
    if (reviewOrder === 'random') {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    if (cardsPerSession !== 'all') {
      const limit = parseInt(cardsPerSession, 10) || 10;
      list = list.slice(0, limit);
    }
    return list.length > 0 ? list : words.slice(0, 5);
  }, [words, reviewOrder, cardsPerSession]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [reviewedWords, setReviewedWords] = useState<Record<string, 'again' | 'hard' | 'good' | 'easy'>>({});
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const currentWord = sessionWords[currentIndex] || sessionWords[0];
  const total = sessionWords.length;
  const progressPct = Math.round(((currentIndex + 1) / total) * 100);

  // Exemple certifié pour la carte en cours
  const verifiedExample = useMemo(() => {
    return getFlashcardVerifiedExample(currentWord);
  }, [currentWord]);

  // Determine front face based on preferences
  const isFrontHanzi = useMemo(() => {
    if (cardFrontFace === 'french') return false;
    if (cardFrontFace === 'random') return (currentIndex % 2 === 0);
    return true; // default 'hanzi'
  }, [cardFrontFace, currentIndex]);

  const grammarAbbr = useMemo(() => {
    return formatGrammarCategory(currentWord?.category);
  }, [currentWord?.category]);

  const playAudio = (text: string, rateMultiplier: number = 1) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      const baseRate = parseFloat(audioSpeed) || 0.85;
      utterance.rate = Math.max(0.5, Math.min(1.5, baseRate * rateMultiplier));
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Auto-play audio on new card if preference is enabled
  useEffect(() => {
    setIsFlipped(false);
    if (autoPlayAudio && currentWord?.hanzi) {
      const timer = setTimeout(() => {
        playAudio(currentWord.hanzi);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoPlayAudio, currentWord?.hanzi]);

  // Keyboard shortcut navigation (Space = Flip, ArrowLeft = Prev, ArrowRight = Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, total]);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 40, 30]);
      } catch {
        // ignore
      }
    }
  };

  const handleSrsGrade = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    triggerHaptic();
    if (currentWord) {
      setReviewedWords((prev) => ({
        ...prev,
        [currentWord.id]: grade,
      }));
    }

    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
    } else {
      // Session finished!
      setSessionCompleted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#6200EE', '#03DAC5', '#FFD700', '#00BFA5', '#E91E63'],
        });
      } catch {
        // ignore
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) setCurrentIndex((prev) => prev + 1);
  };

  const restartSession = () => {
    setReviewedWords({});
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
  };

  if (sessionCompleted) {
    const counts = Object.values(reviewedWords);
    const masteredCount = counts.filter((c) => c === 'good' || c === 'easy').length;

    return (
      <div className="nixtio-card p-6 sm:p-10 text-center max-w-xl mx-auto space-y-6 bg-white dark:bg-[#1E1E28] border border-[#6200EE]/30 dark:border-[#6200EE]/40 shadow-xl animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#6200EE] to-[#3700B3] text-white flex items-center justify-center mx-auto shadow-md shadow-[#6200EE]/30">
          <Trophy className="w-8 h-8 text-[#FFC107] animate-bounce" />
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
            Session Terminée !
          </span>
          <h3 className="font-display font-black text-2xl sm:text-3xl text-[#212121] dark:text-[#F5F5F5] mt-1">
            Félicitations, Espoir Chinois 🎉
          </h3>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-1">
            Vous avez révisé les {total} cartes de « {themeTitle} ».
          </p>
        </div>

        {/* Retention Summary Pills */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <div className="p-3 rounded-2xl bg-[#00897B]/10 border border-[#00897B]/20 text-[#00796B] dark:text-[#03DAC5]">
            <div className="text-2xl font-black font-display">{masteredCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider">Mots Maîtrisés</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#E53935]/10 border border-[#E53935]/20 text-[#E53935] dark:text-[#FF8A65]">
            <div className="text-2xl font-black font-display">{total - masteredCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider">À Revoir Bientôt</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={restartSession}
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-slate-100 dark:hover:bg-[#303030] active:scale-95 transition-all btn-press cursor-pointer"
          >
            Recommencer la session
          </button>
          {onFinish && (
            <button
              onClick={onFinish}
              type="button"
              className="px-6 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 active:scale-95 transition-all btn-press cursor-pointer"
            >
              Retour au vocabulaire
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg sm:max-w-xl mx-auto space-y-3.5 animate-fadeIn">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-extrabold text-[#6200EE] dark:text-[#BB86FC] uppercase tracking-wider truncate">
            {themeTitle}
          </span>
          <span className="text-[#E0E0E0] dark:text-[#333333]">•</span>
          <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] shrink-0">
            {currentIndex + 1} / {total}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#757575] disabled:opacity-40 disabled:cursor-not-allowed hover:text-[#212121] dark:hover:text-white active:scale-90 transition-all shadow-2xs btn-press cursor-pointer"
            title="Carte précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === total - 1}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#757575] disabled:opacity-40 disabled:cursor-not-allowed hover:text-[#212121] dark:hover:text-white active:scale-90 transition-all shadow-2xs btn-press cursor-pointer"
            title="Carte suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] rounded-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* 3D Flip Card Container (Glassmorphism & Couleurs de Marque) */}
      <div
        className="relative w-full h-[360px] sm:h-[390px] cursor-pointer select-none"
        style={{ perspective: '1200px' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="w-full h-full relative transition-transform duration-600 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* ================= RECTO (FRONT) ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white/95 via-[#6200EE]/[0.03] to-[#03DAC5]/[0.05] dark:from-[#1E1E28]/95 dark:via-[#6200EE]/[0.08] dark:to-[#03DAC5]/[0.06] backdrop-blur-md border border-[#6200EE]/25 dark:border-[#6200EE]/35 shadow-xl shadow-[#6200EE]/08 backface-hidden relative overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Subtle Glowing Aura */}
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#6200EE]/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-[#03DAC5]/15 blur-2xl pointer-events-none" />

            {/* Top Bar : Abréviation grammaticale épurée & Bouton Audio */}
            <div className="relative z-10 flex items-center justify-between">
              {grammarAbbr ? (
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/25 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20 shadow-2xs">
                  {grammarAbbr}
                </span>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(currentWord.hanzi);
                }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all btn-press cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-[#6200EE] text-white scale-95 animate-pulse'
                    : 'bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] hover:bg-[#6200EE] hover:text-white'
                }`}
                title="Écouter la prononciation"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Center Display (100% Perfectly Centered) */}
            <div className="relative z-10 text-center my-auto flex flex-col items-center justify-center">
              {isFrontHanzi ? (
                <>
                  <h2 className="font-hanzi font-black text-6xl sm:text-7xl text-[#212121] dark:text-[#F5F5F5] tracking-tight leading-none drop-shadow-xs">
                    {currentWord.hanzi}
                  </h2>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-5 font-medium flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-[#6200EE] dark:text-[#03DAC5]" />
                    <span>Cliquez pour révéler le verso</span>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight leading-tight text-center">
                    {currentWord.french}
                  </h2>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-5 font-medium flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-[#6200EE] dark:text-[#03DAC5]" />
                    <span>Cliquez pour révéler le caractère chinois</span>
                  </p>
                </>
              )}
            </div>

            {/* Bottom Subtle Flip Hint */}
            <div className="relative z-10 flex items-center justify-center text-[11px] font-bold text-[#6200EE] dark:text-[#03DAC5] opacity-80">
              <span>Retourner la carte ➔</span>
            </div>
          </div>

          {/* ================= VERSO (BACK) ================= */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-br from-white/95 via-[#03DAC5]/[0.03] to-[#6200EE]/[0.05] dark:from-[#1E1E28]/95 dark:via-[#03DAC5]/[0.08] dark:to-[#6200EE]/[0.06] backdrop-blur-md border border-[#03DAC5]/35 dark:border-[#03DAC5]/45 shadow-xl shadow-[#03DAC5]/08 backface-hidden relative overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Subtle Glowing Aura */}
            <div className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-[#03DAC5]/15 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-[#6200EE]/15 blur-2xl pointer-events-none" />

            {/* Top Bar with Audio */}
            <div className="relative z-10 flex items-center justify-between">
              {grammarAbbr ? (
                <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-[#03DAC5]/15 text-[#00796B] dark:text-[#03DAC5] border border-[#03DAC5]/25 shadow-2xs">
                  {grammarAbbr}
                </span>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (verifiedExample) {
                    playAudio(verifiedExample.hanzi, 0.82);
                  } else {
                    playAudio(currentWord.hanzi, 0.85);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] text-xs font-bold hover:bg-[#6200EE] hover:text-white transition-colors btn-press cursor-pointer"
                title={verifiedExample ? 'Écouter la phrase d’exemple' : 'Écouter le mot'}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{verifiedExample ? 'Audio Phrase' : 'Audio'}</span>
              </button>
            </div>

            {/* Center Content (100% Perfectly Centered) */}
            <div className="relative z-10 space-y-2.5 my-auto flex flex-col items-center justify-center text-center">
              {/* Hanzi */}
              <h3 className="font-hanzi font-black text-4xl sm:text-5xl text-[#212121] dark:text-[#F5F5F5] leading-none">
                {currentWord.hanzi}
              </h3>

              {/* Pinyin */}
              {showPinyin && (
                <span className="font-pinyin font-bold text-xl sm:text-2xl text-[#6200EE] dark:text-[#03DAC5] tracking-wide">
                  {currentWord.pinyin}
                </span>
              )}

              {/* French Translation */}
              {showFrenchTranslation && (
                <p className="font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5] leading-snug">
                  {currentWord.french}
                </p>
              )}

              {/* Verified Example Sentence */}
              {showExampleSentence && verifiedExample && (
                <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 space-y-0.5 max-w-md mx-auto mt-1">
                  <div className="font-hanzi text-xs font-bold text-[#212121] dark:text-[#F5F5F5]">
                    {verifiedExample.hanzi}
                  </div>
                  {showPinyin && verifiedExample.pinyin && (
                    <div className="font-pinyin text-[11px] text-[#6200EE] dark:text-[#03DAC5] font-medium">
                      {verifiedExample.pinyin}
                    </div>
                  )}
                  {showFrenchTranslation && verifiedExample.french && (
                    <div className="text-[11px] text-[#757575] dark:text-[#A0A0A0] italic">
                      « {verifiedExample.french} »
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Flip Hint */}
            <div className="relative z-10 flex items-center justify-center text-[10px] font-bold text-[#757575] dark:text-[#9E9E9E] opacity-70">
              <span>Cliquez pour retourner</span>
            </div>
          </div>
        </div>
      </div>

      {/* Répétition Espacée Rating Control Bar (Remontée & Intervalles SRS Conformes) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => handleSrsGrade('again')}
          type="button"
          className="p-3 rounded-2xl bg-[#DD2C00]/10 hover:bg-[#DD2C00] text-[#DD2C00] hover:text-white border border-[#DD2C00]/25 font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press cursor-pointer"
        >
          <span className="group-hover:scale-110 transition-transform">🔴 À Revoir</span>
          <span className="text-[10px] opacity-85 font-semibold">10 min</span>
        </button>

        <button
          onClick={() => handleSrsGrade('hard')}
          type="button"
          className="p-3 rounded-2xl bg-[#FFA000]/10 hover:bg-[#FFA000] text-[#B78103] hover:text-white dark:text-[#FFD54F] border border-[#FFA000]/25 font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press cursor-pointer"
        >
          <span className="group-hover:scale-110 transition-transform">🟠 Difficile</span>
          <span className="text-[10px] opacity-85 font-semibold">2 h</span>
        </button>

        <button
          onClick={() => handleSrsGrade('good')}
          type="button"
          className="p-3 rounded-2xl bg-[#03DAC5]/15 hover:bg-[#03DAC5] text-[#00897B] hover:text-[#0B0B0F] dark:text-[#03DAC5] border border-[#03DAC5]/25 font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press cursor-pointer"
        >
          <span className="group-hover:scale-110 transition-transform">🟢 Je Sais</span>
          <span className="text-[10px] opacity-85 font-semibold">4 j</span>
        </button>

        <button
          onClick={() => handleSrsGrade('easy')}
          type="button"
          className="p-3 rounded-2xl bg-[#6200EE]/15 hover:bg-[#6200EE] text-[#6200EE] hover:text-white dark:text-[#BB86FC] border border-[#6200EE]/25 font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press cursor-pointer"
        >
          <span className="group-hover:scale-110 transition-transform">⚡ Facile</span>
          <span className="text-[10px] opacity-85 font-semibold">7 j</span>
        </button>
      </div>
    </div>
  );
}
