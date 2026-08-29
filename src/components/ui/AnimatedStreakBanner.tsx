'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Flame, Trophy } from 'lucide-react';
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
  const [bandProgress, setBandProgress] = useState(0);

  // Real user streak and true record (never simulated)
  const realStreak = profile?.streak_days || 1;
  const bestStreak = Math.max(realStreak, (profile as any)?.longest_streak || realStreak);

  // Exact synchronization with streak days count (1 to 7 cycle)
  const streakInCycle = realStreak <= 0 ? 0 : ((realStreak - 1) % 7) + 1;
  const targetPct = Math.min(100, Math.round((streakInCycle / 7) * 100));

  useEffect(() => {
    // Gentle delay, then a majestic continuous fill matching exact streak count
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

      {/* Right: Clean Continuous Animated Progress Band (Fusion Jaune et Rouge) */}
      <div className="w-full lg:w-96 bg-[#FAFAFA] dark:bg-[#181818] p-3 sm:p-3.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs flex flex-col justify-center gap-2">
        {/* Day labels of current streak cycle (1 to 7) */}
        <div className="flex justify-between items-center px-1">
          {WEEK_DAYS.map((day, idx) => {
            const dayIndex = idx + 1;
            const isCompletedInStreak = dayIndex <= streakInCycle;
            const isCurrentHead = dayIndex === streakInCycle;

            return (
              <span
                key={day.dayNum}
                className={`text-[10px] sm:text-[11px] transition-colors duration-500 ${
                  isCurrentHead
                    ? 'text-[#FF3D00] dark:text-[#FF8A65] font-black underline underline-offset-2'
                    : isCompletedInStreak
                    ? 'text-[#FF9800] dark:text-[#FFB74D] font-bold'
                    : 'text-[#9E9E9E] dark:text-[#616161] font-medium'
                }`}
              >
                {day.label}
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
              transition: 'width 2.5s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
