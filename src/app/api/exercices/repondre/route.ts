import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';
import { verifierRateLimit } from '@/lib/security/rateLimiter';
import { getServerQuestion } from '@/lib/server/exercisesCorrection';
import { peutOuvrirSerie } from '@/lib/server/exercicesAcces';
import type { Database } from '@/lib/supabase/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ReponseInsert = Database['public']['Tables']['exercise_answers']['Insert'];

/**
 * POST /api/exercices/repondre
 * Body:
 *   - { attemptId, questionId, selectedChoiceId: string } (type 'choice')
 *   - { attemptId, questionId, selectedBoolean: boolean } (type 'true_false')
 *   - { attemptId, questionId, selectedMatches: Record<string, string> } (type 'matching_images')
 *
 * La correction n'est renvoyée qu'à un utilisateur connecté ayant accès à la
 * série, pour une tentative qui lui appartient, en cours, et qui porte sur la
 * même série que la question. Une même question ne peut être répondue qu'une
 * fois par tentative (contrainte d'unicité en base).
 */
export async function POST(requete: Request) {
  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  const limite = await verifierRateLimit(`exercices-repondre:${utilisateur.id}`, 120, 300);
  if (!limite.autorise) {
    return NextResponse.json(
      { erreur: `Trop de réponses envoyées. Réessayez dans ${limite.attenteSecondes} s.` },
      { status: 429 }
    );
  }

  let body: {
    attemptId?: unknown;
    questionId?: unknown;
    selectedChoiceId?: unknown;
    selectedBoolean?: unknown;
    selectedMatches?: unknown;
  };
  try {
    body = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête JSON invalide.' }, { status: 400 });
  }

  const attemptId = typeof body.attemptId === 'string' ? body.attemptId : '';
  const questionId = typeof body.questionId === 'string' ? body.questionId : '';
  if (!attemptId || !questionId) {
    return NextResponse.json({ erreur: 'Paramètres manquants (attemptId, questionId).' }, { status: 400 });
  }

  // 1. Question et série (uniquement parmi les séries visibles)
  const trouve = getServerQuestion(questionId);
  if (!trouve) {
    return NextResponse.json({ erreur: 'Question introuvable.' }, { status: 404 });
  }
  const { set, question } = trouve;

  // 2. Droit d'accès à la série (une série payante ne se corrige pas sans abonnement)
  if (!(await peutOuvrirSerie(set, utilisateur.id))) {
    return NextResponse.json(
      { erreur: 'Abonnement requis pour accéder aux séries au-delà du quota gratuit.' },
      { status: 403 }
    );
  }

  // 3. Tentative : appartient à l'utilisateur, en cours, même série
  const tentativeLocale = attemptId.startsWith('attempt_local_');
  if (!tentativeLocale) {
    if (!configurationAdminPrete()) {
      return NextResponse.json({ erreur: 'Configuration serveur incomplète.' }, { status: 503 });
    }
    const admin = createAdminClient();
    const { data: attempt, error } = await admin
      .from('exercise_attempts')
      .select('id, user_id, exercise_id, status')
      .eq('id', attemptId)
      .maybeSingle();

    if (error || !attempt) {
      return NextResponse.json({ erreur: 'Tentative introuvable.' }, { status: 404 });
    }
    if (attempt.user_id !== utilisateur.id) {
      return NextResponse.json(
        { erreur: 'Accès refusé : cette tentative appartient à un autre compte.' },
        { status: 403 }
      );
    }
    if (attempt.exercise_id !== set.id) {
      return NextResponse.json({ erreur: 'Cette question n’appartient pas à la série en cours.' }, { status: 400 });
    }
    if (attempt.status !== 'in_progress') {
      return NextResponse.json({ erreur: 'Cette tentative est déjà finalisée ou fermée.' }, { status: 409 });
    }
  }

  // 4. Correction (une seule colonne de réponse est renseignée, selon le type)
  const qType = question.type || 'choice';
  let isCorrect = false;
  let reponse: Pick<ReponseInsert, 'selected_choice_id' | 'selected_boolean' | 'selected_matches'>;
  let correction: Record<string, unknown>;

  if (qType === 'true_false') {
    if (typeof body.selectedBoolean !== 'boolean') {
      return NextResponse.json(
        { erreur: 'Paramètre selectedBoolean (boolean) requis pour ce type de question.' },
        { status: 400 }
      );
    }
    isCorrect = body.selectedBoolean === question.correctValue;
    reponse = { selected_boolean: body.selectedBoolean };
    correction = {
      isCorrect,
      correctValue: question.correctValue,
      audioText: question.audioText,
      imageContent: question.imageContent,
      explanationFr: question.explanationFr,
      keyVocabulary: question.keyVocabulary || [],
    };
  } else if (qType === 'matching_images') {
    const choix = body.selectedMatches;
    if (!choix || typeof choix !== 'object' || Array.isArray(choix)) {
      return NextResponse.json(
        { erreur: 'Paramètre selectedMatches (objet) requis pour ce type de question.' },
        { status: 400 }
      );
    }
    const selectedMatches = choix as Record<string, unknown>;
    const dialoguesAttendus = (question.dialogues || []).map((d) => d.id).sort();
    const dialoguesFournis = Object.keys(selectedMatches).sort();
    if (
      dialoguesAttendus.length === 0 ||
      JSON.stringify(dialoguesAttendus) !== JSON.stringify(dialoguesFournis)
    ) {
      return NextResponse.json(
        { erreur: 'Requête invalide : chaque dialogue doit recevoir une association.' },
        { status: 400 }
      );
    }

    const imagesValides = new Set((question.images || []).map((img) => img.id));
    const imagesChoisies = Object.values(selectedMatches);
    if (
      !imagesChoisies.every((id) => typeof id === 'string' && imagesValides.has(id)) ||
      new Set(imagesChoisies).size !== imagesChoisies.length
    ) {
      return NextResponse.json(
        { erreur: 'Requête invalide : chaque image doit être associée une seule fois.' },
        { status: 400 }
      );
    }

    const attendu = question.correctMatches || {};
    isCorrect = dialoguesAttendus.every((id) => selectedMatches[id] === attendu[id]);
    reponse = { selected_matches: selectedMatches as Record<string, string> };
    correction = {
      isCorrect,
      correctMatches: question.correctMatches,
      images: question.images,
      dialogues: (question.dialogues || []).map((d) => ({ id: d.id, dialogue: d.dialogue })),
      explanationFr: question.explanationFr,
      keyVocabulary: question.keyVocabulary || [],
    };
  } else {
    const choisi = typeof body.selectedChoiceId === 'string' ? body.selectedChoiceId.trim().toUpperCase() : '';
    if (!choisi || !(question.choices || []).some((c) => c.id.toUpperCase() === choisi)) {
      return NextResponse.json(
        { erreur: 'Paramètre selectedChoiceId invalide pour cette question.' },
        { status: 400 }
      );
    }
    isCorrect = choisi === (question.correctChoiceId || '').trim().toUpperCase();
    reponse = { selected_choice_id: choisi };
    correction = {
      isCorrect,
      correctChoiceId: question.correctChoiceId,
      dialogue: question.dialogue,
      question: question.question,
      explanationFr: question.explanationFr,
      keyVocabulary: question.keyVocabulary || [],
    };
  }

  // 5. Enregistrement (sauf tentative locale). Sans enregistrement, la réponse
  // ne compterait pas dans le score : on le signale au lieu de l'ignorer.
  if (!tentativeLocale) {
    const admin = createAdminClient();
    const { error } = await admin.from('exercise_answers').insert({
      attempt_id: attemptId,
      user_id: utilisateur.id,
      exercise_id: set.id,
      question_id: questionId,
      is_correct: isCorrect,
      ...reponse,
    });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { erreur: 'Une réponse a déjà été soumise pour cette question dans cette tentative.' },
          { status: 409 }
        );
      }
      console.error('[exercices/repondre] Réponse non enregistrée :', error.message);
      return NextResponse.json({ erreur: 'Impossible d’enregistrer la réponse. Réessayez.' }, { status: 500 });
    }
  }

  return NextResponse.json(correction);
}
