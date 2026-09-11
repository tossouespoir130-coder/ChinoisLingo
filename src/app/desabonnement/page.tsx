'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle, MailX } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';

/**
 * Page de désabonnement des relances commerciales.
 *
 * Publique : elle n'est pas dans le filtre du proxy, car l'apprenant n'est
 * plus abonné et n'aura pas forcément de session. La signature contenue dans
 * l'adresse fait foi, et c'est la route API qui la vérifie.
 *
 * Un bouton de confirmation plutôt qu'un désabonnement au chargement :
 * certains filtres anti-spam visitent les liens des e-mails, et couperaient
 * les envois sans que personne ne l'ait demandé.
 */
function DesabonnementContent() {
  const parametres = useSearchParams();
  const identifiant = parametres.get('u') ?? '';
  const signature = parametres.get('s') ?? '';

  const [etat, setEtat] = useState<'attente' | 'envoi' | 'fait' | 'erreur'>('attente');
  const [erreur, setErreur] = useState<string | null>(null);

  const confirmer = async () => {
    setEtat('envoi');
    setErreur(null);

    try {
      const reponse = await fetch(
        `/api/emails/desabonnement?u=${encodeURIComponent(identifiant)}&s=${encodeURIComponent(signature)}`,
        { method: 'POST' }
      );

      if (!reponse.ok) {
        const donnees = await reponse.json().catch(() => ({}));
        setErreur(donnees.erreur ?? 'Le désabonnement n’a pas pu être enregistré.');
        setEtat('erreur');
        return;
      }

      setEtat('fait');
    } catch {
      setErreur('Connexion impossible. Réessayez dans un instant.');
      setEtat('erreur');
    }
  };

  const lienInvalide = !identifiant || !signature;

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 bg-[#ECEFF8] dark:bg-[#111218]">
      <div className="w-full max-w-md bg-white dark:bg-[#1E1E28] rounded-3xl border border-[#E0E0E0] dark:border-[#2D2D3D] shadow-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#6200EE]/10 flex items-center justify-center shrink-0 p-1.5">
            <Logo variant="icon" size="sm" href="" />
          </div>
          <div>
            <span className="font-display font-black text-lg text-[#212121] dark:text-[#F5F5F5] block leading-tight">
              ChinoisLingo
            </span>
            <span className="text-[10px] font-bold text-[#6200EE] dark:text-[#BB86FC] uppercase tracking-wider">
              « Le chinois devient facile »
            </span>
          </div>
        </div>

        {lienInvalide ? (
          <div className="space-y-3">
            <h1 className="font-display font-black text-xl text-[#212121] dark:text-[#F5F5F5]">
              Lien incomplet
            </h1>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              Ce lien de désabonnement est incomplet. Ouvrez-le directement depuis l’e-mail reçu,
              sans le recopier.
            </p>
          </div>
        ) : etat === 'fait' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#00897B] dark:text-[#03DAC5]">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <h1 className="font-display font-black text-xl">C’est fait</h1>
            </div>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              Vous ne recevrez plus nos e-mails qui invitent à reprendre un abonnement.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press"
            >
              Retour à ChinoisLingo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#212121] dark:text-[#F5F5F5]">
              <MailX className="w-5 h-5 text-[#6200EE] dark:text-[#BB86FC] shrink-0" />
              <h1 className="font-display font-black text-xl">Ne plus recevoir ces e-mails</h1>
            </div>

            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
              Nous cesserons de vous écrire pour vous inviter à reprendre un abonnement après la
              fin du vôtre.
            </p>

            <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] leading-relaxed bg-[#FAFAFA] dark:bg-[#252634] p-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D]">
              Vous continuerez à recevoir les e-mails liés à votre compte : confirmation de
              paiement et avis de fin d’abonnement.
            </p>

            {erreur && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erreur}</span>
              </div>
            )}

            <button
              type="button"
              onClick={confirmer}
              disabled={etat === 'envoi'}
              className="w-full py-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-sm font-black shadow-md shadow-[#6200EE]/25 transition-all btn-press disabled:opacity-60 cursor-pointer"
            >
              {etat === 'envoi' ? 'Enregistrement…' : 'Confirmer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DesabonnementPage() {
  return (
    <Suspense
      fallback={<div className="p-12 text-center text-xs text-[#757575]">Chargement…</div>}
    >
      <DesabonnementContent />
    </Suspense>
  );
}
