'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Volume2, 
  Dices, 
  Bookmark, 
  Check, 
  Copy, 
  Calculator, 
  Search, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  TOP_PIVOT_SHORTCUTS,
  analyzeAndGenerateCombinations,
  buildDynamicSentence,
  DynamicCombinatoryPattern,
  CombinatorySlot
} from '@/lib/mock/combinationData';
import { VocabularyWord } from '@/lib/mock/vocabulary';

interface CombinationMethodProps {
  isPinyinVisible: boolean;
  audioSpeed: string;
  onSaveSentenceToMyWords: (word: VocabularyWord) => void;
}

export function CombinationMethod({
  isPinyinVisible,
  audioSpeed,
  onSaveSentenceToMyWords,
}: CombinationMethodProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '去';

  // Input search state
  const [searchInput, setSearchInput] = useState(initialQuery === '去' ? '' : initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setActiveQuery(q);
      setSearchInput(q);
      setSelectedOptionsMap({});
      setRecentlySaved(false);
    }
  }, [searchParams]);

  // Audio playing & feedback states
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [recentlySaved, setRecentlySaved] = useState(false);

  // Analysis result based on activeQuery
  const analysisResult = useMemo(() => {
    return analyzeAndGenerateCombinations(activeQuery);
  }, [activeQuery]);

  const pattern: DynamicCombinatoryPattern | undefined = analysisResult.pattern;

  // Selected option IDs map: { [slotId]: optionId }
  const [selectedOptionsMap, setSelectedOptionsMap] = useState<Record<string, string>>({});

  // Reset or initialize selected options when pattern changes
  const activeSelectedMap = useMemo(() => {
    if (!pattern) return {};
    const map: Record<string, string> = {};
    pattern.slots.forEach((slot) => {
      if (selectedOptionsMap[slot.id] && slot.options.some((o) => o.id === selectedOptionsMap[slot.id])) {
        map[slot.id] = selectedOptionsMap[slot.id];
      } else {
        map[slot.id] = slot.options[0].id;
      }
    });
    return map;
  }, [pattern, selectedOptionsMap]);

  // Handle Free Input Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveQuery(searchInput.trim());
      setSelectedOptionsMap({});
      setRecentlySaved(false);
    }
  };

  // Handle Click on Quick Shortcut
  const handleSelectShortcut = (word: string) => {
    setSearchInput(word);
    setActiveQuery(word);
    setSelectedOptionsMap({});
    setRecentlySaved(false);
  };

  // Handle Option Click for a slot
  const handleSelectSlotOption = (slotId: string, optionId: string) => {
    setSelectedOptionsMap((prev) => ({
      ...prev,
      [slotId]: optionId,
    }));
    setRecentlySaved(false);
  };

  // Total Combinations Multiplier
  const totalCombinations = useMemo(() => {
    if (!pattern) return 0;
    return pattern.slots.map((s) => s.options.length).reduce((a, b) => a * b, 1);
  }, [pattern]);

  // Multiplier Breakdown Formula Text
  const multiplierFormula = useMemo(() => {
    if (!pattern) return '';
    return pattern.slots
      .map((s) => `${s.options.length} ${s.label.split('/')[0].replace(/^\d+\.\s*/, '').trim()}`)
      .join(' × ');
  }, [pattern]);

  // Build the live sentence
  const sentence = useMemo(() => {
    if (!pattern) return { hanzi: '', pinyin: '', french: '', selectedOptions: [] };
    return buildDynamicSentence(pattern.slots, activeSelectedMap);
  }, [pattern, activeSelectedMap]);

  // Random Sentence Generator 🎲
  const handleRandomize = () => {
    if (!pattern) return;
    const newMap: Record<string, string> = {};
    pattern.slots.forEach((slot) => {
      const randomOpt = slot.options[Math.floor(Math.random() * slot.options.length)];
      newMap[slot.id] = randomOpt.id;
    });

    setSelectedOptionsMap(newMap);
    setRecentlySaved(false);

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#6200EE', '#00897B', '#FFB74D', '#BB86FC'],
      });
    } catch {
      // ignore
    }
  };

  // Play audio via Web Speech Synthesis
  const handlePlayAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && sentence.hanzi) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentence.hanzi);
      utterance.lang = 'zh-CN';
      utterance.rate = parseFloat(audioSpeed) || 0.85;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (!sentence.hanzi) return;
    const textToCopy = `${sentence.hanzi}\n${sentence.pinyin}\n${sentence.french}`;
    navigator.clipboard?.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Save to "Mes Mots"
  const handleSaveToMyWords = () => {
    if (!pattern || !sentence.hanzi) return;
    const newSavedWord: VocabularyWord = {
      id: `combo_${pattern.id}_${Date.now()}`,
      themeId: `theme_${pattern.id}`,
      themeSlug: 'combinaisons',
      themeName: `Combinaison (${pattern.pivotWord})`,
      hanzi: sentence.hanzi,
      pinyin: sentence.pinyin,
      french: sentence.french,
      category: pattern.grammaticalCategory,
      level: 'HSK 1',
      cefrLevel: 'A1',
      businessTip: `Structure [${pattern.structureDescription}] construite à partir du mot pivot [${pattern.pivotWord}] (${pattern.pivotMeaning}).`,
      exampleHanzi: sentence.hanzi,
      examplePinyin: sentence.pinyin,
      exampleFrench: sentence.french,
      spacedRepetitionIntervalDays: 1,
      isSaved: true,
      isCustom: true,
    };

    onSaveSentenceToMyWords(newSavedWord);
    setRecentlySaved(true);
    setTimeout(() => setRecentlySaved(false), 3000);
  };

  // Helper color map for slot themes
  const getSlotColorClasses = (theme: CombinatorySlot['colorTheme'], isSelected: boolean) => {
    switch (theme) {
      case 'purple':
        return {
          border: 'border-[#6200EE]/30',
          title: 'text-[#6200EE] dark:text-[#BB86FC]',
          badge: 'bg-[#6200EE]',
          badgeSub: 'bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC]',
          selectedBtn: 'bg-[#6200EE] text-white border-[#6200EE] shadow-md shadow-[#6200EE]/25 scale-[1.02]',
          pinyinColor: 'text-[#6200EE] dark:text-[#BB86FC]',
          checkBg: 'text-[#6200EE]',
          liveTagBg: 'text-[#6200EE] dark:text-[#BB86FC] bg-[#6200EE]/10 dark:bg-[#6200EE]/20 border-[#6200EE]/30',
        };
      case 'emerald':
        return {
          border: 'border-[#00897B]/30',
          title: 'text-[#00796B] dark:text-[#03DAC5]',
          badge: 'bg-[#00897B]',
          badgeSub: 'bg-[#00897B]/10 dark:bg-[#00897B]/20 text-[#00796B] dark:text-[#03DAC5]',
          selectedBtn: 'bg-[#00897B] text-white border-[#00897B] shadow-md shadow-[#00897B]/25 scale-[1.02]',
          pinyinColor: 'text-[#00796B] dark:text-[#03DAC5]',
          checkBg: 'text-[#00897B]',
          liveTagBg: 'text-[#00897B] dark:text-[#03DAC5] bg-[#00897B]/10 dark:bg-[#00897B]/20 border-[#00897B]/30',
        };
      case 'amber':
      default:
        return {
          border: 'border-[#E65100]/30',
          title: 'text-[#E65100] dark:text-[#FFB74D]',
          badge: 'bg-[#E65100]',
          badgeSub: 'bg-[#E65100]/10 dark:bg-[#E65100]/20 text-[#E65100] dark:text-[#FFB74D]',
          selectedBtn: 'bg-[#E65100] text-white border-[#E65100] shadow-md shadow-[#E65100]/25 scale-[1.02]',
          pinyinColor: 'text-[#E65100] dark:text-[#FFB74D]',
          checkBg: 'text-[#E65100]',
          liveTagBg: 'text-[#E65100] dark:text-[#FFB74D] bg-[#E65100]/10 dark:bg-[#E65100]/20 border-[#E65100]/30',
        };
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Banner: Méthode de la Combinaison (Épurée) + Free Input & Shortcuts */}
      <div className="nixtio-card p-5 sm:p-6 bg-gradient-to-br from-[#6200EE]/10 via-[#00897B]/10 to-[#FAFAFA] dark:from-[#6200EE]/20 dark:via-[#00897B]/15 dark:to-[#181818] border border-[#6200EE]/20 dark:border-[#6200EE]/30 rounded-3xl">
        <div className="space-y-1 max-w-3xl">
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight">
            Méthode de la Combinaison
          </h2>
          <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
            La méthode de la combinaison permet, à partir d’une seule structure de phrase, d’en créer une infinité d’autres.
          </p>
        </div>

        {/* Free Input Bar & 3 Pivot Shortcuts */}
        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Free Text Input Field */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#757575] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tapez votre mot (ex: 去, 休息, 漂亮, 咖啡, 学, 汉语, HSK 1-6)..."
                className="w-full pl-10 pr-4 py-2 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] bg-white dark:bg-[#1E1E1E] text-xs font-semibold text-[#212121] dark:text-[#F5F5F5] outline-none focus:border-[#6200EE] shadow-2xs"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold transition-all btn-press shadow-xs shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Générer</span>
            </button>
          </form>

          {/* 3 Quick Pivot Shortcuts */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth w-full md:w-auto">
            <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0] shrink-0">
              Raccourcis :
            </span>
            {TOP_PIVOT_SHORTCUTS.map((shortcut) => {
              const isCurrent = activeQuery === shortcut.word;
              return (
                <button
                  key={shortcut.id}
                  onClick={(e) => {
                    handleSelectShortcut(shortcut.word);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                  }}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all btn-press flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-[#6200EE] text-white shadow-xs'
                      : 'bg-white dark:bg-[#1E1E1E] text-[#757575] hover:text-[#212121] dark:hover:text-white border border-[#E0E0E0] dark:border-[#2D2D2D]'
                  }`}
                >
                  <span className="font-black text-sm">{shortcut.word}</span>
                  <span className="text-[10px] opacity-80">({shortcut.meaning})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CAS D'ÉCHEC / MESSAGE BIENVEILLANT SI NON COMBINABLE */}
      {!analysisResult.success && (
        <div className="nixtio-card p-6 sm:p-8 bg-amber-500/10 border border-amber-500/30 rounded-3xl space-y-4 animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display font-black text-base text-[#212121] dark:text-[#F5F5F5]">
                Ce mot ne se prête pas directement à la combinaison
              </h3>
              <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] leading-relaxed">
                {analysisResult.errorMessage}
              </p>
            </div>
          </div>

          {analysisResult.suggestedPivots && (
            <div className="pt-3 border-t border-amber-500/20 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#757575] dark:text-[#A0A0A0]">
                Mots suggérés pour explorer :
              </span>
              {analysisResult.suggestedPivots.map((sug) => (
                <button
                  key={sug.hanzi}
                  onClick={(e) => {
                    handleSelectShortcut(sug.hanzi);
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                  }}
                  type="button"
                  className="px-3 py-1 rounded-full bg-white dark:bg-[#1E1E1E] text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/30 hover:bg-[#6200EE] hover:text-white transition-all btn-press shadow-2xs"
                >
                  {sug.hanzi} ({sug.meaning})
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. Main Live Sentence Showcase (Boîte interactive épurée) */}
      {pattern && (
        <div className="nixtio-card p-5 sm:p-7 bg-white dark:bg-[#1E1E1E] border-2 border-[#6200EE]/25 dark:border-[#6200EE]/35 rounded-3xl shadow-lg shadow-[#6200EE]/5 relative overflow-hidden space-y-4">
          {/* Subtle decorative background watermark */}
          <div className="absolute top-2 right-4 text-6xl sm:text-8xl font-black text-black/[0.03] dark:text-white/[0.03] select-none pointer-events-none">
            {pattern.pivotWord}
          </div>

          {/* Top Quick Actions Bar (Boutons d'action épurés avec wrapping responsive mobile) */}
          <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 w-full">
            {/* Random Button */}
            <button
              onClick={handleRandomize}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00897B]/10 dark:bg-[#00897B]/20 text-[#00796B] dark:text-[#03DAC5] hover:bg-[#00897B] hover:text-white text-xs font-bold transition-all btn-press shadow-2xs"
              title="Générer une combinaison surprise"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>Phrase aléatoire</span>
            </button>

            {/* Audio Button */}
            <button
              onClick={handlePlayAudio}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all btn-press shadow-2xs ${
                isPlayingAudio
                  ? 'bg-[#6200EE] text-white animate-pulse'
                  : 'bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] hover:bg-[#6200EE] hover:text-white'
              }`}
              title="Écouter la prononciation vocale"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Écouter</span>
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] hover:text-[#212121] dark:hover:text-white border border-[#E0E0E0] dark:border-[#2D2D2D] text-xs font-bold transition-all btn-press"
              title="Copier la phrase"
            >
              {hasCopied ? <Check className="w-3.5 h-3.5 text-[#00897B]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopied ? 'Copié !' : 'Copier'}</span>
            </button>

            {/* Save to Mes Mots Button */}
            <button
              onClick={handleSaveToMyWords}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all btn-press shadow-xs ${
                recentlySaved
                  ? 'bg-[#E91E63] text-white'
                  : 'bg-[#E91E63]/10 dark:bg-[#E91E63]/20 text-[#E91E63] dark:text-[#F06292] hover:bg-[#E91E63] hover:text-white'
              }`}
              title="Enregistrer cette phrase dans Mes Mots"
            >
              {recentlySaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{recentlySaved ? 'Enregistré dans Mes Mots' : 'Sauvegarder'}</span>
            </button>
          </div>

          {/* Live Sentence Display Area */}
          <div className="py-2 sm:py-3 space-y-3">
            {/* Color-Coded Segments Hanzi Header */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-2xl sm:text-4xl font-black font-display tracking-wide">
              {pattern.slots.map((slot) => {
                const optId = activeSelectedMap[slot.id] || slot.options[0].id;
                const opt = slot.options.find((o) => o.id === optId) || slot.options[0];
                const colors = getSlotColorClasses(slot.colorTheme, true);

                return (
                  <span
                    key={slot.id}
                    className={`px-3 py-1 rounded-2xl border shadow-2xs transition-all hover:scale-105 ${colors.liveTagBg}`}
                  >
                    {opt.hanzi}
                  </span>
                );
              })}
            </div>

            {/* Pinyin Segmented Line */}
            {isPinyinVisible && sentence.pinyin && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold tracking-normal">
                {pattern.slots.map((slot, idx) => {
                  const optId = activeSelectedMap[slot.id] || slot.options[0].id;
                  const opt = slot.options.find((o) => o.id === optId) || slot.options[0];
                  const colors = getSlotColorClasses(slot.colorTheme, true);

                  // Omit Latin name duplication in pinyin line
                  if (idx === 0 && opt.hanzi === opt.french) return null;

                  return (
                    <span key={slot.id} className={colors.pinyinColor}>
                      {opt.pinyin}
                    </span>
                  );
                })}
              </div>
            )}

            {/* French Translation Box */}
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#2D2D2D] flex items-center gap-3">
              <span className="text-lg">🇫🇷</span>
              <p className="font-display font-bold text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5] leading-relaxed">
                « {sentence.french} »
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. The Interactive Slots Columns (Exactement 2 ou 3 colonnes adaptées) */}
      {pattern && (
        <div
          className={`grid gap-4 ${
            pattern.slots.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {pattern.slots.map((slot) => {
            const selectedOptId = activeSelectedMap[slot.id] || slot.options[0].id;
            const colors = getSlotColorClasses(slot.colorTheme, true);

            return (
              <div
                key={slot.id}
                className={`nixtio-card p-4 sm:p-5 bg-white dark:bg-[#1E1E1E] border ${colors.border} rounded-3xl space-y-3 shadow-xs`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#E0E0E0] dark:border-[#2D2D2D]">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-lg ${colors.badge} text-white font-black text-xs flex items-center justify-center shadow-xs`}>
                      {slot.slotNumber}
                    </span>
                    <h3 className={`font-display font-black text-sm ${colors.title}`}>
                      {slot.label}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-bold ${colors.badgeSub} px-2 py-0.5 rounded-full`}>
                    {slot.options.length} options
                  </span>
                </div>

                <div className="space-y-2">
                  {slot.options.map((opt) => {
                    const isSelected = opt.id === selectedOptId;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectSlotOption(slot.id, opt.id)}
                        type="button"
                        className={`w-full p-2.5 sm:p-3 rounded-2xl border text-left transition-all btn-press flex items-center justify-between gap-2 ${
                          isSelected
                            ? colors.selectedBtn
                            : 'bg-[#FAFAFA] dark:bg-[#252525] text-[#212121] dark:text-[#F5F5F5] border-[#E0E0E0] dark:border-[#2D2D2D] hover:bg-white dark:hover:bg-[#2A2A2A]'
                        }`}
                      >
                        {/* Latin proper name -> display ONCE */}
                        {opt.hanzi === opt.french ? (
                          <div className="min-w-0">
                            <span className="font-display font-black text-sm sm:text-base leading-tight">
                              {opt.french}
                            </span>
                          </div>
                        ) : (
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-black text-sm sm:text-base leading-tight">
                                {opt.hanzi}
                              </span>
                              {isPinyinVisible && (
                                <span className={`text-[11px] font-semibold ${isSelected ? 'text-white/80' : colors.pinyinColor}`}>
                                  {opt.pinyin}
                                </span>
                              )}
                            </div>
                            <div className={`text-xs mt-0.5 truncate ${isSelected ? 'text-white/90 font-medium' : 'text-[#757575] dark:text-[#A0A0A0]'}`}>
                              {opt.french}
                            </div>
                          </div>
                        )}

                        {isSelected && (
                          <div className={`w-4 h-4 rounded-full bg-white ${colors.checkBg} flex items-center justify-center shrink-0 shadow-xs`}>
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Bottom Pedagogical & Combinatory Multiplier Section (En bas de page) */}
      {pattern && (
        <div className="nixtio-card p-5 sm:p-6 bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6200EE] to-[#00897B] text-white flex items-center justify-center shadow-xs shrink-0">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] uppercase tracking-wider block">
                  Richesse Combinatoire
                </span>
                <div className="font-display font-black text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5]">
                  {multiplierFormula} = <span className="text-[#6200EE] dark:text-[#BB86FC]">{totalCombinations} phrases générées avec ce mot</span>
                </div>
              </div>
            </div>

            <span className="text-xs font-bold text-[#00796B] dark:text-[#03DAC5] bg-[#00897B]/10 dark:bg-[#00897B]/20 px-3 py-1 rounded-full border border-[#00897B]/25 self-start sm:self-auto">
              ✓ {pattern.slots.length} colonnes actives adaptées
            </span>
          </div>

          <p className="text-xs text-[#757575] dark:text-[#A0A0A0] leading-relaxed pt-2 border-t border-[#E0E0E0] dark:border-[#2D2D2D]">
            💡 <strong>Pourquoi cette méthode est puissante :</strong> Au lieu d’apprendre des phrases figées par cœur, la méthode de la combinaison vous apprend à interchanger chaque brique grammaticale (sujet, verbe/modalité, complément). En maîtrisant quelques structures clés, vous débloquez immédiatement des dizaines de phrases naturelles pour vos échanges quotidiens et professionnels.
          </p>
        </div>
      )}
    </div>
  );
}
