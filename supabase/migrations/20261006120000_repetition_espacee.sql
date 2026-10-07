-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Répétition espacée (planification de type Anki)
-- ═══════════════════════════════════════════════════════════════════════
-- Les boutons « À revoir / Difficile / Je sais / Facile » des flashcards
-- n'enregistraient rien : chaque session repartait de zéro. Cette table
-- conserve l'état de chaque carte, par apprenant, pour présenter les cartes
-- au bon moment et reprendre exactement là où l'apprenant s'est arrêté.
--
-- Une carte est identifiée par son caractère (`hanzi`), la clé déjà utilisée
-- par `saved_words` : corriger le pinyin ou la traduction d'un mot ne fait
-- donc jamais perdre sa progression. Aucune donnée existante n'est modifiée.
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.revisions_cartes (
  user_id            UUID NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  hanzi              TEXT NOT NULL,
  -- 'apprentissage' (nouvelle carte en cours d'étapes), 'revision',
  -- 'reapprentissage' (carte oubliée, en cours d'étapes)
  etat               TEXT NOT NULL CHECK (etat IN ('apprentissage', 'revision', 'reapprentissage')),
  -- Index de l'étape courante (apprentissage / réapprentissage)
  etape              INTEGER NOT NULL DEFAULT 0,
  -- Intervalle en jours (cartes en révision)
  intervalle_jours   INTEGER NOT NULL DEFAULT 0,
  -- Facteur de facilité, en pour mille (2500 = 250 %), comme Anki
  facilite           INTEGER NOT NULL DEFAULT 2500,
  echeance           TIMESTAMPTZ NOT NULL,
  nb_revisions       INTEGER NOT NULL DEFAULT 0,
  nb_oublis          INTEGER NOT NULL DEFAULT 0,
  premiere_revision  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  derniere_revision  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, hanzi)
);

CREATE INDEX IF NOT EXISTS revisions_cartes_echeance_idx
  ON public.revisions_cartes (user_id, echeance);

ALTER TABLE public.revisions_cartes ENABLE ROW LEVEL SECURITY;

-- Chacun lit et écrit uniquement ses propres cartes.
DROP POLICY IF EXISTS "revisions_cartes_select_own" ON public.revisions_cartes;
CREATE POLICY "revisions_cartes_select_own"
  ON public.revisions_cartes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "revisions_cartes_insert_own" ON public.revisions_cartes;
CREATE POLICY "revisions_cartes_insert_own"
  ON public.revisions_cartes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "revisions_cartes_update_own" ON public.revisions_cartes;
CREATE POLICY "revisions_cartes_update_own"
  ON public.revisions_cartes FOR UPDATE USING (auth.uid() = user_id);
