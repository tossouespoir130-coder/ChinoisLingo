'use client';

import React from 'react';
import Image from 'next/image';
import { Plane, Palmtree, TrendingUp, Heart, Sparkles } from 'lucide-react';
import { MotivationType } from './types';

interface StepMotivationProps {
  selectedMotivation: MotivationType | '';
  onSelect: (id: MotivationType, label: string) => void;
}

export function StepMotivation({ selectedMotivation, onSelect }: StepMotivationProps) {
  const options = [
    {
      id: 'etudes' as MotivationType,
      label: 'Étudier à l’étranger',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#0288D1]/12 text-[#0288D1] dark:bg-[#0288D1]/20 dark:text-[#4FC3F7] flex items-center justify-center shrink-0 shadow-2xs">
          <Plane className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'voyage' as MotivationType,
      label: 'Voyager',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#00897B]/12 text-[#00796B] dark:bg-[#00897B]/20 dark:text-[#03DAC5] flex items-center justify-center shrink-0 shadow-2xs">
          <Palmtree className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'travail' as MotivationType,
      label: 'Pour le travail & les affaires',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#6200EE]/12 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] flex items-center justify-center shrink-0 shadow-2xs">
          <TrendingUp className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'passion' as MotivationType,
      label: 'Intérêt personnel & culture',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#E91E63]/12 text-[#D81B60] dark:bg-[#E91E63]/20 dark:text-[#F48FB1] flex items-center justify-center shrink-0 shadow-2xs">
          <Heart className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'autre' as MotivationType,
      label: 'Autre',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#8E24AA]/12 text-[#8E24AA] dark:bg-[#8E24AA]/20 dark:text-[#CE93D8] flex items-center justify-center shrink-0 shadow-2xs">
          <Sparkles className="w-5 h-5" />
        </div>
      ),
    },
  ];

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Xiao Li Mascot + Speech Bubble */}
      <div className="flex items-start gap-3.5">
        <div className="w-14 h-14 relative shrink-0">
          <Image
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li - Mascotte ChinoisLingo"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
        </div>
        <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
          <div className="absolute top-4 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
          <p className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] leading-snug">
            Pourquoi souhaites-tu apprendre le chinois ?
          </p>
        </div>
      </div>

      {/* Options Cards */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = selectedMotivation === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id, opt.label)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border transition-all duration-200 btn-press cursor-pointer ${
                isSelected
                  ? 'bg-[#6200EE]/8 dark:bg-[#6200EE]/20 border-[#6200EE] dark:border-[#BB86FC] shadow-sm ring-1 ring-[#6200EE] dark:ring-[#BB86FC]'
                  : 'bg-white dark:bg-[#1E1E1E] border-[#E0E0E0]/80 dark:border-[#2D2D2D] hover:border-[#6200EE]/60 dark:hover:border-[#6200EE]/60 hover:shadow-xs'
              }`}
            >
              {opt.icon}
              <span className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] flex-1">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
