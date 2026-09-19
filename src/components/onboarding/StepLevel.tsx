'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, HelpCircle } from 'lucide-react';
import { NiveauType } from './types';

interface StepLevelProps {
  selectedNiveau: NiveauType | '';
  onConfirmLevel: (id: NiveauType, label: string) => void;
}

export function StepLevel({ selectedNiveau, onConfirmLevel }: StepLevelProps) {
  const [currentChoice, setCurrentChoice] = useState<NiveauType | ''>(selectedNiveau);
  const [showFeedback, setShowFeedback] = useState<boolean>(!!selectedNiveau);
  const [showLevelGuide, setShowLevelGuide] = useState<boolean>(false);

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
    setShowFeedback(true);
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
      {!showFeedback ? (
        <>
          {/* Xiao Li Mascot + Speech Bubble */}
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 relative shrink-0">
              <Image
                src="/images/onboarding/xiao-li-avatar.png"
                alt="Xiao Li - Mascotte ChinoisLingo"
                width={56}
                height={56}
                className="object-contain"
                priority
              />
            </div>
            <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
              <div className="absolute top-4 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
              <p className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] leading-snug">
                Quel est ton niveau de chinois ?
              </p>
            </div>
          </div>

          {/* Level Cards */}
          <div className="flex flex-col gap-3">
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-left bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0]/80 dark:border-[#2D2D2D] hover:border-[#6200EE]/60 dark:hover:border-[#6200EE]/60 hover:shadow-xs transition-all duration-200 btn-press cursor-pointer"
              >
                {/* Signal bars indicator (Violet / Turquoise) */}
                <div className="flex items-end gap-1 w-8 h-8 justify-center shrink-0">
                  <div
                    className={`w-1.5 h-3 rounded-full ${
                      opt.bars >= 1 ? 'bg-[#6200EE] dark:bg-[#03DAC5]' : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                    }`}
                  />
                  <div
                    className={`w-1.5 h-5 rounded-full ${
                      opt.bars >= 2 ? 'bg-[#6200EE] dark:bg-[#03DAC5]' : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                    }`}
                  />
                  <div
                    className={`w-1.5 h-7 rounded-full ${
                      opt.bars >= 3 ? 'bg-[#6200EE] dark:bg-[#03DAC5]' : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                    }`}
                  />
                </div>
                <span className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] flex-1">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>

          {/* Bottom Helper Banner */}
          <div className="relative pt-6">
            <div className="absolute top-0 left-4 w-12 h-12 z-10">
              <Image
                src="/images/onboarding/mascot-search.png"
                alt="Aide au niveau"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowLevelGuide(true)}
              className="w-full flex items-center justify-between p-4 pl-16 rounded-2xl bg-[#03DAC5]/10 dark:bg-[#03DAC5]/15 border border-[#03DAC5]/30 hover:bg-[#03DAC5]/20 dark:hover:bg-[#03DAC5]/25 transition-all text-left cursor-pointer"
            >
              <span className="text-sm font-semibold text-[#00796B] dark:text-[#03DAC5]">
                Aide-moi à connaître mon niveau
              </span>
              <div className="w-7 h-7 rounded-full bg-[#00897B] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          </div>
        </>
      ) : (
        /* Selected Feedback View */
        <div className="animate-fade-in flex flex-col gap-6">
          {/* Question header */}
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 relative shrink-0">
              <Image
                src="/images/onboarding/xiao-li-avatar.png"
                alt="Xiao Li - Mascotte ChinoisLingo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
              <p className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5]">
                Quel est ton niveau de chinois ?
              </p>
            </div>
          </div>

          {/* Highlighted selected card with Violet brand color */}
          <div className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#6200EE]/8 dark:bg-[#6200EE]/20 border border-[#6200EE] dark:border-[#BB86FC] shadow-sm ring-1 ring-[#6200EE] dark:ring-[#BB86FC]">
            <div className="flex items-end gap-1 w-8 h-8 justify-center shrink-0">
              <div
                className={`w-1.5 h-3 rounded-full ${
                  (chosenObj?.bars || 1) >= 1
                    ? 'bg-[#6200EE] dark:bg-[#03DAC5]'
                    : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                }`}
              />
              <div
                className={`w-1.5 h-5 rounded-full ${
                  (chosenObj?.bars || 1) >= 2
                    ? 'bg-[#6200EE] dark:bg-[#03DAC5]'
                    : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                }`}
              />
              <div
                className={`w-1.5 h-7 rounded-full ${
                  (chosenObj?.bars || 1) >= 3
                    ? 'bg-[#6200EE] dark:bg-[#03DAC5]'
                    : 'bg-[#CFD8DC] dark:bg-[#455A64]'
                }`}
              />
            </div>
            <span className="text-base font-semibold text-[#212121] dark:text-[#F5F5F5] flex-1">
              {chosenObj?.label}
            </span>
          </div>

          {/* Xiao Li Sparkling Mascot Speech bubble */}
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 relative shrink-0">
              <Image
                src="/images/onboarding/mascot-sparkle.png"
                alt="Xiao Li motivé"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <div className="relative flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-2xl border border-[#E0E0E0]/80 dark:border-[#2D2D2D] shadow-sm">
              <div className="absolute top-4 -left-2 w-3 h-3 bg-white dark:bg-[#1E1E1E] border-l border-b border-[#E0E0E0]/80 dark:border-[#2D2D2D] transform rotate-45" />
              <p className="text-sm sm:text-base font-medium text-[#212121] dark:text-[#F5F5F5] leading-relaxed">
                {chosenObj?.feedback}
              </p>
            </div>
          </div>

          {/* Continue button with Violet Signature Color */}
          <div className="pt-2">
            <button
              type="submit"
              onClick={handleProceed}
              className="w-full py-4 rounded-2xl bg-[#6200EE] hover:bg-[#5000CA] text-white font-bold text-base shadow-md hover:shadow-lg transition-all btn-press cursor-pointer"
            >
              Continuer
            </button>
          </div>
        </div>
      )}

      {/* Modal Aide Niveau */}
      {showLevelGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 max-w-md w-full border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#03DAC5]/20 flex items-center justify-center text-[#00897B] dark:text-[#03DAC5]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#212121] dark:text-white">
                Repères de Niveau HSK
              </h3>
            </div>

            <div className="space-y-3 text-sm text-[#424242] dark:text-[#E0E0E0]">
              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333]">
                <p className="font-bold text-[#00897B] dark:text-[#03DAC5]">1. Débutant complet (HSK 1)</p>
                <p className="text-xs text-[#757575] dark:text-[#9E9E9E] mt-0.5">
                  Idéal si vous découvrez le chinois. Apprenez la phonétique (Pinyin), les tons et les 150 premiers mots.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333]">
                <p className="font-bold text-[#0288D1]">2. Petite conversation (HSK 2 - 3)</p>
                <p className="text-xs text-[#757575] dark:text-[#9E9E9E] mt-0.5">
                  Vous savez poser des questions simples, vous repérer et commander. Consolidez les dialogues du quotidien.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/60 dark:border-[#333]">
                <p className="font-bold text-[#6200EE] dark:text-[#BB86FC]">3. Conversation fluide (HSK 4 - 6)</p>
                <p className="text-xs text-[#757575] dark:text-[#9E9E9E] mt-0.5">
                  Vous comprenez les échanges complexes, les articles d’actualité et les séries business.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLevelGuide(false)}
              className="w-full py-3 rounded-xl bg-[#6200EE] text-white font-bold text-sm shadow-sm hover:bg-[#5000CA] transition-colors cursor-pointer"
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
