'use client';

import React from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function LandingCTA() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F']
    });
  };

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-tr from-[#6200EE] via-[#7C4DFF] to-[#03DAC5] p-8 sm:p-14 text-center text-white shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Prêt pour l’aventure ?</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight mb-4">
              Parlez chinois avec fierté dès aujourd’hui.
            </h2>

            <p className="text-sm sm:text-base text-purple-100 max-w-lg mx-auto mb-8">
              Créez votre compte gratuit en 30 secondes et découvrez vos premières histoires en immersion.
            </p>

            <Link
              href="/onboarding"
              onClick={triggerConfetti}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-gray-950 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span>Commencer rapidement</span>
              <ArrowRight className="w-4 h-4 text-[#6200EE]" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
