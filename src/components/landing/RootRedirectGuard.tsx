'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export function RootRedirectGuard() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user && (user.email_confirmed_at || profile)) {
      router.replace('/tableau-de-bord');
    }
  }, [user, profile, isLoading, router]);

  return null;
}
