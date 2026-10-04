import hsk1Json from '@/content/vocabulaire-hsk1.json';
import hsk2Json from '@/content/vocabulaire-hsk2.json';
import hsk3Json from '@/content/vocabulaire-hsk3.json';
import hsk4Json from '@/content/vocabulaire-hsk4.json';
import hsk5Json from '@/content/vocabulaire-hsk5.json';
import hsk6Json from '@/content/vocabulaire-hsk6.json';
import { normalizeSearchString } from '@/lib/mock/vocabulary';

export interface HSKDictionaryEntry {
  id: string;
  hanzi: string;
  pinyin: string;
  french: string;
  level: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6';
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  category: string;
  businessTip: string;
  exampleHanzi: string;
  examplePinyin: string;
  exampleFrench: string;
  isSaved?: boolean;
}

// Full 4,991 Standardized HSK 1 to HSK 6 Official Vocabulary List
export const hskCompleteVocabulary: HSKDictionaryEntry[] = [
  ...(hsk1Json.vocabulaire as HSKDictionaryEntry[]),
  ...(hsk2Json.vocabulaire as HSKDictionaryEntry[]),
  ...(hsk3Json.vocabulaire as HSKDictionaryEntry[]),
  ...(hsk4Json.vocabulaire as HSKDictionaryEntry[]),
  ...(hsk5Json.vocabulaire as HSKDictionaryEntry[]),
  ...(hsk6Json.vocabulaire as HSKDictionaryEntry[]),
];

export const hskLevelStats = [
  { level: 'HSK 1', cefr: 'A1', count: hsk1Json.vocabulaire.length, color: '#4CAF50' },
  { level: 'HSK 2', cefr: 'A2', count: hsk2Json.vocabulaire.length, color: '#8BC34A' },
  { level: 'HSK 3', cefr: 'B1', count: hsk3Json.vocabulaire.length, color: '#FF9800' },
  { level: 'HSK 4', cefr: 'B2', count: hsk4Json.vocabulaire.length, color: '#FF5722' },
  { level: 'HSK 6', cefr: 'C2', count: hsk6Json.vocabulaire.length, color: '#6200EE' },
];

export function searchCompleteDictionary(query: string, levelFilter: string = 'all'): HSKDictionaryEntry[] {
  if (!query.trim() && levelFilter === 'all') {
    return hskCompleteVocabulary.slice(0, 100);
  }

  const rawQ = query.trim().toLowerCase();
  const normQ = normalizeSearchString(query);
  const normQNoSpace = normQ.replace(/\s+/g, '');

  return hskCompleteVocabulary.filter((item) => {
    if (levelFilter !== 'all' && item.level !== levelFilter) {
      return false;
    }
    if (!rawQ) return true;

    const normHanzi = item.hanzi.toLowerCase();
    const normPinyin = normalizeSearchString(item.pinyin);
    const normPinyinNoSpace = normPinyin.replace(/\s+/g, '');
    const normFrench = normalizeSearchString(item.french);
    const normCategory = normalizeSearchString(item.category || '');
    const normTip = normalizeSearchString(item.businessTip || '');

    return (
      normHanzi.includes(rawQ) ||
      normPinyin.includes(normQ) ||
      normPinyinNoSpace.includes(normQNoSpace) ||
      normFrench.includes(normQ) ||
      normCategory.includes(normQ) ||
      normTip.includes(normQ)
    );
  });
}
