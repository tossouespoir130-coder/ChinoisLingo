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
  ) => Promise<{ error: Error | null }>;
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
        data: {
          username: cleanUsername,
          pseudo: cleanUsername,
          first_name: cleanFirstName,
          last_name: cleanLastName,
          full_name: computedFullName,
        },
      },
    });

    if (!error && data?.user) {
      // Mettre à jour directement et immédiatement le profil dans profiles
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

    return { error: error ? new Error(error.message) : null };
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
