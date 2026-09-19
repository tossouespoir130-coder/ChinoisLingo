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
      particleCount: 40,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F'],
    });
    onStart();
  };

  return (
    <div className="animate-fade-in flex flex-col items-center text-center gap-6 py-2">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6200EE]/10 border border-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-xs font-extrabold uppercase tracking-wider animate-pulse">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Ton compagnon d’apprentissage</span>
      </div>

      {/* Mascot Xiao Li Centered & Animated */}
      <div className="relative my-2 group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-[#6200EE]/15 to-[#03DAC5]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="w-36 h-36 sm:w-44 sm:h-44 relative animate-bounce-subtle transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li - Mascotte ChinoisLingo"
            width={176}
            height={176}
            className="object-contain w-full h-full drop-shadow-md"
            priority
          />
        </div>
      </div>

      {/* Presentation Message */}
      <div className="space-y-3 max-w-md">
        <h2 className="text-2xl sm:text-3xl font-black text-[#212121] dark:text-white font-display tracking-tight">
          Ni hao ! Je suis Xiao Li (小狸) 🐱
        </h2>
        <p className="text-sm sm:text-base text-[#616161] dark:text-[#E0E0E0] leading-relaxed">
          Je suis là pour t’accompagner et rendre ton apprentissage du mandarin simple, motivant et agréable au quotidien.
        </p>
        <div className="p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs text-xs sm:text-sm font-medium text-[#424242] dark:text-[#BDBDBD] flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-[#E91E63] shrink-0" />
          <span>J’ai préparé <strong>4 petites questions rapides</strong> pour personnaliser ton expérience.</span>
        </div>
      </div>

      {/* Start Button */}
      <div className="w-full pt-2">
        <button
          type="button"
          onClick={handleStart}
          className="w-full py-4 rounded-2xl bg-[#6200EE] hover:bg-[#5000CA] text-white font-black text-base shadow-lg shadow-[#6200EE]/25 hover:shadow-xl transition-all btn-press flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <span>C’est parti !</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
