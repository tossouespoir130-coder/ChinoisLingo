const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const os = require('os');

// Read .env.local manually
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...vals] = trimmed.split('=');
        process.env[key.trim()] = vals.join('=').trim();
      }
    }
  }
}
loadEnv();

const execFileAsync = promisify(execFile);
const apiKey = process.env.ELEVENLABS_API_KEY || 'sk_b0446c0d1992604bb9c1885e27f9532d878021f91fd96ba5';
const voiceId = 'brChkoggsUHF1stW6omH'; // Ethan Zhang - Voix neutre & claire dédiée vocabulaire
const modelId = 'eleven_multilingual_v2'; // Modèle optimal pour la précision tonale sur mot isolé

let ffmpegPath = null;
try {
  ffmpegPath = require('ffmpeg-static');
} catch {
  ffmpegPath = null;
}

async function normalizeAudioBuffer(inputBuffer, targetLufs = -16) {
  if (!ffmpegPath || !fs.existsSync(ffmpegPath)) {
    return inputBuffer;
  }
  const tmpId = Math.random().toString(36).substring(2, 9);
  const tmpIn = path.join(os.tmpdir(), `tts_v_in_${tmpId}.mp3`);
  const tmpOut = path.join(os.tmpdir(), `tts_v_out_${tmpId}.mp3`);
  try {
    await fs.promises.writeFile(tmpIn, inputBuffer);
    await execFileAsync(ffmpegPath, [
      '-y',
      '-i', tmpIn,
      '-af', `loudnorm=I=${targetLufs}:TP=-1.5:LRA=11`,
      '-ar', '44100',
      '-b:a', '128k',
      tmpOut,
    ]);
    return await fs.promises.readFile(tmpOut);
  } catch (err) {
    console.warn('Loudness normalization fallback:', err);
    return inputBuffer;
  } finally {
    try { if (fs.existsSync(tmpIn)) await fs.promises.unlink(tmpIn); } catch {}
    try { if (fs.existsSync(tmpOut)) await fs.promises.unlink(tmpOut); } catch {}
  }
}

async function generateWordTts(word) {
  const cleanWord = word.trim();
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text: cleanWord,
      model_id: modelId,
      voice_settings: {
        stability: 0.75,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`ElevenLabs error (${response.status}): ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const rawBuffer = Buffer.from(arrayBuffer);
  return await normalizeAudioBuffer(rawBuffer, -16);
}

async function main() {
  console.log(`=== Génération Audio Vocabulaire ElevenLabs (${modelId}) ===`);
  console.log(`Voix : ${voiceId} (Ethan Zhang)`);

  const pageContent = fs.readFileSync('src/app/(app)/ecoute-lecture/page.tsx', 'utf8');

  // Parse all reading items and series episodes
  const readingsWithVocab = [];

  // Match items with vocabulary
  const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?vocabulary:\s*(\[[^\]]*\])/g;
  let match;
  while ((match = regex.exec(pageContent)) !== null) {
    try {
      const id = match[1];
      const vocStr = match[2];
      const items = eval(vocStr);
      if (Array.isArray(items) && items.length > 0) {
        readingsWithVocab.push({ id, vocabulary: items });
      }
    } catch (e) {
      console.warn('Error parsing vocabulary for match:', e);
    }
  }

  console.log(`Total sections avec vocabulaire trouvées : ${readingsWithVocab.length}`);

  // Create dirs
  const vocabDir = path.join(process.cwd(), 'public/audio/vocab');
  const readingsDir = path.join(process.cwd(), 'public/audio/readings');
  if (!fs.existsSync(vocabDir)) fs.mkdirSync(vocabDir, { recursive: true });
  if (!fs.existsSync(readingsDir)) fs.mkdirSync(readingsDir, { recursive: true });

  // Unique words cache to avoid regenerating duplicate words
  const wordCache = new Map();

  let generatedCount = 0;
  let totalTargets = 0;

  for (const reading of readingsWithVocab) {
    console.log(`\n📚 Traitement du vocabulaire pour : ${reading.id} (${reading.vocabulary.length} mots)`);

    for (let vIdx = 0; vIdx < reading.vocabulary.length; vIdx++) {
      const vocab = reading.vocabulary[vIdx];
      const word = vocab.hanzi.trim();
      totalTargets++;

      const specificFilePath = path.join(readingsDir, `${reading.id}_voc_${vIdx}.mp3`);
      const wordFilePath = path.join(vocabDir, `${encodeURIComponent(word)}.mp3`);
      const plainWordFilePath = path.join(vocabDir, `${word}.mp3`);

      let audioBuffer;

      if (wordCache.has(word)) {
        audioBuffer = wordCache.get(word);
      } else {
        console.log(`  🔊 [ElevenLabs] Génération mot : "${word}" (${vocab.pinyin} - ${vocab.french})...`);
        audioBuffer = await generateWordTts(word);
        wordCache.set(word, audioBuffer);
        generatedCount++;
        // Small delay between calls to be gentle with rate limit
        await new Promise((r) => setTimeout(r, 200));
      }

      // Write files
      fs.writeFileSync(specificFilePath, audioBuffer);
      fs.writeFileSync(wordFilePath, audioBuffer);
      try {
        fs.writeFileSync(plainWordFilePath, audioBuffer);
      } catch {}
      console.log(`    ✓ Enregistré : ${path.basename(specificFilePath)} & vocab/${word}.mp3`);
    }
  }

  // Also add any alias files if needed
  const aliases = [
    { from: 'article_2', to: 'article_nombres' },
    { from: 'article_cles_affaires_series', to: 'series_affaires_chine_ep1' },
    { from: 'article_cles_affaires_series', to: 'article_carte_visite' }
  ];

  for (const alias of aliases) {
    const parent = readingsWithVocab.find(r => r.id === alias.from);
    if (parent) {
      for (let vIdx = 0; vIdx < parent.vocabulary.length; vIdx++) {
        const src = path.join(readingsDir, `${alias.from}_voc_${vIdx}.mp3`);
        const dest = path.join(readingsDir, `${alias.to}_voc_${vIdx}.mp3`);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
          console.log(`    ✓ Alias copié : ${path.basename(dest)}`);
        }
      }
    }
  }

  console.log(`\n🎉 Génération terminée avec succès !`);
  console.log(`- Mots uniques synthétisés : ${wordCache.size}`);
  console.log(`- Fichiers créés : ${totalTargets}`);
}

main().catch((err) => {
  console.error('Erreur génération vocabulaire :', err);
  process.exit(1);
});
