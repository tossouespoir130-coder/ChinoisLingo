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
          ? 'bg-[#0E0E12]/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#6200EE] to-[#03DAC5] p-[2px] shadow-sm transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#181820] rounded-[10px] flex items-center justify-center overflow-hidden">
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
              <span className="text-lg sm:text-xl font-black tracking-tight text-white font-display">
                Chinois<span className="text-[#BB86FC]">Lingo</span>
              </span>
            </div>
          </Link>

          {/* Clean Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#personnages"
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Personnages
            </a>
            <a
              href="#methode"
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Méthode Combinatoire
            </a>
            <a
              href="#fonctionnalites"
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Modules HSK 1–6
            </a>
            <a
              href="#tarifs"
              className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              Tarifs
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/connexion"
              className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/connexion"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6200EE] to-[#7C4DFF] hover:from-[#5000CC] hover:to-[#651FFF] text-white font-bold text-sm shadow-md shadow-[#6200EE]/30 hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Commencer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-300 hover:bg-white/5"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-[#181820] border border-white/10 shadow-2xl space-y-3">
            <a
              href="#personnages"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-200"
            >
              Personnages
            </a>
            <a
              href="#methode"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-200"
            >
              Méthode Combinatoire
            </a>
            <a
              href="#fonctionnalites"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-200"
            >
              Modules HSK 1–6
            </a>
            <a
              href="#tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-200"
            >
              Tarifs
            </a>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/connexion"
                className="w-full text-center py-2.5 text-sm font-bold text-gray-200"
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
