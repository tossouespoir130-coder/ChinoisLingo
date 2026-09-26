'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  MailCheck,
  RotateCw
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';
import { OnboardingState } from './types';
import { traduireErreurAuth } from '@/lib/auth/authErrors';
import { CONSIGNE_MOT_DE_PASSE, validerNouveauMotDePasse } from '@/lib/auth/motDePasse';

interface StepRegisterProps {
  state: OnboardingState;
}

export function StepRegister({ state }: StepRegisterProps) {
  const { signUpWithEmail } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Écran « Vérifie ta boîte mail » : adresse en attente de confirmation.
  const [emailAConfirmer, setEmailAConfirmer] = useState<string | null>(null);
  const [attenteRenvoi, setAttenteRenvoi] = useState(0);
  const [renvoiEnCours, setRenvoiEnCours] = useState(false);
  const [messageRenvoi, setMessageRenvoi] = useState<string | null>(null);

  useEffect(() => {
    if (attenteRenvoi <= 0) return;
    const minuterie = setTimeout(() => setAttenteRenvoi((s) => s - 1), 1000);
    return () => clearTimeout(minuterie);
  }, [attenteRenvoi]);

  const renvoyerEmailConfirmation = async () => {
    if (!emailAConfirmer || attenteRenvoi > 0) return;
    setRenvoiEnCours(true);
    setMessageRenvoi(null);
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || window.location.origin;
    const { error } = await createClient().auth.resend({
      type: 'signup',
      email: emailAConfirmer,
      options: { emailRedirectTo: `${siteUrl}/connexion?confirme=1` },
    });
    setRenvoiEnCours(false);
    setAttenteRenvoi(60);
    setMessageRenvoi(
      error ? traduireErreurAuth(error, 'inscription') : 'Nouvel e-mail envoyé ! Pense à vérifier tes courriers indésirables.'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!username.trim()) {
      setErrorMessage('Veuillez renseigner votre pseudo.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Veuillez renseigner votre adresse e-mail.');
      return;
    }
    const erreurMotDePasse = validerNouveauMotDePasse(password, confirmPassword);
    if (erreurMotDePasse) {
      setErrorMessage(erreurMotDePasse);
      return;
    }

    setIsSubmitting(true);

    try {
      const { error, besoinConfirmation } = await signUpWithEmail(
        email,
        password,
        username,
        '',
        username,
        {
          onboarding_profil: state.profilLabel || 'Professionnel(le) salarié(e)',
          onboarding_objectif: state.motivationLabel || 'Pour le travail',
          onboarding_niveau: state.niveauLabel || 'Je débute complètement',
          onboarding_rappels: state.rappels,
        }
      );

      if (error) {
        setErrorMessage(traduireErreurAuth(error, 'inscription'));
      } else {
        // Envoi automatique de l'email de bienvenue via Resend : le serveur
        // relit nom, profil et niveau dans le profil tout juste créé.
        fetch('/api/emails/bienvenue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }).catch((err) => console.error('[onboarding] Erreur envoi email bienvenue', err));

        if (besoinConfirmation) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          // Le brouillon du questionnaire n'a plus lieu d'être : le compte existe.
          try {
            sessionStorage.removeItem('chinoislingo_onboarding_draft');
          } catch {
            // stockage indisponible
          }
          setPassword('');
          setConfirmPassword('');
          setAttenteRenvoi(60);
          setEmailAConfirmer(email.trim());
        } else {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
          // Navigation complète : le serveur reçoit les cookies de la nouvelle session.
          window.location.assign('/tableau-de-bord?bienvenue=1');
        }
      }
    } catch {
      setErrorMessage('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailAConfirmer) {
    return (
      <div className="animate-fade-in flex flex-col items-center text-center gap-5 py-2">
        <div className="w-24 h-24 relative">
          <Image
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li - Mascotte ChinoisLingo"
            width={96}
            height={96}
            className="object-contain w-full h-full drop-shadow-xs"
          />
          <div className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#6200EE] text-white flex items-center justify-center shadow-md">
            <MailCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#212121] dark:text-[#F5F5F5]">
            Vérifie ta boîte mail 📬
          </h2>
          <p className="text-sm text-[#616161] dark:text-[#BDBDBD] leading-relaxed">
            Ton compte est créé ! Nous venons d’envoyer un lien d’activation à
          </p>
          <p className="text-sm font-bold text-[#6200EE] dark:text-[#03DAC5] break-all">{emailAConfirmer}</p>
          <p className="text-sm text-[#616161] dark:text-[#BDBDBD] leading-relaxed">
            Clique sur ce lien pour activer ton compte, puis connecte-toi.
          </p>
        </div>

        <div className="w-full p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0]/60 dark:border-[#2D2D2D] text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
          Tu ne le trouves pas ? Regarde dans tes <strong>courriers indésirables (spam)</strong> ou l’onglet <strong>Promotions</strong>.
        </div>

        {messageRenvoi && (
          <p className="text-xs font-medium text-[#1B5E20] dark:text-[#66BB6A]">{messageRenvoi}</p>
        )}

        <div className="w-full flex flex-col gap-2.5">
          <Link
            href="/connexion"
            className="w-full py-3.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-sm font-bold shadow-md shadow-[#6200EE]/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Aller à la connexion</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={renvoyerEmailConfirmation}
            disabled={renvoiEnCours || attenteRenvoi > 0}
            className="w-full py-3 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] text-sm font-semibold text-[#424242] dark:text-[#E0E0E0] hover:bg-[#FAFAFA] dark:hover:bg-white/5 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <RotateCw className={`w-4 h-4 ${renvoiEnCours ? 'animate-spin' : ''}`} />
            <span>
              {attenteRenvoi > 0 ? `Renvoyer l’e-mail (${attenteRenvoi} s)` : 'Renvoyer l’e-mail'}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setEmailAConfirmer(null);
            setMessageRenvoi(null);
          }}
          className="text-xs text-[#757575] hover:text-[#6200EE] dark:hover:text-[#03DAC5] transition-colors cursor-pointer"
        >
          Mauvaise adresse ? Corriger mon inscription
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative shrink-0">
          <Image
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li - Mascotte ChinoisLingo"
            width={80}
            height={80}
            className="object-contain w-full h-full drop-shadow-xs"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#212121] dark:text-[#F5F5F5]">
            Finalise ton inscription
          </h2>
          <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
            Sauvegarde tes progrès et commence ton aventure dès maintenant !
          </p>
        </div>
      </div>

      {/* Recap of choices */}
      <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
          💼 {state.profilLabel || 'Profil'}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
          🎯 {state.motivationLabel || 'Objectif'}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
          📶 {state.niveauLabel || 'Débutant'}
        </span>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
          {state.rappels ? '🔔 Rappels activés' : '🔕 Sans rappels'}
        </span>
      </div>

      {/* Error or Success alerts */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#DD2C00]/8 border border-[#DD2C00]/25 text-left">
          <AlertCircle className="w-4 h-4 text-[#DD2C00] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium text-[#DD2C00]">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-[#1B5E20]/8 border border-[#1B5E20]/25 text-left">
          <CheckCircle2 className="w-4 h-4 text-[#1B5E20] dark:text-[#66BB6A] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm font-medium text-[#1B5E20] dark:text-[#66BB6A]">
            {successMessage}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div>
          <label className="block text-xs font-bold text-[#424242] dark:text-[#BDBDBD] mb-1">
            Pseudo ou Prénom *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: Espoir"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-sm text-[#212121] dark:text-white placeholder-[#9E9E9E] focus:outline-hidden focus:border-[#6200EE] dark:focus:border-[#03DAC5] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#424242] dark:text-[#BDBDBD] mb-1">
            Adresse e-mail *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@email.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-sm text-[#212121] dark:text-white placeholder-[#9E9E9E] focus:outline-hidden focus:border-[#6200EE] dark:focus:border-[#03DAC5] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#424242] dark:text-[#BDBDBD] mb-1">
            Mot de passe *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder={CONSIGNE_MOT_DE_PASSE}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-sm text-[#212121] dark:text-white placeholder-[#9E9E9E] focus:outline-hidden focus:border-[#6200EE] dark:focus:border-[#03DAC5] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#424242] dark:hover:text-white cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#424242] dark:text-[#BDBDBD] mb-1">
            Confirmer le mot de passe *
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9E9E]" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              autoComplete="new-password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Répétez le mot de passe"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-sm text-[#212121] dark:text-white placeholder-[#9E9E9E] focus:outline-hidden focus:border-[#6200EE] dark:focus:border-[#03DAC5] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#424242] dark:hover:text-white cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-4 rounded-2xl bg-[#6200EE] hover:bg-[#5000CA] text-white font-bold text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50 btn-press flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Création en cours...</span>
          ) : (
            <>
              <span>Commencer mon aventure</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Déjà un compte */}
      <div className="text-center pt-1 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
        <p className="text-xs text-[#757575] dark:text-[#9E9E9E]">
          Vous avez déjà un compte ?{' '}
          <Link
            href="/connexion"
            className="font-bold text-[#6200EE] dark:text-[#03DAC5] hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
