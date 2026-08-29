import { createClient } from '@/lib/supabase/client';
import { NotificationItem } from '@/lib/supabase/types';

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false });

  if (user) {
    query = query.or(`user_id.is.null,user_id.eq.${user.id}`);
  } else {
    query = query.is('user_id', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data || [];
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  return !error;
}
