'use client';

import React, { useState, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Shuffle, 
  Check, 
  Sparkles, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  HelpCircle, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SpokenExerciseModel, SpokenExerciseSubStep } from '@/lib/spoken-exercises/types';
import { buildDynamicSentence, buildSingleMobileSlotSelections, CombinatoryOption } from '@/lib/combination/combinationEngine';

interface SpokenExerciseRunnerProps {
  model: SpokenExerciseModel;
  onBack: () => void;
  isCompleted?: boolean;
  onToggleComplete?: () => void;
}

export function SpokenExerciseRunner({
  model,
  onBack,
  isCompleted = false,
  onToggleComplete,
}: SpokenExerciseRunnerProps) {
  // Main Step: 'ecoute' | 'structure' | 'repete' | 'combine'
  const [activeMainStep, setActiveMainStep] = useState<'ecoute' | 'structure' | 'repete' | 'combine'>('ecoute');

  // Audio playing with real ElevenLabs v3 MP3 + WebSpeech fallback for dynamic creations
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('normal');
  const [activeTokenIdx, setActiveTokenIdx] = useState<number | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Sub-step inside 'combine': number (e.g. 1, 2) | 'finale'
  const [combineSubStep, setCombineSubStep] = useState<number | 'finale'>(1);

  // Initial option for the first mobile sub-step
  const initialOptionId = useMemo(() => {
    const firstStep = model.subSteps[0];
    if (!firstStep) return '';
    return (
      firstStep.featuredExamples[0]?.slotSelections[firstStep.mobileSlotId] ||
      firstStep.allowedOptionIds?.[0] ||
      model.slots.find((s) => s.id === firstStep.mobileSlotId)?.defaultOptionId ||
      ''
    );
  }, [model]);

  // Selections for single-mobile sub-steps:
  const [currentSubStepOptionId, setCurrentSubStepOptionId] = useState<string>(initialOptionId);

  // Selections for the 'finale' ("Tout mélanger"):
  const [finaleSelections, setFinaleSelections] = useState<Record<string, string>>(() => {
    const sel: Record<string, string> = {};
    model.slots.forEach((s) => {
      sel[s.id] = s.defaultOptionId || s.options[0]?.id || '';
    });
    return sel;
  });

  // Collapsible sections state:
  const [isMethodOpen, setIsMethodOpen] = useState(false);
  const [isDidYouKnowOpen, setIsDidYouKnowOpen] = useState(false);

  // Completed status
  const [completed, setCompleted] = useState(isCompleted);

  const currentSubStepData: SpokenExerciseSubStep | undefined = useMemo(() => {
    if (combineSubStep === 'finale') return undefined;
    return model.subSteps.find((s) => s.subStepNumber === combineSubStep);
  }, [model.subSteps, combineSubStep]);

  // Active sentence computed by the shared combination engine
  const activeSentence = useMemo(() => {
    const punctuation =
      model.punctuation ||
      (model.typicalSentence.hanzi.includes('？')
        ? { hanzi: '？', pinyin: ' ?' }
        : undefined);

    if (activeMainStep !== 'combine') {
      return {
        hanzi: model.typicalSentence.hanzi,
        pinyin: model.typicalSentence.pinyin,
        french: model.typicalSentence.french,
      };
    }

    if (combineSubStep === 'finale') {
      return buildDynamicSentence(model.slots, finaleSelections, {
        customFrenchAssembler: model.frenchSentenceBuilder,
        punctuation,
      });
    }

    if (currentSubStepData) {
      const selections = buildSingleMobileSlotSelections(
        model.slots,
        currentSubStepData.mobileSlotId,
        currentSubStepOptionId
      );
      if (model.pairedSlotDefaults?.[currentSubStepData.mobileSlotId]?.[currentSubStepOptionId]) {
        Object.assign(
          selections,
          model.pairedSlotDefaults[currentSubStepData.mobileSlotId][currentSubStepOptionId]
        );
      }
      return buildDynamicSentence(model.slots, selections, {
        customFrenchAssembler: model.frenchSentenceBuilder,
        punctuation,
      });
    }

    return {
      hanzi: model.typicalSentence.hanzi,
      pinyin: model.typicalSentence.pinyin,
      french: model.typicalSentence.french,
    };
  }, [activeMainStep, combineSubStep, currentSubStepData, currentSubStepOptionId, finaleSelections, model]);

  // Dynamic ElevenLabs v3 audio URL for all combinations
  const activeAudioUrl = useMemo(() => {
    if (activeMainStep !== 'combine') {
      return model.typicalSentence.audioUrl;
    }
    const modelFolder = model.id === 'spoken_hsk1_ep1' ? 'hsk1-01' : model.id;
    const mobileSlots = model.slots.filter((s) => !s.isLocked);
    let audioKey = '';

    if (combineSubStep === 'finale') {
      audioKey = mobileSlots
        .map((s) => finaleSelections[s.id] || s.defaultOptionId || s.options[0]?.id)
        .join('_');
    } else if (currentSubStepData) {
      const selections: Record<string, string> = {};
      model.slots.forEach((s) => {
        if (s.id === currentSubStepData.mobileSlotId) {
          selections[s.id] = currentSubStepOptionId;
        } else {
          selections[s.id] = s.defaultOptionId || s.options[0]?.id;
        }
      });
      if (model.pairedSlotDefaults?.[currentSubStepData.mobileSlotId]?.[currentSubStepOptionId]) {
        Object.assign(
          selections,
          model.pairedSlotDefaults[currentSubStepData.mobileSlotId][currentSubStepOptionId]
        );
      }
      audioKey = mobileSlots.map((s) => selections[s.id]).join('_');
    }
    if (!audioKey) return model.typicalSentence.audioUrl;
    return `/audio/exercices-parles/${modelFolder}/all/${audioKey}.mp3`;
  }, [activeMainStep, combineSubStep, currentSubStepData, currentSubStepOptionId, finaleSelections, model]);

  // Audio Playback: Real ElevenLabs v3 MP3 prioritised, WebSpeech fallback for dynamic untracked phrases
  const handlePlayAudio = (text: string, rate: number = 1.0, audioUrl?: string) => {
    if (typeof window === 'undefined') return;

    // Stop currently playing sound
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        audio.playbackRate = rate;
        setIsPlayingAudio(true);
        audio.onended = () => {
          setIsPlayingAudio(false);
          setActiveTokenIdx(null);
        };
        audio.onerror = () => {
          setIsPlayingAudio(false);
          setActiveTokenIdx(null);
          // Fallback to speech synthesis if local audio load fails
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = rate;
            utterance.onend = () => setIsPlayingAudio(false);
            utterance.onerror = () => setIsPlayingAudio(false);
            window.speechSynthesis.speak(utterance);
          }
        };
        audio.play().catch(() => {
          setIsPlayingAudio(false);
        });
        return;
      } catch {
        // Fallback to speech synthesis
      }
    }

    // WebSpeech fallback for random untested dynamic combinations in local test mode
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = rate;
      setIsPlayingAudio(true);
      utterance.onend = () => {
        setIsPlayingAudio(false);
        setActiveTokenIdx(null);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setActiveTokenIdx(null);
      };
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleShuffleFinale = () => {
    const modelFolder = model.id === 'spoken_hsk1_ep1' ? 'hsk1-01' : model.id;

    // Si le modèle définit des combinaisons authentiques filtrées (cohérence sémantique)
    if (model.validCombinations && model.validCombinations.length > 0) {
      const randomCombo =
        model.validCombinations[
          Math.floor(Math.random() * model.validCombinations.length)
        ];
      setFinaleSelections(randomCombo.slotSelections);
      const audioKey = model.slots
        .filter((s) => !s.isLocked)
        .map((s) => randomCombo.slotSelections[s.id] || s.defaultOptionId)
        .join('_');
      const url =
        randomCombo.audioUrl ||
        `/audio/exercices-parles/${modelFolder}/all/${audioKey}.mp3`;
      handlePlayAudio(randomCombo.hanzi, 1.0, url);
      return;
    }

    const newSelections: Record<string, string> = {};
    const selectedOptions: CombinatoryOption[] = [];

    model.slots.forEach((slot) => {
      if (slot.isLocked) {
        const opt = slot.options[0];
        newSelections[slot.id] = opt?.id || '';
        if (opt) selectedOptions.push(opt);
      } else {
        const randomOpt = slot.options[Math.floor(Math.random() * slot.options.length)];
        newSelections[slot.id] = randomOpt?.id || '';
        if (randomOpt) selectedOptions.push(randomOpt);
      }
    });

    setFinaleSelections(newSelections);

    const fullHanzi = selectedOptions.map((o) => o.hanzi).join('') + (model.punctuation?.hanzi || '');
    const audioKey = model.slots.filter((s) => !s.isLocked).map((s) => newSelections[s.id]).join('_');
    const url = `/audio/exercices-parles/${modelFolder}/all/${audioKey}.mp3`;
    handlePlayAudio(fullHanzi, 1.0, url);
  };

  const handleToggleCompleted = () => {
    const nextState = !completed;
    setCompleted(nextState);
    if (nextState) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    if (onToggleComplete) onToggleComplete();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-4xl mx-auto pb-16">
      {/* 1. Header Navigation & Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors btn-press cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Tous les modèles {model.level}</span>
        </button>
      </div>

      {/* 2. Top Title Card */}
      <div className="nixtio-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#00897B] dark:text-[#03DAC5]">
            Méthode de la Combinaison · Exercice Parlé
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-[#212121] dark:text-white">
            {model.titleFr}
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0]">
            Modèle officiel : une phrase clé à répéter, puis démultiplie tes possibilités d’expression orale.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#6200EE]/05 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 3. Main Step Selector (1. Écoute · 2. Structure · 3. Répète · 4. Combine) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1.5 bg-[#ECEFF8] dark:bg-[#181820] rounded-2xl border border-black/5 dark:border-white/5">
        {[
          { id: 'ecoute', label: '1. Écoute' },
          { id: 'structure', label: '2. Structure' },
          { id: 'repete', label: '3. Répète' },
          { id: 'combine', label: '4. Combine' },
        ].map((tab) => {
          const isActive = activeMainStep === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveMainStep(tab.id as any)}
              className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-[#6200EE] text-white shadow-md shadow-[#6200EE]/20'
                  : 'text-[#616161] dark:text-[#B0B0B0] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* ÉTAPE 1 : ÉCOUTE                                                          */}
      {/* ========================================================================= */}
      {activeMainStep === 'ecoute' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Display Box */}
          <div className="nixtio-card p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center space-y-4 shadow-sm">
            <div className="text-3xl sm:text-4xl md:text-5xl font-black font-sans tracking-wide text-[#212121] dark:text-white">
              {model.typicalSentence.hanzi}
            </div>
            <div className="text-lg sm:text-xl font-bold text-[#6200EE] dark:text-[#BB86FC]">
              {model.typicalSentence.pinyin}
            </div>
            <div className="text-sm sm:text-base font-medium text-[#757575] dark:text-[#B0B0B0] italic max-w-lg mx-auto">
              « {model.typicalSentence.french} »
            </div>

            {/* Audio Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setAudioSpeed('normal');
                  handlePlayAudio(model.typicalSentence.hanzi, 1.0, model.typicalSentence.audioUrl);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#6200EE] hover:bg-[#5000CC] text-white font-bold text-xs sm:text-sm shadow-md transition-all btn-press cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Vitesse normale</span>
              </button>

              <button
                onClick={() => {
                  setAudioSpeed('slow');
                  handlePlayAudio(model.typicalSentence.hanzi, 0.65, model.typicalSentence.audioUrl);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#ECEFF8] dark:bg-[#2A2A38] text-[#212121] dark:text-white hover:bg-[#E0E0E0] dark:hover:bg-[#333345] font-bold text-xs sm:text-sm transition-all btn-press cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#00897B] dark:text-[#03DAC5]" />
                <span>Vitesse lente (0.65x)</span>
              </button>
            </div>
          </div>

          {/* Pedagogical text */}
          <div className="p-5 rounded-2xl bg-[#00897B]/08 border border-[#00897B]/20 text-xs sm:text-sm text-[#00695C] dark:text-[#80CBC4] space-y-2">
            <p className="font-bold leading-relaxed">
              « Écoute la phrase, puis répète-la à voix haute : une fois lentement, une fois à vitesse normale. Dis-la trois fois, comme si tu posais la question à un ami. »
            </p>
            <div className="pt-2 border-t border-[#00897B]/15 text-[11px] sm:text-xs text-[#00796B] dark:text-[#B2DFDB] flex items-start gap-2">
              <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Astuce phonétique :</strong> Quand deux mots à 3ᵉ ton se suivent, le premier se prononce au 2ᵉ ton : on écrit <em>nǐ xiǎng</em>, on dit <em>ní xiǎng</em>.
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setActiveMainStep('structure')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#212121] dark:bg-white text-white dark:text-[#212121] font-black text-xs sm:text-sm btn-press cursor-pointer"
            >
              <span>Étape suivante : Structure</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 2 : STRUCTURE (Découpe mot à mot + Formule de Structure)              */}
      {/* ========================================================================= */}
      {activeMainStep === 'structure' && (
        <div className="space-y-6 animate-fadeIn">
          {/* 1. Tokens Grid (Découpe mot à mot) */}
          <div className="nixtio-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-6 shadow-sm">
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
                Découpe mot à mot
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#212121] dark:text-white">
                Touche chaque élément pour écouter et comprendre son rôle
              </h3>
            </div>

            {/* Tokens Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {model.typicalSentence.tokens.map((tok, idx) => {
                const isCurrent = activeTokenIdx === idx;
                return (
                  <div
                    key={tok.hanzi + idx}
                    onClick={() => {
                      setActiveTokenIdx(idx);
                      handlePlayAudio(tok.hanzi, 1.0, tok.audioUrl);
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer btn-press ${
                      isCurrent
                        ? 'border-[#6200EE] bg-[#6200EE]/10 scale-105 shadow-md'
                        : 'border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] hover:border-[#6200EE]/50'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl font-black text-[#212121] dark:text-white mb-1">
                      {tok.hanzi}
                    </div>
                    <div className="text-xs font-bold text-[#6200EE] dark:text-[#BB86FC]">
                      {tok.pinyin}
                    </div>
                    <div className="text-[11px] font-medium text-[#757575] dark:text-[#A0A0A0] mt-1 line-clamp-1">
                      {tok.french}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Dedicated Structure Card : [sujet] + 想 + [verbe] + 什么 */}
          <div className="nixtio-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#6200EE]/25 dark:border-[#6200EE]/35 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6200EE] dark:text-[#BB86FC]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
                  La Structure du Modèle
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">
                Méthode de la Combinaison
              </span>
            </div>

            {/* Visual Formula Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-2">
              {model.slots.map((slot, sIdx) => {
                const isFixed = slot.isLocked;
                const fixedOpt = isFixed ? slot.options[0] : null;
                const colorTheme = slot.colorTheme || 'purple';
                const colorClasses = {
                  purple: { bg: 'bg-[#6200EE]/10 dark:bg-[#6200EE]/20', border: 'border-[#6200EE]/30', text: 'text-[#6200EE] dark:text-[#BB86FC]', sub: 'text-[#757575] dark:text-[#B0B0B0]' },
                  emerald: { bg: 'bg-[#00897B]/10 dark:bg-[#00897B]/20', border: 'border-[#00897B]/30', text: 'text-[#00897B] dark:text-[#03DAC5]', sub: 'text-[#00796B] dark:text-[#80CBC4]' },
                  amber: { bg: 'bg-[#FF9800]/10 dark:bg-[#FF9800]/20', border: 'border-[#FF9800]/30', text: 'text-[#F57C00] dark:text-[#FFB74D]', sub: 'text-[#757575] dark:text-[#B0B0B0]' },
                  blue: { bg: 'bg-[#1E88E5]/10 dark:bg-[#1E88E5]/20', border: 'border-[#1E88E5]/30', text: 'text-[#1976D2] dark:text-[#64B5F6]', sub: 'text-[#1565C0] dark:text-[#90CAF9]' },
                  rose: { bg: 'bg-rose-500/10 dark:bg-rose-500/20', border: 'border-rose-500/30', text: 'text-rose-600 dark:text-rose-400', sub: 'text-[#757575] dark:text-[#B0B0B0]' },
                  indigo: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', border: 'border-indigo-500/30', text: 'text-indigo-600 dark:text-indigo-400', sub: 'text-[#757575] dark:text-[#B0B0B0]' },
                  teal: { bg: 'bg-teal-500/10 dark:bg-teal-500/20', border: 'border-teal-500/30', text: 'text-teal-600 dark:text-teal-400', sub: 'text-[#757575] dark:text-[#B0B0B0]' },
                }[colorTheme] || { bg: 'bg-[#6200EE]/10', border: 'border-[#6200EE]/30', text: 'text-[#6200EE]', sub: 'text-[#757575]' };

                return (
                  <React.Fragment key={slot.id}>
                    {sIdx > 0 && (
                      <span className="text-xl sm:text-2xl font-black text-[#757575] dark:text-[#A0A0A0]">+</span>
                    )}
                    <div className={`flex flex-col items-center px-4 py-3 rounded-2xl ${colorClasses.bg} border ${colorClasses.border} min-w-[90px] text-center`}>
                      <span className={`text-base sm:text-lg font-black ${colorClasses.text}`}>
                        {isFixed ? fixedOpt?.hanzi : `[${slot.label.replace(/^\d+\.\s*/, '').toLowerCase()}]`}
                      </span>
                      <span className={`text-[10px] font-bold ${colorClasses.sub} mt-0.5`}>
                        {isFixed ? `fixe · ${fixedOpt?.french}` : 'case mobile'}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Pedagogical insight */}
            {model.structureInsight && (
              <div
                className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed font-medium"
                dangerouslySetInnerHTML={{ __html: model.structureInsight }}
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveMainStep('ecoute')}
              className="text-xs sm:text-sm font-bold text-[#757575] hover:text-[#212121] dark:hover:text-white"
            >
              ← Retour Écoute
            </button>
            <button
              onClick={() => setActiveMainStep('repete')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#212121] dark:bg-white text-white dark:text-[#212121] font-black text-xs sm:text-sm btn-press cursor-pointer"
            >
              <span>Étape suivante : Répète</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 3 : RÉPÈTE                                                          */}
      {/* ========================================================================= */}
      {activeMainStep === 'repete' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="nixtio-card p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center mx-auto">
              <Volume2 className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl sm:text-2xl font-black text-[#212121] dark:text-white">
                Écoute, puis répète à voix haute
              </h3>
              <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
                Sans stress et sans note. Prends confiance en articulant distinctement chaque ton en mandarin.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#ECEFF8] dark:bg-[#252525] max-w-md mx-auto space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#212121] dark:text-white">
                {model.typicalSentence.hanzi}
              </div>
              <div className="text-sm font-bold text-[#6200EE] dark:text-[#BB86FC]">
                {model.typicalSentence.pinyin}
              </div>
            </div>

            <button
              onClick={() => handlePlayAudio(model.typicalSentence.hanzi, 1.0, model.typicalSentence.audioUrl)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#6200EE] hover:bg-[#5000CC] text-white font-black text-sm shadow-lg shadow-[#6200EE]/25 btn-press cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>Réécouter le modèle</span>
            </button>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setActiveMainStep('structure')}
              className="text-xs sm:text-sm font-bold text-[#757575] hover:text-[#212121] dark:hover:text-white"
            >
              ← Retour Structure
            </button>
            <button
              onClick={() => setActiveMainStep('combine')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#00897B] hover:bg-[#00796B] text-white font-black text-xs sm:text-sm shadow-md btn-press cursor-pointer"
            >
              <span>Découvrir la Méthode de la Combinaison</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ÉTAPE 4 : COMBINE (4 sous-étapes guidées + finale)                         */}
      {/* ========================================================================= */}
      {activeMainStep === 'combine' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Sub-step Ribbon Tabs (dynamiques d'après model.subSteps + Finale) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar p-1 bg-[#ECEFF8] dark:bg-[#181820] rounded-2xl border border-black/5 dark:border-white/5">
            {[
              ...model.subSteps.map((sub) => ({
                id: sub.subStepNumber,
                label: sub.title,
                subData: sub,
              })),
              { id: 'finale' as const, label: 'Tout mélanger', subData: null },
            ].map((tab) => {
              const isActive = combineSubStep === tab.id;
              return (
                <button
                  key={String(tab.id)}
                  onClick={(e) => {
                    (e.currentTarget as HTMLElement).scrollIntoView({
                      behavior: 'smooth',
                      block: 'nearest',
                      inline: 'start',
                    });
                    setCombineSubStep(tab.id as any);
                    if (tab.subData) {
                      const firstOptId =
                        tab.subData.featuredExamples[0]?.slotSelections[tab.subData.mobileSlotId] ||
                        tab.subData.allowedOptionIds?.[0] ||
                        tab.subData.otherOptions?.[0]?.id ||
                        model.slots.find((s) => s.id === tab.subData?.mobileSlotId)?.defaultOptionId;
                      if (firstOptId) setCurrentSubStepOptionId(firstOptId);
                    }
                  }}
                  className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer text-center whitespace-nowrap ${
                    isActive
                      ? 'bg-[#00897B] text-white shadow-sm'
                      : 'text-[#616161] dark:text-[#B0B0B0] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Section Repliable « La méthode » (visible avant la sous-étape 1) */}
          <div className="border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl bg-white dark:bg-[#1E1E1E] overflow-hidden">
            <button
              type="button"
              onClick={() => setIsMethodOpen(!isMethodOpen)}
              className="w-full p-4 flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[#212121] dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00897B] dark:text-[#03DAC5]" />
                <span>{model.pedagogicalMethod.title}</span>
              </div>
              {isMethodOpen ? <ChevronUp className="w-4 h-4 text-[#757575]" /> : <ChevronDown className="w-4 h-4 text-[#757575]" />}
            </button>

            {isMethodOpen && (
              <div className="p-4 pt-0 text-xs sm:text-sm text-[#616161] dark:text-[#A0A0A0] space-y-3 border-t border-black/5 dark:border-white/5">
                <p className="leading-relaxed">
                  {model.pedagogicalMethod.corePrinciple}
                </p>
                <div className="p-3 rounded-xl bg-[#00897B]/08 border border-[#00897B]/20 text-[#00695C] dark:text-[#80CBC4] text-xs">
                  {model.pedagogicalMethod.comparisonFr}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Built Sentence Display Box */}
          <div className="nixtio-card p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center space-y-3 shadow-md relative overflow-hidden">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black font-sans text-[#212121] dark:text-white">
              {activeSentence.hanzi}
            </div>
            <div className="text-sm sm:text-base font-bold text-[#00897B] dark:text-[#03DAC5]">
              {activeSentence.pinyin}
            </div>
            <div className="text-xs sm:text-sm font-medium text-[#757575] dark:text-[#B0B0B0] italic">
              « {activeSentence.french} »
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  handlePlayAudio(activeSentence.hanzi, 1.0, activeAudioUrl);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ECEFF8] dark:bg-[#2A2A38] hover:bg-[#E0E0E0] dark:hover:bg-[#333345] text-xs font-bold text-[#212121] dark:text-white btn-press cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#00897B]" />
                <span>Écouter cette phrase</span>
              </button>
            </div>
          </div>

          {/* =================================================================== */}
          {/* SOUS-ÉTAPES GUIDÉES 1, 2, 3, 4                                       */}
          {/* =================================================================== */}
          {combineSubStep !== 'finale' && currentSubStepData && (
            <div className="space-y-6">
              {/* Pedagogical text of this sub-step */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-xs sm:text-sm text-[#424242] dark:text-[#D6D6D6] leading-relaxed">
                {currentSubStepData.pedagogicalText}
              </div>

              {/* Collapsible "Le saviez-vous ?" */}
              {currentSubStepData.didYouKnow && (
                <div className="border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl bg-white dark:bg-[#1E1E1E] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setIsDidYouKnowOpen(!isDidYouKnowOpen)}
                    className="w-full p-3.5 flex items-center justify-between text-left text-xs font-bold text-[#00897B] dark:text-[#03DAC5] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      <span>{currentSubStepData.didYouKnow.title}</span>
                    </div>
                    {isDidYouKnowOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isDidYouKnowOpen && (
                    <div className="p-3.5 pt-0 text-xs text-[#616161] dark:text-[#A0A0A0] leading-relaxed border-t border-black/5 dark:border-white/5">
                      {currentSubStepData.didYouKnow.content}
                    </div>
                  )}
                </div>
              )}

              {/* 3 Featured Examples Cards */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
                  3 exemples mis en avant (touche pour composer et écouter) :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentSubStepData.featuredExamples.map((ex) => {
                    const optionId = ex.slotSelections[currentSubStepData.mobileSlotId];
                    const isSelected = currentSubStepOptionId === optionId;
                    return (
                      <div
                        key={ex.id}
                        onClick={() => {
                          if (optionId) setCurrentSubStepOptionId(optionId);
                          handlePlayAudio(ex.hanzi, 1.0, ex.audioUrl);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer btn-press ${
                          isSelected
                            ? 'border-[#00897B] bg-[#00897B]/10 shadow-sm'
                            : 'border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] hover:border-[#00897B]/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="text-base sm:text-lg font-black text-[#212121] dark:text-white">
                            {ex.hanzi}
                          </div>
                          {ex.audioUrl && (
                            <Volume2 className="w-3.5 h-3.5 text-[#00897B] shrink-0 mt-1" />
                          )}
                        </div>
                        <div className="text-xs font-bold text-[#00897B] dark:text-[#03DAC5] mt-0.5">
                          {ex.pinyin}
                        </div>
                        <div className="text-[11px] text-[#757575] dark:text-[#B0B0B0] mt-1 line-clamp-2">
                          « {ex.french} »
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* "Autres possibilités" toujours affiché, ouvert et sans accordéon */}
              {currentSubStepData.otherOptions.length > 0 && (
                <div className="p-4 sm:p-5 border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl bg-white dark:bg-[#1E1E1E] space-y-3">
                  <div className="text-xs sm:text-sm font-bold text-[#212121] dark:text-white flex items-center justify-between">
                    <span>
                      {currentSubStepData.otherOptionsTitle || 'Autres possibilités'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentSubStepData.otherOptions.map((opt) => {
                      const isSelected = currentSubStepOptionId === opt.id;
                      // Dynamic sentence builder avec respect des duos sémantiques naturels
                      const selections: Record<string, string> = {};
                      model.slots.forEach((s) => {
                        if (s.id === currentSubStepData.mobileSlotId) {
                          selections[s.id] = opt.id;
                        } else {
                          selections[s.id] = s.defaultOptionId || s.options[0]?.id;
                        }
                      });
                      if (model.pairedSlotDefaults?.[currentSubStepData.mobileSlotId]?.[opt.id]) {
                        Object.assign(
                          selections,
                          model.pairedSlotDefaults[currentSubStepData.mobileSlotId][opt.id]
                        );
                      }
                      const selectedTokens = model.slots.map((s) => {
                        const optId = selections[s.id];
                        return s.options.find((o) => o.id === optId) || s.options[0];
                      });
                      const fullSentenceHanzi = selectedTokens.map((t) => t.hanzi).join('') + (model.punctuation?.hanzi || '');
                      const modelFolder = model.id === 'spoken_hsk1_ep1' ? 'hsk1-01' : model.id;
                      const audioKey = model.slots.filter((s) => !s.isLocked).map((s) => selections[s.id]).join('_');
                      const optAudioUrl = `/audio/exercices-parles/${modelFolder}/all/${audioKey}.mp3`;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setCurrentSubStepOptionId(opt.id);
                            handlePlayAudio(fullSentenceHanzi, 1.0, optAudioUrl);
                          }}
                          className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer btn-press ${
                            isSelected
                              ? 'bg-[#00897B] text-white border-[#00897B] shadow-sm'
                              : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#212121] dark:text-white border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#00897B]'
                          }`}
                        >
                          <span>{opt.hanzi}</span>
                          <span className="opacity-75 text-[11px] ml-1.5 font-normal">({opt.pinyin})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Prompt à la pratique */}
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center text-xs font-bold text-purple-800 dark:text-purple-300">
                👉 À toi : forme une phrase et dis-la à voix haute !
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* FINALE : TOUT MÉLANGER (FACULTATIF)                                 */}
          {/* =================================================================== */}
          {combineSubStep === 'finale' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-[#ECEFF8] dark:bg-[#252525] text-xs sm:text-sm text-[#424242] dark:text-[#D6D6D6] space-y-3">
                <p className="leading-relaxed">
                  {model.finale.pedagogicalText}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#00897B] dark:text-[#03DAC5]">
                    Compteur officiel certifié :
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#00897B] text-white">
                    {model.finale.totalExpectedCombinations} phrases possibles
                  </span>
                </div>
              </div>

              {/* Sélecteurs dynamiques pour toutes les cases mobiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {model.slots
                  .filter((slot) => !slot.isLocked)
                  .map((slot) => {
                    const colorClasses: Record<string, string> = {
                      purple: 'text-[#6200EE] dark:text-[#BB86FC]',
                      emerald: 'text-[#00897B] dark:text-[#03DAC5]',
                      amber: 'text-[#F57C00] dark:text-[#FFB74D]',
                      blue: 'text-[#1976D2] dark:text-[#64B5F6]',
                      rose: 'text-rose-600 dark:text-rose-400',
                      indigo: 'text-indigo-600 dark:text-indigo-400',
                      teal: 'text-teal-600 dark:text-teal-400',
                    };
                    const colorClass = colorClasses[slot.colorTheme || 'purple'] || 'text-[#6200EE] dark:text-[#BB86FC]';

                    return (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-2"
                      >
                        <label className={`text-xs font-black uppercase tracking-wider ${colorClass}`}>
                          {slot.label} ({slot.options.length} options)
                        </label>
                        <select
                          value={finaleSelections[slot.id] || slot.options[0]?.id}
                          onChange={(e) => {
                            const nextVal = e.target.value;
                            setFinaleSelections((prev) => {
                              const next = { ...prev, [slot.id]: nextVal };
                              if (model.pairedSlotDefaults?.[slot.id]?.[nextVal]) {
                                Object.assign(next, model.pairedSlotDefaults[slot.id][nextVal]);
                              }
                              return next;
                            });
                          }}
                          className="w-full p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#2A2A2A] border border-[#E0E0E0] dark:border-[#333] text-xs font-bold text-[#212121] dark:text-white"
                        >
                          {slot.options.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.hanzi} ({opt.pinyin} — {opt.frenchName || opt.french})
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
              </div>

              {/* Bouton Shuffle */}
              <div className="text-center">
                <button
                  onClick={handleShuffleFinale}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#6200EE] hover:bg-[#5000CC] text-white font-bold text-xs sm:text-sm shadow-md btn-press cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Tirer une phrase au hasard</span>
                </button>
              </div>
            </div>
          )}

          {/* FIN DE L'ÉPISODE : 生词 & TERMINÉ                                  */}
          {/* =================================================================== */}
          <div className="pt-6 border-t border-[#E0E0E0] dark:border-[#2D2D2D] space-y-6">

            {/* Mots à retenir (生词) */}
            <div className="nixtio-card p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#212121] dark:text-white">
                Mots à retenir (生词 · shēngcí)
              </span>
              <div className="flex flex-wrap gap-2">
                {model.rawNewWords.map((w, idx) => (
                  <span
                    key={w.hanzi + idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#212121] dark:text-white"
                  >
                    <strong>{w.hanzi}</strong> <span className="text-[#6200EE] dark:text-[#BB86FC] text-[11px]">{w.pinyin}</span> <span className="text-[#757575] text-[10px]">({w.french})</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Bouton Universel Normalisé Terminé */}
            <div className="pt-4 flex justify-center">
              <button
                type="button"
                onClick={handleToggleCompleted}
                className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-black text-sm transition-all btn-press cursor-pointer shadow-lg ${
                  completed
                    ? 'bg-[#E53935] hover:bg-[#D32F2F] text-white shadow-[#E53935]/25'
                    : 'bg-[#6200EE] hover:bg-[#5000CC] text-white shadow-[#6200EE]/25'
                }`}
              >
                {completed ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>Terminé</span>
                  </>
                ) : (
                  <span>Marquer comme terminé</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
