/**
 * Utilitaires de dates et fuseaux horaires pour ChinoisLingo
 *
 * Fuseau de référence : Afrique de l'Ouest (UTC+1 / Africa/Porto-Novo, Lagos, Cotonou).
 * Garantit que les resets hebdomadaires et l'enregistrement journalier
 * correspondent exactement au rythme de vie de la communauté (lundi 00:00).
 */

export const FUSEAU_AFRIQUE_OUEST = 'Africa/Porto-Novo'; // UTC+1 (Bénin, Nigéria, Niger, Cameroun...)

/**
 * Retourne la date calendaire actuelle au format `YYYY-MM-DD` en UTC+1.
 */
export function getDateStringWAT(date: Date = new Date()): string {
  try {
    const formatter = new Intl.DateTimeFormat('fr-CA', {
      timeZone: FUSEAU_AFRIQUE_OUEST,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(date); // Format standard 'YYYY-MM-DD'
  } catch {
    // Repli sécurisé si Intl timeZone n'est pas supporté
    const nowUtc = date.getTime();
    const watTime = new Date(nowUtc + 1 * 3600 * 1000); // UTC + 1 heure
    return watTime.toISOString().split('T')[0];
  }
}

export interface WeekRangeWAT {
  lundiStr: string; // Ex: '2026-09-28'
  dimancheStr: string; // Ex: '2026-10-04'
  joursSemaine: string[]; // Liste des 7 dates YYYY-MM-DD
}

/**
 * Calcule la plage de la semaine calendaire en cours (Lundi 00:00 au Dimanche 23:59)
 * en heure d'Afrique de l'Ouest (UTC+1).
 */
export function getCurrentWeekRangeWAT(date: Date = new Date()): WeekRangeWAT {
  const todayStr = getDateStringWAT(date);
  const [year, month, day] = todayStr.split('-').map(Number);

  // Construire un objet Date de référence à midi UTC pour éviter tout décalage d'heure d'été
  const refDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  
  // Jour de la semaine (0 = Dimanche, 1 = Lundi, 2 = Mardi... 6 = Samedi)
  const dayOfWeek = refDate.getUTCDay();
  // Distance en jours par rapport au lundi précédent (si Dimanche (0) -> 6 jours en arrière)
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lundiDate = new Date(refDate.getTime() - diffToMonday * 86400000);
  const joursSemaine: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(lundiDate.getTime() + i * 86400000);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(d.getUTCDate()).padStart(2, '0');
    joursSemaine.push(`${y}-${m}-${dayOfMonth}`);
  }

  return {
    lundiStr: joursSemaine[0],
    dimancheStr: joursSemaine[6],
    joursSemaine,
  };
}
