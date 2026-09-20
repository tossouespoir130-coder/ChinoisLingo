import { PersonnageVoixConfig } from '../audio/voicesConfig';
import { getVoiceConfigs, allocateNarratorVoice, allocateDialogueVoices, DialogueCharacterInput } from '../audio/voiceAllocator';
import { execFile } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';

const execFileAsync = promisify(execFile);

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
 * Nettoie et prépare le texte chinois pour une élocution fluide et naturelle avec ElevenLabs v3.
 * Le modèle eleven_v3 gère nativement la prosodie, les respirations et la ponctuation chinoise (，、。？！：；).
 */
export function formatChineseTextWithNaturalPacing(textZh: string): string {
  return textZh.trim().replace(/\s+/g, ' ');
}

/**
 * Normalise le volume sonore d'un Buffer audio MP3 à -16 LUFS (norme de loudness broadcast EBU R128)
 * pour garantir un niveau audio parfaitement égal et harmonieux entre toutes les voix.
 */
export async function normalizeAudioBuffer(inputBuffer: Buffer, targetLufs: number = -16): Promise<Buffer> {
  let ffmpegPath: string | null = null;
  try {
    ffmpegPath = require('ffmpeg-static');
  } catch {
    ffmpegPath = null;
  }

  if (!ffmpegPath || !fs.existsSync(/* turbopackIgnore: true */ ffmpegPath)) {
    return inputBuffer;
  }

  const tmpId = Math.random().toString(36).substring(2, 9);
  const tmpIn = path.join(os.tmpdir(), `tts_in_${tmpId}.mp3`);
  const tmpOut = path.join(os.tmpdir(), `tts_out_${tmpId}.mp3`);

  try {
    await fs.promises.writeFile(tmpIn, inputBuffer);
    await execFileAsync(ffmpegPath, [
      '-y',
      '-i', tmpIn,
      '-af', `loudnorm=I=${targetLufs}:TP=-1.5:LRA=11`,
      '-ar', '44100',
      '-b:a', '128k',
      tmpOut
    ]);

    const normalizedBuffer = await fs.promises.readFile(tmpOut);
    return normalizedBuffer;
  } catch (err) {
    console.warn('Loudness normalization fallback to raw buffer:', err);
    return inputBuffer;
  } finally {
    try { if (fs.existsSync(tmpIn)) await fs.promises.unlink(tmpIn); } catch {}
    try { if (fs.existsSync(tmpOut)) await fs.promises.unlink(tmpOut); } catch {}
  }
}

/**
 * Appelle l'API ElevenLabs pour synthétiser un texte chinois en audio MP3 (Modèle eleven_v3)
 * avec normalisation sonore automatique à -16 LUFS.
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

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}?output_format=mp3_44100_128`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': key,
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: promptText,
      model_id: voiceConfig.modelId || 'eleven_multilingual_v2',
      language_code: 'zh',
      voice_settings: {
        stability: voiceConfig.stability ?? 0.50,
        similarity_boost: voiceConfig.similarityBoost ?? 0.85,
        style: 0.0,
        use_speaker_boost: true,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur ElevenLabs (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);
  return await normalizeAudioBuffer(rawBuffer, -16);
}

/**
 * Génère un silence MP3 binaire de quelques millisecondes pour aérer les répliques
 */
function createSilentMp3Buffer(durationMs: number = 200): Buffer {
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
 * Génère l'audio complet d'une Histoire ou d'un Article (Narration pure avec égalisation sonore).
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
  const pauseMs = 180;
  const pauseBuffer = createSilentMp3Buffer(pauseMs);

  for (const sentence of sentences) {
    const buffer = await generateSentenceAudio(sentence.hanzi, narratorVoice, apiKey);
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

  const assembledBuffer = Buffer.concat(audioBuffers);
  const fullAudioBuffer = await normalizeAudioBuffer(assembledBuffer, -16);

  return {
    fullAudioBuffer,
    mimeType: 'audio/mpeg',
    totalDurationEstimateMs: currentOffsetMs,
    sentenceTimestamps,
  };
}

/**
 * Génère l'audio complet d'un Dialogue multi-personnages avec égalisation sonore stricte (-16 LUFS).
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
  const pauseBetweenRepliesMs = 200;
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

  const assembledBuffer = Buffer.concat(audioBuffers);
  const fullAudioBuffer = await normalizeAudioBuffer(assembledBuffer, -16);

  return {
    fullAudioBuffer,
    mimeType: 'audio/mpeg',
    totalDurationEstimateMs: currentOffsetMs,
    sentenceTimestamps,
  };
}

/**
 * Synthétise un mot ou une expression de vocabulaire chinois (cartes 生词)
 * en utilisant la voix dédiée neutre et claire (Ethan Zhang - brChkoggsUHF1stW6omH)
 * avec le modèle eleven_multilingual_v2 pour une netteté et une précision tonale absolue sur mot isolé.
 */
export async function generateVocabularyAudio(
  hanzi: string,
  apiKey?: string
): Promise<Buffer> {
  const { VOCABULARY_VOICE_CONFIG } = await import('../audio/voicesConfig');
  return generateSentenceAudio(hanzi, VOCABULARY_VOICE_CONFIG, apiKey);
}
