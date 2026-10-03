'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  getSmartMascotRecommendation, 
  shouldShowMascotRecommendation, 
  recordMascotRecommendationShown,
  MascotRecommendation 
} from '@/lib/services/mascotRecommendationService';
import { X, Sparkles, Play, ArrowRight, Compass } from 'lucide-react';
import {
  reserverEmplacement,
  libererEmplacement,
  attendreEmplacement,
} from '@/lib/ui/coordinateurToasts';

export function NewContentToast() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [recommendation, setRecommendation] = useState<MascotRecommendation | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let desabonner: (() => void) | undefined;
    setMounted(true);

    // Ne pas afficher sur la page de connexion
    if (pathname === '/connexion') {
      setIsVisible(false);
      return;
    }

    async function evaluateMascotPopUp() {
      try {
        // Vérifier si le délai variable (2 à 3 jours) est bien respecté
        if (!shouldShowMascotRecommendation()) {
          setIsVisible(false);
          return;
        }

        // Déterminer le niveau de l'élève (HSK 1 par défaut)
        const userLevel = 'HSK 1';
        const rec = await getSmartMascotRecommendation(userLevel);
        
        if (!rec) {
          setIsVisible(false);
          return;
        }

        // Si l'utilisateur est déjà sur la page exacte du contenu recommandé, on évite d'afficher
        const isAlreadyOnPage = pathname === rec.actionUrl.split('?')[0];
        if (isAlreadyOnPage) {
          setIsVisible(false);
          return;
        }

        setRecommendation(rec);

        // Déclenchement fluide après 2.5 secondes
        const timer = setTimeout(() => {
          if (reserverEmplacement('contenu')) {
            setIsVisible(true);
            recordMascotRecommendationShown(rec.id);
          } else {
            desabonner = attendreEmplacement(() => {
              if (reserverEmplacement('contenu')) {
                setIsVisible(true);
                recordMascotRecommendationShown(rec.id);
              }
            });
          }
        }, 2500);

        return () => {
          clearTimeout(timer);
          desabonner?.();
          libererEmplacement('contenu');
        };
      } catch {
        setIsVisible(false);
      }
    }

    evaluateMascotPopUp();
  }, [pathname, profile]);

  // Disparition automatique douce après 10 secondes pour laisser le temps de lire
  useEffect(() => {
    if (isVisible && !isClosing) {
      const autoDismissTimer = setTimeout(() => {
        handleDismiss();
      }, 10000);
      return () => clearTimeout(autoDismissTimer);
    }
  }, [isVisible, isClosing]);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      libererEmplacement('contenu');
    }, 300);
  };

  const handleAction = () => {
    if (!recommendation) return;
    const actionUrl = recommendation.actionUrl;
    handleDismiss();
    if (actionUrl) {
      if (typeof window !== 'undefined' && window.location.pathname === actionUrl.split('?')[0]) {
        window.history.pushState({}, '', actionUrl);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
      router.push(actionUrl);
    }
  };

  if (!isVisible || !recommendation || !mounted || pathname === '/connexion') {
    return null;
  }

  const isVideoOrPodcast = recommendation.actionUrl.includes('formation') || recommendation.categoryLabel.includes('🎬') || recommendation.categoryLabel.includes('🎵');

  return (
    <div 
      className={`fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 transition-all duration-400 pointer-events-auto ${
        isClosing ? 'opacity-0 translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-slideUp'
      }`}
    >
      <div className="w-[305px] sm:w-[350px] bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-2xl border border-[#00BFA5]/30 dark:border-[#03DAC5]/40 rounded-3xl shadow-2xl shadow-[#00BFA5]/20 p-4 space-y-3 transition-all ring-1 ring-black/5 dark:ring-white/5">
        
        {/* Top Bar : Mascotte Badge & Bouton Fermer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#03DAC5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00897B] dark:bg-[#03DAC5]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00897B] dark:text-[#03DAC5] truncate">
              Xiao Li te conseille 🐾
            </span>
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20">
              {recommendation.level}
            </span>
          </div>

          <button
            onClick={handleDismiss}
            type="button"
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all shrink-0 cursor-pointer"
            title="Fermer la recommandation"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Corps : Avatar Mascotte + Question + Description */}
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li (小李)"
            className="w-11 h-11 rounded-2xl object-contain shrink-0 shadow-2xs p-0.5 bg-[#00BFA5]/10 dark:bg-[#03DAC5]/15 ring-2 ring-[#00BFA5]/30"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#757575] dark:text-[#A0A0A0]">
              <Compass className="w-3 h-3 text-[#00897B] dark:text-[#03DAC5]" />
              <span>Est-ce que tu as déjà consulté celui-ci ?</span>
            </div>
            <h5 className="font-display font-black text-xs sm:text-[13px] text-[#212121] dark:text-[#F5F5F5] leading-snug mt-0.5 line-clamp-2">
              {recommendation.title}
            </h5>
            <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] mt-1 leading-snug line-clamp-2">
              {recommendation.description}
            </p>
          </div>
        </div>

        {/* Bouton d'action direct */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAction}
            type="button"
            className="flex-1 py-2 px-3.5 rounded-full bg-gradient-to-r from-[#00897B] to-[#6200EE] hover:opacity-95 text-white text-xs font-bold shadow-md shadow-[#00897B]/25 transition-all btn-press flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {isVideoOrPodcast ? <Play className="w-3.5 h-3.5 fill-white" /> : <Sparkles className="w-3.5 h-3.5 text-[#03DAC5]" />}
            <span className="truncate">{recommendation.actionLabel}</span>
            <ArrowRight className="w-3 h-3 ml-0.5 shrink-0" />
          </button>

          <button
            onClick={handleDismiss}
            type="button"
            className="py-2 px-3 rounded-full text-xs font-semibold text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer shrink-0"
          >
            Plus tard
          </button>
        </div>

      </div>
    </div>
  );
}
