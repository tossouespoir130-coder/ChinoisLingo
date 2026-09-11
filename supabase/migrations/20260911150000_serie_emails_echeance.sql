-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Série complète d'e-mails autour de l'échéance
-- ═══════════════════════════════════════════════════════════════════════
-- Étend la série de rappels : J-7 et J-3 (existants), puis le jour de
-- l'échéance, 3 jours et 7 jours après si l'apprenant n'a pas renouvelé.
-- Concerne les abonnements qui ne se renouvellent pas seuls : Mobile Money,
-- et désormais les abonnements par carte annulés par l'apprenant.
--
-- À exécuter AVANT de déployer le code correspondant : sans elle, les
-- nouveaux types d'e-mails sont refusés par l'ancienne contrainte.
-- À exécuter après 20260911090000_emails_abonnement_mobile_money.sql.
-- ═══════════════════════════════════════════════════════════════════════


-- ───────────────────────────────────────────────────────────────────────
-- 1. Nouveaux types d'e-mails
-- ───────────────────────────────────────────────────────────────────────
-- La contrainte d'origine a été créée en ligne, donc nommée par PostgreSQL.
-- On retire toute contrainte CHECK de la table plutôt que de parier sur ce
-- nom : c'est la seule qu'elle porte.

DO $$
DECLARE
  contrainte RECORD;
BEGIN
  FOR contrainte IN
    SELECT conname
      FROM pg_constraint
     WHERE conrelid = 'public.emails_abonnement'::regclass
       AND contype = 'c'
  LOOP
    EXECUTE format('ALTER TABLE public.emails_abonnement DROP CONSTRAINT %I', contrainte.conname);
  END LOOP;
END $$;

ALTER TABLE public.emails_abonnement
  ADD CONSTRAINT emails_abonnement_type_check
  CHECK (type IN (
    'confirmation',
    'rappel_j7',
    'rappel_j3',
    'expiration_j0',
    'relance_j3',
    'relance_j7'
  ));


-- ───────────────────────────────────────────────────────────────────────
-- 2. Index de la tâche quotidienne
-- ───────────────────────────────────────────────────────────────────────
-- Elle parcourt aussi les abonnements par carte : l'index partiel limité à
-- Mobile Money ne suffit plus.

DROP INDEX IF EXISTS public.profiles_echeance_moneroo_idx;

CREATE INDEX IF NOT EXISTS profiles_echeance_idx
  ON public.profiles (current_period_end)
  WHERE current_period_end IS NOT NULL;
