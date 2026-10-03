'use client';

import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  Headphones, 
  Briefcase, 
  ChevronRight,
  Zap,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Crown,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BadgeCategory, BadgeTier, UserBadgeProgress } from '@/lib/gamification/badgesData';
import { evaluateUserBadges, findNextChallengeBadge, getNextChallengeRemainingText } from '@/lib/gamification/badgesEngine';
import { useAuth } from '@/lib/auth/AuthContext';
import { Portal } from '@/components/ui/Portal';

interface BadgesSectionProps {
  savedWordsCount?: number;
  completedContentsMap?: Record<string, { isCompleted: boolean; isFavorite: boolean }>;
  compact?: boolean;
}

const TIER_CONFIG: Record<BadgeTier, { label: string; color: string; border: string; bg: string; glow?: string }> = {
  bronze: {
    label: 'Bronze',
    color: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-600/30',
    bg: 'bg-amber-600/10',
  },
  argent: {
    label: 'Argent',
    color: 'text-slate-600 dark:text-slate-300',
    border: 'border-slate-400/30',
    bg: 'bg-slate-400/10',
  },
  or: {
    label: 'Or',
    color: 'text-amber-500 dark:text-amber-300',
    border: 'border-amber-400/40',
    bg: 'bg-amber-400/15',
  },
  diamant: {
    label: 'Diamant',
    color: 'text-cyan-500 dark:text-cyan-300',
    border: 'border-cyan-400/40',
    bg: 'bg-cyan-400/15',
  },
  supreme: {
    label: 'Suprême',
    color: 'text-fuchsia-600 dark:text-fuchsia-300',
    border: 'border-fuchsia-400/50',
    bg: 'bg-fuchsia-500/15',
    glow: 'shadow-fuchsia-500/20',
  },
};

function getLearnerRank(totalXp: number): { title: string; rankTier: string; icon: string; nextTarget: number } {
  if (totalXp < 500) return { title: 'Novice du Mandarin', rankTier: 'Rang I', icon: '🌱', nextTarget: 500 };
  if (totalXp < 2000) return { title: 'Voyageur Intrépide', rankTier: 'Rang II', icon: '🚀', nextTarget: 2000 };
  if (totalXp < 5000) return { title: 'Praticien Assidu', rankTier: 'Rang III', icon: '⚡', nextTarget: 5000 };
  if (totalXp < 10000) return { title: 'Polyglotte des Affaires', rankTier: 'Rang IV', icon: '💎', nextTarget: 10000 };
  return { title: 'Grand Maître ChinoisLingo', rankTier: 'Rang V', icon: '👑', nextTarget: 25000 };
}

export function BadgesSection({ savedWordsCount, completedContentsMap, compact = false }: BadgesSectionProps) {
  const { profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'unlocked' | 'locked'>('tous');
  const [selectedBadge, setSelectedBadge] = useState<UserBadgeProgress | null>(null);

  const badges = useMemo(() => {
    return evaluateUserBadges({
      profile,
      savedWordsCount,
      completedContentsMap,
    });
  }, [profile, savedWordsCount, completedContentsMap]);

  const stats = useMemo(() => {
    const unlockedCount = badges.filter((b) => b.isUnlocked).length;
    const totalXp = badges.filter((b) => b.isUnlocked).reduce((acc, b) => acc + b.xpReward, 0);
    const totalPossibleXp = badges.reduce((acc, b) => acc + b.xpReward, 0);
    const percent = Math.round((unlockedCount / badges.length) * 100);
    const rank = getLearnerRank(totalXp);
    return { unlockedCount, totalCount: badges.length, totalXp, totalPossibleXp, percent, rank };
  }, [badges]);

  const nextChallenge = useMemo(() => {
    return findNextChallengeBadge(badges);
  }, [badges]);

  // Group badges by track for logical progression display
  const tracks = useMemo(() => {
    const map = new Map<string, { trackId: string; trackName: string; badges: UserBadgeProgress[] }>();
    badges.forEach((b) => {
      if (!map.has(b.trackId)) {
        map.set(b.trackId, { trackId: b.trackId, trackName: b.trackName, badges: [] });
      }
      map.get(b.trackId)!.badges.push(b);
    });
    return Array.from(map.values()).map((t) => ({
      ...t,
      badges: t.badges.sort((a, b) => a.stepInTrack - b.stepInTrack),
    }));
  }, [badges]);

  const filteredBadges = useMemo(() => {
    if (selectedCategory === 'tous') return badges;
    if (selectedCategory === 'unlocked') return badges.filter((b) => b.isUnlocked);
    if (selectedCategory === 'locked') return badges.filter((b) => !b.isUnlocked);
    return badges.filter((b) => b.category === selectedCategory);
  }, [badges, selectedCategory]);

  const handleBadgeClick = (badge: UserBadgeProgress) => {
    setSelectedBadge(badge);
    if (badge.isUnlocked) {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#6200EE', '#03DAC5', '#FFD700', '#E91E63', '#9C27B0'],
      });
    }
  };

  if (compact) {
    return (
      <div className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-[#212121] dark:text-[#F5F5F5]">
                Trophées de Maîtrise
              </h4>
              <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                {stats.unlockedCount} / {stats.totalCount} débloqués · {stats.totalXp} XP ({stats.rank.title})
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-[#6200EE] dark:text-[#BB86FC]">
            {stats.percent}%
          </span>
        </div>

        {/* 🎯 Prochain Défi à Débloquer (Mise en avant) */}
        {nextChallenge && (
          <div
            onClick={() => handleBadgeClick(nextChallenge)}
            className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#6200EE]/8 to-[#03DAC5]/10 border border-amber-500/30 flex items-center justify-between gap-3 cursor-pointer hover:border-amber-500/60 transition-all btn-press group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-lg shadow-sm shrink-0 group-hover:scale-105 transition-transform animate-bounce-slow">
                {nextChallenge.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                    Prochain Défi
                  </span>
                  <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0] font-semibold truncate">
                    {nextChallenge.trackName}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-[#212121] dark:text-[#F5F5F5] truncate mt-0.5 group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors">
                  {nextChallenge.title}
                </h5>
                <p className="text-[10.5px] font-bold text-[#6200EE] dark:text-[#03DAC5] truncate">
                  {getNextChallengeRemainingText(nextChallenge)}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-mono font-bold text-[#212121] dark:text-[#F5F5F5] block">
                {nextChallenge.currentProgress}/{nextChallenge.maxProgress}
              </span>
              <div className="w-16 h-1.5 rounded-full bg-black/10 dark:bg-white/10 mt-1 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#6200EE]"
                  style={{ width: `${nextChallenge.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Mini icons row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {badges.slice(0, 10).map((b) => (
            <button
              key={b.id}
              onClick={() => handleBadgeClick(b)}
              type="button"
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all btn-press shrink-0 border relative ${
                b.isUnlocked
                  ? 'bg-amber-500/10 border-amber-500/30 shadow-xs scale-100 hover:scale-110'
                  : 'bg-black/[0.03] dark:bg-white/[0.04] border-[#E0E0E0]/50 dark:border-[#333333] grayscale opacity-45 hover:opacity-80'
              }`}
              title={`${b.title} (${b.trackName}) : ${b.isUnlocked ? 'Débloqué ✅' : 'À débloquer 🔒'}`}
            >
              <span>{b.icon}</span>
              {!b.isUnlocked && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black/70 text-white flex items-center justify-center text-[8px]">
                  🔒
                </span>
              )}
            </button>
          ))}
        </div>

        {selectedBadge && (
          <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="nixtio-card p-5 sm:p-7 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl space-y-6">
      {/* Top Banner: Rank + XP Score + Mastery Gauge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-[#6200EE] via-[#7C4DFF] to-[#03DAC5] text-white flex items-center justify-center shadow-xl shadow-[#6200EE]/25 shrink-0 text-2xl">
            {stats.rank.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20">
                {stats.rank.rankTier}
              </span>
              <h3 className="font-display font-black text-lg sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
                {stats.rank.title}
              </h3>
            </div>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1">
              {stats.unlockedCount} sur {stats.totalCount} accomplissements débloqués · Suivez votre progression logique.
            </p>
          </div>
        </div>

        {/* Global Progress pill with XP */}
        <div className="flex items-center gap-3.5 bg-[#FAFAFA] dark:bg-[#252525] p-3.5 rounded-2xl border border-[#E0E0E0] dark:border-[#333333] shrink-0">
          <div className="text-right">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
              Score de Maîtrise Total
            </div>
            <div className="text-sm font-black text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-end gap-1.5 mt-0.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{stats.totalXp} XP</span>
              <span className="text-xs font-normal text-[#757575] dark:text-[#A0A0A0]">/ {stats.totalPossibleXp}</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6200EE]/15 to-[#03DAC5]/15 flex items-center justify-center font-black text-sm text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/30 shadow-2xs">
            {stats.percent}%
          </div>
        </div>
      </div>

      {/* 🎯 Next Challenge Banner (Focus Objectif Immédiat) */}
      {nextChallenge && (
        <div 
          onClick={() => setSelectedBadge(nextChallenge)}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#6200EE]/8 to-[#03DAC5]/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-amber-500/60 transition-all cursor-pointer group btn-press"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl shadow-md shrink-0 animate-bounce-slow group-hover:scale-105 transition-transform">
              {nextChallenge.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>Prochain Défi</span>
                </span>
                <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0] font-bold truncate">
                  {nextChallenge.trackName} · Étape {nextChallenge.stepInTrack}/{nextChallenge.totalStepsInTrack}
                </span>
              </div>
              <h4 className="font-display font-black text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5] mt-0.5 truncate group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors">
                {nextChallenge.title}
              </h4>
              <p className="text-xs text-[#6200EE] dark:text-[#03DAC5] font-bold mt-0.5">
                {getNextChallengeRemainingText(nextChallenge)}
              </p>
            </div>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="flex items-center sm:justify-end gap-2 text-xs font-mono font-bold text-[#212121] dark:text-[#F5F5F5] mb-1.5">
              <span>{nextChallenge.currentProgress} / {nextChallenge.maxProgress} {nextChallenge.targetUnit}</span>
              <span className="text-amber-600 dark:text-amber-400">({nextChallenge.progressPercent}%)</span>
            </div>
            <div className="w-full sm:w-44 h-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#6200EE] to-[#03DAC5] transition-all duration-700"
                style={{ width: `${nextChallenge.progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => setSelectedCategory('tous')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all btn-press shrink-0 ${
            selectedCategory === 'tous'
              ? 'bg-[#6200EE] text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
        >
          Tous les Trophées ({badges.length})
        </button>
        <button
          onClick={() => setSelectedCategory('unlocked')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all btn-press shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'unlocked'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Débloqués ({stats.unlockedCount})</span>
        </button>
        <button
          onClick={() => setSelectedCategory('locked')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all btn-press shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'locked'
              ? 'bg-[#212121] dark:bg-white text-white dark:text-[#212121] shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>À débloquer ({badges.length - stats.unlockedCount})</span>
        </button>
        <button
          onClick={() => setSelectedCategory('temps')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all btn-press shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'temps'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Temps d’Étude</span>
        </button>
        <button
          onClick={() => setSelectedCategory('series')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all btn-press shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'series'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Séries & Flammes</span>
        </button>
        <button
          onClick={() => setSelectedCategory('vocabulaire')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all btn-press shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'vocabulaire'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Vocabulaire (HSK)</span>
        </button>
        <button
          onClick={() => setSelectedCategory('immersion')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all btn-press shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'immersion'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
        >
          <Headphones className="w-3.5 h-3.5" />
          <span>Immersion & Écoute</span>
        </button>
        <button
          onClick={() => setSelectedCategory('business')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full font-bold transition-all btn-press shrink-0 flex items-center gap-1.5 ${
            selectedCategory === 'business'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Business & Négociation</span>
        </button>
      </div>

      {/* Badges Grid (Displayed with logical sequence indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const tier = TIER_CONFIG[badge.tier];
          return (
            <div
              key={badge.id}
              onClick={() => handleBadgeClick(badge)}
              className={`p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer btn-press relative overflow-hidden flex flex-col justify-between ${
                badge.isUnlocked
                  ? 'bg-white dark:bg-[#252525] border-amber-500/35 hover:border-amber-500 shadow-xs hover:shadow-md'
                  : 'bg-black/[0.02] dark:bg-white/[0.02] border-[#E0E0E0]/70 dark:border-[#2D2D2D] opacity-80 hover:opacity-100'
              }`}
            >
              {/* Filière & Étape pill header */}
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#E0E0E0]/50 dark:border-[#2D2D2D] text-[10px] text-[#757575] dark:text-[#A0A0A0]">
                <span className="font-bold truncate text-[#6200EE] dark:text-[#BB86FC]">
                  {badge.trackName}
                </span>
                <span className="font-mono shrink-0 px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.05]">
                  Étape {badge.stepInTrack} / {badge.totalStepsInTrack}
                </span>
              </div>

              {/* Main Info */}
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner border transition-transform duration-300 relative ${
                      badge.isUnlocked
                        ? 'bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent border-amber-500/40 scale-105 shadow-md shadow-amber-500/10'
                        : 'bg-black/[0.04] dark:bg-white/[0.04] border-[#E0E0E0]/60 dark:border-[#333333] grayscale'
                    }`}
                  >
                    <span>{badge.icon}</span>
                    {!badge.isUnlocked && (
                      <div className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-black/80 text-white flex items-center justify-center text-[9px] shadow-xs">
                        <Lock className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] flex items-center gap-1.5">
                      {badge.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded border ${tier.bg} ${tier.color} ${tier.border}`}>
                        {tier.label}
                      </span>
                      <span className="text-[10px] font-black text-amber-500">
                        +{badge.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0">
                  {badge.isUnlocked ? (
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-black/10 dark:bg-white/10 text-[#757575] flex items-center justify-center">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] leading-snug mb-3 line-clamp-2">
                {badge.description}
              </p>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-[#757575] dark:text-[#A0A0A0] mb-1">
                  <span>{badge.isUnlocked ? '✓ Débloqué avec succès' : `Objectif : ${badge.conditionDescription}`}</span>
                  <span className="font-bold">
                    {badge.currentProgress} / {badge.maxProgress} {badge.targetUnit}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      badge.isUnlocked
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-[#6200EE] to-[#03DAC5]'
                    }`}
                    style={{ width: `${badge.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBadge && (
        <BadgeDetailModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
      )}
    </div>
  );
}

function BadgeDetailModal({ badge, onClose }: { badge: UserBadgeProgress; onClose: () => void }) {
  const tier = TIER_CONFIG[badge.tier];

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] relative overflow-hidden animate-scaleUp text-center">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#757575] hover:text-[#212121] dark:hover:text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>

          {/* Icon with glow */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl my-2 border border-amber-500/30 bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-transparent">
            {badge.icon}
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold text-[#6200EE] dark:text-[#BB86FC] uppercase tracking-wider">
                {badge.trackName}
              </span>
              <span className="text-[10px] text-[#757575]">· Étape {badge.stepInTrack}/{badge.totalStepsInTrack}</span>
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${tier.bg} ${tier.color} ${tier.border}`}>
              Trophée {tier.label}
            </span>
            <h3 className="font-display font-black text-lg text-[#212121] dark:text-[#F5F5F5] mt-1.5">
              {badge.title}
            </h3>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1">
              {badge.description}
            </p>
          </div>

          {/* Reward & Status */}
          <div className="my-5 p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] space-y-2 text-left">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#757575] dark:text-[#A0A0A0]">Statut</span>
              <span className={`font-bold flex items-center gap-1 ${badge.isUnlocked ? 'text-emerald-600' : 'text-amber-600'}`}>
                {badge.isUnlocked ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                {badge.isUnlocked ? 'Trophée Débloqué' : 'Verrouillé · En cours'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#757575] dark:text-[#A0A0A0]">Récompense XP</span>
              <span className="font-black text-amber-500">+{badge.xpReward} XP</span>
            </div>
            <div className="pt-2 border-t border-[#E0E0E0]/60 dark:border-[#333333]">
              <div className="flex justify-between text-[11px] text-[#757575] dark:text-[#A0A0A0] mb-1">
                <span>Progression de l’étape</span>
                <span className="font-bold">{badge.currentProgress} / {badge.maxProgress} {badge.targetUnit}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] rounded-full"
                  style={{ width: `${badge.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-full py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold transition-all btn-press shadow-md shadow-[#6200EE]/20"
          >
            Fermer
          </button>
        </div>
      </div>
    </Portal>
  );
}
