-- =============================================================================
-- Migration: Système d'Exercices HSK sécurisé (Tentatives, Réponses & Résultats)
-- =============================================================================

-- 1. Table des Tentatives de Séries
create table if not exists public.exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  exercise_id text not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed', 'abandoned')),
  started_at timestamptz default now(),
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- 2. Table des Réponses Individuelles (Verrouillage d'unicité par tentative et question)
create table if not exists public.exercise_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.exercise_attempts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  exercise_id text not null,
  question_id text not null,
  selected_choice_id text not null,
  is_correct boolean not null,
  answered_at timestamptz default now(),
  unique (attempt_id, question_id) -- Interdit formellement toute soumission multiple d'une même question dans une tentative
);

-- 3. Table des Résultats Consolidés par Série
create table if not exists public.exercise_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  exercise_id text not null,
  score integer not null check (score >= 0),
  total_questions integer not null check (total_questions > 0 and score <= total_questions),
  percentage integer not null check (percentage >= 0 and percentage <= 100),
  best_score integer not null check (best_score >= score and best_score <= total_questions),
  time_spent_seconds integer default 0 check (time_spent_seconds >= 0),
  completed_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, exercise_id)
);

-- Index de performance
create index if not exists idx_exercise_attempts_user on public.exercise_attempts(user_id, exercise_id);
create index if not exists idx_exercise_answers_attempt on public.exercise_answers(attempt_id);
create index if not exists idx_exercise_results_user on public.exercise_results(user_id);

-- Activation stricte du Row Level Security (RLS) sur les 3 tables
alter table public.exercise_attempts enable row level security;
alter table public.exercise_answers enable row level security;
alter table public.exercise_results enable row level security;

-- Policies SELECT (Lecture seule pour l'utilisateur sur ses propres données)
drop policy if exists "Lecture seule des tentatives pour le propriétaire" on public.exercise_attempts;
create policy "Lecture seule des tentatives pour le propriétaire"
  on public.exercise_attempts for select
  using (auth.uid() = user_id);

drop policy if exists "Lecture seule des réponses pour le propriétaire" on public.exercise_answers;
create policy "Lecture seule des réponses pour le propriétaire"
  on public.exercise_answers for select
  using (auth.uid() = user_id);

drop policy if exists "Lecture seule des résultats pour le propriétaire" on public.exercise_results;
create policy "Lecture seule des résultats pour le propriétaire"
  on public.exercise_results for select
  using (auth.uid() = user_id);

-- Aucune policy INSERT/UPDATE/DELETE pour les utilisateurs :
-- Toutes les écritures sont effectuées côté serveur via le client admin (service_role).
