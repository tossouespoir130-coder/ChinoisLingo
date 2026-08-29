'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { signInWithEmail, signUpWithEmail } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage('Veuillez renseigner votre adresse e-mail.');
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      if (!username.trim() && !firstName.trim()) {
        setErrorMessage('Veuillez renseigner un pseudo.');
        setIsLoading(false);
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Les mots de passe ne correspondent pas.');
        setIsLoading(false);
        return;
      }
      const effectiveFirstName = firstName.trim() || username.trim();
      const effectiveUsername = username.trim() || `${effectiveFirstName} ${lastName.trim()}`.trim();

      const { error } = await signUpWithEmail(email, password, effectiveFirstName, lastName, effectiveUsername);
      if (error) {
        setErrorMessage(error.message || "Une erreur s'est produite lors de l'inscription.");
      } else {
        setSuccessMessage('Compte créé avec succès ! Bienvenue.');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } else {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setErrorMessage(error.message || "Identifiants invalides.");
      } else {
        setSuccessMessage('Connexion réussie ! Heureux de vous revoir.');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    }

    setIsLoading(false);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all btn-press"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>ChinoisLingo VIP</span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
            {mode === 'signin' ? 'Connexion à votre compte' : 'Créer votre compte'}
          </h2>
          <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
            {mode === 'signin'
              ? 'Retrouvez votre progression, vos mots enregistrés et vos leçons.'
              : 'Enregistrez vos mots, suivez vos séries et synchronisez vos appareils.'}
          </p>
        </div>

        {/* Messages */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[#00897B] dark:text-[#03DAC5] text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div className="space-y-2.5">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">Pseudo / Nom d’affichage *</label>
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-[#6200EE] dark:text-[#BB86FC] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Espoir Chinois"
                    className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">Prénom</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#757575] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Espoir"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">Nom</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#757575] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Chinois"
                      className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">Adresse e-mail</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
              />
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-1 animate-fadeIn">
              <label className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#252525] text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-black shadow-md shadow-[#6200EE]/25 transition-all btn-press flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLoading ? 'Chargement...' : mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center pt-2 border-t border-[#E0E0E0] dark:border-[#2D2D2D]">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] hover:underline"
          >
            {mode === 'signin' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
