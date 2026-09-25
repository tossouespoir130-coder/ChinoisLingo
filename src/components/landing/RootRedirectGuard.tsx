'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export function RootRedirectGuard() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const hash = window.location.hash || '';
    const search = window.location.search || '';

    // Si l'URL contient un jeton de récupération de mot de passe, rediriger vers la page dédiée
    if (hash.includes('type=recovery') || search.includes('type=recovery')) {
      router.replace('/reinitialisation-mot-de-passe' + search + hash);
      return;
    }

    if (!isLoading && user && (user.email_confirmed_at || profile)) {
      router.replace('/tableau-de-bord');
    }
  }, [user, profile, isLoading, router]);

  return null;
}

