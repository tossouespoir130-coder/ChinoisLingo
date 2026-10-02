'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, Check, Info, Snowflake, Zap, HelpCircle } from 'lucide-react';
import { getStreakFreezeStatus, StreakFreezeStatus } from '@/lib/gamification/streakFreezeService';
import { Portal } from '@/components/ui/Portal';

interface StreakFreezeWidgetProps {
  userId?: string | null;
  compact?: boolean;
}

export function StreakFreezeWidget({ userId, compact = false }: StreakFreezeWidgetProps) {
  const [status, setStatus] = useState<StreakFreezeStatus>({
    isAvailable: true,
    isActive: true,
    usedThisMonth: false,
    currentMonthKey: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setStatus(getStreakFreezeStatus(userId));

    const handleFreezeUsed = () => {
      setStatus(getStreakFreezeStatus(userId));
    };

    window.addEventListener('chinoislingo:streak_freeze_used', handleFreezeUsed);
    return () => {
      window.removeEventListener('chinoislingo:streak_freeze_used', handleFreezeUsed);
    };
  }, [userId]);

  if (compact) {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all btn-press bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/50 shadow-xs"
          title="Protection Gel de Série"
        >
          <Snowflake className="w-3.5 h-3.5 text-cyan-500 animate-spin-slow" />
          <span>Gel de Série : {status.isActive ? 'Actif ❄️' : 'Utilisé ce mois'}</span>
        </button>

        {isModalOpen && <StreakFreezeModal status={status} onClose={() => setIsModalOpen(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="nixtio-card p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-transparent border border-cyan-500/25 dark:border-cyan-500/30 relative overflow-hidden">
        {/* Subtle ice background glow */}
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-cyan-400/15 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
              <Snowflake className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-[#212121] dark:text-[#F5F5F5] font-display">
                  Bouclier Gel de Série ❄️
                </h4>
                <span
                  className={`text-[9.5px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                    status.isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  }`}
                >
                  {status.isActive ? 'Bouclier Armé' : 'Utilisé ce mois'}
                </span>
              </div>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                {status.isActive
                  ? 'Protège automatiquement votre flamme en cas d’oubli d’une journée.'
                  : 'Votre bouclier a été utilisé ce mois-ci et se réactivera le 1er du mois prochain.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            type="button"
            className="w-8 h-8 rounded-full bg-white dark:bg-[#252525] border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center hover:bg-cyan-500/10 transition-colors shrink-0 btn-press"
            title="En savoir plus sur le Gel de Série"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isModalOpen && <StreakFreezeModal status={status} onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

function StreakFreezeModal({ status, onClose }: { status: StreakFreezeStatus; onClose: () => void }) {
  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-cyan-500/30 relative overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E0E0E0] dark:border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Snowflake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-[#212121] dark:text-[#F5F5F5]">
                  Protection Gel de Série ❄️
                </h3>
                <span className="text-xs text-[#757575] dark:text-[#A0A0A0]">Tranquillité d’esprit pour votre série</span>
              </div>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#757575] hover:text-[#212121] dark:hover:text-white flex items-center justify-center transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="py-5 space-y-4 text-xs text-[#616161] dark:text-[#BDBDBD] leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-200">
              <p className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                <Zap className="w-4 h-4 text-cyan-500" />
                Statut actuel de votre bouclier
              </p>
              <p>
                {status.isActive
                  ? '✅ Vous disposez de 1 bouclier actif pour ce mois civil. Si un imprévu vous empêche de réviser un jour, votre série de flamme restera préservée !'
                  : '⏳ Votre bouclier a été consommé ce mois-ci. Il sera automatiquement rechargé le 1er du mois prochain.'}
              </p>
            </div>

            <div className="space-y-2.5">
              <h5 className="font-bold text-[#212121] dark:text-[#F5F5F5] uppercase tracking-wider text-[11px]">
                Comment fonctionne le Gel de Série ?
              </h5>
              <ul className="space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-black">1.</span>
                  <span><strong>1 Gel offert chaque mois :</strong> Chaque apprenant reçoit automatiquement 1 bouclier gratuit au début de chaque mois calendaire.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-black">2.</span>
                  <span><strong>Déclenchement automatique :</strong> Aucune action requise. Si vous manquez 1 journée d’apprentissage, le bouclier gèle votre série sans la remettre à zéro.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-500 font-black">3.</span>
                  <span><strong>Reprise fluide :</strong> Dès votre connexion le lendemain, votre série continue de grimper sans perte de record.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#E0E0E0] dark:border-[#2D2D2D] flex justify-end">
            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold transition-all btn-press shadow-md shadow-[#6200EE]/20"
            >
              Compris, merci !
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
