import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';
import { getServerExerciseSet } from '@/lib/server/exercisesCorrection';
import { peutOuvrirSerie } from '@/lib/server/exercicesAcces';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/exercices/revoir-erreurs
 * Body: { exerciseId: string }
 * 
 * 1. Vérifie la session utilisateur.
 * 2. Vérifie que l'utilisateur possède au moins UNE tentative 'completed' pour cette série.
 *    (Si aucune tentative terminée n'existe, retourne 403 Forbidden).
 * 3. Récupère les questions où `is_correct = false` lors de la dernière tentative.
 * 4. Renvoie ces questions avec leurs transcriptions complètes et la réponse
 *    donnée par l'apprenant, pour une révision guidée.
 * 5. Ne modifie strictement aucun score ni XP.
 */
export async function POST(requete: Request) {
  if (!configurationAdminPrete()) {
    return NextResponse.json(
      { erreur: 'Configuration serveur incomplète.' },
      { status: 503 }
    );
  }

  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  let body: { exerciseId?: unknown };
  try {
    body = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête JSON invalide.' }, { status: 400 });
  }

  const exerciseId = typeof body.exerciseId === 'string' ? body.exerciseId : '';
  if (!exerciseId) {
    return NextResponse.json({ erreur: 'Paramètre exerciseId manquant.' }, { status: 400 });
  }

  const exercise = getServerExerciseSet(exerciseId);
  if (!exercise) {
    return NextResponse.json({ erreur: 'Exercice introuvable.' }, { status: 404 });
  }
  // Un abonnement expiré ne doit plus donner accès aux corrections d'une série payante.
  if (!(await peutOuvrirSerie(exercise, utilisateur.id))) {
    return NextResponse.json(
      { erreur: 'Abonnement requis pour accéder aux séries au-delà du quota gratuit.' },
      { status: 403 }
    );
  }

  const admin = createAdminClient();

  // 1. Vérifier si l'utilisateur a une tentative terminée pour cette série
  const { data: lastCompletedAttempt, error: attemptError } = await admin
    .from('exercise_attempts')
    .select('id')
    .eq('user_id', utilisateur.id)
    .eq('exercise_id', exerciseId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (attemptError || !lastCompletedAttempt) {
    return NextResponse.json(
      { erreur: 'Accès refusé : vous devez terminer une tentative sur cette série avant de pouvoir revoir les erreurs.' },
      { status: 403 }
    );
  }

  // 2. Récupérer les identifiants de questions manquées
  const { data: wrongAnswers, error: answersError } = await admin
    .from('exercise_answers')
    .select('question_id, selected_choice_id, selected_boolean, selected_matches')
    .eq('attempt_id', lastCompletedAttempt.id)
    .eq('is_correct', false);

  if (answersError) {
    console.error('[exercices/revoir-erreurs] :', answersError.message);
    return NextResponse.json({ erreur: 'Impossible de charger vos erreurs. Réessayez.' }, { status: 500 });
  }

  const reponsesDonnees = new Map((wrongAnswers ?? []).map((a) => [a.question_id, a]));

  // Filtrer les questions manquées avec leurs corrections complètes polymorphiques
  const reviewQuestions = exercise.questions
    .filter((q) => reponsesDonnees.has(q.id))
    .map((q) => ({
      id: q.id,
      orderNumber: q.orderNumber,
      type: q.type || 'choice',
      audioUrl: q.audioUrl,
      question: q.question,
      choices: q.choices,
      correctChoiceId: q.correctChoiceId,
      dialogue: q.dialogue,
      imageUrl: q.imageUrl,
      imageAlt: q.imageAlt,
      audioText: q.audioText,
      correctValue: q.correctValue,
      images: q.images,
      dialogues: q.dialogues,
      correctMatches: q.correctMatches,
      explanationFr: q.explanationFr,
      keyVocabulary: q.keyVocabulary || [],
      votreReponse: {
        selectedChoiceId: reponsesDonnees.get(q.id)?.selected_choice_id ?? null,
        selectedBoolean: reponsesDonnees.get(q.id)?.selected_boolean ?? null,
        selectedMatches: (reponsesDonnees.get(q.id)?.selected_matches as Record<string, string> | null) ?? null,
      },
    }));

  return NextResponse.json({
    exerciseId,
    totalErrors: reviewQuestions.length,
    reviewQuestions,
  });
}
