import { PersonnageVoixConfig, DEFAULT_VOICES_CONFIG } from './voicesConfig';
import { createClient } from '../supabase/server';

interface PersonnageVoixRow {
  id: string;
  character_name_fr: string;
  character_name_zh: string | null;
  voice_id: string | null;
  category: 'recurrent' | 'narrator' | 'generic' | 'founder';
  gender: 'female' | 'male' | 'neutral';
  model_id: string | null;
  stability: number | null;
  similarity_boost: number | null;
  description: string | null;
}

/**
 * Récupère l'ensemble des configurations de voix (depuis Supabase avec fallback local).
 */
export async function getVoiceConfigs(): Promise<Map<string, PersonnageVoixConfig>> {
  const voiceMap = new Map<string, PersonnageVoixConfig>();

  // 1. Initialisation avec le fallback local
  DEFAULT_VOICES_CONFIG.forEach((v) => voiceMap.set(v.id, v));

  // 2. Enrichissement / mise à jour dynamique depuis la table Supabase si accessible
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('personnages_voix')
      .select('*');

    if (!error && data && data.length > 0) {
      (data as unknown as PersonnageVoixRow[]).forEach((row) => {
        voiceMap.set(row.id, {
          id: row.id,
          characterNameFr: row.character_name_fr,
          characterNameZh: row.character_name_zh || undefined,
          voiceId: row.voice_id,
          category: row.category,
          gender: row.gender,
          modelId: row.model_id || 'eleven_multilingual_v2',
          stability: Number(row.stability) || 0.50,
          similarityBoost: Number(row.similarity_boost) || 0.75,
          description: row.description || undefined,
        });
      });
    }
  } catch {
    // Si la DB n'est pas disponible, on conserve le fallback local
  }

  return voiceMap;
}

/**
 * Attribue une voix de narration pour une Histoire ou un Article.
 * Alterne harmonieusement entre les 3 voix de narration (Pool de 3).
 */
export function allocateNarratorVoice(
  contentId: string,
  voiceMap: Map<string, PersonnageVoixConfig>
): PersonnageVoixConfig {
  const narratorKeys = ['narrator_1', 'narrator_2', 'narrator_3', 'narrator_4'];
  
  // Hash déterministe pour associer toujours la même voix à un même article/histoire
  let hash = 0;
  for (let i = 0; i < contentId.length; i++) {
    hash = (hash << 5) - hash + contentId.charCodeAt(i);
    hash |= 0;
  }
  const selectedKey = narratorKeys[Math.abs(hash) % narratorKeys.length];

  return voiceMap.get(selectedKey) || voiceMap.get('narrator_1')!;
}

export interface DialogueCharacterInput {
  name: string;
  nameZh?: string;
  role?: string;
  gender?: 'female' | 'male';
}

/**
 * Mapping d'équivalences pour reconnaître les personnages récurrents
 */
const RECURRENT_CHARACTER_MAP: Record<string, string> = {
  // Lily
  lily: 'lily',
  lìli: 'lily',
  '丽丽': 'lily',

  // Monsieur Li
  'monsieur li': 'mr_li',
  'm. li': 'mr_li',
  'professeur li': 'mr_li',
  'li laoshi': 'mr_li',
  '李老师': 'mr_li',
  '李经理': 'mr_li',

  // Lao Wang / M. Wang / Directeur Wang
  'lao wang': 'lao_wang',
  'directeur wang': 'lao_wang',
  'm. wang': 'lao_wang',
  'wang zong': 'lao_wang',
  '王总': 'lao_wang',
  '老王': 'lao_wang',
  '王先生': 'lao_wang',

  // Katia
  katia: 'katia',
  '卡佳': 'katia',

  // Brice
  brice: 'brice',
  '布里斯': 'brice',

  // Anthony
  anthony: 'anthony',
  '安东尼': 'anthony',

  // Espoir Chinois
  espoir: 'espoir_chinois',
  'espoir chinois': 'espoir_chinois',
  'subo': 'espoir_chinois',
  'sūbō': 'espoir_chinois',
  '苏波': 'espoir_chinois',
};

/**
 * Détecte le genre d'un personnage à partir de son nom ou rôle.
 */
function inferGender(name: string, role?: string): 'female' | 'male' {
  const combined = `${name} ${role || ''}`.toLowerCase();
  
  const femaleKeywords = ['dame', 'femme', 'fille', 'cliente', 'vendeuse', 'passagère', 'lectrice', 'maman', 'grand-mère', 'chen ya', 'claire', 'élise', 'marie', '女'];
  if (femaleKeywords.some((kw) => combined.includes(kw))) {
    return 'female';
  }
  return 'male';
}

/**
 * Algorithme d'attribution de voix pour un Dialogue avec garantie stricte anti-collision :
 * 1. Les personnages récurrents reçoivent leur voix fixe dédiée.
 * 2. Les personnages génériques/ponctuels reçoivent une voix du pool secondaire selon leur genre.
 * 3. Au sein d'un même dialogue, deux personnages différents ne partagent JAMAIS la même voix.
 */
export function allocateDialogueVoices(
  characters: DialogueCharacterInput[],
  voiceMap: Map<string, PersonnageVoixConfig>
): Map<string, PersonnageVoixConfig> {
  const assigned = new Map<string, PersonnageVoixConfig>();
  const usedVoiceIds = new Set<string>();

  // Étape 1 : Assigner les personnages récurrents
  characters.forEach((char) => {
    const lookupKey = (char.nameZh || char.name).trim().toLowerCase();
    const recurrentId = RECURRENT_CHARACTER_MAP[lookupKey];

    if (recurrentId && voiceMap.has(recurrentId)) {
      const voiceConfig = voiceMap.get(recurrentId)!;
      assigned.set(char.name, voiceConfig);
      if (voiceConfig.voiceId) {
        usedVoiceIds.add(voiceConfig.voiceId);
      }
    }
  });

  // Étape 2 : Assigner les voix secondaires génériques sans collision
  const genericMaleVoices = [
    voiceMap.get('generic_male_1'),
    voiceMap.get('generic_male_2'),
  ].filter(Boolean) as PersonnageVoixConfig[];

  const genericFemaleVoices = [
    voiceMap.get('generic_female_1'),
    voiceMap.get('generic_female_2'),
  ].filter(Boolean) as PersonnageVoixConfig[];

  characters.forEach((char) => {
    // Si déjà assigné (personnage récurrent), on passe
    if (assigned.has(char.name)) return;

    const gender = char.gender || inferGender(char.name, char.role);
    const candidatePool = gender === 'female' ? genericFemaleVoices : genericMaleVoices;

    // Trouver une voix non encore utilisée dans ce dialogue
    let chosenVoice = candidatePool.find(
      (v) => v.voiceId && !usedVoiceIds.has(v.voiceId)
    );

    // Fallback si toutes les voix du pool de ce genre sont prises : prendre la 1ère du pool
    if (!chosenVoice) {
      chosenVoice = candidatePool[0] || genericMaleVoices[0];
    }

    assigned.set(char.name, chosenVoice);
    if (chosenVoice?.voiceId) {
      usedVoiceIds.add(chosenVoice.voiceId);
    }
  });

  return assigned;
}
