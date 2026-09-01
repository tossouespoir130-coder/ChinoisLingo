'use client';

import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Loader2, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { getPlan, formaterMontant, Devise } from '@/lib/payments/plans';
import { formaterEcheance } from '@/lib/payments/subscription';

type EtatPage = 'verification' | 'succes' | 'echec' | 'attente' | 'erreur';

/** Le webhook met quelques secondes à revenir : on interroge le statut par vagues. */
const INTERVALLE_MS = 2_000;
const TENTATIVES_MAX = 15; // ≈ 30 secondes

interface StatutPaiement {
  statut: string;
  plan: string;
  devise: string;
  montant: number;
  motifEchec: string | null;
  abonnement: { statut: string | null; finPeriode: string | null; finEssai: string | null };
}

function RetourPaiementContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const { session, refreshProfile } = useAuth();

  // La référence est lisible dès le premier rendu : l'état initial en découle
  // directement, plutôt que par un setState dans un effet.
  const [etat, setEtat] = useState<EtatPage>(ref ? 'verification' : 'erreur');
  const [donnees, setDonnees] = useState<StatutPaiement | null>(null);
  const confettiLance = useRef(false);

  const interroger = useCallback(async (): Promise<boolean> => {
    if (!ref || !session?.access_token) return false;

    try {
      const reponse = await fetch(`/api/paiement/statut?ref=${encodeURIComponent(ref)}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (!reponse.ok) {
        setEtat('erreur');
        return true;
      }

      const json: StatutPaiement = await reponse.json();
      setDonnees(json);

      if (json.statut === 'completed') {
        setEtat('succes');
        await refreshProfile();
        return true;
      }

      if (json.statut === 'failed') {
        setEtat('echec');
        return true;
      }

      return false; // toujours « pending » : on repasse
    } catch {
      setEtat('erreur');
      return true;
    }
  }, [ref, session, refreshProfile]);

  useEffect(() => {
    if (!ref || !session?.access_token) return;

    let annule = false;
    let tentatives = 0;

    const boucle = async () => {
      while (!annule && tentatives < TENTATIVES_MAX) {
        const termine = await interroger();
        if (termine || annule) return;
        tentatives += 1;
        await new Promise((r) => setTimeout(r, INTERVALLE_MS));
      }
      // Le paiement peut très bien aboutir après ce délai : on informe sans alarmer.
      if (!annule) setEtat('attente');
    };

    boucle();
    return () => {
      annule = true;
    };
  }, [ref, session, interroger]);

  // Charte ChinoisLingo : toute complétion déclenche les confettis.
  useEffect(() => {
    if (etat === 'succes' && !confettiLance.current) {
      confettiLance.current = true;
      confetti({
        particleCount: 140,
        spread: 78,
        origin: { y: 0.6 },
        colors: ['#6200EE', '#03DAC5', '#E91E63', '#FFC107'],
      });
    }
  }, [etat]);

  const plan = donnees ? getPlan(donnees.plan) : undefined;
  const finPeriode = donnees?.abonnement.finPeriode
    ? new Date(donnees.abonnement.finPeriode)
    : null;

  return (
    <div className="max-w-lg mx-auto py-8 sm:py-14 animate-cascade-1">
      <div className="nixtio-card p-7 sm:p-9 text-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-5">
        {/* ── Vérification en cours ─────────────────────────────────── */}
        {etat === 'verification' && (
          <>
            <div className="w-14 h-14 rounded-3xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
              Vérification de votre paiement
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              Nous confirmons la transaction auprès de votre opérateur. Cela prend
              généralement quelques secondes — ne fermez pas cette page.
            </p>
          </>
        )}

        {/* ── Paiement confirmé ─────────────────────────────────────── */}
        {etat === 'succes' && (
          <>
            <div className="w-14 h-14 rounded-3xl bg-[#00BFA5]/15 text-[#00897B] dark:text-[#03DAC5] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
              Bienvenue dans le pass complet ✨
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              {plan && donnees
                ? `Votre ${plan.nom} de ${formaterMontant(donnees.montant, donnees.devise as Devise)} est actif.`
                : 'Votre abonnement est actif.'}{' '}
              {finPeriode && (
                <>
                  Vous avez accès à tout ChinoisLingo jusqu&apos;au{' '}
                  <strong className="text-[#212121] dark:text-white">
                    {formaterEcheance(finPeriode)}
                  </strong>
                  .
                </>
              )}
            </p>
            <div className="p-3 rounded-2xl bg-[#00BFA5]/8 border border-[#00BFA5]/25">
              <p className="text-[11px] text-[#00897B] dark:text-[#03DAC5] font-semibold">
                Tout le catalogue HSK 1 à 6 est désormais ouvert : chansons, dialogues,
                articles, histoires, vidéos et formations.
              </p>
            </div>
            <Link
              href="/tableau-de-bord"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press"
            >
              Reprendre mon apprentissage
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </>
        )}

        {/* ── Paiement refusé ───────────────────────────────────────── */}
        {etat === 'echec' && (
          <>
            <div className="w-14 h-14 rounded-3xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
              Le paiement n&apos;a pas abouti
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              Aucun montant n&apos;a été prélevé. Vous pouvez réessayer avec le même moyen de
              paiement ou en choisir un autre.
            </p>
            {donnees?.motifEchec && (
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] italic">
                Motif communiqué : {donnees.motifEchec}
              </p>
            )}
            <Link
              href="/mon-compte?tab=subscription"
              className="inline-block w-full py-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press"
            >
              Réessayer
            </Link>
          </>
        )}

        {/* ── Confirmation plus lente que prévu ─────────────────────── */}
        {etat === 'attente' && (
          <>
            <div className="w-14 h-14 rounded-3xl bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFC107] flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
              Confirmation en cours
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              Votre opérateur met un peu plus de temps que d&apos;habitude. Votre accès
              s&apos;ouvrira automatiquement dès la confirmation reçue — inutile de payer une
              seconde fois.
            </p>
            <Link
              href="/mon-compte?tab=subscription"
              className="inline-block w-full py-3 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] text-xs font-bold hover:bg-[#6200EE]/10 hover:text-[#6200EE] transition-all btn-press"
            >
              Voir mon abonnement
            </Link>
          </>
        )}

        {/* ── Référence introuvable ─────────────────────────────────── */}
        {etat === 'erreur' && (
          <>
            <div className="w-14 h-14 rounded-3xl bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] dark:text-[#A0A0A0] flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7" />
            </div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
              Paiement introuvable
            </h1>
            <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              Nous ne retrouvons pas cette référence de paiement. Si un montant a été
              débité, contactez-nous : rien ne sera perdu.
            </p>
            <Link
              href="/mon-compte?tab=subscription"
              className="inline-block w-full py-3 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] text-xs font-bold hover:bg-[#6200EE]/10 hover:text-[#6200EE] transition-all btn-press"
            >
              Retour à mon abonnement
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function RetourPaiementPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-lg mx-auto py-14 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#6200EE]" />
        </div>
      }
    >
      <RetourPaiementContent />
    </Suspense>
  );
}
