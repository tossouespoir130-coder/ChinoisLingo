'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { initialNotifications, NotificationItem } from '@/lib/data/notificationsData';
import { X, Sparkles, Play, ArrowRight, Bell } from 'lucide-react';

export function NewContentToast() {
  const router = useRouter();
  const pathname = usePathname();
  const [latestNotif, setLatestNotif] = useState<NotificationItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Ne pas afficher sur la page de connexion
    if (pathname === '/connexion') {
      setIsVisible(false);
      return;
    }

    // Trouver la notification la plus récente non lue
    const latest = initialNotifications.find((n) => !n.isRead) || initialNotifications[0];
    if (!latest) return;

    setLatestNotif(latest);

    // Vérifier si ce pop-up a déjà été fermé par l'utilisateur
    const dismissedId = typeof window !== 'undefined' ? localStorage.getItem('chinoislingo_dismissed_content_toast') : null;
    
    // Si l'utilisateur est déjà sur la page exacte de l'actionUrl, ne pas afficher le pop-up
    const isAlreadyOnPage = latest.actionUrl && pathname === latest.actionUrl.split('?')[0];

    if (dismissedId !== latest.id && !isAlreadyOnPage) {
      // Déclenchement naturel après 2.5 secondes
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      if (latestNotif) {
        try {
          localStorage.setItem('chinoislingo_dismissed_content_toast', latestNotif.id);
        } catch {}
      }
    }, 300);
  };

  const handleAction = () => {
    if (!latestNotif) return;
    handleDismiss();
    if (latestNotif.actionUrl) {
      router.push(latestNotif.actionUrl);
    }
  };

  if (!isVisible || !latestNotif || !mounted || pathname === '/connexion') {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 transition-all duration-400 pointer-events-auto ${
        isClosing ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-slideUp'
      }`}
    >
      <div className="w-[300px] sm:w-[340px] bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-2xl border border-[#6200EE]/30 dark:border-[#6200EE]/45 rounded-3xl shadow-2xl shadow-[#6200EE]/20 p-4 space-y-3 transition-all ring-1 ring-black/5 dark:ring-white/5">
        
        {/* Top Bar : Badge & Bouton Fermer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#03DAC5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00897B] dark:bg-[#03DAC5]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] truncate">
              {latestNotif.source === 'founder' ? 'Nouveau • Espoir Chinois' : 'Nouveau Contenu'}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            type="button"
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0 cursor-pointer"
            title="Fermer la notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Corps : Avatar + Titre & Description */}
        <div className="flex items-start gap-3">
          {latestNotif.founderAvatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={latestNotif.founderAvatar}
              alt={latestNotif.founderName || 'Espoir Chinois'}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-[#6200EE]/30 shrink-0 shadow-2xs"
            />
          ) : (
            <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shrink-0 shadow-2xs">
              <Bell className="w-5 h-5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h5 className="font-display font-black text-xs sm:text-[13px] text-[#212121] dark:text-[#F5F5F5] leading-snug line-clamp-2">
              {latestNotif.title}
            </h5>
            <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] mt-1 leading-snug line-clamp-2">
              {latestNotif.message}
            </p>
          </div>
        </div>

        {/* Bouton d'action direct */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAction}
            type="button"
            className="flex-1 py-2 px-4 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {latestNotif.type === 'video' ? <Play className="w-3.5 h-3.5 fill-white" /> : <Sparkles className="w-3.5 h-3.5 text-[#03DAC5]" />}
            <span>{latestNotif.actionLabel || 'Découvrir'}</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>

          <button
            onClick={handleDismiss}
            type="button"
            className="py-2 px-3 rounded-full text-xs font-semibold text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Plus tard
          </button>
        </div>

      </div>
    </div>
  );
}
