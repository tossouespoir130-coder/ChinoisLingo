import { PersonnageVoixConfig } from '../audio/voicesConfig';
import { getVoiceConfigs, allocateNarratorVoice, allocateDialogueVoices, DialogueCharacterInput } from '../audio/voiceAllocator';

export interface SentenceAudioInput {
  id: string;
  hanzi: string;
  speaker?: string;
  speakerRole?: string;
}

export interface SentenceAudioResult {
  sentenceId: string;
  audioBuffer: Buffer;
  mimeType: string;
  durationEstimateMs: number;
}

export interface AssembledAudioResult {
  fullAudioBuffer: Buffer;
  mimeType: string;
  totalDurationEstimateMs: number;
  sentenceTimestamps: Array<{
    sentenceId: string;
    startMs: number;
    endMs: number;
  }>;
}

/**
/**
 * Formate le texte chinois pour un rendu audio ultra-naturel avec ElevenLabs v3 :
 * - Ajoute des respirations et pauses [pause] naturelles après les virgules et les incises
 * - Évite le débit précipité et garantit des respirations fluides et réalistes
 */
export function formatChineseTextWithNaturalPacing(textZh: string): string {
  let formatted = textZh.trim();

  // Si des balises [pause] sont déjà présentes, ne pas les dupliquer
  if (formatted.includes('[pause]')) {
    return formatted;
  }

  // Remplacer les virgules chinoises et occidentales par une virgule suivie d'une pause respiratoire
  formatted = formatted
    .replace(/，\s*/g, '， [pause] ')
    .replace(/,\s*/g, ', [pause] ')
    .replace(/、\s*/g, '、 [pause] ')
    .replace(/；\s*/g, '； [pause] ')
    .replace(/：\s*/g, '： [pause] ')
    .replace(/\.\.\.\s*/g, '... [pause] ')
    .replace(/……\s*/g, '…… [pause] ');

  // Nettoyage des espaces redondants
  formatted = formatted.replace(/\s+/g, ' ').trim();

  return formatted;
}

/**
 * Appelle l'API ElevenLabs pour synthétiser un texte chinois en audio MP3 (Modèle eleven_v3).
 */
export async function generateSentenceAudio(
  textZh: string,
  voiceConfig: PersonnageVoixConfig,
  apiKey?: string
): Promise<Buffer> {
  const key = apiKey || process.env.ELEVENLABS_API_KEY;
  if (!key) {
    throw new Error('ELEVENLABS_API_KEY non configurée. Veuillez renseigner votre clé dans les variables d’environnement.');
  }

  if (!voiceConfig.voiceId) {
    throw new Error(`Aucun voice_id ElevenLabs configuré pour la voix "${voiceConfig.characterNameFr}" (${voiceConfig.id}).`);
  }

  const promptText = formatChineseTextWithNaturalPacing(textZh);

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': key,
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: promptText,
      model_id: voiceConfig.modelId || 'eleven_v3',
      voice_settings: {
        stability: voiceConfig.stability ?? 0.50,
        similarity_boost: voiceConfig.similarityBoost ?? 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ElevenLabs (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Génère un silence MP3 binaire de quelques millisecondes pour aérer les répliques
 */
function createSilentMp3Buffer(durationMs: number = 400): Buffer {
  // Silence frame standard MPEG Layer 3 (128 kbps, 44.1 kHz, frame = 417-418 bytes pour ~26ms)
  // Pour un silence basique sans artefact, une répétition de frames silencieuses
  const silentFrame = Buffer.from([
    0xff, 0xfb, 0x90, 0x64, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  const frameCount = Math.max(1, Math.round(durationMs / 26));
  const frames = [];
  for (let i = 0; i < frameCount; i++) {
    frames.push(silentFrame);
  }
  return Buffer.concat(frames);
}

/**
 * Génère l'audio complet d'une Histoire ou d'un Article (Narration pure).
 */
export async function generateStoryOrArticleAudio(
  contentId: string,
  sentences: SentenceAudioInput[],
  apiKey?: string
): Promise<AssembledAudioResult> {
  const voiceMap = await getVoiceConfigs();
  const narratorVoice = allocateNarratorVoice(contentId, voiceMap);

  const audioBuffers: Buffer[] = [];
  const sentenceTimestamps: AssembledAudioResult['sentenceTimestamps'] = [];
  let currentOffsetMs = 0;
  const pauseMs = 500;
  const pauseBuffer = createSilentMp3Buffer(pauseMs);

  for (const sentence of sentences) {
    const buffer = await generateSentenceAudio(sentence.hanzi, narratorVoice, apiKey);
    
    // Estimation empirique de la durée (taille MP3 à 128kbps ~ 16 Ko/sec)
    const durationMs = Math.round((buffer.length / 16000) * 1000);

    sentenceTimestamps.push({
      sentenceId: sentence.id,
      startMs: currentOffsetMs,
      endMs: currentOffsetMs + durationMs,
    });

    audioBuffers.push(buffer);
    audioBuffers.push(pauseBuffer);
    currentOffsetMs += durationMs + pauseMs;
  }

  const fullAudioBuffer = Buffer.concat(audioBuffers);

  return {
    fullAudioBuffer,
    mimeType: 'audio/mpeg',
    totalDurationEstimateMs: currentOffsetMs,
    sentenceTimestamps,
  };
}

/**
 * Génère l'audio complet d'un Dialogue multi-personnages avec assemblage harmonieux.
 */
export async function generateDialogueAudio(
  characters: DialogueCharacterInput[],
  sentences: SentenceAudioInput[],
  apiKey?: string
): Promise<AssembledAudioResult> {
  const voiceMap = await getVoiceConfigs();
  const assignedVoices = allocateDialogueVoices(characters, voiceMap);

  const audioBuffers: Buffer[] = [];
  const sentenceTimestamps: AssembledAudioResult['sentenceTimestamps'] = [];
  let currentOffsetMs = 0;
  const pauseBetweenRepliesMs = 450;
  const pauseBuffer = createSilentMp3Buffer(pauseBetweenRepliesMs);

  for (const sentence of sentences) {
    const speakerName = sentence.speaker || characters[0]?.name || 'Narrateur';
    const voiceConfig = assignedVoices.get(speakerName) || voiceMap.get('generic_male_1')!;

    const buffer = await generateSentenceAudio(sentence.hanzi, voiceConfig, apiKey);
    const durationMs = Math.round((buffer.length / 16000) * 1000);

    sentenceTimestamps.push({
      sentenceId: sentence.id,
      startMs: currentOffsetMs,
      endMs: currentOffsetMs + durationMs,
    });

    audioBuffers.push(buffer);
    audioBuffers.push(pauseBuffer);
    currentOffsetMs += durationMs + pauseBetweenRepliesMs;
  }

  const fullAudioBuffer = Buffer.concat(audioBuffers);

  return {
    fullAudioBuffer,
    mimeType: 'audio/mpeg',
    totalDurationEstimateMs: currentOffsetMs,
    sentenceTimestamps,
  };
}
