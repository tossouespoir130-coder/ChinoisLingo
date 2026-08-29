'use client';

import React, { useState, useEffect, useRef } from 'react';
import { mockLeaderboard } from '@/lib/mock/dashboard';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export function CommunityLeaderboardCard() {
  const [animated, setAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Trigger animation ONLY when scrolled into view (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect(); // Trigger once on scroll into view
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Distinct brand colors for each peer
  const userColors: Record<string, { text: string; bg: string; shadow: string }> = {
    usr_espoir_001: {
      text: 'text-[#6200EE] dark:text-[#BB86FC]',
      bg: 'bg-[#6200EE] dark:bg-[#BB86FC]',
      shadow: 'shadow-xs shadow-[#6200EE]/30',
    },
    lead_1: {
      text: 'text-[#B78103] dark:text-[#FFD54F]',
      bg: 'bg-[#FFC107]',
      shadow: 'shadow-xs shadow-[#FFC107]/30',
    },
    lead_2: {
      text: 'text-[#6200EE] dark:text-[#BB86FC]',
      bg: 'bg-[#6200EE] dark:bg-[#BB86FC]',
      shadow: 'shadow-xs shadow-[#6200EE]/30',
    },
    lead_3: {
      text: 'text-[#00897B] dark:text-[#03DAC5]',
      bg: 'bg-[#03DAC5]',
      shadow: 'shadow-xs shadow-[#03DAC5]/30',
    },
    lead_4: {
      text: 'text-[#E91E63] dark:text-[#F06292]',
      bg: 'bg-[#E91E63]',
      shadow: 'shadow-xs shadow-[#E91E63]/30',
    },
  };

  return (
    <div
      ref={cardRef}
      className="nixtio-card p-5 sm:p-6 flex flex-col justify-between h-full min-w-0 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5]">
            Score des Pairs
          </h3>
          <p className="text-[11px] sm:text-xs text-[#757575] dark:text-[#A0A0A0]">
            Votre rang parmi les entrepreneurs
          </p>
        </div>

        <select
          aria-label="Période du classement"
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#212121] dark:text-[#F5F5F5] outline-none cursor-pointer btn-press"
        >
          <option value="week">Cette Semaine</option>
          <option value="month">Ce Mois</option>
        </select>
      </div>

      {/* Leaderboard Entries with animated counter and unique color per peer on scroll */}
      <div className="space-y-3.5 mt-4">
        {mockLeaderboard.map((user, idx) => {
          const colorConfig = userColors[user.id] || {
            text: 'text-[#212121] dark:text-[#F5F5F5]',
            bg: 'bg-[#6200EE]',
            shadow: '',
          };

          return (
            <div key={user.id} className="flex items-center gap-3">
              {/* Avatar with country badge */}
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar_url}
                  alt={user.display_name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-1 ring-[#E0E0E0] dark:ring-[#333333]"
                />
                {user.country_code && (
                  <span className="absolute -bottom-1 -right-1 text-[9px] font-bold px-1 rounded-sm bg-white dark:bg-[#252525] text-[#212121] dark:text-[#F5F5F5] shadow-xs border border-[#E0E0E0] dark:border-[#333333]">
                    {user.country_code}
                  </span>
                )}
              </div>

              {/* Name + Animated Horizontal Score Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span
                    className={`truncate font-bold ${
                      user.is_current_user ? 'text-[#6200EE] dark:text-[#BB86FC]' : colorConfig.text
                    }`}
                  >
                    {user.display_name} {user.is_current_user && '(Vous)'}
                  </span>
                  <span className="text-[#212121] dark:text-[#F5F5F5] font-bold font-display ml-2">
                    {animated ? <AnimatedCounter value={user.progress_pct} duration={380} /> : '0'}%
                  </span>
                </div>

                {/* Animated bar with distinct color triggered on scroll */}
                <div className="w-full h-2.5 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${colorConfig.bg} ${colorConfig.shadow}`}
                    style={{
                      width: animated ? `${user.progress_pct}%` : '0%',
                      transition: `width 3.5s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 200}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
