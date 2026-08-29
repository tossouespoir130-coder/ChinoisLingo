'use client';

import React from 'react';
import { Portal } from '@/components/ui/Portal';
import {
  X,
  Compass,
  Layers,
  Sparkles,
  Headphones,
  GraduationCap,
  Shuffle,
  BookOpen,
  UserCheck,
  CheckCircle2,
  Music,
  Flame
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  const sections = [
    {
      icon: Flame,
      color: 'text-[#FF6D00] bg-[#FF6D00]/10',
      title: '1. Tableau de Bord & Progression',
      desc: 'Suivez vos statistiques en temps réel : votre série de jours consécutifs (🔥), votre graphique d’effort (Théorie, Pratique, Lexique) et reprenez vos leçons là où vous vous êtes arrêté en 1 clic grâce à la section « Continuer ma pratique ».',
    },
    {
      icon: Sparkles,
      color: 'text-[#6200EE] bg-[#6200EE]/10',
      title: '2. Vocabulaire HSK & Flashcards 3D (SRS)',
      desc: 'Maîtrisez le vocabulaire officiel HSK 1 à HSK 6 avec notre dictionnaire complet et l’algorithme de répétition espacée (SRS). Entraînez-vous avec les Flashcards 3D interactives, écoutez la prononciation audio et sauvegardez vos termes favoris dans « Mes Mots ».',
    },
    {
      icon: Shuffle,
      color: 'text-[#00897B] bg-[#00BFA5]/15',
      title: '3. Méthode de la Combinaison',
      desc: 'Construisez des centaines de phrases fluides sans grammaire complexe. Sélectionnez ou saisissez un mot pivot : le moteur adapte la structure réelle (Sujet + Verbe + Complément) et vous permet d’écouter et d’enregistrer chaque phrase générée.',
    },
    {
      icon: Headphones,
      color: 'text-[#03DAC5] bg-[#03DAC5]/15',
      title: '4. Écoute & Lecture Immersive Multi-Formats',
      desc: 'Développez votre compréhension avec des chansons chinoises (découpées vers par vers avec vidéo YouTube), podcasts interactifs, séries d’articles exclusives, dialogues avec personnages et histoires immersives.',
    },
    {
      icon: GraduationCap,
      color: 'text-[#6200EE] bg-[#6200EE]/10',
      title: '5. Formations Pédagogiques',
      desc: 'Suivez des cours structurés étape par étape pour travailler les différents aspects de votre apprentissage (expression orale, écoute, prononciation, tonalités et situations réelles).',
    },
    {
      icon: BookOpen,
      color: 'text-[#E91E63] bg-[#E91E63]/10',
      title: '6. Livres & Programmes d’Accompagnement',
      desc: 'Accédez à des ouvrages de référence pour vous aider à apprendre et à des programmes qui seront lancés à une certaine fréquence pour aider les utilisateurs à avancer.',
    },
    {
      icon: UserCheck,
      color: 'text-[#3F51B5] bg-[#3F51B5]/10',
      title: '7. Profil, Recherche Globale & Préférences',
      desc: 'Personnalisez votre photo de profil, utilisez la Recherche Globale (⌘K) pour retrouver instantanément n’importe quelle ressource et ajustez vos préférences (vitesse audio, affichage Pinyin, thème sombre).',
    },
  ];

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="nixtio-card w-full max-w-2xl p-6 sm:p-8 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl rounded-3xl space-y-6 max-h-[90vh] overflow-y-auto animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center shadow-xs shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
                  Guide d’Utilisation de ChinoisLingo
                </h3>
                <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                  Découvrez l’ensemble des fonctionnalités pour progresser avec fluidité.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors shrink-0 btn-press"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3">
            {sections.map((sec) => {
              const Icon = sec.icon;
              return (
                <div
                  key={sec.title}
                  className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] flex items-start gap-3.5 hover:border-[#6200EE]/40 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${sec.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display font-bold text-sm text-[#212121] dark:text-[#F5F5F5]">
                      {sec.title}
                    </h4>
                    <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer CTA & Slogan */}
          <div className="pt-2 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#6200EE] dark:text-[#BB86FC]">
              « Avec ChinoisLingo, le chinois devient facile »
            </span>
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press text-center"
            >
              J’ai compris
            </button>
          </div>

        </div>
      </div>
    </Portal>
  );
}
