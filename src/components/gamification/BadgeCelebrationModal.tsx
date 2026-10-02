'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, CheckCircle2, Star, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserBadgeProgress } from '@/lib/gamification/badgesData';
import { evaluateUserBadges } from '@/lib/gamification/badgesEngine';
import { useAuth } from '@/lib/auth/AuthContext';
import { Portal } from '@/components/ui/Portal';

const ACKNOWLEDGED_STORAGE_KEY = 'chinoislingo_acknowledged_badges';

export function BadgeCelebrationModal() {
  const { profile } = useAuth();
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<UserBadgeProgress | null>(null);

  useEffect(() => {
    if (!profile?.id) return;

    try {
      const allEvaluated = evaluateUserBadges({ profile });
      const raw = localStorage.getItem(ACKNOWLEDGED_STORAGE_KEY);
      const acknowledged: string[] = raw ? JSON.parse(raw) : [];

      // Find first unlocked badge that hasn't been celebrated yet
      const uncelebrated = allEvaluated.find((b) => b.isUnlocked && !acknowledged.includes(b.id));

      if (uncelebrated) {
        setNewlyUnlockedBadge(uncelebrated);
        // Trigger celebratory golden confetti
        setTimeout(() => {
          confetti({
            particleCount: 75,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#6200EE', '#03DAC5', '#FFD700', '#E91E63', '#9C27B0'],
          });
        }, 300);
      }
    } catch {
      // ignore
    }
  }, [profile?.streak_days, profile?.total_words_mastered, profile?.total_minutes_learned, profile?.id]);

  const handleClose = () => {
    if (!newlyUnlockedBadge) return;
    try {
      const raw = localStorage.getItem(ACKNOWLEDGED_STORAGE_KEY);
      const acknowledged: string[] = raw ? JSON.parse(raw) : [];
      if (!acknowledged.includes(newlyUnlockedBadge.id)) {
        acknowledged.push(newlyUnlockedBadge.id);
        localStorage.setItem(ACKNOWLEDGED_STORAGE_KEY, JSON.stringify(acknowledged));
      }
    } catch {
      // ignore
    }
    setNewlyUnlockedBadge(null);
  };

  if (!newlyUnlockedBadge) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-[#1E1E28] rounded-3xl max-w-sm w-full p-6 sm:p-7 shadow-2xl border border-amber-500/40 relative overflow-hidden animate-scaleUp text-center">
          {/* Radiant decorative background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-gradient-to-b from-amber-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={handleClose}
            type="button"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#757575] hover:text-[#212121] dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Trophy Icon with golden glow */}
          <div className="relative mx-auto w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl my-2 border-2 border-amber-400/50 bg-gradient-to-br from-amber-500/30 via-yellow-400/20 to-[#6200EE]/10 animate-bounce-slow">
            <span>{newlyUnlockedBadge.icon}</span>
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Trophée Débloqué !</span>
            </div>

            <h3 className="font-display font-black text-xl text-[#212121] dark:text-[#F5F5F5]">
              {newlyUnlockedBadge.title}
            </h3>

            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1.5 leading-relaxed">
              {newlyUnlockedBadge.description}
            </p>
          </div>

          {/* Track and XP reward banner */}
          <div className="my-5 p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252535] border border-[#E0E0E0] dark:border-[#333345] flex items-center justify-between text-left">
            <div>
              <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] block">
                {newlyUnlockedBadge.trackName}
              </span>
              <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5]">
                Étape {newlyUnlockedBadge.stepInTrack} sur {newlyUnlockedBadge.totalStepsInTrack}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0] block">Récompense</span>
              <span className="text-sm font-black text-amber-500">
                +{newlyUnlockedBadge.xpReward} XP
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            type="button"
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] hover:opacity-95 text-white text-xs font-bold transition-all btn-press shadow-lg shadow-[#6200EE]/30 flex items-center justify-center gap-2"
          >
            <span>Continuer mon apprentissage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Portal>
  );
}
