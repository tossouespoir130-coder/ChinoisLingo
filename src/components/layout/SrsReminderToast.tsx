'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, usePathname } from 'next/navigation';
import { usePreferences } from '@/context/PreferencesContext';
import { Clock, X, Sparkles } from 'lucide-react';
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
    // Montage cote navigateur : indispensable avant createPortal, qui a besoin
    // de document.body. C'est le seul moyen de le savoir.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!dailyReminder || pathname === '/vocabulaire' || pathname === '/connexion') {
      // Masquage immediat au changement de page : laisser le rappel visible
      // sur /vocabulaire n'aurait aucun sens, l'apprenant y est deja.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(false);
      return;
    }

    const dismissed =
      typeof window !== 'undefined'
        ? sessionStorage.getItem('chinoislingo_srs_reminder_dismissed')
        : null;
    if (dismissed) return;

    let annule = false;
    let minuteur: ReturnType<typeof setTimeout> | undefined;

    // Le rappel n'apparaît QUE s'il y a réellement des cartes à réviser.
    // Il annonçait auparavant « 12 cartes » en dur, même pour un compte
    // venant d'être créé et n'ayant enregistré aucun mot.
    countWordsDueForReview().then((n) => {
      if (annule || n === 0) return;
      setNbCartes(n);
      minuteur = setTimeout(() => {
        // Une seule notification a la fois : voir coordinateurToasts.
        if (reserverEmplacement('srs')) setIsVisible(true);
      }, 3000);
    });

    return () => {
      annule = true;
      if (minuteur) clearTimeout(minuteur);
      libererEmplacement('srs');
    };
  }, [dailyReminder, pathname]);

  const handleDismiss = () => {
    setIsClosing(true);
    // Disparaît complètement après la douce transition de fermeture
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      // Liberation : l'annonce de nouveau contenu peut prendre la place.
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
            {nbCartes} carte{nbCartes > 1 ? 's' : ''} à réviser aujourd’hui
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
