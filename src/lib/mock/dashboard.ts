// Les jeux de données utilisateur factices — profil, série de jours,
// classement communautaire, courbes de performance, activités récentes — ont
// été retirés de ce fichier. Ils s'affichaient à l'identique pour tout le
// monde, y compris pour un compte créé à l'instant : un nouvel inscrit voyait
// le nom, la photo et les statistiques de quelqu'un d'autre.
//
// Ces valeurs viennent désormais de Supabase :
//   • profil et série       → `profiles` via AuthContext
//   • courbes du graphique  → `daily_activity` via dashboardService
//   • classement            → /api/classement, sur des comptes réels
//
// Ce fichier ne conserve que du CONTENU PÉDAGOGIQUE réel : le Mot du Jour,
// qui fait partie du catalogue de l'application et n'est pas une donnée
// utilisateur inventée.

export { getDailyWord, dailyWordsCatalog } from './dailyWords';
