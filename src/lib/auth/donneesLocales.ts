/**
 * Données d'un compte gardées dans le navigateur (caches du tableau de bord,
 * photo, lectures terminées…) — à effacer quand le compte change.
 *
 * Sans cela, sur un appareil partagé, l'apprenant suivant voyait les
 * statistiques, le nom et la photo du précédent, même après sa déconnexion.
 *
 * Restent en place les réglages propres à l'appareil : thème, affichage du
 * pinyin, vitesse audio, etc.
 */

/** Identifiant du dernier compte connecté dans ce navigateur. */
const CLE_PROPRIETAIRE = 'chinoislingo_proprietaire_local';

const CLES_LOCALES_DU_COMPTE = [
  'chinoislingo_user_dashboard_stats',
  'chinoislingo_user_profile_data',
  'chinoislingo_user_raw_photo',
  'chinoislingo_completed_readings',
  'chinoislingo_recent_activities',
  'chinoislingo_read_notifications',
  'chinoislingo_dismissed_content_toast',
  'chinoislingo_srs_reminder_last_shown',
];

const PREFIXES_LOCAUX_DU_COMPTE = ['chinoislingo_study_min_'];

const CLES_SESSION_DU_COMPTE = [
  'chinoislingo_active_reading_id',
  'chinoislingo_active_ep_idx',
  'chinoislingo_active_course_id',
  'chinoislingo_active_lesson_id',
  'chinoislingo_srs_reminder_dismissed',
  'chinoislingo_onboarding_draft',
];

/** Préférences : réglages d'appareil conservés, identité du compte retirée. */
const CLE_PREFERENCES = 'chinoislingo_user_preferences';
const CHAMPS_IDENTITE_PREFERENCES = ['userName', 'userAvatar'];

export function purgerDonneesLocalesDuCompte(): void {
  if (typeof window === 'undefined') return;
  try {
    CLES_LOCALES_DU_COMPTE.forEach((cle) => localStorage.removeItem(cle));
    Object.keys(localStorage)
      .filter((cle) => PREFIXES_LOCAUX_DU_COMPTE.some((prefixe) => cle.startsWith(prefixe)))
      .forEach((cle) => localStorage.removeItem(cle));

    const preferences = localStorage.getItem(CLE_PREFERENCES);
    if (preferences) {
      const parsees = JSON.parse(preferences);
      CHAMPS_IDENTITE_PREFERENCES.forEach((champ) => delete parsees[champ]);
      localStorage.setItem(CLE_PREFERENCES, JSON.stringify(parsees));
    }

    CLES_SESSION_DU_COMPTE.forEach((cle) => sessionStorage.removeItem(cle));
    localStorage.removeItem(CLE_PROPRIETAIRE);
  } catch {
    // Stockage indisponible (navigation privée, quota) : rien à purger.
  }
}

/**
 * À appeler dès qu'une session est connue : si un AUTRE compte avait utilisé
 * ce navigateur, ses données sont effacées avant tout affichage.
 * Couvre les cas sans déconnexion explicite (session expirée, lien de
 * réinitialisation ouvert pour un autre compte…).
 */
export function associerDonneesLocalesAuCompte(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const precedent = localStorage.getItem(CLE_PROPRIETAIRE);
    if (precedent && precedent !== userId) purgerDonneesLocalesDuCompte();
    localStorage.setItem(CLE_PROPRIETAIRE, userId);
  } catch {
    // Stockage indisponible : rien à associer.
  }
}
