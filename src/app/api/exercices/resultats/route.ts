import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/exercices/resultats
 * Récupère tous les résultats et records de l'utilisateur connecté.
 */
export async function GET(requete: Request) {
  if (!configurationAdminPrete()) {
    return NextResponse.json({ resultats: {} });
  }

  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: results, error } = await admin
    .from('exercise_results')
    .select('exercise_id, score, total_questions, percentage, best_score, time_spent_seconds, completed_at')
    .eq('user_id', utilisateur.id);

  if (error) {
    console.error('[exercices/resultats] Erreur:', error);
    return NextResponse.json({ resultats: {} });
  }

  const resultMap: Record<string, {
    score: number;
    totalQuestions: number;
    percentage: number;
    bestScore: number;
    timeSpentSeconds: number;
    completedAt: string | null;
  }> = {};

  results?.forEach((r) => {
    resultMap[r.exercise_id] = {
      score: r.score,
      totalQuestions: r.total_questions,
      percentage: r.percentage,
      bestScore: r.best_score,
      timeSpentSeconds: r.time_spent_seconds ?? 0,
      completedAt: r.completed_at,
    };
  });

  return NextResponse.json({ resultats: resultMap });
}
