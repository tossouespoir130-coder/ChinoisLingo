'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, BookOpen, Target, Clock, CheckCircle2 } from 'lucide-react';
import { OnboardingState } from './types';

interface StepRecommendationProps {
  state: OnboardingState;
  onProceed: () => void;
}

export function StepRecommendation({ state, onProceed }: StepRecommendationProps) {
  // Calcul dynamique des recommandations
  let niveauTitre = 'Niveau 1 — Débutant Immersion';
  let niveauBadge = 'HSK 1';
  let niveauCouleur = 'bg-[#00BFA5]/15 text-[#00796B] dark:text-[#03DAC5] border-[#00BFA5]/30';

  if (state.niveau === 'intermediaire_bas') {
    niveauTitre = 'Niveau 2 — Conversations Pratiques';
    niveauBadge = 'HSK 2';
    niveauCouleur = 'bg-[#0288D1]/15 text-[#0288D1] dark:text-[#4FC3F7] border-[#0288D1]/30';
  } else if (state.niveau === 'intermediaire_avance') {
    niveauTitre = 'Niveau 3-4 — Maîtrise & Fluidité';
    niveauBadge = 'HSK 3–4';
    niveauCouleur = 'bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] border-[#6200EE]/30';
  }

  // Module de départ suggéré selon la motivation
  let moduleTitre = 'Histoires immersives & premiers dialogues du quotidien';
  let moduleDesc = 'Découvrez vos premiers mots avec Xiao Li, les sons essentiels et des phrases courtes.';

  if (state.motivation === 'travail') {
    moduleTitre = 'Mandarin des Affaires & Dialogues Commerciaux';
    moduleDesc = 'Formations pratiques de négociation, vocabulaire pro et phrases clés en entreprise.';
  } else if (state.motivation === 'voyage') {
    moduleTitre = 'Survie en Chine, Transports & Restauration';
    moduleDesc = 'Dialogues interactifs pour commander, demander son chemin et échanger avec les locaux.';
  } else if (state.motivation === 'etudes') {
    moduleTitre = 'Méthode Combinatoire & Packs Vocabulaire HSK';
    moduleDesc = 'Multipliez les phrases naturelles en combinant les mots pivots sans surcharge cognitive.';
  } else if (state.motivation === 'passion') {
    moduleTitre = 'Chansons Bilingues, Histoires & Podcasts Culturels';
    moduleDesc = 'Paroles synchronisées, chansons populaires et contes narrés pour un plaisir immédiat.';
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Header with Xiao Li */}
      <div className="flex items-center gap-3.5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative shrink-0">
          <Image
            src="/images/onboarding/mascot-sparkle.png"
            alt="Xiao Li - Mascotte ChinoisLingo"
            width={80}
            height={80}
            className="object-contain w-full h-full drop-shadow-xs"
            priority
          />
        </div>
        <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
          <div className="absolute top-4 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Plan d’apprentissage sur-mesure
            </span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-[#212121] dark:text-[#F5F5F5] leading-snug">
            Voici ton parcours recommandé par Xiao Li !
          </p>
        </div>
      </div>

      {/* Recap of choices */}
      <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
          💼 {state.profilLabel || 'Salarié'}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
          🎯 {state.motivationLabel || 'Affaires'}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
          📶 {state.niveauLabel || 'Débutant'}
        </span>
      </div>

      {/* Recommended Roadmap Cards */}
      <div className="flex flex-col gap-3">
        {/* 1. Starting Level Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-[#6200EE] dark:text-[#BB86FC] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] uppercase">
                Palier de départ
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${niveauCouleur}`}>
                {niveauBadge}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5] mt-0.5">
              {niveauTitre}
            </h4>
          </div>
        </div>

        {/* 2. Primary Suggested Content */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/40 flex items-center justify-center text-[#00897B] dark:text-[#03DAC5] shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] uppercase">
              Contenu initial recommandé
            </span>
            <h4 className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5] mt-0.5">
              {moduleTitre}
            </h4>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1 leading-relaxed">
              {moduleDesc}
            </p>
          </div>
        </div>

        {/* 3. Daily Rhythm */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] uppercase">
              Rythme conseillé
            </span>
            <h4 className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5] mt-0.5">
              10 à 15 minutes par jour 🔥
            </h4>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1">
              Des sessions courtes et répétées pour ancrer le chinois durablement sans effort.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onProceed}
          className="w-full py-4 rounded-2xl bg-[#6200EE] hover:bg-[#5000CA] text-white font-bold text-base shadow-md hover:shadow-lg transition-all btn-press flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Créer mon compte pour commencer</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
