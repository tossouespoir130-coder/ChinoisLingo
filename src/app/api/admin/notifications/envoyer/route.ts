import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  let corps: {
    cibleType: 'tous' | 'selection';
    userIds?: string[];
    titre: string;
    message: string;
    actionUrl?: string;
    source?: string;
  };

  try {
    corps = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête illisible.' }, { status: 400 });
  }

  const titre = (corps.titre ?? '').trim();
  const message = (corps.message ?? '').trim();
  const actionUrl = (corps.actionUrl ?? '').trim() || null;
  const source = corps.source || 'fondateur';

  if (!titre || !message) {
    return NextResponse.json(
      { erreur: 'Le titre et le message sont tous deux obligatoires.' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  if (corps.cibleType === 'tous') {
    // Diffusion globale à tous les apprenants (user_id = null)
    const { data, error } = await admin
      .from('notifications')
      .insert({
        user_id: null,
        title: titre,
        message,
        action_url: actionUrl,
        source,
      })
      .select('id, title, message, created_at, action_url, source')
      .single();

    if (error) {
      console.error('[admin notifications global]', error);
      return NextResponse.json({ erreur: 'Publication impossible.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, notification: data, total: 'tous' });
  } else {
    // Envoi ciblé à un ou plusieurs utilisateurs
    const userIds = corps.userIds || [];
    if (userIds.length === 0) {
      return NextResponse.json({ erreur: 'Veuillez sélectionner au moins un destinataire.' }, { status: 400 });
    }

    const lignes = userIds.map((uid) => ({
      user_id: uid,
      title: titre,
      message,
      action_url: actionUrl,
      source,
    }));

    const { error } = await admin.from('notifications').insert(lignes);

    if (error) {
      console.error('[admin notifications ciblées]', error);
      return NextResponse.json({ erreur: 'Publication ciblée impossible.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, total: userIds.length });
  }
}
