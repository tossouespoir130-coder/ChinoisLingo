'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock, CreditCard, Smartphone } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-[#09090C] border-t border-white/5 pt-16 pb-12 text-gray-400 text-xs sm:text-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b border-white/5">
          
          {/* Col 1 : Brand & Mission */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6200EE] to-[#03DAC5] p-[1.5px]">
                <div className="w-full h-full bg-[#16161D] rounded-[9px] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/chinoislingo-icon.png"
                    alt="ChinoisLingo"
                    width={28}
                    height={28}
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
              <span className="text-lg font-black tracking-tight text-white font-display">
                Chinois<span className="text-[#BB86FC]">Lingo</span>
              </span>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              La plateforme d’immersion active en mandarin. Avec ChinoisLingo, le chinois devient facile grâce aux histoires, aux chansons et à la méthode combinatoire.
            </p>

            <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#03DAC5]" />
                Paiement 100% Sécurisé
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-[#03DAC5]" />
                Données Protégées
              </span>
            </div>
          </div>

          {/* Col 2 : Modules Plateforme */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Plateforme
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Histoires & Lectures
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Chansons Karaoké
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Méthode Combinatoire
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Formations Vidéos
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Dictionnaire HSK 1–6
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 : Apprentissage */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Apprentissage
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Niveaux HSK 1 à HSK 6
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Chinois des Affaires & Sourcing
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Flashcards 3D & SRS
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Synthèse Vocale Native
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 : Légal & Conformité */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Légal & Sécurité
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Conditions Générales (CGV)
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Politique de Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Gestion des Cookies
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ChinoisLingo. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-gray-400" />
              Carte Bancaire (Stripe)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-gray-400" />
              Mobile Money (Moneroo)
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
