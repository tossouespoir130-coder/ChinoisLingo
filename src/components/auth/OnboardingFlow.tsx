'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight, 
  Briefcase, 
  Camera, 
  GraduationCap, 
  Globe, 
  Telescope,
  Plane,
  Palmtree,
  TrendingUp,
  Heart,
  Sparkles,
  Bell,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import confetti from 'canvas-confetti';

interface OnboardingFlowProps {
  onSwitchToSignIn: () => void;
}

export function OnboardingFlow({ onSwitchToSignIn }: OnboardingFlowProps) {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  // État des étapes : 1 (Profil) -> 2 (Objectif) -> 3 (Niveau) -> 4 (Rappels) -> 5 (Inscription)
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Réponses du questionnaire
  const [profil, setProfil] = useState<string>('');
  const [objectif, setObjectif] = useState<string>('');
  const [niveau, setNiveau] = useState<string>('');
  const [showLevelFeedback, setShowLevelFeedback] = useState<boolean>(false);
  const [rappels, setRappels] = useState<boolean>(true);

  // Champs de création de compte
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal aide niveau
  const [showLevelGuide, setShowLevelGuide] = useState(false);

  // États de soumission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Options Étape 1 : Profil
  const profilOptions = [
    {
      id: 'salarie',
      label: 'Professionnel(le) salarié(e)',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-700 dark:text-amber-300 shrink-0 shadow-xs">
          <Briefcase className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'freelance',
      label: 'Freelance',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-300 shrink-0 shadow-xs">
          <Camera className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'etudiant',
      label: 'Étudiant(e) à l’université',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0 shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'lyceen',
      label: 'Collégien / Lycéen',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/40 flex items-center justify-center text-pink-600 dark:text-pink-300 shrink-0 shadow-xs">
          <Globe className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'autre',
      label: 'Autre',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0 shadow-xs">
          <Telescope className="w-5 h-5" />
        </div>
      ),
    },
  ];

  // Options Étape 2 : Pourquoi souhaites-tu apprendre ?
  const objectifOptions = [
    {
      id: 'etudes',
      label: 'Étudier à l’étranger',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950/40 flex items-center justify-center text-cyan-600 dark:text-cyan-300 shrink-0 shadow-xs">
          <Plane className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'voyage',
      label: 'Voyager',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-300 shrink-0 shadow-xs">
          <Palmtree className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'travail',
      label: 'Pour le travail',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-300 shrink-0 shadow-xs">
          <TrendingUp className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'passion',
      label: 'Intérêt personnel',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-300 shrink-0 shadow-xs">
          <Heart className="w-5 h-5" />
        </div>
      ),
    },
    {
      id: 'autre',
      label: 'Autre',
      icon: (
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shrink-0 shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
      ),
    },
  ];

  // Options Étape 3 : Niveau de chinois
  const niveauOptions = [
    {
      id: 'debutant',
      label: 'Je débute complètement',
      bars: 1,
      feedback:
        'Super ! C’est le moment idéal pour commencer ! Nous allons démarrer pas à pas avec les bases, la prononciation et les premiers mots essentiels !',
    },
    {
      id: 'intermediaire_bas',
      label: 'Je peux tenir une petite conversation',
      bars: 2,
      feedback:
        'Excellent ! Tu as déjà de bonnes bases ! Commençons au niveau 2-3 pour consolider ton vocabulaire et booster ta confiance à l’oral !',
    },
    {
      id: 'intermediaire_avance',
      label: 'Je me débrouille en conversation quotidienne',
      bars: 3,
      feedback:
        'Super ! Tu te débrouilles déjà très bien en chinois dans la vie de tous les jours ! Commençons au niveau 5 pour explorer ensemble des sujets plus avancés !',
    },
  ];

  // Sélection d'un profil
  const handleSelectProfil = (val: string) => {
    setProfil(val);
    setTimeout(() => {
      setStep(2);
    }, 180);
  };

  // Sélection d'un objectif
  const handleSelectObjectif = (val: string) => {
    setObjectif(val);
    setTimeout(() => {
      setStep(3);
    }, 180);
  };

  // Sélection d'un niveau
  const handleSelectNiveau = (val: string) => {
    setNiveau(val);
    setShowLevelFeedback(true);
  };

  // Passage aux rappels après le feedback de niveau
  const handleConfirmLevel = () => {
    setShowLevelFeedback(false);
    setStep(4);
  };

  // Choix des rappels
  const handleChooseRappels = (accept: boolean) => {
    setRappels(accept);
    setStep(5);
  };

  // Retour à l'étape précédente
  const handlePrevStep = () => {
    setErrorMessage(null);
    if (step === 3 && showLevelFeedback) {
      setShowLevelFeedback(false);
      return;
    }
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5);
    }
  };

  // Soumission finale de création de compte
  const handleFinalSubmit = async (e: React.FormEvent) => {
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
          onboarding_profil: profil || 'Professionnel(le) salarié(e)',
          onboarding_objectif: objectif || 'Pour le travail',
          onboarding_niveau: niveau || 'Je débute complètement',
          onboarding_rappels: rappels,
        }
      );

      if (error) {
        setErrorMessage(error.message || "Une erreur s'est produite lors de l'inscription.");
      } else if (besoinConfirmation) {
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
        router.push('/tableau-de-bord');
      }
    } catch {
      setErrorMessage('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedNiveauObj = niveauOptions.find((n) => n.label === niveau);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-center min-h-[90vh] py-6 px-4 sm:px-6">
      {/* Top Header : Back Arrow + Pill Progress Bars */}
      <div className="flex items-center gap-3 mb-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#424242] dark:text-[#E0E0E0] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
            aria-label="Étape précédente"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10 h-10 shrink-0" />
        )}

        {/* 4 Progress Pills */}
        <div className="flex-1 flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => {
            const isDoneOrCurrent = step >= i;
            return (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  isDoneOrCurrent
                    ? 'bg-[#FFA000] dark:bg-[#FFB300]'
                    : 'bg-[#ECEFF1] dark:bg-[#2C3437]'
                }`}
              />
            );
          })}
        </div>

        <div className="w-10 h-10 shrink-0 flex items-center justify-end">
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-xs font-semibold text-[#6200EE] dark:text-[#03DAC5] hover:underline whitespace-nowrap"
          >
            Connexion
          </button>
        </div>
      </div>

      {/* ================= ÉTAPE 1 : PROFIL ================= */}
      {step === 1 && (
        <div className="animate-fade-in flex flex-col gap-6">
          {/* Mascot + Speech Bubble */}
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 relative shrink-0">
              <Image
                src="/images/onboarding/mascot-normal.png"
                alt="Mascotte ChinoisLingo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
              <div className="absolute top-4 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
              <p className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] leading-snug">
                Quel profil te correspond le mieux ?
              </p>
            </div>
          </div>

          {/* Options Cards */}
          <div className="flex flex-col gap-3">
            {profilOptions.map((opt) => {
              const isSelected = profil === opt.label;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectProfil(opt.label)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border transition-all duration-200 btn-press ${
                    isSelected
                      ? 'bg-[#FFF8E1] dark:bg-[#FFA000]/15 border-[#FFA000] dark:border-[#FFA000] shadow-sm ring-1 ring-[#FFA000]'
                      : 'bg-white dark:bg-[#1E1E1E] border-[#E0E0E0]/80 dark:border-[#2D2D2D] hover:border-[#FFA000]/60 dark:hover:border-[#FFA000]/60 hover:shadow-xs'
                  }`}
                >
                  {opt.icon}
                  <span className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] flex-1">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ÉTAPE 2 : OBJECTIF ================= */}
      {step === 2 && (
        <div className="animate-fade-in flex flex-col gap-6">
          {/* Mascot + Speech Bubble */}
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 relative shrink-0">
              <Image
                src="/images/onboarding/mascot-normal.png"
                alt="Mascotte ChinoisLingo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
              <div className="absolute top-4 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
              <p className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] leading-snug">
                Pourquoi souhaites-tu apprendre le chinois ?
              </p>
            </div>
          </div>

          {/* Options Cards */}
          <div className="flex flex-col gap-3">
            {objectifOptions.map((opt) => {
              const isSelected = objectif === opt.label;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectObjectif(opt.label)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border transition-all duration-200 btn-press ${
                    isSelected
                      ? 'bg-[#FFF8E1] dark:bg-[#FFA000]/15 border-[#FFA000] dark:border-[#FFA000] shadow-sm ring-1 ring-[#FFA000]'
                      : 'bg-white dark:bg-[#1E1E1E] border-[#E0E0E0]/80 dark:border-[#2D2D2D] hover:border-[#FFA000]/60 dark:hover:border-[#FFA000]/60 hover:shadow-xs'
                  }`}
                >
                  {opt.icon}
                  <span className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] flex-1">
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= ÉTAPE 3 : NIVEAU ACTUEL ================= */}
      {step === 3 && (
        <div className="animate-fade-in flex flex-col gap-6">
          {!showLevelFeedback ? (
            <>
              {/* Mascot + Speech Bubble */}
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 relative shrink-0">
                  <Image
                    src="/images/onboarding/mascot-normal.png"
                    alt="Mascotte ChinoisLingo"
                    width={56}
                    height={56}
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
                  <div className="absolute top-4 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
                  <p className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] leading-snug">
                    Quel est ton niveau de chinois ?
                  </p>
                </div>
              </div>

              {/* Level Cards */}
              <div className="flex flex-col gap-3">
                {niveauOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectNiveau(opt.label)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] hover:border-[#FFA000]/60 dark:hover:border-[#FFA000]/60 hover:shadow-xs transition-all duration-200 btn-press"
                  >
                    {/* Signal bars indicator */}
                    <div className="flex items-end gap-1 w-8 h-8 justify-center shrink-0">
                      <div
                        className={`w-1.5 h-3 rounded-full ${
                          opt.bars >= 1 ? 'bg-[#FFA000]' : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                        }`}
                      />
                      <div
                        className={`w-1.5 h-5 rounded-full ${
                          opt.bars >= 2 ? 'bg-[#FFA000]' : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                        }`}
                      />
                      <div
                        className={`w-1.5 h-7 rounded-full ${
                          opt.bars >= 3 ? 'bg-[#FFA000]' : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                        }`}
                      />
                    </div>
                    <span className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] flex-1">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Bottom Helper Banner */}
              <div className="relative pt-6">
                <div className="absolute top-0 left-4 w-12 h-12 z-10">
                  <Image
                    src="/images/onboarding/mascot-search.png"
                    alt="Aide au niveau"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowLevelGuide(true)}
                  className="w-full flex items-center justify-between p-4 pl-16 rounded-2xl bg-[#E1F5FE] dark:bg-[#0288D1]/15 border border-[#B3E5FC] dark:border-[#0288D1]/30 hover:bg-[#B3E5FC]/50 dark:hover:bg-[#0288D1]/25 transition-all text-left"
                >
                  <span className="text-sm font-semibold text-[#0277BD] dark:text-[#4FC3F7]">
                    Aide-moi à connaître mon niveau
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#0288D1] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </>
          ) : (
            /* Selected Feedback View (Screenshot 4) */
            <div className="animate-fade-in flex flex-col gap-6">
              {/* Question header */}
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 relative shrink-0">
                  <Image
                    src="/images/onboarding/mascot-normal.png"
                    alt="Mascotte ChinoisLingo"
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </div>
                <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
                  <p className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5]">
                    Quel est ton niveau de chinois ?
                  </p>
                </div>
              </div>

              {/* Highlighted selected card */}
              <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#FFF8E1] dark:bg-[#FFA000]/15 border border-[#FFA000] dark:border-[#FFA000] shadow-sm">
                <div className="flex items-end gap-1 w-8 h-8 justify-center shrink-0">
                  <div
                    className={`w-1.5 h-3 rounded-full ${
                      (selectedNiveauObj?.bars || 1) >= 1
                        ? 'bg-[#FFA000]'
                        : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                    }`}
                  />
                  <div
                    className={`w-1.5 h-5 rounded-full ${
                      (selectedNiveauObj?.bars || 1) >= 2
                        ? 'bg-[#FFA000]'
                        : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                    }`}
                  />
                  <div
                    className={`w-1.5 h-7 rounded-full ${
                      (selectedNiveauObj?.bars || 1) >= 3
                        ? 'bg-[#FFA000]'
                        : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                    }`}
                  />
                </div>
                <span className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] flex-1">
                  {niveau}
                </span>
              </div>

              {/* Mascot Feedback speech bubble */}
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 relative shrink-0">
                  <Image
                    src="/images/onboarding/mascot-sparkle.png"
                    alt="Mascotte motivée"
                    width={56}
                    height={56}
                    className="object-contain"
                  />
                </div>
                <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
                  <div className="absolute top-4 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
                  <p className="text-sm sm:text-base font-medium text-[#212121] dark:text-[#F5F5F5] leading-relaxed">
                    {selectedNiveauObj?.feedback ||
                      'Super ! Commençons ensemble pour explorer le chinois étape par étape !'}
                  </p>
                </div>
              </div>

              {/* Continue button */}
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleConfirmLevel}
                  className="w-full py-4 rounded-2xl bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold text-base shadow-md hover:shadow-lg transition-all btn-press"
                >
                  Continuer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= ÉTAPE 4 : RAPPELS (NOTIFICATIONS) ================= */}
      {step === 4 && (
        <div className="animate-fade-in flex flex-col items-center text-center gap-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#212121] dark:text-[#F5F5F5] max-w-sm">
            Veux-tu que je te rappelle de continuer à étudier ?
          </h2>

          {/* Central Mascot with Bell */}
          <div className="w-40 h-40 relative my-2 animate-bounce-subtle">
            <Image
              src="/images/onboarding/mascot-bell.png"
              alt="Rappels d'étude"
              width={160}
              height={160}
              className="object-contain"
              priority
            />
          </div>

          {/* 2 Benefit Cards */}
          <div className="w-full flex flex-col gap-3 text-left">
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center text-orange-600 dark:text-orange-300 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-[#424242] dark:text-[#E0E0E0] leading-snug">
                Les personnes qui activent les rappels ont un taux d’atteinte des objectifs supérieur de{' '}
                <strong className="text-[#E65100] dark:text-[#FFB74D] font-bold">51%</strong> à celui des autres.
              </p>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-300 shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium text-[#424242] dark:text-[#E0E0E0] leading-snug">
                Rassure-toi : je ne te rappellerai que lorsque tu en auras vraiment besoin, sans jamais te déranger.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="w-full flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleChooseRappels(true)}
              className="w-full py-4 rounded-2xl bg-[#FFA000] hover:bg-[#FF8F00] text-white font-bold text-base shadow-md hover:shadow-lg transition-all btn-press"
            >
              Oui ! Je vais continuer à apprendre !
            </button>

            <button
              type="button"
              onClick={() => handleChooseRappels(false)}
              className="text-sm font-medium text-[#757575] dark:text-[#9E9E9E] hover:text-[#424242] dark:hover:text-white py-2 transition-colors"
            >
              Pas maintenant, je risque d’oublier d’étudier
            </button>
          </div>
        </div>
      )}

      {/* ================= ÉTAPE 5 : CRÉATION DE COMPTE ================= */}
      {step === 5 && (
        <div className="animate-fade-in flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 relative shrink-0">
              <Image
                src="/images/onboarding/mascot-sparkle.png"
                alt="Mascotte prête"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#212121] dark:text-[#F5F5F5]">
                Finalise ton inscription
              </h2>
              <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0]">
                Sauvegarde tes progrès et commence ton apprentissage !
              </p>
            </div>
          </div>

          {/* Récapitulatif compact */}
          <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
              💼 {profil || 'Profil'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
              🎯 {objectif || 'Objectif'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
              📶 {niveau || 'Débutant'}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333] text-[#424242] dark:text-[#E0E0E0]">
              {rappels ? '🔔 Rappels activés' : '🔕 Sans rappels'}
            </span>
          </div>

          {/* Messages d'erreur ou de succès */}
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

          {/* Formulaire de création de compte */}
          <form onSubmit={handleFinalSubmit} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#424242] dark:text-[#BDBDBD] mb-1">
                Pseudo ou Prénom
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
                Adresse e-mail
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
                Mot de passe
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#424242] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#424242] dark:text-[#BDBDBD] mb-1">
                Confirmer le mot de passe
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9E9E9E] hover:text-[#424242] dark:hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-4 rounded-2xl bg-[#6200EE] hover:bg-[#5000CA] text-white font-bold text-base shadow-md hover:shadow-lg transition-all disabled:opacity-50 btn-press flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Création en cours...</span>
              ) : (
                <>
                  <span>Créer mon compte & Commencer</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Déjà inscrit */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#757575] dark:text-[#9E9E9E]">
              Déjà inscrit ?{' '}
              <button
                type="button"
                onClick={onSwitchToSignIn}
                className="font-bold text-[#6200EE] dark:text-[#03DAC5] hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Modal Aide Niveau */}
      {showLevelGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 max-w-md w-full border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E1F5FE] dark:bg-[#0288D1]/20 flex items-center justify-center text-[#0288D1]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#212121] dark:text-white">
                Quel est votre niveau ?
              </h3>
            </div>

            <div className="space-y-3 text-sm text-[#424242] dark:text-[#E0E0E0]">
              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333]">
                <p className="font-bold text-[#FFA000]">1. Débutant complet (HSK 1)</p>
                <p className="text-xs text-[#757575] dark:text-[#9E9E9E] mt-0.5">
                  Vous ne connaissez aucun mot ou seulement « Nǐ hǎo ». Idéal pour apprendre les sons, tons et bases.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333]">
                <p className="font-bold text-[#0288D1]">2. Petite conversation (HSK 2 - 3)</p>
                <p className="text-xs text-[#757575] dark:text-[#9E9E9E] mt-0.5">
                  Vous savez vous présenter, commander au restaurant, compter et poser des questions simples.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333]">
                <p className="font-bold text-[#6200EE] dark:text-[#03DAC5]">3. Conversation quotidienne (HSK 4 - 6)</p>
                <p className="text-xs text-[#757575] dark:text-[#9E9E9E] mt-0.5">
                  Vous exprimez vos opinions avec aisance, suivez des vidéos et négociez en chinois.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLevelGuide(false)}
              className="w-full py-3 rounded-xl bg-[#6200EE] text-white font-bold text-sm shadow-sm hover:bg-[#5000CA] transition-colors"
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
