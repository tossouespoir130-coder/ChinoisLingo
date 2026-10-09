import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';
import { verifierRateLimit } from '@/lib/security/rateLimiter';
import { getServerExerciseSet, toClientExerciseSet } from '@/lib/server/exercisesCorrection';
import { peutOuvrirSerie } from '@/lib/server/exercicesAcces';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/exercices/demarrer
 * Body: { exerciseId: string }
 *
 * 1. Exige une session (les exercices sont dans l'espace connecté).
 * 2. Vérifie les droits : séries gratuites dans le quota par niveau (acces.ts),
 *    les autres réservées aux abonnés et administrateurs.
 * 3. Crée une tentative `exercise_attempts` (ou, si la base est indisponible,
 *    un identifiant local : la série reste jouable mais n'est pas enregistrée).
 * 4. Retourne l'attemptId et la projection sécurisée de l'exercice (sans réponses).
 */
export async function POST(requete: Request) {
  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  const limite = await verifierRateLimit(`exercices-demarrer:${utilisateur.id}`, 30, 300);
  if (!limite.autorise) {
    return NextResponse.json(
      { erreur: `Trop de tentatives. Réessayez dans ${limite.attenteSecondes} s.` },
      { status: 429 }
    );
  }

  let body: { exerciseId?: unknown };
  try {
    body = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête JSON invalide.' }, { status: 400 });
  }

  const exerciseId = typeof body.exerciseId === 'string' ? body.exerciseId : '';
  if (!exerciseId) {
    return NextResponse.json({ erreur: 'Identifiant d’exercice manquant.' }, { status: 400 });
  }

  const exercise = getServerExerciseSet(exerciseId);
  if (!exercise) {
    return NextResponse.json({ erreur: 'Exercice introuvable.' }, { status: 404 });
  }

  if (!(await peutOuvrirSerie(exercise, utilisateur.id))) {
    return NextResponse.json(
      { erreur: 'Abonnement requis pour accéder aux séries au-delà du quota gratuit.' },
      { status: 403 }
    );
  }

  let attemptId = `attempt_local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  if (configurationAdminPrete()) {
    const admin = createAdminClient();
    const { data: attempt, error } = await admin
      .from('exercise_attempts')
      .insert({ user_id: utilisateur.id, exercise_id: exercise.id, status: 'in_progress' })
      .select('id')
      .single();

    if (error || !attempt) {
      console.error('[exercices/demarrer] Tentative non enregistrée, mode local :', error?.message);
    } else {
      attemptId = attempt.id;
    }
  }

  return NextResponse.json({
    attemptId,
    exercise: toClientExerciseSet(exercise),
  });
}
