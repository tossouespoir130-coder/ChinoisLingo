import { createClient } from '@/lib/supabase/client';

/**
 * Adresse de retour du lien d'activation envoyé par Supabase.
 *
 * Elle doit figurer dans les « Redirect URLs » de Supabase : sinon, Supabase
 * la remplace EN SILENCE par la « Site URL » (la page d'accueil). C'est ce
 * qui arrivait en production : NEXT_PUBLIC_SITE_URL vaut l'adresse sans
 * « www », non autorisée, et chaque lien d'activation menait à l'accueil.
 * On prend donc l'origine réelle du navigateur (le domaine sans « www »
 * redirige vers « www », autorisée), sauf en développement, où
 * http://localhost:3000 serait injoignable depuis le téléphone qui ouvre
 * l'e-mail. Le proxy rattrape de toute façon les liens tombés sur l'accueil.
 *
 * On garde `/connexion?confirme=1`, celle des e-mails déjà envoyés : le proxy
 * la renvoie vers `/auth/confirmation`, qui affiche le vrai résultat.
 */
export function lienRetourConfirmation(): string {
  const siteConfigure = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (typeof window === 'undefined') return `${siteConfigure ?? ''}/connexion?confirme=1`;
  const enLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const base = enLocal && siteConfigure ? siteConfigure : window.location.origin;
  return `${base}/connexion?confirme=1`;
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
