'use client';

import React from 'react';
import Image from 'next/image';
import { Headphones, BookOpen, Video, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingFeatures() {
  const PILLARS = [
    {
      icon: Headphones,
      color: 'bg-purple-100 text-purple-600',
      title: 'Écoute & Lecture Immersive',
      desc: 'Chansons karaoké synchronisées, histoires bilingues et podcasts avec audio naturel.',
      imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80',
      tag: 'HSK 1 à HSK 6',
    },
    {
      icon: Video,
      color: 'bg-teal-100 text-teal-600',
      title: 'Vidéos & Séries Scénarisées',
      desc: 'Dialogues de sourcing, foire de Canton et négociation en usines animées par Espoir Chinois.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
      tag: 'Business & Quotidien',
    },
    {
      icon: BookOpen,
      color: 'bg-amber-100 text-amber-600',
      title: 'Flashcards 3D & Dictionnaire',
      desc: 'Des milliers d’exemples vérifiés issus de situations réelles pour ancrer le vocabulaire.',
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
      tag: 'Corpus Certifié',
    },
  ];

  return (
    <section id="fonctionnalites" className="py-16 sm:py-24 bg-white relative border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6200EE] block mb-2">
            Tout ce dont vous avez besoin
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-950 font-display tracking-tight">
            Une méthode complète pour parler mandarin avec assurance.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS.map((p, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-3xl p-5 border border-gray-100 flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div>
                <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-gray-200">
                  <Image src={p.imageUrl} alt={p.title} fill className="object-cover" />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                    {p.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-xl ${p.color} flex items-center justify-center`}>
                    <p.icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-gray-900">
                    {p.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-200/60 flex items-center justify-end">
                <Link
                  href="/onboarding"
                  className="text-xs font-bold text-[#6200EE] flex items-center gap-1 hover:underline"
                >
                  <span>Découvrir</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
