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

  // Calcul du contenu recommandé selon les réponses d'onboarding (Profil x Niveau x Objectif)
  const profil = profile.onboarding_profil || '';
  const objectif = profile.onboarding_objectif || '';
  const niveau = profile.onboarding_niveau || 'Débutant';

  const profilMin = profil.toLowerCase();
  const niveauMin = niveau.toLowerCase();
  const estDebutant = niveauMin.includes('début') || niveauMin.includes('debut');
  const estIntermediaire = niveauMin.includes('base') || niveauMin.includes('intermédiaire') || niveauMin.includes('intermediaire') || niveauMin.includes('hsk 2');

  let titreRecommandation = 'Commencez avec les bases du mandarin et vos premières histoires';
  let lienCible = '/vocabulaire';
  let boutonTexte = 'Explorer le Vocabulaire';
  let sousTitre = 'Xiao Li vous accompagne pas à pas pour progresser chaque jour.';

  if (profilMin.includes('entrepreneur') || profilMin.includes('commerç') || profilMin.includes('commerc')) {
    if (estDebutant) {
      titreRecommandation = 'Parcours Entrepreneur : Mandarin Commercial & Négociation Débutant';
      lienCible = '/formation';
      boutonTexte = 'Découvrir la Formation';
      sousTitre = 'Apprenez les chiffres, les devises RMB, les salutations d’affaires et les bases de la négociation.';
    } else {
      titreRecommandation = 'Masterclass Sourcing, Usines & Négociation à Guangzhou';
      lienCible = '/formation';
      boutonTexte = 'Lancer la Masterclass';
      sousTitre = 'Commandes d’échantillons, contrats commerciaux, audits d’usine et logistique de fret maritime.';
    }
  } else if (profilMin.includes('cadre')) {
    if (estDebutant) {
      titreRecommandation = 'Parcours Cadre : Politesse & Présentations en Entreprise';
      lienCible = '/formation';
      boutonTexte = 'Voir le Parcours Pro';
      sousTitre = 'Maîtrisez les formules de courtoisie en réunion et le vocabulaire essentiel du bureau.';
    } else {
      titreRecommandation = 'Management Stratégique & Réunions d’Affaires Bilingues';
      lienCible = '/formation';
      boutonTexte = 'Accéder aux Formations';
      sousTitre = 'Conduisez des réunions de projet, rédigez des comptes-rendus et échangez avec vos partenaires.';
    }
  } else if (profilMin.includes('ingénieur') || profilMin.includes('ingenieur') || profilMin.includes('technicien') || profilMin.includes('btp')) {
    if (estDebutant) {
      titreRecommandation = 'Mandarin Technique, Chantier & Consignes de Sécurité';
      lienCible = '/vocabulaire';
      boutonTexte = 'Consulter le Vocabulaire BTP';
      sousTitre = 'Vocabulaire des outils, mesures, sécurité sur le terrain et consignes techniques élémentaires.';
    } else {
      titreRecommandation = 'Vocabulaire BTP, Industrie & Coordination de Chantier';
      lienCible = '/formation';
      boutonTexte = 'Lancer les Modules Techniques';
      sousTitre = 'Dialogues d’ateliers, maintenance préventive, spécifications de plans et gestion de chantier.';
    }
  } else if (profilMin.includes('étudiant') || profilMin.includes('etudiant')) {
    if (estDebutant) {
      titreRecommandation = 'Pack Essentiel HSK 1 & Méthode de la Combinaison';
      lienCible = '/vocabulaire';
      boutonTexte = 'Tester la Combinaison';
      sousTitre = 'Mémorisez les mots indispensables et créez des phrases naturelles sans effort.';
    } else {
      titreRecommandation = 'Préparation Avancée aux Certifications HSK & Articles Académiques';
      lienCible = '/ecoute-lecture';
      boutonTexte = 'Lire & Écouter';
      sousTitre = 'Préparez vos examens HSK, enrichissez votre vocabulaire et perfectionnez votre compréhension.';
    }
  } else if (objectif.toLowerCase().includes('voyage')) {
    titreRecommandation = 'Parcours Voyage : Survie en Chine & Dialogues du Quotidien';
    lienCible = '/ecoute-lecture';
    boutonTexte = 'Lancer les Dialogues';
    sousTitre = 'Pratiquez la commande au restaurant, les transports, les hôtels et les échanges avec les locaux.';
  } else if (objectif.toLowerCase().includes('passion')) {
    titreRecommandation = 'Parcours Passion : Chansons Bilingues & Contes Narrés';
    lienCible = '/ecoute-lecture';
    boutonTexte = 'Écouter & Chanter';
    sousTitre = 'Plongez dans les paroles synchronisées et les histoires immersives en immersion active.';
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
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative shrink-0">
          <Image
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li"
            width={80}
            height={80}
            className="object-contain w-full h-full drop-shadow-xs"
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
