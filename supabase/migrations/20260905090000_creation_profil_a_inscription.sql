-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Création automatique du profil à l'inscription
-- ═══════════════════════════════════════════════════════════════════════
-- Jusqu'ici la ligne `profiles` était écrite par le NAVIGATEUR juste après
-- l'inscription. Cela ne fonctionne que si Supabase ouvre immédiatement une
-- session, c'est-à-dire lorsque la confirmation par e-mail est DÉSACTIVÉE.
--
-- Dès que la confirmation est exigée — ce qui est le comportement voulu —
-- `signUp` ne renvoie plus de session : l'écriture depuis le navigateur est
-- alors refusée par RLS, et l'apprenant se retrouverait sans profil après
-- avoir cliqué sur son lien de confirmation.
--
-- On déplace donc cette création côté serveur, sur `auth.users`.
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
BEGIN
  -- Les métadonnées viennent de `options.data` passé à supabase.auth.signUp.
  v_prenom  := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'first_name'), '');
  v_nom     := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '');
  v_pseudo  := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'username'), '');
  v_complet := NULLIF(TRIM(NEW.raw_user_meta_data ->> 'full_name'), '');

  -- Repli sur la partie locale de l'adresse, jamais sur un nom inventé.
  IF v_pseudo IS NULL THEN
    v_pseudo := split_part(NEW.email, '@', 1);
  END IF;
  IF v_complet IS NULL THEN
    v_complet := COALESCE(NULLIF(TRIM(CONCAT_WS(' ', v_prenom, v_nom)), ''), v_pseudo);
  END IF;

  INSERT INTO public.profiles (
    id, email, username, full_name, first_name, last_name,
    role, subscription_status, subscription_tier
  )
  VALUES (
    NEW.id, NEW.email, v_pseudo, v_complet, v_prenom, v_nom,
    'membre', 'free', 'free'
  )
  -- Le navigateur peut avoir écrit la ligne en premier quand la confirmation
  -- est désactivée : on ne l'écrase pas.
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();


-- ───────────────────────────────────────────────────────────────────────
-- Rattrapage : comptes déjà créés sans ligne de profil
-- ───────────────────────────────────────────────────────────────────────

INSERT INTO public.profiles (id, email, username, full_name, role, subscription_status, subscription_tier)
SELECT
  u.id,
  u.email,
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data ->> 'username'), ''), split_part(u.email, '@', 1)),
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data ->> 'full_name'), ''), split_part(u.email, '@', 1)),
  'membre', 'free', 'free'
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;
