-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Tables pour Emails Log & Nouveaux Contenus
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.emails_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  destinataire TEXT NOT NULL,
  sujet TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('bienvenue', 'recap_hebdo', 'manuel', 'rappel_abonnement')),
  statut TEXT NOT NULL CHECK (statut IN ('envoye', 'echec', 'simule')),
  resend_id TEXT,
  erreur TEXT,
  envoye_par TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_emails_log_created_at ON public.emails_log(created_at);
CREATE INDEX IF NOT EXISTS idx_emails_log_type ON public.emails_log(type);
CREATE INDEX IF NOT EXISTS idx_emails_log_destinataire ON public.emails_log(destinataire);

CREATE TABLE IF NOT EXISTS public.nouveaux_contenus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rubrique TEXT NOT NULL CHECK (rubrique IN ('vocabulaire', 'ecoute_lecture', 'formation', 'livres')),
  sous_categorie TEXT CHECK (sous_categorie IN ('chansons', 'articles', 'histoires', 'dialogues', 'podcasts', 'videos', 'packs_hsk', 'combinaison', 'masterclass', 'ouvrages')),
  titre TEXT NOT NULL,
  description TEXT,
  lien TEXT NOT NULL,
  niveau_hsk TEXT,
  profil_cible TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nouveaux_contenus_created_at ON public.nouveaux_contenus(created_at);
CREATE INDEX IF NOT EXISTS idx_nouveaux_contenus_rubrique ON public.nouveaux_contenus(rubrique);

-- RLS
ALTER TABLE public.emails_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nouveaux_contenus ENABLE ROW LEVEL SECURITY;

-- Politiques pour administrateurs
CREATE POLICY "Admins can read all emails_log" ON public.emails_log
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage nouveaux_contenus" ON public.nouveaux_contenus
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
