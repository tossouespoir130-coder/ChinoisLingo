-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Système d'abonnement (essai 7 jours + Moneroo + Stripe)
-- ═══════════════════════════════════════════════════════════════════════
-- À exécuter dans l'éditeur SQL Supabase, ou via `supabase db push`.
--
-- Modèle retenu :
--   • Tout nouveau compte reçoit 7 jours d'essai complet (aucun paiement demandé).
--   • Le paiement PROLONGE l'accès à partir de la fin de l'essai : les jours
--     d'essai restants ne sont jamais perdus.
--   • Mobile Money / FCFA  → Moneroo, paiement ponctuel (pass à durée fixe).
--   • Carte / EUR          → Stripe, abonnement à renouvellement automatique.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- 1. Colonnes d'abonnement sur profiles
-- ───────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
  -- 'trialing' | 'active' | 'expired' | 'canceled' | 'past_due'
  ADD COLUMN IF NOT EXISTS subscription_status   TEXT        NOT NULL DEFAULT 'trialing',
  -- 'mensuel' | 'semestriel' | 'annuel'
  ADD COLUMN IF NOT EXISTS subscription_plan     TEXT,
  -- 'moneroo' | 'stripe'
  ADD COLUMN IF NOT EXISTS subscription_provider TEXT,
  -- 'XOF' | 'EUR'
  ADD COLUMN IF NOT EXISTS subscription_currency TEXT,
  -- Fin de l'essai gratuit de 7 jours, posée à la création du profil
  ADD COLUMN IF NOT EXISTS trial_ends_at         TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  -- Fin de la période payée en cours
  ADD COLUMN IF NOT EXISTS current_period_end    TIMESTAMPTZ,
  -- Stripe uniquement : résiliation programmée en fin de période
  ADD COLUMN IF NOT EXISTS cancel_at_period_end  BOOLEAN     NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS stripe_customer_id    TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Rattrapage pour les comptes déjà existants : on leur ouvre 7 jours d'essai
-- à partir de maintenant plutôt que de les bloquer immédiatement.
UPDATE public.profiles
   SET trial_ends_at = NOW() + INTERVAL '7 days'
 WHERE trial_ends_at IS NULL;

CREATE INDEX IF NOT EXISTS profiles_stripe_customer_idx
  ON public.profiles (stripe_customer_id);
CREATE INDEX IF NOT EXISTS profiles_stripe_subscription_idx
  ON public.profiles (stripe_subscription_id);


-- ───────────────────────────────────────────────────────────────────────
-- 2. payments — une ligne par tentative de paiement
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.payments (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  provider                TEXT NOT NULL,                     -- 'moneroo' | 'stripe'
  plan_id                 TEXT NOT NULL,                     -- 'mensuel' | 'semestriel' | 'annuel'
  -- Montant dans la plus petite unité : XOF = francs entiers, EUR = centimes.
  amount                  INTEGER NOT NULL,
  currency                TEXT NOT NULL,                     -- 'XOF' | 'EUR'
  -- 'pending' | 'completed' | 'failed' | 'refunded'
  status                  TEXT NOT NULL DEFAULT 'pending',
  provider_transaction_id TEXT,
  checkout_url            TEXT,
  customer_email          TEXT,
  customer_name           TEXT,
  failure_reason          TEXT,
  metadata                JSONB,
  webhook_received_at     TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS payments_user_idx        ON public.payments (user_id);
CREATE INDEX IF NOT EXISTS payments_status_idx      ON public.payments (status);
CREATE INDEX IF NOT EXISTS payments_provider_tx_idx ON public.payments (provider_transaction_id);


-- ───────────────────────────────────────────────────────────────────────
-- 3. processed_events — déduplication des webhooks (TTL 24 h)
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.processed_events (
  provider     TEXT NOT NULL,
  event_id     TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (provider, event_id)
);

CREATE INDEX IF NOT EXISTS processed_events_processed_at_idx
  ON public.processed_events (processed_at);

-- Nettoyage à programmer (pg_cron ou tâche externe) :
--   DELETE FROM public.processed_events WHERE processed_at < NOW() - INTERVAL '24 hours';


-- ───────────────────────────────────────────────────────────────────────
-- 4. Row Level Security
-- ───────────────────────────────────────────────────────────────────────
-- La clé service_role contourne RLS : les webhooks et le checkout serveur
-- écrivent librement. Ces politiques ne concernent que le client navigateur.

ALTER TABLE public.payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_events ENABLE ROW LEVEL SECURITY;

-- Chaque utilisateur lit uniquement son propre historique de paiements.
DROP POLICY IF EXISTS "payments_select_own" ON public.payments;
CREATE POLICY "payments_select_own"
  ON public.payments FOR SELECT
  USING (auth.uid() = user_id);

-- Aucune politique d'écriture : seul le serveur (service_role) écrit.
-- processed_events reste totalement inaccessible au navigateur.


-- ───────────────────────────────────────────────────────────────────────
-- 5. Garde-fou : le navigateur ne doit jamais s'auto-attribuer un abonnement
-- ───────────────────────────────────────────────────────────────────────
-- profiles est modifiable par son propriétaire (préférences, avatar, série…).
-- Sans ce déclencheur, un utilisateur pourrait passer subscription_status à
-- 'active' depuis la console du navigateur. On fige donc les colonnes de
-- facturation : seul service_role peut les changer.

CREATE OR REPLACE FUNCTION public.protect_subscription_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- auth.role() vaut 'service_role' quand l'écriture vient de nos routes API.
  -- Le repli sur session_user laisse passer l'éditeur SQL du tableau de bord
  -- Supabase, où auth.role() est NULL : sans lui, une correction manuelle de
  -- l'abonnement serait silencieusement annulée par ce déclencheur.
  IF auth.role() = 'service_role'
     OR session_user IN ('postgres', 'supabase_admin', 'service_role') THEN
    RETURN NEW;
  END IF;

  NEW.subscription_status     := OLD.subscription_status;
  NEW.subscription_plan       := OLD.subscription_plan;
  NEW.subscription_provider   := OLD.subscription_provider;
  NEW.subscription_currency   := OLD.subscription_currency;
  NEW.subscription_tier       := OLD.subscription_tier;
  NEW.trial_ends_at           := OLD.trial_ends_at;
  NEW.current_period_end      := OLD.current_period_end;
  NEW.cancel_at_period_end    := OLD.cancel_at_period_end;
  NEW.stripe_customer_id      := OLD.stripe_customer_id;
  NEW.stripe_subscription_id  := OLD.stripe_subscription_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_subscription_columns_trigger ON public.profiles;
CREATE TRIGGER protect_subscription_columns_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_subscription_columns();
