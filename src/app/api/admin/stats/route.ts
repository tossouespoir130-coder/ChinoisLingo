import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { exigerAdmin } from '@/lib/admin/garde';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/stats
 * Compteurs de la vue d'ensemble, calculés en base plutôt que rapatriés :
 * `head: true` avec `count` ne transfère aucune ligne.
 */
export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const admin = createAdminClient();
  const maintenant = new Date();

  // Fenêtre glissante de 7 jours : plus lisible qu'une semaine calendaire,
  // qui ferait chuter le chiffre à zéro chaque lundi matin.
  const ilYaSeptJours = new Date(maintenant.getTime() - 7 * 86_400_000).toISOString();

  const [total, abonnes, semaine] = await Promise.all([
    admin.from('profiles').select('*', { count: 'exact', head: true }),
    admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gt('current_period_end', maintenant.toISOString()),
    admin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', ilYaSeptJours),
  ]);

  return NextResponse.json({
    totalUtilisateurs: total.count ?? 0,
    abonnesActifs: abonnes.count ?? 0,
    inscriptionsSemaine: semaine.count ?? 0,
  });
}
