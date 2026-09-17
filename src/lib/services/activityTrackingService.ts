import { createClient } from '@/lib/supabase/client';
import { initialCourses } from '@/lib/mock/coursesData';

export interface TrackedActivityItem {
  id: string;
  title: string;
  category: 'Formation' | 'Chanson' | 'Livre' | 'Dialogue' | 'Article' | 'Lecture' | 'Histoire' | 'Vocabulaire' | 'Podcast' | 'Vidéo';
  categoryBadge: string;
  hskLevel: string;
  progressPercentage: number;
  duration: string;
  thumbnailUrl: string;
  href: string;
  isCompleted?: boolean;
  lastActivity?: string;
  lastOpenedAt?: number;
}

// Helper pour formater la date relative
function formatRelativeTime(timestamp?: number): string {
  if (!timestamp) return 'Récemment';
  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);

  if (diffMinutes < 2) return 'À l’instant';
  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours} h`;
  return 'Récemment';
}

/**
 * Résout les détails complets (vrai titre, niveau HSK, miniature YouTube/HD, durée)
 * pour n'importe quel ID de contenu ou de leçon, évitant tout titre générique.
 */
export function resolveContentDetails(contentId: string, contentType?: string): Partial<TrackedActivityItem> | null {
  if (!contentId) return null;

  // 1. Chercher dans les formations (leçons ou modules)
  for (const course of initialCourses) {
    if (course.id === contentId) {
      return {
        title: course.title,
        category: 'Formation',
        categoryBadge: 'FORMATION VIDÉO',
        hskLevel: course.level || 'Tous Niveaux',
        duration: `${course.totalLessons} leçons`,
        thumbnailUrl: course.thumbnailUrl || (course.lessons?.[0]?.youtubeId ? `https://img.youtube.com/vi/${course.lessons[0].youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80'),
        href: `/formation?course=${course.id}`,
      };
    }

    for (const lesson of course.lessons) {
      if (lesson.id === contentId || `${course.id}_${lesson.id}` === contentId) {
        return {
          title: lesson.title,
          category: 'Formation',
          categoryBadge: 'FORMATION VIDÉO',
          hskLevel: course.level || 'Tous Niveaux',
          duration: lesson.duration || '10 min',
          thumbnailUrl: lesson.youtubeId ? `https://img.youtube.com/vi/${lesson.youtubeId}/hqdefault.jpg` : course.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80',
          href: `/formation?course=${course.id}&lesson=${lesson.id}`,
        };
      }
    }
  }

  // 2. Détermination dynamique pour Écoute & Lecture
  let cat: TrackedActivityItem['category'] = 'Chanson';
  let catBadge = 'IMMERSION';
  let targetType = 'chansons';

  if (contentId.startsWith('chanson_')) {
    cat = 'Chanson';
    catBadge = 'CHANSON IMMERSIVE';
    targetType = 'chansons';
  } else if (contentId.startsWith('dialogue_') || contentId.startsWith('dlg_')) {
    cat = 'Dialogue';
    catBadge = 'ORAL & IMMERSION';
    targetType = 'dialogues';
  } else if (contentId.startsWith('article_') || contentId.startsWith('art_')) {
    cat = 'Article';
    catBadge = 'LECTURE BILINGUE';
    targetType = 'articles';
  } else if (contentId.startsWith('histoire_') || contentId.startsWith('series_') || contentId.startsWith('mon_chat_') || contentId.startsWith('vie_chine_')) {
    cat = 'Histoire';
    catBadge = 'HISTOIRE IMMERSIVE';
    targetType = 'histoires';
  } else if (contentId.startsWith('podcast_')) {
    cat = 'Podcast';
    catBadge = 'PODCAST AUDIO';
    targetType = 'podcasts';
  } else if (contentId.startsWith('video_')) {
    cat = 'Vidéo';
    catBadge = 'VIDÉO IMMERSIVE';
    targetType = 'videos';
  }

  // Mapping des titres et métadonnées connus pour un rendu parfait
  const titlesMap: Record<string, { title: string; level: string; duration: string; youtubeId?: string; image?: string }> = {
    // Chansons
    chanson_moli: { title: 'Fleur de Jasmin (茉莉花)', level: 'HSK 1', duration: '2 min 50', youtubeId: 'ItPX_lJjyPE' },
    chanson_tianmimi: { title: 'Doux comme le Miel (甜蜜蜜)', level: 'HSK 1', duration: '3 min 40', youtubeId: 'tc2tW0jFHPo' },
    chanson_anniversaire: { title: 'Joyeux Anniversaire (祝你生日快乐)', level: 'HSK 1', duration: '1 min 00', youtubeId: 'oMEtryL1cLk' },
    chanson_beijing: { title: 'Beijing vous Accueille (北京欢迎你)', level: 'HSK 2', duration: '6 min 40', youtubeId: 'IO9NIizev6M' },
    chanson_moon: { title: 'La Lune Représente mon Cœur (月亮代表我的心)', level: 'HSK 2', duration: '3 min 30', youtubeId: 'IiFm7AWP9n4' },
    chanson_pengyou: { title: 'Amis pour la Vie (朋友)', level: 'HSK 2', duration: '4 min 15', youtubeId: '6lbPgfKK7m4' },
    chanson_wings: { title: 'Des Ailes Invisibles (隐形的翅膀)', level: 'HSK 2', duration: '3 min 50', youtubeId: 'be2wvNFTLMc' },
    chanson_nanshuo: { title: 'Difficile de dire au Revoir (难说再见)', level: 'HSK 2', duration: '4 min 20', youtubeId: '2cKrIXnRDG8' },
    chanson_star: { title: 'L’Étoile la Plus Brillante (夜空中最亮的星)', level: 'HSK 3', duration: '4 min 12', youtubeId: '-uzuhqQIaTM' },
    chanson_naying: { title: 'Silence (默)', level: 'HSK 3', duration: '5 min 25', youtubeId: 'XJVuKRMogfE' },
    chanson_tonghua: { title: 'Conte de Fées (童话)', level: 'HSK 3', duration: '4 min 05', youtubeId: 'IBTmypxD2mU' },
    chanson_keneng: { title: 'Peut-être (可能)', level: 'HSK 3', duration: '3 min 50', youtubeId: 'errNa-R3vDM' },
    chanson_wode_geshengli: { title: 'Dans Mon Chant (我的歌声里)', level: 'HSK 3', duration: '3 min 40', youtubeId: 'w0dMz8RBG7g' },
    chanson_shinian: { title: 'Dix Ans (十年)', level: 'HSK 3', duration: '3 min 25', youtubeId: 'ZUc6mnHGzIM' },
    chanson_jinshengyuan: { title: 'Le Destin de cette Vie (今生缘)', level: 'HSK 4', duration: '4 min 10', youtubeId: 'uPfhib9zHtc' },
    chanson_xianchuzhendeni: { title: 'Montre qui tu es vraiment (现出真的你)', level: 'HSK 5', duration: '4 min 39', youtubeId: 'ISK2emgbm4c' },
    chanson_yeguang: { title: 'Lueur Nocturne (夜光)', level: 'HSK 5', duration: '4 min 30', youtubeId: '5JXOLr-32Wc' },
    chanson_toushiwodecuo: { title: 'Tout est ma faute (都是我的错)', level: 'HSK 6', duration: '5 min 26', youtubeId: 'nZ5LL2J49kQ' },
    chanson_qianbainian: { title: 'Qui se souviendra de qui (千百年后谁又记得谁)', level: 'HSK 6', duration: '3 min 38', youtubeId: 'BtS8G2V73ek' },
    chanson_renjian_yanhuo: { title: 'Les Lueurs de ce Monde (人间烟火)', level: 'HSK 6', duration: '3 min 35', youtubeId: 'lxPybHy4SoM' },

    // Dialogues
    dialogue_restaurant: { title: 'Commander au Restaurant (在饭馆点菜)', level: 'HSK 2', duration: '4 min', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=80' },
    dialogue_marche: { title: 'Faire ses Achats au Marché (在市场买水果)', level: 'HSK 2', duration: '3 min 30', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400&auto=format&fit=crop&q=80' },
    dialogue_hotel: { title: 'Réserver une Chambre d’Hôtel (在宾馆入住)', level: 'HSK 2', duration: '4 min', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&auto=format&fit=crop&q=80' },
    dialogue_taxi: { title: 'Prendre le Taxi à Pékin (打出租车)', level: 'HSK 1', duration: '3 min', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&auto=format&fit=crop&q=80' },
    dialogue_mon_passeport: { title: 'Où est mon passeport ? (我的护照在哪儿？)', level: 'HSK 2', duration: '3 min 30', image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80' },

    // Histoires & Séries
    series_mon_chat: { title: 'Mon Petit Chat Blanc (我的小白猫)', level: 'HSK 1', duration: '5 parties', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80' },
    series_arrivee_chine: { title: 'L’Arrivée en Chine (初到中国)', level: 'HSK 2', duration: '5 parties', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&auto=format&fit=crop&q=80' },
    series_vie_chine_business: { title: 'Vie Quotidienne & Business en Chine (在中国的生活与商务)', level: 'HSK 3', duration: '5 parties', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&auto=format&fit=crop&q=80' },

    // Articles
    article_decouvrir_la_chine: { title: 'Découvrir la Chine (中国)', level: 'HSK 1', duration: '2 min', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&auto=format&fit=crop&q=80' },
    article_the_chinois: { title: 'La Culture du Thé en Chine (中国茶文化)', level: 'HSK 2', duration: '3 min', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80' },
    article_nouvel_an: { title: 'La Fête du Printemps (春节)', level: 'HSK 2', duration: '3 min 30', image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80' },
  };

  const known = titlesMap[contentId];
  if (known) {
    return {
      title: known.title,
      category: cat,
      categoryBadge: catBadge,
      hskLevel: known.level,
      duration: known.duration,
      thumbnailUrl: known.youtubeId
        ? `https://img.youtube.com/vi/${known.youtubeId}/hqdefault.jpg`
        : known.image || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&auto=format&fit=crop&q=80',
      href: `/ecoute-lecture?type=${targetType}&id=${contentId}`,
    };
  }

  // Si non répertorié précisément, formatage propre à partir de l'id
  const cleanTitle = contentId
    .replace(/^(chanson_|dialogue_|article_|histoire_|podcast_|video_)/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: cleanTitle || 'Session d’Immersion',
    category: cat,
    categoryBadge: catBadge,
    hskLevel: 'HSK 1',
    duration: '4 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&auto=format&fit=crop&q=80',
    href: `/ecoute-lecture?type=${targetType}&id=${contentId}`,
  };
}

const STORAGE_KEY = 'chinoislingo_recent_activities';

/**
 * Enregistre immédiatement un contenu ou une leçon dès qu'il est ouvert ou consulté.
 */
export function recordOpenedActivity(activity: {
  id: string;
  title?: string;
  category?: TrackedActivityItem['category'];
  categoryBadge?: string;
  hskLevel?: string;
  duration?: string;
  thumbnailUrl?: string;
  href?: string;
  progressPercentage?: number;
  isCompleted?: boolean;
}): void {
  if (typeof window === 'undefined' || !activity.id) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list: TrackedActivityItem[] = raw ? JSON.parse(raw) : [];

    const resolved = resolveContentDetails(activity.id);

    const fullItem: TrackedActivityItem = {
      id: activity.id,
      title: activity.title || resolved?.title || 'Contenu ChinoisLingo',
      category: activity.category || resolved?.category || 'Chanson',
      categoryBadge: activity.categoryBadge || resolved?.categoryBadge || 'IMMERSION',
      hskLevel: activity.hskLevel || resolved?.hskLevel || 'HSK 1',
      duration: activity.duration || resolved?.duration || '5 min',
      thumbnailUrl: activity.thumbnailUrl || resolved?.thumbnailUrl || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&auto=format&fit=crop&q=80',
      href: activity.href || resolved?.href || '/tableau-de-bord',
      progressPercentage: activity.isCompleted ? 100 : (activity.progressPercentage ?? 35),
      isCompleted: !!activity.isCompleted,
      lastActivity: 'À l’instant',
      lastOpenedAt: Date.now(),
    };

    // Supprimer l'ancienne occurrence si elle existe et insérer en tête
    list = list.filter((item) => item.id !== activity.id);
    list.unshift(fullItem);

    // Garder les 5 plus récents
    list = list.slice(0, 5);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    // Mettre à jour le cache dashboard pour affichage immédiat
    const dashStats = localStorage.getItem('chinoislingo_user_dashboard_stats');
    if (dashStats) {
      try {
        const parsed = JSON.parse(dashStats);
        parsed.recentActivities = list;
        localStorage.setItem('chinoislingo_user_dashboard_stats', JSON.stringify(parsed));
      } catch {}
    }

    // Émettre un événement pour mise à jour réactive
    window.dispatchEvent(new CustomEvent('chinoislingo_activity_updated', { detail: list }));
  } catch (err) {
    console.error('Erreur recordOpenedActivity:', err);
  }
}

/**
 * Récupère les activités récentes depuis le stockage local avec dates relatives à jour.
 */
export function getLocalRecentActivities(): TrackedActivityItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: TrackedActivityItem[] = JSON.parse(raw);
    return list.map((item) => ({
      ...item,
      lastActivity: formatRelativeTime(item.lastOpenedAt),
    }));
  } catch {
    return [];
  }
}

/**
 * Enregistre le temps d'étude réel passé en minutes et notifie l'application.
 */
export async function trackStudyMinutes(minutesToAdd: number = 1): Promise<void> {
  if (typeof window === 'undefined' || minutesToAdd <= 0) return;

  const today = new Date().toISOString().split('T')[0];
  const TODAY_KEY = `chinoislingo_study_min_${today}`;

  try {
    // 1. Mise à jour locale du jour
    const currentDayMin = Number(localStorage.getItem(TODAY_KEY) || '0');
    const newDayMin = currentDayMin + minutesToAdd;
    localStorage.setItem(TODAY_KEY, String(newDayMin));

    // 2. Mettre à jour le dashboard stats en cache
    const dashStats = localStorage.getItem('chinoislingo_user_dashboard_stats');
    if (dashStats) {
      try {
        const parsed = JSON.parse(dashStats);
        if (parsed.chartData?.week) {
          const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
          const currentDayLabel = JOURS[new Date().getDay()];
          const point = parsed.chartData.week.find((p: any) => p.label === currentDayLabel);
          if (point) {
            point.studyTimeMinutes = newDayMin;
            point.studyTimeHours = Number((newDayMin / 60).toFixed(1));
          }
        }
        parsed.totalMinutesLearned = (parsed.totalMinutesLearned || 0) + minutesToAdd;
        localStorage.setItem('chinoislingo_user_dashboard_stats', JSON.stringify(parsed));
      } catch {}
    }

    // 3. Émettre l'événement pour mettre à jour le graphique en temps réel
    window.dispatchEvent(
      new CustomEvent('chinoislingo_study_time_updated', {
        detail: { dayMinutes: newDayMin, minutesAdded: minutesToAdd, today },
      })
    );

    // 4. Synchronisation avec Supabase en arrière-plan
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Récupérer la valeur actuelle en base
    const { data: existing } = await supabase
      .from('daily_activity')
      .select('minutes')
      .eq('user_id', user.id)
      .eq('jour', today)
      .maybeSingle();

    const dbMinutes = Math.max(newDayMin, (existing?.minutes ?? 0) + minutesToAdd);

    await supabase.from('daily_activity').upsert(
      {
        user_id: user.id,
        jour: today,
        minutes: dbMinutes,
      },
      { onConflict: 'user_id,jour' }
    );

    // Mettre à jour le profil avec la dernière activité en continu
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_minutes_learned, total_login_days, last_active_date')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      const isNewDay = profile.last_active_date !== today;
      const updatedLoginDays = isNewDay
        ? (profile.total_login_days || 0) + 1
        : (profile.total_login_days || 1);

      await supabase
        .from('profiles')
        .update({
          total_minutes_learned: (profile.total_minutes_learned || 0) + minutesToAdd,
          total_login_days: updatedLoginDays,
          last_active_date: today,
          last_sign_in_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }
  } catch (err) {
    console.warn('[ChinoisLingo] Erreur trackStudyMinutes:', err);
  }
}
