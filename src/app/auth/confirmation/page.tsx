'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, Mail, MailCheck, RotateCw } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import { traduireErreurAuth } from '@/lib/auth/authErrors';
import { renvoyerEmailActivation } from '@/lib/auth/confirmationEmail';

/** Délai avant la redirection automatique vers la connexion. */
const DELAI_REDIRECTION_S = 5;

type Etat = 'verification' | 'succes' | 'erreur';

/**
 * Page d'arrivée du lien d'activation reçu par e-mail.
 *
 * Supabase vérifie le lien AVANT d'y renvoyer l'apprenant, puis ajoute le
 * résultat à l'adresse : `?code=` (flux PKCE) ou `#access_token=` (flux
 * implicite) en cas de succès, `error_code` en query ou en fragment en cas
 * d'échec (lien expiré, déjà utilisé…). La page de connexion affichait
 * autrefois « Adresse confirmée » dans tous les cas : l'apprenant tentait
 * ensuite de se connecter et se voyait répondre que son compte n'était pas
 * activé. Ici, on n'annonce le succès que lorsque Supabase l'a confirmé.
 *
 * Un `?code=` n'est émis qu'après la confirmation de l'adresse : il suffit à
 * prouver le succès, même ouvert sur un autre appareil que celui de
 * l'inscription (où l'échange du code en session est impossible).
 */
export default function ConfirmationPage() {
  const [etat, setEtat] = useState<Etat>('verification');
  const [codeErreur, setCodeErreur] = useState<string | null>(null);
  const [secondes, setSecondes] = useState(DELAI_REDIRECTION_S);

  // Renvoi d'un nouveau lien
  const [email, setEmail] = useState('');
  const [renvoiEnCours, setRenvoiEnCours] = useState(false);
  const [attenteRenvoi, setAttenteRenvoi] = useState(0);
  const [messageRenvoi, setMessageRenvoi] = useState<{ ok: boolean; texte: string } | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const fragment = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const lire = (cle: string) => query.get(cle) || fragment.get(cle);

    const erreur = lire('error_code') || lire('error');
    const succes = query.has('code') || query.has('verifie') || fragment.has('access_token');

    if (!erreur && !succes) {
      // Aucun résultat de vérification (page ouverte à la main) : rien à annoncer.
      window.location.replace('/connexion');
      return;
    }

    let annule = false;
    (async () => {
      // L'apprenant se connecte ensuite lui-même : on ferme toute session
      // restée ouverte sur ce navigateur, pour que la page de connexion
      // s'affiche au lieu de renvoyer vers un autre compte.
      if (succes && !erreur) {
        const supabase = createClient();
        await supabase.auth.getSession();
        await supabase.auth.signOut({ scope: 'local' });
      }
      if (annule) return;
      // Jeton à usage unique : on le retire de la barre d'adresse et de l'historique.
      window.history.replaceState(null, '', window.location.pathname);
      if (erreur) {
        setCodeErreur(erreur);
        setEtat('erreur');
        return;
      }
      setEtat('succes');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    })();

    return () => {
      annule = true;
    };
  }, []);

  useEffect(() => {
    if (etat !== 'succes') return;
    if (secondes <= 0) {
      window.location.assign('/connexion?active=1');
      return;
    }
    const minuterie = setTimeout(() => setSecondes((s) => s - 1), 1000);
    return () => clearTimeout(minuterie);
  }, [etat, secondes]);

  useEffect(() => {
    if (attenteRenvoi <= 0) return;
    const minuterie = setTimeout(() => setAttenteRenvoi((s) => s - 1), 1000);
    return () => clearTimeout(minuterie);
  }, [attenteRenvoi]);

  const renvoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || attenteRenvoi > 0) return;
    setRenvoiEnCours(true);
    setMessageRenvoi(null);
    const { error } = await renvoyerEmailActivation(email);
    setRenvoiEnCours(false);
    setAttenteRenvoi(60);
    setMessageRenvoi(
      error
        ? { ok: false, texte: traduireErreurAuth(error, 'inscription') }
        : {
            ok: true,
            texte:
              'Si un compte en attente d’activation existe pour cette adresse, un nouveau lien vient de partir. Pense à regarder dans tes courriers indésirables.',
          }
    );
  };

  const lienExpire = codeErreur === 'otp_expired' || codeErreur === 'access_denied';

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden bg-[#ECEFF8] dark:bg-[#111218]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#03DAC5]/12 dark:bg-[#03DAC5]/20 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1E1E28] rounded-3xl border border-[#E0E0E0] dark:border-[#2D2D3D] shadow-2xl shadow-[#6200EE]/10 p-6 sm:p-8 space-y-6 animate-fadeIn">
        <div className="flex justify-center">
          <Logo size="md" href="/" />
        </div>

        {etat === 'verification' && (
          <div className="flex flex-col items-center text-center gap-3 py-6">
            <Loader2 className="w-8 h-8 text-[#6200EE] animate-spin" />
            <p className="text-sm text-[#616161] dark:text-[#BDBDBD]">Activation de ton compte…</p>
          </div>
        )}

        {etat === 'succes' && (
          <div className="flex flex-col items-center text-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#00BFA5]/15 flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9 text-[#00BFA5]" />
            </div>
            <div className="space-y-2">
              <h1 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
                Adresse e-mail confirmée !
              </h1>
              <p className="text-sm text-[#616161] dark:text-[#BDBDBD] leading-relaxed">
                Ton compte ChinoisLingo est activé. Connecte-toi avec ton adresse e-mail et ton mot de passe pour commencer.
              </p>
            </div>
            <Link
              href="/connexion?active=1"
              className="w-full py-3.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-sm font-black shadow-md shadow-[#6200EE]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Se connecter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
              Redirection automatique dans {secondes} s…
            </p>
          </div>
        )}

        {etat === 'erreur' && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="w-9 h-9 text-rose-500" />
              </div>
              <h1 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
                {lienExpire ? 'Ce lien n’est plus valide' : 'Activation impossible'}
              </h1>
              <p className="text-sm text-[#616161] dark:text-[#BDBDBD] leading-relaxed">
                {lienExpire
                  ? 'Ce lien d’activation a expiré ou a déjà été utilisé.'
                  : 'Le lien d’activation n’a pas pu être vérifié.'}{' '}
                Si tu as déjà cliqué dessus une première fois, ton compte est sans doute déjà actif : essaie simplement de te connecter.
              </p>
            </div>

            <Link
              href="/connexion"
              className="w-full py-3.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-sm font-black shadow-md shadow-[#6200EE]/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Essayer de me connecter</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <form
              onSubmit={renvoyer}
              className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0]/60 dark:border-[#2D2D2D] space-y-3"
            >
              <p className="text-xs font-bold text-[#424242] dark:text-[#E0E0E0] flex items-center gap-1.5">
                <MailCheck className="w-4 h-4 text-[#6200EE] dark:text-[#BB86FC]" />
                Recevoir un nouveau lien d’activation
              </p>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton.email@exemple.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-white dark:bg-[#252634] text-[16px] text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={renvoiEnCours || attenteRenvoi > 0}
                className="w-full py-3 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] text-sm font-semibold text-[#424242] dark:text-[#E0E0E0] hover:bg-white dark:hover:bg-white/5 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <RotateCw className={`w-4 h-4 ${renvoiEnCours ? 'animate-spin' : ''}`} />
                <span>{attenteRenvoi > 0 ? `Renvoyer le lien (${attenteRenvoi} s)` : 'Renvoyer le lien'}</span>
              </button>
              {messageRenvoi && (
                <p
                  className={`text-xs font-medium ${
                    messageRenvoi.ok ? 'text-[#1B5E20] dark:text-[#66BB6A]' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {messageRenvoi.texte}
                </p>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
