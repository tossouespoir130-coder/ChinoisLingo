import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';
import { getServerExerciseSet } from '@/lib/server/exercisesCorrection';
import { estSerieReussie } from '@/lib/exercices/regles';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DUREE_MAX_SECONDES = 24 * 3600;

/**
 * POST /api/exercices/terminer
 * Body: { attemptId: string, timeSpentSeconds?: number, exerciseId?: string, localScore?: number }
 *
 * Le score est recalculé à partir des réponses enregistrées. Le meilleur score
 * n'est jamais écrasé par un résultat inférieur. Un second appel sur une
 * tentative déjà terminée renvoie le même résultat sans rien réécrire.
 * `exerciseId` et `localScore` ne servent qu'aux tentatives locales (base
 * indisponible) : le résultat est alors affiché mais pas enregistré.
 */
export async function POST(requete: Request) {
  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  let body: { attemptId?: unknown; timeSpentSeconds?: unknown; exerciseId?: unknown; localScore?: unknown };
  try {
    body = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête JSON invalide.' }, { status: 400 });
  }

  const attemptId = typeof body.attemptId === 'string' ? body.attemptId : '';
  if (!attemptId) {
    return NextResponse.json({ erreur: 'Paramètre attemptId manquant.' }, { status: 400 });
  }
  const dureeBrute = typeof body.timeSpentSeconds === 'number' ? body.timeSpentSeconds : 0;
  const timeSpentSeconds = Math.min(DUREE_MAX_SECONDES, Math.max(0, Math.round(dureeBrute) || 0));

  // ── Tentative locale : résultat affiché, rien n'est enregistré ──
  if (attemptId.startsWith('attempt_local_')) {
    const exercise = typeof body.exerciseId === 'string' ? getServerExerciseSet(body.exerciseId) : null;
    if (!exercise) {
      return NextResponse.json({ erreur: 'Exercice introuvable.' }, { status: 404 });
    }
    const totalQuestions = exercise.questions.length;
    const brut = typeof body.localScore === 'number' ? Math.round(body.localScore) : 0;
    const score = Math.min(totalQuestions, Math.max(0, brut));
    return NextResponse.json({
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      bestScore: score,
      isSucceed: estSerieReussie(score, totalQuestions, exercise.rubrique),
      isNewBestScore: false,
      enregistre: false,
    });
  }

  if (!configurationAdminPrete()) {
    return NextResponse.json({ erreur: 'Configuration serveur incomplète.' }, { status: 503 });
  }
  const admin = createAdminClient();

  const { data: attempt, error: erreurTentative } = await admin
    .from('exercise_attempts')
    .select('id, user_id, exercise_id, status')
    .eq('id', attemptId)
    .maybeSingle();

  if (erreurTentative || !attempt) {
    return NextResponse.json({ erreur: 'Tentative introuvable.' }, { status: 404 });
  }
  if (attempt.user_id !== utilisateur.id) {
    return NextResponse.json(
      { erreur: 'Accès refusé : cette tentative appartient à un autre compte.' },
      { status: 403 }
    );
  }
  if (attempt.status === 'abandoned') {
    return NextResponse.json({ erreur: 'Cette tentative a été abandonnée.' }, { status: 409 });
  }

  const exercise = getServerExerciseSet(attempt.exercise_id);
  if (!exercise) {
    return NextResponse.json({ erreur: 'Exercice introuvable.' }, { status: 404 });
  }
  const totalQuestions = exercise.questions.length;

  const { data: answers, error: erreurReponses } = await admin
    .from('exercise_answers')
    .select('is_correct')
    .eq('attempt_id', attemptId);
  if (erreurReponses) {
    console.error('[exercices/terminer] Lecture des réponses impossible :', erreurReponses.message);
    return NextResponse.json({ erreur: 'Impossible de calculer le résultat. Réessayez.' }, { status: 500 });
  }

  const score = Math.min(totalQuestions, (answers ?? []).filter((a) => a.is_correct).length);
  const percentage = Math.round((score / totalQuestions) * 100);
  const isSucceed = estSerieReussie(score, totalQuestions, exercise.rubrique);

  const { data: precedent } = await admin
    .from('exercise_results')
    .select('best_score')
    .eq('user_id', utilisateur.id)
    .eq('exercise_id', attempt.exercise_id)
    .maybeSingle();

  const ancienRecord = precedent ? Math.min(precedent.best_score, totalQuestions) : null;
  const bestScore = Math.max(ancienRecord ?? 0, score);

  // Tentative déjà terminée : on renvoie le résultat sans le réenregistrer.
  if (attempt.status === 'completed') {
    return NextResponse.json({ score, totalQuestions, percentage, bestScore, isSucceed, isNewBestScore: false });
  }

  const maintenant = new Date().toISOString();
  const { error: erreurStatut } = await admin
    .from('exercise_attempts')
    .update({ status: 'completed', completed_at: maintenant })
    .eq('id', attemptId)
    .eq('status', 'in_progress');

  const { error: erreurResultat } = await admin.from('exercise_results').upsert(
    {
      user_id: utilisateur.id,
      exercise_id: attempt.exercise_id,
      score,
      total_questions: totalQuestions,
      percentage,
      best_score: bestScore,
      time_spent_seconds: timeSpentSeconds,
      completed_at: maintenant,
      updated_at: maintenant,
    },
    { onConflict: 'user_id,exercise_id' }
  );

  if (erreurStatut || erreurResultat) {
    console.error('[exercices/terminer] Résultat non enregistré :', (erreurStatut || erreurResultat)?.message);
    return NextResponse.json({ erreur: 'Impossible d’enregistrer le résultat. Réessayez.' }, { status: 500 });
  }

  return NextResponse.json({
    score,
    totalQuestions,
    percentage,
    bestScore,
    isSucceed,
    isNewBestScore: ancienRecord === null || score > ancienRecord,
  });
}
