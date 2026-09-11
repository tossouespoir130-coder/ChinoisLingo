import 'server-only';

import crypto from 'node:crypto';

/**
 * Lien de désabonnement des relances commerciales (J+3 et J+7).
 *
 * Il doit fonctionner SANS connexion : l'abonnement de l'apprenant est
 * terminé, et rien ne dit qu'il aura une session ouverte en lisant l'e-mail.
 * L'identifiant voyage donc accompagné d'une signature HMAC — sans elle,
 * n'importe qui pourrait désabonner n'importe quel compte en devinant un
 * identifiant.
 *
 * La clé est `SUPABASE_SERVICE_ROLE_KEY`, déjà indispensable au serveur :
 * aucune variable d'environnement supplémentaire à poser. Le préfixe
 * « desabonnement: » isole cet usage de tout autre emploi de cette clé.
 */

export interface LiensDesabonnement {
  /** Page de confirmation, mise en pied d'e-mail. */
  page: string;
  /**
   * Point d'entrée du bouton « Se désabonner » de Gmail et d'Apple Mail, qui
   * envoie un POST direct (RFC 8058).
   */
  unClic: string;
}

function cleSignature(): string {
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!cle) throw new Error('SUPABASE_SERVICE_ROLE_KEY absente de l\'environnement.');
  return cle;
}

export function signerDesabonnement(userId: string): string {
  return crypto
    .createHmac('sha256', cleSignature())
    .update(`desabonnement:${userId}`)
    .digest('hex');
}

/** Comparaison à temps constant, comme pour la signature des webhooks. */
export function verifierDesabonnement(userId: string, signature: string | null): boolean {
  if (!userId || !signature) return false;

  const attendu = Buffer.from(signerDesabonnement(userId));
  const recu = Buffer.from(signature);
  // timingSafeEqual lève une exception si les longueurs diffèrent.
  return recu.length === attendu.length && crypto.timingSafeEqual(recu, attendu);
}

export function lienDesabonnement(base: string, userId: string): LiensDesabonnement {
  const parametres = `u=${encodeURIComponent(userId)}&s=${signerDesabonnement(userId)}`;
  return {
    page: `${base}/desabonnement?${parametres}`,
    unClic: `${base}/api/emails/desabonnement?${parametres}`,
  };
}
