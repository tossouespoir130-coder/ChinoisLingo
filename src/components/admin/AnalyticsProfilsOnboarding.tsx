'use client';

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Target,
  Signal,
  Bell,
  Building2,
  GraduationCap,
  Laptop,
  Telescope,
  TrendingUp,
  Palmtree,
  Plane,
  Heart,
  Sparkles,
  CheckCircle2,
  HardHat,
  Loader2,
  Users,
  ChevronDown,
} from 'lucide-react';
import { useApiAdmin } from '@/lib/admin/useApiAdmin';

interface StatsOnboarding {
  totalRenseignes: number;
  profils: Record<string, number>;
  objectifs: Record<string, number>;
  niveaux: Record<string, number>;
  rappelsActifs: number;
}

interface StatsGlobales {
  totalUtilisateurs: number;
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

export function AnalyticsProfilsOnboarding() {
  const { appeler, pret } = useApiAdmin();
  const [stats, setStats] = useState<StatsGlobales | null>(null);
  const [chargement, setChargement] = useState(true);
  const [estDeroule, setEstDeroule] = useState(false);

  useEffect(() => {
    if (!pret) return;
    let annule = false;

    appeler<StatsGlobales>('/api/admin/stats')
      .then((d) => {
        if (!annule) {
          setStats(d);
          setChargement(false);
        }
      })
      .catch((e) => {
        if (!annule) {
          console.error('[AnalyticsProfilsOnboarding]', e);
          setChargement(false);
        }
      });

    return () => {
      annule = true;
    };
  }, [appeler, pret]);

  const onboarding = stats?.onboarding;

  if (chargement) {
    return (
      <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-lg text-[#212121] dark:text-[#F5F5F5]">
              Profils & Motivations Déclarés à l’Inscription
            </h2>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">Chargement des statistiques d’onboarding...</p>
          </div>
        </div>
        <Loader2 className="w-5 h-5 animate-spin text-[#6200EE]" />
      </div>
    );
  }

  if (!onboarding) return null;

  const totalReponsesProfils = Object.values(onboarding.profils || {}).reduce((a, b) => a + b, 0);
  const totalReponsesObjectifs = Object.values(onboarding.objectifs || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="nixtio-card bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-xs transition-all overflow-hidden">
      {/* ── Bande principale cliquable (Onglet / Accordéon) ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setEstDeroule((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setEstDeroule((prev) => !prev);
          }
        }}
        className={`p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAFAFA] dark:hover:bg-[#252525]/50 transition-colors select-none ${
          estDeroule ? 'border-b border-[#E0E0E0]/70 dark:border-[#2D2D2D]' : ''
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6200EE] via-[#7C4DFF] to-[#00897B] text-white flex items-center justify-center shadow-md shadow-[#6200EE]/25 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
                Profils & Motivations Déclarés à l’Inscription
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20 text-[11px] font-extrabold uppercase tracking-wider">
                Onboarding & Insights
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#00897B]/10 text-[#00897B] dark:text-[#4DB6AC] text-xs font-bold">
                {totalReponsesProfils} réponses
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 font-medium truncate">
              {estDeroule
                ? 'Statistiques d’onboarding détaillées pour chaque profil d’apprenant.'
                : `Clique pour dérouler · Métiers (${totalReponsesProfils}), Objectifs (${totalReponsesObjectifs}), Niveaux et Rappels (${onboarding.rappelsActifs || 0} acceptés)`}
            </p>
          </div>
        </div>

        {/* Bouton dérouler / replier avec flèche rotative */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:border-[#6200EE] transition-all">
            <span>{estDeroule ? 'Replier' : 'Dérouler les profils'}</span>
            <div
              className={`w-6 h-6 rounded-lg bg-white dark:bg-[#1E1E1E] flex items-center justify-center border border-[#E0E0E0] dark:border-[#3A3A3A] text-[#6200EE] dark:text-[#BB86FC] transition-transform duration-300 ${
                estDeroule ? 'rotate-180' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Contenu déroulé ── */}
      {estDeroule && (
        <div className="p-5 sm:p-7 space-y-6">

      {/* Grille Analytique Onboarding */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Métiers & Profils des apprenants */}
        <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
                  Profils & Métiers des Apprenants
                </h3>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                  Ce que font les inscrits dans la vie
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold">
              {totalReponsesProfils} réponses
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {!onboarding.profils || Object.keys(onboarding.profils).length === 0 ? (
              <p className="text-xs text-[#757575] py-4 text-center">Aucun profil enregistré pour le moment.</p>
            ) : (
              Object.entries(onboarding.profils)
                .sort(([, a], [, b]) => b - a)
                .map(([nom, compte]) => {
                  const pct = totalReponsesProfils > 0 ? Math.round((compte / totalReponsesProfils) * 100) : 0;
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
        <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#00796B]/10 text-[#00796B] dark:text-[#03DAC5] flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
                  Pourquoi ils apprennent le chinois
                </h3>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                  Objectifs et motivations déclarés
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#00796B]/10 text-[#00796B] dark:text-[#03DAC5] text-xs font-bold">
              {totalReponsesObjectifs} réponses
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {!onboarding.objectifs || Object.keys(onboarding.objectifs).length === 0 ? (
              <p className="text-xs text-[#757575] py-4 text-center">Aucun objectif enregistré pour le moment.</p>
            ) : (
              Object.entries(onboarding.objectifs)
                .sort(([, a], [, b]) => b - a)
                .map(([nom, compte]) => {
                  const pct = totalReponsesObjectifs > 0 ? Math.round((compte / totalReponsesObjectifs) * 100) : 0;
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
        <div className="nixtio-card p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFA000]/10 text-[#E65100] dark:text-[#FFB74D] flex items-center justify-center">
              <Signal className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              Niveau de départ déclaré
            </h4>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {!onboarding.niveaux || Object.keys(onboarding.niveaux).length === 0 ? (
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
        <div className="nixtio-card p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0288D1]/10 text-[#0288D1] dark:text-[#4FC3F7] flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              Engagement & Rappels
            </h4>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#212121] dark:text-[#F5F5F5]">
              <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#66BB6A]" />
              <span>Rappels d&apos;étude acceptés</span>
            </div>
            <span className="text-sm font-black text-[#6200EE] dark:text-[#BB86FC]">
              {onboarding.rappelsActifs || 0} apprenants
            </span>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
}
