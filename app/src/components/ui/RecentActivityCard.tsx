'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Headphones, BookOpen, Clock, Music, BookMarked, MessagesSquare, Newspaper } from 'lucide-react';
import { RecentContentItem, RecentContentType } from '@/lib/types';

interface RecentActivityCardProps {
  item: RecentContentItem;
  cascadeClass?: string;
}

export function RecentActivityCard({ item, cascadeClass = '' }: RecentActivityCardProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 350);
    return () => clearTimeout(timer);
  }, []);

  const typeConfigs: Record<
    string,
    {
      icon: React.ElementType;
      badgeStyle: string;
      cardTheme: string;
      progressFill: string;
    }
  > = {
    Formation: {
      icon: GraduationCap,
      badgeStyle: 'bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] border-[#6200EE]/25',
      cardTheme:
        'bg-[#6200EE]/[0.04] dark:bg-[#6200EE]/[0.08] border-[#6200EE]/20 dark:border-[#6200EE]/30',
      progressFill: 'bg-[#6200EE] dark:bg-[#BB86FC]',
    },
    Chanson: {
      icon: Music,
      badgeStyle: 'bg-[#00897B]/15 text-[#00796B] dark:text-[#03DAC5] border-[#00897B]/25',
      cardTheme:
        'bg-[#00897B]/[0.04] dark:bg-[#00897B]/[0.08] border-[#00897B]/20 dark:border-[#00897B]/30',
      progressFill: 'bg-[#00897B]',
    },
    Livre: {
      icon: BookMarked,
      badgeStyle: 'bg-[#E91E63]/15 text-[#E91E63] dark:text-[#F06292] border-[#E91E63]/25',
      cardTheme:
        'bg-[#E91E63]/[0.04] dark:bg-[#E91E63]/[0.08] border-[#E91E63]/20 dark:border-[#E91E63]/30',
      progressFill: 'bg-[#E91E63]',
    },
    Dialogue: {
      icon: MessagesSquare,
      badgeStyle: 'bg-[#00897B]/15 text-[#00796B] dark:text-[#03DAC5] border-[#00897B]/25',
      cardTheme:
        'bg-[#00897B]/[0.04] dark:bg-[#00897B]/[0.08] border-[#00897B]/20 dark:border-[#00897B]/30',
      progressFill: 'bg-[#00897B]',
    },
    Article: {
      icon: Newspaper,
      badgeStyle: 'bg-[#0288D1]/15 text-[#0277BD] dark:text-[#29B6F6] border-[#0288D1]/25',
      cardTheme:
        'bg-[#0288D1]/[0.04] dark:bg-[#0288D1]/[0.08] border-[#0288D1]/20 dark:border-[#0288D1]/30',
      progressFill: 'bg-[#0288D1]',
    },
    Lecture: {
      icon: BookOpen,
      badgeStyle: 'bg-[#03DAC5]/15 text-[#00796B] dark:text-[#03DAC5] border-[#03DAC5]/25',
      cardTheme:
        'bg-[#03DAC5]/[0.04] dark:bg-[#03DAC5]/[0.08] border-[#03DAC5]/20 dark:border-[#03DAC5]/30',
      progressFill: 'bg-[#03DAC5]',
    },
    Histoire: {
      icon: BookOpen,
      badgeStyle: 'bg-[#FF9800]/15 text-[#F57C00] dark:text-[#FFA726] border-[#FF9800]/25',
      cardTheme:
        'bg-[#FF9800]/[0.04] dark:bg-[#FF9800]/[0.08] border-[#FF9800]/20 dark:border-[#FF9800]/30',
      progressFill: 'bg-[#FF9800]',
    },
    Vocabulaire: {
      icon: BookOpen,
      badgeStyle: 'bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] border-[#6200EE]/25',
      cardTheme:
        'bg-[#6200EE]/[0.04] dark:bg-[#6200EE]/[0.08] border-[#6200EE]/20 dark:border-[#6200EE]/30',
      progressFill: 'bg-[#6200EE] dark:bg-[#BB86FC]',
    },
  };

  const defaultConfig = {
    icon: BookOpen,
    badgeStyle: 'bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] border-[#6200EE]/25',
    cardTheme:
      'bg-[#6200EE]/[0.04] dark:bg-[#6200EE]/[0.08] border-[#6200EE]/20 dark:border-[#6200EE]/30',
    progressFill: 'bg-[#6200EE] dark:bg-[#BB86FC]',
  };

  const itemType = (item as any)?.type || (item as any)?.category || 'Formation';
  const itemHref = (item as any)?.linkHref || (item as any)?.href || '/tableau-de-bord';
  const itemProgress = Number((item as any)?.progressPct ?? (item as any)?.progressPercentage ?? 50);
  const itemInfo = (item as any)?.infoBadge || (item as any)?.categoryBadge || (item as any)?.duration || 'En cours';
  const itemLastActivity = (item as any)?.lastActivity || 'Récemment';
  const itemTitle = (item as any)?.title || 'Activité';
  const itemSubtitle = (item as any)?.subtitle || (item as any)?.hskLevel || 'ChinoisLingo';

  const config = (itemType && (typeConfigs as any)[itemType]) || defaultConfig;
  const Icon = config.icon;

  return (
    <div
      className={`p-4 sm:p-4.5 rounded-[24px] border shadow-xs transition-all duration-250 hover:translate-y-[-2px] hover:shadow-md flex flex-col justify-between group ${config.cardTheme} ${cascadeClass}`}
    >
      {/* Top Header: Type Badge & Last Activity */}
      <div className="flex items-center justify-between gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border shadow-2xs ${config.badgeStyle}`}>
          <Icon className="w-3 h-3" />
          <span>{itemType}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#757575] dark:text-[#A0A0A0] font-medium">
          <Clock className="w-3 h-3 opacity-70" />
          <span>{itemLastActivity}</span>
        </div>
      </div>

      {/* Center Title & Subtitle */}
      <div className="my-3">
        <h4 className="font-display font-bold text-sm sm:text-base tracking-tight text-[#212121] dark:text-[#F5F5F5] leading-snug group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors">
          {itemTitle}
        </h4>
        <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] mt-0.5 font-medium line-clamp-1">
          {itemSubtitle}
        </p>
      </div>

      {/* Bottom: Progress Bar with live loading animation & Action */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-16 sm:w-20 h-2 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden shrink-0">
            <div
              className={`h-full rounded-full ${config.progressFill}`}
              style={{
                width: animated ? `${itemProgress}%` : '0%',
                transition: 'width 3.2s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </div>
          <span className="text-[10px] font-bold text-[#757575] dark:text-[#A0A0A0] truncate">
            {itemInfo}
          </span>
        </div>

        <Link
          href={itemHref}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-[11px] font-bold tracking-wide transition-all duration-180 hover:scale-105 active:scale-95 shadow-xs shadow-[#6200EE]/20 shrink-0 btn-press"
        >
          <span>Reprendre</span>
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
