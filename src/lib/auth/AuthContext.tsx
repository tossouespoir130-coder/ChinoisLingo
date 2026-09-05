'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/supabase/types';
import { fetchUserProfile, recordDailyActivity } from '@/lib/services/profileService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  signInWithEmail: (email: string, password?: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    username?: string
  ) => Promise<{ error: Error | null; besoinConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const refreshProfile = async () => {
    const p = await fetchUserProfile();
    if (p) setProfile(p);
  };

  useEffect(() => {
    // 1. Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshProfile();
        recordDailyActivity(1);
      }
      setIsLoading(false);
    });

    // 2. Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        refreshProfile();
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithEmail = async (email: string, password?: string) => {
    if (password) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error ? new Error(error.message) : null };
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/tableau-de-bord` : undefined,
        },
      });
      return { error: error ? new Error(error.message) : null };
    }
  };

  const signUpWithEmail = async (
    email: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    username?: string
  ) => {
    if (!password) {
      return signInWithEmail(email);
    }

    const cleanFirstName = firstName?.trim() || splitEmail(email);
    const cleanLastName = lastName?.trim() || '';
    const computedFullName = cleanLastName ? `${cleanFirstName} ${cleanLastName}` : cleanFirstName;
    const cleanUsername = username?.trim() || computedFullName;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Lien de confirmation : l'apprenant atterrit sur la page de connexion
        // avec un indicateur, plutôt que sur une page protégée.
        emailRedirectTo:
          typeof window !== 'undefined'
            ? `${window.location.origin}/connexion?confirme=1`
            : undefined,
        data: {
          username: cleanUsername,
          pseudo: cleanUsername,
          first_name: cleanFirstName,
          last_name: cleanLastName,
          full_name: computedFullName,
        },
      },
    });

    if (error) return { error: new Error(error.message) };

    /**
     * Supabase ne renvoie PAS de session quand la confirmation par e-mail est
     * exigée : c'est le seul signal fiable pour distinguer les deux cas.
     * Sans ce test, l'application connectait l'apprenant immédiatement, même
     * lorsque son adresse n'avait jamais été vérifiée.
     */
    const besoinConfirmation = !data.session;

    if (data.user && data.session) {
      // Session ouverte : on complète le profil depuis le navigateur.
      // Quand la confirmation est exigée, cette écriture est impossible
      // (aucune session, RLS bloque) — c'est le déclencheur `handle_new_user`
      // qui crée alors la ligne côté serveur.
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: data.user.email || email,
        username: cleanUsername,
        full_name: computedFullName,
        first_name: cleanFirstName,
        last_name: cleanLastName,
      });

      await refreshProfile();
    }

    return { error: null, besoinConfirmation };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  function splitEmail(email: string) {
    return email.split('@')[0];
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
