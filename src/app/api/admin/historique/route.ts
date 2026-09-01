import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { exigerAdmin } from '@/lib/admin/garde';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAR_PAGE = 30;

/**
 * GET /api/admin/historique?page=1
 * Journal des actions d'administration, du plus récent au plus ancien.
 * Lecture seule : aucune route ne permet de modifier ni d'effacer une trace.
 */
export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const page = Math.max(
    1,
    parseInt(new URL(requete.url).searchParams.get('page') ?? '1', 10) || 1
  );

  const admin = createAdminClient();

  const { data, count, error } = await admin
    .from('admin_actions_log')
    .select('id, admin_email, target_email, action, details, created_at', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAR_PAGE, page * PAR_PAGE - 1);

  if (error) {
    console.error('[admin] lecture du journal', error);
    return NextResponse.json({ erreur: 'Lecture impossible.' }, { status: 500 });
  }

  return NextResponse.json({
    actions: data ?? [],
    total: count ?? 0,
    page,
    pages: Math.max(1, Math.ceil((count ?? 0) / PAR_PAGE)),
  });
}
