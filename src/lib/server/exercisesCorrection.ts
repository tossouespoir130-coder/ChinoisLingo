/**
 * Base de données et moteur de correction des Exercices HSK (Server-Only).
 * 
 * Les bonnes réponses et transcriptions complètes restent strictement sur le serveur
 * et ne sont JAMAIS envoyées au navigateur avant la validation de chaque question.
 * (`server-only` fait échouer le build si un composant client importe ce module :
 * côté client, n'importer que ses types avec `import type`.)
 */
import 'server-only';

import { serieExerciceAccessible } from '@/lib/payments/acces';
import { estSeriePubliee } from '@/lib/exercices/regles';

import { type ExerciseRubriqueId, CONFIG_RUBRIQUES } from '@/lib/exercices/configRubriques';

export type ExerciseSeriesFormat = 'A' | 'B';
export type ExerciseRubrique = ExerciseRubriqueId;
export type ExerciseQuestionType = 'choice' | 'true_false' | 'matching_images';

export interface ServerDialogueLine {
  speakerLabel: string; // ex: '男' ou '女'
  speakerGender: 'male' | 'female';
  voiceId?: string;
  hanzi: string;
  pinyin: string;
  french: string;
  startMs?: number;
  endMs?: number;
}

export interface ServerExerciseChoice {
  id: string; // 'A', 'B', 'C'
  label: string;
  hanzi: string;
  pinyin?: string;
  french?: string;
}

export interface ServerMatchingImageItem {
  id: string; // IDs neutres et anonymes
  imageUrl: string;
  altText: string;
}

export interface ServerMatchingDialogueItem {
  id: string;
  audioUrl?: string;
  dialogue: ServerDialogueLine[];
}

export interface ServerExerciseQuestion {
  id: string;
  orderNumber: number;
  type?: ExerciseQuestionType; // default: 'choice'
  audioUrl?: string;
  
  // Type 'choice' (Rubrique Dialogues & Questions)
  question?: {
    hanzi: string;
    pinyin: string;
    french: string;
  };
  choices?: ServerExerciseChoice[];
  correctChoiceId?: string;
  dialogue?: ServerDialogueLine[];

  // Type 'true_false' (Rubrique Vrai ou Faux ?)
  imageUrl?: string;
  imageAlt?: string;
  audioText?: {
    hanzi: string;
    pinyin: string;
    french: string;
  };
  imageContent?: {
    hanzi: string;
    pinyin: string;
    french: string;
  };
  speakerGender?: 'male' | 'female';
  correctValue?: boolean;

  // Type 'matching_images' (Rubrique Images & Dialogues)
  images?: ServerMatchingImageItem[];
  dialogues?: ServerMatchingDialogueItem[];
  correctMatches?: Record<string, string>;

  // Explications communes
  explanationFr: string;
  keyVocabulary?: Array<{ hanzi: string; pinyin: string; french: string }>;
}

export interface ServerExerciseSet {
  id: string;
  rubrique: ExerciseRubrique;
  orderInRubrique: number;
  format?: ExerciseSeriesFormat; // pour rétro-compatibilité
  titleFr: string;
  titleZh: string;
  level: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6';
  orderInLevel: number; // Rang dans le niveau : gratuit jusqu'à QUOTA_GRATUIT.exercices (acces.ts), abonné au-delà
  duration: string;
  description: string;
  imageUrl: string;
  date_publication?: string;
  isTest?: boolean;
  questions: ServerExerciseQuestion[];
}

export interface ClientAudioSequenceItem {
  speakerGender: 'male' | 'female';
  text: string;
  isQuestion?: boolean;
}

export interface ClientMatchingImageItem {
  id: string;
  imageUrl: string;
  altText: string;
}

export interface ClientMatchingDialogueItem {
  id: string;
  audioUrl?: string;
  audioSequence: ClientAudioSequenceItem[];
}

export interface ClientExerciseQuestion {
  id: string;
  orderNumber: number;
  type: ExerciseQuestionType;
  audioUrl?: string;
  audioSequence?: ClientAudioSequenceItem[];
  
  // Type 'choice'
  question?: {
    hanzi: string;
    pinyin: string;
    french: string;
  };
  choices?: ServerExerciseChoice[];

  // Type 'true_false'
  imageUrl?: string;
  imageAlt?: string;
  promptFr?: string;

  // Type 'matching_images'
  images?: ClientMatchingImageItem[];
  dialogues?: ClientMatchingDialogueItem[];
}

export interface ClientExerciseSet {
  id: string;
  rubrique: ExerciseRubrique;
  orderInRubrique: number;
  format?: ExerciseSeriesFormat;
  titleFr: string;
  titleZh: string;
  level: 'HSK 1' | 'HSK 2' | 'HSK 3' | 'HSK 4' | 'HSK 5' | 'HSK 6';
  orderInLevel: number;
  isGratuit: boolean;
  duration: string;
  questionCount: number;
  description: string;
  imageUrl: string;
  date_publication?: string;
  isTest?: boolean;
  questions: ClientExerciseQuestion[];
}

/**
 * Catalogue complet des séries côté serveur.
 */
export const SERVER_EXERCISES_CATALOG: ServerExerciseSet[] = [
  // =========================================================================
  // HSK 1 — RUBRIQUE 1 : VRAI OU FAUX ? (Série de Test 5 Questions)
  // =========================================================================
  {
    id: 'exercice_hsk1_tf_test',
    rubrique: 'true_false',
    orderInRubrique: 1,
    titleFr: 'Vrai ou Faux ? — Série 1',
    titleZh: 'HSK 1级 听力判断（一）',
    level: 'HSK 1',
    orderInLevel: 1,
    duration: '~2 min',
    description: 'Écoutez le mot prononcé et déterminez si l’illustration correspond.',
    imageUrl: '/images/exercices/hsk1_tf_q01_eau.jpg',
    date_publication: '2026-10-08',
    isTest: true,
    questions: [
      {
        id: 'hsk1_tf_q01',
        orderNumber: 1,
        type: 'true_false',
        speakerGender: 'male',
        audioUrl: '/audio/exercices/hsk1_tf_q01.mp3',
        audioText: {
          hanzi: '可乐',
          pinyin: 'kělè',
          french: 'Coca-cola',
        },
        correctValue: false,
        imageContent: {
          hanzi: '水',
          pinyin: 'shuǐ',
          french: 'De l’eau',
        },
        imageUrl: '/images/exercices/hsk1_tf_q01_eau.jpg',
        imageAlt: 'Verre d’eau minérale fraîche',
        explanationFr: 'Tu as entendu « 可乐 » (kělè, coca), mais l’illustration montre de l’eau (« 水 », shuǐ). La bonne réponse est donc Faux.',
        keyVocabulary: [
          { hanzi: '可乐', pinyin: 'kělè', french: 'Coca-cola' },
          { hanzi: '水', pinyin: 'shuǐ', french: 'Eau' },
        ],
      },
      {
        id: 'hsk1_tf_q02',
        orderNumber: 2,
        type: 'true_false',
        speakerGender: 'female',
        audioUrl: '/audio/exercices/hsk1_tf_q02.mp3',
        audioText: {
          hanzi: '咖啡',
          pinyin: 'kāfēi',
          french: 'Café',
        },
        correctValue: false,
        imageContent: {
          hanzi: '茶',
          pinyin: 'chá',
          french: 'Du thé',
        },
        imageUrl: '/images/exercices/hsk1_tf_q02_the.jpg',
        imageAlt: 'Théière et tasse de thé chinois',
        explanationFr: 'Tu as entendu « 咖啡 » (kāfēi, café), mais l’illustration montre du thé dans une théière (« 茶 », chá). La bonne réponse est donc Faux.',
        keyVocabulary: [
          { hanzi: '咖啡', pinyin: 'kāfēi', french: 'Café' },
          { hanzi: '茶', pinyin: 'chá', french: 'Thé' },
        ],
      },
      {
        id: 'hsk1_tf_q03',
        orderNumber: 3,
        type: 'true_false',
        speakerGender: 'male',
        audioUrl: '/audio/exercices/hsk1_tf_q03.mp3',
        audioText: {
          hanzi: '吉他',
          pinyin: 'jítā',
          french: 'Guitare',
        },
        correctValue: true,
        imageContent: {
          hanzi: '吉他',
          pinyin: 'jítā',
          french: 'Une guitare',
        },
        imageUrl: '/images/exercices/hsk1_tf_q03_guitare.jpg',
        imageAlt: 'Guitare acoustique en bois',
        explanationFr: 'Le mot prononcé est « 吉他 » (jítā, guitare) et l’illustration montre bien une guitare acoustique. La bonne réponse est donc Vrai.',
        keyVocabulary: [
          { hanzi: '吉他', pinyin: 'jítā', french: 'Guitare' },
        ],
      },
      {
        id: 'hsk1_tf_q04',
        orderNumber: 4,
        type: 'true_false',
        speakerGender: 'female',
        audioUrl: '/audio/exercices/hsk1_tf_q04.mp3',
        audioText: {
          hanzi: '芭蕾',
          pinyin: 'bālěi',
          french: 'Ballet',
        },
        correctValue: true,
        imageContent: {
          hanzi: '芭蕾',
          pinyin: 'bālěi',
          french: 'Ballet',
        },
        imageUrl: '/images/exercices/hsk1_tf_q04_danse.jpg',
        imageAlt: 'Danseuse de ballet en plein mouvement',
        explanationFr: 'Le mot prononcé est « 芭蕾 » (bālěi, ballet) et l’illustration montre bien une danseuse de ballet. La bonne réponse est donc Vrai.',
        keyVocabulary: [
          { hanzi: '芭蕾', pinyin: 'bālěi', french: 'Ballet' },
        ],
      },
      {
        id: 'hsk1_tf_q05',
        orderNumber: 5,
        type: 'true_false',
        speakerGender: 'male',
        audioUrl: '/audio/exercices/hsk1_tf_q05.mp3',
        audioText: {
          hanzi: '再见',
          pinyin: 'zàijiàn',
          french: 'Au revoir',
        },
        correctValue: false,
        imageContent: {
          hanzi: '谢谢',
          pinyin: 'xièxie',
          french: 'Merci',
        },
        imageUrl: '/images/exercices/hsk1_tf_q05_merci.jpg',
        imageAlt: 'Personne recevant un cadeau et remerciant',
        explanationFr: 'Tu as entendu « 再见 » (zàijiàn, au revoir), mais l’illustration montre une personne qui reçoit un cadeau et remercie (« 谢谢 », xièxie). La bonne réponse est donc Faux.',
        keyVocabulary: [
          { hanzi: '再见', pinyin: 'zàijiàn', french: 'Au revoir' },
          { hanzi: '谢谢', pinyin: 'xièxie', french: 'Merci' },
        ],
      },
    ],
  },

  // =========================================================================
  // HSK 1 — RUBRIQUE 1 : VRAI OU FAUX ? (Série 2 de Test — 5 Questions)
  // =========================================================================
  {
    id: 'exercice_hsk1_tf_test_02',
    rubrique: 'true_false',
    orderInRubrique: 2,
    titleFr: 'Vrai ou Faux ? — Série 2',
    titleZh: 'HSK 1级 听力判断（二）',
    level: 'HSK 1',
    orderInLevel: 2,
    duration: '~2 min',
    description: 'Personnes, nationalités et objets du quotidien : vérifiez la correspondance image-mot.',
    imageUrl: '/images/exercices/hsk1_tf_s02_q01_eleve.jpg',
    date_publication: '2026-10-08',
    isTest: true,
    questions: [
      {
        id: 'hsk1_tf_s02_q01',
        orderNumber: 1,
        type: 'true_false',
        speakerGender: 'female',
        audioUrl: '/audio/exercices/hsk1_tf_s02_q01.mp3',
        audioText: {
          hanzi: '老师',
          pinyin: 'lǎoshī',
          french: 'Professeur',
        },
        correctValue: false,
        imageContent: {
          hanzi: '学生',
          pinyin: 'xuésheng',
          french: 'Un élève',
        },
        imageUrl: '/images/exercices/hsk1_tf_s02_q01_eleve.jpg',
        imageAlt: 'Un élève seul en uniforme assis à un bureau avec un cahier',
        explanationFr: 'Tu as entendu « 老师 » (lǎoshī, professeur), mais l’image montre un élève (« 学生 », xuésheng). La réponse est donc Faux.',
        keyVocabulary: [
          { hanzi: '老师', pinyin: 'lǎoshī', french: 'Professeur / Enseignant' },
          { hanzi: '学生', pinyin: 'xuésheng', french: 'Élève / Étudiant' },
        ],
      },
      {
        id: 'hsk1_tf_s02_q02',
        orderNumber: 2,
        type: 'true_false',
        speakerGender: 'male',
        audioUrl: '/audio/exercices/hsk1_tf_s02_q02.mp3',
        audioText: {
          hanzi: '中国人',
          pinyin: 'Zhōngguórén',
          french: 'Chinois',
        },
        correctValue: false,
        imageContent: {
          hanzi: '美国人',
          pinyin: 'Měiguórén',
          french: 'Un Américain',
        },
        imageUrl: '/images/exercices/hsk1_tf_s02_q02_americain.jpg',
        imageAlt: 'Une personne tenant un drapeau des États-Unis',
        explanationFr: 'Tu as entendu « 中国人 » (Zhōngguórén, Chinois), mais l’image montre un Américain (« 美国人 », Měiguórén avec le drapeau américain). La réponse est donc Faux.',
        keyVocabulary: [
          { hanzi: '中国人', pinyin: 'Zhōngguórén', french: 'Chinois (nationalité)' },
          { hanzi: '美国人', pinyin: 'Měiguórén', french: 'Américain (nationalité)' },
        ],
      },
      {
        id: 'hsk1_tf_s02_q03',
        orderNumber: 3,
        type: 'true_false',
        speakerGender: 'female',
        audioUrl: '/audio/exercices/hsk1_tf_s02_q03.mp3',
        audioText: {
          hanzi: '派',
          pinyin: 'pài',
          french: 'Tarte / Tourte',
        },
        correctValue: true,
        imageContent: {
          hanzi: '派',
          pinyin: 'pài',
          french: 'Une tarte',
        },
        imageUrl: '/images/exercices/hsk1_tf_s02_q03_tarte.jpg',
        imageAlt: 'Une délicieuse tarte dorée en gros plan',
        explanationFr: 'Tu as entendu « 派 » (pài, tarte / tourte), ce qui correspond à l’image. La réponse est donc Vrai.',
        keyVocabulary: [
          { hanzi: '派', pinyin: 'pài', french: 'Tarte / Tourte' },
        ],
      },
      {
        id: 'hsk1_tf_s02_q04',
        orderNumber: 4,
        type: 'true_false',
        speakerGender: 'male',
        audioUrl: '/audio/exercices/hsk1_tf_s02_q04.mp3',
        audioText: {
          hanzi: '美国人',
          pinyin: 'Měiguórén',
          french: 'Américain',
        },
        correctValue: false,
        imageContent: {
          hanzi: '中国人',
          pinyin: 'Zhōngguórén',
          french: 'Un Chinois',
        },
        imageUrl: '/images/exercices/hsk1_tf_s02_q04_chinois.jpg',
        imageAlt: 'Une personne chinoise avec éléments traditionnels',
        explanationFr: 'Tu as entendu « 美国人 » (Měiguórén, Américain), mais l’image montre un Chinois (« 中国人 », Zhōngguórén). La réponse est donc Faux.',
        keyVocabulary: [
          { hanzi: '美国人', pinyin: 'Měiguórén', french: 'Américain' },
          { hanzi: '中国人', pinyin: 'Zhōngguórén', french: 'Chinois' },
        ],
      },
      {
        id: 'hsk1_tf_s02_q05',
        orderNumber: 5,
        type: 'true_false',
        speakerGender: 'female',
        audioUrl: '/audio/exercices/hsk1_tf_s02_q05.mp3',
        audioText: {
          hanzi: '学生',
          pinyin: 'xuésheng',
          french: 'Élève',
        },
        correctValue: true,
        imageContent: {
          hanzi: '学生',
          pinyin: 'xuésheng',
          french: 'Un élève devant son école',
        },
        imageUrl: '/images/exercices/hsk1_tf_s02_q05_etudiant.jpg',
        imageAlt: 'Un élève avec un sac à dos devant son école',
        explanationFr: 'Tu as entendu « 学生 » (xuésheng, élève), ce qui correspond à l’image de l’élève avec son sac à dos. La réponse est donc Vrai.',
        keyVocabulary: [
          { hanzi: '学生', pinyin: 'xuésheng', french: 'Élève / Étudiant' },
        ],
      },
    ],
  },

  // =========================================================================
  // HSK 1 — RUBRIQUE 1 : VRAI OU FAUX ? (Série 3 de Test — 5 Questions)
  // =========================================================================
  {
    id: 'exercice_hsk1_tf_test_03',
    rubrique: 'true_false',
    orderInRubrique: 3,
    titleFr: 'Vrai ou Faux ? — Série 3',
    titleZh: 'HSK 1级 听力判断（三）',
    level: 'HSK 1',
    orderInLevel: 3,
    duration: '~2 min',
    description: 'Pays, pronoms, famille et professions : vérifiez la correspondance entre l’audio et l’illustration.',
    imageUrl: '/images/exercices/hsk1_tf_s03_q01_france.jpg',
    date_publication: '2026-10-08',
    isTest: true,
    questions: [
      {
        id: 'hsk1_tf_s03_q01',
        orderNumber: 1,
        type: 'true_false',
        speakerGender: 'male',
        audioUrl: '/audio/exercices/hsk1_tf_s03_q01.mp3',
        audioText: {
          hanzi: '中国',
          pinyin: 'Zhōngguó',
          french: 'Chine',
        },
        correctValue: false,
        imageContent: {
          hanzi: '法国',
          pinyin: 'Fǎguó',
          french: 'La France',
        },
        imageUrl: '/images/exercices/hsk1_tf_s03_q01_france.jpg',
        imageAlt: 'Drapeau officiel de la France avec ses trois bandes verticales bleu, blanc, rouge',
        explanationFr: 'Tu as entendu « 中国 » (Zhōngguó, la Chine), mais l’illustration montre le drapeau de la France (« 法国 », Fǎguó). La réponse est donc Faux.',
        keyVocabulary: [
          { hanzi: '中国', pinyin: 'Zhōngguó', french: 'Chine' },
          { hanzi: '法国', pinyin: 'Fǎguó', french: 'France' },
        ],
      },
      {
        id: 'hsk1_tf_s03_q02',
        orderNumber: 2,
        type: 'true_false',
        speakerGender: 'female',
        audioUrl: '/audio/exercices/hsk1_tf_s03_q02.mp3',
        audioText: {
          hanzi: '医院',
          pinyin: 'yīyuàn',
          french: 'Hôpital',
        },
        correctValue: true,
        imageContent: {
          hanzi: '医院',
          pinyin: 'yīyuàn',
          french: 'Un hôpital',
        },
        imageUrl: '/images/exercices/hsk1_tf_s03_q02_hopital.jpg',
        imageAlt: 'Bâtiment moderne d’un hôpital avec croix médicale visible',
        explanationFr: 'Le mot prononcé est « 医院 » (yīyuàn, hôpital) et l’illustration montre bien un hôpital moderne avec sa croix médicale. La bonne réponse est donc Vrai.',
        keyVocabulary: [
          { hanzi: '医院', pinyin: 'yīyuàn', french: 'Hôpital' },
        ],
      },
      {
        id: 'hsk1_tf_s03_q03',
        orderNumber: 3,
        type: 'true_false',
        speakerGender: 'male',
        audioUrl: '/audio/exercices/hsk1_tf_s03_q03.mp3',
        audioText: {
          hanzi: '朋友',
          pinyin: 'péngyou',
          french: 'Amis',
        },
        correctValue: true,
        imageContent: {
          hanzi: '朋友',
          pinyin: 'péngyou',
          french: 'Des amis',
        },
        imageUrl: '/images/exercices/hsk1_tf_s03_q03_amis.jpg',
        imageAlt: 'Deux personnes du même âge qui sourient et trinquent avec des tasses de thé',
        explanationFr: 'Le mot prononcé est « 朋友 » (péngyou, amis) et l’image montre bien deux amis qui trinquent et partagent un moment amical. La réponse est donc Vrai.',
        keyVocabulary: [
          { hanzi: '朋友', pinyin: 'péngyou', french: 'Ami / Amis' },
        ],
      },
      {
        id: 'hsk1_tf_s03_q04',
        orderNumber: 4,
        type: 'true_false',
        speakerGender: 'female',
        audioUrl: '/audio/exercices/hsk1_tf_s03_q04.mp3',
        audioText: {
          hanzi: '爸爸',
          pinyin: 'bàba',
          french: 'Papa',
        },
        correctValue: false,
        imageContent: {
          hanzi: '妈妈',
          pinyin: 'māma',
          french: 'Une maman',
        },
        imageUrl: '/images/exercices/hsk1_tf_s03_q04_maman.jpg',
        imageAlt: 'Une maman qui tient son enfant par la main',
        explanationFr: 'Tu as entendu « 爸爸 » (bàba, papa), mais l’image montre une maman (« 妈妈 », māma) tenant son enfant par la main. La réponse est donc Faux.',
        keyVocabulary: [
          { hanzi: '爸爸', pinyin: 'bàba', french: 'Papa / Père' },
          { hanzi: '妈妈', pinyin: 'māma', french: 'Maman / Mère' },
        ],
      },
      {
        id: 'hsk1_tf_s03_q05',
        orderNumber: 5,
        type: 'true_false',
        speakerGender: 'male',
        audioUrl: '/audio/exercices/hsk1_tf_s03_q05.mp3',
        audioText: {
          hanzi: '老师',
          pinyin: 'lǎoshī',
          french: 'Professeur',
        },
        correctValue: true,
        imageContent: {
          hanzi: '老师',
          pinyin: 'lǎoshī',
          french: 'Un professeur',
        },
        imageUrl: '/images/exercices/hsk1_tf_s03_q05_professeur.jpg',
        imageAlt: 'Un adulte debout devant un tableau noir, une craie à la main',
        explanationFr: 'Le mot prononcé est « 老师 » (lǎoshī, professeur) et l’illustration montre bien un adulte debout avec une craie devant un tableau noir. La réponse est donc Vrai.',
        keyVocabulary: [
          { hanzi: '老师', pinyin: 'lǎoshī', french: 'Professeur / Enseignant' },
        ],
      },
    ],
  },

  // =========================================================================
  // HSK 2 — SÉRIE 1 (Dialogues & Questions) : Couleurs, magasins et transport Pékin
  // =========================================================================
  {
    id: 'exercice_hsk2_serie_01',
    rubrique: 'dialogue_questions',
    orderInRubrique: 1,
    format: 'A',
    titleFr: 'Compréhension Orale HSK 2 — Série 1',
    titleZh: 'HSK 2级 听力专项练习（一）',
    level: 'HSK 2',
    orderInLevel: 1, // Gratuit
    duration: '~3 min',
    description: 'Compréhension de dialogues du quotidien : achats, localisation et moyens de transport.',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    date_publication: '2026-10-07',
    isTest: false,
    questions: [
      {
        id: 'hsk2_s01_q01',
        orderNumber: 1,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk2_s01_q01.mp3',
        question: {
          hanzi: '小王的杯子是什么颜色的？',
          pinyin: 'Xiǎo Wáng de bēizi shì shénme yánsè de?',
          french: 'De quelle couleur est la tasse de Xiao Wang ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '红色的', pinyin: 'hóngsè de', french: 'La rouge' },
          { id: 'B', label: 'B', hanzi: '白色的', pinyin: 'báisè de', french: 'La blanche' },
          { id: 'C', label: 'C', hanzi: '黑色的', pinyin: 'hēisè de', french: 'La noire' },
        ],
        correctChoiceId: 'A',
        dialogue: [
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '小王，这里有几个杯子，哪个是你的？',
            pinyin: 'Xiǎo Wáng, zhèli yǒu jǐ ge bēizi, nǎge shì nǐ de?',
            french: 'Xiao Wang, il y a plusieurs tasses ici, laquelle est à toi ?',
            startMs: 0,
            endMs: 3800,
          },
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '左边那个红色的是我的。',
            pinyin: 'Zuǒbian nàge hóngsè de shì wǒ de.',
            french: 'La rouge sur la gauche est à moi.',
            startMs: 4100,
            endMs: 7200,
          },
        ],
        explanationFr: 'La femme (Xiao Wang) précise explicitement : « 左边那个红色的 » (celle qui est rouge sur la gauche). La bonne réponse est donc l’option A (红色的).',
        keyVocabulary: [
          { hanzi: '杯子', pinyin: 'bēizi', french: 'Tasse / Verre' },
          { hanzi: '左边', pinyin: 'zuǒbian', french: 'À gauche' },
          { hanzi: '红色', pinyin: 'hóngsè', french: 'Couleur rouge' },
        ],
      },
      {
        id: 'hsk2_s01_q02',
        orderNumber: 2,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk2_s01_q02.mp3',
        question: {
          hanzi: '他们现在在哪里？',
          pinyin: 'Tāmen xiànzài zài nǎlǐ?',
          french: 'Où sont-ils en ce moment ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '商店', pinyin: 'shāngdiàn', french: 'Au magasin' },
          { id: 'B', label: 'B', hanzi: '医院', pinyin: 'yīyuàn', french: 'À l’hôpital' },
          { id: 'C', label: 'C', hanzi: '学校', pinyin: 'xuéxiào', french: 'À l’école' },
        ],
        correctChoiceId: 'A',
        dialogue: [
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '请问，这个苹果多少钱一斤？',
            pinyin: 'Qǐngwèn, zhège píngguǒ duōshao qián yì jīn?',
            french: 'S’il vous plaît, combien coûte une livre de ces pommes ?',
            startMs: 0,
            endMs: 3500,
          },
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '三块钱一斤，很甜很新鲜。',
            pinyin: 'Sān kuài qián yì jīn, hěn tián hěn xīnxiān.',
            french: 'Trois yuans la livre, très sucrées et très fraîches.',
            startMs: 3800,
            endMs: 6900,
          },
        ],
        explanationFr: 'Le dialogue porte sur le prix d’un fruit (« 多少钱一斤 ») avec paiement (« 三块钱 »), ce qui situe la scène dans un magasin (商店).',
        keyVocabulary: [
          { hanzi: '多少钱', pinyin: 'duōshao qián', french: 'Combien ça coûte' },
          { hanzi: '商店', pinyin: 'shāngdiàn', french: 'Magasin' },
          { hanzi: '苹果', pinyin: 'píngguǒ', french: 'Pomme' },
        ],
      },
      {
        id: 'hsk2_s01_q03',
        orderNumber: 3,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk2_s01_q03.mp3',
        question: {
          hanzi: '李老师明天怎么去北京？',
          pinyin: 'Lǐ Lǎoshī míngtiān zěnme qù Běijīng?',
          french: 'Comment le professeur Li se rendra-t-il à Pékin demain ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '出租车', pinyin: 'chūzūchē', french: 'En taxi' },
          { id: 'B', label: 'B', hanzi: '飞机', pinyin: 'fēijī', french: 'En avion' },
          { id: 'C', label: 'C', hanzi: '火车', pinyin: 'huǒchē', french: 'En train' },
        ],
        correctChoiceId: 'B',
        dialogue: [
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '李老师，您明天怎么去北京？',
            pinyin: 'Lǐ Lǎoshī, nín míngtiān zěnme qù Běijīng?',
            french: 'Professeur Li, comment vous rendez-vous à Pékin demain ?',
            startMs: 0,
            endMs: 3200,
          },
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '我上午坐飞机去，下午到。',
            pinyin: 'Wǒ shàngwǔ zuò fēijī qù, xiàwǔ dào.',
            french: 'Je prends l’avion dans la matinée et j’arrive dans l’après-midi.',
            startMs: 3500,
            endMs: 6800,
          },
        ],
        explanationFr: 'Le professeur Li répond clairement : « 坐飞机去 » (j’y vais en avion). L’option correcte est donc B (飞机).',
        keyVocabulary: [
          { hanzi: '飞机', pinyin: 'fēijī', french: 'Avion' },
          { hanzi: '坐', pinyin: 'zuò', french: 'Prendre (un transport)' },
          { hanzi: '北京', pinyin: 'Běijīng', french: 'Pékin' },
        ],
      },
    ],
  },

  // =========================================================================
  // HSK 2 — SÉRIE 2 (Dialogues & Questions) : Animaux, météo et nourriture
  // Ancienne série 1 du HSK 1, déplacée en HSK 2 (08/10/2026) car elle emploie
  // du vocabulaire au-delà du HSK 1. Les identifiants (série, questions, audio)
  // sont conservés pour que les résultats déjà enregistrés restent rattachés.
  // =========================================================================
  {
    id: 'exercice_hsk1_serie_01',
    rubrique: 'dialogue_questions',
    orderInRubrique: 2,
    format: 'A',
    titleFr: 'Compréhension Orale HSK 2 — Série 2',
    titleZh: 'HSK 2级 听力专项练习（二）',
    level: 'HSK 2',
    orderInLevel: 2, // Gratuit
    duration: '~3 min',
    description: 'Repérage d’éléments essentiels du quotidien : animaux sous les meubles, météo et repas.',
    imageUrl: '/images/exercices/covers/hsk1_s1_opt3_bureau.jpg',
    date_publication: '2026-10-07',
    isTest: false,
    questions: [
      {
        id: 'hsk1_s01_q01',
        orderNumber: 1,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk1_s01_q01.mp3',
        question: {
          hanzi: '小猫在哪里？',
          pinyin: 'Xiǎomāo zài nǎlǐ?',
          french: 'Où est le petit chat ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '桌子上面', pinyin: 'zhuōzi shàngmian', french: 'Sur la table' },
          { id: 'B', label: 'B', hanzi: '椅子下面', pinyin: 'yǐzi xiàmiàn', french: 'Sous la chaise' },
          { id: 'C', label: 'C', hanzi: '门后面', pinyin: 'mén hòumiàn', french: 'Derrière la porte' },
        ],
        correctChoiceId: 'B',
        dialogue: [
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '你看见我的小猫了吗？',
            pinyin: 'Nǐ kànjiàn wǒ de xiǎomāo le ma?',
            french: 'As-tu vu mon petit chat ?',
            startMs: 0,
            endMs: 2800,
          },
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '在椅子下面呢。',
            pinyin: 'Zài yǐzi xiàmiàn ne.',
            french: 'Il est sous la chaise.',
            startMs: 3100,
            endMs: 5400,
          },
        ],
        explanationFr: 'L’homme indique clairement : « 在椅子下面呢 » (il est sous la chaise). La bonne réponse est donc B (椅子下面).',
        keyVocabulary: [
          { hanzi: '小猫', pinyin: 'xiǎomāo', french: 'Petit chat' },
          { hanzi: '椅子', pinyin: 'yǐzi', french: 'Chaise' },
          { hanzi: '下面', pinyin: 'xiàmiàn', french: 'En dessous / Sous' },
        ],
      },
      {
        id: 'hsk1_s01_q02',
        orderNumber: 2,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk1_s01_q02.mp3',
        question: {
          hanzi: '今天天气怎么样？',
          pinyin: 'Jīntiān tiānqì zěnme yàng?',
          french: 'Quel temps fait-il aujourd’hui ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '很热', pinyin: 'hěn rè', french: 'Très chaud' },
          { id: 'B', label: 'B', hanzi: '下雨了', pinyin: 'xiàyǔ le', french: 'Il pleut' },
          { id: 'C', label: 'C', hanzi: '下雪了', pinyin: 'xiàxuě le', french: 'Il neige' },
        ],
        correctChoiceId: 'C',
        dialogue: [
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '今天天气怎么样？冷不冷？',
            pinyin: 'Jīntiān tiānqì zěnme yàng? Lěng bù lěng?',
            french: 'Quel temps fait-il aujourd’hui ? Fait-il froid ?',
            startMs: 0,
            endMs: 3400,
          },
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '太冷了，外面下雪了。',
            pinyin: 'Tài lěng le, wàimiàn xiàxuě le.',
            french: 'Il fait trop froid, il neige dehors.',
            startMs: 3700,
            endMs: 6800,
          },
        ],
        explanationFr: 'La femme répond : « 外面下雪了 » (il neige dehors). La réponse correcte est C (下雪了).',
        keyVocabulary: [
          { hanzi: '天气', pinyin: 'tiānqì', french: 'Temps / Météo' },
          { hanzi: '下雪', pinyin: 'xiàxuě', french: 'Neiger' },
          { hanzi: '冷', pinyin: 'lěng', french: 'Froid' },
        ],
      },
      {
        id: 'hsk1_s01_q03',
        orderNumber: 3,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk1_s01_q03.mp3',
        question: {
          hanzi: '她喜欢吃什么？',
          pinyin: 'Tā xǐhuan chī shénme?',
          french: 'Qu’aime-t-elle manger ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '米饭', pinyin: 'mǐfàn', french: 'Du riz' },
          { id: 'B', label: 'B', hanzi: '面条', pinyin: 'miàntiáo', french: 'Des nouilles' },
          { id: 'C', label: 'C', hanzi: '苹果', pinyin: 'píngguǒ', french: 'Des pommes' },
        ],
        correctChoiceId: 'A',
        dialogue: [
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '我喜欢吃米饭，不喜欢吃面条。',
            pinyin: 'Wǒ xǐhuan chī mǐfàn, bù xǐhuan chī miàntiáo.',
            french: 'J’aime manger du riz, je n’aime pas manger des nouilles.',
            startMs: 0,
            endMs: 4200,
          },
        ],
        explanationFr: 'La locutrice affirme : « 我喜欢吃米饭 » (j’aime manger du riz). L’option exacte est A (米饭).',
        keyVocabulary: [
          { hanzi: '米饭', pinyin: 'mǐfàn', french: 'Riz (cuit)' },
          { hanzi: '面条', pinyin: 'miàntiáo', french: 'Nouilles' },
          { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'Aimer / Apprécier' },
        ],
      },
    ],
  },

  // =========================================================================
  // HSK 1 — SÉRIE 1 (Images & Dialogues) : Illustrations Style Examen HSK
  // (identifiant historique « serie_02 » conservé pour les résultats enregistrés)
  // =========================================================================
  {
    id: 'exercice_hsk1_serie_02',
    rubrique: 'matching',
    orderInRubrique: 1,
    format: 'B',
    titleFr: 'Images & Dialogues — Série 1',
    titleZh: 'HSK 1级 听力配对（一）',
    level: 'HSK 1',
    orderInLevel: 1, // Gratuit
    duration: '~3 min',
    description: 'Entraînement visuel et auditif immersif : association d’illustrations et dialogues courts.',
    imageUrl: '/images/exercices/hsk1/hsk1_b_test_p2_2.jpg',
    date_publication: '2026-10-07',
    isTest: false,
    questions: [
      // -----------------------------------------------------------------------
      // PARTIE 1 : Vrai ou Faux (Illustration Style Examen HSK + Mot)
      // -----------------------------------------------------------------------
      {
        id: 'hsk1_s02_p01',
        orderNumber: 1,
        type: 'true_false',
        imageUrl: '/images/exercices/hsk1/hsk1_b_test_p2_2.jpg',
        imageAlt: 'Photo d’une personne qui lit un livre',
        audioUrl: '/audio/exercices/hsk1_s02_p01.mp3',
        speakerGender: 'female',
        audioText: {
          hanzi: '看书。',
          pinyin: 'Kànshū.',
          french: 'Lire un livre.',
        },
        correctValue: true,
        explanationFr: 'Le mot prononcé est « 看书 » (kànshū, lire un livre), ce qui correspond à la photo de la personne qui lit. La réponse est donc Vrai.',
        keyVocabulary: [
          { hanzi: '看书', pinyin: 'kànshū', french: 'Lire un livre' },
        ],
      },

      // -----------------------------------------------------------------------
      // PARTIE 2 : Association 3 Dialogues <-> 3 Illustrations Style HSK
      // -----------------------------------------------------------------------
      {
        id: 'hsk1_s02_p02',
        orderNumber: 2,
        type: 'matching_images',
        images: [
          {
            id: 'img_res_a1',
            imageUrl: '/images/exercices/hsk1/hsk1_b_test_p2_1.jpg',
            altText: 'Illustration A : Une personne qui boit du thé',
          },
          {
            id: 'img_res_b2',
            imageUrl: '/images/exercices/hsk1/hsk1_b_test_p1.jpg',
            altText: 'Illustration B : Un chat sur une chaise',
          },
          {
            id: 'img_res_c3',
            imageUrl: '/images/exercices/hsk1/hsk1_b_test_p2_3.jpg',
            altText: 'Illustration C : Une personne qui écrit des caractères',
          },
        ],
        dialogues: [
          {
            id: 'dlg_alpha',
            audioUrl: '/audio/exercices/hsk1_s02_p02_dlg1.mp3',
            dialogue: [
              {
                speakerLabel: '男',
                speakerGender: 'male',
                hanzi: '你在做什么？',
                pinyin: 'Nǐ zài zuò shénme?',
                french: 'Que fais-tu ?',
              },
              {
                speakerLabel: '女',
                speakerGender: 'female',
                hanzi: '我在写字。',
                pinyin: 'Wǒ zài xiězì.',
                french: 'J’écris des caractères.',
              },
            ],
          },
          {
            id: 'dlg_beta',
            audioUrl: '/audio/exercices/hsk1_s02_p02_dlg2.mp3',
            dialogue: [
              {
                speakerLabel: '男',
                speakerGender: 'male',
                hanzi: '你喝什么？',
                pinyin: 'Nǐ hē shénme?',
                french: 'Que bois-tu ?',
              },
              {
                speakerLabel: '女',
                speakerGender: 'female',
                hanzi: '我喝茶。',
                pinyin: 'Wǒ hē chá.',
                french: 'Je bois du thé.',
              },
            ],
          },
          {
            id: 'dlg_gamma',
            audioUrl: '/audio/exercices/hsk1_s02_p02_dlg3.mp3',
            dialogue: [
              {
                speakerLabel: '男',
                speakerGender: 'male',
                hanzi: '小猫在哪里？',
                pinyin: 'Xiǎomāo zài nǎlǐ?',
                french: 'Où est le petit chat ?',
              },
              {
                speakerLabel: '女',
                speakerGender: 'female',
                hanzi: '小猫在椅子上。',
                pinyin: 'Xiǎomāo zài yǐzi shàng.',
                french: 'Le petit chat est sur la chaise.',
              },
            ],
          },
        ],
        correctMatches: {
          dlg_alpha: 'img_res_c3', // Dialogue 1 -> Illustration C (Écrire)
          dlg_beta: 'img_res_a1',  // Dialogue 2 -> Illustration A (Boire du thé)
          dlg_gamma: 'img_res_b2', // Dialogue 3 -> Illustration B (Chat)
        },
        explanationFr: 'Dialogue 1 correspond à l’illustration C (« 写字 », écrire). Dialogue 2 correspond à l’illustration A (« 喝茶 », boire du thé). Dialogue 3 correspond à l’illustration B (« 小猫在椅子上 », le chat sur la chaise).',
        keyVocabulary: [
          { hanzi: '写字', pinyin: 'xiězì', french: 'Écrire des caractères' },
          { hanzi: '喝茶', pinyin: 'hē chá', french: 'Boire du thé' },
          { hanzi: '猫', pinyin: 'māo', french: 'Chat' },
        ],
      },

      // -----------------------------------------------------------------------
      // PARTIE 3 : Dialogue + Question + 3 Choix
      // -----------------------------------------------------------------------
      {
        id: 'hsk1_s02_p03',
        orderNumber: 3,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk1_s02_p03.mp3',
        question: {
          hanzi: '女的喜欢喝什么？',
          pinyin: 'Nǚ de xǐhuan hē shénme?',
          french: 'Qu’est-ce que la femme aime boire ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '咖啡', pinyin: 'kāfēi', french: 'Du café' },
          { id: 'B', label: 'B', hanzi: '茶', pinyin: 'chá', french: 'Du thé' },
          { id: 'C', label: 'C', hanzi: '水', pinyin: 'shuǐ', french: 'De l’eau' },
        ],
        correctChoiceId: 'B',
        dialogue: [
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '你喝茶还是喝咖啡？',
            pinyin: 'Nǐ hē chá háishì hē kāfēi?',
            french: 'Tu bois du thé ou du café ?',
          },
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '我喝茶。我不喜欢咖啡。',
            pinyin: 'Wǒ hē chá. Wǒ bù xǐhuan kāfēi.',
            french: 'Je bois du thé. Je n’aime pas le café.',
          },
        ],
        explanationFr: 'La femme indique nettement : « 我喝茶。我不喜欢咖啡。 » (Je bois du thé. Je n’aime pas le café). La bonne réponse est B (茶).',
        keyVocabulary: [
          { hanzi: '喝茶', pinyin: 'hē chá', french: 'Boire du thé' },
          { hanzi: '咖啡', pinyin: 'kāfēi', french: 'Café' },
          { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'Aimer / Apprécier' },
        ],
      },
    ],
  },

  // =========================================================================
  // HSK 1 — SÉRIE 1 (Dialogues & Questions) : Famille, horaires et achats de livres
  // (identifiant historique « serie_03 » conservé pour les résultats enregistrés)
  // =========================================================================
  {
    id: 'exercice_hsk1_serie_03',
    rubrique: 'dialogue_questions',
    orderInRubrique: 1,
    format: 'A',
    titleFr: 'Dialogues & Questions — Série 1',
    titleZh: 'HSK 1级 对话理解（一）',
    level: 'HSK 1',
    orderInLevel: 2, // Gratuit
    duration: '~3 min',
    description: 'Dialogues sur les personnes de l’entourage, les heures d’école et les achats simples.',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    date_publication: '2026-10-07',
    isTest: false,
    questions: [
      {
        id: 'hsk1_s03_q01',
        orderNumber: 1,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk1_s03_q01.mp3',
        question: {
          hanzi: '这个人是谁？',
          pinyin: 'Zhè ge rén shì shéi?',
          french: 'Qui est cette personne ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '我爸爸', pinyin: 'wǒ bàba', french: 'Mon père' },
          { id: 'B', label: 'B', hanzi: '我老师', pinyin: 'wǒ lǎoshī', french: 'Mon professeur' },
          { id: 'C', label: 'C', hanzi: '我朋友', pinyin: 'wǒ péngyou', french: 'Mon ami' },
        ],
        correctChoiceId: 'A',
        dialogue: [
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '照片上的男人是谁？',
            pinyin: 'Zhàopiàn shang de nánrén shì shéi?',
            french: 'Qui est l’homme sur la photo ?',
          },
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '这是我爸爸，他是医生。',
            pinyin: 'Zhè shì wǒ bàba, tā shì yīshēng.',
            french: 'C’est mon père, il est médecin.',
          },
        ],
        explanationFr: 'L’homme indique : « 这是我爸爸 » (c’est mon père). La bonne réponse est A (我爸爸).',
        keyVocabulary: [
          { hanzi: '爸爸', pinyin: 'bàba', french: 'Papa / Père' },
          { hanzi: '医生', pinyin: 'yīshēng', french: 'Médecin' },
          { hanzi: '照片', pinyin: 'zhàopiàn', french: 'Photo' },
        ],
      },
      {
        id: 'hsk1_s03_q02',
        orderNumber: 2,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk1_s03_q02.mp3',
        question: {
          hanzi: '他什么时候去学校？',
          pinyin: 'Tā shénme shíhou qù xuéxiào?',
          french: 'Quand va-t-il à l’école ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '上午八点', pinyin: 'shàngwǔ bā diǎn', french: 'À 8h du matin' },
          { id: 'B', label: 'B', hanzi: '下午三点', pinyin: 'xiàwǔ sān diǎn', french: 'À 15h de l’après-midi' },
          { id: 'C', label: 'C', hanzi: '晚上七点', pinyin: 'wǎnshang qī diǎn', french: 'À 19h du soir' },
        ],
        correctChoiceId: 'A',
        dialogue: [
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '你明天什么时候去学校？',
            pinyin: 'Nǐ míngtiān shénme shíhou qù xuéxiào?',
            french: 'À quel moment vas-tu à l’école demain ?',
          },
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '我上午八点去。',
            pinyin: 'Wǒ shàngwǔ bā diǎn qù.',
            french: 'J’y vais à huit heures du matin.',
          },
        ],
        explanationFr: 'L’homme répond précisément : « 上午八点去 » (à huit heures du matin). La bonne réponse est A.',
        keyVocabulary: [
          { hanzi: '上午', pinyin: 'shàngwǔ', french: 'Matin / Matinée' },
          { hanzi: '学校', pinyin: 'xuéxiào', french: 'École' },
          { hanzi: '什么时候', pinyin: 'shénme shíhou', french: 'Quand / À quel moment' },
        ],
      },
      {
        id: 'hsk1_s03_q03',
        orderNumber: 3,
        type: 'choice',
        audioUrl: '/audio/exercices/hsk1_s03_q03.mp3',
        question: {
          hanzi: '他们想买什么？',
          pinyin: 'Tāmen xiǎng mǎi shénme?',
          french: 'Que veulent-ils acheter ?',
        },
        choices: [
          { id: 'A', label: 'A', hanzi: '衣服', pinyin: 'yīfu', french: 'Des vêtements' },
          { id: 'B', label: 'B', hanzi: '汉语书', pinyin: 'Hànyǔ shū', french: 'Des livres de chinois' },
          { id: 'C', label: 'C', hanzi: '水果', pinyin: 'shuǐguǒ', french: 'Des fruits' },
        ],
        correctChoiceId: 'B',
        dialogue: [
          {
            speakerLabel: '男',
            speakerGender: 'male',
            hanzi: '你想买几本书？',
            pinyin: 'Nǐ xiǎng mǎi jǐ běn shū?',
            french: 'Combien de livres souhaites-tu acheter ?',
          },
          {
            speakerLabel: '女',
            speakerGender: 'female',
            hanzi: '我想买三本汉语书。',
            pinyin: 'Wǒ xiǎng mǎi sān běn Hànyǔ shū.',
            french: 'Je voudrais acheter trois livres de chinois.',
          },
        ],
        explanationFr: 'La femme précise : « 三本汉语书 » (trois livres de chinois). La bonne réponse est B (汉语书).',
        keyVocabulary: [
          { hanzi: '汉语', pinyin: 'Hànyǔ', french: 'Langue chinoise' },
          { hanzi: '书', pinyin: 'shū', french: 'Livre' },
          { hanzi: '买', pinyin: 'mǎi', french: 'Acheter' },
        ],
      },
    ],
  },
];

const EN_DEVELOPPEMENT = process.env.NODE_ENV !== 'production';

/**
 * Une série est-elle visible ? Les séries de test et les séries dont la date
 * de publication n'est pas encore atteinte restent masquées en production
 * (elles restent prévisualisables en local).
 */
function estVisible(set: ServerExerciseSet): boolean {
  if (EN_DEVELOPPEMENT) return true;
  return !set.isTest && estSeriePubliee(set.date_publication);
}

/**
 * Récupère une série visible par ID (côté serveur).
 */
export function getServerExerciseSet(exerciseId: string): ServerExerciseSet | null {
  const found = SERVER_EXERCISES_CATALOG.find((s) => s.id === exerciseId);
  return found && estVisible(found) ? found : null;
}

/**
 * Retrouve une question et sa série (visible) à partir de l'identifiant de question.
 */
export function getServerQuestion(
  questionId: string
): { set: ServerExerciseSet; question: ServerExerciseQuestion } | null {
  for (const set of SERVER_EXERCISES_CATALOG) {
    if (!estVisible(set)) continue;
    const question = set.questions.find((q) => q.id === questionId);
    if (question) return { set, question };
  }
  return null;
}

/** La série est-elle gratuite (dans le quota par rubrique défini dans configRubriques.ts) ? */
export function estSerieGratuite(set: ServerExerciseSet): boolean {
  return serieExerciceAccessible(set.orderInRubrique || set.orderInLevel, false, set.rubrique);
}

/**
 * Projette une série pour le client en masquant les réponses et transcriptions.
 * Le texte des répliques n'est transmis que s'il n'existe pas de fichier audio
 * (il sert alors à la synthèse vocale de secours) : sinon il donnerait la réponse.
 */
export function toClientExerciseSet(set: ServerExerciseSet): ClientExerciseSet {
  return {
    id: set.id,
    rubrique: set.rubrique || 'dialogue_questions',
    orderInRubrique: set.orderInRubrique || 1,
    format: set.format || 'A',
    titleFr: set.titleFr,
    titleZh: set.titleZh,
    level: set.level,
    orderInLevel: set.orderInLevel,
    isGratuit: estSerieGratuite(set),
    duration: set.duration,
    questionCount: set.questions.length,
    description: set.description,
    imageUrl: set.imageUrl,
    date_publication: set.date_publication,
    isTest: set.isTest,
    questions: set.questions.map((q) => {
      const qType: ExerciseQuestionType = q.type || 'choice';

      if (qType === 'true_false') {
        return {
          id: q.id,
          orderNumber: q.orderNumber,
          type: 'true_false',
          imageUrl: q.imageUrl,
          imageAlt: q.imageAlt,
          audioUrl: q.audioUrl,
          audioSequence: q.audioText && !q.audioUrl ? [
            {
              speakerGender: q.speakerGender || 'female',
              text: q.audioText.hanzi,
              isQuestion: false,
            }
          ] : [],
          promptFr: 'L’illustration correspond-elle au mot ou à la phrase entendue ?',
        };
      }

      if (qType === 'matching_images') {
        return {
          id: q.id,
          orderNumber: q.orderNumber,
          type: 'matching_images',
          images: (q.images || []).map((img) => ({
            id: img.id,
            imageUrl: img.imageUrl,
            altText: img.altText,
          })),
          dialogues: (q.dialogues || []).map((d) => ({
            id: d.id,
            audioUrl: d.audioUrl,
            audioSequence: d.audioUrl
              ? []
              : d.dialogue.map((dl) => ({
                  speakerGender: dl.speakerGender,
                  text: dl.hanzi,
                  isQuestion: false,
                })),
          })),
        };
      }

      // Type 'choice' (par défaut)
      const dialogueLines = q.dialogue || [];
      const isMonologue = dialogueLines.length === 1;
      // Voix de la question différente de celle du monologue ; voix masculine après un dialogue.
      const questionGender: 'male' | 'female' =
        isMonologue && dialogueLines[0].speakerGender === 'male' ? 'female' : 'male';

      return {
        id: q.id,
        orderNumber: q.orderNumber,
        type: 'choice',
        audioUrl: q.audioUrl,
        audioSequence: [
          ...(q.audioUrl
            ? []
            : dialogueLines.map((d) => ({
                speakerGender: d.speakerGender,
                text: d.hanzi,
                isQuestion: false,
              }))),
          // La question est de toute façon affichée à l'écran : elle peut être transmise.
          ...(q.question ? [{
            speakerGender: questionGender,
            text: q.question.hanzi,
            isQuestion: true,
          }] : []),
        ],
        question: q.question,
        choices: q.choices || [],
      };
    }),
  };
}

/**
 * Catalogue public : uniquement les informations descriptives des séries
 * visibles, sans aucune question (elles ne sont transmises qu'au démarrage,
 * après contrôle de l'accès).
 */
export function getClientExercisesCatalog(): ClientExerciseSet[] {
  return SERVER_EXERCISES_CATALOG
    .filter(estVisible)
    // Ordre d'affichage : par niveau, puis par rang dans le niveau.
    .sort((a, b) => a.level.localeCompare(b.level) || a.orderInLevel - b.orderInLevel)
    .map((s) => ({ ...toClientExerciseSet(s), questions: [] }));
}
