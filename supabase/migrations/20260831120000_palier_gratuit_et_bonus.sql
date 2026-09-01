-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Passage au modèle freemium permanent
-- ═══════════════════════════════════════════════════════════════════════
-- Remplace l'essai de 7 jours par :
--   • un palier GRATUIT permanent dès l'inscription (quotas par rubrique),
--   • un bonus de 7 jours offert au PREMIER paiement, utilisable comme
--     accroche commerciale (« abonne-toi et obtiens 7 jours en plus »).
--
-- À exécuter après 20260831000000_abonnements_moneroo_stripe.sql.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- 1. Plus d'essai à l'inscription : le palier gratuit devient l'état initial
-- ───────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
  ALTER COLUMN subscription_status SET DEFAULT 'free';

ALTER TABLE public.profiles
  ALTER COLUMN trial_ends_at DROP DEFAULT;

-- Les comptes créés pendant la phase « essai » basculent sur le palier
-- gratuit. Personne ne perd d'accès : le gratuit n'expire jamais.
UPDATE public.profiles
   SET subscription_status = 'free',
       trial_ends_at       = NULL
 WHERE subscription_status = 'trialing'
    OR trial_ends_at IS NOT NULL;


-- ───────────────────────────────────────────────────────────────────────
-- 2. Bonus de 7 jours au premier paiement
-- ───────────────────────────────────────────────────────────────────────
-- Colonne explicite plutôt qu'une déduction depuis l'historique : elle rend
-- le bonus auditable et empêche de l'accorder deux fois si un apprenant
-- laisse son pass expirer puis se réabonne.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS bonus_7j_accorde BOOLEAN NOT NULL DEFAULT FALSE;

-- Un abonné déjà payant au moment de la migration est réputé avoir reçu son
-- bonus : on ne rétribue pas rétroactivement.
UPDATE public.profiles
   SET bonus_7j_accorde = TRUE
 WHERE current_period_end IS NOT NULL;


-- ───────────────────────────────────────────────────────────────────────
-- 3. Le garde-fou doit aussi protéger la nouvelle colonne
-- ───────────────────────────────────────────────────────────────────────
-- Sans cela, un utilisateur pourrait remettre bonus_7j_accorde à FALSE
-- depuis la console du navigateur et s'offrir 7 jours à chaque paiement.

CREATE OR REPLACE FUNCTION public.protect_subscription_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
  NEW.bonus_7j_accorde        := OLD.bonus_7j_accorde;

  RETURN NEW;
END;
$$;
