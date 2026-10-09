import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/exercices/abandonner
 * Body: { attemptId: string }
 *
 * Marque comme abandonnée une tentative quittée en cours de route, pour
 * qu'elle ne reste pas « en cours » indéfiniment. Sans effet sur les scores.
 */
export async function POST(requete: Request) {
  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  let body: { attemptId?: unknown };
  try {
    body = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête JSON invalide.' }, { status: 400 });
  }

  const attemptId = typeof body.attemptId === 'string' ? body.attemptId : '';
  if (!attemptId || attemptId.startsWith('attempt_local_') || !configurationAdminPrete()) {
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from('exercise_attempts')
    .update({ status: 'abandoned' })
    .eq('id', attemptId)
    .eq('user_id', utilisateur.id)
    .eq('status', 'in_progress');

  if (error) {
    console.error('[exercices/abandonner] :', error.message);
    return NextResponse.json({ erreur: 'Impossible de fermer la tentative.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
