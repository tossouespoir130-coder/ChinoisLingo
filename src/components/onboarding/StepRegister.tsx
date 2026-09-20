'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import confetti from 'canvas-confetti';
import { OnboardingState } from './types';

interface StepRegisterProps {
  state: OnboardingState;
}

export function StepRegister({ state }: StepRegisterProps) {
  const router = useRouter();
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
    if (!password || password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
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
        setErrorMessage(error.message || "Une erreur s'est produite lors de l'inscription.");
      } else {
        // Envoi automatique de l'email de bienvenue via Resend
        fetch('/api/emails/bienvenue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            nom: username,
            profil: state.profilLabel || 'Apprenant',
            objectif: state.motivationLabel || 'Pour le travail',
            niveau: state.niveauLabel || 'Je débute complètement',
          }),
        }).catch((err) => console.error('[onboarding] Erreur envoi email bienvenue', err));

        if (besoinConfirmation) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
          setSuccessMessage(
            'Compte créé avec succès ! Un e-mail de confirmation vient de vous être envoyé. Cliquez sur le lien pour activer votre accès.'
          );
        } else {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
          router.push('/tableau-de-bord?bienvenue=1');
        }
      }
    } catch {
      setErrorMessage('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
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
