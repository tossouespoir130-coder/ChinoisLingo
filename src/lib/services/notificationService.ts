import { createClient } from '@/lib/supabase/client';
import { NotificationItem as DbNotificationItem } from '@/lib/supabase/types';
import { initialNotifications, NotificationItem } from '@/lib/data/notificationsData';

function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('chinoislingo_proprietaire_local') || null;
  } catch {
    return null;
  }
}

export function getReadNotificationsKey(userId?: string | null): string {
  const uid = userId || getCurrentUserId();
  return uid ? `chinoislingo_read_notifications_${uid}` : 'chinoislingo_read_notifications';
}

export function getReadNotificationIds(userId?: string | null): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = getReadNotificationsKey(userId);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReadNotificationId(id: string, userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getReadNotificationsKey(userId);
    const existing = getReadNotificationIds(userId);
    if (!existing.includes(id)) {
      const updated = [...existing, id];
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('chinoislingo_notifications_updated'));
    }
  } catch {}
}

export function saveAllReadNotificationIds(ids: string[], userId?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const key = getReadNotificationsKey(userId);
    const existing = getReadNotificationIds(userId);
    const merged = Array.from(new Set([...existing, ...ids]));
    localStorage.setItem(key, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('chinoislingo_notifications_updated'));
  } catch {}
}

export async function fetchMergedNotifications(userId?: string | null): Promise<NotificationItem[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const activeUserId = userId || user?.id || getCurrentUserId();
  const readIds = getReadNotificationIds(activeUserId);
  let dbNotifs: DbNotificationItem[] = [];

  try {
    dbNotifs = await fetchNotifications();
  } catch {}

  const dbIds = new Set(initialNotifications.map(n => n.id));
  const additionalNotifs: NotificationItem[] = dbNotifs
    .filter(n => !dbIds.has(n.id))
    .map((n) => ({
      id: n.id,
      source: (n.source === 'founder' ? 'founder' : n.source === 'mascot' ? 'mascot' : 'system') as 'founder' | 'mascot' | 'system',
      founderName: n.source === 'founder' ? 'Espoir Chinois' : undefined,
      founderRole: n.source === 'founder' ? 'Fondateur de ChinoisLingo' : undefined,
      founderAvatar: '/espoir-chinois.jpg',
      mascotName: n.source === 'mascot' ? 'Xiao Li (小李)' : undefined,
      mascotRole: n.source === 'mascot' ? 'Mascotte ChinoisLingo 🐾' : undefined,
      mascotAvatar: '/icons/xiaoli.png',
      title: n.title,
      message: n.message,
      timestamp: 'Récemment',
      isRead: !!n.is_read || readIds.includes(n.id),
      actionUrl: n.action_url || '/mon-compte',
      actionLabel: 'Voir mes trophées',
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

export async function markNotificationAsRead(id: string, userId?: string | null): Promise<boolean> {
  saveReadNotificationId(id, userId);

  const supabase = createClient();
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  return !error;
}

export async function markAllNotificationsAsRead(ids: string[], userId?: string | null): Promise<void> {
  saveAllReadNotificationIds(ids, userId);

  const supabase = createClient();
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', ids);
  } catch {}
}

/**
 * Crée une notification in-app envoyée par la mascotte officielle Xiao Li (小李)
 * lors du déblocage d'un nouveau palier / trophée.
 * Respecte rigoureusement la salutation officielle Nǐhǎo et le tutoiement chaleureux.
 */
export async function createBadgeUnlockedNotification(
  userId: string,
  badge: { id: string; title: string; trackName: string; xpReward: number; icon: string }
): Promise<void> {
  if (!userId) return;

  const notifId = `badge_notif_${badge.id}_${userId}`;
  const notifKey = `chinoislingo_badge_notified_${notifId}`;

  // Vérifier qu'on n'a pas déjà créé la notification pour ce badge précis
  if (typeof window !== 'undefined') {
    try {
      if (localStorage.getItem(notifKey)) return;
      localStorage.setItem(notifKey, '1');
    } catch {}
  }

  const supabase = createClient();
  try {
    await supabase.from('notifications').insert({
      id: notifId,
      user_id: userId,
      source: 'mascot',
      title: `🏆 Trophée Débloqué : ${badge.title} ${badge.icon}`,
      message: `Félicitations pour ton nouvel exploit : tu as franchi l’étape "${badge.title}" (${badge.trackName}) ! Continue comme ça, le chinois devient facile !`,
      action_url: '/mon-compte',
      is_read: false,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('chinoislingo_notifications_updated'));
    }
  } catch (err) {
    console.error('Erreur insertion notification badge:', err);
  }
}

