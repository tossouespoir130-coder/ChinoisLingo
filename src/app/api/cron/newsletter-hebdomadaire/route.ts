import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { configurationEmailPrete } from '@/lib/emails/resend';
import { envoyerEmailRecapHebdo, type NouvelItemContenu } from '@/lib/emails/emailRecapHebdo';

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
 * Déclenché chaque dimanche matin (ex: 09h00) par le planificateur cron.
 * 1. Scanne les nouveautés publiées sur les 7 derniers jours.
 * 2. Si AUCUN contenu n'a été ajouté : annule l'envoi cette semaine.
 * 3. Si des contenus existent : envoie le récapitulatif structuré par rubriques
 *    à tous les utilisateurs n'ayant pas désactivé les relances.
 */
export async function GET(requete: Request) {
  // Protection optionnelle par secret cron
  const authHeader = requete.headers.get('authorization');
  const secretAttendu = process.env.CRON_SECRET;
  if (secretAttendu && authHeader !== `Bearer ${secretAttendu}`) {
    // Si CRON_SECRET est défini dans l'environnement, on l'exige
    const url = new URL(requete.url);
    const keyParam = url.searchParams.get('key');
    if (keyParam !== secretAttendu) {
      return NextResponse.json({ erreur: 'Non autorisé.' }, { status: 401 });
    }
  }

  const admin = createAdminClient();
  const maintenant = new Date();
  const ilYaSeptJours = new Date(maintenant.getTime() - 7 * 86_400_000).toISOString();

  // 1. Récupération des contenus ajoutés lors des 7 derniers jours
  const { data: nouveautes, error: errNouveautes } = await admin
    .from('nouveaux_contenus')
    .select('*')
    .gte('created_at', ilYaSeptJours)
    .order('created_at', { ascending: false });

  if (errNouveautes) {
    console.error('[cron newsletter] Erreur lecture nouveautes:', errNouveautes);
    return NextResponse.json({ erreur: 'Lecture des nouveautés impossible.' }, { status: 500 });
  }

  // 2. Règle stricte : si 0 nouveauté cette semaine, on n'envoie RIEN
  if (!nouveautes || nouveautes.length === 0) {
    return NextResponse.json({
      statut: 'ignore',
      message: 'Aucun contenu ajouté sur les 7 derniers jours — aucun e-mail envoyé cette semaine.',
      nouveautesCount: 0,
    });
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

  // 3. Récupération des destinataires éligibles (non désabonnés des relances)
  const { data: profils, error: errProfils } = await admin
    .from('profiles')
    .select('id, email, username, full_name, first_name, onboarding_profil, onboarding_niveau, relances_desactivees')
    .not('email', 'is', null);

  if (errProfils) {
    console.error('[cron newsletter] Erreur lecture profils:', errProfils);
    return NextResponse.json({ erreur: 'Lecture des profils impossible.' }, { status: 500 });
  }

  const destinataires = (profils ?? []).filter((p) => {
    // Exclure ceux qui ont explicitement désactivé les relances
    if (p.relances_desactivees === true) return false;
    // Exclure les adresses invalides
    if (!p.email || !p.email.includes('@')) return false;
    return true;
  });

  let totalEnvoyes = 0;
  let totalEchecs = 0;

  for (const dest of destinataires) {
    const nom = dest.first_name || dest.username || dest.full_name || dest.email.split('@')[0];

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

    // Pause de 200 ms entre chaque envoi (5 envois/s) pour rester très en-dessous de la limite Resend
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
