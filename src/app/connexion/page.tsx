'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
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

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();
  const { signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // État du modal de réinitialisation de mot de passe
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);

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

    if (mode === 'signup') {
      if (!username.trim()) {
        setErrorMessage('Veuillez renseigner votre pseudo.');
        setIsSubmitting(false);
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
        setIsSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Les mots de passe ne correspondent pas.');
        setIsSubmitting(false);
        return;
      }

      const { error } = await signUpWithEmail(email, password, username, '', username);
      if (error) {
        setErrorMessage(error.message || "Une erreur s'est produite lors de l'inscription.");
      } else {
        setSuccessMessage('Compte créé avec succès ! Bienvenue.');
        setTimeout(() => {
          router.push('/tableau-de-bord');
        }, 1000);
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMessage(error.message || 'Identifiants incorrects.');
      } else {
        setSuccessMessage('Connexion réussie ! Heureux de vous revoir.');
        setTimeout(() => {
          router.push('/tableau-de-bord');
        }, 800);
      }
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
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/connexion`,
      });

      if (error) {
        setForgotError(error.message || "Impossible d'envoyer l'e-mail de réinitialisation.");
      } else {
        setForgotMessage('E-mail de réinitialisation envoyé ! Vérifiez votre boîte de réception.');
      }
    } catch {
      setForgotError("Une erreur inattendue est survenue.");
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center p-2.5 sm:p-6 lg:p-10 overflow-hidden bg-[#ECEFF8] dark:bg-[#111218]">
      
      {/* ================= ARRIÈRE-PLAN SUBTILEMENT ASSOMBRI AVEC CARACTÈRES CHINOIS VARIÉS ET PORTEURS DE SENS ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Pastel Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#6200EE]/09 dark:bg-[#6200EE]/18 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#03DAC5]/11 dark:bg-[#03DAC5]/18 blur-[150px]" />
        <div className="absolute top-[30%] right-[15%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-[#E91E63]/08 dark:bg-[#E91E63]/14 blur-[130px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-[#FFC107]/08 dark:bg-[#FFC107]/12 blur-[130px]" />

        {/* 1. 学 (Apprendre) - Coin Haut Gauche - Incliné */}
        <span className="font-hanzi text-[140px] sm:text-[230px] font-black text-[#6200EE]/[0.045] dark:text-white/[0.045] absolute -top-4 left-3 sm:left-6 blur-[1px] rotate-[-12deg]" title="学 (Apprendre)">
          学
        </span>

        {/* 2. 大 (Grand) - Haut Gauche Intermédiaire */}
        <span className="font-hanzi text-[90px] sm:text-[150px] font-black text-[#03DAC5]/[0.05] absolute top-14 sm:top-20 left-[20%] sm:left-[24%] blur-[1.5px] rotate-[8deg]" title="大 (Grand)">
          大
        </span>

        {/* 3. 龙 (Dragon / Excellence) - Coin Haut Droite - Incliné et Symétrique */}
        <span className="font-hanzi text-[130px] sm:text-[220px] font-black text-[#6200EE]/[0.042] dark:text-white/[0.042] absolute -top-4 right-3 sm:right-6 blur-[1px] rotate-[12deg]" title="龙 (Dragon)">
          龙
        </span>

        {/* 4. 富 (Richesse) - Haut Droite Intermédiaire */}
        <span className="font-hanzi text-[90px] sm:text-[150px] font-black text-[#FFC107]/[0.045] absolute top-14 sm:top-20 right-[20%] sm:right-[24%] blur-[1.5px] rotate-[-8deg]" title="富 (Richesse)">
          富
        </span>

        {/* 5. 强 (Fort) - Bas Gauche */}
        <span className="font-hanzi text-[130px] sm:text-[220px] font-black text-[#6200EE]/[0.04] absolute -bottom-6 left-[4%] sm:left-[8%] blur-[2px] rotate-[-6deg]" title="强 (Fort)">
          强
        </span>

        {/* 6. 恒 (Persévérance) - Centre Bas - Équilibré */}
        <span className="font-hanzi text-[100px] sm:text-[160px] font-black text-[#03DAC5]/[0.04] absolute -bottom-8 left-[46%] blur-[1.5px] rotate-[-4deg]" title="恒 (Persévérance)">
          恒
        </span>

        {/* 7. 财 (Fortune) - Bas Droite */}
        <span className="font-hanzi text-[110px] sm:text-[180px] font-black text-[#E91E63]/[0.04] absolute -bottom-8 right-3 sm:right-6 blur-[2px] rotate-[-8deg]" title="财 (Fortune)">
          财
        </span>

        {/* 8. 福 (Bonheur) - Centre Gauche - Compact */}
        <span className="font-hanzi text-[85px] sm:text-[140px] font-black text-[#03DAC5]/[0.04] absolute top-[44%] left-[-2%] blur-[2px] rotate-[10deg]" title="福 (Bonheur)">
          福
        </span>

        {/* 9. 智 (Sagesse) - Centre Droite - Compact */}
        <span className="font-hanzi text-[90px] sm:text-[150px] font-black text-[#6200EE]/[0.035] absolute top-[46%] right-[-2%] blur-[2px] rotate-[-10deg]" title="智 (Sagesse)">
          智
        </span>
      </div>

      {/* ================= CARTE CENTRALE SPLIT MODERNE ================= */}
      <div className="relative z-10 w-full max-w-md lg:max-w-4xl bg-white dark:bg-[#1E1E28] rounded-3xl sm:rounded-[36px] border border-[#E0E0E0] dark:border-[#2D2D3D] shadow-2xl shadow-[#6200EE]/08 dark:shadow-black/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 animate-fadeIn my-auto">
        
        {/* ================= GAUCHE / HAUT : VITRINE PÉDAGOGIQUE COMPLÈTE ================= */}
        {/* Sur mobile : visible en mode connexion pour afficher l'en-tête, masqué en mode création de compte pour que le formulaire tienne sur l'écran */}
        <div className={`lg:col-span-6 bg-gradient-to-br from-[#6200EE] via-[#3700B3] to-[#1E1E28] text-white p-4 sm:p-7 lg:p-10 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
          mode === 'signup' ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Subtle Background Glows */}
          <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-[#03DAC5]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-[#E91E63]/20 blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10 space-y-2 sm:space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-hanzi font-black text-base sm:text-xl text-white shadow-sm shrink-0">
                华
              </div>
              <div>
                <span className="font-display font-black text-lg sm:text-2xl text-white tracking-tight block leading-tight">
                  ChinoisLingo
                </span>
                <span className="text-[9.5px] sm:text-[11px] font-bold text-[#03DAC5] uppercase tracking-wider block">
                  « Le chinois devient facile »
                </span>
              </div>
            </div>

            <div className="pt-0.5 sm:pt-2">
              <h1 className="font-display font-black text-base sm:text-2xl lg:text-3xl text-white leading-snug">
                Maîtrisez le mandarin par immersion active.
              </h1>
              <p className="text-[10.5px] sm:text-xs text-white/80 mt-0.5 sm:mt-2 leading-relaxed">
                Apprenez avec des dialogues du quotidien, des flashcards intelligentes et des leçons vidéo interactives.
              </p>
            </div>
          </div>

          {/* 3 Core Highlights (Masqués sur mobile en mode connexion pour tenir sur un seul écran, affichés sur desktop) */}
          <div className="relative z-10 space-y-2 sm:space-y-2.5 my-3.5 sm:my-5 hidden lg:block">
            <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#03DAC5]/20 text-[#03DAC5] flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-white">Vocabulaire HSK & Flashcards 3D</h3>
                <p className="text-[10px] sm:text-[10.5px] text-white/70">Mémorisation durable par répétition espacée</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#E91E63]/25 text-[#FF80AB] flex items-center justify-center shrink-0">
                <Headphones className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-white">Écoute & Paroles Synchronisées</h3>
                <p className="text-[10px] sm:text-[10.5px] text-white/70">Chansons, dialogues et podcasts immersifs</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-white">Formations Vidéos Pratiques</h3>
                <p className="text-[10px] sm:text-[10.5px] text-[#03DAC5] font-semibold">Quotidien • Culture • Carrière • Business</p>
              </div>
            </div>
          </div>

          {/* Bottom Trust Note */}
          <div className="relative z-10 pt-2.5 border-t border-white/10 hidden lg:flex items-center justify-between text-[10.5px] sm:text-[11px] text-white/60">
            <span>Plateforme d’apprentissage</span>
            <span className="font-bold text-[#03DAC5]">100% Francophone</span>
          </div>
        </div>

        {/* ================= DROITE : FORMULAIRE PROPRE & ÉPURÉ ================= */}
        <div className="lg:col-span-6 p-4 sm:p-7 lg:p-10 flex flex-col justify-center bg-white dark:bg-[#1E1E28]">
          <div className="space-y-3 sm:space-y-5 w-full">
            
            {/* Header Mobile Exclusif en Mode Inscription */}
            {mode === 'signup' && (
              <div className="lg:hidden flex items-center justify-between pb-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D3D]/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-[#6200EE] text-white flex items-center justify-center font-hanzi font-black text-sm shadow-xs">
                    华
                  </div>
                  <div>
                    <span className="font-display font-black text-sm text-[#212121] dark:text-[#F5F5F5] block leading-tight">
                      ChinoisLingo
                    </span>
                    <span className="text-[8.5px] font-bold text-[#6200EE] dark:text-[#BB86FC] uppercase tracking-wider block">
                      « Le chinois devient facile »
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-[11px] font-bold text-[#6200EE] dark:text-[#BB86FC] hover:underline"
                >
                  Se connecter
                </button>
              </div>
            )}
            
            {/* Header Formulaire */}
            <div className="text-left space-y-0.5 sm:space-y-1">
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
                {mode === 'signin' ? 'Connexion' : 'Créer un compte'}
              </h2>
              <p className="text-[11px] sm:text-xs text-[#757575] dark:text-[#A0A0A0]">
                {mode === 'signin' 
                  ? 'Accédez à votre espace d’apprentissage ChinoisLingo.'
                  : 'Rejoignez ChinoisLingo pour maîtriser le mandarin.'}
              </p>
            </div>

            {/* Error or Success Alerts */}
            {errorMessage && (
              <div className="p-2.5 sm:p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#00897B] dark:text-[#03DAC5] text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Formulaire avec font-size 16px sur mobile pour éliminer le zoom iOS */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              
              {/* Champ Pseudo (uniquement en mode inscription) */}
              {mode === 'signup' && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-[10px] sm:text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
                    Pseudo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Espoir Chinois"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-[#FAFAFA] dark:bg-[#252634] text-[16px] sm:text-xs font-bold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* 1. Champ Adresse E-mail */}
              <div className="space-y-1">
                <label className="text-[10px] sm:text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
                  Adresse e-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-[#FAFAFA] dark:bg-[#252634] text-[16px] sm:text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
                  />
                </div>
              </div>

              {/* 2. Champ Mot de Passe */}
              <div className="space-y-1">
                <label className="text-[10px] sm:text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-[#FAFAFA] dark:bg-[#252634] text-[16px] sm:text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
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

              {/* Champ Confirmation du Mot de Passe (uniquement en mode inscription) */}
              {mode === 'signup' && (
                <div className="space-y-1 animate-fadeIn">
                  <label className="text-[10px] sm:text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider">
                    Confirmer le mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-[#FAFAFA] dark:bg-[#252634] text-[16px] sm:text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] focus:ring-2 focus:ring-[#6200EE]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121] dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                      title={showConfirmPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* 3. Bouton Se Connecter / Créer mon compte */}
              <div className="pt-1 sm:pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-3.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs sm:text-sm font-black shadow-md shadow-[#6200EE]/25 active:scale-95 transition-all btn-press flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Validation...' : mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Liens en bas : Mot de passe oublié & Créer un compte / Se connecter */}
            <div className="pt-3 border-t border-[#E0E0E0] dark:border-[#2D2D3D] flex items-center justify-between gap-2 text-[11px] sm:text-xs">
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setForgotError(null);
                  setForgotMessage(null);
                  setIsForgotModalOpen(true);
                }}
                className="font-bold text-[#757575] hover:text-[#E53935] dark:hover:text-[#FF5252] transition-colors cursor-pointer text-left"
              >
                Mot de passe oublié ?
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className="font-bold text-[#6200EE] dark:text-[#BB86FC] hover:underline transition-all cursor-pointer text-right"
              >
                {mode === 'signin' ? 'Créer un compte' : 'Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ÉPURÉ : MOT DE PASSE OUBLIÉ ================= */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#1E1E28] rounded-3xl border border-[#E0E0E0] dark:border-[#2D2D3D] shadow-2xl p-6 space-y-4 animate-slideUp">
            
            {/* Header Modal */}
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
                    Réinitialisez votre mot de passe par e-mail
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

            {/* Error / Success Alerts */}
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

            {/* Formulaire Mot de passe oublié */}
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
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D3D] bg-[#FAFAFA] dark:bg-[#252634] text-[16px] sm:text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] transition-colors"
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
