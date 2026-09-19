'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, RefreshCw } from 'lucide-react';

interface ElementItem {
  hanzi: string;
  pinyin: string;
  french: string;
}

const SUJETS: ElementItem[] = [
  { hanzi: '我', pinyin: 'Wǒ', french: 'Je' },
  { hanzi: '小白', pinyin: 'Xiǎobái', french: 'Xiaobai' },
  { hanzi: '卡蒂娅', pinyin: 'Kǎdìyà', french: 'Katia' },
  { hanzi: '布里斯', pinyin: 'Bùlǐsī', french: 'Brice' },
  { hanzi: '李老师', pinyin: 'Lǐ Lǎoshī', french: 'Professeur Li' },
];

const VERBES: ElementItem[] = [
  { hanzi: '想买', pinyin: 'xiǎng mǎi', french: 'veut acheter' },
  { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'aime' },
  { hanzi: '想吃', pinyin: 'xiǎng chī', french: 'veut manger' },
  { hanzi: '正在看', pinyin: 'zhèngzài kàn', french: 'regarde' },
  { hanzi: '要去', pinyin: 'yào qù', french: 'va aller à' },
];

const COMPLEMENTS: ElementItem[] = [
  { hanzi: '这个包', pinyin: 'zhège bāo', french: 'ce sac' },
  { hanzi: '一条鱼', pinyin: 'yì tiáo yú', french: 'un poisson' },
  { hanzi: '中国菜', pinyin: 'Zhōngguócài', french: 'la cuisine chinoise' },
  { hanzi: '北京', pinyin: 'Běijīng', french: 'Pékin' },
  { hanzi: '这本好书', pinyin: 'zhè běn hǎo shū', french: 'ce bon livre' },
];

export default function LandingCombinationMethod() {
  const [selectedSujet, setSelectedSujet] = useState<ElementItem>(SUJETS[0]);
  const [selectedVerbe, setSelectedVerbe] = useState<ElementItem>(VERBES[0]);
  const [selectedComplement, setSelectedComplement] = useState<ElementItem>(COMPLEMENTS[0]);
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

    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.75 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F']
    });
  };

  const handleRandomize = () => {
    setSelectedSujet(SUJETS[Math.floor(Math.random() * SUJETS.length)]);
    setSelectedVerbe(VERBES[Math.floor(Math.random() * VERBES.length)]);
    setSelectedComplement(COMPLEMENTS[Math.floor(Math.random() * COMPLEMENTS.length)]);
  };

  return (
    <section id="methode" className="py-16 sm:py-24 bg-gray-50/70 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00897B] block mb-2">
            Méthode Combinatoire
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 font-display tracking-tight">
            Assemblez 3 blocs. Parlez chinois instantanément.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500">
            Zéro conjugaison, zéro accord. Choisissez un mot dans chaque colonne pour créer une phrase parfaite.
          </p>
        </div>

        {/* 3 Columns Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          
          {/* Sujet */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 block mb-2">
              1. Sujet
            </span>
            <div className="flex flex-col gap-1.5">
              {SUJETS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSujet(s)}
                  className={`px-3 py-2 rounded-xl text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    selectedSujet.hanzi === s.hanzi
                      ? 'bg-[#6200EE] text-white shadow-sm'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-hanzi">{s.hanzi}</span>
                  <span className={`text-[11px] font-normal ${selectedSujet.hanzi === s.hanzi ? 'text-purple-200' : 'text-gray-400'}`}>
                    {s.french}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Verbe */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block mb-2">
              2. Action / Modal
            </span>
            <div className="flex flex-col gap-1.5">
              {VERBES.map((v, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedVerbe(v)}
                  className={`px-3 py-2 rounded-xl text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    selectedVerbe.hanzi === v.hanzi
                      ? 'bg-[#00897B] text-white shadow-sm'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-hanzi">{v.hanzi}</span>
                  <span className={`text-[11px] font-normal ${selectedVerbe.hanzi === v.hanzi ? 'text-teal-200' : 'text-gray-400'}`}>
                    {v.french}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Complément */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-gray-100 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block mb-2">
              3. Complément
            </span>
            <div className="flex flex-col gap-1.5">
              {COMPLEMENTS.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedComplement(c)}
                  className={`px-3 py-2 rounded-xl text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${
                    selectedComplement.hanzi === c.hanzi
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="font-hanzi">{c.hanzi}</span>
                  <span className={`text-[11px] font-normal ${selectedComplement.hanzi === c.hanzi ? 'text-amber-100' : 'text-gray-400'}`}>
                    {c.french}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Live Result Output Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md text-center flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={handleRandomize}
              className="text-xs font-bold text-gray-400 hover:text-[#6200EE] transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Mélanger au hasard</span>
            </button>
          </div>

          <p className="text-2xl sm:text-4xl font-black text-gray-950 font-hanzi tracking-wide mb-2">
            {fullSentenceHanzi}
          </p>
          <p className="text-sm sm:text-base font-semibold text-[#00897B] font-pinyin mb-2">
            {fullSentencePinyin}
          </p>
          <p className="text-sm text-gray-500 font-medium mb-6">
            « {fullSentenceFrench} »
          </p>

          <button
            onClick={handlePlayVoice}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#6200EE] hover:bg-[#5000CC] text-white font-bold text-sm shadow-md shadow-[#6200EE]/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            <span>Écouter la prononciation</span>
          </button>
        </div>

      </div>
    </section>
  );
}
