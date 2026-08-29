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
}
