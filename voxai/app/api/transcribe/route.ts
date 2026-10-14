import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, generateWithFallback } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rateLimit';
import { getMockTranscription } from '@/lib/mockEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const rate = checkRateLimit(`transcribe:${ip}`, { limit: 20, windowMs: 60000 });
    if (!rate.success) {
      return NextResponse.json(
        { error: 'Transcription rate limit exceeded. Please wait a minute.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('audio') as File | null;
    const language = (formData.get('language') as string) || 'en-US';

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided in request.' },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: 'Audio recording is empty or contains no sound.' },
        { status: 400 }
      );
    }

    const client = getGeminiClient();

    // Fallback if no Gemini client configured
    if (!client) {
      return NextResponse.json({
        transcript: getMockTranscription(language),
        detectedLanguage: language,
        isMock: true,
      });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || 'audio/webm';
    const base64Audio = buffer.toString('base64');

    const prompt = `Transcribe the spoken audio with high fidelity.
Expected spoken language is around: ${language}.
Rules:
1. Provide ONLY the direct, verbatim transcription of what was spoken.
2. Do NOT add meta commentary, timestamps, speaker headers, or formatting.
3. If the audio is completely silent or unintelligible, respond with: "[No speech detected]"`;

    const result = await generateWithFallback(async (modelName) => {
      const model = client.getGenerativeModel({ model: modelName });
      const resp = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Audio,
            mimeType: mimeType.split(';')[0], // strip codecs parameter
          },
        },
      ]);
      return resp.response.text();
    });

    const transcript = result?.trim() || '[No speech detected]';

    return NextResponse.json({
      transcript,
      detectedLanguage: language,
      isMock: false,
    });
  } catch (err: any) {
    console.error('[API Transcribe Error]:', err?.message || err);
    return NextResponse.json({
      transcript: getMockTranscription(),
      detectedLanguage: 'en-US',
      isMock: true,
      notice: 'Audio model fallback applied.',
    });
  }
}
