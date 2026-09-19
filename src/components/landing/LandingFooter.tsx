'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingFooter() {
  return (
    <footer className="py-8 bg-gray-50 dark:bg-[#0E0E0E] border-t border-gray-100 dark:border-white/5 text-center text-xs text-gray-500 dark:text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 dark:text-white">ChinoisLingo</span>
          <span>•</span>
          <span>Le chinois devient facile</span>
        </div>
        <p>© {new Date().getFullYear()} ChinoisLingo. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
