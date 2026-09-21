'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react';

export default function LandingHero() {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden bg-gradient-to-b from-[#F7F5FF]/80 via-white to-white">
      {/* Background Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[400px] bg-gradient-to-tr from-[#6200EE]/10 via-[#03DAC5]/10 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#FFD54F]/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Top Text Content */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#6200EE]/15 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#00BFA5] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-[#6200EE]">
              ✨ Avec ChinoisLingo, le chinois devient facile
            </span>
          </div>

          {/* Main Title H1 */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-950 font-display leading-[1.1] mb-6">
            Écoutez, Lisez & Parlez le Mandarin <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6200EE] via-[#8E24AA] to-[#00897B]">
              par Immersion Active.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Fini l’apprentissage rébarbatif. Progressez à travers des histoires immersives, des dialogues vivants et la Méthode de la Combinaison exclusive.
          </p>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#6200EE] hover:bg-[#5000CC] text-white font-black text-base shadow-xl shadow-[#6200EE]/25 hover:scale-105 active:scale-95 transition-all"
            >
              <span>Commencer gratuitement</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#tarifs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-white border border-gray-200 hover:border-[#6200EE] text-gray-800 font-bold text-base shadow-sm hover:shadow-md transition-all"
            >
              <Play className="w-4 h-4 fill-[#00897B] text-[#00897B]" />
              <span>Voir les Offres & Tarifs</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-gray-500">
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

        {/* Clean Showcase Frame */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-gray-900">
          <div className="relative h-[320px] sm:h-[440px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=1200&auto=format&fit=crop&q=80"
              alt="ChinoisLingo Immersion"
              fill
              className="object-cover opacity-85 brightness-95"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* In-Frame Content */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-lg bg-[#6200EE] text-white text-xs font-bold uppercase tracking-wider">
                  Immersion Totale
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 font-display">
                  Apprenez dans des situations réelles
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 max-w-md mt-1">
                  Des leçons scénarisées, du vocabulaire contextualisé et des dialogues immersifs pour parler avec fluidité.
                </p>
              </div>

              <Link
                href="/onboarding"
                className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-gray-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight className="w-4 h-4 text-[#6200EE]" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
