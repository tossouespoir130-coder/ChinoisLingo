import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/moi/acces
 *
 * Droits d'accès de l'appelant, recalculés CÔTÉ SERVEUR.
 *
 * Le navigateur possède déjà la ligne `profiles` et pourrait en lire le rôle,
 * mais cette route est l'autorité : elle revalide le jeton auprès de Supabase,
 * relit le rôle avec la clé service_role, et applique la même règle
 * d'abonnement que le reste de l'application (`current_period_end > now()`).
 *
 * Limite à connaître : le contenu pédagogique est compilé dans le bundle, donc
 * cette route sécurise la DÉCISION d'accès, pas la distribution du contenu.
 * Un verrouillage total demanderait de servir le catalogue depuis le serveur.
 */
export async function GET(requete: Request) {
  if (!configurationAdminPrete()) {
    return NextResponse.json(
      { erreur: 'Configuration serveur incomplète (SUPABASE_SERVICE_ROLE_KEY).' },
      { status: 503 }
    );
  }

  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profil, error } = await admin
    .from('profiles')
    .select('role, current_period_end')
    .eq('id', utilisateur.id)
    .single();

  if (error || !profil) {
    console.error('[acces] profil illisible', error);
    return NextResponse.json({ erreur: 'Profil introuvable.' }, { status: 404 });
  }

  const estAdmin = profil.role === 'admin';

  // Règle d'abonnement identique partout dans l'application : la date de fin
  // de période est la seule source de vérité.
  const estAbonne =
    profil.current_period_end !== null &&
    new Date(profil.current_period_end).getTime() > Date.now();

  return NextResponse.json({
    role: profil.role,
    estAdmin,
    estAbonne,
    // Le rôle ouvre le catalogue sans condition de date ni de paiement.
    accesComplet: estAbonne || estAdmin,
    finPeriode: profil.current_period_end,
  });
}
