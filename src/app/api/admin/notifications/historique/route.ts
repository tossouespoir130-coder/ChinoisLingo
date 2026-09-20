import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('notifications')
    .select('id, title, message, action_url, source, user_id, created_at')
    .in('source', ['fondateur', 'systeme', 'mascot'])
    .order('created_at', { ascending: false })
    .limit(60);

  if (error) {
    console.error('[admin notifications historique]', error);
    return NextResponse.json({ erreur: 'Lecture de l\'historique impossible.' }, { status: 500 });
  }

  return NextResponse.json({ notifications: data ?? [] });
}
