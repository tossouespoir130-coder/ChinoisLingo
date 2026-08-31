'use client';

import React from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { PreferencesProvider } from '@/context/PreferencesContext';
import { TopNav } from '@/components/layout/TopNav';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { SrsReminderToast } from '@/components/layout/SrsReminderToast';
import { NewContentToast } from '@/components/layout/NewContentToast';
import { Sun, Moon } from 'lucide-react';

function ContainerThemeSwitch() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="hidden xl:flex items-center justify-end mt-2 pt-1">
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={theme === 'light' ? 'Activer mode sombre' : 'Activer mode clair'}
        className="px-3.5 py-1.5 rounded-full border border-[#E0E0E0] dark:border-[#2D2D2D] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-semibold text-[#757575] hover:text-[#212121] dark:text-[#A0A0A0] dark:hover:text-white bg-[#FAFAFA] dark:bg-[#1E1E1E] shadow-2xs"
        title={theme === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
      >
        {theme === 'light' ? (
          <>
            <div className="w-5 h-5 rounded-full bg-[#FFC107]/20 text-[#B78103] flex items-center justify-center">
              <Sun className="w-3 h-3" />
            </div>
            <span>Mode Clair</span>
          </>
        ) : (
          <>
            <div className="w-5 h-5 rounded-full bg-[#03DAC5]/20 text-[#03DAC5] flex items-center justify-center">
              <Moon className="w-3 h-3" />
            </div>
            <span>Mode Sombre</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <div className="min-h-screen w-full max-w-full overflow-x-hidden app-atmosphere flex items-center justify-center p-0 sm:p-4 lg:p-8">
          {/* Main Application Container Card */}
          <div className="w-full max-w-7xl min-h-screen sm:min-h-[92vh] bg-white/90 dark:bg-[#121212]/95 backdrop-blur-xl sm:rounded-[36px] border-0 sm:border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl p-3.5 sm:p-6 lg:p-8 flex flex-col justify-between relative overflow-x-hidden">
            
            <div className="flex-1 flex flex-col">
              {/* Top Navigation Bar */}
              <TopNav />

              {/* Dynamic Page Content with comfortable bottom padding on mobile/tablet for the bottom bar */}
              <main className="flex-1 mt-4 sm:mt-6 w-full max-w-full min-w-0 overflow-x-hidden pb-14 sm:pb-16 xl:pb-0">
                {children}
              </main>
            </div>

            {/* Discreet Daily SRS Reminder Toast */}
            <SrsReminderToast />

            {/* Pop-up Toast Nouveau Contenu Ajouté (Xiao Li, Formations, etc.) */}
            <NewContentToast />

            {/* Theme Switcher */}
            <ContainerThemeSwitch />
          </div>

          {/* Mobile & Tablet Bottom Tab Bar (Flush at the screen bottom) */}
          <MobileTabBar />
        </div>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
