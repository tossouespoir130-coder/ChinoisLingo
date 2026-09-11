import 'server-only';

/**
 * Adaptateur Resend — envoi des e-mails transactionnels.
 *
 * Appel REST direct plutôt que le SDK, comme pour Moneroo : aucune dépendance
 * supplémentaire, et changer de fournisseur (Brevo, Postmark…) ne demande de
 * réécrire que ce fichier.
 *
 * Documentation : https://resend.com/docs/api-reference/emails/send-email
 */

const RESEND_API_URL = 'https://api.resend.com/emails';
const DELAI_MAX_MS = 10_000;

/**
 * La configuration d'envoi est-elle complète ?
 *
 * Sans elle, aucun e-mail ne part, mais rien d'autre n'est affecté : les
 * paiements et les accès fonctionnent normalement.
 */
export function configurationEmailPrete(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_EXPEDITEUR);
}

export interface EmailAEnvoyer {
  a: string;
  sujet: string;
  html: string;
  texte: string;
}

export type ResultatEnvoi = { ok: true; id: string } | { ok: false; erreur: string };

/** Ne lève jamais d'exception : un e-mail manqué ne doit rien casser. */
export async function envoyerEmail(email: EmailAEnvoyer): Promise<ResultatEnvoi> {
  const cle = process.env.RESEND_API_KEY;
  const expediteur = process.env.EMAIL_EXPEDITEUR;
  if (!cle || !expediteur) {
    return { ok: false, erreur: 'RESEND_API_KEY ou EMAIL_EXPEDITEUR absente de l\'environnement.' };
  }

  const ctrl = new AbortController();
  const minuteur = setTimeout(() => ctrl.abort(), DELAI_MAX_MS);

  let reponse: Response;
  try {
    reponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cle}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: expediteur,
        to: [email.a],
        subject: email.sujet,
        html: email.html,
        text: email.texte,
        // Facultatif : sans adresse de réponse, les apprenants répondent à
        // l'expéditeur, souvent une adresse non surveillée.
        ...(process.env.EMAIL_REPONSE ? { reply_to: process.env.EMAIL_REPONSE } : {}),
      }),
      signal: ctrl.signal,
    });
  } catch (err) {
    return { ok: false, erreur: `Resend injoignable : ${(err as Error).message}` };
  } finally {
    clearTimeout(minuteur);
  }

  const json = (await reponse.json().catch(() => null)) as { id?: string; message?: string } | null;

  if (!reponse.ok || !json?.id) {
    return { ok: false, erreur: json?.message || `Resend a répondu ${reponse.status}.` };
  }

  return { ok: true, id: json.id };
}
