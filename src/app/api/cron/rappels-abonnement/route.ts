import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { configurationEmailPrete } from '@/lib/emails/resend';
import { envoyerRappelsEcheance } from '@/lib/emails/abonnement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Le plafond d'envois par exécution est calibré pour tenir dans cette durée.
export const maxDuration = 60;

/**
 * GET /api/cron/rappels-abonnement
 *
 * Déclenchée chaque matin par Vercel Cron (voir `vercel.json`) : prévient les
 * abonnés Mobile Money que leur accès se termine dans 7 puis 3 jours.
 *
 * Vercel envoie `Authorization: Bearer <CRON_SECRET>` dès que la variable
 * CRON_SECRET existe dans le projet. Sans elle, la route refuse tout appel :
 * n'importe qui pourrait sinon déclencher des envois.
 */
export async function GET(requete: Request) {
  if (!appelAutorise(requete.headers.get('authorization'))) {
    return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 });
  }

  if (!configurationAdminPrete() || !configurationEmailPrete()) {
    console.error('[cron rappels] configuration incomplète (Supabase ou Resend)');
    return NextResponse.json({ erreur: 'Configuration incomplète.' }, { status: 503 });
  }

  const bilan = await envoyerRappelsEcheance(createAdminClient());
  console.log('[cron rappels] bilan', bilan);

  return NextResponse.json(bilan, { status: bilan.erreur ? 500 : 200 });
}

/** Comparaison à temps constant, comme pour la signature des webhooks. */
function appelAutorise(entete: string | null): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret || !entete) return false;

  const attendu = Buffer.from(`Bearer ${secret}`);
  const recu = Buffer.from(entete);
  // timingSafeEqual lève une exception si les longueurs diffèrent.
  return recu.length === attendu.length && crypto.timingSafeEqual(recu, attendu);
}
