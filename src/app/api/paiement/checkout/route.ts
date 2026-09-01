import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete, urlDeBase } from '@/lib/payments/session-serveur';
import {
  getPlan,
  fournisseurPourDevise,
  Devise,
  BONUS_PREMIER_PAIEMENT_JOURS,
} from '@/lib/payments/plans';
import { initierPaiementMoneroo } from '@/lib/payments/moneroo';
import { creerCheckoutStripe, trouverOuCreerClientStripe } from '@/lib/payments/stripe';

// node:crypto et les SDK de paiement imposent le runtime Node.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/paiement/checkout
 * Corps attendu : { plan: 'mensuel' | 'semestriel' | 'annuel', devise: 'XOF' | 'EUR' }
 * Réponse : { url } — l'URL de la page de paiement hébergée.
 *
 * Invariant du skill : la ligne `payments` est insérée en statut « pending »
 * AVANT d'appeler le fournisseur, car le webhook peut arriver avant même que
 * la réponse HTTP du checkout ne nous revienne.
 */
export async function POST(requete: Request) {
  if (!configurationAdminPrete()) {
    console.error('[checkout] SUPABASE_SERVICE_ROLE_KEY absente');
    return NextResponse.json(
      { erreur: 'Le service de paiement n\'est pas encore configuré. Réessayez plus tard.' },
      { status: 503 }
    );
  }

  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  let corps: { plan?: string; devise?: string };
  try {
    corps = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête illisible.' }, { status: 400 });
  }

  const plan = getPlan(corps.plan ?? '');
  if (!plan) {
    return NextResponse.json({ erreur: 'Formule inconnue.' }, { status: 400 });
  }

  if (corps.devise !== 'XOF' && corps.devise !== 'EUR') {
    return NextResponse.json({ erreur: 'Devise non prise en charge.' }, { status: 400 });
  }
  const devise: Devise = corps.devise;
  const fournisseur = fournisseurPourDevise(devise);

  const admin = createAdminClient();

  const { data: profil } = await admin
    .from('profiles')
    .select('full_name, bonus_7j_accorde, current_period_end, stripe_customer_id')
    .eq('id', utilisateur.id)
    .single();

  // Le montant vient du catalogue serveur, jamais du corps de la requête :
  // le client ne peut donc pas choisir son prix.
  const montant = plan.montant[devise];

  const { data: paiement, error: erreurInsertion } = await admin
    .from('payments')
    .insert({
      user_id: utilisateur.id,
      provider: fournisseur,
      plan_id: plan.id,
      amount: montant,
      currency: devise,
      status: 'pending',
      customer_email: utilisateur.email,
      customer_name: profil?.full_name ?? null,
      metadata: { dureeMois: plan.dureeMois },
    })
    .select('id')
    .single();

  if (erreurInsertion || !paiement) {
    console.error('[checkout] insertion du paiement impossible', erreurInsertion);
    return NextResponse.json(
      { erreur: 'Impossible d\'enregistrer le paiement.' },
      { status: 500 }
    );
  }

  const base = urlDeBase(requete);
  const urlRetour = `${base}/abonnement/retour?ref=${paiement.id}`;

  // ── Voie Mobile Money / FCFA : Moneroo, paiement ponctuel ──────────────
  if (fournisseur === 'moneroo') {
    const resultat = await initierPaiementMoneroo({
      montant,
      devise: 'XOF',
      description: `ChinoisLingo — ${plan.nom} (${plan.dureeMois} mois)`,
      urlRetour,
      email: utilisateur.email,
      nomComplet: profil?.full_name ?? undefined,
      metadata: { paymentId: paiement.id, userId: utilisateur.id, plan: plan.id },
    });

    if (!resultat.ok) {
      await admin
        .from('payments')
        .update({ status: 'failed', failure_reason: resultat.erreur, updated_at: new Date().toISOString() })
        .eq('id', paiement.id);
      console.error('[checkout] Moneroo a refusé l\'initialisation', resultat.erreur);
      return NextResponse.json({ erreur: resultat.erreur }, { status: 502 });
    }

    await admin
      .from('payments')
      .update({
        provider_transaction_id: resultat.transactionId,
        checkout_url: resultat.urlPaiement,
        updated_at: new Date().toISOString(),
      })
      .eq('id', paiement.id);

    return NextResponse.json({ url: resultat.urlPaiement });
  }

  // ── Voie carte / EUR : Stripe, abonnement à renouvellement automatique ──
  let client = await trouverOuCreerClientStripe({
    customerId: profil?.stripe_customer_id,
    email: utilisateur.email,
    nom: profil?.full_name,
    userId: utilisateur.id,
  });

  // Identifiant hérité de l'autre environnement (test ↔ live) : on l'efface
  // et on laisse Stripe recréer un client propre.
  if (!client.ok && client.testLiveMismatch) {
    await admin
      .from('profiles')
      .update({ stripe_customer_id: null })
      .eq('id', utilisateur.id);
    client = await trouverOuCreerClientStripe({
      email: utilisateur.email,
      nom: profil?.full_name,
      userId: utilisateur.id,
    });
  }

  if (!client.ok) {
    await admin
      .from('payments')
      .update({ status: 'failed', failure_reason: client.erreur, updated_at: new Date().toISOString() })
      .eq('id', paiement.id);
    console.error('[checkout] client Stripe indisponible', client.erreur);
    return NextResponse.json({ erreur: client.erreur }, { status: 502 });
  }

  await admin
    .from('profiles')
    .update({ stripe_customer_id: client.customerId })
    .eq('id', utilisateur.id);

  // Bonus d'acquisition : 7 jours offerts au tout premier abonnement.
  const bonusJours =
    profil?.bonus_7j_accorde === true ? undefined : BONUS_PREMIER_PAIEMENT_JOURS;

  const resultat = await creerCheckoutStripe({
    plan: plan.id,
    customerId: client.customerId,
    userId: utilisateur.id,
    paymentId: paiement.id,
    urlSucces: `${urlRetour}&session_id={CHECKOUT_SESSION_ID}`,
    urlAnnulation: `${base}/mon-compte?tab=subscription&paiement=annule`,
    bonusJours,
  });

  if (!resultat.ok) {
    await admin
      .from('payments')
      .update({ status: 'failed', failure_reason: resultat.erreur, updated_at: new Date().toISOString() })
      .eq('id', paiement.id);
    console.error('[checkout] Stripe a refusé la session', resultat.erreur);
    return NextResponse.json({ erreur: resultat.erreur }, { status: 502 });
  }

  await admin
    .from('payments')
    .update({
      provider_transaction_id: resultat.sessionId,
      checkout_url: resultat.urlPaiement,
      updated_at: new Date().toISOString(),
    })
    .eq('id', paiement.id);

  return NextResponse.json({ url: resultat.urlPaiement });
}
