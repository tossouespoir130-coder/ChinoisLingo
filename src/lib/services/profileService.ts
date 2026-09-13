import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/supabase/types';

export async function fetchUserProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function updateProfileSettings(updates: Partial<Profile>): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) {
    console.error('Error updating profile settings:', error);
    return false;
  }

  return true;
}

export async function recordDailyActivity(minutesToAdd: number = 0): Promise<Profile | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) return null;

  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.last_active_date ? String(profile.last_active_date).split('T')[0] : null;
  let newStreak = profile.streak_days || 1;

  if (lastActive) {
    if (lastActive === today) {
      // Déjà connecté aujourd'hui : on conserve la série actuelle intacte
      newStreak = profile.streak_days || 1;
    } else {
      // Comparaison en jours calendaires entiers UTC
      const [y1, m1, d1] = lastActive.split('-').map(Number);
      const [y2, m2, d2] = today.split('-').map(Number);
      const date1Utc = Date.UTC(y1, m1 - 1, d1);
      const date2Utc = Date.UTC(y2, m2 - 1, d2);
      const diffDays = Math.round((date2Utc - date1Utc) / 86400000);

      if (diffDays === 1) {
        // Connexion le lendemain consécutif : série + 1
        newStreak = (profile.streak_days || 0) + 1;
      } else if (diffDays > 1) {
        // Absence de 2 jours ou plus : la série recommence à 1
        newStreak = 1;
      }
    }
  } else {
    // Première connexion
    newStreak = 1;
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({
      streak_days: newStreak,
      last_active_date: today,
      total_minutes_learned: (profile.total_minutes_learned || 0) + minutesToAdd,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)
    .select('*')
    .single();

  if (updateError) {
    console.error('[ChinoisLingo] Erreur mise à jour streak:', updateError);
  }

  // Historique quotidien reel, qui alimente le graphique du tableau de bord.
  // Sans lui, la courbe ne pouvait qu'etre fabriquee a partir du total.
  const { data: jourExistant } = await supabase
    .from('daily_activity')
    .select('minutes')
    .eq('user_id', user.id)
    .eq('jour', today)
    .maybeSingle();

  const { error: erreurActivite } = await supabase.from('daily_activity').upsert(
    {
      user_id: user.id,
      jour: today,
      minutes: (jourExistant?.minutes ?? 0) + minutesToAdd,
    },
    { onConflict: 'user_id,jour' }
  );

  // Une mesure manquee ne doit jamais interrompre la session de l'apprenant.
  signalerErreurActivite('recordDailyActivity', erreurActivite);

  return updatedProfile || null;
}

/** Codes renvoyes par PostgREST quand la table n'existe pas encore. */
const TABLE_ABSENTE = ['PGRST205', '42P01'];

let migrationDejaSignalee = false;

/**
 * Journalise une erreur d'historique de maniere exploitable.
 *
 * Deux problemes traites ici :
 *   • Une `PostgrestError` n'est pas un objet ordinaire : `console.error(err)`
 *     l'affichait comme `{}`, sans le moindre indice sur la cause.
 *   • Tant que la migration `daily_activity` n'est pas passee, l'erreur se
 *     repete a chaque chargement de page. On n'avertit donc qu'une seule fois,
 *     avec un message qui dit quoi faire.
 */
function signalerErreurActivite(
  origine: string,
  erreur: { code?: string; message?: string; details?: string | null } | null
): void {
  if (!erreur) return;

  if (erreur.code && TABLE_ABSENTE.includes(erreur.code)) {
    if (migrationDejaSignalee) return;
    migrationDejaSignalee = true;
    console.warn(
      "[ChinoisLingo] L'historique d'activite n'est pas encore enregistre : " +
        'la table `daily_activity` est absente. Executez la migration ' +
        '20260905120000_historique_activite_reelle.sql. Le reste de ' +
        "l'application fonctionne normalement."
    );
    return;
  }

  console.error(
    `[ChinoisLingo] ${origine} — ${erreur.code ?? 'erreur'} : ` +
      `${erreur.message ?? 'cause inconnue'}${erreur.details ? ` (${erreur.details})` : ''}`
  );
}

/**
 * Nombre de mots enregistres a ce jour, fige dans l'historique du jour.
 * Appele apres l'ajout ou la suppression d'un mot pour que la courbe de
 * progression reflete la realite plutot qu'une repartition calculee.
 */
export async function recordWordCount(total: number): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase.from('daily_activity').upsert(
    { user_id: user.id, jour: today, mots_maitrises: total },
    { onConflict: 'user_id,jour' }
  );

  signalerErreurActivite('recordWordCount', error);
}
