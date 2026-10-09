'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Trophy,
  HelpCircle,
  BookOpen,
  Eye,
  EyeOff,
  ChevronLeft,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePreferences } from '@/context/PreferencesContext';
import type {
  ClientAudioSequenceItem,
  ClientExerciseSet,
  ClientExerciseQuestion,
  ClientMatchingDialogueItem,
} from '@/lib/server/exercisesCorrection';
import {
  repondreQuestionApi,
  terminerExerciceApi,
  revoirErreursApi,
  abandonnerExerciceApi,
  type AnswerResponse,
  type FinishExerciseResponse,
  type ReviewMistakesResponse,
} from '@/lib/services/exerciseClientService';
import { estDoubleEcoute } from '@/lib/exercices/regles';

type QuestionRevision = ReviewMistakesResponse['reviewQuestions'][number];

/** Étape de la séquence de synthèse vocale : une réplique, ou une pause. */
type EtapeAudio = ClientAudioSequenceItem & { isQuestionPause?: boolean; isRepeatPause?: boolean; pauseMs?: number };

interface HskExerciseRunnerProps {
  exercise: ClientExerciseSet;
  attemptId: string;
  onBack: () => void;
  onFinishSeries?: (result: FinishExerciseResponse) => void;
  onRestartNewAttempt: () => void;
}

export function HskExerciseRunner({
  exercise,
  attemptId,
  onBack,
  onFinishSeries,
  onRestartNewAttempt,
}: HskExerciseRunnerProps) {
  const { showPinyin: pinyinParDefaut, showFrenchTranslation } = usePreferences();
  // Bascule propre à l'exercice : ne modifie pas la préférence globale de l'apprenant.
  const [showPinyin, setShowPinyin] = useState(pinyinParDefaut);
  const [erreur, setErreur] = useState<string | null>(null);

  // État de navigation des questions
  const [currentIdx, setCurrentIdx] = useState(0);

  // Réponses utilisateur selon le type
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [selectedBoolean, setSelectedBoolean] = useState<boolean | null>(null);
  const [selectedMatches, setSelectedMatches] = useState<Record<string, string>>({}); // { dlg_id: img_id }

  const [isValidating, setIsValidating] = useState(false);
  const [correction, setCorrection] = useState<AnswerResponse | null>(null);

  // Historique des réponses de la tentative actuelle
  const [attemptHistory, setAttemptHistory] = useState<
    Array<{
      questionId: string;
      isCorrect: boolean;
      correction: AnswerResponse;
    }>
  >([]);

  // État audio
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPreparing, setIsAudioPreparing] = useState(false);
  const [activePlayingDialogueId, setActivePlayingDialogueId] = useState<string | null>(null);
  const [audioPlayingPhase, setAudioPlayingPhase] = useState<'dialogue' | 'question' | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<0.75 | 1.0>(1.0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const matchingSequenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Écran de fin et mode révision des erreurs
  const [isFinished, setIsFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<FinishExerciseResponse | null>(null);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

  // Mode révision des erreurs (0 impact score)
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [reviewQuestions, setReviewQuestions] = useState<QuestionRevision[]>([]);
  const [reviewIdx, setReviewIdx] = useState(0);

  // Timer de session
  const [startTime] = useState<number>(() => Date.now());

  // En révision, les questions arrivent du serveur avec leur correction : elles
  // ont la même forme d'affichage qu'une question de la série.
  const currentQuestion: ClientExerciseQuestion | undefined = isReviewMode
    ? (reviewQuestions[reviewIdx] as unknown as ClientExerciseQuestion | undefined)
    : exercise.questions[currentIdx];

  const qType = currentQuestion?.type || 'choice';

  // Référence pour enchaîner la synthèse vocale multi-locuteurs
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopAllAudio = () => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }
    if (matchingSequenceTimerRef.current) {
      clearTimeout(matchingSequenceTimerRef.current);
      matchingSequenceTimerRef.current = null;
    }
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
    setIsAudioPreparing(false);
    setActivePlayingDialogueId(null);
    setAudioPlayingPhase(null);
  };

  // Lecture audio principale (Type choice & true_false)
  const playCurrentAudio = () => {
    if (!currentQuestion) return;
    stopAllAudio();

    if (currentQuestion.audioUrl) {
      try {
        const audio = new Audio(currentQuestion.audioUrl);
        audio.playbackRate = playbackSpeed;
        audioRef.current = audio;

        setIsPlayingAudio(true);
        setAudioPlayingPhase('dialogue');

        audio.onended = () => {
          setIsPlayingAudio(false);
          setAudioPlayingPhase(null);
        };
        // `onerror` et le rejet de `play()` peuvent survenir tous les deux : un seul repli.
        let repliLance = false;
        const repli = () => {
          if (repliLance) return;
          repliLance = true;
          playSpeechSynthesisSequence();
        };
        audio.onerror = repli;
        audio.play().catch(repli);
        return;
      } catch {
        playSpeechSynthesisSequence();
        return;
      }
    }

    playSpeechSynthesisSequence();
  };

  const playSpeechSynthesisSequence = () => {
    if (!currentQuestion || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const isDoubleListen = estDoubleEcoute(exercise.level);
    const dialogueItems = (currentQuestion.audioSequence || []).filter((s) => !s.isQuestion);
    const questionItem = (currentQuestion.audioSequence || []).find((s) => s.isQuestion) || (
      currentQuestion.question ? {
        speakerGender: 'male' as const,
        text: currentQuestion.question.hanzi,
        isQuestion: true,
      } : null
    );

    const sequence: EtapeAudio[] = [];
    if (isDoubleListen) {
      sequence.push(...dialogueItems);
      if (questionItem) {
        sequence.push({ isQuestionPause: true, pauseMs: 1300, text: '', speakerGender: 'male' as const });
        sequence.push(questionItem);
      }
      sequence.push({ isRepeatPause: true, pauseMs: 1800, text: '', speakerGender: 'male' as const });
      sequence.push(...dialogueItems);
      if (questionItem) {
        sequence.push({ isQuestionPause: true, pauseMs: 1300, text: '', speakerGender: 'male' as const });
        sequence.push(questionItem);
      }
    } else {
      sequence.push(...dialogueItems);
      if (questionItem) {
        sequence.push({ isQuestionPause: true, pauseMs: 1300, text: '', speakerGender: 'male' as const });
        sequence.push(questionItem);
      }
    }

    if (sequence.length === 0) return;

    setIsPlayingAudio(true);
    let stepIndex = 0;

    const playNextStep = () => {
      if (stepIndex >= sequence.length) {
        setIsPlayingAudio(false);
        setAudioPlayingPhase(null);
        return;
      }

      const item = sequence[stepIndex];

      if (item.isRepeatPause || item.isQuestionPause) {
        stepIndex++;
        speechTimerRef.current = setTimeout(playNextStep, item.pauseMs);
        return;
      }

      setAudioPlayingPhase(item.isQuestion ? 'question' : 'dialogue');

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = 'zh-CN';
      utterance.rate = playbackSpeed === 0.75 ? 0.75 : (item.isQuestion ? 0.84 : 0.88);
      
      if (item.isQuestion) {
        utterance.pitch = item.speakerGender === 'female' ? 1.35 : 0.80;
      } else {
        utterance.pitch = item.speakerGender === 'female' ? 1.25 : 0.88;
      }

      utterance.onend = () => {
        stepIndex++;
        const nextItem: EtapeAudio | undefined = sequence[stepIndex];
        const pauseMs = nextItem?.isRepeatPause || nextItem?.isQuestionPause ? 0 : 400;
        speechTimerRef.current = setTimeout(playNextStep, pauseMs);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setAudioPlayingPhase(null);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNextStep();
  };

  // Lecture séquentielle complète des 3 dialogues (Partie 2 Association — style HSK officiel)
  const playMatchingSequence = (startIdx = 0) => {
    stopAllAudio();
    const dialogues = currentQuestion?.dialogues || [];
    if (dialogues.length === 0 || startIdx >= dialogues.length) {
      setIsPlayingAudio(false);
      setActivePlayingDialogueId(null);
      return;
    }

    const currentDlg = dialogues[startIdx];
    setActivePlayingDialogueId(currentDlg.id);
    setIsPlayingAudio(true);

    const onDialogueFinished = () => {
      const nextIdx = startIdx + 1;
      if (nextIdx < dialogues.length) {
        setActivePlayingDialogueId(null);
        // Pause naturelle de 2.5 secondes entre chaque dialogue (comme à l'épreuve HSK)
        matchingSequenceTimerRef.current = setTimeout(() => {
          playMatchingSequence(nextIdx);
        }, 2500);
      } else {
        setIsPlayingAudio(false);
        setActivePlayingDialogueId(null);
      }
    };

    if (currentDlg.audioUrl) {
      try {
        const audio = new Audio(currentDlg.audioUrl);
        audio.playbackRate = playbackSpeed;
        audioRef.current = audio;

        audio.onended = onDialogueFinished;

        let repliLance = false;
        const repli = () => {
          if (repliLance) return;
          repliLance = true;
          playDialogueSynthesis(currentDlg, onDialogueFinished);
        };
        audio.onerror = repli;
        audio.play().catch(repli);
        return;
      } catch {
        playDialogueSynthesis(currentDlg, onDialogueFinished);
        return;
      }
    }

    playDialogueSynthesis(currentDlg, onDialogueFinished);
  };

  // Lecture d'un dialogue individuel au clic (Partie 2 Association)
  const playSingleDialogueAudio = (dialogueItem: ClientMatchingDialogueItem) => {
    stopAllAudio();
    setActivePlayingDialogueId(dialogueItem.id);
    setIsPlayingAudio(true);

    if (dialogueItem.audioUrl) {
      try {
        const audio = new Audio(dialogueItem.audioUrl);
        audio.playbackRate = playbackSpeed;
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlayingAudio(false);
          setActivePlayingDialogueId(null);
        };
        let repliLance = false;
        const repli = () => {
          if (repliLance) return;
          repliLance = true;
          playDialogueSynthesis(dialogueItem);
        };
        audio.onerror = repli;
        audio.play().catch(repli);
        return;
      } catch {
        playDialogueSynthesis(dialogueItem);
        return;
      }
    }

    playDialogueSynthesis(dialogueItem);
  };

  const playDialogueSynthesis = (dialogueItem: ClientMatchingDialogueItem, onFinished?: () => void) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlayingAudio(false);
      setActivePlayingDialogueId(null);
      onFinished?.();
      return;
    }

    const items = dialogueItem.audioSequence || [];
    if (items.length === 0) {
      setIsPlayingAudio(false);
      setActivePlayingDialogueId(null);
      onFinished?.();
      return;
    }

    // Règle de double écoute pour les exercices audio (HSK 1-3 et dialogues d'association)
    const isDoubleListen = estDoubleEcoute(exercise.level);
    const sequence: EtapeAudio[] = [];
    if (isDoubleListen) {
      sequence.push(...items);
      sequence.push({ isRepeatPause: true, pauseMs: 1800, text: '', speakerGender: 'male' });
      sequence.push(...items);
    } else {
      sequence.push(...items);
    }

    let idx = 0;
    const playNext = () => {
      if (idx >= sequence.length) {
        if (onFinished) {
          onFinished();
        } else {
          setIsPlayingAudio(false);
          setActivePlayingDialogueId(null);
        }
        return;
      }

      const item = sequence[idx];
      if (item.isRepeatPause) {
        idx++;
        speechTimerRef.current = setTimeout(playNext, item.pauseMs);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = 'zh-CN';
      utterance.rate = playbackSpeed === 0.75 ? 0.75 : 0.88;
      utterance.pitch = item.speakerGender === 'female' ? 1.25 : 0.88;

      utterance.onend = () => {
        idx++;
        const next = sequence[idx];
        const pauseMs = next?.isRepeatPause ? 0 : 350;
        speechTimerRef.current = setTimeout(playNext, pauseMs);
      };

      utterance.onerror = () => {
        if (onFinished) {
          onFinished();
        } else {
          setIsPlayingAudio(false);
          setActivePlayingDialogueId(null);
        }
      };

      window.speechSynthesis.speak(utterance);
    };

    playNext();
  };

  // Réinitialisation & auto-play à chaque question (délai de 2 secondes d'observation)
  useEffect(() => {
    setErreur(null);
    const revision = isReviewMode ? reviewQuestions[reviewIdx] : undefined;
    if (revision) {
      // Révision : la correction est déjà connue, on affiche la réponse donnée et la bonne.
      setSelectedChoiceId(revision.votreReponse?.selectedChoiceId ?? null);
      setSelectedBoolean(revision.votreReponse?.selectedBoolean ?? null);
      setSelectedMatches(revision.votreReponse?.selectedMatches ?? {});
      setCorrection({
        isCorrect: false,
        correctChoiceId: revision.correctChoiceId,
        dialogue: revision.dialogue,
        question: revision.question,
        correctValue: revision.correctValue,
        audioText: revision.audioText,
        correctMatches: revision.correctMatches,
        images: revision.images,
        dialogues: (revision.dialogues || []).map((d) => ({ id: d.id, dialogue: d.dialogue })),
        explanationFr: revision.explanationFr,
        keyVocabulary: revision.keyVocabulary,
      });
    } else {
      setSelectedChoiceId(null);
      setSelectedBoolean(null);
      setSelectedMatches({});
      setCorrection(null);
    }

    // Auto-play pour TOUTES les rubriques après 2 secondes (observation de la consigne et des images)
    setIsAudioPreparing(true);
    autoPlayTimerRef.current = setTimeout(() => {
      setIsAudioPreparing(false);
      if (qType === 'matching_images') {
        playMatchingSequence(0);
      } else {
        playCurrentAudio();
      }
    }, 2000);

    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
      stopAllAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIdx, isReviewMode, reviewIdx, qType]);

  // Handler d'association anti-doublon pour Partie 2
  const handleSelectMatch = (dialogueId: string, imageId: string) => {
    if (correction || isValidating) return;

    setSelectedMatches((prev) => {
      const updated = { ...prev };
      
      // Si cette image était déjà attribuée à un autre dialogue, on libère l'autre dialogue
      for (const [dId, imgId] of Object.entries(updated)) {
        if (imgId === imageId && dId !== dialogueId) {
          delete updated[dId];
        }
      }

      if (updated[dialogueId] === imageId) {
        delete updated[dialogueId]; // Toggle off
      } else {
        updated[dialogueId] = imageId;
      }

      return updated;
    });
  };

  // Validation d'une réponse (Verrouillage serveur)
  const handleValidateAnswer = async () => {
    if (!currentQuestion || isValidating || correction) return;

    let payload: { selectedChoiceId?: string; selectedBoolean?: boolean; selectedMatches?: Record<string, string> } = {};

    if (qType === 'true_false') {
      if (selectedBoolean === null) return;
      payload = { selectedBoolean };
    } else if (qType === 'matching_images') {
      if (Object.keys(selectedMatches).length !== 3) return;
      payload = { selectedMatches };
    } else {
      if (!selectedChoiceId) return;
      payload = { selectedChoiceId };
    }

    setIsValidating(true);
    setErreur(null);
    try {
      const resultat = await repondreQuestionApi(attemptId, currentQuestion.id, payload);
      if (!resultat.ok) {
        setErreur(resultat.erreur);
        return;
      }
      const resp = resultat.data;

      setCorrection(resp);
      setAttemptHistory((prev) => [
        ...prev,
        {
          questionId: currentQuestion.id,
          isCorrect: resp.isCorrect,
          correction: resp,
        },
      ]);

      if (resp.isCorrect) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.65 },
            colors: ['#00BFA5', '#03DAC5', '#6200EE', '#FFD700'],
          });
        } catch {}
      }
    } finally {
      setIsValidating(false);
    }
  };

  // Passer à la question suivante ou finaliser la série
  const handleNext = async () => {
    if (isReviewMode) {
      if (reviewIdx < reviewQuestions.length - 1) {
        setReviewIdx((prev) => prev + 1);
      } else {
        setIsReviewMode(false);
      }
      return;
    }

    if (currentIdx < exercise.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsSubmittingFinal(true);
      setErreur(null);
      try {
        const timeSpentSec = Math.round((Date.now() - startTime) / 1000);
        const bonnesReponses = attemptHistory.filter((h) => h.isCorrect).length;
        const resultat = await terminerExerciceApi(attemptId, timeSpentSec, exercise.id, bonnesReponses);
        if (!resultat.ok) {
          setErreur(resultat.erreur);
          return;
        }
        const res = resultat.data;
        setFinalResult(res);
        setIsFinished(true);

        if (res.isSucceed) {
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#6200EE', '#03DAC5', '#FFD700', '#00BFA5', '#E91E63'],
            });
          } catch {}
        }

        if (onFinishSeries) {
          onFinishSeries(res);
        }
      } finally {
        setIsSubmittingFinal(false);
      }
    }
  };

  // Lancement du mode « Revoir les questions manquées »
  const handleStartReviewMistakes = async () => {
    setErreur(null);
    const resultat = await revoirErreursApi(exercise.id);
    if (!resultat.ok) {
      setErreur(resultat.erreur);
      return;
    }
    if (resultat.data.reviewQuestions.length === 0) {
      setErreur('Aucune erreur enregistrée à revoir sur cette série.');
      return;
    }
    setReviewQuestions(resultat.data.reviewQuestions);
    setReviewIdx(0);
    setIsReviewMode(true);
  };

  /** Quitter : une tentative non terminée est fermée côté serveur. */
  const quitter = () => {
    stopAllAudio();
    if (!isFinished) void abandonnerExerciceApi(attemptId);
    onBack();
  };

  const bandeauErreur = erreur ? (
    <div
      role="alert"
      className="mb-4 p-3 rounded-2xl bg-[#E53935]/10 border border-[#E53935]/30 text-[#C62828] dark:text-[#FF8A80] text-xs sm:text-sm font-bold"
    >
      {erreur}
    </div>
  ) : null;

  // =========================================================================
  // ÉCRAN DE FIN DE SÉRIE (RÉSULTATS & BILAN)
  // (masqué pendant la révision des questions manquées)
  // =========================================================================
  if (isFinished && finalResult && !isReviewMode) {
    const wrongCount = finalResult.totalQuestions - finalResult.score;

    return (
      <div className="max-w-3xl mx-auto py-6 sm:py-10 px-4 animate-fadeIn">
        {bandeauErreur}
        <div className="nixtio-card bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 sm:p-10 border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 mb-4">
            <Trophy className="w-10 h-10 text-[#6200EE] dark:text-[#BB86FC]" />
          </div>

          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#212121] dark:text-[#F5F5F5]">
            {finalResult.isSucceed ? 'Félicitations !' : 'Bon entraînement !'}
          </h2>
          <p className="text-sm sm:text-base text-[#757575] dark:text-[#A0A0A0] mt-1 max-w-md mx-auto">
            {finalResult.percentage === 100
              ? 'Score parfait ! Votre compréhension auditive sur cette série est irréprochable.'
              : finalResult.isSucceed
              ? 'Vous avez réussi cette série (au moins deux tiers des points). Continuez ainsi !'
              : 'Prenez le temps d’écouter et d’analyser les répliques manquées pour progresser.'}
          </p>

          {/* Grand Score Display */}
          <div className="my-8 p-6 rounded-2xl bg-[#FAFAFA] dark:bg-[#121212] border border-[#E0E0E0] dark:border-[#2D2D2D] inline-block min-w-[240px]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] block mb-1">
              Score Final
            </span>
            <div className="font-display font-black text-5xl sm:text-6xl text-[#6200EE] dark:text-[#BB86FC]">
              {finalResult.score} <span className="text-2xl text-[#757575]">/ {finalResult.totalQuestions}</span>
            </div>
            <div className="text-sm font-bold text-[#00BFA5] mt-2">
              {finalResult.percentage}% de réussite
            </div>
            {finalResult.enregistre === false && (
              <div className="mt-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                Résultat non enregistré (service momentanément indisponible).
              </div>
            )}
            {finalResult.isNewBestScore && (
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                Nouveau Record Personnel !
              </div>
            )}
          </div>

          {/* Actions & Boutons de fin */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#F0F0F0] dark:border-[#2D2D2D]">
            {wrongCount > 0 && (
              <button
                onClick={handleStartReviewMistakes}
                type="button"
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#2D2D2D] border border-[#E0E0E0] dark:border-[#3D3D3D] text-[#212121] dark:text-[#F5F5F5] font-bold text-sm hover:bg-[#F0F0F0] transition-colors btn-press cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>Revoir les questions manquées ({wrongCount})</span>
              </button>
            )}

            <button
              onClick={onRestartNewAttempt}
              type="button"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#6200EE] text-white font-bold text-sm hover:bg-[#5000CA] transition-colors btn-press cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-[#6200EE]/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Refaire la série</span>
            </button>

            <button
              onClick={onBack}
              type="button"
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#151515] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white font-bold text-sm transition-colors btn-press cursor-pointer"
            >
              Retour à la liste des séries
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <p className="text-[#757575]">Chargement de la question...</p>
      </div>
    );
  }

  const isButtonDisabled = () => {
    if (isValidating || !!correction) return true;
    if (qType === 'true_false') return selectedBoolean === null;
    if (qType === 'matching_images') return Object.keys(selectedMatches).length !== 3;
    return !selectedChoiceId;
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-8 px-3 sm:px-4 animate-fadeIn">
      {bandeauErreur}
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-3 mb-6">
        <button
          onClick={isReviewMode ? () => setIsReviewMode(false) : quitter}
          type="button"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors btn-press cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{isReviewMode ? 'Retour aux résultats' : 'Quitter l’exercice'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Toggle Pinyin */}
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            type="button"
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all btn-press flex items-center gap-1.5 ${
              showPinyin
                ? 'bg-[#6200EE]/10 border-[#6200EE]/40 text-[#6200EE] dark:text-[#BB86FC]'
                : 'bg-[#FAFAFA] dark:bg-[#1E1E1E] border-[#E0E0E0] dark:border-[#2D2D2D] text-[#757575] dark:text-[#A0A0A0]'
            }`}
          >
            {showPinyin ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Pinyin</span>
          </button>

          {isReviewMode ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 text-xs font-bold">
              <RotateCcw className="w-3.5 h-3.5" />
              Mode Révision ({reviewIdx + 1} / {reviewQuestions.length})
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
                {currentIdx + 1}/{exercise.questions.length}
              </div>
              <div className="w-20 sm:w-28 h-2 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden">
                <div
                  className="h-full bg-[#6200EE] transition-all duration-300 rounded-full"
                  style={{
                    width: `${((currentIdx + (correction ? 1 : 0)) / exercise.questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Exercise Card */}
      <div className="nixtio-card bg-white dark:bg-[#1E1E1E] rounded-3xl p-5 sm:p-8 border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xl space-y-6">
        
        {/* =================================================================== */}
        {/* FORMAT B — PARTIE 1 : VRAI OU FAUX (Image + Mot)                   */}
        {/* =================================================================== */}
        {qType === 'true_false' && (
          <div className="space-y-6">
            {/* Header Audio & Prompt */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#151515] border border-[#E0E0E0] dark:border-[#2D2D2D] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={playCurrentAudio}
                  type="button"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all btn-press cursor-pointer shrink-0 ${
                    isPlayingAudio
                      ? 'bg-[#00BFA5] text-white shadow-lg shadow-[#00BFA5]/30 animate-pulse ring-4 ring-[#00BFA5]/30'
                      : isAudioPreparing
                      ? 'bg-[#6200EE] text-white shadow-lg shadow-[#6200EE]/30 animate-pulse ring-4 ring-[#6200EE]/40'
                      : 'bg-[#6200EE] text-white shadow-lg shadow-[#6200EE]/30 hover:bg-[#5000CA] ring-2 ring-[#6200EE]/20'
                  }`}
                  title="Écouter l’enregistrement"
                >
                  <Volume2 className="w-7 h-7" />
                </button>
                <div>
                  <div className="font-bold text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5] flex items-center gap-2">
                    Partie 1 — Vrai ou Faux
                    {isPlayingAudio && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#00BFA5]/15 text-[#00897B] dark:text-[#03DAC5]">
                        <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                        Audio en cours...
                      </span>
                    )}
                    {isAudioPreparing && !isPlayingAudio && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-current" />
                        L’audio démarre...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                    {isPlayingAudio
                      ? 'Écoutez attentivement...'
                      : isAudioPreparing
                      ? '🎧 Préparez-vous, l’audio va commencer...'
                      : '🎧 Cliquez sur le bouton audio pour écouter.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setPlaybackSpeed((s) => (s === 1.0 ? 0.75 : 1.0))}
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] text-xs font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white transition-colors cursor-pointer"
                >
                  ⚡ {playbackSpeed}x
                </button>
                <button
                  onClick={playCurrentAudio}
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#2D2D2D] border border-[#E0E0E0] dark:border-[#3D3D3D] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Réécouter
                </button>
              </div>
            </div>

            {/* Illustration */}
            <div className="max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#121212] aspect-square shadow-sm flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentQuestion.imageUrl}
                alt={currentQuestion.imageAlt || 'Illustration Vrai ou Faux'}
                className="w-full h-full object-contain rounded-xl"
              />
            </div>

            {/* Question Prompt */}
            <div className="text-center">
              <h3 className="font-display font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5]">
                {currentQuestion.promptFr || 'L’illustration correspond-elle au mot ou à la phrase entendue ?'}
              </h3>
            </div>

            {/* Choix Vrai / Faux */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { val: true, label: 'Vrai', icon: CheckCircle2, color: '#00BFA5' },
                { val: false, label: 'Faux', icon: XCircle, color: '#E53935' },
              ].map((opt) => {
                const isSelected = selectedBoolean === opt.val;
                const isLocked = !!correction || isValidating;

                let cardStyle = 'border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#191919] hover:border-[#6200EE]/50';

                if (isSelected && !correction) {
                  cardStyle = 'border-[#6200EE] bg-[#6200EE]/5 dark:bg-[#6200EE]/10 ring-2 ring-[#6200EE] shadow-md';
                }

                if (correction) {
                  if (opt.val === correction.correctValue) {
                    cardStyle = 'border-[#00BFA5] bg-[#00BFA5]/10 dark:bg-[#00BFA5]/15 ring-2 ring-[#00BFA5]';
                  } else if (isSelected && !correction.isCorrect) {
                    cardStyle = 'border-[#E53935] bg-[#E53935]/10 dark:bg-[#E53935]/15 ring-2 ring-[#E53935]';
                  } else {
                    cardStyle = 'opacity-40 border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#151515]';
                  }
                }

                const IconComponent = opt.icon;

                return (
                  <button
                    key={opt.label}
                    onClick={() => !isLocked && setSelectedBoolean(opt.val)}
                    disabled={isLocked}
                    type="button"
                    className={`p-5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${cardStyle} ${
                      isLocked ? 'cursor-default' : 'cursor-pointer btn-press'
                    }`}
                  >
                    <IconComponent className="w-8 h-8" style={{ color: opt.color }} />
                    <span className="font-display font-black text-lg text-[#212121] dark:text-white">
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* FORMAT B — PARTIE 2 : ASSOCIATION 3 DIALOGUES <-> 3 IMAGES         */}
        {/* =================================================================== */}
        {qType === 'matching_images' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00BFA5] dark:text-[#03DAC5] flex items-center justify-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" />
                Partie 2 — Association Images & Dialogues
              </span>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5]">
                {currentQuestion.promptFr || 'Écoutez chaque dialogue et associez-le à la bonne image.'}
              </h3>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                Chaque image ne peut être associée qu’à un seul dialogue. 1 point si les 3 correspondances sont exactes.
              </p>
            </div>

            {/* Header Audio Séquentiel (3 Dialogues) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#151515] border border-[#E0E0E0] dark:border-[#2D2D2D] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => playMatchingSequence(0)}
                  type="button"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all btn-press cursor-pointer shrink-0 ${
                    isPlayingAudio
                      ? 'bg-[#00BFA5] text-white shadow-lg shadow-[#00BFA5]/30 animate-pulse ring-4 ring-[#00BFA5]/30'
                      : isAudioPreparing
                      ? 'bg-[#6200EE] text-white shadow-lg shadow-[#6200EE]/30 animate-pulse ring-4 ring-[#6200EE]/40'
                      : 'bg-[#6200EE] text-white shadow-lg shadow-[#6200EE]/30 hover:bg-[#5000CA] ring-2 ring-[#6200EE]/20'
                  }`}
                  title="Écouter toute la séquence des 3 dialogues (1 ➔ 2 ➔ 3)"
                >
                  <Volume2 className="w-7 h-7" />
                </button>
                <div>
                  <div className="font-bold text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5] flex items-center gap-2">
                    Séquence des 3 Dialogues
                    {isPlayingAudio && activePlayingDialogueId && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#00BFA5]/15 text-[#00897B] dark:text-[#03DAC5]">
                        <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                        Dialogue {(currentQuestion.dialogues || []).findIndex((d) => d.id === activePlayingDialogueId) + 1} en cours...
                      </span>
                    )}
                    {isAudioPreparing && !isPlayingAudio && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-current" />
                        L’écoute démarre...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                    {isPlayingAudio
                      ? 'Écoutez attentivement chaque dialogue dans l’ordre (1 ➔ 2 ➔ 3).'
                      : isAudioPreparing
                      ? '🎧 Préparez-vous, la séquence audio va commencer...'
                      : '🎧 Cliquez pour lancer la séquence complète des 3 dialogues.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setPlaybackSpeed((s) => (s === 1.0 ? 0.75 : 1.0))}
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] text-xs font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white transition-colors cursor-pointer"
                >
                  ⚡ {playbackSpeed}x
                </button>
                <button
                  onClick={() => playMatchingSequence(0)}
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#2D2D2D] border border-[#E0E0E0] dark:border-[#3D3D3D] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Réécouter tout
                </button>
              </div>
            </div>

            {/* 3 Large Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(currentQuestion.images || []).map((img, idx) => {
                const labelLetter = String.fromCharCode(65 + idx); // A, B, C
                const assignedDialogueKey = Object.keys(selectedMatches).find(
                  (dId) => selectedMatches[dId] === img.id
                );
                const assignedIndex = assignedDialogueKey
                  ? (currentQuestion.dialogues || []).findIndex((d) => d.id === assignedDialogueKey) + 1
                  : null;

                return (
                  <div
                    key={img.id}
                    className={`relative rounded-3xl border-2 p-3 bg-white dark:bg-[#151515] transition-all flex flex-col items-center justify-between shadow-sm hover:shadow-md ${
                      assignedIndex
                        ? 'border-[#00BFA5] ring-4 ring-[#00BFA5]/20 shadow-md'
                        : 'border-[#E0E0E0] dark:border-[#2D2D2D]'
                    }`}
                  >
                    {/* Badge Lettre Image (A, B, C) */}
                    <div className="absolute top-3 left-3 z-10 w-9 h-9 rounded-2xl bg-[#6200EE] text-white text-base font-black flex items-center justify-center shadow-lg">
                      {labelLetter}
                    </div>

                    <div className="w-full h-48 sm:h-52 rounded-2xl overflow-hidden bg-[#FAFAFA] dark:bg-black/40 flex items-center justify-center p-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.imageUrl}
                        alt={img.altText || `Image ${labelLetter}`}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3 text-xs font-bold text-center w-full">
                      {assignedIndex ? (
                        <span className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 rounded-xl bg-[#00BFA5]/15 text-[#00897B] dark:text-[#03DAC5] font-black">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Associée au Dialogue {assignedIndex}
                        </span>
                      ) : (
                        <span className="text-[#757575] dark:text-[#A0A0A0] block py-1.5">
                          Image {labelLetter}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3 Dialogue Cards & Simple A, B, C Selectors */}
            <div className="space-y-3 pt-2">
              {(currentQuestion.dialogues || []).map((dlg, dIdx) => {
                const dialogueNumber = dIdx + 1;
                const isThisPlaying = isPlayingAudio && activePlayingDialogueId === dlg.id;
                const currentAssignedImgId = selectedMatches[dlg.id];

                return (
                  <div
                    key={dlg.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
                      isThisPlaying
                        ? 'bg-[#00BFA5]/5 dark:bg-[#00BFA5]/10 border-[#00BFA5] ring-2 ring-[#00BFA5]/30 shadow-md'
                        : 'bg-[#FAFAFA] dark:bg-[#151515] border-[#E0E0E0] dark:border-[#2D2D2D]'
                    }`}
                  >
                    {/* Left: Audio Player */}
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => playSingleDialogueAudio(dlg)}
                        type="button"
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all btn-press cursor-pointer shrink-0 ${
                          isThisPlaying
                            ? 'bg-[#00BFA5] text-white shadow-lg shadow-[#00BFA5]/30 animate-pulse ring-4 ring-[#00BFA5]/30'
                            : 'bg-[#6200EE] text-white hover:bg-[#5000CA] shadow-md ring-2 ring-[#6200EE]/20'
                        }`}
                        title={`Écouter Dialogue ${dialogueNumber}`}
                      >
                        <Volume2 className="w-6 h-6" />
                      </button>
                      <div className="text-left">
                        <span className="font-bold text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5] flex items-center gap-2">
                          Dialogue {dialogueNumber}
                          {isThisPlaying && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#00BFA5]/20 text-[#00897B] dark:text-[#03DAC5]">
                              <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping" />
                              En cours
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                          {isThisPlaying ? '🔊 Lecture en cours...' : 'Cliquez pour écouter'}
                        </span>
                      </div>
                    </div>

                    {/* Right: Direct A, B, C Buttons */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] mr-1 hidden sm:inline">
                        Image :
                      </span>
                      {(currentQuestion.images || []).map((img, imgIdx) => {
                        const letter = String.fromCharCode(65 + imgIdx);
                        const isSelected = currentAssignedImgId === img.id;
                        const isLocked = !!correction || isValidating;

                        return (
                          <button
                            key={img.id}
                            onClick={() => handleSelectMatch(dlg.id, img.id)}
                            disabled={isLocked}
                            type="button"
                            className={`w-12 h-11 sm:w-14 sm:h-12 rounded-2xl font-black text-sm sm:text-base transition-all btn-press flex items-center justify-center gap-1 ${
                              isSelected
                                ? 'bg-[#00BFA5] text-white shadow-lg shadow-[#00BFA5]/30 ring-2 ring-[#00BFA5]'
                                : 'bg-white dark:bg-[#252525] border-2 border-[#E0E0E0] dark:border-[#333] text-[#212121] dark:text-[#F5F5F5] hover:border-[#6200EE]'
                            } ${isLocked ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <span>{letter}</span>
                            {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* FORMAT A & PARTIE 3 DU FORMAT B : DIALOGUE + QUESTION + 3 CHOIX     */}
        {/* =================================================================== */}
        {qType === 'choice' && currentQuestion.question && (
          <div className="space-y-6">
            {/* Étape 1 : Lecteur Audio Immersif (Écoute à l'aveugle) */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#FAFAFA] dark:bg-[#151515] border border-[#E0E0E0] dark:border-[#2D2D2D] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={playCurrentAudio}
                  type="button"
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all btn-press cursor-pointer shrink-0 ${
                    isPlayingAudio
                      ? 'bg-[#00BFA5] text-white shadow-lg shadow-[#00BFA5]/30 animate-pulse ring-4 ring-[#00BFA5]/30'
                      : isAudioPreparing
                      ? 'bg-[#6200EE] text-white shadow-lg shadow-[#6200EE]/30 animate-pulse ring-4 ring-[#6200EE]/40'
                      : 'bg-[#6200EE] text-white shadow-lg shadow-[#6200EE]/30 hover:bg-[#5000CA] ring-2 ring-[#6200EE]/20'
                  }`}
                  title="Écouter le dialogue"
                >
                  <Volume2 className="w-7 h-7" />
                </button>
                <div>
                  <div className="font-bold text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5] flex items-center gap-2">
                    Écoute du Dialogue
                    {isPlayingAudio && (
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        audioPlayingPhase === 'question'
                          ? 'bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]'
                          : 'bg-[#00BFA5]/15 text-[#00897B] dark:text-[#03DAC5]'
                      }`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                        {audioPlayingPhase === 'question' ? '❓ Question en cours...' : '💬 Dialogue en cours...'}
                      </span>
                    )}
                    {isAudioPreparing && !isPlayingAudio && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-current" />
                        L’audio démarre...
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                    {isPlayingAudio
                      ? estDoubleEcoute(exercise.level)
                        ? 'Écoutez attentivement le cycle complet (répété 2 fois).'
                        : 'Écoutez attentivement le cycle complet.'
                      : isAudioPreparing
                      ? '🎧 Préparez-vous, le dialogue va commencer...'
                      : '🎧 Cliquez sur le bouton audio pour lancer l’écoute.'}
                  </p>
                </div>
              </div>

              {/* Vitesse de lecture & Bouton Réécouter */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setPlaybackSpeed((s) => (s === 1.0 ? 0.75 : 1.0))}
                  type="button"
                  className="px-3 py-1.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] text-xs font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white transition-colors cursor-pointer"
                >
                  ⚡ {playbackSpeed}x
                </button>
                <button
                  onClick={playCurrentAudio}
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#2D2D2D] border border-[#E0E0E0] dark:border-[#3D3D3D] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#F5F5F5] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Réécouter
                </button>
              </div>
            </div>

            {/* Énoncé de la Question (问) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  Question
                </span>
              </div>

              <h3 className="font-display font-bold text-lg sm:text-xl text-[#212121] dark:text-[#F5F5F5] leading-snug">
                {currentQuestion.question.hanzi}
              </h3>

              {/* Pinyin dynamique de la question */}
              {showPinyin && currentQuestion.question.pinyin && (
                <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#6200EE] dark:text-[#BB86FC] font-mono tracking-wide animate-fadeIn">
                  {currentQuestion.question.pinyin}
                </p>
              )}

              {/* Traduction française révélée UNIQUEMENT après validation */}
              {correction && showFrenchTranslation && currentQuestion.question.french && (
                <p className="mt-1 text-xs sm:text-sm font-medium text-[#616161] dark:text-[#BDBDBD] tracking-normal leading-relaxed animate-fadeIn">
                  {currentQuestion.question.french}
                </p>
              )}
            </div>

            {/* Choix de Réponses (A, B, C) */}
            <div className="space-y-3">
              {(currentQuestion.choices || []).map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                const isLocked = !!correction || isValidating;

                let cardStyle = 'border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#191919] hover:border-[#6200EE]/50';

                if (isSelected && !correction) {
                  cardStyle = 'border-[#6200EE] bg-[#6200EE]/5 dark:bg-[#6200EE]/10 shadow-md';
                }

                if (correction) {
                  if (choice.id === correction.correctChoiceId) {
                    cardStyle = 'border-[#00BFA5] bg-[#00BFA5]/10 dark:bg-[#00BFA5]/15 ring-2 ring-[#00BFA5]';
                  } else if (isSelected && !correction.isCorrect) {
                    cardStyle = 'border-[#E53935] bg-[#E53935]/10 dark:bg-[#E53935]/15 ring-2 ring-[#E53935]';
                  } else {
                    cardStyle = 'opacity-50 border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#151515]';
                  }
                }

                return (
                  <button
                    key={choice.id}
                    onClick={() => !isLocked && setSelectedChoiceId(choice.id)}
                    disabled={isLocked}
                    type="button"
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 ${cardStyle} ${
                      isLocked ? 'cursor-default' : 'cursor-pointer btn-press'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl font-display font-black text-sm flex items-center justify-center shrink-0 ${
                          isSelected && !correction
                            ? 'bg-[#6200EE] text-white'
                            : correction && choice.id === correction.correctChoiceId
                            ? 'bg-[#00BFA5] text-white'
                            : correction && isSelected && !correction.isCorrect
                            ? 'bg-[#E53935] text-white'
                            : 'bg-[#FAFAFA] dark:bg-[#2D2D2D] text-[#757575] dark:text-[#A0A0A0]'
                        }`}
                      >
                        {choice.label}
                      </span>

                      <div>
                        <div className="font-bold text-base text-[#212121] dark:text-[#F5F5F5]">
                          {choice.hanzi}
                        </div>
                        {showPinyin && choice.pinyin && (
                          <div className="text-xs text-[#6200EE] dark:text-[#BB86FC] font-mono">
                            {choice.pinyin}
                          </div>
                        )}
                        {correction && showFrenchTranslation && choice.french && (
                          <div className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                            {choice.french}
                          </div>
                        )}
                      </div>
                    </div>

                    {correction && choice.id === correction.correctChoiceId && (
                      <CheckCircle2 className="w-5 h-5 text-[#00BFA5] shrink-0" />
                    )}
                    {correction && isSelected && !correction.isCorrect && (
                      <XCircle className="w-5 h-5 text-[#E53935] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* BOUTON D'ACTION (VALIDER / CONTINUER)                               */}
        {/* =================================================================== */}
        <div className="pt-4 border-t border-[#F0F0F0] dark:border-[#2D2D2D]">
          {!correction ? (
            <button
              onClick={handleValidateAnswer}
              disabled={isButtonDisabled()}
              type="button"
              className={`w-full py-4 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 ${
                isButtonDisabled()
                  ? 'bg-[#E0E0E0] dark:bg-[#2D2D2D] text-[#9E9E9E] dark:text-[#616161] cursor-not-allowed'
                  : 'bg-[#6200EE] text-white hover:bg-[#5000CA] shadow-lg shadow-[#6200EE]/25 btn-press cursor-pointer'
              }`}
            >
              {isValidating ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Vérification sécurisée...</span>
                </>
              ) : (
                <>
                  <span>Valider la réponse</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {/* Panneau de Correction & Explication */}
              <div
                className={`p-5 sm:p-6 rounded-2xl border ${
                  correction.isCorrect
                    ? 'bg-[#00BFA5]/10 border-[#00BFA5]/30'
                    : 'bg-[#E53935]/10 border-[#E53935]/30'
                }`}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  {correction.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-[#00BFA5]" />
                  ) : (
                    <XCircle className="w-6 h-6 text-[#E53935]" />
                  )}
                  <span
                    className={`font-display font-black text-base sm:text-lg ${
                      correction.isCorrect
                        ? 'text-[#00BFA5]'
                        : 'text-[#E53935]'
                    }`}
                  >
                    {isReviewMode
                      ? 'Correction de la question manquée'
                      : qType === 'true_false'
                      ? correction.isCorrect
                        ? `Excellente réponse ! (1 / 1 point) — Bonne réponse : ${correction.correctValue ? 'Vrai' : 'Faux'}`
                        : `Réponse incorrecte (0 / 1 point) — Bonne réponse : ${correction.correctValue ? 'Vrai' : 'Faux'}`
                      : qType === 'matching_images'
                      ? (() => {
                          const correctCount = Object.keys(correction.correctMatches || {}).filter(
                            (dId) => selectedMatches[dId] === correction.correctMatches?.[dId]
                          ).length;
                          return correction.isCorrect
                            ? 'Excellente réponse ! (1 / 1 point — 3/3 associations correctes)'
                            : `Réponse incorrecte (0 / 1 point — ${correctCount}/3 association${correctCount > 1 ? 's' : ''} correcte${correctCount > 1 ? 's' : ''})`;
                        })()
                      : correction.isCorrect
                      ? 'Excellente réponse ! (1 / 1 point)'
                      : 'Réponse incorrecte (0 / 1 point)'}
                  </span>
                </div>

                {/* 1. SECTION DE TRANSCRIPTION COMPLÈTE DE L'AUDIO ÉCOUTÉ */}
                {qType === 'choice' && (
                  <div className="my-3 p-3.5 rounded-xl bg-white/90 dark:bg-black/30 border border-black/10 dark:border-white/10 space-y-3">
                    {/* Transcription du Dialogue ou Monologue */}
                    {correction.dialogue && correction.dialogue.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1.5">
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Transcription de l’audio écouté :</span>
                        </span>
                        <div className="space-y-2">
                          {correction.dialogue.map((line, lIdx) => (
                            <div
                              key={lIdx}
                              className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] text-xs sm:text-sm space-y-0.5"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                    line.speakerLabel === '男'
                                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                      : line.speakerLabel === '女'
                                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                      : 'bg-purple-500/15 text-[#6200EE] dark:text-[#BB86FC]'
                                  }`}
                                >
                                  {line.speakerLabel === '男'
                                    ? 'Homme (男)'
                                    : line.speakerLabel === '女'
                                    ? 'Femme (女)'
                                    : line.speakerLabel}
                                </span>
                                <span className="font-bold text-[#212121] dark:text-white">{line.hanzi}</span>
                              </div>
                              {line.pinyin && (
                                <div className="text-[11px] font-mono text-[#6200EE] dark:text-[#BB86FC] pl-1">
                                  {line.pinyin}
                                </div>
                              )}
                              {line.french && (
                                <div className="text-[11px] text-[#616161] dark:text-[#A0A0A0] pl-1 italic">
                                  « {line.french} »
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Question posée */}
                    {(correction.question || currentQuestion.question) && (
                      <div className="pt-2.5 border-t border-black/5 dark:border-white/10 space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] block">
                          Question posée :
                        </span>
                        <div className="p-2.5 rounded-lg bg-[#6200EE]/5 dark:bg-[#BB86FC]/10 border border-[#6200EE]/15 space-y-0.5">
                          <p className="font-bold text-xs sm:text-sm text-[#212121] dark:text-white">
                            {(correction.question || currentQuestion.question)?.hanzi}
                          </p>
                          {(correction.question || currentQuestion.question)?.pinyin && (
                            <p className="text-[11px] font-mono text-[#6200EE] dark:text-[#BB86FC]">
                              {(correction.question || currentQuestion.question)?.pinyin}
                            </p>
                          )}
                          {(correction.question || currentQuestion.question)?.french && (
                            <p className="text-[11px] text-[#616161] dark:text-[#A0A0A0] italic">
                              « {(correction.question || currentQuestion.question)?.french} »
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Format Vrai ou Faux */}
                {qType === 'true_false' && correction.audioText && (
                  <div className="my-3 p-3.5 rounded-xl bg-white/90 dark:bg-black/30 border border-black/10 dark:border-white/10 space-y-3">
                    <div>
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1.5 mb-1.5">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Mot ou phrase prononcé(e) dans l’audio :</span>
                      </span>
                      <div className="p-2.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.04] dark:border-white/[0.06] space-y-0.5">
                        <p className="font-bold text-base sm:text-lg text-[#212121] dark:text-white">
                          {correction.audioText.hanzi}
                        </p>
                        <p className="text-xs font-mono text-[#6200EE] dark:text-[#BB86FC]">
                          {correction.audioText.pinyin}
                        </p>
                        <p className="text-xs text-[#616161] dark:text-[#A0A0A0] italic">
                          « {correction.audioText.french} »
                        </p>
                      </div>
                    </div>

                    {/* Ce que montre l'illustration */}
                    {correction.imageContent && (
                      <div className="pt-2.5 border-t border-black/5 dark:border-white/10 space-y-1.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Ce que montre l’illustration :</span>
                        </span>
                        <div className="p-2.5 rounded-lg bg-[#00BFA5]/5 dark:bg-[#00BFA5]/10 border border-[#00BFA5]/20 space-y-0.5">
                          <p className="font-bold text-sm sm:text-base text-[#00897B] dark:text-[#03DAC5]">
                            {correction.imageContent.hanzi}
                          </p>
                          <p className="text-xs font-mono text-[#757575] dark:text-[#A0A0A0]">
                            {correction.imageContent.pinyin}
                          </p>
                          <p className="text-xs text-[#616161] dark:text-[#D6D6D6] italic">
                            « {correction.imageContent.french} »
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Format Association */}
                {qType === 'matching_images' && correction.dialogues && (
                  <div className="my-3 space-y-2.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Transcriptions des Dialogues & Associations correctes :</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {correction.dialogues.map((dlg, idx) => {
                        const correctImgId = (correction.correctMatches || {})[dlg.id];
                        const correctImgIdx = (correction.images || []).findIndex((img) => img.id === correctImgId);
                        const correctLetter = correctImgIdx >= 0 ? String.fromCharCode(65 + correctImgIdx) : '?';

                        const userImgId = selectedMatches[dlg.id];
                        const userImgIdx = (correction.images || []).findIndex((img) => img.id === userImgId);
                        const userLetter = userImgIdx >= 0 ? String.fromCharCode(65 + userImgIdx) : null;
                        const isMatchCorrect = userImgId === correctImgId;

                        return (
                          <div
                            key={dlg.id}
                            className={`p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1E] border-2 space-y-2 text-xs transition-all ${
                              isMatchCorrect
                                ? 'border-[#00BFA5]/40 shadow-sm'
                                : 'border-[#E53935]/40 shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-1.5">
                              <span className="font-bold text-[#212121] dark:text-white">
                                Dialogue {idx + 1}
                              </span>
                              <span className="px-2 py-0.5 rounded-md bg-[#00BFA5]/15 text-[#00BFA5] font-black">
                                Photo {correctLetter}
                              </span>
                            </div>

                            {/* Statut de votre choix */}
                            <div
                              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center justify-between ${
                                isMatchCorrect
                                  ? 'bg-[#00BFA5]/10 text-[#00897B] dark:text-[#03DAC5]'
                                  : 'bg-[#E53935]/10 text-[#C62828] dark:text-[#FF8A80]'
                              }`}
                            >
                              <span>Votre choix : Photo {userLetter || '—'}</span>
                              <span className="font-black">
                                {isMatchCorrect ? '✓ Correct' : '✗ Erreur'}
                              </span>
                            </div>

                            {/* Transcription des répliques */}
                            <div className="space-y-1 pt-1">
                              {dlg.dialogue.map((line, lIdx) => (
                                <div key={lIdx} className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-[#6200EE] dark:text-[#BB86FC]">
                                      {line.speakerLabel}:
                                    </span>
                                    <span className="font-bold text-[#212121] dark:text-white">{line.hanzi}</span>
                                  </div>
                                  {line.pinyin && (
                                    <div className="text-[10px] font-mono text-[#757575] dark:text-[#9E9E9E] pl-3">
                                      {line.pinyin}
                                    </div>
                                  )}
                                  {line.french && (
                                    <div className="text-[10px] text-[#616161] dark:text-[#A0A0A0] pl-3 italic">
                                      « {line.french} »
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Explication Pédagogique */}
                {correction.explanationFr && (
                  <div className="text-xs sm:text-sm text-[#424242] dark:text-[#D6D6D6] leading-relaxed mt-2.5 p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                    <strong className="text-[#212121] dark:text-white">💡 Explication :</strong> {correction.explanationFr}
                  </div>
                )}

                {/* Vocabulaire Clé */}
                {correction.keyVocabulary && correction.keyVocabulary.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10">
                    <span className="text-[11px] font-black uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] flex items-center gap-1 mb-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      Vocabulaire Clé à Retenir
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {correction.keyVocabulary.map((v, i) => (
                        <div
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-xs flex items-center gap-1.5"
                        >
                          <span className="font-bold text-[#212121] dark:text-white">{v.hanzi}</span>
                          <span className="text-[11px] font-mono text-[#6200EE] dark:text-[#BB86FC]">{v.pinyin}</span>
                          <span className="text-[11px] text-[#757575]">({v.french})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bouton Continuer */}
              <button
                onClick={handleNext}
                disabled={isSubmittingFinal}
                type="button"
                className="w-full py-4 rounded-2xl bg-[#6200EE] text-white hover:bg-[#5000CA] font-bold text-sm sm:text-base shadow-lg shadow-[#6200EE]/25 btn-press cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmittingFinal ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Calcul du résultat final...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {isReviewMode
                        ? reviewIdx < reviewQuestions.length - 1
                          ? 'Question manquée suivante'
                          : 'Terminer la révision'
                        : currentIdx < exercise.questions.length - 1
                        ? 'Question suivante'
                        : 'Voir mes résultats'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
