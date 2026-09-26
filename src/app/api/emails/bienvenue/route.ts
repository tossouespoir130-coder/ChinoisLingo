import { NextResponse } from 'next/server';
import { envoyerEmailBienvenue } from '@/lib/emails/emailBienvenue';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { verifierRateLimit } from '@/lib/security/rateLimiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Au-delà, le compte n'est plus « tout juste créé » : pas d'e-mail de bienvenue. */
const FENETRE_INSCRIPTION_MS = 30 * 60 * 1000;

/**
 * POST /api/emails/bienvenue — corps : { email }
 *
 * Appelée juste après l'inscription, avant toute confirmation d'adresse :
 * aucune session n'existe encore. La route ne fait donc confiance qu'à la base :
 * - l'adresse doit correspondre à un profil créé il y a moins de 30 minutes ;
 * - ce profil ne doit jamais avoir reçu d'e-mail de bienvenue ;
 * - nom, profil et niveau sont lus dans ce profil, jamais dans la requête.
 *
 * Auparavant, n'importe qui pouvait faire envoyer par notre domaine un e-mail
 * au contenu choisi (nom libre) vers n'importe quelle adresse.
 */
export async function POST(requete: Request) {
  // Réponse identique dans tous les cas de refus : on ne révèle pas si l'adresse a un compte.
  const refus = () => NextResponse.json({ ok: false });

  try {
    const ip = requete.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'inconnue';
    const limite = await verifierRateLimit(`bienvenue:${ip}`, 5, 3600);
    if (!limite.autorise) {
      return NextResponse.json({ erreur: 'Trop de demandes.' }, { status: 429 });
    }

    if (!configurationAdminPrete()) {
      console.error('[api/emails/bienvenue] SUPABASE_SERVICE_ROLE_KEY absente');
      return refus();
    }

    const corps = await requete.json().catch(() => null);
    const email = typeof corps?.email === 'string' ? corps.email.trim().toLowerCase() : '';
    if (!email || email.length > 254) return refus();

    const admin = createAdminClient();

    const { data: profil } = await admin
      .from('profiles')
      .select('id, email, username, first_name, created_at, onboarding_profil, onboarding_objectif, onboarding_niveau')
      .ilike('email', email)
      .maybeSingle();

    if (!profil?.email || !profil.created_at) return refus();
    if (Date.now() - new Date(profil.created_at).getTime() > FENETRE_INSCRIPTION_MS) return refus();

    const { count } = await admin
      .from('emails_log')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profil.id)
      .eq('type', 'bienvenue')
      // Seul un envoi réussi compte : un envoi simulé (Resend non configuré) ou en échec ne doit pas bloquer le suivant.
      .eq('statut', 'envoye');
    if ((count ?? 0) > 0) return refus();

    const succes = await envoyerEmailBienvenue({
      userId: profil.id,
      email: profil.email,
      nom: profil.username || profil.first_name || profil.email.split('@')[0],
      profil: profil.onboarding_profil,
      objectif: profil.onboarding_objectif,
      niveau: profil.onboarding_niveau,
    });

    return NextResponse.json({ ok: succes });
  } catch (err) {
    console.error('[api/emails/bienvenue] Erreur', err);
    return NextResponse.json({ erreur: 'Échec d\'envoi.' }, { status: 500 });
  }
}
