import { createClient } from '@/lib/supabase/client';

/**
 * Adresse de retour du lien d'activation envoyé par Supabase.
 *
 * On garde `/connexion?confirme=1` : c'est l'adresse déjà autorisée dans les
 * « Redirect URLs » de Supabase (une adresse non autorisée y est remplacée en
 * silence par la « Site URL »), et c'est celle des e-mails déjà envoyés.
 * Le proxy la renvoie vers `/auth/confirmation`, qui affiche le vrai résultat.
 *
 * NEXT_PUBLIC_SITE_URL prime sur l'origine du navigateur : en développement
 * cette dernière vaut http://localhost:3000, une adresse injoignable depuis
 * le téléphone qui ouvre l'e-mail.
 */
export function lienRetourConfirmation(): string {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  return `${siteUrl}/connexion?confirme=1`;
}

/** Renvoie l'e-mail d'activation d'un compte non confirmé. */
export async function renvoyerEmailActivation(email: string) {
  const { error } = await createClient().auth.resend({
    type: 'signup',
    email: email.trim(),
    options: { emailRedirectTo: lienRetourConfirmation() },
  });
  return { error };
}

/**
 * Demande l'e-mail de bienvenue, une fois la session ouverte — donc une fois
 * l'adresse confirmée. Envoyé à l'inscription, il arrivait avant l'e-mail
 * d'activation : les apprenants cliquaient sur son bouton en le prenant pour
 * la confirmation, et leur compte restait inactif. Le serveur n'envoie qu'une
 * fois par compte ; les appels suivants sont refusés sans effet.
 */
export function demanderEmailBienvenue(jetonAcces: string): void {
  fetch('/api/emails/bienvenue', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jetonAcces}` },
  }).catch((err) => console.error('[auth] Erreur envoi email bienvenue', err));
}
