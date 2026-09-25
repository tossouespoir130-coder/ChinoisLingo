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

export default function ReinitialisationMotDePassePage() {
  const router = useRouter();
  const supabase = createClient();
  const { updatePassword, user } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRecoveryActive, setIsRecoveryActive] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // 1. Vérifier si l'utilisateur est déjà en session de récupération
    const checkRecoveryState = async () => {
      // Écouter les événements d'authentification Supabase (PASSWORD_RECOVERY)
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY' || (session && session.user)) {
          setIsRecoveryActive(true);
        }
      });

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsRecoveryActive(true);
      }

      // Vérifier également si le hash de l'URL ou les paramètres contiennent une erreur ou un jeton
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        const search = window.location.search;
        const params = new URLSearchParams(search);

        if (hash.includes('error=') || params.has('error') || params.get('erreur') === 'invalide') {
          if (hash.includes('otp_expired') || search.includes('otp_expired')) {
            setErrorMessage('Ce lien de réinitialisation a expiré. Veuillez faire une nouvelle demande depuis la page de connexion.');
          } else {
            setErrorMessage('Ce lien de réinitialisation est invalide ou a déjà été utilisé. Veuillez faire une nouvelle demande.');
          }
        } else if (hash.includes('type=recovery') || hash.includes('access_token') || search.includes('code=')) {
          setIsRecoveryActive(true);
        }
      }

      setIsCheckingAuth(false);

      return () => {
        subscription.unsubscribe();
      };
    };

    checkRecoveryState();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!password) {
      setErrorMessage('Veuillez saisir votre nouveau mot de passe.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await updatePassword(password);

      if (error) {
        setErrorMessage(traduireErreurAuth(error, 'reinitialisation'));
        setIsSubmitting(false);
      } else {
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
    } catch (err: any) {
      setErrorMessage(traduireErreurAuth(err, 'reinitialisation'));
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

        {/* Formulaire */}
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 caractères minimum"
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
