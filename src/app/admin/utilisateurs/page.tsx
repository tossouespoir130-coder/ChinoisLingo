'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Search, Loader2, AlertCircle, ChevronLeft, ChevronRight, Shield,
  CalendarPlus, Ban, CheckCircle2, RefreshCw, Flame, Eye, Filter, X,
  CheckCheck, Clock, Users, Crown, MailCheck, UserCheck
} from 'lucide-react';
import {
  ModaleProlongation,
  ModaleAnnulation,
  type CibleAction,
} from '@/components/admin/ModalesAbonnement';
import { ModaleDetailUtilisateur, type DetailUtilisateur } from '@/components/admin/ModaleDetailUtilisateur';
import { useApiAdmin, formaterDate, formaterDateHeure } from '@/lib/admin/useApiAdmin';

interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  inscritLe: string | null;
  derniereConnexion: string | null;
  joursConnexion: number;
  role: string;
  emailConfirme: boolean;
  emailConfirmeLe: string | null;
  profil: string | null;
  objectif: string | null;
  niveau: string | null;
  rappels: boolean | null;
  premium: boolean;
  plan: string | null;
  finPeriode: string | null;
}

interface Reponse {
  utilisateurs: Utilisateur[];
  total: number;
  page: number;
  pages: number;
}

export default function UtilisateursPage() {
  const { appeler, pret } = useApiAdmin();
  const [donnees, setDonnees] = useState<Reponse | null>(null);
  const [recherche, setRecherche] = useState('');
  const [filtreValidation, setFiltreValidation] = useState<'tous' | 'valide' | 'en_attente'>('tous');
  const [filtreStatut, setFiltreStatut] = useState<'tous' | 'premium' | 'gratuit'>('tous');
  const [page, setPage] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [rafraichissement, setRafraichissement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  // Actions de validation manuelle
  const [enValidationId, setEnValidationId] = useState<string | null>(null);

  // Modales
  const [utilisateurDetail, setUtilisateurDetail] = useState<DetailUtilisateur | null>(null);
  const [prolonger, setProlonger] = useState<CibleAction | null>(null);
  const [annuler, setAnnuler] = useState<CibleAction | null>(null);

  const charger = useCallback(
    async (
      p: number, 
      q: string, 
      val: string,
      stat: string, 
      silencieux = false
    ) => {
      if (!silencieux) setChargement(true);
      else setRafraichissement(true);
      setErreur(null);
      try {
        const queryParams = new URLSearchParams({
          page: p.toString(),
          recherche: q,
          validation: val === 'tous' ? '' : val,
          statut: stat === 'tous' ? '' : stat,
        });
        const d = await appeler<Reponse>(`/api/admin/utilisateurs?${queryParams.toString()}`);
        setDonnees(d);
      } catch (e) {
        setErreur((e as Error).message);
      } finally {
        setChargement(false);
        setRafraichissement(false);
      }
    },
    [appeler]
  );

  // Recherche temporisée avec filtres
  useEffect(() => {
    if (!pret) return;
    const minuteur = setTimeout(() => {
      charger(page, recherche, filtreValidation, filtreStatut);
    }, 300);
    return () => clearTimeout(minuteur);
  }, [pret, page, recherche, filtreValidation, filtreStatut, charger]);

  // Actualisation automatique toutes les 30 secondes
  useEffect(() => {
    if (!pret) return;
    const interval = setInterval(() => {
      charger(page, recherche, filtreValidation, filtreStatut, true);
    }, 30000);
    return () => clearInterval(interval);
  }, [pret, page, recherche, filtreValidation, filtreStatut, charger]);

  // Action : Valider manuellement le compte d'un utilisateur
  const validerCompteManuellement = async (u: Utilisateur | DetailUtilisateur) => {
    setEnValidationId(u.id);
    setErreur(null);
    try {
      await appeler('/api/admin/utilisateurs', {
        method: 'POST',
        body: JSON.stringify({
          userId: u.id,
          action: 'valider_email',
        }),
      });

      setSucces(`Le compte de ${u.nom} a été validé.`);
      setTimeout(() => setSucces(null), 4000);

      // Mettre à jour l'état local immédiatement
      if (donnees) {
        setDonnees({
          ...donnees,
          utilisateurs: donnees.utilisateurs.map((item) =>
            item.id === u.id ? { ...item, emailConfirme: true, emailConfirmeLe: new Date().toISOString() } : item
          ),
        });
      }
      if (utilisateurDetail && utilisateurDetail.id === u.id) {
        setUtilisateurDetail({
          ...utilisateurDetail,
          emailConfirme: true,
          emailConfirmeLe: new Date().toISOString(),
        });
      }
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnValidationId(null);
    }
  };

  const executerAbonnement = async (
    corps: { userId: string; action: 'prolongation' | 'annulation'; mois?: number },
    messageSucces: string
  ) => {
    setErreur(null);
    try {
      await appeler('/api/admin/abonnement', {
        method: 'POST',
        body: JSON.stringify(corps),
      });
      setProlonger(null);
      setAnnuler(null);
      setSucces(messageSucces);
      setTimeout(() => setSucces(null), 6000);
      await charger(page, recherche, filtreValidation, filtreStatut);
    } catch (e) {
      setErreur((e as Error).message);
      setProlonger(null);
      setAnnuler(null);
    }
  };

  const nbTotal = donnees?.total ?? 0;
  const nbValides = donnees?.utilisateurs.filter((u) => u.emailConfirme).length ?? 0;
  const nbEnAttente = donnees?.utilisateurs.filter((u) => !u.emailConfirme).length ?? 0;
  const nbPremium = donnees?.utilisateurs.filter((u) => u.premium).length ?? 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* En-tête de page épuré */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
            Gestion des Utilisateurs
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 font-medium">
            {donnees ? `${donnees.total.toLocaleString('fr-FR')} comptes` : 'Chargement…'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => charger(page, recherche, filtreValidation, filtreStatut)}
          disabled={chargement || rafraichissement}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:border-[#6200EE] transition-all btn-press shadow-2xs cursor-pointer"
          title="Actualiser la liste"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#6200EE] ${rafraichissement ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Cartes KPI Synthétiques & Épurées */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
            <span>Total Comptes</span>
            <Users className="w-4 h-4 text-[#6200EE]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#212121] dark:text-[#F5F5F5]">
            {nbTotal.toLocaleString('fr-FR')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
            <span>Emails Validés</span>
            <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#66BB6A]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#1B5E20] dark:text-[#66BB6A]">
            {nbValides}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
            <span>En Attente</span>
            <Clock className="w-4 h-4 text-[#FFA000]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#E65100] dark:text-[#FFB74D]">
            {nbEnAttente}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
            <span>Abonnés Premium</span>
            <Crown className="w-4 h-4 text-[#6200EE]" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#6200EE] dark:text-[#BB86FC]">
            {nbPremium}
          </p>
        </div>
      </div>

      {/* Barre de Recherche & Filtres sous forme d'onglets simples */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xs space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
          <input
            type="text"
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher par nom, e-mail ou pseudo…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] text-[15px] sm:text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
          />
        </div>

        {/* Filtres d'onglets simples et aérés */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D]/60 text-xs">
          {/* Filtre Validation */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[#757575] dark:text-[#A0A0A0] font-bold shrink-0 mr-1">Validation :</span>
            {[
              { id: 'tous', label: 'Tous' },
              { id: 'valide', label: 'Validés' },
              { id: 'en_attente', label: 'En attente' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFiltreValidation(tab.id as any);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filtreValidation === tab.id
                    ? 'bg-[#6200EE] text-white shadow-2xs'
                    : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-[#F5F5F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtre Abonnement */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[#757575] dark:text-[#A0A0A0] font-bold shrink-0 mr-1">Accès :</span>
            {[
              { id: 'tous', label: 'Tous' },
              { id: 'premium', label: 'Premium' },
              { id: 'gratuit', label: 'Gratuit' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setFiltreStatut(tab.id as any);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filtreStatut === tab.id
                    ? 'bg-[#212121] dark:bg-white text-white dark:text-[#212121] shadow-2xs'
                    : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-[#F5F5F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Messages de statut */}
      {succes && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#1B5E20]/8 border border-[#1B5E20]/25 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#66BB6A] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-[#1B5E20] dark:text-[#66BB6A]">{succes}</p>
        </div>
      )}

      {erreur && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#DD2C00]/8 border border-[#DD2C00]/25 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-[#DD2C00] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-[#DD2C00]">{erreur}</p>
        </div>
      )}

      {/* Tableau Utilisateurs Simplifié & Épuré (Icônes seules pour validation) */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#181818] border-b border-[#E0E0E0] dark:border-[#2D2D2D]">
                <th className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
                  Utilisateur
                </th>
                <th className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] text-center w-28">
                  Validation
                </th>
                <th className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
                  Abonnement
                </th>
                <th className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
                  Dernière Connexion
                </th>
                <th className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
                  Assiduité
                </th>
                <th className="px-5 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]/60 dark:divide-[#2D2D2D]/60">
              {chargement && !donnees ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-[#6200EE] mx-auto" />
                  </td>
                </tr>
              ) : donnees && donnees.utilisateurs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#757575]">
                    Aucun compte ne correspond à ces critères.
                  </td>
                </tr>
              ) : (
                donnees?.utilisateurs.map((u) => {
                  const estAdmin = u.role === 'admin';
                  const enValidation = enValidationId === u.id;

                  return (
                    <tr
                      key={u.id}
                      className={`transition-colors ${
                        estAdmin
                          ? 'bg-[#6200EE]/5 dark:bg-[#6200EE]/10 hover:bg-[#6200EE]/8 dark:hover:bg-[#6200EE]/15'
                          : 'hover:bg-[#FAFAFA] dark:hover:bg-[#181818]'
                      }`}
                    >
                      {/* 1. Nom, Email & Rôle */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center font-black text-sm shrink-0">
                            {u.nom ? u.nom.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setUtilisateurDetail(u)}
                                className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5] hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors truncate text-left cursor-pointer"
                                title="Voir la fiche détaillée"
                              >
                                {u.nom}
                              </button>
                              {estAdmin && (
                                <span
                                  title="Administrateur"
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#6200EE] text-white text-[9px] font-black tracking-wide shrink-0"
                                >
                                  <Shield className="w-2.5 h-2.5 fill-white" />
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] truncate max-w-[220px]">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 2. Statut de Validation du Compte (Icône seule, ultra épurée) */}
                      <td className="px-5 py-3.5 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {u.emailConfirme ? (
                            <div
                              className="w-8 h-8 rounded-full bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#66BB6A] flex items-center justify-center"
                              title={u.emailConfirmeLe ? `Compte validé le ${formaterDate(u.emailConfirmeLe)}` : 'Compte validé'}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-8 h-8 rounded-full bg-[#FFA000]/12 text-[#E65100] dark:text-[#FFB74D] flex items-center justify-center"
                                title="Compte en attente de validation par email"
                              >
                                <Clock className="w-4 h-4" />
                              </div>
                              <button
                                type="button"
                                onClick={() => validerCompteManuellement(u)}
                                disabled={enValidation}
                                className="w-8 h-8 rounded-full bg-[#00897B] text-white hover:bg-[#00796B] transition-all btn-press shadow-2xs disabled:opacity-50 flex items-center justify-center cursor-pointer"
                                title="Valider manuellement ce compte en 1 clic"
                              >
                                {enValidation ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCheck className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 3. Abonnement */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                            u.premium
                              ? 'bg-[#1B5E20]/12 text-[#1B5E20] dark:text-[#66BB6A]'
                              : 'bg-[#757575]/10 text-[#757575] dark:text-[#A0A0A0]'
                          }`}
                        >
                          {u.premium ? 'Premium' : 'Gratuit'}
                        </span>
                      </td>

                      {/* 4. Dernière Connexion (Jour & Heure) */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#6200EE] dark:text-[#BB86FC] shrink-0" />
                            <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5]">
                              {formaterDateHeure(u.derniereConnexion)}
                            </span>
                            {(() => {
                              if (!u.derniereConnexion) return null;
                              const diffMinutes = Math.floor(
                                (Date.now() - new Date(u.derniereConnexion).getTime()) / 60000
                              );
                              if (diffMinutes >= 0 && diffMinutes <= 15) {
                                return (
                                  <span
                                    title="Actif il y a moins de 15 minutes"
                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#1B5E20]/10 text-[#1B5E20] dark:text-[#66BB6A] text-[9px] font-black tracking-wide shrink-0"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20] dark:bg-[#66BB6A] animate-pulse" />
                                    Actif
                                  </span>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          {u.derniereConnexion && (
                            <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0] pl-5">
                              {formaterDate(u.derniereConnexion)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Assiduité & Inscription */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] flex items-center gap-1">
                            🔥 {u.joursConnexion || 1} {u.joursConnexion > 1 ? 'jours' : 'jour'}
                          </span>
                          <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0]">
                            Inscrit le {formaterDate(u.inscritLe)}
                          </span>
                        </div>
                      </td>

                      {/* 6. Actions Claires */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setUtilisateurDetail(u)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#212121] dark:text-[#F5F5F5] text-xs font-bold hover:border-[#6200EE] transition-all btn-press cursor-pointer"
                            title="Consulter le profil complet"
                          >
                            <Eye className="w-3 h-3 text-[#6200EE]" />
                            Fiche
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setProlonger({
                                id: u.id,
                                nom: u.nom,
                                email: u.email,
                                finPeriode: u.finPeriode,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold hover:bg-[#6200EE]/18 transition-all btn-press cursor-pointer"
                            title="Prolonger l'abonnement"
                          >
                            <CalendarPlus className="w-3 h-3" />
                            Accès
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {donnees && donnees.pages > 1 && (
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818]">
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
              Page {donnees.page} sur {donnees.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || chargement}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6200EE] transition-colors cursor-pointer"
                aria-label="Page précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= donnees.pages || chargement}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6200EE] transition-colors cursor-pointer"
                aria-label="Page suivante"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale de fiche détaillée d'un apprenant */}
      {utilisateurDetail && (
        <ModaleDetailUtilisateur
          utilisateur={utilisateurDetail}
          enValidation={enValidationId === utilisateurDetail.id}
          onValiderCompte={() => validerCompteManuellement(utilisateurDetail)}
          onFermer={() => setUtilisateurDetail(null)}
          onProlonger={() => {
            const u = utilisateurDetail;
            setUtilisateurDetail(null);
            setProlonger({
              id: u.id,
              nom: u.nom,
              email: u.email,
              finPeriode: u.finPeriode,
            });
          }}
          onAnnuler={() => {
            const u = utilisateurDetail;
            setUtilisateurDetail(null);
            setAnnuler({
              id: u.id,
              nom: u.nom,
              email: u.email,
              finPeriode: u.finPeriode,
            });
          }}
        />
      )}

      {/* Modales d'action abonnement */}
      {prolonger && (
        <ModaleProlongation
          cible={prolonger}
          onFermer={() => setProlonger(null)}
          onConfirmer={(mois) =>
            executerAbonnement(
              { userId: prolonger.id, action: 'prolongation', mois },
              `Abonnement de ${prolonger.nom} prolongé de ${mois} mois.`
            )
          }
        />
      )}

      {annuler && (
        <ModaleAnnulation
          cible={annuler}
          onFermer={() => setAnnuler(null)}
          onConfirmer={() =>
            executerAbonnement(
              { userId: annuler.id, action: 'annulation' },
              `${annuler.nom} est repassé en accès gratuit.`
            )
          }
        />
      )}
    </div>
  );
}
