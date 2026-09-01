import 'server-only';

import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';

/**
 * Contrôle du rôle administrateur pour les routes API.
 *
 * Le middleware protège l'AFFICHAGE de /admin ; ces routes exposent les
 * DONNÉES. Les deux doivent être gardés séparément : sans ce contrôle,
 * n'importe qui pourrait appeler /api/admin/utilisateurs directement et
 * récupérer la liste complète des comptes.
 */
export async function exigerAdmin(
  requete: Request
): Promise<{ ok: true; userId: string } | { ok: false; statut: number; erreur: string }> {
  // Contrôle de configuration AVANT tout appel : sans la clé service_role,
  // createAdminClient lève et l'administrateur ne voit qu'un « 500 » muet.
  if (!configurationAdminPrete()) {
    return {
      ok: false,
      statut: 503,
      erreur:
        "Configuration serveur incomplète : la variable SUPABASE_SERVICE_ROLE_KEY est absente. Ajoutez-la dans .env.local (Dashboard Supabase → Settings → API → service_role), puis redémarrez le serveur.",
    };
  }

  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return { ok: false, statut: 401, erreur: 'Session invalide ou expirée.' };
  }

  const admin = createAdminClient();
  const { data: profil } = await admin
    .from('profiles')
    .select('role')
    .eq('id', utilisateur.id)
    .single();

  if (profil?.role !== 'admin') {
    return { ok: false, statut: 403, erreur: 'Accès réservé aux administrateurs.' };
  }

  return { ok: true, userId: utilisateur.id };
}
