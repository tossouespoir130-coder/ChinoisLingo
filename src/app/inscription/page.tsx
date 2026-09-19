'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingFlow } from '@/components/auth/OnboardingFlow';

export default function InscriptionPage() {
  const router = useRouter();

  return (
    <div className="min-h-[100dvh] w-full relative flex items-center justify-center p-2.5 sm:p-6 lg:p-10 overflow-hidden bg-[#ECEFF8] dark:bg-[#111218]">
      {/* Soft Pastel Glowing Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#6200EE]/09 dark:bg-[#6200EE]/18 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] sm:w-[750px] h-[450px] sm:h-[750px] rounded-full bg-[#03DAC5]/11 dark:bg-[#03DAC5]/18 blur-[150px]" />
        <div className="absolute top-[30%] right-[15%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] rounded-full bg-[#E91E63]/08 dark:bg-[#E91E63]/14 blur-[130px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-[#FFC107]/08 dark:bg-[#FFC107]/12 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl bg-white dark:bg-[#1E1E28] rounded-3xl sm:rounded-[36px] border border-[#E0E0E0] dark:border-[#2D2D3D] shadow-2xl shadow-[#6200EE]/08 dark:shadow-black/50 overflow-hidden animate-fadeIn my-auto">
        <OnboardingFlow onSwitchToSignIn={() => router.push('/connexion')} />
      </div>
    </div>
  );
}
