-- =============================================================================
-- Migration : Prise en charge du Format B (Vrai/Faux & Associations de Dialogues)
-- =============================================================================

-- 1. Rendre selected_choice_id nullable pour autoriser les questions Vrai/Faux et Associations
alter table public.exercise_answers 
  alter column selected_choice_id drop not null;

-- 2. Ajouter les colonnes pour les réponses de type true_false et matching_images
alter table public.exercise_answers 
  add column if not exists selected_boolean boolean default null,
  add column if not exists selected_matches jsonb default null;

-- 3. Contrainte d'intégrité stricte : exactement une seule colonne de réponse doit être renseignée
alter table public.exercise_answers
  drop constraint if exists check_single_answer_type;

alter table public.exercise_answers
  add constraint check_single_answer_type check (
    (
      (case when selected_choice_id is not null then 1 else 0 end) +
      (case when selected_boolean is not null then 1 else 0 end) +
      (case when selected_matches is not null then 1 else 0 end)
    ) = 1
  );

-- Commentaires de documentation
comment on column public.exercise_answers.selected_choice_id is 'Identifiant du choix sélectionné (A, B, C) pour les questions de type choice';
comment on column public.exercise_answers.selected_boolean is 'Valeur booléenne pour les questions de type true_false (Vrai ou Faux)';
comment on column public.exercise_answers.selected_matches is 'Objet JSON des correspondances {dialogue_id: image_id} pour les questions de type matching_images';
