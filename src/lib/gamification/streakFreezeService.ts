/**
 * Service de gestion du Gel de Série (Streak Freeze ❄️)
 *
 * Règles :
 * - 1 Bouclier de Gel offert chaque mois civil à tous les apprenants.
 * - S'active automatiquement pour sauver une série en cas d'absence d'1 jour (diffDays === 2).
 * - Renouvelé automatiquement le 1er jour de chaque mois.
 */

export interface StreakFreezeStatus {
  isAvailable: boolean;
  isActive: boolean; // Le bouclier est armé et protège la série actuelle
  usedThisMonth: boolean;
  currentMonthKey: string; // Ex: '2026-10'
  lastUsedDate?: string | null;
}

const STORAGE_PREFIX = 'chinoislingo_streak_freeze_';

export function getCurrentMonthKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function getStreakFreezeStatus(userId?: string | null): StreakFreezeStatus {
  const currentMonthKey = getCurrentMonthKey();
  if (!userId) {
    return {
      isAvailable: true,
      isActive: true,
      usedThisMonth: false,
      currentMonthKey,
    };
  }

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      const usedMonth = parsed.usedMonth;
      const usedThisMonth = usedMonth === currentMonthKey;
      return {
        isAvailable: !usedThisMonth,
        isActive: !usedThisMonth,
        usedThisMonth,
        currentMonthKey,
        lastUsedDate: parsed.lastUsedDate || null,
      };
    }
  } catch {
    // ignore
  }

  // Par défaut, le bouclier est actif et disponible pour le mois en cours
  return {
    isAvailable: true,
    isActive: true,
    usedThisMonth: false,
    currentMonthKey,
  };
}

export function consumeStreakFreeze(userId: string): boolean {
  const currentMonthKey = getCurrentMonthKey();
  const today = new Date().toISOString().split('T')[0];

  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${userId}`,
      JSON.stringify({
        usedMonth: currentMonthKey,
        lastUsedDate: today,
        timestamp: Date.now(),
      })
    );

    // Émettre un événement pour notifier l'interface en direct
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('chinoislingo:streak_freeze_used', {
          detail: { userId, month: currentMonthKey, date: today },
        })
      );
    }
    return true;
  } catch {
    return false;
  }
}
