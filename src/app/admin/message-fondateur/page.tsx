'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Megaphone, Loader2, AlertCircle, CheckCircle2, History } from 'lucide-react';
import { useApiAdmin, formaterDate } from '@/lib/admin/useApiAdmin';

interface Annonce {
  id: string;
  title: string;
  message: string;
  created_at: string | null;
}

const MAX_TITRE = 120;
const MAX_MESSAGE = 2000;

export default function MessageFondateurPage() {
  const { appeler, pret } = useApiAdmin();

  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);
  const [historique, setHistorique] = useState<Annonce[] | null>(null);

  const chargerHistorique = useCallback(async () => {
    try {
      const d = await appeler<{ annonces: Annonce[] }>('/api/admin/annonces');
      setHistorique(d.annonces);
    } catch (e) {
      setErreur((e as Error).message);
    }
  }, [appeler]);

  // Le chargement est déclenché via une promesse plutôt qu'un appel direct :
  // React signale à juste titre un setState synchrone dans un effet, qui
  // provoquerait un rendu en cascade. Le drapeau d'annulation évite en prime
  // d'écrire dans un composant démonté.
  useEffect(() => {
    if (!pret) return;
    let annule = false;

    appeler<{ annonces: Annonce[] }>('/api/admin/annonces')
      .then((d) => !annule && setHistorique(d.annonces))
      .catch((e) => !annule && setErreur((e as Error).message));

    return () => {
      annule = true;
    };
  }, [pret, appeler]);

  const publier = async () => {
    if (!titre.trim() || !message.trim()) {
      setErreur('Le titre et le message sont tous deux obligatoires.');
      return;
    }

    setEnvoi(true);
    setErreur(null);
    setSucces(false);

    try {
      await appeler('/api/admin/annonces', {
        method: 'POST',
        body: JSON.stringify({ titre, message }),
      });
      setTitre('');
      setMessage('');
      setSucces(true);
      await chargerHistorique();
      // Le bandeau de confirmation s'efface seul : il n'appelle pas d'action.
      setTimeout(() => setSucces(false), 5000);
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
          Message du Fondateur
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 sm:mt-1 font-medium">
          Diffusé à tous les comptes, et visible dans leur cloche de notifications.
        </p>
      </div>

      {/* ── Formulaire de publication ──────────────────────────────────── */}
      <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-4 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
            Nouvelle annonce
          </p>
        </div>

        <div>
          <label
            htmlFor="titre"
            className="block text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] mb-1.5"
          >
            Titre
          </label>
          <input
            id="titre"
            type="text"
            value={titre}
            maxLength={MAX_TITRE}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex. : Nouvelle série de dialogues disponible"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#181818] text-[16px] sm:text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
          />
          <p className="text-[11px] text-[#757575] mt-1 text-right tabular-nums">
            {titre.length} / {MAX_TITRE}
          </p>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] mb-1.5"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            maxLength={MAX_MESSAGE}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            placeholder="Votre message aux apprenants…"
            className="w-full px-4 py-3 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#181818] text-[16px] sm:text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors resize-y"
          />
          <p className="text-[11px] text-[#757575] mt-1 text-right tabular-nums">
            {message.length} / {MAX_MESSAGE}
          </p>
        </div>

        {erreur && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#DD2C00]/8 border border-[#DD2C00]/25">
            <AlertCircle className="w-4 h-4 text-[#DD2C00] shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-[#DD2C00]">{erreur}</p>
          </div>
        )}

        {succes && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#1B5E20]/8 border border-[#1B5E20]/25">
            <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#66BB6A] shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-[#1B5E20] dark:text-[#66BB6A]">
              Annonce publiée. Elle apparaît dès maintenant chez tous les apprenants.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={publier}
            disabled={envoi || !titre.trim() || !message.trim()}
            className="px-6 py-2.5 rounded-xl bg-[#6200EE] hover:bg-[#3700B3] text-white text-sm font-bold shadow-md shadow-[#6200EE]/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {envoi ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Publication…
              </>
            ) : (
              'Publier'
            )}
          </button>
        </div>
      </div>

      {/* ── Historique ─────────────────────────────────────────────────── */}
      <div className="nixtio-card bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-hidden shadow-xs">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818]">
          <History className="w-4 h-4 text-[#757575]" />
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
            Messages publiés
          </p>
        </div>

        {historique === null ? (
          <div className="px-5 py-10 text-center">
            <Loader2 className="w-5 h-5 animate-spin text-[#6200EE] mx-auto" />
          </div>
        ) : historique.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-[#757575]">
            Aucun message publié pour l&apos;instant.
          </div>
        ) : (
          <ul>
            {historique.map((a) => (
              <li
                key={a.id}
                className="px-5 py-4 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]/60 last:border-0"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5] min-w-0">
                    {a.title}
                  </p>
                  <span className="text-[11px] text-[#757575] whitespace-nowrap shrink-0">
                    {formaterDate(a.created_at)}
                  </span>
                </div>
                <p className="text-[13px] text-[#757575] dark:text-[#A0A0A0] mt-1 leading-relaxed whitespace-pre-wrap">
                  {a.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
