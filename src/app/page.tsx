import React from 'react';
import type { Metadata } from 'next';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingHero from '@/components/landing/LandingHero';
import LandingCharacters from '@/components/landing/LandingCharacters';
import LandingCombinationMethod from '@/components/landing/LandingCombinationMethod';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPricing from '@/components/landing/LandingPricing';
import LandingTestimonials from '@/components/landing/LandingTestimonials';
import LandingFAQ from '@/components/landing/LandingFAQ';
import LandingCTA from '@/components/landing/LandingCTA';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata: Metadata = {
  title: 'ChinoisLingo — Le chinois devient facile | Plateforme d’Immersion en Mandarin',
  description:
    'Avec ChinoisLingo, le chinois devient facile. Apprenez à parler mandarin avec naturel grâce à nos vidéos scénarisées, nos 7 personnages attachants et la méthode combinatoire exclusive.',
  keywords: [
    'Apprendre le chinois',
    'Mandarin débutant',
    'HSK 1',
    'HSK 2',
    'HSK 3',
    'HSK 4',
    'ChinoisLingo',
    'Espoir Chinois',
    'Méthode combinatoire chinois',
    'Chinois des affaires',
    'Sourcing Chine',
    'Foire de Canton'
  ],
  openGraph: {
    title: 'ChinoisLingo — Le chinois devient facile',
    description: 'La plateforme d’immersion active en mandarin avec vidéos scénarisées, 7 héros et méthode combinatoire.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'ChinoisLingo',
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212] text-gray-900 dark:text-[#F5F5F5] selection:bg-[#6200EE] selection:text-white transition-colors duration-300">
      {/* Sticky Header */}
      <LandingHeader />

      {/* Main Sections */}
      <main className="relative">
        {/* 1. Hero Section */}
        <LandingHero />

        {/* 2. Characters & Video Series Showcase (Key User Request) */}
        <LandingCharacters />

        {/* 3. The Combination Method Interactive Playground */}
        <LandingCombinationMethod />

        {/* 4. Core Pillars & Modules (HSK 1-6, Audio, Videos, Dictionary) */}
        <LandingFeatures />

        {/* 5. Pricing & Subscription Plans */}
        <LandingPricing />

        {/* 6. Social Proof & Student / Business Testimonials */}
        <LandingTestimonials />

        {/* 7. Interactive Accordion FAQ */}
        <LandingFAQ />

        {/* 8. Conversion Grand Finale CTA */}
        <LandingCTA />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
