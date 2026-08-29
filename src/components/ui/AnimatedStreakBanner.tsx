'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Check } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useAuth } from '@/lib/auth/AuthContext';
import confetti from 'canvas-confetti';

const WEEK_DAYS = [
  { label: 'Lun', dayNum: 1 },
  { label: 'Mar', dayNum: 2 },
  { label: 'Mer', dayNum: 3 },
  { label: 'Jeu', dayNum: 4 },
  { label: 'Ven', dayNum: 5 },
  { label: 'Sam', dayNum: 6 },
  { label: 'Dim', dayNum: 7 },
];

export function AnimatedStreakBanner() {
  const { profile } = useAuth();
  const [animated, setAnimated] = useState(false);

  // Real user streak and true record (never simulated)
  const realStreak = profile?.streak_days || 1;
  const bestStreak = Math.max(realStreak, (profile as any)?.longest_streak || realStreak);

  // Day of week calculation (1 = Lun, 2 = Mar, ..., 6 = Sam, 7 = Dim)
  const currentDayOfWeek = new Date().getDay(); // 0 is Dim, 1 is Lun...
  const todayDayIndex = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

  // Real active days of the streak during current week (e.g. if today is Samedi (6) and streak is 2 => Ven (5) & Sam (6) are active)
  const startActiveIndex = Math.max(1, todayDayIndex - realStreak + 1);
  const isDayInActiveStreak = (dayNum: number) => {
    return dayNum >= startActiveIndex && dayNum <= todayDayIndex;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#FFC107', '#FF3D00', '#6200EE', '#03DAC5'],
    });
  };

  return (
    <div className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0 overflow-hidden relative">
      
      {/* Left: Interactive Flame with Vivid Fire Burning Animation */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={triggerConfetti}
          type="button"
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FFC107] via-[#FF9800] to-[#FF3D00] text-white flex items-center justify-center shadow-lg shadow-[#FF9800]/40 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 btn-press relative overflow-hidden cursor-pointer"
          title="Cliquez pour célébrer votre série !"
        >
          <Flame className="w-6 h-6 fill-[#FFE082] text-[#FF3D00] flame-burn-vivid" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="font-display font-black text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5] whitespace-nowrap tracking-tight">
              Série de <AnimatedCounter value={realStreak} duration={380} /> {realStreak > 1 ? 'jours' : 'jour'}
            </span>
            <span className="text-[#E0E0E0] dark:text-[#333333] hidden sm:inline">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] font-bold text-xs shrink-0">
              <Trophy className="w-3 h-3 text-[#6200EE] dark:text-[#BB86FC]" />
              <span>
                Record : <AnimatedCounter value={bestStreak} duration={380} /> j
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Modern Streak Days Track with Real Active Days Lighting & Flame Crescendo */}
      <div className="w-full lg:w-96 bg-[#FAFAFA] dark:bg-[#181818] p-3 sm:p-3.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs flex flex-col justify-center gap-2">
        {/* 7 Days Grid with Active Fire Pills and Crescendo Flame Effect */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {WEEK_DAYS.map((day) => {
            const isActiveInStreak = isDayInActiveStreak(day.dayNum);
            const isToday = day.dayNum === todayDayIndex;
            const isFuture = day.dayNum > todayDayIndex;

            // Calculate streak position for crescendo progression (from 0 to 1)
            const activeDaysCount = Math.max(1, todayDayIndex - startActiveIndex + 1);
            const currentStep = day.dayNum - startActiveIndex + 1;
            const crescendoRatio = isActiveInStreak ? currentStep / activeDaysCount : 0;

            // Dynamic Crescendo Gradients & Flame Styles
            let pillBg = 'bg-[#E0E0E0] dark:bg-[#2D2D2D] text-[#9E9E9E] dark:text-[#757575]';
            let flameFill = 'fill-[#FFE082] text-[#FF3D00]';
            let animationDelay = `${(day.dayNum - 1) * 0.18}s`;

            if (isActiveInStreak) {
              if (crescendoRatio >= 0.85) {
                // Maximum Vivid Fire: identical to the main flame
                pillBg = 'bg-gradient-to-tr from-[#FFC107] via-[#FF9800] to-[#FF3D00] text-white shadow-md shadow-[#FF9800]/50 scale-100';
                flameFill = 'fill-[#FFE082] text-[#FF3D00]';
              } else if (crescendoRatio >= 0.5) {
                // Medium Warm Orange
                pillBg = 'bg-gradient-to-tr from-[#FFCA28] via-[#FF9800] to-[#FF7043] text-white shadow-sm shadow-[#FF9800]/30 scale-100';
                flameFill = 'fill-[#FFF3E0] text-[#FF5722]';
              } else {
                // Soft Amber / Gold (Start of Streak)
                pillBg = 'bg-gradient-to-tr from-[#FFE082] via-[#FFCA28] to-[#FFA726] text-[#212121] shadow-2xs shadow-[#FFA726]/20 scale-100';
                flameFill = 'fill-white text-[#FF9800]';
              }
            } else if (isFuture) {
              pillBg = 'bg-[#E0E0E0]/50 dark:bg-[#2D2D2D]/50 text-transparent';
            }

            return (
              <div key={day.dayNum} className="flex flex-col items-center gap-1">
                {/* Day Label */}
                <span
                  className={`text-[10px] sm:text-[11px] transition-colors duration-300 ${
                    isToday
                      ? 'text-[#FF3D00] dark:text-[#FF8A65] font-black'
                      : isActiveInStreak
                      ? 'text-[#FF9800] dark:text-[#FFB74D] font-bold'
                      : 'text-[#9E9E9E] dark:text-[#616161] font-medium'
                  }`}
                >
                  {day.label}
                </span>

                {/* Day Indicator Pill with Living Fire & Crescendo */}
                <div
                  className={`w-full h-6 sm:h-7 rounded-xl flex items-center justify-center transition-all duration-500 overflow-hidden relative ${pillBg} ${
                    isToday ? 'ring-2 ring-[#FF3D00] ring-offset-1 dark:ring-offset-[#181818]' : ''
                  }`}
                >
                  {isActiveInStreak ? (
                    <Flame
                      className={`w-3.5 h-3.5 ${flameFill} flame-burn-vivid drop-shadow-sm`}
                      style={{ animationDelay }}
                    />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E9E9E]/40 dark:bg-[#616161]/40" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
