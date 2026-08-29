'use client';

import React, { useState } from 'react';
import { Portal } from '@/components/ui/Portal';
import { X, Sparkles, Plus } from 'lucide-react';
import { VocabularyWord, mockVocabThemes, HSKLevel } from '@/lib/mock/vocabulary';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWord: (word: VocabularyWord) => void;
}

export function AddWordModal({ isOpen, onClose, onAddWord }: AddWordModalProps) {
  const [hanzi, setHanzi] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [french, setFrench] = useState('');
  const [example, setExample] = useState('');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hanzi.trim() || !french.trim()) return;

    const newWord: VocabularyWord = {
      id: `custom_${Date.now()}`,
      themeId: 'custom',
      themeSlug: 'custom',
      themeName: 'Mes Mots',
      hanzi: hanzi.trim(),
      pinyin: pinyin.trim() || '—',
      french: french.trim(),
      category: 'Vocabulaire personnalisé',
      level: 'HSK 1',
      cefrLevel: 'A1',
      businessTip: note.trim() || '',
      exampleHanzi: example.trim() || '',
      examplePinyin: '',
      exampleFrench: example.trim() || '',
      spacedRepetitionIntervalDays: 1,
      isCustom: true,
      isSaved: true,
    };

    onAddWord(newWord);
    onClose();
  };

  return (
    <Portal>
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="nixtio-card w-full max-w-lg p-6 sm:p-7 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#6200EE]/10 text-[#6200EE] dark:text-[#BB86FC] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-[#212121] dark:text-[#F5F5F5]">
                  Ajouter un Mot Personnalisé
                </h3>
                <p className="text-xs text-[#757575] dark:text-[#A0A0A0]">
                  Enrichissez votre carnet de révision personnel
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-[#FAFAFA] dark:bg-[#252525] text-[#757575] hover:text-[#212121] dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#212121] dark:text-[#F5F5F5] mb-1">
                  Caractères Hanzi *
                </label>
                <input
                  type="text"
                  required
                  value={hanzi}
                  onChange={(e) => setHanzi(e.target.value)}
                  placeholder="Ex: 价格"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] text-[#212121] dark:text-[#F5F5F5] text-sm font-hanzi font-bold outline-none focus:border-[#6200EE]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#212121] dark:text-[#F5F5F5] mb-1">
                  Pinyin avec tons
                </label>
                <input
                  type="text"
                  value={pinyin}
                  onChange={(e) => setPinyin(e.target.value)}
                  placeholder="Ex: jià gé"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] text-[#212121] dark:text-[#F5F5F5] text-sm font-pinyin outline-none focus:border-[#6200EE]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#212121] dark:text-[#F5F5F5] mb-1">
                Traduction en Français *
              </label>
              <input
                type="text"
                required
                value={french}
                onChange={(e) => setFrench(e.target.value)}
                placeholder="Ex: Prix / Tarif unitaire"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] text-[#212121] dark:text-[#F5F5F5] text-sm font-medium outline-none focus:border-[#6200EE]"
              />
            </div>

            {/* Example Sentence Field (Full Line) */}
            <div>
              <label className="block text-xs font-bold text-[#212121] dark:text-[#F5F5F5] mb-1">
                Exemple(s)
              </label>
              <textarea
                rows={2}
                value={example}
                onChange={(e) => setExample(e.target.value)}
                placeholder="Ex: 这个价格非常合适。(Ce prix est très convenable.)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] text-[#212121] dark:text-[#F5F5F5] text-xs outline-none focus:border-[#6200EE] resize-none leading-relaxed"
              />
            </div>

            {/* Note Field */}
            <div>
              <label className="block text-xs font-bold text-[#212121] dark:text-[#F5F5F5] mb-1">
                Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Toujours demander le prix FOB si transport maritime"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-[#FAFAFA] dark:bg-[#181818] text-[#212121] dark:text-[#F5F5F5] text-xs outline-none focus:border-[#6200EE]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-[#FAFAFA] dark:bg-[#252525] text-xs font-bold text-[#757575] hover:text-[#212121] dark:hover:text-white"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#6200EE] hover:bg-[#3700B3] text-white text-xs font-bold shadow-md shadow-[#6200EE]/25 active:scale-95 transition-all btn-press"
              >
                <Plus className="w-4 h-4" />
                <span>Enregistrer le mot</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    </Portal>
  );
}
