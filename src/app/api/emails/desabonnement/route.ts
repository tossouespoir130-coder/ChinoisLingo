import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { verifierDesabonnement } from '@/lib/emails/desabonnement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/emails/desabonnement?u=<identifiant>&s=<signature>
 *
 * Coupe les relances commerciales envoyées après la fin d'un abonnement.
 * Aucune session n'est requise : l'apprenant n'est plus abonné et ne sera pas
 * forcément connecté en lisant l'e-mail — la signature tient lieu de preuve.
 *
 * Répond aussi au bouton « Se désabonner » de Gmail et d'Apple Mail, qui
 * envoie un POST sans corps exploitable (RFC 8058) : tout est dans l'URL.
 *
 * Réservé au POST à dessein : certains filtres anti-spam visitent les liens
 * des e-mails, et un GET provoquerait des désabonnements involontaires.
 */
export async function POST(requete: Request) {
  if (!configurationAdminPrete()) {
    console.error('[desabonnement] SUPABASE_SERVICE_ROLE_KEY absente');
    return NextResponse.json({ erreur: 'Service indisponible.' }, { status: 503 });
  }

  const parametres = new URL(requete.url).searchParams;
  const userId = parametres.get('u') ?? '';

  if (!verifierDesabonnement(userId, parametres.get('s'))) {
    return NextResponse.json({ erreur: 'Lien de désabonnement invalide.' }, { status: 403 });
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from('profiles')
    .update({ relances_desactivees: true, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('[desabonnement] enregistrement impossible', error);
    return NextResponse.json(
      { erreur: 'Le désabonnement n\'a pas pu être enregistré. Réessayez dans un instant.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
