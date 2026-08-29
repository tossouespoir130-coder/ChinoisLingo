'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  mockVocabThemes, 
  VocabularyWord,
  normalizeSearchString,
  HSKLevel
} from '@/lib/mock/vocabulary';
import { hskCompleteVocabulary, HSKDictionaryEntry } from '@/lib/data/hskCompleteDictionary';
import { hskExhaustiveDatabase } from '@/lib/data/hskExhaustiveDb';
import { FlashcardSession } from '@/components/vocabulary/FlashcardSession';
import { AddWordModal } from '@/components/vocabulary/AddWordModal';
import { CombinationMethod } from '@/components/vocabulary/CombinationMethod';
import { WordDetailModal } from '@/components/vocabulary/WordDetailModal';
import { usePreferences } from '@/context/PreferencesContext';
import hsk1Json from '@/content/vocabulaire-hsk1.json';
import hsk2Json from '@/content/vocabulaire-hsk2.json';
import hsk3Json from '@/content/vocabulaire-hsk3.json';
import hsk4Json from '@/content/vocabulaire-hsk4.json';
import hsk5Json from '@/content/vocabulaire-hsk5.json';
import hsk6Json from '@/content/vocabulaire-hsk6.json';
import { 
  Sparkles, 
  Play, 
  Plus, 
  Search, 
  Volume2, 
  ListOrdered,
  Layers, 
  ArrowLeft, 
  Bookmark, 
  Check, 
  SlidersHorizontal, 
  BookmarkCheck, 
  BookOpen, 
  X, 
  Eye, 
  EyeOff 
} from 'lucide-react';

import { useAuth } from '@/lib/auth/AuthContext';
import { fetchUserSavedWords, addSavedWord, removeSavedWord } from '@/lib/services/vocabularyService';

function VocabulaireContent() {
  const { showPinyin, showFrenchTranslation, audioSpeed } = usePreferences();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [selectedThemeSlug, setSelectedThemeSlug] = useState<string | null>(null);
  const [selectedLevelForList, setSelectedLevelForList] = useState<HSKLevel | null>(null);
  const [isReviewingMyWords, setIsReviewingMyWords] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'combinations' | 'my-words' | 'dictionary'>('themes');

  // Handle direct tab navigation via ?tab=combinations, ?search=..., ?level=...
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const searchParam = searchParams.get('search') || searchParams.get('word');
    const levelParam = searchParams.get('level');

    if (searchParam) {
      setActiveTab('dictionary');
      setSearchQuery(searchParam);
      if (levelParam) {
        setSelectedLevel(levelParam);
      }
    } else if (tabParam === 'combinations' || tabParam === 'my-words' || tabParam === 'dictionary' || tabParam === 'themes') {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedWordForDetail, setSelectedWordForDetail] = useState<VocabularyWord | HSKDictionaryEntry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [animatedBars, setAnimatedBars] = useState(false);
  const [customWords, setCustomWords] = useState<VocabularyWord[]>([]);

  // Load user saved words from Supabase on mount or auth change
  useEffect(() => {
    async function loadSavedWords() {
      if (user) {
        const dbWords = await fetchUserSavedWords();
        if (dbWords.length > 0) {
          const ids = new Set<string>();
          const customList: VocabularyWord[] = [];

          dbWords.forEach((dbW) => {
            ids.add(dbW.id);
            customList.push({
              id: dbW.id,
              themeId: 'theme_custom',
              themeSlug: 'custom',
              themeName: 'Mes Mots Enregistrés',
              hanzi: dbW.hanzi,
              pinyin: dbW.pinyin || '',
              french: dbW.french,
              category: dbW.source_type === 'combination' ? 'Phrase combinée' : 'Personnel',
              level: 'HSK 1',
              cefrLevel: 'A1',
              businessTip: dbW.note || (dbW.example ? `Exemple : ${dbW.example}` : 'Mot enregistré dans votre collection.'),
              exampleHanzi: dbW.example || '',
              examplePinyin: '',
              exampleFrench: '',
              spacedRepetitionIntervalDays: 7,
              isSaved: true,
            });
          });

          setSavedWordIds(ids);
          setCustomWords(customList);
        }
      }
    }

    loadSavedWords();
  }, [user]);

  const handleOpenWordDetail = (word: VocabularyWord | HSKDictionaryEntry) => {
    setSelectedWordForDetail(word);
    setIsDetailModalOpen(true);
  };

  const getLevelBadgeStyle = (level: string) => {
    switch (level) {
      case 'HSK 1':
        return 'bg-[#00897B] text-white';
      case 'HSK 2':
        return 'bg-[#0288D1] text-white';
      case 'HSK 3':
        return 'bg-[#6200EE] text-white';
      case 'HSK 4':
        return 'bg-[#3F51B5] text-white';
      case 'HSK 5':
        return 'bg-[#8E24AA] text-white';
      case 'HSK 6':
        return 'bg-[#D81B60] text-white';
      case 'BTP':
        return 'bg-[#F57C00] text-white';
      case 'Santé':
        return 'bg-[#E91E63] text-white';
      case 'Commerce':
        return 'bg-[#00897B] text-white';
      default:
        return 'bg-[#6200EE] text-white';
    }
  };
  
  // Local toggle overrides
  const [localPinyinOverride, setLocalPinyinOverride] = useState<boolean | null>(null);
  const isPinyinVisible = localPinyinOverride !== null ? localPinyinOverride : showPinyin;

  // Initial saved words (fallback)
  const [savedWordIds, setSavedWordIds] = useState<Set<string>>(() => {
    return new Set<string>(['hsk1_001', 'hsk1_002', 'hsk1_005', 'hsk1_006', 'hsk1_014', 'hsk1_048', 'hsk1_061', 'hsk1_106', 'hsk1_150']);
  });
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // Combine datasets directly from official JSON files
  const fullDictionaryEntries = useMemo(() => {
    const rawList: HSKDictionaryEntry[] = [
      ...(hsk1Json.vocabulaire as HSKDictionaryEntry[]),
      ...(hsk2Json.vocabulaire as HSKDictionaryEntry[]),
      ...(hsk3Json.vocabulaire as HSKDictionaryEntry[]),
      ...(hsk4Json.vocabulaire as HSKDictionaryEntry[]),
      ...(hsk5Json.vocabulaire as HSKDictionaryEntry[]),
      ...(hsk6Json.vocabulaire as HSKDictionaryEntry[]),
    ];
    const seenIds = new Set<string>();
    const seenHanzi = new Set<string>();
    const result: HSKDictionaryEntry[] = [];

    for (const item of rawList) {
      if (!seenIds.has(item.id) && !seenHanzi.has(item.hanzi)) {
        seenIds.add(item.id);
        seenHanzi.add(item.hanzi);
        result.push(item);
      }
    }
    return result;
  }, []);

  // Convert HSK entries to standard VocabularyWord
  const dictionaryWordsAsVocab: VocabularyWord[] = useMemo(() => {
    return fullDictionaryEntries.map((entry) => ({
      id: entry.id,
      themeId: `theme_${entry.level.toLowerCase().replace(' ', '')}`,
      themeSlug: entry.level.toLowerCase().replace(' ', '-'),
      themeName: `${entry.level} — Vocabulaire Officiel`,
      hanzi: entry.hanzi,
      pinyin: entry.pinyin,
      french: entry.french,
      category: entry.category,
      level: entry.level,
      cefrLevel: entry.cefrLevel,
      businessTip: entry.businessTip,
      exampleHanzi: entry.exampleHanzi,
      examplePinyin: entry.examplePinyin,
      exampleFrench: entry.exampleFrench,
      spacedRepetitionIntervalDays: 7,
      isSaved: savedWordIds.has(entry.id),
    }));
  }, [fullDictionaryEntries, savedWordIds]);

  // All combined words (official + custom)
  const allWords = useMemo(() => {
    return [...dictionaryWordsAsVocab, ...customWords];
  }, [dictionaryWordsAsVocab, customWords]);

  // Words saved by user ("Mes Mots")
  const mySavedWords = useMemo(() => {
    return allWords.filter((w) => w.isSaved);
  }, [allWords]);

  // Search matching function
  const matchesSearch = (w: VocabularyWord | HSKDictionaryEntry, query: string) => {
    if (!query.trim()) return true;
    const normQ = normalizeSearchString(query);
    const normHanzi = w.hanzi.toLowerCase();
    const normPinyin = normalizeSearchString(w.pinyin);
    const normPinyinRaw = normalizeSearchString(w.pinyin.replace(/\s+/g, ''));
    const normFrench = normalizeSearchString(w.french);
    const normCategory = normalizeSearchString(w.category);
    const normTip = normalizeSearchString(w.businessTip);

    return (
      normHanzi.includes(query.toLowerCase().trim()) ||
      normPinyin.includes(normQ) ||
      normPinyinRaw.includes(normQ.replace(/\s+/g, '')) ||
      normFrench.includes(normQ) ||
      normCategory.includes(normQ) ||
      normTip.includes(normQ)
    );
  };

  // Animate progress bars on tab change
  useEffect(() => {
    setAnimatedBars(false);
    const timer = setTimeout(() => setAnimatedBars(true), 250);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const toggleSaveWord = async (wordId: string) => {
    const isCurrentlySaved = savedWordIds.has(wordId);
    
    setSavedWordIds((prev) => {
      const next = new Set(prev);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });

    if (user) {
      if (isCurrentlySaved) {
        await removeSavedWord(wordId);
      } else {
        const foundWord = allWords.find(w => w.id === wordId);
        if (foundWord) {
          await addSavedWord({
            hanzi: foundWord.hanzi,
            pinyin: foundWord.pinyin,
            french: foundWord.french,
            example: foundWord.exampleHanzi,
            note: foundWord.businessTip,
            source_type: 'hsk',
          });
        }
      }
    }
  };

  // Level List Words (Directly and strictly from official JSON datasets)
  const levelListWords = useMemo(() => {
    if (!selectedLevelForList) return [];
    let levelEntries: HSKDictionaryEntry[] = [];
    if (selectedLevelForList === 'HSK 1') levelEntries = hsk1Json.vocabulaire as HSKDictionaryEntry[];
    else if (selectedLevelForList === 'HSK 2') levelEntries = hsk2Json.vocabulaire as HSKDictionaryEntry[];
    else if (selectedLevelForList === 'HSK 3') levelEntries = hsk3Json.vocabulaire as HSKDictionaryEntry[];
    else if (selectedLevelForList === 'HSK 4') levelEntries = hsk4Json.vocabulaire as HSKDictionaryEntry[];
    else if (selectedLevelForList === 'HSK 5') levelEntries = hsk5Json.vocabulaire as HSKDictionaryEntry[];
    else if (selectedLevelForList === 'HSK 6') levelEntries = hsk6Json.vocabulaire as HSKDictionaryEntry[];

    return levelEntries
      .map((entry) => ({
        id: entry.id,
        themeId: `theme_${entry.level.toLowerCase().replace(' ', '')}`,
        themeSlug: entry.level.toLowerCase().replace(' ', '-'),
        themeName: `${entry.level} — Vocabulaire Officiel`,
        hanzi: entry.hanzi,
        pinyin: entry.pinyin,
        french: entry.french,
        category: entry.category,
        level: entry.level,
        cefrLevel: entry.cefrLevel,
        businessTip: entry.businessTip,
        exampleHanzi: entry.exampleHanzi,
        examplePinyin: entry.examplePinyin,
        exampleFrench: entry.exampleFrench,
        spacedRepetitionIntervalDays: 7,
        isSaved: savedWordIds.has(entry.id),
      }))
      .filter((w) => matchesSearch(w, searchQuery));
  }, [selectedLevelForList, searchQuery, savedWordIds]);

  // Filtered "Mes Mots"
  const filteredMyWords = useMemo(() => {
    return mySavedWords.filter((w) => {
      const matchLevel = selectedLevel === 'all' || w.level === selectedLevel;
      return matchLevel && matchesSearch(w, searchQuery);
    });
  }, [mySavedWords, searchQuery, selectedLevel]);

  // Filtered Dictionary (HSK 1-6)
  const filteredDictionaryWords = useMemo(() => {
    if (!searchQuery.trim() && selectedLevel === 'all') {
      return [];
    }
    return allWords.filter((w) => {
      const matchLevel = selectedLevel === 'all' || w.level === selectedLevel;
      return matchLevel && matchesSearch(w, searchQuery);
    });
  }, [allWords, searchQuery, selectedLevel]);

  // Words for active flashcard session
  const activeSessionWords = useMemo(() => {
    if (isReviewingMyWords) {
      return mySavedWords;
    }
    if (!selectedThemeSlug) return [];
    return allWords.filter((w) => w.themeSlug === selectedThemeSlug);
  }, [allWords, mySavedWords, isReviewingMyWords, selectedThemeSlug]);

  const activeTheme = useMemo(() => {
    return mockVocabThemes.find((t) => t.slug === selectedThemeSlug);
  }, [selectedThemeSlug]);

  const playAudio = (wordId: string, text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = parseFloat(audioSpeed) || 0.85;
      setPlayingWordId(wordId);
      utterance.onend = () => setPlayingWordId(null);
      utterance.onerror = () => setPlayingWordId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddWord = async (newWord: VocabularyWord) => {
    setCustomWords((prev) => [newWord, ...prev]);
    setSavedWordIds((prev) => new Set(prev).add(newWord.id));

    if (user) {
      const saved = await addSavedWord({
        hanzi: newWord.hanzi,
        pinyin: newWord.pinyin,
        french: newWord.french,
        example: newWord.exampleHanzi,
        note: newWord.businessTip,
        source_type: 'custom',
      });
      if (saved) {
        setCustomWords((prev) => prev.map(w => w.id === newWord.id ? { ...w, id: saved.id } : w));
        setSavedWordIds((prev) => {
          const next = new Set(prev);
          next.delete(newWord.id);
          next.add(saved.id);
          return next;
        });
      }
    }
  };

  const isSessionActive = Boolean(selectedThemeSlug || isReviewingMyWords);

  return (
    <div className="space-y-6 w-full max-w-full min-w-0 animate-fadeIn">
      {/* Top Header & Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E91E63]/15 dark:bg-[#E91E63]/25 text-[#E91E63] dark:text-[#F06292] flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E91E63] dark:text-[#F06292] px-2.5 py-1 rounded-full bg-[#E91E63]/10 dark:bg-[#E91E63]/20 border border-[#E91E63]/25">
              Vocabulaire
            </span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#212121] dark:text-[#F5F5F5] tracking-tight mt-2">
            Vocabulaire
          </h1>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5">
            Flashcards 3D et répétition espacée intelligente.
          </p>
        </div>

        {/* Action Controls & Quick Pinyin Display Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setLocalPinyinOverride(!isPinyinVisible)}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold transition-all btn-press ${
              isPinyinVisible
                ? 'bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border-[#6200EE]/30'
                : 'bg-[#FAFAFA] dark:bg-[#1E1E1E] text-[#757575] border-[#E0E0E0] dark:border-[#2D2D2D]'
            }`}
            title={isPinyinVisible ? 'Masquer le Pinyin' : 'Afficher le Pinyin'}
          >
            {isPinyinVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Pinyin</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 active:scale-95 transition-all btn-press"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un mot</span>
          </button>
        </div>
      </div>

      {/* 4 SUB-MENUS (Vocabulaire HSK, Méthode de la Combinaison, Mes Mots, Dictionnaire HSK 1-6) - FLUIDE & RESPONSIVE MOBILE */}
      {!isSessionActive && !selectedLevelForList && (
        <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-x-auto no-scrollbar scroll-smooth w-full">
          {[
            { id: 'themes', label: 'Vocabulaire HSK', icon: Layers, count: 6 },
            { id: 'combinations', label: 'Méthode de la Combinaison', icon: Sparkles },
            { id: 'my-words', label: 'Mes Mots', icon: BookmarkCheck, count: mySavedWords.length },
            { id: 'dictionary', label: 'Dictionnaire (HSK 1–6)', icon: Search, count: fullDictionaryEntries.length },
          ].map((sub) => {
            const Icon = sub.icon;
            const isActive = activeTab === sub.id;

            return (
              <button
                key={sub.id}
                onClick={(e) => {
                  setActiveTab(sub.id as any);
                  setSelectedLevel('all');
                  setSearchQuery('');
                  // Auto-scroll the clicked tab into view on mobile so it's fully visible and positioned at start
                  e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                }}
                type="button"
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all btn-press ${
                  isActive
                    ? 'bg-[#6200EE] text-white shadow-xs'
                    : 'text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{sub.label}</span>
                {sub.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-black/[0.05] dark:bg-white/[0.08] text-[#757575] dark:text-[#A0A0A0]'
                    }`}
                  >
                    {sub.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* DEDICATED FULL LEVEL LIST VIEW (Showing ALL words of HSK 1, HSK 2, etc.) */}
      {selectedLevelForList && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#6200EE]/10 dark:bg-[#6200EE]/15 border border-[#6200EE]/25">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedLevelForList(null)}
                type="button"
                className="w-9 h-9 rounded-xl bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center hover:bg-[#6200EE] hover:text-white transition-colors btn-press"
                title="Retour aux packs"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6200EE] text-white">
                    {selectedLevelForList}
                  </span>
                  <h3 className="font-display font-black text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5]">
                    Liste Complète des Mots du {selectedLevelForList} ({levelListWords.length} mots)
                  </h3>
                </div>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                  Consultez, écoutez et enregistrez l’intégralité des expressions officielles de ce niveau.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedThemeSlug(selectedLevelForList.toLowerCase().replace(' ', '-'));
                setSelectedLevelForList(null);
              }}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-sm active:scale-95 transition-all self-start sm:self-auto btn-press"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Réviser ce niveau</span>
            </button>
          </div>

          {/* Search inside level */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Rechercher parmi les ${levelListWords.length} mots du ${selectedLevelForList} (Hanzi, Pinyin ou Français)...`}
              className="w-full pl-10 pr-10 py-2.5 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Words Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {levelListWords.map((word, index) => {
              const isPlaying = playingWordId === word.id;
              const isSaved = word.isSaved;

              return (
                <div
                  key={`${word.id}_${index}`}
                  className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] flex flex-col justify-between gap-3 shadow-2xs hover:border-[#6200EE]/30 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-hanzi font-black text-2xl text-[#212121] dark:text-[#F5F5F5]">
                          {word.hanzi}
                        </span>
                        {isPinyinVisible && (
                          <span className="font-pinyin font-bold text-sm text-[#6200EE] dark:text-[#BB86FC]">
                            {word.pinyin}
                          </span>
                        )}
                      </div>
                      {showFrenchTranslation && (
                        <div className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] mt-0.5">
                          {word.french}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => toggleSaveWord(word.id)}
                        type="button"
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all btn-press ${
                          isSaved
                            ? 'bg-[#E91E63] text-white shadow-xs'
                            : 'bg-black/[0.03] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
                        }`}
                        title={isSaved ? 'Enregistré dans Mes Mots' : 'Ajouter à Mes Mots'}
                      >
                        {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => playAudio(word.id, word.hanzi)}
                        type="button"
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all btn-press ${
                          isPlaying
                            ? 'bg-[#6200EE] text-white animate-pulse'
                            : 'bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] hover:bg-[#6200EE] hover:text-white'
                        }`}
                        title="Écouter la prononciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] flex items-center justify-between gap-2 text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                    <span className="truncate">💡 {word.businessTip}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] shrink-0">
                      {word.level}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIVE FLASHCARD SESSION VIEW */}
      {isSessionActive && (
        <div className="space-y-4 animate-fadeIn">
          <button
            onClick={() => {
              setSelectedThemeSlug(null);
              setIsReviewingMyWords(false);
            }}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#757575] hover:text-[#212121] dark:text-[#A0A0A0] dark:hover:text-white transition-colors btn-press"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retourner au vocabulaire</span>
          </button>

          <FlashcardSession
            words={activeSessionWords}
            themeTitle={isReviewingMyWords ? 'Mes Mots Enregistrés' : (activeTheme ? activeTheme.title : 'Répétition Espacée')}
            onFinish={() => {
              setSelectedThemeSlug(null);
              setIsReviewingMyWords(false);
            }}
          />
        </div>
      )}

      {/* TAB 1: THEMES / PACKS HSK 1 - HSK 6 (2 columns on mobile, 3 on desktop) */}
      {!isSessionActive && !selectedLevelForList && activeTab === 'themes' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {mockVocabThemes.map((theme, idx) => {
              const pct = Math.round((theme.masteredCount / theme.cardCount) * 100);

              return (
                <div
                  key={theme.id}
                  className="nixtio-card bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE]/40 rounded-2xl sm:rounded-3xl overflow-hidden transition-all flex flex-col justify-between group shadow-xs hover:shadow-lg"
                >
                  {/* Top: Compact High Definition Image with Floating Badges */}
                  <div className="relative h-24 sm:h-36 w-full overflow-hidden bg-black/5">
                    <img
                      src={theme.imageUrl}
                      alt={theme.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                    {/* Floating Level / Domain Badge (Top Right) */}
                    <span
                      className={`absolute top-2 right-2 sm:top-3 sm:right-3 text-[8.5px] sm:text-[10px] font-black uppercase tracking-wider px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-md ${getLevelBadgeStyle(
                        theme.levelBadge
                      )}`}
                    >
                      {theme.levelBadge}
                    </span>

                    {/* Floating Word Count Badge (Bottom Left) */}
                    <span className="absolute bottom-1.5 left-1.5 sm:bottom-2.5 sm:left-2.5 text-[8px] sm:text-[10px] font-extrabold bg-black/60 backdrop-blur-md text-white px-1.5 sm:px-2 py-0.5 rounded-full border border-white/20 shadow-xs flex items-center gap-1">
                      <Layers className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-[#03DAC5]" />
                      <span>{theme.cardCount} mots</span>
                    </span>
                  </div>

                  {/* Bottom: Title, Single Concise Description, Progress Bar & Actions */}
                  <div className="p-2.5 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-black text-xs sm:text-base text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors leading-snug">
                        {theme.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-[#757575] dark:text-[#A0A0A0] mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>

                    {/* Progress & Dual Actions */}
                    <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] space-y-2 sm:space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold mb-1">
                          <span className="text-[#757575] dark:text-[#A0A0A0]">
                            {theme.masteredCount}/{theme.cardCount}
                          </span>
                          <span className="text-[#6200EE] dark:text-[#BB86FC] font-bold font-display">
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 sm:h-2 rounded-full bg-[#E0E0E0] dark:bg-[#2D2D2D] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5]"
                            style={{
                              width: animatedBars ? `${pct}%` : '0%',
                              transition: `width 3.2s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 120}ms`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Dual Action: View Full List + Launch Flashcards */}
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-1">
                        <button
                          onClick={() => setSelectedLevelForList(theme.levelBadge as HSKLevel)}
                          type="button"
                          className="py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-full bg-[#FAFAFA] dark:bg-[#252525] hover:bg-[#6200EE]/10 text-[#212121] dark:text-[#F5F5F5] hover:text-[#6200EE] dark:hover:text-[#BB86FC] border border-[#E0E0E0] dark:border-[#333333] text-[9.5px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-all btn-press"
                          title={`Voir la liste complète des mots`}
                        >
                          <ListOrdered className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                          <span className="truncate">Liste</span>
                        </button>

                        <button
                          onClick={() => setSelectedThemeSlug(theme.slug)}
                          type="button"
                          className="py-1.5 sm:py-2.5 px-1.5 sm:px-3 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-[9.5px] sm:text-xs font-bold flex items-center justify-center gap-1 shadow-sm shadow-[#6200EE]/25 active:scale-95 transition-all btn-press"
                        >
                          <Play className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-white" />
                          <span className="truncate">Réviser</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: MÉTHODE DE LA COMBINAISON (MOTEUR COMBINATOIRE INTERACTIF) */}
      {!isSessionActive && !selectedLevelForList && activeTab === 'combinations' && (
        <CombinationMethod
          isPinyinVisible={isPinyinVisible}
          audioSpeed={audioSpeed}
          onSaveSentenceToMyWords={handleAddWord}
        />
      )}

      {/* TAB 2: MES MOTS (ALWAYS SHOWS BOTH RÉVISER AND NOUVEAU MOT) */}
      {!isSessionActive && !selectedLevelForList && activeTab === 'my-words' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Banner for Mes Mots with ALWAYS VISIBLE RÉVISER BUTTON */}
          <div className="p-4 rounded-2xl bg-[#E91E63]/10 dark:bg-[#E91E63]/15 border border-[#E91E63]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E91E63] text-white flex items-center justify-center shadow-xs shrink-0">
                <Bookmark className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h3 className="font-display font-black text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5]">
                  Mes Mots Enregistrés ({filteredMyWords.length})
                </h3>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                  Tous les mots que vous avez mis en favoris ou créés manuellement.
                </p>
              </div>
            </div>

            {/* BOTH BUTTONS ARE ALWAYS PRESENT ON THE SAME LINE */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={() => {
                  if (mySavedWords.length > 0) {
                    setIsReviewingMyWords(true);
                  }
                }}
                disabled={mySavedWords.length === 0}
                type="button"
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-xs font-bold shadow-xs transition-all btn-press ${
                  mySavedWords.length === 0
                    ? 'bg-[#E0E0E0] dark:bg-[#2D2D2D] text-[#A0A0A0] dark:text-[#6E6E6E] cursor-not-allowed opacity-60'
                    : 'bg-[#6200EE] hover:bg-[#3700B3] active:scale-95'
                }`}
                title={mySavedWords.length === 0 ? 'Enregistrez d’abord des mots pour lancer une révision' : 'Lancer la session de révision'}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Réviser</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E91E63] hover:bg-[#C2185B] text-white text-xs font-bold shadow-xs active:scale-95 transition-all btn-press"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouveau mot</span>
              </button>
            </div>
          </div>

          {/* Search Controls */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans mes mots enregistrés (Hanzi, Pinyin ou Français)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-xs text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#E91E63]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Empty State or Words Grid */}
          {filteredMyWords.length === 0 ? (
            <div className="nixtio-card p-10 text-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#E91E63]/10 text-[#E91E63] flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-[#212121] dark:text-[#F5F5F5]">
                {searchQuery ? 'Aucun résultat trouvé dans vos mots' : 'Aucun mot enregistré pour l’instant'}
              </h4>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] max-w-sm mx-auto">
                {searchQuery
                  ? 'Essayez avec un autre mot ou explorez le Dictionnaire complet pour ajouter de nouveaux termes.'
                  : 'Cliquez sur l’icône signet 🔖 dans le Dictionnaire pour enregistrer vos mots préférés ou ajoutez vos propres cartes.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveTab('dictionary');
                }}
                type="button"
                className="px-4 py-2 rounded-full bg-[#6200EE] text-white text-xs font-bold inline-flex items-center gap-1.5 btn-press"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Explorer le Dictionnaire</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredMyWords.map((word, index) => {
                const isPlaying = playingWordId === word.id;

                return (
                  <div
                    key={`${word.id}_${index}`}
                    onClick={() => handleOpenWordDetail(word)}
                    className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] flex flex-col justify-between gap-3 shadow-2xs hover:border-[#E91E63]/50 hover:shadow-md cursor-pointer transition-all btn-press group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-hanzi font-black text-2xl text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#E91E63] transition-colors">
                            {word.hanzi}
                          </span>
                          {isPinyinVisible && (
                            <span className="font-pinyin font-bold text-sm text-[#E91E63] dark:text-[#F06292]">
                              {word.pinyin}
                            </span>
                          )}
                        </div>
                        {showFrenchTranslation && (
                          <div className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] mt-0.5">
                            {word.french}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSaveWord(word.id)}
                          type="button"
                          className="w-9 h-9 rounded-2xl flex items-center justify-center bg-[#E91E63] text-white shadow-xs btn-press"
                          title="Retirer de mes mots enregistrés"
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => playAudio(word.id, word.hanzi)}
                          type="button"
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all btn-press ${
                            isPlaying
                              ? 'bg-[#6200EE] text-white animate-pulse'
                              : 'bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] hover:bg-[#6200EE] hover:text-white'
                          }`}
                          title="Écouter la prononciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] flex items-center justify-between gap-2 text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                      <span className="truncate">💡 {word.businessTip}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-[#E91E63] dark:text-[#F06292] opacity-0 group-hover:opacity-100 transition-opacity">
                          Voir la fiche →
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E91E63]/10 dark:bg-[#E91E63]/20 text-[#E91E63] dark:text-[#F06292] border border-[#E91E63]/25">
                          {word.level}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GRAND DICTIONNAIRE HSK 1 À 6 (BASE EXHAUSTIVE OFFICIELLE) */}
      {!isSessionActive && !selectedLevelForList && activeTab === 'dictionary' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Search Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tapez un mot en français (ex: venir, acheter, prix, usine, manger, contrat), Pinyin ou Hanzi..."
                className="w-full pl-10 pr-10 py-3 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-xs sm:text-sm text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#757575] hover:text-[#212121]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#757575] shrink-0" />
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-3 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] outline-none cursor-pointer btn-press"
              >
                <option value="all">Tous les Niveaux (HSK 1-6)</option>
                <option value="HSK 1">HSK 1 (A1)</option>
                <option value="HSK 2">HSK 2 (A2)</option>
                <option value="HSK 3">HSK 3 (B1)</option>
                <option value="HSK 4">HSK 4 (B2)</option>
                <option value="HSK 5">HSK 5 (C1)</option>
                <option value="HSK 6">HSK 6 (C2)</option>
              </select>
            </div>
          </div>

          {/* Quick Suggestions Chips */}
          {!searchQuery && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#757575] dark:text-[#A0A0A0] font-semibold">Recherches fréquentes :</span>
              {[
                { label: 'Venir (来)', query: 'venir' },
                { label: 'Acheter (买)', query: 'acheter' },
                { label: 'Prix / Combien (多少钱)', query: 'prix' },
                { label: 'Contrat (合同)', query: 'contrat' },
                { label: 'Trop cher (太贵了)', query: 'cher' },
                { label: 'Usine / Fabricant (工厂)', query: 'usine' },
                { label: 'Boire du thé (喝茶)', query: 'thé' },
                { label: 'Manger (吃)', query: 'manger' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => setSearchQuery(chip.query)}
                  className="px-3 py-1 rounded-full bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] text-[#212121] dark:text-[#F5F5F5] hover:border-[#6200EE] hover:text-[#6200EE] transition-all btn-press text-[11px] font-medium"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          {/* Initial Search Prompt State */}
          {!searchQuery && selectedLevel === 'all' && (
            <div className="nixtio-card p-10 text-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-[#212121] dark:text-[#F5F5F5]">
                Recherchez n’importe quel mot ou expression officielle HSK 1 à 6
              </h4>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] max-w-md mx-auto">
                Tapez votre mot en français (ex: <em>« venir »</em>, <em>« acheter »</em>, <em>« contrat »</em>, <em>« thé »</em>), en Pinyin ou en Hanzi pour obtenir instantanément sa fiche officielle, son audio et son contexte terrain.
              </p>
            </div>
          )}

          {/* Search Results Count Notice */}
          {searchQuery && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#6200EE]/10 border border-[#6200EE]/20 text-xs text-[#6200EE] dark:text-[#BB86FC] font-bold">
              <span>
                {filteredDictionaryWords.length} mot(s) officiel(s) trouvé(s) pour « {searchQuery} »
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="underline hover:opacity-80 ml-2"
              >
                Effacer la recherche
              </button>
            </div>
          )}

          {/* Search Results Grid */}
          {searchQuery && filteredDictionaryWords.length === 0 ? (
            <div className="nixtio-card p-10 text-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-base text-[#212121] dark:text-[#F5F5F5]">
                Aucun mot officiel trouvé pour « {searchQuery} »
              </h4>
              <p className="text-xs text-[#757575] dark:text-[#A0A0A0] max-w-sm mx-auto">
                Vérifiez l’orthographe ou ajoutez ce mot manuellement dans votre carnet personnel.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                type="button"
                className="px-4 py-2 rounded-full bg-[#6200EE] text-white text-xs font-bold inline-flex items-center gap-1.5 btn-press"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter ce mot manuellement</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[...new Map(filteredDictionaryWords.map(word => [word.id, word])).values()].map((word) => {
                const isPlaying = playingWordId === word.id;
                const isSaved = word.isSaved;

                return (
                  <div
                    key={word.id}
                    onClick={() => handleOpenWordDetail(word)}
                    className="nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] flex flex-col justify-between gap-3 shadow-2xs hover:border-[#6200EE]/50 hover:shadow-md cursor-pointer transition-all btn-press group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2.5">
                          <span className="font-hanzi font-black text-2xl text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors">
                            {word.hanzi}
                          </span>
                          {isPinyinVisible && (
                            <span className="font-pinyin font-bold text-sm text-[#6200EE] dark:text-[#BB86FC]">
                              {word.pinyin}
                            </span>
                          )}
                        </div>
                        {showFrenchTranslation && (
                          <div className="text-xs font-bold text-[#212121] dark:text-[#F5F5F5] mt-0.5">
                            {word.french}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleSaveWord(word.id)}
                          type="button"
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all btn-press ${
                            isSaved
                              ? 'bg-[#E91E63] text-white shadow-xs'
                              : 'bg-black/[0.03] dark:bg-white/[0.05] text-[#757575] hover:text-[#212121] dark:hover:text-white'
                          }`}
                          title={isSaved ? 'Enregistré dans Mes Mots' : 'Ajouter à Mes Mots'}
                        >
                          {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => playAudio(word.id, word.hanzi)}
                          type="button"
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-all btn-press ${
                            isPlaying
                              ? 'bg-[#6200EE] text-white animate-pulse'
                              : 'bg-[#6200EE]/10 text-[#6200EE] dark:bg-[#6200EE]/20 dark:text-[#BB86FC] hover:bg-[#6200EE] hover:text-white'
                          }`}
                          title="Écouter la prononciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] flex items-center justify-between gap-2 text-[11px] text-[#757575] dark:text-[#A0A0A0]">
                      <span className="truncate">💡 {word.businessTip}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-bold text-[#6200EE] dark:text-[#BB86FC] opacity-0 group-hover:opacity-100 transition-opacity">
                          Voir la fiche →
                        </span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC]">
                          {word.level}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Word Detailed Examples Modal */}
      <WordDetailModal
        word={selectedWordForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isSaved={selectedWordForDetail ? savedWordIds.has(selectedWordForDetail.id) : false}
        onToggleSave={toggleSaveWord}
      />

      {/* Add Custom Word Modal */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWord={handleAddWord}
      />
    </div>
  );
}

export default function VocabulairePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#757575]">Chargement du vocabulaire...</div>}>
      <VocabulaireContent />
    </Suspense>
  );
}
