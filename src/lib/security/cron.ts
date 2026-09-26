import 'server-only';
import crypto from 'node:crypto';

/**
 * Garde des routes /api/cron/*.
 *
 * Vercel envoie `Authorization: Bearer <CRON_SECRET>` dès que la variable
 * CRON_SECRET existe dans le projet. Sans elle, tout appel est refusé :
 * n'importe qui pourrait sinon déclencher des envois d'e-mails en masse.
 * Comparaison à temps constant, comme pour la signature des webhooks.
 */
export function appelCronAutorise(entete: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !entete) return false;

  const attendu = Buffer.from(`Bearer ${secret}`);
  const recu = Buffer.from(entete);
  // timingSafeEqual lève une exception si les longueurs diffèrent.
  return recu.length === attendu.length && crypto.timingSafeEqual(recu, attendu);
}
