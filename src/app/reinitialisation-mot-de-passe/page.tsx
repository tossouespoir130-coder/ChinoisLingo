'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  KeyRound, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import { traduireErreurAuth } from '@/lib/auth/authErrors';
import {
  CONSIGNE_MOT_DE_PASSE,
  effacerRecuperation,
  marquerRecuperation,
  recuperationActive,
  validerNouveauMotDePasse,
} from '@/lib/auth/motDePasse';

/**
 * État du lien :
 * - `verification` : échange du jeton en cours ;
 * - `pret`         : session issue d'un lien de récupération, formulaire ouvert ;
 * - `invalide`     : lien expiré / déjà utilisé, ou simple session ordinaire.
 */
type EtatLien = 'verification' | 'pret' | 'invalide';

/** Délai laissé à Supabase pour émettre PASSWORD_RECOVERY après l'échange du jeton. */
const DELAI_EVENEMENT_MS = 2500;

export default function ReinitialisationMotDePassePage() {
  const router = useRouter();
  const supabase = createClient();
  const { updatePassword } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [etatLien, setEtatLien] = useState<EtatLien>('verification');

  useEffect(() => {
    let actif = true;
    let minuterie: ReturnType<typeof setTimeout> | undefined;

    /**
     * Le formulaire ne s'ouvre que pour une session de RÉCUPÉRATION.
     * Une session ordinaire ne suffit pas : cette page ne demande pas
     * l'ancien mot de passe, elle contournerait sinon Mon Compte.
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' && session) {
        marquerRecuperation();
        if (minuterie) clearTimeout(minuterie);
        if (actif) {
          setErrorMessage(null);
          setEtatLien('pret');
        }
      }
    });

    const verifier = async () => {
      const hash = window.location.hash;
      const search = window.location.search;
      const params = new URLSearchParams(search);

      if (hash.includes('error=') || params.has('error') || params.get('erreur') === 'invalide') {
        effacerRecuperation();
        setErrorMessage(
          hash.includes('otp_expired') || search.includes('otp_expired')
            ? 'Ce lien de réinitialisation a expiré. Faites une nouvelle demande depuis la page de connexion.'
            : 'Ce lien de réinitialisation est invalide ou a déjà été utilisé. Faites une nouvelle demande.'
        );
        setEtatLien('invalide');
        return;
      }

      // Attend la fin de l'échange du jeton présent dans l'URL, le cas échéant.
      const { data: { session } } = await supabase.auth.getSession();
      if (!actif) return;

      if (session && recuperationActive()) {
        setEtatLien('pret');
        return;
      }

      // L'événement PASSWORD_RECOVERY peut arriver juste après : on lui laisse un instant.
      minuterie = setTimeout(() => {
        if (!actif) return;
        setEtatLien((etat) => (etat === 'pret' ? etat : 'invalide'));
      }, DELAI_EVENEMENT_MS);
    };

    verifier();

    return () => {
      actif = false;
      if (minuterie) clearTimeout(minuterie);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (etatLien !== 'pret') return;

    const erreurValidation = validerNouveauMotDePasse(password, confirmPassword);
    if (erreurValidation) {
      setErrorMessage(erreurValidation);
      return;
    }

    setIsSubmitting(true);

    try {
      // Pas d'ancien mot de passe ici : l'apprenant l'a oublié, c'est le lien reçu par e-mail qui l'authentifie.
      const { error } = await updatePassword(password);

      if (error) {
        setErrorMessage(traduireErreurAuth(error, 'motDePasse'));
        setIsSubmitting(false);
      } else {
        // Le lien est consommé : la page se referme derrière l'apprenant.
        effacerRecuperation();
        setPassword('');
        setConfirmPassword('');
        setSuccessMessage('Votre mot de passe a été mis à jour avec succès !');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          router.push('/tableau-de-bord');
        }, 1500);
      }
    } catch (err: unknown) {
      setErrorMessage(traduireErreurAuth(err, 'motDePasse'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-10 overflow-hidden bg-[#ECEFF8] dark:bg-[#111218]">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#03DAC5]/12 dark:bg-[#03DAC5]/20 blur-[150px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-[#1E1E28] rounded-3xl border border-[#E0E0E0] dark:border-[#2D2D3D] shadow-2xl shadow-[#6200EE]/10 p-6 sm:p-8 space-y-6 animate-fadeIn">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-90 transition-opacity">
            <Logo size="md" />
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-[11px] font-black uppercase tracking-wider">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Nouveau mot de passe</span>
          </div>

          <div>
            <h1 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
              Réinitialiser votre mot de passe
            </h1>
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1">
              Choisissez un nouveau mot de passe sécurisé pour votre compte ChinoisLingo.
            </p>
          </div>
        </div>

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Message de succès */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {etatLien === 'verification' && (
          <p className="text-xs text-center text-[#757575] dark:text-[#A0A0A0] animate-pulse">
            Vérification du lien de réinitialisation…
          </p>
        )}

        {etatLien === 'invalide' && (
          <div className="space-y-3 text-center">
            {!errorMessage && (
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
                Cette page s’ouvre uniquement depuis le lien reçu par e-mail. Si ce lien a expiré,
                demandez-en un nouveau via « Mot de passe oublié ? ». Pour changer votre mot de passe
                en étant connecté, passez par Mon Compte.
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href="/connexion"
                className="px-5 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold transition-colors"
              >
                Demander un nouveau lien
              </Link>
              <Link
                href="/mon-compte?tab=password"
                className="px-5 py-2.5 rounded-full border border-[#E0E0E0] dark:border-[#2D2D3D] text-xs font-bold text-[#757575] hover:text-[#6200EE] transition-colors"
              >
                Mon Compte
              </Link>
            </div>
          </div>
        )}

        {/* Formulaire */}
        {etatLien === 'pret' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Nouveau mot de passe */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
              Nouveau mot de passe *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757575] dark:text-[#A0A0A0]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder={CONSIGNE_MOT_DE_PASSE}
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#F5F5F7] dark:bg-[#252533] border border-transparent focus:border-[#6200EE] focus:bg-white dark:focus:bg-[#1E1E28] text-sm text-[#212121] dark:text-[#F5F5F5] outline-none transition-all placeholder:text-[#9E9E9E]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirmer le mot de passe */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
              Confirmer le nouveau mot de passe *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757575] dark:text-[#A0A0A0]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez le mot de passe"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#F5F5F7] dark:bg-[#252533] border border-transparent focus:border-[#6200EE] focus:bg-white dark:focus:bg-[#1E1E28] text-sm text-[#212121] dark:text-[#F5F5F5] outline-none transition-all placeholder:text-[#9E9E9E]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bouton de validation */}
          <button
            type="submit"
            disabled={isSubmitting || Boolean(successMessage)}
            className="w-full mt-2 py-3.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] disabled:opacity-50 text-white text-sm font-black shadow-md shadow-[#6200EE]/25 active:scale-95 transition-all btn-press flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer mon nouveau mot de passe'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        )}

        {/* Pied de page retour */}
        <div className="text-center pt-2 border-t border-[#E0E0E0] dark:border-[#2D2D3D]">
          <Link
            href="/connexion"
            className="text-xs font-semibold text-[#757575] hover:text-[#6200EE] dark:hover:text-[#03DAC5] transition-colors"
          >
            ← Retour à la page de connexion
          </Link>
        </div>

      </div>
    </div>
  );
}
