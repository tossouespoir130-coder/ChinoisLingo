'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const FAQS = [
  {
    question: 'Je suis débutant absolu, ChinoisLingo est-il fait pour moi ?',
    answer:
      'Absolument ! ChinoisLingo a été pensé dès le premier jour pour les débutants complets. Vous démarrez par le niveau HSK 1 et découvrez pas à pas le Pinyin, la phonétique avec les 4 tons, et les premières phrases du quotidien avec notre chaton Xiaobai et nos personnages bienveillants.'
  },
  {
    question: 'Pourquoi la méthode de la combinaison est-elle plus efficace que l’apprentissage classique ?',
    answer:
      'Dans les méthodes traditionnelles, on vous demande d’apprendre des listes isolées de vocabulaire. Avec la Méthode de la Combinaison, vous apprenez la mécanique interne du chinois : assembler des blocs modulaires (Sujet + Verbe + Complément). Avec 18 mots clés, vous pouvez composer plus de 200 phrases naturelles dès la première heure !'
  },
  {
    question: 'Comment fonctionnent les voix et pistes audio sur la plateforme ?',
    answer:
      'Toutes nos histoires, articles, dialogues et chansons bénéficient d’enregistrements de qualité studio haute définition (générés avec des voix natives d’exception). Chaque phrase est audible indépendamment d’un simple clic, et vous pouvez écouter le Master continu avec des respirations naturelles et des silences de fin soignés.'
  },
  {
    question: 'Les caractères chinois sont-ils tous en chinois simplifié (简体字) ?',
    answer:
      'Oui, 100% des contenus sur ChinoisLingo (vocabulaire, lectures, dialogues, chansons, formations) sont rigoureusement en caractères chinois simplifiés (简体字), la norme officielle utilisée en Chine continentale et dans le commerce international.'
  },
  {
    question: 'Puis-je utiliser ChinoisLingo sur mon smartphone ou ma tablette ?',
    answer:
      'Oui ! ChinoisLingo est une Progressive Web App ultra-réactive optimisée pour iPhone, iPad, smartphones Android et ordinateurs. L’interface s’adapte automatiquement avec défilement fluide, menus tactiles et confort visuel maximal.'
  },
  {
    question: 'Puis-je annuler mon abonnement à tout moment ?',
    answer:
      'Oui, à tout moment en un seul clic depuis votre espace « Mon Compte ». Vous conservez l’accès à tous vos cours jusqu’à la fin de la période en cours, sans aucun frais caché ni engagement.'
  }
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6200EE]/10 border border-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions Fréquentes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight">
            Tout ce que vous devez savoir <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6200EE] to-[#03DAC5]">
              avant de commencer.
            </span>
          </h2>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-gray-900 dark:text-white hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#6200EE] dark:text-[#BB86FC]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
