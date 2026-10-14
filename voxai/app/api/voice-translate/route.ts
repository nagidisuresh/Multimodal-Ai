import { NextRequest, NextResponse } from 'next/server';
import { VoiceTranslateRequestSchema } from '@/types/api';
import { getGeminiClient, generateWithFallback } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rateLimit';
import { getMockTranslation } from '@/lib/mockEngine';
import { getLanguageByCode } from '@/lib/languages';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const rate = checkRateLimit(`voice-translate:${ip}`, { limit: 30, windowMs: 60000 });
    if (!rate.success) {
      return NextResponse.json(
        { error: 'Voice translate rate limit reached. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = VoiceTranslateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { text, sourceLang, targetLang } = parsed.data;

    if (!text || text.trim() === '') {
      return NextResponse.json(
        { error: 'No transcript text provided to voice translate.' },
        { status: 400 }
      );
    }

    const client = getGeminiClient();
    const targetLangObj = getLanguageByCode(targetLang);

    if (!client) {
      const mock = getMockTranslation(text, sourceLang, targetLang, 'casual');
      return NextResponse.json({
        transcript: text,
        translatedText: mock.translatedText,
        sourceLang,
        targetLang,
        isMock: true,
      });
    }

    const prompt = `Translate this spoken conversational statement accurately into ${targetLangObj.name} (${targetLang}).
Source language context: ${sourceLang === 'auto' ? 'Auto-detect' : sourceLang}.

RULES:
1. Translate for spoken conversational delivery (natural phrasing, fluent, culturally attuned).
2. Preserve meaning, tone, emotion, names, and numbers.
3. Return ONLY the translated spoken text. Zero explanations or notes.

Spoken input:
"""
${text}
"""`;

    const result = await generateWithFallback(async (modelName) => {
      const model = client.getGenerativeModel({ model: modelName });
      const resp = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      return resp.response.text();
    });

    const translatedText = result?.trim() || '';

    return NextResponse.json({
      transcript: text,
      translatedText,
      sourceLang,
      targetLang,
      isMock: false,
    });
  } catch (err: any) {
    console.error('[API Voice Translate Error]:', err?.message || err);
    return NextResponse.json(
      { error: err?.message || 'Voice translation orchestration failed.' },
      { status: 500 }
    );
  }
}
