'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ArrowRight, Clock } from 'lucide-react';
import { useAbonnement } from '@/lib/payments/useAbonnement';
import { BONUS_PREMIER_PAIEMENT_JOURS } from '@/lib/payments/plans';

/**
 * Bandeau d'accroche affiché au palier gratuit, et rappel d'échéance dans les
 * derniers jours d'un abonnement.
 *
 * Absent de Mon compte : l'onglet Abonnement y présente déjà l'information en
 * grand, le bandeau ferait doublon.
 */
export function BanniereBonus() {
  const pathname = usePathname();
  const { etat, indetermine, estConnecte } = useAbonnement();

  if (indetermine || !estConnecte) return null;
  if (pathname?.startsWith('/mon-compte') || pathname?.startsWith('/abonnement')) return null;
  // Un administrateur a déjà tout le catalogue : lui proposer de s'abonner
  // n'aurait aucun sens.
  if (etat.estAdmin) return null;

  // ── Abonné : on ne le sollicite qu'à l'approche de l'échéance ──────────
  if (etat.estAbonne) {
    if (etat.joursRestants > 5) return null;
    const urgent = etat.joursRestants <= 2;

    return (
      <Link
        href="/mon-compte?tab=subscription"
        className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border mb-4 btn-press transition-all group ${
          urgent
            ? 'bg-[#E91E63]/10 border-[#E91E63]/30 hover:bg-[#E91E63]/15'
            : 'bg-[#6200EE]/8 border-[#6200EE]/25 hover:bg-[#6200EE]/12'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Clock
            className={`w-4 h-4 shrink-0 ${
              urgent ? 'text-[#E91E63] dark:text-[#F06292]' : 'text-[#6200EE] dark:text-[#BB86FC]'
            }`}
          />
          <p className="text-[11px] sm:text-xs font-bold text-[#212121] dark:text-[#F5F5F5] truncate">
            Votre abonnement expire dans{' '}
            {etat.joursRestants <= 1 ? 'moins d’un jour' : `${etat.joursRestants} jours`}
          </p>
        </div>
        <span
          className={`hidden sm:flex items-center gap-1 text-[11px] font-bold whitespace-nowrap shrink-0 ${
            urgent ? 'text-[#E91E63] dark:text-[#F06292]' : 'text-[#6200EE] dark:text-[#BB86FC]'
          }`}
        >
          Renouveler
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </span>
      </Link>
    );
  }

  // ── Palier gratuit : accroche sur le bonus de bienvenue ────────────────
  return (
    <Link
      href="/mon-compte?tab=subscription"
      className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl border border-[#6200EE]/25 bg-gradient-to-r from-[#6200EE]/10 to-[#03DAC5]/10 hover:from-[#6200EE]/15 hover:to-[#03DAC5]/15 mb-4 btn-press transition-all group"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Sparkles className="w-4 h-4 text-[#6200EE] dark:text-[#BB86FC] shrink-0" />
        <p className="text-[11px] sm:text-xs font-bold text-[#212121] dark:text-[#F5F5F5] truncate">
          {etat.bonusDisponible && BONUS_PREMIER_PAIEMENT_JOURS > 0 ? (
            <>
              Abonnez-vous aujourd’hui et obtenez{' '}
              <span className="text-[#6200EE] dark:text-[#BB86FC]">
                {BONUS_PREMIER_PAIEMENT_JOURS} jours en plus
              </span>
            </>
          ) : (
            <>Débloquez tout le catalogue HSK 1 à 6</>
          )}
        </p>
      </div>
      <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#6200EE] dark:text-[#BB86FC] whitespace-nowrap shrink-0">
        Voir les formules
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}
