'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Lock,
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
  Video,
  CheckCircle2,
  Sparkles,
  Users,
  Layers,
  Languages,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { usePreferences } from '@/context/PreferencesContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { fetchContentProgress, toggleContentCompletedInDb } from '@/lib/services/progressService';
import { ChinoisLingoVideoPlayer } from '@/components/ui/ChinoisLingoVideoPlayer';
import { useAbonnement } from '@/lib/payments/useAbonnement';
import { contenuAccessible } from '@/lib/payments/acces';
import { EcranPremium, BadgeVerrou } from '@/components/subscription/EcranPremium';
import { Portal } from '@/components/ui/Portal';

export type ContentType = 'chansons' | 'videos' | 'articles' | 'histoires' | 'dialogues' | 'podcasts';

export interface DialogueCharacter {
  name: string;
  nameZh?: string;
  pinyin?: string;
  role: string;
  description: string;
  color?: 'violet' | 'turquoise' | 'amber' | 'pink' | 'neutral';
}

export interface VocabularyWord {
  hanzi: string;
  pinyin: string;
  french: string;
  role?: string;
}

export interface ReadingSentence {
  id: string;
  speaker?: string;
  speakerRole?: string;
  speakerColor?: 'violet' | 'turquoise' | 'amber' | 'pink' | 'neutral'; // Distinct color coding per character
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
  youtubeId?: string;
  level?: string;
  characters?: DialogueCharacter[];
  vocabulary?: VocabularyWord[];
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
  vocabulary?: VocabularyWord[]; // Nouveaux mots (生词) de la leçon ou vidéo
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
  // ================= 0. SÉRIES & VIDÉOS IMMERSIVES (HSK 1) =================
  {
    id: 'video_xiaoli_series',
    titleFr: 'Les Aventures de Xiao Li (Série Animée)',
    titleZh: '小李历险记系列',
    titlePinyin: 'Xiǎo Lǐ Lìxiǎnjì Xìliè',
    type: 'videos',
    level: 'HSK 1',
    duration: '2 épisodes',
    description: 'Suivez les aventures animées et amusantes de Xiao Li, un chat curieux qui vit à Pékin et apprend le chinois pas à pas avec ses amis.',
    imageUrl: 'https://img.youtube.com/vi/8cZ20QY948A/hqdefault.jpg',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    seriesEpisodes: [
      {
        id: 'video_xiaoli_ep1',
        episodeNumber: 1,
        titleFr: 'Épisode 1 : Bonjour !',
        titleZh: '第一集：你好！',
        titlePinyin: 'Dì yī jí: Nǐ hǎo!',
        duration: '0 min 30',
        description: 'Faites la connaissance de Xiao Li, un chat curieux et attachant qui commence ses aventures à Pékin pour apprendre le chinois.',
        imageUrl: 'https://img.youtube.com/vi/8cZ20QY948A/hqdefault.jpg',
        youtubeId: '8cZ20QY948A',
        characters: [
          {
            name: '小李',
            nameZh: '小李',
            pinyin: 'Xiǎo Lǐ',
            role: 'Personnage principal',
            description: 'Un chat roux tigré mignon et curieux qui vit dans une salle de classe à Pékin. C’est le compagnon de 李老师 (Monsieur Li), et il "assiste" à tous les cours — certains élèves plaisantent en disant qu’il comprend le chinois mieux qu’eux ! Dans 小李历险记, il part à la découverte du monde, rencontre des personnages, et vit de petites aventures qui l’aident (et vous aident !) à apprendre le chinois pas à pas.',
            color: 'violet',
          }
        ],
        sentences: [
          {
            id: 'xl1_1',
            speaker: '小李',
            speakerRole: 'Le Chat Curieux',
            speakerColor: 'violet',
            hanzi: '大家好，我叫小李。',
            pinyin: 'Dàjiā hǎo, wǒ jiào Xiǎo Lǐ.',
            french: 'Bonjour tout le monde, je m’appelle Xiǎo Lǐ.',
          },
          {
            id: 'xl1_2',
            speaker: '小李',
            speakerRole: 'Le Chat Curieux',
            speakerColor: 'violet',
            hanzi: '我是一只猫，我住在北京。',
            pinyin: 'Wǒ shì yì zhī māo, wǒ zhù zài Běijīng.',
            french: 'Je suis un chat, j’habite à Pékin.',
          },
          {
            id: 'xl1_3',
            speaker: '小李',
            speakerRole: 'Le Chat Curieux',
            speakerColor: 'violet',
            hanzi: '我喜欢学中文，也喜欢旅游。',
            pinyin: 'Wǒ xǐhuan xué Zhōngwén, yě xǐhuan lǚyóu.',
            french: 'J’aime apprendre le chinois, et j’aime aussi voyager.',
          },
          {
            id: 'xl1_4',
            speaker: '小李',
            speakerRole: 'Le Chat Curieux',
            speakerColor: 'violet',
            hanzi: '我很高兴认识你们！',
            pinyin: 'Wǒ hěn gāoxìng rènshi nǐmen!',
            french: 'Je suis très content de vous rencontrer !',
          },
        ],
        vocabulary: [
          { hanzi: '小李', pinyin: 'Xiǎo Lǐ', french: '(nom du personnage — le chat)', role: 'Nom propre' },
          { hanzi: '只', pinyin: 'zhī', french: 'classificateur pour les animaux (chat, chien, oiseau, lapin, canard...)', role: 'Classificateur (量词)' },
          { hanzi: '北京', pinyin: 'Běijīng', french: 'Pékin', role: 'Nom propre (lieu)' },
          { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'aimer', role: 'Verbe' },
          { hanzi: '高兴', pinyin: 'gāoxìng', french: 'content(e), heureux(se)', role: 'Adjectif' },
        ]
      },
      {
        id: 'video_xiaoli_ep2',
        episodeNumber: 2,
        titleFr: 'Épisode 2 : Mon ami !',
        titleZh: '第二集：我的朋友！',
        titlePinyin: 'Dì èr jí: Wǒ de péngyou!',
        duration: '0 min 30',
        description: 'Xiao Li rencontre Duōduō, un petit chien policier sérieux et adorable pour apprendre à se présenter en chinois.',
        imageUrl: 'https://img.youtube.com/vi/N6G7InZ8_BM/hqdefault.jpg',
        youtubeId: 'N6G7InZ8_BM',
        characters: [
          {
            name: '小李',
            nameZh: '小李',
            pinyin: 'Xiǎo Lǐ',
            role: 'Personnage principal',
            description: 'Un chat roux tigré mignon et curieux qui vit dans une salle de classe à Pékin et explore le monde pour apprendre le chinois.',
            color: 'violet',
          },
          {
            name: '多多',
            nameZh: '多多',
            pinyin: 'Duōduō',
            role: 'Le Nouvel Ami',
            description: 'Un petit chien à la casquette de policier, aussi mignon que sérieux — il aime que tout soit parfaitement en ordre.',
            color: 'turquoise',
          }
        ],
        sentences: [
          {
            id: 'xl2_1',
            speaker: '小李',
            speakerRole: 'Le Chat Curieux',
            speakerColor: 'violet',
            hanzi: '你好！你叫什么名字？',
            pinyin: 'Nǐ hǎo! Nǐ jiào shénme míngzi?',
            french: 'Bonjour ! Comment tu t’appelles ?',
          },
          {
            id: 'xl2_2',
            speaker: '多多',
            speakerRole: 'Le Chien Policier',
            speakerColor: 'turquoise',
            hanzi: '你好！我叫多多。',
            pinyin: 'Nǐ hǎo! Wǒ jiào Duōduō.',
            french: 'Bonjour ! Je m’appelle Duōduō.',
          },
          {
            id: 'xl2_3',
            speaker: '小李',
            speakerRole: 'Le Chat Curieux',
            speakerColor: 'violet',
            hanzi: '认识你，我很高兴。',
            pinyin: 'Rènshi nǐ, wǒ hěn gāoxìng.',
            french: 'Ravi de te rencontrer.',
          },
          {
            id: 'xl2_4',
            speaker: '多多',
            speakerRole: 'Le Chien Policier',
            speakerColor: 'turquoise',
            hanzi: '我也很高兴认识你！',
            pinyin: 'Wǒ yě hěn gāoxìng rènshi nǐ!',
            french: 'Moi aussi, je suis ravi de te rencontrer !',
          },
          {
            id: 'xl2_5',
            speaker: '小李 & 多多',
            speakerRole: 'Les Nouveaux Amis',
            speakerColor: 'violet',
            hanzi: '我们是朋友！',
            pinyin: 'Wǒmen shì péngyou!',
            french: 'Nous sommes amis !',
          },
          {
            id: 'xl2_6',
            speaker: '小李',
            speakerRole: 'Le Chat Curieux',
            speakerColor: 'violet',
            hanzi: '再见，多多！',
            pinyin: 'Zàijiàn, Duōduō!',
            french: 'Au revoir, Duōduō !',
          },
          {
            id: 'xl2_7',
            speaker: '多多',
            speakerRole: 'Le Chien Policier',
            speakerColor: 'turquoise',
            hanzi: '再见，小李！',
            pinyin: 'Zàijiàn, Xiǎo Lǐ!',
            french: 'Au revoir, Xiǎo Lǐ !',
          },
        ],
        vocabulary: [
          { hanzi: '多多', pinyin: 'Duōduō', french: '(nom du personnage — le petit chien policier)', role: 'Nom propre' },
          { hanzi: '名字', pinyin: 'míngzi', french: 'prénom, nom', role: 'Nom' },
          { hanzi: '认识', pinyin: 'rènshi', french: 'faire la connaissance de, connaître', role: 'Verbe' },
          { hanzi: '高兴', pinyin: 'gāoxìng', french: 'content(e), heureux(se), ravi(e)', role: 'Adjectif' },
          { hanzi: '朋友', pinyin: 'péngyou', french: 'ami(e)', role: 'Nom' },
          { hanzi: '再见', pinyin: 'zàijiàn', french: 'au revoir', role: 'Salutation' },
        ]
      }
    ],
    sentences: []
  },
  {
    id: 'video_prendre_taxi',
    titleFr: 'Prendre le Taxi',
    titleZh: '坐出租车',
    titlePinyin: 'Zuò chūzūchē',
    type: 'videos',
    level: 'HSK 1',
    duration: '0 min 30',
    description: 'Accompagnez Lily en taxi pour apprendre à indiquer votre destination et régler une course du quotidien en Chine.',
    imageUrl: 'https://img.youtube.com/vi/RFixTlCYcJs/hqdefault.jpg',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    youtubeId: 'RFixTlCYcJs',
    characters: [
      {
        name: '丽丽',
        nameZh: '丽丽',
        pinyin: 'Lìli',
        role: 'Passagère',
        description: 'Dynamique et toujours pressée d’avancer, Lily a le sourire facile. Aujourd’hui, elle est en route vers l’école.',
        color: 'turquoise',
      },
      {
        name: '司机',
        nameZh: '司机',
        pinyin: 'Sījī',
        role: 'Chauffeur de Taxi',
        description: 'Un chauffeur de taxi discret et professionnel, de ceux qu’on croise tous les jours en ville.',
        color: 'violet',
      }
    ],
    sentences: [
      {
        id: 'taxi_1',
        speaker: '司机',
        speakerRole: 'Le Chauffeur',
        speakerColor: 'violet',
        hanzi: '你好！你去哪儿？',
        pinyin: 'Nǐ hǎo! Nǐ qù nǎr?',
        french: 'Bonjour ! Vous allez où ?',
      },
      {
        id: 'taxi_2',
        speaker: '丽丽',
        speakerRole: 'La Passagère',
        speakerColor: 'turquoise',
        hanzi: '你好，我要去阳光学校。',
        pinyin: 'Nǐ hǎo, wǒ yào qù Yángguāng Xuéxiào.',
        french: 'Bonjour, je veux aller à l’École Soleil.',
      },
      {
        id: 'taxi_3',
        speaker: '司机',
        speakerRole: 'Le Chauffeur',
        speakerColor: 'violet',
        hanzi: '好的，上车吧。',
        pinyin: 'Hǎo de, shàng chē ba.',
        french: 'D’accord, montez.',
      },
      {
        id: 'taxi_4',
        speaker: '司机',
        speakerRole: 'Le Chauffeur',
        speakerColor: 'violet',
        hanzi: '到了。',
        pinyin: 'Dào le.',
        french: 'On est arrivé.',
      },
      {
        id: 'taxi_5',
        speaker: '丽丽',
        speakerRole: 'La Passagère',
        speakerColor: 'turquoise',
        hanzi: '多少钱？',
        pinyin: 'Duōshǎo qián?',
        french: 'Combien ça coûte ?',
      },
      {
        id: 'taxi_6',
        speaker: '司机',
        speakerRole: 'Le Chauffeur',
        speakerColor: 'violet',
        hanzi: '十五块钱。',
        pinyin: 'Shíwǔ kuài qián.',
        french: 'Quinze yuans.',
      },
    ],
    vocabulary: [
      { hanzi: '出租车', pinyin: 'chūzūchē', french: 'taxi', role: 'Nom' },
      { hanzi: '司机', pinyin: 'sījī', french: 'chauffeur, conducteur', role: 'Nom' },
      { hanzi: '哪儿', pinyin: 'nǎr', french: 'où', role: 'Pronom interrogatif' },
      { hanzi: '上车', pinyin: 'shàng chē', french: 'monter en voiture / dans le véhicule', role: 'Verbe' },
      { hanzi: '多少', pinyin: 'duōshao', french: 'combien', role: 'Pronom interrogatif' },
      { hanzi: '块', pinyin: 'kuài', french: 'yuan, unité monétaire', role: 'Classificateur (量词)' },
    ]
  },
  {
    id: 'video_acheter_pommes',
    titleFr: 'Acheter des Pommes',
    titleZh: '买苹果',
    titlePinyin: 'Mǎi píngguǒ',
    type: 'videos',
    level: 'HSK 1',
    duration: '0 min 30',
    description: 'Accompagnez Lily au marché pour apprendre à commander des fruits, compter les quantités et payer en chinois.',
    imageUrl: 'https://img.youtube.com/vi/lssQ7_tvDRk/hqdefault.jpg',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    youtubeId: 'lssQ7_tvDRk',
    characters: [
      {
        name: '丽丽',
        nameZh: '丽丽',
        pinyin: 'Lìli',
        role: 'Cliente',
        description: 'Pleine d’énergie et toujours en mouvement, Lily ne s’arrête jamais bien longtemps. Ce jour-là, elle fait ses courses au marché.',
        color: 'turquoise',
      },
      {
        name: '老王',
        nameZh: '老王',
        pinyin: 'Lǎo Wáng',
        role: 'Marchand de Fruits',
        description: 'Le marchand de fruits du quartier, toujours prêt à accueillir ses clients avec le sourire.',
        color: 'violet',
      }
    ],
    sentences: [
      {
        id: 'pommes_1',
        speaker: '丽丽',
        speakerRole: 'La Cliente',
        speakerColor: 'turquoise',
        hanzi: '你好！我要买苹果。',
        pinyin: 'Nǐ hǎo! Wǒ yào mǎi píngguǒ.',
        french: 'Bonjour ! Je voudrais acheter des pommes.',
      },
      {
        id: 'pommes_2',
        speaker: '老王',
        speakerRole: 'Le Marchand',
        speakerColor: 'violet',
        hanzi: '你好！你要几个？',
        pinyin: 'Nǐ hǎo! Nǐ yào jǐ gè?',
        french: 'Bonjour ! Vous en voulez combien ?',
      },
      {
        id: 'pommes_3',
        speaker: '丽丽',
        speakerRole: 'La Cliente',
        speakerColor: 'turquoise',
        hanzi: '我要五个。',
        pinyin: 'Wǒ yào wǔ gè.',
        french: 'J’en veux cinq.',
      },
      {
        id: 'pommes_4',
        speaker: '老王',
        speakerRole: 'Le Marchand',
        speakerColor: 'violet',
        hanzi: '一个苹果，三块钱。五个苹果，十五块钱。',
        pinyin: 'Yí gè píngguǒ, sān kuài qián. Wǔ gè píngguǒ, shíwǔ kuài qián.',
        french: 'Une pomme, trois yuans. Cinq pommes, quinze yuans.',
      },
      {
        id: 'pommes_5',
        speaker: '丽丽',
        speakerRole: 'La Cliente',
        speakerColor: 'turquoise',
        hanzi: '好，给你钱。',
        pinyin: 'Hǎo, gěi nǐ qián.',
        french: 'D’accord, voici l’argent.',
      },
      {
        id: 'pommes_6',
        speaker: '老王',
        speakerRole: 'Le Marchand',
        speakerColor: 'violet',
        hanzi: '谢谢！再见！',
        pinyin: 'Xièxie! Zàijiàn!',
        french: 'Merci ! Au revoir !',
      },
      {
        id: 'pommes_7',
        speaker: '丽丽',
        speakerRole: 'La Cliente',
        speakerColor: 'turquoise',
        hanzi: '再见！',
        pinyin: 'Zàijiàn!',
        french: 'Au revoir !',
      },
    ],
    vocabulary: [
      { hanzi: '买', pinyin: 'mǎi', french: 'acheter', role: 'Verbe' },
      { hanzi: '苹果', pinyin: 'píngguǒ', french: 'pomme', role: 'Nom' },
      { hanzi: '几', pinyin: 'jǐ', french: 'combien (petites quantités)', role: 'Pronom interrogatif' },
      { hanzi: '个', pinyin: 'gè', french: 'classificateur universel', role: 'Classificateur (量词)' },
      { hanzi: '给', pinyin: 'gěi', french: 'donner, tendre', role: 'Verbe' },
      { hanzi: '钱', pinyin: 'qián', french: 'argent, monnaie', role: 'Nom' },
      { hanzi: '谢谢', pinyin: 'xièxie', french: 'merci, remercier', role: 'Expression / Verbe' },
    ]
  },
  {
    id: 'video_bonjour_subo',
    titleFr: 'Bonjour ! (Se Saluer)',
    titleZh: '你好！',
    titlePinyin: 'Nǐ hǎo!',
    type: 'videos',
    level: 'HSK 1',
    duration: '0 min 20',
    description: 'Lily croise Espoir dans la rue. Apprenez la première formule de salutation essentielle en chinois.',
    imageUrl: 'https://img.youtube.com/vi/M5KnxVYUdGQ/hqdefault.jpg',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    youtubeId: 'M5KnxVYUdGQ',
    characters: [
      {
        name: '丽丽',
        nameZh: '丽丽',
        pinyin: 'Lìli',
        role: 'Passante',
        description: 'Pleine d’énergie et toujours souriante. Aujourd’hui Lily croise Espoir dans la rue.',
        color: 'turquoise',
      },
      {
        name: '苏波',
        nameZh: '苏波',
        pinyin: 'Sūbō',
        role: 'Passant (Espoir)',
        description: 'Espoir parle chinois et traverse souvent les rues animées de la ville. Ce matin-là, il croise Lily sur son chemin.',
        color: 'violet',
      }
    ],
    sentences: [
      {
        id: 'bonjour_1',
        speaker: '丽丽',
        speakerRole: 'Lily',
        speakerColor: 'turquoise',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        french: 'Bonjour !',
      },
      {
        id: 'bonjour_2',
        speaker: '苏波',
        speakerRole: 'Espoir',
        speakerColor: 'violet',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        french: 'Bonjour !',
      },
    ],
    vocabulary: [
      { hanzi: '你好', pinyin: 'nǐ hǎo', french: 'bonjour', role: 'Formule de salutation' },
    ]
  },
  {
    id: 'video_merci_wang',
    titleFr: 'Merci ! (Dire Merci)',
    titleZh: '谢谢！',
    titlePinyin: 'Xièxie!',
    type: 'videos',
    level: 'HSK 1',
    duration: '0 min 20',
    description: 'Grand-mère Wang offre une pomme à Xiao Le pour apprendre à remercier et répondre poliment en chinois.',
    imageUrl: 'https://img.youtube.com/vi/oW2MlykmNDs/hqdefault.jpg',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    youtubeId: 'oW2MlykmNDs',
    characters: [
      {
        name: '王奶奶',
        nameZh: '王奶奶',
        pinyin: 'Wáng nǎinai',
        role: 'Grand-mère Wang',
        description: 'Assise devant chez elle avec un panier de fruits. Aujourd’hui, elle offre une pomme à Xiǎo Lè qui passe par là.',
        color: 'violet',
      },
      {
        name: '小乐',
        nameZh: '小乐',
        pinyin: 'Xiǎo Lè',
        role: 'Écolier',
        description: 'Un petit garçon qui rentre de l’école. Aujourd’hui, il reçoit une pomme de la part de Grand-mère Wang.',
        color: 'turquoise',
      }
    ],
    sentences: [
      {
        id: 'merci_1',
        speaker: '小乐',
        speakerRole: 'Xiao Le',
        speakerColor: 'turquoise',
        hanzi: '谢谢！',
        pinyin: 'Xièxie!',
        french: 'Merci !',
      },
      {
        id: 'merci_2',
        speaker: '王奶奶',
        speakerRole: 'Grand-mère Wang',
        speakerColor: 'violet',
        hanzi: '不客气！',
        pinyin: 'Bú kèqi!',
        french: 'De rien !',
      },
    ],
    vocabulary: [
      { hanzi: '谢谢', pinyin: 'xièxie', french: 'merci', role: 'Formule de politesse' },
      { hanzi: '不客气', pinyin: 'bú kèqi', french: 'de rien', role: 'Formule de politesse' },
    ]
  },
  {
    id: 'video_comment_tu_tappelles',
    titleFr: 'Comment t’appelles-tu ?',
    titleZh: '你叫什么名字？',
    titlePinyin: 'Nǐ jiào shénme míngzi?',
    type: 'videos',
    level: 'HSK 1',
    duration: '0 min 20',
    description: 'Chén Yǎ rencontre Espoir dans un parc pour apprendre à demander et dire son prénom en chinois.',
    imageUrl: 'https://img.youtube.com/vi/Gxl2VZPG_EQ/hqdefault.jpg',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    youtubeId: 'Gxl2VZPG_EQ',
    characters: [
      {
        name: '陈雅',
        nameZh: '陈雅',
        pinyin: 'Chén Yǎ',
        role: 'Lectrice dans le parc',
        description: 'Assise sur un banc dans un parc, en train de lire. Aujourd’hui, elle fait la connaissance d’Espoir.',
        color: 'turquoise',
      },
      {
        name: '苏波',
        nameZh: '苏波',
        pinyin: 'Sūbō',
        role: 'Passant (Espoir)',
        description: 'De passage dans le parc. Aujourd’hui, il rencontre Chén Yǎ sur un banc.',
        color: 'violet',
      }
    ],
    sentences: [
      {
        id: 'nom_1',
        speaker: '陈雅',
        speakerRole: 'Chén Yǎ',
        speakerColor: 'turquoise',
        hanzi: '你叫什么名字？',
        pinyin: 'Nǐ jiào shénme míngzi?',
        french: 'Comment t’appelles-tu ?',
      },
      {
        id: 'nom_2',
        speaker: '苏波',
        speakerRole: 'Espoir',
        speakerColor: 'violet',
        hanzi: '我叫苏波。',
        pinyin: 'Wǒ jiào Sūbō.',
        french: 'Je m’appelle Espoir.',
      },
    ],
    vocabulary: [
      { hanzi: '叫', pinyin: 'jiào', french: 's’appeler', role: 'Verbe' },
      { hanzi: '什么', pinyin: 'shénme', french: 'quoi, quel', role: 'Pronom interrogatif' },
      { hanzi: '名字', pinyin: 'míngzi', french: 'nom, prénom', role: 'Nom commun' },
      { hanzi: '苏波', pinyin: 'Sūbō', french: 'Espoir (nom propre)', role: 'Nom propre' },
    ]
  },
  {
    id: 'video_dou_viens_tu',
    titleFr: 'Quelle est ta nationalité ?',
    titleZh: '你是哪国人？',
    titlePinyin: 'Nǐ shì nǎ guó rén?',
    type: 'videos',
    level: 'HSK 1',
    duration: '0 min 30',
    description: 'M. Wang contrôle les passeports de Marc et d’Espoir à l’aéroport pour apprendre à demander et dire sa nationalité en chinois.',
    imageUrl: 'https://img.youtube.com/vi/VY1FskKIgpA/hqdefault.jpg',
    iconBg: 'from-[#6200EE] to-[#3700B3]',
    youtubeId: 'VY1FskKIgpA',
    characters: [
      {
        name: '王先生',
        nameZh: '王先生',
        pinyin: 'Wáng xiānsheng',
        role: 'Agent des douanes',
        description: 'Un agent des douanes à l’aéroport. Aujourd’hui, il contrôle les passeports de Marc et d’Espoir.',
        color: 'violet',
      },
      {
        name: 'Marc',
        nameZh: '马克',
        pinyin: 'Mǎkè',
        role: 'Voyageur français',
        description: 'Un voyageur français. Aujourd’hui, il passe le contrôle des passeports à son arrivée en Chine.',
        color: 'turquoise',
      },
      {
        name: '苏波',
        nameZh: '苏波',
        pinyin: 'Sūbō',
        role: 'Voyageur béninois (Espoir)',
        description: 'De passage à l’aéroport. Aujourd’hui, il passe le contrôle des passeports juste après Marc.',
        color: 'violet',
      }
    ],
    sentences: [
      {
        id: 'dvt_1',
        speaker: '王先生',
        speakerRole: 'M. Wang',
        speakerColor: 'neutral',
        hanzi: '你是哪国人？',
        pinyin: 'Nǐ shì nǎ guó rén?',
        french: 'Quelle est ta nationalité ?',
      },
      {
        id: 'dvt_2',
        speaker: 'Marc',
        speakerRole: 'Marc',
        speakerColor: 'turquoise',
        hanzi: '我是法国人。',
        pinyin: 'Wǒ shì Fàguó rén.',
        french: 'Je suis français.',
      },
      {
        id: 'dvt_3',
        speaker: '王先生',
        speakerRole: 'M. Wang',
        speakerColor: 'neutral',
        hanzi: '你是哪国人？',
        pinyin: 'Nǐ shì nǎ guó rén?',
        french: 'Quelle est ta nationalité ?',
      },
      {
        id: 'dvt_4',
        speaker: '苏波',
        speakerRole: 'Espoir',
        speakerColor: 'violet',
        hanzi: '我是贝宁人。',
        pinyin: 'Wǒ shì Bèiníng rén.',
        french: 'Je suis béninois.',
      },
      {
        id: 'dvt_5',
        speaker: '王先生',
        speakerRole: 'M. Wang',
        speakerColor: 'neutral',
        hanzi: '好的！',
        pinyin: 'Hǎo de!',
        french: 'D’accord !',
      },
    ],
    vocabulary: [
      { hanzi: '哪', pinyin: 'nǎ', french: 'quel, lequel', role: 'Pronom interrogatif' },
      { hanzi: '国', pinyin: 'guó', french: 'pays', role: 'Nom commun' },
      { hanzi: '人', pinyin: 'rén', french: 'personne (ici : nationalité)', role: 'Nom commun' },
      { hanzi: '法国', pinyin: 'Fàguó', french: 'France', role: 'Nom propre' },
      { hanzi: '贝宁', pinyin: 'Bèiníng', french: 'Bénin', role: 'Nom propre' },
      { hanzi: '好的', pinyin: 'hǎo de', french: 'd’accord', role: 'Expression' },
    ]
  },

  // ================= 1. ARTICLES & LEÇONS ÉCRITES =================
  
  // ---------- NIVEAU HSK 1 ----------
  {
    id: 'article_decouvrir_la_chine',
    titleFr: 'Découvrir la Chine et ses coutumes',
    titleZh: '中国',
    titlePinyin: 'Zhōngguó',
    type: 'articles',
    level: 'HSK 1',
    duration: '1 min 30',
    description: 'Une immersion dans la grandeur de la Chine, sa capitale Pékin, sa langue et ses riches traditions culinaires.',
    imageUrl: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      {
        id: 'art_cn_1',
        hanzi: '中国很大，中国有很多人。',
        pinyin: 'Zhōngguó hěn dà, Zhōngguó yǒu hěn duō rén.',
        french: 'La Chine est très grande et compte beaucoup d’habitants.',
      },
      {
        id: 'art_cn_2',
        hanzi: '北京在中国，北京也很大。',
        pinyin: 'Běijīng zài Zhōngguó, Běijīng yě hěn dà.',
        french: 'Pékin est en Chine, Pékin est également très grande.',
      },
      {
        id: 'art_cn_3',
        hanzi: '中国人说汉语，中国人写汉字。',
        pinyin: 'Zhōngguórén shuō Hànyǔ, Zhōngguórén xiě Hànzì.',
        french: 'Les Chinois parlent le mandarin et écrivent les caractères chinois.',
      },
      {
        id: 'art_cn_4',
        hanzi: '中国人喜欢喝茶，也喜欢中国菜。',
        pinyin: 'Zhōngguórén xǐhuan hē chá, yě xǐhuan Zhōngguó cài.',
        french: 'Les Chinois aiment boire du thé et apprécient aussi la cuisine chinoise.',
      },
    ],
    vocabulary: [
      { hanzi: '中国', pinyin: 'Zhōngguó', french: 'Chine', role: 'Nom propre' },
      { hanzi: '大', pinyin: 'dà', french: 'grand', role: 'Adjectif' },
      { hanzi: '多', pinyin: 'duō', french: 'beaucoup, nombreux', role: 'Adjectif' },
      { hanzi: '人', pinyin: 'rén', french: 'personne, gens', role: 'Nom commun' },
      { hanzi: '北京', pinyin: 'Běijīng', french: 'Pékin', role: 'Nom propre' },
      { hanzi: '说', pinyin: 'shuō', french: 'parler, dire', role: 'Verbe' },
      { hanzi: '汉语', pinyin: 'Hànyǔ', french: 'langue chinoise, mandarin', role: 'Nom propre' },
      { hanzi: '写', pinyin: 'xiě', french: 'écrire', role: 'Verbe' },
      { hanzi: '汉字', pinyin: 'Hànzì', french: 'caractères chinois', role: 'Nom commun' },
      { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'aimer, apprécier', role: 'Verbe' },
      { hanzi: '喝茶', pinyin: 'hē chá', french: 'boire du thé', role: 'Locution verbale' },
      { hanzi: '中国菜', pinyin: 'Zhōngguó cài', french: 'cuisine chinoise, plats chinois', role: 'Nom commun' },
    ]
  },
  {
    id: 'article_mon_ami_chinois',
    titleFr: 'Mon ami chinois de Pékin',
    titleZh: '中国朋友',
    titlePinyin: 'Zhōngguó péngyou',
    type: 'articles',
    level: 'HSK 1',
    duration: '1 min 30',
    description: 'Le portrait chaleureux d’une belle amitié avec Wang Ming, autour d’une tasse de thé et de l’apprentissage des caractères.',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    sentences: [
      {
        id: 'art_friend_1',
        hanzi: '我有一个中国朋友，他叫王明，他是北京人。',
        pinyin: 'Wǒ yǒu yí gè Zhōngguó péngyou, tā jiào Wáng Míng, tā shì Běijīng rén.',
        french: 'J’ai un ami chinois, il s’appelle Wang Ming, il est originaire de Pékin.',
      },
      {
        id: 'art_friend_2',
        hanzi: '他说汉语，也写汉字。',
        pinyin: 'Tā shuō Hànyǔ, yě xiě Hànzì.',
        french: 'Il parle chinois et écrit aussi les caractères chinois.',
      },
      {
        id: 'art_friend_3',
        hanzi: '他喜欢喝茶，也喜欢吃中国菜。',
        pinyin: 'Tā xǐhuan hē chá, yě xǐhuan chī Zhōngguó cài.',
        french: 'Il aime boire du thé et apprécie également la cuisine chinoise.',
      },
      {
        id: 'art_friend_4',
        hanzi: '他请我喝茶，我说：“谢谢。”',
        pinyin: 'Tā qǐng wǒ hē chá, wǒ shuō: “Xièxie.”',
        french: 'Il m’invite à boire le thé, je lui dis : « Merci. »',
      },
      {
        id: 'art_friend_5',
        hanzi: '我们说话，看书，写字，他是我的好朋友。',
        pinyin: 'Wǒmen shuōhuà, kàn shū, xiězì, tā shì wǒ de hǎo péngyou.',
        french: 'Nous discutons, nous lisons, nous écrivons, c’est mon bon ami.',
      },
    ],
    vocabulary: [
      { hanzi: '朋友', pinyin: 'péngyou', french: 'ami(e)', role: 'Nom commun' },
      { hanzi: '北京人', pinyin: 'Běijīng rén', french: 'Pékinois, originaire de Pékin', role: 'Nom' },
      { hanzi: '请', pinyin: 'qǐng', french: 'inviter, prier de', role: 'Verbe' },
      { hanzi: '说话', pinyin: 'shuōhuà', french: 'parler, discuter', role: 'Locution verbale' },
      { hanzi: '我们', pinyin: 'wǒmen', french: 'nous', role: 'Pronom personnel' },
      { hanzi: '好朋友', pinyin: 'hǎo péngyou', french: 'bon ami, meilleur ami', role: 'Nom commun' },
    ]
  },

  // ---------- NIVEAU HSK 4 ----------
  {
    id: 'article_2',
    titleFr: 'L’Importance des Nombres en Chine',
    titleZh: '数字的意义',
    titlePinyin: 'Shùzì de Yìyì',
    type: 'articles',
    level: 'HSK 4',
    duration: '2 min 30',
    description: 'Pourquoi le 8, le 6 et le 4 ont une signification si particulière dans la culture et les affaires chinoises.',
    imageUrl: 'https://images.unsplash.com/photo-1512418490979-92798cec1380?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#3F51B5] to-[#1A237E]',
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
        hanzi: '数字六也很受欢迎，因为“六六大顺”，代表做什么都顺利。',
        pinyin: 'Shùzì liù yě hěn shòu huānyíng, yīnwèi "liùliù dàshùn", dàibiǎo zuò shénme dōu shùnlì.',
        french: 'Le chiffre six est aussi très apprécié, car "liùliù dàshùn" signifie que tout se passera sans accroc, quoi qu’on entreprenne.',
      },
      {
        id: 'a2_4',
        hanzi: '数字四的发音像“死”，所以很多人不太喜欢它。',
        pinyin: 'Shùzì sì de fāyīn xiàng "sǐ", suǒyǐ hěn duō rén bú tài xǐhuan tā.',
        french: 'Le chiffre quatre a une prononciation proche de "mourir", donc beaucoup de gens ne l’aiment pas trop.',
      },
    ],
    vocabulary: [
      { hanzi: '数字', pinyin: 'shùzì', french: 'nombre, chiffre', role: 'Nom commun' },
      { hanzi: '特别', pinyin: 'tèbié', french: 'particulier, spécial', role: 'Adjectif / Adverbe' },
      { hanzi: '发财', pinyin: 'fācái', french: 'faire fortune, prospérer', role: 'Verbe' },
      { hanzi: '受欢迎', pinyin: 'shòu huānyíng', french: 'populaire, apprécié', role: 'Expression' },
      { hanzi: '六六大顺', pinyin: 'liùliù dàshùn', french: 'que tout aille pour le mieux', role: 'Chengyu / Formule' },
      { hanzi: '顺利', pinyin: 'shùnlì', french: 'sans encombre, favorable', role: 'Adjectif' },
      { hanzi: '发音', pinyin: 'fāyīn', french: 'prononciation', role: 'Nom commun' },
    ]
  },

  // ---------- NIVEAU HSK 4 ----------
  {
    id: 'article_1',
    titleFr: 'La Culture du Thé en Chine',
    titleZh: '中国茶文化',
    titlePinyin: 'Zhōngguó Chá Wénhuà',
    type: 'articles',
    level: 'HSK 4',
    duration: '2 min 30',
    description: 'Découvrez la tradition millénaire du thé en Chine et son rôle central dans l’accueil des clients et la visite d’usines.',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#3F51B5] to-[#1A237E]',
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
        hanzi: '带客户参观工厂前，大家喜欢一起喝杯热茶。',
        pinyin: 'Dài kèhù cānguān gōngchǎng qián, dàjiā xǐhuan yīqǐ hē bēi rè chá.',
        french: 'Avant de faire visiter l’usine aux clients, on aime partager une tasse de thé chaud ensemble.',
      },
      {
        id: 'a1_4',
        hanzi: '喝茶能让人放松，也能促进合作。',
        pinyin: 'Hē chá néng ràng rén fàngsōng, yě néng cùjìn hézuò.',
        french: 'Le thé détend les esprits et favorise une coopération harmonieuse.',
      },
    ],
    vocabulary: [
      { hanzi: '客户', pinyin: 'kèhù', french: 'client', role: 'Nom commun' },
      { hanzi: '参观', pinyin: 'cānguān', french: 'visiter (une usine, une entreprise)', role: 'Verbe' },
      { hanzi: '工厂', pinyin: 'gōngchǎng', french: 'usine, fabrique', role: 'Nom commun' },
      { hanzi: '放松', pinyin: 'fàngsōng', french: 'se détendre, se relaxer', role: 'Verbe' },
      { hanzi: '促进', pinyin: 'cùjìn', french: 'favoriser, promouvoir', role: 'Verbe' },
      { hanzi: '合作', pinyin: 'hézuò', french: 'coopération, partenariat', role: 'Nom / Verbe' },
    ]
  },
  {
    id: 'article_cles_affaires_series',
    titleFr: 'Les Clés des Affaires en Chine',
    titleZh: '中国商务宝典',
    titlePinyin: 'Zhōngguó Shāngwù Bǎodiǎn',
    type: 'articles',
    level: 'HSK 4',
    duration: '1 article',
    description: 'Maîtrisez les codes, règles d’étiquette et notions essentielles pour réussir vos négociations et partenariats commerciaux en Chine.',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#3F51B5] to-[#1A237E]',
    seriesEpisodes: [
      {
        id: 'article_carte_visite',
        episodeNumber: 1,
        titleFr: 'Comment échanger une carte de visite en Chine',
        titleZh: '如何在中国交换名片',
        titlePinyin: 'Rúhé zài Zhōngguó jiāohuàn míngpiàn',
        duration: '3 min 10',
        level: 'HSK 4',
        description: 'Comprendre l’importance du premier contact et la politesse dans les échanges commerciaux en Chine.',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'cdv_1',
            hanzi: '在中国，第一次见面递名片要用双手。',
            pinyin: 'Zài Zhōngguó, dì yī cì jiànmiàn dì míngpiàn yào yòng shuāngshǒu.',
            french: 'En Chine, tendez votre carte de visite à deux mains lors de la première rencontre.',
          },
          {
            id: 'cdv_2',
            hanzi: '这是尊重的表现，非常重要。',
            pinyin: 'Zhè shì zūnzhòng de biǎoxiàn, fēicháng zhòngyào.',
            french: 'C’est une marque de respect essentielle.',
          },
          {
            id: 'cdv_3',
            hanzi: '你可以说：这是我的名片，请多关照。',
            pinyin: 'Nǐ kěyǐ shuō: Zhè shì wǒ de míngpiàn, qǐng duō guānzhào.',
            french: 'Vous pouvez dire : Voici ma carte de visite, enchanté de faire affaire avec vous.',
          },
          {
            id: 'cdv_4',
            hanzi: '对方会觉得你很有礼貌，合作会更顺利。',
            pinyin: 'Duìfāng huì juéde nǐ hěn yǒu lǐmào, hézuò huì gèng shùnlì.',
            french: 'Votre interlocuteur vous trouvera poli et la coopération sera plus fluide.',
          },
        ],
        vocabulary: [
          { hanzi: '名片', pinyin: 'míngpiàn', french: 'carte de visite', role: 'Nom commun' },
          { hanzi: '双手', pinyin: 'shuāngshǒu', french: 'les deux mains', role: 'Nom commun' },
          { hanzi: '关照', pinyin: 'guānzhào', french: 'accorder sa bienveillance, prendre soin', role: 'Verbe' },
          { hanzi: '顺利', pinyin: 'shùnlì', french: 'fluide, favorable, avec succès', role: 'Adjectif' },
        ]
      }
    ],
    sentences: [
      {
        id: 'cdv_1',
        hanzi: '在中国，第一次见面递名片要用双手。',
        pinyin: 'Zài Zhōngguó, dì yī cì jiànmiàn dì míngpiàn yào yòng shuāngshǒu.',
        french: 'En Chine, tendez votre carte de visite à deux mains lors de la première rencontre.',
      },
      {
        id: 'cdv_2',
        hanzi: '这是尊重的表现，非常重要。',
        pinyin: 'Zhè shì zūnzhòng de biǎoxiàn, fēicháng zhòngyào.',
        french: 'C’est une marque de respect essentielle.',
      },
      {
        id: 'cdv_3',
        hanzi: '你可以说：这是我的名片，请多关照。',
        pinyin: 'Nǐ kěyǐ shuō: Zhè shì wǒ de míngpiàn, qǐng duō guānzhào.',
        french: 'Vous pouvez dire : Voici ma carte de visite, enchanté de faire affaire avec vous.',
      },
      {
        id: 'cdv_4',
        hanzi: '对方会觉得你很有礼貌，合作会更顺利。',
        pinyin: 'Duìfāng huì juéde nǐ hěn yǒu lǐmào, hézuò huì gèng shùnlì.',
        french: 'Votre interlocuteur vous trouvera poli et la coopération sera plus fluide.',
      },
    ],
  },

  // ================= 2. HISTOIRES COURTES (HSK 1) =================
  {
    id: 'series_mon_chat',
    titleFr: 'Mon chat',
    titleZh: '我的猫',
    titlePinyin: 'Wǒ de māo',
    type: 'histoires',
    level: 'HSK 1',
    duration: '5 épisodes',
    description: 'Une adorable série d’histoires simples et douces pour débutant absolu : suivez les journées de Wang Xiaoming et de son petit chat Xiaobai.',
    imageUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'Wang Xiaoming',
        nameZh: '王小明',
        pinyin: 'Wáng Xiǎomíng',
        role: 'Garçon (6 ans)',
        description: 'Jeune garçon joyeux de six ans qui adore son petit chat Xiaobai.',
        color: 'turquoise'
      },
      {
        name: 'Xiaobai',
        nameZh: '小白',
        pinyin: 'Xiǎobái',
        role: 'Petit chat blanc',
        description: 'Adorable petit chat blanc très joueur qui aime le poisson et les siestes.',
        color: 'amber'
      },
      {
        name: 'Wang Ming',
        nameZh: '王明',
        pinyin: 'Wáng Míng',
        role: 'Ami (8 ans)',
        description: 'Ami de Wang Xiaoming qui a lui aussi un chat nommé Xiaobai.',
        color: 'pink'
      }
    ],
    seriesEpisodes: [
      {
        id: 'mon_chat_ep1',
        episodeNumber: 1,
        titleFr: 'Épisode 1 : Mon chat',
        titleZh: '第一集：我的猫',
        titlePinyin: 'Dì yī jí: Wǒ de māo',
        duration: '1 min',
        level: 'HSK 1',
        description: 'Faites la connaissance de Wang Xiaoming, un jeune garçon de six ans, et de son adorable petit chat Xiaobai.',
        imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'mc_e1_1',
            hanzi: '我是王小明。我六岁。',
            pinyin: 'Wǒ shì Wáng Xiǎomíng. Wǒ liù suì.',
            french: 'Je m’appelle Wang Xiaoming. J’ai six ans.',
          },
          {
            id: 'mc_e1_2',
            hanzi: '我的猫叫小白。',
            pinyin: 'Wǒ de māo jiào Xiǎobái.',
            french: 'Mon chat s’appelle Xiaobai.',
          },
          {
            id: 'mc_e1_3',
            hanzi: '小白很小。小白很漂亮。',
            pinyin: 'Xiǎobái hěn xiǎo. Xiǎobái hěn piàoliang.',
            french: 'Xiaobai est très petit. Xiaobai est très beau.',
          },
          {
            id: 'mc_e1_4',
            hanzi: '我很喜欢小白。小白也很喜欢我。',
            pinyin: 'Wǒ hěn xǐhuan Xiǎobái. Xiǎobái yě hěn xǐhuan wǒ.',
            french: 'J’aime beaucoup Xiaobai. Xiaobai m’aime beaucoup aussi.',
          },
        ],
        vocabulary: [
          { hanzi: '岁', pinyin: 'suì', french: 'an(s) (âge)', role: 'Spécificatif' },
          { hanzi: '猫', pinyin: 'māo', french: 'chat', role: 'Nom commun' },
          { hanzi: '叫', pinyin: 'jiào', french: 's’appeler', role: 'Verbe' },
          { hanzi: '漂亮', pinyin: 'piàoliang', french: 'beau, joli', role: 'Adjectif' },
          { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'aimer, apprécier', role: 'Verbe' },
          { hanzi: '小', pinyin: 'xiǎo', french: 'petit', role: 'Adjectif' },
        ]
      },
      {
        id: 'mon_chat_ep2',
        episodeNumber: 2,
        titleFr: 'Épisode 2 : L’heure du repas',
        titleZh: '第二集：吃东西',
        titlePinyin: 'Dì èr jí: Chī dōngxi',
        duration: '1 min',
        level: 'HSK 1',
        description: 'Il fait très beau aujourd’hui. Pendant que Wang Xiaoming mange son riz, Xiaobai se régale avec du poisson.',
        imageUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'mc_e2_1',
            hanzi: '今天天气很好。不冷，也不热。',
            pinyin: 'Jīntiān tiānqì hěn hǎo. Bù lěng, yě bú rè.',
            french: 'Aujourd’hui il fait très beau. Il ne fait ni froid, ni chaud.',
          },
          {
            id: 'mc_e2_2',
            hanzi: '我吃米饭。我喝水。',
            pinyin: 'Wǒ chī mǐfàn. Wǒ hē shuǐ.',
            french: 'Je mange du riz. Je bois de l’eau.',
          },
          {
            id: 'mc_e2_3',
            hanzi: '小白也喝水。小白不吃米饭。',
            pinyin: 'Xiǎobái yě hē shuǐ. Xiǎobái bù chī mǐfàn.',
            french: 'Xiaobai boit aussi de l’eau. Xiaobai ne mange pas de riz.',
          },
          {
            id: 'mc_e2_4',
            hanzi: '小白吃鱼。',
            pinyin: 'Xiǎobái chī yú.',
            french: 'Xiaobai mange du poisson.',
          },
        ],
        vocabulary: [
          { hanzi: '天气', pinyin: 'tiānqì', french: 'temps (météo)', role: 'Nom commun' },
          { hanzi: '米饭', pinyin: 'mǐfàn', french: 'riz (cuit)', role: 'Nom commun' },
          { hanzi: '鱼', pinyin: 'yú', french: 'poisson', role: 'Nom commun' },
          { hanzi: '冷', pinyin: 'lěng', french: 'froid', role: 'Adjectif' },
          { hanzi: '热', pinyin: 'rè', french: 'chaud', role: 'Adjectif' },
          { hanzi: '喝', pinyin: 'hē', french: 'boire', role: 'Verbe' },
        ]
      },
      {
        id: 'mon_chat_ep3',
        episodeNumber: 3,
        titleFr: 'Épisode 3 : Aller à l’école',
        titleZh: '第三集：去学校',
        titlePinyin: 'Dì sān jí: Qù xuéxiào',
        duration: '1 min',
        level: 'HSK 1',
        description: 'Wang Xiaoming part à l’école pour étudier et écrire, tandis que Xiaobai passe sa journée à dormir paisiblement.',
        imageUrl: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'mc_e3_1',
            hanzi: '我去学校。小白在家。',
            pinyin: 'Wǒ qù xuéxiào. Xiǎobái zài jiā.',
            french: 'Je vais à l’école. Xiaobai est à la maison.',
          },
          {
            id: 'mc_e3_2',
            hanzi: '我在学校看书。我也写字。',
            pinyin: 'Wǒ zài xuéxiào kàn shū. Wǒ yě xiě zì.',
            french: 'À l’école je lis des livres. J’écris aussi.',
          },
          {
            id: 'mc_e3_3',
            hanzi: '小白在家睡觉。',
            pinyin: 'Xiǎobái zài jiā shuìjiào.',
            french: 'Xiaobai dort à la maison.',
          },
          {
            id: 'mc_e3_4',
            hanzi: '下午，我回家。小白在家。',
            pinyin: 'Xiàwǔ, wǒ huí jiā. Xiǎobái zài jiā.',
            french: 'L’après-midi, je rentre à la maison. Xiaobai est à la maison.',
          },
        ],
        vocabulary: [
          { hanzi: '学校', pinyin: 'xuéxiào', french: 'école', role: 'Nom commun' },
          { hanzi: '看书', pinyin: 'kàn shū', french: 'lire des livres', role: 'Verbe + Objet' },
          { hanzi: '写字', pinyin: 'xiě zì', french: 'écrire', role: 'Verbe + Objet' },
          { hanzi: '睡觉', pinyin: 'shuìjiào', french: 'dormir', role: 'Verbe' },
          { hanzi: '回家', pinyin: 'huí jiā', french: 'rentrer à la maison', role: 'Verbe + Objet' },
          { hanzi: '下午', pinyin: 'xiàwǔ', french: 'après-midi', role: 'Nom temporel' },
        ]
      },
      {
        id: 'mon_chat_ep4',
        episodeNumber: 4,
        titleFr: 'Épisode 4 : Aller au parc',
        titleZh: '第四集：去公园',
        titlePinyin: 'Dì sì jí: Qù gōngyuán',
        duration: '1 min',
        level: 'HSK 1',
        description: 'Wang Xiaoming emmène Xiaobai se promener dans un grand parc rempli de monde.',
        imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'mc_e4_1',
            hanzi: '我和小白去公园。',
            pinyin: 'Wǒ hé Xiǎobái qù gōngyuán.',
            french: 'Xiaobai et moi allons au parc.',
          },
          {
            id: 'mc_e4_2',
            hanzi: '公园很大。',
            pinyin: 'Gōngyuán hěn dà.',
            french: 'Le parc est très grand.',
          },
          {
            id: 'mc_e4_3',
            hanzi: '公园里有很多人。',
            pinyin: 'Gōngyuán lǐ yǒu hěn duō rén.',
            french: 'Il y a beaucoup de monde dans le parc.',
          },
          {
            id: 'mc_e4_4',
            hanzi: '小白看大家。',
            pinyin: 'Xiǎobái kàn dàjiā.',
            french: 'Xiaobai regarde tout le monde.',
          },
        ],
        vocabulary: [
          { hanzi: '公园', pinyin: 'gōngyuán', french: 'parc', role: 'Nom commun' },
          { hanzi: '里', pinyin: 'lǐ', french: 'dans, à l’intérieur', role: 'Postposition' },
          { hanzi: '很多', pinyin: 'hěn duō', french: 'beaucoup', role: 'Quantificateur' },
          { hanzi: '人', pinyin: 'rén', french: 'personne, gens', role: 'Nom commun' },
          { hanzi: '大家', pinyin: 'dàjiā', french: 'tout le monde', role: 'Pronom' },
          { hanzi: '大', pinyin: 'dà', french: 'grand', role: 'Adjectif' },
        ]
      },
      {
        id: 'mon_chat_ep5',
        episodeNumber: 5,
        titleFr: 'Épisode 5 : Un ami vient chez moi',
        titleZh: '第五集：朋友来我家',
        titlePinyin: 'Dì wǔ jí: Péngyou lái wǒ jiā',
        duration: '1 min',
        level: 'HSK 1',
        description: 'Wang Ming, un ami de huit ans, vient rendre visite à Wang Xiaoming à la maison avec son propre chat.',
        imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'mc_e5_1',
            hanzi: '今天，我的朋友来我家。',
            pinyin: 'Jīntiān, wǒ de péngyou lái wǒ jiā.',
            french: 'Aujourd’hui, mon ami vient chez moi.',
          },
          {
            id: 'mc_e5_2',
            hanzi: '他叫王明。',
            pinyin: 'Tā jiào Wáng Míng.',
            french: 'Il s’appelle Wang Ming.',
          },
          {
            id: 'mc_e5_3',
            hanzi: '他八岁。',
            pinyin: 'Tā bā suì.',
            french: 'Il a huit ans.',
          },
          {
            id: 'mc_e5_4',
            hanzi: '他也有一只猫。',
            pinyin: 'Tā yě yǒu yì zhī māo.',
            french: 'Lui aussi a un chat.',
          },
          {
            id: 'mc_e5_5',
            hanzi: '他的猫也叫小白。',
            pinyin: 'Tā de māo yě jiào Xiǎobái.',
            french: 'Son chat s’appelle aussi Xiaobai.',
          },
        ],
        vocabulary: [
          { hanzi: '朋友', pinyin: 'péngyou', french: 'ami', role: 'Nom commun' },
          { hanzi: '来', pinyin: 'lái', french: 'venir', role: 'Verbe' },
          { hanzi: '我家', pinyin: 'wǒ jiā', french: 'chez moi', role: 'Expression de lieu' },
          { hanzi: '八', pinyin: 'bā', french: 'huit', role: 'Nombre' },
          { hanzi: '只', pinyin: 'zhī', french: '(spécificatif pour animaux)', role: 'Spécificatif' },
          { hanzi: '猫', pinyin: 'māo', french: 'chat', role: 'Nom commun' },
          { hanzi: '有', pinyin: 'yǒu', french: 'avoir', role: 'Verbe' },
        ]
      }
    ],
    sentences: [
      {
        id: 'mc_e1_1',
        hanzi: '我是王小明。我六岁。',
        pinyin: 'Wǒ shì Wáng Xiǎomíng. Wǒ liù suì.',
        french: 'Je m’appelle Wang Xiaoming. J’ai six ans.',
      },
      {
        id: 'mc_e1_2',
        hanzi: '我的猫叫小白。',
        pinyin: 'Wǒ de māo jiào Xiǎobái.',
        french: 'Mon chat s’appelle Xiaobai.',
      },
      {
        id: 'mc_e1_3',
        hanzi: '小白很小。小白很漂亮。',
        pinyin: 'Xiǎobái hěn xiǎo. Xiǎobái hěn piàoliang.',
        french: 'Xiaobai est très petit. Xiaobai est très beau.',
      },
      {
        id: 'mc_e1_4',
        hanzi: '我很喜欢小白。小白也很喜欢我。',
        pinyin: 'Wǒ hěn xǐhuan Xiǎobái. Xiǎobái yě hěn xǐhuan wǒ.',
        french: 'J’aime beaucoup Xiaobai. Xiaobai m’aime beaucoup aussi.',
      },
    ],
    vocabulary: [
      { hanzi: '岁', pinyin: 'suì', french: 'an(s) (âge)', role: 'Spécificatif' },
      { hanzi: '猫', pinyin: 'māo', french: 'chat', role: 'Nom commun' },
      { hanzi: '叫', pinyin: 'jiào', french: 's’appeler', role: 'Verbe' },
      { hanzi: '漂亮', pinyin: 'piàoliang', french: 'beau, joli', role: 'Adjectif' },
      { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'aimer, apprécier', role: 'Verbe' },
      { hanzi: '小', pinyin: 'xiǎo', french: 'petit', role: 'Adjectif' },
    ]
  },
  {
    id: 'series_vie_chine_business',
    titleFr: 'Vie en Chine : Business',
    titleZh: '中国生活：商务',
    titlePinyin: 'Zhōngguó Shēnghuó: Shāngwù',
    type: 'histoires',
    level: 'HSK 1',
    duration: '5 épisodes',
    description: 'Suivez les péripéties et premiers pas de Brice, Anthony et Katia dans le monde des affaires en Chine.',
    imageUrl: 'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'Brice',
        nameZh: '布里斯',
        pinyin: 'Bùlǐsī',
        role: 'Entrepreneur',
        description: 'Entrepreneur arrivé en Chine pour développer son activité d’import-export.',
        color: 'amber'
      },
      {
        name: 'Anthony',
        nameZh: '安东尼',
        pinyin: 'Āndōngní',
        role: 'Homme d’affaires',
        description: 'Partenaire d’affaires déterminé à tisser de nouveaux partenariats.',
        color: 'turquoise'
      },
      {
        name: 'Katia',
        nameZh: '卡蒂娅',
        pinyin: 'Kǎdìyà',
        role: 'Femme d’affaires',
        description: 'Rejoint l’équipe pour des réunions stratégiques à Pékin.',
        color: 'pink'
      }
    ],
    seriesEpisodes: [
      {
        id: 'vie_chine_business_ep1',
        episodeNumber: 1,
        titleFr: 'Épisode 1 : Arrivées en Chine',
        titleZh: '第一集：到达中国',
        titlePinyin: 'Dì yī jí: Dàodá Zhōngguó',
        duration: '1 min',
        level: 'HSK 1',
        description: 'Brice, Anthony et Katia arrivent tour à tour en Chine pour leur voyage d’affaires.',
        imageUrl: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'vc_b1_1',
            hanzi: '星期二早上，布里斯先到了中国。',
            pinyin: 'Xīngqī\'èr zǎoshang, Bùlǐsī xiān dào le Zhōngguó.',
            french: 'Mardi matin, Brice est arrivé en Chine en premier.',
          },
          {
            id: 'vc_b1_2',
            hanzi: '两天后，星期四晚上，安东尼也到了。',
            pinyin: 'Liǎng tiān hòu, xīngqīsì wǎnshang, Āndōngní yě dào le.',
            french: 'Deux jours après, jeudi soir, Anthony est arrivé aussi.',
          },
          {
            id: 'vc_b1_3',
            hanzi: '最后，星期六早上十点，卡蒂娅到了。',
            pinyin: 'Zuìhòu, xīngqīliù zǎoshang shí diǎn, Kǎdìyà dào le.',
            french: 'Enfin, samedi matin à dix heures, Katia est arrivée.',
          },
        ],
        vocabulary: [
          { hanzi: '先', pinyin: 'xiān', french: 'd’abord, en premier', role: 'Adverbe' },
          { hanzi: '两天后', pinyin: 'liǎng tiān hòu', french: 'deux jours après', role: 'Expression temporelle' },
          { hanzi: '最后', pinyin: 'zuìhòu', french: 'finalement, enfin', role: 'Adverbe' },
          { hanzi: '星期二', pinyin: 'xīngqī\'èr', french: 'mardi', role: 'Nom temporel' },
          { hanzi: '星期四', pinyin: 'xīngqīsì', french: 'jeudi', role: 'Nom temporel' },
          { hanzi: '星期六', pinyin: 'xīngqīliù', french: 'samedi', role: 'Nom temporel' },
          { hanzi: '早上', pinyin: 'zǎoshang', french: 'matin', role: 'Nom temporel' },
          { hanzi: '晚上', pinyin: 'wǎnshang', french: 'soir', role: 'Nom temporel' },
          { hanzi: '十点', pinyin: 'shí diǎn', french: 'dix heures', role: 'Expression horaire' },
        ]
      },
      {
        id: 'vie_chine_business_ep2',
        episodeNumber: 2,
        titleFr: 'Épisode 2 : Katia prend le taxi',
        titleZh: '第二集：卡蒂娅坐出租车',
        titlePinyin: 'Dì èr jí: Kǎdìyà zuò chūzūchē',
        duration: '1 min 15',
        level: 'HSK 1',
        description: 'Katia prend un taxi à l’aéroport pour rejoindre son hôtel à Pékin.',
        imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'vc_b2_1',
            hanzi: '卡蒂娅坐出租车从机场去酒店。',
            pinyin: 'Kǎdìyà zuò chūzūchē cóng jīchǎng qù jiǔdiàn.',
            french: 'Katia prend un taxi de l’aéroport à l’hôtel.',
          },
          {
            id: 'vc_b2_2',
            speaker: 'Chauffeur',
            speakerRole: 'Chauffeur de taxi',
            speakerColor: 'turquoise',
            hanzi: '您好，您去哪儿？',
            pinyin: 'Nín hǎo, nín qù nǎr?',
            french: 'Bonjour, où allez-vous ?',
          },
          {
            id: 'vc_b2_3',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '我去北京酒店。',
            pinyin: 'Wǒ qù Běijīng jiǔdiàn.',
            french: 'Je vais à l’hôtel de Pékin.',
          },
          {
            id: 'vc_b2_4',
            speaker: 'Chauffeur',
            speakerRole: 'Chauffeur de taxi',
            speakerColor: 'turquoise',
            hanzi: '好。',
            pinyin: 'Hǎo.',
            french: 'D’accord.',
          },
          {
            id: 'vc_b2_5',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '多少钱？',
            pinyin: 'Duōshao qián?',
            french: 'Combien ça coûte ?',
          },
          {
            id: 'vc_b2_6',
            speaker: 'Chauffeur',
            speakerRole: 'Chauffeur de taxi',
            speakerColor: 'turquoise',
            hanzi: '四十块。',
            pinyin: 'Sìshí kuài.',
            french: 'Quarante yuans.',
          },
          {
            id: 'vc_b2_7',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '好，谢谢。',
            pinyin: 'Hǎo, xièxie.',
            french: 'D’accord, merci.',
          },
        ],
        vocabulary: [
          { hanzi: '司机', pinyin: 'sījī', french: 'chauffeur', role: 'Nom commun' },
          { hanzi: '您', pinyin: 'nín', french: 'vous (vouvoiement)', role: 'Pronom' },
          { hanzi: '哪儿', pinyin: 'nǎr', french: 'où', role: 'Pronom interrogatif' },
          { hanzi: '钱', pinyin: 'qián', french: 'argent', role: 'Nom commun' },
          { hanzi: '块', pinyin: 'kuài', french: 'yuan (unité monétaire)', role: 'Spécificatif' },
          { hanzi: '出租车', pinyin: 'chūzūchē', french: 'taxi', role: 'Nom commun' },
          { hanzi: '机场', pinyin: 'jīchǎng', french: 'aéroport', role: 'Nom commun' },
          { hanzi: '酒店', pinyin: 'jiǔdiàn', french: 'hôtel', role: 'Nom commun' },
        ]
      },
      {
        id: 'vie_chine_business_ep3',
        episodeNumber: 3,
        titleFr: 'Épisode 3 : À l’hôtel',
        titleZh: '第三集：在酒店',
        titlePinyin: 'Dì sān jí: Zài jiǔdiàn',
        duration: '1 min 30',
        level: 'HSK 1',
        description: 'Arrivée à l’hôtel, Katia appelle Brice pour faire le point avant leurs rendez-vous du lendemain.',
        imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'vc_b3_1',
            hanzi: '酒店很大，也很漂亮，有很多房间。',
            pinyin: 'Jiǔdiàn hěn dà, yě hěn piàoliang, yǒu hěn duō fángjiān.',
            french: 'L’hôtel est grand, très beau, et il y a beaucoup de chambres.',
          },
          {
            id: 'vc_b3_2',
            hanzi: '卡蒂娅在房间给布里斯打电话。',
            pinyin: 'Kǎdìyà zài fángjiān gěi Bùlǐsī dǎ diànhuà.',
            french: 'Katia appelle Brice depuis sa chambre.',
          },
          {
            id: 'vc_b3_3',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '喂，你好。',
            pinyin: 'Wèi, nǐ hǎo.',
            french: 'Allô, bonjour.',
          },
          {
            id: 'vc_b3_4',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '布里斯，你好！我是卡蒂娅。',
            pinyin: 'Bùlǐsī, nǐ hǎo! Wǒ shì Kǎdìyà.',
            french: 'Brice, bonjour ! C’est Katia.',
          },
          {
            id: 'vc_b3_5',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '卡蒂娅！你到了吗？',
            pinyin: 'Kǎdìyà! Nǐ dào le ma?',
            french: 'Katia ! Tu es arrivée ?',
          },
          {
            id: 'vc_b3_6',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '到了。我在酒店。你在哪儿？',
            pinyin: 'Dào le. Wǒ zài jiǔdiàn. Nǐ zài nǎr?',
            french: 'Oui, arrivée. Je suis à l’hôtel. Tu es où ?',
          },
          {
            id: 'vc_b3_7',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '我也在酒店。我在房间。',
            pinyin: 'Wǒ yě zài jiǔdiàn. Wǒ zài fángjiān.',
            french: 'Moi aussi je suis à l’hôtel. Je suis dans ma chambre.',
          },
          {
            id: 'vc_b3_8',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '安东尼呢？',
            pinyin: 'Āndōngní ne?',
            french: 'Et Anthony ?',
          },
          {
            id: 'vc_b3_9',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '他也在。',
            pinyin: 'Tā yě zài.',
            french: 'Il est là aussi.',
          },
          {
            id: 'vc_b3_10',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '好。我们明天见。',
            pinyin: 'Hǎo. Wǒmen míngtiān jiàn.',
            french: 'D’accord. À demain.',
          },
          {
            id: 'vc_b3_11',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '好，明天见。',
            pinyin: 'Hǎo, míngtiān jiàn.',
            french: 'D’accord, à demain.',
          },
        ],
        vocabulary: [
          { hanzi: '房间', pinyin: 'fángjiān', french: 'chambre, pièce', role: 'Nom commun' },
          { hanzi: '电话', pinyin: 'diànhuà', french: 'téléphone', role: 'Nom commun' },
          { hanzi: '打电话', pinyin: 'dǎ diànhuà', french: 'téléphoner, appeler', role: 'Verbe' },
          { hanzi: '什么时候', pinyin: 'shénme shíhou', french: 'quand', role: 'Pronom interrogatif' },
          { hanzi: '明天见', pinyin: 'míngtiān jiàn', french: 'à demain', role: 'Salutation' },
          { hanzi: '酒店', pinyin: 'jiǔdiàn', french: 'hôtel', role: 'Nom commun' },
          { hanzi: '漂亮', pinyin: 'piàoliang', french: 'joli, beau', role: 'Adjectif' },
        ]
      },
      {
        id: 'vie_chine_business_ep4',
        episodeNumber: 4,
        titleFr: 'Épisode 4 : Acheter à manger',
        titleZh: '第四集：买吃的',
        titlePinyin: 'Dì sì jí: Mǎi chī de',
        duration: '1 min 45',
        level: 'HSK 1',
        description: 'Katia, Brice et Anthony vont au restaurant pour commander de délicieux plats chinois.',
        imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'vc_b4_1',
            hanzi: '早上，卡蒂娅、布里斯和安东尼去饭馆。',
            pinyin: 'Zǎoshang, Kǎdìyà, Bùlǐsī hé Āndōngní qù fànguǎn.',
            french: 'Le matin, Katia, Brice et Anthony vont au restaurant.',
          },
          {
            id: 'vc_b4_2',
            hanzi: '他们要吃中国菜。饭馆里人很多。',
            pinyin: 'Tāmen yào chī Zhōngguócài. Fànguǎn lǐ rén hěn duō.',
            french: 'Ils veulent manger des plats chinois. Il y a beaucoup de monde dans le restaurant.',
          },
          {
            id: 'vc_b4_3',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '你们吃什么？',
            pinyin: 'Nǐmen chī shénme?',
            french: 'Que mangez-vous ?',
          },
          {
            id: 'vc_b4_4',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '我吃米饭。你呢？',
            pinyin: 'Wǒ chī mǐfàn. Nǐ ne?',
            french: 'Je mange du riz. Et toi ?',
          },
          {
            id: 'vc_b4_5',
            speaker: 'Anthony',
            speakerRole: 'Homme d’affaires',
            speakerColor: 'turquoise',
            hanzi: '我也吃米饭。卡蒂娅，你呢？',
            pinyin: 'Wǒ yě chī mǐfàn. Kǎdìyà, nǐ ne?',
            french: 'Moi aussi je mange du riz. Katia, et toi ?',
          },
          {
            id: 'vc_b4_6',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '我吃面条。',
            pinyin: 'Wǒ chī miàntiáo.',
            french: 'Je mange des nouilles.',
          },
          {
            id: 'vc_b4_7',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '老板，两碗米饭，一碗面条。',
            pinyin: 'Lǎobǎn, liǎng wǎn mǐfàn, yì wǎn miàntiáo.',
            french: 'Patron, deux bols de riz et un bol de nouilles.',
          },
          {
            id: 'vc_b4_8',
            speaker: 'Patron',
            speakerRole: 'Restaurateur',
            speakerColor: 'turquoise',
            hanzi: '好。还要什么？',
            pinyin: 'Hǎo. Hái yào shénme?',
            french: 'D’accord. Que désirez-vous d’autre ?',
          },
          {
            id: 'vc_b4_9',
            speaker: 'Anthony',
            speakerRole: 'Homme d’affaires',
            speakerColor: 'turquoise',
            hanzi: '有茶吗？',
            pinyin: 'Yǒu chá ma?',
            french: 'Avez-vous du thé ?',
          },
          {
            id: 'vc_b4_10',
            speaker: 'Patron',
            speakerRole: 'Restaurateur',
            speakerColor: 'turquoise',
            hanzi: '有。',
            pinyin: 'Yǒu.',
            french: 'Oui, nous en avons.',
          },
          {
            id: 'vc_b4_11',
            speaker: 'Anthony',
            speakerRole: 'Homme d’affaires',
            speakerColor: 'turquoise',
            hanzi: '我要一杯茶。',
            pinyin: 'Wǒ yào yì bēi chá.',
            french: 'Je voudrais une tasse de thé.',
          },
          {
            id: 'vc_b4_12',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '我要一杯水。',
            pinyin: 'Wǒ yào yì bēi shuǐ.',
            french: 'Je voudrais un verre d’eau.',
          },
          {
            id: 'vc_b4_13',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '我也要水。',
            pinyin: 'Wǒ yě yào shuǐ.',
            french: 'Moi aussi je veux de l’eau.',
          },
          {
            id: 'vc_b4_14',
            speaker: 'Patron',
            speakerRole: 'Restaurateur',
            speakerColor: 'turquoise',
            hanzi: '好，请等一下。',
            pinyin: 'Hǎo, qǐng děng yíxià.',
            french: 'D’accord, patientez un instant s’il vous plaît.',
          },
          {
            id: 'vc_b4_15',
            hanzi: '他们吃米饭，吃面条，喝茶，喝水。',
            pinyin: 'Tāmen chī mǐfàn, chī miàntiáo, hē chá, hē shuǐ.',
            french: 'Ils mangent du riz, des nouilles, boivent du thé et de l’eau.',
          },
          {
            id: 'vc_b4_16',
            hanzi: '中国菜很好吃。他们很高兴。',
            pinyin: 'Zhōngguócài hěn hǎochī. Tāmen hěn gāoxìng.',
            french: 'La cuisine chinoise est délicieuse. Ils sont très contents.',
          },
        ],
        vocabulary: [
          { hanzi: '饭馆', pinyin: 'fànguǎn', french: 'restaurant', role: 'Nom commun' },
          { hanzi: '菜', pinyin: 'cài', french: 'plat, cuisine, légume', role: 'Nom commun' },
          { hanzi: '米饭', pinyin: 'mǐfàn', french: 'riz (cuit)', role: 'Nom commun' },
          { hanzi: '面条', pinyin: 'miàntiáo', french: 'nouilles', role: 'Nom commun' },
          { hanzi: '碗', pinyin: 'wǎn', french: 'bol', role: 'Spécificatif' },
          { hanzi: '老板', pinyin: 'lǎobǎn', french: 'patron, gérant', role: 'Nom commun' },
          { hanzi: '茶', pinyin: 'chá', french: 'thé', role: 'Nom commun' },
          { hanzi: '杯', pinyin: 'bēi', french: 'verre, tasse', role: 'Spécificatif' },
          { hanzi: '等', pinyin: 'děng', french: 'attendre', role: 'Verbe' },
          { hanzi: '好吃', pinyin: 'hǎochī', french: 'délicieux, bon', role: 'Adjectif' },
        ]
      },
      {
        id: 'vie_chine_business_ep5',
        episodeNumber: 5,
        titleFr: 'Épisode 5 : Acheter à boire',
        titleZh: '第五集：买喝的',
        titlePinyin: 'Dì wǔ jí: Mǎi hē de',
        duration: '1 min 45',
        level: 'HSK 2',
        description: 'Par une chaude après-midi, Katia, Brice et Anthony se rendent dans un magasin pour acheter de l’eau, du café et du lait.',
        imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
        sentences: [
          {
            id: 'vc_b5_1',
            hanzi: '下午，天气很热。',
            pinyin: 'Xiàwǔ, tiānqì hěn rè.',
            french: 'L’après-midi, il fait très chaud.',
          },
          {
            id: 'vc_b5_2',
            hanzi: '卡蒂娅、布里斯和安东尼去商店。',
            pinyin: 'Kǎdìyà, Bùlǐsī hé Āndōngní qù shāngdiàn.',
            french: 'Katia, Brice et Anthony vont au magasin.',
          },
          {
            id: 'vc_b5_3',
            hanzi: '他们要买水，也要买咖啡和牛奶。',
            pinyin: 'Tāmen yào mǎi shuǐ, yě yào mǎi kāfēi hé niúnǎi.',
            french: 'Ils veulent acheter de l’eau, et aussi du café et du lait.',
          },
          {
            id: 'vc_b5_4',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '你们想喝什么？',
            pinyin: 'Nǐmen xiǎng hē shénme?',
            french: 'Que voulez-vous boire ?',
          },
          {
            id: 'vc_b5_5',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '我要一瓶水。',
            pinyin: 'Wǒ yào yì píng shuǐ.',
            french: 'Je veux une bouteille d’eau.',
          },
          {
            id: 'vc_b5_6',
            speaker: 'Anthony',
            speakerRole: 'Homme d’affaires',
            speakerColor: 'turquoise',
            hanzi: '我要咖啡。卡蒂娅，你呢？',
            pinyin: 'Wǒ yào kāfēi. Kǎdìyà, nǐ ne?',
            french: 'Je veux un café. Katia, et toi ?',
          },
          {
            id: 'vc_b5_7',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '我要牛奶。',
            pinyin: 'Wǒ yào niúnǎi.',
            french: 'Je veux du lait.',
          },
          {
            id: 'vc_b5_8',
            speaker: 'Brice',
            speakerRole: 'Entrepreneur',
            speakerColor: 'amber',
            hanzi: '还要什么？',
            pinyin: 'Hái yào shénme?',
            french: 'Tu veux autre chose ?',
          },
          {
            id: 'vc_b5_9',
            speaker: 'Anthony',
            speakerRole: 'Homme d’affaires',
            speakerColor: 'turquoise',
            hanzi: '还要一瓶咖啡。',
            pinyin: 'Hái yào yì píng kāfēi.',
            french: 'Encore une bouteille de café.',
          },
          {
            id: 'vc_b5_10',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '好。多少钱？',
            pinyin: 'Hǎo. Duōshao qián?',
            french: 'D’accord. Combien ça coûte ?',
          },
          {
            id: 'vc_b5_11',
            speaker: 'Serveur',
            speakerRole: 'Employé',
            speakerColor: 'turquoise',
            hanzi: '三十块。',
            pinyin: 'Sānshí kuài.',
            french: 'Trente yuans.',
          },
          {
            id: 'vc_b5_12',
            speaker: 'Katia',
            speakerRole: 'Femme d’affaires',
            speakerColor: 'pink',
            hanzi: '好，谢谢。',
            pinyin: 'Hǎo, xièxie.',
            french: 'D’accord, merci.',
          },
          {
            id: 'vc_b5_13',
            speaker: 'Serveur',
            speakerRole: 'Employé',
            speakerColor: 'turquoise',
            hanzi: '不客气。欢迎再来。',
            pinyin: 'Bú kèqi. Huānyíng zài lái.',
            french: 'De rien. Au plaisir de vous revoir.',
          },
          {
            id: 'vc_b5_14',
            hanzi: '他们买了一瓶水，两瓶咖啡，一瓶牛奶。',
            pinyin: 'Tāmen mǎi le yì píng shuǐ, liǎng píng kāfēi, yì píng niúnǎi.',
            french: 'Ils ont acheté une bouteille d’eau, deux bouteilles de café et une bouteille de lait.',
          },
          {
            id: 'vc_b5_15',
            hanzi: '天气很热，他们喝水，喝咖啡，喝牛奶。',
            pinyin: 'Tiānqì hěn rè, tāmen hē shuǐ, hē kāfēi, hē niúnǎi.',
            french: 'Il fait très chaud, ils boivent de l’eau, du café et du lait.',
          },
          {
            id: 'vc_b5_16',
            hanzi: '他们很高兴。',
            pinyin: 'Tāmen hěn gāoxìng.',
            french: 'Ils sont très contents.',
          },
        ],
        vocabulary: [
          { hanzi: '商店', pinyin: 'shāngdiàn', french: 'magasin', role: 'Nom commun' },
          { hanzi: '想', pinyin: 'xiǎng', french: 'vouloir, désirer', role: 'Verbe' },
          { hanzi: '瓶', pinyin: 'píng', french: 'bouteille', role: 'Spécificatif' },
          { hanzi: '咖啡', pinyin: 'kāfēi', french: 'café', role: 'Nom commun' },
          { hanzi: '牛奶', pinyin: 'niúnǎi', french: 'lait', role: 'Nom commun' },
          { hanzi: '服务员', pinyin: 'fúwùyuán', french: 'serveur, employé', role: 'Nom commun' },
          { hanzi: '欢迎再来', pinyin: 'huānyíng zài lái', french: 'au plaisir de vous revoir', role: 'Expression' },
        ]
      }
    ],
    sentences: [
      {
        id: 'vc_b1_1',
        hanzi: '星期二早上，布里斯先到了中国。',
        pinyin: 'Xīngqī\'èr zǎoshang, Bùlǐsī xiān dào le Zhōngguó.',
        french: 'Mardi matin, Brice est arrivé en Chine en premier.',
      },
      {
        id: 'vc_b1_2',
        hanzi: '两天后，星期四晚上，安东尼也到了。',
        pinyin: 'Liǎng tiān hòu, xīngqīsì wǎnshang, Āndōngní yě dào le.',
        french: 'Deux jours après, jeudi soir, Anthony est arrivé aussi.',
      },
      {
        id: 'vc_b1_3',
        hanzi: '最后，星期六早上十点，卡蒂娅到了。',
        pinyin: 'Zuìhòu, xīngqīliù zǎoshang shí diǎn, Kǎdìyà dào le.',
        french: 'Enfin, samedi matin à dix heures, Katia est arrivée.',
      },
    ],
    vocabulary: [
      { hanzi: '先', pinyin: 'xiān', french: 'd’abord, en premier', role: 'Adverbe' },
      { hanzi: '两天后', pinyin: 'liǎng tiān hòu', french: 'deux jours après', role: 'Expression temporelle' },
      { hanzi: '最后', pinyin: 'zuìhòu', french: 'finalement, enfin', role: 'Adverbe' },
      { hanzi: '星期二', pinyin: 'xīngqī\'èr', french: 'mardi', role: 'Nom temporel' },
      { hanzi: '星期四', pinyin: 'xīngqīsì', french: 'jeudi', role: 'Nom temporel' },
      { hanzi: '星期六', pinyin: 'xīngqīliù', french: 'samedi', role: 'Nom temporel' },
      { hanzi: '早上', pinyin: 'zǎoshang', french: 'matin', role: 'Nom temporel' },
      { hanzi: '晚上', pinyin: 'wǎnshang', french: 'soir', role: 'Nom temporel' },
      { hanzi: '十点', pinyin: 'shí diǎn', french: 'dix heures', role: 'Expression horaire' },
    ]
  },
  {
    id: 'histoire_journee_wang_ming',
    titleFr: 'La journée bien remplie de Wang Ming',
    titleZh: '王明的一天',
    titlePinyin: 'Wáng Míng de yì tiān',
    type: 'histoires',
    level: 'HSK 1',
    duration: '1 min 45',
    description: 'Suivez le quotidien de Wang Ming, de ses cours de chinois à l’école jusqu’à sa pause détente du soir.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '王明',
        nameZh: '王明',
        pinyin: 'Wáng Míng',
        role: 'Étudiant',
        description: 'Étudie le chinois avec sérieux et partage ses repas avec sa bonne amie Li Yue.',
        color: 'violet'
      },
      {
        name: '李月',
        nameZh: '李月',
        pinyin: 'Lǐ Yuè',
        role: 'Étudiante',
        description: 'Amie proche de Wang Ming, passionnée par la lecture et l’apprentissage du chinois.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'h_wm_1',
        hanzi: '王明是学生，他有一个好朋友叫李月。',
        pinyin: 'Wáng Míng shì xuésheng, tā yǒu yí gè hǎo péngyou jiào Lǐ Yuè.',
        french: 'Wang Ming est étudiant, il a une bonne amie qui s’appelle Li Yue.',
      },
      {
        id: 'h_wm_2',
        hanzi: '李月也是学生。今天天气很好，不冷也不热。',
        pinyin: 'Lǐ Yuè yě shì xuésheng. Jīntiān tiānqì hěn hǎo, bù lěng yě bú rè.',
        french: 'Li Yue est étudiante aussi. Aujourd’hui il fait très beau, ni trop froid ni trop chaud.',
      },
      {
        id: 'h_wm_3',
        hanzi: '上午，王明去学校学习汉语。他看见李月，李月很高兴。',
        pinyin: 'Shàngwǔ, Wáng Míng qù xuéxiào xuéxí Hànyǔ. Tā kànjiàn Lǐ Yuè, Lǐ Yuè hěn gāoxìng.',
        french: 'Le matin, Wang Ming va à l’école apprendre le chinois. Il aperçoit Li Yue qui est très contente.',
      },
      {
        id: 'h_wm_4',
        hanzi: '中午，王明和李月去饭店。王明吃米饭、喝茶，李月吃米饭、喝水。',
        pinyin: 'Zhōngwǔ, Wáng Míng hé Lǐ Yuè qù fàndiàn. Wáng Míng chī mǐfàn, hē chá, Lǐ Yuè chī mǐfàn, hē shuǐ.',
        french: 'À midi, Wang Ming et Li Yue vont au restaurant. Wang Ming mange du riz et boit du thé, Li Yue mange du riz et boit de l’eau.',
      },
      {
        id: 'h_wm_5',
        hanzi: '下午，他们回家。王明看电视，李月看书。',
        pinyin: 'Xiàwǔ, tāmen huí jiā. Wáng Míng kàn diànshì, Lǐ Yuè kàn shū.',
        french: 'L’après-midi, ils rentrent chez eux. Wang Ming regarde la télévision et Li Yue lit un livre.',
      },
      {
        id: 'h_wm_6',
        hanzi: '今天，王明和李月都很高兴。',
        pinyin: 'Jīntiān, Wáng Míng hé Lǐ Yuè dōu hěn gāoxìng.',
        french: 'Aujourd’hui, Wang Ming et Li Yue sont tous les deux très heureux.',
      },
    ],
    vocabulary: [
      { hanzi: '学生', pinyin: 'xuésheng', french: 'étudiant, élève', role: 'Nom commun' },
      { hanzi: '朋友', pinyin: 'péngyou', french: 'ami(e)', role: 'Nom commun' },
      { hanzi: '天气', pinyin: 'tiānqì', french: 'temps, météo', role: 'Nom commun' },
      { hanzi: '冷', pinyin: 'lěng', french: 'froid', role: 'Adjectif' },
      { hanzi: '热', pinyin: 'rè', french: 'chaud', role: 'Adjectif' },
      { hanzi: '上午', pinyin: 'shàngwǔ', french: 'matin, matinée', role: 'Nom temporel' },
      { hanzi: '学习', pinyin: 'xuéxí', french: 'étudier, apprendre', role: 'Verbe' },
      { hanzi: '汉语', pinyin: 'Hànyǔ', french: 'langue chinoise, mandarin', role: 'Nom propre' },
      { hanzi: '看见', pinyin: 'kànjiàn', french: 'voir, apercevoir', role: 'Verbe' },
      { hanzi: '中午', pinyin: 'zhōngwǔ', french: 'midi', role: 'Nom temporel' },
      { hanzi: '饭店', pinyin: 'fàndiàn', french: 'restaurant, hôtel-restaurant', role: 'Nom commun' },
      { hanzi: '下午', pinyin: 'xiàwǔ', french: 'après-midi', role: 'Nom temporel' },
      { hanzi: '回家', pinyin: 'huí jiā', french: 'rentrer à la maison', role: 'Locution verbale' },
      { hanzi: '电视', pinyin: 'diànshì', french: 'télévision', role: 'Nom commun' },
      { hanzi: '看书', pinyin: 'kàn shū', french: 'lire des livres', role: 'Locution verbale' },
    ]
  },
  {
    id: 'histoire_chat_li_yue',
    titleFr: 'Le petit chat blanc de Li Yue',
    titleZh: '李月的猫',
    titlePinyin: 'Lǐ Yuè de māo',
    type: 'histoires',
    level: 'HSK 1',
    duration: '1 min 30',
    description: 'Une journée paisible chez Li Yue en compagnie de son adorable petit chat Xiao Bai.',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '李月',
        nameZh: '李月',
        pinyin: 'Lǐ Yuè',
        role: 'Étudiante',
        description: 'Prend soin de son petit chat Xiao Bai avec beaucoup d’affection.',
        color: 'violet'
      },
      {
        name: '小白',
        nameZh: '小白',
        pinyin: 'Xiǎobái',
        role: 'Chat de compagnie',
        description: 'Un adorable chaton blanc qui aime dormir et se prélasser sur sa chaise.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'h_cat_1',
        hanzi: '李月家有猫，猫叫小白。',
        pinyin: 'Lǐ Yuè jiā yǒu māo, māo jiào Xiǎobái.',
        french: 'Il y a un chat chez Li Yue, le chat s’appelle Xiao Bai.',
      },
      {
        id: 'h_cat_2',
        hanzi: '小白很小，很漂亮，李月很喜欢小白。',
        pinyin: 'Xiǎobái hěn xiǎo, hěn piàoliang, Lǐ Yuè hěn xǐhuan Xiǎobái.',
        french: 'Xiao Bai est tout petit et très joli, Li Yue aime beaucoup Xiao Bai.',
      },
      {
        id: 'h_cat_3',
        hanzi: '今天上午，李月在家看书，小白睡觉。',
        pinyin: 'Jīntiān shàngwǔ, Lǐ Yuè zài jiā kàn shū, Xiǎobái shuìjiào.',
        french: 'Ce matin, Li Yue lit un livre à la maison et Xiao Bai dort.',
      },
      {
        id: 'h_cat_4',
        hanzi: '中午李月吃米饭，小白喝水。下午李月去商店买水果。',
        pinyin: 'Zhōngwǔ Lǐ Yuè chī mǐfàn, Xiǎobái hē shuǐ. Xiàwǔ Lǐ Yuè qù shāngdiàn mǎi shuǐguǒ.',
        french: 'À midi Li Yue mange du riz et Xiao Bai boit de l’eau. L’après-midi Li Yue va au magasin acheter des fruits.',
      },
      {
        id: 'h_cat_5',
        hanzi: '她回家，看见小白在椅子上。',
        pinyin: 'Tā huí jiā, kànjiàn Xiǎobái zài yǐzi shang.',
        french: 'Elle rentre à la maison et voit Xiao Bai assis sur la chaise.',
      },
    ],
    vocabulary: [
      { hanzi: '猫', pinyin: 'māo', french: 'chat', role: 'Nom commun' },
      { hanzi: '小', pinyin: 'xiǎo', french: 'petit', role: 'Adjectif' },
      { hanzi: '漂亮', pinyin: 'piàoliang', french: 'joli, beau', role: 'Adjectif' },
      { hanzi: '喜欢', pinyin: 'xǐhuan', french: 'aimer, apprécier', role: 'Verbe' },
      { hanzi: '买', pinyin: 'mǎi', french: 'acheter', role: 'Verbe' },
      { hanzi: '水果', pinyin: 'shuǐguǒ', french: 'fruits', role: 'Nom commun' },
      { hanzi: '椅子', pinyin: 'yǐzi', french: 'chaise', role: 'Nom commun' },
      { hanzi: '上', pinyin: 'shang', french: 'sur, au-dessus', role: 'Position' },
    ]
  },
  {
    id: 'histoire_docteur_zhang_wei',
    titleFr: 'Le quotidien du docteur Zhang Wei',
    titleZh: '张伟是医生',
    titlePinyin: 'Zhāng Wěi shì yīshēng',
    type: 'histoires',
    level: 'HSK 1',
    duration: '1 min 30',
    description: 'Découvrez la vie professionnelle du docteur Zhang Wei à l’hôpital et la vocation de sa fille Zhang Xiaoyue.',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '张伟',
        nameZh: '张伟',
        pinyin: 'Zhāng Wěi',
        role: 'Médecin',
        description: 'Exerce avec passion son métier de médecin au sein d’un grand hôpital.',
        color: 'violet'
      },
      {
        name: '张小月',
        nameZh: '张小月',
        pinyin: 'Zhāng Xiǎoyuè',
        role: 'Étudiante',
        description: 'Fille de Zhang Wei, étudie le chinois et rêve de suivre les traces de son père.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'h_zw_1',
        hanzi: '张伟是医生，他在医院工作。',
        pinyin: 'Zhāng Wěi shì yīshēng, tā zài yīyuàn gōngzuò.',
        french: 'Zhang Wei est médecin, il travaille à l’hôpital.',
      },
      {
        id: 'h_zw_2',
        hanzi: '医院很大，里面有很多人。',
        pinyin: 'Yīyuàn hěn dà, lǐmiàn yǒu hěn duō rén.',
        french: 'L’hôpital est grand et il y a beaucoup de monde à l’intérieur.',
      },
      {
        id: 'h_zw_3',
        hanzi: '张伟喜欢他的工作，他的朋友都是医生，他们一起工作、吃饭。',
        pinyin: 'Zhāng Wěi xǐhuan tā de gōngzuò, tā de péngyou dōu shì yīshēng, tāmen yìqǐ gōngzuò, chīfàn.',
        french: 'Zhang Wei aime son travail, ses amis sont tous médecins, ils travaillent et mangent ensemble.',
      },
      {
        id: 'h_zw_4',
        hanzi: '张伟有女儿，叫张小月，张小月是学生。',
        pinyin: 'Zhāng Wěi yǒu nǚ\'ér, jiào Zhāng Xiǎoyuè, Zhāng Xiǎoyuè shì xuésheng.',
        french: 'Zhang Wei a une fille qui s’appelle Zhang Xiaoyue, Zhang Xiaoyue est étudiante.',
      },
      {
        id: 'h_zw_5',
        hanzi: '她学习汉语，也写字，她想做医生。',
        pinyin: 'Tā xuéxí Hànyǔ, yě xiězì, tā xiǎng zuò yīshēng.',
        french: 'Elle apprend le chinois et s’exerce à écrire, elle souhaite devenir médecin.',
      },
    ],
    vocabulary: [
      { hanzi: '医生', pinyin: 'yīshēng', french: 'médecin, docteur', role: 'Nom commun' },
      { hanzi: '医院', pinyin: 'yīyuàn', french: 'hôpital', role: 'Nom commun' },
      { hanzi: '工作', pinyin: 'gōngzuò', french: 'travailler, travail', role: 'Verbe / Nom' },
      { hanzi: '都', pinyin: 'dōu', french: 'tous, toutes', role: 'Adverbe' },
      { hanzi: '吃饭', pinyin: 'chīfàn', french: 'manger, prendre un repas', role: 'Locution verbale' },
      { hanzi: '女儿', pinyin: 'nǚ\'ér', french: 'fille (enfant)', role: 'Nom commun' },
      { hanzi: '写字', pinyin: 'xiězì', french: 'écrire des caractères', role: 'Locution verbale' },
      { hanzi: '想', pinyin: 'xiǎng', french: 'vouloir, souhaiter', role: 'Verbe modal' },
      { hanzi: '做', pinyin: 'zuò', french: 'faire, devenir (un métier)', role: 'Verbe' },
    ]
  },
  {
    id: 'histoire_1',
    titleFr: 'David prend son petit-déjeuner à Pékin',
    titleZh: '大卫在北京吃早饭',
    titlePinyin: 'Dàwèi zài Běijīng chī zǎofàn',
    type: 'histoires',
    level: 'HSK 1',
    duration: '2 min 15',
    description: 'Suivez David qui découvre Pékin et commence sa journée par un petit-déjeuner chinois traditionnel.',
    imageUrl: 'https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'David',
        nameZh: '大卫',
        pinyin: 'Dàwèi',
        role: 'Voyageur',
        description: 'Un voyageur qui découvre Pékin. Aujourd’hui, il commence sa journée par un petit-déjeuner chinois traditionnel.',
        color: 'violet'
      },
      {
        name: '服务员',
        nameZh: '服务员',
        pinyin: 'Fúwùyuán',
        role: 'Serveur',
        description: 'Un serveur dans un restaurant à Pékin. Aujourd’hui, il accueille David chaleureusement.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'h1_1',
        hanzi: '早上七点，大卫起床了。',
        pinyin: 'Zǎoshang qī diǎn, Dàwèi qǐchuáng le.',
        french: 'À sept heures du matin, David s’est levé.',
      },
      {
        id: 'h1_2',
        hanzi: '天气很好。',
        pinyin: 'Tiānqì hěn hǎo.',
        french: 'Il fait très beau.',
      },
      {
        id: 'h1_3',
        hanzi: '他去饭店喝茶，吃米饭和鱼。',
        pinyin: 'Tā qù fàndiàn hē chá, chī mǐfàn hé yú.',
        french: 'Il va au restaurant boire du thé et manger du riz et du poisson.',
      },
      {
        id: 'h1_4',
        hanzi: '服务员说：“欢迎你来北京！”',
        pinyin: 'Fúwùyuán shuō: “Huānyíng nǐ lái Běijīng!”',
        french: 'Le serveur dit : « Bienvenue à Pékin ! »',
      },
      {
        id: 'h1_5',
        hanzi: '大卫很高兴，他说：“谢谢！”',
        pinyin: 'Dàwèi hěn gāoxìng, tā shuō: “Xièxie!”',
        french: 'David est content, il dit : « Merci ! »',
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
        hanzi: '今天，李经理带客户参观工厂。',
        pinyin: 'Jīntiān, Lǐ jīnglǐ dài kèhù cānguān gōngchǎng.',
        french: 'Aujourd’hui, le directeur Li fait visiter l’usine à ses clients.',
      },
      {
        id: 'h2_2',
        hanzi: '工厂很大，工人们都在认真工作。',
        pinyin: 'Gōngchǎng hěn dà, gōngrénmen dōu zài rènzhēn gōngzuò.',
        french: 'L’usine est spacieuse et les ouvriers travaillent avec rigueur.',
      },
      {
        id: 'h2_3',
        hanzi: '客户看了样品，非常满意。',
        pinyin: 'Kèhù kàn le yàngpǐn, fēicháng mǎnyì.',
        french: 'Le client examine les échantillons et est très satisfait.',
      },
      {
        id: 'h2_4',
        hanzi: '他们喝了乌龙茶，约定明天签合同。',
        pinyin: 'Tāmen hē le wūlóngchá, yuēdìng míngtiān qiān hétong.',
        french: 'Ils boivent du thé Oolong et conviennent de signer le contrat demain.',
      },
    ],
  },

  // ================= 3. DIALOGUES AVEC PERSONNAGES DÉTAILLÉS & COULEURS DISTINCTES =================
  {
    id: 'dialogue_premiere_rencontre',
    titleFr: 'Heureux de faire votre connaissance',
    titleZh: '第一次见面',
    titlePinyin: 'Dì yī cì jiànmiàn',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '1 min 00',
    description: 'Wang Ming et Li Yue font connaissance et échangent leurs prénoms lors de leur première rencontre.',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '王明',
        nameZh: '王明',
        pinyin: 'Wáng Míng',
        role: 'Collègue',
        description: 'Rencontre Li Yue pour la première fois et engage poliment la conversation pour se présenter.',
        color: 'violet'
      },
      {
        name: '李月',
        nameZh: '李月',
        pinyin: 'Lǐ Yuè',
        role: 'Collègue',
        description: 'Répond à Wang Ming et lui demande son prénom en retour avec bienveillance.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'dpr_1',
        speaker: '王明',
        speakerRole: 'Collègue',
        speakerColor: 'violet',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        french: 'Bonjour !',
      },
      {
        id: 'dpr_2',
        speaker: '李月',
        speakerRole: 'Collègue',
        speakerColor: 'turquoise',
        hanzi: '你好！',
        pinyin: 'Nǐ hǎo!',
        french: 'Bonjour !',
      },
      {
        id: 'dpr_3',
        speaker: '王明',
        speakerRole: 'Collègue',
        speakerColor: 'violet',
        hanzi: '你叫什么名字？',
        pinyin: 'Nǐ jiào shénme míngzi?',
        french: 'Comment t’appelles-tu ?',
      },
      {
        id: 'dpr_4',
        speaker: '李月',
        speakerRole: 'Collègue',
        speakerColor: 'turquoise',
        hanzi: '我叫李月。你呢？',
        pinyin: 'Wǒ jiào Lǐ Yuè. Nǐ ne?',
        french: 'Je m’appelle Li Yue. Et toi ?',
      },
      {
        id: 'dpr_5',
        speaker: '王明',
        speakerRole: 'Collègue',
        speakerColor: 'violet',
        hanzi: '我叫王明。',
        pinyin: 'Wǒ jiào Wáng Míng.',
        french: 'Je m’appelle Wang Ming.',
      },
    ],
    vocabulary: [
      { hanzi: '第一次', pinyin: 'dì yī cì', french: 'première fois', role: 'Expression temporelle' },
      { hanzi: '见面', pinyin: 'jiànmiàn', french: 'se rencontrer, faire connaissance', role: 'Verbe' },
      { hanzi: '你好', pinyin: 'nǐ hǎo', french: 'bonjour', role: 'Formule de politesse' },
      { hanzi: '叫', pinyin: 'jiào', french: 's’appeler', role: 'Verbe' },
      { hanzi: '什么', pinyin: 'shénme', french: 'quoi, quel', role: 'Pronom interrogatif' },
      { hanzi: '名字', pinyin: 'míngzi', french: 'prénom, nom', role: 'Nom commun' },
      { hanzi: '呢', pinyin: 'ne', french: 'et... ? (relance la question)', role: 'Particule modale' },
    ]
  },
  {
    id: 'dialogue_au_restaurant',
    titleFr: 'Choisir son repas entre amis',
    titleZh: '在饭馆',
    titlePinyin: 'Zài fànguǎn',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '1 min 15',
    description: 'Zhang Wei et Liu Fang choisissent quoi boire et quoi manger lors d’un déjeuner au restaurant.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '张伟',
        nameZh: '张伟',
        pinyin: 'Zhāng Wěi',
        role: 'Client',
        description: 'Discute avec Liu Fang et commande de l’eau et du riz au restaurant.',
        color: 'violet'
      },
      {
        name: '刘芳',
        nameZh: '刘芳',
        pinyin: 'Liú Fāng',
        role: 'Cliente',
        description: 'Choisit de boire du thé et de manger du riz pour son repas.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'dar_1',
        speaker: '张伟',
        speakerRole: 'Client',
        speakerColor: 'violet',
        hanzi: '你喝什么？',
        pinyin: 'Nǐ hē shénme?',
        french: 'Que bois-tu ?',
      },
      {
        id: 'dar_2',
        speaker: '刘芳',
        speakerRole: 'Cliente',
        speakerColor: 'turquoise',
        hanzi: '我喝茶。你呢？',
        pinyin: 'Wǒ hē chá. Nǐ ne?',
        french: 'Je bois du thé. Et toi ?',
      },
      {
        id: 'dar_3',
        speaker: '张伟',
        speakerRole: 'Client',
        speakerColor: 'violet',
        hanzi: '我喝水。',
        pinyin: 'Wǒ hē shuǐ.',
        french: 'Je bois de l’eau.',
      },
      {
        id: 'dar_4',
        speaker: '刘芳',
        speakerRole: 'Cliente',
        speakerColor: 'turquoise',
        hanzi: '你吃什么？',
        pinyin: 'Nǐ chī shénme?',
        french: 'Que manges-tu ?',
      },
      {
        id: 'dar_5',
        speaker: '张伟',
        speakerRole: 'Client',
        speakerColor: 'violet',
        hanzi: '我吃米饭。你呢？',
        pinyin: 'Wǒ chī mǐfàn. Nǐ ne?',
        french: 'Je mange du riz. Et toi ?',
      },
      {
        id: 'dar_6',
        speaker: '刘芳',
        speakerRole: 'Cliente',
        speakerColor: 'turquoise',
        hanzi: '我也吃米饭。',
        pinyin: 'Wǒ yě chī mǐfàn.',
        french: 'Je mange du riz aussi.',
      },
    ],
    vocabulary: [
      { hanzi: '饭馆', pinyin: 'fànguǎn', french: 'restaurant', role: 'Nom commun' },
      { hanzi: '喝', pinyin: 'hē', french: 'boire', role: 'Verbe' },
      { hanzi: '茶', pinyin: 'chá', french: 'thé', role: 'Nom commun' },
      { hanzi: '水', pinyin: 'shuǐ', french: 'eau', role: 'Nom commun' },
      { hanzi: '吃', pinyin: 'chī', french: 'manger', role: 'Verbe' },
      { hanzi: '米饭', pinyin: 'mǐfàn', french: 'riz (cuit)', role: 'Nom commun' },
      { hanzi: '也', pinyin: 'yě', french: 'aussi, également', role: 'Adverbe' },
    ]
  },
  {
    id: 'dialogue_au_magasin',
    titleFr: 'Combien coûte cette jolie tasse ?',
    titleZh: '在商店',
    titlePinyin: 'Zài shāngdiàn',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '1 min 15',
    description: 'Chen Chen demande le prix de différentes tasses à un vendeur dans un magasin et effectue son achat.',
    imageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '陈晨',
        nameZh: '陈晨',
        pinyin: 'Chén Chén',
        role: 'Client',
        description: 'Se renseigne poliment sur le prix des tasses et choisit son modèle préféré.',
        color: 'violet'
      },
      {
        name: '赵雷',
        nameZh: '赵雷',
        pinyin: 'Zhào Léi',
        role: 'Vendeur',
        description: 'Accueille le client, indique clairement les prix et valide la vente.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'dam_1',
        speaker: '陈晨',
        speakerRole: 'Client',
        speakerColor: 'violet',
        hanzi: '请问，这个杯子多少钱？',
        pinyin: 'Qǐngwèn, zhège bēizi duōshao qián?',
        french: 'Excusez-moi, combien coûte cette tasse ?',
      },
      {
        id: 'dam_2',
        speaker: '赵雷',
        speakerRole: 'Vendeur',
        speakerColor: 'turquoise',
        hanzi: '十块。',
        pinyin: 'Shí kuài.',
        french: 'Dix yuans.',
      },
      {
        id: 'dam_3',
        speaker: '陈晨',
        speakerRole: 'Client',
        speakerColor: 'violet',
        hanzi: '那个呢？',
        pinyin: 'Nàge ne?',
        french: 'Et celle-là ?',
      },
      {
        id: 'dam_4',
        speaker: '赵雷',
        speakerRole: 'Vendeur',
        speakerColor: 'turquoise',
        hanzi: '那个八块。',
        pinyin: 'Nàge bā kuài.',
        french: 'Celle-là coûte huit yuans.',
      },
      {
        id: 'dam_5',
        speaker: '陈晨',
        speakerRole: 'Client',
        speakerColor: 'violet',
        hanzi: '我要这个。谢谢。',
        pinyin: 'Wǒ yào zhège. Xièxie.',
        french: 'Je prends celle-ci. Merci.',
      },
      {
        id: 'dam_6',
        speaker: '赵雷',
        speakerRole: 'Vendeur',
        speakerColor: 'turquoise',
        hanzi: '好的。',
        pinyin: 'Hǎo de.',
        french: 'D’accord.',
      },
    ],
    vocabulary: [
      { hanzi: '商店', pinyin: 'shāngdiàn', french: 'magasin, boutique', role: 'Nom commun' },
      { hanzi: '请问', pinyin: 'qǐngwèn', french: 's’il vous plaît, puis-je vous demander', role: 'Expression de politesse' },
      { hanzi: '杯子', pinyin: 'bēizi', french: 'tasse, verre', role: 'Nom commun' },
      { hanzi: '多少', pinyin: 'duōshao', french: 'combien', role: 'Pronom interrogatif' },
      { hanzi: '钱', pinyin: 'qián', french: 'argent', role: 'Nom commun' },
      { hanzi: '块', pinyin: 'kuài', french: 'yuan (monnaie courante)', role: 'Classificateur / Unité' },
      { hanzi: '这个', pinyin: 'zhège', french: 'ceci, celui-ci, celle-ci', role: 'Pronom démonstratif' },
      { hanzi: '那个', pinyin: 'nàge', french: 'cela, celui-là, celle-là', role: 'Pronom démonstratif' },
      { hanzi: '要', pinyin: 'yào', french: 'vouloir, prendre', role: 'Verbe' },
    ]
  },
  {
    id: 'dialogue_a_lecole',
    titleFr: 'Qui est ton professeur ?',
    titleZh: '在学校',
    titlePinyin: 'Zài xuéxiào',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '1 min 00',
    description: 'Dans la cour de l’école, Zhou Jie et Sun Li parlent de leur professeur et de leur camarade de classe.',
    imageUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '周杰',
        nameZh: '周杰',
        pinyin: 'Zhōu Jié',
        role: 'Étudiant',
        description: 'Pose des questions pour identifier les personnes présentes à l’école.',
        color: 'violet'
      },
      {
        name: '孙丽',
        nameZh: '孙丽',
        pinyin: 'Sūn Lì',
        role: 'Étudiante',
        description: 'Présente son professeur et sa camarade de classe avec enthousiasme.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'dae_1',
        speaker: '周杰',
        speakerRole: 'Étudiant',
        speakerColor: 'violet',
        hanzi: '他是谁？',
        pinyin: 'Tā shì shéi?',
        french: 'Qui est-il ?',
      },
      {
        id: 'dae_2',
        speaker: '孙丽',
        speakerRole: 'Étudiante',
        speakerColor: 'turquoise',
        hanzi: '他是我的老师。',
        pinyin: 'Tā shì wǒ de lǎoshī.',
        french: 'C’est mon professeur.',
      },
      {
        id: 'dae_3',
        speaker: '周杰',
        speakerRole: 'Étudiant',
        speakerColor: 'violet',
        hanzi: '她呢？',
        pinyin: 'Tā ne?',
        french: 'Et elle ?',
      },
      {
        id: 'dae_4',
        speaker: '孙丽',
        speakerRole: 'Étudiante',
        speakerColor: 'turquoise',
        hanzi: '她是我的同学。',
        pinyin: 'Tā shì wǒ de tóngxué.',
        french: 'C’est ma camarade de classe.',
      },
    ],
    vocabulary: [
      { hanzi: '学校', pinyin: 'xuéxiào', french: 'école', role: 'Nom commun' },
      { hanzi: '谁', pinyin: 'shéi', french: 'qui', role: 'Pronom interrogatif' },
      { hanzi: '老师', pinyin: 'lǎoshī', french: 'professeur, enseignant', role: 'Nom commun' },
      { hanzi: '同学', pinyin: 'tóngxué', french: 'camarade de classe', role: 'Nom commun' },
      { hanzi: '他', pinyin: 'tā', french: 'il, lui', role: 'Pronom personnel' },
      { hanzi: '她', pinyin: 'tā', french: 'elle', role: 'Pronom personnel' },
      { hanzi: '的', pinyin: 'de', french: 'de (marque de possession)', role: 'Particule grammaticale' },
    ]
  },
  {
    id: 'dialogue_a_la_maison',
    titleFr: 'Maman, à quelle heure part-on dîner ?',
    titleZh: '在家',
    titlePinyin: 'Zài jiā',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '1 min 15',
    description: 'À la maison, Wang Xiaoming demande l’heure à sa mère Li Yue et prépare leur sortie au restaurant.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: '王小明',
        nameZh: '王小明',
        pinyin: 'Wáng Xiǎomíng',
        role: 'Fils',
        description: 'Demande l’heure à sa mère et s’informe sur l’horaire du dîner.',
        color: 'violet'
      },
      {
        name: '李月',
        nameZh: '李月',
        pinyin: 'Lǐ Yuè',
        role: 'Mère',
        description: 'Répond aux questions de son fils sur l’organisation de la soirée.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'dlm_1',
        speaker: '王小明',
        speakerRole: 'Fils',
        speakerColor: 'violet',
        hanzi: '妈妈，现在几点？',
        pinyin: 'Māma, xiànzài jǐ diǎn?',
        french: 'Maman, quelle heure est-il maintenant ?',
      },
      {
        id: 'dlm_2',
        speaker: '李月',
        speakerRole: 'Mère',
        speakerColor: 'turquoise',
        hanzi: '现在七点。',
        pinyin: 'Xiànzài qī diǎn.',
        french: 'Il est sept heures maintenant.',
      },
      {
        id: 'dlm_3',
        speaker: '王小明',
        speakerRole: 'Fils',
        speakerColor: 'violet',
        hanzi: '我们几点去饭馆？',
        pinyin: 'Wǒmen jǐ diǎn qù fànguǎn?',
        french: 'À quelle heure allons-nous au restaurant ?',
      },
      {
        id: 'dlm_4',
        speaker: '李月',
        speakerRole: 'Mère',
        speakerColor: 'turquoise',
        hanzi: '七点半。',
        pinyin: 'Qī diǎn bàn.',
        french: 'À sept heures et demie.',
      },
      {
        id: 'dlm_5',
        speaker: '王小明',
        speakerRole: 'Fils',
        speakerColor: 'violet',
        hanzi: '爸爸呢？',
        pinyin: 'Bàba ne?',
        french: 'Et papa ?',
      },
      {
        id: 'dlm_6',
        speaker: '李月',
        speakerRole: 'Mère',
        speakerColor: 'turquoise',
        hanzi: '他在睡觉。',
        pinyin: 'Tā zài shuìjiào.',
        french: 'Il est en train de dormir.',
      },
    ],
    vocabulary: [
      { hanzi: '在家', pinyin: 'zài jiā', french: 'à la maison', role: 'Locution' },
      { hanzi: '现在', pinyin: 'xiànzài', french: 'maintenant, actuellement', role: 'Nom temporel' },
      { hanzi: '几点', pinyin: 'jǐ diǎn', french: 'quelle heure', role: 'Expression interrogative' },
      { hanzi: '去', pinyin: 'qù', french: 'aller', role: 'Verbe' },
      { hanzi: '半', pinyin: 'bàn', french: 'demi, demie', role: 'Nombre / Quantité' },
      { hanzi: '爸爸', pinyin: 'bàba', french: 'papa, père', role: 'Nom commun' },
      { hanzi: '妈妈', pinyin: 'māma', french: 'maman, mère', role: 'Nom commun' },
      { hanzi: '睡觉', pinyin: 'shuìjiào', french: 'dormir', role: 'Verbe' },
    ]
  },
  {
    id: 'dialogue_1',
    titleFr: 'Premier accueil chez le fournisseur',
    titleZh: '初次拜访供应商',
    titlePinyin: 'Chūcì bàifǎng gōngyìngshāng',
    type: 'dialogues',
    level: 'HSK 1',
    duration: '2 min 00',
    description: 'Arrivée d’Espoir chez un fournisseur chinois et premier échange chaleureux avec le Directeur Wang.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#00897B] to-[#004D40]',
    characters: [
      {
        name: 'Espoir',
        nameZh: '苏波',
        pinyin: 'Sūbō',
        role: 'Partenaire',
        description: 'Arrive chez un fournisseur chinois. Aujourd’hui, il rencontre pour la première fois le Directeur Wang.',
        color: 'violet'
      },
      {
        name: '王总',
        nameZh: '王总',
        pinyin: 'Wáng zǒng',
        role: 'Directeur d’Usine',
        description: 'Dirige l’usine. Aujourd’hui, il accueille Espoir pour leur première rencontre.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'd1_1',
        speaker: 'Espoir',
        speakerRole: 'Partenaire',
        speakerColor: 'violet',
        hanzi: '王总，您好！很高兴能来到这里。',
        pinyin: 'Wáng zǒng, nín hǎo! Hěn gāoxìng néng lái dào zhèlǐ.',
        french: 'Directeur Wang, bonjour ! Je suis content de venir ici.',
      },
      {
        id: 'd1_2',
        speaker: '王总',
        speakerRole: 'Directeur d’Usine',
        speakerColor: 'turquoise',
        hanzi: '您好，欢迎欢迎！请坐，先喝杯茶。',
        pinyin: 'Nín hǎo, huānyíng huānyíng! Qǐng zuò, xiān hē bēi chá.',
        french: 'Bonjour, bienvenue, bienvenue ! Asseyez-vous, prenez d’abord une tasse de thé.',
      },
      {
        id: 'd1_3',
        speaker: 'Espoir',
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
        hanzi: '应该的。您什么时候到的？休息好了吗？',
        pinyin: 'Yīnggāi de. Nín shénme shíhou dào de? Xiūxi hǎo le ma?',
        french: 'C’est bien normal. Vous êtes arrivé quand ? Vous avez bien pu vous reposer ?',
      },
      {
        id: 'd1_5',
        speaker: 'Espoir',
        speakerRole: 'Partenaire',
        speakerColor: 'violet',
        hanzi: '昨天晚上到的，休息得挺好，谢谢关心。',
        pinyin: 'Zuótiān wǎnshang dào de, xiūxi de tǐng hǎo, xièxie guānxīn.',
        french: 'Je suis arrivé hier soir, j’ai bien pu me reposer, merci de vous en soucier.',
      },
      {
        id: 'd1_6',
        speaker: '王总',
        speakerRole: 'Directeur d’Usine',
        speakerColor: 'turquoise',
        hanzi: '好，咱们先聊聊，等会儿再看产品目录。',
        pinyin: 'Hǎo, zánmen xiān liáoliáo, děng huìr zài kàn chǎnpǐn mùlù.',
        french: 'D’accord, discutons d’abord un peu, on regardera le catalogue des produits tout à l’heure.',
      },
    ],
    vocabulary: [
      { hanzi: '欢迎', pinyin: 'huānyíng', french: 'bienvenue', role: 'Verbe / Formule' },
      { hanzi: '应该的', pinyin: 'yīnggāi de', french: 'c’est normal, de rien', role: 'Expression' },
      { hanzi: '休息', pinyin: 'xiūxi', french: 'se reposer', role: 'Verbe' },
      { hanzi: '关心', pinyin: 'guānxīn', french: 'se soucier de, prêter attention à', role: 'Verbe' },
      { hanzi: '聊聊', pinyin: 'liáoliáo', french: 'discuter (un peu)', role: 'Verbe' },
      { hanzi: '产品目录', pinyin: 'chǎnpǐn mùlù', french: 'catalogue de produits', role: 'Nom commun' },
    ]
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
        color: 'pink'
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
        speakerColor: 'pink',
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
        speakerColor: 'pink',
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
    id: 'dialogue_4',
    titleFr: 'Prendre le Taxi pour Aller à l’Hôtel',
    titleZh: '坐出租车去酒店',
    titlePinyin: 'Zuò Chūzūchē Qù Jiǔdiàn',
    type: 'dialogues',
    level: 'HSK 2',
    duration: '2 min 30',
    description: 'Donner sa destination au chauffeur et s’informer sur le temps de trajet en toute simplicité.',
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#0288D1] to-[#01579B]',
    characters: [
      {
        name: 'Espoir',
        nameZh: '苏波',
        pinyin: 'Sūbō',
        role: 'Passager',
        description: 'Prend un taxi à Pékin pour rejoindre son hôtel et demande au chauffeur combien de temps prendra la course.',
        color: 'violet'
      },
      {
        name: '师傅',
        nameZh: '师傅',
        pinyin: 'Shīfu',
        role: 'Conducteur',
        description: 'Chauffeur de taxi pékinois attentionné, invite son passager à monter en toute sécurité et estime le trajet à 15 minutes.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'd4_1',
        speaker: 'Espoir',
        speakerRole: 'Passager',
        speakerColor: 'violet',
        hanzi: '师傅，您好！我想去北京酒店。',
        pinyin: 'Shīfu, nín hǎo! Wǒ xiǎng qù Běijīng Jiǔdiàn.',
        french: 'Bonjour chauffeur ! J’aimerais aller à l’Hôtel de Pékin.',
      },
      {
        id: 'd4_2',
        speaker: '师傅',
        speakerRole: 'Conducteur',
        speakerColor: 'turquoise',
        hanzi: '好的，请上车，请系好安全带。',
        pinyin: 'Hǎo de, qǐng shàng chē, qǐng jì hǎo ānquándài.',
        french: 'D’accord, veuillez monter et bien attacher votre ceinture.',
      },
      {
        id: 'd4_3',
        speaker: 'Espoir',
        speakerRole: 'Passager',
        speakerColor: 'violet',
        hanzi: '请问，到北京酒店要坐几分钟？',
        pinyin: 'Qǐngwèn, dào Běijīng Jiǔdiàn yào zuò jǐ fēnzhōng?',
        french: 'S’il vous plaît, combien de minutes faut-il pour arriver à l’Hôtel de Pékin ?',
      },
      {
        id: 'd4_4',
        speaker: '师傅',
        speakerRole: 'Conducteur',
        speakerColor: 'turquoise',
        hanzi: '大概十五分钟就到了。',
        pinyin: 'Dàgài shíwǔ fēnzhōng jiù dào le.',
        french: 'Environ quinze minutes et nous y serons.',
      },
    ],
  },
  {
    id: 'dialogue_appel_telephonique',
    titleFr: 'Y a-t-il cours demain, professeur Wang ?',
    titleZh: '打电话',
    titlePinyin: 'Dǎ diànhuà',
    type: 'dialogues',
    level: 'HSK 2',
    duration: '1 min 45',
    description: 'Li Yue appelle son professeur M. Wang pour lui demander si les cours ont bien lieu le lendemain.',
    imageUrl: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#0288D1] to-[#01579B]',
    characters: [
      {
        name: '王老师',
        nameZh: '王老师',
        pinyin: 'Wáng Lǎoshī',
        role: 'Professeur',
        description: 'Répond poliment à son étudiante et confirme la tenue du cours du lendemain.',
        color: 'violet'
      },
      {
        name: '李月',
        nameZh: '李月',
        pinyin: 'Lǐ Yuè',
        role: 'Étudiante',
        description: 'Appelle son professeur pour s’assurer de l’emploi du temps de demain.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 'dat_1',
        speaker: '王老师',
        speakerRole: 'Professeur',
        speakerColor: 'violet',
        hanzi: '喂，你好。',
        pinyin: 'Wèi, nǐ hǎo.',
        french: 'Allô, bonjour.',
      },
      {
        id: 'dat_2',
        speaker: '李月',
        speakerRole: 'Étudiante',
        speakerColor: 'turquoise',
        hanzi: '你好，请问王老师在吗？',
        pinyin: 'Nǐ hǎo, qǐngwèn Wáng lǎoshī zài ma?',
        french: 'Bonjour, est-ce que le professeur Wang est là s’il vous plaît ?',
      },
      {
        id: 'dat_3',
        speaker: '王老师',
        speakerRole: 'Professeur',
        speakerColor: 'violet',
        hanzi: '我就是。',
        pinyin: 'Wǒ jiù shì.',
        french: 'C’est moi-même.',
      },
      {
        id: 'dat_4',
        speaker: '李月',
        speakerRole: 'Étudiante',
        speakerColor: 'turquoise',
        hanzi: '王老师，您好。我是李月。',
        pinyin: 'Wáng lǎoshī, nín hǎo. Wǒ shì Lǐ Yuè.',
        french: 'Bonjour professeur Wang. Je suis Li Yue.',
      },
      {
        id: 'dat_5',
        speaker: '王老师',
        speakerRole: 'Professeur',
        speakerColor: 'violet',
        hanzi: '李月，你好。',
        pinyin: 'Lǐ Yuè, nǐ hǎo.',
        french: 'Bonjour Li Yue.',
      },
      {
        id: 'dat_6',
        speaker: '李月',
        speakerRole: 'Étudiante',
        speakerColor: 'turquoise',
        hanzi: '老师，明天上课吗？',
        pinyin: 'Lǎoshī, míngtiān shàngkè ma?',
        french: 'Professeur, y a-t-il cours demain ?',
      },
      {
        id: 'dat_7',
        speaker: '王老师',
        speakerRole: 'Professeur',
        speakerColor: 'violet',
        hanzi: '明天上课。',
        pinyin: 'Míngtiān shàngkè.',
        french: 'Oui, nous avons cours demain.',
      },
      {
        id: 'dat_8',
        speaker: '李月',
        speakerRole: 'Étudiante',
        speakerColor: 'turquoise',
        hanzi: '好，谢谢老师。',
        pinyin: 'Hǎo, xièxie lǎoshī.',
        french: 'D’accord, merci professeur.',
      },
      {
        id: 'dat_9',
        speaker: '王老师',
        speakerRole: 'Professeur',
        speakerColor: 'violet',
        hanzi: '不客气。明天见。',
        pinyin: 'Bú kèqi. Míngtiān jiàn.',
        french: 'Je vous en prie. À demain.',
      },
      {
        id: 'dat_10',
        speaker: '李月',
        speakerRole: 'Étudiante',
        speakerColor: 'turquoise',
        hanzi: '明天见。',
        pinyin: 'Míngtiān jiàn.',
        french: 'À demain.',
      },
    ],
    vocabulary: [
      { hanzi: '打电话', pinyin: 'dǎ diànhuà', french: 'téléphoner, passer un appel', role: 'Locution verbale' },
      { hanzi: '喂', pinyin: 'wèi', french: 'allô (au téléphone)', role: 'Interjection' },
      { hanzi: '就是', pinyin: 'jiù shì', french: 'c’est exactement (lui/moi-même)', role: 'Adverbe / Locution' },
      { hanzi: '明天', pinyin: 'míngtiān', french: 'demain', role: 'Nom temporel' },
      { hanzi: '上课', pinyin: 'shàngkè', french: 'avoir cours, aller en cours', role: 'Verbe' },
      { hanzi: '不客气', pinyin: 'bú kèqi', french: 'de rien, je vous en prie', role: 'Expression de politesse' },
      { hanzi: '见', pinyin: 'jiàn', french: 'voir, se voir', role: 'Verbe' },
    ]
  },
  {
    id: 'dialogue_3',
    titleFr: 'Commander au Restaurant',
    titleZh: '在餐厅点菜',
    titlePinyin: 'Zài Cāntīng Diǎncài',
    type: 'dialogues',
    level: 'HSK 2',
    duration: '2 min 10',
    description: 'Commander facilement ses plats de nouilles et ses boissons au restaurant.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#0288D1] to-[#01579B]',
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
      { id: 'bj_22', speaker: 'Artistes Réunis', hanzi: '为你开天辟地', pinyin: 'Wèi nǐ kāitiānpìdì', french: 'Et déploie toute son énergie' },
      { id: 'bj_23', speaker: 'Artistes Réunis', hanzi: '流动中的魅力充满着朝气', pinyin: 'Liúdòng zhōng de mèilì chōngmǎn zhe zhāoqì', french: 'Une ferveur pleine de vitalité' },
      { id: 'bj_24', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_25', speaker: 'Artistes Réunis', hanzi: '在太阳下分享呼吸', pinyin: 'Zài tàiyáng xià fēnxiǎng hūxī', french: 'Partageons le même souffle' },
      { id: 'bj_26', speaker: 'Artistes Réunis', hanzi: '在黄土地刷新成绩', pinyin: 'Zài huáng tǔdì shuāxīn chéngjì', french: 'Et bâtissons ensemble l’avenir' },
      { id: 'bj_27', section: 'Couplet 2', speaker: 'Artistes Réunis', hanzi: '我家大门常打开', pinyin: 'Wǒ jiā dàmén cháng dǎkāi', french: 'Les portes de ma demeure sont grandes ouvertes' },
      { id: 'bj_28', speaker: 'Artistes Réunis', hanzi: '开怀容纳天地', pinyin: 'Kāihuái róngnà tiāndì', french: 'Pour accueillir le monde à cœur ouvert' },
      { id: 'bj_29', speaker: 'Artistes Réunis', hanzi: '岁月绽放青春笑容', pinyin: 'Suìyuè zhànfàng qīngchūn xiàoróng', french: 'Les années font éclore des sourires de jeunesse' },
      { id: 'bj_30', speaker: 'Artistes Réunis', hanzi: '迎接这个日期', pinyin: 'Yíngjiē zhège rìqī', french: 'Pour célébrer ce grand jour' },
      { id: 'bj_31', speaker: 'Artistes Réunis', hanzi: '天大地大都是朋友请不用客气', pinyin: 'Tiān dà dì dà dōushì péngyǒu qǐng bùyòng kèqì', french: 'Sous ce vaste ciel, nous sommes tous amis, faites comme chez vous' },
      { id: 'bj_32', speaker: 'Artistes Réunis', hanzi: '画意诗情带笑意', pinyin: 'Huàyì shīqíng dài xiàoyì', french: 'Dans la poésie et la joie partagée' },
      { id: 'bj_33', speaker: 'Artistes Réunis', hanzi: '只为等待你', pinyin: 'Zhǐ wèi děngdài nǐ', french: 'Rien que pour vous attendre' },
      { id: 'bj_34', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_35', speaker: 'Artistes Réunis', hanzi: '像音乐感动你', pinyin: 'Xiàng yīnyuè gǎndòng nǐ', french: 'Comme une mélodie qui vous émeut' },
      { id: 'bj_36', speaker: 'Artistes Réunis', hanzi: '让我们都加油去超越自己', pinyin: 'Ràng wǒmen dōu jiāyóu qù chāoyuè zìjǐ', french: 'Donnons le meilleur de nous pour nous dépasser' },
      { id: 'bj_37', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_38', speaker: 'Artistes Réunis', hanzi: '有梦想谁都了不起', pinyin: 'Yǒu mèngxiǎng shéi dōu liǎobuqǐ', french: 'Quiconque a un rêve est formidable' },
      { id: 'bj_39', speaker: 'Artistes Réunis', hanzi: '有勇气就会有奇迹', pinyin: 'Yǒu yǒngqì jiù huì yǒu qíjì', french: 'Avec du courage naissent les miracles' },
      { id: 'bj_40', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_41', speaker: 'Artistes Réunis', hanzi: '为你开天辟地', pinyin: 'Wèi nǐ kāitiānpìdì', french: 'Et déploie toute son énergie' },
      { id: 'bj_42', speaker: 'Artistes Réunis', hanzi: '流动中的魅力充满着朝气', pinyin: 'Liúdòng zhōng de mèilì chōngmǎn zhe zhāoqì', french: 'Une ferveur pleine de vitalité' },
      { id: 'bj_43', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_44', speaker: 'Artistes Réunis', hanzi: '在太阳下分享呼吸', pinyin: 'Zài tàiyáng xià fēnxiǎng hūxī', french: 'Partageons le même souffle' },
      { id: 'bj_45', speaker: 'Artistes Réunis', hanzi: '在黄土地刷新成绩', pinyin: 'Zài huáng tǔdì shuāxīn chéngjì', french: 'Et bâtissons ensemble l’avenir' },
      { id: 'bj_46', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_47', speaker: 'Artistes Réunis', hanzi: '像音乐感动你', pinyin: 'Xiàng yīnyuè gǎndòng nǐ', french: 'Comme une mélodie qui vous émeut' },
      { id: 'bj_48', speaker: 'Artistes Réunis', hanzi: '让我们都加油去超越自己', pinyin: 'Ràng wǒmen dōu jiāyóu qù chāoyuè zìjǐ', french: 'Donnons le meilleur de nous pour nous dépasser' },
      { id: 'bj_49', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_50', speaker: 'Artistes Réunis', hanzi: '有梦想谁都了不起', pinyin: 'Yǒu mèngxiǎng shéi dōu liǎobuqǐ', french: 'Quiconque a un rêve est formidable' },
      { id: 'bj_51', speaker: 'Artistes Réunis', hanzi: '有勇气就会有奇迹', pinyin: 'Yǒu yǒngqì jiù huì yǒu qíjì', french: 'Avec du courage naissent les miracles' },
      { id: 'bj_52', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_53', speaker: 'Artistes Réunis', hanzi: '有梦想谁都了不起', pinyin: 'Yǒu mèngxiǎng shéi dōu liǎobuqǐ', french: 'Quiconque a un rêve est formidable' },
      { id: 'bj_54', speaker: 'Artistes Réunis', hanzi: '有勇气就会有奇迹', pinyin: 'Yǒu yǒngqì jiù huì yǒu qíjì', french: 'Avec du courage naissent les miracles' },
      { id: 'bj_55', section: 'Refrain', speaker: 'Artistes Réunis', hanzi: '北京欢迎你', pinyin: 'Běijīng huānyíng nǐ', french: 'Pékin vous accueille' },
      { id: 'bj_56', speaker: 'Artistes Réunis', hanzi: '有梦想谁都了不起', pinyin: 'Yǒu mèngxiǎng shéi dōu liǎobuqǐ', french: 'Quiconque a un rêve est formidable' },
      { id: 'bj_57', speaker: 'Artistes Réunis', hanzi: '有勇气就会有奇迹', pinyin: 'Yǒu yǒngqì jiù huì yǒu qíjì', french: 'Avec du courage naissent les miracles' },
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
      { id: 'ch2_57', speaker: 'Wakin Chau', hanzi: '朋友不曾孤单过', pinyin: 'Péngyǒu bùcéng gūdān guò', french: 'Un véritable ami est toujours là' },
      { id: 'ch2_58', speaker: 'Wakin Chau', hanzi: '一声朋友你会懂', pinyin: 'Yì shēng péngyǒu nǐ huì dǒng', french: 'Il suffit d’un appel et tu comprends' },
      { id: 'ch2_59', speaker: 'Wakin Chau', hanzi: '还有伤', pinyin: 'Hái yǒu shāng', french: 'Malgré les blessures' },
      { id: 'ch2_60', speaker: 'Wakin Chau', hanzi: '还有痛', pinyin: 'Hái yǒu tòng', french: 'Et les épreuves' },
      { id: 'ch2_61', speaker: 'Wakin Chau', hanzi: '还要走', pinyin: 'Hái yào zǒu', french: 'Nous irons de l’avant' },
      { id: 'ch2_62', speaker: 'Wakin Chau', hanzi: '还有我', pinyin: 'Hái yǒu wǒ', french: 'Je serai toujours à tes côtés' },
      { id: 'ch2_63', section: 'Refrain', speaker: 'Wakin Chau', hanzi: '一句话', pinyin: 'Yí jù huà', french: 'Une parole' },
      { id: 'ch2_64', speaker: 'Wakin Chau', hanzi: '一辈子', pinyin: 'Yí bèizi', french: 'Toute une existence' },
      { id: 'ch2_65', speaker: 'Wakin Chau', hanzi: '一生情', pinyin: 'Yì shēng qíng', french: 'Une fraternité pure' },
      { id: 'ch2_66', speaker: 'Wakin Chau', hanzi: '一杯酒', pinyin: 'Yì bēi jiǔ', french: 'Scellée à jamais' },
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
      { id: 'st_9', section: 'Pré-refrain', speaker: 'Chorale des Jeunes', hanzi: '我祈祷拥有一颗透明的心灵', pinyin: 'Wǒ qǐdǎo yōngyǒu yì kē tòumíng de xīnlíng', french: 'Je prie pour garder un cœur pur et transparent' },
      { id: 'st_10', speaker: 'Chorale des Jeunes', hanzi: '和会流泪的眼睛', pinyin: 'Hé huì liúlèi de yǎnjing', french: 'Et des yeux capables de s’émouvoir' },
      { id: 'st_11', speaker: 'Chorale des Jeunes', hanzi: '给我再去相信的勇气', pinyin: 'Gěi wǒ zài qù xiāngxìn de yǒngqì', french: 'Donne-moi le courage de croire à nouveau' },
      { id: 'st_12', speaker: 'Chorale des Jeunes', hanzi: '越过谎言去拥抱你', pinyin: 'Yuèguò huǎngyán qù yōngbào nǐ', french: 'Et de dépasser les faux-semblants pour t’embrasser' },
      { id: 'st_13', section: 'Refrain', speaker: 'Chorale des Jeunes', hanzi: '每当我找不到存在的意义', pinyin: 'Měi dāng wǒ zhǎo bú dào cúnzài de yìyì', french: 'Chaque fois que je perds le sens de ma vie' },
      { id: 'st_14', speaker: 'Chorale des Jeunes', hanzi: '每当我迷失在黑夜里', pinyin: 'Měi dāng wǒ míshī zài hēiyè lǐ', french: 'Chaque fois que je m’égare dans l’obscurité' },
      { id: 'st_15', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du ciel nocturne' },
      { id: 'st_16', speaker: 'Chorale des Jeunes', hanzi: '请指引我靠近你', pinyin: 'Qǐng zhǐyǐn wǒ kàojìn nǐ', french: 'Guide mes pas pour me rapprocher de toi' },
      { id: 'st_17', section: 'Pré-refrain', speaker: 'Chorale des Jeunes', hanzi: '我祈祷拥有一颗透明的心灵', pinyin: 'Wǒ qǐdǎo yōngyǒu yì kē tòumíng de xīnlíng', french: 'Je prie pour préserver la pureté de mon âme' },
      { id: 'st_18', speaker: 'Chorale des Jeunes', hanzi: '和会流泪的眼睛', pinyin: 'Hé huì liúlèi de yǎnjing', french: 'Et mon empathie' },
      { id: 'st_19', speaker: 'Chorale des Jeunes', hanzi: '给我再去相信的勇气', pinyin: 'Gěi wǒ zài qù xiāngxìn de yǒngqì', french: 'Donne-moi l’audace d’aimer' },
      { id: 'st_20', speaker: 'Chorale des Jeunes', hanzi: '越过谎言去拥抱你', pinyin: 'Yuèguò huǎngyán qù yōngbào nǐ', french: 'Au-delà de toute désillusion' },
      { id: 'st_21', section: 'Refrain', speaker: 'Chorale des Jeunes', hanzi: '每当我找不到存在的意义', pinyin: 'Měi dāng wǒ zhǎo bú dào cúnzài de yìyì', french: 'Quand s’efface le sens' },
      { id: 'st_22', speaker: 'Chorale des Jeunes', hanzi: '每当我迷失在黑夜里', pinyin: 'Měi dāng wǒ míshī zài hēiyè lǐ', french: 'Et que vient l’obscurité' },
      { id: 'st_23', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile la plus brillante du firmament' },
      { id: 'st_24', speaker: 'Chorale des Jeunes', hanzi: '请照亮我前行', pinyin: 'Qǐng zhàoliàng wǒ qiánxíng', french: 'Guide mes pas vers la lumière' },
      { id: 'st_25', section: 'Outro', speaker: 'Chorale des Jeunes', hanzi: '夜空中最亮的星', pinyin: 'Yè kōng zhōng zuì liàng de xīng', french: 'Étoile dans la nuit' },
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
    id: 'chanson_xianchuzhendeni',
    titleFr: 'Montre qui tu es vraiment',
    titleZh: '现出真的你',
    titlePinyin: 'Xiàn chū zhēn de nǐ',
    type: 'chansons',
    level: 'HSK 5',
    duration: '4 min 39',
    artist: 'Hu Weina & Ding Shuang',
    youtubeId: 'ISK2emgbm4c',
    description: 'La version mandarine officielle du titre phare de La Reine des Neiges 2 (Show Yourself), interprétée par Hu Weina et Ding Shuang.',
    imageUrl: 'https://img.youtube.com/vi/ISK2emgbm4c/hqdefault.jpg',
    iconBg: 'from-[#8E24AA] to-[#6200EE]',
    sentences: [
      { id: 'xcz_1', section: 'Couplet 1', speaker: 'Hu Weina', hanzi: '不是因为寒冷气候', pinyin: 'Bú shì yīnwèi hánlěng qìhòu', french: 'Ce n’est pas à cause du froid' },
      { id: 'xcz_2', speaker: 'Hu Weina', hanzi: '我全身发抖', pinyin: 'Wǒ quánshēn fādǒu', french: 'Que je frissonne de tout mon corps' },
      { id: 'xcz_3', speaker: 'Hu Weina', hanzi: '这感觉很熟悉', pinyin: 'Zhè gǎnjué hěn shúxī', french: 'Cette sensation m’est si familière' },
      { id: 'xcz_4', speaker: 'Hu Weina', hanzi: '如梦境一样', pinyin: 'Rú mèngjìng yíyàng', french: 'Comme dans un songe' },
      { id: 'xcz_5', speaker: 'Hu Weina', hanzi: '却没法拥有', pinyin: 'Què méi fǎ yǒngyǒu', french: 'Sans pouvoir la retenir' },
      { id: 'xcz_6', speaker: 'Hu Weina', hanzi: '你就在那里', pinyin: 'Nǐ jiù zài nàlǐ', french: 'Tu es pourtant là' },
      { id: 'xcz_7', speaker: 'Hu Weina', hanzi: '像是一个老朋友', pinyin: 'Xiàng shì yí gè lǎo péngyou', french: 'Tel un vieil ami' },
      { id: 'xcz_8', speaker: 'Hu Weina', hanzi: '来到这里', pinyin: 'Lái dào zhèlǐ', french: 'En arrivant ici' },
      { id: 'xcz_9', speaker: 'Hu Weina', hanzi: '好像回到家门口', pinyin: 'Hǎoxiàng huí dào jiā ménkǒu', french: 'J’ai l’impression d’être enfin chez moi' },
      { id: 'xcz_10', section: 'Couplet 2', speaker: 'Hu Weina', hanzi: '我坚强的心是城堡', pinyin: 'Wǒ jiānqiáng de xīn shì chéngbǎo', french: 'Mon cœur fort était une forteresse' },
      { id: 'xcz_11', speaker: 'Hu Weina', hanzi: '把秘密关起来', pinyin: 'Bǎ mìmì guān qǐlái', french: 'Gardant ses secrets bien scellés' },
      { id: 'xcz_12', speaker: 'Hu Weina', hanzi: '你也有秘密', pinyin: 'Nǐ yě yǒu mìmì', french: 'Toi aussi tu as des secrets' },
      { id: 'xcz_13', speaker: 'Hu Weina', hanzi: '但你不用躲开', pinyin: 'Dàn nǐ bú yòng duǒkāi', french: 'Mais tu n’as plus besoin de te cacher' },
      { id: 'xcz_14', section: 'Refrain', speaker: 'Hu Weina', hanzi: '你是谁', pinyin: 'Nǐ shì shéi', french: 'Qui es-tu ?' },
      { id: 'xcz_15', speaker: 'Hu Weina', hanzi: '我渴望见到你', pinyin: 'Wǒ kěwàng jiàndào nǐ', french: 'J’ai tellement hâte de te rencontrer' },
      { id: 'xcz_16', speaker: 'Hu Weina', hanzi: '你是谁', pinyin: 'Nǐ shì shéi', french: 'Qui es-tu ?' },
      { id: 'xcz_17', speaker: 'Hu Weina', hanzi: '快出来', pinyin: 'Kuài chūlái', french: 'Montre-toi !' },
      { id: 'xcz_18', speaker: 'Hu Weina', hanzi: '你是不是我生命里所有的期待', pinyin: 'Nǐ shì bú shì wǒ shēngmìng lǐ suǒyǒu de qīdài', french: 'Es-tu l’attente de toute ma vie ?' },
      { id: 'xcz_19', speaker: 'Hu Weina', hanzi: '你是谁', pinyin: 'Nǐ shì shéi', french: 'Qui es-tu ?' },
      { id: 'xcz_20', speaker: 'Hu Weina', hanzi: '答案说出来', pinyin: 'Dá’àn shuō chūlái', french: 'Révèle-moi la vérité !' },
      { id: 'xcz_21', speaker: 'Hu Weina', hanzi: '啊啊啊啊', pinyin: 'Ā ā ā ā', french: 'Ah ah ah ah' },
      { id: 'xcz_22', section: 'Couplet 3', speaker: 'Hu Weina', hanzi: '我一直都很清楚', pinyin: 'Wǒ yìzhí dōu hěn qīngchu', french: 'J’ai toujours su parfaitement' },
      { id: 'xcz_23', speaker: 'Hu Weina', hanzi: '我受过的折磨', pinyin: 'Wǒ shòuguò de zhémó', french: 'Toutes les épreuves endurées' },
      { id: 'xcz_24', speaker: 'Hu Weina', hanzi: '但今天我在这里', pinyin: 'Dàn jīntiān wǒ zài zhèlǐ', french: 'Mais aujourd’hui je suis ici' },
      { id: 'xcz_25', speaker: 'Hu Weina', hanzi: '也许找到出生的线索', pinyin: 'Yěxǔ zhǎodào chūshēng de xiànsuǒ', french: 'Pour enfin percer le mystère de mes origines' },
      { id: 'xcz_26', speaker: 'Hu Weina', hanzi: '我是天生与众不同', pinyin: 'Wǒ shì tiānshēng yǔzhòng-bùtóng', french: 'Je suis née différente des autres' },
      { id: 'xcz_27', speaker: 'Hu Weina', hanzi: '不适合平凡生活', pinyin: 'Bú shìhé píngfán shēnghuó', french: 'Non faite pour une vie ordinaire' },
      { id: 'xcz_28', speaker: 'Hu Weina', hanzi: '是否今天', pinyin: 'Shìfǒu jīntiān', french: 'Est-ce qu’aujourd’hui,' },
      { id: 'xcz_29', speaker: 'Hu Weina', hanzi: '你的出现', pinyin: 'Nǐ de chūxiàn', french: 'Ta présence' },
      { id: 'xcz_30', speaker: 'Hu Weina', hanzi: '将答案告诉我', pinyin: 'Jiāng dá’àn gàosù wǒ', french: 'M’apportera enfin la réponse ?' },
      { id: 'xcz_31', section: 'Refrain', speaker: 'Hu Weina', hanzi: '你是谁', pinyin: 'Nǐ shì shéi', french: 'Qui es-tu ?' },
      { id: 'xcz_32', speaker: 'Hu Weina', hanzi: '我再不会颤抖', pinyin: 'Wǒ zài bú huì chàndǒu', french: 'Je n’ai plus peur de trembler' },
      { id: 'xcz_33', speaker: 'Hu Weina', hanzi: '离开家我不害怕', pinyin: 'Líkāi jiā wǒ bú pà', french: 'Loin de chez moi, je n’ai plus peur' },
      { id: 'xcz_34', speaker: 'Hu Weina', hanzi: '你能把我生命中疑惑', pinyin: 'Nǐ néng bǎ wǒ shēngmìng zhōng yíhuò', french: 'Tu peux dissiper tous les doutes de ma vie' },
      { id: 'xcz_35', speaker: 'Hu Weina', hanzi: '全部解答', pinyin: 'Quánbù jiědá', french: 'Et m’éclairer' },
      { id: 'xcz_36', speaker: 'Hu Weina', hanzi: '你是谁', pinyin: 'Nǐ shì shéi', french: 'Qui es-tu ?' },
      { id: 'xcz_37', speaker: 'Hu Weina', hanzi: '跟我见面好吗', pinyin: 'Gēn wǒ jiànmiàn hǎo ma', french: 'Montre-toi, je t’en prie' },
      { id: 'xcz_38', section: 'Pont', speaker: 'Hu Weina', hanzi: '向我走来', pinyin: 'Xiàng wǒ zǒu lái', french: 'Viens à ma rencontre' },
      { id: 'xcz_39', speaker: 'Hu Weina', hanzi: '把门打开', pinyin: 'Bǎ mén dǎkāi', french: 'Ouvre la porte' },
      { id: 'xcz_40', speaker: 'Hu Weina', hanzi: '不要让我一直等待', pinyin: 'Bú yào ràng wǒ yìzhí děngdài', french: 'Ne me laisse plus attendre' },
      { id: 'xcz_41', speaker: 'Hu Weina', hanzi: '向我走来', pinyin: 'Xiàng wǒ zǒu lái', french: 'Viens vers moi' },
      { id: 'xcz_42', speaker: 'Hu Weina', hanzi: '把门打开', pinyin: 'Bǎ mén dǎkāi', french: 'Ouvre la porte' },
      { id: 'xcz_43', speaker: 'Hu Weina', hanzi: '别再让我 一直等待', pinyin: 'Bié zài ràng wǒ yìzhí děngdài', french: 'Ne me fais plus languir' },
      { id: 'xcz_44', section: 'Couplet 4', speaker: 'Ding Shuang', hanzi: '北风吹过 浪卷起', pinyin: 'Běifēng chuī guò, làng juǎn qǐ', french: 'Le vent du Nord souffle, les vagues se soulèvent' },
      { id: 'xcz_45', speaker: 'Ding Shuang', hanzi: '有一条河 充满着回忆', pinyin: 'Yǒu yì tiáo hé, chōngmǎnzhe huíyì', french: 'Il est un fleuve chargé de souvenirs' },
      { id: 'xcz_46', speaker: 'Ding Shuang', hanzi: '请回家吧 小宝宝', pinyin: 'Qǐng huí jiā ba, xiǎo bǎobao', french: 'Reviens à la maison, mon enfant bien-aimé' },
      { id: 'xcz_47', section: 'Refrain', speaker: 'Hu Weina & Ding Shuang', hanzi: '我存在', pinyin: 'Wǒ cúnzài', french: 'J’existe enfin !' },
      { id: 'xcz_48', speaker: 'Hu Weina & Ding Shuang', hanzi: '看自己 力量排山倒海', pinyin: 'Kàn zìjǐ, lìliàng páishāndǎohǎi', french: 'Regarde en toi cette puissance infinie' },
      { id: 'xcz_49', speaker: 'Hu Weina & Ding Shuang', hanzi: '看自己 全新的姿态', pinyin: 'Kàn zìjǐ, quánxīn de zītài', french: 'Révèle-toi sous un jour nouveau' },
      { id: 'xcz_50', speaker: 'Hu Weina & Ding Shuang', hanzi: '终于明白 你就是自己', pinyin: 'Zhōngyú míngbai, nǐ jiù shì zìjǐ', french: 'J’ai enfin compris : cette force, c’est toi-même' },
      { id: 'xcz_51', speaker: 'Hu Weina & Ding Shuang', hanzi: '终于明白', pinyin: 'Zhōngyú míngbai', french: 'J’ai enfin compris' },
      { id: 'xcz_52', speaker: 'Hu Weina & Ding Shuang', hanzi: '所有期待', pinyin: 'Suǒyǒu qīdài', french: 'Toutes mes espérances' },
      { id: 'xcz_53', speaker: 'Hu Weina & Ding Shuang', hanzi: '哦 我存在', pinyin: 'Ó, wǒ cúnzài', french: 'Oh, je suis enfin moi-même !' },
      { id: 'xcz_54', speaker: 'Hu Weina & Ding Shuang', hanzi: '呜啊啊啊啊', pinyin: 'Wū ā ā ā ā', french: 'Ooh ah ah ah ah' },
    ],
  },
  {
    id: 'chanson_yeguang',
    titleFr: 'Lueur Nocturne',
    titleZh: '夜光',
    titlePinyin: 'Yèguāng',
    type: 'chansons',
    level: 'HSK 5',
    duration: '4 min 30',
    artist: 'Na Ying',
    youtubeId: '5JXOLr-32Wc',
    description: 'Chanson envoûtante et puissante de Na Ying (B.O. du film « A or B »). Une ode à la résilience et à la renaissance.',
    imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=600&auto=format&fit=crop&q=80',
    iconBg: 'from-[#8E24AA] to-[#6200EE]',
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
      { id: 'yg_26', section: 'Refrain', speaker: 'Na Ying', hanzi: '如果所有的光芒都失去颜色', pinyin: 'Rúguǒ suǒyǒu de guāngmáng dōu shīqù yánsè', french: 'Si toutes les lumières perdaient leurs couleurs' },
      { id: 'yg_27', speaker: 'Na Ying', hanzi: '就擦亮我黑夜里不灭的路灯', pinyin: 'Jiù cāliàng wǒ hēiyè lǐ búmiè de lùdēng', french: 'Ravive ce réverbère qui ne s’éteint jamais dans la nuit' },
      { id: 'yg_28', speaker: 'Na Ying', hanzi: '如果寂寞是拥有的唯一要求', pinyin: 'Rúguǒ jìmò shì yōngyǒu de wéiyī yāoqiú', french: 'Si la solitude est le seul prix pour t’aimer' },
      { id: 'yg_29', speaker: 'Na Ying', hanzi: '就让我寂寞', pinyin: 'Jiù ràng wǒ jìmò', french: 'Alors laisse-moi embrasser la solitude' },
      { id: 'yg_30', speaker: 'Na Ying', hanzi: '如果所有的风景变成了沙漠', pinyin: 'Rúguǒ suǒyǒu de fēngjǐng biànchéng le shāmò', french: 'Si tous les paysages devenaient des déserts' },
      { id: 'yg_31', speaker: 'Na Ying', hanzi: '请放逐我如流星碎落的粉末', pinyin: 'Qǐng fàngzhú wǒ rú liúxīng suìluò de fěnmò', french: 'Exile-moi comme la poussière d’une étoile filante' },
      { id: 'yg_32', speaker: 'Na Ying', hanzi: '你会记得在回忆最美的时候', pinyin: 'Nǐ huì jìde zài huíyì zuì měi de shíhou', french: 'Tu te rappelleras qu’au plus bel instant de nos vies' },
      { id: 'yg_33', section: 'Outro', speaker: 'Na Ying', hanzi: '你爱我', pinyin: 'Nǐ ài wǒ', french: 'Tu m’aimais' },
      { id: 'yg_34', speaker: 'Na Ying', hanzi: '爱我', pinyin: 'Ài wǒ', french: 'Tu m’aimais' },
      { id: 'yg_35', speaker: 'Na Ying', hanzi: '爱我', pinyin: 'Ài wǒ', french: 'Tu m’aimais passionnément' },
    ],
  },
  {
    id: 'chanson_toushiwodecuo',
    titleFr: 'Tout est ma faute',
    titleZh: '都是我的错',
    titlePinyin: 'Dōu shì wǒ de cuò',
    type: 'chansons',
    level: 'HSK 6',
    duration: '5 min 26',
    artist: 'Liu Jia Liang',
    youtubeId: 'nZ5LL2J49kQ',
    description: 'Une ballade pop poignante de Liu Jia Liang, portée par l’expression sincère des regrets et la force de l’amour par-delà la distance.',
    imageUrl: 'https://img.youtube.com/vi/nZ5LL2J49kQ/hqdefault.jpg',
    iconBg: 'from-[#D81B60] to-[#8E24AA]',
    sentences: [
      { id: 'tdc_1', section: 'Couplet 1', speaker: 'Liu Jia Liang', hanzi: '不愿意看你在流泪', pinyin: 'Bú yuànyì kàn nǐ zài liúlèi', french: 'Je ne veux pas te voir pleurer' },
      { id: 'tdc_2', speaker: 'Liu Jia Liang', hanzi: '可我却不能在你身边安慰', pinyin: 'Kě wǒ què bù néng zài nǐ shēnbiān ānwèi', french: 'Pourtant je ne peux être à tes côtés pour te réconforter' },
      { id: 'tdc_3', speaker: 'Liu Jia Liang', hanzi: '多年在外想你的心情', pinyin: 'Duōnián zàiwài xiǎng nǐ de xīnqíng', french: 'Après tant d’années loin de toi, le manque' },
      { id: 'tdc_4', speaker: 'Liu Jia Liang', hanzi: '越来越强烈', pinyin: 'Yuèláiyuè qiángliè', french: 'Devient de plus en plus intense' },
      { id: 'tdc_5', speaker: 'Liu Jia Liang', hanzi: '想你从前依偎在我怀里', pinyin: 'Xiǎng nǐ cóngqián yīwēi zài wǒ huái lǐ', french: 'Je me rappelle quand tu te blottissais dans mes bras' },
      { id: 'tdc_6', speaker: 'Liu Jia Liang', hanzi: '想你生气时噘嘴的样子', pinyin: 'Xiǎng nǐ shēngqì shí juēzuǐ de yàngzi', french: 'Je revois ta petite moue quand tu étais fâchée' },
      { id: 'tdc_7', speaker: 'Liu Jia Liang', hanzi: '想你在没有人时', pinyin: 'Xiǎng nǐ zài méiyǒu rén shí', french: 'Je me souviens qu’en secret, loin des regards' },
      { id: 'tdc_8', speaker: 'Liu Jia Liang', hanzi: '曾偷偷地说着我帅', pinyin: 'Céng tōutōu de shuōzhe wǒ shuài', french: 'Tu me murmurais que j’étais beau' },
      { id: 'tdc_9', section: 'Pré-refrain', speaker: 'Liu Jia Liang', hanzi: '你一个女人不容易', pinyin: 'Nǐ yí gè nǚrén bù róngyì', french: 'Ce n’est pas facile pour une femme seule' },
      { id: 'tdc_10', speaker: 'Liu Jia Liang', hanzi: '努力赚钱还要照顾家里', pinyin: 'Nǔlì zhuànqián hái yào zhàogù jiā lǐ', french: 'Travailler dur pour gagner sa vie tout en s’occupant du foyer' },
      { id: 'tdc_11', speaker: 'Liu Jia Liang', hanzi: '你可知道此刻的我', pinyin: 'Nǐ kě zhīdào cǐkè de wǒ', french: 'Sais-tu à quel point en cet instant' },
      { id: 'tdc_12', speaker: 'Liu Jia Liang', hanzi: '有多么心疼你', pinyin: 'Yǒu duōme xīnténg nǐ', french: 'Mon cœur a mal pour toi' },
      { id: 'tdc_13', speaker: 'Liu Jia Liang', hanzi: '每次回到我们生活的城市', pinyin: 'Měicì huí dào wǒmen shēnghuó de chéngshì', french: 'Chaque fois que je reviens dans notre ville' },
      { id: 'tdc_14', speaker: 'Liu Jia Liang', hanzi: '你总是用温柔和微笑来掩饰', pinyin: 'Nǐ zǒngshì yòng wēnróu hé wēixiào lái yǎnshì', french: 'Tu masques toujours ta peine sous la douceur d’un sourire' },
      { id: 'tdc_15', speaker: 'Liu Jia Liang', hanzi: '把全部的苦都自己来背', pinyin: 'Bǎ quánbù de kǔ dōu zìjǐ lái bēi', french: 'Portant toute la souffrance sur tes seules épaules' },
      { id: 'tdc_16', section: 'Refrain', speaker: 'Liu Jia Liang', hanzi: '都是我的错', pinyin: 'Dōu shì wǒ de cuò', french: 'Tout est de ma faute' },
      { id: 'tdc_17', speaker: 'Liu Jia Liang', hanzi: '请你原谅我', pinyin: 'Qǐng nǐ yuánliàng wǒ', french: 'S’il te plaît pardonne moi' },
      { id: 'tdc_18', speaker: 'Liu Jia Liang', hanzi: '为了你受再多的委屈都值得', pinyin: 'Wèile nǐ shòu zài duō de wěiqu dōu zhídé', french: 'Pour toi, endurer tant d’épreuves en vaut la peine' },
      { id: 'tdc_19', speaker: 'Liu Jia Liang', hanzi: '本想给你我们的未来', pinyin: 'Běn xiǎng gěi nǐ wǒmen de wèilái', french: 'Je voulais tant t’offrir notre avenir' },
      { id: 'tdc_20', speaker: 'Liu Jia Liang', hanzi: '可代价却是两地的分离', pinyin: 'Kě dàijià què shì liǎng dì de fēnlí', french: 'Mais le prix à payer a été la séparation de nos vies' },
      { id: 'tdc_21', speaker: 'Liu Jia Liang', hanzi: '只能够用思念互相祝福', pinyin: 'Zhǐ nénggòu yòng sīniàn hùxiāng zhùfú', french: 'Nous ne pouvons que nous soutenir à travers nos pensées' },
      { id: 'tdc_22', speaker: 'Liu Jia Liang', hanzi: '都是我的错', pinyin: 'Dōu shì wǒ de cuò', french: 'Tout est de ma faute' },
      { id: 'tdc_23', speaker: 'Liu Jia Liang', hanzi: '请你原谅我', pinyin: 'Qǐng nǐ yuánliàng wǒ', french: 'S’il te plaît pardonne moi' },
      { id: 'tdc_24', speaker: 'Liu Jia Liang', hanzi: '为了你我会更加珍惜自己', pinyin: 'Wèile nǐ wǒ huì gèngjiā zhēnxī zìjǐ', french: 'Pour toi, je prendrai encore plus soin de moi' },
      { id: 'tdc_25', speaker: 'Liu Jia Liang', hanzi: '只要我们的心还在一起', pinyin: 'Zhǐyào wǒmen de xīn hái zài yìqǐ', french: 'Tant que nos cœurs restent unis' },
      { id: 'tdc_26', speaker: 'Liu Jia Liang', hanzi: '岁月会有无数的惊喜', pinyin: 'Suìyuè huì yǒu wúshù de jīngxǐ', french: 'Le temps nous réservera d’infinies surprises' },
      { id: 'tdc_27', speaker: 'Liu Jia Liang', hanzi: '我爱你', pinyin: 'Wǒ ài nǐ', french: 'Je t’aime' },
      { id: 'tdc_28', speaker: 'Liu Jia Liang', hanzi: '谢谢你', pinyin: 'Xièxie nǐ', french: 'Merci à toi' },
      { id: 'tdc_29', section: 'Pré-refrain', speaker: 'Liu Jia Liang', hanzi: '你一个女人不容易', pinyin: 'Nǐ yí gè nǚrén bù róngyì', french: 'Ce n’est pas facile pour une femme seule' },
      { id: 'tdc_30', speaker: 'Liu Jia Liang', hanzi: '努力赚钱还要照顾家里', pinyin: 'Nǔlì zhuànqián hái yào zhàogù jiā lǐ', french: 'Travailler dur pour gagner sa vie tout en veillant sur le foyer' },
      { id: 'tdc_31', speaker: 'Liu Jia Liang', hanzi: '你可知道此刻的我', pinyin: 'Nǐ kě zhīdào cǐkè de wǒ', french: 'Sais-tu à quel point en cet instant' },
      { id: 'tdc_32', speaker: 'Liu Jia Liang', hanzi: '有多么心疼你', pinyin: 'Yǒu duōme xīnténg nǐ', french: 'Mon âme saigne pour toi' },
      { id: 'tdc_33', speaker: 'Liu Jia Liang', hanzi: '每次回到我们生活的城市', pinyin: 'Měicì huí dào wǒmen shēnghuó de chéngshì', french: 'Chaque fois que je reviens dans notre ville' },
      { id: 'tdc_34', speaker: 'Liu Jia Liang', hanzi: '你总是用温柔和微笑来掩饰', pinyin: 'Nǐ zǒngshì yòng wēnróu hé wēixiào lái yǎnshì', french: 'Tu masques toujours ta détresse avec tendresse et sourire' },
      { id: 'tdc_35', speaker: 'Liu Jia Liang', hanzi: '把全部的苦都自己来背', pinyin: 'Bǎ quánbù de kǔ dōu zìjǐ lái bēi', french: 'Portant toute la souffrance sur tes seules épaules' },
      { id: 'tdc_36', section: 'Refrain', speaker: 'Liu Jia Liang', hanzi: '都是我的错', pinyin: 'Dōu shì wǒ de cuò', french: 'Tout est de ma faute' },
      { id: 'tdc_37', speaker: 'Liu Jia Liang', hanzi: '请你原谅我', pinyin: 'Qǐng nǐ yuánliàng wǒ', french: 'S’il te plaît pardonne moi' },
      { id: 'tdc_38', speaker: 'Liu Jia Liang', hanzi: '为了你受再多的委屈都值得', pinyin: 'Wèile nǐ shòu zài duō de wěiqu dōu zhídé', french: 'Pour toi, affronter tous les chagrins en vaut la peine' },
      { id: 'tdc_39', speaker: 'Liu Jia Liang', hanzi: '本想给你我们的未来', pinyin: 'Běn xiǎng gěi nǐ wǒmen de wèilái', french: 'Je voulais bâtir notre avenir ensemble' },
      { id: 'tdc_40', speaker: 'Liu Jia Liang', hanzi: '可代价却是两地的分离', pinyin: 'Kě dàijià què shì liǎng dì de fēnlí', french: 'Mais le destin a imposé la distance entre nous' },
      { id: 'tdc_41', speaker: 'Liu Jia Liang', hanzi: '只能够用思念互相祝福', pinyin: 'Zhǐ nénggòu yòng sīniàn hùxiāng zhùfú', french: 'En ne pouvant que nous bénir par nos pensées' },
      { id: 'tdc_42', speaker: 'Liu Jia Liang', hanzi: '都是我的错', pinyin: 'Dōu shì wǒ de cuò', french: 'Tout est de ma faute' },
      { id: 'tdc_43', speaker: 'Liu Jia Liang', hanzi: '请你原谅我', pinyin: 'Qǐng nǐ yuánliàng wǒ', french: 'S’il te plaît pardonne moi' },
      { id: 'tdc_44', speaker: 'Liu Jia Liang', hanzi: '为了你我会更加珍惜自己', pinyin: 'Wèile nǐ wǒ huì gèngjiā zhēnxī zìjǐ', french: 'Pour toi, je prendrai encore plus soin de mon existence' },
      { id: 'tdc_45', speaker: 'Liu Jia Liang', hanzi: '只要我们的心还在一起', pinyin: 'Zhǐyào wǒmen de xīn hái zài yìqǐ', french: 'Tant que nos cœurs battent à l’unisson' },
      { id: 'tdc_46', speaker: 'Liu Jia Liang', hanzi: '岁月会有无数的奇迹', 'pinyin': 'Suìyuè huì yǒu wúshù de qíjì', french: 'Les jours à venir accompliront des miracles' },
      { id: 'tdc_47', speaker: 'Liu Jia Liang', hanzi: '我爱你', pinyin: 'Wǒ ài nǐ', french: 'Je t’aime' },
      { id: 'tdc_48', speaker: 'Liu Jia Liang', hanzi: '谢谢你', pinyin: 'Xièxie nǐ', french: 'Merci du fond du cœur' },
      { id: 'tdc_49', section: 'Refrain', speaker: 'Liu Jia Liang', hanzi: '都是我的错', pinyin: 'Dōu shì wǒ de cuò', french: 'Tout est de ma faute' },
      { id: 'tdc_50', speaker: 'Liu Jia Liang', hanzi: '请你原谅我', pinyin: 'Qǐng nǐ yuánliàng wǒ', french: 'S’il te plaît pardonne moi' },
      { id: 'tdc_51', speaker: 'Liu Jia Liang', hanzi: '为了你受再多的委屈都值得', pinyin: 'Wèile nǐ shòu zài duō de wěiqu dōu zhídé', french: 'Pour toi, chaque épreuve consentie en vaut la peine' },
      { id: 'tdc_52', speaker: 'Liu Jia Liang', hanzi: '本想给你我们的未来', pinyin: 'Běn xiǎng gěi nǐ wǒmen de wèilái', french: 'Je voulais t’offrir un avenir radieux' },
      { id: 'tdc_53', speaker: 'Liu Jia Liang', hanzi: '可代价却是两地的分离', pinyin: 'Kě dàijià què shì liǎng dì de fēnlí', french: 'Mais la distance est devenue notre fardeau' },
      { id: 'tdc_54', speaker: 'Liu Jia Liang', hanzi: '只能够用思念互相祝福', pinyin: 'Zhǐ nénggòu yòng sīniàn hùxiāng zhùfú', french: 'Et nos pensées restent notre seul réconfort' },
      { id: 'tdc_55', speaker: 'Liu Jia Liang', hanzi: '都是我的错', pinyin: 'Dōu shì wǒ de cuò', french: 'Tout est de ma faute' },
      { id: 'tdc_56', speaker: 'Liu Jia Liang', hanzi: '请你原谅我', pinyin: 'Qǐng nǐ yuánliàng wǒ', french: 'S’il te plaît pardonne moi' },
      { id: 'tdc_57', speaker: 'Liu Jia Liang', hanzi: '为了你我会更加珍惜自己', pinyin: 'Wèile nǐ wǒ huì gèngjiā zhēnxī zìjǐ', french: 'Pour toi, je veillerai précieusement sur moi' },
      { id: 'tdc_58', speaker: 'Liu Jia Liang', hanzi: '只要我们的心还在一起', pinyin: 'Zhǐyào wǒmen de xīn hái zài yìqǐ', french: 'Tant que nos âmes demeurent liées' },
      { id: 'tdc_59', speaker: 'Liu Jia Liang', hanzi: '岁月会有无数的惊喜', pinyin: 'Suìyuè huì yǒu wúshù de jīngxǐ', french: 'La vie nous réservera de magnifiques surprises' },
      { id: 'tdc_60', speaker: 'Liu Jia Liang', hanzi: '我爱你', pinyin: 'Wǒ ài nǐ', french: 'Je t’aime' },
      { id: 'tdc_61', speaker: 'Liu Jia Liang', hanzi: '谢谢你', pinyin: 'Xièxie nǐ', french: 'Merci du fond du cœur' },
    ],
  },
  {
    id: 'chanson_qianbainian',
    titleFr: 'Qui se souviendra de qui, mille ans plus tard',
    titleZh: '千百年后谁又记得谁',
    titlePinyin: 'Qiānbǎi nián hòu shéi yòu jìdé shéi',
    type: 'chansons',
    level: 'HSK 6',
    duration: '3 min 38',
    artist: 'Han Lei & Yao Beina',
    youtubeId: 'BtS8G2V73ek',
    description: 'Un duo majestueux et intemporel de Han Lei et Yao Beina, bande originale de la série historique L’Empereur Han Wu Di.',
    imageUrl: 'https://img.youtube.com/vi/BtS8G2V73ek/hqdefault.jpg',
    iconBg: 'from-[#D81B60] to-[#8E24AA]',
    sentences: [
      { id: 'qbn_1', section: 'Couplet 1', speaker: 'Han Lei', hanzi: '当时你给我一个笑脸', pinyin: 'Dāngshí nǐ gěi wǒ yí gè xiàoliǎn', french: 'En ce temps-là, ton sourire' },
      { id: 'qbn_2', speaker: 'Han Lei', hanzi: '让我心跳一辈子', pinyin: 'Ràng wǒ xīntiào yí bèizi', french: 'A fait battre mon cœur pour toute une vie' },
      { id: 'qbn_3', speaker: 'Yao Beina', hanzi: '使我的目光永远', pinyin: 'Shǐ wǒ de mùguāng yǒngyuǎn', french: 'A fait que mon regard s’est pour toujours' },
      { id: 'qbn_4', speaker: 'Yao Beina', hanzi: '融进了你的背影', pinyin: 'Róng jìn le nǐ de bèiyǐng', french: 'Fondu dans l’ombre de ta silhouette' },
      { id: 'qbn_5', speaker: 'Han Lei', hanzi: '岁月老去 我已不能爱', pinyin: 'Suìyuè lǎoqù, wǒ yǐ bù néng ài', french: 'Les années ont vieilli, je ne puis plus aimer' },
      { id: 'qbn_6', speaker: 'Han Lei', hanzi: '转过身往事突然清晰', pinyin: 'Zhuǎn guò shēn wǎngshì tūrán qīngxī', french: 'En me retournant, le passé redevient soudain limpide' },
      { id: 'qbn_7', speaker: 'Yao Beina', hanzi: '重复你的目光', pinyin: 'Chóngfù nǐ de mùguāng', french: 'En croisant à nouveau ton regard' },
      { id: 'qbn_8', speaker: 'Yao Beina', hanzi: '再也难串起我的记忆', pinyin: 'Zài yě nán chuàn qǐ wǒ de jìyì', french: 'Il est si difficile de renouer le fil de mes souvenirs' },
      { id: 'qbn_9', section: 'Refrain', speaker: 'Han Lei', hanzi: '夜深深 梦缠绵人沉醉', pinyin: 'Yè shēnshēn, mèng chánmián rén chénzuì', french: 'Dans la nuit profonde, les songes s’enlacent et l’âme s’enivre' },
      { id: 'qbn_10', speaker: 'Yao Beina', hanzi: '既然离别难免 今生何必相会', pinyin: 'Jìrán líbié nánmiǎn, jīnshēng hébì xiānghuì', french: 'Si l’adieu est inéluctable, pourquoi nous être rencontrés en cette vie ?' },
      { id: 'qbn_11', speaker: 'Han Lei & Yao Beina', hanzi: '今生何必相会', pinyin: 'Jīnshēng hébì xiānghuì', french: 'Pourquoi nous être croisés en cette vie ?' },
      { id: 'qbn_12', speaker: 'Han Lei', hanzi: '流星闪过 莫须伤悲', pinyin: 'Liúxīng shǎn guò, mò xū shāngbēi', french: 'L’étoile filante a traversé le ciel, nul besoin d’avoir du chagrin' },
      { id: 'qbn_13', speaker: 'Yao Beina', hanzi: '千百年之后 谁又还记得谁', pinyin: 'Qiānbǎi nián zhīhòu, shéi yòu hái jìdé shéi', french: 'Mille ans plus tard, qui se souviendra encore de qui ?' },
      { id: 'qbn_14', speaker: 'Han Lei & Yao Beina', hanzi: '谁又还记得 记得谁', pinyin: 'Shéi yòu hái jìdé, jìdé shéi', french: 'Qui se souviendra encore... de qui ?' },
      { id: 'qbn_15', section: 'Couplet 2', speaker: 'Han Lei', hanzi: '当时你给我一个笑脸', pinyin: 'Dāngshí nǐ gěi wǒ yí gè xiàoliǎn', french: 'En ce temps-là, ton sourire' },
      { id: 'qbn_16', speaker: 'Han Lei', hanzi: '让我心跳一辈子', pinyin: 'Ràng wǒ xīntiào yí bèizi', french: 'A fait battre mon cœur pour toute une vie' },
      { id: 'qbn_17', speaker: 'Yao Beina', hanzi: '使我的目光永远', pinyin: 'Shǐ wǒ de mùguāng yǒngyuǎn', french: 'A fait que mon regard s’est pour toujours' },
      { id: 'qbn_18', speaker: 'Yao Beina', hanzi: '融进了你的背影', pinyin: 'Róng jìn le nǐ de bèiyǐng', french: 'Fondu dans l’ombre de ta silhouette' },
      { id: 'qbn_19', speaker: 'Han Lei', hanzi: '岁月老去 我已不能爱', pinyin: 'Suìyuè lǎoqù, wǒ yǐ bù néng ài', french: 'Les années ont vieilli, je ne puis plus aimer' },
      { id: 'qbn_20', speaker: 'Han Lei', hanzi: '转过身往事突然清晰', pinyin: 'Zhuǎn guò shēn wǎngshì tūrán qīngxī', french: 'En me retournant, le passé redevient soudain si clair' },
      { id: 'qbn_21', speaker: 'Yao Beina', hanzi: '重复你的目光', pinyin: 'Chóngfù nǐ de mùguāng', french: 'En croisant à nouveau ton regard' },
      { id: 'qbn_22', speaker: 'Yao Beina', hanzi: '再也难串起我的记忆', pinyin: 'Zài yě nán chuàn qǐ wǒ de jìyì', french: 'Il est si dur de renouer la trame de mes souvenirs' },
      { id: 'qbn_23', section: 'Refrain', speaker: 'Han Lei', hanzi: '夜深深 梦缠绵人沉醉', pinyin: 'Yè shēnshēn, mèng chánmián rén chénzuì', french: 'Dans la nuit profonde, les songes s’enlacent et l’âme s’enivre' },
      { id: 'qbn_24', speaker: 'Yao Beina', hanzi: '既然离别难免 今生何必相会', pinyin: 'Jìrán líbié nánmiǎn, jīnshēng hébì xiānghuì', french: 'Si l’adieu est inévitable, pourquoi nous être rencontrés en cette vie ?' },
      { id: 'qbn_25', speaker: 'Han Lei & Yao Beina', hanzi: '今生何必相会', pinyin: 'Jīnshēng hébì xiānghuì', french: 'Pourquoi nous être croisés en cette vie ?' },
      { id: 'qbn_26', speaker: 'Han Lei', hanzi: '流星闪过 莫须伤悲', pinyin: 'Liúxīng shǎn guò, mò xū shāngbēi', french: 'L’étoile filante s’est évanouie, ne sois point triste' },
      { id: 'qbn_27', speaker: 'Yao Beina', hanzi: '千百年之后 谁又还记得谁', pinyin: 'Qiānbǎi nián zhīhòu, shéi yòu hái jìdé shéi', french: 'Mille ans plus tard, qui se souviendra encore de qui ?' },
      { id: 'qbn_28', speaker: 'Han Lei & Yao Beina', hanzi: '谁又还记得 记得谁', pinyin: 'Shéi yòu hái jìdé, jìdé shéi', french: 'Qui se souviendra encore... de qui ?' },
      { id: 'qbn_29', section: 'Refrain', speaker: 'Han Lei', hanzi: '夜深深 梦缠绵人沉醉', pinyin: 'Yè shēnshēn, mèng chánmián rén chénzuì', french: 'Dans la nuit profonde, les songes s’enlacent et l’âme s’enivre' },
      { id: 'qbn_30', speaker: 'Yao Beina', hanzi: '既然离别难免 今生何必相会', pinyin: 'Jìrán líbié nánmiǎn, jīnshēng hébì xiānghuì', french: 'Si la rupture est inéluctable, pourquoi nous être rencontrés en cette vie ?' },
      { id: 'qbn_31', speaker: 'Han Lei & Yao Beina', hanzi: '今生何必相会', pinyin: 'Jīnshēng hébì xiānghuì', french: 'Pourquoi nous être croisés en cette existence ?' },
      { id: 'qbn_32', speaker: 'Han Lei', hanzi: '流星闪过 莫须伤悲', pinyin: 'Liúxīng shǎn guò, mò xū shāngbēi', french: 'L’étoile filante a brillé un instant, ne garde nulle amertume' },
      { id: 'qbn_33', speaker: 'Yao Beina', hanzi: '千百年之后 谁又还记得谁', pinyin: 'Qiānbǎi nián zhīhòu, shéi yòu hái jìdé shéi', french: 'Mille ans après, qui gardera la mémoire de qui ?' },
      { id: 'qbn_34', speaker: 'Han Lei & Yao Beina', hanzi: '谁又还记得 记得谁', pinyin: 'Shéi yòu hái jìdé, jìdé shéi', french: 'Qui se souviendra encore... de qui ?' },
    ],
  },
  {
    id: 'chanson_renjian_yanhuo',
    titleFr: 'Les Lueurs de ce Monde',
    titleZh: '人间烟火',
    titlePinyin: 'Rénjiān Yānhuǒ',
    type: 'chansons',
    level: 'HSK 6',
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
      { id: 'ry_42', speaker: 'Cheng Xiang', hanzi: '竟似无人说', pinyin: 'Jìng sì wú rén shuō', french: 'Et nul ne saurait l’exprimer' },
      { id: 'ry_43', speaker: 'Cheng Xiang', hanzi: '可怜良辰无多', pinyin: 'Kělián liángchén wú duō', french: 'Tant de précieux instants perdus' },
      { id: 'ry_44', speaker: 'Cheng Xiang', hanzi: '再难与人说', pinyin: 'Zài nán yǔ rén shuō', french: 'Qu’il est désormais si difficile d’en parler à quiconque' },
    ],
  },
];

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function EcouteLectureContent() {
  const { showPinyin, showFrenchTranslation, audioSpeed, setAudioSpeed } = usePreferences();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  // Active Sub-Menu Filter: Strictly separated by type (Chansons, Articles, Histoires, Dialogues, Podcasts)
  const [activeCategory, setActiveCategory] = useState<ContentType>('chansons');
  
  // Selected reading item for full-screen immersive focus
  const [activeReading, setActiveReading] = useState<ReadingItem | null>(null);
  const [activeSeries, setActiveSeries] = useState<ReadingItem | null>(null);
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState(0);

  // Lecture dont la vidéo a été lancée : elle reste alors fixée en haut de
  // l'écran pendant qu'on fait défiler les paroles (mobile).
  const [videoLanceePour, setVideoLanceePour] = useState<string | null>(null);

  // Audio Playback State inside active reading
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const currentSentenceIndexState = useState(0);
  const currentSentenceIndex = currentSentenceIndexState[0];
  const setCurrentSentenceIndex = currentSentenceIndexState[1];
  const [playingSentenceId, setPlayingSentenceId] = useState<string | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Local display toggles
  const [localPinyinOverride, setLocalPinyinOverride] = useState<boolean | null>(null);
  const isPinyinVisible = localPinyinOverride !== null ? localPinyinOverride : showPinyin;

  const [localFrenchOverride, setLocalFrenchOverride] = useState<boolean | null>(null);
  const isFrenchVisible = localFrenchOverride !== null ? localFrenchOverride : showFrenchTranslation;

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
  const displayedYoutubeId = currentEpisode?.youtubeId || activeReading?.youtubeId;
  const displayedImageUrl = currentEpisode?.imageUrl || activeReading?.imageUrl || '';
  const displayedCharacters = currentEpisode?.characters || activeReading?.characters || [];
  const displayedVocabulary = currentEpisode?.vocabulary || activeReading?.vocabulary || [];

  // Avec une vidéo, le lecteur passe sur deux colonnes à partir de `lg` :
  // vidéo fixée à gauche, paroles à droite.
  const avecVideo = Boolean(displayedYoutubeId);
  const videoLancee = activeReading !== null && videoLanceePour === `${activeReading.id}_${activeEpisodeIndex}`;

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

  // Palier gratuit : les quotas par rubrique vivent dans `acces.ts`.
  const { etat: etatAbonnement, indetermine: accesIndetermine } = useAbonnement();
  // accesComplet et non estAbonne : un administrateur ouvre tout le
  // catalogue sans abonnement. Pour tout autre compte, les deux valeurs
  // sont identiques — aucun changement de comportement.
  const accesComplet = etatAbonnement.accesComplet;
  const [itemVerrouille, setItemVerrouille] = useState<ReadingItem | null>(null);

  /**
   * Un contenu est-il ouvert à cet apprenant ?
   * Le rang est calculé dans le catalogue trié par HSK croissant : les
   * contenus offerts sont donc toujours les plus accessibles de la rubrique.
   */
  const estAccessible = (item: ReadingItem): boolean => {
    const rang = readingCatalog
      .filter((r) => r.type === item.type)
      .sort((a, b) => {
        const na = parseInt(a.level.replace(/\D/g, '') || '99', 10);
        const nb = parseInt(b.level.replace(/\D/g, '') || '99', 10);
        return na - nb;
      })
      .findIndex((r) => r.id === item.id);
    return contenuAccessible(item.type, rang, accesComplet);
  };

  /** Libellé de rubrique pour l'écran « réservé aux abonnés ». */
  const rubriqueDe = (item: ReadingItem): string =>
    item.type === 'videos' ? 'vidéos' : item.type === 'podcasts' ? 'podcasts' : item.type;

  /**
   * Un lien profond (?type=&id=) ne doit pas ouvrir un contenu réservé : la
   * carte du catalogue est verrouillée, l'adresse doit l'être aussi.
   *
   * Le contrôle a lieu AU RENDU, comme dans Formation et Vocabulaire. Il
   * couvre ainsi toutes les façons d'arriver sur une lecture — lien partagé,
   * bouton Précédent du navigateur, restauration de session — là où le
   * contrôle au clic d'`openReading` n'en couvrait qu'une seule.
   *
   * Tant que l'abonnement n'est pas connu, on n'affiche ni le contenu ni le
   * mur : un abonné dont le profil charge encore ne doit pas voir clignoter
   * un écran « réservé ».
   */
  const lectureAutorisee = activeReading !== null && estAccessible(activeReading);
  const lectureEnAttente = activeReading !== null && !lectureAutorisee && accesIndetermine;
  const lectureRefusee = activeReading !== null && !lectureAutorisee && !accesIndetermine;

  // Unified Open / Close functions with URL persistence (F5 / Reload preserves the reading page)
  const openReading = (item: ReadingItem, episodeIdx = 0) => {
    // Point de passage unique : la carte du catalogue ET les liens profonds
    // (?type=&id=) passent par ici, le verrou couvre donc les deux.
    if (!estAccessible(item)) {
      setItemVerrouille(item);
      return;
    }

    setActiveReading(item);
    setActiveCategory(item.type);
    setActiveEpisodeIndex(episodeIdx);
    setCurrentSentenceIndex(0);
    setIsPlayingAll(false);

    // La vidéo est en haut de la page : on y remonte, sinon la lecture
    // s'ouvre au milieu des paroles, à la hauteur où on avait laissé la liste.
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('type', item.type);
      url.searchParams.set('id', item.id);
      if (episodeIdx > 0) {
        url.searchParams.set('ep', String(episodeIdx));
      } else {
        url.searchParams.delete('ep');
      }
      window.history.pushState({ readingId: item.id, episodeIdx }, '', url.toString());
      try {
        sessionStorage.setItem('chinoislingo_active_reading_id', item.id);
        sessionStorage.setItem('chinoislingo_active_ep_idx', String(episodeIdx));
      } catch {
        // ignore
      }
    }
  };

  const closeReading = () => {
    setIsPlayingAll(false);
    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setActiveReading(null);
    setActiveSeries(null);

    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('id');
      url.searchParams.delete('ep');
      url.searchParams.set('type', activeCategory);
      window.history.pushState({}, '', url.toString());
      try {
        sessionStorage.removeItem('chinoislingo_active_reading_id');
        sessionStorage.removeItem('chinoislingo_active_ep_idx');
      } catch {
        // ignore
      }
    }
  };

  const handleCategoryChange = (newCat: ContentType) => {
    setActiveCategory(newCat);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('type', newCat);
      if (!activeReading) {
        url.searchParams.delete('id');
        url.searchParams.delete('ep');
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  // Restore active reading from URL query params (Plan général avec Chansons par défaut si aucun ID dans l'URL)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const directId = urlParams.get('id') || searchParams.get('id');
    const directType = (urlParams.get('type') || searchParams.get('type')) as ContentType | null;
    const directEpParam = urlParams.get('ep') || searchParams.get('ep') || urlParams.get('episode') || searchParams.get('episode');

    if (directType && ['chansons', 'articles', 'histoires', 'dialogues', 'podcasts', 'videos'].includes(directType)) {
      setActiveCategory(directType);
    } else if (!directId) {
      setActiveCategory('chansons');
    }

    if (directId) {
      let matched = readingCatalog.find((item) => item.id === directId);
      let targetEp = 0;

      if (!matched) {
        // Fallback: chercher si directId correspond à un épisode d'une série
        for (const item of readingCatalog) {
          if (item.seriesEpisodes) {
            const epIdx = item.seriesEpisodes.findIndex((ep) => ep.id === directId);
            if (epIdx !== -1) {
              matched = item;
              targetEp = epIdx;
              break;
            }
          }
        }
      } else if (matched.seriesEpisodes && directEpParam) {
        const parsedNum = parseInt(directEpParam, 10);
        if (!isNaN(parsedNum) && parsedNum >= 0 && parsedNum < matched.seriesEpisodes.length) {
          targetEp = parsedNum;
        } else {
          const epIdx = matched.seriesEpisodes.findIndex((ep) => ep.id === directEpParam);
          if (epIdx !== -1) targetEp = epIdx;
        }
      }

      if (matched) {
        setActiveCategory(matched.type);
        setActiveReading(matched);
        setActiveEpisodeIndex(targetEp);
        setCurrentSentenceIndex(0);
        setIsPlayingAll(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setActiveReading(null);
      setActiveSeries(null);
    }
  }, [searchParams, setCurrentSentenceIndex]);

  // Handle browser Back / Forward buttons without reloading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      const type = params.get('type') as ContentType | null;
      const epParam = params.get('ep') || params.get('episode');

      if (type && ['chansons', 'videos', 'articles', 'dialogues', 'histoires', 'podcasts'].includes(type)) {
        setActiveCategory(type);
      }

      if (id) {
        let matched = readingCatalog.find((item) => item.id === id);
        let targetEp = 0;

        if (!matched) {
          for (const item of readingCatalog) {
            if (item.seriesEpisodes) {
              const epIdx = item.seriesEpisodes.findIndex((e) => e.id === id);
              if (epIdx !== -1) {
                matched = item;
                targetEp = epIdx;
                break;
              }
            }
          }
        } else if (matched.seriesEpisodes && epParam) {
          const parsedNum = parseInt(epParam, 10);
          if (!isNaN(parsedNum) && parsedNum >= 0 && parsedNum < matched.seriesEpisodes.length) {
            targetEp = parsedNum;
          } else {
            const epIdx = matched.seriesEpisodes.findIndex((e) => e.id === epParam);
            if (epIdx !== -1) targetEp = epIdx;
          }
        }

        if (matched) {
          setActiveReading(matched);
          setActiveEpisodeIndex(targetEp);
          setCurrentSentenceIndex(0);
          setIsPlayingAll(false);
        }
      } else {
        setActiveReading(null);
        setActiveSeries(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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

  // Audio Metadata for smooth continuous master track playback
  const [readingAudioMeta, setReadingAudioMeta] = useState<{
    contentId: string;
    fullAudioUrl: string;
    sentences: Array<{ sentenceId: string; startMs: number; endMs: number; audioUrl?: string }>;
  } | null>(null);

  // Fetch audio metadata whenever active reading or episode changes
  useEffect(() => {
    const primaryId = currentEpisode?.id || activeReading?.id;
    const fallbackId = activeReading?.id;
    if (!primaryId) {
      setReadingAudioMeta(null);
      return;
    }

    let isMounted = true;
    fetch(`/audio/readings/${primaryId}_meta.json`)
      .then((res) => {
        if (res.ok) return res.json();
        if (fallbackId && fallbackId !== primaryId) {
          return fetch(`/audio/readings/${fallbackId}_meta.json`).then((r) => (r.ok ? r.json() : null));
        }
        return null;
      })
      .then((data) => {
        if (isMounted) setReadingAudioMeta(data);
      })
      .catch(() => {
        if (isMounted) setReadingAudioMeta(null);
      });

    return () => {
      isMounted = false;
    };
  }, [currentEpisode?.id, activeReading?.id]);

  // Adjust active audio playback rate when user toggles speed
  useEffect(() => {
    if (activeAudioRef.current) {
      activeAudioRef.current.playbackRate = parseFloat(audioSpeed) || 1.0;
    }
  }, [audioSpeed]);

  // Play audio for a single sentence or vocabulary word (prefers ElevenLabs HD voice clip, fallbacks to Web Speech)
  const playSentenceAudio = (id: string, text: string) => {
    // If we're already playing the full continuous audio and clicked a line in displayed sentences, seek directly
    if (isPlayingAll && readingAudioMeta && activeAudioRef.current && !id.startsWith('voc_')) {
      const sentMeta = readingAudioMeta.sentences.find((s) => s.sentenceId === id);
      if (sentMeta) {
        activeAudioRef.current.currentTime = Math.max(0, sentMeta.startMs / 1000);
        activeAudioRef.current.play().catch(() => {});
        setPlayingSentenceId(id);
        const idx = displayedSentences.findIndex((s) => s.id === id);
        if (idx !== -1) setCurrentSentenceIndex(idx);
        return;
      }
    }

    // Stop continuous audio if playing when clicking an individual word or detached sentence
    if (isPlayingAll) {
      setIsPlayingAll(false);
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
      activeAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const primaryId = currentEpisode?.id || activeReading?.id;
    const fallbackId = activeReading?.id;
    const cleanWord = text.trim();

    // Priority list of pre-generated ElevenLabs v3 HD audio clips
    const candidateUrls: string[] = [];
    if (id.startsWith('voc_') || cleanWord.length <= 6) {
      candidateUrls.push(`/audio/vocab/${encodeURIComponent(cleanWord)}.mp3`);
      candidateUrls.push(`/audio/vocab/${cleanWord}.mp3`);
    }
    if (primaryId && !id.startsWith('voc_')) {
      candidateUrls.push(`/audio/readings/${primaryId}_${id}.mp3`);
    }
    if (fallbackId && fallbackId !== primaryId && !id.startsWith('voc_')) {
      candidateUrls.push(`/audio/readings/${fallbackId}_${id}.mp3`);
    }

    const playWithWebSpeech = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = parseFloat(audioSpeed) || 0.85;
        setPlayingSentenceId(id);
        utterance.onend = () => setPlayingSentenceId(null);
        utterance.onerror = () => setPlayingSentenceId(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setPlayingSentenceId(null);
      }
    };

    const tryPlayNextCandidate = (index: number) => {
      if (index >= candidateUrls.length) {
        // Fallback to bounded segment in master track if individual file is missing
        if (!id.startsWith('voc_') && readingAudioMeta && readingAudioMeta.fullAudioUrl) {
          const sentMeta = readingAudioMeta.sentences.find((s) => s.sentenceId === id);
          if (sentMeta) {
            const audio = new Audio(readingAudioMeta.fullAudioUrl);
            activeAudioRef.current = audio;
            audio.playbackRate = parseFloat(audioSpeed) || 1.0;
            audio.currentTime = Math.max(0, sentMeta.startMs / 1000);
            setPlayingSentenceId(id);
            const idx = displayedSentences.findIndex((s) => s.id === id);
            if (idx !== -1) setCurrentSentenceIndex(idx);

            const onTimeUpdate = () => {
              if (audio.currentTime * 1000 >= sentMeta.endMs) {
                audio.pause();
                audio.removeEventListener('timeupdate', onTimeUpdate);
                setPlayingSentenceId(null);
                if (activeAudioRef.current === audio) {
                  activeAudioRef.current = null;
                }
              }
            };

            const onEnded = () => {
              setPlayingSentenceId(null);
              if (activeAudioRef.current === audio) {
                activeAudioRef.current = null;
              }
            };

            audio.addEventListener('timeupdate', onTimeUpdate);
            audio.addEventListener('ended', onEnded);
            audio.play().catch(() => playWithWebSpeech());
            return;
          }
        }
        playWithWebSpeech();
        return;
      }

      const url = candidateUrls[index];
      const audio = new Audio(url);
      activeAudioRef.current = audio;
      audio.playbackRate = parseFloat(audioSpeed) || 1.0;
      setPlayingSentenceId(id);
      const idx = displayedSentences.findIndex((s) => s.id === id);
      if (idx !== -1) setCurrentSentenceIndex(idx);

      let isHandled = false;
      const advance = () => {
        if (isHandled) return;
        isHandled = true;
        tryPlayNextCandidate(index + 1);
      };

      audio.onended = () => {
        if (isHandled) return;
        isHandled = true;
        setPlayingSentenceId(null);
        if (activeAudioRef.current === audio) {
          activeAudioRef.current = null;
        }
      };

      audio.onerror = advance;

      audio.play().catch(() => {
        advance();
      });
    };

    if (candidateUrls.length > 0) {
      tryPlayNextCandidate(0);
    } else {
      playWithWebSpeech();
    }
  };

  // Play continuous full audio with seamless line synchronization (0 hitch, 0 stutter, pure continuity)
  useEffect(() => {
    if (!isPlayingAll) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        activeAudioRef.current = null;
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingSentenceId(null);
      return;
    }

    if (displayedSentences.length === 0) return;

    // Master continuous track playback with ElevenLabs HD audio
    if (readingAudioMeta && readingAudioMeta.fullAudioUrl && readingAudioMeta.sentences.length > 0) {
      const audio = new Audio(readingAudioMeta.fullAudioUrl);
      activeAudioRef.current = audio;
      audio.playbackRate = parseFloat(audioSpeed) || 1.0;

      // Start from current sentence position if clicked in the middle
      const initialSentence = displayedSentences[currentSentenceIndex];
      const initialMeta = initialSentence
        ? readingAudioMeta.sentences.find((s) => s.sentenceId === initialSentence.id)
        : null;
      if (initialMeta && initialMeta.startMs > 0) {
        audio.currentTime = initialMeta.startMs / 1000;
        setPlayingSentenceId(initialMeta.sentenceId);
      } else if (readingAudioMeta.sentences[0]) {
        setPlayingSentenceId(readingAudioMeta.sentences[0].sentenceId);
      }

      const onTimeUpdate = () => {
        const currentMs = audio.currentTime * 1000;
        let matched: typeof readingAudioMeta.sentences[0] | null = null;
        for (let i = 0; i < readingAudioMeta.sentences.length; i++) {
          const s = readingAudioMeta.sentences[i];
          if (currentMs >= s.startMs) {
            matched = s;
          }
        }
        if (matched) {
          setPlayingSentenceId(matched.sentenceId);
          const idx = displayedSentences.findIndex((s) => s.id === matched.sentenceId);
          if (idx !== -1 && idx !== currentSentenceIndex) {
            setCurrentSentenceIndex(idx);
          }
        }
      };

      const onEnded = () => {
        setIsPlayingAll(false);
        setPlayingSentenceId(null);
        setCurrentSentenceIndex(0);
        activeAudioRef.current = null;
      };

      const onError = () => {
        // Fallback to Web Speech sequence if continuous master file fails
        playSequenceWebSpeech(0);
      };

      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);

      audio.play().catch(() => {
        onError();
      });

      return () => {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        audio.pause();
        if (activeAudioRef.current === audio) {
          activeAudioRef.current = null;
        }
      };
    }

    // Fallback: Web Speech sequential synthesis if no ElevenLabs master track
    let cancelSpeech = false;
    function playSequenceWebSpeech(index: number) {
      if (cancelSpeech || index >= displayedSentences.length) {
        setIsPlayingAll(false);
        setPlayingSentenceId(null);
        setCurrentSentenceIndex(0);
        return;
      }

      const sent = displayedSentences[index];
      if (!sent) return;

      setCurrentSentenceIndex(index);
      setPlayingSentenceId(sent.id);

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(sent.hanzi);
        utterance.lang = 'zh-CN';
        utterance.rate = parseFloat(audioSpeed) || 0.85;
        utterance.onend = () => {
          if (!cancelSpeech) {
            setTimeout(() => playSequenceWebSpeech(index + 1), 100);
          }
        };
        utterance.onerror = () => {
          setIsPlayingAll(false);
          setPlayingSentenceId(null);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setIsPlayingAll(false);
        setPlayingSentenceId(null);
      }
    }

    playSequenceWebSpeech(currentSentenceIndex);

    return () => {
      cancelSpeech = true;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlayingAll, readingAudioMeta, displayedSentences, audioSpeed, setCurrentSentenceIndex]);

  // Auto-scroll synchronized with audio reading sequence
  useEffect(() => {
    if (isPlayingAll && typeof document !== 'undefined') {
      const sentence = displayedSentences[currentSentenceIndex];
      if (sentence) {
        const el = document.getElementById(`sentence-${sentence.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [isPlayingAll, currentSentenceIndex, displayedSentences]);

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
      {lectureEnAttente ? (
        <div className="py-16 text-center text-xs text-[#757575] dark:text-[#A0A0A0] animate-fadeIn">
          Vérification de votre accès…
        </div>
      ) : lectureRefusee && activeReading ? (
        <div className="py-8 animate-fadeIn">
          <EcranPremium titre={activeReading.titleFr} rubrique={rubriqueDe(activeReading)} />
          <div className="flex justify-center mt-5">
            <button
              onClick={closeReading}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#E0E0E0] dark:border-[#333333] text-xs font-bold text-[#212121] dark:text-[#F5F5F5] hover:bg-[#FAFAFA] dark:hover:bg-white/5 transition-all btn-press cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au catalogue
            </button>
          </div>
        </div>
      ) : activeReading && lectureAutorisee ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Bar: Back Button, Multi-line Title (L1: French, L2: Hanzi, L3: Pinyin), Audio Action Buttons at Top Right */}
          <div className={`flex items-start justify-between gap-3 p-3.5 sm:p-5 ${avecVideo ? 'lg:py-3' : ''} rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-sm`}>
            <div className="flex items-start gap-2.5 sm:gap-3.5 min-w-0 flex-1">
              <button
                onClick={closeReading}
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center hover:bg-[#00897B] hover:text-white transition-colors btn-press shrink-0 shadow-2xs cursor-pointer mt-0.5"
                title="Retour au catalogue Écoute & Lecture"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-1">
                {/* Ligne 1 : Titre complet en français (H1) */}
                <h1 className="font-display font-black text-sm sm:text-lg lg:text-xl text-[#212121] dark:text-[#F5F5F5] tracking-tight leading-snug">
                  {displayedTitleFr}
                </h1>

                {/* Ligne 2 : Titre en Caractères Chinois (Hanzi) */}
                {displayedTitleZh && (
                  <div className="font-hanzi text-sm sm:text-base font-bold text-[#00796B] dark:text-[#03DAC5] leading-snug">
                    {displayedTitleZh}
                  </div>
                )}

                {/* Ligne 3 : Transcription Phonétique (Pinyin) (obéit au bouton Pinyin) */}
                {isPinyinVisible && displayedTitlePinyin && (
                  <div className="font-pinyin text-xs sm:text-sm font-semibold text-[#00796B] dark:text-[#03DAC5] leading-snug">
                    {displayedTitlePinyin}
                  </div>
                )}

                {activeReading.artist && (
                  <p className="text-[10px] sm:text-xs font-semibold text-[#757575] dark:text-[#A0A0A0] pt-0.5">
                    Artiste : <span className="font-bold text-[#00796B] dark:text-[#03DAC5]">{activeReading.artist}</span>
                  </p>
                )}

                {activeReading.author && (
                  <p className="text-[10px] sm:text-xs font-semibold text-[#757575] dark:text-[#A0A0A0] pt-0.5">
                    Par <span className="font-bold text-[#6200EE] dark:text-[#BB86FC]">{activeReading.author}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Quick Action Toggles: Compact Icon-only Buttons on Mobile, Text on Desktop */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pt-0.5">
              {/* Bouton Pinyin : Icône seule sur mobile, Icône + Texte sur PC */}
              <button
                onClick={() => setLocalPinyinOverride(!isPinyinVisible)}
                type="button"
                className={`inline-flex items-center justify-center gap-1 w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-full border text-[10px] sm:text-[11px] font-bold transition-all btn-press shadow-2xs cursor-pointer shrink-0 ${
                  isPinyinVisible
                    ? 'bg-[#00897B] text-white border-[#00897B]'
                    : 'bg-[#FAFAFA] dark:bg-[#1E1E1E] text-[#757575] border-[#E0E0E0] dark:border-[#2D2D2D]'
                }`}
                title={isPinyinVisible ? 'Masquer le pinyin' : 'Afficher le pinyin'}
                aria-label={isPinyinVisible ? 'Masquer le pinyin' : 'Afficher le pinyin'}
              >
                {isPinyinVisible ? <Eye className="w-3.5 h-3.5 sm:w-3 sm:h-3 pointer-events-none" /> : <EyeOff className="w-3.5 h-3.5 sm:w-3 sm:h-3 pointer-events-none" />}
                <span className="hidden sm:inline">Pinyin</span>
              </button>

              {/* Bouton Traduction : Icône seule sur mobile, Icône + Texte sur PC */}
              <button
                onClick={() => setLocalFrenchOverride(!isFrenchVisible)}
                type="button"
                className={`inline-flex items-center justify-center gap-1 w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-full border text-[10px] sm:text-[11px] font-bold transition-all btn-press shadow-2xs cursor-pointer shrink-0 ${
                  isFrenchVisible
                    ? 'bg-[#6200EE] text-white border-[#6200EE]'
                    : 'bg-[#FAFAFA] dark:bg-[#1E1E1E] text-[#757575] border-[#E0E0E0] dark:border-[#2D2D2D]'
                }`}
                title={isFrenchVisible ? 'Masquer la traduction française' : 'Afficher la traduction française'}
                aria-label={isFrenchVisible ? 'Masquer la traduction française' : 'Afficher la traduction française'}
              >
                <Languages className="w-3.5 h-3.5 sm:w-3 sm:h-3 pointer-events-none" />
                <span className="hidden sm:inline">Traduction</span>
              </button>
            </div>
          </div>

          {/*
            Lecteur vidéo 100 % ChinoisLingo, visible pendant toute la lecture
            des paroles : fixé en haut de l'écran sur mobile dès qu'il est
            lancé, fixé dans la colonne de gauche sur ordinateur. Sur mobile,
            son parent est la page de lecture entière : un élément `sticky` ne
            reste accroché qu'à l'intérieur de son parent.
          */}
          {displayedYoutubeId && (
            <div
              className={`z-30 ${
                videoLancee
                  ? 'sticky top-0 py-2 lg:py-3 bg-white/80 dark:bg-[#121212]/85 backdrop-blur-xl'
                  : ''
              }`}
            >
              {/*
                Bandeau pleine largeur, flouté : le texte qui défile derrière
                la vidéo devient illisible plutôt que distrayant.
              */}
              <div className="mx-auto w-full lg:max-w-[85vh]">
                <ChinoisLingoVideoPlayer
                  key={`${displayedYoutubeId}_${activeEpisodeIndex}`}
                  youtubeId={displayedYoutubeId}
                  title={`${displayedTitleFr} - ${displayedTitleZh}`}
                  thumbnailUrl={displayedImageUrl}
                  onStart={() => setVideoLanceePour(`${activeReading.id}_${activeEpisodeIndex}`)}
                />
              </div>
            </div>
          )}

          {/* SÉLECTEUR RAPIDE D'ÉPISODES DANS LE LECTEUR (POUR LES SÉRIES) */}
          {activeReading.seriesEpisodes && activeReading.seriesEpisodes.length > 1 && (
            <div className="w-full p-2.5 sm:p-3.5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 touch-pan-x">
                <span className="text-[11px] sm:text-xs font-bold text-[#757575] dark:text-[#A0A0A0] shrink-0 mr-1 flex items-center gap-1">
                  {activeReading.type === 'videos' ? (
                    <>
                      <Video className="w-3.5 h-3.5 text-[#6200EE] dark:text-[#BB86FC]" />
                      <span>Épisodes :</span>
                    </>
                  ) : activeReading.type === 'histoires' ? (
                    <>
                      <BookOpen className="w-3.5 h-3.5 text-[#6200EE] dark:text-[#BB86FC]" />
                      <span>Épisodes :</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5 text-[#6200EE] dark:text-[#BB86FC]" />
                      <span>Articles :</span>
                    </>
                  )}
                </span>
                {activeReading.seriesEpisodes.map((ep, eIdx) => {
                  const isCurrent = activeEpisodeIndex === eIdx;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={(e) => {
                        e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                        if (activeAudioRef.current) {
                          activeAudioRef.current.pause();
                          activeAudioRef.current = null;
                        }
                        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                        }
                        setActiveEpisodeIndex(eIdx);
                        setCurrentSentenceIndex(0);
                        setIsPlayingAll(false);
                        if (typeof window !== 'undefined') {
                          const url = new URL(window.location.href);
                          url.searchParams.set('ep', String(eIdx));
                          window.history.pushState({ readingId: activeReading.id, episodeIdx: eIdx }, '', url.toString());
                          try {
                            sessionStorage.setItem('chinoislingo_active_ep_idx', String(eIdx));
                          } catch {
                            // ignore
                          }
                        }
                      }}
                      className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all shrink-0 btn-press cursor-pointer flex items-center gap-1.5 active:scale-95 ${
                        isCurrent
                          ? 'bg-[#6200EE] text-white shadow-md ring-2 ring-[#6200EE]/30'
                          : 'bg-black/5 dark:bg-white/5 text-[#757575] dark:text-[#A0A0A0] hover:bg-[#6200EE]/10 hover:text-[#6200EE] dark:hover:text-[#BB86FC]'
                      }`}
                    >
                      <span>{activeReading.type === 'videos' || activeReading.type === 'histoires' ? `Épisode ${ep.episodeNumber}` : `Article ${ep.episodeNumber}`}</span>
                      <span className="opacity-80 font-normal truncate max-w-[130px] sm:max-w-[190px]">• {ep.titleFr}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Continuous Description & Timer Banner (Couleur principale violette ChinoisLingo) */}
          <div className={`w-full p-4 sm:p-5 ${avecVideo ? 'lg:hidden' : ''} rounded-2xl bg-[#6200EE]/5 dark:bg-[#6200EE]/10 border border-[#6200EE]/20 flex items-center justify-between text-xs sm:text-sm text-[#757575] dark:text-[#A0A0A0] shadow-xs`}>
            <p className="flex-1 mr-4 leading-relaxed font-medium">
              {activeReading.type === 'chansons' ? '🎶' : activeReading.type === 'videos' ? '🎬' : '📖'} {displayedDescription}
            </p>
            <div className="flex items-center gap-1.5 font-bold text-[#6200EE] dark:text-[#BB86FC] shrink-0 bg-[#6200EE]/10 dark:bg-[#6200EE]/20 px-3 py-1.5 rounded-full border border-[#6200EE]/25">
              <Clock className="w-4 h-4 text-[#6200EE] dark:text-[#BB86FC]" />
              <span>{displayedDuration}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION LES PERSONNAGES (CADRAGE CONTEXTUEL AVANT TRANSCRIPTION)          */}
          {/* ========================================================================= */}
          {displayedCharacters && displayedCharacters.length > 0 && (
            <div className="nixtio-card p-5 sm:p-6 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D] pb-3">
                <h3 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[#6200EE] dark:text-[#BB86FC] flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {activeReading.type === 'videos' 
                      ? 'Les Personnages de la Série' 
                      : activeReading.type === 'histoires' 
                      ? 'Les Personnages de l’Histoire' 
                      : 'Les Personnages du Dialogue'}
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {displayedCharacters.map((char, cIdx) => {
                  const isViolet = char.color === 'violet';
                  const isTurquoise = char.color === 'turquoise';
                  const isAmber = char.color === 'amber';
                  const isPink = char.color === 'pink';

                  return (
                    <div
                      key={cIdx}
                      className={`p-4 rounded-2xl border transition-all ${
                        isViolet
                          ? 'bg-[#6200EE]/[0.03] dark:bg-[#6200EE]/10 border-[#6200EE]/20 hover:border-[#6200EE]/40'
                          : isTurquoise
                          ? 'bg-[#00897B]/[0.03] dark:bg-[#00897B]/10 border-[#00897B]/20 hover:border-[#00897B]/40'
                          : isAmber
                          ? 'bg-[#FFA000]/[0.05] dark:bg-[#FFA000]/10 border-[#FFA000]/25 hover:border-[#FFA000]/45'
                          : isPink
                          ? 'bg-[#E91E63]/[0.04] dark:bg-[#E91E63]/10 border-[#E91E63]/25 hover:border-[#E91E63]/45'
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
                                : isAmber
                                ? 'bg-[#F57C00] text-white'
                                : isPink
                                ? 'bg-[#E91E63] text-white'
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
                              : isAmber
                              ? 'bg-[#FFA000]/15 text-[#E65100] dark:text-[#FFB74D] border border-[#FFA000]/30'
                              : isPink
                              ? 'bg-[#E91E63]/15 text-[#E91E63] dark:text-[#F48FB1] border border-[#E91E63]/30'
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
          <div className="nixtio-card p-5 sm:p-8 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-sm">
            {/* Header: Title + Transparent Interactive Audio Controller with Speed Control */}
            <div className="pb-4 mb-2 border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-[#00796B] dark:text-[#03DAC5] flex items-center gap-2">
                {activeReading.type === 'chansons' ? <Music className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                <span>{activeReading.type === 'chansons' ? 'Paroles & Traduction (Lyrics)' : 'Texte & Transcription Synchronisée'}</span>
              </h3>

              {/* Single Transparent Audio Controller */}
              <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                {/* Speed Toggle (0.75x / 1.0x / 1.25x) */}
                <div className="inline-flex items-center p-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.08] text-[10.5px] font-bold">
                  {(['0.75', '1.0', '1.25'] as const).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setAudioSpeed(speed)}
                      type="button"
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        audioSpeed === speed
                          ? 'bg-[#00897B] text-white shadow-2xs'
                          : 'text-[#757575] hover:text-[#212121] dark:hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                {/* Main Play / Pause Audio Button */}
                <button
                  onClick={() => {
                    if (isPlayingAll) {
                      setIsPlayingAll(false);
                      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                      }
                      setPlayingSentenceId(null);
                    } else {
                      setIsPlayingAll(true);
                    }
                  }}
                  type="button"
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs btn-press cursor-pointer ${
                    isPlayingAll
                      ? 'bg-[#E53935] text-white animate-pulse shadow-[#E53935]/30'
                      : 'bg-[#00897B] hover:bg-[#00796B] text-white shadow-[#00897B]/25'
                  }`}
                >
                  {isPlayingAll ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-white" />
                      <span>Pause Audio</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Écouter l’Audio</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/*
              Avec une vidéo, les paroles tiennent dans un cadre de quelques
              lignes qui défile tout seul : l'image garde le haut de l'écran.
            */}
            <div className="divide-y divide-[#E0E0E0]/60 dark:divide-[#2D2D2D]/80">
            {displayedSentences.map((sent, idx) => {
              const isSentencePlaying = playingSentenceId === sent.id;
              const isCurrentInSequence = isPlayingAll && currentSentenceIndex === idx;
              const isSaved = savedSentenceIds.has(sent.id);
              const isHighlighted = isSentencePlaying || isCurrentInSequence;

              // Character color coding
              const isViolet = sent.speakerColor === 'violet';
              const isTurquoise = sent.speakerColor === 'turquoise';
              const isAmber = sent.speakerColor === 'amber';
              const isPink = sent.speakerColor === 'pink';

              return (
                <div
                  key={sent.id}
                  id={`sentence-${sent.id}`}
                  onClick={() => {
                    setCurrentSentenceIndex(idx);
                    playSentenceAudio(sent.id, sent.hanzi);
                  }}
                  className={`py-3 sm:py-4 ${avecVideo ? 'lg:py-1.5' : ''} px-2.5 sm:px-4 rounded-2xl transition-all duration-200 cursor-pointer group ${
                    isHighlighted
                      ? 'bg-[#6200EE]/10 dark:bg-[#6200EE]/20 border border-[#6200EE]/30 shadow-xs -mx-1 sm:-mx-2'
                      : 'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex flex-col gap-1 w-full">
                    {/* Section Marker (Couplet / Pré-refrain / Refrain / Outro) for Songs */}
                    {activeReading.type === 'chansons' && sent.section && (
                      <div className="flex items-center gap-2 mb-1.5 mt-0.5">
                        {sent.section.toLowerCase().includes('pré-refrain') || sent.section.toLowerCase().includes('pre-refrain') ? (
                          <>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9800]/15 dark:bg-[#FF9800]/25 text-[#E65100] dark:text-[#FFB74D] text-[11px] font-black uppercase tracking-wider border border-[#FF9800]/30 shadow-2xs">
                              🎵 {sent.section}
                            </span>
                            <div className="flex-1 h-px bg-gradient-to-r from-[#FF9800]/40 via-[#FF9800]/15 to-transparent" />
                          </>
                        ) : sent.section.toLowerCase().includes('refrain') ? (
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
                    {sent.speaker && (
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-black ${
                          isViolet
                            ? 'text-[#6200EE] dark:text-[#BB86FC]'
                            : isTurquoise
                            ? 'text-[#00796B] dark:text-[#03DAC5]'
                            : isAmber
                            ? 'text-[#E65100] dark:text-[#FFB74D]'
                            : isPink
                            ? 'text-[#E91E63] dark:text-[#F48FB1]'
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
                              : isAmber
                              ? 'bg-[#FFA000]/10 dark:bg-[#FFA000]/20 text-[#E65100] dark:text-[#FFB74D] border border-[#FFA000]/25'
                              : isPink
                              ? 'bg-[#E91E63]/10 dark:bg-[#E91E63]/20 text-[#E91E63] dark:text-[#F48FB1] border border-[#E91E63]/20'
                              : 'bg-black/5 dark:bg-white/5 text-[#757575] dark:text-[#9E9E9E] border border-black/10 dark:border-white/10'
                          }`}>
                            {sent.speakerRole}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Hanzi Text - 100% Full Width (No Constraint on Top) */}
                    <div
                      lang="zh-Hans"
                      translate="no"
                      className={`font-hanzi notranslate font-black text-lg sm:text-2xl ${avecVideo ? 'lg:text-lg' : ''} text-[#212121] dark:text-[#F5F5F5] leading-snug w-full`}
                    >
                      {sent.hanzi}
                    </div>

                    {/* Pinyin with Tone Coloring - 100% Full Width */}
                    {isPinyinVisible && (
                      <div className={`font-pinyin font-bold text-xs sm:text-base ${avecVideo ? 'lg:text-sm' : ''} text-[#00796B] dark:text-[#03DAC5] tracking-wide leading-snug pt-0.5 w-full`}>
                        {sent.pinyin}
                      </div>
                    )}

                    {/* French Translation on Left & Bookmark in Bottom-Right Corner */}
                    <div className="flex items-center justify-between gap-2 pt-1 w-full min-w-0">
                      {isFrenchVisible ? (
                        <div className={`text-xs sm:text-sm ${avecVideo ? 'lg:text-xs' : ''} font-medium text-[#757575] dark:text-[#B0B0B0] leading-snug flex-1 min-w-0`}>
                          {sent.french}
                        </div>
                      ) : (
                        <div className="flex-1" />
                      )}

                      {/* Bookmark Action - Placed in the Bottom-Right Corner (Super Compact & Discreet) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveSentence(sent.id);
                        }}
                        type="button"
                        className={`w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-lg flex items-center justify-center transition-all btn-press cursor-pointer shrink-0 ${
                          isSaved
                            ? 'bg-[#00897B] text-white shadow-2xs'
                            : 'bg-black/[0.04] dark:bg-white/[0.06] text-[#9E9E9E] hover:text-[#212121] dark:hover:text-white'
                        }`}
                        title={isSaved ? 'Enregistré dans vos favoris' : 'Enregistrer ce vers'}
                      >
                        {isSaved ? <Check className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>

            {displayedSentences.length === 0 && (
              <p className="py-6 text-center text-xs text-[#757575] dark:text-[#A0A0A0]">
                Les paroles de ce contenu arrivent très bientôt.
              </p>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION 📝 生词 — NOUVEAUX MOTS & VOCABULAIRE CLÉ (EN BAS DE L'HISTOIRE) */}
          {/* ========================================================================= */}
          {displayedVocabulary && displayedVocabulary.length > 0 && (
            <div className="nixtio-card p-5 sm:p-7 bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E0E0E0]/60 dark:border-[#2D2D2D] pb-3">
                <h3 className="font-display font-black text-xs sm:text-sm uppercase tracking-wider text-[#00897B] dark:text-[#03DAC5] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span>📝 生词 — Nouveaux Mots & Vocabulaire Clé</span>
                </h3>
                <span className="text-[11px] font-bold text-[#757575] dark:text-[#A0A0A0] bg-black/5 dark:bg-white/5 px-2.5 py-0.5 rounded-full">
                  {displayedVocabulary.length} mots clés
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayedVocabulary.map((vocab, vIdx) => (
                  <div
                    key={vIdx}
                    className="p-3.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0]/70 dark:border-[#333333] flex flex-col justify-between gap-2 group hover:border-[#00897B] transition-all shadow-2xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            lang="zh-Hans"
                            translate="no"
                            className="font-hanzi notranslate font-black text-lg text-[#212121] dark:text-[#F5F5F5]"
                          >
                            {vocab.hanzi}
                          </span>
                          <button
                            type="button"
                            onClick={() => playSentenceAudio(`voc_${vIdx}`, vocab.hanzi)}
                            className="w-6 h-6 rounded-full bg-[#00897B]/10 hover:bg-[#00897B] text-[#00796B] hover:text-white flex items-center justify-center transition-colors btn-press cursor-pointer"
                            title="Écouter la prononciation"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-pinyin font-bold text-xs text-[#00897B] dark:text-[#03DAC5]">
                          {vocab.pinyin}
                        </span>
                      </div>

                      {vocab.role && (
                        <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-[#6200EE]/10 dark:bg-[#6200EE]/20 text-[#6200EE] dark:text-[#BB86FC] border border-[#6200EE]/20 shrink-0">
                          {vocab.role}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-[#757575] dark:text-[#CCCCCC] leading-snug">
                      {vocab.french}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

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
          {/* Top Series Header - Épuré 100% en Français */}
          <div className="flex items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] shadow-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => setActiveSeries(null)}
                type="button"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FAFAFA] dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#212121] dark:text-[#F5F5F5] flex items-center justify-center hover:bg-[#6200EE] hover:text-white transition-colors btn-press shrink-0 shadow-2xs cursor-pointer"
                title="Retour au catalogue général"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="min-w-0 flex-1 space-y-0.5">
                {/* Titre complet en français */}
                <h1 className="font-display font-black text-sm sm:text-lg text-[#212121] dark:text-[#F5F5F5] tracking-tight truncate leading-snug">
                  {activeSeries.titleFr}
                </h1>

                {/* Sous-titre indicatif */}
                <p className="text-[11px] sm:text-xs text-[#757575] dark:text-[#A0A0A0] truncate">
                  {activeSeries.type === 'videos' 
                    ? 'Sélectionnez un épisode pour commencer à regarder' 
                    : activeSeries.type === 'histoires'
                    ? 'Sélectionnez un épisode pour commencer votre histoire'
                    : 'Sélectionnez un article pour commencer votre lecture'}
                </p>
              </div>
            </div>
          </div>

          {/* Grille des Cadres d'Épisodes / Articles (Adaptative 1 à 4 colonnes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeSeries.seriesEpisodes?.map((ep, eIdx) => {
              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    openReading(activeSeries, eIdx);
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
                    <span className={`absolute top-2.5 right-2.5 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${getLevelBadgeStyle(ep.level || activeSeries.level)}`}>
                      {ep.level || activeSeries.level}
                    </span>
                  </div>

                  {/* Moitié Inférieure du Cadre (Titre Fr, Description Fr, Durée, Bouton) */}
                  <div className="p-3.5 sm:p-4 h-1/2 flex flex-col justify-between min-w-0">
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-display font-black text-xs sm:text-[13.5px] text-[#212121] dark:text-[#F5F5F5] group-hover:text-[#6200EE] dark:group-hover:text-[#BB86FC] transition-colors leading-snug line-clamp-2">
                        {ep.titleFr}
                      </h3>
                      <p className="text-[10.5px] sm:text-[11px] text-[#757575] dark:text-[#A0A0A0] line-clamp-2 leading-relaxed font-medium">
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
                        {activeSeries.type === 'videos' ? (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Regarder</span>
                          </>
                        ) : (
                          <>
                            <BookOpen className="w-3 h-3" />
                            <span>Lire</span>
                          </>
                        )}
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

          {/* 6 SUB-MENUS (Chansons, Articles, Histoires, Dialogues, Podcasts, Vidéos) - FLUIDE & RESPONSIVE MOBILE */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-[#FAFAFA] dark:bg-[#1E1E1E] border border-[#E0E0E0] dark:border-[#2D2D2D] overflow-x-auto no-scrollbar scroll-smooth w-full">
            {[
              { id: 'chansons', label: 'Chansons', icon: Music, count: readingCatalog.filter(r => r.type === 'chansons').length },
              { id: 'articles', label: 'Articles', icon: Newspaper, count: readingCatalog.filter(r => r.type === 'articles').length },
              { id: 'histoires', label: 'Histoires', icon: BookMarked, count: readingCatalog.filter(r => r.type === 'histoires').length },
              { id: 'dialogues', label: 'Dialogues', icon: MessagesSquare, count: readingCatalog.filter(r => r.type === 'dialogues').length },
              { id: 'podcasts', label: 'Podcasts', icon: Radio, count: readingCatalog.filter(r => r.type === 'podcasts').length },
              { id: 'videos', label: 'Vidéos', icon: Video, count: readingCatalog.filter(r => r.type === 'videos').length },
            ].map((sub) => {
              const Icon = sub.icon;
              const isActive = activeCategory === sub.id;

              return (
                <button
                  key={sub.id}
                  onClick={(e) => {
                    handleCategoryChange(sub.id as ContentType);
                    // Auto-align clicked tab to start of horizontal scroll
                    e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
                  }}
                  type="button"
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-all btn-press cursor-pointer ${
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
                const verrouille = !estAccessible(item);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      // Une série verrouillée ne doit pas non plus s'ouvrir :
                      // setActiveSeries court-circuiterait openReading.
                      if (verrouille) {
                        setItemVerrouille(item);
                      } else if (hasSeriesEpisodes) {
                        setActiveSeries(item);
                      } else {
                        openReading(item);
                      }
                    }}
                    className={`nixtio-card flex flex-col bg-white dark:bg-[#1E1E1E] border transition-all duration-300 group cursor-pointer shadow-xs hover:shadow-xl rounded-3xl overflow-hidden aspect-square ${
                      verrouille
                        ? 'border-[#E0E0E0] dark:border-[#2D2D2D] hover:border-[#6200EE]/50'
                        : isCompleted 
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
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                          verrouille ? 'grayscale-[0.7] opacity-70' : ''
                        }`}
                        loading="lazy"
                      />

                      {/* Contenu réservé aux abonnés : la carte reste visible,
                          elle sert de vitrine. */}
                      {verrouille && <BadgeVerrou className="absolute top-2.5 left-2.5 z-10" />}
                      
                      {/* Subtle gradient overlay on bottom of image for sleek depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                      {/* Floating HSK Level Badge on Top-Right (Masqué pour les séries car elles regroupent plusieurs niveaux d'apprentissage) */}
                      {!hasSeriesEpisodes && (
                        <span className={`absolute top-2.5 right-2.5 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md ${getLevelBadgeStyle(item.level)}`}>
                          {item.level}
                        </span>
                      )}

                      {/* Unified Badge on Bottom-Left */}
                      {hasSeriesEpisodes ? (
                        <span className="absolute bottom-2.5 left-2.5 text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white border border-white/15 flex items-center gap-1.5 shadow-sm">
                          <span className="text-[#03DAC5] font-black">
                            {item.type === 'videos' ? 'Série de vidéos' : item.type === 'histoires' ? 'Série d’histoires' : 'Série d’articles'}
                          </span>
                          <span className="text-white/40">•</span>
                          <span>
                            {item.type === 'videos' || item.type === 'histoires'
                              ? `${item.seriesEpisodes?.length || 0} ${item.seriesEpisodes?.length && item.seriesEpisodes.length > 1 ? 'épisodes' : 'épisode'}` 
                              : `${item.seriesEpisodes?.length || 0} ${item.seriesEpisodes?.length && item.seriesEpisodes.length > 1 ? 'articles' : 'article'}`}
                          </span>
                        </span>
                      ) : item.type === 'videos' ? (
                        <span className="absolute bottom-2.5 left-2.5 text-[9.5px] font-black px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-[#03DAC5] border border-white/15 shadow-sm">
                          Vidéo
                        </span>
                      ) : null}
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
                            {item.type === 'videos' ? (
                              <>
                                <Play className="w-3 h-3 fill-white" />
                                <span>Épisodes ({item.seriesEpisodes?.length || 0})</span>
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-3 h-3" />
                                <span>Explorer ({item.seriesEpisodes?.length || 0})</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs text-white transition-all btn-press shrink-0 ${
                              verrouille
                                ? 'bg-[#6200EE] group-hover:bg-[#3700B3]'
                                : 'bg-[#00897B] group-hover:bg-[#00695C]'
                            }`}
                          >
                            {/* Le libellé ne doit pas promettre une lecture
                                impossible : une carte verrouillée invite à
                                s'abonner, pas à écouter. */}
                            {verrouille ? (
                              <Lock className="w-3 h-3" />
                            ) : item.type === 'chansons' || item.type === 'podcasts' || item.type === 'videos' ? (
                              <Play className="w-3 h-3 fill-white" />
                            ) : (
                              <BookOpen className="w-3 h-3" />
                            )}
                            <span>
                              {verrouille
                                ? 'Débloquer'
                                : item.type === 'chansons' || item.type === 'podcasts'
                                  ? 'Écouter'
                                  : item.type === 'videos'
                                    ? 'Regarder'
                                    : 'Lire'}
                            </span>
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

      {/* Contenu réservé aux abonnés : fenêtre montée dans document.body,
          conformément à la règle du projet sur les modals. */}
      {itemVerrouille && (
        <Portal>
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setItemVerrouille(null)}
          >
            <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setItemVerrouille(null)}
                aria-label="Fermer"
                className="absolute -top-3 -right-1 z-10 w-8 h-8 rounded-full bg-white dark:bg-[#252525] border border-[#E0E0E0] dark:border-[#333333] text-[#757575] hover:text-[#212121] dark:hover:text-white flex items-center justify-center shadow-md btn-press"
              >
                ✕
              </button>
              <EcranPremium titre={itemVerrouille.titleFr} rubrique={rubriqueDe(itemVerrouille)} />
            </div>
          </div>
        </Portal>
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

