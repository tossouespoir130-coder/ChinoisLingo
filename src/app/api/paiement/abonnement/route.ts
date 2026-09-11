import { NextResponse } from 'next/server';
import { createAdminClient, configurationAdminPrete } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';
import { programmerFinAbonnementStripe } from '@/lib/payments/stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/paiement/abonnement
 * Corps : { action: 'annuler' | 'reprendre' }
 *
 * « Annuler » ne coupe rien : le renouvellement automatique est arrêté et
 * l'apprenant garde l'accès complet jusqu'à la fin de la période payée.
 * « Reprendre » rétablit le renouvellement tant que cette période court.
 *
 * Réservé aux abonnements par carte : un pass Mobile Money ne se renouvelle
 * jamais tout seul, il n'y a donc rien à annuler.
 */
export async function POST(requete: Request) {
  if (!configurationAdminPrete()) {
    console.error('[abonnement] SUPABASE_SERVICE_ROLE_KEY absente');
    return NextResponse.json(
      { erreur: 'Le service de paiement n\'est pas encore configuré. Réessayez plus tard.' },
      { status: 503 }
    );
  }

  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  let corps: { action?: string };
  try {
    corps = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête illisible.' }, { status: 400 });
  }

  if (corps.action !== 'annuler' && corps.action !== 'reprendre') {
    return NextResponse.json({ erreur: 'Action inconnue.' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: profil } = await admin
    .from('profiles')
    .select('subscription_provider, stripe_subscription_id, current_period_end')
    .eq('id', utilisateur.id)
    .single();

  if (profil?.subscription_provider !== 'stripe' || !profil.stripe_subscription_id) {
    return NextResponse.json(
      {
        erreur:
          'Aucun abonnement par carte à modifier : un pass Mobile Money ne se renouvelle jamais automatiquement.',
      },
      { status: 400 }
    );
  }

  // Une période échue ne se réactive pas : il faut choisir une nouvelle formule.
  if (!profil.current_period_end || new Date(profil.current_period_end).getTime() <= Date.now()) {
    return NextResponse.json(
      { erreur: 'Cet abonnement est arrivé à échéance : choisissez une nouvelle formule.' },
      { status: 400 }
    );
  }

  const resultat = await programmerFinAbonnementStripe(
    profil.stripe_subscription_id,
    corps.action === 'annuler'
  );

  if (!resultat.ok) {
    console.error('[abonnement] modification Stripe refusée', resultat.erreur);
    return NextResponse.json(
      { erreur: 'La modification n\'a pas pu être enregistrée. Réessayez dans un instant.' },
      { status: 502 }
    );
  }

  // Le webhook `customer.subscription.updated` fera la même écriture ; on la
  // fait tout de suite pour que l'écran reflète le choix sans attendre.
  const { error } = await admin
    .from('profiles')
    .update({
      cancel_at_period_end: resultat.resiliationProgrammee,
      ...(resultat.finPeriode ? { current_period_end: resultat.finPeriode.toISOString() } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', utilisateur.id);

  // Stripe fait foi : le webhook resynchronisera le profil de toute façon.
  if (error) console.error('[abonnement] profil non mis à jour', error);

  return NextResponse.json({
    resiliationProgrammee: resultat.resiliationProgrammee,
    finPeriode: resultat.finPeriode?.toISOString() ?? null,
  });
}
