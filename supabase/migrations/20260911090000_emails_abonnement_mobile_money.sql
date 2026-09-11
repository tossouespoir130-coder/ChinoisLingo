-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — E-mails d'abonnement Mobile Money
-- ═══════════════════════════════════════════════════════════════════════
-- Un paiement Moneroo ne se reconduit pas : l'apprenant qui oublie son
-- échéance retombe au palier gratuit sans avoir été prévenu. On lui écrit
-- donc à trois moments :
--   • à l'activation (confirmation du paiement) ;
--   • 7 jours avant la fin de sa période ;
--   • 3 jours avant la fin de sa période.
-- Les abonnés Stripe ne sont pas concernés : leur carte est prélevée
-- automatiquement et Stripe leur envoie ses propres reçus.
--
-- Cette table est le registre des envois. Sa contrainte d'unicité sert de
-- verrou : un même e-mail ne part jamais deux fois pour une même échéance,
-- même si la tâche planifiée est déclenchée en double — ce que Vercel
-- n'exclut pas.
--
-- À exécuter après 20260905120000_historique_activite_reelle.sql.
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.emails_abonnement (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  type         TEXT NOT NULL CHECK (type IN ('confirmation', 'rappel_j7', 'rappel_j3')),
  -- Fin de période à laquelle l'e-mail se rapporte. Un renouvellement fait
  -- naître une nouvelle échéance, donc un nouveau cycle de rappels.
  echeance     TIMESTAMPTZ NOT NULL,
  payment_id   UUID REFERENCES public.payments (id) ON DELETE SET NULL,
  destinataire TEXT NOT NULL,
  -- Identifiant renvoyé par Resend : retrouve l'envoi dans son tableau de bord.
  resend_id    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT emails_abonnement_unique UNIQUE (user_id, type, echeance)
);

CREATE INDEX IF NOT EXISTS emails_abonnement_echeance_idx
  ON public.emails_abonnement (echeance);

-- Aucune politique : la table est lue et écrite uniquement par le serveur
-- (service_role), jamais depuis le navigateur.
ALTER TABLE public.emails_abonnement ENABLE ROW LEVEL SECURITY;

-- La tâche quotidienne cherche les échéances Mobile Money des 7 prochains
-- jours : index partiel, limité aux seules lignes qu'elle parcourt.
CREATE INDEX IF NOT EXISTS profiles_echeance_moneroo_idx
  ON public.profiles (current_period_end)
  WHERE subscription_provider = 'moneroo';
