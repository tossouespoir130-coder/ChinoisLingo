import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PAR_PAGE = 30;

export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const params = new URL(requete.url).searchParams;
  const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
  const type = (params.get('type') ?? '').trim();
  const recherche = (params.get('recherche') ?? '').trim();

  const admin = createAdminClient();

  let requeteSql = admin
    .from('emails_log')
    .select('id, user_id, destinataire, sujet, type, statut, resend_id, erreur, envoye_par, created_at', {
      count: 'exact',
    })
    .order('created_at', { ascending: false })
    .range((page - 1) * PAR_PAGE, page * PAR_PAGE - 1);

  if (type) {
    requeteSql = requeteSql.eq('type', type);
  }

  if (recherche) {
    const motif = recherche.replace(/[,()]/g, ' ');
    requeteSql = requeteSql.or(`destinataire.ilike.%${motif}%,sujet.ilike.%${motif}%`);
  }

  const { data, count, error } = await requeteSql;

  if (error) {
    console.error('[admin emails historique]', error);
    return NextResponse.json({ erreur: 'Lecture de l\'historique impossible.' }, { status: 500 });
  }

  return NextResponse.json({
    emails: data ?? [],
    total: count ?? 0,
    page,
    parPage: PAR_PAGE,
    pages: Math.max(1, Math.ceil((count ?? 0) / PAR_PAGE)),
  });
}
