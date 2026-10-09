import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { createAdminClient } from '@/lib/supabase/admin';
import { construireEmailRecapHebdo } from '@/lib/emails/emailRecapHebdo';
import { dateDernierEnvoi, preparerNewsletterDeLaSemaine } from '@/lib/emails/nouveautesHebdo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/emails/apercu-newsletter
 *
 * Aperçu exact de la newsletter qui partirait maintenant (mêmes contenus et
 * même gabarit que l'envoi réel), rendu pour l'administrateur. N'envoie rien.
 */
export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const admin = createAdminClient();
  const [{ mode, contenus }, dernierEnvoi, { data: profil }] = await Promise.all([
    preparerNewsletterDeLaSemaine(admin),
    dateDernierEnvoi(admin),
    admin.from('profiles').select('email, first_name, full_name, username').eq('id', garde.userId).maybeSingle(),
  ]);

  if (contenus.length === 0) {
    return NextResponse.json({ mode, contenus, dernierEnvoi, sujet: null, html: null });
  }

  const { sujet, html } = construireEmailRecapHebdo({
    mode,
    userId: garde.userId,
    email: profil?.email || '',
    nom: profil?.first_name || profil?.full_name || profil?.username || 'Espoir',
    contenus,
  });

  return NextResponse.json({ mode, contenus, dernierEnvoi, sujet, html });
}
