'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PerformanceChart } from '@/components/ui/PerformanceChart';
import { WordOfTheDayCard } from '@/components/ui/WordOfTheDayCard';
import { StudentProgressCard } from '@/components/ui/StudentProgressCard';
import { CommunityLeaderboardCard } from '@/components/ui/CommunityLeaderboardCard';
import { RecentActivityCard } from '@/components/ui/RecentActivityCard';
import { AnimatedStreakBanner } from '@/components/ui/AnimatedStreakBanner';
import { GuideModal } from '@/components/guides/GuideModal';
import { LearningTipsModal } from '@/components/guides/LearningTipsModal';
import { AboutModal } from '@/components/guides/AboutModal';
import { 
  ArrowUpRight, 
  History, 
  Compass, 
  Lightbulb, 
  ArrowRight,
  User,
  CreditCard,
  Sliders,
  Info,
  BookOpen,
  Bookmark,
  TrendingUp
} from 'lucide-react';

const motivationalQuotes = [
  'Prêt à développer votre chinois et progresser à votre rythme chaque jour ?',
  'Chaque nouveau mot maîtrisé vous rapproche du succès avec vos partenaires en Chine !',
  '15 minutes de révision aujourd’hui font la différence lors de votre prochaine négociation.',
  'Votre régularité est la clé pour parler avec assurance sur les marchés et en usine.',
  'Avec ChinoisLingo, le chinois devient facile pas à pas chaque jour.',
  'Votre série de 18 jours est impressionnante. Prêt pour la session d’apprentissage du jour ?',
  'Développez votre Guanxi et ouvrez de nouvelles opportunités commerciales durables.',
  'La persévérance transforme chaque caractère chinois en un atout stratégique pour vos affaires.',
];

import { useAuth } from '@/lib/auth/AuthContext';
import { usePreferences } from '@/context/PreferencesContext';
import { fetchRealDashboardStats } from '@/lib/services/dashboardService';
import { DashboardSkeleton } from '@/components/ui/DashboardSkeleton';

export default function DashboardPage() {
  const { profile, isLoading: authLoading } = useAuth();
  const { userName } = usePreferences();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('chinoislingo_user_dashboard_stats');
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState(motivationalQuotes[0]);
  const [realActivities, setRealActivities] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('chinoislingo_user_dashboard_stats');
        if (cached) {
          const parsed = JSON.parse(cached);
          return parsed.recentActivities || [];
        }
      } catch {
        // ignore
      }
    }
    return [];
  });

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchRealDashboardStats()
      .then((res) => {
        if (isMounted && res) {
          setDashboardData(res);
          if (res.recentActivities) {
            setRealActivities(res.recentActivities);
          }
          try {
            localStorage.setItem('chinoislingo_user_dashboard_stats', JSON.stringify(res));
          } catch {
            // ignore
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching dashboard stats:', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [profile]);

  // Rotate motivational quote on each load/connection
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setMotivationalMessage(motivationalQuotes[randomIndex]);
  }, []);

  // Strict Skeleton Lock: Never display without real user data
  if ((isLoading && !dashboardData) || authLoading) {
    return <DashboardSkeleton />;
  }

  const displayName = profile?.username || profile?.first_name || profile?.full_name || userName || 'Apprenant';

  return (
    <div className="space-y-5 sm:space-y-6 w-full max-w-full min-w-0 pb-6">
      {/* 1. Welcome Title with Dynamic Rotating Encouragement Phrase */}
      <div className="min-w-0">
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
          Bonjour, {displayName} 👋
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-1 font-medium transition-all duration-300">
          {motivationalMessage}
        </p>
      </div>

      {/* 2. Animated Streak Banner with glowing pulse & animated counter */}
      <AnimatedStreakBanner />

      {/* DESKTOP LAYOUT (xl and up: 2 cols left, 1 col right) */}
      <div className="hidden xl:grid xl:grid-cols-3 gap-6 min-w-0">
        {/* Left Column (Span 2) */}
        <div className="xl:col-span-2 space-y-6 min-w-0">
          {/* 3. Performance Chart */}
          <PerformanceChart chartData={dashboardData?.chartData} />

          {/* 4. Word of the Day */}
          <WordOfTheDayCard />

          {/* 6. Section: Progression de l'Élève & Score des Pairs (Ligne 1) */}
          <div className="grid grid-cols-2 gap-6 min-w-0 items-stretch">
            <div className="h-full">
              <StudentProgressCard stats={dashboardData} />
            </div>
            <div className="h-full">
              <CommunityLeaderboardCard />
            </div>
          </div>

          {/* 7. Section: Guide d'Utilisation & Guide d'Apprentissage (Ligne 2) */}
          <div className="grid grid-cols-2 gap-6 min-w-0 items-stretch">
            {/* Guide d'Utilisation */}
            <div
              onClick={() => setIsGuideOpen(true)}
              className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE]/40 transition-all flex flex-col justify-between h-full group shadow-xs hover:shadow-md cursor-pointer btn-press"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20">
                    Plateforme
                  </span>
                </div>

                <h3 className="font-display font-black text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5] mt-3 group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors leading-snug">
                  Guide d’Utilisation
                </h3>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1 leading-relaxed">
                  Le moyen efficace d’utiliser ChinoisLingo.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex items-center justify-between text-xs font-bold text-[#6200EE] dark:text-[#BB86FC]">
                <span>Découvrir l’outil</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>

            {/* Guide d'Apprentissage */}
            <div
              onClick={() => setIsTipsOpen(true)}
              className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#FFC107]/50 transition-all flex flex-col justify-between h-full group shadow-xs hover:shadow-md cursor-pointer btn-press"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] border border-[#FFC107]/30">
                    Méthode
                  </span>
                </div>

                <h3 className="font-display font-black text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5] mt-3 group-hover:text-[#B78103] dark:group-hover:text-[#FFD54F] transition-colors leading-snug">
                  Guide d’Apprentissage
                </h3>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1 leading-relaxed">
                  Des astuces pour apprendre efficacement avec ChinoisLingo.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex items-center justify-between text-xs font-bold text-[#B78103] dark:text-[#FFD54F]">
                <span>Voir les astuces</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Span 1 on Desktop): 5. Continuer & 8. Catalogue */}
        <div className="space-y-6 min-w-0">
          {/* Section Continuer */}
          <div className="nixtio-card p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 min-w-0 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5]">
                  Continuer
                </h3>
                <p className="text-[11px] sm:text-xs text-[#757575] dark:text-[#A0A0A0]">
                  Vos contenus récents (formations, audio & lecture)
                </p>
              </div>

              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#757575] btn-press"
                title="Historique récent"
              >
                <History className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Recent Activities List */}
            <div className="space-y-3.5 sm:space-y-4">
              {realActivities.map((item, idx) => (
                <RecentActivityCard
                  key={item.id}
                  item={item}
                  cascadeClass={`animate-cascade-${Math.min(idx + 1, 4)}`}
                />
              ))}
            </div>

            {/* Livres & Programmes Banner Card */}
            <Link
              href="/livres"
              className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#E91E63] via-[#D81B60] to-[#C2185B] text-white flex items-center justify-between shadow-md shadow-[#E91E63]/25 hover:opacity-95 active:scale-95 transition-all group btn-press"
            >
              <div>
                <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-white/90 tracking-wider block">
                  Catalogue
                </span>
                <span className="text-xs font-bold font-display text-white">
                  Livres & Programmes
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* MOBILE & TABLET LAYOUT (< xl: Strictly Ordered as Requested) */}
      <div className="flex flex-col xl:hidden space-y-5 sm:space-y-6 min-w-0">
        {/* 3. Performance Chart */}
        <PerformanceChart chartData={dashboardData?.chartData} />

        {/* 4. Word of the Day */}
        <WordOfTheDayCard />

        {/* 5. Section Continuer (Recent Activities) */}
        <div className="nixtio-card p-5 sm:p-6 flex flex-col gap-4 min-w-0 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5]">
                Continuer
              </h3>
              <p className="text-[11px] sm:text-xs text-[#757575] dark:text-[#A0A0A0]">
                Vos contenus récents (formations, audio & lecture)
              </p>
            </div>

            <div
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#757575] btn-press"
              title="Historique récent"
            >
              <History className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-3.5">
            {realActivities.map((item, idx) => (
              <RecentActivityCard
                key={item.id}
                item={item}
                cascadeClass={`animate-cascade-${Math.min(idx + 1, 4)}`}
              />
            ))}
          </div>
        </div>

        {/* 6. Progression de l'Élève */}
        <StudentProgressCard stats={dashboardData} />

        {/* 7. Score des Pairs */}
        <CommunityLeaderboardCard />

        {/* 8. Guide d'Utilisation & Guide d'Apprentissage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          {/* Guide d'Utilisation */}
          <div
            onClick={() => setIsGuideOpen(true)}
            className="nixtio-card p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE]/40 transition-all flex flex-col justify-between h-full group shadow-xs cursor-pointer btn-press"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs">
                  <Compass className="w-4.5 h-4.5" />
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20">
                  Plateforme
                </span>
              </div>

              <h3 className="font-display font-black text-base text-[#212121] dark:text-[#F5F5F5] mt-2.5 group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors">
                Guide d’Utilisation
              </h3>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1">
                Le moyen efficace d’utiliser ChinoisLingo.
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex items-center justify-between text-xs font-bold text-[#6200EE] dark:text-[#BB86FC]">
              <span>Découvrir l’outil</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Guide d'Apprentissage */}
          <div
            onClick={() => setIsTipsOpen(true)}
            className="nixtio-card p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#FFC107]/50 transition-all flex flex-col justify-between h-full group shadow-xs cursor-pointer btn-press"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="w-9 h-9 rounded-2xl bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] flex items-center justify-center shadow-2xs">
                  <Lightbulb className="w-4.5 h-4.5" />
                </div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] border border-[#FFC107]/30">
                  Méthode
                </span>
              </div>

              <h3 className="font-display font-black text-base text-[#212121] dark:text-[#F5F5F5] mt-2.5 group-hover:text-[#B78103] dark:group-hover:text-[#FFD54F] transition-colors">
                Guide d’Apprentissage
              </h3>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1">
                Des astuces pour apprendre efficacement avec ChinoisLingo.
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex items-center justify-between text-xs font-bold text-[#B78103] dark:text-[#FFD54F]">
              <span>Voir les astuces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* 9. Catalogue Livres & Programmes Banner */}
        <Link
          href="/livres"
          className="p-4 rounded-2xl bg-gradient-to-r from-[#DD2C00] via-[#FF3D00] to-[#E64A19] text-white flex items-center justify-between shadow-md shadow-[#DD2C00]/25 hover:opacity-95 active:scale-95 transition-all group btn-press"
        >
          <div>
            <span className="text-[10px] uppercase font-extrabold text-white/90 tracking-wider block">
              Catalogue
            </span>
            <span className="text-sm font-bold font-display text-white">
              Livres & Programmes
            </span>
          </div>
          <ArrowUpRight className="w-4 h-4 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* 10. BOTTOM SECTION: Mon Compte • Abonnement • Préférences • À Propos */}
      <div className="pt-3 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {/* 1. Mon Compte -> Profil */}
          <Link
            href="/mon-compte?tab=profile"
            className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE]/40 transition-all flex items-center gap-3.5 group shadow-2xs btn-press"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors truncate">
                Mon Compte
              </h4>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] truncate">
                Profil & Progression
              </p>
            </div>
          </Link>

          {/* 2. Abonnement */}
          <Link
            href="/mon-compte?tab=subscription"
            className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#03DAC5]/50 transition-all flex items-center gap-3.5 group shadow-2xs btn-press"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#03DAC5]/15 text-[#00897B] dark:text-[#03DAC5] flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#00897B] dark:group-hover:text-[#03DAC5] transition-colors truncate">
                Abonnement
              </h4>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] truncate">
                Mobile Money, Carte & PayPal
              </p>
            </div>
          </Link>

          {/* 3. Préférences */}
          <Link
            href="/mon-compte?tab=preferences"
            className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#FFC107]/50 transition-all flex items-center gap-3.5 group shadow-2xs btn-press"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#B78103] dark:group-hover:text-[#FFD54F] transition-colors truncate">
                Préférences
              </h4>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] truncate">
                Audio, Pinyin & Thème
              </p>
            </div>
          </Link>

          {/* 4. À Propos */}
          <div
            onClick={() => setIsAboutOpen(true)}
            className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#E91E63]/50 transition-all flex items-center gap-3.5 group shadow-2xs cursor-pointer btn-press"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#E91E63]/15 text-[#E91E63] dark:text-[#F06292] flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
              <Info className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#E91E63] dark:group-hover:text-[#F06292] transition-colors truncate">
                À Propos
              </h4>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] truncate">
                Le chinois devient facile
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Portaled Modals for Guides & About */}
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <LearningTipsModal isOpen={isTipsOpen} onClose={() => setIsTipsOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
