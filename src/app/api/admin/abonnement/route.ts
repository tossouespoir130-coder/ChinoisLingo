import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { exigerAdmin } from '@/lib/admin/garde';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Durées proposées, alignées sur la grille tarifaire de l'application. */
const DUREES_AUTORISEES = [1, 6, 12];

/**
 * POST /api/admin/abonnement
 * Corps : { userId, action: 'prolongation' | 'annulation', mois? }
 *
 * L'écriture ne se fait JAMAIS directement sur la table : tout passe par la
 * fonction `admin_modifier_abonnement`, dont le corps est transactionnel.
 * C'est ce qui garantit l'exigence « pas de trace, pas d'action » : si
 * l'insertion dans le journal échoue, la modification de l'abonnement est
 * annulée avec elle.
 */
export async function POST(requete: Request) {
  const garde = await exigerAdmin(requete);
  if (!garde.ok) {
    return NextResponse.json({ erreur: garde.erreur }, { status: garde.statut });
  }

  let corps: { userId?: string; action?: string; mois?: number };
  try {
    corps = await requete.json();
  } catch {
    return NextResponse.json({ erreur: 'Requête illisible.' }, { status: 400 });
  }

  const { userId, action, mois } = corps;

  if (!userId) {
    return NextResponse.json({ erreur: 'Utilisateur non précisé.' }, { status: 400 });
  }
  if (action !== 'prolongation' && action !== 'annulation') {
    return NextResponse.json({ erreur: 'Action inconnue.' }, { status: 400 });
  }
  if (action === 'prolongation' && !DUREES_AUTORISEES.includes(Number(mois))) {
    return NextResponse.json(
      { erreur: 'Durée invalide : 1, 6 ou 12 mois attendus.' },
      { status: 400 }
    );
  }

  // Un administrateur ne peut pas se retirer son propre abonnement par
  // inadvertance depuis la liste — garde-fou léger, pas une règle de sécurité.
  if (action === 'annulation' && userId === garde.userId) {
    return NextResponse.json(
      { erreur: 'Vous ne pouvez pas annuler votre propre abonnement depuis cette liste.' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  const { data, error } = await admin.rpc('admin_modifier_abonnement', {
    p_admin_id: garde.userId,
    p_target_id: userId,
    p_action: action,
    p_mois: action === 'prolongation' ? Number(mois) : null,
  });

  if (error) {
    console.error('[admin] modification d\'abonnement', error);
    // Le message de la fonction est explicite (durée invalide, compte
    // introuvable…) : on le remonte tel quel plutôt qu'un « erreur serveur ».
    return NextResponse.json(
      { erreur: error.message || 'Modification impossible.' },
      { status: 400 }
    );
  }

  return NextResponse.json({ resultat: data });
}
