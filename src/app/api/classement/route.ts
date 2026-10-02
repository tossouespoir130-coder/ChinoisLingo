import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';
import { getCurrentWeekRangeWAT } from '@/lib/dateUtils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** En dessous de ce nombre de participants, un classement n'a pas de sens. */
const MINIMUM_PARTICIPANTS = 1;

export interface LeaderboardItem {
  rang: number;
  id: string;
  nom: string;
  avatarUrl: string | null;
  score: number;
  joursConnexion: number;
  minutesEtudiees: number;
  serie: number;
  estMoi: boolean;
}

/**
 * GET /api/classement?vue=hebdo|tout-temps&limite=15
 *
 * Calcule le classement communautaire basé sur l'engagement réel :
 * - 1 jour de connexion = 20 points
 * - 1 minute passée dans l'app = 0,5 point (soit 30 pts par heure)
 *
 * - Vue hebdomadaire (par défaut) : remise à zéro chaque lundi 00:00 (UTC+1 Afrique de l'Ouest).
 * - Vue tout temps : engagement historique cumulé.
 * - Le score est calculé pour 100% des utilisateurs de la base de données.
 */
export async function GET(requete: Request) {
  if (!configurationAdminPrete()) {
    return NextResponse.json({ classement: [], participants: 0, maPosition: null });
  }

  // Réservé aux comptes connectés
  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  const { searchParams } = new URL(requete.url);
  const vue = searchParams.get('vue') === 'tout-temps' ? 'tout-temps' : 'hebdo';
  const limite = Math.max(5, Math.min(100, Number(searchParams.get('limite')) || 15));

  const admin = createAdminClient();

  // 1. Récupérer tous les profils (sans exposer d'e-mail ni données sensibles)
  const { data: profils, error: erreurProfils } = await admin
    .from('profiles')
    .select('id, full_name, username, avatar_url, role, streak_days, total_login_days, total_minutes_learned, last_active_date');

  if (erreurProfils || !profils) {
    console.error('[classement] Erreur lecture profils:', erreurProfils);
    return NextResponse.json({ classement: [], participants: 0, maPosition: null });
  }

  // Filtrer les comptes administrateurs (Espoir Chinois / admins) pour ne classer que les véritables élèves
  const profilsEleves = profils.filter((p) => {
    const estAdmin = p.role === 'admin' || (p.full_name && p.full_name.toLowerCase().includes('espoir chinois'));
    return !estAdmin;
  });

  const weekRange = getCurrentWeekRangeWAT();

  // 2. Si vue hebdomadaire : récupérer l'activité journalière de la semaine pour tous
  let activitesHebdo: { user_id: string; jour: string; minutes: number | null }[] = [];
  if (vue === 'hebdo') {
    const { data: actData, error: errAct } = await admin
      .from('daily_activity')
      .select('user_id, jour, minutes')
      .gte('jour', weekRange.lundiStr)
      .lte('jour', weekRange.dimancheStr);

    if (!errAct && actData) {
      activitesHebdo = actData;
    }
  }

  // Regrouper l'activité hebdo par utilisateur
  const userHebdoMap = new Map<string, { jours: Set<string>; minutes: number }>();
  if (vue === 'hebdo') {
    for (const a of activitesHebdo) {
      if (!userHebdoMap.has(a.user_id)) {
        userHebdoMap.set(a.user_id, { jours: new Set(), minutes: 0 });
      }
      const entry = userHebdoMap.get(a.user_id)!;
      if (a.jour) entry.jours.add(a.jour);
      entry.minutes += Math.max(0, Number(a.minutes) || 0);
    }
  }

  // 3. Calculer le score pour 100% des élèves de la base
  const allScoredUsers: LeaderboardItem[] = profilsEleves.map((p) => {
    let joursConnexion = 0;
    let minutesEtudiees = 0;
    let score = 0;

    if (vue === 'hebdo') {
      const hebdoData = userHebdoMap.get(p.id);
      joursConnexion = hebdoData ? hebdoData.jours.size : 0;
      minutesEtudiees = hebdoData ? Math.round(hebdoData.minutes) : 0;
      // Formule officielle : 1 jour = 20 pts, 1 min = 0.5 pt
      score = Math.round(joursConnexion * 20 + minutesEtudiees * 0.5);
    } else {
      joursConnexion = Number(p.total_login_days) || (p.streak_days ? 1 : 0);
      minutesEtudiees = Number(p.total_minutes_learned) || 0;
      score = Math.round(joursConnexion * 20 + minutesEtudiees * 0.5);
    }

    const nomAffiche = p.full_name || p.username || 'Apprenant ChinoisLingo';

    return {
      rang: 0, // sera calculé après le tri
      id: p.id,
      nom: nomAffiche,
      avatarUrl: p.avatar_url || null,
      score,
      joursConnexion,
      minutesEtudiees,
      serie: Number(p.streak_days) || 0,
      estMoi: p.id === utilisateur.id,
    };
  });

  // 4. Tri décroissant : par score DESC, puis par jours de connexion DESC, puis par série DESC
  allScoredUsers.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.joursConnexion !== a.joursConnexion) return b.joursConnexion - a.joursConnexion;
    return b.serie - a.serie;
  });

  // 5. Attribution des rangs stricts (1, 2, 3...)
  allScoredUsers.forEach((u, idx) => {
    u.rang = idx + 1;
  });

  // Identifier la position de l'utilisateur connecté dans TOUTE la base
  const maPosition = allScoredUsers.find((u) => u.estMoi) || null;

  // Filtrer les participants actifs pour le classement public
  // En hebdo : utilisateurs ayant au moins un score > 0 ou au moins 1 jour d'activité
  // En tout temps : tous ceux qui ont un score > 0
  const activeLeaderboard = allScoredUsers.filter((u) => u.score > 0 || u.estMoi);

  return NextResponse.json({
    vue,
    plageSemaine: {
      debut: weekRange.lundiStr,
      fin: weekRange.dimancheStr,
    },
    participants: allScoredUsers.length,
    participantsActifs: activeLeaderboard.length,
    maPosition,
    classement: activeLeaderboard.slice(0, limite),
  });
}
