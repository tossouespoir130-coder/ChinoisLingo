'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Mail, Send, Sparkles, AlertCircle, CheckCircle2,
  Users, Filter, Clock, ShieldCheck, RefreshCw,
  Search, ExternalLink, ChevronLeft, ChevronRight,
  Info
} from 'lucide-react';
import { useApiAdmin } from '@/lib/admin/useApiAdmin';

interface EmailLogItem {
  id: string;
  user_id?: string | null;
  destinataire: string;
  sujet: string;
  type: string;
  statut: 'envoye' | 'echec' | 'simule';
  resend_id?: string | null;
  erreur?: string | null;
  envoye_par: string;
  created_at: string;
}

interface QuotaStats {
  aujourdhui: number;
  ceMois: number;
  limiteJour: number;
  limiteMois: number;
  pourcentageJour: number;
  pourcentageMois: number;
  alerteJour: boolean;
  alerteMois: boolean;
}

export default function AdminEmailsPage() {
  const { appeler, pret } = useApiAdmin();

  // Formulaire d'envoi
  const [cibleType, setCibleType] = useState<'tous' | 'profil' | 'niveau' | 'manuel'>('tous');
  const [cibleProfil, setCibleProfil] = useState('Entrepreneur');
  const [cibleNiveau, setCibleNiveau] = useState('Débutant');
  const [cibleEmails, setCibleEmails] = useState('');
  const [sujet, setSujet] = useState('');
  const [message, setMessage] = useState('');
  const [boutonTexte, setBoutonTexte] = useState('Ouvrir ChinoisLingo');
  const [boutonUrl, setBoutonUrl] = useState('https://chinoislingo.fr/tableau-de-bord');

  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [resultatEnvoi, setResultatEnvoi] = useState<{ succes: boolean; message: string } | null>(null);

  // Historique et Quota
  const [historique, setHistorique] = useState<EmailLogItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [chargementHist, setChargementHist] = useState(false);
  const [quota, setQuota] = useState<QuotaStats | null>(null);
  const [filtreType, setFiltreType] = useState('tous');

  const chargerHistorique = useCallback(async () => {
    if (!pret) return;
    setChargementHist(true);
    try {
      const q = filtreType !== 'tous' ? `&type=${filtreType}` : '';
      const data = await appeler<{ logs: EmailLogItem[]; total: number }>(
        `/api/admin/emails/historique?page=${page}&limite=15${q}`
      );
      setHistorique(data.logs || []);
      setTotalItems(data.total || 0);
    } catch (err) {
      console.error('[admin emails hist]', err);
    } finally {
      setChargementHist(false);
    }
  }, [appeler, pret, page, filtreType]);

  const chargerQuota = useCallback(async () => {
    if (!pret) return;
    try {
      const q = await appeler<QuotaStats>('/api/admin/emails/quota');
      setQuota(q);
    } catch (err) {
      console.error('[admin emails quota]', err);
    }
  }, [appeler, pret]);

  useEffect(() => {
    if (pret) {
      chargerHistorique();
      chargerQuota();
    }
  }, [pret, chargerHistorique, chargerQuota]);

  const handleEnvoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sujet.trim() || !message.trim()) {
      setResultatEnvoi({ succes: false, message: 'Le sujet et le message sont requis.' });
      return;
    }

    setEnvoiEnCours(true);
    setResultatEnvoi(null);

    try {
      const payload: any = {
        sujet: sujet.trim(),
        message: message.trim(),
        cible: cibleType,
        boutonTexte: boutonTexte.trim() || undefined,
        boutonUrl: boutonUrl.trim() || undefined,
      };

      if (cibleType === 'profil') payload.valeurCible = cibleProfil;
      if (cibleType === 'niveau') payload.valeurCible = cibleNiveau;
      if (cibleType === 'manuel') {
        const emails = cibleEmails.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
        if (emails.length === 0) {
          throw new Error('Veuillez renseigner au moins une adresse email.');
        }
        payload.emailsCibles = emails;
      }

      const res = await appeler<{ succes: boolean; total: number; envoyes: number; echecs: number }>(
        '/api/admin/emails/envoyer',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      setResultatEnvoi({
        succes: true,
        message: `Campagne envoyée avec succès : ${res.envoyes} email(s) transmis (${res.echecs} échec(s)).`,
      });

      // Réinitialiser le formulaire
      setSujet('');
      setMessage('');
      setCibleEmails('');
      chargerHistorique();
      chargerQuota();
    } catch (err) {
      setResultatEnvoi({
        succes: false,
        message: (err as Error).message || 'Erreur lors de l’envoi.',
      });
    } finally {
      setEnvoiEnCours(false);
    }
  };

  const totalPages = Math.ceil(totalItems / 15) || 1;

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
            Gestion des Emails (Resend)
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 sm:mt-1 font-medium">
            Envois manuels ciblés & journal de traçabilité complet de tous les emails transactionnels.
          </p>
        </div>

        {quota && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#6200EE]/20 shadow-xs text-xs">
            <div>
              <span className="text-[#757575] dark:text-[#A0A0A0]">Aujourd&apos;hui : </span>
              <strong className="text-[#6200EE] dark:text-[#BB86FC]">{quota.aujourdhui}/{quota.limiteJour}</strong>
            </div>
            <span className="text-[#E0E0E0] dark:text-[#333]">|</span>
            <div>
              <span className="text-[#757575] dark:text-[#A0A0A0]">Ce mois : </span>
              <strong className="text-[#00796B] dark:text-[#03DAC5]">{quota.ceMois}/{quota.limiteMois}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Formulaire de Composition d'Email */}
      <div className="nixtio-card p-5 sm:p-7 bg-white dark:bg-[#1E1E1E] border border-[#6200EE]/25 dark:border-[#6200EE]/35 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
          <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-2xs">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
              Composer un Email du Fondateur
            </h2>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
              Envoyé avec la signature officielle « Espoir Chinois, Fondateur de ChinoisLingo »
            </p>
          </div>
        </div>

        <form onSubmit={handleEnvoyer} className="space-y-5">
          {/* Sélection de la Cible */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#6200EE]" />
              Audience / Destinataires
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'tous', label: 'Tous les inscrits' },
                { id: 'profil', label: 'Par Métier / Profil' },
                { id: 'niveau', label: 'Par Niveau' },
                { id: 'manuel', label: 'Manuel (Emails)' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCibleType(c.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                    cibleType === c.id
                      ? 'bg-[#6200EE] text-white shadow-xs'
                      : 'bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#616161] dark:text-[#BDBDBD] hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Détail selon le filtre choisi */}
            {cibleType === 'profil' && (
              <div className="pt-2">
                <select
                  value={cibleProfil}
                  onChange={(e) => setCibleProfil(e.target.value)}
                  className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
                >
                  <option value="Entrepreneur">Entrepreneur / Business</option>
                  <option value="Cadre d'entreprise">Cadre d&apos;entreprise</option>
                  <option value="Étudiant">Étudiant(e)</option>
                  <option value="Ingénieur / Technicien">Ingénieur / Technicien / BTP</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            )}

            {cibleType === 'niveau' && (
              <div className="pt-2">
                <select
                  value={cibleNiveau}
                  onChange={(e) => setCibleNiveau(e.target.value)}
                  className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
                >
                  <option value="Débutant">Débutant (Jamais appris / HSK 1)</option>
                  <option value="Bases / Intermédiaire">Bases / Intermédiaire (HSK 2 - 3)</option>
                  <option value="Avancé">Avancé (HSK 4+)</option>
                </select>
              </div>
            )}

            {cibleType === 'manuel' && (
              <div className="pt-2">
                <textarea
                  value={cibleEmails}
                  onChange={(e) => setCibleEmails(e.target.value)}
                  placeholder="Collez une ou plusieurs adresses séparées par une virgule ou retour à la ligne (ex: contact@example.com)"
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
                />
              </div>
            )}
          </div>

          {/* Sujet */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">
              Objet de l&apos;email
            </label>
            <input
              type="text"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              placeholder="Ex: Une nouvelle étape pour votre apprentissage du chinois..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-sm text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
            />
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#616161] dark:text-[#BDBDBD]">
                Corps du message (Texte & Paragraphes)
              </label>
              <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                Variable disponible : <code className="text-[#6200EE] font-bold">{'{prenom}'}</code>
              </span>
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Rédigez votre message ici. Les sauts de ligne seront respectés et habillés dans le template signature ChinoisLingo."
              rows={6}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-sm text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE] leading-relaxed"
            />
          </div>

          {/* Bouton d'action facultatif */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                Libellé du bouton (Optionnel)
              </label>
              <input
                type="text"
                value={boutonTexte}
                onChange={(e) => setBoutonTexte(e.target.value)}
                placeholder="Ex: Découvrir le cours"
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                Lien cible du bouton (Optionnel)
              </label>
              <input
                type="text"
                value={boutonUrl}
                onChange={(e) => setBoutonUrl(e.target.value)}
                placeholder="Ex: https://chinoislingo.fr/formation"
                className="w-full px-3 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs text-[#212121] dark:text-[#F5F5F5] focus:outline-none focus:border-[#6200EE]"
              />
            </div>
          </div>

          {/* Résultat d'envoi */}
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
              disabled={envoiEnCours || !sujet.trim() || !message.trim()}
              className="px-6 py-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#6200EE]/20 transition-all btn-press flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{envoiEnCours ? 'Envoi en cours...' : 'Diffuser l’Email'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Journal & Historique des Emails */}
      <div className="nixtio-card p-5 sm:p-7 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00796B]/10 text-[#00796B] dark:text-[#03DAC5] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#212121] dark:text-[#F5F5F5]">
                Historique des Envois ({totalItems})
              </h2>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                Traçabilité Resend, statuts de délivrabilité et types d&apos;emails
              </p>
            </div>
          </div>

          {/* Filtres par Type */}
          <div className="flex items-center gap-2">
            <select
              value={filtreType}
              onChange={(e) => {
                setFiltreType(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] focus:outline-none"
            >
              <option value="tous">Tous les types</option>
              <option value="bienvenue">Bienvenue</option>
              <option value="recap_hebdo">Newsletter Hebdo</option>
              <option value="manuel">Envoi Manuel</option>
              <option value="rappel_abonnement">Rappel Abonnement</option>
            </select>

            <button
              type="button"
              onClick={() => chargerHistorique()}
              className="p-2 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors"
              title="Actualiser"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${chargementHist ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D] text-[#757575] dark:text-[#A0A0A0]">
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Destinataire</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Type</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Objet</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Statut</th>
                <th className="pb-3 font-bold uppercase tracking-wider text-[10px]">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]/40 dark:divide-[#2D2D2D]">
              {historique.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#757575] dark:text-[#A0A0A0]">
                    {chargementHist ? 'Chargement...' : 'Aucun email enregistré pour le moment.'}
                  </td>
                </tr>
              ) : (
                historique.map((item) => (
                  <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-3 font-semibold text-[#212121] dark:text-[#F5F5F5] truncate max-w-[200px]">
                      {item.destinataire}
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.type === 'bienvenue'
                          ? 'bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]'
                          : item.type === 'recap_hebdo'
                          ? 'bg-[#00796B]/10 text-[#00796B] dark:text-[#03DAC5]'
                          : item.type === 'manuel'
                          ? 'bg-[#FFA000]/10 text-[#E65100] dark:text-[#FFB74D]'
                          : 'bg-[#E91E63]/10 text-[#E91E63]'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-[#616161] dark:text-[#BDBDBD] truncate max-w-[240px]">
                      {item.sujet}
                    </td>
                    <td className="py-3 pr-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.statut === 'envoye'
                          ? 'bg-[#03DAC5]/15 text-[#00796B] dark:text-[#03DAC5]'
                          : item.statut === 'simule'
                          ? 'bg-[#FFA000]/15 text-[#E65100] dark:text-[#FFB74D]'
                          : 'bg-[#E53935]/15 text-[#E53935]'
                      }`}>
                        {item.statut === 'envoye' && '✓ Envoyé'}
                        {item.statut === 'simule' && '⚡ Simulé'}
                        {item.statut === 'echec' && '✗ Échec'}
                      </span>
                    </td>
                    <td className="py-3 text-[#757575] dark:text-[#A0A0A0] whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] text-xs">
            <span className="text-[#757575] dark:text-[#A0A0A0]">
              Page {page} sur {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-[#E0E0E0] dark:border-[#333] disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-1.5 rounded-lg border border-[#E0E0E0] dark:border-[#333] disabled:opacity-30"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
