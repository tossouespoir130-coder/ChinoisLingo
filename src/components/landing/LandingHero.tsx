'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Play, Volume2, CheckCircle2, ArrowRight, Flame, Layers, Award, Star } from 'lucide-react';

export default function LandingHero() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'combinatoire' | 'chanson'>('dialogue');

  const handlePlayVoice = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      setIsPlayingDemo(true);
      utterance.onend = () => setIsPlayingDemo(false);
      utterance.onerror = () => setIsPlayingDemo(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingDemo(true);
      setTimeout(() => setIsPlayingDemo(false), 2500);
    }
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      {/* Background Decorative Gradients & Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] sm:h-[550px] bg-gradient-to-tr from-[#6200EE]/20 via-[#03DAC5]/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#6200EE]/10 rounded-full blur-2xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#03DAC5]/10 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3.5xl mx-auto">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6200EE]/10 via-[#03DAC5]/10 to-[#6200EE]/10 border border-[#6200EE]/20 dark:border-[#BB86FC]/30 shadow-sm mb-6 animate-in fade-in zoom-in duration-500">
            <span className="flex h-2 w-2 rounded-full bg-[#03DAC5] animate-ping" />
            <span className="text-xs sm:text-sm font-bold text-[#6200EE] dark:text-[#BB86FC]">
              ✨ La Nouvelle Expérience d’Immersion en Mandarin
            </span>
          </div>

          {/* Main Title H1 */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-950 dark:text-white font-display leading-[1.1] mb-6">
            Avec ChinoisLingo, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6200EE] via-[#9C27B0] to-[#03DAC5]">
              le chinois devient facile.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Fini les listes de vocabulaire rébarbatives. Maîtrisez le mandarin à travers des{' '}
            <strong className="text-gray-900 dark:text-white font-semibold">vidéos scénarisées</strong>,{' '}
            des <strong className="text-gray-900 dark:text-white font-semibold">personnages attachants</strong> et notre{' '}
            <strong className="text-gray-900 dark:text-white font-semibold">méthode combinatoire exclusive</strong>.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/connexion"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] hover:from-[#5000CC] hover:to-[#651FFF] text-white font-black text-base shadow-xl shadow-[#6200EE]/30 hover:shadow-2xl hover:shadow-[#6200EE]/50 transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              <Sparkles className="w-5 h-5 text-amber-300 animate-bounce" />
              <span>Démarrer l’Immersion Gratuite</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#personnages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-[#1E1E1E] border-2 border-gray-200 dark:border-white/10 hover:border-[#6200EE] dark:hover:border-[#BB86FC] text-gray-800 dark:text-white font-bold text-base shadow-sm hover:shadow-md transition-all"
            >
              <Play className="w-4 h-4 fill-[#6200EE] text-[#6200EE] dark:fill-[#BB86FC] dark:text-[#BB86FC]" />
              <span>Découvrir les Vidéos & Personnages</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-14">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5]" />
              <span>100% Caractères Simplifiés (简体字)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5]" />
              <span>Conforme Niveaux HSK 1 à HSK 6</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5]" />
              <span>Accès immédiat sans carte bancaire</span>
            </div>
          </div>
        </div>

        {/* Interactive Showcase Mockup */}
        <div className="relative max-w-4.5xl mx-auto">
          {/* Outer Glow Border */}
          <div className="relative rounded-3xl p-1 sm:p-2 bg-gradient-to-b from-white/80 via-white/30 to-white/10 dark:from-white/20 dark:via-white/5 dark:to-transparent shadow-2xl backdrop-blur-xl border border-white/40 dark:border-white/10">
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[22px] overflow-hidden border border-gray-200/80 dark:border-white/5">
              
              {/* Window Header */}
              <div className="bg-gray-50 dark:bg-[#181818] px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="ml-2 text-xs font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#03DAC5] inline-block animate-pulse" />
                    ChinoisLingo — Lecteur Immersif Interactif
                  </span>
                </div>

                {/* Tab Switcher inside demo */}
                <div className="hidden sm:flex items-center gap-1 bg-gray-200/60 dark:bg-white/5 p-1 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('dialogue')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeTab === 'dialogue'
                        ? 'bg-white dark:bg-[#2A2A2A] text-[#6200EE] dark:text-[#BB86FC] shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    💬 Dialogue Vidéo
                  </button>
                  <button
                    onClick={() => setActiveTab('combinatoire')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeTab === 'combinatoire'
                        ? 'bg-white dark:bg-[#2A2A2A] text-[#6200EE] dark:text-[#BB86FC] shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    ⚡ Méthode Combinatoire
                  </button>
                  <button
                    onClick={() => setActiveTab('chanson')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      activeTab === 'chanson'
                        ? 'bg-white dark:bg-[#2A2A2A] text-[#6200EE] dark:text-[#BB86FC] shadow-sm'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    🎵 Chanson Synchronisée
                  </button>
                </div>
              </div>

              {/* Demo Content */}
              <div className="p-5 sm:p-8">
                {activeTab === 'dialogue' && (
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-white/5">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
                          Série : Vie en Chine Business • Épisode 6
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                          À la recherche du sac (1) — 第一家店
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20">
                          HSK 3
                        </span>
                        <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Audio Studio HD
                        </span>
                      </div>
                    </div>

                    {/* Dialogue Line 1 : Katia */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/5 to-transparent border border-pink-500/20 hover:border-pink-500/40 transition-all flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                        卡
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                            Katia (卡蒂娅) • Femme d’affaires
                          </span>
                          <button
                            onClick={() => handlePlayVoice('你好，请问你们这儿有这个包吗？')}
                            className="p-1.5 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-600 dark:text-pink-300 transition-colors"
                            title="Écouter la prononciation"
                          >
                            <Volume2 className={`w-4 h-4 ${isPlayingDemo ? 'animate-bounce text-[#6200EE]' : ''}`} />
                          </button>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-hanzi">
                          你好，请问你们这儿有这个包吗？
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-[#00897B] dark:text-[#03DAC5] font-pinyin">
                          Nǐ hǎo, qǐngwèn nǐmen zhèr yǒu zhège bāo ma?
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Bonjour, excusez-moi, vous avez ce sac ici ?
                        </p>
                      </div>
                    </div>

                    {/* Dialogue Line 2 : Vendeur */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00897B] to-[#004D40] text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0">
                        店
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-[#00897B] dark:text-[#03DAC5]">
                            Vendeur (店员) • Boutique de maroquinerie
                          </span>
                          <button
                            onClick={() => handlePlayVoice('这个？我看看。不好意思，这个包我们没有了。')}
                            className="p-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-[#00897B] dark:text-[#03DAC5] transition-colors"
                            title="Écouter la prononciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white font-hanzi">
                          这个？我看看。……不好意思，这个包我们没有了。
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-[#00897B] dark:text-[#03DAC5] font-pinyin">
                          Zhège? Wǒ kànkan. …… Bù hǎoyìsi, zhège bāo wǒmen méiyǒu le.
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Celui-ci ? Laissez-moi voir. … Désolé, nous n’avons plus ce sac.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'combinatoire' && (
                  <div className="space-y-4">
                    <div className="text-center py-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#03DAC5] dark:text-[#03DAC5]">
                        Formule Mathématique : Sujet + Verbe & Modalité + Complément
                      </span>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                        Créez des centaines de phrases sans jamais mémoriser par cœur
                      </h4>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30">
                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase">1. Sujet</span>
                        <p className="text-base font-bold font-hanzi text-gray-900 dark:text-white mt-1">我 (Wǒ)</p>
                        <span className="text-xs text-gray-500">Moi / Je</span>
                      </div>
                      <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30">
                        <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase">2. Verbe</span>
                        <p className="text-base font-bold font-hanzi text-gray-900 dark:text-white mt-1">想买 (Xiǎng mǎi)</p>
                        <span className="text-xs text-gray-500">Voudrais acheter</span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">3. Complément</span>
                        <p className="text-base font-bold font-hanzi text-gray-900 dark:text-white mt-1">这个包 (Zhège bāo)</p>
                        <span className="text-xs text-gray-500">Ce sac</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#6200EE]/10 border border-[#6200EE]/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#6200EE] dark:text-[#BB86FC]">Phrase assemblée :</span>
                        <p className="text-lg font-black text-gray-900 dark:text-white font-hanzi">
                          我想买这个包。
                        </p>
                        <p className="text-xs text-[#00897B] dark:text-[#03DAC5] font-pinyin">
                          Wǒ xiǎng mǎi zhège bāo. — Je veux acheter ce sac.
                        </p>
                      </div>
                      <button
                        onClick={() => handlePlayVoice('我想买这个包。')}
                        className="px-4 py-2 rounded-xl bg-[#6200EE] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Écouter</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'chanson' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 to-purple-500/10 border border-rose-500/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                          🎵 Refrain Synchronisé
                        </span>
                        <span className="text-xs font-medium text-gray-500">Cheng Xiang — 四季予你</span>
                      </div>
                      <p className="text-xl font-black text-gray-900 dark:text-white font-hanzi">
                        送你三月的风 六月的雨 九月的风景
                      </p>
                      <p className="text-sm font-semibold text-[#00897B] dark:text-[#03DAC5] font-pinyin">
                        Sòng nǐ sānyuè de fēng, liùyuè de yǔ, jiǔyuè de fēngjǐng
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                        Je t’offre le vent de mars, la pluie de juin et les paysages de septembre...
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Platform Stats Counter */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-white/5 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white font-display">
              HSK 1 à 6
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
              Tous les niveaux officiels
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-white/5 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-[#00897B] dark:text-[#03DAC5] flex items-center justify-center mx-auto mb-3">
              <Volume2 className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white font-display">
              +3 000
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
              Pistes audio HD natives
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-white/5 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white font-display">
              7 Héros
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
              Personnages & séries vidéos
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200/80 dark:border-white/5 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white font-display">
              100%
            </div>
            <div className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
              Caractères Simplifiés (简体)
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
