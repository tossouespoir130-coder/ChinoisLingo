'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Volume2, Sparkles, Heart } from 'lucide-react';

interface CharacterItem {
  id: string;
  name: string;
  nameZh: string;
  pinyin: string;
  role: string;
  tag: string;
  tagColor: string;
  imageUrl: string;
  quoteZh: string;
  quoteFr: string;
}

const CHARACTERS: CharacterItem[] = [
  {
    id: 'xiaobai',
    name: 'Xiaobai',
    nameZh: '小白',
    pinyin: 'Xiǎobái',
    role: 'Le Petit Chat Gourmand',
    tag: 'Série Mon Chat',
    tagColor: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    quoteZh: '我想吃鱼！我不喜欢苹果。',
    quoteFr: 'Je veux manger du poisson ! Je n’aime pas les pommes.',
  },
  {
    id: 'doudou',
    name: 'DouDou',
    nameZh: '豆豆',
    pinyin: 'Dòudou',
    role: 'Le Chiot Joueur',
    tag: 'Histoires HSK 1',
    tagColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    quoteZh: '我们一起去公园玩吧！',
    quoteFr: 'Allons jouer ensemble au parc !',
  },
  {
    id: 'espoir',
    name: 'Espoir',
    nameZh: '苏波',
    pinyin: 'Sūbō',
    role: 'Guide & Formateur',
    tag: 'Masterclasses',
    tagColor: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
    imageUrl: '/espoir-chinois.jpg',
    quoteZh: '我叫苏波。学中文并不难，只要好方法！',
    quoteFr: 'Je m’appelle Espoir. Apprendre le chinois devient facile !',
  },
  {
    id: 'katia',
    name: 'Katia',
    nameZh: '卡蒂娅',
    pinyin: 'Kǎdìyà',
    role: 'Femme d’Affaires & Sourcing',
    tag: 'Série Business',
    tagColor: 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&crop=faces&q=80',
    quoteZh: '你好，请问你们有这个牌子的包吗？',
    quoteFr: 'Bonjour, avez-vous des sacs de cette marque ?',
  },
  {
    id: 'brice',
    name: 'Brice',
    nameZh: '布里斯',
    pinyin: 'Bùlǐsī',
    role: 'Entrepreneur & Négociateur',
    tag: 'Série Business',
    tagColor: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&crop=faces&q=80',
    quoteZh: '这个价格可以便宜一点吗？我们要订五百件。',
    quoteFr: 'Pouvez-vous baisser un peu ce prix pour 500 pièces ?',
  },
  {
    id: 'anthony',
    name: 'Anthony',
    nameZh: '安东尼',
    pinyin: 'Āndōngní',
    role: 'Acheteur & Apprenant',
    tag: 'Série Canton',
    tagColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&crop=faces&q=80',
    quoteZh: '我每天学习三十个生词，进步非常快！',
    quoteFr: 'J’apprends 30 mots chaque jour, mes progrès sont rapides !',
  },
  {
    id: 'claire',
    name: 'Claire',
    nameZh: '克莱尔',
    pinyin: 'Kèlái’ěr',
    role: 'Expatriée en Immersion',
    tag: 'Histoire de Claire',
    tagColor: 'bg-pink-100 text-pink-800 dark:bg-pink-500/20 dark:text-pink-300',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&crop=faces&q=80',
    quoteZh: '我在中国工作生活，每天都有新的惊喜。',
    quoteFr: 'Je vis et travaille en Chine, chaque jour réserve de belles surprises.',
  },
  {
    id: 'monsieur_li',
    name: 'Monsieur Li',
    nameZh: '李老师',
    pinyin: 'Lǐ Lǎoshī',
    role: 'Professeur de Mandarin',
    tag: 'Phonétique & Tons',
    tagColor: 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&crop=faces&q=80',
    quoteZh: '跟我一起读：bā, bá, bǎ, bà！',
    quoteFr: 'Répétez avec moi : bā, bá, bǎ, bà !',
  },
];

export default function LandingCharacters() {
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>(null);

  const handlePlayVoice = (char: CharacterItem) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(char.quoteZh);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.88;
      setActiveVoiceId(char.id);
      utterance.onend = () => setActiveVoiceId(null);
      utterance.onerror = () => setActiveVoiceId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setActiveVoiceId(char.id);
      setTimeout(() => setActiveVoiceId(null), 2000);
    }
  };

  return (
    <section id="personnages" className="py-16 sm:py-24 bg-white dark:bg-[#121212] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6200EE] dark:text-[#BB86FC] block mb-2">
            Héros & Animaux de vos Histoires
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white font-display tracking-tight">
            Des personnages attachants pour apprendre avec plaisir.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            Cliquez sur un personnage pour entendre sa voix et découvrir son univers.
          </p>
        </div>

        {/* Simplified Visual Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {CHARACTERS.map((char) => {
            const isPlaying = activeVoiceId === char.id;
            return (
              <div
                key={char.id}
                onClick={() => handlePlayVoice(char)}
                className="group relative bg-gray-50 dark:bg-[#1A1A1A] rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-gray-100 dark:border-white/5 hover:border-[#6200EE]/40 dark:hover:border-[#BB86FC]/40 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1.5"
              >
                <div>
                  {/* Photo Frame */}
                  <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden mb-3 bg-gray-200 dark:bg-white/5">
                    <Image
                      src={char.imageUrl}
                      alt={char.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Top Tag */}
                    <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${char.tagColor}`}>
                      {char.tag}
                    </span>

                    {/* Audio Play Bubble */}
                    <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/95 dark:bg-[#1E1E1E]/95 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-[#00BFA5]' : ''}`} />
                    </div>
                  </div>

                  {/* Names & Role */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                        <span>{char.name}</span>
                        <span className="text-xs font-bold text-[#00897B] dark:text-[#03DAC5] font-hanzi">
                          {char.nameZh}
                        </span>
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                        {char.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Speech Bubble */}
                <div className="mt-3 pt-2.5 border-t border-gray-200/60 dark:border-white/5">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-1 italic font-hanzi">
                    « {char.quoteZh} »
                  </p>
                  <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                    {char.quoteFr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
