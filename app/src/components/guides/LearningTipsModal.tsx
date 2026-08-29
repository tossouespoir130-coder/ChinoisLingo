'use client';

import React from 'react';
import { Portal } from '@/components/ui/Portal';
import {
  X,
  Lightbulb,
  Clock,
  Volume2,
  Repeat,
  Shuffle,
  Music,
  Eye,
  CheckCircle2
} from 'lucide-react';

interface LearningTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LearningTipsModal({ isOpen, onClose }: LearningTipsModalProps) {
  if (!isOpen) return null;

  const tips = [
    {
      icon: Shuffle,
      color: 'text-[#00897B] bg-[#00BFA5]/15',
      title: '1. Multipliez vos phrases avec la Combinaison',
      badge: 'Méthode Clé',
      desc: 'Ne mémorisez pas des listes isolées de mots. Utilisez la « Méthode de la Combinaison » (Sujet + Verbe + Complément) pour créer instantanément plus de 100 phrases authentiques à partir de 10 mots pivots simples.',
    },
    {
      icon: Clock,
      color: 'text-[#6200EE] bg-[#6200EE]/10',
      title: '2. La Règle d’or des 15 minutes par jour',
      badge: 'Régularité',
      desc: 'La régularité bat toujours l’intensité. Pratiquez 15 minutes chaque jour (une session de Flashcards 3D le matin, une chanson ou un podcast le soir) pour ancrer durablement les caractères et les tonalités sans fatigue mentale.',
    },
    {
      icon: Repeat,
      color: 'text-[#E91E63] bg-[#E91E63]/10',
      title: '3. Faites confiance à la Répétition Espacée (SRS)',
      badge: 'Flashcards 3D',
      desc: 'Inutile de forcer la mémoire. Notez honnêtement vos cartes : l’algorithme intelligent vous reproposera les mots difficiles au moment exact où votre mémoire est sur le point de les oublier.',
    },
    {
      icon: Music,
      color: 'text-[#0288D1] bg-[#0288D1]/10',
      title: '4. Apprenez en chantant avec les Paroles',
      badge: 'Immersion Audio',
      desc: 'La musique chinoise est le meilleur moyen d’assimiler naturellement les 4 tons et le rythme parlé. Suivez les paroles découpées vers par vers dans Écoute & Lecture et chantez en même temps.',
    },
    {
      icon: Eye,
      color: 'text-[#FF6D00] bg-[#FF6D00]/10',
      title: '5. Progressez en désactivant le Pinyin',
      badge: 'Lecture Hanzi',
      desc: 'Au début, gardez le Pinyin pour vous rassurer. Dès que vous vous sentez plus à l’aise, désactivez le Pinyin avec le bouton en en-tête pour forcer votre cerveau à reconnaître directement les caractères chinois (Hanzi).',
    },
    {
      icon: Volume2,
      color: 'text-[#8E24AA] bg-[#8E24AA]/10',
      title: '6. Répétez toujours à voix haute',
      badge: 'Expression Orale',
      desc: 'Le chinois mobilise des muscles de la bouche différents du français. Écoutez chaque réplique audio et répétez-la systématiquement à voix haute en accentuant la clarté des 4 tons.',
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
              <div className="w-12 h-12 rounded-2xl bg-[#FFC107]/15 text-[#B78103] dark:text-[#FFD54F] flex items-center justify-center shadow-xs shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl sm:text-2xl text-[#212121] dark:text-[#F5F5F5]">
                  Astuces pour apprendre efficacement
                </h3>
                <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                  Les clés méthodologiques testées et approuvées pour les apprenants francophones.
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

          {/* Tips List */}
          <div className="space-y-3">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <div
                  key={tip.title}
                  className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#E0E0E0] dark:border-[#2D2D2D] flex items-start gap-3.5 hover:border-[#FFC107]/40 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tip.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display font-bold text-sm text-[#212121] dark:text-[#F5F5F5]">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-[#757575] dark:text-[#A0A0A0] mt-1 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer CTA & Slogan */}
          <div className="pt-2 border-t border-[#E0E0E0]/70 dark:border-[#2D2D2D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#6200EE] dark:text-[#BB86FC]">
              « Le chinois devient facile »
            </span>
            <button
              onClick={onClose}
              type="button"
              className="px-6 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 transition-all btn-press text-center"
            >
              Appliquer ces conseils
            </button>
          </div>

        </div>
      </div>
    </Portal>
  );
}
