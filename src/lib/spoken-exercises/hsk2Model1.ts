import { SpokenExerciseModel } from './types';
import { CombinatoryOption } from '@/lib/combination/combinationEngine';

// Case 1 : Noms du quotidien (10 options - HSK 1 & HSK 2)
export const ALL_NOUNS_HSK2: CombinatoryOption[] = [
  { id: 'noun_dianhua', hanzi: '电话', pinyin: 'diànhuà', french: 'le téléphone' },
  { id: 'noun_men', hanzi: '门', pinyin: 'mén', french: 'la porte' },
  { id: 'noun_fan', hanzi: '饭', pinyin: 'fàn', french: 'le repas' },
  { id: 'noun_cai', hanzi: '菜', pinyin: 'cài', french: 'le plat' },
  { id: 'noun_shu', hanzi: '书', pinyin: 'shū', french: 'le livre' },
  { id: 'noun_yifu', hanzi: '衣服', pinyin: 'yīfu', french: 'les vêtements' },
  { id: 'noun_xin', hanzi: '信', pinyin: 'xìn', french: 'la lettre' },
  { id: 'noun_liwu', hanzi: '礼物', pinyin: 'lǐwù', french: 'le cadeau' },
  { id: 'noun_kafei', hanzi: '咖啡', pinyin: 'kāfēi', french: 'le café' },
  { id: 'noun_che', hanzi: '车', pinyin: 'chē', french: 'la voiture' },
];

// Case 2 : Fixe - 是谁 (shì shéi) - Focalisation sur l'agent
export const FIXED_SHISHEI: CombinatoryOption = {
  id: 'fix_shishei',
  hanzi: '是谁',
  pinyin: 'shì shéi',
  french: 'qui a',
};

// Case 3 : Verbes d'action du quotidien (10 options - HSK 1 & HSK 2)
export const ALL_VERBS_HSK2: CombinatoryOption[] = [
  { id: 'v_jie', hanzi: '接', pinyin: 'jiē', french: 'répondu à / pris' },
  { id: 'v_mai', hanzi: '买', pinyin: 'mǎi', french: 'acheté' },
  { id: 'v_zuo', hanzi: '做', pinyin: 'zuò', french: 'préparé / cuisiné' },
  { id: 'v_kai', hanzi: '开', pinyin: 'kāi', french: 'ouvert / conduit' },
  { id: 'v_guan', hanzi: '关', pinyin: 'guān', french: 'fermé' },
  { id: 'v_song', hanzi: '送', pinyin: 'sòng', french: 'offert / apporté' },
  { id: 'v_xie', hanzi: '写', pinyin: 'xiě', french: 'écrit' },
  { id: 'v_xi', hanzi: '洗', pinyin: 'xǐ', french: 'lavé' },
  { id: 'v_na', hanzi: '拿', pinyin: 'ná', french: 'pris' },
  { id: 'v_he', hanzi: '喝', pinyin: 'hē', french: 'bu' },
];

// Case 4 : Fixe - 的 (de) - Marqueur de la structure 是……的
export const FIXED_DE: CombinatoryOption = {
  id: 'fix_de',
  hanzi: '的',
  pinyin: 'de',
  french: '',
};

/**
 * Matrice complète des traductions françaises naturelles pour les 36 combinaisons authentiques de la vraie vie :
 * ZÉRO caractère chinois dans la sortie, accords et prépositions naturels garantis.
 */
const HANDCRAFTED_FRENCH_MAP_HSK2: Record<string, string> = {
  // 1. 电话 (téléphone)
  'noun_dianhua_v_jie': 'Qui a répondu au téléphone ?',
  'noun_dianhua_v_mai': 'Qui a acheté le téléphone ?',
  'noun_dianhua_v_na': 'Qui a pris le téléphone ?',
  'noun_dianhua_v_song': 'Qui a offert le téléphone ?',

  // 2. 门 (porte)
  'noun_men_v_kai': 'Qui a ouvert la porte ?',
  'noun_men_v_guan': 'Qui a fermé la porte ?',

  // 3. 饭 (repas)
  'noun_fan_v_zuo': 'Qui a préparé le repas ?',
  'noun_fan_v_mai': 'Qui a acheté le repas ?',
  'noun_fan_v_song': 'Qui a livré le repas ?',

  // 4. 菜 (plat / légumes)
  'noun_cai_v_zuo': 'Qui a cuisiné ce plat ?',
  'noun_cai_v_mai': 'Qui a acheté les légumes ?',
  'noun_cai_v_xi': 'Qui a lavé les légumes ?',
  'noun_cai_v_song': 'Qui a apporté les plats ?',

  // 5. 书 (livre)
  'noun_shu_v_mai': 'Qui a acheté le livre ?',
  'noun_shu_v_xie': 'Qui a écrit le livre ?',
  'noun_shu_v_song': 'Qui a offert le livre ?',
  'noun_shu_v_na': 'Qui a pris le livre ?',

  // 6. 衣服 (vêtements)
  'noun_yifu_v_mai': 'Qui a acheté les vêtements ?',
  'noun_yifu_v_xi': 'Qui a lavé les vêtements ?',
  'noun_yifu_v_song': 'Qui a offert les vêtements ?',
  'noun_yifu_v_na': 'Qui a pris les vêtements ?',

  // 7. 信 (lettre)
  'noun_xin_v_xie': 'Qui a écrit la lettre ?',
  'noun_xin_v_song': 'Qui a apporté la lettre ?',
  'noun_xin_v_na': 'Qui a pris la lettre ?',
  'noun_xin_v_jie': 'Qui a réceptionné la lettre ?',

  // 8. 礼物 (cadeau)
  'noun_liwu_v_song': 'Qui a offert le cadeau ?',
  'noun_liwu_v_mai': 'Qui a acheté le cadeau ?',
  'noun_liwu_v_zuo': 'Qui a confectionné le cadeau ?',
  'noun_liwu_v_na': 'Qui a pris le cadeau ?',

  // 9. 咖啡 (café)
  'noun_kafei_v_he': 'Qui a bu le café ?',
  'noun_kafei_v_mai': 'Qui a acheté le café ?',
  'noun_kafei_v_zuo': 'Qui a préparé le café ?',
  'noun_kafei_v_song': 'Qui a apporté le café ?',

  // 10. 车 (voiture)
  'noun_che_v_kai': 'Qui a conduit la voiture ?',
  'noun_che_v_mai': 'Qui a acheté la voiture ?',
  'noun_che_v_xi': 'Qui a lavé la voiture ?',
};

export function buildFrenchSentenceHsk2Model1(selected: CombinatoryOption[]): string {
  const noun = selected[0] || ALL_NOUNS_HSK2[0];
  const verb = selected[2] || ALL_VERBS_HSK2[0];
  const key = `${noun.id}_${verb.id}`;
  if (HANDCRAFTED_FRENCH_MAP_HSK2[key]) {
    return HANDCRAFTED_FRENCH_MAP_HSK2[key];
  }
  return `Qui a ${verb.french} ${noun.french} ?`;
}

/**
 * Associations naturelles par défaut entre cases :
 * Garantit qu'en changeant une case (ex: "porte"), la case associée bascule instantanément
 * sur son action réelle de la vie quotidienne ("ouvrir" / "fermer"), évitant tout non-sens.
 */
export const PAIRED_SLOT_DEFAULTS_HSK2: Record<string, Record<string, Record<string, string>>> = {
  slot_noun: {
    noun_dianhua: { slot_verb: 'v_jie' },  // 电话是谁接的？ (Qui a répondu au téléphone ?)
    noun_men:     { slot_verb: 'v_kai' },  // 门是谁开的？   (Qui a ouvert la porte ?)
    noun_fan:     { slot_verb: 'v_zuo' },  // 饭是谁做的？   (Qui a préparé le repas ?)
    noun_cai:     { slot_verb: 'v_zuo' },  // 菜是谁做的？   (Qui a cuisiné ce plat ?)
    noun_shu:     { slot_verb: 'v_mai' },  // 书是谁买的？   (Qui a acheté le livre ?)
    noun_yifu:    { slot_verb: 'v_xi' },   // 衣服是谁洗的？ (Qui a lavé les vêtements ?)
    noun_xin:     { slot_verb: 'v_xie' },  // 信是谁写的？   (Qui a écrit la lettre ?)
    noun_liwu:    { slot_verb: 'v_song' }, // 礼物是谁送的？ (Qui a offert le cadeau ?)
    noun_kafei:   { slot_verb: 'v_he' },   // 咖啡是谁喝的？ (Qui a bu le café ?)
    noun_che:     { slot_verb: 'v_kai' },  // 车是谁开的？   (Qui a conduit la voiture ?)
  },
  slot_verb: {
    v_jie:  { slot_noun: 'noun_dianhua' }, // 接 -> 电话是谁接的？ (Qui a répondu au téléphone ?)
    v_mai:  { slot_noun: 'noun_yifu' },    // 买 -> 衣服是谁买的？ (Qui a acheté les vêtements ?)
    v_zuo:  { slot_noun: 'noun_fan' },     // 做 -> 饭是谁做的？   (Qui a préparé le repas ?)
    v_kai:  { slot_noun: 'noun_men' },     // 开 -> 门是谁开的？   (Qui a ouvert la porte ?)
    v_guan: { slot_noun: 'noun_men' },     // 关 -> 门是谁关的？   (Qui a fermé la porte ?)
    v_song: { slot_noun: 'noun_liwu' },    // 送 -> 礼物是谁送的？ (Qui a offert le cadeau ?)
    v_xie:  { slot_noun: 'noun_xin' },     // 写 -> 信是谁写的？   (Qui a écrit la lettre ?)
    v_xi:   { slot_noun: 'noun_yifu' },    // 洗 -> 衣服是谁洗的？ (Qui a lavé les vêtements ?)
    v_na:   { slot_noun: 'noun_shu' },     // 拿 -> 书是谁拿的？   (Qui a pris le livre ?)
    v_he:   { slot_noun: 'noun_kafei' },   // 喝 -> 咖啡是谁喝的？ (Qui a bu le café ?)
  },
};

/**
 * 36 combinaisons authentiques de la vraie vie :
 * Strictement filtrées pour éliminer tout non-sens (pas de "boire le téléphone" ni "écrire la porte").
 */
export const VALID_COMBINATIONS_HSK2_EP1 = [
  // 1. 电话 (téléphone)
  { id: 'c_dianhua_jie', slotSelections: { slot_noun: 'noun_dianhua', slot_verb: 'v_jie' }, hanzi: '电话是谁接的？', pinyin: 'Diànhuà shì shéi jiē de ?', french: 'Qui a répondu au téléphone ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_dianhua_v_jie.mp3' },
  { id: 'c_dianhua_mai', slotSelections: { slot_noun: 'noun_dianhua', slot_verb: 'v_mai' }, hanzi: '电话是谁买的？', pinyin: 'Diànhuà shì shéi mǎi de ?', french: 'Qui a acheté le téléphone ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_dianhua_v_mai.mp3' },
  { id: 'c_dianhua_na', slotSelections: { slot_noun: 'noun_dianhua', slot_verb: 'v_na' }, hanzi: '电话是谁拿的？', pinyin: 'Diànhuà shì shéi ná de ?', french: 'Qui a pris le téléphone ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_dianhua_v_na.mp3' },
  { id: 'c_dianhua_song', slotSelections: { slot_noun: 'noun_dianhua', slot_verb: 'v_song' }, hanzi: '电话是谁送的？', pinyin: 'Diànhuà shì shéi sòng de ?', french: 'Qui a offert le téléphone ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_dianhua_v_song.mp3' },

  // 2. 门 (porte)
  { id: 'c_men_kai', slotSelections: { slot_noun: 'noun_men', slot_verb: 'v_kai' }, hanzi: '门是谁开的？', pinyin: 'Mén shì shéi kāi de ?', french: 'Qui a ouvert la porte ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_men_v_kai.mp3' },
  { id: 'c_men_guan', slotSelections: { slot_noun: 'noun_men', slot_verb: 'v_guan' }, hanzi: '门是谁关的？', pinyin: 'Mén shì shéi guān de ?', french: 'Qui a fermé la porte ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_men_v_guan.mp3' },

  // 3. 饭 (repas)
  { id: 'c_fan_zuo', slotSelections: { slot_noun: 'noun_fan', slot_verb: 'v_zuo' }, hanzi: '饭是谁做的？', pinyin: 'Fàn shì shéi zuò de ?', french: 'Qui a préparé le repas ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_fan_v_zuo.mp3' },
  { id: 'c_fan_mai', slotSelections: { slot_noun: 'noun_fan', slot_verb: 'v_mai' }, hanzi: '饭是谁买的？', pinyin: 'Fàn shì shéi mǎi de ?', french: 'Qui a acheté le repas ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_fan_v_mai.mp3' },
  { id: 'c_fan_song', slotSelections: { slot_noun: 'noun_fan', slot_verb: 'v_song' }, hanzi: '饭是谁送的？', pinyin: 'Fàn shì shéi sòng de ?', french: 'Qui a livré le repas ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_fan_v_song.mp3' },

  // 4. 菜 (plat / légumes)
  { id: 'c_cai_zuo', slotSelections: { slot_noun: 'noun_cai', slot_verb: 'v_zuo' }, hanzi: '菜是谁做的？', pinyin: 'Cài shì shéi zuò de ?', french: 'Qui a cuisiné ce plat ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_cai_v_zuo.mp3' },
  { id: 'c_cai_mai', slotSelections: { slot_noun: 'noun_cai', slot_verb: 'v_mai' }, hanzi: '菜是谁买的？', pinyin: 'Cài shì shéi mǎi de ?', french: 'Qui a acheté les légumes ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_cai_v_mai.mp3' },
  { id: 'c_cai_xi', slotSelections: { slot_noun: 'noun_cai', slot_verb: 'v_xi' }, hanzi: '菜是谁洗的？', pinyin: 'Cài shì shéi xǐ de ?', french: 'Qui a lavé les légumes ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_cai_v_xi.mp3' },
  { id: 'c_cai_song', slotSelections: { slot_noun: 'noun_cai', slot_verb: 'v_song' }, hanzi: '菜是谁送的？', pinyin: 'Cài shì shéi sòng de ?', french: 'Qui a apporté les plats ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_cai_v_song.mp3' },

  // 5. 书 (livre)
  { id: 'c_shu_mai', slotSelections: { slot_noun: 'noun_shu', slot_verb: 'v_mai' }, hanzi: '书是谁买的？', pinyin: 'Shū shì shéi mǎi de ?', french: 'Qui a acheté le livre ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_shu_v_mai.mp3' },
  { id: 'c_shu_xie', slotSelections: { slot_noun: 'noun_shu', slot_verb: 'v_xie' }, hanzi: '书是谁写的？', pinyin: 'Shū shì shéi xiě de ?', french: 'Qui a écrit le livre ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_shu_v_xie.mp3' },
  { id: 'c_shu_song', slotSelections: { slot_noun: 'noun_shu', slot_verb: 'v_song' }, hanzi: '书是谁送的？', pinyin: 'Shū shì shéi sòng de ?', french: 'Qui a offert le livre ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_shu_v_song.mp3' },
  { id: 'c_shu_na', slotSelections: { slot_noun: 'noun_shu', slot_verb: 'v_na' }, hanzi: '书是谁拿的？', pinyin: 'Shū shì shéi ná de ?', french: 'Qui a pris le livre ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_shu_v_na.mp3' },

  // 6. 衣服 (vêtements)
  { id: 'c_yifu_mai', slotSelections: { slot_noun: 'noun_yifu', slot_verb: 'v_mai' }, hanzi: '衣服是谁买的？', pinyin: 'Yīfu shì shéi mǎi de ?', french: 'Qui a acheté les vêtements ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_yifu_v_mai.mp3' },
  { id: 'c_yifu_xi', slotSelections: { slot_noun: 'noun_yifu', slot_verb: 'v_xi' }, hanzi: '衣服是谁洗的？', pinyin: 'Yīfu shì shéi xǐ de ?', french: 'Qui a lavé les vêtements ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_yifu_v_xi.mp3' },
  { id: 'c_yifu_song', slotSelections: { slot_noun: 'noun_yifu', slot_verb: 'v_song' }, hanzi: '衣服是谁送的？', pinyin: 'Yīfu shì shéi sòng de ?', french: 'Qui a offert les vêtements ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_yifu_v_song.mp3' },
  { id: 'c_yifu_na', slotSelections: { slot_noun: 'noun_yifu', slot_verb: 'v_na' }, hanzi: '衣服是谁拿的？', pinyin: 'Yīfu shì shéi ná de ?', french: 'Qui a pris les vêtements ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_yifu_v_na.mp3' },

  // 7. 信 (lettre)
  { id: 'c_xin_xie', slotSelections: { slot_noun: 'noun_xin', slot_verb: 'v_xie' }, hanzi: '信是谁写的？', pinyin: 'Xìn shì shéi xiě de ?', french: 'Qui a écrit la lettre ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_xin_v_xie.mp3' },
  { id: 'c_xin_song', slotSelections: { slot_noun: 'noun_xin', slot_verb: 'v_song' }, hanzi: '信是谁送的？', pinyin: 'Xìn shì shéi sòng de ?', french: 'Qui a apporté la lettre ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_xin_v_song.mp3' },
  { id: 'c_xin_na', slotSelections: { slot_noun: 'noun_xin', slot_verb: 'v_na' }, hanzi: '信是谁拿的？', pinyin: 'Xìn shì shéi ná de ?', french: 'Qui a pris la lettre ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_xin_v_na.mp3' },
  { id: 'c_xin_jie', slotSelections: { slot_noun: 'noun_xin', slot_verb: 'v_jie' }, hanzi: '信是谁接的？', pinyin: 'Xìn shì shéi jiē de ?', french: 'Qui a réceptionné la lettre ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_xin_v_jie.mp3' },

  // 8. 礼物 (cadeau)
  { id: 'c_liwu_song', slotSelections: { slot_noun: 'noun_liwu', slot_verb: 'v_song' }, hanzi: '礼物是谁送的？', pinyin: 'Lǐwù shì shéi sòng de ?', french: 'Qui a offert le cadeau ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_liwu_v_song.mp3' },
  { id: 'c_liwu_mai', slotSelections: { slot_noun: 'noun_liwu', slot_verb: 'v_mai' }, hanzi: '礼物是谁买的？', pinyin: 'Lǐwù shì shéi mǎi de ?', french: 'Qui a acheté le cadeau ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_liwu_v_mai.mp3' },
  { id: 'c_liwu_zuo', slotSelections: { slot_noun: 'noun_liwu', slot_verb: 'v_zuo' }, hanzi: '礼物是谁做的？', pinyin: 'Lǐwù shì shéi zuò de ?', french: 'Qui a confectionné le cadeau ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_liwu_v_zuo.mp3' },
  { id: 'c_liwu_na', slotSelections: { slot_noun: 'noun_liwu', slot_verb: 'v_na' }, hanzi: '礼物是谁拿的？', pinyin: 'Lǐwù shì shéi ná de ?', french: 'Qui a pris le cadeau ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_liwu_v_na.mp3' },

  // 9. 咖啡 (café)
  { id: 'c_kafei_he', slotSelections: { slot_noun: 'noun_kafei', slot_verb: 'v_he' }, hanzi: '咖啡是谁喝的？', pinyin: 'Kāfēi shì shéi hē de ?', french: 'Qui a bu le café ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_kafei_v_he.mp3' },
  { id: 'c_kafei_mai', slotSelections: { slot_noun: 'noun_kafei', slot_verb: 'v_mai' }, hanzi: '咖啡是谁买的？', pinyin: 'Kāfēi shì shéi mǎi de ?', french: 'Qui a acheté le café ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_kafei_v_mai.mp3' },
  { id: 'c_kafei_zuo', slotSelections: { slot_noun: 'noun_kafei', slot_verb: 'v_zuo' }, hanzi: '咖啡是谁做的？', pinyin: 'Kāfēi shì shéi zuò de ?', french: 'Qui a préparé le café ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_kafei_v_zuo.mp3' },
  { id: 'c_kafei_song', slotSelections: { slot_noun: 'noun_kafei', slot_verb: 'v_song' }, hanzi: '咖啡是谁送的？', pinyin: 'Kāfēi shì shéi sòng de ?', french: 'Qui a apporté le café ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_kafei_v_song.mp3' },

  // 10. 车 (voiture)
  { id: 'c_che_kai', slotSelections: { slot_noun: 'noun_che', slot_verb: 'v_kai' }, hanzi: '车是谁开的？', pinyin: 'Chē shì shéi kāi de ?', french: 'Qui a conduit la voiture ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_che_v_kai.mp3' },
  { id: 'c_che_mai', slotSelections: { slot_noun: 'noun_che', slot_verb: 'v_mai' }, hanzi: '车是谁买的？', pinyin: 'Chē shì shéi mǎi de ?', french: 'Qui a acheté la voiture ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_che_v_mai.mp3' },
  { id: 'c_che_xi', slotSelections: { slot_noun: 'noun_che', slot_verb: 'v_xi' }, hanzi: '车是谁洗的？', pinyin: 'Chē shì shéi xǐ de ?', french: 'Qui a lavé la voiture ?', audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_che_v_xi.mp3' },
];

export const HSK2_MODEL_1: SpokenExerciseModel = {
  id: 'spoken_hsk2_ep1',
  level: 'HSK 2',
  episodeNumber: 1,
  titleFr: 'Qui a répondu au téléphone ?',
  imageUrl: '/images/exercices-parles/propositions/hsk2_ep1_prop_a.jpg',
  isGratuit: true,
  isTest: false,
  datePublication: '2026-10-16',
  typicalSentence: {
    hanzi: '电话是谁接的？',
    pinyin: 'Diànhuà shì shéi jiē de ?',
    french: 'Qui a répondu au téléphone ?',
    audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/hsk2_01_typical.mp3',
    tokens: [
      {
        hanzi: '电话',
        pinyin: 'diànhuà',
        french: 'le téléphone',
        colorTheme: 'purple',
        audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/hsk2_01_tok_dianhua.mp3',
      },
      {
        hanzi: '是谁',
        pinyin: 'shì shéi',
        french: 'qui a / c’est qui',
        colorTheme: 'emerald',
        audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/hsk2_01_tok_shishei.mp3',
      },
      {
        hanzi: '接',
        pinyin: 'jiē',
        french: 'répondu à / pris',
        colorTheme: 'amber',
        audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/hsk2_01_tok_jie.mp3',
      },
      {
        hanzi: '的',
        pinyin: 'de',
        french: 'marqueur d’insistance',
        colorTheme: 'blue',
        audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/hsk2_01_tok_de.mp3',
      },
    ],
  },
  slots: [
    {
      id: 'slot_noun',
      slotNumber: 1,
      label: '1. Nom (Objet / Thème)',
      colorTheme: 'purple',
      defaultOptionId: 'noun_dianhua',
      options: ALL_NOUNS_HSK2,
    },
    {
      id: 'slot_shishei',
      slotNumber: 2,
      label: '2. Insistance (Agent)',
      colorTheme: 'emerald',
      isLocked: true,
      defaultOptionId: 'fix_shishei',
      options: [FIXED_SHISHEI],
    },
    {
      id: 'slot_verb',
      slotNumber: 3,
      label: '3. Verbe (Action passée)',
      colorTheme: 'amber',
      defaultOptionId: 'v_jie',
      options: ALL_VERBS_HSK2,
    },
    {
      id: 'slot_de',
      slotNumber: 4,
      label: '4. Marqueur d’insistance',
      colorTheme: 'blue',
      isLocked: true,
      defaultOptionId: 'fix_de',
      options: [FIXED_DE],
    },
  ],
  frenchSentenceBuilder: buildFrenchSentenceHsk2Model1,
  punctuation: {
    hanzi: '？',
    pinyin: ' ?',
  },
  pairedSlotDefaults: PAIRED_SLOT_DEFAULTS_HSK2,
  validCombinations: VALID_COMBINATIONS_HSK2_EP1,
  structureInsight:
    '« La structure <strong>是……的 (shì...de)</strong> est l’un des piliers majeurs du HSK 2 : elle permet d’insister sur l’auteur, le moment, le lieu ou la manière d’une action déjà accomplie. »',
  pedagogicalMethod: {
    title: 'La Méthode de la Combinaison (Focaliser sur l’auteur de l’action)',
    corePrinciple:
      'En mandarin, lorsqu’une action a déjà eu lieu et que l’on souhaite identifier qui en est l’auteur, on place l’objet en tête de phrase comme sujet de conversation, suivi immédiatement du bloc fixe 是谁 (shì shéi, « c’est qui ») et de l’action conclue par 的 (de). On conserve les deux piliers fixes 是谁 (shì shéi) et 的 (de), et on permute les duos naturels de la vraie vie : décrocher le téléphone (接电话), ouvrir la porte (开门), préparer le repas (做饭), laver les vêtements (洗衣服), écrire une lettre (写信), boire un café (喝咖啡)...',
    comparisonFr:
      'Pour un francophone : en français, on utilise la tournure « Qui a [verbe] [objet] ? » (« Qui a répondu au téléphone ? », « Qui a ouvert la porte ? »). En mandarin, placer le nom en ouverture (thématisation) crée une phrase naturelle et percutante : 电话是谁接的 (diànhuà shì shéi jiē de) met immédiatement l’attention sur l’appel téléphonique avant d’interroger sur la personne qui a décroché.',
  },
  subSteps: [
    {
      id: 'step_1_nouns',
      subStepNumber: 1,
      title: '1. Noms du quotidien & Actions naturelles',
      otherOptionsTitle: 'Autres possibilités avec les noms',
      mobileSlotId: 'slot_noun',
      allowedOptionIds: ALL_NOUNS_HSK2.map((n) => n.id),
      pedagogicalText:
        'Dans la structure 是……的 (shì...de), chaque nom en tête de phrase s’associe à son action naturelle de la vraie vie : on décroche le téléphone (接电话), on ouvre la porte (开门), on prépare le repas (做饭), on lave les vêtements (洗衣服), on boit le café (喝咖啡)... Touche chaque nom pour découvrir sa phrase naturelle !',
      didYouKnow: {
        title: 'Le sais-tu ?',
        content:
          'En chinois, le mot 电话 (diànhuà) signifie littéralement « parole électrique » (电 diàn = électricité, 话 huà = parole). Le verbe 接 (jiē) signifie « recevoir », « accueillir » ou « attraper au vol » : ainsi, 接电话 (jiē diànhuà) signifie littéralement « intercepter l’appel » !',
      },
      tip:
        'Dans cette structure, le mot 的 (de) à la fin ne traduit pas la possession : il certifie que l’action a déjà eu lieu.',
      featuredExamples: [
        {
          id: 'ex_hsk2_1_1',
          hanzi: '电话是谁接的？',
          pinyin: 'Diànhuà shì shéi jiē de ?',
          french: 'Qui a répondu au téléphone ?',
          slotSelections: { slot_noun: 'noun_dianhua', slot_verb: 'v_jie' },
          audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_dianhua_v_jie.mp3',
        },
        {
          id: 'ex_hsk2_1_2',
          hanzi: '门是谁开的？',
          pinyin: 'Mén shì shéi kāi de ?',
          french: 'Qui a ouvert la porte ?',
          slotSelections: { slot_noun: 'noun_men', slot_verb: 'v_kai' },
          audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_men_v_kai.mp3',
        },
        {
          id: 'ex_hsk2_1_3',
          hanzi: '饭是谁做的？',
          pinyin: 'Fàn shì shéi zuò de ?',
          french: 'Qui a préparé le repas ?',
          slotSelections: { slot_noun: 'noun_fan', slot_verb: 'v_zuo' },
          audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_fan_v_zuo.mp3',
        },
      ],
      otherOptions: ALL_NOUNS_HSK2.filter(
        (n) => !['noun_dianhua', 'noun_men', 'noun_fan'].includes(n.id)
      ),
    },
    {
      id: 'step_2_verbs',
      subStepNumber: 2,
      title: '2. Verbes d’action du quotidien',
      otherOptionsTitle: 'Autres possibilités avec les verbes',
      mobileSlotId: 'slot_verb',
      allowedOptionIds: ALL_VERBS_HSK2.map((v) => v.id),
      pedagogicalText:
        'Chaque verbe s’associe à l’objet réel auquel il s’applique : on ferme la porte (关门), on lave les vêtements (洗衣服), on écrit une lettre (写信), on boit un café (喝咖啡). En combinant ces duos authentiques, tes phrases sont toujours utilisables dans la vraie vie.',
      didYouKnow: {
        title: 'Le sais-tu ?',
        content:
          'Le verbe 关 (guān) signifie « fermer » (une porte 关门) ou « éteindre » (la lumière 关灯, le téléphone 关机). Le verbe 洗 (xǐ) s’applique aux vêtements (洗衣服 xǐ yīfu), aux légumes (洗菜 xǐ cài) et à la voiture (洗车 xǐ chē).',
      },
      featuredExamples: [
        {
          id: 'ex_hsk2_2_1',
          hanzi: '门是谁关的？',
          pinyin: 'Mén shì shéi guān de ?',
          french: 'Qui a fermé la porte ?',
          slotSelections: { slot_noun: 'noun_men', slot_verb: 'v_guan' },
          audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_men_v_guan.mp3',
        },
        {
          id: 'ex_hsk2_2_2',
          hanzi: '衣服是谁洗的？',
          pinyin: 'Yīfu shì shéi xǐ de ?',
          french: 'Qui a lavé les vêtements ?',
          slotSelections: { slot_noun: 'noun_yifu', slot_verb: 'v_xi' },
          audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_yifu_v_xi.mp3',
        },
        {
          id: 'ex_hsk2_2_3',
          hanzi: '咖啡是谁喝的？',
          pinyin: 'Kāfēi shì shéi hē de ?',
          french: 'Qui a bu le café ?',
          slotSelections: { slot_noun: 'noun_kafei', slot_verb: 'v_he' },
          audioUrl: '/audio/exercices-parles/spoken_hsk2_ep1/all/noun_kafei_v_he.mp3',
        },
      ],
      otherOptions: ALL_VERBS_HSK2.filter(
        (v) => !['v_guan', 'v_xi', 'v_he'].includes(v.id)
      ),
    },
  ],
  finale: {
    title: 'Tout mélanger (facultatif)',
    pedagogicalText:
      'Chaque phrase tirée au sort respecte la logique de la vraie vie : 36 duos authentiques rigoureusement sélectionnés à partir du vocabulaire HSK 1 et HSK 2. Tire une phrase au sort, lis-la à voix haute, puis recommence !',
    totalExpectedCombinations: 36,
  },
  miniChallenge:
    'À la maison ou au travail, pose la question à quelqu’un : 电话是谁接的 (Diànhuà shì shéi jiē de) ?',
  nextEpisode: {
    titleFr: 'Comment répondre ? 是我 (shì wǒ)……',
    teaser: 'Découvre bientôt la structure de réponse complète pour déclarer qui a accompli l’action !',
    isLocked: true,
  },
  rawNewWords: [
    { hanzi: '电话', pinyin: 'diànhuà', french: 'téléphone (HSK 1)' },
    { hanzi: '接', pinyin: 'jiē', french: 'répondre (au téléphone), accueillir (HSK 2)' },
    { hanzi: '是谁', pinyin: 'shì shéi', french: 'qui est-ce qui, qui a (HSK 1)' },
    { hanzi: '门', pinyin: 'mén', french: 'porte (HSK 2)' },
    { hanzi: '信', pinyin: 'xìn', french: 'lettre, courrier (HSK 2)' },
    { hanzi: '礼物', pinyin: 'lǐwù', french: 'cadeau (HSK 2)' },
    { hanzi: '咖啡', pinyin: 'kāfēi', french: 'café (HSK 2)' },
    { hanzi: '关', pinyin: 'guān', french: 'fermer, éteindre (HSK 2)' },
    { hanzi: '送', pinyin: 'sòng', french: 'offrir, livrer, raccompagner (HSK 2)' },
    { hanzi: '洗', pinyin: 'xǐ', french: 'laver, nettoyer (HSK 2)' },
    { hanzi: '拿', pinyin: 'ná', french: 'prendre, porter en main (HSK 2)' },
  ],
};
