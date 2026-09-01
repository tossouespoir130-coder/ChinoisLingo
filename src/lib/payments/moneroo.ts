import 'server-only';

import crypto from 'node:crypto';

/**
 * Adaptateur Moneroo — Mobile Money & carte, marché africain.
 *
 * Adapté du skill « izisaas-payments-handler » en version mono-marchand :
 * ChinoisLingo est le seul commerçant, les clés vivent donc dans les variables
 * d'environnement plutôt que dans une table de connexions chiffrée.
 *
 * Rappel important : Moneroo ne gère PAS le prélèvement récurrent. Chaque
 * paiement est ponctuel et prolonge l'accès d'une durée fixe.
 *
 * Documentation : https://docs.moneroo.io/
 */

const MONEROO_API_URL = 'https://api.moneroo.io';
const DELAI_MAX_MS = 15_000;

function cleSecrete(): string {
  const cle = process.env.MONEROO_SECRET_KEY;
  if (!cle) throw new Error('MONEROO_SECRET_KEY absente de l\'environnement.');
  return cle;
}

async function monerooFetch(chemin: string, init: RequestInit): Promise<Response> {
  const ctrl = new AbortController();
  const minuteur = setTimeout(() => ctrl.abort(), DELAI_MAX_MS);
  try {
    return await fetch(`${MONEROO_API_URL}${chemin}`, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(minuteur);
  }
}

/**
 * Moneroo exige `first_name` ET `last_name` : un envoi limité à l'e-mail
 * échoue avec un 400 muet. On retombe sur « - » quand le nom est absent.
 */
function decouperNom(complet: string | undefined, emailSecours: string) {
  const v = (complet ?? '').trim();
  if (!v) {
    return { prenom: emailSecours.split('@')[0] || 'Apprenant', nom: '-' };
  }
  const morceaux = v.split(/\s+/);
  return { prenom: morceaux[0], nom: morceaux.slice(1).join(' ') || '-' };
}

// ─────────────────────────────────────────────────────────────────────────
// Initialisation d'un paiement
// ─────────────────────────────────────────────────────────────────────────

export interface ParamsPaiementMoneroo {
  /** Montant en francs entiers : XOF est une devise sans décimale. */
  montant: number;
  devise: 'XOF' | 'XAF';
  description: string;
  urlRetour: string;
  email: string;
  nomComplet?: string;
  telephone?: string;
  /** Valeurs obligatoirement converties en chaînes : Moneroo renvoie 422 sinon. */
  metadata?: Record<string, string | number | undefined>;
}

export type ResultatPaiementMoneroo =
  | { ok: true; transactionId: string; urlPaiement: string }
  | { ok: false; erreur: string };

export async function initierPaiementMoneroo(
  params: ParamsPaiementMoneroo
): Promise<ResultatPaiementMoneroo> {
  const { prenom, nom } = decouperNom(params.nomComplet, params.email);

  const corps = {
    amount: params.montant,
    currency: params.devise,
    // Au-delà de 200 caractères, Moneroo renvoie une erreur de validation.
    description: params.description.slice(0, 200),
    // Moneroo n'accepte qu'une seule URL de redirection : pas de cancel_url.
    return_url: params.urlRetour,
    customer: {
      email: params.email,
      first_name: prenom,
      last_name: nom,
      ...(params.telephone ? { phone: params.telephone } : {}),
    },
    metadata: Object.fromEntries(
      Object.entries(params.metadata ?? {})
        .filter(([, v]) => v !== undefined && v !== null && String(v).length > 0)
        .map(([k, v]) => [k, String(v)])
    ),
  };

  let reponse: Response;
  try {
    reponse = await monerooFetch('/v1/payments/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cleSecrete()}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(corps),
    });
  } catch (err) {
    return { ok: false, erreur: `Moneroo injoignable : ${(err as Error).message}` };
  }

  let json: { data?: { id?: string; checkout_url?: string }; message?: string };
  try {
    json = (await reponse.json()) as typeof json;
  } catch {
    return { ok: false, erreur: `Moneroo a répondu ${reponse.status} (réponse non JSON).` };
  }

  // Un 200 sans id ou sans checkout_url doit être traité comme un échec.
  if (!reponse.ok || !json.data?.id || !json.data?.checkout_url) {
    return { ok: false, erreur: json.message || `Moneroo a répondu ${reponse.status}.` };
  }

  return { ok: true, transactionId: json.data.id, urlPaiement: json.data.checkout_url };
}

// ─────────────────────────────────────────────────────────────────────────
// Re-vérification (défense en profondeur)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Re-interroge l'API Moneroo pour confirmer un statut annoncé par webhook.
 * Si la signature du webhook fuitait, cet appel — fait avec la clé secrète qui,
 * elle, ne quitte jamais le serveur — reste la garantie finale.
 */
export async function verifierPaiementMoneroo(
  transactionId: string
): Promise<{ statut: string; montant?: number; devise?: string } | null> {
  let reponse: Response;
  try {
    reponse = await monerooFetch(
      `/v1/payments/${encodeURIComponent(transactionId)}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cleSecrete()}`,
          Accept: 'application/json',
        },
      }
    );
  } catch {
    return null;
  }
  if (!reponse.ok) return null;

  const json = (await reponse.json().catch(() => null)) as {
    data?: {
      status?: string;
      amount?: number | string;
      currency?: { code?: string } | string;
    };
  } | null;

  if (!json?.data?.status) return null;

  // `currency` arrive tantôt en chaîne, tantôt en objet { code }.
  const devise =
    typeof json.data.currency === 'string' ? json.data.currency : json.data.currency?.code;

  return {
    statut: String(json.data.status).toLowerCase(),
    montant:
      typeof json.data.amount === 'string'
        ? parseInt(json.data.amount, 10)
        : json.data.amount,
    devise,
  };
}

// ─────────────────────────────────────────────────────────────────────────
// Webhooks
// ─────────────────────────────────────────────────────────────────────────

/**
 * Vérifie l'en-tête `X-Moneroo-Signature` : HMAC-SHA256 hexadécimal calculé
 * sur les OCTETS BRUTS du corps. Un `JSON.stringify(body)` ne correspondra
 * jamais — l'ordre des champs et les espaces diffèrent.
 */
export function verifierSignatureMoneroo(corpsBrut: string, signature: string | null): boolean {
  const secret = process.env.MONEROO_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const attendu = crypto.createHmac('sha256', secret).update(corpsBrut, 'utf8').digest('hex');

  const recu = Buffer.from(signature.trim());
  const calcule = Buffer.from(attendu);
  // timingSafeEqual lève une exception si les longueurs diffèrent.
  if (recu.length !== calcule.length) return false;
  return crypto.timingSafeEqual(recu, calcule);
}

export interface EvenementMoneroo {
  transactionId: string;
  statut: 'complete' | 'echoue';
  motifEchec?: string;
  montantAnnonce?: number;
  deviseAnnoncee?: string;
}

/**
 * Normalise un webhook Moneroo. Retourne null pour `payment.initiated`, qui
 * est purement informatif : la ligne est déjà en attente depuis le checkout.
 */
export function analyserEvenementMoneroo(corps: unknown): EvenementMoneroo | null {
  const b = corps as { event?: string; data?: Record<string, unknown> } | null;
  if (!b?.event || !b.data) return null;

  const id = b.data.id as string | undefined;
  if (!id) return null;

  const montantAnnonce =
    typeof b.data.amount === 'number'
      ? b.data.amount
      : typeof b.data.amount === 'string'
        ? parseInt(b.data.amount, 10)
        : undefined;

  const deviseAnnoncee =
    typeof b.data.currency === 'string'
      ? b.data.currency
      : (b.data.currency as { code?: string } | undefined)?.code;

  if (b.event === 'payment.success') {
    return { transactionId: id, statut: 'complete', montantAnnonce, deviseAnnoncee };
  }

  if (b.event === 'payment.failed' || b.event === 'payment.cancelled') {
    return {
      transactionId: id,
      statut: 'echoue',
      motifEchec: typeof b.data.status === 'string' ? b.data.status : b.event,
      montantAnnonce,
      deviseAnnoncee,
    };
  }

  return null;
}

/** Identifiant d'événement synthétique : Moneroo n'en fournit pas de stable. */
export function idEvenementMoneroo(corpsBrut: string): string {
  return `moneroo-${crypto.createHash('sha256').update(corpsBrut).digest('hex').slice(0, 32)}`;
}
