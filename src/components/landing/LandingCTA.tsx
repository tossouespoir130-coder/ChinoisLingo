'use client';

import React from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export default function LandingCTA() {
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#6200EE', '#03DAC5', '#FFD54F', '#E91E63']
    });
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow Box */}
        <div className="relative rounded-3xl sm:rounded-[36px] bg-gradient-to-tr from-[#6200EE] via-[#7C4DFF] to-[#03DAC5] p-1 shadow-2xl overflow-hidden">
          
          {/* Inner Card */}
          <div className="bg-[#121212] rounded-[32px] sm:rounded-[34px] px-6 py-16 sm:px-16 sm:py-24 text-center relative overflow-hidden">
            
            {/* Background Light Orbs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#03DAC5]/20 rounded-full blur-3xl -z-0 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#6200EE]/30 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                <span>Prêt à vivre l’aventure du mandarin ?</span>
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-tight mb-6">
                Rejoignez ChinoisLingo et <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-white to-[#03DAC5]">
                  parlez chinois avec fierté.
                </span>
              </h2>

              <p className="text-base sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
                Créez votre compte gratuit en 30 secondes. Accédez instantanément aux premières séries d’immersion, au simulateur combinatoire et au vocabulaire HSK 1.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link
                  href="/connexion"
                  onClick={triggerConfetti}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4.5 rounded-2xl bg-gradient-to-r from-white to-gray-100 text-gray-950 hover:bg-white font-black text-base shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Créer mon Compte Gratuit</span>
                  <ArrowRight className="w-5 h-5 text-[#6200EE]" />
                </Link>

                <Link
                  href="/connexion"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base backdrop-blur-md transition-all"
                >
                  <span>Se Connecter</span>
                </Link>
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#03DAC5]" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#03DAC5]" />
                  <span>Aucune carte bancaire requise</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#03DAC5]" />
                  <span>100% Sécurisé</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
