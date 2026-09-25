/**
 * Règles du mot de passe et marqueur de réinitialisation — source unique,
 * partagée par l'inscription, la réinitialisation et Mon Compte.
 */

/** Longueur minimale d'un nouveau mot de passe. À aligner dans Supabase (Auth → Providers → Email). */
export const LONGUEUR_MIN_MOT_DE_PASSE = 8;

/** Texte d'aide affiché sous les champs « nouveau mot de passe ». */
export const CONSIGNE_MOT_DE_PASSE = `${LONGUEUR_MIN_MOT_DE_PASSE} caractères minimum, avec au moins une lettre et un chiffre`;

/**
 * Valide un NOUVEAU mot de passe (jamais à la connexion : les comptes créés
 * avant le durcissement de la règle doivent pouvoir continuer à se connecter).
 * Retourne le message d'erreur à afficher, ou `null` si le mot de passe convient.
 */
export function validerNouveauMotDePasse(motDePasse: string, confirmation?: string): string | null {
  if (!motDePasse) return 'Veuillez saisir votre nouveau mot de passe.';
  if (motDePasse.length < LONGUEUR_MIN_MOT_DE_PASSE) {
    return `Le mot de passe doit comporter au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères.`;
  }
  if (!/\p{L}/u.test(motDePasse) || !/\d/.test(motDePasse)) {
    return 'Le mot de passe doit contenir au moins une lettre et un chiffre.';
  }
  if (motDePasse.trim() !== motDePasse) {
    return 'Le mot de passe ne doit pas commencer ni se terminer par un espace.';
  }
  if (confirmation !== undefined && motDePasse !== confirmation) {
    return 'Les deux mots de passe ne correspondent pas.';
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────
// Marqueur de réinitialisation
// ─────────────────────────────────────────────────────────────────────────

/**
 * Preuve qu'un lien « mot de passe oublié » vient d'être ouvert.
 *
 * La page /reinitialisation-mot-de-passe ne demande pas l'ancien mot de passe :
 * elle ne doit donc s'ouvrir QUE pour une session issue d'un lien de
 * récupération — jamais pour une session ordinaire, sinon n'importe qui devant
 * un appareil resté connecté contournerait la vérification de Mon Compte.
 *
 * Posé par la route /auth/callback (lien vérifié côté serveur) ou par le
 * navigateur à la réception de l'événement Supabase `PASSWORD_RECOVERY`.
 * Durée de vie courte : le temps de choisir un nouveau mot de passe.
 */
export const COOKIE_RECUPERATION = 'chinoislingo_recuperation';
export const DUREE_RECUPERATION_SECONDES = 15 * 60;

export function marquerRecuperation(): void {
  if (typeof document === 'undefined') return;
  const securise = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_RECUPERATION}=1; Path=/; Max-Age=${DUREE_RECUPERATION_SECONDES}; SameSite=Lax${securise}`;
}

export function recuperationActive(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith(`${COOKIE_RECUPERATION}=`));
}

export function effacerRecuperation(): void {
  if (typeof document === 'undefined') return;
  const securise = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_RECUPERATION}=; Path=/; Max-Age=0; SameSite=Lax${securise}`;
}
