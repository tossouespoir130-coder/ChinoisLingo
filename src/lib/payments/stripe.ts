import 'server-only';

import Stripe from 'stripe';
import { PlanId } from './plans';

/**
 * Adaptateur Stripe — carte bancaire, diaspora et international (EUR).
 *
 * Contrairement à Moneroo, Stripe gère le véritable abonnement à
 * renouvellement automatique : c'est lui qui porte la grille EUR.
 *
 * Version de l'API épinglée volontairement (recommandation du skill) : sans
 * épinglage, Stripe applique la version par défaut du compte et une rotation
 * côté Stripe casse le code sans prévenir. Cette constante est la source de
 * vérité — la faire évoluer est une décision, pas un accident.
 */
export const STRIPE_API_VERSION: Stripe.LatestApiVersion = '2026-08-26.dahlia';

let clientMemo: Stripe | null = null;

export function stripeClient(): Stripe {
  if (clientMemo) return clientMemo;

  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) throw new Error('STRIPE_SECRET_KEY absente de l\'environnement.');

  clientMemo = new Stripe(cle, { apiVersion: STRIPE_API_VERSION });
  return clientMemo;
}

/**
 * Identifiants de tarifs (`price_...`) créés dans le tableau de bord Stripe,
 * un par durée, en EUR récurrent :
 *   mensuel    → 13,99 € / mois
 *   semestriel → 59,99 € tous les 6 mois
 *   annuel     → 99,99 € / an
 *
 * Les objets Stripe sont cloisonnés entre test et production : un `price_...`
 * créé en test n'existe pas avec une clé live. Prévoir deux jeux de variables
 * selon l'environnement de déploiement.
 */
export function priceIdPour(plan: PlanId): string {
  const table: Record<PlanId, string | undefined> = {
    mensuel: process.env.STRIPE_PRICE_MENSUEL,
    semestriel: process.env.STRIPE_PRICE_SEMESTRIEL,
    annuel: process.env.STRIPE_PRICE_ANNUEL,
  };
  const id = table[plan];
  if (!id) {
    throw new Error(
      `Tarif Stripe non configuré pour le plan « ${plan} » (variable STRIPE_PRICE_${plan.toUpperCase()}).`
    );
  }
  return id;
}

// ─────────────────────────────────────────────────────────────────────────
// Client Stripe rattaché à l'apprenant
// ─────────────────────────────────────────────────────────────────────────

/**
 * Réutilise toujours le même `cus_...` : c'est ce qui fait suivre les moyens
 * de paiement enregistrés d'un achat à l'autre.
 *
 * `testLiveMismatch` signale un identifiant hérité de l'autre environnement
 * (typiquement après une copie de base) : l'appelant doit alors effacer
 * l'identifiant stocké et rappeler la fonction sans lui.
 */
export async function trouverOuCreerClientStripe(params: {
  customerId?: string | null;
  email: string;
  nom?: string | null;
  userId: string;
}): Promise<
  | { ok: true; customerId: string }
  | { ok: false; erreur: string; testLiveMismatch?: boolean }
> {
  const stripe = stripeClient();

  if (params.customerId) {
    try {
      const existant = await stripe.customers.retrieve(params.customerId);
      if (!existant.deleted) return { ok: true, customerId: existant.id };
    } catch (err) {
      const code = (err as Stripe.errors.StripeError).code;
      if (code === 'resource_missing') {
        return {
          ok: false,
          erreur: 'Identifiant client Stripe issu d\'un autre environnement.',
          testLiveMismatch: true,
        };
      }
      return { ok: false, erreur: (err as Error).message };
    }
  }

  try {
    const parEmail = await stripe.customers.list({ email: params.email, limit: 1 });
    if (parEmail.data.length > 0) {
      return { ok: true, customerId: parEmail.data[0].id };
    }

    const cree = await stripe.customers.create({
      email: params.email,
      name: params.nom ?? undefined,
      metadata: { userId: params.userId },
    });
    return { ok: true, customerId: cree.id };
  } catch (err) {
    return { ok: false, erreur: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Session de paiement hébergée
// ─────────────────────────────────────────────────────────────────────────

export interface ParamsCheckoutStripe {
  plan: PlanId;
  customerId: string;
  userId: string;
  paymentId: string;
  urlSucces: string;
  urlAnnulation: string;
  /**
   * Jours de bonus offerts au premier abonnement. Traduit en
   * `trial_period_days` : Stripe décale la première facture d'autant, ce qui
   * donne bien « la durée achetée + N jours » pour le prix de la durée.
   * 0 ou absent pour un réabonnement.
   */
  bonusJours?: number;
}

export type ResultatCheckoutStripe =
  | { ok: true; sessionId: string; urlPaiement: string }
  | { ok: false; erreur: string };

export async function creerCheckoutStripe(
  params: ParamsCheckoutStripe
): Promise<ResultatCheckoutStripe> {
  const stripe = stripeClient();

  // Stripe n'accepte `trial_period_days` qu'à partir de 1 jour.
  const bonus = params.bonusJours && params.bonusJours >= 1 ? params.bonusJours : undefined;

  try {
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'subscription',
        customer: params.customerId,
        line_items: [{ price: priceIdPour(params.plan), quantity: 1 }],
        // La session est éphémère : ces métadonnées servent à relier
        // `checkout.session.completed` à notre ligne `payments`.
        metadata: {
          paymentId: params.paymentId,
          userId: params.userId,
          plan: params.plan,
        },
        // L'abonnement, lui, est durable : ces métadonnées permettent de
        // traiter les renouvellements et résiliations des mois plus tard.
        subscription_data: {
          metadata: {
            paymentId: params.paymentId,
            userId: params.userId,
            plan: params.plan,
          },
          ...(bonus ? { trial_period_days: bonus } : {}),
        },
        allow_promotion_codes: true,
        success_url: params.urlSucces,
        cancel_url: params.urlAnnulation,
      },
      // Rejouer la même requête réseau ne crée pas deux abonnements.
      { idempotencyKey: params.paymentId }
    );

    if (!session.url) {
      return { ok: false, erreur: 'Stripe n\'a pas renvoyé d\'URL de paiement.' };
    }
    return { ok: true, sessionId: session.id, urlPaiement: session.url };
  } catch (err) {
    return { ok: false, erreur: (err as Error).message };
  }
}

/** Espace Stripe où l'apprenant gère seul sa carte, ses factures et sa résiliation. */
export async function creerSessionPortail(params: {
  customerId: string;
  urlRetour: string;
}): Promise<{ ok: true; url: string } | { ok: false; erreur: string }> {
  try {
    const portail = await stripeClient().billingPortal.sessions.create({
      customer: params.customerId,
      return_url: params.urlRetour,
    });
    return { ok: true, url: portail.url };
  } catch (err) {
    return { ok: false, erreur: (err as Error).message };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Webhooks
// ─────────────────────────────────────────────────────────────────────────

/**
 * `constructEvent` réalise en interne le HMAC-SHA256 à temps constant ET la
 * fenêtre anti-rejeu de 5 minutes. Ne jamais réimplémenter à la main.
 */
export function verifierWebhookStripe(corpsBrut: string, signature: string | null): Stripe.Event {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET absente de l\'environnement.');
  if (!signature) throw new Error('En-tête stripe-signature manquant.');

  return stripeClient().webhooks.constructEvent(corpsBrut, signature, secret);
}

/**
 * Récupère l'identifiant d'abonnement d'une facture, quelle que soit la
 * version d'API : le champ a migré de `subscription` vers
 * `parent.subscription_details.subscription`.
 */
export function idAbonnementDeFacture(facture: Stripe.Invoice): string | null {
  const recent = (
    facture as unknown as {
      parent?: { subscription_details?: { subscription?: string | Stripe.Subscription } };
    }
  ).parent?.subscription_details?.subscription;
  if (recent) return typeof recent === 'string' ? recent : recent.id;

  const ancien = (facture as unknown as { subscription?: string | Stripe.Subscription })
    .subscription;
  if (ancien) return typeof ancien === 'string' ? ancien : ancien.id;

  return null;
}

/** Fin de période d'un abonnement, en secondes Unix, tous formats d'API confondus. */
export function finPeriodeAbonnement(abonnement: Stripe.Subscription): number | null {
  const direct = (abonnement as unknown as { current_period_end?: number }).current_period_end;
  if (typeof direct === 'number') return direct;

  // Les versions récentes portent la période sur chaque ligne d'abonnement.
  const surItem = abonnement.items?.data?.[0] as unknown as
    | { current_period_end?: number }
    | undefined;
  return typeof surItem?.current_period_end === 'number' ? surItem.current_period_end : null;
}
