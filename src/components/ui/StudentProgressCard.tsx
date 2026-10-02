'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Headphones, 
  Sparkles, 
  Clock, 
  Flame, 
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { fetchRealDashboardStats, RealDashboardStats } from '@/lib/services/dashboardService';

interface StudentProgressCardProps {
  stats?: RealDashboardStats | null;
}

export function StudentProgressCard({ stats }: StudentProgressCardProps = {}) {
  const [animated, setAnimated] = useState(false);
  const [realData, setRealData] = useState<RealDashboardStats | null>(stats || null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stats) {
      setRealData(stats);
      return;
    }
    let isMounted = true;
    fetchRealDashboardStats().then((res) => {
      if (isMounted && res) setRealData(res);
    });
    return () => {
      isMounted = false;
    };
  }, [stats]);

  // Trigger animation ONLY when scrolled into view (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const totalMin = realData?.totalMinutesLearned || 0;
  const hours = Math.floor(totalMin / 60);
  const minutes = totalMin % 60;
  const studyTimeString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;

  const progressItems = [
    {
      label: 'Leçons Complétées (Formation)',
      current: realData?.completedLessonsCount || 0,
      target: 31,
      unit: 'leçons',
      icon: GraduationCap,
      color: 'bg-[#6200EE] dark:bg-[#BB86FC]',
      iconBg: 'bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]',
      bgTrack: 'bg-[#6200EE]/15 dark:bg-[#6200EE]/25',
    },
    {
      label: 'Mots Mémorisés (Vocabulaire)',
      current: realData?.totalWordsMastered || realData?.totalSavedWords || 0,
      target: 150,
      unit: 'mots',
      icon: BookOpen,
      color: 'bg-[#FFC107]',
      iconBg: 'bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F]',
      bgTrack: 'bg-[#FFC107]/15 dark:bg-[#FFC107]/25',
    },
    {
      label: 'Écoute & Lecture Audio',
      current: realData?.completedMediaCount || 0,
      target: 20,
      unit: 'contenus',
      icon: Headphones,
      color: 'bg-[#03DAC5]',
      iconBg: 'bg-[#03DAC5]/15 text-[#00897B] dark:text-[#03DAC5]',
      bgTrack: 'bg-[#03DAC5]/15 dark:bg-[#03DAC5]/25',
    },
    {
      label: 'Taux de Rétention Globale',
      current: (realData?.totalSavedWords && realData.totalSavedWords > 0)
        ? Math.min(100, Math.round(((realData.totalWordsMastered || 0) / realData.totalSavedWords) * 100))
        : (realData?.totalWordsMastered ? 100 : 0),
      target: 100,
      unit: '%',
      icon: Sparkles,
      color: 'bg-[#E91E63]',
      iconBg: 'bg-[#E91E63]/10 text-[#E91E63]',
      bgTrack: 'bg-[#E91E63]/15 dark:bg-[#E91E63]/25',
    },
  ];

  return (
    <div
      ref={cardRef}
      className="nixtio-card p-5 sm:p-6 flex flex-col justify-between h-full min-w-0 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5]">
                Progression de l’Élève
              </h3>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                Activité et assimilation globale
              </p>
            </div>
          </div>
        </div>

        {/* 2 Mini KPI Cards pour équilibrer l'espace vertical */}
        <div className="grid grid-cols-2 gap-2.5 my-3.5">
          <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/70 dark:border-[#333333] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-extrabold text-[#757575] dark:text-[#A0A0A0] block">
                Série Active
              </span>
              <span className="text-xs sm:text-sm font-black text-[#212121] dark:text-[#F5F5F5] truncate block">
                {realData?.streakDays || 0} {realData?.streakDays && realData.streakDays > 1 ? 'jours' : 'jour'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/70 dark:border-[#333333] flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-extrabold text-[#757575] dark:text-[#A0A0A0] block">
                Temps d’Étude
              </span>
              <span className="text-xs sm:text-sm font-black text-[#212121] dark:text-[#F5F5F5] truncate block">
                {studyTimeString}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-3">
          {progressItems.map((item, idx) => {
            const pct = item.unit === '%' 
              ? item.current 
              : Math.min(100, Math.round((item.current / item.target) * 100));
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-2.5 rounded-2xl bg-[#FAFAFA]/70 dark:bg-[#252525]/40 border border-[#E0E0E0]/50 dark:border-[#333333]/50">
                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] truncate">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black font-display text-[#212121] dark:text-[#F5F5F5]">
                      {animated ? <AnimatedCounter value={pct} duration={380} /> : '0'}%
                    </span>
                    {item.unit !== '%' && (
                      <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0] ml-1.5">
                        ({item.current}/{item.target})
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-full h-2 rounded-full ${item.bgTrack} overflow-hidden p-0.5 shadow-inner`}>
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: animated ? `${pct}%` : '0%',
                      transition: `width 2.5s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 150}ms`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

