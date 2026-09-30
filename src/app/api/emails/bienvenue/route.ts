import { NextResponse } from 'next/server';
import { envoyerEmailBienvenue } from '@/lib/emails/emailBienvenue';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { verifierRateLimit } from '@/lib/security/rateLimiter';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Au-delà, le compte n'est plus « tout juste activé » : pas d'e-mail de bienvenue.
 * Mesurée depuis la CONFIRMATION de l'adresse, non depuis l'inscription :
 * l'apprenant peut activer son compte plusieurs jours après s'être inscrit,
 * alors qu'un compte actif depuis des semaines ne doit pas recevoir de
 * bienvenue tardive à sa prochaine connexion.
 */
const FENETRE_ACTIVATION_MS = 72 * 60 * 60 * 1000;

/**
 * POST /api/emails/bienvenue — en-tête `Authorization: Bearer <jeton>`
 *
 * Appelée à chaque ouverture de session (voir `demanderEmailBienvenue`).
 * Une session n'existe que pour une adresse CONFIRMÉE : l'e-mail de bienvenue
 * ne peut donc plus arriver avant l'e-mail d'activation de Supabase. Envoyé
 * dès l'inscription, son bouton « Commencer ma première leçon » était pris
 * pour le lien de confirmation, et le compte restait inactif.
 *
 * Destinataire, nom, profil et niveau sont lus dans le profil de l'appelant,
 * jamais dans la requête ; un seul envoi réussi par compte.
 */
export async function POST(requete: Request) {
  // Réponse identique dans tous les cas de refus : rien à apprendre de plus.
  const refus = () => NextResponse.json({ ok: false });

  try {
    const utilisateur = await utilisateurDeLaRequete(requete);
    if (!utilisateur) {
      return NextResponse.json({ erreur: 'Non authentifié.' }, { status: 401 });
    }

    const limite = await verifierRateLimit(`bienvenue:${utilisateur.id}`, 5, 3600);
    if (!limite.autorise) {
      return NextResponse.json({ erreur: 'Trop de demandes.' }, { status: 429 });
    }

    if (!configurationAdminPrete()) {
      console.error('[api/emails/bienvenue] SUPABASE_SERVICE_ROLE_KEY absente');
      return refus();
    }

    const admin = createAdminClient();

    const { data: profil } = await admin
      .from('profiles')
      .select('id, email, username, first_name, onboarding_profil, onboarding_objectif, onboarding_niveau')
      .eq('id', utilisateur.id)
      .maybeSingle();

    if (!profil) return refus();

    const { data: compte } = await admin.auth.admin.getUserById(utilisateur.id);
    const confirmeLe = compte.user?.email_confirmed_at;
    if (!confirmeLe) return refus();
    if (Date.now() - new Date(confirmeLe).getTime() > FENETRE_ACTIVATION_MS) return refus();

    const { count } = await admin
      .from('emails_log')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', profil.id)
      .eq('type', 'bienvenue')
      // Seul un envoi réussi compte : un envoi simulé (Resend non configuré) ou en échec ne doit pas bloquer le suivant.
      .eq('statut', 'envoye');
    if ((count ?? 0) > 0) return refus();

    const email = profil.email || utilisateur.email;
    const succes = await envoyerEmailBienvenue({
      userId: profil.id,
      email,
      nom: profil.username || profil.first_name || email.split('@')[0],
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
