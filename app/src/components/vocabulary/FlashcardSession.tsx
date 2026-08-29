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
 * Récupère l'exemple vérifié et certifié pour la carte flashcard 3D.
 * Si la phrase est un template méta (ex: '重点必考词汇', 'exprime l\'idée de'), elle est rejetée à 100%.
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
      // Fisher-Yates shuffle
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

  // Déterminer la face avant selon la préférence (hanzi, french ou random)
  const isFrontHanzi = useMemo(() => {
    if (cardFrontFace === 'hanzi') return true;
    if (cardFrontFace === 'french') return false;
    // Si random : alternance déterministe pour chaque carte
    return (currentIndex + (currentWord?.id?.charCodeAt(currentWord.id.length - 1) || 0)) % 2 === 0;
  }, [cardFrontFace, currentIndex, currentWord]);

  // Flip reset on card change
  useEffect(() => {
    setIsFlipped(false);
    if (autoPlayAudio && currentWord) {
      const timer = setTimeout(() => {
        playAudio(currentWord.hanzi);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, currentWord, autoPlayAudio]);

  const playAudio = (text: string, rate?: number) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate || parseFloat(audioSpeed) || 0.75;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSrsGrade = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    const updated = { ...reviewedWords, [currentWord.id]: grade };
    setReviewedWords(updated);

    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setSessionCompleted(true);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6200EE', '#03DAC5', '#FFC107', '#DD2C00'],
      });
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
      <div className="nixtio-card p-6 sm:p-10 text-center max-w-xl mx-auto space-y-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-lg animate-fadeIn">
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
          <div className="p-3 rounded-2xl bg-[#1B5E20]/10 border border-[#1B5E20]/20 text-[#1B5E20] dark:text-[#81C784]">
            <div className="text-2xl font-black font-display">{masteredCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider">Mots Maîtrisés</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#DD2C00]/10 border border-[#DD2C00]/20 text-[#DD2C00] dark:text-[#FF8A65]">
            <div className="text-2xl font-black font-display">{total - masteredCount}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider">À Revoir Bientôt</div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={restartSession}
            type="button"
            className="px-5 py-2.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-slate-100 dark:hover:bg-[#303030] active:scale-95 transition-all btn-press"
          >
            Recommencer la session
          </button>
          {onFinish && (
            <button
              onClick={onFinish}
              type="button"
              className="px-6 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 active:scale-95 transition-all btn-press"
            >
              Retour au vocabulaire
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-[#6200EE] dark:text-[#BB86FC] uppercase tracking-wider">
            {themeTitle}
          </span>
          <span className="text-[#E0E0E0] dark:text-[#333333]">•</span>
          <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
            Carte {currentIndex + 1} / {total}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#757575] disabled:opacity-40 disabled:cursor-not-allowed hover:text-[#212121] dark:hover:text-white active:scale-90 transition-all shadow-2xs btn-press"
            title="Carte précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === total - 1}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#757575] disabled:opacity-40 disabled:cursor-not-allowed hover:text-[#212121] dark:hover:text-white active:scale-90 transition-all shadow-2xs btn-press"
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

      {/* 3D Flip Card Container */}
      <div
        className="relative w-full h-[380px] sm:h-[400px] cursor-pointer select-none"
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
          {/* RECTO (FRONT) */}
          <div
            className="absolute inset-0 w-full h-full nixtio-card p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-md backface-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20">
                {currentWord.category} • {currentWord.level}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playAudio(currentWord.hanzi);
                }}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all btn-press ${
                  isPlayingAudio
                    ? 'bg-[#6200EE] text-white scale-95 animate-pulse'
                    : 'bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] hover:bg-[#6200EE] hover:text-white'
                }`}
                title="Écouter la prononciation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Center Display (Hanzi or French depending on isFrontHanzi) */}
            <div className="text-center my-auto">
              {isFrontHanzi ? (
                <>
                  <h2 className="font-hanzi font-black text-6xl sm:text-7xl text-[#212121] dark:text-[#F5F5F5] tracking-tight leading-none">
                    {currentWord.hanzi}
                  </h2>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-4 font-medium flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Cliquez pour révéler le pinyin et la traduction</span>
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-display font-black text-3xl sm:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight leading-tight">
                    {currentWord.french}
                  </h2>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-4 font-medium flex items-center justify-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Cliquez pour révéler le caractère chinois et son pinyin</span>
                  </p>
                </>
              )}
            </div>

            {/* Bottom Tip Hint */}
            <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] flex items-center justify-between text-xs text-[#757575] dark:text-[#A0A0A0]">
              <span className="truncate">💡 Indice thématique disponible au verso</span>
              <span className="text-[10px] font-bold text-[#6200EE] dark:text-[#BB86FC] uppercase tracking-wider shrink-0">
                Retourner →
              </span>
            </div>
          </div>

          {/* VERSO (BACK) */}
          <div
            className="absolute inset-0 w-full h-full nixtio-card p-6 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#1E1E1E] border border-[#6200EE]/30 dark:border-[#6200EE]/40 shadow-lg backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Top Bar with Pronounce */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#03DAC5]/15 text-[#00897B] dark:text-[#03DAC5] border border-[#03DAC5]/25">
                Traduction & Contexte
              </span>

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
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] text-xs font-bold hover:bg-[#6200EE] hover:text-white transition-colors btn-press"
                title={verifiedExample ? 'Écouter la phrase d’exemple' : 'Écouter le mot'}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{verifiedExample ? 'Phrase Audio' : 'Écouter'}</span>
              </button>
            </div>

            {/* Center Content */}
            <div className="space-y-3">
              <div>
                <div className="flex items-baseline gap-3">
                  <h3 className="font-hanzi font-black text-3xl sm:text-4xl text-[#212121] dark:text-[#F5F5F5]">
                    {currentWord.hanzi}
                  </h3>
                  {showPinyin && (
                    <span className="font-pinyin font-bold text-xl text-[#6200EE] dark:text-[#BB86FC]">
                      {currentWord.pinyin}
                    </span>
                  )}
                </div>
                {showFrenchTranslation && (
                  <p className="font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5] mt-0.5">
                    {currentWord.french}
                  </p>
                )}
              </div>

              {/* Example Sentence (Only if verified and configured by Preferences) */}
              {showExampleSentence && verifiedExample && (
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-1">
                  <div className="font-hanzi text-xs sm:text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
                    {verifiedExample.hanzi}
                  </div>
                  {showPinyin && verifiedExample.pinyin && (
                    <div className="font-pinyin text-[11px] text-[#6200EE] dark:text-[#BB86FC] font-medium">
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

              {/* Business Note */}
              {currentWord.businessTip && (
                <div className="text-[11px] text-[#757575] dark:text-[#A0A0A0] flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-[#FFC107] shrink-0 mt-0.5" />
                  <span>{currentWord.businessTip}</span>
                </div>
              )}
            </div>

            <div className="text-center text-[10px] font-bold text-[#757575] dark:text-[#6E6E6E] pt-1">
              Évaluez votre niveau de maîtrise ci-dessous 👇
            </div>
          </div>
        </div>
      </div>

      {/* Répétition Espacée Rating Control Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => handleSrsGrade('again')}
          type="button"
          className="p-3 rounded-2xl bg-[#DD2C00]/10 hover:bg-[#DD2C00] text-[#DD2C00] hover:text-white border border-[#DD2C00]/25 font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press"
        >
          <span className="group-hover:scale-110 transition-transform">🔴 À Revoir</span>
          <span className="text-[10px] opacity-80 font-medium">1 jour</span>
        </button>

        <button
          onClick={() => handleSrsGrade('hard')}
          type="button"
          className="p-3 rounded-2xl bg-[#FFA000]/10 hover:bg-[#FFA000] text-[#B78103] hover:text-white dark:text-[#FFD54F] border border-[#FFA000]/25 font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press"
        >
          <span className="group-hover:scale-110 transition-transform">🟠 Difficile</span>
          <span className="text-[10px] opacity-80 font-medium">3 jours</span>
        </button>

        <button
          onClick={() => handleSrsGrade('good')}
          type="button"
          className="p-3 rounded-2xl bg-[#03DAC5]/15 hover:bg-[#03DAC5] text-[#00897B] hover:text-[#0B0B0F] dark:text-[#03DAC5] border border-[#03DAC5]/25 font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press"
        >
          <span className="group-hover:scale-110 transition-transform">🟢 Je Sais</span>
          <span className="text-[10px] opacity-80 font-medium">7 jours</span>
        </button>

        <button
          onClick={() => handleSrsGrade('easy')}
          type="button"
          className="p-3 rounded-2xl bg-[#6200EE]/15 hover:bg-[#6200EE] text-[#6200EE] hover:text-white dark:text-[#BB86FC] border border-[#6200EE]/25 font-bold text-xs flex flex-col items-center gap-0.5 active:scale-95 transition-all shadow-2xs group btn-press"
        >
          <span className="group-hover:scale-110 transition-transform">⚡ Facile</span>
          <span className="text-[10px] opacity-80 font-medium">14 jours</span>
        </button>
      </div>
    </div>
  );
}
