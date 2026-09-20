import 'server-only';

import { createAdminClient } from '@/lib/supabase/admin';

export type TypeEmail = 'bienvenue' | 'recap_hebdo' | 'manuel' | 'rappel_abonnement';
export type StatutEmail = 'envoye' | 'echec' | 'simule';

export interface EntreeJournalEmail {
  userId?: string | null;
  destinataire: string;
  sujet: string;
  type: TypeEmail;
  statut: StatutEmail;
  resendId?: string | null;
  erreur?: string | null;
  envoyePar?: string;
}

/**
 * Enregistre une trace d'envoi d'e-mail en base de données.
 * Ne lève jamais d'exception pour ne pas bloquer le flux appelant.
 */
export async function journaliserEmail(entree: EntreeJournalEmail): Promise<void> {
  try {
    const admin = createAdminClient();
    await admin.from('emails_log').insert({
      user_id: entree.userId || null,
      destinataire: entree.destinataire,
      sujet: entree.sujet,
      type: entree.type,
      statut: entree.statut,
      resend_id: entree.resendId || null,
      erreur: entree.erreur || null,
      envoye_par: entree.envoyePar || 'system',
    });
  } catch (err) {
    console.error('[journal email] Échec de journalisation', err);
  }
}

/**
 * Calcule la consommation Resend en temps réel.
 * Limites gratuites Resend : 100/jour et 3000/mois.
 */
export async function obtenirStatsQuotaResend(): Promise<{
  aujourdhui: number;
  ceMois: number;
  limiteJour: number;
  limiteMois: number;
  pourcentageJour: number;
  pourcentageMois: number;
  alerteJour: boolean;
  alerteMois: boolean;
}> {
  const admin = createAdminClient();
  const maintenant = new Date();

  // Début de la journée (00:00:00 UTC)
  const debutJour = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate()).toISOString();

  // Début du mois (1er jour 00:00:00 UTC)
  const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1).toISOString();

  const [resJour, resMois] = await Promise.all([
    admin
      .from('emails_log')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'envoye')
      .gte('created_at', debutJour),
    admin
      .from('emails_log')
      .select('*', { count: 'exact', head: true })
      .eq('statut', 'envoye')
      .gte('created_at', debutMois),
  ]);

  const aujourdhui = resJour.count ?? 0;
  const ceMois = resMois.count ?? 0;
  const limiteJour = 100;
  const limiteMois = 3000;

  const pourcentageJour = Math.min(100, Math.round((aujourdhui / limiteJour) * 100));
  const pourcentageMois = Math.min(100, Math.round((ceMois / limiteMois) * 100));

  return {
    aujourdhui,
    ceMois,
    limiteJour,
    limiteMois,
    pourcentageJour,
    pourcentageMois,
    alerteJour: aujourdhui >= 80, // Alerte dès 80% du quota journalier
    alerteMois: ceMois >= 2500, // Alerte dès 2500/3000
  };
}
