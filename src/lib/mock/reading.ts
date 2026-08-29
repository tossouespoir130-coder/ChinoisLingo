export interface DialogueCharacter {
  name: string;
  nameZh?: string;
  pinyin?: string;
  role: string;
  description: string;
  color?: 'violet' | 'turquoise' | 'neutral';
}

export interface StorySentence {
  id: string;
  speaker?: string;
  speakerRole?: string;
  speakerColor?: 'violet' | 'turquoise' | 'neutral';
  hanzi: string;
  pinyin: string;
  french: string;
}

export interface Story {
  id: string;
  title: string;
  pinyinTitle: string;
  frenchTitle: string;
  type: 'podcast' | 'histoire' | 'article' | 'dialogue';
  level: string;
  duration: string;
  summary: string;
  category: string;
  characters?: DialogueCharacter[];
  sentences: StorySentence[];
}

export const mockStories: Story[] = [
  {
    id: 'story_1',
    title: '商务谈判的艺术',
    pinyinTitle: 'Shāngwù tánpàn de yìshù',
    frenchTitle: 'L’art de la négociation commerciale',
    type: 'podcast',
    level: 'HSK 3 · Intermédiaire',
    duration: '4 min',
    summary: 'Espoir Chinois guide Katia dans les subtilités des négociations avec des fournisseurs à Shanghai.',
    category: 'Affaires & Commerce',
    sentences: [
      {
        id: 's1_1',
        speaker: 'Espoir Chinois',
        speakerRole: 'Mentor & Interprète',
        speakerColor: 'violet',
        hanzi: '在商务谈判中，互相尊重是非常重要的。',
        pinyin: 'Zài shāngwù tánpàn zhōng, hùxiāng zūnzhòng shì fēicháng zhòngyào de.',
        french: 'Dans une négociation commerciale, le respect mutuel est primordial.'
      },
      {
        id: 's1_2',
        speaker: 'Katia',
        speakerRole: 'Femme d’affaires',
        speakerColor: 'turquoise',
        hanzi: '我们需要先确认产品的质量和交货时间。',
        pinyin: 'Wǒmen xūyào xiān quèrèn chǎnpǐn de zhìliàng hé jiāohuò shíjiān.',
        french: 'Nous devons d’abord confirmer la qualité du produit et le délai de livraison.'
      }
    ]
  },
  {
    id: 'story_2',
    title: '广州国际采购之旅',
    pinyinTitle: 'Guǎngzhōu guójì cǎigòu zhī lǚ',
    frenchTitle: 'Voyage d’approvisionnement à Guangzhou',
    type: 'histoire',
    level: 'HSK 2 · Élémentaire',
    duration: '3 min',
    summary: 'Brice visite la foire de Canton pour négocier des conteneurs de marchandises avec Wang Wei.',
    category: 'Commerce International',
    characters: [
      {
        name: 'Brice',
        role: 'Entrepreneur',
        description: 'Entrepreneur ivoirien venu négocier des volumes de conteneurs à la foire de Canton.',
        color: 'violet'
      },
      {
        name: 'Wang Wei',
        pinyin: 'Wáng Wěi',
        role: 'Directeur d’Usine',
        description: 'Fournisseur chinois qui présente ses conditions tarifaires pour les commandes en gros.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 's2_1',
        speaker: 'Brice',
        speakerRole: 'Entrepreneur',
        speakerColor: 'violet',
        hanzi: '这个产品的起订量是多少？',
        pinyin: 'Zhège chǎnpǐn de qǐdìngliàng shì duōshao?',
        french: 'Quelle est la quantité minimale de commande pour ce produit ?'
      },
      {
        id: 's2_2',
        speaker: 'Wang Wei',
        speakerRole: 'Directeur d’Usine',
        speakerColor: 'turquoise',
        hanzi: '如果订购一个集装箱，我们可以给您最优惠的价格。',
        pinyin: 'Rúguǒ dìnggòu yí gè jízhuāngxiāng, wǒmen kěyǐ gěi nín zuì yōuhuì de jiàgé.',
        french: 'Si vous commandez un conteneur complet, nous pouvons vous accorder le tarif le plus avantageux.'
      }
    ]
  },
  {
    id: 'story_3',
    title: '在北京的第一天',
    pinyinTitle: 'Zài Běijīng de dì yī tiān',
    frenchTitle: 'Premier jour à Pékin',
    type: 'dialogue',
    level: 'HSK 1 · Débutant',
    duration: '2 min',
    summary: 'Aïcha arrive à Pékin pour son stage et fait ses premiers pas à l’aéroport avec l’aide d’un chauffeur.',
    category: 'Vie Quotidienne',
    characters: [
      {
        name: 'Aïcha',
        role: 'Étudiante',
        description: 'Étudiante internationale arrivée à Pékin pour ses études, s’oriente dans la ville.',
        color: 'violet'
      },
      {
        name: '师傅',
        pinyin: 'Shīfu',
        role: 'Conducteur',
        description: 'Chauffeur local bienveillant qui indique la route vers le campus universitaire.',
        color: 'turquoise'
      }
    ],
    sentences: [
      {
        id: 's3_1',
        speaker: 'Aïcha',
        speakerRole: 'Étudiante',
        speakerColor: 'violet',
        hanzi: '你好，请问去清华大学怎么走？',
        pinyin: 'Nǐ hǎo, qǐngwèn qù Qīnghuá Dàxué zěnme zǒu?',
        french: 'Bonjour, excusez-moi, comment se rendre à l’Université Tsinghua ?'
      }
    ]
  }
];
