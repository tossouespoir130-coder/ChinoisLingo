import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { createAdminClient } from '@/lib/supabase/admin';
import { envoyerEmailRecapHebdo } from '@/lib/emails/emailRecapHebdo';
import { preparerNewsletterDeLaSemaine, validerBrouillonNewsletter, type BrouillonNewsletter } from '@/lib/emails/nouveautesHebdo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max

function pause(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/admin/emails/envoyer-newsletter-hebdo
 *
 * Déclenche manuellement l'envoi de la newsletter hebdomadaire
 * à ABSOLUMENT TOUT LE MONDE (tous les utilisateurs enregistrés y compris l'administrateur).
 *
 * Body facultatif : { brouillon } — la version validée dans l'éditeur de
 * l'administration (contenus, sujet, message). Sans brouillon : contenu
 * automatique de la semaine.
 */
export async function POST(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const admin = createAdminClient();

  // 1. Brouillon validé dans l'éditeur, sinon contenu automatique de la semaine
  //    (nouveautés depuis le dernier envoi, à défaut rappel de contenus existants).
  let corps: { brouillon?: unknown } = {};
  try {
    corps = await requete.json();
  } catch {
    // Pas de corps : envoi du contenu automatique.
  }

  let brouillon: BrouillonNewsletter;
  if (corps.brouillon !== undefined) {
    const verification = validerBrouillonNewsletter(corps.brouillon);
    if (!verification.ok) {
      return NextResponse.json({ erreur: verification.erreur }, { status: 400 });
    }
    brouillon = verification.brouillon;
  } else {
    const auto = await preparerNewsletterDeLaSemaine(admin);
    brouillon = { ...auto, sujet: null, messagePersonnel: null };
  }
  const { mode, contenus } = brouillon;

  if (contenus.length === 0) {
    return NextResponse.json(
      { erreur: 'Aucun contenu disponible (ni nouveauté, ni contenu à rappeler) : newsletter non envoyée.' },
      { status: 400 }
    );
  }

  // 2. Récupération de TOUS les utilisateurs inscrits (y compris l'administrateur)
  const { data: profils, error: errProfils } = await admin
    .from('profiles')
    .select('id, email, username, full_name, first_name, role, onboarding_profil, onboarding_niveau')
    .not('email', 'is', null);

  if (errProfils) {
    return NextResponse.json({ erreur: 'Lecture des profils impossible.' }, { status: 500 });
  }

  // Tous les utilisateurs avec email valide (y compris administrateur)
  const destinataires = (profils ?? []).filter((p) => p.email && p.email.includes('@'));

  if (destinataires.length === 0) {
    return NextResponse.json({ erreur: 'Aucun destinataire avec adresse valide trouvé.' }, { status: 400 });
  }

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
        mode,
        contenus,
        sujetPersonnalise: brouillon.sujet,
        messagePersonnel: brouillon.messagePersonnel,
      });

      if (ok) totalEnvoyes++;
      else totalEchecs++;
    } catch (e) {
      console.error('[admin newsletter manual] Erreur envoi à', dest.email, e);
      totalEchecs++;
    }

    await pause(200);
  }

  return NextResponse.json({
    ok: true,
    mode,
    nouveautesCount: contenus.length,
    destinatairesTotal: destinataires.length,
    totalEnvoyes,
    totalEchecs,
  });
}
