'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface Participant {
  rang: number;
  id: string;
  nom: string;
  avatarUrl: string | null;
  motsMaitrises: number;
  serie: number;
  estMoi: boolean;
}

/**
 * Classement communautaire, construit sur des comptes réels.
 *
 * Il affichait auparavant une liste inventée — Aminata Diallo, Koffi Mensah,
 * Fatou Traoré — strictement identique pour chaque utilisateur. Les données
 * viennent désormais de `/api/classement`, qui lit les vrais profils côté
 * serveur (RLS interdit au navigateur de lire les lignes des autres).
 *
 * Tant que la communauté compte moins de trois apprenants actifs, la carte
 * annonce honnêtement qu'il n'y a pas encore de classement, au lieu d'en
 * fabriquer un.
 */
export function CommunityLeaderboardCard() {
  const { session } = useAuth();
  const [participants, setParticipants] = useState<Participant[] | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const jeton = session?.access_token;
    if (!jeton) return;

    let annule = false;

    fetch('/api/classement', { headers: { Authorization: `Bearer ${jeton}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (annule || !d) return;
        setParticipants(d.classement ?? []);
        setTotal(d.participants ?? 0);
      })
      .catch(() => {
        if (!annule) setParticipants([]);
      });

    return () => {
      annule = true;
    };
  }, [session]);

  const couleurRang = (rang: number) =>
    rang === 1
      ? { texte: 'text-[#B78103] dark:text-[#FFD54F]', fond: 'bg-[#FFC107]' }
      : rang === 2
        ? { texte: 'text-[#6200EE] dark:text-[#BB86FC]', fond: 'bg-[#6200EE] dark:bg-[#BB86FC]' }
        : { texte: 'text-[#00897B] dark:text-[#03DAC5]', fond: 'bg-[#03DAC5]' };

  return (
    <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-10 h-10 rounded-2xl bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] flex items-center justify-center shadow-2xs">
          <Trophy className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-black text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5]">
            Classement de la communauté
          </h3>
          <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
            Par nombre de mots enregistrés
          </p>
        </div>
      </div>

      {participants === null ? (
        <div className="space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-11 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] animate-pulse"
            />
          ))}
        </div>
      ) : participants.length === 0 ? (
        <div className="py-7 text-center">
          <Users className="w-7 h-7 text-[#E0E0E0] dark:text-[#333333] mx-auto mb-2.5" />
          <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed max-w-xs mx-auto">
            {total > 0
              ? 'Le classement s’ouvrira dès que la communauté comptera assez d’apprenants actifs.'
              : 'Aucun classement pour l’instant. Enregistrez vos premiers mots pour y figurer.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {participants.map((p) => {
            const c = couleurRang(p.rang);
            return (
              <li
                key={p.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl border transition-colors ${
                  p.estMoi
                    ? 'bg-[#6200EE]/8 border-[#6200EE]/25'
                    : 'bg-[#FAFAFA] dark:bg-[#181818] border-transparent'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full ${c.fond} text-white text-[11px] font-black flex items-center justify-center shrink-0`}
                >
                  {p.rang}
                </span>

                <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] truncate flex-1 min-w-0">
                  {p.nom}
                  {p.estMoi && (
                    <span className="ml-1.5 text-[10px] font-extrabold text-[#6200EE] dark:text-[#BB86FC]">
                      vous
                    </span>
                  )}
                </span>

                <span className={`text-xs font-black tabular-nums shrink-0 ${c.texte}`}>
                  {p.motsMaitrises}
                  <span className="text-[10px] font-semibold text-[#757575] dark:text-[#A0A0A0] ml-1">
                    mots
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
