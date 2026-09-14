const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const os = require('os');
const ffmpegPath = require('ffmpeg-static');

// 1. Lire la clé ElevenLabs depuis .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/ELEVENLABS_API_KEY=([^\r\n]+)/);
const ELEVENLABS_API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : '';

if (!ELEVENLABS_API_KEY) {
  console.error('❌ Erreur : ELEVENLABS_API_KEY introuvable dans .env.local');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio', 'readings');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 2. Mapping des Voix ElevenLabs
const VOICES = {
  // Narrateurs (Histoires & Articles)
  narrator_1: 'brChkoggsUHF1stW6omH', // Ethan Zhang
  narrator_2: 'W8lBaQb9YIoddhxfQNLP', // Siqi liu
  narrator_3: 'APSIkVZudNbPAwyPoeVO', // Sage
  narrator_4: 'rtRocV7drsrJFSQPxlD3', // Hua feng

  // Personnages Récurrents
  lily: 'PSvrh6w41Qm19oaaHLca',        // Anna
  mr_li: 'cwzmKSYMCC9Aym1ymCnt',       // Mr Chen
  lao_wang: 'UFDAUkGzdLAEJlINT3Fx',    // Lin
  katia: 'm7QGIiNrWASyI5oJn4I8',       // Xiaoran
  brice: 'vZZLclMx4wouUtKBRfZn',       // Jin
  anthony: 'agczkAUlHLowaNnL72Cc',     // Adrian
  espoir_placeholder: 'MQkiCZS3mnl44caDtxkJ', // Guan Tao Bao (voix masculine secondaire en attendant le clonage)

  // Voix Secondaires
  generic_male_1: 'MQkiCZS3mnl44caDtxkJ',   // Guan Tao Bao
  generic_male_2: 'nss5M23ZSzhG3Tn0b7wN',   // Rippel
  generic_female_1: 'hkfHEbBvdQFNX4uWHqRF', // Stacy
  generic_female_2: 'bhJUNIXWQQ94l8eI2VUf', // Amy
};

// 3. Contenus complets pour les 3 compartiments : Histoires, Articles, Dialogues
const CONTENTS = [
  // ==========================================
  // COMPARTIMENT 1 : HISTOIRES
  // ==========================================
  {
    id: 'histoire_1',
    aliases: [],
    type: 'histoire',
    voiceId: VOICES.narrator_1, // Ethan Zhang
    sentences: [
      { id: 'h1_1', hanzi: '早上七点，大卫起床了。' },
      { id: 'h1_2', hanzi: '天气很好。' },
      { id: 'h1_3', hanzi: '他去饭店喝茶，吃米饭和鱼。' },
      { id: 'h1_4', hanzi: '服务员说：“欢迎你来北京！”' },
      { id: 'h1_5', hanzi: '大卫很高兴，他说：“谢谢！”' },
    ]
  },
  {
    id: 'histoire_2',
    aliases: [],
    type: 'histoire',
    voiceId: VOICES.narrator_2, // Siqi liu
    sentences: [
      { id: 'h2_1', hanzi: '今天，李经理带客户参观工厂。' },
      { id: 'h2_2', hanzi: '工厂很大，工人们都在认真工作。' },
      { id: 'h2_3', hanzi: '客户看了样品，非常满意。' },
      { id: 'h2_4', hanzi: '他们喝了乌龙茶，约定明天签合同。' },
    ]
  },

  // ==========================================
  // COMPARTIMENT 2 : ARTICLES
  // ==========================================
  {
    id: 'article_2',
    aliases: ['article_nombres'], // Supporte article_2 et article_nombres
    type: 'article',
    voiceId: VOICES.narrator_3, // Sage
    sentences: [
      { id: 'a2_1', hanzi: '在中国文化中，数字有特别的意思。' },
      { id: 'a2_2', hanzi: '数字八代表发财，大家都很喜欢。' },
      { id: 'a2_3', hanzi: '数字六也很受欢迎，因为“六六大顺”，代表做什么都顺利。' },
      { id: 'a2_4', hanzi: '数字四的发音像“死”，所以很多人不太喜欢它。' },
    ]
  },
  {
    id: 'article_1',
    aliases: [],
    type: 'article',
    voiceId: VOICES.narrator_4, // Hua feng
    sentences: [
      { id: 'a1_1', hanzi: '中国人非常喜欢喝茶。' },
      { id: 'a1_2', hanzi: '绿茶、红茶和乌龙茶都很有名。' },
      { id: 'a1_3', hanzi: '带客户参观工厂前，大家喜欢一起喝杯热茶。' },
      { id: 'a1_4', hanzi: '喝茶能让人放松，也能促进合作。' },
    ]
  },
  {
    id: 'article_carte_visite',
    aliases: ['article_cles_affaires_series', 'series_affaires_chine_ep1'], // Supporte à la fois l'épisode et la série parente
    type: 'article',
    voiceId: VOICES.narrator_1, // Ethan Zhang
    sentences: [
      { id: 'cdv_1', hanzi: '在中国，第一次见面递名片要用双手。' },
      { id: 'cdv_2', hanzi: '这是尊重的表现，非常重要。' },
      { id: 'cdv_3', hanzi: '你可以说：这是我的名片，请多关照。' },
      { id: 'cdv_4', hanzi: '对方会觉得你很有礼貌，合作会更顺利。' },
    ]
  },

  // ==========================================
  // COMPARTIMENT 3 : DIALOGUES
  // ==========================================
  {
    id: 'dialogue_1',
    aliases: [],
    type: 'dialogue',
    sentences: [
      { id: 'd1_1', speaker: 'Espoir', voiceId: VOICES.espoir_placeholder, hanzi: '王总，您好！很高兴能来到这里。' },
      { id: 'd1_2', speaker: '王总', voiceId: VOICES.lao_wang, hanzi: '您好，欢迎欢迎！请坐，先喝杯茶。' },
      { id: 'd1_3', speaker: 'Espoir', voiceId: VOICES.espoir_placeholder, hanzi: '谢谢王总，您太客气了。' },
      { id: 'd1_4', speaker: '王总', voiceId: VOICES.lao_wang, hanzi: '应该的。您什么时候到的？休息好了吗？' },
      { id: 'd1_5', speaker: 'Espoir', voiceId: VOICES.espoir_placeholder, hanzi: '昨天晚上到的，休息得挺好，谢谢关心。' },
      { id: 'd1_6', speaker: '王总', voiceId: VOICES.lao_wang, hanzi: '好，咱们先聊聊，等会儿再看产品目录。' },
    ]
  },
  {
    id: 'dialogue_2',
    aliases: [],
    type: 'dialogue',
    sentences: [
      { id: 'd2_1', speaker: 'Katia', voiceId: VOICES.katia, hanzi: '老板，请问这个多少钱一个？' },
      { id: 'd2_2', speaker: '摊主', voiceId: VOICES.generic_male_1, hanzi: '这个二十块钱一个。您要多少个？' },
      { id: 'd2_3', speaker: 'Katia', voiceId: VOICES.katia, hanzi: '如果我要一百个，可以便宜一点吗？' },
      { id: 'd2_4', speaker: '摊主', voiceId: VOICES.generic_male_1, hanzi: '可以，给您十五块一个！' },
    ]
  },
  {
    id: 'dialogue_4',
    aliases: [],
    type: 'dialogue',
    sentences: [
      { id: 'd4_1', speaker: 'Espoir', voiceId: VOICES.espoir_placeholder, hanzi: '师傅，您好！我想去北京酒店。' },
      { id: 'd4_2', speaker: '师傅', voiceId: VOICES.lao_wang, hanzi: '好的，请上车，请系好安全带。' },
      { id: 'd4_3', speaker: 'Espoir', voiceId: VOICES.espoir_placeholder, hanzi: '请问，到北京酒店要坐几分钟？' },
      { id: 'd4_4', speaker: '师傅', voiceId: VOICES.lao_wang, hanzi: '大概十五分钟就到了。' },
    ]
  },
  {
    id: 'dialogue_3',
    aliases: [],
    type: 'dialogue',
    sentences: [
      { id: 'd3_1', speaker: 'Brice', voiceId: VOICES.brice, hanzi: '服务员，请给我菜单。' },
      { id: 'd3_2', speaker: '服务员', voiceId: VOICES.generic_female_1, hanzi: '好的，这是菜单。请问您想吃什么？' },
      { id: 'd3_3', speaker: 'Brice', voiceId: VOICES.brice, hanzi: '我要一碗牛肉面，和一瓶水。' },
      { id: 'd3_4', speaker: '服务员', voiceId: VOICES.generic_female_1, hanzi: '好的，请稍等，马上来！' },
    ]
  }
];

/**
 * Normalise le volume sonore à -16 LUFS (EBU R128) via ffmpeg
 */
function normalizeLoudness(buffer, targetLufs = -16) {
  if (!ffmpegPath || !fs.existsSync(ffmpegPath)) {
    return buffer;
  }

  const tmpId = Math.random().toString(36).substring(2, 9);
  const tmpIn = path.join(os.tmpdir(), `norm_in_${tmpId}.mp3`);
  const tmpOut = path.join(os.tmpdir(), `norm_out_${tmpId}.mp3`);

  try {
    fs.writeFileSync(tmpIn, buffer);
    execSync(
      `"${ffmpegPath}" -y -i "${tmpIn}" -af loudnorm=I=${targetLufs}:TP=-1.5:LRA=11 -ar 44100 -b:a 128k "${tmpOut}"`,
      { stdio: ['pipe', 'pipe', 'ignore'] }
    );
    return fs.readFileSync(tmpOut);
  } catch (e) {
    console.warn('Loudness normalization fallback to raw:', e.message);
    return buffer;
  } finally {
    try { if (fs.existsSync(tmpIn)) fs.unlinkSync(tmpIn); } catch {}
    try { if (fs.existsSync(tmpOut)) fs.unlinkSync(tmpOut); } catch {}
  }
}

/**
 * Crée un fichier de silence MP3 pour espacer les répliques
 */
function generateSilenceFile(silencePath, durationSec = 0.18) {
  execSync(
    `"${ffmpegPath}" -y -f lavfi -i anullsrc=r=44100:cl=mono -t ${durationSec} -b:a 128k "${silencePath}"`,
    { stdio: ['pipe', 'pipe', 'ignore'] }
  );
}

function synthesizeTts(text, voiceId) {
  return new Promise((resolve, reject) => {
    const cleanText = text.trim();
    const postData = JSON.stringify({
      text: cleanText,
      model_id: 'eleven_v3',
      voice_settings: {
        stability: 0.50,
        similarity_boost: 0.75,
      }
    });

    const options = {
      hostname: 'api.elevenlabs.io',
      port: 443,
      path: `/v1/text-to-speech/${voiceId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Accept': 'audio/mpeg',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const rawBuffer = Buffer.concat(chunks);
          // Normalisation unitaire à -16 LUFS
          const normalizedBuffer = normalizeLoudness(rawBuffer, -16);
          resolve(normalizedBuffer);
        } else {
          reject(new Error(`ElevenLabs status ${res.statusCode}: ${Buffer.concat(chunks).toString()}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('🎙️ Démarrage de la génération des audios ElevenLabs v3 HD avec Normalisation Sonore (-16 LUFS)...\n');
  
  const silenceTmp = path.join(os.tmpdir(), 'silence_180ms.mp3');
  generateSilenceFile(silenceTmp, 0.18);

  for (const item of CONTENTS) {
    console.log(`▶️ Traitement de "${item.id}" (${item.type}) - ${item.sentences.length} phrases (Loudnorm -16 LUFS)...`);
    const sentenceFiles = [];
    const timestamps = [];
    let currentOffsetMs = 0;

    for (let idx = 0; idx < item.sentences.length; idx++) {
      const s = item.sentences[idx];
      const voiceId = s.voiceId || item.voiceId;
      process.stdout.write(`   [${idx + 1}/${item.sentences.length}] "${s.hanzi}"... `);

      try {
        const sentenceAudio = await synthesizeTts(s.hanzi, voiceId);
        
        // Sauvegarder le clip individuel normalisé à -16 LUFS
        const singleFilename = `${item.id}_${s.id}.mp3`;
        const singleFilePath = path.join(OUTPUT_DIR, singleFilename);
        fs.writeFileSync(singleFilePath, sentenceAudio);

        // Sauvegarder aussi les alias
        for (const alias of item.aliases) {
          fs.writeFileSync(path.join(OUTPUT_DIR, `${alias}_${s.id}.mp3`), sentenceAudio);
        }

        sentenceFiles.push(singleFilePath);

        // Durée réelle
        const durationMs = Math.round((sentenceAudio.length / 16000) * 1000);

        timestamps.push({
          sentenceId: s.id,
          startMs: currentOffsetMs,
          endMs: currentOffsetMs + durationMs,
          audioUrl: `/audio/readings/${singleFilename}`
        });

        currentOffsetMs += durationMs + 180;
        console.log(`✅ OK (-16 LUFS, ${(sentenceAudio.length / 1024).toFixed(1)} Ko)`);
        
        await new Promise((r) => setTimeout(r, 100));
      } catch (err) {
        console.log(`❌ Erreur: ${err.message}`);
      }
    }

    // Assemblage concat demuxer avec normalisation globale
    const listFile = path.join(os.tmpdir(), `concat_list_${item.id}.txt`);
    const listLines = [];
    for (let i = 0; i < sentenceFiles.length; i++) {
      listLines.push(`file '${sentenceFiles[i]}'`);
      if (i < sentenceFiles.length - 1) {
        listLines.push(`file '${silenceTmp}'`);
      }
    }
    fs.writeFileSync(listFile, listLines.join('\n'));

    const fullAudioFilename = `${item.id}.mp3`;
    const fullAudioPath = path.join(OUTPUT_DIR, fullAudioFilename);

    execSync(
      `"${ffmpegPath}" -y -f concat -safe 0 -i "${listFile}" -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 44100 -b:a 128k "${fullAudioPath}"`,
      { stdio: ['pipe', 'pipe', 'ignore'] }
    );
    try { fs.unlinkSync(listFile); } catch {}

    // Sauvegarder aussi pour les alias
    const assembledBuffer = fs.readFileSync(fullAudioPath);
    for (const alias of item.aliases) {
      fs.writeFileSync(path.join(OUTPUT_DIR, `${alias}.mp3`), assembledBuffer);
    }

    // Sauvegarder les métadonnées de synchronisation
    const metaFilename = `${item.id}_meta.json`;
    const metaContent = JSON.stringify({
      contentId: item.id,
      aliases: item.aliases,
      type: item.type,
      fullAudioUrl: `/audio/readings/${fullAudioFilename}`,
      loudness: '-16 LUFS (EBU R128 standard)',
      totalDurationMs: currentOffsetMs,
      sentences: timestamps
    }, null, 2);

    fs.writeFileSync(path.join(OUTPUT_DIR, metaFilename), metaContent);
    for (const alias of item.aliases) {
      fs.writeFileSync(path.join(OUTPUT_DIR, `${alias}_meta.json`), metaContent);
    }

    console.log(`   ✨ Fichier assemblé égalisé à -16 LUFS : public/audio/readings/${fullAudioFilename} (${(fs.statSync(fullAudioPath).size / 1024).toFixed(1)} Ko)\n`);
  }

  try { fs.unlinkSync(silenceTmp); } catch {}
  console.log('🎉 Tous les fichiers audio ElevenLabs v3 ont été normalisés à -16 LUFS avec succès !');
}

run();
