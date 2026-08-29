'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowLeft, Sparkles } from 'lucide-react';

export default function LivresPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#E91E63]/15 text-[#E91E63] dark:text-[#F06292] flex items-center justify-center shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#E91E63] dark:text-[#F06292] px-2.5 py-1 rounded-full bg-[#E91E63]/10 dark:bg-[#E91E63]/20 border border-[#E91E63]/30">
            Catalogue
          </span>
        </div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-[#212121] dark:text-[#F5F5F5] tracking-tight mt-2">
          Livres & Programmes
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5">
          Catalogue d’ouvrages spécialisés et de programmes d’accompagnement.
        </p>
      </div>

      {/* État Épuré : Bientôt Disponible */}
      <div className="nixtio-card p-8 sm:p-12 text-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-5 max-w-2xl mx-auto shadow-xs">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center text-2xl sm:text-3xl mx-auto shadow-xs">
          📚
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>En cours d’édition & préparation</span>
          </div>

          <h2 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
            Les Ouvrages Officiels Arrivent Bientôt
          </h2>

          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
            Les manuels pratiques, lexiques bilingues et programmes exclusifs conçus par <strong className="text-[#212121] dark:text-white">Espoir Chinois</strong> sont actuellement en cours de finalisation.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/formation"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press"
          >
            Découvrir les formations vidéo
          </Link>
          <Link
            href="/vocabulaire"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-black/5 dark:hover:bg-white/5 transition-all btn-press"
          >
            Pratiquer le vocabulaire
          </Link>
        </div>
      </div>

      {/* Return to Dashboard */}
      <div className="text-center pt-2">
        <Link
          href="/tableau-de-bord"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#757575] hover:text-[#212121] dark:text-[#A0A0A0] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </Link>
      </div>
    </div>
  );
}
