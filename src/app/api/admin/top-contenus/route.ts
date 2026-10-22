import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { exigerAdmin } from '@/lib/admin/garde';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export interface ContenuStatItem {
  contentId: string;
  contentType: string;
  nbApprenants: number;
  nbTermines: number;
  tauxCompletion: number;
  nbFavoris: number;
  derniereActivite: string | null;
}

export interface TopContenusReponse {
  topContenus: ContenuStatItem[];
  statsGlobales: {
    totalContenusActifs: number;
    totalApprenantsUniques: number;
    totalTermines: number;
    tauxMoyenCompletion: number;
    repartitionParType: Record<string, number>;
  };
}

/**
 * GET /api/admin/top-contenus
 * Calcule en temps réel le classement des contenus les plus suivis
 * sur la plateforme (Écoute & Lecture, Formations, Exercices).
 */
export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const admin = createAdminClient();

  // Récupération simultanée des 3 tables de progression
  const [contentProgressRes, courseProgressRes, exerciseAttemptsRes] = await Promise.all([
    admin
      .from('content_progress')
      .select('content_id, content_type, is_completed, is_favorite, user_id, updated_at'),
    admin
      .from('course_progress')
      .select('course_id, lesson_id, is_completed, user_id, updated_at'),
    admin
      .from('exercise_attempts')
      .select('exercise_id, user_id, completed_at'),
  ]);

  if (contentProgressRes.error) {
    console.error('[admin top-contenus] Erreur content_progress:', contentProgressRes.error);
  }

  // Dictionnaire d'agrégation par content_id
  const statsMap = new Map<
    string,
    {
      contentId: string;
      contentType: string;
      apprenants: Set<string>;
      termines: Set<string>;
      nbFavoris: number;
      derniereActivite: string | null;
    }
  >();

  const tousApprenants = new Set<string>();
  const repartitionParType: Record<string, number> = {};

  // 1. Progression Écoute & Lecture (Histoires, Articles, Dialogues, Podcasts, Chansons, Exercices)
  (contentProgressRes.data || []).forEach((row) => {
    if (!row.content_id) return;
    const cid = row.content_id;
    const ctype = row.content_type || 'articles';

    if (!statsMap.has(cid)) {
      statsMap.set(cid, {
        contentId: cid,
        contentType: ctype,
        apprenants: new Set(),
        termines: new Set(),
        nbFavoris: 0,
        derniereActivite: row.updated_at || null,
      });
    }

    const item = statsMap.get(cid)!;
    if (row.user_id) {
      item.apprenants.add(row.user_id);
      tousApprenants.add(row.user_id);
      if (row.is_completed) {
        item.termines.add(row.user_id);
      }
    }
    if (row.is_favorite) {
      item.nbFavoris++;
    }

    if (row.updated_at && (!item.derniereActivite || row.updated_at > item.derniereActivite)) {
      item.derniereActivite = row.updated_at;
    }

    repartitionParType[ctype] = (repartitionParType[ctype] || 0) + 1;
  });

  // 2. Progression Formations / Cours
  (courseProgressRes.data || []).forEach((row) => {
    if (!row.course_id) return;
    const cid = row.course_id;
    const ctype = 'formations';

    if (!statsMap.has(cid)) {
      statsMap.set(cid, {
        contentId: cid,
        contentType: ctype,
        apprenants: new Set(),
        termines: new Set(),
        nbFavoris: 0,
        derniereActivite: row.updated_at || null,
      });
    }

    const item = statsMap.get(cid)!;
    if (row.user_id) {
      item.apprenants.add(row.user_id);
      tousApprenants.add(row.user_id);
      if (row.is_completed) {
        item.termines.add(row.user_id);
      }
    }

    if (row.updated_at && (!item.derniereActivite || row.updated_at > item.derniereActivite)) {
      item.derniereActivite = row.updated_at;
    }

    repartitionParType[ctype] = (repartitionParType[ctype] || 0) + 1;
  });

  // 3. Tentatives d'exercices
  (exerciseAttemptsRes.data || []).forEach((row) => {
    if (!row.exercise_id) return;
    const cid = row.exercise_id;
    const ctype = 'exercices';

    if (!statsMap.has(cid)) {
      statsMap.set(cid, {
        contentId: cid,
        contentType: ctype,
        apprenants: new Set(),
        termines: new Set(),
        nbFavoris: 0,
        derniereActivite: row.completed_at || null,
      });
    }

    const item = statsMap.get(cid)!;
    if (row.user_id) {
      item.apprenants.add(row.user_id);
      tousApprenants.add(row.user_id);
      // Pour un exercice avec score validé, on considère la tentative complétée
      item.termines.add(row.user_id);
    }

    if (row.completed_at && (!item.derniereActivite || row.completed_at > item.derniereActivite)) {
      item.derniereActivite = row.completed_at;
    }

    repartitionParType[ctype] = (repartitionParType[ctype] || 0) + 1;
  });

  // Transformation en liste triée par popularité
  const topContenus: ContenuStatItem[] = Array.from(statsMap.values())
    .map((item) => {
      const nbApprenants = item.apprenants.size;
      const nbTermines = item.termines.size;
      const tauxCompletion = nbApprenants > 0 ? Math.round((nbTermines / nbApprenants) * 100) : 0;

      return {
        contentId: item.contentId,
        contentType: item.contentType,
        nbApprenants,
        nbTermines,
        tauxCompletion,
        nbFavoris: item.nbFavoris,
        derniereActivite: item.derniereActivite,
      };
    })
    .sort((a, b) => {
      // 1. Plus grand nombre d'apprenants
      if (b.nbApprenants !== a.nbApprenants) {
        return b.nbApprenants - a.nbApprenants;
      }
      // 2. Plus grand nombre de complétions
      if (b.nbTermines !== a.nbTermines) {
        return b.nbTermines - a.nbTermines;
      }
      // 3. Date la plus récente
      return (b.derniereActivite || '').localeCompare(a.derniereActivite || '');
    });

  const totalTermines = topContenus.reduce((sum, item) => sum + item.nbTermines, 0);
  const sommeApprenants = topContenus.reduce((sum, item) => sum + item.nbApprenants, 0);
  const tauxMoyenCompletion = sommeApprenants > 0 ? Math.round((totalTermines / sommeApprenants) * 100) : 0;

  return NextResponse.json({
    topContenus,
    statsGlobales: {
      totalContenusActifs: topContenus.length,
      totalApprenantsUniques: tousApprenants.size,
      totalTermines,
      tauxMoyenCompletion,
      repartitionParType,
    },
  });
}
