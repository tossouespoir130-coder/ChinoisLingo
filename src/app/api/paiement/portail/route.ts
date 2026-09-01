import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete, urlDeBase } from '@/lib/payments/session-serveur';
import { creerSessionPortail } from '@/lib/payments/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/paiement/portail
 *
 * Ouvre l'espace de facturation hébergé par Stripe : moyen de paiement,
 * factures, résiliation. Réservé aux abonnements EUR — Moneroo n'a pas
 * d'équivalent, ses pass ponctuels se reconduisent depuis notre propre écran.
 */
export async function POST(requete: Request) {
  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: profil } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', utilisateur.id)
    .single();

  if (!profil?.stripe_customer_id) {
    return NextResponse.json(
      { erreur: 'Aucun abonnement par carte rattaché à ce compte.' },
      { status: 400 }
    );
  }

  const resultat = await creerSessionPortail({
    customerId: profil.stripe_customer_id,
    urlRetour: `${urlDeBase(requete)}/mon-compte?tab=subscription`,
  });

  if (!resultat.ok) {
    console.error('[portail] session Stripe indisponible', resultat.erreur);
    return NextResponse.json({ erreur: resultat.erreur }, { status: 502 });
  }

  return NextResponse.json({ url: resultat.url });
}
