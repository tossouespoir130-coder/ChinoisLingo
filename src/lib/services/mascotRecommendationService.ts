import { initialCourses } from '@/lib/mock/coursesData';
import { fetchContentProgress, fetchCourseProgress } from '@/lib/services/progressService';
import { createClient } from '@/lib/supabase/client';

export interface MascotRecommendation {
  id: string;
  title: string;
  categoryLabel: string;
  level: string;
  description: string;
  actionUrl: string;
  actionLabel: string;
  imageUrl?: string;
}

// Pool de contenus immersifs phares adaptés par niveau (Formations & Écoute/Lecture)
const RECOMMENDED_CATALOGUE: MascotRecommendation[] = [
  // HSK 1 - Formations & Podcasts
  {
    id: 'course_claire_hsk1',
    title: 'Podcast HSK 1 : L’Histoire de Claire en Chine',
    categoryLabel: 'Formation & Podcast 🎬',
    level: 'HSK 1',
    description: 'Suis les aventures immersives de Claire pour acquérir les bases du quotidien en mandarin.',
    actionUrl: '/formation?id=course_claire_hsk1',
    actionLabel: 'Lancer l’épisode 1'
  },
  {
    id: 'course_masterclass_hsk1',
    title: 'Masterclass HSK 1 : Maîtrise des Fondations',
    categoryLabel: 'Formation Vidéo 🎥',
    level: 'HSK 1',
    description: 'Les clés indispensables de prononciation, de grammaire et de fluidité avec Espoir Chinois.',
    actionUrl: '/formation?id=course_masterclass_hsk1',
    actionLabel: 'Suivre la masterclass'
  },
  // HSK 1 - Dialogues
  {
    id: 'dialogue_qui_es_tu',
    title: 'Dialogue : Qui es-tu ? (你是谁)',
    categoryLabel: 'Dialogue Vivant 💬',
    level: 'HSK 1',
    description: 'Fais connaissance avec le professeur Li et Xiaoming pour te présenter simplement.',
    actionUrl: '/ecoute-lecture?type=dialogues&id=dialogue_qui_es_tu',
    actionLabel: 'Écouter le dialogue'
  },
  {
    id: 'dialogue_premiere_rencontre',
    title: 'Dialogue : Première rencontre (第一次见面)',
    categoryLabel: 'Dialogue Vivant 💬',
    level: 'HSK 1',
    description: 'Apprends les présentations et salutations naturelles avec Wang Ming et Li Yue.',
    actionUrl: '/ecoute-lecture?type=dialogues&id=dialogue_premiere_rencontre',
    actionLabel: 'Écouter le dialogue'
  },
  {
    id: 'dialogue_au_restaurant',
    title: 'Dialogue : Au restaurant (在饭店)',
    categoryLabel: 'Dialogue Vivant 💬',
    level: 'HSK 1',
    description: 'Commande tes plats et boissons préférés en mandarin avec aisance.',
    actionUrl: '/ecoute-lecture?type=dialogues&id=dialogue_au_restaurant',
    actionLabel: 'Écouter le dialogue'
  },
  // HSK 1 - Histoires & Séries
  {
    id: 'series_mon_chat',
    title: 'Histoire : Mon chat (我的猫)',
    categoryLabel: 'Histoire Immersive 🐱',
    level: 'HSK 1',
    description: 'Une histoire douce et progressive avec audio synchronisé pour débuter la lecture.',
    actionUrl: '/ecoute-lecture?type=histoires&id=series_mon_chat',
    actionLabel: 'Lire l’histoire'
  },
  {
    id: 'histoire_le_the_chinois',
    title: 'Histoire : Le thé chinois (中国茶)',
    categoryLabel: 'Culture & Lecture 🍵',
    level: 'HSK 1',
    description: 'Découvre l’art du thé traditionnel chinois avec des phrases simples et captivantes.',
    actionUrl: '/ecoute-lecture?type=histoires&id=histoire_le_the_chinois',
    actionLabel: 'Découvrir le thé'
  },
  // HSK 2 / HSK 3 - Chansons & Dialogues
  {
    id: 'chanson_haoxiangni',
    title: 'Chanson : Tu Me Manques Tellement (好想你)',
    categoryLabel: 'Chanson Pop 🎵',
    level: 'HSK 2',
    description: 'Le tube joyeux de Joyce Chu avec paroles synchronisées et prononciation pour chanter et apprendre.',
    actionUrl: '/ecoute-lecture?type=chansons&id=chanson_haoxiangni',
    actionLabel: 'Écouter en musique'
  },
  {
    id: 'dialogue_mon_passeport',
    title: 'Dialogue : Où est mon passeport ? (我的护照在哪儿)',
    categoryLabel: 'Dialogue Voyage ✈️',
    level: 'HSK 2',
    description: 'Pratique les objets de voyage et les repères spatiaux dans une situation concrète.',
    actionUrl: '/ecoute-lecture?type=dialogues&id=dialogue_mon_passeport',
    actionLabel: 'Écouter le dialogue'
  },
  {
    id: 'chanson_shaonian',
    title: 'Chanson : L’Éternel Adolescent (少年)',
    categoryLabel: 'Chanson Énergique 🎵',
    level: 'HSK 3',
    description: 'Un hymne motivant pour garder ton élan d’apprentissage et ta persévérance.',
    actionUrl: '/ecoute-lecture?type=chansons&id=chanson_shaonian',
    actionLabel: 'Découvrir la chanson'
  },
  {
    id: 'chanson_women_buyiyang',
    title: 'Chanson : Nous Sommes Différents (我们不一样)',
    categoryLabel: 'Chanson Culte 🎵',
    level: 'HSK 3',
    description: 'L’incontournable chanson sur la fraternité et le parcours partagé.',
    actionUrl: '/ecoute-lecture?type=chansons&id=chanson_women_buyiyang',
    actionLabel: 'Écouter la chanson'
  },
  {
    id: 'article_la_cite_interdite',
    title: 'Article : La Cité Interdite (故宫)',
    categoryLabel: 'Lecture Culturelle 🏛️',
    level: 'HSK 2',
    description: 'Voyage au cœur de l’histoire impériale de Pékin avec lecture audio guidée.',
    actionUrl: '/ecoute-lecture?type=articles&id=article_la_cite_interdite',
    actionLabel: 'Lire l’article'
  }
];

const MASCOT_TOAST_STORAGE_KEY = 'chinoislingo_mascot_last_recommendation_time';
const MASCOT_LAST_RECOMMENDED_ID_KEY = 'chinoislingo_mascot_last_recommended_id';

// Intervalle variable entre 48h (2 jours) et 72h (3 jours)
const MIN_INTERVAL_MS = 48 * 60 * 60 * 1000;

/**
 * Vérifie si le délai variable (2 à 3 jours) est écoulé pour afficher une nouvelle recommandation
 */
export function shouldShowMascotRecommendation(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(MASCOT_TOAST_STORAGE_KEY);
    if (!raw) return true; // Premier déclenchement
    const lastTime = parseInt(raw, 10);
    if (isNaN(lastTime)) return true;
    const now = Date.now();
    return now - lastTime >= MIN_INTERVAL_MS;
  } catch {
    return false;
  }
}

/**
 * Enregistre l'apparition d'une recommandation pour espacer la prochaine de 2-3 jours
 */
export function recordMascotRecommendationShown(contentId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MASCOT_TOAST_STORAGE_KEY, Date.now().toString());
    localStorage.setItem(MASCOT_LAST_RECOMMENDED_ID_KEY, contentId);
  } catch {}
}

/**
 * Sélectionne dynamiquement le meilleur contenu non terminé pour l'élève selon son niveau
 */
export async function getSmartMascotRecommendation(userLevel = 'HSK 1'): Promise<MascotRecommendation | null> {
  if (typeof window === 'undefined') return null;

  try {
    // 1. Récupérer les contenus déjà terminés
    const [progressMap, courseProgressMap] = await Promise.all([
      fetchContentProgress(),
      fetchCourseProgress()
    ]);

    const lastRecommendedId = localStorage.getItem(MASCOT_LAST_RECOMMENDED_ID_KEY);

    // 2. Filtrer les contenus non encore terminés
    const uncompletedCandidates = RECOMMENDED_CATALOGUE.filter((item) => {
      // Si c'est un cours/formation
      const course = initialCourses.find(c => c.id === item.id);
      if (course) {
        const allLessonsDone = course.lessons.every(l => courseProgressMap[`${course.id}_${l.id}`]);
        if (allLessonsDone) return false;
      }

      // Si c'est un contenu écoute/lecture et qu'il est marqué terminé
      if (progressMap[item.id]?.isCompleted) return false;

      // Éviter de reproposer immédiatement le même s'il y en a d'autres
      if (item.id === lastRecommendedId && RECOMMENDED_CATALOGUE.length > 1) return false;
      
      return true;
    });

    if (uncompletedCandidates.length === 0) {
      // Si tout est terminé, on propose une rotation générale
      return RECOMMENDED_CATALOGUE[Math.floor(Math.random() * RECOMMENDED_CATALOGUE.length)];
    }

    // 3. Prioriser les contenus du niveau actuel de l'élève
    const levelMatched = uncompletedCandidates.filter((item) => item.level === userLevel);
    if (levelMatched.length > 0) {
      return levelMatched[Math.floor(Math.random() * levelMatched.length)];
    }

    // Sinon choisir dans le vivier global non terminé
    return uncompletedCandidates[Math.floor(Math.random() * uncompletedCandidates.length)];
  } catch (err) {
    console.error('Error fetching mascot recommendation:', err);
    return RECOMMENDED_CATALOGUE[0];
  }
}
