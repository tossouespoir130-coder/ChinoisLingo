import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { createAdminClient } from '@/lib/supabase/admin';
import { construireEmailRecapHebdo } from '@/lib/emails/emailRecapHebdo';
import {
  dateDernierEnvoi,
  preparerNewsletterDeLaSemaine,
  suggestionsContenus,
  validerBrouillonNewsletter,
  type BrouillonNewsletter,
} from '@/lib/emails/nouveautesHebdo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ClientAdmin = ReturnType<typeof createAdminClient>;

/** Rend le mail pour l'administrateur (aperçu), sans rien envoyer. */
async function rendre(admin: ClientAdmin, userId: string, brouillon: BrouillonNewsletter) {
  const { data: profil } = await admin
    .from('profiles')
    .select('email, first_name, full_name, username')
    .eq('id', userId)
    .maybeSingle();

  return construireEmailRecapHebdo({
    mode: brouillon.mode,
    userId,
    email: profil?.email || '',
    nom: profil?.first_name || profil?.full_name || profil?.username || 'Espoir',
    contenus: brouillon.contenus,
    sujetPersonnalise: brouillon.sujet,
    messagePersonnel: brouillon.messagePersonnel,
  });
}

/**
 * GET /api/admin/emails/apercu-newsletter
 * Proposition automatique de la semaine (mêmes contenus que l'envoi du jeudi),
 * son rendu, et les contenus existants proposés dans l'éditeur. N'envoie rien.
 */
export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const admin = createAdminClient();
  const [proposition, dernierEnvoi, suggestions] = await Promise.all([
    preparerNewsletterDeLaSemaine(admin),
    dateDernierEnvoi(admin),
    suggestionsContenus(admin),
  ]);

  const brouillon: BrouillonNewsletter = { ...proposition, sujet: null, messagePersonnel: null };
  const rendu = proposition.contenus.length > 0 ? await rendre(admin, garde.userId, brouillon) : null;

  return NextResponse.json({
    ...proposition,
    dernierEnvoi,
    suggestions,
    sujet: rendu?.sujet ?? null,
    html: rendu?.html ?? null,
  });
}

/**
 * POST /api/admin/emails/apercu-newsletter
 * Body : { brouillon } — rend la version modifiée dans l'éditeur. N'envoie rien.
 */
export async function POST(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  let corps: { brouillon?: unknown };
  try {
    corps = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête JSON invalide.' }, { status: 400 });
  }

  const verification = validerBrouillonNewsletter(corps.brouillon);
  if (!verification.ok) {
    return NextResponse.json({ erreur: verification.erreur }, { status: 400 });
  }

  const { sujet, html } = await rendre(createAdminClient(), garde.userId, verification.brouillon);
  return NextResponse.json({ sujet, html });
}
