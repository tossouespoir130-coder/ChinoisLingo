'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Check, Sparkles, Zap, Shield, ArrowRight, Star } from 'lucide-react';

export default function LandingPricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const handlePlanClick = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F']
    });
  };

  return (
    <section id="tarifs" className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6200EE]/10 border border-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tarification Claire & Transparente</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight">
            Investissez dans votre fluidité, <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6200EE] to-[#03DAC5]">
              sans aucun engagement.
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Commencez gratuitement dès aujourd’hui, puis choisissez la formule qui correspond à votre rythme d’apprentissage.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 mt-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-[#252525] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Facturation Mensuelle
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span>Facturation Annuelle</span>
              <span className="px-2 py-0.5 rounded-full bg-[#03DAC5] text-black text-[10px] font-black uppercase">
                -35%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          
          {/* Plan 1 : Gratuit / Découverte */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 border border-gray-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Formule Découverte
              </span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                Gratuit
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Idéal pour tester l’outil et découvrir les premières leçons d’immersion.
              </p>

              <div className="my-6">
                <span className="text-4xl font-black text-gray-900 dark:text-white">0 €</span>
                <span className="text-xs text-gray-500 ml-2 font-medium">pour toujours</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Accès complet au niveau <strong>HSK 1</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Premières leçons de la série <strong>Mon Chat</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Simulateur combinatoire de base</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Dictionnaire intelligent standard</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              onClick={handlePlanClick}
              className="w-full py-3.5 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold text-sm text-center transition-all"
            >
              Démarrer Gratuitement
            </Link>
          </div>

          {/* Plan 2 : Pass Immersion Pro (POPULAIRE) */}
          <div className="relative bg-gradient-to-b from-[#6200EE]/10 via-white to-white dark:from-[#6200EE]/20 dark:via-[#1E1E1E] dark:to-[#1E1E1E] rounded-3xl p-8 sm:p-10 border-2 border-[#6200EE] dark:border-[#BB86FC] shadow-2xl flex flex-col justify-between transform lg:-translate-y-3">
            
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#6200EE] to-[#03DAC5] text-white text-xs font-black uppercase tracking-wider shadow-md">
              👑 Le Plus Populaire
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC]">
                  Accès Total Illimité
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] text-[11px] font-bold">
                  Recommandé
                </span>
              </div>

              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                Pass Immersion Pro
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2">
                Tout le catalogue d’immersion pour devenir bilingue avec nos 7 personnages.
              </p>

              <div className="my-6">
                <span className="text-5xl font-black text-gray-900 dark:text-white">
                  {billingCycle === 'yearly' ? '9,99 €' : '14,99 €'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-medium">
                  / mois {billingCycle === 'yearly' && '(facturé annuellement)'}
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-semibold">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Tous les <strong>Niveaux HSK 1 à HSK 6</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-semibold">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Toutes les <strong>Séries Vidéos & Dialogues</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-semibold">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Lecteur de <strong>Chansons Synchronisées</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-semibold">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Méthode de la Combinaison complète</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-semibold">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Flashcards 3D avec audio studio ElevenLabs</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-900 dark:text-white font-semibold">
                  <Check className="w-4 h-4 text-[#00BFA5] shrink-0" />
                  <span>Mises à jour hebdomadaires incluses</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              onClick={handlePlanClick}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] hover:from-[#5000CC] hover:to-[#651FFF] text-white font-black text-sm text-center shadow-lg shadow-[#6200EE]/30 transform active:scale-95 transition-all"
            >
              Rejoindre le Pass Pro ➔
            </Link>
          </div>

          {/* Plan 3 : VIP Business & Coaching */}
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 border border-gray-200/80 dark:border-white/10 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Formule Entrepreneur & Sourcing
              </span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                Pack VIP Business
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                Immersion linguistique + Formations vidéo avancées pour réussir ses affaires en Chine.
              </p>

              <div className="my-6">
                <span className="text-4xl font-black text-gray-900 dark:text-white">
                  {billingCycle === 'yearly' ? '29,99 €' : '39,99 €'}
                </span>
                <span className="text-xs text-gray-500 ml-2 font-medium">/ mois</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span><strong>Tout le contenu du Pass Pro inclus</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Masterclasses vidéo : <strong>Négociation Usines</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Guides Sourcing : <strong>Yiwu & Canton Fair</strong></span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Livres numériques & Lexiques de fret</span>
                </li>
                <li className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Support prioritaire direct</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              onClick={handlePlanClick}
              className="w-full py-3.5 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-bold text-sm text-center transition-all"
            >
              Choisir le Pack VIP
            </Link>
          </div>

        </div>

        {/* Security & Guarantee Banner */}
        <div className="mt-14 max-w-2xl mx-auto flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 text-center">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Paiement sécurisé par Stripe & Moneroo</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Annulation en 1 clic sans frais</span>
          </div>
        </div>

      </div>
    </section>
  );
}
