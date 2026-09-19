'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Volume2, RefreshCw, Layers, CheckCircle2, ArrowRight, Zap } from 'lucide-react';

interface ElementItem {
  hanzi: string;
  pinyin: string;
  french: string;
}

const SUJETS: ElementItem[] = [
  { hanzi: '我', pinyin: 'Wǒ', french: 'Je / Moi' },
  { hanzi: '你', pinyin: 'Nǐ', french: 'Tu / Toi' },
  { hanzi: '李老师', pinyin: 'Lǐ Lǎoshī', french: 'Professeur Li' },
  { hanzi: '卡蒂娅', pinyin: 'Kǎdìyà', french: 'Katia' },
  { hanzi: '布里斯', pinyin: 'Bùlǐsī', french: 'Brice' },
  { hanzi: '我们', pinyin: 'Wǒmen', french: 'Nous' },
];

const VERBES: ElementItem[] = [
  { hanzi: '想买', pinyin: 'xiǎng mǎi', french: 'voudrait acheter' },
  { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'aime / apprécie' },
  { hanzi: '要去', pinyin: 'yào qù', french: 'va aller à' },
  { hanzi: '正在看', pinyin: 'zhèngzài kàn', french: 'est en train de regarder' },
  { hanzi: '想吃', pinyin: 'xiǎng chī', french: 'veut manger' },
  { hanzi: '会说', pinyin: 'huì shuō', french: 'sait parler' },
];

const COMPLEMENTS: ElementItem[] = [
  { hanzi: '中国菜', pinyin: 'Zhōngguócài', french: 'la cuisine chinoise' },
  { hanzi: '这个包', pinyin: 'zhège bāo', french: 'ce sac' },
  { hanzi: '北京', pinyin: 'Běijīng', french: 'Pékin' },
  { hanzi: '汉语', pinyin: 'Hànyǔ', french: 'le mandarin' },
  { hanzi: '这本好书', pinyin: 'zhè běn hǎo shū', french: 'ce bon livre' },
  { hanzi: '一杯热茶', pinyin: 'yì bēi rè chá', french: 'une tasse de thé chaud' },
];

export default function LandingCombinationMethod() {
  const [selectedSujet, setSelectedSujet] = useState<ElementItem>(SUJETS[0]);
  const [selectedVerbe, setSelectedVerbe] = useState<ElementItem>(VERBES[0]);
  const [selectedComplement, setSelectedComplement] = useState<ElementItem>(COMPLEMENTS[1]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const fullSentenceHanzi = `${selectedSujet.hanzi}${selectedVerbe.hanzi}${selectedComplement.hanzi}。`;
  const fullSentencePinyin = `${selectedSujet.pinyin} ${selectedVerbe.pinyin} ${selectedComplement.pinyin}.`;
  const fullSentenceFrench = `${selectedSujet.french} ${selectedVerbe.french} ${selectedComplement.french}.`;

  const handlePlayVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(fullSentenceHanzi);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }

    // Trigger celebratory micro confetti
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F']
    });
  };

  const handleRandomize = () => {
    const randomSujet = SUJETS[Math.floor(Math.random() * SUJETS.length)];
    const randomVerbe = VERBES[Math.floor(Math.random() * VERBES.length)];
    const randomComplement = COMPLEMENTS[Math.floor(Math.random() * COMPLEMENTS.length)];
    setSelectedSujet(randomSujet);
    setSelectedVerbe(randomVerbe);
    setSelectedComplement(randomComplement);
  };

  return (
    <section id="methode" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#03DAC5]/15 border border-[#03DAC5]/30 text-[#00897B] dark:text-[#03DAC5] text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Innovation Pédagogique ChinoisLingo</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight">
            La Méthode de la Combinaison : <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6200EE] to-[#03DAC5]">
              Composez des milliers de phrases instantanément.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            En chinois, les mots ne se conjuguent pas et ne s’accordent pas. En apprenant à assembler des blocs logiques (Sujet + Verbe + Complément), vous débloquez une infinité de conversations sans jamais bégayer.
          </p>
        </div>

        {/* Interactive Combinator Playground */}
        <div className="bg-gradient-to-br from-white via-gray-50/50 to-purple-50/20 dark:from-[#1E1E1E] dark:via-[#1A1A1A] dark:to-[#221733] rounded-3xl p-6 sm:p-10 border border-gray-200 dark:border-white/10 shadow-2xl max-w-5xl mx-auto">
          
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-white/10 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-[#03DAC5] animate-ping" />
              <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                Simulateur Combinatoire Interactif en Direct
              </span>
            </div>
            <button
              onClick={handleRandomize}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Générer au hasard</span>
            </button>
          </div>

          {/* 3 Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Bloc 1: Sujet */}
            <div className="space-y-3">
              <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center text-[11px]">1</span>
                Sujet (主语)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SUJETS.map((item, idx) => {
                  const isSelected = selectedSujet.hanzi === item.hanzi;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedSujet(item)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-[#252525] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/5 hover:border-purple-300'
                      }`}
                    >
                      <p className="text-base font-bold font-hanzi">{item.hanzi}</p>
                      <p className={`text-[11px] font-medium ${isSelected ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.pinyin} • {item.french}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bloc 2: Verbe & Modalité */}
            <div className="space-y-3">
              <span className="text-xs font-black text-[#00897B] dark:text-[#03DAC5] uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-300 flex items-center justify-center text-[11px]">2</span>
                Verbe / Modalité (动词)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {VERBES.map((item, idx) => {
                  const isSelected = selectedVerbe.hanzi === item.hanzi;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedVerbe(item)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-[#00897B] text-white border-[#00897B] shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-[#252525] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/5 hover:border-teal-300'
                      }`}
                    >
                      <p className="text-base font-bold font-hanzi">{item.hanzi}</p>
                      <p className={`text-[11px] font-medium ${isSelected ? 'text-teal-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.pinyin} • {item.french}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bloc 3: Complément */}
            <div className="space-y-3">
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 flex items-center justify-center text-[11px]">3</span>
                Complément (宾语)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {COMPLEMENTS.map((item, idx) => {
                  const isSelected = selectedComplement.hanzi === item.hanzi;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedComplement(item)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-[1.02]'
                          : 'bg-white dark:bg-[#252525] text-gray-800 dark:text-gray-200 border-gray-200 dark:border-white/5 hover:border-amber-300'
                      }`}
                    >
                      <p className="text-base font-bold font-hanzi">{item.hanzi}</p>
                      <p className={`text-[11px] font-medium ${isSelected ? 'text-amber-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.pinyin} • {item.french}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Generated Sentence Result Output Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242424] border-2 border-[#6200EE]/40 dark:border-[#BB86FC]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left flex-1">
              <span className="px-3 py-1 rounded-full bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold uppercase tracking-wider inline-block mb-2">
                ✓ Phrase Parfaite Générée
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-hanzi leading-tight">
                {fullSentenceHanzi}
              </p>
              <p className="text-sm sm:text-base font-bold text-[#00897B] dark:text-[#03DAC5] font-pinyin mt-1">
                {fullSentencePinyin}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium italic">
                « {fullSentenceFrench} »
              </p>
            </div>

            <button
              onClick={handlePlayVoice}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] hover:from-[#5000CC] hover:to-[#651FFF] text-white font-black text-sm shadow-lg shadow-[#6200EE]/30 transform active:scale-95 transition-all shrink-0"
            >
              <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>Prononcer à Voix Haute</span>
            </button>
          </div>

          {/* Multiplication Math Banner */}
          <div className="mt-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center text-xs sm:text-sm text-purple-900 dark:text-purple-200 font-semibold">
            🚀 <strong>Puissance mathématique :</strong> 6 Sujets × 6 Verbes × 6 Compléments = <strong>216 phrases naturelles prêtes à l'emploi</strong> avec seulement 18 mots appris !
          </div>

        </div>

      </div>
    </section>
  );
}
