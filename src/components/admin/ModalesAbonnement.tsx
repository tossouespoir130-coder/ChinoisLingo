'use client';

import React, { useState } from 'react';
import { CalendarPlus, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { Portal } from '@/components/ui/Portal';
import { PLANS } from '@/lib/payments/plans';

/**
 * Modales de gestion d'abonnement, conformes à l'architecture du projet :
 * montées via <Portal> dans document.body, fond `bg-black/60 backdrop-blur-sm`,
 * clic sur le fond pour fermer, propagation stoppée sur la carte.
 *
 * Aucune action ne part au clic dans le tableau : elle passe obligatoirement
 * par la confirmation de ces fenêtres.
 */

export interface CibleAction {
  id: string;
  nom: string;
  email: string;
  finPeriode: string | null;
}

/** Durées proposées, dérivées du catalogue tarifaire — une seule source. */
const DUREES = PLANS.map((p) => ({ mois: p.dureeMois, nom: p.nom }));

function formaterLong(d: Date | null): string {
  if (!d) return 'aucune période en cours';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/**
 * Reproduit la règle serveur : on empile sur la période en cours si elle
 * court encore, sinon on repart de maintenant. Le calcul reste indicatif —
 * la fonction Postgres fait foi.
 */
function calculerNouvelleFin(
  finActuelle: string | null,
  mois: number,
  maintenant: Date
): Date {
  const actuelle = finActuelle ? new Date(finActuelle) : null;
  const base =
    actuelle && actuelle.getTime() > maintenant.getTime() ? actuelle : maintenant;

  const resultat = new Date(base.getTime());
  const jour = resultat.getDate();
  resultat.setMonth(resultat.getMonth() + mois);
  // Débordement de fin de mois : 31 janvier + 1 mois → 28/29 février.
  if (resultat.getDate() < jour) resultat.setDate(0);
  return resultat;
}

function Cadre({
  children,
  onFermer,
}: {
  children: React.ReactNode;
  onFermer: () => void;
}) {
  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onFermer}
      >
        <div
          className="w-full max-w-md nixtio-card bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl p-6 shadow-2xl space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Prolongation
// ─────────────────────────────────────────────────────────────────────────

export function ModaleProlongation({
  cible,
  onFermer,
  onConfirmer,
}: {
  cible: CibleAction;
  onFermer: () => void;
  onConfirmer: (mois: number) => Promise<void>;
}) {
  const [mois, setMois] = useState<number>(1);
  const [envoi, setEnvoi] = useState(false);

  // L'instant de référence est figé à l'ouverture de la fenêtre : lire
  // l'horloge à chaque rendu rendrait le composant impur et ferait varier
  // le récapitulatif sous les yeux de l'administrateur.
  const [maintenant] = useState(() => new Date());

  const actuelle = cible.finPeriode ? new Date(cible.finPeriode) : null;
  const active = actuelle !== null && actuelle.getTime() > maintenant.getTime();
  const nouvelle = calculerNouvelleFin(cible.finPeriode, mois, maintenant);

  return (
    <Cadre onFermer={envoi ? () => {} : onFermer}>
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs">
          <CalendarPlus className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-black text-base text-[#212121] dark:text-[#F5F5F5]">
            Prolonger l&apos;abonnement
          </h3>
          <p className="text-xs text-[#757575] dark:text-[#A0A0A0] truncate">
            {cible.nom} — {cible.email}
          </p>
        </div>
      </div>

      <div>
        <p className="text-[10px] uppercase font-extrabold tracking-wider text-[#757575] dark:text-[#A0A0A0] mb-2">
          Durée à ajouter
        </p>
        <div className="grid grid-cols-3 gap-2">
          {DUREES.map((d) => (
            <button
              key={d.mois}
              type="button"
              onClick={() => setMois(d.mois)}
              className={`py-2.5 rounded-2xl text-xs font-bold btn-press transition-all border ${
                mois === d.mois
                  ? 'bg-[#6200EE] text-white border-[#6200EE] shadow-md shadow-[#6200EE]/25'
                  : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#212121] dark:text-[#F5F5F5] border-[#E0E0E0] dark:border-[#333333] hover:border-[#6200EE]/40'
              }`}
            >
              {d.mois} mois
            </button>
          ))}
        </div>
      </div>

      {/* Récapitulatif avant confirmation — exigé avant toute exécution. */}
      <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">
            Expiration actuelle
          </span>
          <span className="text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] text-right">
            {active ? formaterLong(actuelle) : formaterLong(null)}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <ArrowRight className="w-3.5 h-3.5 text-[#6200EE] dark:text-[#BB86FC] rotate-90" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">
            Nouvelle expiration
          </span>
          <span className="text-xs font-black text-[#6200EE] dark:text-[#BB86FC] text-right">
            {formaterLong(nouvelle)}
          </span>
        </div>

        {!active && (
          <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] pt-1 border-t border-[#E0E0E0] dark:border-[#2D2D2D] leading-relaxed">
            Ce compte n&apos;a pas de période en cours : la durée démarre aujourd&apos;hui.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          disabled={envoi}
          onClick={onFermer}
          className="px-4 py-2 rounded-full border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#757575] hover:text-[#212121] dark:hover:text-white transition-all btn-press disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="button"
          disabled={envoi}
          onClick={async () => {
            setEnvoi(true);
            try {
              await onConfirmer(mois);
            } finally {
              setEnvoi(false);
            }
          }}
          className="px-5 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press disabled:opacity-50 flex items-center gap-2"
        >
          {envoi && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Confirmer
        </button>
      </div>
    </Cadre>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Annulation
// ─────────────────────────────────────────────────────────────────────────

export function ModaleAnnulation({
  cible,
  onFermer,
  onConfirmer,
}: {
  cible: CibleAction;
  onFermer: () => void;
  onConfirmer: () => Promise<void>;
}) {
  const [envoi, setEnvoi] = useState(false);

  return (
    <Cadre onFermer={envoi ? () => {} : onFermer}>
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-2xl bg-[#DD2C00]/10 text-[#DD2C00] flex items-center justify-center shadow-2xs">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-black text-base text-[#212121] dark:text-[#F5F5F5]">
            Annuler l&apos;abonnement
          </h3>
          <p className="text-xs text-[#757575] dark:text-[#A0A0A0] truncate">
            Action immédiate et non réversible
          </p>
        </div>
      </div>

      <p className="text-sm text-[#212121] dark:text-[#F5F5F5] leading-relaxed">
        Confirmer l&apos;annulation de l&apos;abonnement de{' '}
        <strong className="font-bold">{cible.nom}</strong>{' '}
        <span className="text-[#757575] dark:text-[#A0A0A0]">({cible.email})</span> ?
      </p>

      <div className="p-3.5 rounded-2xl bg-[#DD2C00]/8 border border-[#DD2C00]/25">
        <p className="text-xs font-medium text-[#DD2C00] leading-relaxed">
          L&apos;utilisateur repassera <strong>immédiatement</strong> en accès gratuit.
          Les jours restants de sa période en cours seront perdus.
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          disabled={envoi}
          onClick={onFermer}
          className="px-4 py-2 rounded-full border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#757575] hover:text-[#212121] dark:hover:text-white transition-all btn-press disabled:opacity-50"
        >
          Conserver l&apos;abonnement
        </button>
        <button
          type="button"
          disabled={envoi}
          onClick={async () => {
            setEnvoi(true);
            try {
              await onConfirmer();
            } finally {
              setEnvoi(false);
            }
          }}
          className="px-5 py-2 rounded-full bg-[#DD2C00] hover:bg-[#B71C00] text-white text-xs font-bold shadow-md shadow-[#DD2C00]/25 transition-all btn-press disabled:opacity-50 flex items-center gap-2"
        >
          {envoi && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          Confirmer l&apos;annulation
        </button>
      </div>
    </Cadre>
  );
}
