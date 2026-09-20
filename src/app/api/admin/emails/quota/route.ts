import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { obtenirStatsQuotaResend } from '@/lib/emails/journal';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  try {
    const stats = await obtenirStatsQuotaResend();
    return NextResponse.json(stats);
  } catch (err) {
    console.error('[admin emails quota]', err);
    return NextResponse.json({ erreur: 'Calcul du quota impossible.' }, { status: 500 });
  }
}
