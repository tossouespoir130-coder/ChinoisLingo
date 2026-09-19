'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

export default function LandingPricing() {
  const [isYearly, setIsYearly] = useState(true);

  const handleConfetti = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F']
    });
  };

  return (
    <section id="tarifs" className="py-16 sm:py-24 bg-gray-50/70 dark:bg-[#151515] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6200EE] dark:text-[#BB86FC] block mb-2">
            Tarifs Transparents
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 dark:text-white font-display tracking-tight">
            Commencez gratuitement, évoluez à votre rythme.
          </h2>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 bg-white dark:bg-white/10 p-1.5 rounded-full border border-gray-200 dark:border-white/10 mt-6 shadow-sm">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                !isYearly ? 'bg-[#6200EE] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                isYearly ? 'bg-[#6200EE] text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span>Annuel</span>
              <span className="px-1.5 py-0.5 rounded-md bg-[#03DAC5] text-black text-[9px] font-black uppercase">
                -35%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Gratuit */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Découverte</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">Gratuit</h3>
              <div className="my-4">
                <span className="text-3xl font-black text-gray-900 dark:text-white">0 €</span>
                <span className="text-xs text-gray-400 ml-1">/ toujours</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Accès complet au niveau HSK 1</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Premières leçons de Mon Chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Simulateur combinatoire</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              className="w-full text-center py-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Commencer Gratuitement
            </Link>
          </div>

          {/* Immersion Premium (Featured) */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 border-2 border-[#6200EE] shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#6200EE] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              Recommandé
            </span>

            <div>
              <span className="text-xs font-bold uppercase text-[#6200EE] dark:text-[#BB86FC]">Pass Immersion</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">Premium</h3>
              <div className="my-4">
                <span className="text-3xl font-black text-gray-900 dark:text-white">
                  {isYearly ? '12 €' : '19 €'}
                </span>
                <span className="text-xs text-gray-400 ml-1">/ mois</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6">
                <li className="flex items-center gap-2 font-semibold">
                  <Check className="w-4 h-4 text-[#6200EE] shrink-0" />
                  <span>Tous les niveaux HSK 1 à HSK 6</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6200EE] shrink-0" />
                  <span>Toutes les séries vidéos & histoires</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6200EE] shrink-0" />
                  <span>Chansons karaoké synchronisées</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6200EE] shrink-0" />
                  <span>Synthèse vocale native ElevenLabs</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              onClick={handleConfetti}
              className="w-full text-center py-3 rounded-xl bg-[#6200EE] text-white text-xs font-bold shadow-md shadow-[#6200EE]/30 hover:bg-[#5000CC] transition-all"
            >
              Rejoindre le Pass Immersion
            </Link>
          </div>

          {/* VIP Business */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Business & Sourcing</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mt-1">VIP Pro</h3>
              <div className="my-4">
                <span className="text-3xl font-black text-gray-900 dark:text-white">49 €</span>
                <span className="text-xs text-gray-400 ml-1">/ mois</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tout le contenu Premium inclus</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Formations négociation & usines</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>E-books & guides business en Chine</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              className="w-full text-center py-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Accéder au Programme VIP
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
