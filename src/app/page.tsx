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

export const metadata: Metadata = {
  title: 'ChinoisLingo — Le chinois devient facile | Immersion & Histoires en Mandarin',
  description:
    'Avec ChinoisLingo, le chinois devient facile. Apprenez le mandarin à travers des histoires passionnantes, des personnages attachants et notre méthode combinatoire.',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] text-gray-900 dark:text-[#F5F5F5] selection:bg-[#6200EE] selection:text-white transition-colors duration-300">
      {/* Header */}
      <LandingHeader />

      {/* Main Content */}
      <main className="relative">
        {/* 1. Hero with Floating Story Card & Streak Badge */}
        <LandingHero />

        {/* 2. Visual Character & Animal Photo Cards */}
        <LandingCharacters />

        {/* 3. The 3-Block Combination Method Playground */}
        <LandingCombinationMethod />

        {/* 4. The 3 Core Pillars (Audio & Karaoke, Video Series, 3D Flashcards) */}
        <LandingFeatures />

        {/* 5. Clean Transparent Pricing */}
        <LandingPricing />

        {/* 6. Grand Finale Conversion CTA */}
        <LandingCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
