'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Play, Volume2, Flame, BookOpen, Clock, ArrowRight, Star, CheckCircle2 } from 'lucide-react';

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
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#F5F3FF]/60 via-white to-white dark:from-[#18122B]/40 dark:via-[#121212] dark:to-[#121212]">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-[#6200EE]/15 via-[#03DAC5]/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-[#FFD54F]/15 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Top Text Content */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/10 border border-[#6200EE]/20 dark:border-white/10 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00BFA5] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-[#6200EE] dark:text-[#BB86FC]">
              ✨ Avec ChinoisLingo, le chinois devient facile
            </span>
          </div>

          {/* Main Title H1 */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-950 dark:text-white font-display leading-[1.12] mb-6">
            Écoutez, Lisez & Parlez le Mandarin <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6200EE] via-[#8E24AA] to-[#00897B]">
              par Immersion Naturelle.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
            Apprenez le chinois à travers des histoires passionnantes, des personnages attachants et notre méthode combinatoire exclusive.
          </p>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/connexion"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#6200EE] hover:bg-[#5000CC] text-white font-black text-base shadow-lg shadow-[#6200EE]/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span>Commencer Gratuitement</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#personnages"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 hover:border-[#6200EE] text-gray-800 dark:text-white font-bold text-base shadow-sm hover:shadow-md transition-all"
            >
              <Play className="w-4 h-4 fill-[#6200EE] text-[#6200EE]" />
              <span>Explorer les Histoires & Héros</span>
            </a>
          </div>
        </div>

        {/* Central Visual Showcase with Floating Cards (Inspired by Reference Shot) */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Main Display Canvas */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/10 bg-gradient-to-tr from-[#121212] to-[#252525]">
            <div className="relative h-[360px] sm:h-[460px] w-full">
              {/* Background Image of Story Scenery */}
              <Image
                src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&auto=format&fit=crop&q=80"
                alt="ChinoisLingo Immersion"
                fill
                className="object-cover opacity-85 brightness-95"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

              {/* Overlay Content in Scene */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="px-3 py-1 rounded-lg bg-[#6200EE] text-white text-xs font-bold uppercase tracking-wider">
                    Série Coup de Cœur
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 font-display">
                    Les Aventures en Chine
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200 max-w-md mt-1">
                    Suivez Xiaobai, Katia, Brice et Espoir dans des dialogues vivants du quotidien et du business.
                  </p>
                </div>

                <button
                  onClick={() => handlePlayVoice('你好！欢迎来到中文世界，跟我一起学中文吧！')}
                  className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/95 text-gray-900 font-bold text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  <Volume2 className={`w-4 h-4 text-[#6200EE] ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                  <span>Écouter un extrait</span>
                </button>
              </div>
            </div>
          </div>

          {/* Left Floating Story Card (Inspired by Dribbble Ref) */}
          <div className="hidden md:flex absolute -left-10 top-16 w-64 bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-white/10 flex-col gap-3 animate-in fade-in slide-in-from-left-4 duration-500 hover:-translate-y-1 transition-transform">
            <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80"
                alt="Mon Chat Xiaobai"
                fill
                className="object-cover"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#00BFA5] text-white text-[10px] font-black uppercase">
                HSK 1
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#6200EE] dark:text-[#BB86FC] uppercase tracking-wider">
                Histoire Scénarisée
              </span>
              <h4 className="text-sm font-black text-gray-900 dark:text-white mt-0.5">
                Mon Chat Xiaobai (小白)
              </h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Par Espoir Chinois • 5 parties
              </p>
            </div>
          </div>

          {/* Right Floating Gamification / Streak Widget (Inspired by Dribbble Ref) */}
          <div className="hidden md:flex absolute -right-10 bottom-12 w-64 bg-white dark:bg-[#1E1E1E] rounded-2xl p-4 shadow-2xl border border-gray-100 dark:border-white/10 flex-col gap-3 animate-in fade-in slide-in-from-right-4 duration-500 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-orange-500" />
                </div>
                <div>
                  <span className="text-xs font-black text-gray-900 dark:text-white">
                    14 jours de série
                  </span>
                  <span className="text-[10px] text-gray-500 block">Objectif quotidien atteint</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-2 text-center">
              <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                <span className="text-sm font-black text-[#6200EE] dark:text-[#BB86FC] block">24</span>
                <span className="text-[10px] text-gray-500">Histoires lues</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-2 rounded-xl">
                <span className="text-sm font-black text-[#00BFA5] block">45 min</span>
                <span className="text-[10px] text-gray-500">Temps d’écoute</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
