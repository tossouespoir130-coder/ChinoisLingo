import { createBrowserClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { Database } from './types';
import { COOKIE_SESSION_EPHEMERE, adapterDuree } from './session-ephemere';

function sessionEphemere(): boolean {
  return document.cookie
    .split(';')
    .some((c) => c.trim().startsWith(`${COOKIE_SESSION_EPHEMERE}=`));
}

/**
 * « Rester connecté » : à appeler AVANT la connexion, pour que les cookies de
 * session créés par Supabase en héritent. Voir `session-ephemere.ts`.
 */
export function definirSessionEphemere(ephemere: boolean): void {
  if (typeof document === 'undefined') return;
  const securise = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = ephemere
    ? `${COOKIE_SESSION_EPHEMERE}=1; Path=/; SameSite=Lax${securise}`
    : `${COOKIE_SESSION_EPHEMERE}=; Path=/; Max-Age=0; SameSite=Lax${securise}`;
}

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    // Mêmes cookies que le comportement par défaut de @supabase/ssr, à une
    // différence près : leur durée suit le choix « Rester connecté ».
    cookies: {
      getAll() {
        if (typeof document === 'undefined') return [];
        return parseCookieHeader(document.cookie).map(({ name, value }) => ({
          name,
          value: value ?? '',
        }));
      },
      setAll(cookies) {
        if (typeof document === 'undefined') return;
        const ephemere = sessionEphemere();
        cookies.forEach(({ name, value, options }) => {
          document.cookie = serializeCookieHeader(name, value, adapterDuree(options, ephemere));
        });
      },
    },
  });
}
