-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Colonnes protégées de `profiles` : verrou aussi à l'INSERTION
-- ═══════════════════════════════════════════════════════════════════════
-- `protect_subscription_columns` ne s'exécutait qu'avant un UPDATE. Un
-- INSERT direct depuis le navigateur (par exemple après la suppression de sa
-- propre ligne, ou si la ligne n'a pas été créée à l'inscription) pouvait donc
-- fixer `role = 'admin'` ou `subscription_status = 'active'`.
--
-- À l'insertion hors service_role, ces colonnes reprennent les valeurs d'un
-- nouveau compte — exactement celles qu'écrit déjà `handle_new_user`.
-- Le comportement à la mise à jour est inchangé.
--
-- À exécuter dans l'éditeur SQL de Supabase. Sans effet sur les données
-- existantes.
-- ═══════════════════════════════════════════════════════════════════════

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

  IF TG_OP = 'INSERT' THEN
    NEW.role                    := 'membre';
    NEW.subscription_status     := 'free';
    NEW.subscription_tier       := 'free';
    NEW.subscription_plan       := NULL;
    NEW.subscription_provider   := NULL;
    NEW.subscription_currency   := NULL;
    NEW.current_period_end      := NULL;
    NEW.cancel_at_period_end    := FALSE;
    NEW.stripe_customer_id      := NULL;
    NEW.stripe_subscription_id  := NULL;
    NEW.bonus_7j_accorde        := FALSE;
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
  NEW.role                    := OLD.role;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_subscription_columns_trigger ON public.profiles;
CREATE TRIGGER protect_subscription_columns_trigger
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_subscription_columns();
