'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  Lock,
  ChevronRight,
  Headphones,
  HelpCircle,
  Image as ImageIcon,
  Target,
  X
} from 'lucide-react';
import {
  type ClientExerciseSet,
  type UserExerciseResultItem,
  fetchExercisesCatalogApi,
  fetchUserExerciseResultsApi,
  demarrerExerciceApi,
} from '@/lib/services/exerciseClientService';
import {
  type ExerciseRubriqueId,
  CONFIG_RUBRIQUES,
} from '@/lib/exercices/configRubriques';
import { useAbonnement } from '@/lib/payments/useAbonnement';
import { BadgeVerrou, EcranPremium } from '@/components/subscription/EcranPremium';
import { Portal } from '@/components/ui/Portal';
import { HskExerciseRunner } from '@/components/exercises/HskExerciseRunner';

export const HSK_LEVEL_COLORS: Record<string, { bg: string; text: string; border: string; lightBg: string; gradient: string }> = {
  'HSK 1': { bg: '#00897B', text: '#00897B', border: '#00897B', lightBg: 'bg-[#00897B]/10', gradient: 'from-[#00897B] to-[#00BFA5]' },
  'HSK 2': { bg: '#0288D1', text: '#0288D1', border: '#0288D1', lightBg: 'bg-[#0288D1]/10', gradient: 'from-[#0288D1] to-[#29B6F6]' },
  'HSK 3': { bg: '#6200EE', text: '#6200EE', border: '#6200EE', lightBg: 'bg-[#6200EE]/10', gradient: 'from-[#6200EE] to-[#7C4DFF]' },
  'HSK 4': { bg: '#3F51B5', text: '#3F51B5', border: '#3F51B5', lightBg: 'bg-[#3F51B5]/10', gradient: 'from-[#3F51B5] to-[#5C6BC0]' },
  'HSK 5': { bg: '#8E24AA', text: '#8E24AA', border: '#8E24AA', lightBg: 'bg-[#8E24AA]/10', gradient: 'from-[#8E24AA] to-[#AB47BC]' },
  'HSK 6': { bg: '#D81B60', text: '#D81B60', border: '#D81B60', lightBg: 'bg-[#D81B60]/10', gradient: 'from-[#D81B60] to-[#E91E63]' },
};

export const HSK_LEVEL_IMAGES: Record<string, string> = {
  'HSK 1': '/images/exercices/levels/hsk1_level.jpg',
  'HSK 2': '/images/exercices/levels/hsk2_level.jpg',
  'HSK 3': '/images/exercices/levels/hsk3_level.jpg',
  'HSK 4': '/images/exercices/levels/hsk4_level.jpg',
  'HSK 5': '/images/exercices/levels/hsk5_level.jpg',
  'HSK 6': '/images/exercices/levels/hsk6_level.jpg',
};

const HSK_LEVEL_DESCRIPTIONS: Record<string, string> = {
  'HSK 1': '150 mots fondamentaux · Vrai ou faux, questions ciblées et réflexes d’écoute.',
  'HSK 2': '300 mots usuels · Situations courantes, achats, transports et repérage contextuel.',
  'HSK 3': '600 mots · Échanges complets, expressions d’opinion et détails narratifs.',
  'HSK 4': '1200 mots · Sujets thématiques, nuances de discours et fluidité d’écoute.',
  'HSK 5': '2500 mots · Discours complexes, interviews et tournures idiomatiques.',
  'HSK 6': '5000+ mots · Maîtrise avancée, registres soutenus et vitesse naturelle native.',
};

export function HskExercisesHub() {
  const { etat } = useAbonnement();
  const estAbonne = etat.accesComplet;

  // Navigation state (4 écrans) :
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [selectedRubrique, setSelectedRubrique] = useState<ExerciseRubriqueId | null>(null);
  const [activeAttempt, setActiveAttempt] = useState<{
    attemptId: string;
    exercise: ClientExerciseSet;
  } | null>(null);

  // Data state :
  const [catalog, setCatalog] = useState<ClientExerciseSet[]>([]);
  const [userResults, setUserResults] = useState<Record<string, UserExerciseResultItem>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isStartingSeries, setIsStartingSeries] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Premium modal state :
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [lockedItemTitle, setLockedItemTitle] = useState<string>('');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedCatalog, fetchedResults] = await Promise.all([
        fetchExercisesCatalogApi(),
        fetchUserExerciseResultsApi(),
      ]);
      setCatalog(fetchedCatalog);
      setUserResults(fetchedResults);
    } catch (err) {
      console.error('Erreur lors du chargement des exercices:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler: Select a level (Screen 1 -> Screen 2)
  const handleSelectLevel = (lvl: string) => {
    setCurrentLevel(lvl);
    setSelectedRubrique(null);
  };

  // Handler: Select a rubrique (Screen 2 -> Screen 3)
  const handleSelectRubrique = (rubriqueId: ExerciseRubriqueId) => {
    setSelectedRubrique(rubriqueId);
  };

  // Handler: Start a series (Screen 3 -> Screen 4)
  const handleStartSeries = async (series: ClientExerciseSet) => {
    if (isStartingSeries) return;

    if (!series.isGratuit && !estAbonne) {
      setLockedItemTitle(series.titleFr);
      setShowPremiumModal(true);
      return;
    }

    setIsStartingSeries(true);
    setErreur(null);
    try {
      const res = await demarrerExerciceApi(series.id);
      if (res.ok) setActiveAttempt(res.data);
      else setErreur(res.erreur);
    } finally {
      setIsStartingSeries(false);
    }
  };

  // Handler: "Continuer" direct launcher from Screen 1 (Level level)
  const handleContinueLevel = async (lvl: string) => {
    const levelSeries = catalog.filter((s) => s.level === lvl);
    if (levelSeries.length === 0) return;

    const uncompleted = levelSeries.find((s) => {
      const res = userResults[s.id];
      return !res || res.score === undefined;
    });

    const targetSeries = uncompleted || levelSeries[0];
    if (!targetSeries.isGratuit && !estAbonne) {
      setLockedItemTitle(targetSeries.titleFr);
      setShowPremiumModal(true);
      return;
    }
    setCurrentLevel(lvl);
    setSelectedRubrique(targetSeries.rubrique);
    await handleStartSeries(targetSeries);
  };

  // Handler: "Continuer" launcher for a specific rubrique from Screen 2
  const handleContinueRubrique = async (rubriqueId: ExerciseRubriqueId) => {
    if (!currentLevel) return;
    const rubriqueSeries = catalog.filter((s) => s.level === currentLevel && s.rubrique === rubriqueId);
    if (rubriqueSeries.length === 0) return;

    const uncompleted = rubriqueSeries.find((s) => {
      const res = userResults[s.id];
      return !res || res.score === undefined;
    });

    const targetSeries = uncompleted || rubriqueSeries[0];
    if (!targetSeries.isGratuit && !estAbonne) {
      setLockedItemTitle(targetSeries.titleFr);
      setShowPremiumModal(true);
      return;
    }
    setSelectedRubrique(rubriqueId);
    await handleStartSeries(targetSeries);
  };

  // =========================================================================
  // SCREEN 4: RUNNER INTERACTIF D'UNE SÉRIE
  // =========================================================================
  if (activeAttempt) {
    return (
      <div className="w-full">
        <HskExerciseRunner
          key={activeAttempt.attemptId}
          exercise={activeAttempt.exercise}
          attemptId={activeAttempt.attemptId}
          onBack={() => {
            setActiveAttempt(null);
            loadData();
          }}
          onRestartNewAttempt={async () => {
            const res = await demarrerExerciceApi(activeAttempt.exercise.id);
            if (res.ok) {
              setActiveAttempt(res.data);
            } else {
              setActiveAttempt(null);
              setErreur(res.erreur);
              loadData();
            }
          }}
          onFinishSeries={() => {
            loadData();
          }}
        />
      </div>
    );
  }

  // =========================================================================
  // SCREEN 3: LISTE DES SÉRIES DE LA RUBRIQUE SÉLECTIONNÉE
  // =========================================================================
  if (currentLevel && selectedRubrique) {
    const rubriqueConfig = CONFIG_RUBRIQUES[selectedRubrique];
    const seriesList = catalog
      .filter((s) => s.level === currentLevel && s.rubrique === selectedRubrique)
      .sort((a, b) => a.orderInRubrique - b.orderInRubrique);
    const colors = HSK_LEVEL_COLORS[currentLevel] || HSK_LEVEL_COLORS['HSK 1'];
    const completedCount = seriesList.filter((s) => userResults[s.id]?.completedAt).length;

    return (
      <div className="space-y-8 animate-fadeIn">
        {erreur && (
          <div role="alert" className="p-3 rounded-2xl bg-[#E53935]/10 border border-[#E53935]/30 text-[#C62828] dark:text-[#FF8A80] text-xs sm:text-sm font-bold">
            {erreur}
          </div>
        )}

        {/* Navigation Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setSelectedRubrique(null)}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors btn-press cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Rubriques {currentLevel}</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-black text-white"
              style={{ backgroundColor: colors.bg }}
            >
              {currentLevel}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]">
              {rubriqueConfig?.nom}
            </span>
            <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
              {completedCount} / {seriesList.length} série{seriesList.length > 1 ? 's' : ''} terminée{completedCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Banner Rubrique */}
        <div className="nixtio-card relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-hidden shadow-xs">
          {rubriqueConfig?.imageUrl && (
            <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/3 opacity-30 dark:opacity-25 pointer-events-none overflow-hidden hidden sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={rubriqueConfig.imageUrl}
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#1E1E1E] via-transparent to-transparent" />
            </div>
          )}
          <div className="relative z-10 max-w-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
                {rubriqueConfig?.nomZh} · {currentLevel}
              </span>
              <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
                · Seuil de réussite : {rubriqueConfig?.seuilReussite}/{rubriqueConfig?.questionsParSerie} pts
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-[#212121] dark:text-white">
              {rubriqueConfig?.nom}
            </h2>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              {rubriqueConfig?.description}
            </p>
          </div>
          <div
            className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: colors.bg }}
          />
        </div>

        {/* Series Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-[#FAFAFA] dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] animate-pulse" />
            ))}
          </div>
        ) : seriesList.length === 0 ? (
          <div className="nixtio-card p-12 text-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="font-display font-black text-lg text-[#212121] dark:text-[#F5F5F5]">
                Séries en cours de préparation 🎧
              </h3>
              <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-1 leading-relaxed">
                Les séries pour la rubrique <strong>{rubriqueConfig?.nom}</strong> ({currentLevel}) arrivent très bientôt.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seriesList.map((series) => {
              const result = userResults[series.id];
              const isCompleted = !!result?.completedAt;
              const isLocked = !series.isGratuit && !estAbonne;

              return (
                <div
                  key={series.id}
                  onClick={() => handleStartSeries(series)}
                  className={`nixtio-card group relative flex flex-col bg-white dark:bg-[#1E1E1E] border transition-all duration-300 cursor-pointer shadow-xs hover:shadow-xl rounded-3xl overflow-hidden ${
                    isLocked
                      ? 'border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE]/50 opacity-90'
                      : isCompleted
                      ? 'border-[#E53935]/40 dark:border-[#E53935]/30 hover:border-[#E53935]'
                      : 'border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE]'
                  }`}
                >
                  {/* Image & Badges */}
                  <div className="relative w-full h-44 overflow-hidden bg-black/5 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={series.imageUrl}
                      alt={series.titleFr}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                        isLocked ? 'grayscale-[0.6] opacity-75' : ''
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Lock Badge if Premium */}
                    {isLocked && <BadgeVerrou className="absolute top-3 left-3 z-10" />}

                    {/* Level Badge (top right) */}
                    <div className="absolute top-3 right-3 z-10">
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-black text-white shadow-xs"
                        style={{ backgroundColor: colors.bg }}
                      >
                        {series.level}
                      </span>
                    </div>

                    {/* Duration & Questions unified badge on image bottom */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/95 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] shadow-xs">
                        <Clock className="w-3 h-3 text-[#03DAC5]" />
                        <span>{series.duration} · {series.questionCount} {series.questionCount === 1 ? 'question' : 'questions'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
                            Série {series.orderInRubrique || series.orderInLevel}
                          </span>
                        </div>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-black bg-[#E53935]/10 text-[#E53935] dark:text-[#FF5252]">
                            <CheckCircle2 className="w-3 h-3" />
                            {result.bestScore}/{series.questionCount} pts
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00897B]/10 text-[#00897B] dark:text-[#03DAC5]">
                            Nouveau
                          </span>
                        )}
                      </div>

                      <h3 className="font-display font-black text-base text-[#212121] dark:text-white group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors line-clamp-1">
                        {series.titleFr}
                      </h3>
                      <p className="text-xs text-[#757575] dark:text-[#A0A0A0] line-clamp-2 leading-relaxed">
                        {series.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-[#F0F0F0] dark:border-[#2D2D2D] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
                        {isCompleted ? 'Réviser' : 'Prêt à écouter ?'}
                      </span>
                      <button
                        type="button"
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all btn-press ${
                          isLocked
                            ? 'bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]'
                            : isCompleted
                            ? 'bg-[#E53935] text-white hover:bg-[#D32F2F]'
                            : 'bg-[#6200EE] text-white hover:bg-[#5000CA]'
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Débloquer</span>
                          </>
                        ) : isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>✓ Terminé</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Démarrer</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Premium if locked */}
        {showPremiumModal && (
          <Portal>
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={() => setShowPremiumModal(false)}
            >
              <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowPremiumModal(false)}
                  aria-label="Fermer"
                  className="absolute -top-3 -right-1 z-10 w-8 h-8 rounded-full bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#757575] hover:text-[#212121] dark:hover:text-white flex items-center justify-center shadow-md btn-press cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <EcranPremium titre={lockedItemTitle || 'Exercices HSK'} rubrique="séries d'exercices" />
              </div>
            </div>
          </Portal>
        )}
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: RUBRIQUES DU NIVEAU SÉLECTIONNÉ
  // =========================================================================
  if (currentLevel && !selectedRubrique) {
    const colors = HSK_LEVEL_COLORS[currentLevel] || HSK_LEVEL_COLORS['HSK 1'];
    const coverImage = HSK_LEVEL_IMAGES[currentLevel];
    const levelSeries = catalog.filter((s) => s.level === currentLevel);
    const completedLevelCount = levelSeries.filter((s) => userResults[s.id]?.completedAt).length;

    const availableRubriques = (Object.values(CONFIG_RUBRIQUES) as typeof CONFIG_RUBRIQUES[ExerciseRubriqueId][])
      .filter((r) => r.niveauxDisponibles.includes(currentLevel));

    return (
      <div className="space-y-8 animate-fadeIn">
        {erreur && (
          <div role="alert" className="p-3 rounded-2xl bg-[#E53935]/10 border border-[#E53935]/30 text-[#C62828] dark:text-[#FF8A80] text-xs sm:text-sm font-bold">
            {erreur}
          </div>
        )}

        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button
            onClick={() => setCurrentLevel(null)}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors btn-press cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tous les niveaux HSK</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-black text-white"
              style={{ backgroundColor: colors.bg }}
            >
              {currentLevel}
            </span>
            <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
              {completedLevelCount} / {levelSeries.length} série{levelSeries.length > 1 ? 's' : ''} terminée{completedLevelCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Level Banner */}
        <div className="nixtio-card relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-hidden shadow-xs">
          {coverImage && (
            <div className="absolute right-0 top-0 bottom-0 w-2/5 opacity-25 dark:opacity-20 pointer-events-none overflow-hidden hidden sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage}
                alt=""
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#1E1E1E] via-transparent to-transparent" />
            </div>
          )}

          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-[#6200EE] dark:text-[#BB86FC]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
                Entraînement officiel par épreuve
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-[#212121] dark:text-white">
              Rubriques d’Écoute — {currentLevel}
            </h2>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              {HSK_LEVEL_DESCRIPTIONS[currentLevel]} Choisissez un type d’exercice pour cibler vos compétences d’écoute.
            </p>
          </div>
          <div
            className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: colors.bg }}
          />
        </div>

        {/* Rubriques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRubriques.map((rubrique) => {
            const rubriqueSeries = catalog.filter((s) => s.level === currentLevel && s.rubrique === rubrique.id);
            const hasPublished = rubriqueSeries.length > 0;
            const completedCount = rubriqueSeries.filter((s) => userResults[s.id]?.completedAt).length;
            const progressPercent = hasPublished ? Math.round((completedCount / rubriqueSeries.length) * 100) : 0;

            const IconComponent = 
              rubrique.iconName === 'HelpCircle' ? HelpCircle :
              rubrique.iconName === 'Image' ? ImageIcon : Headphones;

            return (
              <div
                key={rubrique.id}
                onClick={() => {
                  if (hasPublished) {
                    handleSelectRubrique(rubrique.id);
                  }
                }}
                className={`nixtio-card group relative flex flex-col bg-white dark:bg-[#1E1E1E] border transition-all duration-300 rounded-3xl overflow-hidden shadow-xs ${
                  hasPublished
                    ? 'border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE] hover:shadow-xl cursor-pointer'
                    : 'border-[#E0E0E0]/60 dark:border-[#2D2D2D]/60 opacity-75 cursor-default'
                }`}
              >
                {/* Top Image Cover (Harmonisé avec les cartes de niveau) */}
                <div className="relative w-full h-44 overflow-hidden bg-black/5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rubrique.imageUrl || coverImage}
                    alt={rubrique.nom}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      !hasPublished ? 'grayscale-[0.5] opacity-75' : ''
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  {/* Rubrique Badge in Chinese (top right) */}
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-black text-white shadow-xs"
                      style={{ backgroundColor: rubrique.badgeColor || colors.bg }}
                    >
                      {rubrique.nomZh}
                    </span>
                  </div>

                  {/* Status bottom left on image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/95 text-xs font-semibold">
                    {hasPublished ? (
                      <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] shadow-xs">
                        <Headphones className="w-3 h-3 text-[#03DAC5]" />
                        <span>{rubriqueSeries.length}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/60 backdrop-blur-md text-white/80">
                        Bientôt disponible
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-black text-lg text-[#212121] dark:text-white group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors">
                        {rubrique.nom}
                      </h3>
                      {hasPublished && (
                        <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] shrink-0 mt-0.5">
                          {completedCount}/{rubriqueSeries.length} terminée{completedCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed line-clamp-3">
                      {rubrique.description}
                    </p>

                    {/* Rule Pill */}
                    <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">
                      <Target className="w-3.5 h-3.5 text-[#03DAC5]" />
                      <span>Seuil : {rubrique.seuilReussite}/{rubrique.questionsParSerie} bonnes réponses</span>
                    </div>

                    {/* Progress Bar */}
                    {hasPublished && (
                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">
                          <span>Progression</span>
                          <span>{completedCount}/{rubriqueSeries.length} ({progressPercent}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#FAFAFA] dark:bg-[#2D2D2D] overflow-hidden p-0.5 border border-[#E0E0E0] dark:border-[#333]">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${progressPercent}%`,
                              backgroundColor: colors.bg,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 pb-6 border-t border-[#F0F0F0] dark:border-[#2D2D2D] flex items-center justify-between">
                    {hasPublished ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinueRubrique(rubrique.id);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#6200EE] hover:bg-[#5000CA] transition-all btn-press shadow-xs flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{completedCount > 0 ? 'Continuer' : 'Commencer'}</span>
                        </button>

                        <span className="text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Voir les séries</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </>
                    ) : (
                      <div className="w-full text-center py-1 text-xs font-semibold text-[#9E9E9E] dark:text-[#757575]">
                        Séries en préparation
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Premium if locked */}
        {showPremiumModal && (
          <Portal>
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
              onClick={() => setShowPremiumModal(false)}
            >
              <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setShowPremiumModal(false)}
                  aria-label="Fermer"
                  className="absolute -top-3 -right-1 z-10 w-8 h-8 rounded-full bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#757575] hover:text-[#212121] dark:hover:text-white flex items-center justify-center shadow-md btn-press cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <EcranPremium titre={lockedItemTitle || 'Exercices HSK'} rubrique="séries d'exercices" />
              </div>
            </div>
          </Portal>
        )}
      </div>
    );
  }

  // =========================================================================
  // SCREEN 1: HUB DES NIVEAUX HSK (HSK 1 À HSK 6)
  // =========================================================================
  const allHskLevels: Array<'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6'> = [
    'HSK 1',
    'HSK 2',
    'HSK 3',
    'HSK 4',
    'HSK 5',
    'HSK 6',
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {erreur && (
        <div role="alert" className="p-3 rounded-2xl bg-[#E53935]/10 border border-[#E53935]/30 text-[#C62828] dark:text-[#FF8A80] text-xs sm:text-sm font-bold">
          {erreur}
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="nixtio-card relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-hidden shadow-xs">
        <div className="absolute right-0 top-0 bottom-0 w-2/5 sm:w-1/3 opacity-20 dark:opacity-15 pointer-events-none overflow-hidden hidden sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/exercices/levels/hsk1_level_cover.jpg"
            alt=""
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#1E1E1E] via-transparent to-transparent" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#6200EE]/10 dark:to-[#6200EE]/20 pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-[#6200EE]/15 dark:bg-[#BB86FC]/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/4 -bottom-12 w-48 h-48 rounded-full bg-[#6200EE]/10 dark:bg-[#BB86FC]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-[#6200EE] dark:text-[#BB86FC]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
              Format Officiel · Compréhension Orale
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-[#212121] dark:text-white">
            Entraînement aux Exercices d’Écoute HSK
          </h2>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
            Perfectionnez votre oreille avec des épreuves officielles ciblées (Vrai ou Faux, Dialogues, Questions). Écoutez sans transcription, répondez et accédez instantanément à la correction guidée.
          </p>
        </div>
      </div>

      {/* Grid of HSK Levels */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-56 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] animate-pulse p-6 flex flex-col justify-between shadow-xs"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-32 bg-black/10 dark:bg-white/10 rounded-lg" />
                  <div className="h-4 w-20 bg-black/10 dark:bg-white/10 rounded-full" />
                </div>
                <div className="h-4 w-full bg-black/5 dark:bg-white/5 rounded-md mt-4" />
                <div className="h-4 w-3/4 bg-black/5 dark:bg-white/5 rounded-md" />
              </div>
              <div className="h-8 w-28 bg-black/10 dark:bg-white/10 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allHskLevels.map((lvl) => {
            const colors = HSK_LEVEL_COLORS[lvl];
            const levelSeries = catalog.filter((s) => s.level === lvl);
            const hasPublishedSeries = levelSeries.length > 0;
            const completedCount = levelSeries.filter((s) => userResults[s.id]?.completedAt).length;
            const progressPercent = hasPublishedSeries ? Math.round((completedCount / levelSeries.length) * 100) : 0;
            const coverImage = HSK_LEVEL_IMAGES[lvl];

            return (
              <div
                key={lvl}
                onClick={() => {
                  if (hasPublishedSeries) {
                    handleSelectLevel(lvl);
                  }
                }}
                className={`nixtio-card group relative flex flex-col bg-white dark:bg-[#1E1E1E] border transition-all duration-300 rounded-3xl overflow-hidden shadow-xs ${
                  hasPublishedSeries
                    ? 'border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE] hover:shadow-xl cursor-pointer'
                    : 'border-[#E0E0E0]/60 dark:border-[#2D2D2D]/60 opacity-80 cursor-default'
                }`}
              >
                {/* Image Cover Top Banner */}
                <div className="relative w-full h-44 overflow-hidden bg-black/5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt={`Niveau ${lvl}`}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                      !hasPublishedSeries ? 'grayscale-[0.5] opacity-75' : ''
                    }`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Level Badge (top right) */}
                  <div className="absolute top-3 right-3 z-10">
                    <span
                      className="px-2.5 py-1 rounded-full text-[11px] font-black text-white shadow-xs"
                      style={{ backgroundColor: colors.bg }}
                    >
                      {lvl}
                    </span>
                  </div>

                  {/* Status bottom left on image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/95 text-xs font-semibold">
                    {hasPublishedSeries ? (
                      <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] shadow-xs">
                        <Headphones className="w-3 h-3 text-[#03DAC5]" />
                        <span>{levelSeries.length} série{levelSeries.length > 1 ? 's' : ''} d’entraînement</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-black/60 backdrop-blur-md text-white/80">
                        Bientôt disponible
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content Below */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Header: Clean Title on Left & Status on Right */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display font-black text-lg text-[#212121] dark:text-white group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors">
                        Niveau {lvl}
                      </h3>

                      {hasPublishedSeries && (
                        <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] shrink-0 mt-0.5">
                          {completedCount}/{levelSeries.length} terminée{completedCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed line-clamp-2">
                      {HSK_LEVEL_DESCRIPTIONS[lvl]}
                    </p>

                    {/* Progress bar if published */}
                    {hasPublishedSeries && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">
                          <span>Progression</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#FAFAFA] dark:bg-[#2D2D2D] overflow-hidden p-0.5 border border-[#E0E0E0] dark:border-[#333]">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${progressPercent}%`,
                              backgroundColor: colors.bg,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-3 border-t border-[#F0F0F0] dark:border-[#2D2D2D] flex items-center justify-between">
                    {hasPublishedSeries ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinueLevel(lvl);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-black text-white bg-[#6200EE] hover:bg-[#5000CA] transition-all btn-press shadow-xs flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{completedCount > 0 ? 'Continuer' : 'Commencer'}</span>
                        </button>

                        <span className="text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Voir les rubriques</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </>
                    ) : (
                      <div className="w-full text-center py-1 text-xs font-semibold text-[#9E9E9E] dark:text-[#757575]">
                        Contenus en cours de création
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Premium if locked */}
      {showPremiumModal && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setShowPremiumModal(false)}
          >
            <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setShowPremiumModal(false)}
                aria-label="Fermer"
                className="absolute -top-3 -right-1 z-10 w-8 h-8 rounded-full bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#757575] hover:text-[#212121] dark:hover:text-white flex items-center justify-center shadow-md btn-press cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <EcranPremium titre={lockedItemTitle || 'Exercices HSK'} rubrique="séries d'exercices" />
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

