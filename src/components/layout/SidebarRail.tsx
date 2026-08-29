'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Sparkles, 
  Headphones, 
  GraduationCap, 
  BookOpen, 
  UserCircle2, 
  Sun, 
  Moon 
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Accueil', href: '/tableau-de-bord', icon: Home },
  { name: 'Vocabulaire', href: '/vocabulaire', icon: Sparkles },
  { name: 'Écoute & Lecture', href: '/ecoute-lecture', icon: Headphones },
  { name: 'Formations', href: '/formation', icon: GraduationCap },
  { name: 'Livres & Programmes', href: '/livres', icon: BookOpen },
  { name: 'Mon Compte', href: '/mon-compte', icon: UserCircle2 },
];

export function SidebarRail() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="hidden lg:flex flex-col items-center justify-between w-20 py-6 px-3 glass-pill rounded-[32px] shadow-lg border border-[#E0E0E0] dark:border-[#2D2D2D] transition-all duration-300">
      {/* Top App Logo Mark */}
      <div className="flex flex-col items-center gap-6">
        <Link 
          href="/tableau-de-bord"
          className="w-12 h-12 rounded-2xl bg-[#6200EE] hover:bg-[#3700B3] flex items-center justify-center shadow-md shadow-[#6200EE]/30 transition-transform hover:scale-105 active:scale-95"
          title="ChinoisLingo"
        >
          <span className="font-hanzi font-black text-white text-xl tracking-tight">
            华
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="flex flex-col items-center gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-200 group active:scale-90 ${
                  isActive
                    ? 'bg-[#6200EE] text-white shadow-sm shadow-[#6200EE]/30'
                    : 'text-[#757575] dark:text-[#A0A0A0] hover:text-[#212121] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.08]'
                }`}
                title={item.name}
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />

                {/* Tooltip on hover */}
                <span className="absolute left-full ml-3 px-2.5 py-1 text-xs font-medium text-white bg-[#212121] dark:bg-[#333333] rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Theme Switcher */}
      <div className="flex flex-col items-center gap-2 p-1.5 rounded-full bg-[#FAFAFA] dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D]">
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={theme === 'light' ? 'Activer mode sombre' : 'Activer mode clair'}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            theme === 'light'
              ? 'bg-white text-[#FFC107] shadow-sm'
              : 'text-[#757575] hover:text-[#212121]'
          }`}
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={toggleTheme}
          type="button"
          aria-label={theme === 'dark' ? 'Activer mode clair' : 'Activer mode sombre'}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
            theme === 'dark'
              ? 'bg-[#121212] text-[#03DAC5] shadow-sm'
              : 'text-[#757575] hover:text-[#212121]'
          }`}
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
