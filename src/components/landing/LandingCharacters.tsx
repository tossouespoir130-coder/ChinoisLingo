'use client';

import React from 'react';
import { Sparkles, Video, BookOpen, MessageSquare } from 'lucide-react';

export default function LandingCharacters() {
  return (
    <section id="personnages" className="py-16 sm:py-24 bg-white relative border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6200EE]/10 border border-[#6200EE]/20 text-[#6200EE] text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Immersion par le Storytelling</span>
        </div>

        {/* Title requested by User */}
        <h2 className="text-3xl sm:text-5xl font-black text-gray-950 font-display tracking-tight leading-tight">
          Des personnages attachants pour apprendre avec plaisir.
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Suivez des héros récurrents à travers leurs aventures quotidiennes, leurs négociations d’affaires et leurs voyages en Chine.
        </p>

        {/* 3 Simple Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 text-left">
          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#6200EE] flex items-center justify-center mb-3">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Vidéos Scénarisées</h3>
            <p className="text-xs text-gray-500">Des situations réalistes en usine, au marché et dans la rue.</p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-[#00897B] flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Dialogues Vivants</h3>
            <p className="text-xs text-gray-500">Des répliques utiles et naturelles avec synthèse vocale native.</p>
          </div>

          <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">Histoires Bilingues</h3>
            <p className="text-xs text-gray-500">Progression par paliers du niveau débutant HSK 1 au niveau avancé.</p>
          </div>
        </div>

      </div>
    </section>
  );
}
