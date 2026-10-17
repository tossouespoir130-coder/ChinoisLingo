/**
 * Moteur unifié de la Méthode de la Combinaison
 * Utilisé conjointement par la rubrique Vocabulaire et la sous-catégorie « Exercices parlés ».
 */

export interface CombinatoryOption {
  id: string;
  hanzi: string;
  pinyin: string;
  french: string;
  /**
   * Nom français pour les noms propres (pour garantir 0 caractère chinois dans la phrase française)
   */
  frenchName?: string;
  /**
   * Formes verbales conjuguées ou formes accordées selon le sujet
   */
  verbConjugations?: Record<string, string>;
  /**
   * Forme élidée spécifique (ex: "qu'il", "qu'elle", "d'acheter")
   */
  elision?: string;
  /**
   * Accord interrogatif selon le genre du nom (ex: "quel", "quelle")
   */
  interrogativeAgreement?: 'quel' | 'quelle' | 'quels' | 'quelles';
}

export interface CombinatorySlot {
  id: string;
  slotNumber: number;
  label: string;
  colorTheme: 'purple' | 'emerald' | 'amber' | 'blue' | 'rose' | 'indigo' | 'teal';
  isLocked?: boolean;
  defaultOptionId?: string;
  options: CombinatoryOption[];
}

export interface DynamicCombinatoryPattern {
  id: string;
  pivotWord: string;
  pivotPinyin: string;
  pivotMeaning: string;
  grammaticalCategory: string;
  structureDescription: string;
  slots: CombinatorySlot[];
  isOfficialHsk: boolean;
}

export interface BuiltSentenceResult {
  hanzi: string;
  pinyin: string;
  french: string;
  selectedOptions: CombinatoryOption[];
}

/**
 * Nettoyage et assainissement d'une phrase française :
 * Supprime les espaces superflus et garantit une ponctuation soignée.
 */
export function sanitizeFrenchTranslation(rawFrench: string): string {
  if (!rawFrench) return '';

  return rawFrench
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,])/g, '$1')
    .replace(/\s+([:;!?])/g, ' $1')
    .replace(/«\s+/g, '« ')
    .replace(/\s+»/g, ' »')
    .trim();
}

/**
 * Assemble une phrase dynamique à partir des slots et des sélections.
 * Préserve 100% de la rétrocompatibilité bit-à-bit avec la rubrique Vocabulaire.
 */
export function buildDynamicSentence(
  slots: CombinatorySlot[],
  selectedOptionIds: Record<string, string>,
  options?: {
    customFrenchAssembler?: (selected: CombinatoryOption[]) => string;
    punctuation?: {
      hanzi?: string;
      pinyin?: string;
    };
  }
): BuiltSentenceResult {
  const selectedOptions = slots.map((slot) => {
    const optId = selectedOptionIds[slot.id] || slot.defaultOptionId || slot.options[0]?.id;
    return slot.options.find((o) => o.id === optId) || slot.options[0];
  });

  // 1. Assemblage Hanzi
  let hanzi = selectedOptions.map((o) => o?.hanzi || '').join('');
  if (options?.punctuation?.hanzi && !hanzi.endsWith(options.punctuation.hanzi)) {
    hanzi += options.punctuation.hanzi;
  }

  // 2. Assemblage Pinyin
  const pinyinParts = selectedOptions
    .map((o, idx) => {
      if (!o) return '';
      // Si l'option est un nom latin dans le premier slot, omission dans la ligne pinyin
      if (idx === 0 && o.hanzi === o.french) return '';
      return o.pinyin;
    })
    .filter(Boolean);
  let pinyin = pinyinParts.join(' ');
  if (pinyin.length > 0) {
    pinyin = pinyin.charAt(0).toUpperCase() + pinyin.slice(1);
    if (options?.punctuation?.pinyin && !pinyin.endsWith(options.punctuation.pinyin.trim())) {
      pinyin += options.punctuation.pinyin;
    }
  }

  // 3. Assemblage Français
  if (options?.customFrenchAssembler) {
    const rawFrench = options.customFrenchAssembler(selectedOptions);
    const french = sanitizeFrenchTranslation(rawFrench);
    return { hanzi, pinyin, french, selectedOptions };
  }

  let french = '';
  if (selectedOptions.length === 3) {
    const sub = selectedOptions[0];
    const verb = selectedOptions[1];
    const comp = selectedOptions[2];

    let frenchVerb = verb.french;
    if (verb.verbConjugations) {
      if (verb.verbConjugations[sub.id]) {
        frenchVerb = verb.verbConjugations[sub.id];
      } else if (verb.verbConjugations['sub_ta']) {
        frenchVerb = verb.verbConjugations['sub_ta'];
      }
    }

    let frenchSub = sub.french;
    if (frenchSub === 'Je' && /^[aeiouéèêâîïôûh]/i.test(frenchVerb)) {
      frenchSub = 'J’';
    } else {
      frenchSub = frenchSub + ' ';
    }
    french = `${frenchSub}${frenchVerb} ${comp.french}.`;
  } else if (selectedOptions.length === 2) {
    const slot1 = selectedOptions[0];
    const slot2 = selectedOptions[1];

    let frenchAction = slot2.french;
    if (slot2.verbConjugations) {
      if (slot2.verbConjugations[slot1.id]) {
        frenchAction = slot2.verbConjugations[slot1.id];
      } else if (slot2.verbConjugations['sub_ta']) {
        frenchAction = slot2.verbConjugations['sub_ta'];
      }
    }

    let frenchSubject = slot1.french;
    if (frenchSubject === 'Je' && /^[aeiouéèêâîïôûh]/i.test(frenchAction)) {
      frenchSubject = 'J’';
    } else {
      frenchSubject = frenchSubject + ' ';
    }
    french = `${frenchSubject}${frenchAction}.`;
  } else if (selectedOptions.length === 4) {
    const p1 = selectedOptions[0];
    const p2 = selectedOptions[1];
    const p3 = selectedOptions[2];
    const p4 = selectedOptions[3];
    french = `${p1.french} ${p2.french} ${p3.french} ${p4.french}.`;
  } else {
    french = selectedOptions.map((o) => o?.french || '').join(' ') + '.';
  }

  const sanitizedFrench = sanitizeFrenchTranslation(french);

  return {
    hanzi,
    pinyin,
    french: sanitizedFrench,
    selectedOptions,
  };
}

/**
 * Calcule le nombre total de combinaisons valides possibles.
 */
export function calculateCombinationsCount(slots: CombinatorySlot[]): number {
  if (!slots || slots.length === 0) return 0;
  return slots.reduce((acc, slot) => {
    const validCount = slot.options.length;
    return acc * (validCount > 0 ? validCount : 1);
  }, 1);
}

/**
 * Mode « Une seule case mobile » :
 * Force toutes les cases à leur valeur par défaut (de base) SAUF la case active spécifiée.
 */
export function buildSingleMobileSlotSelections(
  slots: CombinatorySlot[],
  activeSlotId: string,
  chosenOptionId: string
): Record<string, string> {
  const selections: Record<string, string> = {};
  for (const slot of slots) {
    if (slot.id === activeSlotId) {
      selections[slot.id] = chosenOptionId;
    } else {
      selections[slot.id] = slot.defaultOptionId || slot.options[0]?.id;
    }
  }
  return selections;
}
