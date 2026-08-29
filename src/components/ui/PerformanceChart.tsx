'use client';

import React, { useState, useEffect, useRef } from 'react';
import { mockPerformanceData } from '@/lib/mock/dashboard';
import { fetchRealDashboardStats, RealDashboardStats } from '@/lib/services/dashboardService';

interface PerformanceChartProps {
  chartData?: RealDashboardStats['chartData'] | null;
}

export function PerformanceChart({ chartData }: PerformanceChartProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [realStats, setRealStats] = useState<RealDashboardStats['chartData'] | null>(chartData || null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartData) {
      setRealStats(chartData);
      return;
    }
    let isMounted = true;
    fetchRealDashboardStats().then((res) => {
      if (isMounted && res?.chartData) {
        setRealStats(res.chartData);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [chartData]);

  const emptyWeekData = [
    { label: 'Lun', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Mar', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Mer', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Jeu', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Ven', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Sam', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Dim', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
  ];
  const emptyMonthData = [
    { label: 'Sem 1', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Sem 2', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Sem 3', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
    { label: 'Sem 4', masteredWords: 0, studyTimeHours: 0, retentionRate: 0 },
  ];

  const points = realStats?.[timeframe] || (timeframe === 'week' ? emptyWeekData : emptyMonthData);
  const n = points.length;

  // Dynamic axis scaling adapted to user actual numbers
  const maxWordsInPoints = Math.max(...points.map((p: any) => p.masteredWords || 0), 10);
  const MAX_WORDS = Math.max(50, Math.ceil(maxWordsInPoints * 1.25));

  const maxHoursInPoints = Math.max(...points.map((p: any) => p.studyTimeHours || 0), 0.5);
  const MAX_STUDY_HOURS = Math.max(timeframe === 'week' ? 2 : 10, Math.ceil(maxHoursInPoints * 1.3));

  const MAX_PERCENT = 100;

  // Guaranteed Animation Trigger: triggers on mount, timeframe change, or data update
  useEffect(() => {
    setIsAnimated(false);
    const frame = requestAnimationFrame(() => {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, 50);
      return () => clearTimeout(timer);
    });

    return () => cancelAnimationFrame(frame);
  }, [timeframe, realStats]);

  // SVG Chart Coordinate System
  const width = 680;
  const height = 240;
  const paddingLeft = 44;   // Left Axis (Counts: 0 - MAX_WORDS)
  const paddingRight = 44;  // Right Axis (Percentages: 0% - 100%)
  const paddingTop = 26;
  const paddingBottom = 32;

  const innerWidth = width - paddingLeft - paddingRight;
  const innerHeight = height - paddingTop - paddingBottom;
  const baselineY = paddingTop + innerHeight;

  // Coordinates
  const getSlotCenterX = (idx: number) => {
    const slotWidth = innerWidth / n;
    return paddingLeft + idx * slotWidth + slotWidth / 2;
  };

  // Y Coordinate for Mastered Words (with minimum aesthetic height when > 0)
  const getYWords = (val: number) => {
    const clamped = Math.min(MAX_WORDS, Math.max(0, val));
    const rawH = (clamped / MAX_WORDS) * innerHeight;
    const effectiveH = val > 0 ? Math.max(8, rawH) : 0;
    return paddingTop + innerHeight - effectiveH;
  };

  // Y Coordinate for Study Time
  const getYStudyHours = (hours: number) => {
    const clamped = Math.min(MAX_STUDY_HOURS, Math.max(0, hours));
    const rawH = (clamped / MAX_STUDY_HOURS) * (innerHeight * 0.88);
    const effectiveH = hours > 0 ? Math.max(8, rawH) : 0;
    return paddingTop + innerHeight - effectiveH;
  };

  // Y Coordinate for Retention Rate (0% to 100%)
  const getYRetention = (rate: number) => {
    const clamped = Math.min(MAX_PERCENT, Math.max(0, rate));
    const rawH = (clamped / MAX_PERCENT) * innerHeight;
    const effectiveH = rate > 0 ? Math.max(8, rawH) : 0;
    return paddingTop + innerHeight - effectiveH;
  };

  const activePoint = hoveredIndex !== null && points[hoveredIndex] ? points[hoveredIndex] : null;

  return (
    <div
      ref={chartContainerRef}
      className="nixtio-card p-3.5 sm:p-6 lg:p-7 relative overflow-hidden flex flex-col justify-between w-full max-w-full min-w-0 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs"
    >
      {/* 1. Header (Clean & Direct: Title + Timeframe Selector only) */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 min-w-0 mb-3 sm:mb-4">
        <div className="min-w-0 flex-1 pr-1">
          <h2 className="font-display font-black text-base sm:text-xl lg:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight truncate">
            Graphique de Performance
          </h2>
          <p className="text-[10px] sm:text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5 truncate">
            Suivez vos résultats et observez votre progression en temps réel.
          </p>
        </div>

        {/* Timeframe Selector (Sem / Mois) */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="flex items-center p-0.5 sm:p-1 rounded-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D]">
            {(['week', 'month'] as const).map((key) => {
              const labels = { week: 'Sem', month: 'Mois' };
              const isActive = timeframe === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTimeframe(key)}
                  className={`px-2.5 sm:px-3.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold transition-all btn-press ${
                    isActive
                      ? 'bg-[#6200EE] text-white shadow-xs'
                      : 'text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white'
                  }`}
                >
                  {labels[key]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Interactive SVG 3-Bar Vertical Chart (Mots maîtrisés • Temps d'étude • Taux de rétention) */}
      <div className="w-full h-44 sm:h-56 lg:h-60 relative min-w-0 overflow-hidden">
        {/* Floating Tooltip upon Hover / Touch */}
        {activePoint && hoveredIndex !== null && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -top-1 bg-[#212121]/95 dark:bg-[#181818]/95 backdrop-blur-md text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl shadow-xl border border-white/10 text-xs transition-all duration-150 max-w-[90vw]"
            style={{
              left: `${Math.min(88, Math.max(12, (getSlotCenterX(hoveredIndex) / width) * 100))}%`,
            }}
          >
            <div className="font-bold text-white text-[10px] sm:text-[11px] border-b border-white/15 pb-0.5 mb-1 text-center">
              {activePoint.label}
            </div>
            <div className="space-y-0.5 sm:space-y-1 text-[9px] sm:text-[10.5px]">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#6200EE]" />
                <span className="text-[#BB86FC] font-semibold">Mots maîtrisés :</span>
                <span className="font-black text-white">{activePoint.masteredWords}</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#E91E63]" />
                <span className="text-[#F06292] font-semibold">Temps d’étude :</span>
                <span className="font-black text-white">
                  {timeframe === 'week' ? `${activePoint.studyTimeHours}h` : `${activePoint.studyTimeHours}h`}
                </span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-[#00897B] dark:bg-[#03DAC5]" />
                <span className="text-[#03DAC5] font-semibold">Taux de rétention :</span>
                <span className="font-black text-white">{activePoint.retentionRate}%</span>
              </div>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradient for Mastered Words Bar (Violet) */}
            <linearGradient id="barMasteredGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C4DFF" />
              <stop offset="100%" stopColor="#6200EE" />
            </linearGradient>

            {/* Gradient for Study Time Bar (Rose) */}
            <linearGradient id="barStudyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4081" />
              <stop offset="100%" stopColor="#E91E63" />
            </linearGradient>

            {/* Gradient for Retention Rate Bar (Turquoise) */}
            <linearGradient id="barRetentionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#03DAC5" />
              <stop offset="100%" stopColor="#00897B" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-Axis Scale Markers */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = paddingTop + innerHeight * (1 - ratio);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.07"
                  strokeDasharray="4 4"
                />
                {/* Left Axis: Counts (0 - 500) */}
                <text
                  x={paddingLeft - 6}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9"
                  fontWeight="700"
                  fill="#757575"
                  className="select-none font-sans"
                >
                  {Math.round(ratio * MAX_WORDS)}
                </text>
                {/* Right Axis: Retention % (0% - 100%) */}
                <text
                  x={width - paddingRight + 6}
                  y={y + 3.5}
                  textAnchor="start"
                  fontSize="9"
                  fontWeight="700"
                  fill="#00897B"
                  className="select-none font-sans"
                >
                  {Math.round(ratio * MAX_PERCENT)}%
                </text>
              </g>
            );
          })}

          {/* 3 Grouped Vertical Bars per Column with Smooth Growth Animation on Entry & Switching */}
          {points.map((p: any, idx: number) => {
            const centerX = getSlotCenterX(idx);
            const slotWidth = innerWidth / n;
            const barWidth = Math.min(13, Math.max(5, slotWidth * 0.22));
            const barGap = 2;

            // Target Full Dimensions
            const targetWordsY = getYWords(p.masteredWords);
            const targetWordsH = paddingTop + innerHeight - targetWordsY;

            const targetStudyY = getYStudyHours(p.studyTimeHours);
            const targetStudyH = paddingTop + innerHeight - targetStudyY;

            const targetRetentionY = getYRetention(p.retentionRate);
            const targetRetentionH = paddingTop + innerHeight - targetRetentionY;

            // Animated progressive heights & y coordinates
            const currentWordsH = isAnimated ? targetWordsH : 0;
            const currentWordsY = isAnimated ? targetWordsY : baselineY;

            const currentStudyH = isAnimated ? targetStudyH : 0;
            const currentStudyY = isAnimated ? targetStudyY : baselineY;

            const currentRetentionH = isAnimated ? targetRetentionH : 0;
            const currentRetentionY = isAnimated ? targetRetentionY : baselineY;

            const isHovered = hoveredIndex === idx;

            // Compute 3 bar X offsets centered on column
            const totalGroupWidth = barWidth * 3 + barGap * 2;
            const startX = centerX - totalGroupWidth / 2;

            const xWords = startX;
            const xStudy = startX + barWidth + barGap;
            const xRetention = startX + (barWidth + barGap) * 2;

            const baseDelay = idx * 45;

            return (
              <g
                key={`${timeframe}-${p.label}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(idx)}
                onClick={() => setHoveredIndex(hoveredIndex === idx ? null : idx)}
              >
                {/* Background Column Highlight on Hover */}
                {isHovered && (
                  <rect
                    x={centerX - slotWidth / 2}
                    y={paddingTop}
                    width={slotWidth}
                    height={innerHeight}
                    fill="#6200EE"
                    fillOpacity="0.06"
                    rx="6"
                  />
                )}

                {/* Bar 1: Mots Maîtrisés (Violet) */}
                <rect
                  x={xWords}
                  y={currentWordsY}
                  width={barWidth}
                  height={currentWordsH}
                  rx={barWidth / 2.5}
                  fill="#6200EE"
                  style={{
                    transition: `height 950ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay}ms, y 950ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay}ms`,
                  }}
                  className={`shadow-xs ${isHovered ? 'brightness-125' : ''}`}
                />

                {/* Bar 2: Temps d'étude (Rose) */}
                <rect
                  x={xStudy}
                  y={currentStudyY}
                  width={barWidth}
                  height={currentStudyH}
                  rx={barWidth / 2.5}
                  fill="#E91E63"
                  style={{
                    transition: `height 950ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + 20}ms, y 950ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + 20}ms`,
                  }}
                  className={`shadow-xs ${isHovered ? 'brightness-125' : ''}`}
                />

                {/* Bar 3: Taux de Rétention (Turquoise) */}
                <rect
                  x={xRetention}
                  y={currentRetentionY}
                  width={barWidth}
                  height={currentRetentionH}
                  rx={barWidth / 2.5}
                  fill="#00897B"
                  style={{
                    transition: `height 950ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + 40}ms, y 950ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + 40}ms`,
                  }}
                  className={`shadow-xs ${isHovered ? 'brightness-125' : ''}`}
                />

                {/* Invisible Hover Hitbox for Smooth Touch/Mouse Interaction */}
                <rect
                  x={centerX - slotWidth / 2}
                  y={paddingTop}
                  width={slotWidth}
                  height={innerHeight}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* X-Axis Labels (Jours ou Mois) */}
        <div
          className="flex justify-between items-center absolute bottom-0 select-none pointer-events-none w-full"
          style={{ paddingLeft: `${paddingLeft}px`, paddingRight: `${paddingRight}px` }}
        >
          {points.map((p: any, idx: number) => (
            <div
              key={p.label}
              className="flex-1 text-center"
            >
              <span
                className={`text-[9px] sm:text-xs transition-colors ${
                  hoveredIndex === idx
                    ? 'font-black text-[#6200EE] dark:text-[#BB86FC] scale-110'
                    : 'font-semibold text-[#757575] dark:text-[#A0A0A0]'
                }`}
              >
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Légende discrète et légère en toute petite police */}
      <div className="pt-2 sm:pt-2.5 mt-1 border-t border-[#E0E0E0]/50 dark:border-[#2D2D2D]/50 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[9px] sm:text-[10px] text-[#757575] dark:text-[#A0A0A0] select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#6200EE]" />
          <span className="font-semibold text-[#212121]/80 dark:text-[#F5F5F5]/80">Mots maîtrisés</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E91E63]" />
          <span className="font-semibold text-[#212121]/80 dark:text-[#F5F5F5]/80">Temps d’étude</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00897B] dark:bg-[#03DAC5]" />
          <span className="font-semibold text-[#212121]/80 dark:text-[#F5F5F5]/80">Taux de rétention</span>
        </div>
      </div>
    </div>
  );
}
