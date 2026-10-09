'use client';

import React, { useEffect, useState } from 'react';
import { 
  Trophy, 
  Users, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { initialesDe } from '@/lib/avatars';

export interface LeaderboardUser {
  rang: number;
  id: string;
  nom: string;
  avatarUrl: string | null;
  score: number;
  joursConnexion: number;
  minutesEtudiees: number;
  serie: number;
  estMoi: boolean;
}

export const LEADERBOARD_DEFAULT_LIMIT = 5;
export const LEADERBOARD_EXPANDED_LIMIT = 15; // Modifiable à 30 ou 50 facilement

export function CommunityLeaderboardCard() {
  const { session, profile } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [participants, setParticipants] = useState<LeaderboardUser[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [maPosition, setMaPosition] = useState<LeaderboardUser | null>(null);
  const [nomMois, setNomMois] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jeton = session?.access_token;
    if (!jeton) return;

    let isMounted = true;
    setIsLoading(true);

    const limitToFetch = isExpanded ? LEADERBOARD_EXPANDED_LIMIT : LEADERBOARD_DEFAULT_LIMIT;

    fetch(`/api/classement?vue=mensuel&limite=${limitToFetch}`, {
      headers: { Authorization: `Bearer ${jeton}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!isMounted || !d) return;
        setParticipants(d.classement ?? []);
        setTotalCount(d.participantsActifs || d.participants || 0);
        setMaPosition(d.maPosition ?? null);
        if (d.plageMois?.nomMoisCourt) {
          setNomMois(d.plageMois.nomMoisCourt);
        } else if (d.plageMois?.nomMois) {
          setNomMois(d.plageMois.nomMois);
        }
      })
      .catch((err) => {
        console.error('Erreur chargement classement mensuel:', err);
        if (isMounted) setParticipants([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [session, isExpanded]);

  const visibleList = participants || [];
  const isMyRankVisible = visibleList.some((p) => p.estMoi);

  const getMedalBadge = (rang: number) => {
    if (rang === 1) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
          🥇
        </span>
      );
    }
    if (rang === 2) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
          🥈
        </span>
      );
    }
    if (rang === 3) {
      return (
        <span className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-white font-black text-xs flex items-center justify-center shadow-xs">
          🥉
        </span>
      );
    }
    return (
      <span className="w-6 h-6 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#757575] dark:text-[#A0A0A0] font-mono font-bold text-xs flex items-center justify-center">
        {rang}
      </span>
    );
  };

  return (
    <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Header with Title */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] flex items-center justify-center shadow-2xs shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-black text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5]">
                Classement Mensuel
              </h3>
              <p className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                {nomMois ? `Top du mois · ${nomMois}` : 'Top du mois en cours'}
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && participants === null ? (
          <div className="space-y-2.5 py-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-12 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] animate-pulse"
              />
            ))}
          </div>
        ) : visibleList.length === 0 ? (
          <div className="py-7 text-center">
            <Users className="w-7 h-7 text-[#E0E0E0] dark:text-[#333333] mx-auto mb-2.5" />
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed max-w-xs mx-auto">
              Le classement mensuel redémarre le 1er de chaque mois à 00:00 (UTC+1). Connectez-vous et pratiquez pour prendre la tête du Top Mensuel !
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleList.map((p) => {
              return (
                <div
                  key={p.id}
                  className={`p-2.5 sm:p-3 rounded-2xl flex items-center justify-between gap-3 border transition-all ${
                    p.estMoi
                      ? 'bg-[#6200EE]/8 dark:bg-[#6200EE]/20 border-[#6200EE]/30 dark:border-[#BB86FC]/40 shadow-xs'
                      : 'bg-[#FAFAFA] dark:bg-[#252525]/60 border-transparent hover:border-[#E0E0E0] dark:hover:border-[#333333]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Rank Badge / Medal */}
                    {getMedalBadge(p.rang)}

                    {/* Avatar */}
                    {p.avatarUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={p.avatarUrl}
                        alt={p.nom}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-black/10 dark:border-white/10"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-[#6200EE] text-white text-xs font-black flex items-center justify-center shrink-0">
                        {initialesDe(p.nom)}
                      </span>
                    )}

                    {/* Name & stats */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] truncate">
                          {p.nom}
                        </span>
                        {p.estMoi && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-[#6200EE] text-white">
                            Vous
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                        <span>🔥</span>
                        <span className="font-semibold">{p.joursConnexion} {p.joursConnexion > 1 ? 'jours' : 'jour'} ce mois-ci</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Pill */}
                  <div className="text-right shrink-0">
                    <span className="font-display font-black text-sm sm:text-base text-[#6200EE] dark:text-[#03DAC5] block">
                      {p.score} <span className="text-[10px] font-normal text-[#757575] dark:text-[#A0A0A0]">pts</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer : User Position Pin (if outside visible list) + Expand/Collapse Button */}
      <div className="mt-4 pt-3 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] space-y-2.5">
        {/* Pinned user position if they are outside visible items */}
        {maPosition && !isMyRankVisible && (
          <div className="p-2.5 rounded-2xl bg-[#6200EE]/10 dark:bg-[#6200EE]/20 border border-[#6200EE]/30 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-6 h-6 rounded-full bg-[#6200EE] text-white font-black text-xs flex items-center justify-center shrink-0">
                {maPosition.rang}
              </span>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block truncate">
                  Votre position ({maPosition.nom})
                </span>
                <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0] flex items-center gap-1">
                  <span>🔥</span>
                  <span className="font-semibold">{maPosition.joursConnexion} {maPosition.joursConnexion > 1 ? 'jours' : 'jour'} ce mois-ci</span>
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="font-display font-black text-sm text-[#6200EE] dark:text-[#03DAC5]">
                {maPosition.score} pts
              </span>
            </div>
          </div>
        )}

        {/* Expand / Collapse Button */}
        {totalCount > LEADERBOARD_DEFAULT_LIMIT && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-2 rounded-xl text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] hover:bg-[#6200EE]/8 dark:hover:bg-[#6200EE]/15 transition-all flex items-center justify-center gap-1.5 btn-press"
          >
            <span>
              {isExpanded ? 'Réduire (Top 5)' : `Voir le classement étendu (Top ${Math.min(totalCount, LEADERBOARD_EXPANDED_LIMIT)})`}
            </span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}
