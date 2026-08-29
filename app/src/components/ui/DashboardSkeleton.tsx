'use client';

import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-5 sm:space-y-6 w-full max-w-full min-w-0 pb-6 animate-pulse">
      {/* 1. Header Skeleton */}
      <div className="space-y-2">
        <div className="h-8 sm:h-10 w-64 sm:w-80 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        <div className="h-4 sm:h-5 w-80 sm:w-[480px] bg-neutral-200/70 dark:bg-neutral-800/70 rounded-xl" />
      </div>

      {/* 2. Streak Banner Skeleton */}
      <div className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-neutral-200 dark:bg-neutral-800 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
            <div className="h-4 w-44 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-lg" />
          </div>
        </div>
        <div className="w-full lg:w-96 p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="w-5 h-3 bg-neutral-200 dark:bg-neutral-700 rounded" />
            ))}
          </div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
        </div>
      </div>

      {/* DESKTOP & MOBILE GRID SKELETON */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Span 2) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Performance Chart Skeleton */}
          <div className="nixtio-card p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <div className="h-5 w-44 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-3.5 w-60 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-lg" />
              </div>
              <div className="w-24 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            </div>
            {/* Quick metric pills */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 bg-neutral-100 dark:bg-neutral-800/50 rounded-2xl" />
              ))}
            </div>
            {/* Chart bars skeleton */}
            <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
              {[40, 65, 30, 85, 55, 95, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-neutral-200 dark:bg-neutral-800 rounded-t-xl"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Word of the Day Skeleton */}
          <div className="nixtio-card p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-4 w-48 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-lg" />
              </div>
            </div>
          </div>

          {/* Progress & Leaderboard Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((card) => (
              <div
                key={card}
                className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4"
              >
                <div className="flex justify-between">
                  <div className="h-4 w-36 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                  <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                </div>
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4].map((bar) => (
                    <div key={bar} className="space-y-1.5">
                      <div className="flex justify-between">
                        <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
                        <div className="h-3 w-8 bg-neutral-200 dark:bg-neutral-800 rounded" />
                      </div>
                      <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Guides Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2].map((g) => (
              <div
                key={g}
                className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
                <div className="h-5 w-36 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-3.5 w-48 bg-neutral-200/60 dark:bg-neutral-800/60 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (Span 1 on Desktop) */}
        <div className="space-y-6">
          <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-5">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
                <div className="h-3 w-40 bg-neutral-200/60 dark:bg-neutral-800/60 rounded" />
              </div>
              <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
            </div>

            {/* Activities List Skeleton */}
            <div className="space-y-3.5">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/50 flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-200 dark:bg-neutral-700 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 w-3/4 bg-neutral-200 dark:bg-neutral-700 rounded" />
                    <div className="h-2.5 w-1/2 bg-neutral-200/70 dark:bg-neutral-700/70 rounded" />
                  </div>
                </div>
              ))}
            </div>

            {/* Catalog Banner Skeleton */}
            <div className="h-16 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
