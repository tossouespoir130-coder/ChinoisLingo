import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { appelCronAutorise } from '@/lib/security/cron';
import { envoyerEmailRecapHebdo } from '@/lib/emails/emailRecapHebdo';
import { chargerNouveautesDeLaSemaine } from '@/lib/emails/nouveautesHebdo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max pour cron

/** Attente douce entre deux envois pour respecter les quotas de Resend (max 10 req/s). */
function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * GET /api/cron/newsletter-hebdomadaire
 *
 * Déclenché chaque jeudi après-midi par le planificateur cron.
 * Envoie le récapitulatif structuré par rubriques à ABSOLUMENT TOUT LE MONDE
 * (tous les utilisateurs inscrits, y compris l'administrateur).
 */
export async function GET(requete: Request) {
  if (!appelCronAutorise(requete.headers.get('authorization'))) {
    return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 });
  }

  const admin = createAdminClient();
  // 1. Nouveautés réelles des 7 derniers jours uniquement (aucun repli sur d'anciens contenus)
  const contenus = await chargerNouveautesDeLaSemaine(admin);

  if (contenus.length === 0) {
    return NextResponse.json({
      statut: 'ignore',
      message: 'Aucun nouveau contenu cette semaine : newsletter non envoyée.',
      nouveautesCount: 0,
    });
  }

  // 2. Récupération de TOUS les utilisateurs inscrits (y compris l'administrateur)
  const { data: profils, error: errProfils } = await admin
    .from('profiles')
    .select('id, email, username, full_name, first_name, role, onboarding_profil, onboarding_niveau, relances_desactivees')
    .not('email', 'is', null);

  if (errProfils) {
    console.error('[cron newsletter] Erreur lecture profils:', errProfils);
    return NextResponse.json({ erreur: 'Lecture des profils impossible.' }, { status: 500 });
  }

  // Filtrer les adresses valides (envoi à absolument tout le monde)
  const destinataires = (profils ?? []).filter((p) => {
    if (!p.email || !p.email.includes('@')) return false;
    return true;
  });

  let totalEnvoyes = 0;
  let totalEchecs = 0;

  for (const dest of destinataires) {
    const nom = dest.first_name || dest.full_name || dest.username || dest.email.split('@')[0];

    try {
      const ok = await envoyerEmailRecapHebdo({
        userId: dest.id,
        email: dest.email,
        nom,
        profil: dest.onboarding_profil,
        niveau: dest.onboarding_niveau,
        contenus,
      });

      if (ok) totalEnvoyes++;
      else totalEchecs++;
    } catch (e) {
      console.error('[cron newsletter] Erreur envoi à', dest.email, e);
      totalEchecs++;
    }

    // Pause de 200 ms entre chaque envoi
    await pause(200);
  }

  return NextResponse.json({
    statut: 'termine',
    nouveautesCount: contenus.length,
    destinatairesTotal: destinataires.length,
    totalEnvoyes,
    totalEchecs,
  });
}
