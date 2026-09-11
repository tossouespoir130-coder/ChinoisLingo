import type { CookieOptions } from '@supabase/ssr';

/**
 * « Rester connecté » — durée de vie des cookies de session Supabase.
 *
 * @supabase/ssr écrit par défaut des cookies valables 400 jours : la session
 * survit à la fermeture du navigateur. Quand l'apprenant ne coche PAS
 * « Rester connecté », ce cookie témoin est posé ; tant qu'il existe, les
 * cookies de session sont écrits sans date d'expiration et le navigateur les
 * efface à sa fermeture. Le témoin est lui-même un cookie de session : il
 * disparaît avec eux.
 *
 * Partagé par le client navigateur et par le proxy serveur, qui rafraîchit
 * lui aussi les jetons : sans ce second relais, le premier rafraîchissement
 * côté serveur rendrait la session permanente.
 */
export const COOKIE_SESSION_EPHEMERE = 'chinoislingo_session_ephemere';

/** Retire l'expiration d'un cookie de session — sauf s'il s'agit d'une suppression. */
export function adapterDuree(options: CookieOptions, ephemere: boolean): CookieOptions {
  if (!ephemere) return options;
  if (options.maxAge !== undefined && options.maxAge <= 0) return options;

  const copie: CookieOptions = { ...options };
  delete copie.maxAge;
  delete copie.expires;
  return copie;
}
