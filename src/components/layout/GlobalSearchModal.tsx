'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Portal } from '@/components/ui/Portal';
import {
  Search,
  X,
  Headphones,
  Sparkles,
  ArrowRight,
  Volume2,
  GraduationCap,
  Music,
  BookOpen,
  MessagesSquare,
  Newspaper,
  Radio,
  Play,
  Compass,
  Bookmark,
  Shuffle,
  CreditCard,
  User,
  Sliders,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { hskCompleteVocabulary } from '@/lib/data/hskCompleteDictionary';
import { readingCatalog, ReadingItem } from '@/app/(app)/ecoute-lecture/page';
import { initialCourses, CourseModule } from '@/lib/mock/coursesData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'vocab' | 'audio' | 'formation' | 'livres' | 'navigation';

// Livres et Programmes d'accompagnement
const booksAndProgramsCatalog = [
  {
    id: 'book_guangzhou_yiwu',
    title: 'Le Guide Ultime de Négociation à Guangzhou & Yiwu',
    description: '500 phrases d’or, clauses de contrats bilingues et stratégies de réduction de coûts avec les usines.',
    type: 'Livre / E-Book VIP',
    category: 'livres',
    url: '/livres',
    icon: '📖',
  },
  {
    id: 'book_transit_maritime',
    title: 'Lexique du Fret Maritime & Transit Douanier',
    description: 'Vocabulaire technique des connaissements (B/L), conteneurs (FCL/LCL) et incoterms en chinois.',
    type: 'Livre / E-Book VIP',
    category: 'livres',
    url: '/livres',
    icon: '🚢',
  },
  {
    id: 'program_immersion_coaching',
    title: 'Programme d’Immersion & Coaching Bilingue',
    description: 'Accompagnement personnalisé en direct pour préparer vos déplacements professionnels et foires internationales.',
    type: 'Programme',
    category: 'livres',
    url: '/livres',
    icon: '🎯',
  },
];

// Pages et Raccourcis Rapides du Système
const systemNavigationLinks = [
  {
    id: 'nav_dashboard',
    title: 'Tableau de Bord & Accueil',
    description: 'Accédez à votre série active, vos graphiques de progression et vos leçons en cours.',
    url: '/tableau-de-bord',
    category: 'navigation',
    icon: LayoutDashboard,
  },
  {
    id: 'nav_vocab_combo',
    title: 'Méthode de la Combinaison (Sujet + Verbe + Complément)',
    description: 'Créez des centaines de phrases fluides grâce au multiplicateur combinatoire.',
    url: '/vocabulaire?tab=combination',
    category: 'navigation',
    icon: Shuffle,
  },
  {
    id: 'nav_vocab_hsk',
    title: 'Vocabulaire HSK 1 à HSK 6 (4 991 mots & Flashcards 3D)',
    description: 'Entraînez-vous avec l’algorithme de répétition espacée SRS et la synthèse vocale.',
    url: '/vocabulaire?tab=hsk',
    category: 'navigation',
    icon: Sparkles,
  },
  {
    id: 'nav_vocab_mywords',
    title: 'Mes Mots & Phrases Enregistrées',
    description: 'Consultez et révisez votre carnet de vocabulaire personnalisé.',
    url: '/vocabulaire?tab=my_words',
    category: 'navigation',
    icon: Bookmark,
  },
  {
    id: 'nav_audio_songs',
    title: 'Chansons Chinoises (Paroles synchronisées & Pinyin)',
    description: 'Chantez et synchronisez votre lecture avec les meilleures chansons chinoises.',
    url: '/ecoute-lecture?cat=chansons',
    category: 'navigation',
    icon: Music,
  },
  {
    id: 'nav_audio_series',
    title: 'Série d’articles : Apprendre le Chinois avec Confiance',
    description: 'Conseils exclusifs et immersion progressive rédigés par Espoir Chinois.',
    url: '/ecoute-lecture?cat=articles',
    category: 'navigation',
    icon: Newspaper,
  },
  {
    id: 'nav_audio_dialogues',
    title: 'Dialogues Immersifs avec Personnages',
    description: 'Mises en situation réelles en Chine : usines, marchés, taxis, restaurants.',
    url: '/ecoute-lecture?cat=dialogues',
    category: 'navigation',
    icon: MessagesSquare,
  },
  {
    id: 'nav_audio_podcasts',
    title: 'Podcasts & Immersion Audio',
    description: 'Développez votre compréhension orale avec des podcasts natifs sous-titrés.',
    url: '/ecoute-lecture?cat=podcasts',
    category: 'navigation',
    icon: Radio,
  },
  {
    id: 'nav_formation',
    title: 'Formations Vidéo & Audio d’Espoir Chinois',
    description: 'Programmes complets pour débutants et professionnels.',
    url: '/formation',
    category: 'navigation',
    icon: GraduationCap,
  },
  {
    id: 'nav_profile',
    title: 'Mon Compte & Photo de Profil',
    description: 'Gérez votre profil, vos informations personnelles et votre avatar.',
    url: '/mon-compte?tab=profile',
    category: 'navigation',
    icon: User,
  },
  {
    id: 'nav_preferences',
    title: 'Préférences d’Apprentissage (Pinyin, Vitesse Audio, Thème)',
    description: 'Personnalisez votre affichage et votre cadence d’étude.',
    url: '/mon-compte?tab=preferences',
    category: 'navigation',
    icon: Sliders,
  },
  {
    id: 'nav_subscription',
    title: 'Abonnement VIP & Formules Illimitées',
    description: 'Passez au niveau supérieur avec un accès VIP illimité à toute la plateforme.',
    url: '/abonnement',
    category: 'navigation',
    icon: CreditCard,
  },
];

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Audio pronunciation helper for vocabulary
  const playAudio = (hanzi: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(hanzi);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filtered Results across entire platform
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const qClean = q.replace(/[\s\-_]/g, '');

    // Si aucune requête n'est saisie, l'état reste léger
    if (!q) {
      return {
        vocab: [],
        audio: [],
        formations: [],
        livres: [],
        navigation: [],
        totalCount: 0
      };
    }

    // 1. Vocabulaire HSK (4 991 mots)
    const vocabMatches = hskCompleteVocabulary.filter((item) => {
      const h = item.hanzi.toLowerCase();
      const p = item.pinyin.toLowerCase().replace(/[\s\-_]/g, '');
      const f = item.french.toLowerCase();
      const lvl = item.level.toLowerCase();
      return h.includes(q) || p.includes(qClean) || f.includes(q) || lvl.includes(q);
    }).slice(0, 10);

    // 2. Écoute & Lecture (Chansons, Podcasts, Articles, Dialogues, Histoires)
    const audioMatches = readingCatalog.filter((item: ReadingItem) => {
      const titleFr = item.titleFr.toLowerCase();
      const titleZh = item.titleZh.toLowerCase();
      const titlePinyin = (item.titlePinyin || '').toLowerCase().replace(/[\s\-_]/g, '');
      const artist = (item.artist || '').toLowerCase();
      const desc = item.description.toLowerCase();
      const type = item.type.toLowerCase();
      const lvl = item.level.toLowerCase();

      return (
        titleFr.includes(q) ||
        titleZh.includes(q) ||
        titlePinyin.includes(qClean) ||
        artist.includes(q) ||
        desc.includes(q) ||
        type.includes(q) ||
        lvl.includes(q)
      );
    }).slice(0, 8);

    // 3. Formations & Leçons Précises
    const formationResults: {
      id: string;
      title: string;
      courseTitle: string;
      description: string;
      level: string;
      badgeText: string;
      url: string;
      isLesson: boolean;
    }[] = [];

    initialCourses.forEach((course) => {
      const courseMatch =
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);

      // Leçons correspondantes
      course.lessons.forEach((lesson) => {
        if (
          lesson.title.toLowerCase().includes(q) ||
          (lesson.description || '').toLowerCase().includes(q)
        ) {
          formationResults.push({
            id: `lesson_${course.id}_${lesson.id}`,
            title: lesson.title,
            courseTitle: course.title,
            description: lesson.description || course.description,
            level: course.level,
            badgeText: `Leçon • ${lesson.duration}`,
            url: `/formation?course=${course.id}&lesson=${lesson.id}`,
            isLesson: true,
          });
        }
      });

      // Cours global (si pas déjà couvert par ses leçons ou si recherche de cours)
      if (courseMatch) {
        formationResults.push({
          id: `course_${course.id}`,
          title: course.title,
          courseTitle: 'Formateur : Espoir Chinois',
          description: course.description,
          level: course.level,
          badgeText: `${course.totalLessons} leçons`,
          url: `/formation?course=${course.id}`,
          isLesson: false,
        });
      }
    });

    const formationMatches = formationResults.slice(0, 6);

    // 4. Livres & Programmes
    const booksMatches = booksAndProgramsCatalog.filter((b) => {
      const title = b.title.toLowerCase();
      const desc = b.description.toLowerCase();
      const type = b.type.toLowerCase();
      return title.includes(q) || desc.includes(q) || type.includes(q);
    }).slice(0, 4);

    // 5. Pages & Navigation Système
    const navigationMatches = systemNavigationLinks.filter((nav) => {
      const title = nav.title.toLowerCase();
      const desc = nav.description.toLowerCase();
      return title.includes(q) || desc.includes(q);
    }).slice(0, 4);

    return {
      vocab: vocabMatches,
      audio: audioMatches,
      formations: formationMatches,
      livres: booksMatches,
      navigation: navigationMatches,
      totalCount: vocabMatches.length + audioMatches.length + formationMatches.length + booksMatches.length + navigationMatches.length
    };
  }, [query]);

  const handleNavigate = (url: string) => {
    onClose();
    router.push(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chansons': return Music;
      case 'podcasts': return Radio;
      case 'articles': return Newspaper;
      case 'dialogues': return MessagesSquare;
      default: return BookOpen;
    }
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-20 bg-black/65 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="nixtio-card w-full max-w-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl rounded-3xl overflow-hidden flex flex-col max-h-[88vh] animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input Bar */}
          <div className="p-4 sm:p-5 border-b border-[#E0E0E0] dark:border-[#2D2D2D] flex items-center gap-3.5 bg-white dark:bg-[#1E1E1E]">
            <Search className="w-5 h-5 text-[#6200EE] dark:text-[#BB86FC] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher chanson, mot HSK, podcast, formation en français ou chinois..."
              className="w-full bg-transparent border-none outline-none text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5] placeholder:text-[#9E9E9E] font-medium"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#757575] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-bold text-[#757575] dark:text-[#A0A0A0] bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-md shrink-0">
              ESC
            </kbd>
          </div>

          {/* Results Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 divide-y divide-[#E0E0E0] dark:divide-[#2D2D2D]">
            {/* ÉTAT INITIAL VIDE (AVANT LA SAISIE DE L'UTILISATEUR) */}
            {!query.trim() ? (
              <div className="py-8 px-2 flex flex-col items-center justify-center text-center space-y-5 animate-fadeIn">
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-[#212121] dark:text-[#F5F5F5]">
                    Que souhaitez-vous explorer aujourd’hui ?
                  </p>
                  <p className="text-xs text-[#757575] dark:text-[#A0A0A0] max-w-sm mx-auto">
                    Tapez un mot en français, chinois (Hanzi), Pinyin ou le titre d’une leçon.
                  </p>
                </div>

                {/* Suggestions rapides en texte simple (3-4 liens max, sans image ni carte) */}
                <div className="w-full max-w-md pt-1 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#757575] dark:text-[#A0A0A0] block text-left px-1">
                    Accès rapides
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Vocabulaire HSK 1 à 6', url: '/vocabulaire' },
                      { label: 'Méthode de la Combinaison', url: '/vocabulaire?tab=combinaison' },
                      { label: 'Écoute & Podcasts immersifs', url: '/ecoute-lecture' },
                      { label: 'Formations Espoir Chinois', url: '/formation' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleNavigate(item.url)}
                        className="px-3.5 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] hover:border-[#6200EE] hover:text-[#6200EE] dark:hover:text-[#BB86FC] text-xs font-semibold text-[#616161] dark:text-[#CCCCCC] transition-all btn-press inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{item.label}</span>
                        <ArrowRight className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* 1. Navigation Rapide & Raccourcis Système */}
                {results.navigation.length > 0 && (
                  <div className="space-y-3 pt-1 first:pt-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1.5">
                        <Compass className="w-3.5 h-3.5" />
                        <span>Navigation & Outils du Système</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                        {results.navigation.length} résultats
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {results.navigation.map((nav) => {
                        const Icon = nav.icon;
                        return (
                          <div
                            key={nav.id}
                            onClick={() => handleNavigate(nav.url)}
                            className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] hover:border-[#6200EE] hover:shadow-xs cursor-pointer transition-all flex items-center justify-between gap-3 group btn-press"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-display font-bold text-xs text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#6200EE] transition-colors truncate">
                                  {nav.title}
                                </h5>
                                <p className="text-[10.5px] text-[#757575] dark:text-[#A0A0A0] line-clamp-1 mt-0.5">
                                  {nav.description}
                                </p>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#757575] group-hover:text-[#6200EE] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. Écoute & Lecture (Chansons, Podcasts, Articles, Dialogues) */}
                {results.audio.length > 0 && (
                  <div className="space-y-3 pt-5 first:pt-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#00897B] dark:text-[#03DAC5] flex items-center gap-1.5">
                        <Headphones className="w-3.5 h-3.5" />
                        <span>Écoute & Lecture (Chansons, Podcasts, Articles)</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                        {results.audio.length} trouvés
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.audio.map((item) => {
                        const TypeIcon = getTypeIcon(item.type);
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleNavigate(`/ecoute-lecture?id=${item.id}`)}
                            className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] hover:border-[#03DAC5]/60 hover:shadow-md cursor-pointer transition-all flex items-center gap-3.5 group btn-press"
                          >
                            {/* HD Thumbnail */}
                            <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 bg-slate-200 dark:bg-zinc-800 shadow-2xs">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.imageUrl}
                                alt={item.titleFr}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-5 h-5 text-white fill-white" />
                              </div>
                            </div>

                            {/* Text info */}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] uppercase">
                                  {item.level}
                                </span>
                                <span className="text-[10px] font-bold text-[#757575] dark:text-[#A0A0A0] flex items-center gap-1">
                                  <TypeIcon className="w-3 h-3" />
                                  {item.type}
                                </span>
                              </div>

                              <h5 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#00897B] dark:group-hover:text-[#03DAC5] transition-colors truncate mt-0.5">
                                {item.titleFr}
                              </h5>

                              <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] truncate">
                                {item.titleZh} {item.artist ? `• ${item.artist}` : ''}
                              </p>
                            </div>

                            <ArrowRight className="w-4 h-4 text-[#757575] group-hover:text-[#00897B] dark:group-hover:text-[#03DAC5] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. Vocabulaire HSK 1 à 6 */}
                {results.vocab.length > 0 && (
                  <div className="space-y-3 pt-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Vocabulaire Standardisé HSK (1 à 6)</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                        {results.vocab.length} mots trouvés
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {results.vocab.map((w) => (
                        <div
                          key={w.id}
                          onClick={() => handleNavigate(`/vocabulaire?search=${encodeURIComponent(w.hanzi)}&level=${encodeURIComponent(w.level)}`)}
                          className="p-3 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] hover:border-[#6200EE]/50 hover:shadow-xs cursor-pointer transition-all flex items-start justify-between gap-2 group btn-press"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-hanzi font-black text-lg text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors">
                                {w.hanzi}
                              </span>
                              <span className="font-pinyin text-xs font-semibold text-[#6200EE] dark:text-[#BB86FC]">
                                {w.pinyin}
                              </span>
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]">
                                {w.level}
                              </span>
                            </div>
                            <p className="text-xs text-[#757575] dark:text-[#CCCCCC] truncate mt-0.5">
                              {w.french}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playAudio(w.hanzi);
                            }}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-[#1E1E1E] text-[#757575] hover:text-[#6200EE] shadow-2xs shrink-0 active:scale-90 transition-transform"
                            title="Écouter la prononciation"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Formations & Leçons Précises */}
                {results.formations.length > 0 && (
                  <div className="space-y-3 pt-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#FF6D00] dark:text-[#FFA726] flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Formations Vidéo & Audio</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                        {results.formations.length} trouvées
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.formations.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => handleNavigate(c.url)}
                          className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] hover:border-[#FF6D00]/50 hover:shadow-md cursor-pointer transition-all flex items-start justify-between gap-3 group btn-press"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#FF6D00]/15 text-[#D84315] dark:text-[#FFA726] uppercase">
                                {c.level}
                              </span>
                              <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0]">
                                {c.badgeText}
                              </span>
                            </div>
                            <h5 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#FF6D00] transition-colors truncate mt-1">
                              {c.title}
                            </h5>
                            <p className="text-xs text-[#757575] dark:text-[#A0A0A0] line-clamp-1 mt-0.5">
                              {c.courseTitle}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#757575] group-hover:text-[#FF6D00] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Livres & Programmes d'accompagnement */}
                {results.livres.length > 0 && (
                  <div className="space-y-3 pt-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#E91E63] dark:text-[#F06292] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Livres & Programmes d’Accompagnement</span>
                      </h4>
                      <span className="text-[11px] font-semibold text-[#757575] dark:text-[#A0A0A0]">
                        {results.livres.length} trouvés
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.livres.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => handleNavigate(b.url)}
                          className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] hover:border-[#E91E63]/50 hover:shadow-md cursor-pointer transition-all flex items-start justify-between gap-3 group btn-press"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <span className="text-2xl shrink-0">{b.icon}</span>
                            <div className="min-w-0">
                              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#E91E63]/10 text-[#E91E63] uppercase">
                                {b.type}
                              </span>
                              <h5 className="font-display font-bold text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#E91E63] transition-colors truncate mt-1">
                                {b.title}
                              </h5>
                              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] line-clamp-1 mt-0.5">
                                {b.description}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#757575] group-hover:text-[#E91E63] group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results Fallback */}
                {results.totalCount === 0 && (
                  <div className="py-10 text-center space-y-2">
                    <p className="text-sm font-semibold text-[#212121] dark:text-[#F5F5F5]">
                      Aucun résultat trouvé pour « {query} »
                    </p>
                    <p className="text-xs text-[#757575] dark:text-[#A0A0A0] max-w-md mx-auto leading-relaxed">
                      Essayez de rechercher un titre en français (ex: Dans Mon Chant, Claire), un caractère Hanzi (ex: 学习, 歌声), du Pinyin (ex: nihao) ou un mot de vocabulaire.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
}
