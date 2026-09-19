'use client';

import React from 'react';
import Image from 'next/image';
import { Building2, Briefcase, Laptop, GraduationCap, Telescope } from 'lucide-react';
import { ProfilType } from './types';

interface StepProfileProps {
  selectedProfil: ProfilType | '';
  onSelect: (id: ProfilType, label: string) => void;
}

export function StepProfile({ selectedProfil, onSelect }: StepProfileProps) {
  const options = [
    {
      id: 'entrepreneur' as ProfilType,
      label: 'Entrepreneur',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#6200EE]/12 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] flex items-center justify-center shrink-0 shadow-2xs">
          <Building2 className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'salarie' as ProfilType,
      label: 'Professionnel salarié',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#00897B]/12 text-[#00796B] dark:bg-[#00897B]/20 dark:text-[#03DAC5] flex items-center justify-center shrink-0 shadow-2xs">
          <Briefcase className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'freelance' as ProfilType,
      label: 'Freelance',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#0288D1]/12 text-[#0288D1] dark:bg-[#0288D1]/20 dark:text-[#4FC3F7] flex items-center justify-center shrink-0 shadow-2xs">
          <Laptop className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'etudiant' as ProfilType,
      label: 'Étudiant',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#FFA000]/12 text-[#E65100] dark:bg-[#FFA000]/20 dark:text-[#FFB74D] flex items-center justify-center shrink-0 shadow-2xs">
          <GraduationCap className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'autre' as ProfilType,
      label: 'Autre',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-[#8E24AA]/12 text-[#8E24AA] dark:bg-[#8E24AA]/20 dark:text-[#CE93D8] flex items-center justify-center shrink-0 shadow-2xs">
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
