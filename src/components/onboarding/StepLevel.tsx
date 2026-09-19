'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { NiveauType } from './types';

interface StepLevelProps {
  selectedNiveau: NiveauType | '';
  onConfirmLevel: (id: NiveauType, label: string) => void;
}

export function StepLevel({ selectedNiveau, onConfirmLevel }: StepLevelProps) {
  const [currentChoice, setCurrentChoice] = useState<NiveauType | ''>(
    selectedNiveau || 'debutant'
  );

  const options = [
    {
      id: 'debutant' as NiveauType,
      label: 'Je débute complètement',
      bars: 1,
      feedback:
        'Super ! C’est le moment idéal pour commencer ! Nous allons démarrer pas à pas avec les sons, les tons et les premiers mots essentiels !',
    },
    {
      id: 'intermediaire_bas' as NiveauType,
      label: 'Je peux tenir une petite conversation',
      bars: 2,
      feedback:
        'Excellent ! Tu as déjà de bonnes bases ! Commençons au niveau 2-3 pour consolider ton vocabulaire et booster ton aisance à l’oral !',
    },
    {
      id: 'intermediaire_avance' as NiveauType,
      label: 'Je me débrouille en conversation quotidienne',
      bars: 3,
      feedback:
        'Impressionnant ! Tu te débrouilles déjà très bien en chinois ! Commençons aux niveaux avancés pour explorer des dialogues et articles plus riches !',
    },
  ];

  const handleSelect = (id: NiveauType) => {
    setCurrentChoice(id);
  };

  const handleProceed = () => {
    if (!currentChoice) return;
    const found = options.find((o) => o.id === currentChoice);
    if (found) {
      onConfirmLevel(found.id, found.label);
    }
  };

  const chosenObj = options.find((o) => o.id === currentChoice);

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Xiao Li Mascot + Speech Bubble */}
      <div className="flex items-center gap-3.5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 relative shrink-0">
          <Image
            src="/images/onboarding/xiao-li-avatar.png"
            alt="Xiao Li - Mascotte ChinoisLingo"
            width={80}
            height={80}
            className="object-contain w-full h-full drop-shadow-xs"
            priority
          />
        </div>
        <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
          <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
          <p className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] leading-snug">
            Quel est ton niveau de chinois ?
          </p>
        </div>
      </div>

      {/* 3 Level Cards (All 3 always visible) */}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const isSelected = currentChoice === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left border transition-all duration-200 btn-press cursor-pointer ${
                isSelected
                  ? 'bg-[#6200EE]/8 dark:bg-[#6200EE]/20 border-[#6200EE] dark:border-[#BB86FC] shadow-sm ring-2 ring-[#6200EE] dark:ring-[#BB86FC] scale-[1.01]'
                  : 'bg-white dark:bg-[#1E1E1E] border-[#E0E0E0]/80 dark:border-[#2D2D2D] hover:border-[#6200EE]/60 dark:hover:border-[#6200EE]/60 hover:shadow-xs'
              }`}
            >
              {/* Signal bars indicator */}
              <div className="flex items-end gap-1 w-8 h-8 justify-center shrink-0">
                <div
                  className={`w-1.5 h-3 rounded-full transition-colors ${
                    opt.bars >= 1
                      ? 'bg-[#6200EE] dark:bg-[#03DAC5]'
                      : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                  }`}
                />
                <div
                  className={`w-1.5 h-5 rounded-full transition-colors ${
                    opt.bars >= 2
                      ? 'bg-[#6200EE] dark:bg-[#03DAC5]'
                      : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                  }`}
                />
                <div
                  className={`w-1.5 h-7 rounded-full transition-colors ${
                    opt.bars >= 3
                      ? 'bg-[#6200EE] dark:bg-[#03DAC5]'
                      : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                  }`}
                />
              </div>

              <span className={`text-base font-semibold flex-1 ${
                isSelected ? 'text-[#6200EE] dark:text-[#BB86FC]' : 'text-[#212121] dark:text-[#F5F5F5]'
              }`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Feedback from Xiao Li */}
      {chosenObj && (
        <div className="animate-fade-in p-3.5 rounded-2xl bg-[#03DAC5]/10 dark:bg-[#03DAC5]/15 border border-[#03DAC5]/30 flex items-center gap-3">
          <span className="text-xl shrink-0">✨</span>
          <p className="text-xs sm:text-sm font-medium text-[#00796B] dark:text-[#03DAC5] leading-snug">
            {chosenObj.feedback}
          </p>
        </div>
      )}

      {/* Continue Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-4 rounded-2xl bg-[#6200EE] hover:bg-[#5000CA] text-white font-bold text-base shadow-md hover:shadow-lg transition-all btn-press flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continuer</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
