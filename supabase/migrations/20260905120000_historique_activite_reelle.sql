-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Historique d'activité réel & nettoyage des données héritées
-- ═══════════════════════════════════════════════════════════════════════
-- Le graphique du tableau de bord fabriquait sa courbe : il répartissait le
-- total de minutes sur les jours de la semaine et inventait un taux de
-- rétention (85 + fraction × 10). Aucun historique quotidien n'était stocké.
--
-- Cette table enregistre l'activité jour par jour. Le graphique devient donc
-- vide pour un compte neuf, puis se remplit avec des mesures réelles.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- 1. Historique quotidien
-- ───────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.daily_activity (
  user_id        UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  jour           DATE NOT NULL,
  minutes        INTEGER NOT NULL DEFAULT 0,
  mots_maitrises INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, jour)
);

CREATE INDEX IF NOT EXISTS daily_activity_user_jour_idx
  ON public.daily_activity (user_id, jour DESC);

ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;

-- Chacun lit et écrit uniquement sa propre activité.
DROP POLICY IF EXISTS "daily_activity_select_own" ON public.daily_activity;
CREATE POLICY "daily_activity_select_own"
  ON public.daily_activity FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "daily_activity_insert_own" ON public.daily_activity;
CREATE POLICY "daily_activity_insert_own"
  ON public.daily_activity FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "daily_activity_update_own" ON public.daily_activity;
CREATE POLICY "daily_activity_update_own"
  ON public.daily_activity FOR UPDATE USING (auth.uid() = user_id);


-- ───────────────────────────────────────────────────────────────────────
-- 2. Plus de niveau imposé d'office
-- ───────────────────────────────────────────────────────────────────────
-- `target_level` portait une valeur par defaut 'HSK 3' : chaque inscrit se
-- voyait attribuer un objectif qu'il n'avait jamais choisi, affiche ensuite
-- sur son profil comme s'il l'avait renseigne.

ALTER TABLE public.profiles ALTER COLUMN target_level DROP DEFAULT;


-- ───────────────────────────────────────────────────────────────────────
-- 3. Nettoyage des donnees heritees de l'ancienne interface
-- ───────────────────────────────────────────────────────────────────────
-- L'ancienne page Mon Compte initialisait le profil avec des constantes
-- ('Espoir Chinois', Paris, France, HSK 3, une biographie) et les enregistrait
-- en base. Ces valeurs n'ont ete choisies par personne : on les efface, sans
-- toucher a ce qu'un apprenant aurait reellement saisi.

UPDATE public.profiles
   SET bio = NULL
 WHERE bio = 'Passionné par l’apprentissage du mandarin et les opportunités commerciales avec la Chine.'
    OR bio = 'Passionné par l''apprentissage du mandarin et les opportunités commerciales avec la Chine.';

-- Le trio Paris / France / HSK 3 provenait des memes constantes. On ne
-- l'efface que lorsque les trois coincident exactement, pour ne pas effacer
-- le profil d'un apprenant reellement parisien.
UPDATE public.profiles
   SET city = NULL, country = NULL, target_level = NULL
 WHERE city = 'Paris' AND country = 'France' AND target_level = 'HSK 3';

UPDATE public.profiles
   SET target_level = NULL
 WHERE target_level = 'HSK 3' AND city IS NULL AND country IS NULL;
