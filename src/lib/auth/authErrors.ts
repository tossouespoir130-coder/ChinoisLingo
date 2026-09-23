/**
 * Traducteur et formateur des erreurs d'authentification Supabase.
 * Permet d'afficher des messages clairs, professionnels et rassurants en français.
 */

export function traduireErreurAuth(erreur: any, contexte: 'connexion' | 'inscription' | 'reinitialisation' = 'connexion'): string {
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

  // 5. Longueur du mot de passe
  if (msgLower.includes('password should be at least')) {
    return 'Le mot de passe doit comporter au moins 6 caractères.';
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
  if (contexte === 'reinitialisation') {
    return message || "Impossible d'envoyer l'e-mail de réinitialisation pour le moment.";
  }

  if (contexte === 'inscription') {
    return message || "Une erreur s'est produite lors de la création de votre compte.";
  }

  return message || 'Une erreur inattendue est survenue.';
}
