'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
import { X, Sparkles } from 'lucide-react';
import { countWordsDueForReview } from '@/lib/services/vocabularyService';
import { reserverEmplacement, libererEmplacement } from '@/lib/ui/coordinateurToasts';

export function SrsReminderToast() {
  const router = useRouter();
  const pathname = usePathname();
  const { dailyReminder } = usePreferences();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  /** Nombre réel de mots dus à la révision. 0 tant qu'on ne l'a pas compté. */
  const [nbCartes, setNbCartes] = useState(0);

  useEffect(() => {
    // Montage côté navigateur
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!dailyReminder || pathname === '/vocabulaire' || pathname === '/connexion') {
      setIsVisible(false);
      return;
    }

    // Cooldown 24h pour ne pas être insistant (pop-up discret une fois en passant)
    const lastShown = typeof window !== 'undefined'
      ? localStorage.getItem('chinoislingo_srs_reminder_last_shown')
      : null;
    if (lastShown) {
      const diffMs = Date.now() - parseInt(lastShown, 10);
      const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
      if (diffMs < TWENTY_FOUR_HOURS) {
        return; // Pas encore 24h écoulées
      }
    }

    const dismissedSession = typeof window !== 'undefined'
      ? sessionStorage.getItem('chinoislingo_srs_reminder_dismissed')
      : null;
    if (dismissedSession) return;

    let annule = false;
    let minuteur: ReturnType<typeof setTimeout> | undefined;

    countWordsDueForReview().then((n) => {
      if (annule || n === 0) return;
      setNbCartes(n);
      minuteur = setTimeout(() => {
        if (reserverEmplacement('srs')) {
          setIsVisible(true);
          try {
            localStorage.setItem('chinoislingo_srs_reminder_last_shown', Date.now().toString());
          } catch {}
        }
      }, 3500);
    });

    return () => {
      annule = true;
      if (minuteur) clearTimeout(minuteur);
      libererEmplacement('srs');
    };
  }, [dailyReminder, pathname]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      libererEmplacement('srs');
      try {
        sessionStorage.setItem('chinoislingo_srs_reminder_dismissed', 'true');
      } catch {}
    }, 300);
  };

  const handleGoToReview = () => {
    handleDismiss();
    router.push('/vocabulaire?tab=my-words');
  };

  if (!isVisible || !dailyReminder || pathname === '/vocabulaire' || pathname === '/connexion' || !mounted) {
    return null;
  }

  const toastContent = (
    <div 
      className={`fixed bottom-16 sm:bottom-5 right-3 sm:right-5 z-50 transition-all duration-300 pointer-events-auto ${
        isClosing ? 'opacity-0 translate-y-3 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-slideUp'
      }`}
    >
      <div className="w-[300px] sm:w-[330px] bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-xl border border-[#6200EE]/25 dark:border-[#6200EE]/35 rounded-2xl shadow-xl shadow-[#6200EE]/10 p-3.5 space-y-2.5 transition-all">
        
        {/* En-tête avec Xiao Li Mascot Avatar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 p-0.5 shrink-0 overflow-hidden border border-[#6200EE]/20">
              <Image
                src="/images/onboarding/xiao-li-avatar.png"
                alt="Xiao Li"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-black text-[#6200EE] dark:text-[#BB86FC] truncate">
                  Xiao Li 🐾
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#03DAC5]/15 text-[#00796B] dark:text-[#03DAC5]">
                  SRS
                </span>
              </div>
              <p className="text-[10px] text-[#757575] dark:text-[#A0A0A0] leading-none mt-0.5">
                Rappel de révision
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            type="button"
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0 cursor-pointer"
            title="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Message de Xiao Li */}
        <div>
          <h6 className="font-display font-bold text-xs text-[#212121] dark:text-[#F5F5F5] leading-snug">
            {nbCartes} mot{nbCartes > 1 ? 's' : ''} à consolider aujourd’hui !
          </h6>
          <p className="text-[10.5px] text-[#757575] dark:text-[#A0A0A0] mt-0.5 leading-snug">
            Quelques minutes pour ancrer votre vocabulaire durablement.
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
            <span>Réviser maintenant</span>
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
