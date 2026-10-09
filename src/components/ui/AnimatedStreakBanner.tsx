'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Trophy, Snowflake } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { useAuth } from '@/lib/auth/AuthContext';
import { getCurrentWeekRangeWAT, getDateStringWAT } from '@/lib/dateUtils';
import { getFrozenDates } from '@/lib/gamification/streakFreezeService';
import { createClient } from '@/lib/supabase/client';
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
  const { profile, user } = useAuth();
  const [animated, setAnimated] = useState(false);
  const [activeDaysSet, setActiveDaysSet] = useState<Set<string>>(new Set());
  const [frozenDaysSet, setFrozenDaysSet] = useState<Set<string>>(new Set());

  // Real user streak and true record (never simulated)
  const realStreak = profile?.streak_days ?? 0;
  const bestStreak = Math.max(realStreak, profile?.max_streak ?? (profile as any)?.longest_streak ?? realStreak);

  // Semaine en cours (Lundi à Dimanche en format YYYY-MM-DD en heure UTC+1)
  const weekRange = getCurrentWeekRangeWAT();
  const todayStr = getDateStringWAT();
  const currentDayOfWeek = new Date().getDay();
  const todayDayIndex = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 200);

    const loadWeekActivity = async () => {
      const activeId = profile?.id || user?.id;
      if (!activeId) return;

      const frozenList = getFrozenDates(activeId);
      setFrozenDaysSet(new Set(frozenList));

      const supabase = createClient();
      const { data } = await supabase
        .from('daily_activity')
        .select('jour')
        .eq('user_id', activeId)
        .gte('jour', weekRange.lundiStr)
        .lte('jour', weekRange.dimancheStr);

      const days = new Set<string>((data || []).map((d: { jour: string }) => d.jour));
      if (profile?.last_active_date === todayStr || user) {
        days.add(todayStr);
      }
      setActiveDaysSet(days);
    };

    loadWeekActivity();

    const handleFreezeUsed = () => {
      const activeId = profile?.id || user?.id;
      if (activeId) {
        setFrozenDaysSet(new Set(getFrozenDates(activeId)));
      }
    };

    window.addEventListener('chinoislingo:streak_freeze_used', handleFreezeUsed);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('chinoislingo:streak_freeze_used', handleFreezeUsed);
    };
  }, [profile?.id, user?.id, profile?.last_active_date, todayStr, weekRange.lundiStr, weekRange.dimancheStr]);

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
            {bestStreak > realStreak && (
              <>
                <span className="text-[#E0E0E0] dark:text-[#333333] hidden sm:inline">•</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] font-bold text-xs shrink-0">
                  <Trophy className="w-3 h-3 text-[#6200EE] dark:text-[#BB86FC]" />
                  <span>
                    Record : <AnimatedCounter value={bestStreak} duration={380} /> j
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Modern Streak Days Track with Real Active Days & Streak Freeze in Blue */}
      <div className="w-full lg:w-96 bg-[#FAFAFA] dark:bg-[#181818] p-3 sm:p-3.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs flex flex-col justify-center gap-2">
        {/* 7 Days Grid with Active Fire Pills, Blue Ice Frozen Pills, and Future Pills */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {WEEK_DAYS.map((day) => {
            const dateStr = weekRange.joursSemaine[day.dayNum - 1];
            const isToday = dateStr === todayStr;
            const isFuture = dateStr > todayStr;
            const isActive = activeDaysSet.has(dateStr);
            const isFrozen = frozenDaysSet.has(dateStr);

            let pillBg = 'bg-[#E0E0E0] dark:bg-[#2D2D2D] text-[#9E9E9E] dark:text-[#757575]';
            let tooltip = `${day.label} : Non complété`;

            if (isFrozen) {
              // ❄️ Gel de Série : Bouclier Bleu / Cyan
              pillBg = 'bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 text-white shadow-md shadow-cyan-500/40 ring-1 ring-cyan-300 scale-100';
              tooltip = `${day.label} : Protégé par le Gel de Série ❄️`;
            } else if (isActive) {
              // 🔥 Jour Actif : Flamme Orange / Jaune
              pillBg = 'bg-gradient-to-tr from-[#FFC107] via-[#FF9800] to-[#FF3D00] text-white shadow-md shadow-[#FF9800]/50 scale-100';
              tooltip = `${day.label} : Jour validé 🔥`;
            } else if (isFuture) {
              pillBg = 'bg-[#E0E0E0]/50 dark:bg-[#2D2D2D]/50 text-transparent';
              tooltip = `${day.label} : À venir`;
            }

            return (
              <div key={day.dayNum} className="flex flex-col items-center gap-1" title={tooltip}>
                {/* Day Label */}
                <span
                  className={`text-[10px] sm:text-[11px] transition-colors duration-300 ${
                    isToday
                      ? 'text-[#FF3D00] dark:text-[#FF8A65] font-black'
                      : isFrozen
                      ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                      : isActive
                      ? 'text-[#FF9800] dark:text-[#FFB74D] font-bold'
                      : 'text-[#9E9E9E] dark:text-[#616161] font-medium'
                  }`}
                >
                  {day.label}
                </span>

                {/* Day Indicator Pill */}
                <div
                  className={`w-full h-6 sm:h-7 rounded-xl flex items-center justify-center transition-all duration-500 overflow-hidden relative ${pillBg} ${
                    isToday ? 'ring-2 ring-[#FF3D00] ring-offset-1 dark:ring-offset-[#181818]' : ''
                  }`}
                >
                  {isFrozen ? (
                    <Snowflake className="w-3.5 h-3.5 text-white animate-spin-slow drop-shadow-xs" />
                  ) : isActive ? (
                    <Flame className="w-3.5 h-3.5 fill-[#FFE082] text-[#FF3D00] flame-burn-vivid drop-shadow-sm" />
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
