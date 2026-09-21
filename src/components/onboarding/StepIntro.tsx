'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StepIntroProps {
  onStart: () => void;
}

export function StepIntro({ onStart }: StepIntroProps) {
  const handleStart = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F'],
    });
    onStart();
  };

  return (
    <div className="flex flex-col items-center text-center gap-5 py-3">
      {/* Top Badge (Stagger 1) */}
      <div className="animate-slide-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6200EE]/10 border border-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-xs font-extrabold uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
        <span>Ton compagnon d’apprentissage</span>
      </div>

      {/* Mascot Xiao Li Centered & Animated (Stagger 2) */}
      <div className="animate-slide-up-2 relative my-1 group">
        <div className="absolute -inset-6 bg-gradient-to-tr from-[#6200EE]/20 via-[#03DAC5]/25 to-transparent rounded-full blur-2xl pointer-events-none animate-pulse" />
        <div className="w-40 h-40 sm:w-48 sm:h-48 relative animate-mascot-float cursor-pointer hover:scale-105 transition-transform duration-300">
          <Image
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li - Mascotte ChinoisLingo"
            width={192}
            height={192}
            className="object-contain w-full h-full"
            priority
          />
        </div>
      </div>

      {/* Presentation Message (Stagger 3) */}
      <div className="animate-slide-up-3 space-y-3 max-w-md w-full px-2">
        <h2 className="text-2xl sm:text-3xl font-black text-[#212121] dark:text-white font-display tracking-tight">
          Nǐhǎo ! Je suis Xiao Li (小狸) 🐱
        </h2>
        <p className="text-sm sm:text-base text-[#616161] dark:text-[#E0E0E0] leading-relaxed">
          Je suis là pour t’accompagner et rendre ton apprentissage du mandarin simple, motivant et agréable au quotidien.
        </p>

        {/* Centered Note Card */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs text-xs sm:text-sm font-medium text-[#424242] dark:text-[#E0E0E0] flex items-center justify-center gap-2.5 text-center">
          <Heart className="w-4 h-4 text-[#E91E63] shrink-0 fill-[#E91E63]/20" />
          <span>J’ai préparé <strong>4 petites questions rapides</strong> pour personnaliser ton expérience.</span>
        </div>
      </div>

      {/* Start Button (Stagger 4) */}
      <div className="animate-slide-up-4 w-full pt-2">
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-[#6200EE] hover:bg-[#5000CA] text-white font-black text-base shadow-lg shadow-[#6200EE]/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all btn-press flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span>C’est parti !</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
