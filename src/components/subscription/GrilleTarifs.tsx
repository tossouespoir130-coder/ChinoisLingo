'use client';

import React, { useState } from 'react';
import { Check, Loader2, Smartphone, CreditCard, AlertCircle } from 'lucide-react';
import {
  PLANS,
  Devise,
  formaterMontant,
  prixMensuelEquivalent,
  economiePourcent,
} from '@/lib/payments/plans';
import { useAbonnement } from '@/lib/payments/useAbonnement';

/** Pays où le Mobile Money est le moyen de paiement naturel : on y ouvre en FCFA. */
const PAYS_FCFA = [
  'TG', 'BJ', 'BF', 'CI', 'ML', 'SN', 'NE', 'GW', // UEMOA
  'CM', 'CF', 'TD', 'CG', 'GQ', 'GA',             // CEMAC
  'Togo', 'Bénin', 'Burkina Faso', "Côte d'Ivoire", 'Mali', 'Sénégal',
  'Niger', 'Cameroun', 'Gabon', 'Tchad', 'Congo',
];

const AVANTAGES = [
  'Vocabulaire HSK 1 à 6 — près de 5 000 mots officiels',
  'Flashcards de révision espacée et Méthode de la Combinaison',
  'Écoute & Lecture : chansons, dialogues, articles, histoires',
  'Formations vidéo intégrales et Mot du Jour',
];

export function GrilleTarifs({ paysProfil }: { paysProfil?: string | null }) {
  // Pays connu et hors zone franc → l'euro est le choix pertinent d'entrée.
  // Pays inconnu → FCFA, le marché principal.
  const deviseInitiale: Devise =
    paysProfil && !PAYS_FCFA.includes(paysProfil) ? 'EUR' : 'XOF';
  const [devise, setDevise] = useState<Devise>(deviseInitiale);

  const { demarrerPaiement, enCours, erreur, effacerErreur, estConnecte } = useAbonnement();

  return (
    <div className="space-y-6">
      {/* Bascule de devise — chaque devise engage un fournisseur différent */}
      <div className="flex flex-col items-center gap-3">
        <div className="inline-flex p-1 rounded-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D]">
          {(
            [
              { valeur: 'XOF' as Devise, libelle: 'FCFA', icone: Smartphone, detail: 'Mobile Money' },
              { valeur: 'EUR' as Devise, libelle: 'Euro', icone: CreditCard, detail: 'Carte bancaire' },
            ]
          ).map(({ valeur, libelle, icone: Icone, detail }) => (
            <button
              key={valeur}
              type="button"
              onClick={() => {
                setDevise(valeur);
                effacerErreur();
              }}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold tab-transition btn-press flex items-center gap-2 ${
                devise === valeur
                  ? 'bg-[#6200EE] text-white shadow-md shadow-[#6200EE]/25'
                  : 'text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white'
              }`}
            >
              <Icone className="w-3.5 h-3.5" />
              <span>{libelle}</span>
              <span className="hidden sm:inline opacity-70 font-semibold">· {detail}</span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] text-center max-w-md">
          {devise === 'XOF'
            ? 'Réglez avec MTN MoMo, Moov Money, Orange Money, Wave ou T-Money.'
            : 'Réglez par carte Visa ou Mastercard, avec renouvellement automatique.'}
        </p>
      </div>

      {erreur && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs font-medium text-rose-700 dark:text-rose-300">{erreur}</p>
        </div>
      )}

      {/* Les trois formules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {PLANS.map((plan, index) => {
          const economie = economiePourcent(plan, devise);
          const chargement = enCours === plan.id;

          return (
            <div
              key={plan.id}
              className={`nixtio-card p-5 sm:p-6 flex flex-col justify-between relative animate-cascade-${index + 1} ${
                plan.populaire
                  ? 'bg-white dark:bg-[#1E1E1E] border-2 border-[#6200EE] shadow-md shadow-[#6200EE]/15'
                  : 'bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE]/40'
              }`}
            >
              {plan.populaire && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#E91E63] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm whitespace-nowrap">
                  Le plus choisi
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] uppercase font-extrabold tracking-wider ${
                      plan.populaire
                        ? 'text-[#6200EE] dark:text-[#BB86FC]'
                        : 'text-[#757575] dark:text-[#A0A0A0]'
                    }`}
                  >
                    {plan.nom}
                  </span>
                  {economie > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#00BFA5]/15 text-[#00897B] dark:text-[#03DAC5] text-[10px] font-extrabold whitespace-nowrap">
                      −{economie} %
                    </span>
                  )}
                </div>

                <div className="mt-2.5">
                  <span
                    className={`font-display font-black text-2xl sm:text-[28px] leading-none ${
                      plan.populaire
                        ? 'text-[#6200EE] dark:text-[#BB86FC]'
                        : 'text-[#212121] dark:text-[#F5F5F5]'
                    }`}
                  >
                    {formaterMontant(plan.montant[devise], devise)}
                  </span>
                  {plan.dureeMois > 1 && (
                    <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] mt-1.5 font-medium">
                      soit {prixMensuelEquivalent(plan, devise)} par mois
                    </p>
                  )}
                </div>

                <ul className="space-y-2 mt-5 text-[11px] sm:text-xs text-[#212121] dark:text-[#F5F5F5] font-medium">
                  {AVANTAGES.map((avantage) => (
                    <li key={avantage} className="flex items-start gap-2">
                      <Check
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          plan.populaire
                            ? 'text-[#6200EE] dark:text-[#BB86FC]'
                            : 'text-[#00897B] dark:text-[#03DAC5]'
                        }`}
                      />
                      <span className="leading-snug">{avantage}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                disabled={chargement || enCours !== null || !estConnecte}
                onClick={() => demarrerPaiement(plan.id, devise)}
                className={`w-full mt-6 py-3 rounded-full text-xs font-bold btn-press transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                  plan.populaire
                    ? 'bg-[#6200EE] hover:bg-[#3700B3] text-white shadow-md shadow-[#6200EE]/25'
                    : 'bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] hover:bg-[#6200EE]/10 hover:text-[#6200EE]'
                }`}
              >
                {chargement ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Ouverture du paiement…</span>
                  </>
                ) : (
                  <span>Choisir ce pass</span>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {!estConnecte && (
        <p className="text-center text-xs text-[#757575] dark:text-[#A0A0A0]">
          Connectez-vous pour souscrire.
        </p>
      )}
    </div>
  );
}
