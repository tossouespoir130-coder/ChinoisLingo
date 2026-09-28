-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Ajout du Record Personnel de Série (max_streak)
-- ═══════════════════════════════════════════════════════════════════════
-- Permet de conserver le record de jours consécutifs de pratique
-- même lorsque la série active est réinitialisée après un jour manqué.
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_streak INTEGER DEFAULT 1;

-- Initialisation du record avec la valeur actuelle de streak_days
UPDATE public.profiles 
SET max_streak = GREATEST(COALESCE(max_streak, 1), COALESCE(streak_days, 1));
