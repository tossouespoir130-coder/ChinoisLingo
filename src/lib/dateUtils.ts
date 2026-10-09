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

export interface MonthRangeWAT {
  premierJourStr: string; // Ex: '2026-10-01'
  dernierJourStr: string; // Ex: '2026-10-31'
  nomMois: string;        // Ex: 'Octobre 2026'
  nomMoisCourt: string;   // Ex: 'Octobre'
  moisNum: number;        // 10
  anneeNum: number;       // 2026
}

/**
 * Calcule la plage du mois calendaire en cours (1er jour 00:00 au dernier jour 23:59)
 * en heure d'Afrique de l'Ouest (UTC+1).
 */
export function getCurrentMonthRangeWAT(date: Date = new Date()): MonthRangeWAT {
  const todayStr = getDateStringWAT(date);
  const [year, month] = todayStr.split('-').map(Number);

  const premierJourStr = `${year}-${String(month).padStart(2, '0')}-01`;

  // Dernier jour du mois via UTC (jour 0 du mois suivant)
  const dernierJourDate = new Date(Date.UTC(year, month, 0, 12, 0, 0));
  const dernierJour = String(dernierJourDate.getUTCDate()).padStart(2, '0');
  const dernierJourStr = `${year}-${String(month).padStart(2, '0')}-${dernierJour}`;

  const MOIS_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const nomMoisCourt = MOIS_FR[month - 1] || 'Mois en cours';
  const nomMois = `${nomMoisCourt} ${year}`;

  return {
    premierJourStr,
    dernierJourStr,
    nomMois,
    nomMoisCourt,
    moisNum: month,
    anneeNum: year,
  };
}

