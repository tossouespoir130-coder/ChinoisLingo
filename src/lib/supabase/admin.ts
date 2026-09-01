import 'server-only';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

/**
 * Client Supabase à privilèges élevés — RÉSERVÉ AUX ROUTES API.
 *
 * La clé service_role contourne toutes les politiques RLS. Elle est
 * indispensable aux webhooks de paiement, qui arrivent sans session
 * utilisateur et doivent pourtant écrire dans `profiles` et `payments`.
 *
 * L'import `server-only` fait échouer le build si ce fichier est atteint
 * depuis un composant client : la clé ne peut donc pas fuir dans le bundle.
 */
/**
 * La configuration serveur est-elle complète ?
 *
 * Permet aux appelants de renvoyer un message clair et actionnable plutôt
 * que de laisser remonter une exception en « Erreur 500 » opaque.
 */
export function configurationAdminPrete(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Configuration Supabase incomplète : NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis côté serveur.'
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
