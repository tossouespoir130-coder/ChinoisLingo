'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, Crown, UserPlus, Loader2, AlertCircle, 
  Target, Mail, ShieldAlert
} from 'lucide-react';
import { useApiAdmin } from '@/lib/admin/useApiAdmin';
import { TopContenusWidget } from '@/components/admin/TopContenusWidget';

interface StatsOnboarding {
  totalRenseignes: number;
}

interface Stats {
  totalUtilisateurs: number;
  abonnesActifs: number;
  inscriptionsSemaine: number;
  onboarding?: StatsOnboarding;
}

interface StatsQuota {
  aujourdhui: number;
  ceMois: number;
  limiteJour: number;
  limiteMois: number;
  pourcentageJour: number;
  pourcentageMois: number;
  alerteJour: boolean;
  alerteMois: boolean;
}

export default function VueEnsemblePage() {
  const { appeler, pret } = useApiAdmin();
  const [stats, setStats] = useState<Stats | null>(null);
  const [quota, setQuota] = useState<StatsQuota | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!pret) return;
    let annule = false;

    appeler<Stats>('/api/admin/stats')
      .then((d) => !annule && setStats(d))
      .catch((e) => !annule && setErreur((e as Error).message));

    appeler<StatsQuota>('/api/admin/emails/quota')
      .then((q) => !annule && setQuota(q))
      .catch((e) => console.error('[admin quota]', e));

    return () => {
      annule = true;
    };
  }, [appeler, pret]);

  const total = stats?.totalUtilisateurs || 0;
  const onboarding = stats?.onboarding;
  const tauxOnboarding = total > 0 && onboarding ? Math.round((onboarding.totalRenseignes / total) * 100) : 0;

  const CARTES_KPI = [
    {
      cle: 'totalUtilisateurs',
      valeur: total,
      libelle: 'Utilisateurs inscrits',
      detail: 'Tous comptes confondus',
      icone: Users,
      couleur: '#6200EE',
    },
    {
      cle: 'abonnesActifs',
      valeur: stats?.abonnesActifs || 0,
      libelle: 'Abonnés actifs',
      detail: 'Période payée en cours',
      icone: Crown,
      couleur: '#1B5E20',
    },
    {
      cle: 'inscriptionsSemaine',
      valeur: stats?.inscriptionsSemaine || 0,
      libelle: 'Inscriptions récentes',
      detail: 'Sur les 7 derniers jours',
      icone: UserPlus,
      couleur: '#03DAC5',
    },
    {
      cle: 'profilsRenseignes',
      valeur: onboarding?.totalRenseignes || 0,
      libelle: 'Profils renseignés',
      detail: `${tauxOnboarding}% des inscrits`,
      icone: Target,
      couleur: '#E91E63',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
          Vue d&apos;ensemble
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 sm:mt-1 font-medium">
          Tableau de bord stratégique & analytics d&apos;inscription en temps réel.
        </p>
      </div>

      {erreur && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#DD2C00]/8 border border-[#DD2C00]/25">
          <AlertCircle className="w-4 h-4 text-[#DD2C00] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-[#DD2C00]">{erreur}</p>
        </div>
      )}

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARTES_KPI.map(({ cle, valeur, libelle, detail, icone: Icone, couleur }) => (
          <div
            key={cle}
            className="nixtio-card p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs hover:border-[#6200EE]/40 transition-all group"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform"
              style={{ backgroundColor: `${couleur}1A`, color: couleur }}
            >
              <Icone className="w-5 h-5" />
            </div>

            <p className="mt-4 font-display font-black text-3xl text-[#212121] dark:text-[#F5F5F5] tabular-nums tracking-tight">
              {stats ? (
                valeur.toLocaleString('fr-FR')
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

      {/* Widget de Suivi Quota Resend */}
      {quota && (
        <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#6200EE]/25 dark:border-[#6200EE]/35 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
                    Consommation Emails Resend
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#03DAC5]/15 text-[#00796B] dark:text-[#03DAC5] text-[11px] font-bold">
                    Plan Gratuit
                  </span>
                </div>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                  Surveillance en temps réel des quotas journaliers et mensuels
                </p>
              </div>
            </div>

            {(quota.alerteJour || quota.alerteMois) && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#E53935]/10 border border-[#E53935]/25 text-[#E53935] text-xs font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Seuil de sécurité atteint (≥80%)</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Quota Jour */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#212121] dark:text-[#F5F5F5]">
                  Aujourd&apos;hui (Limite 24h)
                </span>
                <span className="font-bold text-[#6200EE] dark:text-[#BB86FC]">
                  {quota.aujourdhui} / {quota.limiteJour} emails ({quota.pourcentageJour}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    quota.alerteJour ? 'bg-[#E53935]' : 'bg-[#6200EE]'
                  }`}
                  style={{ width: `${Math.min(100, quota.pourcentageJour)}%` }}
                />
              </div>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                {quota.limiteJour - quota.aujourdhui} envois restants aujourd&apos;hui avant saturation.
              </p>
            </div>

            {/* Quota Mois */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#212121] dark:text-[#F5F5F5]">
                  Ce mois-ci (Limite 30j)
                </span>
                <span className="font-bold text-[#00796B] dark:text-[#03DAC5]">
                  {quota.ceMois} / {quota.limiteMois} emails ({quota.pourcentageMois}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    quota.alerteMois ? 'bg-[#E53935]' : 'bg-[#00796B]'
                  }`}
                  style={{ width: `${Math.min(100, quota.pourcentageMois)}%` }}
                />
              </div>
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                {quota.limiteMois - quota.ceMois} envois restants ce mois-ci.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-[#757575] dark:text-[#A0A0A0]">
              💡 Conseil : Dès que la base dépassera 80 utilisateurs, prévoyez le passage au plan Resend Payant pour le broadcast hebdomadaire du dimanche.
            </span>
          </div>
        </div>
      )}
      {/* Top des Contenus les Plus Suivis */}
      <TopContenusWidget />
    </div>
  );
}

