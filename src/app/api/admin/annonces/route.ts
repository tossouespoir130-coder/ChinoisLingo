import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { exigerAdmin } from '@/lib/admin/garde';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Messages du Fondateur.
 *
 * Aucune table dédiée : `notifications` diffuse déjà à tout le monde via
 * `user_id IS NULL`, et ces lignes remontent dans la cloche du header et dans
 * NotificationsModal. On les marque `source = 'fondateur'` pour les distinguer
 * des notifications automatiques (abonnement, nouveau contenu) et pouvoir
 * relire l'historique.
 */
const SOURCE = 'fondateur';

/** GET — historique des messages déjà publiés, du plus récent au plus ancien. */
export async function GET(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('notifications')
    .select('id, title, message, created_at')
    .eq('source', SOURCE)
    .is('user_id', null)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[admin] historique des annonces', error);
    return NextResponse.json({ erreur: 'Lecture impossible.' }, { status: 500 });
  }

  return NextResponse.json({ annonces: data ?? [] });
}

/** POST — publie une annonce visible par tous les comptes. */
export async function POST(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  let corps: { titre?: string; message?: string };
  try {
    corps = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête illisible.' }, { status: 400 });
  }

  const titre = (corps.titre ?? '').trim();
  const message = (corps.message ?? '').trim();

  if (!titre || !message) {
    return NextResponse.json(
      { erreur: 'Le titre et le message sont tous deux obligatoires.' },
      { status: 400 }
    );
  }
  if (titre.length > 120) {
    return NextResponse.json(
      { erreur: 'Le titre ne doit pas dépasser 120 caractères.' },
      { status: 400 }
    );
  }
  if (message.length > 2000) {
    return NextResponse.json(
      { erreur: 'Le message ne doit pas dépasser 2 000 caractères.' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('notifications')
    .insert({
      // user_id à NULL = diffusion à tous les comptes.
      user_id: null,
      title: titre,
      message,
      source: SOURCE,
    })
    .select('id, title, message, created_at')
    .single();

  if (error) {
    console.error('[admin] publication d\'annonce', error);
    return NextResponse.json({ erreur: 'Publication impossible.' }, { status: 500 });
  }

  return NextResponse.json({ annonce: data });
}
