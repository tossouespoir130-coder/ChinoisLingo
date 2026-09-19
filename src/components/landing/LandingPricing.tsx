'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Check, Sparkles, Gift } from 'lucide-react';
import { PLANS, Devise, formaterMontant, prixMensuelEquivalent } from '@/lib/payments/plans';

export default function LandingPricing() {
  const [devise, setDevise] = useState<Devise>('EUR');

  const handleConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F']
    });
  };

  const planMensuel = PLANS.find((p) => p.id === 'mensuel')!;
  const planSemestriel = PLANS.find((p) => p.id === 'semestriel')!;
  const planAnnuel = PLANS.find((p) => p.id === 'annuel')!;

  return (
    <section id="tarifs" className="py-16 sm:py-24 bg-gray-50/70 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6200EE]/10 border border-[#6200EE]/20 text-[#6200EE] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Offres & Abonnements Officiels</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 font-display tracking-tight">
            Des tarifs simples et sans engagement.
          </h2>

          {/* Devise Switcher EUR / XOF */}
          <div className="inline-flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-gray-200 mt-6 shadow-sm">
            <button
              onClick={() => setDevise('EUR')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                devise === 'EUR' ? 'bg-[#6200EE] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              International (€ EUR)
            </button>
            <button
              onClick={() => setDevise('XOF')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                devise === 'XOF' ? 'bg-[#6200EE] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Afrique / Mobile Money (FCFA)
            </button>
          </div>

          {/* Bonus pill */}
          <div className="flex items-center justify-center gap-2 mt-4 text-xs font-semibold text-[#00897B]">
            <Gift className="w-4 h-4" />
            <span>+7 jours offerts lors de votre premier abonnement !</span>
          </div>
        </div>

        {/* 3 Real Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* Plan 1 : Pass Mensuel */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <span className="text-xs font-bold uppercase text-gray-400">Flexibilité Totale</span>
              <h3 className="text-xl font-black text-gray-900 mt-1">{planMensuel.nom}</h3>
              
              <div className="my-4">
                <span className="text-3xl font-black text-gray-900">
                  {formaterMontant(planMensuel.montant[devise], devise)}
                </span>
                <span className="text-xs text-gray-400 ml-1">/ mois</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00897B] shrink-0" />
                  <span>Accès complet aux niveaux <strong>HSK 1 à HSK 6</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00897B] shrink-0" />
                  <span>Toutes les histoires & séries vidéos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00897B] shrink-0" />
                  <span>Chansons synchronisées & Audio ElevenLabs</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              className="w-full text-center py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-all"
            >
              Choisir le Pass Mensuel
            </Link>
          </div>

          {/* Plan 2 : Pass 6 Mois (Populaire) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#6200EE] shadow-xl flex flex-col justify-between relative transform md:-translate-y-2">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#6200EE] text-white text-[10px] font-black uppercase tracking-wider shadow-md">
              Le Plus Populaire
            </span>

            <div>
              <span className="text-xs font-bold uppercase text-[#6200EE]">Immersion 6 Mois</span>
              <h3 className="text-xl font-black text-gray-900 mt-1">{planSemestriel.nom}</h3>
              
              <div className="my-4">
                <span className="text-3xl font-black text-gray-900">
                  {formaterMontant(planSemestriel.montant[devise], devise)}
                </span>
                <span className="text-xs text-[#00897B] block mt-1 font-semibold">
                  soit {prixMensuelEquivalent(planSemestriel, devise)} / mois (-28%)
                </span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-700 mb-6">
                <li className="flex items-center gap-2 font-semibold text-gray-900">
                  <Check className="w-4 h-4 text-[#6200EE] shrink-0" />
                  <span>Tout le catalogue HSK 1 à 6 illimité</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6200EE] shrink-0" />
                  <span>Séries business, quotidien & voyages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6200EE] shrink-0" />
                  <span>Méthode combinatoire & Flashcards 3D</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#6200EE] shrink-0" />
                  <span>Suivi de progression & statistiques</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              onClick={handleConfetti}
              className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] hover:from-[#5000CC] hover:to-[#651FFF] text-white text-xs font-bold shadow-lg shadow-[#6200EE]/30 transition-all"
            >
              Rejoindre le Pass 6 Mois
            </Link>
          </div>

          {/* Plan 3 : Pass Annuel (Meilleure Offre) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <span className="text-xs font-bold uppercase text-amber-600">Meilleure Économie</span>
              <h3 className="text-xl font-black text-gray-900 mt-1">{planAnnuel.nom}</h3>
              
              <div className="my-4">
                <span className="text-3xl font-black text-gray-900">
                  {formaterMontant(planAnnuel.montant[devise], devise)}
                </span>
                <span className="text-xs text-[#00897B] block mt-1 font-semibold">
                  soit {prixMensuelEquivalent(planAnnuel, devise)} / mois (-40%)
                </span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 mb-6">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00897B] shrink-0" />
                  <span>Accès 12 mois complets sans interruption</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00897B] shrink-0" />
                  <span>Toutes les futures histoires & masterclasses</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#00897B] shrink-0" />
                  <span>Support prioritaire par Espoir Chinois</span>
                </li>
              </ul>
            </div>

            <Link
              href="/connexion"
              className="w-full text-center py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-all"
            >
              Choisir le Pass Annuel
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
