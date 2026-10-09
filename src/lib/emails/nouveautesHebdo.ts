import 'server-only';

import type { createAdminClient } from '@/lib/supabase/admin';
import { initialCourses } from '@/lib/mock/coursesData';
import type { ModeNewsletter, NouvelItemContenu } from './emailRecapHebdo';

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

type ClientAdmin = ReturnType<typeof createAdminClient>;

const JOUR_MS = 86_400_000;
/** Nombre de contenus rappelés une semaine sans nouveauté. */
const NB_RAPPELS = 3;
/** Une nouveauté envoyée récemment n'est pas rappelée avant ce délai. */
const DELAI_AVANT_RAPPEL_JOURS = 21;

function versItem(n: Record<string, unknown>): NouvelItemContenu {
  return n as unknown as NouvelItemContenu;
}

/** Date du dernier récapitulatif réellement envoyé (journal des e-mails). */
export async function dateDernierEnvoi(admin: ClientAdmin): Promise<Date | null> {
  const { data } = await admin
    .from('emails_log')
    .select('created_at')
    .eq('type', 'recap_hebdo')
    .eq('statut', 'envoye')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data?.created_at ? new Date(data.created_at) : null;
}

/**
 * Nouveautés réelles ajoutées depuis le dernier envoi (au plus 7 jours) :
 * un contenu déjà annoncé par un envoi manuel ne repart pas le jeudi suivant.
 */
export async function chargerNouveautesDeLaSemaine(admin: ClientAdmin, maintenant: Date = new Date()): Promise<NouvelItemContenu[]> {
  const ilYaSeptJours = new Date(maintenant.getTime() - 7 * JOUR_MS);
  const dernierEnvoi = await dateDernierEnvoi(admin);
  const depuis = dernierEnvoi && dernierEnvoi > ilYaSeptJours ? dernierEnvoi : ilYaSeptJours;

  const { data, error } = await admin
    .from('nouveaux_contenus')
    .select('id, rubrique, sous_categorie, titre, description, lien, niveau_hsk, profil_cible')
    .gt('created_at', depuis.toISOString())
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[newsletter] Lecture des nouveautés impossible :', error);
    return [];
  }

  return (data ?? []).map(versItem).filter((n) => {
    const valide = lienVersContenuReel(n);
    if (!valide) console.warn('[newsletter] Nouveauté ignorée (lien sans contenu réel) :', n.titre, n.lien);
    return valide;
  });
}

/** Description raccourcie à la fin d'une phrase ou d'un mot (≈ 220 caractères). */
function resumer(texte: string, max = 220): string {
  if (texte.length <= max) return texte;
  const coupe = texte.slice(0, max);
  const finPhrase = coupe.lastIndexOf('. ');
  return finPhrase > 80 ? coupe.slice(0, finPhrase + 1) : `${coupe.slice(0, coupe.lastIndexOf(' '))}…`;
}

/**
 * Contenus à rappeler une semaine sans nouveauté : formations du catalogue
 * et anciennes nouveautés réelles (hors celles envoyées récemment). La
 * sélection tourne d'une semaine à l'autre pour varier les rappels.
 */
export async function choisirContenusARappeler(admin: ClientAdmin, maintenant: Date = new Date()): Promise<NouvelItemContenu[]> {
  const limite = new Date(maintenant.getTime() - DELAI_AVANT_RAPPEL_JOURS * JOUR_MS).toISOString();
  const { data, error } = await admin
    .from('nouveaux_contenus')
    .select('id, rubrique, sous_categorie, titre, description, lien, niveau_hsk, profil_cible')
    .lt('created_at', limite);
  if (error) console.error('[newsletter] Lecture des anciennes nouveautés impossible :', error);

  const anciennes = (data ?? []).map(versItem).filter((n) => lienVersContenuReel(n));
  const formations: NouvelItemContenu[] = initialCourses.map((c) => ({
    id: `formation-${c.id}`,
    rubrique: 'formation',
    sous_categorie: null,
    titre: c.title,
    description: resumer(c.description),
    lien: `/formation?course=${c.id}`,
    niveau_hsk: c.level,
  }));

  // Ordre stable, puis rotation hebdomadaire : chaque semaine décale la fenêtre.
  const reserve = [...anciennes, ...formations].sort((a, b) => a.lien.localeCompare(b.lien));
  if (reserve.length <= NB_RAPPELS) return reserve;
  const semaine = Math.floor(maintenant.getTime() / (7 * JOUR_MS));
  const debut = (semaine * NB_RAPPELS) % reserve.length;
  return Array.from({ length: NB_RAPPELS }, (_, i) => reserve[(debut + i) % reserve.length]);
}

/**
 * Contenu de la newsletter de la semaine : les nouveautés s'il y en a, sinon
 * un rappel de contenus existants — un e-mail part ainsi chaque semaine.
 */
export async function preparerNewsletterDeLaSemaine(
  admin: ClientAdmin,
  maintenant: Date = new Date()
): Promise<{ mode: ModeNewsletter; contenus: NouvelItemContenu[] }> {
  const nouveautes = await chargerNouveautesDeLaSemaine(admin, maintenant);
  if (nouveautes.length > 0) return { mode: 'nouveautes', contenus: nouveautes };
  return { mode: 'rappel', contenus: await choisirContenusARappeler(admin, maintenant) };
}
