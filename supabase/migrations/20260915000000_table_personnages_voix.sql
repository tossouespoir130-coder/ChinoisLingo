-- =============================================================================
-- Migration: Table personnages_voix pour synthèse audio ElevenLabs
-- Description: Stocke les mappings des voix ElevenLabs (personnages récurrents,
--              narrateurs d'histoires/articles, voix secondaires génériques et fondateur).
-- =============================================================================

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voice_category') THEN
    CREATE TYPE voice_category AS ENUM ('recurrent', 'narrator', 'generic', 'founder');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'voice_gender') THEN
    CREATE TYPE voice_gender AS ENUM ('female', 'male', 'neutral');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.personnages_voix (
  id TEXT PRIMARY KEY,
  character_name_fr TEXT NOT NULL,
  character_name_zh TEXT,
  voice_id TEXT,                                 -- ElevenLabs voice ID (modifiable sans redéploiement)
  category voice_category NOT NULL,
  gender voice_gender NOT NULL,
  model_id TEXT DEFAULT 'eleven_multilingual_v2',
  stability NUMERIC(3,2) DEFAULT 0.50,
  similarity_boost NUMERIC(3,2) DEFAULT 0.75,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.personnages_voix ENABLE ROW LEVEL SECURITY;

-- Lecture autorisée pour tous (pour que le client ou l'API puisse résoudre les voix)
DROP POLICY IF EXISTS "Lecture publique des configurations de voix" ON public.personnages_voix;
CREATE POLICY "Lecture publique des configurations de voix"
  ON public.personnages_voix
  FOR SELECT
  USING (true);

-- Modification réservée au rôle de service ou aux administrateurs
DROP POLICY IF EXISTS "Modification des voix par les administrateurs" ON public.personnages_voix;
CREATE POLICY "Modification des voix par les administrateurs"
  ON public.personnages_voix
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insertion des 14 entrées initiales avec ON CONFLICT DO UPDATE
INSERT INTO public.personnages_voix (id, character_name_fr, character_name_zh, voice_id, category, gender, description)
VALUES
  -- 1. Personnages récurrents des dialogues
  ('lily', 'Lily', '丽丽', NULL, 'recurrent', 'female', 'Voix féminine jeune et dynamique pour Lily'),
  ('mr_li', 'Monsieur Li', '李老师', NULL, 'recurrent', 'male', 'Voix masculine mature, posée et pédagogique pour le Professeur Li'),
  ('lao_wang', 'Directeur Wang / Lao Wang', '王总', NULL, 'recurrent', 'male', 'Voix masculine professionnelle et chaleureuse pour M. Wang'),
  ('katia', 'Katia', '卡佳', NULL, 'recurrent', 'female', 'Voix féminine d’affaires claire et élégante pour Katia'),
  ('brice', 'Brice', '布里斯', NULL, 'recurrent', 'male', 'Voix masculine déterminée et dynamique pour Brice'),
  ('anthony', 'Anthony', '安东尼', NULL, 'recurrent', 'male', 'Voix masculine jeune et persévérante pour Anthony'),
  
  -- 2. Fondateur / Voix clonée
  ('espoir_chinois', 'Espoir Chinois', '苏波', NULL, 'founder', 'male', 'Voix clonée officielle d’Espoir Chinois (à renseigner après le clonage)'),

  -- 3. Voix de narration pour Histoires & Articles (Pool de 3 voix)
  ('narrator_1', 'Narrateur 1', '旁白一', NULL, 'narrator', 'female', 'Voix de narration principale féminine pour histoires et articles'),
  ('narrator_2', 'Narrateur 2', '旁白二', NULL, 'narrator', 'male', 'Voix de narration principale masculine pour histoires et articles'),
  ('narrator_3', 'Narrateur 3', '旁白三', NULL, 'narrator', 'female', 'Voix de narration alternative pour varier d’un contenu à l’autre'),

  -- 4. Pool de voix génériques secondaires pour dialogues (2H / 2F)
  ('generic_male_1', 'Voix Masculine 1', '男声一', NULL, 'generic', 'male', 'Voix masculine secondaire pour figurants et rôles ponctuels (serveur, chauffeur, etc.)'),
  ('generic_male_2', 'Voix Masculine 2', '男声二', NULL, 'generic', 'male', 'Voix masculine secondaire alternative anti-collision'),
  ('generic_female_1', 'Voix Féminine 1', '女声一', NULL, 'generic', 'female', 'Voix féminine secondaire pour figurantes et rôles ponctuels (vendeuse, cliente, etc.)'),
  ('generic_female_2', 'Voix Féminine 2', '女声二', NULL, 'generic', 'female', 'Voix féminine secondaire alternative anti-collision')
ON CONFLICT (id) DO UPDATE SET
  character_name_fr = EXCLUDED.character_name_fr,
  character_name_zh = EXCLUDED.character_name_zh,
  category = EXCLUDED.category,
  gender = EXCLUDED.gender,
  description = EXCLUDED.description,
  updated_at = NOW();
