'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Trophy,
  Users,
  CheckCircle2,
  Heart,
  TrendingUp,
  ExternalLink,
  BookOpen,
  MessagesSquare,
  Music,
  Radio,
  Newspaper,
  GraduationCap,
  ListChecks,
  Sparkles,
  Loader2,
  Calendar,
  Layers,
  ArrowUpDown,
  Flame,
  ChevronDown,
} from 'lucide-react';
import { useApiAdmin, formaterDate } from '@/lib/admin/useApiAdmin';
import { readingCatalog, ReadingItem } from '@/app/(app)/ecoute-lecture/page';
import { initialCourses, CourseModule } from '@/lib/mock/coursesData';

interface ContenuStatItem {
  contentId: string;
  contentType: string;
  nbApprenants: number;
  nbTermines: number;
  tauxCompletion: number;
  nbFavoris: number;
  derniereActivite: string | null;
}

interface TopContenusReponse {
  topContenus: ContenuStatItem[];
  statsGlobales: {
    totalContenusActifs: number;
    totalApprenantsUniques: number;
    totalTermines: number;
    tauxMoyenCompletion: number;
    repartitionParType: Record<string, number>;
  };
}

interface ContenuEnrichi extends ContenuStatItem {
  titleFr: string;
  titleZh?: string;
  level: string;
  imageUrl?: string;
  lien: string;
  badgeType: string;
  couleurType: string;
}

const CONFIG_TYPES: Record<string, { label: string; icon: any; color: string }> = {
  histoires: { label: 'Histoire', icon: BookOpen, color: '#00897B' },
  dialogues: { label: 'Dialogue', icon: MessagesSquare, color: '#6200EE' },
  chansons: { label: 'Chanson', icon: Music, color: '#E91E63' },
  articles: { label: 'Article', icon: Newspaper, color: '#0288D1' },
  podcasts: { label: 'Podcast', icon: Radio, color: '#FF6D00' },
  exercices: { label: 'Exercice', icon: ListChecks, color: '#7C4DFF' },
  formations: { label: 'Formation', icon: GraduationCap, color: '#FF9800' },
  videos: { label: 'Vidéo', icon: Layers, color: '#E53935' },
};

export function TopContenusWidget() {
  const { appeler, pret } = useApiAdmin();
  const [donnees, setDonnees] = useState<TopContenusReponse | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const [filtreType, setFiltreType] = useState<string>('tous');
  const [critereTri, setCritereTri] = useState<'apprenants' | 'termines' | 'taux'>('apprenants');
  const [estDeroule, setEstDeroule] = useState<boolean>(false);

  useEffect(() => {
    if (!pret) return;
    let annule = false;

    setChargement(true);
    appeler<TopContenusReponse>('/api/admin/top-contenus')
      .then((res) => {
        if (!annule) {
          setDonnees(res);
          setChargement(false);
        }
      })
      .catch((err) => {
        if (!annule) {
          setErreur((err as Error).message);
          setChargement(false);
        }
      });

    return () => {
      annule = true;
    };
  }, [appeler, pret]);

  // Indexation rapide des catalogues pour une résolution O(1)
  const catalogueLecturesMap = useMemo(() => {
    const map = new Map<string, ReadingItem>();
    (readingCatalog || []).forEach((item) => {
      map.set(item.id, item);
      // Référencer aussi les épisodes internes
      if (item.seriesEpisodes) {
        item.seriesEpisodes.forEach((ep) => {
          map.set(ep.id, {
            ...item,
            id: ep.id,
            titleFr: ep.titleFr || `${item.titleFr} — Partie ${ep.episodeNumber}`,
            titleZh: ep.titleZh || item.titleZh,
            imageUrl: ep.imageUrl || item.imageUrl,
          });
        });
      }
    });
    return map;
  }, []);

  const formationsMap = useMemo(() => {
    const map = new Map<string, CourseModule>();
    (initialCourses || []).forEach((c) => map.set(c.id, c));
    return map;
  }, []);

  // Enrichissement de chaque contenu avec métadonnées complètes
  const contenusEnrichis = useMemo<ContenuEnrichi[]>(() => {
    if (!donnees?.topContenus) return [];

    return donnees.topContenus.map((item) => {
      const lecture = catalogueLecturesMap.get(item.contentId);
      const formation = formationsMap.get(item.contentId);

      let titleFr = item.contentId;
      let titleZh: string | undefined;
      let level = 'Tous niveaux';
      let imageUrl: string | undefined;
      let lien = `/ecoute-lecture?type=${item.contentType}&id=${item.contentId}`;
      let ctype = item.contentType;

      if (lecture) {
        titleFr = lecture.titleFr || lecture.titleZh || item.contentId;
        titleZh = lecture.titleZh;
        level = lecture.level || 'HSK 1';
        imageUrl = lecture.imageUrl;
        ctype = lecture.type || item.contentType;
        lien = `/ecoute-lecture?type=${ctype}&id=${lecture.id}`;
      } else if (formation) {
        titleFr = formation.title;
        level = formation.level || 'HSK 1';
        imageUrl = formation.thumbnailUrl;
        ctype = 'formations';
        lien = `/formation?id=${formation.id}`;
      } else if (item.contentId.startsWith('exercice_')) {
        // Exercices HSK
        ctype = 'exercices';
        const numHsk = item.contentId.includes('hsk2') ? '2' : '1';
        const partie = item.contentId.replace(/^exercice_hsk[12]_/, '').replace(/_/g, ' ');
        titleFr = `Exercice HSK ${numHsk} • ${partie.toUpperCase()}`;
        level = `HSK ${numHsk}`;
        lien = `/ecoute-lecture?type=exercices`;
        imageUrl = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80';
      } else {
        // Formattage propre pour les identifiants personnalisés
        titleFr = item.contentId
          .replace(/_/g, ' ')
          .replace(/^(article|series|dialogue|chanson|course)\s+/, '')
          .replace(/\b\w/g, (c) => c.toUpperCase());
      }

      const configType = CONFIG_TYPES[ctype] || {
        label: ctype,
        icon: Sparkles,
        color: '#6200EE',
      };

      return {
        ...item,
        contentType: ctype,
        titleFr,
        titleZh,
        level,
        imageUrl,
        lien,
        badgeType: configType.label,
        couleurType: configType.color,
      };
    });
  }, [donnees, catalogueLecturesMap, formationsMap]);

  // Filtrage et tri des contenus
  const contenusFiltres = useMemo(() => {
    let liste = contenusEnrichis;

    if (filtreType !== 'tous') {
      liste = liste.filter((c) => c.contentType === filtreType);
    }

    return [...liste].sort((a, b) => {
      if (critereTri === 'apprenants') {
        if (b.nbApprenants !== a.nbApprenants) return b.nbApprenants - a.nbApprenants;
        return b.nbTermines - a.nbTermines;
      }
      if (critereTri === 'termines') {
        if (b.nbTermines !== a.nbTermines) return b.nbTermines - a.nbTermines;
        return b.nbApprenants - a.nbApprenants;
      }
      if (critereTri === 'taux') {
        if (b.tauxCompletion !== a.tauxCompletion) return b.tauxCompletion - a.tauxCompletion;
        return b.nbApprenants - a.nbApprenants;
      }
      return 0;
    });
  }, [contenusEnrichis, filtreType, critereTri]);

  // Contenu numéro 1 absolu (top podium)
  const top1Contenu = contenusEnrichis[0];
  const stats = donnees?.statsGlobales;

  // Calcul du nombre de contenus par type pour les compteurs d'onglets
  const compteursParType = useMemo(() => {
    const map: Record<string, number> = { tous: contenusEnrichis.length };
    contenusEnrichis.forEach((c) => {
      map[c.contentType] = (map[c.contentType] || 0) + 1;
    });
    return map;
  }, [contenusEnrichis]);

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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF9800] via-[#FF3D00] to-[#E91E63] text-white flex items-center justify-center shadow-md shadow-[#FF9800]/25 shrink-0">
            <Flame className="w-6 h-6 fill-amber-200 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-black text-lg sm:text-xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
                Top des Contenus les Plus Suivis
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF9800]/10 text-[#E65100] dark:text-[#FFB74D] border border-[#FF9800]/20 text-[11px] font-extrabold uppercase tracking-wider">
                Audience & Engagement
              </span>
              {stats && (
                <span className="px-2 py-0.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold">
                  {stats.totalContenusActifs} contenus actifs
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 font-medium truncate">
              {estDeroule
                ? 'Classement en direct des histoires, leçons, dialogues et exercices préférés des apprenants.'
                : top1Contenu
                ? `Clique pour dérouler · N°1 actuel : ${top1Contenu.titleFr} (${top1Contenu.nbApprenants} apprenants)`
                : 'Clique pour dérouler le classement complet des contenus'}
            </p>
          </div>
        </div>

        {/* Bouton dérouler / replier avec flèche rotative */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:border-[#6200EE] transition-all">
            <span>{estDeroule ? 'Replier' : 'Dérouler le classement'}</span>
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
          {/* Barre de tri */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-[#E0E0E0]/50 dark:border-[#2D2D2D]/60">
            <div className="text-xs text-[#757575] dark:text-[#A0A0A0] font-medium">
              Analyse de la progression des étudiants et taux de complétion par format et par niveau.
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs text-[#757575] dark:text-[#A0A0A0] font-semibold hidden md:inline">
                Trier par :
              </span>
              <div className="inline-flex rounded-xl p-1 bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333]">
                <button
                  onClick={() => setCritereTri('apprenants')}
                  type="button"
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all btn-press ${
                    critereTri === 'apprenants'
                      ? 'bg-[#6200EE] text-white shadow-xs'
                      : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                  }`}
                >
                  Apprenants
                </button>
                <button
                  onClick={() => setCritereTri('termines')}
                  type="button"
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all btn-press ${
                    critereTri === 'termines'
                      ? 'bg-[#6200EE] text-white shadow-xs'
                      : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                  }`}
                >
                  Terminés ✓
                </button>
                <button
                  onClick={() => setCritereTri('taux')}
                  type="button"
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all btn-press ${
                    critereTri === 'taux'
                      ? 'bg-[#6200EE] text-white shadow-xs'
                      : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                  }`}
                >
                  Taux (%)
                </button>
              </div>
            </div>
          </div>

      {/* ── 3 Cartes Récapitulatives Hautes Performances ── */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Carte 1 : Contenu N°1 */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-extrabold text-amber-600 dark:text-amber-400 tracking-wider flex items-center gap-1">
                <span>🥇 N°1 du Classement</span>
              </span>
              <p className="font-display font-black text-sm text-[#212121] dark:text-[#F5F5F5] truncate mt-1">
                {top1Contenu?.titleFr || '—'}
              </p>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                {top1Contenu ? `${top1Contenu.nbApprenants} apprenants (${top1Contenu.nbTermines} terminés)` : '—'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-500/30 shrink-0 text-lg">
              🏆
            </div>
          </div>

          {/* Carte 2 : Total de leçons complétées */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/30 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
                Leçons Terminées
              </span>
              <p className="font-display font-black text-xl text-[#212121] dark:text-[#F5F5F5] mt-1 tabular-nums">
                {stats.totalTermines.toLocaleString('fr-FR')} validations
              </p>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                Taux moyen de complétion : {stats.tauxMoyenCompletion}%
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Carte 3 : Contenus actifs */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/30 flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-extrabold text-purple-600 dark:text-purple-400 tracking-wider">
                Diversité Pédagogique
              </span>
              <p className="font-display font-black text-xl text-[#212121] dark:text-[#F5F5F5] mt-1 tabular-nums">
                {stats.totalContenusActifs} contenus actifs
              </p>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                Sur {stats.totalApprenantsUniques} apprenants actifs
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* ── Ruban des filtres par format (scroll horizontal fluide) ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFiltreType('tous')}
          type="button"
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap btn-press shrink-0 flex items-center gap-1.5 ${
            filtreType === 'tous'
              ? 'bg-[#6200EE] text-white shadow-sm'
              : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] hover:text-[#212121] dark:hover:text-white border border-[#E0E0E0] dark:border-[#333]'
          }`}
        >
          <span>Tous les formats</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              filtreType === 'tous' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/10'
            }`}
          >
            {compteursParType.tous || 0}
          </span>
        </button>

        {Object.entries(CONFIG_TYPES).map(([typeKey, cfg]) => {
          const Icone = cfg.icon;
          const count = compteursParType[typeKey] || 0;
          const actif = filtreType === typeKey;

          return (
            <button
              key={typeKey}
              onClick={() => setFiltreType(typeKey)}
              type="button"
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap btn-press shrink-0 flex items-center gap-1.5 ${
                actif
                  ? 'text-white shadow-sm'
                  : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] hover:text-[#212121] dark:hover:text-white border border-[#E0E0E0] dark:border-[#333]'
              }`}
              style={{ backgroundColor: actif ? cfg.color : undefined }}
            >
              <Icone className="w-3.5 h-3.5" />
              <span>{cfg.label}s</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  actif ? 'bg-white/25 text-white' : 'bg-black/5 dark:bg-white/10'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── État de chargement / erreur ── */}
      {chargement && (
        <div className="flex flex-col items-center justify-center py-14 text-[#757575]">
          <Loader2 className="w-8 h-8 animate-spin text-[#6200EE]" />
          <p className="text-xs font-semibold mt-2.5">Calcul du classement des contenus...</p>
        </div>
      )}

      {erreur && (
        <div className="p-4 rounded-2xl bg-[#DD2C00]/8 border border-[#DD2C00]/25 text-[#DD2C00] text-xs font-medium">
          Impossible de charger les statistiques des contenus : {erreur}
        </div>
      )}

      {/* ── Liste du Classement (Podium & Tableau Moderne) ── */}
      {!chargement && !erreur && (
        <div className="space-y-3">
          {contenusFiltres.length === 0 ? (
            <div className="p-8 text-center bg-[#FAFAFA] dark:bg-[#252525] rounded-2xl border border-dashed border-[#E0E0E0] dark:border-[#333]">
              <p className="text-xs text-[#757575]">Aucun contenu enregistré pour cette catégorie pour le moment.</p>
            </div>
          ) : (
            contenusFiltres.map((item, index) => {
              const rang = index + 1;
              const estPodium = rang <= 3;
              const medaille = rang === 1 ? '🥇' : rang === 2 ? '🥈' : rang === 3 ? '🥉' : null;

              return (
                <div
                  key={item.contentId}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group ${
                    rang === 1
                      ? 'bg-gradient-to-r from-amber-500/[0.08] via-amber-500/[0.03] to-white dark:to-[#1E1E1E] border-amber-500/40 shadow-xs'
                      : rang === 2
                      ? 'bg-gradient-to-r from-slate-400/[0.08] via-slate-400/[0.03] to-white dark:to-[#1E1E1E] border-slate-300 dark:border-slate-700'
                      : rang === 3
                      ? 'bg-gradient-to-r from-amber-700/[0.08] via-amber-700/[0.03] to-white dark:to-[#1E1E1E] border-amber-700/30'
                      : 'bg-[#FAFAFA] dark:bg-[#252525] border-[#E0E0E0]/80 dark:border-[#333] hover:border-[#6200EE]/40 hover:bg-white dark:hover:bg-[#1E1E1E]'
                  }`}
                >
                  {/* Partie Gauche : Rang + Miniature + Titres */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Badge de Rang */}
                    <div
                      className={`w-8 h-8 rounded-xl font-display font-black text-sm flex items-center justify-center shrink-0 ${
                        rang === 1
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                          : rang === 2
                          ? 'bg-slate-400 text-white shadow-sm'
                          : rang === 3
                          ? 'bg-amber-700 text-white shadow-sm'
                          : 'bg-black/5 dark:bg-white/5 text-[#757575] dark:text-[#A0A0A0] text-xs'
                      }`}
                    >
                      {medaille || `#${rang}`}
                    </div>

                    {/* Miniature Image */}
                    <div className="w-12 h-12 rounded-xl bg-[#E0E0E0] dark:bg-[#333] relative overflow-hidden shrink-0 shadow-2xs border border-white/20">
                      {item.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.imageUrl}
                          alt={item.titleFr}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback propre en cas d'URL cassée
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: item.couleurType }}
                        >
                          {item.badgeType[0]}
                        </div>
                      )}
                    </div>

                    {/* Titres & Badges */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase text-white shadow-2xs shrink-0"
                          style={{ backgroundColor: item.couleurType }}
                        >
                          {item.badgeType}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-[10px] font-bold shrink-0">
                          {item.level}
                        </span>
                        {item.nbFavoris > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#E91E63]">
                            <Heart className="w-3 h-3 fill-current" />
                            <span>{item.nbFavoris}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-display font-black text-sm text-[#212121] dark:text-[#F5F5F5] truncate mt-0.5">
                        {item.titleFr}
                      </h4>

                      {item.titleZh && (
                        <p className="text-xs text-[#00897B] dark:text-[#03DAC5] font-chinese font-bold truncate">
                          {item.titleZh}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Partie Droite : Métriques d'engagement + Bouton d'accès */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E0E0E0]/60 dark:border-[#333]">
                    {/* Indicateur Apprenants */}
                    <div className="flex flex-col items-center sm:items-end">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#212121] dark:text-[#F5F5F5]">
                        <Users className="w-3.5 h-3.5 text-[#6200EE] dark:text-[#BB86FC]" />
                        <span className="text-sm font-display">{item.nbApprenants}</span>
                        <span className="text-[11px] font-medium text-[#757575] dark:text-[#A0A0A0]">
                          {item.nbApprenants > 1 ? 'apprenants' : 'apprenant'}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                        {item.derniereActivite ? `Dernier : ${formaterDate(item.derniereActivite)}` : 'Récemment'}
                      </span>
                    </div>

                    {/* Barre de complétion */}
                    <div className="w-24 sm:w-28 flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-[11px] font-bold">
                        <span className="text-emerald-600 dark:text-emerald-400">
                          {item.nbTermines} terminés
                        </span>
                        <span className="text-[#757575] dark:text-[#A0A0A0] text-[10px]">
                          ({item.tauxCompletion}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E0E0E0] dark:bg-[#333] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${Math.min(100, item.tauxCompletion)}%` }}
                        />
                      </div>
                    </div>

                    {/* Bouton Voir sur le site */}
                    <Link
                      href={item.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#333] hover:border-[#6200EE] text-[#757575] hover:text-[#6200EE] dark:hover:text-[#BB86FC] flex items-center justify-center transition-all btn-press shadow-2xs shrink-0"
                      title="Ouvrir ce contenu sur la plateforme"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
        </div>
      )}
    </div>
  );
}
