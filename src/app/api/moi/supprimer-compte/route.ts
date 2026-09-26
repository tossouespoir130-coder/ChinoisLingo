import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/types';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';
import { stripeClient } from '@/lib/payments/stripe';
import { verifierRateLimit } from '@/lib/security/rateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Mot à saisir pour confirmer : une suppression ne se fait jamais par un simple clic. */
const MOT_CONFIRMATION = 'SUPPRIMER';

/**
 * Tables de progression créées hors migrations : on ne connaît pas leur
 * comportement ON DELETE, elles sont donc vidées explicitement. Les tables des
 * migrations (payments, daily_activity, emails_abonnement…) suivent le profil
 * en cascade ; les journaux (emails_log, admin_actions_log) passent à NULL.
 */
const TABLES_DU_COMPTE = ['saved_words', 'content_progress', 'course_progress', 'notifications'] as const;

/**
 * POST /api/moi/supprimer-compte — corps : { motDePasse, confirmation }
 *
 * Suppression définitive du compte par son titulaire :
 * 1. session valide + mot de passe revérifié ici, côté serveur ;
 * 2. abonnement Stripe arrêté AVANT toute suppression — sinon la carte
 *    continuerait d'être débitée pour un compte qui n'existe plus ;
 * 3. données de progression, profil, puis compte d'authentification.
 */
export async function POST(requete: Request) {
  if (!configurationAdminPrete()) {
    console.error('[supprimer-compte] SUPABASE_SERVICE_ROLE_KEY absente');
    return NextResponse.json({ erreur: 'Service momentanément indisponible.' }, { status: 503 });
  }

  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée. Reconnectez-vous.' }, { status: 401 });
  }

  const limite = await verifierRateLimit(`supprimer-compte:${utilisateur.id}`, 5, 900);
  if (!limite.autorise) {
    return NextResponse.json(
      { erreur: `Trop de tentatives. Réessayez dans ${limite.attenteSecondes} secondes.` },
      { status: 429 }
    );
  }

  const corps = await requete.json().catch(() => null);
  const motDePasse = typeof corps?.motDePasse === 'string' ? corps.motDePasse : '';
  if (corps?.confirmation !== MOT_CONFIRMATION) {
    return NextResponse.json({ erreur: `Saisissez ${MOT_CONFIRMATION} pour confirmer.` }, { status: 400 });
  }
  if (!motDePasse) {
    return NextResponse.json({ erreur: 'Saisissez votre mot de passe.' }, { status: 400 });
  }

  // 1. Mot de passe revérifié sur un client jetable : aucune session n'est conservée.
  const verification = createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { error: erreurMotDePasse } = await verification.auth.signInWithPassword({
    email: utilisateur.email,
    password: motDePasse,
  });
  if (erreurMotDePasse) {
    return NextResponse.json({ erreur: 'Mot de passe incorrect.' }, { status: 403 });
  }

  const admin = createAdminClient();

  // 2. Abonnement par carte : arrêt immédiat avant de supprimer quoi que ce soit.
  const { data: profil } = await admin
    .from('profiles')
    .select('role, subscription_provider, stripe_subscription_id')
    .eq('id', utilisateur.id)
    .maybeSingle();

  // Un administrateur ne supprime pas son propre compte depuis l'interface :
  // une erreur de manipulation priverait le site de son accès d'administration.
  if (profil?.role === 'admin') {
    return NextResponse.json(
      { erreur: 'Un compte administrateur ne peut pas être supprimé depuis l’interface.' },
      { status: 403 }
    );
  }

  if (profil?.subscription_provider === 'stripe' && profil.stripe_subscription_id) {
    try {
      await stripeClient().subscriptions.cancel(profil.stripe_subscription_id);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      // Abonnement déjà clos ou introuvable : rien ne sera plus prélevé, on continue.
      if (code !== 'resource_missing') {
        console.error('[supprimer-compte] arrêt de l\'abonnement Stripe impossible', err);
        return NextResponse.json(
          {
            erreur:
              'Impossible d’arrêter votre abonnement pour le moment : votre compte n’a pas été supprimé. Réessayez dans un instant.',
          },
          { status: 502 }
        );
      }
    }
  }

  // 3. Données, profil, puis compte d'authentification.
  for (const table of TABLES_DU_COMPTE) {
    const { error } = await admin.from(table).delete().eq('user_id', utilisateur.id);
    if (error) console.error(`[supprimer-compte] nettoyage de ${table}`, error);
  }

  const { error: erreurProfil } = await admin.from('profiles').delete().eq('id', utilisateur.id);
  if (erreurProfil) {
    console.error('[supprimer-compte] suppression du profil', erreurProfil);
    return NextResponse.json(
      { erreur: 'La suppression n’a pas pu aboutir. Réessayez dans un instant.' },
      { status: 500 }
    );
  }

  const { error: erreurCompte } = await admin.auth.admin.deleteUser(utilisateur.id);
  if (erreurCompte) {
    console.error('[supprimer-compte] suppression du compte d\'authentification', erreurCompte);
    return NextResponse.json(
      { erreur: 'La suppression n’a pas pu aboutir. Réessayez dans un instant.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
