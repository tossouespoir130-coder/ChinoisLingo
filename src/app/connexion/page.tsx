'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Headphones,
  Video,
  KeyRound,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';
import { traduireErreurAuth } from '@/lib/auth/authErrors';

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();
  const { signInWithEmail } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resterConnecte, setResterConnecte] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // État du modal de réinitialisation de mot de passe
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Détecter si l'utilisateur arrive via un lien de récupération de mot de passe
    const hash = window.location.hash;
    const search = window.location.search;
    if (hash.includes('type=recovery') || search.includes('type=recovery')) {
      // Conserver `?code=` (flux PKCE) autant que le fragment (flux implicite).
      router.push('/reinitialisation-mot-de-passe' + search + hash);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/reinitialisation-mot-de-passe');
      }
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('confirme') === '1') {
      supabase.auth.signOut();
      setSuccessMessage('Adresse e-mail confirmée avec succès ! Vous pouvez maintenant vous connecter à votre compte.');
    } else if (params.get('session') === 'indisponible') {
      setErrorMessage(
        'Vérification de session impossible pour le moment. Réessayez dans un instant.'
      );
    } else if (params.get('confirmation') === 'requise') {
      setErrorMessage(
        'Votre adresse e-mail n’est pas encore confirmée. Ouvrez le lien reçu par e-mail pour activer votre compte.'
      );
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage('Veuillez renseigner votre adresse e-mail.');
      setIsSubmitting(false);
      return;
    }

    const { error } = await signInWithEmail(email, password, resterConnecte);
    if (error) {
      setErrorMessage(traduireErreurAuth(error, 'connexion'));
    } else {
      setSuccessMessage('Connexion réussie ! Heureux de vous revoir.');
      setTimeout(() => {
        router.push('/tableau-de-bord');
      }, 600);
    }

    setIsSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError('Veuillez saisir votre adresse e-mail.');
      return;
    }

    setIsForgotSubmitting(true);
    setForgotError(null);
    setForgotMessage(null);

    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
        (typeof window !== 'undefined' ? window.location.origin : '');
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${siteUrl}/reinitialisation-mot-de-passe`,
      });

      if (error) {
        setForgotError(traduireErreurAuth(error, 'reinitialisation'));
      } else {
        // Même message que l'adresse existe ou non : ne pas révéler qui possède un compte.
        setForgotMessage(
          'Si un compte existe pour cette adresse, un lien de réinitialisation vient de lui être envoyé. Pensez à vérifier vos courriers indésirables.'
        );
      }
    } catch (err: unknown) {
      setForgotError(traduireErreurAuth(err, 'reinitialisation'));
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center p-2.5 sm:p-6 lg:p-10 overflow-hidden bg-[#ECEFF8] dark:bg-[#111218]">
      
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#6200EE]/09 dark:bg-[#6200EE]/18 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#03DAC5]/11 dark:bg-[#03DAC5]/18 blur-[150px]" />
        <div className="absolute top-[30%] right-[15%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-[#E91E63]/08 dark:bg-[#E91E63]/14 blur-[130px]" />
      </div>

      {/* Carte Centrale Split */}
      <div className="relative z-10 w-full max-w-md lg:max-w-4xl bg-white dark:bg-[#1E1E28] rounded-3xl sm:rounded-[36px] border border-[#E0E0E0] dark:border-[#2D2D3D] shadow-2xl shadow-[#6200EE]/08 dark:shadow-black/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fadeIn my-auto">
        
        {/* Volet Gauche : Vitrine Pédagogique */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#6200EE] via-[#3700B3] to-[#1E1E28] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-[#03DAC5]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-[#E91E63]/20 blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0 p-1.5">
                <Logo variant="icon" size="sm" href="" />
              </div>
              <div>
                <span className="font-display font-black text-xl text-white tracking-tight block leading-tight">
                  ChinoisLingo
                </span>
                <span className="text-[10px] font-bold text-[#03DAC5] uppercase tracking-wider block">
                  « Le chinois devient facile »
                </span>
              </div>
            </div>

            <div className="pt-2">
              <h1 className="font-display font-black text-xl sm:text-2xl text-white leading-snug">
                Heureux de vous revoir !
              </h1>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Reprenez vos histoires, dialogues et révisions de vocabulaire là où vous vous étiez arrêté.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="relative z-10 space-y-2.5 my-6 hidden lg:block">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-[#03DAC5]/20 text-[#03DAC5] flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-white">Vocabulaire HSK & Flashcards 3D</h3>
                <p className="text-[10.5px] text-white/70">Mémorisation fluide et répétition espacée</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-[#E91E63]/25 text-[#FF80AB] flex items-center justify-center shrink-0">
                <Headphones className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-white">Écoute & Paroles Synchronisées</h3>
                <p className="text-[10.5px] text-white/70">Chansons, dialogues et podcasts immersifs</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-white">Formations Vidéos Pratiques</h3>
                <p className="text-[10.5px] text-[#03DAC5] font-semibold">Quotidien • Carrière • Business</p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Note */}
          <div className="relative z-10 pt-3 border-t border-white/10 hidden lg:flex items-center justify-between text-xs text-white/60">
            <span>Plateforme d’apprentissage</span>
            <span className="font-bold text-[#03DAC5]">100% Francophone</span>
          </div>
        </div>

        {/* Volet Droit : Formulaire de Connexion */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-[#1E1E28]">
          <div className="space-y-4 w-full">
            {/* Header Formulaire */}
            <div className="text-left space-y-1">
              <h2 className="font-display font-black text-2xl text-[#212121] dark:text-[#F5F5F5]">
                Se connecter
              </h2>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                Entrez vos identifiants pour accéder à votre tableau de bord.
              </p>
            </div>

            {/* Error or Success Alerts */}
            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#00897B] dark:text-[#03DAC5] text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Adresse E-mail */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
                  Adresse e-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-[#FAFAFA] dark:bg-[#252634] text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
                  />
                </div>
              </div>

              {/* Mot de Passe */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-[#FAFAFA] dark:bg-[#252634] text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121] dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                    title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* « Rester connecté » */}
              <label className="flex items-center gap-2.5 w-fit py-0.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={resterConnecte}
                  onChange={(e) => setResterConnecte(e.target.checked)}
                  className="w-4 h-4 rounded accent-[#6200EE] cursor-pointer"
                />
                <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5]">
                  Rester connecté
                </span>
                <span className="text-[10.5px] text-[#757575] dark:text-[#A0A0A0]">
                  sur cet appareil
                </span>
              </label>

              {/* Bouton Se Connecter */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-sm font-black shadow-md shadow-[#6200EE]/25 active:scale-95 transition-all btn-press flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Connexion en cours...' : 'Se connecter'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Bas de page : Mot de passe oublié & Redirection vers Création de compte */}
            <div className="pt-4 border-t border-[#E0E0E0] dark:border-[#2D2D3D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotError(null);
                  setForgotMessage(null);
                  setIsForgotModalOpen(true);
                }}
                className="font-semibold text-[#757575] hover:text-[#E53935] dark:hover:text-[#FF5252] transition-colors cursor-pointer py-1"
              >
                Mot de passe oublié ?
              </button>

              <div className="text-center sm:text-right flex items-center justify-center sm:justify-end gap-1.5 flex-wrap">
                <span className="text-[#757575] dark:text-[#9E9E9E]">Pas encore de compte ?</span>
                <Link
                  href="/onboarding"
                  className="font-bold text-[#6200EE] dark:text-[#03DAC5] hover:underline whitespace-nowrap"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Mot de passe oublié */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#1E1E28] rounded-3xl border border-[#E0E0E0] dark:border-[#2D2D3D] shadow-2xl p-6 space-y-4 animate-slideUp">
            
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0] dark:border-[#2D2D3D]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#212121] dark:text-[#F5F5F5]">
                    Mot de passe oublié
                  </h3>
                  <p className="text-[10.5px] text-[#757575] dark:text-[#A0A0A0]">
                    Recevez un lien de réinitialisation par e-mail
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#757575] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotMessage && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#00897B] dark:text-[#03DAC5] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{forgotMessage}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
                  Votre adresse e-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    autoComplete="email"
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-[#FAFAFA] dark:bg-[#252634] text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-[#E0E0E0] dark:border-[#2D2D3D] text-xs font-bold text-[#757575] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isForgotSubmitting}
                  className="flex-1 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-xs transition-all btn-press"
                >
                  {isForgotSubmitting ? 'Envoi...' : 'Envoyer le lien'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
