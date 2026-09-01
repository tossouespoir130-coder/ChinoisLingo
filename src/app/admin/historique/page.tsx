'use client';

import React, { useEffect, useState } from 'react';
import {
  ScrollText, Loader2, AlertCircle, CalendarPlus, Ban,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useApiAdmin } from '@/lib/admin/useApiAdmin';

interface Action {
  id: string;
  admin_email: string | null;
  target_email: string | null;
  action: 'prolongation' | 'annulation' | string;
  details: {
    mois_ajoutes?: number | null;
    ancienne_fin?: string | null;
    nouvelle_fin?: string | null;
  } | null;
  created_at: string;
}

interface Reponse {
  actions: Action[];
  total: number;
  page: number;
  pages: number;
}

function formaterHorodatage(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleString('fr-FR', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
}

function formaterDateCourte(iso: string | null | undefined): string {
  if (!iso) return 'aucune';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function HistoriquePage() {
  const { appeler, pret } = useApiAdmin();
  const [donnees, setDonnees] = useState<Reponse | null>(null);
  const [page, setPage] = useState(1);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!pret) return;
    let annule = false;
    appeler<Reponse>(`/api/admin/historique?page=${page}`)
      .then((d) => !annule && setDonnees(d))
      .catch((e) => !annule && setErreur((e as Error).message));
    return () => {
      annule = true;
    };
  }, [pret, page, appeler]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
          Historique des actions
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-1 font-medium">
          {donnees ? `${donnees.total.toLocaleString('fr-FR')} action(s)` : 'Chargement…'} —
          lecture seule, aucune trace ne peut être modifiée ni supprimée.
        </p>
      </div>

      {erreur && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#DD2C00]/8 border border-[#DD2C00]/25">
          <AlertCircle className="w-4 h-4 text-[#DD2C00] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-[#DD2C00]">{erreur}</p>
        </div>
      )}

      <div className="nixtio-card bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl overflow-hidden shadow-xs">
        {donnees === null ? (
          <div className="px-5 py-14 text-center">
            <Loader2 className="w-5 h-5 animate-spin text-[#6200EE] mx-auto" />
          </div>
        ) : donnees.actions.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <ScrollText className="w-8 h-8 text-[#E0E0E0] dark:text-[#333333] mx-auto mb-3" />
            <p className="text-sm text-[#757575] dark:text-[#A0A0A0]">
              Aucune action enregistrée pour l&apos;instant.
            </p>
          </div>
        ) : (
          <ul>
            {donnees.actions.map((a) => {
              const prolongation = a.action === 'prolongation';
              const couleur = prolongation ? '#6200EE' : '#DD2C00';
              const Icone = prolongation ? CalendarPlus : Ban;

              return (
                <li
                  key={a.id}
                  className="px-4 sm:px-5 py-4 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]/60 last:border-0 flex items-start gap-3"
                >
                  <div
                    className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: `${couleur}1A`, color: couleur }}
                  >
                    <Icone className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span
                        className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
                        style={{
                          backgroundColor: `${couleur}1A`,
                          color: couleur,
                          borderColor: `${couleur}33`,
                        }}
                      >
                        {prolongation ? 'Prolongation' : 'Annulation'}
                      </span>
                      <span className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5] truncate">
                        {a.target_email ?? 'compte supprimé'}
                      </span>
                    </div>

                    <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1.5 leading-relaxed">
                      {prolongation ? (
                        <>
                          <strong className="text-[#212121] dark:text-[#F5F5F5]">
                            +{a.details?.mois_ajoutes ?? '?'} mois
                          </strong>{' '}
                          — expiration portée du {formaterDateCourte(a.details?.ancienne_fin)} au{' '}
                          <strong className="text-[#212121] dark:text-[#F5F5F5]">
                            {formaterDateCourte(a.details?.nouvelle_fin)}
                          </strong>
                        </>
                      ) : (
                        <>
                          Retour à l&apos;accès gratuit — l&apos;abonnement courait jusqu&apos;au{' '}
                          <strong className="text-[#212121] dark:text-[#F5F5F5]">
                            {formaterDateCourte(a.details?.ancienne_fin)}
                          </strong>
                        </>
                      )}
                    </p>

                    <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] mt-1">
                      Par {a.admin_email ?? '—'} · {formaterHorodatage(a.created_at)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {donnees && donnees.pages > 1 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818]">
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
              Page {donnees.page} sur {donnees.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label="Page précédente"
                className="w-8 h-8 rounded-lg border border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6200EE] transition-colors btn-press"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= donnees.pages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Page suivante"
                className="w-8 h-8 rounded-lg border border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6200EE] transition-colors btn-press"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
