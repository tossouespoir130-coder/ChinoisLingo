import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { createAdminClient } from '@/lib/supabase/admin';
import { envoyerEmailManuel } from '@/lib/emails/emailManuel';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  let corps: {
    cibleType: 'tous' | 'profil' | 'niveau' | 'selection';
    cibleValeur?: string;
    userIds?: string[];
    emailsDirects?: string[];
    sujet: string;
    message: string;
  };

  try {
    corps = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Corps de requête invalide.' }, { status: 400 });
  }

  const { cibleType, cibleValeur, userIds, emailsDirects, sujet, message } = corps;

  if (!sujet?.trim() || !message?.trim()) {
    return NextResponse.json({ erreur: 'Le sujet et le message sont requis.' }, { status: 400 });
  }

  const admin = createAdminClient();
  let destinataires: { id?: string; email: string; nom: string }[] = [];

  if (cibleType === 'tous') {
    const { data } = await admin
      .from('profiles')
      .select('id, email, username, full_name, first_name')
      .not('email', 'is', null);

    destinataires = (data ?? []).map((p) => ({
      id: p.id,
      email: p.email,
      nom: p.first_name || p.username || p.full_name || p.email.split('@')[0],
    }));
  } else if (cibleType === 'profil' && cibleValeur) {
    const { data } = await admin
      .from('profiles')
      .select('id, email, username, full_name, first_name')
      .ilike('onboarding_profil', `%${cibleValeur}%`)
      .not('email', 'is', null);

    destinataires = (data ?? []).map((p) => ({
      id: p.id,
      email: p.email,
      nom: p.first_name || p.username || p.full_name || p.email.split('@')[0],
    }));
  } else if (cibleType === 'niveau' && cibleValeur) {
    const { data } = await admin
      .from('profiles')
      .select('id, email, username, full_name, first_name')
      .ilike('onboarding_niveau', `%${cibleValeur}%`)
      .not('email', 'is', null);

    destinataires = (data ?? []).map((p) => ({
      id: p.id,
      email: p.email,
      nom: p.first_name || p.username || p.full_name || p.email.split('@')[0],
    }));
  } else if (cibleType === 'selection') {
    if (userIds && userIds.length > 0) {
      const { data } = await admin
        .from('profiles')
        .select('id, email, username, full_name, first_name')
        .in('id', userIds)
        .not('email', 'is', null);

      destinataires = (data ?? []).map((p) => ({
        id: p.id,
        email: p.email,
        nom: p.first_name || p.username || p.full_name || p.email.split('@')[0],
      }));
    } else if (emailsDirects && emailsDirects.length > 0) {
      destinataires = emailsDirects.map((em) => ({
        email: em.trim(),
        nom: em.split('@')[0],
      }));
    }
  }

  if (destinataires.length === 0) {
    return NextResponse.json({ erreur: 'Aucun destinataire trouvé pour cette sélection.' }, { status: 400 });
  }

  let envoyes = 0;
  let echecs = 0;

  for (const dest of destinataires) {
    const res = await envoyerEmailManuel({
      destinataire: dest.email,
      nomDestinataire: dest.nom,
      sujet,
      message,
      userId: dest.id || null,
      adminId: garde.userId || 'admin',
    });

    if (res.ok) envoyes++;
    else echecs++;

    await pause(150);
  }

  return NextResponse.json({
    ok: true,
    totalDestinataires: destinataires.length,
    envoyes,
    echecs,
  });
}
