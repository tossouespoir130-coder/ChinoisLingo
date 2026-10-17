import { SpokenExerciseModel } from './types';
import { CombinatoryOption } from '@/lib/combination/combinationEngine';

// Case 1 : Fixe - 请问， (qǐngwèn,) - Politesse
export const FIXED_QINGWEN: CombinatoryOption = {
  id: 'fix_qingwen',
  hanzi: '请问，',
  pinyin: 'Qǐngwèn,',
  french: 'Excuse-moi,',
};

// Case 2 : Démonstratifs / Déterminants (6 options)
export const DEMONSTRATIVE_OPTIONS: CombinatoryOption[] = [
  { id: 'demo_zhege', hanzi: '这个', pinyin: 'zhèige', french: 'ce / cette' },
  { id: 'demo_nage', hanzi: '那个', pinyin: 'nàige', french: 'ce...-là' },
  { id: 'demo_zhexie', hanzi: '这些', pinyin: 'zhèxiē', french: 'ces...-ci' },
  { id: 'demo_naxie', hanzi: '那些', pinyin: 'nàxiē', french: 'ces...-là' },
  { id: 'demo_yige', hanzi: '一个', pinyin: 'yí gè', french: 'un / une' },
  { id: 'demo_liangge', hanzi: '两个', pinyin: 'liǎng gè', french: 'deux' },
];

// Case 3 : Noms HSK 1 (12 options)
export const ALL_NOUNS: CombinatoryOption[] = [
  { id: 'noun_beizi', hanzi: '杯子', pinyin: 'bēizi', french: 'verre / tasse' },
  { id: 'noun_yifu', hanzi: '衣服', pinyin: 'yīfu', french: 'vêtement' },
  { id: 'noun_diannao', hanzi: '电脑', pinyin: 'diànnǎo', french: 'ordinateur' },
  { id: 'noun_pingguo', hanzi: '苹果', pinyin: 'píngguǒ', french: 'pomme' },
  { id: 'noun_shu', hanzi: '书', pinyin: 'shū', french: 'livre' },
  { id: 'noun_cha', hanzi: '茶', pinyin: 'chá', french: 'thé' },
  { id: 'noun_cai', hanzi: '菜', pinyin: 'cài', french: 'plat' },
  { id: 'noun_zhuozi', hanzi: '桌子', pinyin: 'zhuōzi', french: 'table' },
  { id: 'noun_yizi', hanzi: '椅子', pinyin: 'yǐzi', french: 'chaise' },
  { id: 'noun_shui', hanzi: '水', pinyin: 'shuǐ', french: 'bouteille d’eau' },
  { id: 'noun_shuiguo', hanzi: '水果', pinyin: 'shuǐguǒ', french: 'fruit' },
  { id: 'noun_mifan', hanzi: '米饭', pinyin: 'mǐfàn', french: 'bol de riz' },
];

// Case 4 : Fixe - 多少钱 (duōshao qián) - Prix
export const FIXED_DUOSHAOQIAN: CombinatoryOption = {
  id: 'fix_duoshaoqian',
  hanzi: '多少钱',
  pinyin: 'duōshao qián',
  french: 'combien ça coûte',
};

/**
 * Matrice complète des 72 traductions françaises artisanales (6 × 12 = 72) :
 * - Gestion parfaite de l'accord du verbe (« coûte » au singulier, « coûtent » au pluriel).
 * - Gestion des élisions (« cet ordinateur », « ces bouteilles d’eau »).
 * - ZÉRO caractère chinois dans la sortie.
 */
const HANDCRAFTED_FRENCH_MAP: Record<string, string> = {
  // 1. 这个 (ce / cet / cette) -> coûte
  'demo_zhege_noun_beizi': 'Excuse-moi, combien coûte ce verre ?',
  'demo_zhege_noun_yifu': 'Excuse-moi, combien coûte ce vêtement ?',
  'demo_zhege_noun_diannao': 'Excuse-moi, combien coûte cet ordinateur ?',
  'demo_zhege_noun_pingguo': 'Excuse-moi, combien coûte cette pomme ?',
  'demo_zhege_noun_shu': 'Excuse-moi, combien coûte ce livre ?',
  'demo_zhege_noun_cha': 'Excuse-moi, combien coûte ce thé ?',
  'demo_zhege_noun_cai': 'Excuse-moi, combien coûte ce plat ?',
  'demo_zhege_noun_zhuozi': 'Excuse-moi, combien coûte cette table ?',
  'demo_zhege_noun_yizi': 'Excuse-moi, combien coûte cette chaise ?',
  'demo_zhege_noun_shui': 'Excuse-moi, combien coûte cette eau ?',
  'demo_zhege_noun_shuiguo': 'Excuse-moi, combien coûte ce fruit ?',
  'demo_zhege_noun_mifan': 'Excuse-moi, combien coûte ce riz ?',

  // 2. 那个 (ce...-là / cet...-là / cette...-là) -> coûte
  'demo_nage_noun_beizi': 'Excuse-moi, combien coûte ce verre-là ?',
  'demo_nage_noun_yifu': 'Excuse-moi, combien coûte ce vêtement-là ?',
  'demo_nage_noun_diannao': 'Excuse-moi, combien coûte cet ordinateur-là ?',
  'demo_nage_noun_pingguo': 'Excuse-moi, combien coûte cette pomme-là ?',
  'demo_nage_noun_shu': 'Excuse-moi, combien coûte ce livre-là ?',
  'demo_nage_noun_cha': 'Excuse-moi, combien coûte ce thé-là ?',
  'demo_nage_noun_cai': 'Excuse-moi, combien coûte ce plat-là ?',
  'demo_nage_noun_zhuozi': 'Excuse-moi, combien coûte cette table-là ?',
  'demo_nage_noun_yizi': 'Excuse-moi, combien coûte cette chaise-là ?',
  'demo_nage_noun_shui': 'Excuse-moi, combien coûte cette eau-là ?',
  'demo_nage_noun_shuiguo': 'Excuse-moi, combien coûte ce fruit-là ?',
  'demo_nage_noun_mifan': 'Excuse-moi, combien coûte ce riz-là ?',

  // 3. 这些 (ces...-ci) -> coûtent
  'demo_zhexie_noun_beizi': 'Excuse-moi, combien coûtent ces verres ?',
  'demo_zhexie_noun_yifu': 'Excuse-moi, combien coûtent ces vêtements ?',
  'demo_zhexie_noun_diannao': 'Excuse-moi, combien coûtent ces ordinateurs ?',
  'demo_zhexie_noun_pingguo': 'Excuse-moi, combien coûtent ces pommes ?',
  'demo_zhexie_noun_shu': 'Excuse-moi, combien coûtent ces livres ?',
  'demo_zhexie_noun_cha': 'Excuse-moi, combien coûtent ces thés ?',
  'demo_zhexie_noun_cai': 'Excuse-moi, combien coûtent ces plats ?',
  'demo_zhexie_noun_zhuozi': 'Excuse-moi, combien coûtent ces tables ?',
  'demo_zhexie_noun_yizi': 'Excuse-moi, combien coûtent ces chaises ?',
  'demo_zhexie_noun_shui': 'Excuse-moi, combien coûtent ces bouteilles d’eau ?',
  'demo_zhexie_noun_shuiguo': 'Excuse-moi, combien coûtent ces fruits ?',
  'demo_zhexie_noun_mifan': 'Excuse-moi, combien coûtent ces portions de riz ?',

  // 4. 那些 (ces...-là) -> coûtent
  'demo_naxie_noun_beizi': 'Excuse-moi, combien coûtent ces verres-là ?',
  'demo_naxie_noun_yifu': 'Excuse-moi, combien coûtent ces vêtements-là ?',
  'demo_naxie_noun_diannao': 'Excuse-moi, combien coûtent ces ordinateurs-là ?',
  'demo_naxie_noun_pingguo': 'Excuse-moi, combien coûtent ces pommes-là ?',
  'demo_naxie_noun_shu': 'Excuse-moi, combien coûtent ces livres-là ?',
  'demo_naxie_noun_cha': 'Excuse-moi, combien coûtent ces thés-là ?',
  'demo_naxie_noun_cai': 'Excuse-moi, combien coûtent ces plats-là ?',
  'demo_naxie_noun_zhuozi': 'Excuse-moi, combien coûtent ces tables-là ?',
  'demo_naxie_noun_yizi': 'Excuse-moi, combien coûtent ces chaises-là ?',
  'demo_naxie_noun_shui': 'Excuse-moi, combien coûtent ces bouteilles d’eau-là ?',
  'demo_naxie_noun_shuiguo': 'Excuse-moi, combien coûtent ces fruits-là ?',
  'demo_naxie_noun_mifan': 'Excuse-moi, combien coûtent ces portions de riz-là ?',

  // 5. 一个 (un / une) -> coûte
  'demo_yige_noun_beizi': 'Excuse-moi, combien coûte un verre ?',
  'demo_yige_noun_yifu': 'Excuse-moi, combien coûte un vêtement ?',
  'demo_yige_noun_diannao': 'Excuse-moi, combien coûte un ordinateur ?',
  'demo_yige_noun_pingguo': 'Excuse-moi, combien coûte une pomme ?',
  'demo_yige_noun_shu': 'Excuse-moi, combien coûte un livre ?',
  'demo_yige_noun_cha': 'Excuse-moi, combien coûte un thé ?',
  'demo_yige_noun_cai': 'Excuse-moi, combien coûte un plat ?',
  'demo_yige_noun_zhuozi': 'Excuse-moi, combien coûte une table ?',
  'demo_yige_noun_yizi': 'Excuse-moi, combien coûte une chaise ?',
  'demo_yige_noun_shui': 'Excuse-moi, combien coûte une bouteille d’eau ?',
  'demo_yige_noun_shuiguo': 'Excuse-moi, combien coûte un fruit ?',
  'demo_yige_noun_mifan': 'Excuse-moi, combien coûte un bol de riz ?',

  // 6. 两个 (deux) -> coûtent
  'demo_liangge_noun_beizi': 'Excuse-moi, combien coûtent deux verres ?',
  'demo_liangge_noun_yifu': 'Excuse-moi, combien coûtent deux vêtements ?',
  'demo_liangge_noun_diannao': 'Excuse-moi, combien coûtent deux ordinateurs ?',
  'demo_liangge_noun_pingguo': 'Excuse-moi, combien coûtent deux pommes ?',
  'demo_liangge_noun_shu': 'Excuse-moi, combien coûtent deux livres ?',
  'demo_liangge_noun_cha': 'Excuse-moi, combien coûtent deux thés ?',
  'demo_liangge_noun_cai': 'Excuse-moi, combien coûtent deux plats ?',
  'demo_liangge_noun_zhuozi': 'Excuse-moi, combien coûtent deux tables ?',
  'demo_liangge_noun_yizi': 'Excuse-moi, combien coûtent deux chaises ?',
  'demo_liangge_noun_shui': 'Excuse-moi, combien coûtent deux bouteilles d’eau ?',
  'demo_liangge_noun_shuiguo': 'Excuse-moi, combien coûtent deux fruits ?',
  'demo_liangge_noun_mifan': 'Excuse-moi, combien coûtent deux bols de riz ?',
};

export function buildFrenchSentenceModel2(selected: CombinatoryOption[]): string {
  const demo = selected[1] || DEMONSTRATIVE_OPTIONS[0];
  const noun = selected[2] || ALL_NOUNS[0];
  const key = `${demo.id}_${noun.id}`;
  if (HANDCRAFTED_FRENCH_MAP[key]) {
    return HANDCRAFTED_FRENCH_MAP[key];
  }
  return `Excuse-moi, combien coûte ${demo.french} ${noun.french} ?`;
}

export const HSK1_MODEL_2: SpokenExerciseModel = {
  id: 'spoken_hsk1_ep2',
  level: 'HSK 1',
  episodeNumber: 2,
  titleFr: 'Combien coûte ce verre ?',
  imageUrl: '/images/exercices-parles/propositions/hsk1_ep2_prop_a.jpg',
  isGratuit: true,
  isTest: true,
  datePublication: '2026-10-15',
  typicalSentence: {
    hanzi: '请问，这个杯子多少钱？',
    pinyin: 'Qǐngwèn, zhèige bēizi duōshao qián ?',
    french: 'Excuse-moi, combien coûte ce verre ?',
    audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/hsk1_02_typical.mp3',
    tokens: [
      {
        hanzi: '请问，',
        pinyin: 'qǐngwèn,',
        french: 'excuse-moi',
        colorTheme: 'purple',
        audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/hsk1_02_tok_qingwen.mp3',
      },
      {
        hanzi: '这个',
        pinyin: 'zhèige',
        french: 'ce / cette',
        colorTheme: 'emerald',
        audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/hsk1_02_tok_zhege.mp3',
      },
      {
        hanzi: '杯子',
        pinyin: 'bēizi',
        french: 'verre / tasse',
        colorTheme: 'amber',
        audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/hsk1_02_tok_beizi.mp3',
      },
      {
        hanzi: '多少钱',
        pinyin: 'duōshao qián',
        french: 'combien ça coûte',
        colorTheme: 'blue',
        audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/hsk1_02_tok_duoshaoqian.mp3',
      },
    ],
  },
  slots: [
    {
      id: 'slot_courtesy',
      slotNumber: 1,
      label: '1. Politesse',
      colorTheme: 'purple',
      isLocked: true,
      defaultOptionId: 'fix_qingwen',
      options: [FIXED_QINGWEN],
    },
    {
      id: 'slot_demo',
      slotNumber: 2,
      label: '2. Démonstratif',
      colorTheme: 'emerald',
      defaultOptionId: 'demo_zhege',
      options: DEMONSTRATIVE_OPTIONS,
    },
    {
      id: 'slot_noun',
      slotNumber: 3,
      label: '3. Nom',
      colorTheme: 'amber',
      defaultOptionId: 'noun_beizi',
      options: ALL_NOUNS,
    },
    {
      id: 'slot_price',
      slotNumber: 4,
      label: '4. Interrogatif de prix',
      colorTheme: 'blue',
      isLocked: true,
      defaultOptionId: 'fix_duoshaoqian',
      options: [FIXED_DUOSHAOQIAN],
    },
  ],
  frenchSentenceBuilder: buildFrenchSentenceModel2,
  punctuation: {
    hanzi: '？',
    pinyin: ' ?',
  },
  structureInsight:
    '« <strong>多少钱 (duōshao qián)</strong> est la formule magique universelle pour demander un prix : 多少 (duōshao, « combien ») + 钱 (qián, « argent »). »',
  pedagogicalMethod: {
    title: 'La Méthode de la Combinaison (Acheter et demander un prix)',
    corePrinciple:
      'Pour faire des achats ou demander un prix en mandarin, la formule est toujours identique. On garde les deux piliers fixes : la formule de politesse en ouverture (请问 (qǐngwèn)) et la demande de prix à la fin (多少钱 (duōshao qián)). Entre les deux, on fait varier la pièce démonstrative (ceci, cela, ces...) et le nom convoité (verre, vêtement, livre, nourriture...). On ne change qu’une seule pièce à la fois.',
    comparisonFr:
      'Pour un francophone : en français, demander un prix implique souvent d’adapter le verbe (« combien coûte ceci ? », « combien coûtent ces articles ? ») ou d’utiliser des périphrases (« c’est à quel prix ? »). En chinois, la structure 请问 (qǐngwèn) + [démonstratif] + [nom] + 多少钱 (duōshao qián) ne change jamais d’ordre ni de conjugaison, rendant tes transactions fluides et instantanées.',
  },
  subSteps: [
    {
      id: 'step_1_demonstratives',
      subStepNumber: 1,
      title: '1. Démonstratifs',
      otherOptionsTitle: 'Autres possibilités avec les démonstratifs',
      mobileSlotId: 'slot_demo',
      allowedOptionIds: DEMONSTRATIVE_OPTIONS.map((d) => d.id),
      pedagogicalText:
        'Garde 请问 (qǐngwèn), 杯子 (bēizi) et 多少钱 (duōshao qián), et remplace seulement 这个 (zhège). En chinois, pour désigner un objet plus éloigné, on utilise 那个 (nàge), et pour parler de plusieurs objets au pluriel, on remplace 个 (gè) par 些 (xiē).',
      didYouKnow: {
        title: 'Le sais-tu ?',
        content:
          'À l’oral, 这个 se prononce souvent « zhèige » et 那个 « nàige ». Les deux prononciations sont parfaitement correctes. Le mot 些 (xiē) marque la pluralité : 这些 (zhèxiē, « ces...-ci »), 那些 (nàxiē, « ces...-là »).',
      },
      tip:
        'Pour demander le prix à l’unité, dis simplement 一个 (yí gè, « un ») devant le nom.',
      featuredExamples: [
        {
          id: 'ex_2_1_1',
          hanzi: '请问，那个杯子多少钱？',
          pinyin: 'Qǐngwèn, nàige bēizi duōshao qián ?',
          french: 'Excuse-moi, combien coûte ce verre-là ?',
          slotSelections: { slot_demo: 'demo_nage', slot_noun: 'noun_beizi' },
          audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/all/demo_nage_noun_beizi.mp3',
        },
        {
          id: 'ex_2_1_2',
          hanzi: '请问，这些杯子多少钱？',
          pinyin: 'Qǐngwèn, zhèxiē bēizi duōshao qián ?',
          french: 'Excuse-moi, combien coûtent ces verres ?',
          slotSelections: { slot_demo: 'demo_zhexie', slot_noun: 'noun_beizi' },
          audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/all/demo_zhexie_noun_beizi.mp3',
        },
        {
          id: 'ex_2_1_3',
          hanzi: '请问，那些杯子多少钱？',
          pinyin: 'Qǐngwèn, nàxiē bēizi duōshao qián ?',
          french: 'Excuse-moi, combien coûtent ces verres-là ?',
          slotSelections: { slot_demo: 'demo_naxie', slot_noun: 'noun_beizi' },
          audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/all/demo_naxie_noun_beizi.mp3',
        },
      ],
      otherOptions: DEMONSTRATIVE_OPTIONS.filter(
        (d) => !['demo_nage', 'demo_zhexie', 'demo_naxie'].includes(d.id)
      ),
    },
    {
      id: 'step_2_nouns',
      subStepNumber: 2,
      title: '2. Noms',
      otherOptionsTitle: 'Autres possibilités avec les noms',
      mobileSlotId: 'slot_noun',
      allowedOptionIds: ALL_NOUNS.map((n) => n.id),
      pedagogicalText:
        'Le démonstratif reste 这个 (zhège) et tu remplaces seulement le nom 杯子 (bēizi). Que tu achètes un vêtement, un livre, un appareil ou de la nourriture, la question reste rigoureusement identique.',
      didYouKnow: {
        title: 'Le sais-tu ?',
        content:
          'Le mot 电脑 (diànnǎo) est composé de 电 (diàn, « électricité ») et 脑 (nǎo, « cerveau ») : littéralement le « cerveau électrique ». Pour le restaurant ou le marché, le mot 菜 (cài) désigne à la fois un plat cuisiné et les légumes. À l’oral, le spécificateur 个 (gè) s’utilise très couramment avec tous ces noms.',
      },
      featuredExamples: [
        {
          id: 'ex_2_2_1',
          hanzi: '请问，这个衣服多少钱？',
          pinyin: 'Qǐngwèn, zhèige yīfu duōshao qián ?',
          french: 'Excuse-moi, combien coûte ce vêtement ?',
          slotSelections: { slot_demo: 'demo_zhege', slot_noun: 'noun_yifu' },
          audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/all/demo_zhege_noun_yifu.mp3',
        },
        {
          id: 'ex_2_2_2',
          hanzi: '请问，这个电脑多少钱？',
          pinyin: 'Qǐngwèn, zhèige diànnǎo duōshao qián ?',
          french: 'Excuse-moi, combien coûte cet ordinateur ?',
          slotSelections: { slot_demo: 'demo_zhege', slot_noun: 'noun_diannao' },
          audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/all/demo_zhege_noun_diannao.mp3',
        },
        {
          id: 'ex_2_2_3',
          hanzi: '请问，这个苹果多少钱？',
          pinyin: 'Qǐngwèn, zhèige píngguǒ duōshao qián ?',
          french: 'Excuse-moi, combien coûte cette pomme ?',
          slotSelections: { slot_demo: 'demo_zhege', slot_noun: 'noun_pingguo' },
          audioUrl: '/audio/exercices-parles/spoken_hsk1_ep2/all/demo_zhege_noun_pingguo.mp3',
        },
      ],
      otherOptions: ALL_NOUNS.filter(
        (n) => !['noun_yifu', 'noun_diannao', 'noun_pingguo'].includes(n.id)
      ),
    },
  ],
  finale: {
    title: 'Tout mélanger (facultatif)',
    pedagogicalText:
      'Maintenant que tu sais changer une pièce à la fois, change les deux : 6 démonstratifs × 12 noms = 72 phrases à partir d’une seule. Tire une phrase au hasard, lis-la à voix haute, puis recommence.',
    totalExpectedCombinations: 72,
  },
  miniChallenge:
    'Dans une boutique ou au marché, demande le prix d’un article : 请问，这个多少钱 (Qǐngwèn, zhège duōshao qián) ?',
  nextEpisode: {
    titleFr: 'Comment répondre et négocier ? ……块钱 (kuài qián)',
    teaser: 'Découvre bientôt comment donner un prix en yuans (块, kuài) et négocier avec confiance !',
    isLocked: true,
  },
  rawNewWords: [
    { hanzi: '请问', pinyin: 'qǐngwèn', french: 'excuse-moi, puis-je demander (生词)' },
    { hanzi: '多少', pinyin: 'duōshao', french: 'combien (HSK 1)' },
    { hanzi: '钱', pinyin: 'qián', french: 'argent, prix (HSK 1)' },
    { hanzi: '这个', pinyin: 'zhèige / zhège', french: 'ce, cette (HSK 1)' },
    { hanzi: '那个', pinyin: 'nàige / nàge', french: 'ce...-là, cette...-là (HSK 1)' },
    { hanzi: '这些', pinyin: 'zhèxiē', french: 'ces...-ci (HSK 1)' },
    { hanzi: '那些', pinyin: 'nàxiē', french: 'ces...-là (HSK 1)' },
    { hanzi: '杯子', pinyin: 'bēizi', french: 'tasse, verre (HSK 1)' },
    { hanzi: '衣服', pinyin: 'yīfu', french: 'vêtement(s) (HSK 1)' },
    { hanzi: '电脑', pinyin: 'diànnǎo', french: 'ordinateur (HSK 1)' },
    { hanzi: '书', pinyin: 'shū', french: 'livre (HSK 1)' },
    { hanzi: '苹果', pinyin: 'píngguǒ', french: 'pomme (HSK 1)' },
    { hanzi: '茶', pinyin: 'chá', french: 'thé (HSK 1)' },
    { hanzi: '菜', pinyin: 'cài', french: 'plat, légume (HSK 1)' },
    { hanzi: '桌子', pinyin: 'zhuōzi', french: 'table (HSK 1)' },
    { hanzi: '椅子', pinyin: 'yǐzi', french: 'chaise (HSK 1)' },
    { hanzi: '水', pinyin: 'shuǐ', french: 'eau (HSK 1)' },
    { hanzi: '水果', pinyin: 'shuǐguǒ', french: 'fruit(s) (HSK 1)' },
    { hanzi: '米饭', pinyin: 'mǐfàn', french: 'riz (HSK 1)' },
  ],
};
