'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { BONUS_PREMIER_PAIEMENT_JOURS } from '@/lib/payments/plans';
import { resumeOffreGratuite } from '@/lib/payments/acces';

/**
 * Écran affiché à la place d'un contenu réservé aux abonnés.
 *
 * Il ne cache pas l'existence du contenu — il en montre le titre et invite à
 * s'abonner. Masquer complètement le catalogue priverait le palier gratuit de
 * son rôle de vitrine.
 */
export function EcranPremium({
  titre,
  rubrique,
  compact = false,
}: {
  /** Titre du contenu verrouillé, pour que l'apprenant sache ce qu'il gagne. */
  titre?: string;
  /** Nom de la rubrique, ex. « chansons » ou « formations ». */
  rubrique?: string;
  /** Version réduite, pour un encart dans une page déjà remplie. */
  compact?: boolean;
}) {
  return (
    <div
      className={`nixtio-card bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center mx-auto animate-cascade-1 ${
        compact ? 'p-6 max-w-md' : 'p-7 sm:p-10 max-w-lg'
      }`}
    >
      <div className="w-14 h-14 rounded-3xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center mx-auto">
        <Lock className="w-6 h-6" />
      </div>

      <h2
        className={`font-display font-black text-[#212121] dark:text-[#F5F5F5] mt-4 ${
          compact ? 'text-lg' : 'text-xl sm:text-2xl'
        }`}
      >
        {titre ? `« ${titre} »` : 'Contenu réservé aux abonnés'}
      </h2>

      <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-2 leading-relaxed">
        {rubrique
          ? `Ce contenu fait partie des ${rubrique} réservées à l'abonnement.`
          : 'Ce contenu fait partie du catalogue réservé à l’abonnement.'}{' '}
        Votre accès gratuit reste ouvert sans limite de durée.
      </p>

      {!compact && (
        <div className="mt-5 p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] text-left">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
            Votre accès gratuit comprend
          </p>
          <ul className="mt-2 space-y-1.5">
            {resumeOffreGratuite().map((ligne) => (
              <li
                key={ligne}
                className="text-xs text-[#212121] dark:text-[#F5F5F5] flex items-start gap-2"
              >
                <span className="text-[#00897B] dark:text-[#03DAC5] shrink-0">✓</span>
                <span className="leading-snug">{ligne}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {BONUS_PREMIER_PAIEMENT_JOURS > 0 && (
        <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E91E63]/10 border border-[#E91E63]/25">
          <Sparkles className="w-3 h-3 text-[#E91E63] dark:text-[#F06292] shrink-0" />
          <span className="text-[11px] font-extrabold text-[#E91E63] dark:text-[#F06292]">
            {BONUS_PREMIER_PAIEMENT_JOURS} jours offerts sur votre premier abonnement
          </span>
        </div>
      )}

      <Link
        href="/mon-compte?tab=subscription"
        className="mt-5 inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press"
      >
        Débloquer tout le catalogue
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/** Petit cadenas posé sur une carte de catalogue verrouillée. */
export function BadgeVerrou({ className = '' }: { className?: string }) {
  return (
    <span
      title="Réservé aux abonnés"
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6200EE]/90 text-white text-[10px] font-extrabold shadow-sm backdrop-blur-sm ${className}`}
    >
      <Lock className="w-2.5 h-2.5" />
      Abonnés
    </span>
  );
}
