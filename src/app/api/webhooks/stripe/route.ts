import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import {
  verifierWebhookStripe,
  idAbonnementDeFacture,
  finPeriodeAbonnement,
  stripeClient,
} from '@/lib/payments/stripe';
import {
  accorderAcces,
  enregistrerEchec,
  evenementDejaTraite,
  libererEvenement,
  prolongerDepuisStripe,
  revoquerAbonnementStripe,
} from '@/lib/payments/octroi';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/stripe
 *
 * À déclarer dans le tableau de bord Stripe, avec ces événements :
 *   checkout.session.completed, invoice.paid, invoice.payment_failed,
 *   customer.subscription.updated, customer.subscription.deleted
 *
 * L'ordre d'arrivée de `checkout.session.completed` et `invoice.paid` n'est pas
 * garanti par Stripe : chaque branche est donc idempotente et ne suppose rien
 * de ce qui a déjà été traité.
 */
export async function POST(requete: Request) {
  const corpsBrut = await requete.text();

  let evenement: Stripe.Event;
  try {
    // constructEvent fait le HMAC à temps constant ET la fenêtre anti-rejeu.
    evenement = verifierWebhookStripe(corpsBrut, requete.headers.get('stripe-signature'));
  } catch (err) {
    console.error('[webhook stripe] signature invalide', (err as Error).message);
    return NextResponse.json({ erreur: 'Signature invalide.' }, { status: 401 });
  }

  const admin = createAdminClient();

  // Stripe fournit un `event.id` stable : inutile d'en synthétiser un.
  if (await evenementDejaTraite(admin, 'stripe', evenement.id)) {
    return NextResponse.json({ recu: true, dedoublonne: true });
  }

  switch (evenement.type) {
    // ── Première activation ────────────────────────────────────────────
    case 'checkout.session.completed': {
      const session = evenement.data.object as Stripe.Checkout.Session;
      const paymentId = session.metadata?.paymentId;
      if (!paymentId) break;

      // `unpaid` = session finalisée mais prélèvement en attente : c'est
      // `invoice.paid` qui fera foi. En revanche `no_payment_required`, qui
      // correspond à nos 7 jours de bonus, doit bien activer l'accès.
      if (session.payment_status === 'unpaid') break;

      const abonnementId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id;

      // Fin de période prononcée par Stripe : c'est lui qui fait autorité sur
      // les dates de son propre abonnement (essai reporté compris).
      let finPeriode: Date | undefined;
      if (abonnementId) {
        // Sans userId, `.eq('id', '')` échouerait sur une colonne UUID.
        const userId = session.metadata?.userId;
        if (userId) {
          await admin
            .from('profiles')
            .update({ stripe_subscription_id: abonnementId })
            .eq('id', userId);
        }

        const abonnement = await stripeClient().subscriptions.retrieve(abonnementId);
        const fin = finPeriodeAbonnement(abonnement);
        if (fin) finPeriode = new Date(fin * 1000);
      }

      // Avec les 7 jours de bonus (`trial_period_days`), Stripe facture 0 sur
      // cette première session : le contrôle d'altération du montant doit
      // alors être sauté, sinon un paiement légitime serait refusé. Le montant
      // réel sera vérifié à la première facture émise.
      const montantSession = session.amount_total ?? 0;

      const resultat = await accorderAcces({
        admin,
        paymentId,
        transactionId: session.id,
        // Stripe facture en centimes pour l'EUR, comme notre catalogue.
        montantAnnonce: montantSession > 0 ? montantSession : undefined,
        deviseAnnoncee: montantSession > 0 ? (session.currency ?? undefined) : undefined,
        finPeriodeImposee: finPeriode,
      });

      if (!resultat.ok) {
        console.error('[webhook stripe] octroi refusé', resultat.motif);
        // Stripe relance jusqu'à 3 jours : on rouvre la porte à la prochaine tentative.
        await libererEvenement(admin, 'stripe', evenement.id);
      }
      break;
    }

    // ── Renouvellements ────────────────────────────────────────────────
    case 'invoice.paid': {
      const facture = evenement.data.object as Stripe.Invoice;
      const abonnementId = idAbonnementDeFacture(facture);
      if (!abonnementId) break;

      // `subscription_create` est déjà couvert par checkout.session.completed.
      // Ici on ne traite que les échéances suivantes.
      if (facture.billing_reason === 'subscription_create') break;

      const abonnement = await stripeClient().subscriptions.retrieve(abonnementId);
      const fin = finPeriodeAbonnement(abonnement);
      if (fin) await prolongerDepuisStripe(admin, abonnementId, new Date(fin * 1000));
      break;
    }

    // ── Échec de prélèvement ───────────────────────────────────────────
    case 'invoice.payment_failed': {
      const facture = evenement.data.object as Stripe.Invoice;
      const abonnementId = idAbonnementDeFacture(facture);
      if (!abonnementId) break;

      // L'accès n'est PAS coupé ici : Stripe relance le prélèvement plusieurs
      // fois avant d'abandonner. La coupure viendra de subscription.deleted.
      await admin
        .from('profiles')
        .update({ subscription_status: 'past_due', updated_at: new Date().toISOString() })
        .eq('stripe_subscription_id', abonnementId);
      break;
    }

    // ── Changement d'état (résiliation programmée, reprise…) ───────────
    case 'customer.subscription.updated': {
      const abonnement = evenement.data.object as Stripe.Subscription;
      const fin = finPeriodeAbonnement(abonnement);

      await admin
        .from('profiles')
        .update({
          cancel_at_period_end: abonnement.cancel_at_period_end,
          ...(fin ? { current_period_end: new Date(fin * 1000).toISOString() } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', abonnement.id);
      break;
    }

    // ── Fin définitive ─────────────────────────────────────────────────
    case 'customer.subscription.deleted': {
      const abonnement = evenement.data.object as Stripe.Subscription;
      await revoquerAbonnementStripe(admin, abonnement.id);
      break;
    }

    // ── Paiement ponctuel refusé ───────────────────────────────────────
    case 'payment_intent.payment_failed': {
      const intention = evenement.data.object as Stripe.PaymentIntent;
      const paymentId = intention.metadata?.paymentId;
      if (paymentId) {
        await enregistrerEchec(
          admin,
          paymentId,
          intention.last_payment_error?.message ?? 'Paiement refusé.'
        );
      }
      break;
    }

    default:
      // Les autres événements sont valides mais n'appellent aucune action.
      break;
  }

  return NextResponse.json({ recu: true });
}
