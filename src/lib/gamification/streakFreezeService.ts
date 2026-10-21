/**
 * Service de gestion du Gel de Série (Streak Freeze ❄️)
 *
 * Règles :
 * - 1 Bouclier de Gel offert chaque mois civil à tous les apprenants.
 * - S'active automatiquement pour sauver une série en cas d'absence d'1 jour (diffDays === 2).
 * - RÈGLE FONDAMENTALE : Le gel de série est appliqué EXCLUSIVEMENT sur la journée MANQUÉE (le jour d'absence / hier),
 *   et JAMAIS sur la journée de connexion actuelle où l'apprenant est bien présent et actif !
 * - Renouvelé automatiquement le 1er jour de chaque mois.
 */

import { getDateStringWAT, getYesterdayStringWAT } from '@/lib/dateUtils';

export interface StreakFreezeStatus {
  isAvailable: boolean;
  isActive: boolean; // Le bouclier est armé et protège la série actuelle
  usedThisMonth: boolean;
  currentMonthKey: string; // Ex: '2026-10'
  lastUsedDate?: string | null;
}

const STORAGE_PREFIX = 'chinoislingo_streak_freeze_';

export function getCurrentMonthKey(): string {
  return getDateStringWAT().substring(0, 7);
}

/**
 * Récupère le statut du bouclier pour l'utilisateur, avec auto-réparation
 * si l'ancienne logique avait attribué la date d'aujourd'hui par erreur.
 */
export function getStreakFreezeStatus(userId?: string | null): StreakFreezeStatus {
  const currentMonthKey = getCurrentMonthKey();
  const todayStr = getDateStringWAT();
  const yesterdayStr = getYesterdayStringWAT();

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

      let lastUsedDate = parsed.lastUsedDate || null;

      // 🛡️ Auto-correction instantanée : si la date gelée enregistrée était aujourd'hui,
      // on la bascule immédiatement sur hier (le vrai jour manqué d'absence).
      if (lastUsedDate === todayStr) {
        lastUsedDate = yesterdayStr;
        parsed.lastUsedDate = yesterdayStr;
        localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(parsed));
      }

      return {
        isAvailable: !usedThisMonth,
        isActive: !usedThisMonth,
        usedThisMonth,
        currentMonthKey,
        lastUsedDate,
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

/**
 * Récupère les dates gelées par le bouclier avec auto-correction :
 * Si aujourd'hui s'y trouve par erreur, elle est remplacée par la date d'hier.
 */
export function getFrozenDates(userId?: string | null): string[] {
  if (!userId || typeof window === 'undefined') return [];

  const todayStr = getDateStringWAT();
  const yesterdayStr = getYesterdayStringWAT();

  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}dates_${userId}`);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        let dates = list.filter((d: unknown): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d));

        // 🛡️ Auto-réparation : si la date d'aujourd'hui est présente dans les dates gelées,
        // on la remplace immédiatement par le jour d'absence réel (hier).
        let hasChanged = false;
        if (dates.includes(todayStr)) {
          dates = dates.filter((d) => d !== todayStr);
          if (!dates.includes(yesterdayStr)) {
            dates.push(yesterdayStr);
          }
          hasChanged = true;
        }

        if (hasChanged) {
          localStorage.setItem(`${STORAGE_PREFIX}dates_${userId}`, JSON.stringify(dates));
          // Synchroniser aussi lastUsedDate du statut principal
          try {
            const rawStatus = localStorage.getItem(`${STORAGE_PREFIX}${userId}`);
            if (rawStatus) {
              const parsed = JSON.parse(rawStatus);
              if (parsed.lastUsedDate === todayStr) {
                parsed.lastUsedDate = yesterdayStr;
                localStorage.setItem(`${STORAGE_PREFIX}${userId}`, JSON.stringify(parsed));
              }
            }
          } catch {
            // ignore
          }
        }

        return dates;
      }
    }
  } catch {
    // ignore
  }

  return [];
}

/**
 * Consomme le bouclier de gel pour protéger la journée d'absence manquée.
 * @param userId L'identifiant de l'apprenant.
 * @param frozenDate La date d'absence manquée à geler. Si non fournie, c'est obligatoirement la veille (hier), JAMAIS aujourd'hui !
 */
export function consumeStreakFreeze(userId: string, frozenDate?: string): boolean {
  const currentMonthKey = getCurrentMonthKey();
  const todayStr = getDateStringWAT();
  const yesterdayStr = getYesterdayStringWAT();

  // 🛡️ Règle absolue : le gel protège TOUJOURS le jour d'absence manqué (hier).
  // Si frozenDate est absente ou égale à todayStr, on force la veille.
  const targetDate = (!frozenDate || frozenDate === todayStr) ? yesterdayStr : frozenDate;

  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${userId}`,
      JSON.stringify({
        usedMonth: currentMonthKey,
        lastUsedDate: targetDate,
        timestamp: Date.now(),
      })
    );

    addFrozenDate(userId, targetDate);

    // Émettre un événement pour notifier l'interface en direct
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('chinoislingo:streak_freeze_used', {
          detail: { userId, month: currentMonthKey, date: targetDate },
        })
      );
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Ajoute une date dans la liste des journées protégées par le gel de série.
 * Interdiction stricte d'ajouter la date d'aujourd'hui : un jour connecté est actif, pas gelé.
 */
export function addFrozenDate(userId: string, dateStr: string): boolean {
  if (!userId || typeof window === 'undefined') return false;

  const todayStr = getDateStringWAT();
  // Sécurité absolue : on ne gèle jamais la journée d'aujourd'hui
  if (dateStr === todayStr) {
    dateStr = getYesterdayStringWAT();
  }

  try {
    const dates = getFrozenDates(userId);
    if (!dates.includes(dateStr)) {
      dates.push(dateStr);
      localStorage.setItem(`${STORAGE_PREFIX}dates_${userId}`, JSON.stringify(dates));
    }
    return true;
  } catch {
    return false;
  }
}

export function isDateFrozen(userId: string | undefined | null, dateStr: string): boolean {
  const frozen = getFrozenDates(userId);
  return frozen.includes(dateStr);
}
