'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#6200EE] to-[#03DAC5] p-[2px] shadow-sm transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <Image
                  src="/chinoislingo-icon.png"
                  alt="ChinoisLingo"
                  width={32}
                  height={32}
                  className="w-7 h-7 object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-gray-950 font-display">
                Chinois<span className="text-[#6200EE]">Lingo</span>
              </span>
            </div>
          </Link>

          {/* Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#personnages"
              className="text-sm font-semibold text-gray-600 hover:text-[#6200EE] transition-colors"
            >
              Personnages
            </a>
            <a
              href="#methode"
              className="text-sm font-semibold text-gray-600 hover:text-[#6200EE] transition-colors"
            >
              Méthode Combinatoire
            </a>
            <a
              href="#fonctionnalites"
              className="text-sm font-semibold text-gray-600 hover:text-[#6200EE] transition-colors"
            >
              Modules HSK 1–6
            </a>
            <a
              href="#tarifs"
              className="text-sm font-semibold text-gray-600 hover:text-[#6200EE] transition-colors"
            >
              Tarifs
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/connexion"
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/connexion?mode=signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#5000CC] text-white font-bold text-sm shadow-md shadow-[#6200EE]/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Commencer Gratuitement</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-xl space-y-3">
            <a
              href="#personnages"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700"
            >
              Personnages
            </a>
            <a
              href="#methode"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700"
            >
              Méthode Combinatoire
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700"
            >
              Modules HSK 1–6
            </a>
            <a
              href="#tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700"
            >
              Tarifs
            </a>
            <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/connexion"
                className="w-full text-center py-2.5 text-sm font-bold text-gray-700"
              >
                Connexion
              </Link>
              <Link
                href="/connexion"
                className="w-full text-center py-2.5 rounded-full bg-[#6200EE] text-white font-bold text-sm"
              >
                Commencer
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
