'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Headphones, 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  BookOpen, 
  Eye, 
  EyeOff, 
  Bookmark, 
  Check, 
  Clock, 
  Radio, 
  Newspaper, 
  BookMarked, 
  MessagesSquare,
  Music,
  CheckCircle2,
  Sparkles,
  Users,
  Layers,
  Languages
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePreferences } from '@/context/PreferencesContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { fetchContentProgress, toggleContentCompletedInDb } from '@/lib/services/progressService';

export type ContentType = 'podcasts' | 'histoires' | 'articles' | 'dialogues' | 'chansons';

export interface DialogueCharacter {
  name: string;
  nameZh?: string;
  pinyin?: string;
  role: string;
  description: string;
  color?: 'violet' | 'turquoise' | 'neutral';
}

export interface ReadingSentence {
  id: string;
  speaker?: string;
  speakerRole?: string;
  speakerColor?: 'violet' | 'turquoise' | 'neutral'; // Distinct color coding per character
  section?: string; // e.g. "Refrain", "Couplet", "Pré-refrain"
  isRefrain?: boolean;
  hanzi: string;
  pinyin: string;
  french: string;
}

export interface ArticleEpisode {
  id: string;
  episodeNumber: number;
  titleFr: string;
  titleZh: string;
  titlePinyin: string;
  duration: string;
  description: string;
  imageUrl?: string;
  sentences: ReadingSentence[];
}

export interface ReadingItem {
  id: string;
  titleFr: string; // Titre 100% en français pour le catalogue
  titleZh: string; // Titre en caractères chinois
  titlePinyin?: string; // Pinyin du titre
  type: ContentType;
  level: string; // "HSK 1", "HSK 2", "HSK 3", etc.
  duration: string;
  description: string;
  imageUrl: string; // Image thématique haute résolution Unsplash
  iconBg: string;
  youtubeId?: string;
  artist?: string;
  author?: string; // Pour les articles exclusifs rédigés par Espoir Chinois
  seriesEpisodes?: ArticleEpisode[]; // Série d'articles regroupés (3 articles complets)
  characters?: DialogueCharacter[]; // Liste des personnages du dialogue ou de l'histoire
  sentences: ReadingSentence[];
}

// Progressive color helper according to HSK level difficulty
export function getLevelBadgeStyle(level: string) {
  if (level.includes('1')) {
    return 'bg-[#00BFA5]/90 text-white border border-white/30 font-black shadow-xs';
  }
  if (level.includes('2')) {
    return 'bg-[#0288D1]/90 text-white border border-white/30 font-black shadow-xs';
  }
  if (level.includes('3')) {
    return 'bg-[#6200EE]/90 text-white border border-white/30 font-black shadow-xs';
  }
  if (level.includes('4')) {
    return 'bg-[#3F51B5]/90 text-white border border-white/30 font-black shadow-xs';
  }
  if (level.includes('5')) {
    return 'bg-[#8E24AA]/90 text-white border border-white/30 font-black shadow-xs';
  }
  if (level.includes('6')) {
    return 'bg-gradient-to-r from-[#D81B60] to-[#8E24AA] text-white font-black shadow-md border border-white/30';
  }
  return 'bg-[#00897B]/90 text-white border border-white/30 font-black shadow-xs';
}

export const readingCatalog: ReadingItem[] = [
  // ================= 1. ARTICLES & LEÇONS ÉCRITES (HSK 1) =================
  {
    id: 'article_podcast_2',
    titleFr: 'Les Clés des Affaires en Chine',
    titleZh: '在中国做生意',
    titlePinyin: 'Zài Zhōngguó Zuò Shēngyi',
    type: 'articles',
    level: 'HSK 1',
    duration: '3 min 10',
    description: 'Comprendre l’importance du premier contact et la politesse dans les échanges commerciaux.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      {
        id: 'pod2_1',
        hanzi: '在中国，第一次见面递名片要用双手。',
        pinyin: 'Zài Zhōngguó, dì yī cì jiànmiàn dì míngpiàn yào yòng shuāngshǒu.',
        french: 'En Chine, tendez votre carte de visite à deux mains lors de la première rencontre.',
      },
      {
        id: 'pod2_2',
        hanzi: '这是尊重的表现，非常重要。',
        pinyin: 'Zhè shì zūnzhòng de biǎoxiàn, fēicháng zhòngyào.',
        french: 'C’est une marque de respect essentielle.',
      },
      {
        id: 'pod2_3',
        hanzi: '你可以说：这是我的名片，请多关照。',
        pinyin: 'Nǐ kěyǐ shuō: Zhè shì wǒ de míngpiàn, qǐng duō guānzhào.',
        french: 'Vous pouvez dire : Voici ma carte de visite, enchanté de faire affaire avec vous.',
      },
      {
        id: 'pod2_4',
        hanzi: '对方会觉得你很有礼貌，合作会更顺利。',
        pinyin: 'Duìfāng huì juéde nǐ hěn yǒu lǐmào, hézuò huì gèng shùnlì.',
        french: 'Votre interlocuteur vous trouvera poli et la coopération sera plus fluide.',
      },
    ],
  },
  {
    id: 'article_1',
    titleFr: 'La Culture du Thé en Chine',
    titleZh: '中国茶文化',
    titlePinyin: 'Zhōngguó Chá Wénhuà',
    type: 'articles',
    level: 'HSK 1',
    duration: '2 min 20',
    description: 'Découvrez la tradition millénaire du thé vert et du thé noir lors des rendez-vous professionnels.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      {
        id: 'a1_1',
        hanzi: '中国人非常喜欢喝茶。',
        pinyin: 'Zhōngguórén fēicháng xǐhuan hē chá.',
        french: 'Les Chinois aiment beaucoup boire du thé.',
      },
      {
        id: 'a1_2',
        hanzi: '绿茶、红茶和乌龙茶都很有名。',
        pinyin: 'Lǜchá, hóngchá hé wūlóngchá dōu hěn yǒumíng.',
        french: 'Le thé vert, le thé noir et le thé Oolong sont très réputés.',
      },
      {
        id: 'a1_3',
        hanzi: '在公司开会前，大家会一起喝热茶。',
        pinyin: 'Zài gōngsī kāihuì qián, dàjiā huì yīqǐ hē rè chá.',
        french: 'Avant les réunions d’entreprise, on partage souvent du thé chaud.',
      },
      {
        id: 'a1_4',
        hanzi: '喝茶能让人放松，也能促进合作。',
        pinyin: 'Hē chá néng ràng rén fàngsōng, yě néng cùjìn hézuò.',
        french: 'Le thé détend les esprits et favorise une coopération harmonieuse.',
      },
    ],
  },
  {
    id: 'article_2',
    titleFr: 'L’Importance des Nombres en Chine',
    titleZh: '数字的意义',
    titlePinyin: 'Shùzì de Yìyì',
    type: 'articles',
    level: 'HSK 1',
    duration: '2 min 00',
    description: 'Pourquoi le 8 et le 6 sont synonymes de prospérité et de réussite en affaires.',
    imageUrl: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      {
        id: 'a2_1',
        hanzi: '在中国文化中，数字有特别的意思。',
        pinyin: 'Zài Zhōngguó wénhuà zhōng, shùzì yǒu tèbié de yìsi.',
        french: 'Dans la culture chinoise, les chiffres ont une signification particulière.',
      },
      {
        id: 'a2_2',
        hanzi: '数字八代表发财，大家都很喜欢。',
        pinyin: 'Shùzì bā dàibiǎo fācái, dàjiā dōu hěn xǐhuan.',
        french: 'Le chiffre huit (8) symbolise la richesse et la prospérité.',
      },
      {
        id: 'a2_3',
        hanzi: '数字六代表顺利，生意兴隆。',
        pinyin: 'Shùzì liù dàibiǎo shùnlì, shēngyì xīnglóng.',
        french: 'Le chiffre six (6) symbolise la fluidité et la réussite des affaires.',
      },
    ],
  },

  // ================= 2. HISTOIRES COURTES (HSK 1) =================
  {
    id: 'histoire_1',
    titleFr: 'Une Journée à Pékin',
    titleZh: '在北京的一天',
    titlePinyin: 'Zài Běijīng de Yì Tiān',
    type: 'histoires',
    level: 'HSK 1',
    duration: '2 min 15',
    description: 'Suivez le quotidien d’un voyageur francophone qui découvre la capitale chinoise et ses saveurs.',
    imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'David',
        nameZh: '大卫',
        pinyin: 'Dàwèi',
        role: 'Voyageur',
        description: 'Voyageur francophone découvrant Pékin, ses monuments et ses spécialités culinaires.',
        color: 'violet'
      },
      {
        name: '服务员',
        nameZh: '服务员',
        pinyin: 'Fúwùyuán',
        role: 'Serveur',
        description: 'Serveur chaleureux du restaurant traditionnel qui accueille David avec bienveillance.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'h1_1',
        speaker: 'David',
        speakerRole: 'Voyageur',
        speakerColor: 'violet',
        hanzi: '早上七点，大卫起床了。',
        pinyin: 'Zǎoshang qī diǎn, Dàwèi qǐchuáng le.',
        french: 'À sept heures du matin, David s’est levé.',
      },
      {
        id: 'h1_2',
        speaker: 'David',
        speakerRole: 'Voyageur',
        speakerColor: 'violet',
        hanzi: '天气很好，阳光很温暖。',
        pinyin: 'Tiānqì hěn hǎo, yángguāng hěn wēnnuǎn.',
        french: 'Il fait très beau et le soleil est doux.',
      },
      {
        id: 'h1_3',
        speaker: 'David',
        speakerRole: 'Voyageur',
        speakerColor: 'violet',
        hanzi: '他去饭店喝茶，吃中国包子。',
        pinyin: 'Tā qù fàndiàn hē chá, chī Zhōngguó bāozi.',
        french: 'Il va au restaurant boire du thé et manger des baozi chinois.',
      },
      {
        id: 'h1_4',
        speaker: '服务员',
        speakerRole: 'Serveur',
        speakerColor: 'turquoise',
        hanzi: '服务员热情地说：“欢迎您来北京！”',
        pinyin: 'Fúwùyuán rèqíng de shuō: “Huānyíng nín lái Běijīng!”',
        french: 'Le serveur lui dit chaleureusement : « Bienvenue à Pékin ! »',
      },
      {
        id: 'h1_5',
        speaker: 'David',
        speakerRole: 'Voyageur',
        speakerColor: 'violet',
        hanzi: '大卫高兴地笑了，他说中文：“谢谢你！”',
        pinyin: 'Dàwèi gāoxìng de xiào le, tā shuō Zhōngwén: “Xièxie nǐ!”',
        french: 'David sourit joyeusement et répond en chinois : « Merci ! »',
      },
    ],
  },
  {
    id: 'histoire_2',
    titleFr: 'La Première Visite d’Usine',
    titleZh: '第一次去工厂',
    titlePinyin: 'Dì Yī Cì Qù Gōngchǎng',
    type: 'histoires',
    level: 'HSK 1',
    duration: '2 min 50',
    description: 'Une visite enrichissante dans un atelier de production à Yiwu pour contrôler des échantillons.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '李经理',
        nameZh: '李经理',
        pinyin: 'Lǐ jīnglǐ',
        role: 'Responsable Usine',
        description: 'Directeur de l’usine guidant la visite des ateliers et présentant les échantillons aux clients.',
        color: 'turquoise'
      },
      {
        name: 'Client Importateur',
        role: 'Acheteur',
        description: 'Acheteur international venu auditer les lignes de production et négocier le contrat.',
        color: 'violet'
      }
    ],
    sentences: [
      {
        id: 'h2_1',
        speaker: '李经理',
        speakerRole: 'Responsable Usine',
        speakerColor: 'turquoise',
        hanzi: '今天，李经理带客户参观工厂。',
        pinyin: 'Jīntiān, Lǐ jīnglǐ dài kèhù cānguān gōngchǎng.',
        french: 'Aujourd’hui, le directeur Li fait visiter l’usine à ses clients.',
      },
      {
        id: 'h2_2',
        speaker: '李经理',
        speakerRole: 'Responsable Usine',
        speakerColor: 'turquoise',
        hanzi: '工厂很大，工人们都在认真工作。',
        pinyin: 'Gōngchǎng hěn dà, gōngrénmen dōu zài rènzhēn gōngzuò.',
        french: 'L’usine est spacieuse et les ouvriers travaillent avec rigueur.',
      },
      {
        id: 'h2_3',
        speaker: 'Client Importateur',
        speakerRole: 'Acheteur',
        speakerColor: 'violet',
        hanzi: '客户看了样品，非常满意。',
        pinyin: 'Kèhù kàn le yàngpǐn, fēicháng mǎnyì.',
        french: 'Le client examine les échantillons et est très satisfait.',
      },
      {
        id: 'h2_4',
        speaker: '李经理',
        speakerRole: 'Responsable Usine',
        speakerColor: 'turquoise',
        hanzi: '他们喝了乌龙茶，约定明天签合同。',
        pinyin: 'Tāmen hē le wūlóngchá, yuēdìng míngtiān qiān hétong.',
        french: 'Ils boivent du thé Oolong et conviennent de signer le contrat demain.',
      },
    ],
  },

  // ================= 3. DIALOGUES AVEC PERSONNAGES DÉTAILLÉS & COULEURS DISTINCTES =================
  {
    id: 'dialogue_1',
    titleFr: 'Salutations Professionnelles',
    titleZh: '商务问候',
    titlePinyin: 'Shāngwù Wènhòu',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '1 min 45',
    description: 'Dialogue d’accueil classique entre un partenaire d’affaires et un directeur d’usine chinois.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'Espoir Chinois',
        role: 'Partenaire commercial',
        description: 'Venu en Chine visiter les installations de fabrication pour négocier un partenariat et passer commande.',
        color: 'violet'
      },
      {
        name: '王总',
        nameZh: '王总',
        pinyin: 'Wáng zǒng',
        role: 'Directeur d’Usine',
        description: 'Directeur général de l’usine partenaire, accueille son invité avec le thé traditionnel et lui présente le catalogue.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'd1_1',
        speaker: 'Espoir Chinois',
        speakerRole: 'Partenaire',
        speakerColor: 'violet',
        hanzi: '王总，您好！很高兴见到您。',
        pinyin: 'Wáng zǒng, nín hǎo! Hěn gāoxìng jiàn dào nín.',
        french: 'Directeur Wang, bonjour ! Très heureux de vous rencontrer.',
      },
      {
        id: 'd1_2',
        speaker: '王总',
        speakerRole: 'Directeur d’Usine',
        speakerColor: 'turquoise',
        hanzi: '您好！欢迎来到我们公司，请坐，请喝茶。',
        pinyin: 'Nín hǎo! Huānyíng lái dào wǒmen gōngsī, qǐng zuò, qǐng hē chá.',
        french: 'Bonjour ! Bienvenue dans notre entreprise, asseyez-vous et prenez du thé.',
      },
      {
        id: 'd1_3',
        speaker: 'Espoir Chinois',
        speakerRole: 'Partenaire',
        speakerColor: 'violet',
        hanzi: '谢谢王总，您太客气了。',
        pinyin: 'Xièxie Wáng zǒng, nín tài kèqi le.',
        french: 'Merci Directeur Wang, vous êtes trop aimable.',
      },
      {
        id: 'd1_4',
        speaker: '王总',
        speakerRole: 'Directeur d’Usine',
        speakerColor: 'turquoise',
        hanzi: '不客气！我们先看一下产品目录吧。',
        pinyin: 'Bù kèqi! Wǒmen xiān kàn yíxià chǎnpǐn mùlù ba.',
        french: 'Je vous en prie ! Regardons d’abord le catalogue des produits.',
      },
    ],
  },
  {
    id: 'dialogue_2',
    titleFr: 'Demander le Prix au Marché',
    titleZh: '在市场问价格',
    titlePinyin: 'Zài Shìchǎng Wèn Jiàgé',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '2 min 00',
    description: 'Négocier simplement les tarifs et volumes d’achats sur les marchés chinois.',
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'Katia',
        role: 'Acheteuse',
        description: 'Acheteuse française venue au marché de gros pour négocier des volumes et obtenir le meilleur tarif unitaire pour sa boutique.',
        color: 'violet'
      },
      {
        name: '摊主',
        nameZh: '摊主',
        pinyin: 'Tānzhǔ',
        role: 'Commerçant',
        description: 'Propriétaire du stand au marché, présente ses produits et accorde une remise pour un achat en lot de 100 pièces.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'd2_1',
        speaker: 'Katia',
        speakerRole: 'Acheteuse',
        speakerColor: 'violet',
        hanzi: '老板，请问这个多少钱一个？',
        pinyin: 'Lǎobǎn, qǐngwèn zhège duōshao qián yí gè?',
        french: 'Chef, combien coûte cet article à l’unité ?',
      },
      {
        id: 'd2_2',
        speaker: '摊主',
        speakerRole: 'Commerçant',
        speakerColor: 'turquoise',
        hanzi: '这个二十块钱一个。您要多少个？',
        pinyin: 'Zhège èrshí kuài qián yí gè. Nín yào duōshao gè?',
        french: 'Celui-ci fait 20 yuans pièce. Combien en souhaitez-vous ?',
      },
      {
        id: 'd2_3',
        speaker: 'Katia',
        speakerRole: 'Acheteuse',
        speakerColor: 'violet',
        hanzi: '如果我要一百个，可以便宜一点吗？',
        pinyin: 'Rúguǒ wǒ yào yībǎi gè, kěyǐ piányi yīdiǎn ma?',
        french: 'Si j’en prends 100, pouvez-vous faire un petit geste sur le prix ?',
      },
      {
        id: 'd2_4',
        speaker: '摊主',
        speakerRole: 'Commerçant',
        speakerColor: 'turquoise',
        hanzi: '可以，给您十五块一个！',
        pinyin: 'Kěyǐ, gěi nín shíwǔ kuài yí gè!',
        french: 'D’accord, je vous les fais à 15 yuans l’unité !',
      },
    ],
  },
  {
    id: 'dialogue_3',
    titleFr: 'Commander au Restaurant',
    titleZh: '在餐厅点菜',
    titlePinyin: 'Zài Cāntīng Diǎncài',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '2 min 10',
    description: 'Commander facilement ses plats de nouilles et ses boissons au restaurant.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'Brice',
        role: 'Client',
        description: 'Entrepreneur ivoirien en déplacement en Chine, s’arrête dans un restaurant local pour commander son repas du midi.',
        color: 'violet'
      },
      {
        name: '服务员',
        nameZh: '服务员',
        pinyin: 'Fúwùyuán',
        role: 'Serveur',
        description: 'Serveur du restaurant chinois, apporte promptement le menu et prend note de la commande de nouilles au bœuf.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'd3_1',
        speaker: 'Brice',
        speakerRole: 'Client',
        speakerColor: 'violet',
        hanzi: '服务员，请给我菜单。',
        pinyin: 'Fúwùyuán, qǐng gěi wǒ càidān.',
        french: 'Serveur, donnez-moi le menu svp.',
      },
      {
        id: 'd3_2',
        speaker: '服务员',
        speakerRole: 'Serveur',
        speakerColor: 'turquoise',
        hanzi: '好的，这是菜单。请问您想吃什么？',
        pinyin: 'Hǎo de, zhè shì càidān. Qǐngwèn nín xiǎng chī shénme?',
        french: 'Bien sûr, voici le menu. Que désirez-vous manger ?',
      },
      {
        id: 'd3_3',
        speaker: 'Brice',
        speakerRole: 'Client',
        speakerColor: 'violet',
        hanzi: '我要一碗牛肉面，和一瓶水。',
        pinyin: 'Wǒ yào yì wǎn niúròumiàn, hé yì píng shuǐ.',
        french: 'Je voudrais un bol de nouilles au bœuf et une bouteille d’eau.',
      },
      {
        id: 'd3_4',
        speaker: '服务员',
        speakerRole: 'Serveur',
        speakerColor: 'turquoise',
        hanzi: '好的，请稍等，马上来！',
        pinyin: 'Hǎo de, qǐng shāoděng, mǎshàng lái!',
        french: 'Très bien, patientez un instant, cela arrive tout de suite !',
      },
    ],
  },
  {
    id: 'dialogue_4',
    titleFr: 'Prendre le Taxi vers l’Hôtel',
    titleZh: '坐出租车去酒店',
    titlePinyin: 'Zuò Chūzūchē Qù Jiǔdiàn',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '2 min 30',
    description: 'Donner son adresse au chauffeur et demander la durée du trajet en toute confiance.',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'Espoir Chinois',
        role: 'Passager',
        description: 'Vient d’arriver à Pékin et prend un taxi pour se rendre à son hôtel tout en s’informant sur la durée de la course.',
        color: 'violet'
      },
      {
        name: '师傅',
        nameZh: '师傅',
        pinyin: 'Shīfu',
        role: 'Conducteur',
        description: 'Chauffeur de taxi pékinois expérimenté, invite son passager à bord en toute sécurité et estime le trajet à 15 minutes.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'd4_1',
        speaker: 'Espoir Chinois',
        speakerRole: 'Passager',
        speakerColor: 'violet',
        hanzi: '师傅，您好！我去北京饭店。',
        pinyin: 'Shīfu, nín hǎo! Wǒ qù Běijīng Fàndiàn.',
        french: 'Chauffeur, bonjour ! Je me rends à l’Hôtel de Pékin.',
      },
      {
        id: 'd4_2',
        speaker: '师傅',
        speakerRole: 'Conducteur',
        speakerColor: 'turquoise',
        hanzi: '好的，请上车，请系好安全带。',
        pinyin: 'Hǎo de, qǐng shàng chē, qǐng jì hǎo ānquándài.',
        french: 'D’accord, montez svp, et attachez votre ceinture.',
      },
      {
        id: 'd4_3',
        speaker: 'Espoir Chinois',
        speakerRole: 'Passager',
        speakerColor: 'violet',
        hanzi: '请问到酒店需要坐几分钟？',
        pinyin: 'Qǐngwèn dào jiǔdiàn xūyào zuò jǐ fēnzhōng?',
        french: 'Combien de minutes faut-il pour arriver à l’hôtel svp ?',
      },
      {
        id: 'd4_4',
        speaker: '师傅',
        speakerRole: 'Conducteur',
        speakerColor: 'turquoise',
        hanzi: '大约十五分钟就到了。',
        pinyin: 'Dàyuē shíwǔ fēnzhōng jiù dào le.',
        french: 'Il faut environ quinze minutes pour y être.',
      },
    ],
  },

  // ================= 4. CHANSONS CHINOISES CLASSIQUES & LYRICS COMPLETS (HSK 1 ➔ HSK 3) =================
  
  // ---------- NIVEAU HSK 1 ----------
  {
    id: 'chanson_moli',
    titleFr: 'Fleur de Jasmin',
    titleZh: '茉莉花',
    titlePinyin: 'Mòlihuā',
    type: 'chansons',
    level: 'HSK 1',
    duration: '2 min 50',
    artist: 'Chanson Folklorique Traditionnelle',
    youtubeId: 'ItPX_lJjyPE',
    description: 'La plus célèbre mélodie folklorique chinoise. Texte pur, vocabulaire élémentaire HSK 1 parfait pour la prononciation des tons.',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'ch3_1', section: 'Couplet 1', speaker: 'Chant Traditionnel', hanzi: '好一朵美丽的茉莉花', pinyin: 'Hǎo yì duǒ měilì de mòlihuā', french: 'Quelle ravissante fleur de jasmin' },
      { id: 'ch3_2', speaker: 'Chant Traditionnel', hanzi: '好一朵美丽的茉莉花', pinyin: 'Hǎo yì duǒ měilì de mòlihuā', french: 'Quelle ravissante fleur de jasmin' },
      { id: 'ch3_3', speaker: 'Chant Traditionnel', hanzi: '芬芳美丽满枝桠', pinyin: 'Fēnfāng měilì mǎn zhīyā', french: 'Parfumée et gracieuse sur la branche' },
      { id: 'ch3_4', speaker: 'Chant Traditionnel', hanzi: '又香又白人人夸', pinyin: 'Yòu xiāng yòu bái rén rén kuā', french: 'Si blanche et odorante, tous en font l’éloge' },
      { id: 'ch3_5', speaker: 'Chant Traditionnel', hanzi: '让我来将你摘下', pinyin: 'Ràng wǒ lái jiāng nǐ zhāi xià', french: 'Laisse-moi venir te cueillir' },
      { id: 'ch3_6', speaker: 'Chant Traditionnel', hanzi: '送给别人家', pinyin: 'Sòng gěi biérén jiā', french: 'Pour t’offrir à quelqu’un de cher' },
      { id: 'ch3_7', speaker: 'Chant Traditionnel', hanzi: '茉莉花呀茉莉花', pinyin: 'Mòlihuā ya mòlihuā', french: 'Ô fleur de jasmin, douce fleur de jasmin' },
      { id: 'ch3_8', section: 'Couplet 2', speaker: 'Chant Traditionnel', hanzi: '好一朵美丽的茉莉花', pinyin: 'Hǎo yì duǒ měilì de mòlihuā', french: 'Quelle ravissante fleur de jasmin' },
      { id: 'ch3_9', speaker: 'Chant Traditionnel', hanzi: '好一朵美丽的茉莉花', pinyin: 'Hǎo yì duǒ měilì de mòlihuā', french: 'Quelle ravissante fleur de jasmin' },
      { id: 'ch3_10', speaker: 'Chant Traditionnel', hanzi: '满园花草', pinyin: 'Mǎnyuán huācǎo', french: 'Dans tout le jardin fleuri' },
      { id: 'ch3_11', speaker: 'Chant Traditionnel', hanzi: '香也香不过它', pinyin: 'Xiāng yě xiāng búguò tā', french: 'Nulle fleur n’égale son parfum' },
      { id: 'ch3_12', speaker: 'Chant Traditionnel', hanzi: '我有心采下一朵戴', pinyin: 'Wǒ yǒuxīn cǎi xià yì duǒ dài', french: 'J’ai bien envie d’en cueillir une pour la porter' },
      { id: 'ch3_13', speaker: 'Chant Traditionnel', hanzi: '又怕看花的人儿骂', pinyin: 'Yòu pà kàn huā de rén’er mà', french: 'Mais je crains que le jardinier ne me gronde' },
      { id: 'ch3_14', speaker: 'Chant Traditionnel', hanzi: '茉莉花呀茉莉花', pinyin: 'Mòlihuā ya mòlihuā', french: 'Ô fleur de jasmin, précieuse fleur de jasmin' },
      { id: 'ch3_15', section: 'Couplet 3', speaker: 'Chant Traditionnel', hanzi: '好一朵美丽的茉莉花', pinyin: 'Hǎo yì duǒ měilì de mòlihuā', french: 'Quelle ravissante fleur de jasmin' },
      { id: 'ch3_16', speaker: 'Chant Traditionnel', hanzi: '好一朵美丽的茉莉花', pinyin: 'Hǎo yì duǒ měilì de mòlihuā', french: 'Quelle ravissante fleur de jasmin' },
      { id: 'ch3_17', speaker: 'Chant Traditionnel', hanzi: '满园花开', pinyin: 'Mǎnyuán huākāi', french: 'Toutes les fleurs écloses' },
      { id: 'ch3_18', speaker: 'Chant Traditionnel', hanzi: '比不过它', pinyin: 'Bǐ búguò tā', french: 'Ne rivalisent avec sa grâce' },
      { id: 'ch3_19', speaker: 'Chant Traditionnel', hanzi: '我有心采下一朵戴', pinyin: 'Wǒ yǒuxīn cǎi xià yì duǒ dài', french: 'J’aimerais en cueillir une pour la garder' },
      { id: 'ch3_20', speaker: 'Chant Traditionnel', hanzi: '又怕来年不发芽', pinyin: 'Yòu pà láinián bù fāyá', french: 'Mais je crains qu’elle ne bourgeonne plus l’an prochain' },
      { id: 'ch3_21', speaker: 'Chant Traditionnel', hanzi: '茉莉花呀茉莉花', pinyin: 'Mòlihuā ya mòlihuā', french: 'Ô fleur de jasmin, admirable fleur de jasmin' },
    ],
  },
  {
    id: 'chanson_tianmimi',
    titleFr: 'Doux comme le Miel',
    titleZh: '甜蜜蜜',
    titlePinyin: 'Tián Mì Mì',
    type: 'chansons',
    level: 'HSK 1',
    duration: '3 min 40',
    artist: 'Teresa Teng',
    youtubeId: 'tc2tW0jFHPo',
    description: 'Une des mélodies les plus douces et célèbres d’Asie. Paroles très faciles et répétitives idéales pour débutants HSK 1.',
    imageUrl: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'tm_1', section: 'Couplet 1', speaker: 'Teresa Teng', hanzi: '甜蜜蜜', pinyin: 'Tiánmìmì', french: 'Doux comme le miel' },
      { id: 'tm_2', speaker: 'Teresa Teng', hanzi: '你笑得甜蜜蜜', pinyin: 'Nǐ xiào de tiánmìmì', french: 'Ton sourire est doux comme le miel' },
      { id: 'tm_3', speaker: 'Teresa Teng', hanzi: '好像花儿开在春风里', pinyin: 'Hǎoxiàng huā’er kāi zài chūnfēng lǐ', french: 'Comme une fleur qui éclot dans la brise printanière' },
      { id: 'tm_4', speaker: 'Teresa Teng', hanzi: '开在春风里', pinyin: 'Kāi zài chūnfēng lǐ', french: 'Éclose dans la douce brise de printemps' },
      { id: 'tm_5', speaker: 'Teresa Teng', hanzi: '在哪里', pinyin: 'Zài nǎlǐ', french: 'Où donc ?' },
      { id: 'tm_6', speaker: 'Teresa Teng', hanzi: '在哪里见过你', pinyin: 'Zài nǎlǐ jiàn guò nǐ', french: 'Où t’ai-je déjà rencontré ?' },
      { id: 'tm_7', speaker: 'Teresa Teng', hanzi: '你的笑容这样熟悉', pinyin: 'Nǐ de xiàoróng zhèyàng shúxī', french: 'Ton sourire m’est tellement familier' },
      { id: 'tm_8', speaker: 'Teresa Teng', hanzi: '我一时想不起', pinyin: 'Wǒ yìshí xiǎng bù qǐ', french: 'Je n’arrive pas à m’en souvenir sur l’instant' },
      { id: 'tm_9', section: 'Refrain', speaker: 'Teresa Teng', hanzi: '啊', pinyin: 'A', french: 'Ah !' },
      { id: 'tm_10', speaker: 'Teresa Teng', hanzi: '在梦里', pinyin: 'Zài mèng lǐ', french: 'Dans un rêve !' },
      { id: 'tm_11', speaker: 'Teresa Teng', hanzi: '梦里', pinyin: 'Mèng lǐ', french: 'En rêve' },
      { id: 'tm_12', speaker: 'Teresa Teng', hanzi: '梦里见过你', pinyin: 'Mèng lǐ jiàn guò nǐ', french: 'Dans mes rêves je t’ai rencontré' },
      { id: 'tm_13', speaker: 'Teresa Teng', hanzi: '甜蜜', pinyin: 'Tiánmì', french: 'Si doux' },
      { id: 'tm_14', speaker: 'Teresa Teng', hanzi: '笑容多甜蜜', pinyin: 'Xiàoróng duō tiánmì', french: 'Quel sourire merveilleusement doux' },
      { id: 'tm_15', speaker: 'Teresa Teng', hanzi: '是你', pinyin: 'Shì nǐ', french: 'C’est toi' },
      { id: 'tm_16', speaker: 'Teresa Teng', hanzi: '是你', pinyin: 'Shì nǐ', french: 'C’est bien toi' },
      { id: 'tm_17', speaker: 'Teresa Teng', hanzi: '梦见的就是你', pinyin: 'Mèng jiàn de jiù shì nǐ', french: 'C’est bien toi dont j’avais rêvé' },
      { id: 'tm_18', speaker: 'Teresa Teng', hanzi: '在哪里', pinyin: 'Zài nǎlǐ', french: 'Où donc ?' },
      { id: 'tm_19', speaker: 'Teresa Teng', hanzi: '在哪里见过你', pinyin: 'Zài nǎlǐ jiàn guò nǐ', french: 'Où t’ai-je déjà rencontré ?' },
      { id: 'tm_20', speaker: 'Teresa Teng', hanzi: '你的笑容这样熟悉', pinyin: 'Nǐ de xiàoróng zhèyàng shúxī', french: 'Ton sourire m’est si familier' },
      { id: 'tm_21', speaker: 'Teresa Teng', hanzi: '我一时想不起', pinyin: 'Wǒ yìshí xiǎng bù qǐ', french: 'Je n’arrive pas à m’en rappeler sur le moment' },
      { id: 'tm_22', speaker: 'Teresa Teng', hanzi: '啊', pinyin: 'A', french: 'Ah !' },
      { id: 'tm_23', speaker: 'Teresa Teng', hanzi: '在梦里', pinyin: 'Zài mèng lǐ', french: 'Dans un doux rêve !' },
      { id: 'tm_24', section: 'Couplet 2', speaker: 'Teresa Teng', hanzi: '甜蜜蜜', pinyin: 'Tiánmìmì', french: 'Doux comme le miel' },
      { id: 'tm_25', speaker: 'Teresa Teng', hanzi: '你笑得甜蜜蜜', pinyin: 'Nǐ xiào de tiánmìmì', french: 'Ton sourire rayonne comme le miel' },
      { id: 'tm_26', speaker: 'Teresa Teng', hanzi: '好像花儿开在春风里', pinyin: 'Hǎoxiàng huā’er kāi zài chūnfēng lǐ', french: 'Comme une fleur qui s’épanouit au vent tiède' },
      { id: 'tm_27', speaker: 'Teresa Teng', hanzi: '开在春风里', pinyin: 'Kāi zài chūnfēng lǐ', french: 'Fleurie dans la brise printanière' },
      { id: 'tm_28', speaker: 'Teresa Teng', hanzi: '在哪里', pinyin: 'Zài nǎlǐ', french: 'Où donc ?' },
      { id: 'tm_29', speaker: 'Teresa Teng', hanzi: '在哪里见过你', pinyin: 'Zài nǎlǐ jiàn guò nǐ', french: 'Où t’ai-je déjà rencontré ?' },
      { id: 'tm_30', speaker: 'Teresa Teng', hanzi: '你的笑容这样熟悉', pinyin: 'Nǐ de xiàoróng zhèyàng shúxī', french: 'Ton visage m’est si familier' },
      { id: 'tm_31', speaker: 'Teresa Teng', hanzi: '我一时想不起', pinyin: 'Wǒ yìshí xiǎng bù qǐ', french: 'Je cherche encore dans mes souvenirs' },
      { id: 'tm_32', section: 'Refrain', speaker: 'Teresa Teng', hanzi: '啊', pinyin: 'A', french: 'Ah !' },
      { id: 'tm_33', speaker: 'Teresa Teng', hanzi: '在梦里', pinyin: 'Zài mèng lǐ', french: 'Dans un rêve !' },
      { id: 'tm_34', speaker: 'Teresa Teng', hanzi: '梦里', pinyin: 'Mèng lǐ', french: 'En rêve' },
      { id: 'tm_35', speaker: 'Teresa Teng', hanzi: '梦里见过你', pinyin: 'Mèng lǐ jiàn guò nǐ', french: 'En rêve je t’ai vu' },
      { id: 'tm_36', speaker: 'Teresa Teng', hanzi: '甜蜜', pinyin: 'Tiánmì', french: 'Si doux' },
      { id: 'tm_37', speaker: 'Teresa Teng', hanzi: '笑容多甜蜜', pinyin: 'Xiàoróng duō tiánmì', french: 'Quel lumineux et doux sourire' },
      { id: 'tm_39', speaker: 'Teresa Teng', hanzi: '是你', pinyin: 'Shì nǐ', french: 'C’est bien toi' },
      { id: 'tm_40', speaker: 'Teresa Teng', hanzi: '梦见的就是你', pinyin: 'Mèng jiàn de jiù shì nǐ', french: 'C’est toi mon rêve chéri' },
      { id: 'tm_41', speaker: 'Teresa Teng', hanzi: '在哪里', pinyin: 'Zài nǎlǐ', french: 'Où donc ?' },
      { id: 'tm_42', speaker: 'Teresa Teng', hanzi: '在哪里见过你', pinyin: 'Zài nǎlǐ jiàn guò nǐ', french: 'Où t’ai-je déjà rencontré ?' },
      { id: 'tm_43', speaker: 'Teresa Teng', hanzi: '你的笑容这样熟悉', pinyin: 'Nǐ de xiàoróng zhèyàng shúxī', french: 'Ton sourire familier me revient' },
      { id: 'tm_44', speaker: 'Teresa Teng', hanzi: '我一时想不起', pinyin: 'Wǒ yìshí xiǎng bù qǐ', french: 'Je cherche encore en moi' },
      { id: 'tm_45', speaker: 'Teresa Teng', hanzi: '啊', pinyin: 'A', french: 'Ah !' },
      { id: 'tm_46', speaker: 'Teresa Teng', hanzi: '在梦里', pinyin: 'Zài mèng lǐ', french: 'Dans un doux rêve !' },
    ],
  },
  {
    id: 'chanson_anniversaire',
    titleFr: 'Joyeux Anniversaire',
    titleZh: '祝你生日快乐',
    titlePinyin: 'Zhù nǐ shēngrì kuàilè',
    type: 'chansons',
    level: 'HSK 1',
    duration: '1 min 00',
    artist: 'Little Fox Chinese',
    youtubeId: 'oMEtryL1cLk',
    description: 'La chanson classique universelle pour apprendre à chanter et souhaiter un joyeux anniversaire en chinois.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00BFA5] to-[#004D40]',
    sentences: [
      { id: 'sa_1', section: 'Refrain', speaker: 'Chœur', hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', french: 'Joyeux anniversaire à toi' },
      { id: 'sa_2', speaker: 'Chœur', hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', french: 'Joyeux anniversaire à toi' },
      { id: 'sa_3', speaker: 'Chœur', hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', french: 'Joyeux anniversaire à toi' },
      { id: 'sa_4', speaker: 'Chœur', hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', french: 'Joyeux anniversaire à toi' },
      { id: 'sa_5', speaker: 'Chœur', hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', french: 'Joyeux anniversaire à toi' },
      { id: 'sa_6', speaker: 'Chœur', hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', french: 'Joyeux anniversaire à toi' },
      { id: 'sa_7', speaker: 'Chœur', hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', french: 'Joyeux anniversaire à toi' },
      { id: 'sa_8', speaker: 'Chœur', hanzi: '祝你生日快乐', pinyin: 'Zhù nǐ shēngrì kuàilè', french: 'Joyeux anniversaire à toi' },
    ],
  },

  // ---------- NIVEAU HSK 2 ----------
  {
    id: 'chanson_beijing',
    titleFr: 'Beijing vous Accueille',
    titleZh: '北京欢迎你',
    titlePinyin: 'Běijīng Huānyíng Nǐ',
    type: 'chansons',
    level: 'HSK 2',
    duration: '6 min 40',
    artist: 'Artistes Réunis (JO Pékin 2008)',
    youtubeId: 'IO9NIizev6M',
    description: 'L’hymne légendaire des Jeux Olympiques de Pékin 2008. Une célébration universelle de l’hospitalité et de la culture chinoise.',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'bj_1', section: 'Couplet 1', speaker: 'Artistes Réunis', hanzi: '迎接另一个晨曦', pinyin: 'Yíngjiē lìng yí gè chénxī', french: 'Accueillir une nouvelle aube' },
      { id: 'bj_2', speaker: 'Artistes Réunis', hanzi: '带来全新空气', pinyin: 'Dàilái quánxīn kōngqì', french: 'Qui apporte un souffle tout neuf' },
      { id: 'bj_3', speaker: 'Artistes Réunis', hanzi: '气息改变情味不变', pinyin: 'Qìxī gǎibiàn qíngwèi bú biàn', french: 'L’air se renouvelle mais la sincérité demeure' },
      { id: 'bj_4', speaker: 'Artistes Réunis', hanzi: '茶香飘满情谊', pinyin: 'Cháxiāng piāomǎn qíngyì', french: 'Le parfum du thé déborde d’amitié' },
      { id: 'bj_5', speaker: 'Artistes Réunis', hanzi: '我家大门常打开', pinyin: 'Wǒ jiā dàmén cháng dǎkāi', french: 'Les portes de ma maison sont grandes ouvertes' },
      { id: 'bj_6', speaker: 'Artistes Réunis', hanzi: '开放怀抱等你', pinyin: 'Kāifàng huáibào děng nǐ', french: 'Je t’attends les bras grands ouverts' },
      { id: 'bj_7', speaker: 'Artistes Réunis', hanzi: '拥抱过就有了默契', pinyin: 'Yōngbào guò jiù yǒu le mòqì', french: 'Une étreinte suffit pour nous comprendre' },
      { id: 'bj_8', speaker: 'Artistes Réunis', hanzi: '你会爱上这里', pinyin: 'Nǐ huì ài shàng zhèlǐ', french: 'Tu tomberas amoureux de cet endroit' },
      { id: 'bj_9', speaker: 'Artistes Réunis', hanzi: '不管远近都是客人', pinyin: 'Bùguǎn yuǎnjìn dōu shì kèrén', french: 'Que vous veniez de près ou de loin, vous êtes nos invités' },
      { id: 'bj_10', speaker: 'Artistes Réunis', hanzi: '请不用客气', pinyin: 'Qǐng bùyòng kèqi', french: 'Faites comme chez vous' },
      { id: 'bj_11', speaker: 'Artistes Réunis', hanzi: '相约好了在一起', pinyin: 'Xiāngyuē hǎo le zài yìqǐ', french: 'Nous nous sommes donné rendez-vous ensemble' },
      { id: 'bj_12', speaker: 'Artistes Réunis', hanzi: '我们欢迎你', pinyin: 'Wǒmen huānyíng nǐ', french: 'Nous vous souhaitons la bienvenue' },
      { id: 'bj_13', speaker: 'Artistes Réunis', hanzi: '我家种着万年青', pinyin: 'Wǒ jiā zhòng zhe wànniánqīng', french: 'Chez nous pousse l’aglaonéma éternel' },
      { id: 'bj_14', speaker: 'Artistes Réunis', hanzi: '开放每段传奇', pinyin: 'Kāifàng měi duàn chuánqí', french: 'Berceau de chaque légende fleurissante' },
      { id: 'bj_15', speaker: 'Artistes Réunis', hanzi: '为传统的土壤播种', pinyin: 'Wèi chuántǒng de tǔrǎng bōzhòng', french: 'Semer sur cette terre millénaire' },
      { id: 'bj_16', speaker: 'Artistes Réunis', hanzi: '为你留下回忆', pinyin: 'Wèi nǐ liúxià huíyì', french: 'Pour te laisser des souvenirs impérissables' },
      { id: 'bj_17', speaker: 'Artistes Réunis', hanzi: '陌生熟悉都是客人', pinyin: 'Mòshēng shúxī dōu shì kèrén', french: 'Visages familiers ou nouveaux venus' },
      { id: 'bj_18', speaker: 'Artistes Réunis', hanzi: '请不用拘礼', pinyin: 'Qǐng bùyòng jūlǐ', french: 'Soyez à l’aise sans contrainte' },
      { id: 'bj_19', speaker: 'Artistes Réunis', hanzi: '第几次来没关系', pinyin: 'Dì jǐ cì lái méi guānxì', french: 'Que ce soit votre première ou dixième visite' },
      { id: 'bj_20', speaker: 'Artistes Réunis', hanzi: '有太多话题', pinyin: 'Yǒu tài duō huàtí', french: 'Nous avons tant d’histoires à partager' },
      { id: 'bj_21', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_22', speaker: 'Artistes Réunis', hanzi: '为你开天辟地', pinyin: 'Wèi nǐ kāitiānpìdì', french: 'Et déploie tout son univers pour vous' },
      { id: 'bj_23', speaker: 'Artistes Réunis', hanzi: '流动中的魅力充满着朝气', pinyin: 'Liúdòng zhōng de mèilì chōngmǎn zhe zhāoqì', french: 'Son charme en mouvement rayonne d’énergie' },
      { id: 'bj_24', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_25', speaker: 'Artistes Réunis', hanzi: '在太阳下分享呼吸', pinyin: 'Zài tàiyáng xià fēnxiǎng hūxī', french: 'Pour partager ensemble la lumière du soleil' },
      { id: 'bj_26', speaker: 'Artistes Réunis', hanzi: '在黄土地刷新成绩', pinyin: 'Zài huáng tǔdì shuāxīn chéngjì', french: 'Et écrire sur cette terre de nouveaux exploits' },
      { id: 'bj_27', section: 'Couplet 2', speaker: 'Artistes Réunis', hanzi: '我家大门常打开', pinyin: 'Wǒ jiā dàmén cháng dǎkāi', french: 'Nos portes restent grandes ouvertes' },
      { id: 'bj_28', speaker: 'Artistes Réunis', hanzi: '开怀容纳天地', pinyin: 'Kāihuái róngnà tiāndì', french: 'Pour accueillir le monde entier' },
      { id: 'bj_29', speaker: 'Artistes Réunis', hanzi: '岁月绽放青春笑容', pinyin: 'Suìyuè zhànfàng qīngchūn xiàoróng', french: 'Les années font fleurir des sourires radieux' },
      { id: 'bj_30', speaker: 'Artistes Réunis', hanzi: '迎接这个日期', pinyin: 'Yíngjiē zhè gè rìqī', french: 'Pour célébrer ce grand jour' },
      { id: 'bj_31', speaker: 'Artistes Réunis', hanzi: '天大地大都是朋友', pinyin: 'Tiān dà dì dà dōu shì péngyǒu', french: 'Sous l’immensité du ciel nous sommes tous amis' },
      { id: 'bj_32', speaker: 'Artistes Réunis', hanzi: '请不用客气', pinyin: 'Qǐng bùyòng kèqi', french: 'Soyez les bienvenus en toute simplicité' },
      { id: 'bj_33', speaker: 'Artistes Réunis', hanzi: '画意诗情带笑意', pinyin: 'Huàyì shīqíng dài xiàoyì', french: 'La poésie et l’art chinois vous attendent' },
      { id: 'bj_34', speaker: 'Artistes Réunis', hanzi: '只为等待你', pinyin: 'Zhǐ wèi děngdài nǐ', french: 'Le cœur plein de joie pour vous recevoir' },
      { id: 'bj_35', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_36', speaker: 'Artistes Réunis', hanzi: '像音乐感动你', pinyin: 'Xiàng yīnyuè gǎndòng nǐ', french: 'Telle une harmonieuse symphonie' },
      { id: 'bj_37', speaker: 'Artistes Réunis', hanzi: '让我们都加油', pinyin: 'Ràng wǒmen dōu jiāyóu', french: 'Donnons le meilleur de nous-mêmes' },
      { id: 'bj_38', speaker: 'Artistes Réunis', hanzi: '去超越自己', pinyin: 'Qù chāoyuè zìjǐ', french: 'Pour nous surpasser' },
      { id: 'bj_39', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_40', speaker: 'Artistes Réunis', hanzi: '有梦想谁都了不起', pinyin: 'Yǒu mèngxiǎng shéi dōu liǎobùqǐ', french: 'Quiconque porte un rêve est exceptionnel' },
      { id: 'bj_41', speaker: 'Artistes Réunis', hanzi: '有勇气就会有奇迹', pinyin: 'Yǒu yǒngqì jiù huì yǒu qíjì', french: 'Avec du courage adviennent les miracles' },
      { id: 'bj_42', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_43', speaker: 'Artistes Réunis', hanzi: '为你开天辟地', pinyin: 'Wèi nǐ kāitiānpìdì', french: 'Et déploie toute son énergie' },
      { id: 'bj_44', speaker: 'Artistes Réunis', hanzi: '流动中的魅力充满着朝气', pinyin: 'Liúdòng zhōng de mèilì chōngmǎn zhe zhāoqì', french: 'Une ferveur pleine de vitalité' },
      { id: 'bj_45', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_46', speaker: 'Artistes Réunis', hanzi: '在太阳下分享呼吸', pinyin: 'Zài tàiyáng xià fēnxiǎng hūxī', french: 'Partageons le même souffle' },
      { id: 'bj_47', speaker: 'Artistes Réunis', hanzi: '在黄土地刷新成绩', pinyin: 'Zài huáng tǔdì shuāxīn chéngjì', french: 'Et bâtissons ensemble l’avenir' },
      { id: 'bj_48', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_49', speaker: 'Artistes Réunis', hanzi: '像音乐感动你', pinyin: 'Xiàng yīnyuè gǎndòng nǐ', french: 'Comme une musique émouvante' },
      { id: 'bj_50', speaker: 'Artistes Réunis', hanzi: '让我们都加油', pinyin: 'Ràng wǒmen dōu jiāyóu', french: 'Encourageons-nous' },
      { id: 'bj_51', speaker: 'Artistes Réunis', hanzi: '去超越自己', pinyin: 'Qù chāoyuè zìjǐ', french: 'Pour dépasser nos limites' },
      { id: 'bj_52', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_53', speaker: 'Artistes Réunis', hanzi: '有梦想谁都了不起', pinyin: 'Yǒu mèngxiǎng shéi dōu liǎobùqǐ', french: 'Ceux qui rêvent créent la grandeur' },
      { id: 'bj_54', speaker: 'Artistes Réunis', hanzi: '有勇气就会有奇迹', pinyin: 'Yǒu yǒngqì jiù huì yǒu qíjì', french: 'La foi et l’audace font naître les miracles' },
      { id: 'bj_55', section: 'Couplet 3', speaker: 'Artistes Réunis', hanzi: '我家大门常打开', pinyin: 'Wǒ jiā dàmén cháng dǎkāi', french: 'Nos bras vous sont toujours grands ouverts' },
      { id: 'bj_56', speaker: 'Artistes Réunis', hanzi: '开放怀抱等你', pinyin: 'Kāifàng huáibào děng nǐ', french: 'Pour sceller notre fraternité' },
      { id: 'bj_57', speaker: 'Artistes Réunis', hanzi: '拥抱过就有了默契', pinyin: 'Yōngbào guò jiù yǒu le mòqì', french: 'Une complicité instantanée' },
      { id: 'bj_58', speaker: 'Artistes Réunis', hanzi: '你会爱上这里', pinyin: 'Nǐ huì ài shàng zhèlǐ', french: 'Vous aimerez cette terre d’accueil' },
      { id: 'bj_59', speaker: 'Artistes Réunis', hanzi: '不管远近都是客人', pinyin: 'Bùguǎn yuǎnjìn dōu shì kèrén', french: 'Proches ou lointains invités' },
      { id: 'bj_60', speaker: 'Artistes Réunis', hanzi: '请不用客气', pinyin: 'Qǐng bùyòng kèqi', french: 'Faites comme chez vous' },
      { id: 'bj_61', speaker: 'Artistes Réunis', hanzi: '相约好了在一起', pinyin: 'Xiāngyuē hǎo le zài yìqǐ', french: 'Nous sommes enfin réunis' },
      { id: 'bj_62', speaker: 'Artistes Réunis', hanzi: '我们欢迎你', pinyin: 'Wǒmen huānyíng nǐ', french: 'Soyez les bienvenus chez vous !' },
      { id: 'bj_63', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_64', speaker: 'Artistes Réunis', hanzi: '有梦想谁都了不起', pinyin: 'Yǒu mèngxiǎng shéi dōu liǎobùqǐ', french: 'Quiconque a un rêve est exceptionnel' },
      { id: 'bj_65', speaker: 'Artistes Réunis', hanzi: '有勇气就会有奇迹', pinyin: 'Yǒu yǒngqì jiù huì yǒu qíjì', french: 'Avec du courage surviennent les miracles' },
      { id: 'bj_66', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_67', speaker: 'Artistes Réunis', hanzi: '有梦想谁都了不起', pinyin: 'Yǒu mèngxiǎng shéi dōu liǎobùqǐ', french: 'Tous les rêves sont grands' },
      { id: 'bj_68', speaker: 'Artistes Réunis', hanzi: '有勇气就会有奇迹', pinyin: 'Yǒu yǒngqì jiù huì yǒu qíjì', french: 'Et le courage crée des miracles' },
    ],
  },
  {
    id: 'chanson_moon',
    titleFr: 'La Lune Représente mon Cœur',
    titleZh: '月亮代表我的心',
    titlePinyin: 'Yuèliang Dàibiǎo Wǒ de Xīn',
    type: 'chansons',
    level: 'HSK 2',
    duration: '3 min 30',
    artist: 'Teresa Teng',
    youtubeId: 'IiFm7AWP9n4',
    description: 'La chanson chinoise la plus célèbre au monde. Mélodie douce et vocabulaire simple et poétique, idéale pour débuter.',
    imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'ch1_1', section: 'Couplet 1', speaker: 'Teresa Teng', hanzi: '你问我爱你有多深', pinyin: 'Nǐ wèn wǒ ài nǐ yǒu duō shēn', french: 'Tu me demandes à quel point je t’aime' },
      { id: 'ch1_2', speaker: 'Teresa Teng', hanzi: '我爱你有几分', pinyin: 'Wǒ ài nǐ yǒu jǐ fēn', french: 'Quelle est la profondeur de mon amour' },
      { id: 'ch1_3', speaker: 'Teresa Teng', hanzi: '我的情也真', pinyin: 'Wǒ de qíng yě zhēn', french: 'Mes sentiments sont d’une absolue sincérité' },
      { id: 'ch1_4', speaker: 'Teresa Teng', hanzi: '我的爱也真', pinyin: 'Wǒ de ài yě zhēn', french: 'Mon amour est profondément vrai' },
      { id: 'ch1_5', speaker: 'Teresa Teng', hanzi: '月亮代表我的心', pinyin: 'Yuèliang dàibiǎo wǒ de xīn', french: 'La lune représente fidèlement mon cœur' },
      { id: 'ch1_6', section: 'Couplet 2', speaker: 'Teresa Teng', hanzi: '你问我爱你有多深', pinyin: 'Nǐ wèn wǒ ài nǐ yǒu duō shēn', french: 'Tu me demandes à quel point je t’aime' },
      { id: 'ch1_7', speaker: 'Teresa Teng', hanzi: '我爱你有几分', pinyin: 'Wǒ ài nǐ yǒu jǐ fēn', french: 'Quelle est la force de mes sentiments' },
      { id: 'ch1_8', speaker: 'Teresa Teng', hanzi: '我的情不移', pinyin: 'Wǒ de qíng bù yí', french: 'Mes sentiments ne faibliront jamais' },
      { id: 'ch1_9', speaker: 'Teresa Teng', hanzi: '我的爱不变', pinyin: 'Wǒ de ài bù biàn', french: 'Mon amour ne changera jamais' },
      { id: 'ch1_10', speaker: 'Teresa Teng', hanzi: '月亮代表我的心', pinyin: 'Yuèliang dàibiǎo wǒ de xīn', french: 'La lune représente la pureté de mon cœur' },
      { id: 'ch1_11', section: 'Refrain', speaker: 'Teresa Teng', hanzi: '轻轻的一个吻', pinyin: 'Qīngqīng de yí gè wěn', french: 'Un baiser si doux et léger' },
      { id: 'ch1_12', speaker: 'Teresa Teng', hanzi: '已经打动我的心', pinyin: 'Yǐjīng dǎdòng wǒ de xīn', french: 'A déjà profondément touché mon cœur' },
      { id: 'ch1_13', speaker: 'Teresa Teng', hanzi: '深深的一段情', pinyin: 'Shēnshēn de yí duàn qíng', french: 'Une histoire d’amour si profonde' },
      { id: 'ch1_14', speaker: 'Teresa Teng', hanzi: '叫我思念到如今', pinyin: 'Jiào wǒ sīniàn dào rújīn', french: 'Me fait penser tendrement à toi jusqu’à aujourd’hui' },
      { id: 'ch1_15', section: 'Couplet 3', speaker: 'Teresa Teng', hanzi: '你问我爱你有多深', pinyin: 'Nǐ wèn wǒ ài nǐ yǒu duō shēn', french: 'Tu me demandes à quel point je t’aime' },
      { id: 'ch1_16', speaker: 'Teresa Teng', hanzi: '我爱你有几分', pinyin: 'Wǒ ài nǐ yǒu jǐ fēn', french: 'Quelle est la sincérité de mon attachement' },
      { id: 'ch1_17', speaker: 'Teresa Teng', hanzi: '你去想一想', pinyin: 'Nǐ qù xiǎng yi xiǎng', french: 'Prends le temps d’y réfléchir' },
      { id: 'ch1_18', speaker: 'Teresa Teng', hanzi: '你去看一看', pinyin: 'Nǐ qù kàn yi kàn', french: 'Lève les yeux vers la lune' },
      { id: 'ch1_19', speaker: 'Teresa Teng', hanzi: '月亮代表我的心', pinyin: 'Yuèliang dàibiǎo wǒ de xīn', french: 'La lune représente mon cœur éternel' },
      { id: 'ch1_20', section: 'Refrain', speaker: 'Teresa Teng', hanzi: '轻轻的一个吻', pinyin: 'Qīngqīng de yí gè wěn', french: 'Un baiser si doux et délicat' },
      { id: 'ch1_21', speaker: 'Teresa Teng', hanzi: '已经打动我的心', pinyin: 'Yǐjīng dǎdòng wǒ de xīn', french: 'A fait chavirer mon âme' },
      { id: 'ch1_22', speaker: 'Teresa Teng', hanzi: '深深的一段情', pinyin: 'Shēnshēn de yí duàn qíng', french: 'Ce sentiment si pur et sincère' },
      { id: 'ch1_23', speaker: 'Teresa Teng', hanzi: '叫我思念到如今', pinyin: 'Jiào wǒ sīniàn dào rújīn', french: 'Nourrit mon souvenir jusqu’à ce jour' },
      { id: 'ch1_24', section: 'Couplet 4', speaker: 'Teresa Teng', hanzi: '你问我爱你有多深', pinyin: 'Nǐ wèn wǒ ài nǐ yǒu duō shēn', french: 'Tu me demandes à quel point je t’aime' },
      { id: 'ch1_25', speaker: 'Teresa Teng', hanzi: '我爱你有几分', pinyin: 'Wǒ ài nǐ yǒu jǐ fēn', french: 'Quelle est l’intensité de mon amour' },
      { id: 'ch1_26', speaker: 'Teresa Teng', hanzi: '你去想一想', pinyin: 'Nǐ qù xiǎng yi xiǎng', french: 'Penses-y un instant' },
      { id: 'ch1_27', speaker: 'Teresa Teng', hanzi: '你去看一看', pinyin: 'Nǐ qù kàn yi kàn', french: 'Contemple la clarté du ciel' },
      { id: 'ch1_28', speaker: 'Teresa Teng', hanzi: '月亮代表我的心', pinyin: 'Yuèliang dàibiǎo wǒ de xīn', french: 'La lune représente fidèlement mon cœur' },
      { id: 'ch1_29', speaker: 'Teresa Teng', hanzi: '你去想一想', pinyin: 'Nǐ qù xiǎng yi xiǎng', french: 'Penses-y toujours' },
      { id: 'ch1_30', speaker: 'Teresa Teng', hanzi: '你去看一看', pinyin: 'Nǐ qù kàn yi kàn', french: 'Regarde le ciel nocturne' },
      { id: 'ch1_31', speaker: 'Teresa Teng', hanzi: '月亮代表我的心', pinyin: 'Yuèliang dàibiǎo wǒ de xīn', french: 'La lune est le témoin éternel de mon cœur' },
    ],
  },
  {
    id: 'chanson_pengyou',
    titleFr: 'Amis pour la Vie',
    titleZh: '朋友',
    titlePinyin: 'Péngyǒu',
    type: 'chansons',
    level: 'HSK 2',
    duration: '4 min 15',
    artist: 'Wakin Chau',
    youtubeId: '6lbPgfKK7m4',
    description: 'Le grand classique incontournable de l’amitié chanté dans tous les karaokés (KTV) de Chine. Mots simples et touchants.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'ch2_1', section: 'Couplet 1', speaker: 'Wakin Chau', hanzi: '这些年', pinyin: 'Zhèxiē nián', french: 'Ces dernières années' },
      { id: 'ch2_2', speaker: 'Wakin Chau', hanzi: '一个人', pinyin: 'Yí gè rén', french: 'Passées tout seul' },
      { id: 'ch2_3', speaker: 'Wakin Chau', hanzi: '风也过', pinyin: 'Fēng yě guò', french: 'À traverser les vents' },
      { id: 'ch2_4', speaker: 'Wakin Chau', hanzi: '雨也走', pinyin: 'Yǔ yě zǒu', french: 'Et les tempêtes de pluie' },
      { id: 'ch2_5', speaker: 'Wakin Chau', hanzi: '有过泪', pinyin: 'Yǒu guò lèi', french: 'Il y a eu des larmes' },
      { id: 'ch2_6', speaker: 'Wakin Chau', hanzi: '有过错', pinyin: 'Yǒu guò cuò', french: 'Il y a eu des erreurs' },
      { id: 'ch2_7', speaker: 'Wakin Chau', hanzi: '还记得坚持什么', pinyin: 'Hái jìde jiānchí shénme', french: 'Mais je me souviens de nos idéaux' },
      { id: 'ch2_8', speaker: 'Wakin Chau', hanzi: '真爱过', pinyin: 'Zhēn ài guò', french: 'Après avoir aimé sincèrement' },
      { id: 'ch2_9', speaker: 'Wakin Chau', hanzi: '才会懂', pinyin: 'Cái huì dǒng', french: 'On comprend enfin' },
      { id: 'ch2_10', speaker: 'Wakin Chau', hanzi: '会寂寞', pinyin: 'Huì jìmò', french: 'La solitude' },
      { id: 'ch2_11', speaker: 'Wakin Chau', hanzi: '会回首', pinyin: 'Huì huíshǒu', french: 'Et les regards en arrière' },
      { id: 'ch2_12', speaker: 'Wakin Chau', hanzi: '终有梦', pinyin: 'Zhōng yǒu mèng', french: 'Il reste toujours un rêve' },
      { id: 'ch2_13', speaker: 'Wakin Chau', hanzi: '终有你在心中', pinyin: 'Zhōng yǒu nǐ zài xīn zhōng', french: 'Et ton souvenir ancré en mon cœur' },
      { id: 'ch2_14', section: 'Refrain', speaker: 'Wakin Chau', hanzi: '朋友一生一起走', pinyin: 'Péngyǒu yìshēng yìqǐ zǒu', french: 'Les vrais amis cheminent ensemble toute la vie' },
      { id: 'ch2_15', speaker: 'Wakin Chau', hanzi: '那些日子不再有', pinyin: 'Nàxiē rìzi bù zài yǒu', french: 'Ces jours précieux ne reviendront plus' },
      { id: 'ch2_16', speaker: 'Wakin Chau', hanzi: '一句话', pinyin: 'Yí jù huà', french: 'Une seule parole' },
      { id: 'ch2_17', speaker: 'Wakin Chau', hanzi: '一辈子', pinyin: 'Yí bèizi', french: 'Pour toute la vie' },
      { id: 'ch2_18', speaker: 'Wakin Chau', hanzi: '一生情', pinyin: 'Yì shēng qíng', french: 'Une amitié sincère' },
      { id: 'ch2_19', speaker: 'Wakin Chau', hanzi: '一杯酒', pinyin: 'Yì bēi jiǔ', french: 'Scellée par un verre' },
      { id: 'ch2_20', speaker: 'Wakin Chau', hanzi: '朋友不曾孤单过', pinyin: 'Péngyǒu bùcéng gūdān guò', french: 'Entre amis on n’est jamais seul' },
      { id: 'ch2_21', speaker: 'Wakin Chau', hanzi: '一声朋友你会懂', pinyin: 'Yì shēng péngyǒu nǐ huì dǒng', french: 'Un mot fraternel et tu comprends tout' },
      { id: 'ch2_22', speaker: 'Wakin Chau', hanzi: '还有伤', pinyin: 'Hái yǒu shāng', french: 'Même avec des peines' },
      { id: 'ch2_23', speaker: 'Wakin Chau', hanzi: '还有痛', pinyin: 'Hái yǒu tòng', french: 'Et des blessures' },
      { id: 'ch2_24', speaker: 'Wakin Chau', hanzi: '还要走', pinyin: 'Hái yào zǒu', french: 'Nous continuerons d’avancer' },
      { id: 'ch2_25', speaker: 'Wakin Chau', hanzi: '还有我', pinyin: 'Hái yǒu wǒ', french: 'Tu peux toujours compter sur moi' },
      { id: 'ch2_26', section: 'Couplet 2', speaker: 'Wakin Chau', hanzi: '这些年', pinyin: 'Zhèxiē nián', french: 'Ces dernières années' },
      { id: 'ch2_27', speaker: 'Wakin Chau', hanzi: '一个人', pinyin: 'Yí gè rén', french: 'Solitaire sur la route' },
      { id: 'ch2_28', speaker: 'Wakin Chau', hanzi: '风也过', pinyin: 'Fēng yě guò', french: 'Face aux vents' },
      { id: 'ch2_29', speaker: 'Wakin Chau', hanzi: '雨也走', pinyin: 'Yǔ yě zǒu', french: 'Et sous les orages' },
      { id: 'ch2_30', speaker: 'Wakin Chau', hanzi: '有过泪', pinyin: 'Yǒu guò lèi', french: 'Des larmes versées' },
      { id: 'ch2_31', speaker: 'Wakin Chau', hanzi: '有过错', pinyin: 'Yǒu guò cuò', french: 'Des maladresses passées' },
      { id: 'ch2_32', speaker: 'Wakin Chau', hanzi: '还记得坚持什么', pinyin: 'Hái jìde jiānchí shénme', french: 'Gardant intacte notre force' },
      { id: 'ch2_33', speaker: 'Wakin Chau', hanzi: '真爱过', pinyin: 'Zhēn ài guò', french: 'L’amour véritable' },
      { id: 'ch2_34', speaker: 'Wakin Chau', hanzi: '才会懂', pinyin: 'Cái huì dǒng', french: 'Nous éclaire enfin' },
      { id: 'ch2_35', speaker: 'Wakin Chau', hanzi: '会寂寞', pinyin: 'Huì jìmò', french: 'Dans les moments de solitude' },
      { id: 'ch2_36', speaker: 'Wakin Chau', hanzi: '会回首', pinyin: 'Huì huíshǒu', french: 'Quand on songe au passé' },
      { id: 'ch2_37', speaker: 'Wakin Chau', hanzi: '终有梦', pinyin: 'Zhōng yǒu mèng', french: 'Il reste un grand rêve' },
      { id: 'ch2_38', speaker: 'Wakin Chau', hanzi: '终有你在心中', pinyin: 'Zhōng yǒu nǐ zài xīn zhōng', french: 'Et ton amitié au fond de mon cœur' },
      { id: 'ch2_39', section: 'Refrain', speaker: 'Wakin Chau', hanzi: '朋友一生一起走', pinyin: 'Péngyǒu yìshēng yìqǐ zǒu', french: 'Les amis cheminent côte à côte' },
      { id: 'ch2_40', speaker: 'Wakin Chau', hanzi: '那些日子不再有', pinyin: 'Nàxiē rìzi bù zài yǒu', french: 'Chérissons ces jours uniques' },
      { id: 'ch2_41', speaker: 'Wakin Chau', hanzi: '一句话', pinyin: 'Yí jù huà', french: 'Une seule parole' },
      { id: 'ch2_42', speaker: 'Wakin Chau', hanzi: '一辈子', pinyin: 'Yí bèizi', french: 'Pour l’existence entière' },
      { id: 'ch2_43', speaker: 'Wakin Chau', hanzi: '一生情', pinyin: 'Yì shēng qíng', french: 'Une fraternité pure' },
      { id: 'ch2_44', speaker: 'Wakin Chau', hanzi: '一杯酒', pinyin: 'Yì bēi jiǔ', french: 'Pour l’éternité' },
      { id: 'ch2_45', speaker: 'Wakin Chau', hanzi: '朋友不曾孤单过', pinyin: 'Péngyǒu bùcéng gūdān guò', french: 'Un véritable ami est toujours là' },
      { id: 'ch2_46', speaker: 'Wakin Chau', hanzi: '一声朋友你会懂', pinyin: 'Yì shēng péngyǒu nǐ huì dǒng', french: 'Il suffit d’un appel et tu comprends' },
      { id: 'ch2_47', speaker: 'Wakin Chau', hanzi: '还有伤', pinyin: 'Hái yǒu shāng', french: 'Malgré les blessures' },
      { id: 'ch2_48', speaker: 'Wakin Chau', hanzi: '还有痛', pinyin: 'Hái yǒu tòng', french: 'Et les épreuves' },
      { id: 'ch2_49', speaker: 'Wakin Chau', hanzi: '还要走', pinyin: 'Hái yào zǒu', french: 'Nous irons de l’avant' },
      { id: 'ch2_50', speaker: 'Wakin Chau', hanzi: '还有我', pinyin: 'Hái yǒu wǒ', french: 'Je serai toujours à tes côtés' },
      { id: 'ch2_51', section: 'Refrain', speaker: 'Wakin Chau', hanzi: '朋友一生一起走', pinyin: 'Péngyǒu yìshēng yìqǐ zǒu', french: 'Les amis marchent ensemble pour toujours' },
      { id: 'ch2_52', speaker: 'Wakin Chau', hanzi: '那些日子不再有', pinyin: 'Nàxiē rìzi bù zài yǒu', french: 'Ces précieux moments sont gravés' },
      { id: 'ch2_53', speaker: 'Wakin Chau', hanzi: '一句话', pinyin: 'Yí jù huà', french: 'Une parole' },
      { id: 'ch2_54', speaker: 'Wakin Chau', hanzi: '一辈子', pinyin: 'Yí bèizi', french: 'Toute une existence' },
      { id: 'ch2_55', speaker: 'Wakin Chau', hanzi: '一生情', pinyin: 'Yì shēng qíng', french: 'Une fraternité pure' },
      { id: 'ch2_56', speaker: 'Wakin Chau', hanzi: '一杯酒', pinyin: 'Yì bēi jiǔ', french: 'Scellée à jamais' },
    ],
  },
  {
    id: 'chanson_wings',
    titleFr: 'Des Ailes Invisibles',
    titleZh: '隐形的翅膀',
    titlePinyin: 'Yǐnxíng de Chìbǎng',
    type: 'chansons',
    level: 'HSK 2',
    duration: '3 min 50',
    artist: 'Angela Chang',
    youtubeId: 'be2wvNFTLMc',
    description: 'L’hymne culte du courage et de la persévérance. Une mélodie entraînante et facile à chanter pour s’exprimer avec confiance.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'wg_1', section: 'Couplet 1', speaker: 'Angela Chang', hanzi: '每一次', pinyin: 'Měi yí cì', french: 'Chaque fois' },
      { id: 'wg_2', speaker: 'Angela Chang', hanzi: '都在徘徊孤单中坚强', pinyin: 'Dōu zài páihuái gūdān zhōng jiānqiáng', french: 'Je trouve ma force au milieu du doute et de la solitude' },
      { id: 'wg_3', speaker: 'Angela Chang', hanzi: '每一次', pinyin: 'Měi yí cì', french: 'Chaque fois' },
      { id: 'wg_4', speaker: 'Angela Chang', hanzi: '就算很受伤也不闪泪光', pinyin: 'Jiùsuàn hěn shòushāng yě bù shǎn lèiguāng', french: 'Même blessée, je ne laisse pas couler mes larmes' },
      { id: 'wg_5', speaker: 'Angela Chang', hanzi: '我知道', pinyin: 'Wǒ zhīdào', french: 'Je sais' },
      { id: 'wg_6', speaker: 'Angela Chang', hanzi: '我一直有双隐形的翅膀', pinyin: 'Wǒ yìzhí yǒu shuāng yǐnxíng de chìbǎng', french: 'Que je possède depuis toujours une paire d’ailes invisibles' },
      { id: 'wg_7', speaker: 'Angela Chang', hanzi: '带我飞', pinyin: 'Dài wǒ fēi', french: 'Pour m’envoler' },
      { id: 'wg_8', speaker: 'Angela Chang', hanzi: '飞过绝望', pinyin: 'Fēi guò juéwàng', french: 'Au-dessus du désespoir' },
      { id: 'wg_9', section: 'Couplet 2', speaker: 'Angela Chang', hanzi: '不去想', pinyin: 'Bú qù xiǎng', french: 'Sans envier' },
      { id: 'wg_10', speaker: 'Angela Chang', hanzi: '他们拥有美丽的太阳', pinyin: 'Tāmen yōngyǒu měilì de tàiyáng', french: 'Le soleil éclatant des autres' },
      { id: 'wg_11', speaker: 'Angela Chang', hanzi: '我看见', pinyin: 'Wǒ kànjiàn', french: 'Je contemple' },
      { id: 'wg_12', speaker: 'Angela Chang', hanzi: '每天的夕阳也会有变化', pinyin: 'Měitiān de xīyáng yě huì yǒu biànhuà', french: 'Les couleurs magnifiques et changeantes du couchant' },
      { id: 'wg_13', speaker: 'Angela Chang', hanzi: '我知道', pinyin: 'Wǒ zhīdào', french: 'Je sais' },
      { id: 'wg_14', speaker: 'Angela Chang', hanzi: '我一直有双隐形的翅膀', pinyin: 'Wǒ yìzhí yǒu shuāng yǐnxíng de chìbǎng', french: 'Que je porte au fond de moi des ailes secrètes' },
      { id: 'wg_15', speaker: 'Angela Chang', hanzi: '带我飞', pinyin: 'Dài wǒ fēi', french: 'Qui me font voler' },
      { id: 'wg_16', speaker: 'Angela Chang', hanzi: '给我希望', pinyin: 'Gěi wǒ xīwàng', french: 'Et me remplissent d’espérance' },
      { id: 'wg_17', section: 'Refrain', speaker: 'Angela Chang', hanzi: '我终于', pinyin: 'Wǒ zhōngyú', french: 'Je vois enfin' },
      { id: 'wg_18', speaker: 'Angela Chang', hanzi: '看到所有梦想都开花', pinyin: 'Kàndào suǒyǒu mèngxiǎng dōu kāihuā', french: 'Tous mes rêves éclore comme des fleurs' },
      { id: 'wg_19', speaker: 'Angela Chang', hanzi: '追逐的年轻', pinyin: 'Zhuīzhú de niánqīng', french: 'La jeunesse passionnée' },
      { id: 'wg_20', speaker: 'Angela Chang', hanzi: '歌声多嘹亮', pinyin: 'Gēshēng duō liáoliàng', french: 'Chante d’une voix claire et retentissante' },
      { id: 'wg_21', speaker: 'Angela Chang', hanzi: '我终于', pinyin: 'Wǒ zhōngyú', french: 'Je m’élève enfin' },
      { id: 'wg_22', speaker: 'Angela Chang', hanzi: '翱翔用心凝望不害怕', pinyin: 'Áoxiáng yòngxīn níngwàng bú hàipà', french: 'Dans les airs, le regard serein et sans crainte' },
      { id: 'wg_23', speaker: 'Angela Chang', hanzi: '哪里会有风', pinyin: 'Nǎlǐ huì yǒu fēng', french: 'Partout où le vent soufflera' },
      { id: 'wg_24', speaker: 'Angela Chang', hanzi: '就飞多远吧', pinyin: 'Jiù fēi duō yuǎn ba', french: 'Je volerai sans limites' },
      { id: 'wg_25', section: 'Couplet 3', speaker: 'Angela Chang', hanzi: '不去想', pinyin: 'Bú qù xiǎng', french: 'Sans envier' },
      { id: 'wg_26', speaker: 'Angela Chang', hanzi: '他们拥有美丽的太阳', pinyin: 'Tāmen yōngyǒu měilì de tàiyáng', french: 'La clarté éclatante des autres' },
      { id: 'wg_27', speaker: 'Angela Chang', hanzi: '我看见', pinyin: 'Wǒ kànjiàn', french: 'Je contemple' },
      { id: 'wg_28', speaker: 'Angela Chang', hanzi: '每天的夕阳也会有变化', pinyin: 'Měitiān de xīyáng yě huì yǒu biànhuà', french: 'Chaque crépuscule qui apporte ses promesses' },
      { id: 'wg_29', speaker: 'Angela Chang', hanzi: '我知道', pinyin: 'Wǒ zhīdào', french: 'Je sais' },
      { id: 'wg_30', speaker: 'Angela Chang', hanzi: '我一直有双隐形的翅膀', pinyin: 'Wǒ yìzhí yǒu shuāng yǐnxíng de chìbǎng', french: 'Mes ailes invisibles me guident' },
      { id: 'wg_31', speaker: 'Angela Chang', hanzi: '带我飞', pinyin: 'Dài wǒ fēi', french: 'Elles me portent' },
      { id: 'wg_32', speaker: 'Angela Chang', hanzi: '给我希望', pinyin: 'Gěi wǒ xīwàng', french: 'Et soutiennent mes pas' },
      { id: 'wg_33', section: 'Refrain', speaker: 'Angela Chang', hanzi: '我终于', pinyin: 'Wǒ zhōngyú', french: 'Mes aspirations' },
      { id: 'wg_34', speaker: 'Angela Chang', hanzi: '看到所有梦想都开花', pinyin: 'Kàndào suǒyǒu mèngxiǎng dōu kāihuā', french: 'S’épanouissent enfin au grand jour' },
      { id: 'wg_35', speaker: 'Angela Chang', hanzi: '追逐的年轻', pinyin: 'Zhuīzhú de niánqīng', french: 'Les chants de nos élans' },
      { id: 'wg_36', speaker: 'Angela Chang', hanzi: '歌声多嘹亮', pinyin: 'Gēshēng duō liáoliàng', french: 'Résonnent avec pureté' },
      { id: 'wg_37', speaker: 'Angela Chang', hanzi: '我终于', pinyin: 'Wǒ zhōngyú', french: 'Je plane dans l’azur' },
      { id: 'wg_38', speaker: 'Angela Chang', hanzi: '翱翔用心凝望不害怕', pinyin: 'Áoxiáng yòngxīn níngwàng bú hàipà', french: 'Sans aucune hésitation' },
      { id: 'wg_39', speaker: 'Angela Chang', hanzi: '哪里会有风', pinyin: 'Nǎlǐ huì yǒu fēng', french: 'Vers tous les horizons' },
      { id: 'wg_40', speaker: 'Angela Chang', hanzi: '就飞多远吧', pinyin: 'Jiù fēi duō yuǎn ba', french: 'Où souffle le vent bienfaisant' },
      { id: 'wg_41', speaker: 'Angela Chang', hanzi: '隐形的翅膀', pinyin: 'Yǐnxíng de chìbǎng', french: 'Ces ailes invisibles' },
      { id: 'wg_42', speaker: 'Angela Chang', hanzi: '让梦恒久比天长', pinyin: 'Ràng mèng héngjiǔ bǐ tiān cháng', french: 'Rendent nos rêves plus infinis que le ciel' },
      { id: 'wg_43', speaker: 'Angela Chang', hanzi: '留一个愿望', pinyin: 'Liú yí gè yuànwàng', french: 'Offrant un vœu précieux' },
      { id: 'wg_44', speaker: 'Angela Chang', hanzi: '让你自己想像', pinyin: 'Ràng nǐ zìjǐ xiǎngxiàng', french: 'À ton imagination la plus haute' },
    ],
  },
  {
    id: 'chanson_nanshuo',
    titleFr: 'Difficile de dire au Revoir',
    titleZh: '难说再见',
    titlePinyin: 'Nán Shuō Zàijiàn',
    type: 'chansons',
    level: 'HSK 2',
    duration: '4 min 20',
    artist: 'Jackie Chan, Andy Lau & Wakin Chau',
    youtubeId: '2cKrIXnRDG8',
    description: 'Chanson d’adieu poignante et lumineuse sur la gratitude, les liens fraternels et la promesse des retrouvailles futures.',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      // Couplet 1
      { id: 'ns_1', section: 'Couplet 1', speaker: 'Jackie Chan', hanzi: '习惯幕起幕落', pinyin: 'Xíguàn mù qǐ mù luò', french: 'Habitué au lever et au coucher de rideau' },
      { id: 'ns_2', speaker: 'Jackie Chan', hanzi: '总以为明天还很多', pinyin: 'Zǒng yǐwéi míngtiān hái hěn duō', french: 'Pensant toujours que les lendemains seraient infinis' },
      { id: 'ns_3', speaker: 'Jackie Chan', hanzi: '没想到这笑脸', pinyin: 'Méi xiǎngdào zhè xiàoliǎn', french: 'Je ne pensais pas que ces sourires' },
      { id: 'ns_4', speaker: 'Jackie Chan', hanzi: '会让我难过', pinyin: 'Huì ràng wǒ nánguò', french: 'Me serreraient autant le cœur' },
      { id: 'ns_5', speaker: 'Andy Lau', hanzi: '习惯一起走过', pinyin: 'Xíguàn yìqǐ zǒu guò', french: 'Habitué à cheminer côte à côte' },
      { id: 'ns_6', speaker: 'Andy Lau', hanzi: '没想你不在的生活', pinyin: 'Méi xiǎng nǐ bú zài de shēnghuó', french: 'Sans imaginer ma vie loin de ta présence' },
      { id: 'ns_7', speaker: 'Andy Lau', hanzi: '泪雨也是阳光闪烁', pinyin: 'Lèiyǔ yě shì yángguāng shǎnshuò', french: 'Même sous les larmes brille le soleil' },
      { id: 'ns_8', speaker: 'Andy Lau', hanzi: '是避风的角落', pinyin: 'Shì bìfēng de jiǎoluò', french: 'Tu as été mon havre de paix' },
      { id: 'ns_9', speaker: 'Wakin Chau', hanzi: '离开会成最美的洒脱', pinyin: 'Líkāi huì chéng zuì měi de sǎtuō', french: 'Le départ deviendra la plus noble des élégances' },
      { id: 'ns_10', speaker: 'Wakin Chau', hanzi: '眼是心的守诺', pinyin: 'Yǎn shì xīn de shǒunuò', french: 'Le regard est le serment fidèle de nos âmes' },
      { id: 'ns_11', speaker: 'Liu Huan', hanzi: '我和你不逃过', pinyin: 'Wǒ hé nǐ bù táoguò', french: 'Toi et moi ne reculons jamais' },
      { id: 'ns_12', speaker: 'Liu Huan', hanzi: '你是我一辈子的收获', pinyin: 'Nǐ shì wǒ yí bèizi de shōuhuò', french: 'Tu es le plus grand trésor de toute mon existence' },

      // Refrain 1
      { id: 'ns_13', section: 'Refrain', speaker: 'Chœur & Artistes', hanzi: '难说再见', pinyin: 'Nán shuō zàijiàn', french: 'Difficile de se dire au revoir' },
      { id: 'ns_14', speaker: 'Chœur & Artistes', hanzi: '你的微笑遗落在我眼前', pinyin: 'Nǐ de wēixiào yíluò zài wǒ yǎnqián', french: 'Ton doux sourire reste gravé devant mes yeux' },
      { id: 'ns_15', speaker: 'Chœur & Artistes', hanzi: '难说再见', pinyin: 'Nán shuō zàijiàn', french: 'Difficile de se dire adieu' },
      { id: 'ns_16', speaker: 'Chœur & Artistes', hanzi: '永远不忘转身瞬间', pinyin: 'Yǒngyuǎn bú wàng zhuǎnshēn shùnjiān', french: 'Je n’oublierai jamais l’instant où tu t’es retourné' },
      { id: 'ns_17', speaker: 'Chœur & Artistes', hanzi: '海阔天空在明天', pinyin: 'Hǎikuòtiānkōng zài míngtiān', french: 'Un horizon infini nous attend demain' },
      { id: 'ns_18', speaker: 'Chœur & Artistes', hanzi: '再相见', pinyin: 'Zài xiāngjiàn', french: 'Nous nous retrouverons !' },

      // Couplet 2
      { id: 'ns_19', section: 'Couplet 2', speaker: 'Andy Lau & Wakin Chau', hanzi: '习惯一起走过', pinyin: 'Xíguàn yìqǐ zǒu guò', french: 'Habitué à traverser chaque étape ensemble' },
      { id: 'ns_20', speaker: 'Andy Lau & Wakin Chau', hanzi: '没想你不在的生活', pinyin: 'Méi xiǎng nǐ bú zài de shēnghuó', french: 'Sans songer à la vie loin de toi' },
      { id: 'ns_21', speaker: 'Andy Lau & Wakin Chau', hanzi: '泪雨也是阳光闪烁', pinyin: 'Lèiyǔ yě shì yángguāng shǎnshuò', french: 'Sous les larmes brille toujours la clarté' },
      { id: 'ns_22', speaker: 'Andy Lau & Wakin Chau', hanzi: '是避风的角落', pinyin: 'Shì bìfēng de jiǎoluò', french: 'Un refuge doux et protecteur' },

      // Pré-refrain 2
      { id: 'ns_23', speaker: 'Liu Huan & Jackie Chan', hanzi: '离开会成最美的洒脱', pinyin: 'Líkāi huì chéng zuì měi de sǎtuō', french: 'Le départ deviendra la plus belle des libertés' },
      { id: 'ns_24', speaker: 'Liu Huan & Jackie Chan', hanzi: '眼是心的守诺', pinyin: 'Yǎn shì xīn de shǒunuò', french: 'Le regard est la promesse sacrée du cœur' },
      { id: 'ns_25', speaker: 'Liu Huan & Jackie Chan', hanzi: '我和你不逃过', pinyin: 'Wǒ hé nǐ bù táoguò', french: 'Toi et moi restons inébranlables' },
      { id: 'ns_26', speaker: 'Liu Huan & Jackie Chan', hanzi: '你是我一辈子的收获', pinyin: 'Nǐ shì wǒ yí bèizi de shōuhuò', french: 'Tu es la plus belle richesse de mon existence' },

      // Refrain 2
      { id: 'ns_27', section: 'Refrain', speaker: 'Chœur & Artistes', hanzi: '难说再见', pinyin: 'Nán shuō zàijiàn', french: 'Difficile de se dire au revoir' },
      { id: 'ns_28', speaker: 'Chœur & Artistes', hanzi: '你的微笑遗落在我眼前', pinyin: 'Nǐ de wēixiào yíluò zài wǒ yǎnqián', french: 'Ton visage souriant m’accompagne partout' },
      { id: 'ns_29', speaker: 'Chœur & Artistes', hanzi: '难说再见', pinyin: 'Nán shuō zàijiàn', french: 'Difficile de se dire adieu' },
      { id: 'ns_30', speaker: 'Chœur & Artistes', hanzi: '永远不忘转身瞬间', pinyin: 'Yǒngyuǎn bú wàng zhuǎnshēn shùnjiān', french: 'Jamais je n’oublierai l’instant de nos adieux' },
      { id: 'ns_31', speaker: 'Chœur & Artistes', hanzi: '海阔天空在明天', pinyin: 'Hǎikuòtiānkōng zài míngtiān', french: 'Sous un ciel radieux et infini' },
      { id: 'ns_32', speaker: 'Chœur & Artistes', hanzi: '再相见', pinyin: 'Zài xiāngjiàn', french: 'Nous nous reverrons demain !' },

      // Refrain 3 (Climax & Fin)
      { id: 'ns_33', section: 'Refrain', speaker: 'Chœur & Artistes', hanzi: '难说再见', pinyin: 'Nán shuō zàijiàn', french: 'Difficile de se quitter' },
      { id: 'ns_34', speaker: 'Chœur & Artistes', hanzi: '你的微笑遗落在我眼前', pinyin: 'Nǐ de wēixiào yíluò zài wǒ yǎnqián', french: 'Ton doux sourire veille sur mes pas' },
      { id: 'ns_35', speaker: 'Chœur & Artistes', hanzi: '难说再见', pinyin: 'Nán shuō zàijiàn', french: 'Difficile de se séparer' },
      { id: 'ns_36', speaker: 'Chœur & Artistes', hanzi: '永远不忘转身瞬间', pinyin: 'Yǒngyuǎn bú wàng zhuǎnshēn shùnjiān', french: 'Ce souvenir précieux est gravé pour l’éternité' },
      { id: 'ns_37', speaker: 'Chœur & Artistes', hanzi: '海阔天空在明天', pinyin: 'Hǎikuòtiānkōng zài míngtiān', french: 'Vers des horizons remplis d’espoir' },
      { id: 'ns_38', speaker: 'Chœur & Artistes', hanzi: '再相见', pinyin: 'Zài xiāngjiàn', french: 'Nous serons de nouveau réunis !' },
    ],
  },

  // ---------- NIVEAU HSK 3 ----------
  {
    id: 'chanson_star',
    titleFr: 'L’Étoile la Plus Brillante',
    titleZh: '夜空中最亮的星',
    titlePinyin: 'Yèkōng Zhōng Zuì Liàng de Xīng',
    type: 'chansons',
    level: 'HSK 3',
    duration: '4 min 12',
    artist: 'Chorale des Jeunes de Xiamen',
    youtubeId: '-uzuhqQIaTM',
    description: 'Interprétation culte et émouvante par la chorale des jeunes de Xiamen. Une quête d’espoir, de sincérité et de persévérance.',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'st_1', section: 'Couplet 1', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du ciel nocturne' },
      { id: 'st_2', speaker: 'Chorale des Jeunes', hanzi: '能否听清', pinyin: 'Néng fǒu tīng qīng', french: 'M’entends-tu clairement ?' },
      { id: 'st_3', speaker: 'Chorale des Jeunes', hanzi: '那仰望的人', pinyin: 'Nà yǎngwàng de rén', french: 'Celui qui lève les yeux vers toi' },
      { id: 'st_4', speaker: 'Chorale des Jeunes', hanzi: '心底的孤独和叹息', pinyin: 'Xīndǐ de gūdú hé tànxī', french: 'Entends-tu la solitude et les soupirs au fond de son cœur ?' },
      { id: 'st_5', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du ciel nocturne' },
      { id: 'st_6', speaker: 'Chorale des Jeunes', hanzi: '能否记起', pinyin: 'Néng fǒu jì qǐ', french: 'Te souviens-tu ?' },
      { id: 'st_7', speaker: 'Chorale des Jeunes', hanzi: '曾与我同行', pinyin: 'Céng yǔ wǒ tóngxíng', french: 'De cette silhouette qui marchait avec moi' },
      { id: 'st_8', speaker: 'Chorale des Jeunes', hanzi: '消失在风里的身影', pinyin: 'Xiāoshī zài fēng lǐ de shēnyǐng', french: 'Avant de disparaître dans le vent' },
      { id: 'st_9', speaker: 'Chorale des Jeunes', hanzi: '我祈祷拥有一颗透明的心灵', pinyin: 'Wǒ qǐdǎo yōngyǒu yì kē tòumíng de xīnlíng', french: 'Je prie pour garder un cœur pur et transparent' },
      { id: 'st_10', speaker: 'Chorale des Jeunes', hanzi: '和会流泪的眼睛', pinyin: 'Hé huì liúlèi de yǎnjing', french: 'Et des yeux capables de s’émouvoir' },
      { id: 'st_11', speaker: 'Chorale des Jeunes', hanzi: '给我再去相信的勇气', pinyin: 'Gěi wǒ zài qù xiāngxìn de yǒngqì', french: 'Donne-moi le courage de croire à nouveau' },
      { id: 'st_12', speaker: 'Chorale des Jeunes', hanzi: '越过谎言去拥抱你', pinyin: 'Yuèguò huǎngyán qù yōngbào nǐ', french: 'Et de dépasser les faux-semblants pour t’embrasser' },
      { id: 'st_13', section: 'Refrain', speaker: 'Chorale des Jeunes', hanzi: '每当我找不到存在的意义', pinyin: 'Měi dāng wǒ zhǎo bú dào cúnzài de yìyì', french: 'Chaque fois que je perds le sens de ma vie' },
      { id: 'st_14', speaker: 'Chorale des Jeunes', hanzi: '每当我迷失在黑夜里', pinyin: 'Měi dāng wǒ míshī zài hēiyè lǐ', french: 'Chaque fois que je m’égare dans l’obscurité' },
      { id: 'st_15', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du ciel nocturne' },
      { id: 'st_16', speaker: 'Chorale des Jeunes', hanzi: '请指引我靠近你', pinyin: 'Qǐng zhǐyǐn wǒ kàojìn nǐ', french: 'Guide mes pas pour me rapprocher de toi' },
      { id: 'st_17', section: 'Couplet 2', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du firmament' },
      { id: 'st_18', speaker: 'Chorale des Jeunes', hanzi: '是否知道', pinyin: 'Shìfǒu zhīdào', french: 'Sais-tu' },
      { id: 'st_19', speaker: 'Chorale des Jeunes', hanzi: '那曾与我同心的身影', pinyin: 'Nà céng yǔ wǒ tóngxīn de shēnyǐng', french: 'Où se trouve cette âme qui partageait mes rêves' },
      { id: 'st_20', speaker: 'Chorale des Jeunes', hanzi: '如今在哪里', pinyin: 'Rújīn zài nǎlǐ', french: 'Où est-elle aujourd’hui ?' },
      { id: 'st_21', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du ciel nocturne' },
      { id: 'st_22', speaker: 'Chorale des Jeunes', hanzi: '是否在意', pinyin: 'Shìfǒu zàiyì', french: 'T’en soucies-tu ?' },
      { id: 'st_23', speaker: 'Chorale des Jeunes', hanzi: '是等太阳升起', pinyin: 'Shì děng tàiyáng shēngqǐ', french: 'D’attendre le lever du soleil' },
      { id: 'st_24', speaker: 'Chorale des Jeunes', hanzi: '还是意外先来临', pinyin: 'Háishì yìwài xiān láilín', french: 'Ou de voir arriver les imprévus ?' },
      { id: 'st_25', speaker: 'Chorale des Jeunes', hanzi: '我宁愿所有痛苦都留在心里', pinyin: 'Wǒ nìngyuàn suǒyǒu tòngkǔ dōu liú zài xīn lǐ', french: 'Je préfère garder toute la souffrance en mon cœur' },
      { id: 'st_26', speaker: 'Chorale des Jeunes', hanzi: '也不愿忘记你的眼睛', pinyin: 'Yě bú yuàn wàngjì nǐ de yǎnjing', french: 'Plutôt que d’oublier la lumière de ton regard' },
      { id: 'st_27', speaker: 'Chorale des Jeunes', hanzi: '给我再去相信的勇气', pinyin: 'Gěi wǒ zài qù xiāngxìn de yǒngqì', french: 'Donne-moi le courage de croire' },
      { id: 'st_28', speaker: 'Chorale des Jeunes', hanzi: '越过谎言去拥抱你', pinyin: 'Yuèguò huǎngyán qù yōngbào nǐ', french: 'Et d’aller vers toi avec sincérité' },
      { id: 'st_29', section: 'Refrain', speaker: 'Chorale des Jeunes', hanzi: '每当我找不到存在的意义', pinyin: 'Měi dāng wǒ zhǎo bú dào cúnzài de yìyì', french: 'Quand je cherche le sens de ma vie' },
      { id: 'st_30', speaker: 'Chorale des Jeunes', hanzi: '每当我迷失在黑夜里', pinyin: 'Měi dāng wǒ míshī zài hēiyè lǐ', french: 'Quand je suis perdu dans la nuit sombre' },
      { id: 'st_31', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du ciel nocturne' },
      { id: 'st_32', speaker: 'Chorale des Jeunes', hanzi: '请照亮我前行', pinyin: 'Qǐng zhàoliàng wǒ qiánxíng', french: 'Illumine mon chemin vers l’avant' },
      { id: 'st_33', section: 'Couplet 3', speaker: 'Chorale des Jeunes', hanzi: '我祈祷拥有一颗透明的心灵', pinyin: 'Wǒ qǐdǎo yōngyǒu yì kē tòumíng de xīnlíng', french: 'Je prie pour préserver la pureté de mon âme' },
      { id: 'st_34', speaker: 'Chorale des Jeunes', hanzi: '和会流泪的眼睛', pinyin: 'Hé huì liúlèi de yǎnjing', french: 'Et mon empathie' },
      { id: 'st_35', speaker: 'Chorale des Jeunes', hanzi: '给我再去相信的勇气', pinyin: 'Gěi wǒ zài qù xiāngxìn de yǒngqì', french: 'Donne-moi l’audace d’aimer' },
      { id: 'st_36', speaker: 'Chorale des Jeunes', hanzi: '越过谎言去拥抱你', pinyin: 'Yuèguò huǎngyán qù yōngbào nǐ', french: 'Au-delà de toute désillusion' },
      { id: 'st_37', section: 'Refrain', speaker: 'Chorale des Jeunes', hanzi: '每当我找不到存在的意义', pinyin: 'Měi dāng wǒ zhǎo bú dào cúnzài de yìyì', french: 'Quand s’efface le sens' },
      { id: 'st_38', speaker: 'Chorale des Jeunes', hanzi: '每当我迷失在黑夜里', pinyin: 'Měi dāng wǒ míshī zài hēiyè lǐ', french: 'Et que vient l’obscurité' },
      { id: 'st_39', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du firmament' },
      { id: 'st_40', speaker: 'Chorale des Jeunes', hanzi: '请照亮我前行', pinyin: 'Qǐng zhàoliàng wǒ qiánxíng', french: 'Guide mes pas vers la lumière' },
      { id: 'st_41', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile dans la nuit' },
      { id: 'st_42', speaker: 'Chorale des Jeunes', hanzi: '能否听清', pinyin: 'Néng fǒu tīng qīng', french: 'Entends-tu' },
      { id: 'st_43', speaker: 'Chorale des Jeunes', hanzi: '那仰望的人', pinyin: 'Nà yǎngwàng de rén', french: 'La voix de celui qui regarde le ciel' },
      { id: 'st_44', speaker: 'Chorale des Jeunes', hanzi: '心底的孤独和叹息', pinyin: 'Xīndǐ de gūdú hé tànxī', french: 'Et les soupirs au fond de son cœur ?' },
    ],
  },
  {
    id: 'chanson_yeguang',
    titleFr: 'Lueur Nocturne',
    titleZh: '夜光',
    titlePinyin: 'Yèguāng',
    type: 'chansons',
    level: 'HSK 3',
    duration: '4 min 30',
    artist: 'Na Ying',
    youtubeId: 'rRuL3pxPL9w',
    description: 'Chanson envoûtante et puissante de Na Ying (B.O. du film « A or B »). Une ode à la résilience et à la renaissance.',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'yg_1', section: 'Couplet 1', speaker: 'Na Ying', hanzi: '在你被淹没时闪烁', pinyin: 'Zài nǐ bèi yānmò shí shǎnshuò', french: 'Scintillant quand tu te sens submergé' },
      { id: 'yg_2', speaker: 'Na Ying', hanzi: '在你的左手', pinyin: 'Zài nǐ de zuǒshǒu', french: 'Posée contre ta main gauche' },
      { id: 'yg_3', speaker: 'Na Ying', hanzi: '在你闪烁时候沉默', pinyin: 'Zài nǐ shǎnshuò shíhou chénmò', french: 'Silencieuse quand tu rayonnes' },
      { id: 'yg_4', speaker: 'Na Ying', hanzi: '等你的抚摩', pinyin: 'Děng nǐ de fǔmō', french: 'Attendant simplement ta caresse' },
      { id: 'yg_5', speaker: 'Na Ying', hanzi: '醒着做梦', pinyin: 'Xǐng zhe zuò mèng', french: 'Rêver éveillée' },
      { id: 'yg_6', speaker: 'Na Ying', hanzi: '听人潮翻涌', pinyin: 'Tīng réncháo fānyǒng', french: 'En écoutant la marée humaine déferler' },
      { id: 'yg_7', speaker: 'Na Ying', hanzi: '像凝固的一条河流', pinyin: 'Xiàng nínggù de yì tiáo héliú', french: 'Telle une rivière figée dans le temps' },
      { id: 'yg_8', speaker: 'Na Ying', hanzi: '在无声荒茫的宇宙', pinyin: 'Zài wúshēng huāngmáng de yǔzhòu', french: 'Dans le silence infini du cosmos' },
      { id: 'yg_9', speaker: 'Na Ying', hanzi: '情愿被孤囚', pinyin: 'Qíngyuàn bèi gūqiú', french: 'Je consens à être recluse par amour' },
      { id: 'yg_10', speaker: 'Na Ying', hanzi: '在独自拥抱的冷冬', pinyin: 'Zài dúzì yōngbào de lěngdōng', french: 'Dans la froide solitude de l’hiver' },
      { id: 'yg_11', speaker: 'Na Ying', hanzi: '黯淡过眼眸', pinyin: 'Àndàn guò yǎnmóu', french: 'Mon regard a perdu son éclat' },
      { id: 'yg_12', speaker: 'Na Ying', hanzi: '转身回首', pinyin: 'Zhuǎnshēn huíshǒu', french: 'En me retournant' },
      { id: 'yg_13', speaker: 'Na Ying', hanzi: '又随你漂游', pinyin: 'Yòu suí nǐ piāoyóu', french: 'Je me laisse porter à la dérive avec toi' },
      { id: 'yg_14', speaker: 'Na Ying', hanzi: '贪留这脉搏的温柔', pinyin: 'Tānliú zhè màibó de wēnróu', french: 'Désirant la douceur de tes battements de cœur' },
      { id: 'yg_15', section: 'Refrain', speaker: 'Na Ying', hanzi: '如果所有的光芒都失去颜色', pinyin: 'Rúguǒ suǒyǒu de guāngmáng dōu shīqù yánsè', french: 'Si toutes les lumières perdaient leurs couleurs' },
      { id: 'yg_16', speaker: 'Na Ying', hanzi: '就擦亮我黑夜里不灭的路灯', pinyin: 'Jiù cāliàng wǒ hēiyè lǐ búmiè de lùdēng', french: 'Ravive ce réverbère qui ne s’éteint jamais dans la nuit' },
      { id: 'yg_17', speaker: 'Na Ying', hanzi: '如果寂寞是拥有的唯一要求', pinyin: 'Rúguǒ jìmò shì yōngyǒu de wéiyī yāoqiú', french: 'Si la solitude est le seul prix pour t’aimer' },
      { id: 'yg_18', speaker: 'Na Ying', hanzi: '就让我寂寞', pinyin: 'Jiù ràng wǒ jìmò', french: 'Alors laisse-moi embrasser la solitude' },
      { id: 'yg_19', section: 'Couplet 2', speaker: 'Na Ying', hanzi: '在无声荒茫的宇宙', pinyin: 'Zài wúshēng huāngmáng de yǔzhòu', french: 'Dans l’immensité silencieuse' },
      { id: 'yg_20', speaker: 'Na Ying', hanzi: '情愿被孤囚', pinyin: 'Qíngyuàn bèi gūqiú', french: 'Je choisis d’être captive de ton souvenir' },
      { id: 'yg_21', speaker: 'Na Ying', hanzi: '在独自拥抱的冷冬', pinyin: 'Zài dúzì yōngbào de lěngdōng', french: 'Au cœur du rude hiver' },
      { id: 'yg_22', speaker: 'Na Ying', hanzi: '黯淡过眼眸', pinyin: 'Àndàn guò yǎnmóu', french: 'Le regard voilé' },
      { id: 'yg_23', speaker: 'Na Ying', hanzi: '转身回首', pinyin: 'Zhuǎnshēn huíshǒu', french: 'Je me tourne vers toi' },
      { id: 'yg_24', speaker: 'Na Ying', hanzi: '又随你漂游', pinyin: 'Yòu suí nǐ piāoyóu', french: 'Et vogue au fil de ton ombre' },
      { id: 'yg_25', speaker: 'Na Ying', hanzi: '贪留这脉搏的温柔', pinyin: 'Tānliú zhè màibó de wēnróu', french: 'Cherchant la tendresse de chaque battement' },
      { id: 'yg_26', section: 'Refrain', speaker: 'Na Ying', hanzi: '如果所有的光芒都失去颜色', pinyin: 'Rúguǒ suǒyǒu de guāngmáng dōu shīqù yánsè', french: 'Si les lumières s’effaçaient' },
      { id: 'yg_27', speaker: 'Na Ying', hanzi: '就擦亮我黑夜里不灭的路灯', pinyin: 'Jiù cāliàng wǒ hēiyè lǐ búmiè de lùdēng', french: 'Que s’allume le phare fidèle au cœur des ténèbres' },
      { id: 'yg_28', speaker: 'Na Ying', hanzi: '如果寂寞是拥有的唯一要求', pinyin: 'Rúguǒ jìmò shì yōngyǒu de wéiyī yāoqiú', french: 'S’il faut souffrir la solitude' },
      { id: 'yg_29', speaker: 'Na Ying', hanzi: '就让我寂寞', pinyin: 'Jiù ràng wǒ jìmò', french: 'Je l’accepte de tout mon cœur' },
      { id: 'yg_30', speaker: 'Na Ying', hanzi: '如果所有的风景变成了沙漠', pinyin: 'Rúguǒ suǒyǒu de fēngjǐng biànchéng le shāmò', french: 'Si tous les paysages devenaient des déserts' },
      { id: 'yg_31', speaker: 'Na Ying', hanzi: '请放逐我如流星碎落的粉末', pinyin: 'Qǐng fàngzhú wǒ rú liúxīng suìluò de fěnmò', french: 'Exile-moi comme la poussière d’une étoile filante' },
      { id: 'yg_32', speaker: 'Na Ying', hanzi: '你会记得在回忆最美的时候', pinyin: 'Nǐ huì jìde zài huíyì zuì měi de shíhou', french: 'Tu te rappelleras qu’au plus bel instant de nos vies' },
      { id: 'yg_33', speaker: 'Na Ying', hanzi: '你爱我', pinyin: 'Nǐ ài wǒ', french: 'Tu m’aimais' },
      { id: 'yg_34', speaker: 'Na Ying', hanzi: '爱我', pinyin: 'Ài wǒ', french: 'Tu m’aimais' },
      { id: 'yg_35', speaker: 'Na Ying', hanzi: '爱我', pinyin: 'Ài wǒ', french: 'Tu m’aimais passionnément' },
    ],
  },
  {
    id: 'chanson_naying',
    titleFr: 'Silence',
    titleZh: '默',
    titlePinyin: 'Mò',
    type: 'chansons',
    level: 'HSK 3',
    duration: '5 min 25',
    artist: 'Na Ying',
    youtubeId: 'XJVuKRMogfE',
    description: 'Le chef-d’œuvre poétique et profond de la grande diva Na Ying. Un classique incontournable du chant chinois.',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'ny_1', section: 'Couplet 1', speaker: 'Na Ying', hanzi: '忍不住化身一条固执的鱼', pinyin: 'Rěn bù zhù huàshēn yì tiáo gùzhí de yú', french: 'Je ne peux m’empêcher de devenir un poisson obstiné' },
      { id: 'ny_2', speaker: 'Na Ying', hanzi: '逆着洋流独自游到底', pinyin: 'Nì zhe yángliú dúzì yóu dào dǐ', french: 'Nageant seul à contre-courant jusqu’au fond des mers' },
      { id: 'ny_3', speaker: 'Na Ying', hanzi: '年少时候虔诚发过的誓', pinyin: 'Niánshào shíhou qiánchéng fā guò de shì', french: 'Ce serment sacré prononcé dans notre jeunesse' },
      { id: 'ny_4', speaker: 'Na Ying', hanzi: '沉默地沉没在深海里', pinyin: 'Chénmò de chénmò zài shēnhǎi lǐ', french: 'Sombre en silence dans les profondeurs de l’océan' },
      { id: 'ny_5', speaker: 'Na Ying', hanzi: '重温几次', pinyin: 'Chóngwēn jǐ cì', french: 'J’ai beau revivre ces souvenirs' },
      { id: 'ny_6', speaker: 'Na Ying', hanzi: '结局还是失去你', pinyin: 'Jiéjú hái shì shīqù nǐ', french: 'La fin reste toujours de te perdre' },
      { id: 'ny_7', section: 'Refrain', speaker: 'Na Ying', hanzi: '我被爱判处终身孤寂', pinyin: 'Wǒ bèi ài pànchǔ zhōngshēn gūjì', french: 'Condamnée par l’amour à une solitude perpétuelle' },
      { id: 'ny_8', speaker: 'Na Ying', hanzi: '不还手', pinyin: 'Bù huánshǒu', french: 'Sans me défendre' },
      { id: 'ny_9', speaker: 'Na Ying', hanzi: '不放手', pinyin: 'Bù fàngshǒu', french: 'Mais sans jamais lâcher prise' },
      { id: 'ny_10', speaker: 'Na Ying', hanzi: '笔下画不完的圆', pinyin: 'Bǐ xià huà bù wán de yuán', french: 'Ce cercle infini que ma plume ne peut clore' },
      { id: 'ny_11', speaker: 'Na Ying', hanzi: '心间填不满的缘', pinyin: 'Xīn jiān tián bù mǎn de yuán', french: 'Ce vide dans mon cœur que nul ne peut combler' },
      { id: 'ny_12', speaker: 'Na Ying', hanzi: '是你', pinyin: 'Shì nǐ', french: 'C’est toi' },
      { id: 'ny_13', speaker: 'Na Ying', hanzi: '为何爱判处众生孤寂', pinyin: 'Wèihé ài pànchǔ zhòngshēng gūjì', french: 'Pourquoi l’amour condamne-t-il tous les êtres à la solitude ?' },
      { id: 'ny_14', speaker: 'Na Ying', hanzi: '挣不脱', pinyin: 'Zhèng bù tuō', french: 'Impossible de s’en détacher' },
      { id: 'ny_15', speaker: 'Na Ying', hanzi: '逃不过', pinyin: 'Táo bú guò', french: 'Impossible d’y échapper' },
      { id: 'ny_16', speaker: 'Na Ying', hanzi: '眉头解不开的结', pinyin: 'Méitóu jiě bù kāi de jié', french: 'Ce pli soucieux impossible à dénouer sur mon front' },
      { id: 'ny_17', speaker: 'Na Ying', hanzi: '命中解不开的劫', pinyin: 'Mìng zhōng jiě bù kāi de jié', french: 'Cette fatalité indélébile inscrite dans mon destin' },
      { id: 'ny_18', speaker: 'Na Ying', hanzi: '是你', pinyin: 'Shì nǐ', french: 'C’est toi' },
      { id: 'ny_19', speaker: 'Na Ying', hanzi: '啊', pinyin: 'A', french: 'Ah...' },
      { id: 'ny_20', speaker: 'Na Ying', hanzi: '失去你', pinyin: 'Shīqù nǐ', french: 'Te perdre' },
      { id: 'ny_21', speaker: 'Na Ying', hanzi: '我失去你', pinyin: 'Wǒ shīqù nǐ', french: 'T’avoir perdu à jamais' },
      { id: 'ny_22', section: 'Couplet 2', speaker: 'Na Ying', hanzi: '忍不住化身一条固执的鱼', pinyin: 'Rěn bù zhù huàshēn yì tiáo gùzhí de yú', french: 'Je redeviens ce poisson obstiné' },
      { id: 'ny_23', speaker: 'Na Ying', hanzi: '逆着洋流独自游到底', pinyin: 'Nì zhe yángliú dúzì yóu dào dǐ', french: 'Qui brave seul la force des courants' },
      { id: 'ny_24', speaker: 'Na Ying', hanzi: '年少时候虔诚发过的誓', pinyin: 'Niánshào shíhou qiánchéng fā guò de shì', french: 'Les vœux sacrés de nos jeunes années' },
      { id: 'ny_25', speaker: 'Na Ying', hanzi: '沉默地沉没在深海里', pinyin: 'Chénmò de chénmò zài shēnhǎi lǐ', french: 'Gisent silencieux dans l’abîme' },
      { id: 'ny_26', speaker: 'Na Ying', hanzi: '周而复始', pinyin: 'Zhōu ér fù shǐ', french: 'Cercle perpétuel' },
      { id: 'ny_27', speaker: 'Na Ying', hanzi: '结局还是失去你', pinyin: 'Jiéjú hái shì shīqù nǐ', french: 'La conclusion inévitable est de te perdre' },
      { id: 'ny_28', section: 'Refrain', speaker: 'Na Ying', hanzi: '我被爱判处终身孤寂', pinyin: 'Wǒ bèi ài pànchǔ zhōngshēn gūjì', french: 'Condamnée à la solitude sans fin' },
      { id: 'ny_29', speaker: 'Na Ying', hanzi: '不还手', pinyin: 'Bù huánshǒu', french: 'Sans défense' },
      { id: 'ny_30', speaker: 'Na Ying', hanzi: '不放手', pinyin: 'Bù fàngshǒu', french: 'Je garde la foi' },
      { id: 'ny_31', speaker: 'Na Ying', hanzi: '笔下画不完的圆', pinyin: 'Bǐ xià huà bù wán de yuán', french: 'Ce cercle inachevé' },
      { id: 'ny_32', speaker: 'Na Ying', hanzi: '心间填不满的缘', pinyin: 'Xīn jiān tián bù mǎn de yuán', french: 'Ce destin inassouvi' },
      { id: 'ny_33', speaker: 'Na Ying', hanzi: '是你', pinyin: 'Shì nǐ', french: 'C’est toi' },
      { id: 'ny_34', speaker: 'Na Ying', hanzi: '为何爱判处众生孤寂', pinyin: 'Wèihé ài pànchǔ zhòngshēng gūjì', french: 'Pourquoi l’amour isole-t-il les âmes sans issue ?' },
      { id: 'ny_35', speaker: 'Na Ying', hanzi: '挣不脱', pinyin: 'Zhèng bù tuō', french: 'Sans pouvoir s’en défaire' },
      { id: 'ny_36', speaker: 'Na Ying', hanzi: '逃不过', pinyin: 'Táo bú guò', french: 'Sans pouvoir fuir' },
      { id: 'ny_37', speaker: 'Na Ying', hanzi: '眉头解不开的结', pinyin: 'Méitóu jiě bù kāi de jié', french: 'Ce tourment indéfectible' },
      { id: 'ny_38', speaker: 'Na Ying', hanzi: '命中解不开的劫', pinyin: 'Mìng zhōng jiě bù kāi de jié', french: 'Cet amour absolu' },
      { id: 'ny_39', speaker: 'Na Ying', hanzi: '是你', pinyin: 'Shì nǐ', french: 'C’est toi' },
      { id: 'ny_40', speaker: 'Na Ying', hanzi: '啊', pinyin: 'A', french: 'Ah...' },
      { id: 'ny_41', speaker: 'Na Ying', hanzi: '失去你', pinyin: 'Shīqù nǐ', french: 'Te perdre' },
      { id: 'ny_42', speaker: 'Na Ying', hanzi: '我失去你', pinyin: 'Wǒ shīqù nǐ', french: 'Mon amour perdu...' },
    ],
  },
  {
    id: 'chanson_tonghua',
    titleFr: 'Conte de Fées',
    titleZh: '童话',
    titlePinyin: 'Tónghuà',
    type: 'chansons',
    level: 'HSK 3',
    duration: '4 min 05',
    artist: 'Michael Wong',
    youtubeId: 'IBTmypxD2mU',
    description: 'La ballade pop chinoise la plus populaire d’Asie. Rythme lent et articulé, idéal pour apprendre des phrases complètes.',
    imageUrl: 'https://images.unsplash.com/photo-1552422535-c45813c61732?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      { id: 'ch4_1', section: 'Couplet 1', speaker: 'Michael Wong', hanzi: '忘了有多久', pinyin: 'Wàng le yǒu duō jiǔ', french: 'J’ai oublié depuis combien de temps' },
      { id: 'ch4_2', speaker: 'Michael Wong', hanzi: '再没听到你', pinyin: 'Zài méi tīng dào nǐ', french: 'Je ne t’ai plus entendue' },
      { id: 'ch4_3', speaker: 'Michael Wong', hanzi: '对我说你最爱的故事', pinyin: 'Duì wǒ shuō nǐ zuì ài de gùshì', french: 'Me raconter ton histoire préférée' },
      { id: 'ch4_4', speaker: 'Michael Wong', hanzi: '我想了很久', pinyin: 'Wǒ xiǎng le hěn jiǔ', french: 'J’y ai songé longtemps' },
      { id: 'ch4_5', speaker: 'Michael Wong', hanzi: '我开始慌了', pinyin: 'Wǒ kāishǐ huāng le', french: 'L’inquiétude m’a envahi' },
      { id: 'ch4_6', speaker: 'Michael Wong', hanzi: '是不是我又做错了什么', pinyin: 'Shì bu shì wǒ yòu zuò cuò le shénme', french: 'Me demandant si j’avais encore fait une maladresse' },
      { id: 'ch4_7', speaker: 'Michael Wong', hanzi: '你哭着对我说', pinyin: 'Nǐ kū zhe duì wǒ shuō', french: 'En pleurant tu m’as dit' },
      { id: 'ch4_8', speaker: 'Michael Wong', hanzi: '童话里都是骗人的', pinyin: 'Tónghuà lǐ dōu shì piàn rén de', french: 'Que les contes de fées n’étaient que des mensonges' },
      { id: 'ch4_9', speaker: 'Michael Wong', hanzi: '我不可能是你的王子', pinyin: 'Wǒ bù kěnéng shì nǐ de wángzǐ', french: 'Que je ne pourrais jamais être ton prince' },
      { id: 'ch4_10', speaker: 'Michael Wong', hanzi: '也许你不会懂', pinyin: 'Yěxǔ nǐ bú huì dǒng', french: 'Peut-être ne le sais-tu pas' },
      { id: 'ch4_11', speaker: 'Michael Wong', hanzi: '从你说爱我以后', pinyin: 'Cóng nǐ shuō ài wǒ yǐhòu', french: 'Mais depuis que tu m’as avoué ton amour' },
      { id: 'ch4_12', speaker: 'Michael Wong', hanzi: '我的天空', pinyin: 'Wǒ de tiānkōng', french: 'Tout mon ciel' },
      { id: 'ch4_13', speaker: 'Michael Wong', hanzi: '星星都亮了', pinyin: 'Xīngxīng dōu liàng le', french: 'Toutes les étoiles se sont illuminées' },
      { id: 'ch4_14', section: 'Refrain', speaker: 'Michael Wong', hanzi: '我愿变成童话里', pinyin: 'Wǒ yuàn biànchéng tónghuà lǐ', french: 'Je veux devenir dans ton conte' },
      { id: 'ch4_15', speaker: 'Michael Wong', hanzi: '你爱的那个天使', pinyin: 'Nǐ ài de nà gè tiānshǐ', french: 'L’ange bienveillant que tu aimes' },
      { id: 'ch4_16', speaker: 'Michael Wong', hanzi: '张开双手', pinyin: 'Zhāngkāi shuāngshǒu', french: 'Ouvrant mes bras' },
      { id: 'ch4_17', speaker: 'Michael Wong', hanzi: '变成翅膀守护你', pinyin: 'Biànchéng chìbǎng shǒuhù nǐ', french: 'Devenus des ailes pour veiller sur toi' },
      { id: 'ch4_18', speaker: 'Michael Wong', hanzi: '你要相信', pinyin: 'Nǐ yào xiāngxìn', french: 'Tu dois y croire' },
      { id: 'ch4_19', speaker: 'Michael Wong', hanzi: '相信我们会像童话故事里', pinyin: 'Xiāngxìn wǒmen huì xiàng tónghuà gùshì lǐ', french: 'Croire que notre histoire sera comme un conte' },
      { id: 'ch4_20', speaker: 'Michael Wong', hanzi: '幸福和快乐是结局', pinyin: 'Xìngfú hé kuàilè shì jiéjú', french: 'Où le bonheur et la joie couronnent la fin' },
      { id: 'ch4_21', section: 'Couplet 2', speaker: 'Michael Wong', hanzi: '你哭着对我说', pinyin: 'Nǐ kū zhe duì wǒ shuō', french: 'Tu m’as dit en pleurs' },
      { id: 'ch4_22', speaker: 'Michael Wong', hanzi: '童话里都是骗人的', pinyin: 'Tónghuà lǐ dōu shì piàn rén de', french: 'Que les contes n’étaient que des illusions' },
      { id: 'ch4_23', speaker: 'Michael Wong', hanzi: '我不可能是你的王子', pinyin: 'Wǒ bù kěnéng shì nǐ de wángzǐ', french: 'Que je ne serais pas ton prince' },
      { id: 'ch4_24', speaker: 'Michael Wong', hanzi: '也许你不会懂', pinyin: 'Yěxǔ nǐ bú huì dǒng', french: 'Tu ne sais sans doute pas' },
      { id: 'ch4_25', speaker: 'Michael Wong', hanzi: '从你说爱我以后', pinyin: 'Cóng nǐ shuō ài wǒ yǐhòu', french: 'Que dès ton premier aveu d’amour' },
      { id: 'ch4_26', speaker: 'Michael Wong', hanzi: '我的天空', pinyin: 'Wǒ de tiānkōng', french: 'Tout mon ciel' },
      { id: 'ch4_27', speaker: 'Michael Wong', hanzi: '星星都亮了', pinyin: 'Xīngxīng dōu liàng le', french: 'S’est illuminé de mille feux' },
      { id: 'ch4_28', section: 'Refrain', speaker: 'Michael Wong', hanzi: '我愿变成童话里', pinyin: 'Wǒ yuàn biànchéng tónghuà lǐ', french: 'Je serai cet ange protecteur' },
      { id: 'ch4_29', speaker: 'Michael Wong', hanzi: '你爱的那个天使', pinyin: 'Nǐ ài de nà gè tiānshǐ', french: 'Prêt à t’aimer' },
      { id: 'ch4_30', speaker: 'Michael Wong', hanzi: '张开双手', pinyin: 'Zhāngkāi shuāngshǒu', french: 'Déployant mes ailes' },
      { id: 'ch4_31', speaker: 'Michael Wong', hanzi: '变成翅膀守护你', pinyin: 'Biànchéng chìbǎng shǒuhù nǐ', french: 'Pour prendre soin de toi' },
      { id: 'ch4_32', speaker: 'Michael Wong', hanzi: '你要相信', pinyin: 'Nǐ yào xiāngxìn', french: 'Aie confiance' },
      { id: 'ch4_33', speaker: 'Michael Wong', hanzi: '相信我们会像童话故事里', pinyin: 'Xiāngxìn wǒmen huì xiàng tónghuà gùshì lǐ', french: 'Notre amour triomphera dans la féerie' },
      { id: 'ch4_34', speaker: 'Michael Wong', hanzi: '幸福和快乐是结局', pinyin: 'Xìngfú hé kuàilè shì jiéjú', french: 'Vers une fin radieuse' },
      { id: 'ch4_35', section: 'Refrain', speaker: 'Michael Wong', hanzi: '我要变成童话里', pinyin: 'Wǒ yào biànchéng tónghuà lǐ', french: 'Oui je deviens pour toi cet ange dévoué' },
      { id: 'ch4_36', speaker: 'Michael Wong', hanzi: '你爱的那个天使', pinyin: 'Nǐ ài de nà gè tiānshǐ', french: 'Que tu chéris tant' },
      { id: 'ch4_37', speaker: 'Michael Wong', hanzi: '张开双手', pinyin: 'Zhāngkāi shuāngshǒu', french: 'Ouvrant grand mes bras' },
      { id: 'ch4_38', speaker: 'Michael Wong', hanzi: '变成翅膀守护你', pinyin: 'Biànchéng chìbǎng shǒuhù nǐ', french: 'Pour te protéger toujours' },
      { id: 'ch4_39', speaker: 'Michael Wong', hanzi: '你要相信', pinyin: 'Nǐ yào xiāngxìn', french: 'Crois-y fermement' },
      { id: 'ch4_40', speaker: 'Michael Wong', hanzi: '相信我们会像童话故事里', pinyin: 'Xiāngxìn wǒmen huì xiàng tónghuà gùshì lǐ', french: 'Comme dans la plus belle des histoires' },
      { id: 'ch4_41', speaker: 'Michael Wong', hanzi: '幸福和快乐是结局', pinyin: 'Xìngfú hé kuàilè shì jiéjú', french: 'Le bonheur infini sera notre destin' },
      { id: 'ch4_42', section: 'Refrain', speaker: 'Michael Wong', hanzi: '我会变成童话里', pinyin: 'Wǒ huì biànchéng tónghuà lǐ', french: 'Je serai à jamais cet ange d’amour' },
      { id: 'ch4_43', speaker: 'Michael Wong', hanzi: '你爱的那个天使', pinyin: 'Nǐ ài de nà gè tiānshǐ', french: 'À tes côtés' },
      { id: 'ch4_44', speaker: 'Michael Wong', hanzi: '张开双手', pinyin: 'Zhāngkāi shuāngshǒu', french: 'Les bras ouverts' },
      { id: 'ch4_45', speaker: 'Michael Wong', hanzi: '变成翅膀守护你', pinyin: 'Biànchéng chìbǎng shǒuhù nǐ', french: 'Pour veiller sur toi éternellement' },
      { id: 'ch4_46', speaker: 'Michael Wong', hanzi: '你要相信', pinyin: 'Nǐ yào xiāngxìn', french: 'Aie foi en nous' },
      { id: 'ch4_47', speaker: 'Michael Wong', hanzi: '相信我们会像童话故事里', pinyin: 'Xiāngxìn wǒmen huì xiàng tónghuà gùshì lǐ', french: 'Notre vie sera un enchantement' },
      { id: 'ch4_48', speaker: 'Michael Wong', hanzi: '幸福和快乐是结局', pinyin: 'Xìngfú hé kuàilè shì jiéjú', french: 'Couronnée de joie et de sérénité' },
      { id: 'ch4_49', speaker: 'Michael Wong', hanzi: '一起写', pinyin: 'Yìqǐ xiě', french: 'Écrivons ensemble' },
      { id: 'ch4_50', speaker: 'Michael Wong', hanzi: '我们的结局', pinyin: 'Wǒmen de jiéjú', french: 'La fin merveilleuse de notre histoire' },
    ],
  },
  {
    id: 'chanson_keneng',
    titleFr: 'Peut-être',
    titleZh: '可能',
    titlePinyin: 'Kěnéng',
    type: 'chansons',
    level: 'HSK 3',
    duration: '3 min 50',
    artist: 'Cheng Xiang',
    youtubeId: 'errNa-R3vDM',
    description: 'Une des chansons poétiques les plus populaires de Chine. Un voyage émotionnel à travers les villes, les saisons et les rêves de jeunesse.',
    imageUrl: 'https://images.unsplash.com/photo-1513415564515-763d91423bdd?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    sentences: [
      { id: 'kn_1', section: 'Couplet 1', speaker: 'Cheng Xiang', hanzi: '可能南方的阳光', pinyin: 'Kěnéng nánfāng de yángguāng', french: 'Peut-être que le soleil du Sud' },
      { id: 'kn_2', speaker: 'Cheng Xiang', hanzi: '照着北方的风', pinyin: 'Zhào zhe běifāng de fēng', french: 'Éclaire le souffle du vent du Nord' },
      { id: 'kn_3', speaker: 'Cheng Xiang', hanzi: '可能时光被吹走', pinyin: 'Kěnéng shíguāng bèi chuī zǒu', french: 'Peut-être que le temps s’envole emporté au loin' },
      { id: 'kn_4', speaker: 'Cheng Xiang', hanzi: '从此无影无踪', pinyin: 'Cóngcǐ wú yǐng wú zōng', french: 'Disparaissant pour toujours sans laisser de trace' },
      { id: 'kn_5', speaker: 'Cheng Xiang', hanzi: '可能故事只剩下一个难忘的人', pinyin: 'Kěnéng gùshì zhǐ shèng xià yí gè nánwàng de rén', french: 'Peut-être que de l’histoire ne reste qu’un être inoubliable' },
      { id: 'kn_6', speaker: 'Cheng Xiang', hanzi: '可能在昨夜梦里', pinyin: 'Kěnéng zài zuóyè mèng lǐ', french: 'Peut-être que dans le rêve de la nuit dernière' },
      { id: 'kn_7', speaker: 'Cheng Xiang', hanzi: '依然笑得纯真', pinyin: 'Yīrán xiào de chúnzhēn', french: 'Son sourire brillait encore d’une douce innocence' },
      { id: 'kn_8', speaker: 'Cheng Xiang', hanzi: '可能北京的后海', pinyin: 'Kěnéng Běijīng de Hòuhǎi', french: 'Peut-être qu’au bord du lac Houhai à Pékin' },
      { id: 'kn_9', speaker: 'Cheng Xiang', hanzi: '许多漂泊的魂', pinyin: 'Xǔduō piāobó de hún', french: 'Errent tant d’âmes voyageuses et vagabondes' },
      { id: 'kn_10', speaker: 'Cheng Xiang', hanzi: '可能成都小酒馆', pinyin: 'Kěnéng Chéngdū xiǎo jiǔguǎn', french: 'Peut-être que dans les petits bistrots de Chengdu' },
      { id: 'kn_11', speaker: 'Cheng Xiang', hanzi: '有群孤独的人', pinyin: 'Yǒu qún gūdú de rén', french: 'Se réunit un groupe de cœurs solitaires' },
      { id: 'kn_12', speaker: 'Cheng Xiang', hanzi: '可能枕边有微笑', pinyin: 'Kěnéng zhěnbiān yǒu wēixiào', french: 'Peut-être qu’un doux sourire au réveil' },
      { id: 'kn_13', speaker: 'Cheng Xiang', hanzi: '才能暖你清晨', pinyin: 'Cái néng nuǎn nǐ qīngchén', french: 'Peut seul réchauffer ton matin' },
      { id: 'kn_14', speaker: 'Cheng Xiang', hanzi: '可能夜空有流星', pinyin: 'Kěnéng yèkōng yǒu liúxīng', french: 'Peut-être qu’une étoile filante dans la nuit' },
      { id: 'kn_15', speaker: 'Cheng Xiang', hanzi: '才能照你前行', pinyin: 'Cái néng zhào nǐ qiánxíng', french: 'Peut illuminer ton chemin vers l’avenir' },
      { id: 'kn_16', section: 'Refrain', speaker: 'Cheng Xiang', hanzi: '可能西安城墙上', pinyin: 'Kěnéng Xī’ān chéngqiáng shàng', french: 'Peut-être que sur les vieux remparts de Xi’an' },
      { id: 'kn_17', speaker: 'Cheng Xiang', hanzi: '有人誓言不分', pinyin: 'Yǒu rén shìyán bù fēn', french: 'Deux amoureux se jurent de ne jamais se quitter' },
      { id: 'kn_18', speaker: 'Cheng Xiang', hanzi: '可能要去到大理', pinyin: 'Kěnéng yào qù dào Dàlǐ', french: 'Peut-être faut-il voyager jusqu’à Dali' },
      { id: 'kn_19', speaker: 'Cheng Xiang', hanzi: '才算爱得认真', pinyin: 'Cái suàn ài de rènzhēn', french: 'Pour apprendre à aimer avec sincérité' },
      { id: 'kn_20', speaker: 'Cheng Xiang', hanzi: '可能谁说要陪你', pinyin: 'Kěnéng shuí shuō yào péi nǐ', french: 'Peut-être que quelqu’un a promis de t’accompagner' },
      { id: 'kn_21', speaker: 'Cheng Xiang', hanzi: '牵手走完一生', pinyin: 'Qiānshǒu zǒu wán yìshēng', french: 'En te tenant la main tout au long de la vie' },
      { id: 'kn_22', speaker: 'Cheng Xiang', hanzi: '可能笑着流出泪', pinyin: 'Kěnéng xiào zhe liú chū lèi', french: 'Peut-être souriras-tu en versant une larme' },
      { id: 'kn_23', speaker: 'Cheng Xiang', hanzi: '某天在某时辰', pinyin: 'Mǒu tiān zài mǒu shíchén', french: 'Un jour à une heure imprévue du destin' },
      { id: 'kn_24', section: 'Couplet 2', speaker: 'Cheng Xiang', hanzi: '可能桂林有渔船', pinyin: 'Kěnéng Guìlín yǒu yúchuán', french: 'Peut-être qu’à Guilin une barque de pêche' },
      { id: 'kn_25', speaker: 'Cheng Xiang', hanzi: '为你迷茫点灯', pinyin: 'Wèi nǐ mímáng diǎn dēng', french: 'Allumera sa lanterne pour dissiper tes doutes' },
      { id: 'kn_26', speaker: 'Cheng Xiang', hanzi: '可能在呼伦草原', pinyin: 'Kěnéng zài Hūlún cǎoyuán', french: 'Peut-être que dans les immenses steppes de Hulunbuir' },
      { id: 'kn_27', speaker: 'Cheng Xiang', hanzi: '牛羊流成风景', pinyin: 'Niú yáng liú chéng fēngjǐng', french: 'Les troupeaux ondulent en un paisible tableau' },
      { id: 'kn_28', speaker: 'Cheng Xiang', hanzi: '可能再也找不到', pinyin: 'Kěnéng zài yě zhǎo bú dào', french: 'Peut-être ne trouveras-tu plus jamais' },
      { id: 'kn_29', speaker: 'Cheng Xiang', hanzi: '愿意相信的人', pinyin: 'Yuànyì xiāngxìn de rén', french: 'Une âme en qui placer toute ta confiance' },
      { id: 'kn_30', speaker: 'Cheng Xiang', hanzi: '可能穿越了彷徨', pinyin: 'Kěnéng chuānyuè le pánghuáng', french: 'Peut-être qu’après avoir traversé les tourments' },
      { id: 'kn_31', speaker: 'Cheng Xiang', hanzi: '脚步才能坚定', pinyin: 'Jiǎobù cái néng jiāndìng', french: 'Tes pas deviendront enfin inébranlables' },
      { id: 'kn_32', speaker: 'Cheng Xiang', hanzi: '可能武当山道上', pinyin: 'Kěnéng Wǔdāng shāndào shàng', french: 'Peut-être que sur les sentiers sacrés du mont Wudang' },
      { id: 'kn_33', speaker: 'Cheng Xiang', hanzi: '有人虔诚攀登', pinyin: 'Yǒu rén qiánchéng pāndēng', french: 'Des pèlerins gravissent les marches avec ferveur' },
      { id: 'kn_34', speaker: 'Cheng Xiang', hanzi: '可能周庄小巷里', pinyin: 'Kěnéng Zhōuzhuāng xiǎoxiàng lǐ', french: 'Peut-être que dans les ruelles d’eau de Zhouzhuang' },
      { id: 'kn_35', speaker: 'Cheng Xiang', hanzi: '忽然忘掉年轮', pinyin: 'Hūrán wàngdiào niánlún', french: 'On oublie en un instant le poids des années' },
      { id: 'kn_36', speaker: 'Cheng Xiang', hanzi: '可能要多年以后', pinyin: 'Kěnéng yào duō nián yǐhòu', french: 'Peut-être faudra-t-il de longues années' },
      { id: 'kn_37', speaker: 'Cheng Xiang', hanzi: '才能看清曾经', pinyin: 'Cái néng kàn qīng céngjīng', french: 'Pour comprendre la beauté du passé' },
      { id: 'kn_38', speaker: 'Cheng Xiang', hanzi: '可能在当时身边', pinyin: 'Kěnéng zài dāngshí shēnbiān', french: 'Peut-être qu’à cette époque près de toi' },
      { id: 'kn_39', speaker: 'Cheng Xiang', hanzi: '有双温柔眼睛', pinyin: 'Yǒu shuāng wēnróu yǎnjīng', french: 'Brillait un regard plein de douceur infinie' },
      { id: 'kn_40', section: 'Refrain', speaker: 'Cheng Xiang', hanzi: '可能西安城墙上', pinyin: 'Kěnéng Xī’ān chéngqiáng shàng', french: 'Peut-être que sur les remparts de Xi’an' },
      { id: 'kn_41', speaker: 'Cheng Xiang', hanzi: '有人誓言不分', pinyin: 'Yǒu rén shìyán bù fēn', french: 'Deux êtres se jurent une union éternelle' },
      { id: 'kn_42', speaker: 'Cheng Xiang', hanzi: '可能要去到大理', pinyin: 'Kěnéng yào qù dào Dàlǐ', french: 'Peut-être faut-il aller jusqu’à Dali' },
      { id: 'kn_43', speaker: 'Cheng Xiang', hanzi: '才算爱得认真', pinyin: 'Cái suàn ài de rènzhēn', french: 'Pour vivre un amour authentique' },
      { id: 'kn_44', speaker: 'Cheng Xiang', hanzi: '可能谁说要陪你', pinyin: 'Kěnéng shuí shuō yào péi nǐ', french: 'Peut-être que quelqu’un a promis de cheminer à tes côtés' },
      { id: 'kn_45', speaker: 'Cheng Xiang', hanzi: '牵手走完一生', pinyin: 'Qiānshǒu zǒu wán yìshēng', french: 'Main dans la main jusqu’au bout du voyage' },
      { id: 'kn_46', speaker: 'Cheng Xiang', hanzi: '可能笑着流出泪', pinyin: 'Kěnéng xiào zhe liú chū lèi', french: 'Peut-être souriras-tu en essuyant une larme' },
      { id: 'kn_47', speaker: 'Cheng Xiang', hanzi: '可能终于有一天', pinyin: 'Kěnéng zhōngyú yǒu yì tiān', french: 'Peut-être qu’un jour enfin' },
      { id: 'kn_48', speaker: 'Cheng Xiang', hanzi: '刚好遇见爱情', pinyin: 'Gānghǎo yùjiàn àiqíng', french: 'Tu croiseras l’amour sur ta route' },
      { id: 'kn_49', speaker: 'Cheng Xiang', hanzi: '可能永远在路上', pinyin: 'Kěnéng yǒngyuǎn zài lù shàng', french: 'Peut-être que toujours sur le chemin' },
      { id: 'kn_50', speaker: 'Cheng Xiang', hanzi: '有人奋斗前行', pinyin: 'Yǒu rén fèndòu qiánxíng', french: 'Des cœurs courageux continuent de bâtir leur destin' },
      { id: 'kn_51', speaker: 'Cheng Xiang', hanzi: '可能一切的可能', pinyin: 'Kěnéng yíqiè de kěnéng', french: 'Peut-être que tous les possibles de ce monde' },
      { id: 'kn_52', speaker: 'Cheng Xiang', hanzi: '相信才有可能', pinyin: 'Xiāngxìn cái yǒu kěnéng', french: 'Ne deviennent réels que si l’on y croit' },
      { id: 'kn_53', speaker: 'Cheng Xiang', hanzi: '可能拥有过梦想', pinyin: 'Kěnéng yōngyǒu guò mèngxiǎng', french: 'Peut-être qu’avoir embrassé des rêves' },
      { id: 'kn_54', speaker: 'Cheng Xiang', hanzi: '才能叫做青春', pinyin: 'Cái néng jiàozuò qīngchūn', french: 'C’est précisément cela qu’on appelle la jeunesse' },
    ],
  },
  {
    id: 'chanson_wode_geshengli',
    titleFr: 'Dans Mon Chant',
    titleZh: '我的歌声里',
    titlePinyin: 'Wǒ De Gēshēng Lǐ',
    type: 'chansons',
    level: 'HSK 3',
    duration: '3 min 40',
    artist: 'Wanting Qu',
    youtubeId: 'w0dMz8RBG7g',
    description: 'Le tube pop culte de Wanting Qu au piano. Une mélodie envoûtante et inoubliable sur les souvenirs et les battements du cœur.',
    imageUrl: 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    sentences: [
      { id: 'wgs_1', section: 'Couplet 1', speaker: 'Wanting Qu', hanzi: '没有一点点防备', pinyin: 'Méiyǒu yì diǎndiǎn fángbèi', french: 'Sans le moindre avertissement' },
      { id: 'wgs_2', speaker: 'Wanting Qu', hanzi: '也没有一丝顾虑', pinyin: 'Yě méiyǒu yì sī gùlǜ', french: 'Sans aucune hésitation ni réserve' },
      { id: 'wgs_3', speaker: 'Wanting Qu', hanzi: '你就这样出现', pinyin: 'Nǐ jiù zhèyàng chūxiàn', french: 'C’est ainsi que tu es apparu' },
      { id: 'wgs_4', speaker: 'Wanting Qu', hanzi: '在我的世界里', pinyin: 'Zài wǒ de shìjiè lǐ', french: 'Au beau milieu de mon univers' },
      { id: 'wgs_5', speaker: 'Wanting Qu', hanzi: '带给我惊喜', pinyin: 'Dài gěi wǒ jīngxǐ', french: 'M’apportant tant de douces surprises' },
      { id: 'wgs_6', speaker: 'Wanting Qu', hanzi: '情不自已', pinyin: 'Qíng bù zìyǐ', french: 'Un amour impossible à contenir' },
      { id: 'wgs_7', speaker: 'Wanting Qu', hanzi: '可是你偏又这样', pinyin: 'Kěshì nǐ piān yòu zhèyàng', french: 'Mais voilà que de la même façon' },
      { id: 'wgs_8', speaker: 'Wanting Qu', hanzi: '在我不知不觉中', pinyin: 'Zài wǒ bù zhī bù jué zhōng', french: 'Sans que je ne m’en aperçoive' },
      { id: 'wgs_9', speaker: 'Wanting Qu', hanzi: '悄悄地消失', pinyin: 'Qiāoqiāo de xiāoshī', french: 'Tu t’es effacé en silence' },
      { id: 'wgs_10', speaker: 'Wanting Qu', hanzi: '从我的世界里', pinyin: 'Cóng wǒ de shìjiè lǐ', french: 'Hors de mon monde' },
      { id: 'wgs_11', speaker: 'Wanting Qu', hanzi: '没有音讯', pinyin: 'Méiyǒu yīnxùn', french: 'Sans laisser de nouvelles' },
      { id: 'wgs_12', speaker: 'Wanting Qu', hanzi: '剩下的只是回忆', pinyin: 'Shèng xià de zhǐshì huíyì', french: 'Ne laissant derrière toi que des souvenirs' },
      { id: 'wgs_13', section: 'Refrain', speaker: 'Wanting Qu', hanzi: '你存在', pinyin: 'Nǐ cúnzài', french: 'Tu existes' },
      { id: 'wgs_14', speaker: 'Wanting Qu', hanzi: '我深深的脑海里', pinyin: 'Wǒ shēnshēn de nǎohǎi lǐ', french: 'Profondément ancré dans mes pensées' },
      { id: 'wgs_15', speaker: 'Wanting Qu', hanzi: '我的梦里', pinyin: 'Wǒ de mèng lǐ', french: 'Dans mes rêves' },
      { id: 'wgs_16', speaker: 'Wanting Qu', hanzi: '我的心里', pinyin: 'Wǒ de xīn lǐ', french: 'Dans mon cœur' },
      { id: 'wgs_17', speaker: 'Wanting Qu', hanzi: '我的歌声里', pinyin: 'Wǒ de gēshēng lǐ', french: 'Présent au cœur de mon chant' },
      { id: 'wgs_18', speaker: 'Wanting Qu', hanzi: '你存在', pinyin: 'Nǐ cúnzài', french: 'Tu vis encore' },
      { id: 'wgs_19', speaker: 'Wanting Qu', hanzi: '我深深的脑海里', pinyin: 'Wǒ shēnshēn de nǎohǎi lǐ', french: 'Tout au fond de ma mémoire' },
      { id: 'wgs_20', speaker: 'Wanting Qu', hanzi: '我的梦里', pinyin: 'Wǒ de mèng lǐ', french: 'Dans mes songes' },
      { id: 'wgs_21', speaker: 'Wanting Qu', hanzi: '我的心里', pinyin: 'Wǒ de xīn lǐ', french: 'Dans mon âme' },
      { id: 'wgs_22', speaker: 'Wanting Qu', hanzi: '我的歌声里', pinyin: 'Wǒ de gēshēng lǐ', french: 'Gravé dans chacune de mes mélodies' },
      { id: 'wgs_23', section: 'Couplet 2', speaker: 'Wanting Qu', hanzi: '还记得我们曾经', pinyin: 'Hái jìde wǒmen céngjīng', french: 'Je me souviens encore qu’autrefois' },
      { id: 'wgs_24', speaker: 'Wanting Qu', hanzi: '肩并肩一起走过', pinyin: 'Jiān bìng jiān yìqǐ zǒuguò', french: 'Nous marchions côte à côte' },
      { id: 'wgs_25', speaker: 'Wanting Qu', hanzi: '那段繁华巷口', pinyin: 'Nà duàn fánhuá xiàngkǒu', french: 'Dans ces ruelles animées' },
      { id: 'wgs_26', speaker: 'Wanting Qu', hanzi: '尽管你我是陌生人', pinyin: 'Jǐnguǎn nǐ wǒ shì mòshēng rén', french: 'Bien que nous fussions des inconnus' },
      { id: 'wgs_27', speaker: 'Wanting Qu', hanzi: '是过路人', pinyin: 'Shì guòlù rén', french: 'De simples passants qui se croisent' },
      { id: 'wgs_28', speaker: 'Wanting Qu', hanzi: '但彼此还是感觉到了对方的', pinyin: 'Dàn bǐcǐ háishì gǎnjué dào le duìfāng de', french: 'Nous ressentions déjà chez l’un et l’autre' },
      { id: 'wgs_29', speaker: 'Wanting Qu', hanzi: '一个眼神', pinyin: 'Yí gè yǎnshén', french: 'L’intensité d’un regard' },
      { id: 'wgs_30', speaker: 'Wanting Qu', hanzi: '一个心跳', pinyin: 'Yí gè xīntiào', french: 'La cadence d’un battement de cœur' },
      { id: 'wgs_31', speaker: 'Wanting Qu', hanzi: '一种意想不到的快乐', pinyin: 'Yì zhǒng yìxiǎng búdào de kuàilè', french: 'Une joie si inattendue et lumineuse' },
      { id: 'wgs_32', speaker: 'Wanting Qu', hanzi: '好像是', pinyin: 'Hǎoxiàng shì', french: 'Comme si c’était' },
      { id: 'wgs_33', speaker: 'Wanting Qu', hanzi: '一场梦境', pinyin: 'Yì chǎng mèngjìng', french: 'Un rêve éveillé' },
      { id: 'wgs_34', speaker: 'Wanting Qu', hanzi: '命中注定', pinyin: 'Mìngzhòng zhùdìng', french: 'Écrit par le destin' },
      { id: 'wgs_35', section: 'Refrain', speaker: 'Wanting Qu', hanzi: '你存在', pinyin: 'Nǐ cúnzài', french: 'Tu demeures' },
      { id: 'wgs_36', speaker: 'Wanting Qu', hanzi: '我深深的脑海里', pinyin: 'Wǒ shēnshēn de nǎohǎi lǐ', french: 'Au plus profond de mes pensées' },
      { id: 'wgs_37', speaker: 'Wanting Qu', hanzi: '我的梦里', pinyin: 'Wǒ de mèng lǐ', french: 'Dans mes rêves' },
      { id: 'wgs_38', speaker: 'Wanting Qu', hanzi: '我的心里', pinyin: 'Wǒ de xīn lǐ', french: 'Dans mon cœur' },
      { id: 'wgs_39', speaker: 'Wanting Qu', hanzi: '我的歌声里', pinyin: 'Wǒ de gēshēng lǐ', french: 'Dans les accords de mon chant' },
      { id: 'wgs_40', speaker: 'Wanting Qu', hanzi: '你存在', pinyin: 'Nǐ cúnzài', french: 'Tu existes toujours' },
      { id: 'wgs_41', speaker: 'Wanting Qu', hanzi: '我深深的脑海里', pinyin: 'Wǒ shēnshēn de nǎohǎi lǐ', french: 'Ancré dans mes souvenirs' },
      { id: 'wgs_42', speaker: 'Wanting Qu', hanzi: '我的梦里', pinyin: 'Wǒ de mèng lǐ', french: 'Dans mes songes' },
      { id: 'wgs_43', speaker: 'Wanting Qu', hanzi: '我的心里', pinyin: 'Wǒ de xīn lǐ', french: 'Dans mon âme' },
      { id: 'wgs_44', speaker: 'Wanting Qu', hanzi: '我的歌声里', pinyin: 'Wǒ de gēshēng lǐ', french: 'Vibrant dans ma voix' },
      { id: 'wgs_45', speaker: 'Wanting Qu', hanzi: '世界之大', pinyin: 'Shìjiè zhī dà', french: 'Le monde est si vaste' },
      { id: 'wgs_46', speaker: 'Wanting Qu', hanzi: '为何我们相遇', pinyin: 'Wèihé wǒmen xiāngyù', french: 'Pourquoi nos chemins se sont-ils croisés ?' },
      { id: 'wgs_47', speaker: 'Wanting Qu', hanzi: '难道是缘分', pinyin: 'Nándào shì yuánfèn', french: 'Serait-ce un lien du destin ?' },
      { id: 'wgs_48', speaker: 'Wanting Qu', hanzi: '难道是天意', pinyin: 'Nándào shì tiānyì', french: 'Une volonté du ciel ?' },
      { id: 'wgs_49', section: 'Refrain', speaker: 'Wanting Qu', hanzi: '你存在', pinyin: 'Nǐ cúnzài', french: 'Tu existes' },
      { id: 'wgs_50', speaker: 'Wanting Qu', hanzi: '我深深的脑海里', pinyin: 'Wǒ shēnshēn de nǎohǎi lǐ', french: 'Au plus profond de mon être' },
      { id: 'wgs_51', speaker: 'Wanting Qu', hanzi: '我的梦里', pinyin: 'Wǒ de mèng lǐ', french: 'Dans mes rêves' },
      { id: 'wgs_52', speaker: 'Wanting Qu', hanzi: '我的心里', pinyin: 'Wǒ de xīn lǐ', french: 'Dans mon cœur' },
      { id: 'wgs_53', speaker: 'Wanting Qu', hanzi: '我的歌声里', pinyin: 'Wǒ de gēshēng lǐ', french: 'À jamais dans mon chant' },
      { id: 'wgs_54', section: 'Refrain', speaker: 'Wanting Qu', hanzi: '你存在', pinyin: 'Nǐ cúnzài', french: 'Tu existes' },
      { id: 'wgs_55', speaker: 'Wanting Qu', hanzi: '我深深的脑海里', pinyin: 'Wǒ shēnshēn de nǎohǎi lǐ', french: 'Gravé dans mes pensées' },
      { id: 'wgs_56', speaker: 'Wanting Qu', hanzi: '我的梦里', pinyin: 'Wǒ de mèng lǐ', french: 'Dans mes rêves' },
      { id: 'wgs_57', speaker: 'Wanting Qu', hanzi: '我的心里', pinyin: 'Wǒ de xīn lǐ', french: 'Dans mon cœur' },
      { id: 'wgs_58', speaker: 'Wanting Qu', hanzi: '我的歌声里', pinyin: 'Wǒ de gēshēng lǐ', french: 'Présent dans ma voix' },
      { id: 'wgs_59', speaker: 'Wanting Qu', hanzi: '你存在', pinyin: 'Nǐ cúnzài', french: 'Tu vis encore' },
      { id: 'wgs_60', speaker: 'Wanting Qu', hanzi: '我深深的脑海里', pinyin: 'Wǒ shēnshēn de nǎohǎi lǐ', french: 'Tout au fond de mon cœur' },
      { id: 'wgs_61', speaker: 'Wanting Qu', hanzi: '我的梦里', pinyin: 'Wǒ de mèng lǐ', french: 'Dans mes rêves' },
      { id: 'wgs_62', speaker: 'Wanting Qu', hanzi: '我的心里', pinyin: 'Wǒ de xīn lǐ', french: 'Dans mon âme' },
      { id: 'wgs_63', speaker: 'Wanting Qu', hanzi: '我的歌声里', pinyin: 'Wǒ de gēshēng lǐ', french: 'Éternellement dans mon chant' },
    ],
  },
  {
    id: 'chanson_renjian_yanhuo',
    titleFr: 'Les Lueurs de ce Monde',
    titleZh: '人间烟火',
    titlePinyin: 'Rénjiān Yānhuǒ',
    type: 'chansons',
    level: 'HSK 3',
    duration: '3 min 35',
    artist: 'Cheng Xiang',
    youtubeId: 'lxPybHy4SoM',
    description: 'Une somptueuse ballade poétique de Cheng Xiang sur la nostalgie du Jiangnan, les ruelles d’eau et les éclats éphémères de la vie.',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    sentences: [
      { id: 'ry_1', section: 'Couplet 1', speaker: 'Cheng Xiang', hanzi: '一人后来过江南', pinyin: 'Yì rén hòulái guò Jiāngnán', french: 'Seul, je suis venu plus tard dans le Sud du fleuve' },
      { id: 'ry_2', speaker: 'Cheng Xiang', hanzi: '烟雨锁惆怅', pinyin: 'Yānyǔ suǒ chóuchàng', french: 'La brume et la pluie enferment la mélancolie' },
      { id: 'ry_3', speaker: 'Cheng Xiang', hanzi: '听得乌篷轻摇桨', pinyin: 'Tīng dé wūpéng qīng yáo jiǎng', french: 'J’entends les rames légères bercer la barque' },
      { id: 'ry_4', speaker: 'Cheng Xiang', hanzi: '竟不知所想', pinyin: 'Jìng bù zhī suǒ xiǎng', french: 'Perdu dans le cours de mes songes' },
      { id: 'ry_5', speaker: 'Cheng Xiang', hanzi: '画船箫鼓声声唱', pinyin: 'Huàchuán xiāogǔ shēngshēng chàng', french: 'Sur les bateaux peints résonnent les flûtes et les tambours' },
      { id: 'ry_6', speaker: 'Cheng Xiang', hanzi: '几曲断人肠', pinyin: 'Jǐ qū duàn rén cháng', french: 'Quelques mélodies qui déchirent l’âme' },
      { id: 'ry_7', speaker: 'Cheng Xiang', hanzi: '谁家墙头', pinyin: 'Shuí jiā qiángtóu', french: 'Au sommet d’un mur inconnu' },
      { id: 'ry_8', speaker: 'Cheng Xiang', hanzi: '有梅自芬芳', pinyin: 'Yǒu méi zì fēnfāng', french: 'Fleurit un prunier au doux parfum' },
      { id: 'ry_9', section: 'Refrain', speaker: 'Cheng Xiang', hanzi: '人间一场烟火', pinyin: 'Rénjiān yì chǎng yānhuǒ', french: 'Un feu d’artifice éphémère dans ce bas monde' },
      { id: 'ry_10', speaker: 'Cheng Xiang', hanzi: '你曾盛开过', pinyin: 'Nǐ céng shèngkāi guò', french: 'Où tu as jadis fleuri de mille éclats' },
      { id: 'ry_11', speaker: 'Cheng Xiang', hanzi: '刻几人在心窝', pinyin: 'Kè jǐ rén zài xīnwō', french: 'Combien d’êtres sont gravés au fond du cœur ?' },
      { id: 'ry_12', speaker: 'Cheng Xiang', hanzi: '从此孤独活', pinyin: 'Cóngcǐ gūdú huó', french: 'Pour continuer à vivre dans la solitude' },
      { id: 'ry_13', speaker: 'Cheng Xiang', hanzi: '江南花已凋落', pinyin: 'Jiāngnán huā yǐ diāoluò', french: 'Les fleurs de Jiangnan se sont déjà fanées' },
      { id: 'ry_14', speaker: 'Cheng Xiang', hanzi: '怎堪再斟酌', pinyin: 'Zěn kān zài zhēnzhuó', french: 'Comment supporter d’y repenser encore ?' },
      { id: 'ry_15', speaker: 'Cheng Xiang', hanzi: '可怜良辰无多', pinyin: 'Kělián liángchén wú duō', french: 'Hélas, les beaux instants sont si éphémères' },
      { id: 'ry_16', speaker: 'Cheng Xiang', hanzi: '竟似无人说', pinyin: 'Jìng sì wú rén shuō', french: 'Et personne à qui confier sa peine' },
      { id: 'ry_17', section: 'Couplet 2', speaker: 'Cheng Xiang', hanzi: '你撑纸伞回头望', pinyin: 'Nǐ chēng zhǐsǎn huítóu wàng', french: 'Tenant ton ombrelle de papier, tu te retournes' },
      { id: 'ry_18', speaker: 'Cheng Xiang', hanzi: '千年乌衣巷', pinyin: 'Qiānnián Wūyī Xiàng', french: 'Vers la ruelle millénaire de Wuyi' },
      { id: 'ry_19', speaker: 'Cheng Xiang', hanzi: '问君青丝有几丈', pinyin: 'Wèn jūn qīngsī yǒu jǐ zhàng', french: 'Dis-moi quelle longueur a ta chevelure' },
      { id: 'ry_20', speaker: 'Cheng Xiang', hanzi: '能把风月量', pinyin: 'Néng bǎ fēngyuè liáng', french: 'Pour mesurer l’immensité des amours et du vent ?' },
      { id: 'ry_21', speaker: 'Cheng Xiang', hanzi: '谁言杯酒醉他乡', pinyin: 'Shuí yán bēijiǔ zuì tāxiāng', french: 'Qui prétend qu’une coupe de vin au loin' },
      { id: 'ry_22', speaker: 'Cheng Xiang', hanzi: '红尘皆可忘', pinyin: 'Hóngchén jiē kě wàng', french: 'Peut faire oublier les tourments de ce monde ?' },
      { id: 'ry_23', speaker: 'Cheng Xiang', hanzi: '凭栏数尽孤帆', pinyin: 'Pínglán shǔ jìn gū fān', french: 'Accoudé au balcon à compter les voiles solitaires' },
      { id: 'ry_24', speaker: 'Cheng Xiang', hanzi: '泪两行', pinyin: 'Lèi liǎng háng', french: 'Deux filets de larmes coulent sur mes joues' },
      { id: 'ry_25', section: 'Refrain', speaker: 'Cheng Xiang', hanzi: '人间一场烟火', pinyin: 'Rénjiān yì chǎng yānhuǒ', french: 'Un feu d’artifice éphémère dans ce monde' },
      { id: 'ry_26', speaker: 'Cheng Xiang', hanzi: '你曾盛开过', pinyin: 'Nǐ céng shèngkāi guò', french: 'Où tu as jadis fleuri avec splendeur' },
      { id: 'ry_27', speaker: 'Cheng Xiang', hanzi: '刻几人在心窝', pinyin: 'Kè jǐ rén zài xīnwō', french: 'Combien d’âmes restent gravées en notre cœur ?' },
      { id: 'ry_28', speaker: 'Cheng Xiang', hanzi: '从此孤独活', pinyin: 'Cóngcǐ gūdú huó', french: 'Désormais voué à une vie solitaire' },
      { id: 'ry_29', speaker: 'Cheng Xiang', hanzi: '江南花已凋落', pinyin: 'Jiāngnán huā yǐ diāoluò', french: 'Les pétales de Jiangnan sont déjà tombés' },
      { id: 'ry_30', speaker: 'Cheng Xiang', hanzi: '怎堪再斟酌', pinyin: 'Zěn kān zài zhēnzhuó', french: 'Comment trouver la force d’y songer encore ?' },
      { id: 'ry_31', speaker: 'Cheng Xiang', hanzi: '可怜良辰无多', pinyin: 'Kělián liángchén wú duō', french: 'Hélas, les moments précieux s’envolent si vite' },
      { id: 'ry_32', speaker: 'Cheng Xiang', hanzi: '竟似无人说', pinyin: 'Jìng sì wú rén shuō', french: 'Sans que personne ne vienne les partager' },
      { id: 'ry_33', section: 'Refrain', speaker: 'Cheng Xiang', hanzi: '人间一场烟火', pinyin: 'Rénjiān yì chǎng yānhuǒ', french: 'Un éclat éphémère dans ce monde terrestre' },
      { id: 'ry_34', speaker: 'Cheng Xiang', hanzi: '你曾盛开过', pinyin: 'Nǐ céng shèngkāi guò', french: 'Où ta présence a brillé de tant de beauté' },
      { id: 'ry_35', speaker: 'Cheng Xiang', hanzi: '刻几人在心窝', pinyin: 'Kè jǐ rén zài xīnwō', french: 'Ceux que l’on garde à jamais au fond de soi' },
      { id: 'ry_36', speaker: 'Cheng Xiang', hanzi: '从此孤独活', pinyin: 'Cóngcǐ gūdú huó', french: 'Et vivre avec ce souvenir en solitaire' },
      { id: 'ry_37', speaker: 'Cheng Xiang', hanzi: '江南花已凋落', pinyin: 'Jiāngnán huā yǐ diāoluò', french: 'Les fleurs de Jiangnan se sont éteintes' },
      { id: 'ry_38', speaker: 'Cheng Xiang', hanzi: '怎堪再斟酌', pinyin: 'Zěn kān zài zhēnzhuó', french: 'Difficile d’en peser la nostalgie' },
      { id: 'ry_39', speaker: 'Cheng Xiang', hanzi: '可怜良辰无多', pinyin: 'Kělián liángchén wú duō', french: 'Hélas, le temps du bonheur est compté' },
      { id: 'ry_40', speaker: 'Cheng Xiang', hanzi: '竟似无人说', pinyin: 'Jìng sì wú rén shuō', french: 'Et nul ne saurait l’exprimer' },
      { id: 'ry_41', speaker: 'Cheng Xiang', hanzi: '可怜良辰无多', pinyin: 'Kělián liángchén wú duō', french: 'Tant de précieux instants perdus' },
      { id: 'ry_42', speaker: 'Cheng Xiang', hanzi: '再难与人说', pinyin: 'Zài nán yǔ rén shuō', french: 'Qu’il est désormais si difficile d’en parler à quiconque' },
    ],
  },
];

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function EcouteLectureContent() {
  const { showPinyin, showFrenchTranslation, audioSpeed } = usePreferences();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Active Sub-Menu Filter: Strictly separated by type (Chansons, Articles, Histoires, Dialogues, Podcasts)
  const [activeCategory, setActiveCategory] = useState<ContentType>('chansons');
  
  // Selected reading item for full-screen immersive focus
  const [activeReading, setActiveReading] = useState<ReadingItem | null>(null);
  const [activeSeries, setActiveSeries] = useState<ReadingItem | null>(null);
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);

  // Audio Playback State inside active reading
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const currentSentenceIndexState = useState(0);
  const currentSentenceIndex = currentSentenceIndexState[0];
  const setCurrentSentenceIndex = currentSentenceIndexState[1];
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(null);
  
  // Local display toggles
  const [localPinyinOverride, setLocalPinyinOverride] = useState<boolean | null>(null);
  const isPinyinVisible = localPinyinOverride !== null ? localPinyinOverride : showPinyin;

  const [localFrenchOverride, setLocalFrenchOverride] = useState<boolean | null>(null);
  const isFrenchVisible = localFrenchOverride !== null ? localFrenchOverride : showFrenchTranslation;

  // Video play state for song player (custom branded play button like Formations)
  const [isPlayingSongVideo, setIsPlayingSongVideo] = useState(false);

  useEffect(() => {
    setIsPlayingSongVideo(false);
  }, [activeReading]);

  const [savedSentenceIds, setSavedSentenceIds] = useState<Set<string>>(new Set());

  // Completed Items State (Mark as completed feature with persistence)
  const [completedItemIds, setCompletedItemIds] = useState<Set<string>>(
    new Set<string>()
  );

  // Computed fields for multi-episode series vs single article/song
  const currentEpisode = activeReading?.seriesEpisodes?.[activeEpisodeIndex] || null;
  const displayedSentences = currentEpisode ? currentEpisode.sentences : (activeReading?.sentences || []);
  const displayedTitleFr = currentEpisode ? currentEpisode.titleFr : (activeReading?.titleFr || '');
  const displayedTitleZh = currentEpisode ? currentEpisode.titleZh : (activeReading?.titleZh || '');
  const displayedTitlePinyin = currentEpisode ? currentEpisode.titlePinyin : (activeReading?.titlePinyin || '');
  const displayedDuration = currentEpisode ? currentEpisode.duration : (activeReading?.duration || '');
  const displayedDescription = currentEpisode ? currentEpisode.description : (activeReading?.description || '');

  // Sync with Supabase & localStorage safely after mount
  useEffect(() => {
    async function loadProgress() {
      if (user) {
        const dbProgress = await fetchContentProgress();
        const completedIds = new Set<string>();
        Object.entries(dbProgress).forEach(([contentId, stat]) => {
          if (stat.isCompleted) completedIds.add(contentId);
        });
        if (completedIds.size > 0) {
          setCompletedItemIds(completedIds);
          return;
        }
      }

      // fallback localStorage
      try {
        const saved = localStorage.getItem('chinoislingo_completed_readings');
        if (saved) {
          setCompletedItemIds(new Set(JSON.parse(saved)));
        }
      } catch {
        // fallback
      }
    }

    loadProgress();
  }, [user]);

  // Handle direct navigation via URL query params (?id=...) e.g. from Dashboard "Continuer"
  useEffect(() => {
    const directId = searchParams.get('id');
    if (directId) {
      const matched = readingCatalog.find((item) => item.id === directId);
      if (matched) {
        setActiveCategory(matched.type);
        setActiveReading(matched);
        setActiveEpisodeIndex(0);
        setCurrentSentenceIndex(0);
        setIsPlayingAll(false);
      }
    }
  }, [searchParams, setCurrentSentenceIndex]);

  // Trigger Celebration Confetti / Paillettes on completion!
  const triggerHapticFeedback = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([40, 60, 40]);
      } catch {
        // ignore
      }
    }
  };

  const triggerCelebration = () => {
    triggerHapticFeedback();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#6200EE', '#03DAC5', '#FFD700', '#00BFA5', '#BB86FC'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#03DAC5', '#6200EE'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FFD700', '#00BFA5'],
        });
      }, 250);
    } catch {
      // ignore
    }
  };

  const toggleCompleteItem = async (id: string) => {
    const isCurrentlyCompleted = completedItemIds.has(id);
    
    setCompletedItemIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyCompleted) {
        next.delete(id);
      } else {
        next.add(id);
        triggerCelebration();
      }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('chinoislingo_completed_readings', JSON.stringify(Array.from(next)));
        } catch {
          // ignore
        }
      }
      return next;
    });

    if (user) {
      const item = readingCatalog.find(r => r.id === id);
      const contentType = item?.type || 'articles';
      await toggleContentCompletedInDb(id, contentType, isCurrentlyCompleted);
    }
  };

  // Filtered and strictly sorted catalogue based on HSK level ascending (HSK 1 -> HSK 2 -> HSK 3 -> HSK 4 -> HSK 5 -> HSK 6)
  const filteredCatalog = useMemo(() => {
    return readingCatalog
      .filter((item) => item.type === activeCategory)
      .sort((a, b) => {
        const levelA = parseInt(a.level.replace(/\D/g, '') || '99', 10);
        const levelB = parseInt(b.level.replace(/\D/g, '') || '99', 10);
        return levelA - levelB;
      });
  }, [activeCategory]);

  // Play audio for a single sentence via Web Speech Synthesis
  const playSentenceAudio = (id: string, text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = parseFloat(audioSpeed) || 0.85;
      setPlayingSentenceId(id);
      utterance.onend = () => setPlayingSentenceId(null);
      utterance.onerror = () => setPlayingSentenceId(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play all sentences sequentially
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isPlayingAll && displayedSentences.length > 0) {
      const sentence = displayedSentences[currentSentenceIndex];
      if (sentence) {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(sentence.hanzi);
          utterance.lang = 'zh-CN';
          utterance.rate = parseFloat(audioSpeed) || 0.85;
          setPlayingSentenceId(sentence.id);

          utterance.onend = () => {
            setPlayingSentenceId(null);
            if (currentSentenceIndex < displayedSentences.length - 1) {
              timeoutId = setTimeout(() => {
                setCurrentSentenceIndex((prev) => prev + 1);
              }, 800);
            } else {
              setIsPlayingAll(false);
              setCurrentSentenceIndex(0);
            }
          };

          utterance.onerror = () => {
            setIsPlayingAll(false);
            setPlayingSentenceId(null);
          };

          window.speechSynthesis.speak(utterance);
        }
      }
    }

    return () => {
      clearTimeout(timeoutId);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlayingAll, currentSentenceIndex, displayedSentences, audioSpeed, setCurrentSentenceIndex]);

  const toggleSaveSentence = (id: string) => {
    setSavedSentenceIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 w-full max-w-full min-w-0 animate-fadeIn pb-12">
      
      {/* ========================================================================= */}
      {/* VIEW A: FULL-SCREEN IMMERSIVE READER / SONG PLAYER VIEW                   */}
      {/* ========================================================================= */}
      {activeReading ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Bar: Back Button, Bilingual Title with Hanzi & Pinyin, Audio Actions ONLY */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => {
                  setIsPlayingAll(false);
                  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                  }
                  setActiveReading(null);
                }}
                type="button"
                className="w-10 h-10 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center hover:bg-[#00897B] hover:text-white transition-colors btn-press shrink-0 shadow-2xs"
                title="Retour au catalogue Écoute & Lecture"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                {/* Detail View Title: French Title (H1) + Chinese Title (Hanzi) + HSK Badge */}
                <h1 className="font-display font-black text-lg sm:text-2xl text-[#212121] dark:text-[#F5F5F5] tracking-tight flex flex-wrap items-center gap-2.5">
                  <span>{displayedTitleFr}</span>
                  <span className="font-hanzi text-base sm:text-xl font-bold text-[#00796B] dark:text-[#03DAC5]">
                    ({displayedTitleZh})
                  </span>
                  <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${getLevelBadgeStyle(activeReading.level)}`}>
                    {activeReading.level}
                  </span>
                </h1>

                {/* Pinyin Subtitle under the title (obeying Pinyin On/Off toggle) */}
                {isPinyinVisible && displayedTitlePinyin && (
                  <p className="font-pinyin text-xs sm:text-sm font-semibold text-[#00796B] dark:text-[#03DAC5] mt-1">
                    {displayedTitlePinyin}
                  </p>
                )}

                {activeReading.artist && (
                  <p className="text-xs font-semibold text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                    Artiste : <span className="font-bold text-[#00796B] dark:text-[#03DAC5]">{activeReading.artist}</span>
                  </p>
                )}

                {activeReading.author && (
                  <p className="text-xs font-semibold text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                    Par <span className="font-bold text-[#6200EE] dark:text-[#BB86FC]">{activeReading.author}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Action Toggles: Pinyin & Traduction Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={() => setLocalPinyinOverride(!isPinyinVisible)}
                type="button"
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border text-[11px] sm:text-xs font-bold transition-all btn-press ${
                  isPinyinVisible
                    ? 'bg-[#00897B] text-white border-[#00897B] shadow-xs'
                    : 'bg-[#FAFAFA] dark:bg-[#1E1E1E] text-[#757575] border-[#E0E0E0] dark:border-[#2D2D2D]'
                }`}
                title={isPinyinVisible ? 'Masquer le pinyin' : 'Afficher le pinyin'}
              >
                {isPinyinVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>Pinyin</span>
              </button>

              <button
                onClick={() => setLocalFrenchOverride(!isFrenchVisible)}
                type="button"
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border text-[11px] sm:text-xs font-bold transition-all btn-press ${
                  isFrenchVisible
                    ? 'bg-[#6200EE] text-white border-[#6200EE] shadow-xs'
                    : 'bg-[#FAFAFA] dark:bg-[#1E1E1E] text-[#757575] border-[#E0E0E0] dark:border-[#2D2D2D]'
                }`}
                title={isFrenchVisible ? 'Masquer la traduction française' : 'Afficher la traduction française'}
              >
                <Languages className="w-3.5 h-3.5" />
                <span>Traduction</span>
              </button>
            </div>
          </div>

          {/* Custom Branded Video Player for Songs (Exact Match with Formations style) */}
          {activeReading.youtubeId && (
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#E0E0E0] dark:border-[#2D2D2D] bg-black aspect-video w-full max-w-4xl mx-auto relative flex items-center justify-center">
              {isPlayingSongVideo ? (
                <iframe
                  key={activeReading.youtubeId}
                  src={`https://www.youtube-nocookie.com/embed/${activeReading.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`}
                  title={`${displayedTitleFr} - ${displayedTitleZh}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0 animate-fadeIn"
                />
              ) : (
                <div
                  onClick={() => setIsPlayingSongVideo(true)}
                  className="relative w-full h-full group cursor-pointer overflow-hidden flex items-center justify-center bg-black select-none"
                >
                  {/* High Quality Thumbnail Cover Image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      activeReading.imageUrl ||
                      `https://img.youtube.com/vi/${activeReading.youtubeId}/hqdefault.jpg`
                    }
                    alt={displayedTitleFr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />

                  {/* Subtle Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/15 transition-all duration-300" />

                  {/* Centered ChinoisLingo Brand Play Button (Ultra-Transparent, No White Border) */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#6200EE]/20 hover:bg-[#6200EE]/35 backdrop-blur-[2px] flex items-center justify-center group-hover:scale-110 active:scale-95 transition-all duration-300">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white/65 text-white/65 group-hover:fill-white/90 group-hover:text-white/90 ml-1 transition-colors" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Continuous Description Banner (Full Width) */}
          <div className="w-full p-4 sm:p-5 rounded-2xl bg-[#00897B]/5 dark:bg-[#00897B]/10 border border-[#00897B]/15 flex items-center justify-between text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] shadow-xs">
            <p className="flex-1 mr-4 leading-relaxed font-medium">
              {activeReading.type === 'chansons' ? '🎶' : '📖'} {displayedDescription}
            </p>
            <div className="flex items-center gap-1.5 font-bold text-[#00796B] dark:text-[#03DAC5] shrink-0">
              <Clock className="w-4 h-4" />
              <span>{displayedDuration}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION LES PERSONNAGES (CADRAGE CONTEXTUEL AVANT TRANSCRIPTION)          */}
          {/* ========================================================================= */}
          {activeReading.characters && activeReading.characters.length > 0 && (
            <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D] pb-3">
                <h3 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{activeReading.type === 'histoires' ? 'Les Personnages de l’Histoire' : 'Les Personnages du Dialogue'}</span>
                </h3>
                <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] bg-black/5 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                  {activeReading.characters.length} intervenants
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeReading.characters.map((char, cIdx) => {
                  const isViolet = char.color === 'violet';
                  const isTurquoise = char.color === 'turquoise';

                  return (
                    <div
                      key={cIdx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isViolet
                          ? 'bg-[#6200EE]/[0.03] dark:bg-[#6200EE]/10 border-[#6200EE]/20 hover:border-[#6200EE]/40'
                          : isTurquoise
                          ? 'bg-[#00897B]/[0.03] dark:bg-[#00897B]/10 border-[#00897B]/20 hover:border-[#00897B]/40'
                          : 'bg-[#FAFAFA] dark:bg-[#252525] border-[#E0E0E0] dark:border-[#333333]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs ${
                              isViolet
                                ? 'bg-[#6200EE] text-white'
                                : isTurquoise
                                ? 'bg-[#00897B] text-white'
                                : 'bg-black/10 dark:bg-white/10 text-[#212121] dark:text-white'
                            }`}
                          >
                            {char.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-display font-black text-sm text-[#212121] dark:text-[#F5F5F5] truncate">
                              {char.name}
                              {char.pinyin && isPinyinVisible && (
                                <span className="ml-1.5 text-xs font-semibold text-[#00796B] dark:text-[#03DAC5]">
                                  ({char.pinyin})
                                </span>
                              )}
                            </h4>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                            isViolet
                              ? 'bg-[#6200EE]/15 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/30'
                              : isTurquoise
                              ? 'bg-[#00897B]/15 text-[#00796B] dark:text-[#03DAC5] border border-[#00897B]/30'
                              : 'bg-black/5 dark:bg-white/5 text-[#757575] dark:text-[#9E9E9E]'
                          }`}
                        >
                          {char.role}
                        </span>
                      </div>

                      <p className="text-xs text-[#616161] dark:text-[#CCCCCC] leading-relaxed font-medium">
                        {char.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LYRICS & TEXT COMPONENT (Hanzi + Pinyin + French Translation) */}
          <div className="nixtio-card p-6 sm:p-8 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-sm divide-y divide-[#E0E0E0]/60 dark:divide-[#2D2D2D]/80">
            <div className="pb-4 mb-2 flex items-center justify-between">
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#00796B] dark:text-[#03DAC5] flex items-center gap-2">
                {activeReading.type === 'chansons' ? <Music className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                <span>{activeReading.type === 'chansons' ? 'Paroles & Traduction (Lyrics)' : 'Texte & Transcription Synchronisée'}</span>
              </h3>
            </div>

            {displayedSentences.map((sent, idx) => {
              const isSentencePlaying = playingSentenceId === sent.id;
              const isCurrentInSequence = isPlayingAll && currentSentenceIndex === idx;
              const isSaved = savedSentenceIds.has(sent.id);
              const isHighlighted = isSentencePlaying || isCurrentInSequence;

              // Character color coding
              const isViolet = sent.speakerColor === 'violet';
              const isTurquoise = sent.speakerColor === 'turquoise';

              return (
                <div
                  key={sent.id}
                  id={`sentence-${sent.id}`}
                  className={`py-3 sm:py-4 px-2.5 sm:px-4 rounded-2xl transition-all duration-200 ${
                    isHighlighted
                      ? 'bg-[#6200EE]/10 dark:bg-[#6200EE]/20 border border-[#6200EE]/30 shadow-xs -mx-1 sm:-mx-2'
                      : 'hover:bg-black/[0.015] dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 w-full">
                    <div className="flex-1 space-y-1 min-w-0 w-full">
                      {/* Section Marker (Couplet / Refrain) for Songs */}
                      {activeReading.type === 'chansons' && sent.section && (
                        <div className="flex items-center gap-2 mb-2 mt-0.5">
                          {sent.section.toLowerCase().includes('refrain') ? (
                            <>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E91E63]/15 dark:bg-[#E91E63]/25 text-[#E91E63] dark:text-[#F48FB1] text-[11px] font-black uppercase tracking-wider border border-[#E91E63]/30 shadow-2xs">
                                🎵 {sent.section}
                              </span>
                              <div className="flex-1 h-px bg-gradient-to-r from-[#E91E63]/40 via-[#E91E63]/15 to-transparent" />
                            </>
                          ) : (
                            <>
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6200EE]/15 dark:bg-[#6200EE]/25 text-[#6200EE] dark:text-[#BB86FC] text-[11px] font-black uppercase tracking-wider border border-[#6200EE]/30 shadow-2xs">
                                📖 {sent.section}
                              </span>
                              <div className="flex-1 h-px bg-gradient-to-r from-[#6200EE]/40 via-[#6200EE]/15 to-transparent" />
                            </>
                          )}
                        </div>
                      )}

                      {/* Differentiated Speaker Badges with Distinct Colors */}
                      {sent.speaker && activeReading.type !== 'chansons' && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-black ${
                            isViolet
                              ? 'text-[#6200EE] dark:text-[#BB86FC]'
                              : isTurquoise
                              ? 'text-[#00796B] dark:text-[#03DAC5]'
                              : 'text-[#616161] dark:text-[#BDBDBD]'
                          }`}>
                            {sent.speaker}
                          </span>
                          {sent.speakerRole && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isViolet
                                ? 'bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20'
                                : isTurquoise
                                ? 'bg-[#00897B]/10 dark:bg-[#00897B]/20 text-[#00796B] dark:text-[#03DAC5] border border-[#00897B]/20'
                                : 'bg-black/5 dark:bg-white/5 text-[#757575] dark:text-[#9E9E9E] border border-black/10 dark:border-white/10'
                            }`}>
                              {sent.speakerRole}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Hanzi Text - 100% Full Width */}
                      <div className="font-hanzi font-black text-lg sm:text-2xl text-[#212121] dark:text-[#F5F5F5] leading-snug break-words w-full">
                        {sent.hanzi}
                      </div>

                      {/* Pinyin with Tone Coloring - 100% Full Width Without Unnecessary Wrapping */}
                      {isPinyinVisible && (
                        <div className="font-pinyin font-bold text-xs sm:text-base text-[#00796B] dark:text-[#03DAC5] tracking-wide leading-snug break-words w-full pt-0.5">
                          {sent.pinyin}
                        </div>
                      )}

                      {/* French Translation */}
                      {isFrenchVisible && (
                        <div className="text-xs sm:text-sm font-medium text-[#757575] dark:text-[#B0B0B0] pt-0.5 leading-snug break-words w-full">
                          {sent.french}
                        </div>
                      )}
                    </div>

                    {/* Audio & Bookmark Actions - Directement rattachés sans vide */}
                    <div className="flex items-center justify-end gap-1.5 shrink-0 self-end sm:self-start pt-1 sm:pt-0 w-full sm:w-auto">
                      <button
                        onClick={() => toggleSaveSentence(sent.id)}
                        type="button"
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all btn-press cursor-pointer ${
                          isSaved
                            ? 'bg-[#00897B] text-white shadow-2xs'
                            : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#757575] hover:text-[#212121] dark:hover:text-white'
                        }`}
                        title={isSaved ? 'Enregistré dans vos favoris' : 'Enregistrer ce vers'}
                      >
                        {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => {
                          setIsPlayingAll(false);
                          playSentenceAudio(sent.id, sent.hanzi);
                        }}
                        type="button"
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all btn-press cursor-pointer ${
                          isSentencePlaying
                            ? 'bg-[#00897B] text-white animate-pulse shadow-xs shadow-[#00897B]/30'
                            : 'bg-[#00897B]/10 text-[#00796B] dark:bg-[#00897B]/20 dark:text-[#03DAC5] hover:bg-[#00897B] hover:text-white'
                        }`}
                        title="Écouter la prononciation de ce vers"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Completion Card: Prominent "Marquer comme terminé" Button with Paillettes Celebration */}
          <div className="nixtio-card p-6 sm:p-7 bg-gradient-to-r from-[#00897B] via-[#00796B] to-[#004D40] text-white rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-lg shadow-[#00897B]/25">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black text-[#03DAC5] tracking-wider px-2 py-0.5 rounded-md bg-white/10 border border-white/20">
                  Validation de la Leçon ✨
                </span>
              </div>
              <h3 className="font-display font-black text-lg sm:text-xl mt-1.5">
                {completedItemIds.has(activeReading.id)
                  ? 'Félicitations ! Vous avez validé ce contenu'
                  : 'Prêt à valider votre session ?'}
              </h3>
              <p className="text-xs text-white/80 mt-1">
                +45 XP ajoutés à votre profil • Progression synchronisée avec votre tableau de bord.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                onClick={() => toggleCompleteItem(activeReading.id)}
                type="button"
                className={`px-6 py-3 rounded-full font-black text-xs sm:text-sm shadow-lg transition-all btn-press shrink-0 ${
                  completedItemIds.has(activeReading.id)
                    ? 'bg-[#E53935] text-white shadow-[#E53935]/40 hover:bg-[#D32F2F]'
                    : 'bg-white text-[#00796B] hover:bg-[#FAFAFA] shadow-black/20'
                }`}
              >
                <span>{completedItemIds.has(activeReading.id) ? '✓ Terminé' : 'Marquer comme terminé'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveReading(null);
                  setIsPlayingAll(false);
                }}
                type="button"
                className="px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-extrabold text-xs transition-all btn-press"
              >
                {activeSeries ? 'Retour à la série' : 'Retour'}
              </button>
            </div>
          </div>
        </div>
      ) : activeSeries ? (
        /* ========================================================================= */
        /* VIEW B: SERIES HUB WITH 3 INDIVIDUAL ARTICLE FRAMES / CARDS               */
        /* ========================================================================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Top Series Header - Épuré et direct */}
          <div className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setActiveSeries(null)}
                type="button"
                className="w-10 h-10 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center hover:bg-[#6200EE] hover:text-white transition-colors btn-press shrink-0 shadow-2xs"
                title="Retour au catalogue général"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="min-w-0">
                <h1 className="font-display font-black text-sm sm:text-base text-[#212121] dark:text-[#F5F5F5] tracking-tight truncate">
                  {activeSeries.titleFr}
                </h1>
                <p className="text-[11px] text-[#757575] dark:text-[#A0A0A0] truncate">
                  Sélectionnez un article pour commencer votre lecture
                </p>
              </div>
            </div>
          </div>

          {/* Grille des 3 Cadres d'Articles (Ratio Carré 1:1 Standard) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeSeries.seriesEpisodes?.map((ep, eIdx) => {
              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    setActiveEpisodeIndex(eIdx);
                    setActiveReading(activeSeries);
                    setCurrentSentenceIndex(0);
                    setIsPlayingAll(false);
                  }}
                  className="nixtio-card flex flex-col bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE] transition-all duration-300 group cursor-pointer shadow-xs hover:shadow-xl rounded-3xl overflow-hidden aspect-square"
                >
                  {/* Moitié Supérieure du Cadre (Image avec Cover Fit & Badges Flottants) */}
                  <div className="relative w-full h-1/2 overflow-hidden bg-black/5 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={ep.imageUrl} 
                      alt={ep.titleFr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Floating HSK Level Badge on Top-Right */}
                    <span className={`absolute top-2.5 right-2.5 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${getLevelBadgeStyle(activeSeries.level)}`}>
                      {activeSeries.level}
                    </span>

                    {/* Floating Episode Badge on Bottom-Left */}
                    <span className="absolute bottom-2.5 left-2.5 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#6200EE] text-white shadow-md">
                      Article {ep.episodeNumber}
                    </span>
                  </div>

                  {/* Moitié Inférieure du Cadre (Titre, Description, Durée, Bouton) */}
                  <div className="p-3.5 sm:p-4 h-1/2 flex flex-col justify-between min-w-0">
                    <div className="min-w-0">
                      <h3 className="font-display font-black text-xs sm:text-[13.5px] text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors leading-snug truncate">
                        {ep.titleFr}
                      </h3>
                      <p className="text-[10.5px] text-[#757575] dark:text-[#A0A0A0] mt-1 line-clamp-2 leading-relaxed font-medium">
                        {ep.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-2.5 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#757575] dark:text-[#A0A0A0] font-semibold">
                        <Clock className="w-3 h-3 text-[#6200EE] dark:text-[#BB86FC]" />
                        <span>{ep.duration}</span>
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs bg-[#6200EE] group-hover:bg-[#4A00B0] text-white transition-all btn-press"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Lire</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* VIEW C: 5 SUB-MENUS: CHANSONS, ARTICLES, HISTOIRES, DIALOGUES, PODCASTS   */
        /* ========================================================================= */
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#00897B]/15 dark:bg-[#00897B]/25 text-[#00796B] dark:text-[#03DAC5] flex items-center justify-center shadow-2xs">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00796B] dark:text-[#03DAC5] px-2.5 py-1 rounded-full bg-[#00897B]/10 dark:bg-[#00897B]/20 border border-[#00897B]/25">
                  Écoute & Lecture
                </span>
              </div>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-[#212121] dark:text-[#F5F5F5] tracking-tight mt-2">
                Écoute & Lecture
              </h1>
              <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-0.5">
                Podcasts réels, histoires courtes, articles, dialogues et chansons chinoises avec paroles synchronisées.
              </p>
            </div>
          </div>

          {/* 5 SUB-MENUS (Chansons, Articles, Histoires, Dialogues, Podcasts) - FLUIDE & RESPONSIVE MOBILE */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-x-auto no-scrollbar scroll-smooth w-full">
            {[
              { id: 'chansons', label: 'Chansons', icon: Music, count: readingCatalog.filter(r => r.type === 'chansons').length },
              { id: 'articles', label: 'Articles', icon: Newspaper, count: readingCatalog.filter(r => r.type === 'articles').length },
              { id: 'histoires', label: 'Histoires', icon: BookMarked, count: readingCatalog.filter(r => r.type === 'histoires').length },
              { id: 'dialogues', label: 'Dialogues', icon: MessagesSquare, count: readingCatalog.filter(r => r.type === 'dialogues').length },
              { id: 'podcasts', label: 'Podcasts', icon: Radio, count: readingCatalog.filter(r => r.type === 'podcasts').length },
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = activeCategory === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={(e) => {
                    setActiveCategory(sub.id as ContentType);
                    // Auto-align clicked tab to start of horizontal scroll
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                  }}
                  type="button"
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all btn-press ${
                    isActive
                      ? 'bg-[#00897B] text-white shadow-xs'
                      : 'text-[#757575] hover:text-[#212121] dark:hover:text-white hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{sub.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-black/[0.05] dark:bg-white/[0.08] text-[#757575] dark:text-[#A0A0A0]'
                  }`}>
                    {sub.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* If Podcasts tab is active and waiting for new studio audio */}
          {activeCategory === 'podcasts' && filteredCatalog.length === 0 ? (
            <div className="nixtio-card p-12 text-center bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-[#00897B]/10 text-[#00796B] dark:text-[#03DAC5] flex items-center justify-center mx-auto shadow-inner">
                <Radio className="w-8 h-8 animate-pulse" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="font-display font-black text-lg text-[#212121] dark:text-[#F5F5F5]">
                  Podcasts Audio en Préparation 🎙️
                </h3>
                <p className="text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] mt-1 leading-relaxed">
                  De nouveaux épisodes de podcast exclusifs animés par <strong>Espoir Chinois</strong> arrivent très bientôt pour perfectionner votre écoute active.
                </p>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* SQUARE RATIO (1:1) CARD GRID WITH TOP HALF IMAGE & COVER FIT              */
            /* ========================================================================= */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCatalog.map((item) => {
                const isCompleted = completedItemIds.has(item.id);
                const hasSeriesEpisodes = !!(item.seriesEpisodes && item.seriesEpisodes.length > 0);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (hasSeriesEpisodes) {
                        setActiveSeries(item);
                      } else {
                        setActiveReading(item);
                        setCurrentSentenceIndex(0);
                        setIsPlayingAll(false);
                      }
                    }}
                    className={`nixtio-card flex flex-col bg-white dark:bg-[#1E1E1E] border transition-all duration-300 group cursor-pointer shadow-xs hover:shadow-xl rounded-3xl overflow-hidden aspect-square ${
                      isCompleted 
                        ? 'border-[#E53935]/40 dark:border-[#E53935]/30' 
                        : hasSeriesEpisodes
                        ? 'border-[#6200EE]/30 dark:border-[#6200EE]/40 hover:border-[#6200EE] hover:shadow-[#6200EE]/10'
                        : 'border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#00897B]'
                    }`}
                  >
                    {/* TOP HALF OF THE SQUARE (IMAGE WITH COVER FIT & FLOATING HSK BADGE) */}
                    <div className="relative w-full h-1/2 overflow-hidden bg-black/5 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.imageUrl} 
                        alt={item.titleFr}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy"
                      />
                      
                      {/* Subtle gradient overlay on bottom of image for sleek depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Floating HSK Level Badge on Top-Right */}
                      <span className={`absolute top-2.5 right-2.5 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${getLevelBadgeStyle(item.level)}`}>
                        {item.level}
                      </span>

                      {/* Unified Badge on Bottom-Left: "Série d'articles • Par Espoir Chinois" */}
                      {hasSeriesEpisodes && (
                        <span className="absolute bottom-2.5 left-2.5 text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white border border-white/15 flex items-center gap-1.5 shadow-sm">
                          <span className="text-[#03DAC5] font-black">Série d’articles</span>
                          <span className="text-white/40">•</span>
                          <span>Par {item.author || 'Espoir Chinois'}</span>
                        </span>
                      )}
                    </div>

                    {/* BOTTOM HALF OF THE SQUARE (TITLE, DESCRIPTION, DURATION, ACTION) */}
                    <div className="p-3.5 sm:p-4 h-1/2 flex flex-col justify-between min-w-0">
                      <div className="min-w-0">
                        {/* Title Clean in French */}
                        <h3 className={`font-display font-black text-xs sm:text-[13.5px] transition-colors leading-snug truncate ${
                          hasSeriesEpisodes 
                            ? 'group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] text-[#212121] dark:text-[#F5F5F5]' 
                            : 'group-hover:text-[#00796B] dark:group-hover:text-[#03DAC5] text-[#212121] dark:text-[#F5F5F5]'
                        }`}>
                          {item.titleFr}
                        </h3>

                        {item.artist && (
                          <p className="text-[10.5px] font-bold text-[#00796B] dark:text-[#03DAC5] mt-0.5 truncate">
                            Artiste : {item.artist}
                          </p>
                        )}
                        
                        {/* Description */}
                        <p className="text-[10.5px] text-[#757575] dark:text-[#A0A0A0] mt-1 line-clamp-2 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>

                      {/* Card Footer: Duration on Left & Action Button on Right */}
                      <div className="pt-2.5 border-t border-[#E0E0E0]/60 dark:border-[#2D2D2D] flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#757575] dark:text-[#A0A0A0] font-semibold">
                          <Clock className={`w-3 h-3 ${hasSeriesEpisodes ? 'text-[#6200EE] dark:text-[#BB86FC]' : 'text-[#00897B] dark:text-[#03DAC5]'}`} />
                          <span>{item.duration}</span>
                        </div>

                        {isCompleted ? (
                          <button
                            type="button"
                            className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold shadow-xs bg-[#E53935] text-white transition-all btn-press shrink-0"
                          >
                            <span>✓ Terminé</span>
                          </button>
                        ) : hasSeriesEpisodes ? (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold shadow-xs bg-[#6200EE] group-hover:bg-[#4A00B0] text-white transition-all btn-press shrink-0"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>Explorer (3)</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs bg-[#00897B] group-hover:bg-[#00695C] text-white transition-all btn-press shrink-0"
                          >
                            {item.type === 'chansons' || item.type === 'podcasts' ? (
                              <Play className="w-3 h-3 fill-white" />
                            ) : (
                              <BookOpen className="w-3 h-3" />
                            )}
                            <span>{item.type === 'chansons' || item.type === 'podcasts' ? 'Écouter' : 'Lire'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function EcouteLecturePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#757575]">Chargement d’Écoute & Lecture...</div>}>
      <EcouteLectureContent />
    </Suspense>
  );
}

