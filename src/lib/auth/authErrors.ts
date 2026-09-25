/**
 * Traducteur et formateur des erreurs d'authentification Supabase.
 * Permet d'afficher des messages clairs, professionnels et rassurants en français.
 */

import { LONGUEUR_MIN_MOT_DE_PASSE } from './motDePasse';

export function traduireErreurAuth(erreur: any, contexte: 'connexion' | 'inscription' | 'reinitialisation' | 'motDePasse' = 'connexion'): string {
  if (!erreur) return 'Une erreur est survenue.';

  const message = typeof erreur === 'string' ? erreur : erreur.message || '';
  const code = erreur.code || '';
  const msgLower = message.toLowerCase();

  // 1. Quotas d'e-mails et Rate Limits (limite horaire Supabase par défaut)
  if (
    msgLower.includes('rate limit') ||
    msgLower.includes('over_email_send_rate_limit') ||
    code === 'over_email_send_rate_limit' ||
    msgLower.includes('too many requests') ||
    msgLower.includes('security purposes, you can only request')
  ) {
    return "Limite temporaire d'envoi d'e-mails atteinte. Pour des raisons de sécurité, veuillez patienter quelques minutes avant de faire une nouvelle demande.";
  }

  // 2. Identifiants invalides
  if (
    msgLower.includes('invalid login credentials') ||
    msgLower.includes('invalid_credentials') ||
    code === 'invalid_credentials'
  ) {
    return 'Adresse e-mail ou mot de passe incorrect.';
  }

  // 3. Compte déjà existant
  if (
    msgLower.includes('user already registered') ||
    msgLower.includes('already exists') ||
    code === 'user_already_exists'
  ) {
    return 'Un compte existe déjà avec cette adresse e-mail. Essayez de vous connecter.';
  }

  // 4. E-mail non confirmé
  if (
    msgLower.includes('email not confirmed') ||
    code === 'email_not_confirmed'
  ) {
    return "Votre adresse e-mail n'a pas encore été confirmée. Veuillez cliquer sur le lien envoyé dans votre boîte de réception.";
  }

  // 5. Mot de passe refusé par Supabase
  if (code === 'same_password' || msgLower.includes('should be different from the old password')) {
    return 'Le nouveau mot de passe doit être différent de l’ancien.';
  }
  if (code === 'weak_password' || msgLower.includes('password should')) {
    return `Mot de passe trop faible : ${LONGUEUR_MIN_MOT_DE_PASSE} caractères minimum, avec au moins une lettre et un chiffre.`;
  }
  if (msgLower.includes('current password') || msgLower.includes('current_password')) {
    return 'L’ancien mot de passe est incorrect.';
  }
  if (code === 'reauthentication_needed' || code === 'reauth_nonce_missing') {
    return 'Par sécurité, reconnectez-vous avant de modifier votre mot de passe.';
  }
  if (
    code === 'session_not_found' ||
    code === 'session_expired' ||
    msgLower.includes('auth session missing')
  ) {
    return contexte === 'motDePasse'
      ? 'Votre session a expiré. Demandez un nouveau lien de réinitialisation ou reconnectez-vous.'
      : 'Votre session a expiré. Veuillez vous reconnecter.';
  }

  // 6. E-mail invalide
  if (msgLower.includes('invalid email') || msgLower.includes('unable to validate email')) {
    return 'Veuillez saisir une adresse e-mail valide.';
  }

  // 7. Erreurs réseau / serveur
  if (msgLower.includes('fetch') || msgLower.includes('network')) {
    return 'Problème de connexion réseau. Veuillez vérifier votre connexion Internet.';
  }

  // Fallback contextuel
  if (contexte === 'motDePasse') {
    return 'Impossible de mettre à jour le mot de passe pour le moment. Réessayez dans un instant.';
  }

  if (contexte === 'reinitialisation') {
    return message || "Impossible d'envoyer l'e-mail de réinitialisation pour le moment.";
  }

  if (contexte === 'inscription') {
    return message || "Une erreur s'est produite lors de la création de votre compte.";
  }

  return message || 'Une erreur inattendue est survenue.';
}
