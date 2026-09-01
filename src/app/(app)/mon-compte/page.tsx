'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { createPortal } from 'react-dom';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  CreditCard, 
  Sliders, 
  Shield, 
  Check, 
  ArrowLeft, 
  Sparkles,
  Volume2,
  Languages,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Shuffle,
  Layers,
  X,
  Camera,
  Save,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  Crop,
  LogOut
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockCurrentUser } from '@/lib/mock/dashboard';
import { useTheme } from '@/context/ThemeContext';
import { usePreferences } from '@/context/PreferencesContext';
import { ImageCropModal } from '@/components/ui/ImageCropModal';
import { useAuth } from '@/lib/auth/AuthContext';
import { updateProfileSettings } from '@/lib/services/profileService';
import { GrilleTarifs } from '@/components/subscription/GrilleTarifs';
import { useAbonnement } from '@/lib/payments/useAbonnement';
import { formaterEcheance } from '@/lib/payments/subscription';
import { BONUS_PREMIER_PAIEMENT_JOURS } from '@/lib/payments/plans';
import { resumeOffreGratuite } from '@/lib/payments/acces';

function MonCompteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();

  // Directly consume and update the Global Preferences
  const {
    showPinyin,
    setShowPinyin,
    showFrenchTranslation,
    setShowFrenchTranslation,
    toneColoring,
    setToneColoring,
    audioSpeed,
    setAudioSpeed,
    autoPlayAudio,
    setAutoPlayAudio,
    cardsPerSession,
    setCardsPerSession,
    reviewOrder,
    setReviewOrder,
    cardFrontFace,
    setCardFrontFace,
    showExampleSentence,
    setShowExampleSentence,
    dailyGoalMinutes,
    setDailyGoalMinutes,
    dailyReminder,
    setDailyReminder,
    publicLeaderboard,
    setPublicLeaderboard,
    userAvatar,
    setUserAvatar,
    userName,
    setUserName,
  } = usePreferences();

  const PROFILE_STORAGE_KEY = 'chinoislingo_user_profile_data';

  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'preferences'>('profile');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [isUnsubscribeModalOpen, setIsUnsubscribeModalOpen] = useState(false);
  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawOriginalPhoto, setRawOriginalPhoto] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');

  // Crop & Adjust states
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [rawImageToCrop, setRawImageToCrop] = useState<string>('');
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);

  // Local state for user profile
  const [profileData, setProfileData] = useState({
    displayName: profile?.full_name || profile?.first_name || 'Espoir Chinois',
    firstName: profile?.first_name || 'Espoir',
    lastName: profile?.last_name || 'Chinois',
    email: profile?.email || user?.email || 'contact@chinoislingo.com',
    avatarUrl: profile?.avatar_url || userAvatar || '/espoir-chinois.jpg',
    bio: 'Passionné par l’apprentissage du mandarin et les opportunités commerciales avec la Chine.',
    country: 'France',
    city: 'Paris',
    targetLevel: 'HSK 3',
    timezone: 'Europe/Paris (UTC+1)',
  });

  const [tempProfileData, setTempProfileData] = useState({ ...profileData });

  // Update profile data when Supabase profile is loaded
  useEffect(() => {
    if (profile) {
      const updated = {
        displayName: profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Espoir Chinois',
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || user?.email || 'contact@chinoislingo.com',
        avatarUrl: profile.avatar_url || userAvatar || '/espoir-chinois.jpg',
        bio: 'Passionné par l’apprentissage du mandarin et les opportunités commerciales avec la Chine.',
        country: 'France',
        city: 'Paris',
        targetLevel: 'HSK 3',
        timezone: 'Europe/Paris (UTC+1)',
      };
      setProfileData(updated);
      setTempProfileData(updated);
    }
  }, [profile, user, userAvatar]);

  useEffect(() => {
    setMounted(true);
    // Load persisted profile data if available
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile && !profile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData(parsed);
        setTempProfileData(parsed);
      }
      const savedRaw = localStorage.getItem('chinoislingo_user_raw_photo');
      if (savedRaw) {
        setRawOriginalPhoto(savedRaw);
      }
    } catch {
      // ignore
    }
  }, [profile]);

  // Synchronize when global avatar changes
  useEffect(() => {
    if (userAvatar) {
      setProfileData((prev) => ({ ...prev, avatarUrl: userAvatar }));
    }
  }, [userAvatar]);

  useEffect(() => {
    if (tabParam === 'subscription' || tabParam === 'preferences' || tabParam === 'profile') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Abonnement : état réel du profil + ouverture du portail de facturation
  const { etat: etatAbonnement, ouvrirPortail } = useAbonnement();
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Avatars de Personnages / Membres de la Communauté
  const communityAvatars = [
    '/espoir-chinois.jpg',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/connexion');
  };

  const handleSavePreferences = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleOpenEdit = () => {
    setTempProfileData({ ...profileData });
    setIsEditModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const rawData = reader.result as string;
          setRawOriginalPhoto(rawData);
          try {
            localStorage.setItem('chinoislingo_user_raw_photo', rawData);
          } catch {
            // ignore
          }
          setRawImageToCrop(rawData);
          setIsCropModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = ''; // Reset input to allow re-selecting the same file
    }
  };

  const handleCropComplete = (croppedDataUrl: string) => {
    setTempProfileData((prev) => ({ ...prev, avatarUrl: croppedDataUrl }));
    setIsCropModalOpen(false);
  };

  const handleReCropCurrentAvatar = () => {
    const photoToCrop = rawOriginalPhoto || tempProfileData.avatarUrl;
    if (photoToCrop) {
      setRawImageToCrop(photoToCrop);
      setIsCropModalOpen(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = { ...tempProfileData };
    setProfileData(updatedData);
    
    // Persist to localStorage
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedData));
    } catch {
      // ignore storage errors
    }

    if (updatedData.avatarUrl) {
      setUserAvatar(updatedData.avatarUrl);
    }
    if (updatedData.displayName) {
      setUserName(updatedData.displayName);
    }

    if (user) {
      await updateProfileSettings({
        username: updatedData.displayName,
        full_name: updatedData.displayName,
        first_name: updatedData.firstName,
        last_name: updatedData.lastName,
        bio: updatedData.bio,
        city: updatedData.city,
        country: updatedData.country,
        avatar_url: updatedData.avatarUrl,
        target_level: updatedData.targetLevel,
      });
    }

    setIsEditModalOpen(false);
    setProfileSaveSuccess(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6200EE', '#03DAC5', '#FFD700'],
      });
    } catch {}

    setTimeout(() => setProfileSaveSuccess(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 animate-fadeIn pb-12">
      {/* Save Success Toast */}
      {profileSaveSuccess && (
        <div className="p-4 rounded-2xl bg-[#00897B] text-white flex items-center justify-between text-xs font-bold shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Votre profil a été mis à jour avec succès !</span>
          </div>
          <button onClick={() => setProfileSaveSuccess(false)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
            Mon Compte
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5">
            Gérez votre profil, votre abonnement et vos réglages d&apos;apprentissage.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-full bg-[#FAFAFA] dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('profile')}
            type="button"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all btn-press ${
              activeTab === 'profile'
                ? 'bg-[#6200EE] text-white shadow-xs'
                : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
            }`}
          >
            Profil
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            type="button"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all btn-press ${
              activeTab === 'subscription'
                ? 'bg-[#6200EE] text-white shadow-xs'
                : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
            }`}
          >
            Abonnement
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            type="button"
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all btn-press ${
              activeTab === 'preferences'
                ? 'bg-[#6200EE] text-white shadow-xs'
                : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
            }`}
          >
            Préférences
          </button>
        </div>
      </div>

      {/* TAB 1: PROFIL */}
      {activeTab === 'profile' && (
        <div className="space-y-6 animate-fadeIn">
          {/* User Profile Card */}
          <div className="nixtio-card p-5 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D]">
            <div className="flex items-center gap-3.5 sm:gap-5 min-w-0 flex-1">
              {/* Profile Avatar */}
              <div 
                onClick={handleOpenEdit}
                className="relative group cursor-pointer shrink-0"
                title="Cliquer pour modifier votre profil"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={userAvatar || profileData.avatarUrl}
                  alt={profileData.displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover ring-2 ring-[#6200EE]/30 group-hover:ring-[#6200EE] shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 rounded-full bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white backdrop-blur-[1px]">
                  <Camera className="w-5 h-5 mb-0.5" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider">Modifier</span>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-display font-black text-base sm:text-xl text-[#212121] dark:text-[#F5F5F5] truncate">
                  {profileData.displayName}
                </h3>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0] font-mono truncate">{profileData.email}</p>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                  <span
                    className={`inline-block px-2.5 sm:px-3 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-extrabold uppercase tracking-wider border ${
                      etatAbonnement.estAdmin || etatAbonnement.estAbonne
                        ? 'bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border-[#6200EE]/20'
                        : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] dark:text-[#A0A0A0] border-[#E0E0E0] dark:border-[#333333]'
                    }`}
                  >
                    {etatAbonnement.estAdmin
                      ? 'Administrateur · accès complet'
                      : etatAbonnement.estAbonne
                        ? `${etatAbonnement.plan?.nom ?? 'Pass'} actif`
                        : 'Compte gratuit'}
                  </span>
                  <span className="text-[10.5px] sm:text-[11px] text-[#757575] dark:text-[#A0A0A0]">📍 {profileData.city}, {profileData.country}</span>
                  <span className="text-[10.5px] sm:text-[11px] text-[#757575] dark:text-[#A0A0A0]">🎯 {profileData.targetLevel}</span>
                </div>
                {profileData.bio && (
                  <p className="text-[11px] sm:text-xs text-[#757575] dark:text-[#A0A0A0] mt-1.5 sm:mt-2 italic max-w-lg line-clamp-2 sm:line-clamp-none">
                    « {profileData.bio} »
                  </p>
                )}
              </div>
            </div>

            {/* Single Clear Action Button: Modifier le profil (Toujours aligné à droite) */}
            <div className="w-full md:w-auto flex justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
              <button
                onClick={handleOpenEdit}
                type="button"
                className="w-full md:w-auto px-5 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold transition-all btn-press shrink-0 shadow-md shadow-[#6200EE]/25 text-center"
              >
                Modifier le profil
              </button>
            </div>
          </div>

          {/* Quick Account Stats (Matching the 3 Dashboard Performance Metrics) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <div className="nixtio-card p-3 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center sm:text-left flex flex-col justify-between">
              <span className="text-[9px] sm:text-xs font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider line-clamp-1">Mots Maîtrisés</span>
              <p className="font-display font-black text-base sm:text-2xl text-[#212121] dark:text-[#F5F5F5] my-0.5 sm:mt-1">440 <span className="text-[10px] sm:text-xs font-semibold text-[#757575] dark:text-[#A0A0A0]">mots</span></p>
              <span className="text-[9px] sm:text-[11px] text-[#00897B] dark:text-[#03DAC5] font-bold line-clamp-1">+18 cette sem.</span>
            </div>
            <div className="nixtio-card p-3 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center sm:text-left flex flex-col justify-between">
              <span className="text-[9px] sm:text-xs font-bold text-[#E91E63] dark:text-[#F06292] uppercase tracking-wider line-clamp-1">Temps d&apos;étude</span>
              <p className="font-display font-black text-base sm:text-2xl text-[#E91E63] dark:text-[#F06292] my-0.5 sm:mt-1">42h</p>
              <span className="text-[9px] sm:text-[11px] text-[#757575] dark:text-[#A0A0A0] line-clamp-1">+6h pratique</span>
            </div>
            <div className="nixtio-card p-3 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] text-center sm:text-left flex flex-col justify-between">
              <span className="text-[9px] sm:text-xs font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider line-clamp-1">Rétention</span>
              <p className="font-display font-black text-base sm:text-2xl text-[#00897B] dark:text-[#03DAC5] my-0.5 sm:mt-1">92.4%</p>
              <span className="text-[9px] sm:text-[11px] text-[#00897B] dark:text-[#03DAC5] font-bold line-clamp-1">Excellent score</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABONNEMENT */}
      {activeTab === 'subscription' && (
        <div className="space-y-6 animate-fadeIn">
          {/* ── Statut réel de l'abonnement ─────────────────────────── */}
          {etatAbonnement.estAbonne ? (
            <div className="nixtio-card p-6 bg-gradient-to-r from-[#6200EE] to-[#3700B3] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-[#6200EE]/25">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold text-[#03DAC5] tracking-wider block">
                  Abonnement actif
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl mt-0.5">
                  {etatAbonnement.plan?.nom ?? 'Pass ChinoisLingo'} ✨
                </h3>
                <p className="text-xs text-white/85 mt-1">
                  Accès complet jusqu’au {formaterEcheance(etatAbonnement.finPeriode)}
                  {etatAbonnement.fournisseur === 'stripe' && (
                    <> • {etatAbonnement.resiliationProgrammee ? 'résiliation programmée' : 'renouvellement automatique par carte'}</>
                  )}
                  {etatAbonnement.fournisseur === 'moneroo' && (
                    <> • réglé par Mobile Money, sans reconduction automatique</>
                  )}
                </p>
              </div>
              <div className="px-4 py-2 rounded-full bg-white/15 border border-white/20 text-xs font-bold whitespace-nowrap self-start sm:self-auto">
                Catalogue HSK 1 à 6
              </div>
            </div>
          ) : (
            <div className="nixtio-card p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-extrabold text-[#00897B] dark:text-[#03DAC5] tracking-wider block">
                    Compte gratuit
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl mt-0.5 text-[#212121] dark:text-[#F5F5F5]">
                    Votre accès gratuit est illimité dans le temps
                  </h3>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1">
                    Passez à l’abonnement pour ouvrir tout le catalogue HSK 1 à 6.
                  </p>
                </div>
                {etatAbonnement.bonusDisponible && BONUS_PREMIER_PAIEMENT_JOURS > 0 && (
                  <div className="px-4 py-2 rounded-full bg-[#E91E63]/10 border border-[#E91E63]/25 text-xs font-extrabold text-[#E91E63] dark:text-[#F06292] whitespace-nowrap self-start sm:self-auto">
                    ✨ {BONUS_PREMIER_PAIEMENT_JOURS} jours offerts
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E0E0E0] dark:border-[#2D2D2D]">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0]">
                  Compris dans votre accès gratuit
                </p>
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  {resumeOffreGratuite().map((ligne) => (
                    <li key={ligne} className="text-xs text-[#212121] dark:text-[#F5F5F5] flex items-start gap-1.5">
                      <span className="text-[#00897B] dark:text-[#03DAC5] shrink-0">✓</span>
                      <span className="leading-snug">{ligne}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Le rôle administrateur ouvre le catalogue indépendamment de la
              facturation : on le dit explicitement, sinon la carte « Compte
              gratuit » ci-dessus laisserait croire à un accès restreint. */}
          {etatAbonnement.estAdmin && (
            <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-[#03DAC5]/10 border border-[#03DAC5]/30">
              <Shield className="w-4 h-4 text-[#00897B] dark:text-[#03DAC5] shrink-0 mt-0.5" />
              <p className="text-xs text-[#00897B] dark:text-[#03DAC5] font-semibold leading-relaxed">
                Votre compte est administrateur : vous accédez à l&apos;intégralité du
                catalogue en permanence, sans abonnement ni date d&apos;expiration.
                Les formules ci-dessous ne concernent que la facturation.
              </p>
            </div>
          )}

          {/* Confirmation d'un retour de paiement annulé */}
          {searchParams.get('paiement') === 'annule' && (
            <div className="p-3.5 rounded-2xl bg-[#FFC107]/10 border border-[#FFC107]/30">
              <p className="text-xs font-medium text-[#B78103] dark:text-[#FFC107]">
                Paiement interrompu — aucun montant n’a été prélevé. Vous pouvez reprendre quand vous le souhaitez.
              </p>
            </div>
          )}

          {/* ── Les trois formules, dans les deux devises ────────────── */}
          <GrilleTarifs paysProfil={profile?.country} />

          {/* ── Moyens de paiement & gestion du compte ──────────────── */}
          <div className="nixtio-card p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-4 shadow-xs">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
                <Smartphone className="w-4 h-4 text-[#6200EE]" />
                <span>Moyens de paiement acceptés</span>
              </div>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1">
                Réglez en toute sécurité via votre moyen de paiement privilégié :
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Mobile Money — via Moneroo, en FCFA */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#00897B]/10 text-[#00897B] dark:text-[#03DAC5] flex items-center justify-center font-bold text-sm">
                    📱
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5]">
                      Mobile Money
                    </h5>
                    <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0]">
                      Paiement en FCFA, sans reconduction
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['MTN MoMo', 'Moov Money', 'Orange Money', 'Wave', 'T-Money'].map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[10px] font-bold text-[#212121] dark:text-[#F5F5F5]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Carte bancaire — via Stripe, en euros */}
              <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center font-bold text-sm">
                    💳
                  </div>
                  <div>
                    <h5 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5]">
                      Carte bancaire
                    </h5>
                    <span className="text-[10px] text-[#757575] dark:text-[#A0A0A0]">
                      Paiement en euros, renouvellement automatique
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['Visa', 'Mastercard'].map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[10px] font-bold text-[#212121] dark:text-[#F5F5F5]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E0E0E0] dark:border-[#2D2D2D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#757575] dark:text-[#A0A0A0]">
                <Shield className="w-4 h-4 text-[#00897B] shrink-0" />
                <span>Paiements chiffrés — aucune coordonnée bancaire n’est stockée par ChinoisLingo.</span>
              </div>

              {/* La résiliation n'a de sens que pour un abonnement récurrent : un
                  pass Mobile Money s'arrête de lui-même à son échéance. */}
              {etatAbonnement.fournisseur === 'stripe' && etatAbonnement.estAbonne && (
                <button
                  type="button"
                  onClick={() => setIsUnsubscribeModalOpen(true)}
                  className="self-end sm:self-auto text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline transition-all cursor-pointer whitespace-nowrap"
                >
                  Gérer ou résilier
                </button>
              )}
            </div>

            {etatAbonnement.fournisseur === 'moneroo' && etatAbonnement.estAbonne && (
              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] leading-relaxed pt-1">
                Votre pass Mobile Money est un paiement ponctuel : rien ne sera prélevé
                automatiquement. Il vous suffira de reprendre une formule ci-dessus avant le{' '}
                <strong className="text-[#212121] dark:text-white">
                  {formaterEcheance(etatAbonnement.finPeriode)}
                </strong>{' '}
                pour ne pas interrompre votre progression.
              </p>
            )}
          </div>
        </div>
      )}


      {/* TAB 3: PRÉFÉRENCES */}
      {activeTab === 'preferences' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
              Ajustez vos options de lecture, de Flashcards 3D et vos objectifs d&apos;apprentissage.
            </p>
            <button
              onClick={handleSavePreferences}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span>{savedSuccess ? 'Enregistré & Actif !' : 'Sauvegarder'}</span>
            </button>
          </div>

          {/* 1. Flashcards 3D & Répétition Espacée */}
          <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <span>Flashcards 3D & Répétition Espacée</span>
            </div>

            <div className="space-y-3 pt-2">
              {/* Quantité de cartes par session */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Nombre de cartes à réviser par session
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Quantité de vocabulaire présentée lors de chaque entraînement (par défaut 20).
                  </span>
                </div>

                <select
                  value={cardsPerSession}
                  onChange={(e) => setCardsPerSession(e.target.value as any)}
                  className="px-3.5 py-1.5 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] outline-none cursor-pointer btn-press"
                >
                  <option value="5">5 cartes / session</option>
                  <option value="10">10 cartes</option>
                  <option value="15">15 cartes</option>
                  <option value="20">20 cartes (Recommandé)</option>
                  <option value="30">30 cartes</option>
                  <option value="40">40 cartes / session</option>
                  <option value="50">50 cartes / session</option>
                  <option value="70">70 cartes / session</option>
                  <option value="100">100 cartes / session (Intensif)</option>
                  <option value="all">Tout le paquet (Toutes les cartes)</option>
                </select>
              </div>

              {/* Ordre de révision (Aléatoire vs Séquentiel) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Ordre d&apos;apparition des cartes
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Le mélange aléatoire renforce l&apos;ancrage mémoriel à long terme.
                  </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D]">
                  <button
                    type="button"
                    onClick={() => setReviewOrder('random')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all btn-press ${
                      reviewOrder === 'random'
                        ? 'bg-[#6200EE] text-white shadow-xs'
                        : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                    }`}
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Aléatoire (Défaut)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewOrder('sequential')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all btn-press ${
                      reviewOrder === 'sequential'
                        ? 'bg-[#6200EE] text-white shadow-xs'
                        : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                    }`}
                  >
                    <span>Séquentiel</span>
                  </button>
                </div>
              </div>

              {/* Sens d'apprentissage (Chinois -> Français, Français -> Chinois, ou Aléatoire) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Sens d&apos;apprentissage (Face avant)
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Alternez pour stimuler à la fois la reconnaissance visuelle et la restitution.
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D]">
                  <button
                    type="button"
                    onClick={() => setCardFrontFace('random')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all btn-press ${
                      cardFrontFace === 'random'
                        ? 'bg-[#6200EE] text-white shadow-xs'
                        : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                    }`}
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Aléatoire (Défaut)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardFrontFace('hanzi')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all btn-press ${
                      cardFrontFace === 'hanzi'
                        ? 'bg-[#6200EE] text-white shadow-xs'
                        : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                    }`}
                  >
                    Chinois ➔ Français
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardFrontFace('french')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all btn-press ${
                      cardFrontFace === 'french'
                        ? 'bg-[#6200EE] text-white shadow-xs'
                        : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                    }`}
                  >
                    Français ➔ Chinois
                  </button>
                </div>
              </div>

              {/* Afficher phrase d'exemple en contexte */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Afficher la phrase d&apos;exemple au verso
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Inclut une mise en situation concrète et soignée pour chaque mot révisé.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showExampleSentence}
                  onChange={(e) => setShowExampleSentence(e.target.checked)}
                  className="w-5 h-5 accent-[#6200EE] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 2. Audio & Synthèse Vocale */}
          <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              <div className="w-8 h-8 rounded-xl bg-[#03DAC5]/15 text-[#00897B] dark:text-[#03DAC5] flex items-center justify-center">
                <Volume2 className="w-4 h-4" />
              </div>
              <span>Audio & Synthèse Vocale Chinoise</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Vitesse de prononciation audio
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Ajustez le débit pour distinguer les 4 hauteurs de tons.
                  </span>
                </div>

                <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D]">
                  {[
                    { value: '0.75', label: '0.75x' },
                    { value: '1.0', label: '1.0x (Normal)' },
                    { value: '1.25', label: '1.25x' },
                    { value: '1.5', label: '1.5x (Rapide)' },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setAudioSpeed(s.value as any)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all btn-press ${
                        audioSpeed === s.value
                          ? 'bg-[#6200EE] text-white shadow-xs'
                          : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Lecture audio automatique (Flashcards 3D)
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Prononce le caractère dès qu&apos;une carte est affichée.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoPlayAudio}
                  onChange={(e) => setAutoPlayAudio(e.target.checked)}
                  className="w-5 h-5 accent-[#6200EE] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. Pédagogie, Pinyin & Traduction */}
          <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
                <Languages className="w-4 h-4" />
              </div>
              <span>Pédagogie, Pinyin & Lecture</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between py-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Afficher le Pinyin par défaut
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Aide phonétique avec accents de tons au-dessus des Hanzi (partout dans l&apos;application).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showPinyin}
                  onChange={(e) => setShowPinyin(e.target.checked)}
                  className="w-5 h-5 accent-[#6200EE] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Afficher la Traduction Française
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Traduction sous les phrases lors de l&apos;écoute et de la lecture.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={showFrenchTranslation}
                  onChange={(e) => setShowFrenchTranslation(e.target.checked)}
                  className="w-5 h-5 accent-[#6200EE] cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Coloration des 4 tons
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Associe une couleur distincte à chaque tonalité.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={toneColoring}
                  onChange={(e) => setToneColoring(e.target.checked)}
                  className="w-5 h-5 accent-[#6200EE] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 4. Objectif Quotidien & Notifications */}
          <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              <div className="w-8 h-8 rounded-xl bg-[#E91E63]/15 text-[#E91E63] dark:text-[#F06292] flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <span>Objectifs & Rappels de Révision</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Objectif d&apos;apprentissage quotidien
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Temps recommandé par jour pour maintenir la série active 🔥.
                  </span>
                </div>

                <select
                  value={dailyGoalMinutes}
                  onChange={(e) => setDailyGoalMinutes(e.target.value)}
                  className="px-3.5 py-1.5 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] outline-none cursor-pointer btn-press"
                >
                  <option value="10">10 minutes / jour (Léger)</option>
                  <option value="15">15 minutes / jour</option>
                  <option value="20">20 minutes / jour (Recommandé • Défaut)</option>
                  <option value="30">30 minutes / jour (Intensif)</option>
                  <option value="60">1 heure / jour (Immersion Totale)</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Rappel quotidien de répétition espacée
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Notification discrète pour ne pas casser votre série.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={dailyReminder}
                  onChange={(e) => setDailyReminder(e.target.checked)}
                  className="w-5 h-5 accent-[#6200EE] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 5. Thème & Vie Privée */}
          <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
              <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <span>Thème & Classement</span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between py-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Apparence Visuelle
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Mode Actuel : {theme === 'dark' ? 'Mode Sombre 🌙' : 'Mode Clair ☀️'}
                  </span>
                </div>
                <button
                  onClick={toggleTheme}
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] btn-press"
                >
                  {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>Basculer</span>
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block">
                    Participer au Score des Pairs
                  </span>
                  <span className="text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    Affiche votre prénom et progression dans le classement.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={publicLeaderboard}
                  onChange={(e) => setPublicLeaderboard(e.target.checked)}
                  className="w-5 h-5 accent-[#6200EE] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation & Account Actions (Toujours sur la même ligne permanente sur mobile, iPad et Web) */}
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 pt-4 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D]">
        <Link
          href="/tableau-de-bord"
          className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-[#757575] hover:text-[#212121] dark:text-[#A0A0A0] dark:hover:text-white transition-colors truncate"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <span className="truncate">Retour au Tableau de bord</span>
        </Link>

        <button
          onClick={handleSignOut}
          type="button"
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 text-[11px] sm:text-xs font-bold transition-all btn-press inline-flex items-center gap-1.5 sm:gap-2 cursor-pointer group shadow-2xs shrink-0"
          title="Se déconnecter de votre compte"
        >
          <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Se déconnecter</span>
        </button>
      </div>

      {/* EDIT PROFILE MODAL (PORTAL) */}
      {mounted && isEditModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex items-center justify-between">
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-[#212121] dark:text-[#F5F5F5]">
                  Modifier mon Profil
                </h3>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                  Personnalisez vos informations visibles et vos objectifs d&apos;apprentissage.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                type="button"
                className="w-9 h-9 rounded-full bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] hover:text-[#212121] dark:hover:text-white flex items-center justify-center btn-press"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
              {/* SECTION PHOTO DE PROFIL & AVATARS DE LA COMMUNAUTÉ */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/80 dark:border-[#333333] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tempProfileData.avatarUrl}
                      alt="Aperçu Avatar"
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover ring-3 ring-[#6200EE] shadow-md shrink-0"
                    />
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-[#212121] dark:text-[#F5F5F5] block">
                        Photo de Profil
                      </span>
                      <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                        Choisissez un avatar de profil ou importez votre propre photo.
                      </p>
                    </div>
                  </div>

                  {/* Bouton Unique Modifier avec Dropdown Menu */}
                  <div className="relative">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
                      className="px-4 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold transition-all btn-press inline-flex items-center gap-1.5 shadow-sm shadow-[#6200EE]/25"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Modifier</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isAvatarMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Options */}
                    {isAvatarMenuOpen && (
                      <div className="absolute right-0 mt-2 w-52 p-1.5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xl z-30 space-y-1 animate-scaleUp">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAvatarMenuOpen(false);
                            fileInputRef.current?.click();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#6200EE]/10 hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors flex items-center gap-2"
                        >
                          <Upload className="w-3.5 h-3.5 text-[#6200EE]" />
                          <span>Importer une photo</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAvatarMenuOpen(false);
                            handleReCropCurrentAvatar();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#6200EE]/10 hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors flex items-center gap-2"
                        >
                          <Crop className="w-3.5 h-3.5 text-[#03DAC5]" />
                          <span>Ajuster le cadrage</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Galerie des Avatars de Personnages */}
                <div className="space-y-2 pt-2 border-t border-[#E0E0E0]/70 dark:border-[#333333]">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] block">
                    Avatars de la Communauté
                  </span>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {communityAvatars.map((avUrl, idx) => {
                      const isSelected = tempProfileData.avatarUrl === avUrl;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setTempProfileData({ ...tempProfileData, avatarUrl: avUrl })}
                          className={`relative aspect-square rounded-full overflow-hidden border-2 transition-all btn-press ${
                            isSelected
                              ? 'border-[#6200EE] ring-3 ring-[#6200EE]/30 scale-105 shadow-sm'
                              : 'border-[#E0E0E0] dark:border-[#333333] hover:border-[#6200EE]/50 opacity-75 hover:opacity-100 hover:scale-102'
                          }`}
                          title={`Avatar ${idx + 1}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={avUrl}
                            alt={`Avatar ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#6200EE]/30 flex items-center justify-center text-white">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Name & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block mb-1.5">
                    Nom d’affichage / Pseudo
                  </label>
                  <input
                    type="text"
                    required
                    value={tempProfileData.displayName}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, displayName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block mb-1.5">
                    Adresse Email
                  </label>
                  <input
                    type="email"
                    required
                    value={tempProfileData.email}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block mb-1.5">
                  Bio / Objectif personnel
                </label>
                <textarea
                  rows={2}
                  value={tempProfileData.bio}
                  onChange={(e) => setTempProfileData({ ...tempProfileData, bio: e.target.value })}
                  placeholder="Présentez-vous en quelques mots..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                />
              </div>

              {/* Country, City & Target HSK */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block mb-1.5">
                    Pays
                  </label>
                  <input
                    type="text"
                    value={tempProfileData.country}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block mb-1.5">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={tempProfileData.city}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block mb-1.5">
                    Niveau Cible
                  </label>
                  <select
                    value={tempProfileData.targetLevel}
                    onChange={(e) => setTempProfileData({ ...tempProfileData, targetLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                  >
                    <option value="HSK 1 · Débutant (A1)">HSK 1 · Débutant (A1)</option>
                    <option value="HSK 2 · Pratique (A2)">HSK 2 · Pratique (A2)</option>
                    <option value="HSK 3 · Intermédiaire (B1)">HSK 3 · Intermédiaire (B1)</option>
                    <option value="HSK 4 · Courant (B2)">HSK 4 · Courant (B2)</option>
                    <option value="HSK 5 · Avancé (C1)">HSK 5 · Avancé (C1)</option>
                    <option value="HSK 6 · Maîtrisé (C2)">HSK 6 · Maîtrisé (C2)</option>
                  </select>
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] block mb-1.5">
                  Fuseau Horaire
                </label>
                <select
                  value={tempProfileData.timezone}
                  onChange={(e) => setTempProfileData({ ...tempProfileData, timezone: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                >
                  <option value="UTC+01:00 (Afrique de l’Ouest / Paris)">UTC+01:00 (Afrique de l’Ouest / Paris)</option>
                  <option value="UTC+00:00 (GMT / Abidjan / Ouagadougou)">UTC+00:00 (GMT / Abidjan / Ouagadougou)</option>
                  <option value="UTC+02:00 (Afrique Centrale / Caire)">UTC+02:00 (Afrique Centrale / Caire)</option>
                  <option value="UTC+08:00 (Pékin / Shanghai)">UTC+08:00 (Pékin / Shanghai)</option>
                </select>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#757575] hover:text-[#212121] dark:hover:text-white transition-all btn-press"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* MODAL DE CADRAGE & RÉAJUSTEMENT DE LA PHOTO DE PROFIL */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageSrc={rawImageToCrop}
        onClose={() => setIsCropModalOpen(false)}
        onCropComplete={handleCropComplete}
        onSelectNewImage={() => fileInputRef.current?.click()}
      />

      {/* MODAL DE CONFIRMATION DE DÉSABONNEMENT */}
      {mounted && isUnsubscribeModalOpen && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 animate-scaleUp text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0] dark:border-[#2D2D2D]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold text-sm">
                  ⚠️
                </div>
                <h3 className="font-display font-bold text-base text-[#212121] dark:text-[#F5F5F5]">
                  Gestion du désabonnement
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUnsubscribeModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#757575] hover:text-[#212121] dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {unsubscribeSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#00897B] dark:text-[#03DAC5] text-xs font-bold space-y-2">
                <p>✓ Ouverture de votre espace de facturation sécurisé…</p>
                <p className="font-normal text-[11px]">Vous y gérez votre carte, vos factures et votre résiliation.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
                  Votre abonnement par carte est géré dans l&apos;espace de facturation sécurisé
                  de notre prestataire de paiement. Vous y trouverez vos factures, votre moyen
                  de paiement et la résiliation.
                </p>
                <ul className="space-y-1.5 text-xs text-[#757575] dark:text-[#A0A0A0] bg-[#FAFAFA] dark:bg-[#252525] p-3 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D]">
                  <li>• Vos accès restent actifs jusqu&apos;à la fin de votre période payée.</li>
                  <li>• Aucun prélèvement supplémentaire après la résiliation.</li>
                  <li>• Vous pouvez reprendre un abonnement à tout moment.</li>
                </ul>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUnsubscribeModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#757575] hover:text-[#212121] dark:hover:text-white transition-all btn-press"
                  >
                    Conserver mon pass
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUnsubscribeSuccess(true);
                      ouvrirPortail();
                    }}
                    className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-all btn-press cursor-pointer"
                  >
                    Ouvrir l&apos;espace de facturation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default function MonComptePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#757575]">Chargement du compte...</div>}>
      <MonCompteContent />
    </Suspense>
  );
}
