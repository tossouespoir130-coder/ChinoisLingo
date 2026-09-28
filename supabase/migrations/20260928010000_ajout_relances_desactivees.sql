-- Migration: Ajout de la colonne relances_desactivees sur profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS relances_desactivees BOOLEAN DEFAULT FALSE;
