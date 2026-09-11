-- ═══════════════════════════════════════════════════════════════════════
-- ChinoisLingo — Désabonnement des relances commerciales
-- ═══════════════════════════════════════════════════════════════════════
-- Les e-mails envoyés APRÈS la fin d'un abonnement (J+3 et J+7) invitent à
-- se réabonner : ce sont des messages commerciaux, et la loi française impose
-- un moyen simple de s'y opposer. Les autres restent des messages de service
-- et ne sont pas concernés : confirmation de paiement, rappels avant
-- l'échéance et avis de fin d'abonnement.
--
-- Volontairement absente de `protect_subscription_columns` : contrairement aux
-- colonnes de facturation, celle-ci appartient à l'apprenant, qui doit pouvoir
-- la modifier lui-même.
--
-- À exécuter AVANT de déployer le code correspondant : sans elle, la tâche
-- quotidienne ne trouve pas la colonne et n'envoie plus aucun e-mail.
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS relances_desactivees BOOLEAN NOT NULL DEFAULT FALSE;
