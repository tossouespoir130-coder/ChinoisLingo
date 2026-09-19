import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { exigerAdmin } from '@/lib/admin/garde';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAR_PAGE = 25;

/**
 * GET /api/admin/utilisateurs?page=1&recherche=...
 * Liste paginée, en LECTURE SEULE pour cette version.
 */
export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const params = new URL(requete.url).searchParams;
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
  const recherche = (params.get('recherche') ?? '').trim();

  const admin = createAdminClient();

  let requeteSql = admin
    .from('profiles')
    .select(
      'id, full_name, username, email, created_at, last_sign_in_at, last_active_date, streak_days, total_login_days, current_period_end, subscription_plan, role, onboarding_profil, onboarding_objectif, onboarding_niveau, onboarding_rappels',
      { count: 'exact' }
    )
    .order('role', { ascending: true, nullsFirst: false })
    .order('total_login_days', { ascending: false, nullsFirst: false })
    .order('streak_days', { ascending: false, nullsFirst: false })
    .order('last_sign_in_at', { ascending: false, nullsFirst: false })
    .range((page - 1) * PAR_PAGE, page * PAR_PAGE - 1);

  if (recherche) {
    // Les virgules et parenthèses sont des séparateurs dans la syntaxe `or`
    // de PostgREST : les laisser passer casserait le filtre.
    const motif = recherche.replace(/[,()]/g, ' ');
    requeteSql = requeteSql.or(
      `full_name.ilike.%${motif}%,email.ilike.%${motif}%,username.ilike.%${motif}%,onboarding_profil.ilike.%${motif}%,onboarding_objectif.ilike.%${motif}%`
    );
  }

  const { data, count, error } = await requeteSql;

  if (error) {
    console.error('[admin] liste des utilisateurs', error);
    return NextResponse.json({ erreur: 'Lecture impossible.' }, { status: 500 });
  }

  const maintenant = Date.now();

  const utilisateurs = (data ?? []).map((u) => {
    const joursActifs = Math.max(u.total_login_days || 0, u.streak_days || 0, 1);
    return {
      id: u.id,
      nom: u.full_name || u.username || '—',
      email: u.email ?? '—',
      inscritLe: u.created_at,
      derniereConnexion: u.last_sign_in_at || u.last_active_date || u.created_at,
      joursConnexion: joursActifs,
      role: u.role || 'user',
      // Onboarding data
      profil: u.onboarding_profil || null,
      objectif: u.onboarding_objectif || null,
      niveau: u.onboarding_niveau || null,
      rappels: u.onboarding_rappels ?? true,
      // Le statut est recalculé ici plutôt que lu dans subscription_status :
      // la date de fin de période est la seule source fiable.
      premium: u.current_period_end
        ? new Date(u.current_period_end).getTime() > maintenant
        : false,
      plan: u.subscription_plan,
      // Nécessaire au récapitulatif « avant / après » de la modale.
      finPeriode: u.current_period_end,
    };
  });

  // Tri strict :
  // 1. Tous les administrateurs (role === 'admin') TOUJOURS en premier (en haut)
  // 2. Entre administrateurs : du plus grand nombre de jours actifs au plus petit (décroissant)
  // 3. Pour tous les autres utilisateurs : du plus grand nombre de jours actifs au plus petit (décroissant)
  utilisateurs.sort((a, b) => {
    const aIsAdmin = a.role === 'admin';
    const bIsAdmin = b.role === 'admin';

    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;

    // Même rang (les 2 admins ou les 2 utilisateurs) : ordre décroissant des jours actifs
    if (b.joursConnexion !== a.joursConnexion) {
      return b.joursConnexion - a.joursConnexion;
    }

    // En cas d'égalité : dernière connexion la plus récente en premier
    const timeA = a.derniereConnexion ? new Date(a.derniereConnexion).getTime() : 0;
    const timeB = b.derniereConnexion ? new Date(b.derniereConnexion).getTime() : 0;
    return timeB - timeA;
  });

  return NextResponse.json({
    utilisateurs,
    total: count ?? 0,
    page,
    parPage: PAR_PAGE,
    pages: Math.max(1, Math.ceil((count ?? 0) / PAR_PAGE)),
  });
}
