-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Sauvegarde intégrale des données Onboarding dans Profiles
-- ═══════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_prenom TEXT;
  v_nom    TEXT;
  v_pseudo TEXT;
  v_complet TEXT;
  v_profil TEXT;
  v_objectif TEXT;
  v_niveau TEXT;
  v_rappels BOOLEAN;
BEGIN
  -- Les métadonnées viennent de `options.data` passé à supabase.auth.signUp.
  v_prenom   := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'first_name'), '');
  v_nom      := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '');
  v_pseudo   := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'username'), '');
  v_complet  := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'full_name'), '');
  v_profil   := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'onboarding_profil'), '');
  v_objectif := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'onboarding_objectif'), '');
  v_niveau   := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'onboarding_niveau'), '');
  v_rappels  := COALESCE((NEW.raw_user_meta_data ->> 'onboarding_rappels')::BOOLEAN, true);

  -- Repli sur la partie locale de l'adresse, jamais sur un nom inventé.
  IF v_pseudo IS NULL THEN
    v_pseudo := split_part(NEW.email, '@', 1);
  END IF;
  IF v_complet IS NULL THEN
    v_complet := COALESCE(NULLIF(TRIM(CONCAT_WS(' ', v_prenom, v_nom)), ''), v_pseudo);
  END IF;

  INSERT INTO public.profiles (
    id, email, username, full_name, first_name, last_name,
    role, subscription_status, subscription_tier,
    onboarding_profil, onboarding_objectif, onboarding_niveau, onboarding_rappels
  )
  VALUES (
    NEW.id, NEW.email, v_pseudo, v_complet, v_prenom, v_nom,
    'membre', 'free', 'free',
    v_profil, v_objectif, v_niveau, v_rappels
  )
  ON CONFLICT (id) DO UPDATE SET
    onboarding_profil = COALESCE(EXCLUDED.onboarding_profil, profiles.onboarding_profil),
    onboarding_objectif = COALESCE(EXCLUDED.onboarding_objectif, profiles.onboarding_objectif),
    onboarding_niveau = COALESCE(EXCLUDED.onboarding_niveau, profiles.onboarding_niveau),
    onboarding_rappels = COALESCE(EXCLUDED.onboarding_rappels, profiles.onboarding_rappels);

  RETURN NEW;
END;
$$;

-- Rattrapage des profils existants
UPDATE public.profiles p
SET 
  onboarding_profil = COALESCE(p.onboarding_profil, NULLIF(TRIM(u.raw_user_meta_data ->> 'onboarding_profil'), '')),
  onboarding_objectif = COALESCE(p.onboarding_objectif, NULLIF(TRIM(u.raw_user_meta_data ->> 'onboarding_objectif'), '')),
  onboarding_niveau = COALESCE(p.onboarding_niveau, NULLIF(TRIM(u.raw_user_meta_data ->> 'onboarding_niveau'), '')),
  onboarding_rappels = COALESCE(p.onboarding_rappels, (u.raw_user_meta_data ->> 'onboarding_rappels')::BOOLEAN, true)
FROM auth.users u
WHERE p.id = u.id;
