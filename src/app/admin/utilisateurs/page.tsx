'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Search, Loader2, AlertCircle, ChevronLeft, ChevronRight, Shield,
  CalendarPlus, Ban, CheckCircle2, RefreshCw, Flame, Eye, Filter, X
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
  const [filtreProfil, setFiltreProfil] = useState('');
  const [filtreObjectif, setFiltreObjectif] = useState('');
  const [filtreNiveau, setFiltreNiveau] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('');
  const [page, setPage] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [rafraichissement, setRafraichissement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Modales
  const [utilisateurDetail, setUtilisateurDetail] = useState<DetailUtilisateur | null>(null);
  const [prolonger, setProlonger] = useState<CibleAction | null>(null);
  const [annuler, setAnnuler] = useState<CibleAction | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  const charger = useCallback(
    async (
      p: number, 
      q: string, 
      prof: string, 
      obj: string, 
      niv: string, 
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
          profil: prof,
          objectif: obj,
          niveau: niv,
          statut: stat,
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
      charger(page, recherche, filtreProfil, filtreObjectif, filtreNiveau, filtreStatut);
    }, 300);
    return () => clearTimeout(minuteur);
  }, [pret, page, recherche, filtreProfil, filtreObjectif, filtreNiveau, filtreStatut, charger]);

  // Actualisation automatique toutes les 30 secondes
  useEffect(() => {
    if (!pret) return;
    const interval = setInterval(() => {
      charger(page, recherche, filtreProfil, filtreObjectif, filtreNiveau, filtreStatut, true);
    }, 30000);
    return () => clearInterval(interval);
  }, [pret, page, recherche, filtreProfil, filtreObjectif, filtreNiveau, filtreStatut, charger]);

  const executer = async (
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
      await charger(page, recherche, filtreProfil, filtreObjectif, filtreNiveau, filtreStatut);
    } catch (e) {
      setErreur((e as Error).message);
      setProlonger(null);
      setAnnuler(null);
    }
  };

  const aDesFiltresActifs = Boolean(
    recherche || filtreProfil || filtreObjectif || filtreNiveau || filtreStatut
  );

  const reinitialiserFiltres = () => {
    setRecherche('');
    setFiltreProfil('');
    setFiltreObjectif('');
    setFiltreNiveau('');
    setFiltreStatut('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
            Utilisateurs & Profils
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 sm:mt-1 font-medium">
            {donnees ? `${donnees.total.toLocaleString('fr-FR')} comptes trouvés` : 'Chargement…'} — Informations professionnelles, motivations & activité.
          </p>
        </div>

        <button
          type="button"
          onClick={() => charger(page, recherche, filtreProfil, filtreObjectif, filtreNiveau, filtreStatut)}
          disabled={chargement || rafraichissement}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:border-[#6200EE] transition-all btn-press shadow-2xs cursor-pointer"
          title="Actualiser les données"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#6200EE] ${rafraichissement ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#757575]" />
          <input
            type="text"
            value={recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher par nom, e-mail, pseudo, profil ou objectif…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-[16px] sm:text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
          />
        </div>

        {/* Ligne des Filtres Sélecteurs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5 shrink-0 text-[#757575] dark:text-[#A0A0A0] font-bold">
            <Filter className="w-3.5 h-3.5 text-[#6200EE]" />
            <span>Filtres :</span>
          </div>

          {/* Filtre Profil */}
          <select
            value={filtreProfil}
            onChange={(e) => {
              setFiltreProfil(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrer par profil métier"
            className="px-3 py-1.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] shrink-0 font-medium"
          >
            <option value="">💼 Tous les profils</option>
            <option value="Entrepreneur">Entrepreneur</option>
            <option value="Cadre">Cadre d’entreprise</option>
            <option value="Étudiant">Étudiant</option>
            <option value="Ingénieur">Ingénieur / Technicien</option>
            <option value="Autre">Autre</option>
          </select>

          {/* Filtre Objectif */}
          <select
            value={filtreObjectif}
            onChange={(e) => {
              setFiltreObjectif(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrer par objectif d'apprentissage"
            className="px-3 py-1.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] shrink-0 font-medium"
          >
            <option value="">🎯 Tous les objectifs</option>
            <option value="travail">Travail & affaires</option>
            <option value="voyage">Voyage en Chine</option>
            <option value="études">Études & examens HSK</option>
            <option value="passion">Culture & intérêt personnel</option>
          </select>

          {/* Filtre Niveau */}
          <select
            value={filtreNiveau}
            onChange={(e) => {
              setFiltreNiveau(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrer par niveau de départ"
            className="px-3 py-1.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] shrink-0 font-medium"
          >
            <option value="">📶 Tous les niveaux</option>
            <option value="débute">Débutant complet</option>
            <option value="bases">Intermédiaire bas (HSK 2)</option>
            <option value="intermédiaire">Intermédiaire avancé (HSK 4+)</option>
          </select>

          {/* Filtre Statut */}
          <select
            value={filtreStatut}
            onChange={(e) => {
              setFiltreStatut(e.target.value);
              setPage(1);
            }}
            aria-label="Filtrer par statut d'abonnement"
            className="px-3 py-1.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] shrink-0 font-medium"
          >
            <option value="">💎 Tous les statuts</option>
            <option value="premium">Premium uniquement</option>
            <option value="gratuit">Gratuit uniquement</option>
          </select>

          {aDesFiltresActifs && (
            <button
              type="button"
              onClick={reinitialiserFiltres}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#DD2C00]/10 text-[#DD2C00] font-bold shrink-0 hover:bg-[#DD2C00]/20 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Effacer</span>
            </button>
          )}
        </div>
      </div>

      {succes && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#1B5E20]/8 border border-[#1B5E20]/25">
          <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#66BB6A] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-[#1B5E20] dark:text-[#66BB6A]">{succes}</p>
        </div>
      )}

      {erreur && (
        <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#DD2C00]/8 border border-[#DD2C00]/25">
          <AlertCircle className="w-4 h-4 text-[#DD2C00] shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-[#DD2C00]">{erreur}</p>
        </div>
      )}

      <div className="nixtio-card bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#181818] border-b border-[#E0E0E0] dark:border-[#2D2D2D]">
                {['Utilisateur & Rôle', 'Profil / Métier', 'Pourquoi il apprend', 'Niveau & Alertes', 'Inscription', 'Jours Actifs', 'Statut', 'Actions'].map((t) => (
                  <th
                    key={t}
                    className="px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]"
                  >
                    {t}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chargement && !donnees ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-[#6200EE] mx-auto" />
                  </td>
                </tr>
              ) : donnees && donnees.utilisateurs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-[#757575]">
                    Aucun compte ne correspond à cette recherche.
                  </td>
                </tr>
              ) : (
                donnees?.utilisateurs.map((u) => {
                  const estAdmin = u.role === 'admin';
                  return (
                    <tr
                      key={u.id}
                      className={`border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]/60 last:border-0 transition-colors ${
                        estAdmin
                          ? 'bg-[#6200EE]/5 dark:bg-[#6200EE]/10 hover:bg-[#6200EE]/8 dark:hover:bg-[#6200EE]/15'
                          : 'hover:bg-[#FAFAFA] dark:hover:bg-[#181818]'
                      }`}
                    >
                      {/* 1. Nom & Identité */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              onClick={() => setUtilisateurDetail(u)}
                              className="text-sm font-bold text-[#212121] dark:text-[#F5F5F5] hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors truncate text-left cursor-pointer"
                              title="Voir la fiche complète"
                            >
                              {u.nom}
                            </button>
                            {estAdmin && (
                              <span
                                title="Administrateur du Système"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6200EE] text-white text-[10px] font-black tracking-wide shadow-xs shrink-0"
                              >
                                <Shield className="w-2.5 h-2.5 fill-white" />
                                ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-[#757575] dark:text-[#A0A0A0] truncate max-w-[190px]">
                            {u.email}
                          </span>
                        </div>
                      </td>

                      {/* 2. Profil / Ce qu'il fait */}
                      <td className="px-4 py-3">
                        {u.profil ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#6200EE]/8 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold whitespace-nowrap">
                            💼 {u.profil}
                          </span>
                        ) : (
                          <span className="text-xs text-[#9E9E9E]">Non renseigné</span>
                        )}
                      </td>

                      {/* 3. Pourquoi il apprend (Objectif) */}
                      <td className="px-4 py-3">
                        {u.objectif ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#00897B]/8 text-[#00796B] dark:text-[#03DAC5] text-xs font-bold whitespace-nowrap">
                            🎯 {u.objectif}
                          </span>
                        ) : (
                          <span className="text-xs text-[#9E9E9E]">Non renseigné</span>
                        )}
                      </td>

                      {/* 4. Niveau & Alertes */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {u.niveau ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFA000]/10 text-[#E65100] dark:text-[#FFB74D] text-[11px] font-bold whitespace-nowrap">
                              📶 {u.niveau}
                            </span>
                          ) : (
                            <span className="text-xs text-[#9E9E9E]">Débutant</span>
                          )}
                          <span className="text-[10.5px] text-[#757575] dark:text-[#A0A0A0]">
                            {u.rappels !== false ? '🔔 Rappels ON' : '🔕 Sans rappels'}
                          </span>
                        </div>
                      </td>

                      {/* 5. Inscription */}
                      <td className="px-4 py-3 text-xs text-[#757575] dark:text-[#A0A0A0] whitespace-nowrap">
                        {formaterDate(u.inscritLe)}
                      </td>

                      {/* 6. Jours Actifs & Activité */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black border shadow-2xs ${
                              u.joursConnexion >= 10
                                ? 'bg-[#FF6D00]/12 text-[#E65100] dark:text-[#FF9E80] border-[#FF6D00]/30'
                                : u.joursConnexion >= 3
                                  ? 'bg-[#00897B]/12 text-[#00796B] dark:text-[#03DAC5] border-[#00897B]/30'
                                  : 'bg-[#757575]/10 text-[#616161] dark:text-[#BDBDBD] border-[#757575]/20'
                            }`}
                          >
                            🔥 {u.joursConnexion || 1} {u.joursConnexion > 1 ? 'jours' : 'jour'}
                          </span>
                          <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0]">
                            Dernière : {formaterDateHeure(u.derniereConnexion)}
                          </span>
                        </div>
                      </td>

                      {/* 7. Statut */}
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold whitespace-nowrap ${
                            u.premium
                              ? 'bg-[#1B5E20]/12 text-[#1B5E20] dark:text-[#66BB6A]'
                              : 'bg-[#757575]/12 text-[#757575] dark:text-[#A0A0A0]'
                          }`}
                        >
                          {u.premium ? 'Premium' : 'Gratuit'}
                        </span>
                      </td>

                      {/* 8. Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setUtilisateurDetail(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#212121] dark:text-[#F5F5F5] text-[11px] font-bold hover:border-[#6200EE] transition-all btn-press whitespace-nowrap cursor-pointer"
                            title="Voir la fiche détaillée"
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
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20 text-[11px] font-bold hover:bg-[#6200EE]/18 transition-all btn-press whitespace-nowrap cursor-pointer"
                            title="Prolonger l'abonnement"
                          >
                            <CalendarPlus className="w-3 h-3" />
                            Prolonger
                          </button>

                          <button
                            type="button"
                            disabled={!u.premium}
                            onClick={() =>
                              setAnnuler({
                                id: u.id,
                                nom: u.nom,
                                email: u.email,
                                finPeriode: u.finPeriode,
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#DD2C00]/10 text-[#DD2C00] border border-[#DD2C00]/20 text-[11px] font-bold hover:bg-[#DD2C00]/18 transition-all btn-press whitespace-nowrap disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#DD2C00]/10 cursor-pointer"
                            title={u.premium ? "Annuler l'abonnement" : 'Ce compte est déjà gratuit'}
                          >
                            <Ban className="w-3 h-3" />
                            Annuler
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

        {donnees && donnees.pages > 1 && (
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818]">
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
              Page {donnees.page} sur {donnees.pages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || chargement}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="w-8 h-8 rounded-lg border border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6200EE] transition-colors"
                aria-label="Page précédente"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= donnees.pages || chargement}
                onClick={() => setPage((p) => p + 1)}
                className="w-8 h-8 rounded-lg border border-[#E0E0E0] dark:border-[#333333] bg-white dark:bg-[#1E1E1E] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#6200EE] transition-colors"
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
            executer(
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
            executer(
              { userId: annuler.id, action: 'annulation' },
              `${annuler.nom} est repassé en accès gratuit.`
            )
          }
        />
      )}
    </div>
  );
}

