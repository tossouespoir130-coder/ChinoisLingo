'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell, Send, Sparkles, AlertCircle, CheckCircle2,
  Users, User, Clock, RefreshCw, MessageSquare,
  Link2
} from 'lucide-react';
import { useApiAdmin } from '@/lib/admin/useApiAdmin';

interface NotificationLogItem {
  id: string;
  user_id?: string | null;
  titre: string;
  message: string;
  source: 'founder' | 'mascot' | 'system';
  type: string;
  action_url?: string | null;
  action_label?: string | null;
  created_at: string;
}

export default function AdminNotificationsPage() {
  const { appeler, pret } = useApiAdmin();

  // Formulaire de notification
  const [source, setSource] = useState<'founder' | 'mascot' | 'system'>('founder');
  const [destinataireType, setDestinataireType] = useState<'tous' | 'utilisateur'>('tous');
  const [userIdCible, setUserIdCible] = useState('');
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [actionUrl, setActionUrl] = useState('');
  const [actionLabel, setActionLabel] = useState('');

  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [resultatEnvoi, setResultatEnvoi] = useState<{ succes: boolean; message: string } | null>(null);

  // Historique
  const [historique, setHistorique] = useState<NotificationLogItem[]>([]);
  const [chargementHist, setChargementHist] = useState(false);

  const chargerHistorique = useCallback(async () => {
    if (!pret) return;
    setChargementHist(true);
    try {
      const data = await appeler<{ notifications: NotificationLogItem[] }>(
        '/api/admin/notifications/historique'
      );
      setHistorique(data.notifications || []);
    } catch (err) {
      console.error('[admin notifs hist]', err);
    } finally {
      setChargementHist(false);
    }
  }, [appeler, pret]);

  useEffect(() => {
    if (pret) {
      chargerHistorique();
    }
  }, [pret, chargerHistorique]);

  const handleEnvoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titre.trim() || !message.trim()) {
      setResultatEnvoi({ succes: false, message: 'Le titre et le message sont requis.' });
      return;
    }

    setEnvoiEnCours(true);
    setResultatEnvoi(null);

    try {
      const payload = {
        titre: titre.trim(),
        message: message.trim(),
        source,
        userId: destinataireType === 'utilisateur' ? userIdCible.trim() || null : null,
        actionUrl: actionUrl.trim() || null,
        actionLabel: actionLabel.trim() || null,
      };

      await appeler('/api/admin/notifications/envoyer', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setResultatEnvoi({
        succes: true,
        message: destinataireType === 'tous'
          ? 'Notification in-app diffusée avec succès à tous les apprenants.'
          : 'Notification in-app envoyée avec succès à l’utilisateur ciblé.',
      });

      setTitre('');
      setMessage('');
      setActionUrl('');
      setActionLabel('');
      setUserIdCible('');
      chargerHistorique();
    } catch (err) {
      setResultatEnvoi({
        succes: false,
        message: (err as Error).message || 'Erreur lors de la diffusion.',
      });
    } finally {
      setEnvoiEnCours(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
          Notifications In-App
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 sm:mt-1 font-medium">
          Diffusez des annonces directes dans le Centre de Notifications de l’application.
        </p>
      </div>

      {/* Formulaire de Diffusion */}
      <div className="nixtio-card p-5 sm:p-7 bg-white dark:bg-[#1E1E1E] border border-[#6200EE]/25 dark:border-[#6200EE]/35 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
          <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
              Diffuser une Notification
            </h2>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
              Apparaît sous la cloche de navigation dans l’application des utilisateurs
            </p>
          </div>
        </div>

        <form onSubmit={handleEnvoyer} className="space-y-5">
          {/* Émetteur / Source */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">
              Émetteur de la notification
            </label>
            <div className="grid grid-cols-3 gap-2 sm:w-96">
              {[
                { id: 'founder', label: 'Espoir Chinois (Fondateur)' },
                { id: 'mascot', label: 'Xiao Li (Mascotte 🐾)' },
                { id: 'system', label: 'Système' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSource(s.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                    source === s.id
                      ? 'bg-[#6200EE] text-white shadow-xs'
                      : 'bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#616161] dark:text-[#BDBDBD] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Destinataires */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#6200EE]" />
              Portée de la notification
            </label>
            <div className="grid grid-cols-2 gap-2 sm:w-80">
              <button
                type="button"
                onClick={() => setDestinataireType('tous')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  destinataireType === 'tous'
                    ? 'bg-[#6200EE] text-white shadow-xs'
                    : 'bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#616161] dark:text-[#BDBDBD]'
                }`}
              >
                Tous les apprenants
              </button>
              <button
                type="button"
                onClick={() => setDestinataireType('utilisateur')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  destinataireType === 'utilisateur'
                    ? 'bg-[#6200EE] text-white shadow-xs'
                    : 'bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#616161] dark:text-[#BDBDBD]'
                }`}
              >
                Utilisateur spécifique
              </button>
            </div>

            {destinataireType === 'utilisateur' && (
              <div className="pt-2">
                <input
                  type="text"
                  value={userIdCible}
                  onChange={(e) => setUserIdCible(e.target.value)}
                  placeholder="ID utilisateur Supabase (UUID)"
                  className="w-full sm:w-96 px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
                />
              </div>
            )}
          </div>

          {/* Titre */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">
                Titre de la notification
              </label>
              <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                Conseil : format bilingue sur 2 lignes avec saut de ligne
              </span>
            </div>
            <input
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Nouveauté : Masterclass Sourcing à Guangzhou"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-sm text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ex: Découvrez les 5 nouvelles leçons vidéo sur le cantonais d'affaires et la négociation d'usine."
              rows={4}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-sm text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE] leading-relaxed"
            />
          </div>

          {/* Action optionnelle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                Lien cible interne (Optionnel)
              </label>
              <input
                type="text"
                value={actionUrl}
                onChange={(e) => setActionUrl(e.target.value)}
                placeholder="Ex: /formation ou /ecoute-lecture?type=chansons"
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                Libellé du bouton (Optionnel)
              </label>
              <input
                type="text"
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                placeholder="Ex: Découvrir la leçon"
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
              />
            </div>
          </div>

          {/* Feedback */}
          {resultatEnvoi && (
            <div
              className={`p-4 rounded-2xl flex items-start gap-3 text-xs font-semibold ${
                resultatEnvoi.succes
                  ? 'bg-[#03DAC5]/15 text-[#00796B] dark:text-[#03DAC5] border border-[#03DAC5]/30'
                  : 'bg-[#E53935]/15 text-[#E53935] border border-[#E53935]/30'
              }`}
            >
              {resultatEnvoi.succes ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <p>{resultatEnvoi.message}</p>
            </div>
          )}

          {/* Bouton Soumission */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={envoiEnCours || !titre.trim() || !message.trim()}
              className="px-6 py-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#6200EE]/20 transition-all btn-press flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{envoiEnCours ? 'Diffusion en cours...' : 'Diffuser la Notification'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Historique des Notifications In-App */}
      <div className="nixtio-card p-5 sm:p-7 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
                Dernières Notifications Diffusées
              </h2>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                Historique des annonces in-app en base
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => chargerHistorique()}
            className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors"
            title="Actualiser"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${chargementHist ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="space-y-3">
          {historique.length === 0 ? (
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] py-6 text-center">
              {chargementHist ? 'Chargement...' : 'Aucune notification enregistrée.'}
            </p>
          ) : (
            historique.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/70 dark:border-[#333] space-y-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      n.source === 'founder'
                        ? 'bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]'
                        : n.source === 'mascot'
                        ? 'bg-[#FFA000]/15 text-[#E65100] dark:text-[#FFB74D]'
                        : 'bg-[#757575]/10 text-[#757575]'
                    }`}>
                      {n.source === 'founder' ? 'Espoir Chinois' : n.source === 'mascot' ? 'Xiao Li 🐾' : 'Système'}
                    </span>
                    <span className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                      {n.user_id ? 'Utilisateur ciblé' : 'Diffusé à tous'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    {new Date(n.created_at).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] whitespace-pre-line">
                  {n.titre}
                </h3>
                <p className="text-xs text-[#616161] dark:text-[#BDBDBD] leading-relaxed">
                  {n.message}
                </p>

                {n.action_url && (
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-[#6200EE] dark:text-[#BB86FC]">
                    <Link2 className="w-3 h-3" />
                    <span>Lien : {n.action_url} ({n.action_label || 'Consulter'})</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
