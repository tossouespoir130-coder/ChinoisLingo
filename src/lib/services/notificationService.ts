import { createClient } from '@/lib/supabase/client';
import { NotificationItem as DbNotificationItem } from '@/lib/supabase/types';
import { initialNotifications, NotificationItem } from '@/lib/data/notificationsData';

const LOCAL_STORAGE_KEY = 'chinoislingo_read_notifications';

export function getReadNotificationIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReadNotificationId(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getReadNotificationIds();
    if (!existing.includes(id)) {
      const updated = [...existing, id];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('chinoislingo_notifications_updated'));
    }
  } catch {}
}

export function saveAllReadNotificationIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getReadNotificationIds();
    const merged = Array.from(new Set([...existing, ...ids]));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('chinoislingo_notifications_updated'));
  } catch {}
}

export async function fetchMergedNotifications(): Promise<NotificationItem[]> {
  const readIds = getReadNotificationIds();
  let dbNotifs: DbNotificationItem[] = [];

  try {
    dbNotifs = await fetchNotifications();
  } catch {}

  const dbIds = new Set(initialNotifications.map(n => n.id));
  const additionalNotifs: NotificationItem[] = dbNotifs
    .filter(n => !dbIds.has(n.id))
    .map((n) => ({
      id: n.id,
      source: (n.source === 'founder' ? 'founder' : 'system') as 'founder' | 'system',
      founderName: n.source === 'founder' ? 'Espoir Chinois' : undefined,
      founderRole: n.source === 'founder' ? 'Fondateur de ChinoisLingo' : undefined,
      founderAvatar: '/espoir-chinois.jpg',
      title: n.title,
      message: n.message,
      timestamp: 'Récemment',
      isRead: !!n.is_read || readIds.includes(n.id),
      actionUrl: n.action_url || '/tableau-de-bord',
      actionLabel: 'Consulter',
    }));

  const all = [...initialNotifications, ...additionalNotifs].map((n) => ({
    ...n,
    isRead: n.isRead || readIds.includes(n.id),
  }));

  return all;
}

export async function fetchNotifications(): Promise<DbNotificationItem[]> {
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
  saveReadNotificationId(id);

  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  return !error;
}

export async function markAllNotificationsAsRead(ids: string[]): Promise<void> {
  saveAllReadNotificationIds(ids);

  const supabase = createClient();
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', ids);
  } catch {}
}

