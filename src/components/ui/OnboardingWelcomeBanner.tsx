'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, X, Target } from 'lucide-react';
import { Profile } from '@/lib/supabase/types';

interface OnboardingWelcomeBannerProps {
  profile: Profile | null;
}

export function OnboardingWelcomeBanner({ profile }: OnboardingWelcomeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || !profile) return null;

  // Calcul du contenu recommandé selon les réponses d'onboarding
  const profil = profile.onboarding_profil;
  const objectif = profile.onboarding_objectif;
  const niveau = profile.onboarding_niveau || 'Débutant';

  let titreRecommandation = 'Commencez avec les bases du mandarin et vos premières histoires';
  let lienCible = '/vocabulaire';
  let boutonTexte = 'Explorer le Vocabulaire';
  let sousTitre = 'Xiao Li vous accompagne pas à pas pour progresser chaque jour.';

  if (objectif?.toLowerCase().includes('travail') || objectif?.toLowerCase().includes('affaires')) {
    titreRecommandation = 'Parcours suggéré : Mandarin des Affaires & Dialogues Pros';
    lienCible = '/formation';
    boutonTexte = 'Découvrir les Formations Vidéo';
    sousTitre = 'Apprenez le vocabulaire des négociations, du sourcing et des affaires en Chine.';
  } else if (objectif?.toLowerCase().includes('voyage')) {
    titreRecommandation = 'Parcours suggéré : Dialogues de Voyage & Survie en Chine';
    lienCible = '/ecoute-lecture';
    boutonTexte = 'Lancer les Dialogues';
    sousTitre = 'Pratiquez la commande au restaurant, les transports et les échanges du quotidien.';
  } else if (objectif?.toLowerCase().includes('etudes')) {
    titreRecommandation = 'Parcours suggéré : Méthode Combinatoire & Packs HSK';
    lienCible = '/vocabulaire';
    boutonTexte = 'Tester la Combinaison';
    sousTitre = 'Multipliez les phrases naturelles sans surcharge de mémorisation.';
  } else if (objectif?.toLowerCase().includes('passion')) {
    titreRecommandation = 'Parcours suggéré : Chansons Bilingues & Histoires Narrées';
    lienCible = '/ecoute-lecture';
    boutonTexte = 'Écouter & Lire';
    sousTitre = 'Plongez dans les paroles synchronisées et les contes en immersion active.';
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6200EE]/10 via-[#03DAC5]/10 to-[#FFA000]/10 border border-[#6200EE]/20 dark:border-[#6200EE]/30 p-4 sm:p-5 shadow-xs mb-6 animate-fadeIn">
      {/* Bouton fermer */}
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-full text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
        aria-label="Fermer la recommandation"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar Xiao Li */}
        <div className="w-14 h-14 relative shrink-0">
          <Image
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li"
            width={56}
            height={56}
            className="object-contain"
          />
        </div>

        {/* Contenu textuel */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6200EE] text-white text-[10.5px] font-extrabold shadow-2xs">
              <Sparkles className="w-3 h-3" />
              Recommandation Xiao Li
            </span>
            {profil && (
              <span className="text-[11px] font-semibold text-[#616161] dark:text-[#BDBDBD]">
                💼 {profil}
              </span>
            )}
            {niveau && (
              <span className="text-[11px] font-semibold text-[#E65100] dark:text-[#FFB74D]">
                📶 {niveau}
              </span>
            )}
          </div>

          <h3 className="font-display font-bold text-sm sm:text-base text-[#212121] dark:text-white leading-snug">
            {titreRecommandation}
          </h3>
          <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5 leading-relaxed">
            {sousTitre}
          </p>
        </div>

        {/* Bouton Action */}
        <div className="w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
          <Link
            href={lienCible}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#6200EE] hover:bg-[#5000CA] text-white font-bold text-xs shadow-sm hover:shadow-md transition-all btn-press whitespace-nowrap"
          >
            <span>{boutonTexte}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
