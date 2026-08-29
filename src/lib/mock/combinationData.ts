import hsk1Data from '@/content/vocabulaire-hsk1.json';
import hsk2Data from '@/content/vocabulaire-hsk2.json';
import hsk3Data from '@/content/vocabulaire-hsk3.json';
import hsk4Data from '@/content/vocabulaire-hsk4.json';
import hsk5Data from '@/content/vocabulaire-hsk5.json';
import hsk6Data from '@/content/vocabulaire-hsk6.json';

export interface CombinatoryOption {
  id: string;
  hanzi: string;
  pinyin: string;
  french: string;
  verbConjugations?: Record<string, string>;
}

export interface CombinatorySlot {
  id: string;
  slotNumber: number;
  label: string; // e.g. "1. Sujet / Acteur", "2. Verbe & Modalité", "3. Complément / Destination", "2. Adverbe & Adjectif"
  colorTheme: 'purple' | 'emerald' | 'amber' | 'blue' | 'rose';
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

export interface CombinatoryAnalysisResult {
  success: boolean;
  pattern?: DynamicCombinatoryPattern;
  errorMessage?: string;
  suggestedPivots?: { hanzi: string; pinyin: string; meaning: string }[];
  isOfficialHsk?: boolean;
  hasWarningBadge?: boolean;
  warningMessage?: string;
}

// 1. Les 3 Mots Pivots d'Exemple Officiels (Raccourcis Rapides)
export const TOP_PIVOT_SHORTCUTS = [
  { id: 'pattern_qu', word: '去', pinyin: 'qù', meaning: 'Aller' },
  { id: 'pattern_chi', word: '吃', pinyin: 'chī', meaning: 'Manger' },
  { id: 'pattern_mai', word: '买', pinyin: 'mǎi', meaning: 'Acheter' },
];

// Dictionnaire lexical de référence pour typer précisément les entrées HSK 1-6
// Garantit une traduction 100% en français, un pinyin authentique avec tons et un typage grammatical précis.
export const LEXICON_DB: Record<
  string,
  { hanzi: string; pinyin: string; french: string; type: 'adj' | 'intrans' | 'trans' | 'noun' }
> = {
  // Adjectifs (HSK 1-6)
  '漂亮': { hanzi: '漂亮', pinyin: 'piàoliang', french: 'beau / élégant', type: 'adj' },
  'piaoliang': { hanzi: '漂亮', pinyin: 'piàoliang', french: 'beau / élégant', type: 'adj' },
  '好看': { hanzi: '好看', pinyin: 'hǎokàn', french: 'joli / agréable à regarder', type: 'adj' },
  'haokan': { hanzi: '好看', pinyin: 'hǎokàn', french: 'joli / agréable à regarder', type: 'adj' },
  '好听': { hanzi: '好听', pinyin: 'hǎotīng', french: 'mélodieux / agréable à écouter', type: 'adj' },
  'haoting': { hanzi: '好听', pinyin: 'hǎotīng', french: 'mélodieux / agréable à écouter', type: 'adj' },
  '好吃': { hanzi: '好吃', pinyin: 'hǎochī', french: 'délicieux / savoureux', type: 'adj' },
  'haochi': { hanzi: '好吃', pinyin: 'hǎochī', french: 'délicieux / savoureux', type: 'adj' },
  '好喝': { hanzi: '好喝', pinyin: 'hǎohē', french: 'délicieux à boire', type: 'adj' },
  'haohe': { hanzi: '好喝', pinyin: 'hǎohē', french: 'délicieux à boire', type: 'adj' },
  '贵': { hanzi: '贵', pinyin: 'guì', french: 'cher / coûteux', type: 'adj' },
  'gui': { hanzi: '贵', pinyin: 'guì', french: 'cher / coûteux', type: 'adj' },
  '好': { hanzi: '好', pinyin: 'hǎo', french: 'bon / agréable', type: 'adj' },
  'hao': { hanzi: '好', pinyin: 'hǎo', french: 'bon / agréable', type: 'adj' },
  '大': { hanzi: '大', pinyin: 'dà', french: 'grand / spacieux', type: 'adj' },
  'da': { hanzi: '大', pinyin: 'dà', french: 'grand / spacieux', type: 'adj' },
  '小': { hanzi: '小', pinyin: 'xiǎo', french: 'petit / discret', type: 'adj' },
  'xiao': { hanzi: '小', pinyin: 'xiǎo', french: 'petit / discret', type: 'adj' },
  '热': { hanzi: '热', pinyin: 'rè', french: 'chaud', type: 'adj' },
  're': { hanzi: '热', pinyin: 'rè', french: 'chaud', type: 'adj' },
  '冷': { hanzi: '冷', pinyin: 'lěng', french: 'froid', type: 'adj' },
  'leng': { hanzi: '冷', pinyin: 'lěng', french: 'froid', type: 'adj' },
  '高兴': { hanzi: '高兴', pinyin: 'gāoxìng', french: 'content / ravi', type: 'adj' },
  'gaoxing': { hanzi: '高兴', pinyin: 'gāoxìng', french: 'content / ravi', type: 'adj' },
  '开心': { hanzi: '开心', pinyin: 'kāixīn', french: 'joyeux / de bonne humeur', type: 'adj' },
  'kaixin': { hanzi: '开心', pinyin: 'kāixīn', french: 'joyeux / de bonne humeur', type: 'adj' },
  '难': { hanzi: '难', pinyin: 'nán', french: 'difficile / complexe', type: 'adj' },
  'nan': { hanzi: '难', pinyin: 'nán', french: 'difficile / complexe', type: 'adj' },
  '容易': { hanzi: '容易', pinyin: 'róngyì', french: 'facile / accessible', type: 'adj' },
  'rongyi': { hanzi: '容易', pinyin: 'róngyì', french: 'facile / accessible', type: 'adj' },
  '忙': { hanzi: '忙', pinyin: 'máng', french: 'occupé / affairé', type: 'adj' },
  'mang': { hanzi: '忙', pinyin: 'máng', french: 'occupé / affairé', type: 'adj' },
  '便宜': { hanzi: '便宜', pinyin: 'piányi', french: 'bon marché / abordable', type: 'adj' },
  'pianyi': { hanzi: '便宜', pinyin: 'piányi', french: 'bon marché / abordable', type: 'adj' },
  '快': { hanzi: '快', pinyin: 'kuài', french: 'rapide / efficace', type: 'adj' },
  'kuai': { hanzi: '快', pinyin: 'kuài', french: 'rapide / efficace', type: 'adj' },
  '慢': { hanzi: '慢', pinyin: 'màn', french: 'lent', type: 'adj' },
  'man': { hanzi: '慢', pinyin: 'màn', french: 'lent', type: 'adj' },
  '累': { hanzi: '累', pinyin: 'lèi', french: 'fatigué / épuisé', type: 'adj' },
  'lei': { hanzi: '累', pinyin: 'lèi', french: 'fatigué / épuisé', type: 'adj' },
  '重要': { hanzi: '重要', pinyin: 'zhòngyào', french: 'important / essentiel', type: 'adj' },
  'zhongyao': { hanzi: '重要', pinyin: 'zhòngyào', french: 'important / essentiel', type: 'adj' },
  '帅': { hanzi: '帅', pinyin: 'shuài', french: 'élégant / beau gosse', type: 'adj' },
  'shuai': { hanzi: '帅', pinyin: 'shuài', french: 'élégant / beau gosse', type: 'adj' },

  // Verbes Intransitifs / Actions d'état (HSK 1-6)
  '休息': { hanzi: '休息', pinyin: 'xiūxi', french: 'se reposer', type: 'intrans' },
  'xiuxi': { hanzi: '休息', pinyin: 'xiūxi', french: 'se reposer', type: 'intrans' },
  '睡觉': { hanzi: '睡觉', pinyin: 'shuìjiào', french: 'dormir', type: 'intrans' },
  'shuijiao': { hanzi: '睡觉', pinyin: 'shuìjiào', french: 'dormir', type: 'intrans' },
  '走': { hanzi: '走', pinyin: 'zǒu', french: 'partir / marcher', type: 'intrans' },
  'zou': { hanzi: '走', pinyin: 'zǒu', french: 'partir / marcher', type: 'intrans' },
  '工作': { hanzi: '工作', pinyin: 'gōngzuò', french: 'travailler', type: 'intrans' },
  'gongzuo': { hanzi: '工作', pinyin: 'gōngzuò', french: 'travailler', type: 'intrans' },
  '上班': { hanzi: '上班', pinyin: 'shàngbān', french: 'prendre son service', type: 'intrans' },
  'shangban': { hanzi: '上班', pinyin: 'shàngbān', french: 'prendre son service', type: 'intrans' },
  '下班': { hanzi: '下班', pinyin: 'xiàbān', french: 'quitter le travail', type: 'intrans' },
  'xiaban': { hanzi: '下班', pinyin: 'xiàbān', french: 'quitter le travail', type: 'intrans' },
  '迟到': { hanzi: '迟到', pinyin: 'chídào', french: 'arriver en retard', type: 'intrans' },
  'chidao': { hanzi: '迟到', pinyin: 'chídào', french: 'arriver en retard', type: 'intrans' },
  '起床': { hanzi: '起床', pinyin: 'qǐchuáng', french: 'se lever', type: 'intrans' },
  'qichuang': { hanzi: '起床', pinyin: 'qǐchuáng', french: 'se lever', type: 'intrans' },
  '跑步': { hanzi: '跑步', pinyin: 'pǎobù', french: 'faire du jogging / courir', type: 'intrans' },
  'paobu': { hanzi: '跑步', pinyin: 'pǎobù', french: 'faire du jogging / courir', type: 'intrans' },
  '散步': { hanzi: '散步', pinyin: 'sànbù', french: 'se promener', type: 'intrans' },
  'sanbu': { hanzi: '散步', pinyin: 'sànbù', french: 'se promener', type: 'intrans' },

  // Verbes Transitifs / Actions avec Complément (HSK 1-6)
  '知道': { hanzi: '知道', pinyin: 'zhīdào', french: 'savoir / être au courant', type: 'trans' },
  'zhidao': { hanzi: '知道', pinyin: 'zhīdào', french: 'savoir / être au courant', type: 'trans' },
  '学': { hanzi: '学', pinyin: 'xué', french: 'apprendre', type: 'trans' },
  'xue': { hanzi: '学', pinyin: 'xué', french: 'apprendre', type: 'trans' },
  '学会': { hanzi: '学会', pinyin: 'xuéhuì', french: 'maîtriser / assimiler', type: 'trans' },
  'xuehui': { hanzi: '学会', pinyin: 'xuéhuì', french: 'maîtriser / assimiler', type: 'trans' },
  '学习': { hanzi: '学习', pinyin: 'xuéxí', french: 'étudier', type: 'trans' },
  'xuexi': { hanzi: '学习', pinyin: 'xuéxí', french: 'étudier', type: 'trans' },
  '看': { hanzi: '看', pinyin: 'kàn', french: 'regarder / lire', type: 'trans' },
  'kan': { hanzi: '看', pinyin: 'kàn', french: 'regarder / lire', type: 'trans' },
  '喝': { hanzi: '喝', pinyin: 'hē', french: 'boire', type: 'trans' },
  'he': { hanzi: '喝', pinyin: 'hē', french: 'boire', type: 'trans' },
  '做': { hanzi: '做', pinyin: 'zuò', french: 'faire / réaliser', type: 'trans' },
  'zuo': { hanzi: '做', pinyin: 'zuò', french: 'faire / réaliser', type: 'trans' },
  '写': { hanzi: '写', pinyin: 'xiě', french: 'écrire', type: 'trans' },
  'xie': { hanzi: '写', pinyin: 'xiě', french: 'écrire', type: 'trans' },
  '听': { hanzi: '听', pinyin: 'tīng', french: 'écouter', type: 'trans' },
  'ting': { hanzi: '听', pinyin: 'tīng', french: 'écouter', type: 'trans' },
  '说': { hanzi: '说', pinyin: 'shuō', french: 'parler / dire', type: 'trans' },
  'shuo': { hanzi: '说', pinyin: 'shuō', french: 'parler / dire', type: 'trans' },
  '买': { hanzi: '买', pinyin: 'mǎi', french: 'acheter', type: 'trans' },
  'mai': { hanzi: '买', pinyin: 'mǎi', french: 'acheter', type: 'trans' },
  '卖': { hanzi: '卖', pinyin: 'mài', french: 'vendre', type: 'trans' },
  '吃': { hanzi: '吃', pinyin: 'chī', french: 'manger', type: 'trans' },
  'chi': { hanzi: '吃', pinyin: 'chī', french: 'manger', type: 'trans' },
  '去': { hanzi: '去', pinyin: 'qù', french: 'aller à / en', type: 'trans' },
  'qu': { hanzi: '去', pinyin: 'qù', french: 'aller à / en', type: 'trans' },
  '找': { hanzi: '找', pinyin: 'zhǎo', french: 'chercher / retrouver', type: 'trans' },
  'zhao': { hanzi: '找', pinyin: 'zhǎo', french: 'chercher / retrouver', type: 'trans' },
  '帮': { hanzi: '帮', pinyin: 'bāng', french: 'aider', type: 'trans' },
  'bang': { hanzi: '帮', pinyin: 'bāng', french: 'aider', type: 'trans' },
  '认识': { hanzi: '认识', pinyin: 'rènshi', french: 'connaître / faire la connaissance de', type: 'trans' },
  'renshi': { hanzi: '认识', pinyin: 'rènshi', french: 'connaître / faire la connaissance de', type: 'trans' },

  // Noms / Objets / Orientations de Lieu (HSK 1-6)
  '上面': { hanzi: '上面', pinyin: 'shàngmian', french: 'le dessus / au-dessus / en haut', type: 'noun' },
  'shangmian': { hanzi: '上面', pinyin: 'shàngmian', french: 'le dessus / au-dessus / en haut', type: 'noun' },
  '上': { hanzi: '上', pinyin: 'shàng', french: 'sur / en haut', type: 'noun' },
  'shang': { hanzi: '上', pinyin: 'shàng', french: 'sur / en haut', type: 'noun' },
  '下面': { hanzi: '下面', pinyin: 'xiàmian', french: 'le dessous / en bas', type: 'noun' },
  'xiamian': { hanzi: '下面', pinyin: 'xiàmian', french: 'le dessous / en bas', type: 'noun' },
  '下': { hanzi: '下', pinyin: 'xià', french: 'sous / en bas', type: 'noun' },
  'xia': { hanzi: '下', pinyin: 'xià', french: 'sous / en bas', type: 'noun' },
  '里面': { hanzi: '里面', pinyin: 'lǐmian', french: 'l’intérieur / dedans', type: 'noun' },
  'limian': { hanzi: '里面', pinyin: 'lǐmian', french: 'l’intérieur / dedans', type: 'noun' },
  '外面': { hanzi: '外面', pinyin: 'wàimian', french: 'l’extérieur / dehors', type: 'noun' },
  'waimian': { hanzi: '外面', pinyin: 'wàimian', french: 'l’extérieur / dehors', type: 'noun' },
  '前面': { hanzi: '前面', pinyin: 'qiánmian', french: 'devant / en face', type: 'noun' },
  'qianmian': { hanzi: '前面', pinyin: 'qiánmian', french: 'devant / en face', type: 'noun' },
  '后面': { hanzi: '后面', pinyin: 'hòumian', french: 'derrière / à l’arrière', type: 'noun' },
  'houmian': { hanzi: '后面', pinyin: 'hòumian', french: 'derrière / à l’arrière', type: 'noun' },
  '左边': { hanzi: '左边', pinyin: 'zuǒbian', french: 'à gauche', type: 'noun' },
  'zuobian': { hanzi: '左边', pinyin: 'zuǒbian', french: 'à gauche', type: 'noun' },
  '右边': { hanzi: '右边', pinyin: 'yòubian', french: 'à droite', type: 'noun' },
  'youbian': { hanzi: '右边', pinyin: 'yòubian', french: 'à droite', type: 'noun' },
  '旁边': { hanzi: '旁边', pinyin: 'pángbiān', french: 'à côté / à proximité', type: 'noun' },
  'pangbian': { hanzi: '旁边', pinyin: 'pángbiān', french: 'à côté / à proximité', type: 'noun' },
  '咖啡': { hanzi: '咖啡', pinyin: 'kāfēi', french: 'du café', type: 'noun' },
  'kafei': { hanzi: '咖啡', pinyin: 'kāfēi', french: 'du café', type: 'noun' },
  '茶': { hanzi: '茶', pinyin: 'chá', french: 'du thé', type: 'noun' },
  'cha': { hanzi: '茶', pinyin: 'chá', french: 'du thé', type: 'noun' },
  '水': { hanzi: '水', pinyin: 'shuǐ', french: 'de l’eau', type: 'noun' },
  'shui': { hanzi: '水', pinyin: 'shuǐ', french: 'de l’eau', type: 'noun' },
  '中国': { hanzi: '中国', pinyin: 'Zhōngguó', french: 'en Chine', type: 'noun' },
  'zhongguo': { hanzi: '中国', pinyin: 'Zhōngguó', french: 'en Chine', type: 'noun' },
  '北京': { hanzi: '北京', pinyin: 'Běijīng', french: 'à Pékin', type: 'noun' },
  'beijing': { hanzi: '北京', pinyin: 'Běijīng', french: 'à Pékin', type: 'noun' },
  '上海': { hanzi: '上海', pinyin: 'Shànghǎi', french: 'à Shanghai', type: 'noun' },
  'shanghai': { hanzi: '上海', pinyin: 'Shànghǎi', french: 'à Shanghai', type: 'noun' },
  '电脑': { hanzi: '电脑', pinyin: 'diànnǎo', french: 'un ordinateur', type: 'noun' },
  'diannao': { hanzi: '电脑', pinyin: 'diànnǎo', french: 'un ordinateur', type: 'noun' },
  '汉语': { hanzi: '汉语', pinyin: 'hànyǔ', french: 'le chinois mandarin', type: 'noun' },
  'hanyu': { hanzi: '汉语', pinyin: 'hànyǔ', french: 'le chinois mandarin', type: 'noun' },
  '中文': { hanzi: '中文', pinyin: 'zhōngwén', french: 'la langue chinoise', type: 'noun' },
  'zhongwen': { hanzi: '中文', pinyin: 'zhōngwén', french: 'la langue chinoise', type: 'noun' },
  '手机': { hanzi: '手机', pinyin: 'shǒujī', french: 'un téléphone', type: 'noun' },
  'shouji': { hanzi: '手机', pinyin: 'shǒujī', french: 'un téléphone', type: 'noun' },
  '衣服': { hanzi: '衣服', pinyin: 'yīfu', french: 'un vêtement', type: 'noun' },
  'yifu': { hanzi: '衣服', pinyin: 'yīfu', french: 'un vêtement', type: 'noun' },
  '书': { hanzi: '书', pinyin: 'shū', french: 'un livre', type: 'noun' },
  'shu': { hanzi: '书', pinyin: 'shū', french: 'un livre', type: 'noun' },
  '词汇': { hanzi: '词汇', pinyin: 'cíhuì', french: 'le vocabulaire', type: 'noun' },
  'cihui': { hanzi: '词汇', pinyin: 'cíhuì', french: 'le vocabulaire', type: 'noun' },
};

export interface HskWordLookupEntry {
  hanzi: string;
  pinyin: string;
  french: string;
  level: string;
  type: 'adj' | 'intrans' | 'trans' | 'noun';
}

export function normalizePinyin(str: string): string {
  return str
    .replace(/[üǖǘǚǜ]/g, 'u')
    .replace(/v/g, 'u')
    .replace(/[1-5]/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Cache global contenant tous les mots officiels des 6 niveaux HSK
let globalHskCache: Map<string, HskWordLookupEntry> | null = null;

export function getGlobalHskDatabase(): Map<string, HskWordLookupEntry> {
  if (globalHskCache) return globalHskCache;

  const map = new Map<string, HskWordLookupEntry>();
  const allHskSets = [
    hsk1Data.vocabulaire,
    hsk2Data.vocabulaire,
    hsk3Data.vocabulaire,
    hsk4Data.vocabulaire,
    hsk5Data.vocabulaire,
    hsk6Data.vocabulaire,
  ];

  // Inverser l'ordre pour que les niveaux HSK 1 et HSK 2 aient la priorité d'écrasement
  for (let i = allHskSets.length - 1; i >= 0; i--) {
    const list = allHskSets[i];
    (list as Array<{ id: string; hanzi: string; pinyin: string; french: string; level: string }>).forEach((item) => {
      const frClean = item.french.split(/[/;]/)[0].replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim().toLowerCase();
      
      let inferredType: 'adj' | 'intrans' | 'trans' | 'noun' = 'noun';
      const frLower = item.french.toLowerCase();
      if (
        frLower.includes('beau') || frLower.includes('grand') || frLower.includes('petit') ||
        frLower.includes('chaud') || frLower.includes('froid') || frLower.includes('cher') ||
        frLower.includes('bon') || frLower.includes('heureux') || frLower.includes('facile') ||
        frLower.includes('difficile') || frLower.includes('rapide') || frLower.includes('lent') ||
        frLower.includes('fatigué') || frLower.includes('important')
      ) {
        inferredType = 'adj';
      } else if (
        frLower.startsWith('se ') || frLower.includes('dormir') || frLower.includes('se reposer') ||
        frLower.includes('marcher') || frLower.includes('courir') || frLower.includes('partir') ||
        frLower.includes('arriver') || frLower.includes('voyager') || frLower.includes('nager') ||
        frLower.includes('travailler')
      ) {
        inferredType = 'intrans';
      } else if (
        frLower.includes('savoir') || frLower.includes('aimer') || frLower.includes('vouloir') ||
        frLower.includes('acheter') || frLower.includes('vendre') || frLower.includes('manger') ||
        frLower.includes('boire') || frLower.includes('lire') || frLower.includes('écrire') ||
        frLower.includes('parler') || frLower.includes('écouter') || frLower.includes('regarder') ||
        frLower.includes('chercher') || frLower.includes('aider') || frLower.includes('ouvrir') ||
        frLower.includes('apprendre') || frLower.includes('étudier') || frLower.includes('comprendre') ||
        frLower.includes('faire') || frLower.includes('utiliser')
      ) {
        inferredType = 'trans';
      }

      const entry: HskWordLookupEntry = {
        hanzi: item.hanzi,
        pinyin: item.pinyin,
        french: frClean || item.french,
        level: item.level,
        type: inferredType,
      };

      // 1. Index par Hanzi exact
      map.set(item.hanzi, entry);

      // 2. Index par Pinyin brut sans espaces
      map.set(item.pinyin.toLowerCase().replace(/\s+/g, ''), entry);

      // 3. Index par Pinyin nettoyé sans accents ni numéros
      const cleanP = normalizePinyin(item.pinyin);
      if (cleanP) {
        map.set(cleanP, entry);
      }

      // 4. Index par mot-clé français
      if (frClean && frClean.length >= 3 && !map.has(frClean)) {
        map.set(frClean, entry);
      }
    });
  }

  // Alias courants et mots composés HSK
  const aliases: Array<[string, HskWordLookupEntry]> = [
    ['哪儿', { hanzi: '哪儿', pinyin: 'nǎr', french: 'où / quel endroit', level: 'HSK 1', type: 'noun' }],
    ['nar', { hanzi: '哪儿', pinyin: 'nǎr', french: 'où / quel endroit', level: 'HSK 1', type: 'noun' }],
    ['哪里', { hanzi: '哪里', pinyin: 'nǎlǐ', french: 'où / quel endroit', level: 'HSK 1', type: 'noun' }],
    ['nali', { hanzi: '哪里', pinyin: 'nǎlǐ', french: 'où / quel endroit', level: 'HSK 1', type: 'noun' }],
    ['踢足球', { hanzi: '踢足球', pinyin: 'tī zúqiú', french: 'jouer au football', level: 'HSK 2', type: 'intrans' }],
    ['tizuqiu', { hanzi: '踢足球', pinyin: 'tī zúqiú', french: 'jouer au football', level: 'HSK 2', type: 'intrans' }],
    ['打电话', { hanzi: '打电话', pinyin: 'dǎ diànhuà', french: 'téléphoner / passer un appel', level: 'HSK 1', type: 'intrans' }],
    ['dadianhua', { hanzi: '打电话', pinyin: 'dǎ diànhuà', french: 'téléphoner / passer un appel', level: 'HSK 1', type: 'intrans' }],
    ['下雨', { hanzi: '下雨', pinyin: 'xiàyǔ', french: 'pleuvoir', level: 'HSK 1', type: 'intrans' }],
    ['xiayu', { hanzi: '下雨', pinyin: 'xiàyǔ', french: 'pleuvoir', level: 'HSK 1', type: 'intrans' }],
    ['买东西', { hanzi: '买东西', pinyin: 'mǎi dōngxi', french: 'faire des achats / du shopping', level: 'HSK 1', type: 'trans' }],
    ['maidongxi', { hanzi: '买东西', pinyin: 'mǎi dōngxi', french: 'faire des achats / du shopping', level: 'HSK 1', type: 'trans' }],
    ['看书', { hanzi: '看书', pinyin: 'kànshū', french: 'lire un livre', level: 'HSK 1', type: 'trans' }],
    ['kanshu', { hanzi: '看书', pinyin: 'kànshū', french: 'lire un livre', level: 'HSK 1', type: 'trans' }],
    ['吃饭', { hanzi: '吃饭', pinyin: 'chīfàn', french: 'manger / prendre un repas', level: 'HSK 1', type: 'trans' }],
    ['chifan', { hanzi: '吃饭', pinyin: 'chīfàn', french: 'manger / prendre un repas', level: 'HSK 1', type: 'trans' }],
    ['喝茶', { hanzi: '喝茶', pinyin: 'hēchá', french: 'boire du thé', level: 'HSK 1', type: 'trans' }],
    ['hecha', { hanzi: '喝茶', pinyin: 'hēchá', french: 'boire du thé', level: 'HSK 1', type: 'trans' }],
    ['上面', { hanzi: '上面', pinyin: 'shàngmian', french: 'le dessus / au-dessus / en haut', level: 'HSK 1', type: 'noun' }],
    ['shangmian', { hanzi: '上面', pinyin: 'shàngmian', french: 'le dessus / au-dessus / en haut', level: 'HSK 1', type: 'noun' }],
    ['下面', { hanzi: '下面', pinyin: 'xiàmian', french: 'le dessous / en bas', level: 'HSK 1', type: 'noun' }],
    ['xiamian', { hanzi: '下面', pinyin: 'xiàmian', french: 'le dessous / en bas', level: 'HSK 1', type: 'noun' }],
    ['里面', { hanzi: '里面', pinyin: 'lǐmian', french: 'l’intérieur / dedans', level: 'HSK 1', type: 'noun' }],
    ['limian', { hanzi: '里面', pinyin: 'lǐmian', french: 'l’intérieur / dedans', level: 'HSK 1', type: 'noun' }],
    ['外面', { hanzi: '外面', pinyin: 'wàimian', french: 'l’extérieur / dehors', level: 'HSK 1', type: 'noun' }],
    ['waimian', { hanzi: '外面', pinyin: 'wàimian', french: 'l’extérieur / dehors', level: 'HSK 1', type: 'noun' }],
  ];

  aliases.forEach(([k, v]) => {
    map.set(k, v);
    map.set(normalizePinyin(k), v);
  });

  globalHskCache = map;
  return globalHskCache;
}

// Nettoyeur automatique strict pour éliminer TOUT caractère chinois résiduel de la traduction française
export function sanitizeFrenchTranslation(rawFrench: string): string {
  if (!rawFrench) return '';

  // Remplacement de tout caractère chinois par sa traduction française
  const cleaned = rawFrench.replace(/[\u4e00-\u9fa5]+/g, (matchedHanzi) => {
    if (LEXICON_DB[matchedHanzi]) {
      return LEXICON_DB[matchedHanzi].french;
    }
    // Dictionnaire de substitution directe pour fragments courants
    if (matchedHanzi === '学会') return 'maîtriser';
    if (matchedHanzi === '学') return 'apprendre';
    if (matchedHanzi === '看') return 'regarder';
    if (matchedHanzi === '吃') return 'manger';
    if (matchedHanzi === '去') return 'aller';
    if (matchedHanzi === '买') return 'acheter';
    if (matchedHanzi === '喝') return 'boire';
    if (matchedHanzi === '漂亮') return 'beau / belle';
    if (matchedHanzi === '汉语' || matchedHanzi === '中文') return 'le chinois';
    if (matchedHanzi === '衣服') return 'le vêtement';
    if (matchedHanzi === '手机') return 'le téléphone';
    return '';
  });

  // Nettoyage des espaces résiduels et formatage
  return cleaned
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .replace(/«\s+/g, '« ')
    .replace(/\s+»/g, ' »')
    .trim();
}

// Helper to assemble full sentence with grammatically natural French translation
export function buildDynamicSentence(
  slots: CombinatorySlot[],
  selectedOptionIds: Record<string, string>
) {
  const selectedOptions = slots.map((slot) => {
    const optId = selectedOptionIds[slot.id] || slot.options[0].id;
    return slot.options.find((o) => o.id === optId) || slot.options[0];
  });

  // Hanzi assembly
  const hanzi = selectedOptions.map((o) => o.hanzi).join('');

  // Pinyin assembly
  const pinyinParts = selectedOptions
    .map((o, idx) => {
      // If the option is a Latin name in the first slot (e.g. Espoir Chinois), omit from Chinese Pinyin line
      if (idx === 0 && o.hanzi === o.french) return '';
      return o.pinyin;
    })
    .filter(Boolean);
  const pinyin = pinyinParts.join(' ');

  // French assembly
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
  } else {
    french = selectedOptions.map((o) => o.french).join(' ') + '.';
  }

  // 1. Contrôle Automatique Point 1 : Traduction 100% Française sans aucun caractère chinois résiduel
  const sanitizedFrench = sanitizeFrenchTranslation(french);

  return {
    hanzi,
    pinyin,
    french: sanitizedFrench,
    selectedOptions,
  };
}

// 2. Base prédéfinie des 3 modèles pivots
const PREDEFINED_PATTERNS: Record<string, DynamicCombinatoryPattern> = {
  // PIVOT 1: 去 (ALLER) - 3 POSTES
  pattern_qu: {
    id: 'pattern_qu',
    pivotWord: '去',
    pivotPinyin: 'qù',
    pivotMeaning: 'Aller / Se déplacer',
    grammaticalCategory: 'Verbe transitif de mouvement',
    structureDescription: 'Sujet + Verbe & Modalité + Complément de Lieu (3 postes)',
    isOfficialHsk: true,
    slots: [
      {
        id: 'slot_subject',
        slotNumber: 1,
        label: 'Sujet / Acteur',
        colorTheme: 'purple',
        options: [
          { id: 'sub_wo', hanzi: '我', pinyin: 'Wǒ', french: 'Je' },
          { id: 'sub_ni', hanzi: '你', pinyin: 'Nǐ', french: 'Tu' },
          { id: 'sub_ta', hanzi: '他', pinyin: 'Tā', french: 'Il' },
          { id: 'sub_women', hanzi: '我们', pinyin: 'Wǒmen', french: 'Nous' },
          { id: 'sub_espoir', hanzi: 'Espoir Chinois', pinyin: 'Espoir Chinois', french: 'Espoir Chinois' },
          { id: 'sub_jingli', hanzi: '王经理', pinyin: 'Wáng jīnglǐ', french: 'Le directeur Wang' },
          { id: 'sub_dajia', hanzi: '大家', pinyin: 'Dàjiā', french: 'Tout le monde' },
        ],
      },
      {
        id: 'slot_verb',
        slotNumber: 2,
        label: 'Verbe & Modalité',
        colorTheme: 'emerald',
        options: [
          { 
            id: 'v_qu', 
            hanzi: '去', 
            pinyin: 'qù', 
            french: 'va à / en',
            verbConjugations: {
              sub_wo: 'vais',
              sub_ni: 'vas',
              sub_ta: 'va',
              sub_women: 'allons',
              sub_espoir: 'va',
              sub_jingli: 'va',
              sub_dajia: 'va',
            }
          },
          { 
            id: 'v_xiangqu', 
            hanzi: '想去', 
            pinyin: 'xiǎng qù', 
            french: 'veut aller à / en',
            verbConjugations: {
              sub_wo: 'veux aller',
              sub_ni: 'veux aller',
              sub_ta: 'veut aller',
              sub_women: 'voulons aller',
              sub_espoir: 'veut aller',
              sub_jingli: 'veut aller',
              sub_dajia: 'veut aller',
            }
          },
          { 
            id: 'v_yaoqu', 
            hanzi: '要去', 
            pinyin: 'yào qù', 
            french: 'doit aller à / en',
            verbConjugations: {
              sub_wo: 'dois aller',
              sub_ni: 'dois aller',
              sub_ta: 'doit aller',
              sub_women: 'devons aller',
              sub_espoir: 'doit aller',
              sub_jingli: 'doit aller',
              sub_dajia: 'doit aller',
            }
          },
          { 
            id: 'v_dasuanqu', 
            hanzi: '打算去', 
            pinyin: 'dǎsuàn qù', 
            french: 'a l’intention d’aller à / en',
            verbConjugations: {
              sub_wo: 'ai l’intention d’aller',
              sub_ni: 'as l’intention d’aller',
              sub_ta: 'a l’intention d’aller',
              sub_women: 'avons l’intention d’aller',
              sub_espoir: 'a l’intention d’aller',
              sub_jingli: 'a l’intention d’aller',
              sub_dajia: 'a l’intention d’aller',
            }
          },
          { 
            id: 'v_buqu', 
            hanzi: '不去', 
            pinyin: 'bú qù', 
            french: 'ne va pas à / en',
            verbConjugations: {
              sub_wo: 'ne vais pas',
              sub_ni: 'ne vas pas',
              sub_ta: 'ne va pas',
              sub_women: 'n’allons pas',
              sub_espoir: 'ne va pas',
              sub_jingli: 'ne va pas',
              sub_dajia: 'ne va pas',
            }
          },
          { 
            id: 'v_xihuanqu', 
            hanzi: '喜欢去', 
            pinyin: 'xǐhuan qù', 
            french: 'aime aller à / en',
            verbConjugations: {
              sub_wo: 'aime aller',
              sub_ni: 'aimes aller',
              sub_ta: 'aime aller',
              sub_women: 'aimons aller',
              sub_espoir: 'aime aller',
              sub_jingli: 'aime aller',
              sub_dajia: 'aime aller',
            }
          },
          { 
            id: 'v_changchangqu', 
            hanzi: '常常去', 
            pinyin: 'chángcháng qù', 
            french: 'va souvent à / en',
            verbConjugations: {
              sub_wo: 'vais souvent',
              sub_ni: 'vas souvent',
              sub_ta: 'va souvent',
              sub_women: 'allons souvent',
              sub_espoir: 'va souvent',
              sub_jingli: 'va souvent',
              sub_dajia: 'va souvent',
            }
          },
          { 
            id: 'v_yijingqule', 
            hanzi: '已经去了', 
            pinyin: 'yǐjīng qù le', 
            french: 'est déjà allé(e) à / en',
            verbConjugations: {
              sub_wo: 'suis déjà allé(e)',
              sub_ni: 'es déjà allé(e)',
              sub_ta: 'est déjà allé',
              sub_women: 'sommes déjà allés',
              sub_espoir: 'est déjà allé',
              sub_jingli: 'est déjà allé',
              sub_dajia: 'est déjà allé',
            }
          },
        ],
      },
      {
        id: 'slot_complement',
        slotNumber: 3,
        label: 'Complément / Destination',
        colorTheme: 'amber',
        options: [
          { id: 'comp_china', hanzi: '中国', pinyin: 'Zhōngguó', french: 'en Chine' },
          { id: 'comp_beijing', hanzi: '北京', pinyin: 'Běijīng', french: 'à Pékin' },
          { id: 'comp_shanghai', hanzi: '上海', pinyin: 'Shànghǎi', french: 'à Shanghai' },
          { id: 'comp_gongsi', hanzi: '公司', pinyin: 'gōngsī', french: 'au bureau / à l’entreprise' },
          { id: 'comp_chaoshi', hanzi: '超市', pinyin: 'chāoshì', french: 'au supermarché' },
          { id: 'comp_canting', hanzi: '中国饭店', pinyin: 'zhōngguó fàndiàn', french: 'au restaurant chinois' },
          { id: 'comp_yiyuan', hanzi: '医院', pinyin: 'yīyuàn', french: 'à l’hôpital' },
          { id: 'comp_xuexiao', hanzi: '大学', pinyin: 'dàxué', french: 'à l’université' },
        ],
      },
    ],
  },

  // PIVOT 2: 吃 (MANGER) - 3 POSTES
  pattern_chi: {
    id: 'pattern_chi',
    pivotWord: '吃',
    pivotPinyin: 'chī',
    pivotMeaning: 'Manger / Se restaurer',
    grammaticalCategory: 'Verbe transitif d’action',
    structureDescription: 'Sujet + Verbe & Modalité + Plat / Aliment (3 postes)',
    isOfficialHsk: true,
    slots: [
      {
        id: 'slot_subject',
        slotNumber: 1,
        label: 'Sujet / Acteur',
        colorTheme: 'purple',
        options: [
          { id: 'sub_wo', hanzi: '我', pinyin: 'Wǒ', french: 'Je' },
          { id: 'sub_ni', hanzi: '你', pinyin: 'Nǐ', french: 'Tu' },
          { id: 'sub_ta', hanzi: '他', pinyin: 'Tā', french: 'Il' },
          { id: 'sub_women', hanzi: '我们', pinyin: 'Wǒmen', french: 'Nous' },
          { id: 'sub_anthony', hanzi: '安东尼', pinyin: 'Āndōngní', french: 'Anthony' },
          { id: 'sub_pengyou', hanzi: '我的朋友', pinyin: 'Wǒ de péngyou', french: 'Mon ami' },
          { id: 'sub_laoshi', hanzi: '老师', pinyin: 'Lǎoshī', french: 'Le professeur' },
        ],
      },
      {
        id: 'slot_verb',
        slotNumber: 2,
        label: 'Verbe & Modalité',
        colorTheme: 'emerald',
        options: [
          { 
            id: 'v_chi', 
            hanzi: '吃', 
            pinyin: 'chī', 
            french: 'mange',
            verbConjugations: {
              sub_wo: 'mange',
              sub_ni: 'manges',
              sub_ta: 'mange',
              sub_women: 'mangeons',
              sub_anthony: 'mange',
              sub_pengyou: 'mange',
              sub_laoshi: 'mange',
            }
          },
          { 
            id: 'v_xiangchi', 
            hanzi: '想吃', 
            pinyin: 'xiǎng chī', 
            french: 'veut manger',
            verbConjugations: {
              sub_wo: 'veux manger',
              sub_ni: 'veux manger',
              sub_ta: 'veut manger',
              sub_women: 'voulons manger',
              sub_anthony: 'veut manger',
              sub_pengyou: 'veut manger',
              sub_laoshi: 'veut manger',
            }
          },
          { 
            id: 'v_xihuanchi', 
            hanzi: '喜欢吃', 
            pinyin: 'xǐhuan chī', 
            french: 'aime manger',
            verbConjugations: {
              sub_wo: 'aime manger',
              sub_ni: 'aimes manger',
              sub_ta: 'aime manger',
              sub_women: 'aimons manger',
              sub_anthony: 'aime manger',
              sub_pengyou: 'aime manger',
              sub_laoshi: 'aime manger',
            }
          },
          { 
            id: 'v_buxiangchi', 
            hanzi: '不想吃', 
            pinyin: 'bù xiǎng chī', 
            french: 'ne veut pas manger',
            verbConjugations: {
              sub_wo: 'ne veux pas manger',
              sub_ni: 'ne veux pas manger',
              sub_ta: 'ne veut pas manger',
              sub_women: 'ne voulons pas manger',
              sub_anthony: 'ne veut pas manger',
              sub_pengyou: 'ne veut pas manger',
              sub_laoshi: 'ne veut pas manger',
            }
          },
          { 
            id: 'v_zhengzaichi', 
            hanzi: '正在吃', 
            pinyin: 'zhèngzài chī', 
            french: 'est en train de manger',
            verbConjugations: {
              sub_wo: 'suis en train de manger',
              sub_ni: 'es en train de manger',
              sub_ta: 'est en train de manger',
              sub_women: 'sommes en train de manger',
              sub_anthony: 'est en train de manger',
              sub_pengyou: 'est en train de manger',
              sub_laoshi: 'est en train de manger',
            }
          },
          { 
            id: 'v_yijingchile', 
            hanzi: '已经吃了', 
            pinyin: 'yǐjīng chī le', 
            french: 'a déjà mangé',
            verbConjugations: {
              sub_wo: 'ai déjà mangé',
              sub_ni: 'as déjà mangé',
              sub_ta: 'a déjà mangé',
              sub_women: 'avons déjà mangé',
              sub_anthony: 'a déjà mangé',
              sub_pengyou: 'a déjà mangé',
              sub_laoshi: 'a déjà mangé',
            }
          },
        ],
      },
      {
        id: 'slot_complement',
        slotNumber: 3,
        label: 'Plat / Aliment',
        colorTheme: 'amber',
        options: [
          { id: 'comp_zhongguocai', hanzi: '中国菜', pinyin: 'zhōngguó cài', french: 'de la cuisine chinoise' },
          { id: 'comp_mianbaotiao', hanzi: '一碗面条', pinyin: 'yì wǎn miàntiáo', french: 'un bol de nouilles' },
          { id: 'comp_mifan', hanzi: '米饭', pinyin: 'mǐfàn', french: 'du riz' },
          { id: 'comp_jiaozi', hanzi: '中国饺子', pinyin: 'zhōngguó jiǎozi', french: 'des raviolis chinois' },
          { id: 'comp_shuiguo', hanzi: '新鲜水果', pinyin: 'xīnxiān shuǐguǒ', french: 'des fruits frais' },
          { id: 'comp_zaocan', hanzi: '早餐', pinyin: 'zǎocān', french: 'le petit-déjeuner' },
          { id: 'comp_kaoya', hanzi: '北京烤鸭', pinyin: 'běijīng kǎoyā', french: 'du canard laqué de Pékin' },
          { id: 'comp_wucan', hanzi: '这顿午饭', pinyin: 'zhè dùn wǔfàn', french: 'ce déjeuner' },
        ],
      },
    ],
  },

  // PIVOT 3: 买 (ACHETER) - 3 POSTES
  pattern_mai: {
    id: 'pattern_mai',
    pivotWord: '买',
    pivotPinyin: 'mǎi',
    pivotMeaning: 'Acheter / Acquérir',
    grammaticalCategory: 'Verbe transitif d’action',
    structureDescription: 'Sujet + Verbe & Modalité + Objet / Article (3 postes)',
    isOfficialHsk: true,
    slots: [
      {
        id: 'slot_subject',
        slotNumber: 1,
        label: 'Sujet / Acheteur',
        colorTheme: 'purple',
        options: [
          { id: 'sub_wo', hanzi: '我', pinyin: 'Wǒ', french: 'Je' },
          { id: 'sub_ni', hanzi: '你', pinyin: 'Nǐ', french: 'Tu' },
          { id: 'sub_ta', hanzi: '他', pinyin: 'Tā', french: 'Il' },
          { id: 'sub_women', hanzi: '我们', pinyin: 'Wǒmen', french: 'Nous' },
          { id: 'sub_claire', hanzi: '克莱尔', pinyin: 'Kèlái’ěr', french: 'Claire' },
          { id: 'sub_kehu', hanzi: '客户', pinyin: 'Kèhù', french: 'Le client' },
          { id: 'sub_mama', hanzi: '妈妈', pinyin: 'Māma', french: 'Maman' },
        ],
      },
      {
        id: 'slot_verb',
        slotNumber: 2,
        label: 'Verbe & Modalité',
        colorTheme: 'emerald',
        options: [
          { 
            id: 'v_mai', 
            hanzi: '买', 
            pinyin: 'mǎi', 
            french: 'achète',
            verbConjugations: {
              sub_wo: 'achète',
              sub_ni: 'achètes',
              sub_ta: 'achète',
              sub_women: 'achetons',
              sub_claire: 'achète',
              sub_kehu: 'achète',
              sub_mama: 'achète',
            }
          },
          { 
            id: 'v_xiangmai', 
            hanzi: '想买', 
            pinyin: 'xiǎng mǎi', 
            french: 'veut acheter',
            verbConjugations: {
              sub_wo: 'veux acheter',
              sub_ni: 'veux acheter',
              sub_ta: 'veut acheter',
              sub_women: 'voulons acheter',
              sub_claire: 'veut acheter',
              sub_kehu: 'veut acheter',
              sub_mama: 'veut acheter',
            }
          },
          { 
            id: 'v_yaomai', 
            hanzi: '要买', 
            pinyin: 'yào mǎi', 
            french: 'doit acheter',
            verbConjugations: {
              sub_wo: 'dois acheter',
              sub_ni: 'dois acheter',
              sub_ta: 'doit acheter',
              sub_women: 'devons acheter',
              sub_claire: 'doit acheter',
              sub_kehu: 'doit acheter',
              sub_mama: 'doit acheter',
            }
          },
          { 
            id: 'v_dasuanmai', 
            hanzi: '打算买', 
            pinyin: 'dǎsuàn mǎi', 
            french: 'a l’intention d’acheter',
            verbConjugations: {
              sub_wo: 'ai l’intention d’acheter',
              sub_ni: 'as l’intention d’acheter',
              sub_ta: 'a l’intention d’acheter',
              sub_women: 'avons l’intention d’acheter',
              sub_claire: 'a l’intention d’acheter',
              sub_kehu: 'a l’intention d’acheter',
              sub_mama: 'a l’intention d’acheter',
            }
          },
          { 
            id: 'v_bumai', 
            hanzi: '不买', 
            pinyin: 'bù mǎi', 
            french: 'n’achète pas',
            verbConjugations: {
              sub_wo: 'n’achète pas',
              sub_ni: 'n’achètes pas',
              sub_ta: 'n’achète pas',
              sub_women: 'n’achetons pas',
              sub_claire: 'n’achète pas',
              sub_kehu: 'n’achète pas',
              sub_mama: 'n’achète pas',
            }
          },
          { 
            id: 'v_geinimai', 
            hanzi: '给你买', 
            pinyin: 'gěi nǐ mǎi', 
            french: 't’achète',
            verbConjugations: {
              sub_wo: 't’achète',
              sub_ni: 't’achètes',
              sub_ta: 't’achète',
              sub_women: 't’achetons',
              sub_claire: 't’achète',
              sub_kehu: 't’achète',
              sub_mama: 't’achète',
            }
          },
        ],
      },
      {
        id: 'slot_complement',
        slotNumber: 3,
        label: 'Objet / Article',
        colorTheme: 'amber',
        options: [
          { id: 'comp_shouji', hanzi: '新手机', pinyin: 'xīn shǒujī', french: 'un nouveau téléphone' },
          { id: 'comp_diannao', hanzi: '电脑', pinyin: 'diànnǎo', french: 'un ordinateur' },
          { id: 'comp_yifu', hanzi: '一件衣服', pinyin: 'yí jiàn yīfu', french: 'un vêtement' },
          { id: 'comp_shu', hanzi: '汉语书', pinyin: 'hànyǔ shū', french: 'un livre de chinois' },
          { id: 'comp_che', hanzi: '一辆车', pinyin: 'yí liàng chē', french: 'une voiture' },
          { id: 'comp_chaye', hanzi: '中国茶', pinyin: 'zhōngguó chá', french: 'du thé chinois' },
          { id: 'comp_jipiao', hanzi: '两张机票', pinyin: 'liǎng zhāng jīpiào', french: 'deux billets d’avion' },
          { id: 'comp_liwu', hanzi: '一个礼物', pinyin: 'yí gè lǐwù', french: 'un cadeau' },
        ],
      },
    ],
  },
};
export function analyzeAndGenerateCombinations(rawInput: string): CombinatoryAnalysisResult {
  const cleanInput = rawInput.trim();
  if (!cleanInput) {
    return {
      success: true,
      pattern: PREDEFINED_PATTERNS['pattern_qu'],
      isOfficialHsk: true,
      hasWarningBadge: false,
    };
  }

  const lower = cleanInput.toLowerCase().replace(/[\s\-_]/g, '');
  const cleanPinyinQuery = normalizePinyin(cleanInput);
  const hskDb = getGlobalHskDatabase();

  // 1. Matches predefined shortcuts
  if (cleanInput === '去' || lower === 'qu' || lower.includes('aller')) {
    return { 
      success: true, 
      pattern: PREDEFINED_PATTERNS['pattern_qu'],
      isOfficialHsk: true,
      hasWarningBadge: false,
    };
  }
  if (cleanInput === '吃' || lower === 'chi' || lower.includes('manger')) {
    return { 
      success: true, 
      pattern: PREDEFINED_PATTERNS['pattern_chi'],
      isOfficialHsk: true,
      hasWarningBadge: false,
    };
  }
  if (cleanInput === '买' || lower === 'mai' || lower.includes('acheter')) {
    return { 
      success: true, 
      pattern: PREDEFINED_PATTERNS['pattern_mai'],
      isOfficialHsk: true,
      hasWarningBadge: false,
    };
  }

  // Look up in curated LEXICON_DB first, then in full HSK 1-6 database
  const curatedMatch = LEXICON_DB[cleanInput] || LEXICON_DB[lower] || (cleanPinyinQuery ? LEXICON_DB[cleanPinyinQuery] : undefined);
  const hskMatch = hskDb.get(cleanInput) || hskDb.get(lower) || (cleanPinyinQuery ? hskDb.get(cleanPinyinQuery) : undefined);

  let matchedEntry = curatedMatch || (hskMatch ? {
    hanzi: hskMatch.hanzi,
    pinyin: hskMatch.pinyin,
    french: hskMatch.french,
    type: hskMatch.type,
  } : undefined);

  // Substring & Compound Word Fallback Matching
  if (!matchedEntry && cleanInput.length >= 2) {
    for (const [key, entry] of hskDb.entries()) {
      if (key.length >= 2 && (cleanInput.includes(key) || key.includes(cleanInput))) {
        matchedEntry = {
          hanzi: entry.hanzi,
          pinyin: entry.pinyin,
          french: entry.french,
          type: entry.type,
        };
        break;
      }
    }
  }

  const lexMatch = matchedEntry;
  const isOfficialHsk = Boolean(lexMatch);

  // 2. ADJECTIVES (Structure à 2 POSTES: Sujet / Thème + Adverbe & Adjectif)
  const isAdjective = lexMatch?.type === 'adj' || /^(漂亮|贵|好|大|小|热|冷|高兴|开心|难|容易|忙|便宜|快|慢|远|近|累|重要|帅|美|好吃|好喝|好听|好看|piàoliang|piaoliang|guì|gui|hǎo|hao|dà|da|xiǎo|xiao|rè|re|lěng|leng|gāoxìng|gaoxing|nán|nan|róngyì|rongyi|máng|mang|piányi|pianyi|kuài|kuai|màn|man|yuǎn|yuan|jìn|jin|lèi|lei|zhòngyào|zhongyao|hǎochī|haochi)$/i.test(cleanInput);

  if (isAdjective || lower.includes('beau') || lower.includes('cher') || lower.includes('bon') || lower.includes('chaud') || lower.includes('heureux') || lower.includes('difficile') || lower.includes('facile')) {
    const adjHanzi = lexMatch?.hanzi || (cleanInput.length <= 4 ? cleanInput : '漂亮');
    const adjPinyin = lexMatch?.pinyin || (lower.length <= 10 ? lower : 'piàoliang');
    const adjFrench = lexMatch?.french || 'beau / agréable';

    return {
      success: true,
      isOfficialHsk,
      hasWarningBadge: !isOfficialHsk,
      warningMessage: !isOfficialHsk ? 'Mot libre hors base standard — Structure générée avec vérification automatique.' : undefined,
      pattern: {
        id: `dynamic_adj_${cleanInput}`,
        pivotWord: adjHanzi,
        pivotPinyin: adjPinyin,
        pivotMeaning: adjFrench,
        grammaticalCategory: 'Adjectif descriptif',
        structureDescription: 'Sujet / Thème + Adverbe de Degré & Adjectif (2 postes réels)',
        isOfficialHsk,
        slots: [
          {
            id: 'slot_subject',
            slotNumber: 1,
            label: 'Sujet / Thème',
            colorTheme: 'purple',
            options: [
              { id: 'sub_yifu', hanzi: '这件衣服', pinyin: 'Zhè jiàn yīfu', french: 'Ce vêtement' },
              { id: 'sub_shouji', hanzi: '这个新手机', pinyin: 'Zhè gè xīn shǒujī', french: 'Ce nouveau téléphone' },
              { id: 'sub_tianqi', hanzi: '今天的天气', pinyin: 'Jīntiān de tiānqì', french: 'Le temps d’aujourd’hui' },
              { id: 'sub_hanyu', hanzi: '学汉语', pinyin: 'Xué hànyǔ', french: 'Apprendre le chinois' },
              { id: 'sub_gongsi', hanzi: '我们公司', pinyin: 'Wǒmen gōngsī', french: 'Notre entreprise' },
              { id: 'sub_laoban', hanzi: '老板', pinyin: 'Lǎobǎn', french: 'Le patron' },
              { id: 'sub_espoir', hanzi: 'Espoir Chinois', pinyin: 'Espoir Chinois', french: 'Espoir Chinois' },
              { id: 'sub_dajia', hanzi: '大家', pinyin: 'Dàjiā', french: 'Tout le monde' },
            ],
          },
          {
            id: 'slot_adj_phrase',
            slotNumber: 2,
            label: 'Degré & Adjectif',
            colorTheme: 'emerald',
            options: [
              { id: 'deg_hen', hanzi: `很${adjHanzi}`, pinyin: `hěn ${adjPinyin}`, french: `est très ${adjFrench}` },
              { id: 'deg_feichang', hanzi: `非常${adjHanzi}`, pinyin: `fēicháng ${adjPinyin}`, french: `est extrêmement ${adjFrench}` },
              { id: 'deg_tai', hanzi: `太${adjHanzi}了`, pinyin: `tài ${adjPinyin} le`, french: `est vraiment trop ${adjFrench}` },
              { id: 'deg_bu', hanzi: `不${adjHanzi}`, pinyin: `bù ${adjPinyin}`, french: `n’est pas ${adjFrench}` },
              { id: 'deg_tebie', hanzi: `特别${adjHanzi}`, pinyin: `tèbié ${adjPinyin}`, french: `est particulièrement ${adjFrench}` },
              { id: 'deg_zui', hanzi: `最${adjHanzi}`, pinyin: `zuì ${adjPinyin}`, french: `est le plus ${adjFrench}` },
            ],
          },
        ],
      },
    };
  }

  // 3. INTRANSITIVE VERBS / ACTIONS (Structure à 2 POSTES: Sujet + Verbe & Modalité / Temps)
  const isIntransitive = lexMatch?.type === 'intrans' || /^(休息|睡觉|睡|走|走走|散步|工作|上班|下班|生病|迟到|来|起床|跑步|xiuxi|xiūxi|shuìjiào|shuijiao|zǒu|zou|gōngzuò|gongzuo|shàngbān|shangban|xiàbān|xiaban|shēngbìng|shengbing|chídào|chidao|lái|lai|qǐchuáng|qichuang|pǎobù|paobu)$/i.test(cleanInput);

  if (isIntransitive || lower.includes('reposer') || lower.includes('dormir') || lower.includes('partir') || lower.includes('travailler')) {
    const vHanzi = lexMatch?.hanzi || (cleanInput.length <= 4 ? cleanInput : '休息');
    const vPinyin = lexMatch?.pinyin || (lower.length <= 10 ? lower : 'xiūxi');
    const vFrench = lexMatch?.french || 'se reposer';

    return {
      success: true,
      isOfficialHsk,
      hasWarningBadge: !isOfficialHsk,
      warningMessage: !isOfficialHsk ? 'Mot libre hors base standard — Structure générée avec vérification automatique.' : undefined,
      pattern: {
        id: `dynamic_intrans_${cleanInput}`,
        pivotWord: vHanzi,
        pivotPinyin: vPinyin,
        pivotMeaning: vFrench,
        grammaticalCategory: 'Verbe intransitif (action sans complément)',
        structureDescription: 'Sujet / Acteur + Verbe & Modalité Temporelle (2 postes réels)',
        isOfficialHsk,
        slots: [
          {
            id: 'slot_subject',
            slotNumber: 1,
            label: 'Sujet / Acteur',
            colorTheme: 'purple',
            options: [
              { id: 'sub_wo', hanzi: '我', pinyin: 'Wǒ', french: 'Je' },
              { id: 'sub_ni', hanzi: '你', pinyin: 'Nǐ', french: 'Tu' },
              { id: 'sub_ta', hanzi: '他', pinyin: 'Tā', french: 'Il' },
              { id: 'sub_women', hanzi: '我们', pinyin: 'Wǒmen', french: 'Nous' },
              { id: 'sub_lily', hanzi: '莉莉', pinyin: 'Lìli', french: 'Lily' },
              { id: 'sub_tongshi', hanzi: '同事们', pinyin: 'Tóngshìmen', french: 'Les collègues' },
              { id: 'sub_jingli', hanzi: '王经理', pinyin: 'Wáng jīnglǐ', french: 'Le directeur Wang' },
            ],
          },
          {
            id: 'slot_verb_mod',
            slotNumber: 2,
            label: 'Verbe & Modalité',
            colorTheme: 'emerald',
            options: [
              { 
                id: 'vm_now', 
                hanzi: `正在${vHanzi}`, 
                pinyin: `zhèngzài ${vPinyin}`, 
                french: `est en train de ${vFrench}`,
                verbConjugations: {
                  sub_wo: `suis en train de ${vFrench}`,
                  sub_ni: `es en train de ${vFrench}`,
                  sub_ta: `est en train de ${vFrench}`,
                  sub_women: `sommes en train de ${vFrench}`,
                  sub_lily: `est en train de ${vFrench}`,
                  sub_tongshi: `sont en train de ${vFrench}`,
                  sub_jingli: `est en train de ${vFrench}`,
                }
              },
              { 
                id: 'vm_want', 
                hanzi: `想${vHanzi}`, 
                pinyin: `xiǎng ${vPinyin}`, 
                french: `veut ${vFrench}`,
                verbConjugations: {
                  sub_wo: `veux ${vFrench}`,
                  sub_ni: `veux ${vFrench}`,
                  sub_ta: `veut ${vFrench}`,
                  sub_women: `voulons ${vFrench}`,
                  sub_lily: `veut ${vFrench}`,
                  sub_tongshi: `veulent ${vFrench}`,
                  sub_jingli: `veut ${vFrench}`,
                }
              },
              { 
                id: 'vm_home', 
                hanzi: `在家里${vHanzi}`, 
                pinyin: `zài jiālǐ ${vPinyin}`, 
                french: `se repose à la maison`,
                verbConjugations: {
                  sub_wo: `me repose à la maison`,
                  sub_ni: `te reposes à la maison`,
                  sub_ta: `se repose à la maison`,
                  sub_women: `nous reposons à la maison`,
                  sub_lily: `se repose à la maison`,
                  sub_tongshi: `se reposent à la maison`,
                  sub_jingli: `se repose à la maison`,
                }
              },
              { 
                id: 'vm_tonight', 
                hanzi: `今天晚上${vHanzi}`, 
                pinyin: `jīntiān wǎnshang ${vPinyin}`, 
                french: `se repose ce soir`,
                verbConjugations: {
                  sub_wo: `me repose ce soir`,
                  sub_ni: `te reposes ce soir`,
                  sub_ta: `se repose ce soir`,
                  sub_women: `nous reposons ce soir`,
                  sub_lily: `se repose ce soir`,
                  sub_tongshi: `se reposent ce soir`,
                  sub_jingli: `se repose ce soir`,
                }
              },
              { 
                id: 'vm_plan', 
                hanzi: `打算${vHanzi}`, 
                pinyin: `dǎsuàn ${vPinyin}`, 
                french: `a l’intention de ${vFrench}`,
                verbConjugations: {
                  sub_wo: `ai l’intention de ${vFrench}`,
                  sub_ni: `as l’intention de ${vFrench}`,
                  sub_ta: `a l’intention de ${vFrench}`,
                  sub_women: `avons l’intention de ${vFrench}`,
                  sub_lily: `a l’intention de ${vFrench}`,
                  sub_tongshi: `ont l’intention de ${vFrench}`,
                  sub_jingli: `a l’intention de ${vFrench}`,
                }
              },
            ],
          },
        ],
      },
    };
  }

  // 4. NOUNS / OBJECTS / LOCATIONS (Structure à 3 POSTES où le mot saisi est le Complément pivot)
  const isLocationNoun = /^(上面|下面|里面|外面|前面|后面|左边|右边|旁边|shàngmian|shangmian|xiàmian|xiamian|lǐmian|limian|wàimian|waimian|qiánmian|qianmian|hòumian|houmian|zuǒbian|zuobian|yòubian|youbian|pángbiān|pangbian)$/i.test(cleanInput) || (lexMatch?.french.includes('dessus') || lexMatch?.french.includes('dessous') || lexMatch?.french.includes('dedans') || lexMatch?.french.includes('dehors'));
  const isNoun = lexMatch?.type === 'noun' || isLocationNoun || /^(咖啡|茶|水|中国|北京|上海|电脑|汉语|中文|钱|手机|衣服|书|车|飞机|机票|礼物|朋友|工作|kāfēi|kafei|chá|cha|shuǐ|shui|zhōngguó|zhongguo|běijīng|beijing|shànghǎi|shanghai|diànnǎo|diannao|hànyǔ|hanyu|zhōngwén|zhongwen|qián|qian|shǒujī|shouji|yīfu|yifu|shū|shu|chē|che|jīpiào|jipiao|lǐwù|liwu)$/i.test(cleanInput);

  if (isNoun || lower.includes('café') || lower.includes('thé') || lower.includes('chine') || lower.includes('livre') || lower.includes('ordinateur') || lower.includes('dessus') || lower.includes('dessous')) {
    const nHanzi = lexMatch?.hanzi || cleanInput;
    const nPinyin = lexMatch?.pinyin || lower;
    const nFrench = lexMatch?.french || 'cet objet';

    if (isLocationNoun) {
      return {
        success: true,
        isOfficialHsk,
        hasWarningBadge: !isOfficialHsk,
        warningMessage: !isOfficialHsk ? 'Mot libre hors base standard — Structure générée avec vérification automatique.' : undefined,
        pattern: {
          id: `dynamic_loc_${cleanInput}`,
          pivotWord: nHanzi,
          pivotPinyin: nPinyin,
          pivotMeaning: nFrench,
          grammaticalCategory: 'Nom d’orientation spatiale / Lieu',
          structureDescription: 'Objet / Sujet + Verbe de Position + Lieu Pivot (3 postes)',
          isOfficialHsk,
          slots: [
            {
              id: 'slot_subject',
              slotNumber: 1,
              label: 'Objet / Sujet',
              colorTheme: 'purple',
              options: [
                { id: 'sub_book', hanzi: '这本汉语书', pinyin: 'Zhè běn hànyǔ shū', french: 'Ce livre de chinois' },
                { id: 'sub_phone', hanzi: '我的新手机', pinyin: 'Wǒ de xīn shǒujī', french: 'Mon nouveau téléphone' },
                { id: 'sub_doc', hanzi: '这份重要文件', pinyin: 'Zhè fèn zhòngyào wénjiàn', french: 'Ce document important' },
                { id: 'sub_tea', hanzi: '一杯热中国茶', pinyin: 'Yì bēi rè zhōngguó chá', french: 'Une tasse de thé chaud' },
                { id: 'sub_pc', hanzi: '这台电脑', pinyin: 'Zhè tái diànnǎo', french: 'Cet ordinateur' },
              ],
            },
            {
              id: 'slot_verb',
              slotNumber: 2,
              label: 'Position & Verbe',
              colorTheme: 'emerald',
              options: [
                { 
                  id: 'v_placed', 
                  hanzi: '放在', 
                  pinyin: 'fàng zài', 
                  french: 'est posé sur',
                  verbConjugations: {
                    sub_book: 'est posé sur',
                    sub_phone: 'est posé sur',
                    sub_doc: 'est posé sur',
                    sub_tea: 'est posée sur',
                    sub_pc: 'est posé sur',
                  }
                },
                { 
                  id: 'v_at', 
                  hanzi: '就在', 
                  pinyin: 'jiù zài', 
                  french: 'se trouve sur',
                  verbConjugations: {
                    sub_book: 'se trouve sur',
                    sub_phone: 'se trouve sur',
                    sub_doc: 'se trouve sur',
                    sub_tea: 'se trouve sur',
                    sub_pc: 'se trouve sur',
                  }
                },
                { 
                  id: 'v_want_put', 
                  hanzi: '想放在', 
                  pinyin: 'xiǎng fàng zài', 
                  french: 'doit être posé sur',
                  verbConjugations: {
                    sub_book: 'doit être posé sur',
                    sub_phone: 'doit être posé sur',
                    sub_doc: 'doit être posé sur',
                    sub_tea: 'doit être posée sur',
                    sub_pc: 'doit être posé sur',
                  }
                },
              ],
            },
            {
              id: 'slot_complement',
              slotNumber: 3,
              label: 'Lieu Pivot & Support',
              colorTheme: 'amber',
              options: [
                { id: 'comp_table', hanzi: `桌子${nHanzi}`, pinyin: `zhuōzi ${nPinyin}`, french: `la table` },
                { id: 'comp_desk', hanzi: `办公桌${nHanzi}`, pinyin: `bàngōngzhuō ${nPinyin}`, french: `le bureau de travail` },
                { id: 'comp_sofa', hanzi: `沙发${nHanzi}`, pinyin: `shāfā ${nPinyin}`, french: `le canapé` },
                { id: 'comp_cabinet', hanzi: `柜子${nHanzi}`, pinyin: `guìzi ${nPinyin}`, french: `l’armoire` },
              ],
            },
          ],
        },
      };
    }

    return {
      success: true,
      isOfficialHsk,
      hasWarningBadge: !isOfficialHsk,
      warningMessage: !isOfficialHsk ? 'Mot libre hors base standard — Structure générée avec vérification automatique.' : undefined,
      pattern: {
        id: `dynamic_noun_${cleanInput}`,
        pivotWord: nHanzi,
        pivotPinyin: nPinyin,
        pivotMeaning: nFrench,
        grammaticalCategory: 'Nom / Objet appelant Sujet + Action',
        structureDescription: 'Sujet + Verbe & Modalité + Objet Pivot (3 postes)',
        isOfficialHsk,
        slots: [
          {
            id: 'slot_subject',
            slotNumber: 1,
            label: 'Sujet / Acteur',
            colorTheme: 'purple',
            options: [
              { id: 'sub_wo', hanzi: '我', pinyin: 'Wǒ', french: 'Je' },
              { id: 'sub_ni', hanzi: '你', pinyin: 'Nǐ', french: 'Tu' },
              { id: 'sub_ta', hanzi: '他', pinyin: 'Tā', french: 'Il' },
              { id: 'sub_women', hanzi: '我们', pinyin: 'Wǒmen', french: 'Nous' },
              { id: 'sub_claire', hanzi: '克莱尔', pinyin: 'Kèlái’ěr', french: 'Claire' },
              { id: 'sub_kehu', hanzi: '客户', pinyin: 'Kèhù', french: 'Le client' },
              { id: 'sub_jingli', hanzi: '李经理', pinyin: 'Lǐ jīnglǐ', french: 'Le directeur Li' },
            ],
          },
          {
            id: 'slot_verb',
            slotNumber: 2,
            label: 'Verbe & Action',
            colorTheme: 'emerald',
            options: [
              { 
                id: 'v_buy', 
                hanzi: '想买', 
                pinyin: 'xiǎng mǎi', 
                french: 'veut acheter',
                verbConjugations: {
                  sub_wo: 'veux acheter',
                  sub_ni: 'veux acheter',
                  sub_ta: 'veut acheter',
                  sub_women: 'voulons acheter',
                  sub_claire: 'veut acheter',
                  sub_kehu: 'veut acheter',
                  sub_jingli: 'veut acheter',
                }
              },
              { 
                id: 'v_like', 
                hanzi: '很喜欢', 
                pinyin: 'hěn xǐhuan', 
                french: 'aime beaucoup',
                verbConjugations: {
                  sub_wo: 'aime beaucoup',
                  sub_ni: 'aimes beaucoup',
                  sub_ta: 'aime beaucoup',
                  sub_women: 'aimons beaucoup',
                  sub_claire: 'aime beaucoup',
                  sub_kehu: 'aime beaucoup',
                  sub_jingli: 'aime beaucoup',
                }
              },
              { 
                id: 'v_need', 
                hanzi: '需要', 
                pinyin: 'xūyào', 
                french: 'a besoin de',
                verbConjugations: {
                  sub_wo: 'ai besoin de',
                  sub_ni: 'as besoin de',
                  sub_ta: 'a besoin de',
                  sub_women: 'avons besoin de',
                  sub_claire: 'a besoin de',
                  sub_kehu: 'a besoin de',
                  sub_jingli: 'a besoin de',
                }
              },
              { 
                id: 'v_look', 
                hanzi: '正在看', 
                pinyin: 'zhèngzài kàn', 
                french: 'est en train de regarder',
                verbConjugations: {
                  sub_wo: 'suis en train de regarder',
                  sub_ni: 'es en train de regarder',
                  sub_ta: 'est en train de regarder',
                  sub_women: 'sommes en train de regarder',
                  sub_claire: 'est en train de regarder',
                  sub_kehu: 'est en train de regarder',
                  sub_jingli: 'est en train de regarder',
                }
              },
            ],
          },
          {
            id: 'slot_complement',
            slotNumber: 3,
            label: 'Objet Pivot & Déclinaisons',
            colorTheme: 'amber',
            options: [
              { id: 'comp_this', hanzi: `这个${nHanzi}`, pinyin: `zhè gè ${nPinyin}`, french: `ce ${nFrench}` },
              { id: 'comp_new', hanzi: `新的${nHanzi}`, pinyin: `xīn de ${nPinyin}`, french: `ce nouveau ${nFrench}` },
              { id: 'comp_chinese', hanzi: `中国的${nHanzi}`, pinyin: `zhōngguó de ${nPinyin}`, french: `ce ${nFrench} de Chine` },
              { id: 'comp_best', hanzi: `最好的${nHanzi}`, pinyin: `zuì hǎo de ${nPinyin}`, french: `le meilleur ${nFrench}` },
            ],
          },
        ],
      },
    };
  }

  // 5. OTHER TRANSITIVE ACTION VERBS (e.g. 知道, 学, 学会, 看, 做, 喝, 写, 说, 听, 问, 找, 帮)
  const isKnowingVerb = /^(知道|zhīdào|zhidao|懂|dǒng|dong|明白|míngbai|mingbai)$/i.test(cleanInput) || (lexMatch?.french.includes('savoir') || lexMatch?.french.includes('comprendre') || lexMatch?.french.includes('au courant'));
  const isActionVerb = isKnowingVerb || lexMatch?.type === 'trans' || /^(知道|学|学会|学习|看|做|喝|写|说|听|问|找|帮|用|带|送|给|开|认识|zhidao|zhīdào|xué|xue|xuéhuì|xuehui|xuéxí|xuexi|kàn|kan|zuò|zuo|hē|he|xiě|xie|shuō|shuo|tīng|ting|wèn|wen|zhǎo|zhao|bāng|bang|yòng|yong|dài|dai|sòng|song|gěi|gei|kāi|kai|rènshi|renshi)$/i.test(cleanInput);

  if (isActionVerb || cleanInput.length <= 6) {
    const vHanzi = lexMatch?.hanzi || cleanInput;
    const vPinyin = lexMatch?.pinyin || lower;
    // Traduction 100% française garantie sans caractère chinois
    const vFrench = isKnowingVerb ? 'savoir' : (lexMatch?.french || (vHanzi === '学会' ? 'maîtriser' : vHanzi === '学' ? 'apprendre' : 'pratiquer'));

    // Adaptations idiomatiques précises selon le verbe
    const isLearningVerb = !isKnowingVerb && (/^(学|学会|学习|xué|xue|xuéhuì|xuehui|xuéxí|xuexi)$/i.test(vHanzi) || vFrench.includes('apprendre') || vFrench.includes('maîtriser') || vFrench.includes('étudier'));
    const isDrinkingVerb = !isKnowingVerb && (/^(喝|hē|he)$/i.test(vHanzi) || vFrench.includes('boire'));
    const isWritingVerb = !isKnowingVerb && (/^(写|xiě|xie)$/i.test(vHanzi) || vFrench.includes('écrire'));

    // Compléments naturels et idiomatiques
    let complementOptions: CombinatoryOption[] = [
      { id: 'comp_chinese', hanzi: '中文内容', pinyin: 'zhōngwén nèiróng', french: 'le contenu en chinois' },
      { id: 'comp_hsk', hanzi: 'HSK词汇', pinyin: 'HSK cíhuì', french: 'le vocabulaire HSK' },
      { id: 'comp_business', hanzi: '商业文件', pinyin: 'shāngyè wénjiàn', french: 'le document commercial' },
      { id: 'comp_plan', hanzi: '这个新项目', pinyin: 'zhè gè xīn xiàngmù', french: 'ce nouveau projet' },
      { id: 'comp_daily', hanzi: '日常会话', pinyin: 'rìcháng huìhuà', french: 'la conversation quotidienne' },
    ];

    let verbOptions: CombinatoryOption[] = [
      { 
        id: 'v_simple', 
        hanzi: vHanzi, 
        pinyin: vPinyin, 
        french: vFrench,
        verbConjugations: {
          sub_wo: vFrench === 'savoir' ? 'sais' : vFrench,
          sub_ni: vFrench === 'savoir' ? 'sais' : vFrench,
          sub_ta: vFrench === 'savoir' ? 'sait' : vFrench,
          sub_women: vFrench === 'savoir' ? 'savons' : vFrench,
          sub_anthony: vFrench === 'savoir' ? 'sait' : vFrench,
          sub_laoshi: vFrench === 'savoir' ? 'sait' : vFrench,
          sub_dajia: vFrench === 'savoir' ? 'sait' : vFrench,
        }
      },
      { 
        id: 'v_want', 
        hanzi: `想${vHanzi}`, 
        pinyin: `xiǎng ${vPinyin}`, 
        french: `veut ${vFrench}`,
        verbConjugations: {
          sub_wo: `veux ${vFrench}`,
          sub_ni: `veux ${vFrench}`,
          sub_ta: `veut ${vFrench}`,
          sub_women: `voulons ${vFrench}`,
          sub_anthony: `veut ${vFrench}`,
          sub_laoshi: `veut ${vFrench}`,
          sub_dajia: `veut ${vFrench}`,
        }
      },
      { 
        id: 'v_like', 
        hanzi: `喜欢${vHanzi}`, 
        pinyin: `xǐhuan ${vPinyin}`, 
        french: `aime ${vFrench}`,
        verbConjugations: {
          sub_wo: `aime ${vFrench}`,
          sub_ni: `aimes ${vFrench}`,
          sub_ta: `aime ${vFrench}`,
          sub_women: `aimons ${vFrench}`,
          sub_anthony: `aime ${vFrench}`,
          sub_laoshi: `aime ${vFrench}`,
          sub_dajia: `aime ${vFrench}`,
        }
      },
      { 
        id: 'v_now', 
        hanzi: `正在${vHanzi}`, 
        pinyin: `zhèngzài ${vPinyin}`, 
        french: `est en train de ${vFrench}`,
        verbConjugations: {
          sub_wo: `suis en train de ${vFrench}`,
          sub_ni: `es en train de ${vFrench}`,
          sub_ta: `est en train de ${vFrench}`,
          sub_women: `sommes en train de ${vFrench}`,
          sub_anthony: `est en train de ${vFrench}`,
          sub_laoshi: `est en train de ${vFrench}`,
          sub_dajia: `est en train de ${vFrench}`,
        }
      },
      { 
        id: 'v_plan', 
        hanzi: `打算${vHanzi}`, 
        pinyin: `dǎsuàn ${vPinyin}`, 
        french: `a l’intention de ${vFrench}`,
        verbConjugations: {
          sub_wo: `ai l’intention de ${vFrench}`,
          sub_ni: `as l’intention de ${vFrench}`,
          sub_ta: `a l’intention de ${vFrench}`,
          sub_women: `avons l’intention de ${vFrench}`,
          sub_anthony: `a l’intention de ${vFrench}`,
          sub_laoshi: `a l’intention de ${vFrench}`,
          sub_dajia: `a l’intention de ${vFrench}`,
        }
      },
    ];

    if (isKnowingVerb) {
      complementOptions = [
        { id: 'comp_matter', hanzi: '这件事情', pinyin: 'zhè jiàn shìqing', french: 'cette affaire' },
        { id: 'comp_secret', hanzi: '这个秘密', pinyin: 'zhè gè mìmì', french: 'ce secret' },
        { id: 'comp_answer', hanzi: '正确的答案', pinyin: 'zhèngquè de dá’àn', french: 'la bonne réponse' },
        { id: 'comp_detail', hanzi: '详细的情况', pinyin: 'xiángxì de qíngkuàng', french: 'la situation détaillée' },
        { id: 'comp_truth', hanzi: '事实的真相', pinyin: 'shìshí de zhēnxiàng', french: 'la vérité' },
        { id: 'comp_address', hanzi: '具体的地址', pinyin: 'jùtǐ de dìzhǐ', french: 'l’adresse exacte' },
      ];

      verbOptions = [
        { 
          id: 'v_simple', 
          hanzi: '知道', 
          pinyin: 'zhīdào', 
          french: 'sait',
          verbConjugations: {
            sub_wo: 'sais',
            sub_ni: 'sais',
            sub_ta: 'sait',
            sub_women: 'savons',
            sub_anthony: 'sait',
            sub_laoshi: 'sait',
            sub_dajia: 'sait',
          }
        },
        { 
          id: 'v_want_know', 
          hanzi: '想知道', 
          pinyin: 'xiǎng zhīdào', 
          french: 'veut savoir',
          verbConjugations: {
            sub_wo: 'veux savoir',
            sub_ni: 'veux savoir',
            sub_ta: 'veut savoir',
            sub_women: 'voulons savoir',
            sub_anthony: 'veut savoir',
            sub_laoshi: 'veut savoir',
            sub_dajia: 'veut savoir',
          }
        },
        { 
          id: 'v_already_know', 
          hanzi: '已经知道', 
          pinyin: 'yǐjīng zhīdào', 
          french: 'sait déjà',
          verbConjugations: {
            sub_wo: 'sais déjà',
            sub_ni: 'sais déjà',
            sub_ta: 'sait déjà',
            sub_women: 'savons déjà',
            sub_anthony: 'sait déjà',
            sub_laoshi: 'sait déjà',
            sub_dajia: 'sait déjà',
          }
        },
        { 
          id: 'v_very_want', 
          hanzi: '很想知道', 
          pinyin: 'hěn xiǎng zhīdào', 
          french: 'veut vraiment savoir',
          verbConjugations: {
            sub_wo: 'veux vraiment savoir',
            sub_ni: 'veux vraiment savoir',
            sub_ta: 'veut vraiment savoir',
            sub_women: 'voulons vraiment savoir',
            sub_anthony: 'veut vraiment savoir',
            sub_laoshi: 'veut vraiment savoir',
            sub_dajia: 'veut vraiment savoir',
          }
        },
        { 
          id: 'v_must_know', 
          hanzi: '一定要知道', 
          pinyin: 'yídìng yào zhīdào', 
          french: 'doit absolument savoir',
          verbConjugations: {
            sub_wo: 'dois absolument savoir',
            sub_ni: 'dois absolument savoir',
            sub_ta: 'doit absolument savoir',
            sub_women: 'devons absolument savoir',
            sub_anthony: 'doit absolument savoir',
            sub_laoshi: 'doit absolument savoir',
            sub_dajia: 'doit absolument savoir',
          }
        },
      ];
    } else if (isLearningVerb) {
      complementOptions = [
        { id: 'comp_hsk_words', hanzi: 'HSK词汇', pinyin: 'HSK cíhuì', french: 'le vocabulaire HSK' },
        { id: 'comp_hanyu', hanzi: '汉语', pinyin: 'hànyǔ', french: 'le chinois mandarin' },
        { id: 'comp_grammar', hanzi: '中文语法', pinyin: 'zhōngwén yǔfǎ', french: 'la grammaire chinoise' },
        { id: 'comp_hanzi', hanzi: '这些汉字', pinyin: 'zhèxiē hànzì', french: 'ces caractères chinois' },
        { id: 'comp_lesson', hanzi: '这节新课', pinyin: 'zhè jié xīn kè', french: 'cette nouvelle leçon' },
      ];
    } else if (isDrinkingVerb) {
      complementOptions = [
        { id: 'comp_cha', hanzi: '中国茶', pinyin: 'zhōngguó chá', french: 'du thé chinois' },
        { id: 'comp_kafei', hanzi: '热咖啡', pinyin: 'rè kāfēi', french: 'du café chaud' },
        { id: 'comp_shui', hanzi: '矿泉水', pinyin: 'kuàngquánshuǐ', french: 'de l’eau minérale' },
        { id: 'comp_guozhi', hanzi: '鲜果汁', pinyin: 'xiān guǒzhī', french: 'du jus de fruits frais' },
      ];
    } else if (isWritingVerb) {
      complementOptions = [
        { id: 'comp_hanzi', hanzi: '中国汉字', pinyin: 'zhōngguó hànzì', french: 'les caractères chinois' },
        { id: 'comp_email', hanzi: '一封邮件', pinyin: 'yì fēng yóujiàn', french: 'un e-mail professionnel' },
        { id: 'comp_report', hanzi: '工作报告', pinyin: 'gōngzuò bàogào', french: 'le rapport de travail' },
      ];
    }

    if (!isOfficialHsk) {
      return {
        success: false,
        errorMessage: `Le terme « ${cleanInput} » n’a pas de structure combinatoire certifiée à 100%. Essayez l'un des mots pivots vérifiés ci-dessous.`,
        suggestedPivots: [
          { hanzi: '去', pinyin: 'qù', meaning: 'Aller' },
          { hanzi: '吃', pinyin: 'chī', meaning: 'Manger' },
          { hanzi: '买', pinyin: 'mǎi', meaning: 'Acheter' },
          { hanzi: '漂亮', pinyin: 'piàoliang', meaning: 'Beau / Élégant' },
          { hanzi: '休息', pinyin: 'xiūxi', meaning: 'Se reposer' },
        ],
      };
    }

    return {
      success: true,
      isOfficialHsk: true,
      hasWarningBadge: false,
      pattern: {
        id: `dynamic_verb_${cleanInput}`,
        pivotWord: vHanzi,
        pivotPinyin: vPinyin,
        pivotMeaning: vFrench,
        grammaticalCategory: 'Verbe d’action transitif',
        structureDescription: 'Sujet + Verbe & Modalité + Complément d’Objet (3 postes)',
        isOfficialHsk: true,
        slots: [
          {
            id: 'slot_subject',
            slotNumber: 1,
            label: 'Sujet / Acteur',
            colorTheme: 'purple',
            options: [
              { id: 'sub_wo', hanzi: '我', pinyin: 'Wǒ', french: 'Je' },
              { id: 'sub_ni', hanzi: '你', pinyin: 'Nǐ', french: 'Tu' },
              { id: 'sub_ta', hanzi: '他', pinyin: 'Tā', french: 'Il' },
              { id: 'sub_women', hanzi: '我们', pinyin: 'Wǒmen', french: 'Nous' },
              { id: 'sub_anthony', hanzi: '安东尼', pinyin: 'Āndōngní', french: 'Anthony' },
              { id: 'sub_laoshi', hanzi: '老师', pinyin: 'Lǎoshī', french: 'Le professeur' },
              { id: 'sub_dajia', hanzi: '大家', pinyin: 'Dàjiā', french: 'Tout le monde' },
            ],
          },
          {
            id: 'slot_verb',
            slotNumber: 2,
            label: 'Verbe & Modalité',
            colorTheme: 'emerald',
            options: verbOptions,
          },
          {
            id: 'slot_complement',
            slotNumber: 3,
            label: 'Complément / Objet',
            colorTheme: 'amber',
            options: complementOptions,
          },
        ],
      },
    };
  }

  // 6. ÉCHEC BIENVEILLANT
  return {
    success: false,
    errorMessage: `Le terme « ${cleanInput} » ne permet pas de construire une structure de phrase naturelle et combinable.`,
    suggestedPivots: [
      { hanzi: '去', pinyin: 'qù', meaning: 'Aller' },
      { hanzi: '吃', pinyin: 'chī', meaning: 'Manger' },
      { hanzi: '买', pinyin: 'mǎi', meaning: 'Acheter' },
      { hanzi: '漂亮', pinyin: 'piàoliang', meaning: 'Beau / Élégant' },
      { hanzi: '休息', pinyin: 'xiūxi', meaning: 'Se reposer' },
    ],
  };
}
