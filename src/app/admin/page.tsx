'use client';

import React, { useEffect, useState } from 'react';
import { Users, Crown, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useApiAdmin } from '@/lib/admin/useApiAdmin';

interface Stats {
  totalUtilisateurs: number;
  abonnesActifs: number;
  inscriptionsSemaine: number;
}

const CARTES = [
  {
    cle: 'totalUtilisateurs' as const,
    libelle: 'Utilisateurs inscrits',
    detail: 'Tous comptes confondus',
    icone: Users,
    couleur: '#6200EE',
  },
  {
    cle: 'abonnesActifs' as const,
    libelle: 'Abonnés actifs',
    detail: 'Période payée en cours',
    icone: Crown,
    couleur: '#1B5E20',
  },
  {
    cle: 'inscriptionsSemaine' as const,
    libelle: 'Inscriptions',
    detail: 'Sur les 7 derniers jours',
    icone: UserPlus,
    couleur: '#03DAC5',
  },
];

export default function VueEnsemblePage() {
  const { appeler, pret } = useApiAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!pret) return;
    let annule = false;

    appeler<Stats>('/api/admin/stats')
      .then((d) => !annule && setStats(d))
      .catch((e) => !annule && setErreur((e as Error).message));

    return () => {
      annule = true;
    };
  }, [appeler, pret]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
          Vue d&apos;ensemble
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 sm:mt-1 font-medium">
          Chiffres en temps réel de ChinoisLingo.
        </p>
      </div>

      {erreur && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#DD2C00]/8 border border-[#DD2C00]/25">
          <AlertCircle className="w-4 h-4 text-[#DD2C00] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-[#DD2C00]">{erreur}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {CARTES.map(({ cle, libelle, detail, icone: Icone, couleur }) => (
          <div
            key={cle}
            className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs hover:border-[#6200EE]/40 transition-all group"
          >
            {/* Gabarit d'en-tête de carte de la charte : pastille 40 px
                teintée de la couleur de la métrique, agrandie au survol. */}
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: `${couleur}1A`, color: couleur }}
            >
              <Icone className="w-5 h-5" />
            </div>

            <p className="mt-4 font-display font-black text-3xl sm:text-4xl text-[#212121] dark:text-[#F5F5F5] tabular-nums tracking-tight">
              {stats ? (
                stats[cle].toLocaleString('fr-FR')
              ) : (
                <Loader2 className="w-7 h-7 animate-spin text-[#6200EE]/60" />
              )}
            </p>
            <p className="text-[13px] font-bold text-[#212121] dark:text-[#F5F5F5] mt-1">
              {libelle}
            </p>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">{detail}</p>
          </div>
        ))}
      </div>

      <div className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs">
        <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
          Le statut « abonné actif » est déduit de la date de fin de période, seule
          source fiable : un compte dont le pass a expiré redevient automatiquement
          gratuit sans intervention.
        </p>
      </div>
    </div>
  );
}
