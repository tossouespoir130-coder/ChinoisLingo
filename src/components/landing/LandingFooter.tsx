'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Sparkles, Shield, Mail, Globe } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6200EE] to-[#03DAC5] p-[2px] shadow-lg">
                <div className="w-full h-full bg-[#1E1E1E] rounded-[14px] flex items-center justify-center">
                  <Image
                    src="/chinoislingo-icon.png"
                    alt="ChinoisLingo Logo"
                    width={32}
                    height={32}
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              </div>
              <span className="text-2xl font-black text-white font-display">
                Chinois<span className="text-[#BB86FC]">Lingo</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              La plateforme francophone de référence pour maîtriser le mandarin par immersion active, séries vidéos scénarisées et méthode combinatoire.
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 max-w-sm">
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-1">
                Slogan Officiel
              </span>
              <p className="text-sm font-bold text-[#03DAC5] italic">
                « Avec ChinoisLingo, le chinois devient facile. »
              </p>
            </div>
          </div>

          {/* Col 1: Plateforme */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Plateforme
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#personnages" className="hover:text-white transition-colors">
                  Personnages & Vidéos
                </a>
              </li>
              <li>
                <a href="#methode" className="hover:text-white transition-colors">
                  Méthode de la Combinaison
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition-colors">
                  Écoute & Lecture Audio
                </a>
              </li>
              <li>
                <a href="#fonctionnalites" className="hover:text-white transition-colors">
                  Vocabulaire HSK 1 à 6
                </a>
              </li>
              <li>
                <a href="#tarifs" className="hover:text-white transition-colors">
                  Plans d’Abonnement
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Modules Spécialisés */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Modules Clés
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Chansons Synchronisées
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Formations Sourcing & Yiwu
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Flashcards 3D Intelligentes
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Dictionnaire Bilingue
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Mon Carnet de Mots
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Compte & Légal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Accès & Légal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Se Connecter
                </Link>
              </li>
              <li>
                <Link href="/connexion" className="hover:text-white transition-colors">
                  Créer un Compte
                </Link>
              </li>
              <li>
                <span className="text-gray-500">Mentions Légales</span>
              </li>
              <li>
                <span className="text-gray-500">Confidentialité</span>
              </li>
              <li>
                <span className="text-gray-500">Conditions Générales</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ChinoisLingo. Tous droits réservés.</p>
          <div className="flex items-center gap-2">
            <span>Conçu avec passion par</span>
            <strong className="text-white">Espoir Chinois</strong>
            <span>• Fondateur de ChinoisLingo</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
