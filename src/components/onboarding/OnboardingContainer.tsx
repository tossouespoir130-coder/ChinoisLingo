'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { OnboardingState, ProfilType, MotivationType, NiveauType } from './types';
import { StepProfile } from './StepProfile';
import { StepMotivation } from './StepMotivation';
import { StepLevel } from './StepLevel';
import { StepReminders } from './StepReminders';
import { StepRecommendation } from './StepRecommendation';
import { StepRegister } from './StepRegister';

const STORAGE_KEY = 'chinoislingo_onboarding_draft';

export function OnboardingContainer() {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  const [state, setState] = useState<OnboardingState>({
    profil: '',
    profilLabel: '',
    motivation: '',
    motivationLabel: '',
    niveau: '',
    niveauLabel: '',
    recommandationHSK: 'HSK 1',
    recommandationTitre: '',
    recommandationDescription: '',
    recommandationLien: '',
    rappels: true,
  });

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to sessionStorage on state change
  const updateState = (partial: Partial<OnboardingState>) => {
    setState((prev) => {
      const next = { ...prev, ...partial };
      try {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        }
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Step 1: Profile selected
  const handleSelectProfile = (id: ProfilType, label: string) => {
    updateState({ profil: id, profilLabel: label });
    setTimeout(() => {
      setStep(2);
    }, 180);
  };

  // Step 2: Motivation selected
  const handleSelectMotivation = (id: MotivationType, label: string) => {
    updateState({ motivation: id, motivationLabel: label });
    setTimeout(() => {
      setStep(3);
    }, 180);
  };

  // Step 3: Level confirmed
  const handleConfirmLevel = (id: NiveauType, label: string) => {
    let hsk: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' = 'HSK 1';
    if (id === 'intermediaire_bas') hsk = 'HSK 2';
    if (id === 'intermediaire_avance') hsk = 'HSK 4';

    updateState({
      niveau: id,
      niveauLabel: label,
      recommandationHSK: hsk,
    });
    setStep(4);
  };

  // Step 4: Reminders chosen
  const handleChooseReminders = (accept: boolean) => {
    updateState({ rappels: accept });
    setStep(5);
  };

  // Step 5: Proceed from recommendation to register
  const handleProceedToRegister = () => {
    setStep(6);
  };

  // Back button handler
  const handlePrevStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4 | 5 | 6);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col justify-center min-h-[90vh] py-6 px-4 sm:px-6">
      {/* Top Header : Back Arrow + Pill Progress Bars */}
      <div className="flex items-center gap-3 mb-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={handlePrevStep}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#424242] dark:text-[#E0E0E0] hover:bg-black/5 dark:hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
            aria-label="Étape précédente"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10 h-10 shrink-0" />
        )}

        {/* Progress Pills (Steps 1 to 5) */}
        <div className="flex-1 flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => {
            const isDoneOrCurrent = step >= i;
            return (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  isDoneOrCurrent
                    ? 'bg-[#6200EE] dark:bg-[#03DAC5]'
                    : 'bg-[#ECEFF1] dark:bg-[#2C3437]'
                }`}
              />
            );
          })}
        </div>

        {/* Empty Spacer to balance the back button */}
        <div className="w-10 h-10 shrink-0" />
      </div>

      {/* Steps Render */}
      {step === 1 && (
        <StepProfile
          selectedProfil={state.profil}
          onSelect={handleSelectProfile}
        />
      )}

      {step === 2 && (
        <StepMotivation
          selectedMotivation={state.motivation}
          onSelect={handleSelectMotivation}
        />
      )}

      {step === 3 && (
        <StepLevel
          selectedNiveau={state.niveau}
          onConfirmLevel={handleConfirmLevel}
        />
      )}

      {step === 4 && (
        <StepReminders onChoose={handleChooseReminders} />
      )}

      {step === 5 && (
        <StepRecommendation
          state={state}
          onProceed={handleProceedToRegister}
        />
      )}

      {step === 6 && (
        <StepRegister state={state} />
      )}
    </div>
  );
}
