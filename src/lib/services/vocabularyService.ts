import { createClient } from '@/lib/supabase/client';
import { SavedWord } from '@/lib/supabase/types';

/**
 * Nombre de mots reellement dus a la revision aujourd'hui.
 *
 * Le rappel affichait « 12 cartes a reviser » en dur : un compte venant
 * d'etre cree, sans le moindre mot enregistre, voyait ce chiffre. On compte
 * desormais les lignes dont l'echeance est passee, plus celles jamais
 * revisees — qui sont dues par definition.
 *
 * Retourne 0 sans session ou en cas d'erreur : le rappel reste alors masque.
 */
export async function countWordsDueForReview(): Promise<number> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const maintenant = new Date().toISOString();

  const { count, error } = await supabase
    .from('saved_words')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .or(`next_review_at.is.null,next_review_at.lte.${maintenant}`);

  if (error) {
    console.error('Error counting words due for review:', error.message);
    return 0;
  }

  return count ?? 0;
}

export async function fetchUserSavedWords(): Promise<SavedWord[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('saved_words')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved words:', error);
    return [];
  }

  return data || [];
}

export async function addSavedWord(word: {
  hanzi: string;
  pinyin?: string;
  french: string;
  example?: string;
  note?: string;
  source_type?: 'custom' | 'combination' | 'hsk' | 'dictionary';
}): Promise<SavedWord | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('saved_words')
    .insert({
      user_id: user.id,
      hanzi: word.hanzi,
      pinyin: word.pinyin || null,
      french: word.french,
      example: word.example || null,
      note: word.note || null,
      source_type: word.source_type || 'custom',
      mastery_level: 0,
      review_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding saved word:', error);
    return null;
  }

  return data;
}

export async function removeSavedWord(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('saved_words')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting saved word:', error);
    return false;
  }

  return true;
}

export async function updateWordMasteryScore(id: string, isCorrect: boolean): Promise<boolean> {
  const supabase = createClient();
  
  // Fetch current mastery level and review count
  const { data: current } = await supabase
    .from('saved_words')
    .select('mastery_level, review_count')
    .eq('id', id)
    .single();

  if (!current) return false;

  const newLevel = isCorrect 
    ? Math.min((current.mastery_level || 0) + 1, 3) 
    : Math.max((current.mastery_level || 0) - 1, 0);

  const { error } = await supabase
    .from('saved_words')
    .update({
      mastery_level: newLevel,
      review_count: (current.review_count || 0) + 1,
      last_reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  return !error;
}
