'use client';

import { useCallback } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

/**
 * Appels aux routes /api/admin, avec le jeton de session en en-tête.
 *
 * Les routes vérifient le rôle de leur côté : ce module ne fait que
 * transporter le jeton, il n'accorde aucun droit par lui-même.
 */
export function useApiAdmin() {
  const { session } = useAuth();
  const jeton = session?.access_token;

  const appeler = useCallback(
    async <T,>(chemin: string, options?: RequestInit): Promise<T> => {
      if (!jeton) throw new Error('Session expirée. Reconnectez-vous.');

      const reponse = await fetch(chemin, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jeton}`,
          ...(options?.headers ?? {}),
        },
      });

      const donnees = await reponse.json().catch(() => ({}));
      if (!reponse.ok) {
        throw new Error(donnees.erreur ?? `Erreur ${reponse.status}`);
      }
      return donnees as T;
    },
    [jeton]
  );

  return { appeler, pret: Boolean(jeton) };
}

/** Titre de section, commun aux trois pages d'administration. */
export function formaterDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}
