import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** En dessous de ce nombre de participants, un classement n'a pas de sens. */
const MINIMUM_PARTICIPANTS = 3;

/**
 * GET /api/classement
 *
 * Classement communautaire construit sur des comptes REELS.
 *
 * Il affichait auparavant une liste inventee (Aminata Diallo, Koffi Mensah,
 * Fatou Traore...) identique pour tout le monde. On lit desormais les vrais
 * profils, cote serveur : RLS empeche le navigateur de lire autre chose que
 * sa propre ligne, ce qui rend une route necessaire.
 *
 * Seuls le nom d'affichage et le score sortent d'ici — jamais les adresses
 * e-mail ni aucune donnee de facturation.
 */
export async function GET(requete: Request) {
  if (!configurationAdminPrete()) {
    return NextResponse.json({ classement: [], participants: 0 });
  }

  // Reserve aux comptes connectes : le classement n'est pas public.
  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data, error, count } = await admin
    .from('profiles')
    .select('id, full_name, username, avatar_url, total_words_mastered, streak_days', {
      count: 'exact',
    })
    .gt('total_words_mastered', 0)
    .order('total_words_mastered', { ascending: false })
    .limit(10);

  if (error) {
    console.error('[classement] lecture impossible', error);
    return NextResponse.json({ classement: [], participants: 0 });
  }

  const participants = count ?? 0;

  // Tant que la communaute est trop petite, on renvoie une liste vide plutot
  // qu'un classement d'une seule personne, qui n'apprendrait rien.
  if (participants < MINIMUM_PARTICIPANTS) {
    return NextResponse.json({ classement: [], participants });
  }

  return NextResponse.json({
    participants,
    classement: (data ?? []).map((p, index) => ({
      rang: index + 1,
      id: p.id,
      nom: p.full_name || p.username || 'Apprenant',
      avatarUrl: p.avatar_url,
      motsMaitrises: p.total_words_mastered ?? 0,
      serie: p.streak_days ?? 0,
      estMoi: p.id === utilisateur.id,
    })),
  });
}
