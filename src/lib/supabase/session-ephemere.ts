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
 *
 * Expiration par inactivité : un navigateur qui ne se ferme jamais vraiment
 * (Chrome sur Mac reste ouvert dans le Dock, ou restaure les onglets) garde
 * aussi les cookies de session. Le témoin contient donc l'heure de la
 * dernière activité ; au-delà de `INACTIVITE_MAX_EPHEMERE_MS`, le proxy ferme
 * la session. Une session « Rester connecté » n'est pas concernée.
 */
export const COOKIE_SESSION_EPHEMERE = 'chinoislingo_session_ephemere';

/** Inactivité au-delà de laquelle une session non mémorisée est fermée. */
export const INACTIVITE_MAX_EPHEMERE_MS = 12 * 60 * 60 * 1000;

/** Écart minimal entre deux mises à jour du témoin (évite un cookie à chaque requête). */
export const RAFRAICHISSEMENT_TEMOIN_MS = 5 * 60 * 1000;

/**
 * Heure de dernière activité inscrite dans le témoin, ou `null` si elle est
 * illisible (ancien témoin « 1 » posé avant l'ajout de l'expiration).
 */
export function lireDerniereActivite(valeur: string | undefined): number | null {
  if (!valeur) return null;
  const ms = Number(valeur);
  return Number.isFinite(ms) && ms > 1_000_000_000_000 ? ms : null;
}

/** Retire l'expiration d'un cookie de session — sauf s'il s'agit d'une suppression. */
export function adapterDuree(options: CookieOptions, ephemere: boolean): CookieOptions {
  if (!ephemere) return options;
  if (options.maxAge !== undefined && options.maxAge <= 0) return options;

  const copie: CookieOptions = { ...options };
  delete copie.maxAge;
  delete copie.expires;
  return copie;
}
