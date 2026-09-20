import { NextResponse } from 'next/server';
import { envoyerEmailBienvenue } from '@/lib/emails/emailBienvenue';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(requete: Request) {
  try {
    const corps = await requete.json();
    const { userId, email, nom, profil, objectif, niveau } = corps;

    if (!email || !nom) {
      return NextResponse.json({ erreur: 'Email et nom requis.' }, { status: 400 });
    }

    const succes = await envoyerEmailBienvenue({
      userId: userId || '',
      email,
      nom,
      profil,
      objectif,
      niveau,
    });

    return NextResponse.json({ ok: succes });
  } catch (err) {
    console.error('[api/emails/bienvenue] Erreur', err);
    return NextResponse.json({ erreur: 'Échec d\'envoi.' }, { status: 500 });
  }
}
