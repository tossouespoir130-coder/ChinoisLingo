'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Sparkles, 
  Headphones, 
  GraduationCap, 
  BookOpen 
} from 'lucide-react';

const mobileTabs = [
  { name: 'Accueil', href: '/tableau-de-bord', icon: Home },
  { name: 'Vocabulaire', href: '/vocabulaire', icon: Sparkles },
  { name: 'Écoute & Lecture', href: '/ecoute-lecture', icon: Headphones },
  { name: 'Formations', href: '/formation', icon: GraduationCap },
  { name: 'Livres', href: '/livres', icon: BookOpen },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-xl border-t border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl">
      <nav className="w-full max-w-lg mx-auto px-2 sm:px-4 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-between">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-0.5 rounded-xl transition-all duration-200 active:scale-95 btn-press ${
                isActive
                  ? 'text-[#6200EE] dark:text-[#BB86FC]'
                  : 'text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white'
              }`}
            >
              <div
                className={`p-1 sm:p-1.5 rounded-xl transition-all flex items-center justify-center ${
                  isActive
                    ? 'bg-[#6200EE]/15 dark:bg-[#6200EE]/25 text-[#6200EE] dark:text-[#BB86FC] shadow-2xs'
                    : 'text-current'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <span className={`text-[9.5px] sm:text-[10px] whitespace-nowrap tracking-tight leading-none text-center block ${
                isActive ? 'font-black' : 'font-semibold'
              }`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
