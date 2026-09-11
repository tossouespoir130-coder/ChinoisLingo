import { createClient } from '@/lib/supabase/client';
import { Payment } from '@/lib/supabase/types';

export type PaiementHistorique = Pick<
  Payment,
  'id' | 'created_at' | 'plan_id' | 'amount' | 'currency' | 'provider'
>;

/**
 * Paiements réussis de l'apprenant, du plus récent au plus ancien.
 *
 * Pour un abonnement par carte, seule la souscription figure ici : les
 * renouvellements sont facturés par Stripe et consultables dans son espace
 * de facturation.
 */
export async function fetchPaymentHistory(limite = 10): Promise<PaiementHistorique[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('payments')
    .select('id, created_at, plan_id, amount, currency, provider')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('created_at', { ascending: false })
    .limit(limite);

  if (error) {
    console.error('Error fetching payment history:', error);
    return [];
  }

  return data ?? [];
}
