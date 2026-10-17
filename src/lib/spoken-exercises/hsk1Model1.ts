import { SpokenExerciseModel } from './types';
import { CombinatoryOption } from '@/lib/combination/combinationEngine';

// 1. Sujets - Pronoms (7) (Pas de "我")
const SUBJECT_PRONOUNS: CombinatoryOption[] = [
  { id: 'sub_ni', hanzi: '你', pinyin: 'Nǐ', french: 'tu', verbConjugations: { avoir: 'as', que: 'que ' } },
  { id: 'sub_ta_m', hanzi: '他', pinyin: 'Tā', french: 'il', verbConjugations: { avoir: 'a', que: 'qu’' } },
  { id: 'sub_ta_f', hanzi: '她', pinyin: 'Tā', french: 'elle', verbConjugations: { avoir: 'a', que: 'qu’' } },
  { id: 'sub_women', hanzi: '我们', pinyin: 'Wǒmen', french: 'nous', verbConjugations: { avoir: 'avons', que: 'que ' } },
  { id: 'sub_nimen', hanzi: '你们', pinyin: 'Nǐmen', french: 'vous', verbConjugations: { avoir: 'avez', que: 'que ' } },
  { id: 'sub_tamen_m', hanzi: '他们', pinyin: 'Tāmen', french: 'ils', verbConjugations: { avoir: 'ont', que: 'qu’' } },
  { id: 'sub_tamen_f', hanzi: '她们', pinyin: 'Tāmen', french: 'elles', verbConjugations: { avoir: 'ont', que: 'qu’' } },
];

// 2. Sujets - Noms propres (6) (Avec nom français garanti, 0 caractère chinois dans la traduction)
const SUBJECT_PROPER_NAMES: CombinatoryOption[] = [
  { id: 'sub_xiao_wang', hanzi: '小王', pinyin: 'Xiǎo Wáng', french: 'Xiao Wang', frenchName: 'Xiao Wang', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_lao_wang', hanzi: '老王', pinyin: 'Lǎo Wáng', french: 'Lao Wang', frenchName: 'Lao Wang', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_lili', hanzi: '丽丽', pinyin: 'Lìli', french: 'Lily', frenchName: 'Lily', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_katia', hanzi: '卡蒂娅', pinyin: 'Kǎdìyà', french: 'Katia', frenchName: 'Katia', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_brice', hanzi: '布里斯', pinyin: 'Bùlǐsī', french: 'Brice', frenchName: 'Brice', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_anthony', hanzi: '安东尼', pinyin: 'Āndōngní', french: 'Anthony', frenchName: 'Anthony', verbConjugations: { avoir: 'a', que: 'qu’' } },
];

// 3. Sujets - Noms communs (8)
const SUBJECT_COMMON_NOUNS: CombinatoryOption[] = [
  { id: 'sub_laoshi', hanzi: '老师', pinyin: 'lǎoshī', french: 'le professeur', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_xuesheng', hanzi: '学生', pinyin: 'xuésheng', french: 'l’élève', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_tongxue', hanzi: '同学', pinyin: 'tóngxué', french: 'le camarade de classe', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_pengyou', hanzi: '朋友', pinyin: 'péngyou', french: 'l’ami', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_mama', hanzi: '妈妈', pinyin: 'māma', french: 'maman', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_baba', hanzi: '爸爸', pinyin: 'bàba', french: 'papa', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_yisheng', hanzi: '医生', pinyin: 'yīshēng', french: 'le médecin', verbConjugations: { avoir: 'a', que: 'que ' } },
  { id: 'sub_nver', hanzi: '女儿', pinyin: 'nǚ’ér', french: 'la fille', verbConjugations: { avoir: 'a', que: 'que ' } },
];

// Tous les 21 sujets réunis dans la case 1
export const ALL_SUBJECTS: CombinatoryOption[] = [
  ...SUBJECT_PRONOUNS,
  ...SUBJECT_PROPER_NAMES,
  ...SUBJECT_COMMON_NOUNS,
];

// Case 2 : Fixe - 想 (xiǎng)
const FIXED_XIANG: CombinatoryOption = {
  id: 'fix_xiang',
  hanzi: '想',
  pinyin: 'xiǎng',
  french: 'avoir envie de',
};

// Case 3 : Verbes d’action (10)
export const ALL_VERBS: CombinatoryOption[] = [
  { id: 'v_zuo', hanzi: '做', pinyin: 'zuò', french: 'faire', verbConjugations: { prep: 'de ' } },
  { id: 'v_chi', hanzi: '吃', pinyin: 'chī', french: 'manger', verbConjugations: { prep: 'de ' } },
  { id: 'v_he', hanzi: '喝', pinyin: 'hē', french: 'boire', verbConjugations: { prep: 'de ' } },
  { id: 'v_mai', hanzi: '买', pinyin: 'mǎi', french: 'acheter', verbConjugations: { prep: 'd’' } },
  { id: 'v_kan', hanzi: '看', pinyin: 'kàn', french: 'regarder', verbConjugations: { prep: 'de ' } },
  { id: 'v_ting', hanzi: '听', pinyin: 'tīng', french: 'écouter', verbConjugations: { prep: 'd’' } },
  { id: 'v_shuo', hanzi: '说', pinyin: 'shuō', french: 'dire', verbConjugations: { prep: 'de ' } },
  { id: 'v_xie', hanzi: '写', pinyin: 'xiě', french: 'écrire', verbConjugations: { prep: 'd’' } },
  { id: 'v_du', hanzi: '读', pinyin: 'dú', french: 'lire', verbConjugations: { prep: 'de ' } },
  { id: 'v_xuexi', hanzi: '学习', pinyin: 'xuéxí', french: 'étudier', verbConjugations: { prep: 'd’' } },
];

// Case 4 : Fixe - 什么 (shénme)
const FIXED_SHENME: CombinatoryOption = {
  id: 'fix_shenme',
  hanzi: '什么',
  pinyin: 'shénme',
  french: 'quoi',
};

/**
 * Fonction d'assemblage français certifiée avec gestion rigoureuse des élisions :
 * Zéro caractère chinois dans la sortie.
 */
export function buildFrenchSentence(selected: CombinatoryOption[]): string {
  const sub = selected[0] || SUBJECT_PRONOUNS[0];
  const verb = selected[2] || ALL_VERBS[0];

  const quePart = sub.verbConjugations?.que || 'que ';
  const subName = sub.frenchName || sub.french;
  const avoirPart = sub.verbConjugations?.avoir || 'a';
  const prepPart = verb.verbConjugations?.prep || 'de ';
  const verbInf = verb.french;

  return `Qu’est-ce ${quePart}${subName} ${avoirPart} envie ${prepPart}${verbInf} ?`;
}

export const HSK1_MODEL_1: SpokenExerciseModel = {
  id: 'spoken_hsk1_ep1',
  level: 'HSK 1',
  episodeNumber: 1,
  titleFr: 'Que veux-tu faire ?',
  imageUrl: '/images/exercices-parles/propositions/hsk1_ep1_prop_a.jpg',
  isGratuit: true,
  isTest: false,
  datePublication: '2026-10-15',
  typicalSentence: {
    hanzi: '你想做什么？',
    pinyin: 'Nǐ xiǎng zuò shénme ?',
    french: 'Qu’est-ce que tu as envie de faire ?',
    audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_typical.mp3',
    tokens: [
      { hanzi: '你', pinyin: 'nǐ', french: 'tu', colorTheme: 'purple', audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_tok_ni.mp3' },
      { hanzi: '想', pinyin: 'xiǎng', french: 'avoir envie de', colorTheme: 'emerald', audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_tok_xiang.mp3' },
      { hanzi: '做', pinyin: 'zuò', french: 'faire', colorTheme: 'amber', audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_tok_zuo.mp3' },
      { hanzi: '什么', pinyin: 'shénme', french: 'quoi', colorTheme: 'blue', audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_tok_shenme.mp3' },
    ],
  },
  slots: [
    {
      id: 'slot_subject',
      slotNumber: 1,
      label: '1. Sujet',
      colorTheme: 'purple',
      defaultOptionId: 'sub_ni',
      options: ALL_SUBJECTS,
    },
    {
      id: 'slot_xiang',
      slotNumber: 2,
      label: '2. Modalité',
      colorTheme: 'emerald',
      isLocked: true,
      defaultOptionId: 'fix_xiang',
      options: [FIXED_XIANG],
    },
    {
      id: 'slot_verb',
      slotNumber: 3,
      label: '3. Verbe',
      colorTheme: 'amber',
      defaultOptionId: 'v_zuo',
      options: ALL_VERBS,
    },
    {
      id: 'slot_shenme',
      slotNumber: 4,
      label: '4. Interrogatif',
      colorTheme: 'blue',
      isLocked: true,
      defaultOptionId: 'fix_shenme',
      options: [FIXED_SHENME],
    },
  ],
  frenchSentenceBuilder: buildFrenchSentence,
  punctuation: {
    hanzi: '？',
    pinyin: ' ?',
  },
  structureInsight: '« <strong>想 (xiǎng)</strong> exprime une envie, un souhait : c’est plus doux que « vouloir ». »',
  pedagogicalMethod: {
    title: 'La Méthode de la Combinaison (Comprendre la règle d’or)',
    corePrinciple:
      'Une phrase est un jeu de construction. Pour formuler une multitude de phrases semblables tout en restant dans le même contexte et le même champ lexical, on s’appuie sur une structure charnière : on conserve certains composants fixes (ici 想 (xiǎng) et 什么 (shénme)) pour préserver l’intention générale, et on fait varier les autres pièces (le sujet et le verbe). Quand tu remplaces une pièce, la structure reste rigoureusement exacte : seul le sens s’adapte. La règle d’or : on change une seule pièce à la fois.',
    comparisonFr:
      'Pour un francophone : en français, le verbe change avec chaque personne (tu veux, il veut, vous voulez). En chinois, 想 (xiǎng) et le verbe ne se conjuguent jamais : seul le sujet change. C’est ce qui rend cette approche si puissante et accessible pour s’exprimer avec confiance.',
  },
  subSteps: [
    {
      id: 'step_1_pronouns',
      subStepNumber: 1,
      title: '1. Les pronoms personnels',
      otherOptionsTitle: 'Autres possibilités avec les pronoms',
      mobileSlotId: 'slot_subject',
      allowedOptionIds: SUBJECT_PRONOUNS.map((p) => p.id),
      pedagogicalText:
        'Garde 想 (xiǎng), 做 (zuò) et 什么 (shénme), et remplace seulement 你 (nǐ). On laisse de côté 我 (wǒ, « je »), parce que cette phrase sert à interroger quelqu’un d’autre.',
      didYouKnow: {
        title: 'Le sais-tu ?',
        content:
          '他 (tā) et 她 (tā) se prononcent pareil : seul l’écrit les distingue. Le petit mot 们 (men) rend un pronom pluriel : 你 (nǐ) → 你们 (nǐmen), 他 (tā) → 他们 (tāmen), 她 (tā) → 她们 (tāmen), 我 (wǒ) → 我们 (wǒmen). Un groupe mixte se dit 他们 (tāmen).',
      },
      featuredExamples: [
        {
          id: 'ex_1_1',
          hanzi: '他想做什么？',
          pinyin: 'Tā xiǎng zuò shénme ?',
          french: 'Qu’est-ce qu’il a envie de faire ?',
          slotSelections: { slot_subject: 'sub_ta_m', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex1_1.mp3',
        },
        {
          id: 'ex_1_2',
          hanzi: '她想做什么？',
          pinyin: 'Tā xiǎng zuò shénme ?',
          french: 'Qu’est-ce qu’elle a envie de faire ?',
          slotSelections: { slot_subject: 'sub_ta_f', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex1_2.mp3',
        },
        {
          id: 'ex_1_3',
          hanzi: '你们想做什么？',
          pinyin: 'Nǐmen xiǎng zuò shénme ?',
          french: 'Qu’est-ce que vous avez envie de faire ?',
          slotSelections: { slot_subject: 'sub_nimen', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex1_3.mp3',
        },
      ],
      otherOptions: SUBJECT_PRONOUNS.filter(
        (p) => !['sub_ta_m', 'sub_ta_f', 'sub_nimen'].includes(p.id)
      ),
    },
    {
      id: 'step_2_proper_names',
      subStepNumber: 2,
      title: '2. Les noms propres',
      otherOptionsTitle: 'Autres possibilités avec les noms propres',
      mobileSlotId: 'slot_subject',
      allowedOptionIds: SUBJECT_PROPER_NAMES.map((p) => p.id),
      pedagogicalText:
        'Un prénom se place exactement comme un pronom : rien d’autre ne change.',
      didYouKnow: {
        title: 'Le sais-tu ?',
        content:
          'Devant un nom de famille, 小 (xiǎo, « petit ») s’emploie pour une personne plus jeune ou proche, 老 (lǎo, « vieux ») pour une personne plus âgée ou respectée. Ce n’est pas une insulte : c’est de l’affection ou du respect.',
      },
      featuredExamples: [
        {
          id: 'ex_2_1',
          hanzi: '小王想做什么？',
          pinyin: 'Xiǎo Wáng xiǎng zuò shénme ?',
          french: 'Qu’est-ce que Xiao Wang a envie de faire ?',
          slotSelections: { slot_subject: 'sub_xiao_wang', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex2_1.mp3',
        },
        {
          id: 'ex_2_2',
          hanzi: '丽丽想做什么？',
          pinyin: 'Lìli xiǎng zuò shénme ?',
          french: 'Qu’est-ce que Lily a envie de faire ?',
          slotSelections: { slot_subject: 'sub_lili', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex2_2.mp3',
        },
        {
          id: 'ex_2_3',
          hanzi: '卡蒂娅想做什么？',
          pinyin: 'Kǎdìyà xiǎng zuò shénme ?',
          french: 'Qu’est-ce que Katia a envie de faire ?',
          slotSelections: { slot_subject: 'sub_katia', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex2_3.mp3',
        },
      ],
      otherOptions: SUBJECT_PROPER_NAMES.filter(
        (p) => !['sub_xiao_wang', 'sub_lili', 'sub_katia'].includes(p.id)
      ),
    },
    {
      id: 'step_3_common_nouns',
      subStepNumber: 3,
      title: '3. Les noms communs',
      otherOptionsTitle: 'Autres possibilités avec les noms communs',
      mobileSlotId: 'slot_subject',
      allowedOptionIds: SUBJECT_COMMON_NOUNS.map((p) => p.id),
      pedagogicalText:
        'Un nom de métier, de famille ou de relation fonctionne aussi.',
      didYouKnow: {
        title: 'Le sais-tu ?',
        content:
          'Le chinois n’a pas d’article : 老师 (lǎoshī) peut vouloir dire « le professeur », « un professeur » ou « les professeurs ». C’est le contexte qui décide.',
      },
      featuredExamples: [
        {
          id: 'ex_3_1',
          hanzi: '老师想做什么？',
          pinyin: 'Lǎoshī xiǎng zuò shénme ?',
          french: 'Qu’est-ce que le professeur a envie de faire ?',
          slotSelections: { slot_subject: 'sub_laoshi', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex3_1.mp3',
        },
        {
          id: 'ex_3_2',
          hanzi: '妈妈想做什么？',
          pinyin: 'Māma xiǎng zuò shénme ?',
          french: 'Qu’est-ce que maman a envie de faire ?',
          slotSelections: { slot_subject: 'sub_mama', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex3_2.mp3',
        },
        {
          id: 'ex_3_3',
          hanzi: '医生想做什么？',
          pinyin: 'Yīshēng xiǎng zuò shénme ?',
          french: 'Qu’est-ce que le médecin a envie de faire ?',
          slotSelections: { slot_subject: 'sub_yisheng', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex3_3.mp3',
        },
      ],
      otherOptions: SUBJECT_COMMON_NOUNS.filter(
        (p) => !['sub_laoshi', 'sub_mama', 'sub_yisheng'].includes(p.id)
      ),
    },
    {
      id: 'step_4_verbs',
      subStepNumber: 4,
      title: '4. Les verbes d’action',
      otherOptionsTitle: 'Autres possibilités avec les verbes',
      mobileSlotId: 'slot_verb',
      allowedOptionIds: ALL_VERBS.map((v) => v.id),
      pedagogicalText:
        'Maintenant, le sujet reste 你 (nǐ) et tu remplaces seulement le verbe qui suit 想 (xiǎng). Il faut un verbe qui peut avoir 什么 (shénme, « quoi ») pour complément.',
      didYouKnow: {
        title: 'Le sais-tu ?',
        content:
          'Pourquoi pas 去 (qù, « aller ») ? On ne demande pas « aller quoi ? » mais « aller où ? ». Il faut un autre mot interrogatif, 哪儿 (nǎr) : ce sera une autre phrase du jour.',
      },
      tip:
        'Même règle qu’au début : dans 想买 (xiǎng mǎi) et 想写 (xiǎng xiě), 想 (xiǎng) se prononce au 2ᵉ ton.',
      featuredExamples: [
        {
          id: 'ex_4_1',
          hanzi: '你想吃什么？',
          pinyin: 'Nǐ xiǎng chī shénme ?',
          french: 'Qu’est-ce que tu as envie de manger ?',
          slotSelections: { slot_subject: 'sub_ni', slot_verb: 'v_chi' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex4_1.mp3',
        },
        {
          id: 'ex_4_2',
          hanzi: '你想喝什么？',
          pinyin: 'Nǐ xiǎng hē shénme ?',
          french: 'Qu’est-ce que tu as envie de boire ?',
          slotSelections: { slot_subject: 'sub_ni', slot_verb: 'v_he' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex4_2.mp3',
        },
        {
          id: 'ex_4_3',
          hanzi: '你想买什么？',
          pinyin: 'Nǐ xiǎng mǎi shénme ?',
          french: 'Qu’est-ce que tu as envie d’acheter ?',
          slotSelections: { slot_subject: 'sub_ni', slot_verb: 'v_mai' },
          audioUrl: '/audio/exercices-parles/hsk1-01/hsk1_01_ex4_3.mp3',
        },
      ],
      otherOptions: ALL_VERBS.filter(
        (v) => !['v_chi', 'v_he', 'v_mai'].includes(v.id)
      ),
    },
  ],
  finale: {
    title: 'Tout mélanger (facultatif)',
    pedagogicalText:
      'Maintenant que tu sais changer une pièce à la fois, change les deux : 21 sujets × 10 verbes = 210 phrases à partir d’une seule. Tire une phrase au hasard, lis-la à voix haute, puis recommence.',
    totalExpectedCombinations: 210,
  },
  miniChallenge: 'Pose la question à quelqu’un de réel : 你想吃什么 (nǐ xiǎng chī shénme) ?',
  nextEpisode: {
    titleFr: 'Comment répondre ? 我想 (wǒ xiǎng)……',
    teaser: 'Découvre bientôt la structure de réponse complète pour exprimer toutes tes envies en mandarin !',
    isLocked: true,
  },
  rawNewWords: [
    { hanzi: '想', pinyin: 'xiǎng', french: 'avoir envie de, penser' },
    { hanzi: '做', pinyin: 'zuò', french: 'faire' },
    { hanzi: '什么', pinyin: 'shénme', french: 'quoi, quel' },
    { hanzi: '吃', pinyin: 'chī', french: 'manger' },
    { hanzi: '喝', pinyin: 'hē', french: 'boire' },
    { hanzi: '买', pinyin: 'mǎi', french: 'acheter' },
    { hanzi: '看', pinyin: 'kàn', french: 'regarder, voir' },
    { hanzi: '听', pinyin: 'tīng', french: 'écouter' },
    { hanzi: '说', pinyin: 'shuō', french: 'dire, parler' },
    { hanzi: '写', pinyin: 'xiě', french: 'écrire' },
    { hanzi: '读', pinyin: 'dú', french: 'lire' },
    { hanzi: '学习', pinyin: 'xuéxí', french: 'étudier, apprendre' },
    { hanzi: '我们', pinyin: 'wǒmen', french: 'nous' },
    { hanzi: '你们', pinyin: 'nǐmen', french: 'vous' },
    { hanzi: '他们', pinyin: 'tāmen', french: 'ils, eux' },
    { hanzi: '她们', pinyin: 'tāmen', french: 'elles' },
  ],
};

import { HSK1_MODEL_2 } from './hsk1Model2';
import { HSK2_MODEL_1 } from './hsk2Model1';

export const ALL_SPOKEN_MODELS: SpokenExerciseModel[] = [HSK1_MODEL_1, HSK1_MODEL_2, HSK2_MODEL_1];
