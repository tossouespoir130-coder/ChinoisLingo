'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, Crown, UserPlus, Loader2, AlertCircle, 
  Briefcase, Target, Signal, Bell, Building2, 
  GraduationCap, Laptop, Telescope, TrendingUp, 
  Palmtree, Plane, Heart, Sparkles, CheckCircle2, HardHat,
  Mail, ShieldAlert, Zap
} from 'lucide-react';
import { useApiAdmin } from '@/lib/admin/useApiAdmin';

interface StatsOnboarding {
  totalRenseignes: number;
  profils: Record<string, number>;
  objectifs: Record<string, number>;
  niveaux: Record<string, number>;
  rappelsActifs: number;
}

interface Stats {
  totalUtilisateurs: number;
  abonnesActifs: number;
  inscriptionsSemaine: number;
  onboarding?: StatsOnboarding;
}

const ICONES_PROFILS: Record<string, any> = {
  'Entrepreneur': Building2,
  'Cadre d’entreprise': Briefcase,
  'Cadre d\'entreprise': Briefcase,
  'Cadre': Briefcase,
  'Professionnel': Briefcase,
  'Professionnel(le) salarié(e)': Briefcase,
  'Étudiant': GraduationCap,
  'Étudiant(e)': GraduationCap,
  'Ingénieur / Technicien': HardHat,
  'Ingénieur': HardHat,
  'Indépendant': Laptop,
  'Indépendant / Freelance': Laptop,
  'Autre': Telescope,
};

const COULEURS_PROFILS: Record<string, string> = {
  'Entrepreneur': '#6200EE',
  'Cadre d’entreprise': '#00897B',
  'Cadre d\'entreprise': '#00897B',
  'Cadre': '#00897B',
  'Professionnel': '#00897B',
  'Professionnel(le) salarié(e)': '#00897B',
  'Étudiant': '#FFA000',
  'Étudiant(e)': '#FFA000',
  'Ingénieur / Technicien': '#0288D1',
  'Ingénieur': '#0288D1',
  'Indépendant': '#0288D1',
  'Indépendant / Freelance': '#0288D1',
  'Autre': '#8E24AA',
};

const ICONES_OBJECTIFS: Record<string, any> = {
  'Pour le travail & les affaires': TrendingUp,
  'Pour le travail': TrendingUp,
  'Pour voyager en Chine': Palmtree,
  'Voyager': Palmtree,
  'Étudier à l’étranger': Plane,
  'Pour mes études & examens HSK': Plane,
  'Intérêt personnel & culture': Heart,
  'Par passion pour la culture chinoise': Heart,
  'Autre': Sparkles,
};

const COULEURS_OBJECTIFS: Record<string, string> = {
  'Pour le travail & les affaires': '#6200EE',
  'Pour le travail': '#6200EE',
  'Pour voyager en Chine': '#00897B',
  'Voyager': '#00897B',
  'Étudier à l’étranger': '#0288D1',
  'Pour mes études & examens HSK': '#0288D1',
  'Intérêt personnel & culture': '#E91E63',
  'Par passion pour la culture chinoise': '#E91E63',
  'Autre': '#8E24AA',
};

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

      {/* Grille Analytique Onboarding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Métiers & Profils des apprenants */}
        <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
                  Profils & Métiers des Apprenants
                </h2>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                  Ce que font les inscrits dans la vie
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold">
              {onboarding ? Object.values(onboarding.profils).reduce((a, b) => a + b, 0) : 0} réponses
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {!onboarding || Object.keys(onboarding.profils).length === 0 ? (
              <p className="text-xs text-[#757575] py-4 text-center">Aucun profil enregistré pour le moment.</p>
            ) : (
              Object.entries(onboarding.profils)
                .sort(([, a], [, b]) => b - a)
                .map(([nom, compte]) => {
                  const totalR = Object.values(onboarding.profils).reduce((a, b) => a + b, 0);
                  const pct = totalR > 0 ? Math.round((compte / totalR) * 100) : 0;
                  const Icone = ICONES_PROFILS[nom] || Briefcase;
                  const couleur = COULEURS_PROFILS[nom] || '#6200EE';

                  return (
                    <div key={nom} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-semibold text-[#212121] dark:text-[#F5F5F5]">
                          <Icone className="w-3.5 h-3.5" style={{ color: couleur }} />
                          <span>{nom}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-[#212121] dark:text-[#F5F5F5]">{compte}</span>
                          <span className="text-[#757575] dark:text-[#A0A0A0]">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: couleur,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* 2. Pourquoi ils apprennent (Objectifs & Motivations) */}
        <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00796B]/10 text-[#00796B] dark:text-[#03DAC5] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
                  Pourquoi ils apprennent le chinois
                </h2>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                  Objectifs et motivations déclarés
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00796B]/10 text-[#00796B] dark:text-[#03DAC5] text-xs font-bold">
              {onboarding ? Object.values(onboarding.objectifs).reduce((a, b) => a + b, 0) : 0} réponses
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {!onboarding || Object.keys(onboarding.objectifs).length === 0 ? (
              <p className="text-xs text-[#757575] py-4 text-center">Aucun objectif enregistré pour le moment.</p>
            ) : (
              Object.entries(onboarding.objectifs)
                .sort(([, a], [, b]) => b - a)
                .map(([nom, compte]) => {
                  const totalO = Object.values(onboarding.objectifs).reduce((a, b) => a + b, 0);
                  const pct = totalO > 0 ? Math.round((compte / totalO) * 100) : 0;
                  const Icone = ICONES_OBJECTIFS[nom] || Target;
                  const couleur = COULEURS_OBJECTIFS[nom] || '#00796B';

                  return (
                    <div key={nom} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-semibold text-[#212121] dark:text-[#F5F5F5]">
                          <Icone className="w-3.5 h-3.5" style={{ color: couleur }} />
                          <span>{nom}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-[#212121] dark:text-[#F5F5F5]">{compte}</span>
                          <span className="text-[#757575] dark:text-[#A0A0A0]">({pct}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: couleur,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>

      {/* 3. Niveaux de départ & Préférences de Rappels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Niveaux de départ */}
        <div className="nixtio-card p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFA000]/10 text-[#E65100] dark:text-[#FFB74D] flex items-center justify-center">
              <Signal className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              Niveau de départ déclaré
            </h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {!onboarding || Object.keys(onboarding.niveaux).length === 0 ? (
              <span className="text-xs text-[#757575]">Aucune donnée</span>
            ) : (
              Object.entries(onboarding.niveaux).map(([niv, count]) => (
                <div
                  key={niv}
                  className="px-3 py-1.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] flex items-center gap-2"
                >
                  <span className="text-[#FFA000]">📶</span>
                  <span>{niv}</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-[10px] font-black">
                    {count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Rappels d'apprentissage */}
        <div className="nixtio-card p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0288D1]/10 text-[#0288D1] dark:text-[#4FC3F7] flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              Engagement & Rappels
            </h3>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#212121] dark:text-[#F5F5F5]">
              <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#66BB6A]" />
              <span>Rappels d&apos;étude acceptés</span>
            </div>
            <span className="text-sm font-black text-[#6200EE] dark:text-[#BB86FC]">
              {onboarding?.rappelsActifs || 0} apprenants
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

