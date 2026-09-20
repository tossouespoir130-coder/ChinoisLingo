import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { exigerAdmin } from '@/lib/admin/garde';
import { getVoiceConfigs } from '@/lib/audio/voiceAllocator';
import { 
  generateSentenceAudio, 
  generateStoryOrArticleAudio, 
  generateDialogueAudio, 
  SentenceAudioInput 
} from '@/lib/services/elevenlabsService';

/**
 * GET: Liste toutes les voix et leur statut de configuration (réservé aux admins)
 */
export async function GET(req: NextRequest) {
  const garde = await exigerAdmin(req);
  if (!garde.ok) {
    return NextResponse.json({ success: false, error: garde.erreur }, { status: garde.statut });
  }

  try {
    const voiceMap = await getVoiceConfigs();
    const voices = Array.from(voiceMap.values());

    const recurrent = voices.filter((v) => v.category === 'recurrent');
    const founder = voices.filter((v) => v.category === 'founder');
    const narrators = voices.filter((v) => v.category === 'narrator');
    const generic = voices.filter((v) => v.category === 'generic');

    return NextResponse.json({
      success: true,
      hasApiKey: Boolean(process.env.ELEVENLABS_API_KEY),
      summary: {
        total: voices.length,
        configured: voices.filter((v) => Boolean(v.voiceId)).length,
        missing: voices.filter((v) => !v.voiceId).length,
      },
      categories: {
        recurrent,
        founder,
        narrators,
        generic,
      },
      allVoices: voices,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * PATCH: Met à jour le voice_id ou les réglages d'un personnage dans la table `personnages_voix`
 */
export async function PATCH(req: NextRequest) {
  const garde = await exigerAdmin(req);
  if (!garde.ok) {
    return NextResponse.json({ success: false, error: garde.erreur }, { status: garde.statut });
  }

  try {
    const body = await req.json();
    const { id, voiceId, stability, similarityBoost, modelId } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Identifiant du personnage manquant (id).' }, { status: 400 });
    }

    const updatePayload: import('@/lib/supabase/types').Database['public']['Tables']['personnages_voix']['Update'] = {
      updated_at: new Date().toISOString(),
    };
    if (voiceId !== undefined) updatePayload.voice_id = voiceId ? voiceId.trim() : null;
    if (stability !== undefined) updatePayload.stability = Number(stability);
    if (similarityBoost !== undefined) updatePayload.similarity_boost = Number(similarityBoost);
    if (modelId !== undefined) updatePayload.model_id = modelId;

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('personnages_voix')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, voice: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/**
 * POST: Génère l'audio (test d'une voix, ou assemblage complet d'une histoire/dialogue)
 */
export async function POST(req: NextRequest) {
  const garde = await exigerAdmin(req);
  if (!garde.ok) {
    return NextResponse.json({ success: false, error: garde.erreur }, { status: garde.statut });
  }

  try {
    const body = await req.json();
    const { type, contentId, characters, sentences, testText, voiceKey, apiKey } = body;

    const voiceMap = await getVoiceConfigs();

    // 1. Mode Test Rapide d'une voix spécifique
    if (type === 'test') {
      if (!voiceKey || !testText) {
        return NextResponse.json({ success: false, error: 'voiceKey et testText requis pour le test.' }, { status: 400 });
      }

      const voiceConfig = voiceMap.get(voiceKey);
      if (!voiceConfig) {
        return NextResponse.json({ success: false, error: `Voix "${voiceKey}" introuvable.` }, { status: 404 });
      }

      const audioBuffer = await generateSentenceAudio(testText, voiceConfig, apiKey);
      return new Response(new Uint8Array(audioBuffer), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `inline; filename="test_${voiceKey}.mp3"`,
        },
      });
    }

    // 2. Mode Histoires & Articles (Narration pure avec rotation des 3 voix)
    if (type === 'histoire' || type === 'article') {
      if (!sentences || !Array.isArray(sentences) || sentences.length === 0) {
        return NextResponse.json({ success: false, error: 'Tableau sentences requis.' }, { status: 400 });
      }

      const result = await generateStoryOrArticleAudio(contentId || 'content_default', sentences as SentenceAudioInput[], apiKey);
      return new Response(new Uint8Array(result.fullAudioBuffer), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${contentId || 'narration'}.mp3"`,
          'X-Sentence-Timestamps': JSON.stringify(result.sentenceTimestamps),
        },
      });
    }

    // 3. Mode Dialogue (Multi-voix avec anti-collision)
    if (type === 'dialogue') {
      if (!sentences || !Array.isArray(sentences) || sentences.length === 0) {
        return NextResponse.json({ success: false, error: 'Tableau sentences requis.' }, { status: 400 });
      }

      const result = await generateDialogueAudio(characters || [], sentences as SentenceAudioInput[], apiKey);
      return new Response(new Uint8Array(result.fullAudioBuffer), {
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${contentId || 'dialogue'}.mp3"`,
          'X-Sentence-Timestamps': JSON.stringify(result.sentenceTimestamps),
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Type de génération non supporté (test, histoire, article, dialogue).' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur lors de la génération audio';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
