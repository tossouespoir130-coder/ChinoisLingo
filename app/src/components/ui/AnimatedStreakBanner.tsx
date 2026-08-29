'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Trophy } from 'lucide-react';
import { mockUserStreak } from '@/lib/mock/dashboard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useAuth } from '@/lib/auth/AuthContext';
import confetti from 'canvas-confetti';

export function AnimatedStreakBanner() {
  const { profile } = useAuth();
  const [bandProgress, setBandProgress] = useState(0);

  const realStreak = profile?.streak_days || 1;
  const bestStreak = Math.max(realStreak, mockUserStreak.best);

  const totalDays = mockUserStreak.history.length;
  // Calculate percentage of the week completed
  const currentDayOfWeek = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const normalizedDay = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;
  const targetPct = Math.round((normalizedDay / 7) * 100);

  useEffect(() => {
    // Gentle delay, then a majestic ~6.8s continuous fill across the week
    const timer = setTimeout(() => {
      setBandProgress(targetPct);
    }, 450);

    return () => clearTimeout(timer);
  }, [targetPct]);

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
          className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FFC107] via-[#FF9800] to-[#FF3D00] text-white flex items-center justify-center shadow-lg shadow-[#FF9800]/40 hover:scale-105 active:scale-95 transition-all duration-200 shrink-0 btn-press relative overflow-hidden"
          title="Cliquez pour célébrer votre série !"
        >
          <Flame className="w-6 h-6 fill-[#FFE082] text-[#FF3D00] flame-burn-vivid" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="font-display font-black text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5] whitespace-nowrap tracking-tight">
              Série de <AnimatedCounter value={realStreak} duration={380} /> jours
            </span>
            <span className="text-[#E0E0E0] dark:text-[#333333] hidden sm:inline">•</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] font-bold text-xs shrink-0">
              <Trophy className="w-3 h-3 text-[#6200EE] dark:text-[#BB86FC]" />
              <span>
                Battez votre record (<AnimatedCounter value={bestStreak} duration={380} /> j)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Clean Continuous Animated Progress Band (Fusion Jaune et Rouge) */}
      <div className="w-full lg:w-96 bg-[#FAFAFA] dark:bg-[#181818] p-3 sm:p-3.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs flex flex-col justify-center gap-2">
        {/* Day labels above the track */}
        <div className="flex justify-between items-center px-1">
          {mockUserStreak.history.map((day, idx) => {
            const isCovered = (idx / (totalDays - 1)) * 100 <= bandProgress;
            return (
              <span
                key={day.date}
                className={`text-[10px] sm:text-[11px] font-bold transition-colors duration-1000 ${
                  isCovered
                    ? 'text-[#FF3D00] dark:text-[#FF8A65] font-extrabold'
                    : 'text-[#757575] dark:text-[#6E6E6E]'
                }`}
              >
                {day.dayLabel}
              </span>
            );
          })}
        </div>

        {/* The Continuous Progress Track */}
        <div className="relative w-full h-3.5 sm:h-4 bg-[#E0E0E0] dark:bg-[#2D2D2D] rounded-full p-0.5 overflow-hidden shadow-inner">
          {/* Animated Glowing Fill Ribbon */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#FFD54F] via-[#FF9800] via-[#FF5722] to-[#DD2C00] shadow-sm shadow-[#FF5722]/40 relative"
            style={{
              width: `${bandProgress}%`,
              transition: 'width 6.8s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Glowing Leading Edge */}
            <div className="absolute right-0 top-0 bottom-0 w-3.5 bg-white/80 rounded-full blur-[1px] animate-pulse" />
          </div>
        </div>
      </div>

    </div>
  );
}
