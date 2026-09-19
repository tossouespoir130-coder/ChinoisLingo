'use client';

import React from 'react';
import Link from 'next/link';
import { Headphones, Layers, Video, BookOpen, Music, CheckCircle2, ArrowRight, Star, Sparkles } from 'lucide-react';

const FEATURES = [
  {
    id: 'immersion',
    icon: Headphones,
    iconColor: '#03DAC5',
    iconBg: 'bg-[#03DAC5]/10',
    badge: 'Module N°1',
    title: 'Écoute & Lecture Immersive',
    subtitle: 'Chansons, Dialogues, Articles & Podcasts',
    description:
      'Immergez-vous dans des contenus audio et vidéo captivants. Suivez les paroles découpées rythme par rythme, cliquez sur n’importe quelle phrase pour réécouter sa prononciation studio et basculez instantanément le Pinyin ou la traduction.',
    highlights: [
      'Chansons chinoises populaires synchronisées mot à mot',
      'Dialogues scénarisés avec 7 personnages vivants',
      'Articles culture & business avec Master audio continu',
      'Affichage bilingue interactif (Hanzi, Pinyin, Français)'
    ],
    link: '/connexion',
    tag: 'HSK 1 à 6'
  },
  {
    id: 'vocabulaire',
    icon: Layers,
    iconColor: '#6200EE',
    iconBg: 'bg-[#6200EE]/10',
    badge: 'Mémorisation Active',
    title: 'Vocabulaire HSK & Flashcards 3D',
    subtitle: 'Algorithme de Répétition Espacée (SRS)',
    description:
      'Oubliez l’oubli. Nos 6 packs officiels HSK 1 à HSK 6 intègrent des sessions de flashcards interactives en 3D avec audio natif, prononciation pas à pas et vraies phrases contextuelles certifiées du corpus Tatoeba.',
    highlights: [
      'Les 6 paliers HSK officiels avec images HD exclusives',
      'Mode Flashcards 3D recto/verso avec révélation des tons',
      'Phrases d’exemples progressives certifiées par des linguistes',
      'Statistiques de maîtrise et suivi de vos séries de jours 🔥'
    ],
    link: '/connexion',
    tag: '5 000+ Mots'
  },
  {
    id: 'formations',
    icon: Video,
    iconColor: '#E91E63',
    iconBg: 'bg-[#E91E63]/10',
    badge: 'Par Espoir Chinois',
    title: 'Formations & Masterclasses Vidéo',
    subtitle: 'Sourcing, Négociation Usines & Business',
    description:
      'Passez au niveau supérieur dans vos projets professionnels en Chine. Des cours vidéos intensifs animés par Espoir Chinois pour négocier avec les fournisseurs, visiter les usines et maîtriser le fret international.',
    highlights: [
      'Masterclasses concrètes de négociation commerciale',
      'Guides pratiques de sourcing à Yiwu et Guangzhou',
      'Vocabulaire technique du commerce international et douanes',
      'Lecteur vidéo immersif avec validation et quiz d’évaluation'
    ],
    link: '/connexion',
    tag: 'Vidéos 4K'
  },
  {
    id: 'dictionnaire',
    icon: BookOpen,
    iconColor: '#FFC107',
    iconBg: 'bg-[#FFC107]/10',
    badge: 'Outil Quotidien',
    title: 'Dictionnaire Intelligent & Mes Mots',
    subtitle: 'Votre boîte personnalisée de révision',
    description:
      'Un moteur de recherche instantané qui comprend le Hanzi, le Pinyin avec tons ou le français. Enregistrez vos mots favoris en un clic dans « Mes Mots » et lancez des sessions de révision ciblées.',
    highlights: [
      'Recherche ultra-rapide parmi des milliers de caractères',
      'Jusqu’à 5 phrases d’exemples graduées par mot recherché',
      'Carnet de vocabulaire personnalisé « Mes Mots »',
      'Option d’ajout de vos propres phrases et notes d’étude'
    ],
    link: '/connexion',
    tag: 'Recherche Instantanée'
  }
];

export default function LandingFeatures() {
  return (
    <section id="fonctionnalites" className="py-20 sm:py-28 bg-gray-50/50 dark:bg-[#151515] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6200EE]/10 border border-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Un Écosystème d’Apprentissage Complet</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight">
            Tout ce dont vous avez besoin pour <br />
            <span className="text-[#6200EE] dark:text-[#BB86FC]">devenir bilingue en mandarin.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            ChinoisLingo réunit les 4 piliers indispensables pour écouter, comprendre, parler et mémoriser sans effort.
          </p>
        </div>

        {/* Features 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 sm:p-10 border border-gray-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Top Bar of card */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${feat.iconColor}18`, color: feat.iconColor }}
                    >
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border"
                      style={{
                        backgroundColor: `${feat.iconColor}15`,
                        color: feat.iconColor,
                        borderColor: `${feat.iconColor}30`
                      }}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {feat.subtitle}
                  </span>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                    {feat.description}
                  </p>

                  {/* Highlights Checklist */}
                  <ul className="space-y-2.5 mb-8">
                    {feat.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#00BFA5] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Link */}
                <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Badge : <strong className="text-gray-900 dark:text-white">{feat.tag}</strong>
                  </span>
                  <Link
                    href={feat.link}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#6200EE] dark:text-[#BB86FC] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Explorer le module</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
