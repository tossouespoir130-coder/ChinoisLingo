'use client';

import React, { useState } from 'react';
import { Headphones, ArrowLeft, Check, Sparkles, Lock, ArrowRight, Play } from 'lucide-react';
import { ALL_SPOKEN_MODELS } from '@/lib/spoken-exercises/hsk1Model1';
import { SpokenExerciseModel } from '@/lib/spoken-exercises/types';
import { SpokenExerciseRunner } from './SpokenExerciseRunner';

const HSK_LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'HSK 1': { bg: '#E53935', text: '#FFFFFF', border: '#E53935' },
  'HSK 2': { bg: '#FF9800', text: '#FFFFFF', border: '#FF9800' },
  'HSK 3': { bg: '#00897B', text: '#FFFFFF', border: '#00897B' },
  'HSK 4': { bg: '#1E88E5', text: '#FFFFFF', border: '#1E88E5' },
  'HSK 5': { bg: '#6200EE', text: '#FFFFFF', border: '#6200EE' },
  'HSK 6': { bg: '#3949AB', text: '#FFFFFF', border: '#3949AB' },
};

const HSK_LEVEL_DESCRIPTIONS: Record<string, string> = {
  'HSK 1': 'Construis tes premières phrases orales en mandarin autour de structures modèles immédiatement combinables.',
  'HSK 2': 'Élargis ton autonomie orale avec des questions, des requêtes polies et des actions du quotidien.',
  'HSK 3': 'Exprime tes intentions, raconte des expériences et structure tes échanges oraux avec fluidité.',
  'HSK 4': 'Maîtrise les nuances, les connecteurs logiques et la syntaxe complexe des conversations professionnelles.',
  'HSK 5': 'Développe un argumentaire oral fluide, précis et nuancé sur des thématiques contemporaines.',
  'HSK 6': 'Atteins une aisance orale proche du natif avec des formulations authentiques et idiomatiques.',
};

export function SpokenExercisesHub() {
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<SpokenExerciseModel | null>(null);
  const [completedModelIds, setCompletedModelIds] = useState<Set<string>>(new Set());

  const allHskLevels: Array<'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6'> = [
    'HSK 1',
    'HSK 2',
    'HSK 3',
    'HSK 4',
    'HSK 5',
    'HSK 6',
  ];

  // =========================================================================
  // SCREEN 3 : RUNNER D'UN MODÈLE
  // =========================================================================
  if (activeModel) {
    const isCompleted = completedModelIds.has(activeModel.id);
    return (
      <SpokenExerciseRunner
        model={activeModel}
        onBack={() => setActiveModel(null)}
        isCompleted={isCompleted}
        onToggleComplete={() => {
          setCompletedModelIds((prev) => {
            const next = new Set(prev);
            next.add(activeModel.id);
            return next;
          });
        }}
      />
    );
  }

  // =========================================================================
  // SCREEN 2 : LISTE DES MODÈLES DU NIVEAU CHOISI (TITRES EN FRANÇAIS SEULS)
  // =========================================================================
  if (currentLevel) {
    const levelModels = ALL_SPOKEN_MODELS.filter((m) => m.level === currentLevel);
    const colors = HSK_LEVEL_COLORS[currentLevel] || HSK_LEVEL_COLORS['HSK 1'];

    return (
      <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div>
          <button
            onClick={() => setCurrentLevel(null)}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#757575] dark:text-[#A0A0A0] hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors btn-press cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tous les niveaux HSK</span>
          </button>
        </div>

        {/* Level Banner */}
        <div className="nixtio-card relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-hidden shadow-xs">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00897B] dark:text-[#03DAC5]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#00897B] dark:text-[#03DAC5]">
                Modèles de phrases orales · Méthode de la Combinaison
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-[#212121] dark:text-white">
              Exercices parlés — {currentLevel}
            </h2>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              Chaque modèle est une phrase typique que tu écoutes, répètes et combines à l’infini pour débloquer ton expression orale.
            </p>
          </div>
          <div
            className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: colors.bg }}
          />
        </div>

        {/* Grid des modèles (Titres en français uniquement, zéro hanzi ni pinyin) */}
        {levelModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levelModels.map((item) => {
              const isDone = completedModelIds.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveModel(item)}
                  className="nixtio-card group flex flex-col justify-between p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#00897B] dark:hover:border-[#03DAC5] rounded-3xl transition-all duration-300 shadow-xs hover:shadow-xl cursor-pointer"
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#00897B]/10 text-[#00897B] dark:text-[#03DAC5]">
                        Épisode {item.episodeNumber}
                      </span>
                      {isDone && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#E53935] text-white flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Terminé</span>
                        </span>
                      )}
                    </div>

                    {/* Image d'illustration si définie */}
                    {item.imageUrl && (
                      <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                        <img
                          src={item.imageUrl}
                          alt={item.titleFr}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Titre EN FRANÇAIS SEULEMENT (Règle d'or : pas de hanzi ni de pinyin sur la carte) */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-black font-display text-[#212121] dark:text-white group-hover:text-[#00897B] dark:group-hover:text-[#03DAC5] transition-colors">
                        {item.titleFr}
                      </h3>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[#00897B] dark:text-[#03DAC5]">
                    <span>Pratiquer ce modèle</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="nixtio-card p-12 text-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-3">
            <h3 className="text-base font-bold text-[#212121] dark:text-white">
              Modèles en préparation pour {currentLevel} 🎙️
            </h3>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
              Les épisodes de ce niveau arrivent très bientôt.
            </p>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // SCREEN 1 : SÉLECTION DES NIVEAUX HSK 1 À HSK 6
  // =========================================================================
  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="nixtio-card relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00897B] dark:text-[#03DAC5]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#00897B] dark:text-[#03DAC5]">
              Expression Orale · Méthode de la Combinaison
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-[#212121] dark:text-white">
            Exercices parlés — Niveaux HSK
          </h2>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
            Pour chaque niveau, écoute une phrase modèle, répète-la à voix haute, puis découvre comment fabriquer des centaines d’autres phrases en changeant un seul élément à la fois.
          </p>
        </div>
      </div>

      {/* Grid of 6 HSK Levels (HSK 1 à 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allHskLevels.map((lvl) => {
          const colors = HSK_LEVEL_COLORS[lvl];
          const publishedCount = ALL_SPOKEN_MODELS.filter((m) => m.level === lvl).length;
          const hasPublished = publishedCount > 0;

          return (
            <div
              key={lvl}
              onClick={() => {
                if (hasPublished) setCurrentLevel(lvl);
              }}
              className={`nixtio-card group flex flex-col justify-between p-6 bg-white dark:bg-[#1E1E1E] border rounded-3xl transition-all duration-300 shadow-xs ${
                hasPublished
                  ? 'border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#00897B] dark:hover:border-[#03DAC5] hover:shadow-xl cursor-pointer'
                  : 'border-[#E0E0E0]/60 dark:border-[#2D2D2D]/60 opacity-60 cursor-default'
              }`}
            >
              <div className="space-y-4">
                {/* Level Tag & Status */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black text-white"
                    style={{ backgroundColor: colors.bg }}
                  >
                    {lvl}
                  </span>
                  {hasPublished ? (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#00897B]/10 text-[#00897B] dark:text-[#03DAC5]">
                      {publishedCount} modèle{publishedCount > 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/5 dark:bg-white/10 text-[#757575] dark:text-[#A0A0A0]">
                      Bientôt
                    </span>
                  )}
                </div>

                {/* Level Description */}
                <div>
                  <h3 className="text-lg font-black font-display text-[#212121] dark:text-white">
                    Modèles {lvl}
                  </h3>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1.5 leading-relaxed line-clamp-3">
                    {HSK_LEVEL_DESCRIPTIONS[lvl]}
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="pt-6 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold">
                {hasPublished ? (
                  <>
                    <span className="text-[#00897B] dark:text-[#03DAC5]">Explorer les modèles</span>
                    <ArrowRight className="w-4 h-4 text-[#00897B] dark:text-[#03DAC5] transform group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <span className="text-[#9E9E9E]">En cours de rédaction</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
