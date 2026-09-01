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
    .select('id, full_name, username, email, created_at, current_period_end, subscription_plan, role', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAR_PAGE, page * PAR_PAGE - 1);

  if (recherche) {
    // Les virgules et parenthèses sont des séparateurs dans la syntaxe `or`
    // de PostgREST : les laisser passer casserait le filtre.
    const motif = recherche.replace(/[,()]/g, ' ');
    requeteSql = requeteSql.or(
      `full_name.ilike.%${motif}%,email.ilike.%${motif}%,username.ilike.%${motif}%`
    );
  }

  const { data, count, error } = await requeteSql;

  if (error) {
    console.error('[admin] liste des utilisateurs', error);
    return NextResponse.json({ erreur: 'Lecture impossible.' }, { status: 500 });
  }

  const maintenant = Date.now();

  return NextResponse.json({
    utilisateurs: (data ?? []).map((u) => ({
      id: u.id,
      nom: u.full_name || u.username || '—',
      email: u.email ?? '—',
      inscritLe: u.created_at,
      role: u.role,
      // Le statut est recalculé ici plutôt que lu dans subscription_status :
      // la date de fin de période est la seule source fiable.
      premium: u.current_period_end
        ? new Date(u.current_period_end).getTime() > maintenant
        : false,
      plan: u.subscription_plan,
      // Nécessaire au récapitulatif « avant / après » de la modale.
      finPeriode: u.current_period_end,
    })),
    total: count ?? 0,
    page,
    parPage: PAR_PAGE,
    pages: Math.max(1, Math.ceil((count ?? 0) / PAR_PAGE)),
  });
}
