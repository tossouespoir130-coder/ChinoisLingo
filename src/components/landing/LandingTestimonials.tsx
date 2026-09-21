'use client';

import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Marc D.',
    role: 'Entrepreneur en Import-Export (Lyon)',
    avatar: 'M',
    avatarBg: 'from-blue-500 to-indigo-600',
    stars: 5,
    quote:
      'Grâce aux séries de dialogues avec Brice et Katia et aux masterclasses d’Espoir Chinois, j’ai pu négocier mes premiers conteneurs directement à Yiwu sans interprète. La Méthode de la Combinaison est tout simplement révolutionnaire !',
    tag: 'Importateur'
  },
  {
    name: 'Sophie L.',
    role: 'Étudiante en Langues Orientales (Paris)',
    avatar: 'S',
    avatarBg: 'from-pink-500 to-rose-600',
    stars: 5,
    quote:
      'J’avais beaucoup de mal avec les tons et la vitesse d’élocution. Le lecteur immersif avec chansons synchronisées et les dialogues avec Lily m’ont débloquée en moins de 3 semaines. J’ai validé mon HSK 3 avec brio !',
    tag: 'Réussite HSK 3'
  },
  {
    name: 'Amadou K.',
    role: 'Commerçant International (Abidjan)',
    avatar: 'A',
    avatarBg: 'from-emerald-500 to-teal-600',
    stars: 5,
    quote:
      'ChinoisLingo est la seule plateforme qui comprend les vrais besoins du terrain. On apprend du chinois utile, parlé tous les jours dans les usines et les marchés. Les pistes audio sont d’une clarté absolue.',
    tag: 'Sourcing Chine'
  }
];

export default function LandingTestimonials() {
  return (
    <section className="py-20 sm:py-28 bg-gray-50/50 dark:bg-[#151515] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1 text-amber-500 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-display tracking-tight leading-tight">
            Ils ont transformé leur apprentissage <br />
            <span className="text-[#6200EE] dark:text-[#BB86FC]">avec ChinoisLingo.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300">
            Découvrez comment nos apprenants, entrepreneurs et étudiants parlent aujourd’hui mandarin avec assurance.
          </p>
        </div>

        {/* Testimonials 3 columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-8 border border-gray-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC]">
                    {t.tag}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-[#6200EE]/20 dark:text-[#BB86FC]/20 mb-3" />
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6">
                  « {t.quote} »
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${t.avatarBg} text-white font-black flex items-center justify-center text-base shadow-md`}>
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <span>{t.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00BFA5]" />
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
