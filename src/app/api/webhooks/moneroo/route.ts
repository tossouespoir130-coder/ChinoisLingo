import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  verifierSignatureMoneroo,
  analyserEvenementMoneroo,
  idEvenementMoneroo,
  verifierPaiementMoneroo,
} from '@/lib/payments/moneroo';
import {
  accorderAcces,
  enregistrerEchec,
  evenementDejaTraite,
  libererEvenement,
} from '@/lib/payments/octroi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/moneroo
 *
 * À déclarer dans le tableau de bord Moneroo :
 *   https://app.moneroo.io/developers/webhooks
 *   → https://<votre-domaine>/api/webhooks/moneroo
 *
 * Enchaînement imposé par le skill : signature sur octets bruts → dédoublonnage
 * → re-vérification auprès de l'API → octroi idempotent.
 */
export async function POST(requete: Request) {
  // .text() et non .json() : le HMAC porte sur les OCTETS BRUTS. Reconstruire
  // le corps avec JSON.stringify change l'ordre des champs et les espaces, et
  // la signature ne correspondrait jamais.
  const corpsBrut = await requete.text();

  if (!verifierSignatureMoneroo(corpsBrut, requete.headers.get('x-moneroo-signature'))) {
    console.error('[webhook moneroo] signature invalide');
    return NextResponse.json({ erreur: 'Signature invalide.' }, { status: 401 });
  }

  let corps: unknown;
  try {
    corps = JSON.parse(corpsBrut);
  } catch {
    return NextResponse.json({ erreur: 'Corps illisible.' }, { status: 400 });
  }

  const evenement = analyserEvenementMoneroo(corps);
  // `payment.initiated` et les événements inconnus n'appellent aucune action.
  if (!evenement) return NextResponse.json({ recu: true, ignore: true });

  const admin = createAdminClient();

  const eventId = idEvenementMoneroo(corpsBrut);
  if (await evenementDejaTraite(admin, 'moneroo', eventId)) {
    return NextResponse.json({ recu: true, dedoublonne: true });
  }

  // Moneroo renvoie nos métadonnées telles quelles : on y retrouve l'identifiant
  // de la ligne `payments` créée au checkout.
  const metadata = (corps as { data?: { metadata?: Record<string, string> } }).data?.metadata;
  let paymentId = metadata?.paymentId;

  // Repli : si les métadonnées manquent, on retrouve la ligne par la transaction.
  if (!paymentId) {
    const { data } = await admin
      .from('payments')
      .select('id')
      .eq('provider_transaction_id', evenement.transactionId)
      .maybeSingle();
    paymentId = data?.id;
  }

  if (!paymentId) {
    console.error('[webhook moneroo] paiement introuvable', evenement.transactionId);
    return NextResponse.json({ recu: true, ignore: true });
  }

  if (evenement.statut === 'echoue') {
    await enregistrerEchec(admin, paymentId, evenement.motifEchec ?? 'Paiement échoué.');
    return NextResponse.json({ recu: true });
  }

  // Défense en profondeur : si le secret de webhook fuitait, un attaquant
  // pourrait forger une signature valide. La clé secrète de l'API, elle, ne
  // quitte jamais le serveur — cet appel est donc la garantie finale.
  const live = await verifierPaiementMoneroo(evenement.transactionId);
  if (live && live.statut !== 'success' && live.statut !== 'succeeded') {
    console.error('[webhook moneroo] statut réel divergent', {
      paymentId,
      annonce: 'success',
      reel: live.statut,
    });
    await enregistrerEchec(admin, paymentId, `Contre-vérification : statut réel « ${live.statut} ».`);
    return NextResponse.json({ recu: true, divergence: true });
  }

  const resultat = await accorderAcces({
    admin,
    paymentId,
    transactionId: evenement.transactionId,
    montantAnnonce: live?.montant ?? evenement.montantAnnonce,
    deviseAnnoncee: live?.devise ?? evenement.deviseAnnoncee,
  });

  if (!resultat.ok) {
    console.error('[webhook moneroo] octroi refusé', resultat.motif);
    // Verrou libéré : la relance de Moneroo doit pouvoir retenter.
    await libererEvenement(admin, 'moneroo', eventId);
    return NextResponse.json({ erreur: resultat.motif }, { status: 400 });
  }

  return NextResponse.json({ recu: true });
}
