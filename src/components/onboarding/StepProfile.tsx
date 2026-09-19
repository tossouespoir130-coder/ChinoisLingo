'use client';

import React from 'react';
import Image from 'next/image';
import { Briefcase, Camera, GraduationCap, Globe, Telescope } from 'lucide-react';
import { ProfilType } from './types';

interface StepProfileProps {
  selectedProfil: ProfilType | '';
  onSelect: (id: ProfilType, label: string) => void;
}

export function StepProfile({ selectedProfil, onSelect }: StepProfileProps) {
  const options = [
    {
      id: 'salarie' as ProfilType,
      label: 'Professionnel(le) salarié(e)',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 shadow-xs">
          <Briefcase className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'freelance' as ProfilType,
      label: 'Freelance',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-300 shrink-0 shadow-xs">
          <Camera className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'etudiant' as ProfilType,
      label: 'Étudiant(e) à l’université',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0 shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'lyceen' as ProfilType,
      label: 'Collégien / Lycéen',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/40 flex items-center justify-center text-pink-600 dark:text-pink-300 shrink-0 shadow-xs">
          <Globe className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'autre' as ProfilType,
      label: 'Autre',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0 shadow-xs">
          <Telescope className="w-5 h-5" />
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
            Quel profil te correspond le mieux ?
          </p>
        </div>
      </div>

      {/* Options Cards */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = selectedProfil === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id, opt.label)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border transition-all duration-200 btn-press cursor-pointer ${
                isSelected
                  ? 'bg-[#FFF8E1] dark:bg-[#FFA000]/15 border-[#FFA000] dark:border-[#FFA000] shadow-sm ring-1 ring-[#FFA000]'
                  : 'bg-white dark:bg-[#1E1E1E] border-[#E0E0E0]/80 dark:border-[#2D2D2D] hover:border-[#FFA000]/60 dark:hover:border-[#FFA000]/60 hover:shadow-xs'
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
