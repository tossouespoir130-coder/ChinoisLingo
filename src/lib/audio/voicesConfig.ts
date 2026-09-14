export type VoiceCategory = 'recurrent' | 'narrator' | 'generic' | 'founder';
export type VoiceGender = 'female' | 'male' | 'neutral';

export interface PersonnageVoixConfig {
  id: string;
  characterNameFr: string;
  characterNameZh?: string;
  elevenVoiceName?: string;
  voiceId?: string | null;
  category: VoiceCategory;
  gender: VoiceGender;
  modelId: string;
  stability: number;
  similarityBoost: number;
  description?: string;
}

/**
 * Configuration officielle des voix ElevenLabs pour ChinoisLingo.
 */
export const DEFAULT_VOICES_CONFIG: PersonnageVoixConfig[] = [
  // 1. Personnages récurrents des dialogues (Voix fixes dédiées)
  {
    id: 'lily',
    characterNameFr: 'Lily',
    characterNameZh: '丽丽',
    elevenVoiceName: 'Anna',
    voiceId: 'PSvrh6w41Qm19oaaHLca',
    category: 'recurrent',
    gender: 'female',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix féminine jeune et dynamique pour Lily (丽丽) — Anna',
  },
  {
    id: 'mr_li',
    characterNameFr: 'Monsieur Li',
    characterNameZh: '李老师',
    elevenVoiceName: 'Mr Chen',
    voiceId: 'cwzmKSYMCC9Aym1ymCnt',
    category: 'recurrent',
    gender: 'male',
    modelId: 'eleven_multilingual_v2',
    stability: 0.60,
    similarityBoost: 0.80,
    description: 'Voix masculine mature, posée et pédagogique pour Monsieur Li (李老师) — Mr Chen',
  },
  {
    id: 'lao_wang',
    characterNameFr: 'Directeur Wang / Lao Wang (le chauffeur)',
    characterNameZh: '王总',
    elevenVoiceName: 'Lin',
    voiceId: 'UFDAUkGzdLAEJlINT3Fx',
    category: 'recurrent',
    gender: 'male',
    modelId: 'eleven_multilingual_v2',
    stability: 0.55,
    similarityBoost: 0.75,
    description: 'Voix masculine professionnelle et chaleureuse pour M. Wang / Lao Wang (le chauffeur / 王总) — Lin',
  },
  {
    id: 'katia',
    characterNameFr: 'Katia',
    characterNameZh: '卡佳',
    elevenVoiceName: 'Xiaoran',
    voiceId: 'm7QGIiNrWASyI5oJn4I8',
    category: 'recurrent',
    gender: 'female',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix féminine d’affaires claire et élégante pour Katia (卡佳) — Xiaoran',
  },
  {
    id: 'brice',
    characterNameFr: 'Brice',
    characterNameZh: '布里斯',
    elevenVoiceName: 'Jin',
    voiceId: 'vZZLclMx4wouUtKBRfZn',
    category: 'recurrent',
    gender: 'male',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix masculine déterminée et dynamique pour Brice (布里斯) — Jin',
  },
  {
    id: 'anthony',
    characterNameFr: 'Anthony',
    characterNameZh: '安东尼',
    elevenVoiceName: 'Adrian',
    voiceId: 'agczkAUlHLowaNnL72Cc',
    category: 'recurrent',
    gender: 'male',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix masculine jeune et persévérante pour Anthony (安东尼) — Adrian',
  },

  // 2. Fondateur / Voix clonée
  {
    id: 'espoir_chinois',
    characterNameFr: 'Espoir Chinois',
    characterNameZh: '苏波',
    elevenVoiceName: 'Espoir Chinois Clone',
    voiceId: null, // À insérer après clonage
    category: 'founder',
    gender: 'male',
    modelId: 'eleven_multilingual_v2',
    stability: 0.55,
    similarityBoost: 0.85,
    description: 'Voix clonée officielle d’Espoir Chinois (苏波 / Espoir)',
  },

  // 3. Pool de narration pour Histoires & Articles (4 voix)
  {
    id: 'narrator_1',
    characterNameFr: 'Narration 1',
    characterNameZh: '旁白一',
    elevenVoiceName: 'Ethan Zhang',
    voiceId: 'brChkoggsUHF1stW6omH',
    category: 'narrator',
    gender: 'male',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix de narration n°1 — Ethan Zhang',
  },
  {
    id: 'narrator_2',
    characterNameFr: 'Narration 2',
    characterNameZh: '旁白二',
    elevenVoiceName: 'Siqi liu',
    voiceId: 'W8lBaQb9YIoddhxfQNLP',
    category: 'narrator',
    gender: 'female',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix de narration n°2 — Siqi liu',
  },
  {
    id: 'narrator_3',
    characterNameFr: 'Narration 3',
    characterNameZh: '旁白三',
    elevenVoiceName: 'Sage',
    voiceId: 'APSIkVZudNbPAwyPoeVO',
    category: 'narrator',
    gender: 'female',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix de narration n°3 — Sage',
  },
  {
    id: 'narrator_4',
    characterNameFr: 'Narration 4',
    characterNameZh: '旁白四',
    elevenVoiceName: 'Hua feng',
    voiceId: 'rtRocV7drsrJFSQPxlD3',
    category: 'narrator',
    gender: 'female',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix de narration n°4 — Hua feng',
  },

  // 4. Pool de voix génériques secondaires pour dialogues (2H / 2F)
  {
    id: 'generic_male_1',
    characterNameFr: 'Secondaire homme 1',
    characterNameZh: '男声一',
    elevenVoiceName: 'Guan Tao Bao',
    voiceId: 'MQkiCZS3mnl44caDtxkJ',
    category: 'generic',
    gender: 'male',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix masculine secondaire pour figurants — Guan Tao Bao',
  },
  {
    id: 'generic_male_2',
    characterNameFr: 'Secondaire homme 2',
    characterNameZh: '男声二',
    elevenVoiceName: 'Rippel',
    voiceId: 'nss5M23ZSzhG3Tn0b7wN',
    category: 'generic',
    gender: 'male',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix masculine secondaire alternative anti-collision — Rippel',
  },
  {
    id: 'generic_female_1',
    characterNameFr: 'Secondaire femme 1',
    characterNameZh: '女声一',
    elevenVoiceName: 'Stacy',
    voiceId: 'hkfHEbBvdQFNX4uWHqRF',
    category: 'generic',
    gender: 'female',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix féminine secondaire pour figurantes — Stacy',
  },
  {
    id: 'generic_female_2',
    characterNameFr: 'Secondaire femme 2',
    characterNameZh: '女声二',
    elevenVoiceName: 'Amy',
    voiceId: 'bhJUNIXWQQ94l8eI2VUf',
    category: 'generic',
    gender: 'female',
    modelId: 'eleven_multilingual_v2',
    stability: 0.50,
    similarityBoost: 0.75,
    description: 'Voix féminine secondaire alternative anti-collision — Amy',
  },
];
