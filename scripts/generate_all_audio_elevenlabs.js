const fs = require('fs');
const path = require('path');
const https = require('https');

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
  espoir_placeholder: 'MQkiCZS3mnl44caDtxkJ', // Guan Tao Bao (en attendant le clone)

  // Voix Secondaires
  generic_male_1: 'MQkiCZS3mnl44caDtxkJ',   // Guan Tao Bao
  generic_male_2: 'nss5M23ZSzhG3Tn0b7wN',   // Rippel
  generic_female_1: 'hkfHEbBvdQFNX4uWHqRF', // Stacy
  generic_female_2: 'bhJUNIXWQQ94l8eI2VUf', // Amy
};

// 3. Contenus à synthétiser
const CONTENTS = [
  // --- HISTOIRES (Narration) ---
  {
    id: 'histoire_1',
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
    type: 'histoire',
    voiceId: VOICES.narrator_2, // Siqi liu
    sentences: [
      { id: 'h2_1', hanzi: '今天，李经理带客户参观工厂。' },
      { id: 'h2_2', hanzi: '工厂很大，工人们都在认真工作。' },
      { id: 'h2_3', hanzi: '客户看了样品，非常满意。' },
      { id: 'h2_4', hanzi: '他们喝了乌龙茶，约定明天签合同。' },
    ]
  },

  // --- ARTICLES (Narration) ---
  {
    id: 'article_nombres',
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
    id: 'series_affaires_chine_ep1',
    type: 'article',
    voiceId: VOICES.narrator_1, // Ethan Zhang
    sentences: [
      { id: 'as1_1', hanzi: '在中国做生意，名片非常重要。' },
      { id: 'as1_2', hanzi: '递名片时，要用双手，正面朝向对方。' },
      { id: 'as1_3', hanzi: '收到名片后，请认真看几秒，不要马上放进口袋。' },
      { id: 'as1_4', hanzi: '对方会觉得你很有礼貌，合作会更顺利。' },
    ]
  },

  // --- DIALOGUES (Multi-voix) ---
  {
    id: 'dialogue_1',
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
    type: 'dialogue',
    sentences: [
      { id: 'd3_1', speaker: 'Brice', voiceId: VOICES.brice, hanzi: '服务员，请给我菜单。' },
      { id: 'd3_2', speaker: '服务员', voiceId: VOICES.generic_female_1, hanzi: '好的，这是菜单。请问您想吃什么？' },
      { id: 'd3_3', speaker: 'Brice', voiceId: VOICES.brice, hanzi: '我要一碗牛肉面，和一瓶水。' },
      { id: 'd3_4', speaker: '服务员', voiceId: VOICES.generic_female_1, hanzi: '好的，请稍等，马上来！' },
    ]
  }
];

function formatChineseTextWithNaturalPacing(textZh) {
  let formatted = textZh.trim();
  if (formatted.includes('[pause]')) {
    return formatted;
  }
  formatted = formatted
    .replace(/，\s*/g, '， [pause] ')
    .replace(/,\s*/g, ', [pause] ')
    .replace(/、\s*/g, '、 [pause] ')
    .replace(/；\s*/g, '； [pause] ')
    .replace(/：\s*/g, '： [pause] ')
    .replace(/\.\.\.\s*/g, '... [pause] ')
    .replace(/……\s*/g, '…… [pause] ');

  return formatted.replace(/\s+/g, ' ').trim();
}

function synthesizeTts(text, voiceId) {
  return new Promise((resolve, reject) => {
    const promptText = formatChineseTextWithNaturalPacing(text);
    const postData = JSON.stringify({
      text: promptText,
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
          resolve(Buffer.concat(chunks));
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

function createSilenceBuffer(durationMs = 450) {
  // Standard MP3 silence frame
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

async function run() {
  console.log('🎙️ Démarrage de la génération des audios ElevenLabs HD...\n');
  const silence = createSilenceBuffer(450);

  for (const item of CONTENTS) {
    console.log(`▶️ Traitement de "${item.id}" (${item.type}) - ${item.sentences.length} phrases...`);
    const fullBuffers = [];
    const timestamps = [];
    let currentOffsetMs = 0;

    for (let idx = 0; idx < item.sentences.length; idx++) {
      const s = item.sentences[idx];
      const voiceId = s.voiceId || item.voiceId;
      process.stdout.write(`   [${idx + 1}/${item.sentences.length}] "${s.hanzi}"... `);

      try {
        const sentenceAudio = await synthesizeTts(s.hanzi, voiceId);
        
        // Sauvegarder aussi le clip individuel par phrase
        const singleFilename = `${item.id}_${s.id}.mp3`;
        fs.writeFileSync(path.join(OUTPUT_DIR, singleFilename), sentenceAudio);

        // Estimer la durée
        const durationMs = Math.round((sentenceAudio.length / 16000) * 1000);

        timestamps.push({
          sentenceId: s.id,
          startMs: currentOffsetMs,
          endMs: currentOffsetMs + durationMs,
          audioUrl: `/audio/readings/${singleFilename}`
        });

        fullBuffers.push(sentenceAudio);
        fullBuffers.push(silence);
        currentOffsetMs += durationMs + 450;

        console.log(`✅ OK (${(sentenceAudio.length / 1024).toFixed(1)} Ko)`);
        
        // Petite pause de 150ms entre requêtes
        await new Promise((r) => setTimeout(r, 150));
      } catch (err) {
        console.log(`❌ Erreur: ${err.message}`);
      }
    }

    // Sauvegarder le fichier audio assemblé complet
    const fullAudioFilename = `${item.id}.mp3`;
    const fullAudioPath = path.join(OUTPUT_DIR, fullAudioFilename);
    fs.writeFileSync(fullAudioPath, Buffer.concat(fullBuffers));

    // Sauvegarder les métadonnées de synchronisation
    const metaFilename = `${item.id}_meta.json`;
    fs.writeFileSync(
      path.join(OUTPUT_DIR, metaFilename), 
      JSON.stringify({
        contentId: item.id,
        type: item.type,
        fullAudioUrl: `/audio/readings/${fullAudioFilename}`,
        totalDurationMs: currentOffsetMs,
        sentences: timestamps
      }, null, 2)
    );

    console.log(`   ✨ Fichier assemblé créé : public/audio/readings/${fullAudioFilename} (${(fs.statSync(fullAudioPath).size / 1024).toFixed(1)} Ko)\n`);
  }

  console.log('🎉 Tous les fichiers audio ElevenLabs ont été générés avec succès !');
}

run();
