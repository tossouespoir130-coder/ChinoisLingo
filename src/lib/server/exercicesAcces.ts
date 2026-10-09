import 'server-only';

import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { estSerieGratuite, type ServerExerciseSet } from '@/lib/server/exercisesCorrection';

/**
 * Accès complet côté serveur : abonné (période payée en cours) ou administrateur,
 * même règle que `accesComplet` dans l'interface.
 * Refuse en cas de doute (configuration absente, erreur de lecture) : une
 * série payante ne doit jamais s'ouvrir par défaut.
 */
export async function aAccesComplet(userId: string): Promise<boolean> {
  if (!configurationAdminPrete()) return false;

  const admin = createAdminClient();
  const { data: profil, error } = await admin
    .from('profiles')
    .select('role, current_period_end')
    .eq('id', userId)
    .maybeSingle();

  if (error || !profil) {
    if (error) console.error('[exercices] Lecture du profil impossible :', error.message);
    return false;
  }
  if (profil.role === 'admin') return true;
  return profil.current_period_end ? new Date(profil.current_period_end).getTime() > Date.now() : false;
}

/** L'utilisateur peut-il ouvrir cette série (gratuite, ou accès complet) ? */
export async function peutOuvrirSerie(set: ServerExerciseSet, userId: string): Promise<boolean> {
  if (estSerieGratuite(set)) return true;
  return aAccesComplet(userId);
}
