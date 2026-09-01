import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { utilisateurDeLaRequete } from '@/lib/payments/session-serveur';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/paiement/statut?ref=<uuid>
 *
 * Consulté par la page de retour, qui interroge cette route en boucle pendant
 * que le webhook chemine. La redirection du fournisseur n'est JAMAIS une preuve
 * de paiement : elle peut être rejouée, et arriver avant le webhook. Seule la
 * ligne `payments` passée à « completed » par le webhook fait foi.
 */
export async function GET(requete: Request) {
  const utilisateur = await utilisateurDeLaRequete(requete);
  if (!utilisateur) {
    return NextResponse.json({ erreur: 'Session invalide ou expirée.' }, { status: 401 });
  }

  const ref = new URL(requete.url).searchParams.get('ref');
  if (!ref) {
    return NextResponse.json({ erreur: 'Référence de paiement manquante.' }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: paiement } = await admin
    .from('payments')
    .select('id, user_id, status, plan_id, currency, amount, failure_reason')
    .eq('id', ref)
    .maybeSingle();

  if (!paiement) {
    return NextResponse.json({ erreur: 'Paiement introuvable.' }, { status: 404 });
  }

  // Un apprenant ne consulte que ses propres paiements.
  if (paiement.user_id !== utilisateur.id) {
    return NextResponse.json({ erreur: 'Accès refusé.' }, { status: 403 });
  }

  const { data: profil } = await admin
    .from('profiles')
    .select('subscription_status, current_period_end, trial_ends_at')
    .eq('id', utilisateur.id)
    .single();

  return NextResponse.json({
    statut: paiement.status,
    plan: paiement.plan_id,
    devise: paiement.currency,
    montant: paiement.amount,
    motifEchec: paiement.failure_reason,
    abonnement: {
      statut: profil?.subscription_status ?? null,
      finPeriode: profil?.current_period_end ?? null,
      finEssai: profil?.trial_ends_at ?? null,
    },
  });
}
