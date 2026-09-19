'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, Play, Sparkles, Video, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  nameZh: string;
  pinyin: string;
  country: string;
  flag: string;
  role: string;
  badge: string;
  color: string;
  bgGradient: string;
  traits: string[];
  quoteZh: string;
  quotePinyin: string;
  quoteFr: string;
  description: string;
  series: string;
}

const CHARACTERS: Character[] = [
  {
    id: 'espoir',
    name: 'Espoir',
    nameZh: '苏波',
    pinyin: 'Sūbō',
    country: 'Bénin',
    flag: '🇧🇯',
    role: 'Fondateur & Mentor en Chine',
    badge: 'Guide & Mentor',
    color: '#6200EE',
    bgGradient: 'from-[#6200EE] to-[#7C4DFF]',
    traits: ['Pédagogue patient', 'Visionnaire', 'Pragmatique', 'Négociateur terrain'],
    quoteZh: '我叫苏波。学中文并不难，只要找到好方法！',
    quotePinyin: 'Wǒ jiào Sūbō. Xué Zhōngwén bìng bù nán, zhǐyào zhǎodào hǎo fāngfǎ!',
    quoteFr: 'Je m’appelle Espoir. Apprendre le chinois n’est pas difficile dès qu’on a la bonne méthode !',
    description: 'Partenaire commercial et voyageur expérimenté en Chine. Il partage ses secrets de terrain et vous guide pas à pas vers la maîtrise concrète.',
    series: 'Formations Vidéos & Masterclasses'
  },
  {
    id: 'lily',
    name: 'Lily',
    nameZh: '丽丽',
    pinyin: 'Lìli',
    country: 'Chine',
    flag: '🇨🇳',
    role: 'Guide Locale Pékinoise',
    badge: 'Guide Culturelle',
    color: '#E91E63',
    bgGradient: 'from-[#E91E63] to-[#F06292]',
    traits: ['Dynamique', 'Accueillante', 'Spontanée', 'Sociable'],
    quoteZh: '你好！欢迎来到中国，今天我带你逛北京！',
    quotePinyin: 'Nǐ hǎo! Huānyíng lái dào Zhōngguó, jīntiān wǒ dài nǐ guàng Běijīng!',
    quoteFr: 'Bonjour ! Bienvenue en Chine, aujourd’hui je t’emmène visiter Pékin !',
    description: 'Jeune femme chinoise pétillante qui vous ouvre les portes de la culture réelle, des expressions du quotidien et de la vie locale.',
    series: 'Dialogues du Quotidien & Podcasts'
  },
  {
    id: 'katia',
    name: 'Katia',
    nameZh: '卡蒂娅',
    pinyin: 'Kǎdìyà',
    country: 'France',
    flag: '🇫🇷',
    role: 'Femme d’Affaires & Sourcing',
    badge: 'Business International',
    color: '#00897B',
    bgGradient: 'from-[#00897B] to-[#03DAC5]',
    traits: ['Méthodique', 'Brillante', 'Exigeante', 'Élégante'],
    quoteZh: '你好，请问你们有这个牌子的包吗？',
    quotePinyin: 'Nǐ hǎo, qǐngwèn nǐmen yǒu zhège páizi de bāo ma?',
    quoteFr: 'Bonjour, excusez-moi, avez-vous des sacs de cette marque ?',
    description: 'Femme d’affaires française qui voyage en Chine pour dénicher des fabricants fiables et négocier des contrats de distribution.',
    series: 'Vie en Chine : Business (8 parties)'
  },
  {
    id: 'brice',
    name: 'Brice',
    nameZh: '布里斯',
    pinyin: 'Bùlǐsī',
    country: 'Côte d’Ivoire',
    flag: '🇨🇮',
    role: 'Entrepreneur Import-Export',
    badge: 'Négociateur Usines',
    color: '#0288D1',
    bgGradient: 'from-[#0288D1] to-[#29B6F6]',
    traits: ['Courageux', 'Ambitieux', 'Déterminé', 'Travailleur'],
    quoteZh: '这个价格可以便宜一点吗？我们要订五百件。',
    quotePinyin: 'Zhège jiàgé kěyǐ piányi yìdiǎn ma? Wǒmen yào dìng wǔbǎi jiàn.',
    quoteFr: 'Pouvez-vous baisser un peu ce prix ? Nous voulons commander 500 pièces.',
    description: 'Chef d’entreprise ivoirien qui parcourt les foires de Canton et les marchés de Yiwu pour importer des marchandises.',
    series: 'Vie en Chine : Business & Négociation'
  },
  {
    id: 'anthony',
    name: 'Anthony',
    nameZh: '安东尼',
    pinyin: 'Āndōngní',
    country: 'Burkina Faso',
    flag: '🇧🇫',
    role: 'Businessman & Apprenant Passionné',
    badge: 'Persévérance & Progrès',
    color: '#3F51B5',
    bgGradient: 'from-[#3F51B5] to-[#7986CB]',
    traits: ['Persévérant', 'Positif', 'Méthodique', 'Constance'],
    quoteZh: '我每天学习三十个生词，进步非常快！',
    quotePinyin: 'Wǒ měi tiān xuéxí sānshí gè shēngcí, jìnbù fēicháng kuài!',
    quoteFr: 'J’apprends 30 nouveaux mots chaque jour, mes progrès sont fulgurants !',
    description: 'Entrepreneur déterminé qui prouve que la régularité et une bonne méthode permettent d’atteindre la fluidité rapidement.',
    series: 'Vie en Chine : Business'
  },
  {
    id: 'claire',
    name: 'Claire',
    nameZh: '克莱尔',
    pinyin: 'Kèlái’ěr',
    country: 'France',
    flag: '🇫🇷',
    role: 'Expatriée en Immersion Totale',
    badge: 'Aventures & Découverte',
    color: '#8E24AA',
    bgGradient: 'from-[#8E24AA] to-[#BA68C8]',
    traits: ['Curieuse', 'Aventureuse', 'Débrouillarde', 'Observatrice'],
    quoteZh: '我在中国工作生活，每天都有新的惊喜。',
    quotePinyin: 'Wǒ zài Zhōngguó gōngzuò shēnghuó, měi tiān dōu yǒu xīn de jīngxǐ.',
    quoteFr: 'Je vis et travaille en Chine, chaque jour réserve de belles surprises.',
    description: 'Héroïne de la série « L’histoire de Claire en Chine », elle partage sa vie quotidienne entre Shanghai, Chengdu et les TGV chinois.',
    series: 'L’Histoire de Claire en Chine (10 parties)'
  },
  {
    id: 'monsieur_li',
    name: 'Monsieur Li',
    nameZh: '李老师',
    pinyin: 'Lǐ Lǎoshī',
    country: 'Chine',
    flag: '🇨🇳',
    role: 'Professeur Émérite de Mandarin',
    badge: 'Rigueur & Maîtrise',
    color: '#D81B60',
    bgGradient: 'from-[#D81B60] to-[#E91E63]',
    traits: ['Patient', 'Érudit', 'Pédagogue', 'Bienveillant'],
    quoteZh: '声调非常重要，跟我读：bā, bá, bǎ, bà！',
    quotePinyin: 'Shēngdiào fēicháng zhòngyào, gēn wǒ dú: bā, bá, bǎ, bà!',
    quoteFr: 'Les tons sont essentiels, répétez avec moi : bā, bá, bǎ, bà !',
    description: 'Professeur respecté qui veille à la pureté de votre prononciation et à la maîtrise parfaite de la structure grammaticale.',
    series: 'Leçons Fondamentales & Phonétique'
  }
];

export default function LandingCharacters() {
  const [selectedChar, setSelectedChar] = useState<Character>(CHARACTERS[0]);
  const [isPlayingQuote, setIsPlayingQuote] = useState(false);

  const handlePlayVoice = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.88;
      setIsPlayingQuote(true);
      utterance.onend = () => setIsPlayingQuote(false);
      utterance.onerror = () => setIsPlayingQuote(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingQuote(true);
      setTimeout(() => setIsPlayingQuote(false), 2000);
    }
  };

  return (
    <section id="personnages" className="py-20 sm:py-28 bg-gray-50/50 dark:bg-[#151515] relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#6200EE]/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#03DAC5]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6200EE]/10 border border-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Immersion par le Storytelling & les Vidéos</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight">
            Apprenez avec de vrais personnages, <br />
            <span className="text-[#6200EE] dark:text-[#BB86FC]">dans de vraies situations.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Fini la solitude des méthodes théoriques. Nos 7 héros récurrents vous emmènent dans leurs aventures professionnelles, leurs négociations d’usines et leur quotidien en Chine.
          </p>
        </div>

        {/* Character Navigation Ribbon */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-4 no-scrollbar mb-10 justify-start lg:justify-center">
          {CHARACTERS.map((char) => {
            const isSelected = selectedChar.id === char.id;
            return (
              <button
                key={char.id}
                onClick={() => setSelectedChar(char)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-white dark:bg-[#252525] text-gray-900 dark:text-white border-[#6200EE] dark:border-[#BB86FC] shadow-lg shadow-[#6200EE]/15 scale-105'
                    : 'bg-white/60 dark:bg-[#1C1C1C] text-gray-600 dark:text-gray-400 border-gray-200/80 dark:border-white/5 hover:border-gray-300'
                }`}
              >
                <span className="text-base">{char.flag}</span>
                <span className="font-hanzi font-bold text-[#00897B] dark:text-[#03DAC5]">{char.nameZh}</span>
                <span>{char.name}</span>
              </button>
            );
          })}
        </div>

        {/* Character Spotlight Card */}
        <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 sm:p-10 border border-gray-200/80 dark:border-white/10 shadow-xl max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Avatar & Identity Card */}
          <div className="lg:col-span-5 text-center sm:text-left flex flex-col sm:flex-row lg:flex-col items-center sm:items-start gap-6">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr ${selectedChar.bgGradient} p-1 shadow-xl shrink-0 flex items-center justify-center text-white`}>
              <div className="w-full h-full bg-white dark:bg-[#1E1E1E] rounded-[22px] flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-black font-hanzi text-gray-900 dark:text-white">
                  {selectedChar.nameZh}
                </span>
                <span className="text-xs font-semibold text-[#00897B] dark:text-[#03DAC5] font-pinyin mt-1">
                  {selectedChar.pinyin}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                <span className="text-lg">{selectedChar.flag}</span>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  {selectedChar.name}
                </h3>
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] mb-2">
                {selectedChar.role}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {selectedChar.description}
              </p>

              {/* Personality traits */}
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center sm:justify-start">
                {selectedChar.traits.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
                  >
                    ✓ {trait}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Dialogue Quote & Video Feature */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Speech Bubble */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-[#252525] dark:to-[#1E1E1E] border-2 border-dashed border-[#6200EE]/30 dark:border-[#BB86FC]/30 shadow-inner relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00897B] dark:text-[#03DAC5] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#03DAC5] inline-block animate-pulse" />
                  Réplique Authentique de {selectedChar.name}
                </span>
                <button
                  onClick={() => handlePlayVoice(selectedChar.quoteZh)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6200EE] hover:bg-[#5000CC] text-white text-xs font-bold shadow-md shadow-[#6200EE]/20 transition-all transform active:scale-95"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingQuote ? 'animate-bounce' : ''}`} />
                  <span>Écouter la Voix</span>
                </button>
              </div>

              <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-hanzi leading-snug">
                « {selectedChar.quoteZh} »
              </p>
              <p className="text-sm font-semibold text-[#00897B] dark:text-[#03DAC5] font-pinyin mt-1.5">
                {selectedChar.quotePinyin}
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 font-medium italic border-t border-gray-200/60 dark:border-white/10 pt-2">
                « {selectedChar.quoteFr} »
              </p>
            </div>

            {/* Video Series Highlight */}
            <div className="p-4 rounded-2xl bg-[#6200EE]/5 dark:bg-white/5 border border-[#6200EE]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6200EE] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Série Vidéo Principale
                  </span>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {selectedChar.series}
                  </p>
                </div>
              </div>

              <Link
                href="/connexion"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#6200EE] dark:text-[#BB86FC] hover:underline"
              >
                <span>Voir la série</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Video Series Catalog Showcase */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-white/10 shadow-md hover:shadow-xl transition-all group">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-gradient-to-tr from-[#00897B] to-[#004D40] flex items-center justify-center text-white">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#6200EE] text-white text-[11px] font-bold">
                8 Parties
              </span>
              <div className="w-12 h-12 rounded-full bg-white/90 text-[#6200EE] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-[#6200EE] ml-0.5" />
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase text-[#6200EE] dark:text-[#BB86FC]">
              Série Business & Négociation
            </span>
            <h4 className="text-lg font-black text-gray-900 dark:text-white mt-1">
              Vie en Chine : Business
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              Suivez Katia, Brice et Anthony dans leur périple d’affaires, de l’aéroport aux boutiques de maroquinerie et réunions de négociation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-white/10 shadow-md hover:shadow-xl transition-all group">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-gradient-to-tr from-[#8E24AA] to-[#4A148C] flex items-center justify-center text-white">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#8E24AA] text-white text-[11px] font-bold">
                10 Parties
              </span>
              <div className="w-12 h-12 rounded-full bg-white/90 text-[#8E24AA] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-[#8E24AA] ml-0.5" />
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase text-[#8E24AA] dark:text-[#CE93D8]">
              Série Immersion Quotidienne
            </span>
            <h4 className="text-lg font-black text-gray-900 dark:text-white mt-1">
              L’Histoire de Claire en Chine
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              L’aventure d’une jeune expatriée française installée en Chine : commander au restaurant, prendre le TGV, faire ses courses et nouer des amitiés.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-white/10 shadow-md hover:shadow-xl transition-all group">
            <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-gradient-to-tr from-[#0288D1] to-[#01579B] flex items-center justify-center text-white">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#0288D1] text-white text-[11px] font-bold">
                Masterclass
              </span>
              <div className="w-12 h-12 rounded-full bg-white/90 text-[#0288D1] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-[#0288D1] ml-0.5" />
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase text-[#0288D1] dark:text-[#29B6F6]">
              Formation par Espoir Chinois
            </span>
            <h4 className="text-lg font-black text-gray-900 dark:text-white mt-1">
              Négociation en Usines & Sourcing
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
              Apprenez les expressions exactes pour négocier avec les patrons d’usines, demander des échantillons et obtenir les meilleurs prix.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
