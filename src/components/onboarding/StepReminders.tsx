'use client';

import React from 'react';
import Image from 'next/image';
import { TrendingUp, Bell } from 'lucide-react';

interface StepRemindersProps {
  onChoose: (accept: boolean) => void;
}

export function StepReminders({ onChoose }: StepRemindersProps) {
  return (
    <div className="animate-fade-in flex flex-col items-center text-center gap-6">
      <h2 className="text-xl sm:text-2xl font-bold text-[#212121] dark:text-[#F5F5F5] max-w-sm">
        Veux-tu que je te rappelle de continuer à étudier ?
      </h2>

      {/* Central Mascot with Bell */}
      <div className="w-40 h-40 relative my-1 animate-bounce-subtle">
        <Image
          src="/images/onboarding/mascot-bell.png"
          alt="Xiao Li - Rappels d'étude"
          width={160}
          height={160}
          className="object-contain"
          priority
        />
      </div>

      {/* 2 Benefit Cards */}
      <div className="w-full flex flex-col gap-3 text-left">
        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-300 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-[#424242] dark:text-[#E0E0E0] leading-snug">
            Les personnes qui activent les rappels ont un taux d’atteinte des objectifs supérieur de{' '}
            <strong className="text-[#E65100] dark:text-[#FFB74D] font-bold">51%</strong> à celui des autres.
          </p>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-[#424242] dark:text-[#E0E0E0] leading-snug">
            Rassure-toi : Xiao Li ne te rappellera que lorsque tu en auras vraiment besoin, sans jamais te déranger.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3 pt-2">
        <button
          type="button"
          onClick={() => onChoose(true)}
          className="w-full py-4 rounded-2xl bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold text-base shadow-md hover:shadow-lg transition-all btn-press cursor-pointer"
        >
          Oui ! Je vais continuer à apprendre !
        </button>

        <button
          type="button"
          onClick={() => onChoose(false)}
          className="text-sm font-medium text-[#757575] dark:text-[#9E9E9E] hover:text-[#424242] dark:hover:text-white py-2 transition-colors cursor-pointer"
        >
          Pas maintenant, je risque d’oublier d’étudier
        </button>
      </div>
    </div>
  );
}
