-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Journal des actions d'administration
-- ═══════════════════════════════════════════════════════════════════════
-- Ajoute la gestion des abonnements depuis l'espace admin, tracée.
--
-- Exigence : si l'écriture du journal échoue, l'action ne doit PAS être
-- considérée comme réussie. Deux appels REST successifs ne peuvent pas le
-- garantir — la modification pourrait passer et le journal échouer.
-- On passe donc par une fonction PL/pgSQL : son corps est une transaction,
-- donc la modification et sa trace réussissent ou échouent ensemble.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- 1. Table du journal
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admin_actions_log (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ON DELETE SET NULL et non CASCADE : supprimer un compte ne doit jamais
  -- effacer la trace des actions qui l'ont concerné.
  admin_id       UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES public.profiles (id) ON DELETE SET NULL,
  -- Copies figées : le journal doit rester lisible même si un compte
  -- est supprimé ou change d'adresse.
  admin_email    TEXT,
  target_email   TEXT,
  action         TEXT NOT NULL CHECK (action IN ('prolongation', 'annulation')),
  -- Détail structuré : durée ajoutée, dates avant/après.
  details        JSONB,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS admin_actions_log_created_idx
  ON public.admin_actions_log (created_at DESC);
CREATE INDEX IF NOT EXISTS admin_actions_log_target_idx
  ON public.admin_actions_log (target_user_id);

-- Aucune politique : le journal n'est jamais lu ni écrit depuis le
-- navigateur, uniquement par les routes serveur via service_role.
ALTER TABLE public.admin_actions_log ENABLE ROW LEVEL SECURITY;


-- ───────────────────────────────────────────────────────────────────────
-- 2. Action atomique : modification d'abonnement + trace
-- ───────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.admin_modifier_abonnement(
  p_admin_id  UUID,
  p_target_id UUID,
  p_action    TEXT,
  p_mois      INT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_admin_email   TEXT;
  v_target_email  TEXT;
  v_ancienne_fin  TIMESTAMPTZ;
  v_nouvelle_fin  TIMESTAMPTZ;
  v_plan          TEXT;
BEGIN
  -- Défense en profondeur : la route API vérifie déjà le rôle, mais cette
  -- fonction doit rester sûre même appelée directement.
  SELECT email INTO v_admin_email
    FROM public.profiles WHERE id = p_admin_id AND role = 'admin';
  IF v_admin_email IS NULL THEN
    RAISE EXCEPTION 'Action réservée aux administrateurs.';
  END IF;

  SELECT email, current_period_end INTO v_target_email, v_ancienne_fin
    FROM public.profiles WHERE id = p_target_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Utilisateur introuvable.';
  END IF;

  IF p_action = 'prolongation' THEN
    IF p_mois IS NULL OR p_mois NOT IN (1, 6, 12) THEN
      RAISE EXCEPTION 'Durée invalide : 1, 6 ou 12 mois attendus.';
    END IF;

    -- Même règle que le paiement : on empile sur la période en cours si
    -- elle court encore, sinon on repart de maintenant. Aucun jour perdu.
    v_nouvelle_fin := GREATEST(NOW(), COALESCE(v_ancienne_fin, NOW()))
                      + (p_mois || ' months')::INTERVAL;

    v_plan := CASE p_mois WHEN 1 THEN 'mensuel'
                          WHEN 6 THEN 'semestriel'
                          ELSE 'annuel' END;

    UPDATE public.profiles
       SET current_period_end   = v_nouvelle_fin,
           subscription_status  = 'active',
           subscription_tier    = 'premium',
           subscription_plan    = v_plan,
           cancel_at_period_end = FALSE,
           updated_at           = NOW()
     WHERE id = p_target_id;

  ELSIF p_action = 'annulation' THEN
    -- Retour immédiat au palier gratuit. `current_period_end` à NULL est
    -- cohérent avec la règle unique de l'app : un compte sans période en
    -- cours est gratuit, sans autre intervention.
    v_nouvelle_fin := NULL;

    UPDATE public.profiles
       SET current_period_end   = NULL,
           subscription_status  = 'free',
           subscription_tier    = 'free',
           subscription_plan    = NULL,
           cancel_at_period_end = FALSE,
           updated_at           = NOW()
     WHERE id = p_target_id;

  ELSE
    RAISE EXCEPTION 'Action inconnue : %', p_action;
  END IF;

  -- Trace écrite dans la MÊME transaction que la modification : si cette
  -- insertion échoue, la mise à jour ci-dessus est annulée avec elle.
  INSERT INTO public.admin_actions_log
    (admin_id, target_user_id, admin_email, target_email, action, details)
  VALUES (
    p_admin_id, p_target_id, v_admin_email, v_target_email, p_action,
    jsonb_build_object(
      'mois_ajoutes',  p_mois,
      'ancienne_fin',  v_ancienne_fin,
      'nouvelle_fin',  v_nouvelle_fin
    )
  );

  RETURN jsonb_build_object(
    'ok',           TRUE,
    'action',       p_action,
    'ancienne_fin', v_ancienne_fin,
    'nouvelle_fin', v_nouvelle_fin
  );
END;
$$;

-- La fonction n'est appelable que par le serveur (service_role).
REVOKE ALL ON FUNCTION public.admin_modifier_abonnement(UUID, UUID, TEXT, INT) FROM PUBLIC, anon, authenticated;
