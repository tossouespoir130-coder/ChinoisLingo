import 'server-only';

import type { createAdminClient } from '@/lib/supabase/admin';
import { initialCourses } from '@/lib/mock/coursesData';
import type { NouvelItemContenu } from './emailRecapHebdo';

const TYPES_ECOUTE_LECTURE = ['chansons', 'videos', 'articles', 'histoires', 'dialogues', 'podcasts'];
const ONGLETS_VOCABULAIRE = ['themes', 'combinations', 'my-words', 'dictionary'];

/**
 * Vérifie que le lien d'une nouveauté pointe vers une rubrique existante,
 * avec des paramètres au format réel des liens profonds de l'application.
 * Les formations sont contrôlées contre le catalogue réel (`initialCourses`).
 */
export function lienVersContenuReel(item: Pick<NouvelItemContenu, 'rubrique' | 'lien'>): boolean {
  let url: URL;
  try {
    url = new URL(item.lien, 'https://chinoislingo.local');
  } catch {
    return false;
  }
  const p = url.searchParams;

  switch (item.rubrique) {
    case 'formation': {
      if (url.pathname !== '/formation') return false;
      const formation = initialCourses.find((c) => c.id === p.get('course'));
      if (!formation) return false;
      const lecon = p.get('lesson');
      return !lecon || formation.lessons.some((l) => l.id === lecon);
    }
    case 'ecoute_lecture':
      return (
        url.pathname === '/ecoute-lecture' &&
        TYPES_ECOUTE_LECTURE.includes(p.get('type') ?? '') &&
        /^[a-z0-9_]+$/.test(p.get('id') ?? '')
      );
    case 'vocabulaire':
      return url.pathname === '/vocabulaire' && ONGLETS_VOCABULAIRE.includes(p.get('tab') ?? '');
    case 'livres':
      return url.pathname === '/livres';
    default:
      return false;
  }
}

/**
 * Nouveautés réellement ajoutées au cours des 7 derniers jours.
 * Aucun repli sur des contenus plus anciens : s'il n'y a rien de neuf cette
 * semaine, la liste est vide et la newsletter n'est pas envoyée.
 */
export async function chargerNouveautesDeLaSemaine(admin: ReturnType<typeof createAdminClient>): Promise<NouvelItemContenu[]> {
  const ilYaSeptJours = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const { data, error } = await admin
    .from('nouveaux_contenus')
    .select('id, rubrique, sous_categorie, titre, description, lien, niveau_hsk, profil_cible')
    .gte('created_at', ilYaSeptJours)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[newsletter] Lecture des nouveautés impossible :', error);
    return [];
  }

  return (data ?? []).filter((n) => {
    const valide = lienVersContenuReel(n as NouvelItemContenu);
    if (!valide) console.warn('[newsletter] Nouveauté ignorée (lien sans contenu réel) :', n.titre, n.lien);
    return valide;
  }) as NouvelItemContenu[];
}
