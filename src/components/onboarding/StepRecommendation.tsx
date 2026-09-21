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
  // Calcul dynamique des recommandations de niveau
  let niveauTitre = 'Niveau 1 — Débutant Immersion';
  let niveauBadge = 'HSK 1';
  let niveauCouleur = 'bg-[#00BFA5]/15 text-[#00796B] dark:text-[#03DAC5] border-[#00BFA5]/30';

  if (state.niveau === 'intermediaire_bas') {
    niveauTitre = 'Niveau 2 — Conversations Pratiques';
    niveauBadge = 'HSK 2';
    niveauCouleur = 'bg-[#0288D1]/15 text-[#0288D1] dark:text-[#4FC3F7] border-[#0288D1]/30';
  } else if (state.niveau === 'intermediaire_avance') {
    niveauTitre = 'Niveau 3-4 — Maîtrise, Fluidité & Perfectionnement';
    niveauBadge = 'HSK 3–4';
    niveauCouleur = 'bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] border-[#6200EE]/30';
  }

  // Croisement intelligent : Profil x Niveau x Motivation
  let moduleTitre = 'Histoires immersives & premiers dialogues du quotidien';
  let moduleDesc = 'Découvrez vos premiers mots avec Xiao Li, les sons essentiels et des phrases courtes.';

  if (state.profil === 'entrepreneur') {
    if (state.niveau === 'debutant' || !state.niveau) {
      moduleTitre = 'Mandarin Commercial & Négociation Débutant (HSK 1)';
      moduleDesc = 'Apprenez les chiffres, les prix, la monnaie chinoise (RMB), les salutations formelles d’affaires et vos premiers échanges commerciaux.';
    } else if (state.niveau === 'intermediaire_bas') {
      moduleTitre = 'Masterclass Sourcing & Négociation Usines (HSK 2–3)';
      moduleDesc = 'Dialogues d’achat direct, commandes d’échantillons, contrôle qualité et logistique de fret à Guangzhou & Yiwu.';
    } else {
      moduleTitre = 'Contrats Commerciaux & Stratégie d’Affaires en Chine (HSK 4)';
      moduleDesc = 'Négociations complexes, accords de distribution, lexique douanier maritime et droit des affaires en mandarin.';
    }
  } else if (state.profil === 'cadre') {
    if (state.niveau === 'debutant' || !state.niveau) {
      moduleTitre = 'Communication & Politesse en Entreprise (HSK 1)';
      moduleDesc = 'Présentations formelles, formules de courtoisie professionnelle, salutations en réunion et vocabulaire clé du bureau.';
    } else if (state.niveau === 'intermediaire_bas') {
      moduleTitre = 'Réunions & Gestion d’Équipe Bilingue (HSK 2–3)';
      moduleDesc = 'Conduire un point projet, rédiger des emails professionnels concis et collaborer au quotidien avec des partenaires chinois.';
    } else {
      moduleTitre = 'Management Stratégique & Partenariats Internationaux (HSK 4)';
      moduleDesc = 'Présentations de rapports trimestriels, leadership biculturel et négociations corporate de haut niveau.';
    }
  } else if (state.profil === 'ingenieur') {
    if (state.niveau === 'debutant' || !state.niveau) {
      moduleTitre = 'Mandarin Technique & Chantier Débutant (HSK 1)';
      moduleDesc = 'Consignes de sécurité, outils, mesures, termes techniques élémentaires et communication terrain avec les équipes chinoises.';
    } else if (state.niveau === 'intermediaire_bas') {
      moduleTitre = 'Vocabulaire BTP, Industrie & Matériel Technique (HSK 2–3)';
      moduleDesc = 'Dialogues d’ateliers, maintenance préventive, spécifications de plans et coordination technique avec les ingénieurs chinois.';
    } else {
      moduleTitre = 'Ingénierie & Suivi de Grands Chantiers (HSK 4)';
      moduleDesc = 'Rédaction de rapports techniques détaillés, normes industrielles, audits qualité et conduite de projets BTP complexes.';
    }
  } else if (state.profil === 'etudiant') {
    if (state.niveau === 'debutant' || !state.niveau) {
      moduleTitre = 'Pack Essentiel HSK 1 & Méthode de la Combinaison';
      moduleDesc = 'Maîtrisez les 150 premiers mots indispensables et assemblez des phrases fluides naturellement pour réussir vos examens.';
    } else if (state.niveau === 'intermediaire_bas') {
      moduleTitre = 'Préparation HSK 2–3 & Histoires Écrites';
      moduleDesc = 'Consolidez votre grammaire, préparez votre certification officielle et enrichissez votre vocabulaire par la lecture active.';
    } else {
      moduleTitre = 'Perfectionnement HSK 4–5 & Articles Académiques';
      moduleDesc = 'Podcasts universitaires, compréhension de textes longs et perfectionnement écrit pour bourses d’études en Chine.';
    }
  } else {
    // Autre / Voyage / Passion
    if (state.motivation === 'voyage') {
      if (state.niveau === 'debutant' || !state.niveau) {
        moduleTitre = 'Survie en Chine, Transports & Restauration (HSK 1)';
        moduleDesc = 'Dialogues pratiques pour commander au restaurant, prendre le taxi, réserver l’hôtel et demander son chemin.';
      } else {
        moduleTitre = 'Dialogues de Voyage & Podcasts Culturels (HSK 2–3)';
        moduleDesc = 'Échanges spontanés avec les locaux, récits de voyage immersifs et anecdotes culturelles chinoises captivantes.';
      }
    } else if (state.motivation === 'passion') {
      if (state.niveau === 'debutant' || !state.niveau) {
        moduleTitre = 'Chansons Bilingues & Premiers Contes Narrés (HSK 1)';
        moduleDesc = 'Paroles synchronisées, musiques populaires faciles et contes bilingues pour un apprentissage mélodieux et passionnant.';
      } else {
        moduleTitre = 'Immersion Totale : Articles de Société & Podcasts sans filtre';
        moduleDesc = 'Podcasts thématiques, légendes chinoises, chansons poétiques et exploration approfondie de la culture.';
      }
    } else {
      if (state.niveau === 'debutant' || !state.niveau) {
        moduleTitre = 'Histoires immersives & Dialogues du quotidien (HSK 1)';
        moduleDesc = 'Découvrez vos premiers mots avec Xiao Li, les sons essentiels et des phrases courtes de la vie courante.';
      } else {
        moduleTitre = 'Articles Bilingues & Dialogues de Conversation (HSK 2–3)';
        moduleDesc = 'Approfondissez votre compréhension orale et écrite avec des contenus variés et captivants.';
      }
    }
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
