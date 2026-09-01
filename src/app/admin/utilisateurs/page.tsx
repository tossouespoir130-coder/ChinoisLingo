'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Search, Loader2, AlertCircle, ChevronLeft, ChevronRight, Shield,
  CalendarPlus, Ban, CheckCircle2,
} from 'lucide-react';
import {
  ModaleProlongation,
  ModaleAnnulation,
  type CibleAction,
} from '@/components/admin/ModalesAbonnement';
import { useApiAdmin, formaterDate } from '@/lib/admin/useApiAdmin';

interface Utilisateur {
  id: string;
  nom: string;
  email: string;
  inscritLe: string | null;
  role: string;
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
  const [page, setPage] = useState(1);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  // Aucune action ne s'exécute au clic : elle ouvre d'abord sa fenêtre de
  // confirmation, seule habilitée à déclencher l'appel serveur.
  const [prolonger, setProlonger] = useState<CibleAction | null>(null);
  const [annuler, setAnnuler] = useState<CibleAction | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  const charger = useCallback(
    async (p: number, q: string) => {
      setChargement(true);
      setErreur(null);
      try {
        const d = await appeler<Reponse>(
          `/api/admin/utilisateurs?page=${p}&recherche=${encodeURIComponent(q)}`
        );
        setDonnees(d);
      } catch (e) {
        setErreur((e as Error).message);
      } finally {
        setChargement(false);
      }
    },
    [appeler]
  );

  // La recherche est temporisée : sans cela, chaque frappe déclencherait
  // une requête et la liste clignoterait.
  useEffect(() => {
    if (!pret) return;
    const minuteur = setTimeout(() => charger(page, recherche), 300);
    return () => clearTimeout(minuteur);
  }, [pret, page, recherche, charger]);

  /** Appel serveur commun aux deux actions. La trace est écrite par la
      fonction Postgres, dans la même transaction que la modification. */
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
      await charger(page, recherche);
    } catch (e) {
      setErreur((e as Error).message);
      setProlonger(null);
      setAnnuler(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
          Utilisateurs
        </h1>
        <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5 sm:mt-1 font-medium">
          {donnees ? `${donnees.total.toLocaleString('fr-FR')} comptes` : 'Chargement…'} — lecture seule.
        </p>
      </div>

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
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-[16px] sm:text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
        />
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
        {/* Le tableau défile dans son propre conteneur : la page ne doit
            jamais partir en défilement horizontal sur mobile. */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-[#FAFAFA] dark:bg-[#181818] border-b border-[#E0E0E0] dark:border-[#2D2D2D]">
                {['Nom', 'E-mail', 'Inscription', 'Statut', 'Actions'].map((t) => (
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
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-[#6200EE] mx-auto" />
                  </td>
                </tr>
              ) : donnees && donnees.utilisateurs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#757575]">
                    Aucun compte ne correspond à cette recherche.
                  </td>
                </tr>
              ) : (
                donnees?.utilisateurs.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]/60 last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#181818] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-semibold text-[#212121] dark:text-[#F5F5F5] truncate">
                          {u.nom}
                        </span>
                        {u.role === 'admin' && (
                          <span
                            title="Administrateur"
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-[10px] font-extrabold shrink-0"
                          >
                            <Shield className="w-2.5 h-2.5" />
                            Admin
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#757575] dark:text-[#A0A0A0] truncate max-w-[240px]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#757575] dark:text-[#A0A0A0] whitespace-nowrap">
                      {formaterDate(u.inscritLe)}
                    </td>
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
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20 text-[11px] font-bold hover:bg-[#6200EE]/18 transition-all btn-press whitespace-nowrap"
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
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#DD2C00]/10 text-[#DD2C00] border border-[#DD2C00]/20 text-[11px] font-bold hover:bg-[#DD2C00]/18 transition-all btn-press whitespace-nowrap disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-[#DD2C00]/10"
                          title={u.premium ? "Annuler l'abonnement" : 'Ce compte est déjà gratuit'}
                        >
                          <Ban className="w-3 h-3" />
                          Annuler
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
