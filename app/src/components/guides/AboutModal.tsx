'use client';

import React from 'react';
import { Portal } from '@/components/ui/Portal';
import { X, Sparkles, ShieldCheck, Heart, Mail } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="nixtio-card w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Brand & Official Slogan */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#6200EE] text-white flex items-center justify-center font-hanzi font-black text-xl shadow-md shadow-[#6200EE]/30 shrink-0">
                华
              </div>
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
                  ChinoisLingo
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#6200EE] dark:text-[#BB86FC] mt-0.5">
                  Avec ChinoisLingo, le chinois devient facile.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Official Mission Statement */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-2.5">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Notre Mission</span>
            </h4>
            <p className="text-xs sm:text-sm text-[#212121] dark:text-[#E0E0E0] leading-relaxed">
              ChinoisLingo est une plateforme d&apos;apprentissage du chinois mandarin conçue pour les francophones. Notre mission est de rendre l&apos;apprentissage du chinois divertissant, accessible et facile pour tous, en accompagnant chaque utilisateur sur les quatre piliers essentiels de la langue — écouter, parler, lire et écrire — à son propre rythme.
            </p>
          </div>

          {/* 3 Core Pillars / Values (Répétition Espacée, Communauté, Accessible & Ludique) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center space-y-1">
              <ShieldCheck className="w-5 h-5 text-[#03DAC5] mx-auto" />
              <h5 className="font-display font-bold text-xs text-[#212121] dark:text-[#F5F5F5]">Répétition Espacée</h5>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">Mémorisation longue durée</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center space-y-1">
              <Heart className="w-5 h-5 text-[#E91E63] mx-auto" />
              <h5 className="font-display font-bold text-xs text-[#212121] dark:text-[#F5F5F5]">Communauté</h5>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">Émulation entre pairs</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center space-y-1">
              <Sparkles className="w-5 h-5 text-[#6200EE] dark:text-[#BB86FC] mx-auto" />
              <h5 className="font-display font-bold text-xs text-[#212121] dark:text-[#F5F5F5]">Accessible & Ludique</h5>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">Progressez à votre rythme</p>
            </div>
          </div>

          {/* Contact & Support */}
          <div className="pt-2 border-t border-[#E0E0E0] dark:border-[#2D2D2D] flex items-center justify-between text-xs text-[#757575] dark:text-[#A0A0A0]">
            <span>Version 1.0.0 • ChinoisLingo</span>
            <a
              href="mailto:contact@chinoislingo.com"
              className="inline-flex items-center gap-1 text-[#6200EE] dark:text-[#BB86FC] font-bold hover:underline"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Support Client</span>
            </a>
          </div>

          {/* Close Button */}
          <div className="pt-1 flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press"
            >
              Fermer
            </button>
          </div>

        </div>
      </div>
    </Portal>
  );
}
