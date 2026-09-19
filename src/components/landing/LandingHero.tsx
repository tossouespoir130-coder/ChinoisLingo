'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Volume2, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function LandingHero() {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayVoice = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.88;
      setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(true);
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-[#0E0E12]">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[400px] bg-gradient-to-tr from-[#6200EE]/20 via-[#03DAC5]/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#7C4DFF]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Top Text Content */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00BFA5] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-[#BB86FC]">
              ✨ Avec ChinoisLingo, le chinois devient facile
            </span>
          </div>

          {/* Main Title H1 */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white font-display leading-[1.1] mb-6">
            Écoutez, Lisez & Parlez le Mandarin <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BB86FC] via-[#E040FB] to-[#03DAC5]">
              par Immersion Active.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Fini l’apprentissage rébarbatif. Progressez à travers des histoires immersives, des dialogues vivants et notre méthode combinatoire exclusive.
          </p>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/connexion"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] hover:from-[#5000CC] hover:to-[#651FFF] text-white font-black text-base shadow-xl shadow-[#6200EE]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Commencer Gratuitement</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#tarifs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-base hover:bg-white/10 transition-all"
            >
              <Play className="w-4 h-4 fill-[#03DAC5] text-[#03DAC5]" />
              <span>Voir les Offres & Tarifs</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5]" />
              <span>100% Caractères Simplifiés (简体字)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5]" />
              <span>Niveaux HSK 1 à HSK 6</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00BFA5]" />
              <span>Accès gratuit sans carte bancaire</span>
            </div>
          </div>
        </div>

        {/* Clean Showcase Frame (Sans icône de chat parasite) */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#16161D]">
          <div className="relative h-[320px] sm:h-[440px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&auto=format&fit=crop&q=80"
              alt="ChinoisLingo Immersion"
              fill
              className="object-cover opacity-80 brightness-90"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E12] via-[#0E0E12]/40 to-transparent" />

            {/* In-Frame Content */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-lg bg-[#6200EE] text-white text-xs font-bold uppercase tracking-wider">
                  Immersion Totale
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 font-display">
                  Apprenez dans des situations réelles
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mt-1">
                  Des leçons scénarisées, du vocabulaire contextualisé et des pistes audio natives pour parler avec fluidité.
                </p>
              </div>

              <button
                onClick={() => handlePlayVoice('你好！欢迎来到中文世界，跟我一起学中文吧！')}
                className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-gray-950 font-bold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Volume2 className={`w-4 h-4 text-[#6200EE] ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>Écouter un extrait audio</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
