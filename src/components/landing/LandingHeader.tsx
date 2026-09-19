'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Menu, X, ArrowRight, Play, BookOpen, Users, Compass, ShieldCheck } from 'lucide-react';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-[#121212]/85 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/10 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#6200EE] to-[#03DAC5] p-[2px] shadow-lg shadow-[#6200EE]/20 transition-transform duration-300 group-hover:scale-105">
              <div className="w-full h-full bg-white dark:bg-[#1E1E1E] rounded-[14px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/chinoislingo-icon.png"
                  alt="ChinoisLingo"
                  width={36}
                  height={36}
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // Fallback to text icon if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white font-display">
                  Chinois<span className="text-[#6200EE] dark:text-[#BB86FC]">Lingo</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#03DAC5]/15 text-[#00897B] dark:text-[#03DAC5] border border-[#03DAC5]/30">
                  Immersion
                </span>
              </div>
              <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">
                Le chinois devient facile
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-gray-100/70 dark:bg-white/5 p-1.5 rounded-full border border-gray-200/60 dark:border-white/10 backdrop-blur-md">
            <a
              href="#personnages"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[#6200EE] dark:hover:text-[#BB86FC] rounded-full hover:bg-white dark:hover:bg-white/10 transition-all"
            >
              🎭 Personnages & Vidéos
            </a>
            <a
              href="#methode"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[#6200EE] dark:hover:text-[#BB86FC] rounded-full hover:bg-white dark:hover:bg-white/10 transition-all"
            >
              ⚡ Méthode Combinatoire
            </a>
            <a
              href="#fonctionnalites"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[#6200EE] dark:hover:text-[#BB86FC] rounded-full hover:bg-white dark:hover:bg-white/10 transition-all"
            >
              🎧 Modules HSK 1–6
            </a>
            <a
              href="#tarifs"
              className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[#6200EE] dark:hover:text-[#BB86FC] rounded-full hover:bg-white dark:hover:bg-white/10 transition-all"
            >
              💎 Tarifs
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/connexion"
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-[#6200EE] dark:hover:text-[#BB86FC] transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] hover:from-[#5000CC] hover:to-[#651FFF] text-white font-bold text-sm shadow-md shadow-[#6200EE]/25 hover:shadow-lg hover:shadow-[#6200EE]/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Démarrer Gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/connexion"
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#6200EE] text-white"
            >
              Connexion
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-white/10 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2">
            <a
              href="#personnages"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <Users className="w-4 h-4 text-[#6200EE]" />
              <span>Personnages & Séries Vidéos</span>
            </a>
            <a
              href="#methode"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <Sparkles className="w-4 h-4 text-[#03DAC5]" />
              <span>Méthode de la Combinaison</span>
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>Catalogue & Modules HSK 1–6</span>
            </a>
            <a
              href="#tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Abonnements & Offres</span>
            </a>
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex flex-col gap-2">
              <Link
                href="/connexion"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] text-white font-bold text-sm shadow-md"
              >
                Démarrer Gratuitement ➔
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
