import { NextResponse } from 'next/server';
import { exigerAdmin } from '@/lib/admin/garde';
import { createAdminClient } from '@/lib/supabase/admin';
import { envoyerEmailRecapHebdo, type NouvelItemContenu } from '@/lib/emails/emailRecapHebdo';

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
 */
export async function POST(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  const admin = createAdminClient();
  const maintenant = new Date();
  const ilYaSeptJours = new Date(maintenant.getTime() - 7 * 86_400_000).toISOString();

  // 1. Récupération des nouveautés récentes (priorité 7 derniers jours, sinon les 6 plus récentes)
  let { data: nouveautes, error: errNouveautes } = await admin
    .from('nouveaux_contenus')
    .select('*')
    .gte('created_at', ilYaSeptJours)
    .order('created_at', { ascending: false });

  if (errNouveautes || !nouveautes || nouveautes.length === 0) {
    const { data: recents } = await admin
      .from('nouveaux_contenus')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
    nouveautes = recents || [];
  }

  if (!nouveautes || nouveautes.length === 0) {
    return NextResponse.json(
      { erreur: 'Aucun contenu disponible dans la base pour constituer la newsletter.' },
      { status: 400 }
    );
  }

  const contenus: NouvelItemContenu[] = nouveautes.map((n: any) => ({
    id: n.id,
    rubrique: n.rubrique as NouvelItemContenu['rubrique'],
    sous_categorie: n.sous_categorie,
    titre: n.titre,
    description: n.description,
    lien: n.lien,
    niveau_hsk: n.niveau_hsk,
    profil_cible: n.profil_cible,
  }));

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
        contenus,
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
    nouveautesCount: contenus.length,
    destinatairesTotal: destinataires.length,
    totalEnvoyes,
    totalEchecs,
  });
}
