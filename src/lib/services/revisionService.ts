import { createClient } from '@/lib/supabase/client';
import type { RevisionCarte } from '@/lib/supabase/types';
import type { EtatCarte, EtatPlanification } from '@/lib/srs/planificateur';

/**
 * Persistance de la répétition espacée (table `revisions_cartes`).
 * Comme les autres services : aucune exception, valeur neutre sans session
 * ou en cas d'erreur — la session de flashcards continue alors sans
 * enregistrer, comme avant.
 */

const TAILLE_PAGE = 1000;

function versEtat(ligne: RevisionCarte): EtatCarte {
  return {
    hanzi: ligne.hanzi,
    etat: ligne.etat as EtatPlanification,
    etape: ligne.etape,
    intervalleJours: ligne.intervalle_jours,
    facilite: ligne.facilite,
    echeance: ligne.echeance,
    nbRevisions: ligne.nb_revisions,
    nbOublis: ligne.nb_oublis,
    premiereRevision: ligne.premiere_revision,
    derniereRevision: ligne.derniere_revision,
  };
}

/** Toutes les cartes déjà étudiées par l'utilisateur, indexées par caractère. */
export async function fetchEtatsCartes(): Promise<Record<string, EtatCarte>> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const etats: Record<string, EtatCarte> = {};
  // Lecture par pages : Supabase plafonne une requête à 1 000 lignes.
  for (let debut = 0; ; debut += TAILLE_PAGE) {
    const { data, error } = await supabase
      .from('revisions_cartes')
      .select('*')
      .eq('user_id', user.id)
      .range(debut, debut + TAILLE_PAGE - 1);

    if (error) {
      console.error('Erreur de lecture des révisions :', error.message);
      return {};
    }
    for (const ligne of data ?? []) etats[ligne.hanzi] = versEtat(ligne);
    if (!data || data.length < TAILLE_PAGE) break;
  }
  return etats;
}

/** Enregistre l'état d'une carte après une note. Renvoie `false` en cas d'échec. */
export async function enregistrerEtatCarte(etat: EtatCarte): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase.from('revisions_cartes').upsert(
    {
      user_id: user.id,
      hanzi: etat.hanzi,
      etat: etat.etat,
      etape: etat.etape,
      intervalle_jours: etat.intervalleJours,
      facilite: etat.facilite,
      echeance: etat.echeance,
      nb_revisions: etat.nbRevisions,
      nb_oublis: etat.nbOublis,
      premiere_revision: etat.premiereRevision,
      derniere_revision: etat.derniereRevision,
    },
    { onConflict: 'user_id,hanzi' }
  );

  if (error) {
    console.error("Erreur d'enregistrement de la révision :", error.message);
    return false;
  }
  return true;
}

/** Nombre de cartes dont l'échéance est passée (rappel de révision). */
export async function compterCartesDues(): Promise<number> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from('revisions_cartes')
    .select('hanzi', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .lte('echeance', new Date().toISOString());

  if (error) {
    console.error('Erreur de comptage des révisions dues :', error.message);
    return 0;
  }
  return count ?? 0;
}
