import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/supabase/types';

/**
 * Identification de l'appelant dans une route API.
 *
 * L'authentification de ChinoisLingo est entièrement côté navigateur et aucun
 * `middleware.ts` ne rafraîchit la session côté serveur : on ne peut donc pas
 * se fier aux cookies seuls. Le client envoie explicitement son jeton d'accès
 * dans l'en-tête `Authorization`, que l'on valide ici auprès de Supabase.
 */
export async function utilisateurDeLaRequete(
  requete: Request
): Promise<{ id: string; email: string } | null> {
  const entete = requete.headers.get('authorization');
  if (!entete?.startsWith('Bearer ')) return null;

  const jeton = entete.slice(7).trim();
  if (!jeton) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cleAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !cleAnon) return null;

  const supabase = createSupabaseClient<Database>(url, cleAnon, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(jeton);

  if (error || !user?.email) return null;

  return { id: user.id, email: user.email };
}

/**
 * URL publique du site, pour construire les redirections de paiement.
 * Vercel expose `VERCEL_PROJECT_PRODUCTION_URL` ; en local on retombe sur
 * l'origine de la requête.
 */
export function urlDeBase(requete: Request): string {
  const configuree = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuree) return configuree.replace(/\/$/, '');

  const productionVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionVercel) return `https://${productionVercel}`;

  return new URL(requete.url).origin;
}
