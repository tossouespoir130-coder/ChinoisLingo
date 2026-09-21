import React from 'react';
import type { Metadata } from 'next';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import LandingCharacters from '@/components/landing/LandingCharacters';
import LandingCombinationMethod from '@/components/landing/LandingCombinationMethod';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPricing from '@/components/landing/LandingPricing';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFooter from '@/components/landing/LandingFooter';
import { RootRedirectGuard } from '@/components/landing/RootRedirectGuard';

export const metadata: Metadata = {
  title: 'ChinoisLingo — Le chinois devient facile | Immersion & Histoires en Mandarin',
  description:
    'Avec ChinoisLingo, le chinois devient facile. Apprenez le mandarin à travers des histoires passionnantes, des personnages attachants et la Méthode de la Combinaison.',
  openGraph: {
    title: 'ChinoisLingo | Le chinois devient facile',
    description:
      'La plateforme interactive d’immersion en mandarin : vocabulaire HSK, dialogues de la vie réelle, masterclasses de négociation et la Méthode de la Combinaison.',
    url: 'https://chinoislingo.fr',
    siteName: 'ChinoisLingo',
    type: 'website',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-[#212121] dark:text-[#E0E0E0] overflow-x-hidden selection:bg-[#6200EE]/20 selection:text-[#6200EE]">
      {/* Redirection instantanée pour utilisateur connecté */}
      <RootRedirectGuard />

      {/* Navigation Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="relative">
        {/* 1. Hero Section Épurée */}
        <LandingHero />

        {/* 2. Présentation des Personnages & Storytelling */}
        <LandingCharacters />

        {/* 3. La Méthode de la Combinaison en 3 Blocs */}
        <LandingCombinationMethod />

        {/* 4. Les 3 Piliers d'Immersion */}
        <LandingFeatures />

        {/* 5. Tarifs Réels Officiels ChinoisLingo (EUR / FCFA) */}
        <LandingPricing />

        {/* 6. Grand Finale CTA */}
        <LandingCTA />
      </main>

      {/* Footer Complet et Conforme */}
      <LandingFooter />
    </div>
  );
}
