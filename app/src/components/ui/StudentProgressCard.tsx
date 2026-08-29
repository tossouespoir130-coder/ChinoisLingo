'use client';

import React, { useState, useEffect, useRef } from 'react';
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

  const progressItems = [
    {
      label: 'Leçons Complétées (Formation)',
      current: realData?.completedLessonsCount || 0,
      target: 31,
      color: 'bg-[#6200EE] dark:bg-[#BB86FC]',
      bgTrack: 'bg-[#6200EE]/15 dark:bg-[#6200EE]/25',
    },
    {
      label: 'Mots Mémorisés (Vocabulaire)',
      current: realData?.totalWordsMastered || realData?.totalSavedWords || 0,
      target: 150,
      color: 'bg-[#FFC107]',
      bgTrack: 'bg-[#FFC107]/15 dark:bg-[#FFC107]/25',
    },
    {
      label: 'Écoute & Lecture Audio',
      current: realData?.completedMediaCount || 0,
      target: 20,
      color: 'bg-[#03DAC5]',
      bgTrack: 'bg-[#03DAC5]/15 dark:bg-[#03DAC5]/25',
    },
    {
      label: 'Taux de Rétention Globale',
      current: realData?.totalWordsMastered ? Math.min(100, Math.round((realData.totalWordsMastered / Math.max(1, realData.totalSavedWords)) * 100)) : 95,
      target: 100,
      color: 'bg-[#E91E63]',
      bgTrack: 'bg-[#E91E63]/15 dark:bg-[#E91E63]/25',
    },
  ];

  return (
    <div
      ref={cardRef}
      className="nixtio-card p-5 sm:p-6 flex flex-col justify-between h-full min-w-0 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-base sm:text-lg text-[#212121] dark:text-[#F5F5F5]">
            Progression de l’Élève
          </h3>
          <p className="text-[11px] sm:text-xs text-[#757575] dark:text-[#A0A0A0]">
            Activité d’apprentissage hebdomadaire
          </p>
        </div>

        <select
          aria-label="Période de progression"
          className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#212121] dark:text-[#F5F5F5] outline-none cursor-pointer btn-press"
        >
          <option value="month">Ce Mois</option>
          <option value="week">Cette Semaine</option>
          <option value="all">Global</option>
        </select>
      </div>

      {/* Progress Bars with smooth 3.5s loading animation and counting digits on scroll */}
      <div className="space-y-3.5 mt-4">
        {progressItems.map((item, idx) => {
          const pct = Math.round((item.current / item.target) * 100);
          return (
            <div key={item.label}>
              <div className="flex items-center justify-between text-xs font-medium mb-1">
                <span className="text-[#212121] dark:text-[#F5F5F5] font-semibold">{item.label}</span>
                <span className="text-[#212121] dark:text-[#F5F5F5] font-bold font-display">
                  {animated ? <AnimatedCounter value={pct} duration={380} /> : '0'}%
                </span>
              </div>
              <div className={`w-full h-2.5 rounded-full ${item.bgTrack} overflow-hidden p-0.5 shadow-inner`}>
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{
                    width: animated ? `${pct}%` : '0%',
                    transition: `width 3.5s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 200}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
