'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
import { Clock, X, Sparkles } from 'lucide-react';

export function SrsReminderToast() {
  const router = useRouter();
  const pathname = usePathname();
  const { dailyReminder } = usePreferences();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Si le rappel quotidien est activé et qu'on n'est pas sur /vocabulaire
    if (dailyReminder && pathname !== '/vocabulaire' && pathname !== '/connexion') {
      const dismissed = typeof window !== 'undefined' ? sessionStorage.getItem('chinoislingo_srs_reminder_dismissed') : null;
      if (!dismissed) {
        // Apparaît discrètement après un délai confortable de 3 secondes
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    } else {
      setIsVisible(false);
    }
  }, [dailyReminder, pathname]);

  const handleDismiss = () => {
    setIsClosing(true);
    // Disparaît complètement après la douce transition de fermeture
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      try {
        sessionStorage.setItem('chinoislingo_srs_reminder_dismissed', 'true');
      } catch {}
    }, 300);
  };

  const handleGoToReview = () => {
    handleDismiss();
    router.push('/vocabulaire?tab=my-words');
  };

  // Ne rien afficher si invisible ou non monté
  if (!isVisible || !dailyReminder || pathname === '/vocabulaire' || pathname === '/connexion' || !mounted) {
    return null;
  }

  const toastContent = (
    <div 
      className={`fixed bottom-16 sm:bottom-5 right-3 sm:right-5 z-50 transition-all duration-300 pointer-events-auto ${
        isClosing ? 'opacity-0 translate-y-3 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-slideUp'
      }`}
    >
      <div className="w-[280px] sm:w-[310px] bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xl border border-[#6200EE]/25 dark:border-[#6200EE]/35 rounded-2xl shadow-xl shadow-[#6200EE]/10 p-3 sm:p-3.5 space-y-2.5 transition-all">
        
        {/* En-tête compact */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-lg bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shrink-0">
              <Clock className="w-3 h-3" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] truncate">
              Rappel SRS
            </span>
          </div>

          <button
            onClick={handleDismiss}
            type="button"
            className="w-5 h-5 rounded-full flex items-center justify-center text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0"
            title="Fermer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Message discret */}
        <div>
          <h6 className="font-display font-bold text-xs text-[#212121] dark:text-[#F5F5F5] leading-snug">
            12 cartes à réviser aujourd’hui
          </h6>
          <p className="text-[10.5px] text-[#757575] dark:text-[#A0A0A0] mt-0.5 leading-snug">
            Gardez votre série de pratique active.
          </p>
        </div>

        {/* Boutons d'action compacts */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={handleGoToReview}
            type="button"
            className="flex-1 py-1.5 px-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-[11px] font-bold shadow-xs transition-all btn-press flex items-center justify-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-[#03DAC5]" />
            <span>Réviser</span>
          </button>

          <button
            onClick={handleDismiss}
            type="button"
            className="py-1.5 px-2.5 rounded-full text-[10.5px] font-semibold text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(toastContent, document.body);
}
