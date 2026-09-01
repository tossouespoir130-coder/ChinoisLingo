-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Système de rôles et espace d'administration
-- ═══════════════════════════════════════════════════════════════════════
-- Structure volontairement extensible : une colonne `role` en texte libre
-- contrainte à une liste, plutôt qu'un booléen `is_admin`. Ajouter un rôle
-- (« moderateur », « formateur »…) ne demandera qu'à étendre la contrainte,
-- sans migration de données ni refonte du contrôle d'accès.
--
-- Le broadcast « Message du Fondateur » NE crée PAS de table : la table
-- `notifications` diffuse déjà à tous via `user_id IS NULL`, et ces messages
-- remontent dans la cloche du header. On la réutilise avec source='fondateur'.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- 1. Colonne de rôle
-- ───────────────────────────────────────────────────────────────────────
-- Distincte de `subscription_tier` : celle-ci décrit ce que l'apprenant a
-- payé, `role` décrit ce qu'il a le droit d'administrer. Les confondre
-- rendrait tout abonné premium administrateur.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'membre';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_valide'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_valide
      CHECK (role IN ('membre', 'admin'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);


-- ───────────────────────────────────────────────────────────────────────
-- 2. Le rôle doit être infalsifiable depuis le navigateur
-- ───────────────────────────────────────────────────────────────────────
-- profiles est modifiable par son propriétaire (préférences, avatar…).
-- Sans ce verrou, n'importe qui se promeut admin depuis la console.

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
  NEW.role                    := OLD.role;

  RETURN NEW;
END;
$$;


-- ───────────────────────────────────────────────────────────────────────
-- 3. Fonction de contrôle réutilisable
-- ───────────────────────────────────────────────────────────────────────
-- SECURITY DEFINER pour lire `profiles` sans dépendre des politiques RLS
-- de l'appelant, et sans risque de récursion dans une politique.

CREATE OR REPLACE FUNCTION public.est_admin(uid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = uid AND role = 'admin'
  );
$$;


-- ───────────────────────────────────────────────────────────────────────
-- 4. Diffusion d'annonces : politique de lecture
-- ───────────────────────────────────────────────────────────────────────
-- Les lignes à user_id NULL sont les annonces globales. Elles doivent être
-- lisibles par tous les comptes connectés ; l'écriture reste réservée au
-- serveur (service_role), donc aucune politique INSERT n'est ajoutée.

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "notifications_select_own_ou_globale" ON public.notifications;
CREATE POLICY "notifications_select_own_ou_globale"
  ON public.notifications FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════════════════
-- 5. DÉSIGNER LE PREMIER ADMINISTRATEUR
-- ═══════════════════════════════════════════════════════════════════════
-- Aucun compte n'est admin par défaut : c'est volontaire. Décommentez la
-- ligne ci-dessous en remplaçant l'adresse par la vôtre, puis exécutez-la.

-- UPDATE public.profiles SET role = 'admin' WHERE email = 'tossouespoir130@gmail.com';
