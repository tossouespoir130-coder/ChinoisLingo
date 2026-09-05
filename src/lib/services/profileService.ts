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

export async function recordDailyActivity(minutesToAdd: number = 0): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak_days, last_active_date, total_minutes_learned')
    .eq('id', user.id)
    .single();

  if (!profile) return;

  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.last_active_date;
  let newStreak = profile.streak_days || 1;

  if (lastActive) {
    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1; // reset streak if missed a day
    }
  }

  await supabase
    .from('profiles')
    .update({
      streak_days: newStreak,
      last_active_date: today,
      total_minutes_learned: (profile.total_minutes_learned || 0) + minutesToAdd,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

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
