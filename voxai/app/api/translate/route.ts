import { NextRequest, NextResponse } from 'next/server';
import { TranslateRequestSchema } from '@/types/api';
import { getGeminiClient, generateWithFallback } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rateLimit';
import { getMockTranslation } from '@/lib/mockEngine';
import { getLanguageByCode } from '@/lib/languages';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    // Basic Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const rate = checkRateLimit(`translate:${ip}`, { limit: 40, windowMs: 60000 });
    if (!rate.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before translating again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = TranslateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { text, sourceLang, targetLang, style } = parsed.data;
    const targetLangObj = getLanguageByCode(targetLang);
    const sourceLangObj = getLanguageByCode(sourceLang);

    const client = getGeminiClient();

    // Offline / Demo Mode fallback
    if (!client) {
      const mock = getMockTranslation(text, sourceLang, targetLang, style);
      return NextResponse.json({
        translatedText: mock.translatedText,
        sourceLang,
        targetLang,
        detectedLang: mock.detectedLang,
        isMock: true,
      });
    }

    // Prepare system instructions for translation
    const styleInstructionMap: Record<string, string> = {
      normal: 'natural, fluent, and faithful to original meaning',
      formal: 'formal, respectful, and grammatically precise',
      casual: 'conversational, friendly, and colloquial',
      professional: 'polished, business-appropriate, and professional',
      simple: 'simple language using basic, accessible vocabulary',
    };

    const styleGuide = styleInstructionMap[style] || styleInstructionMap.normal;
    const sourceConstraint = sourceLang === 'auto'
      ? 'Detect the source language automatically.'
      : `The source language is ${sourceLangObj.name} (${sourceLang}).`;

    const prompt = `You are a high-precision, culturally nuanced multilingual translation engine.
${sourceConstraint}
Translate the text into ${targetLangObj.name} (${targetLang}).
Tone/Style Requirement: ${styleGuide}.

CRITICAL RULES:
1. Preserve original formatting, bullet points, line breaks, names, technical terms, currencies, numbers, and dates.
2. Return ONLY the translated text. Do NOT add commentary, explanations, greetings, quotes, or notes.
3. If source text is already in the target language, return it accurately without unnecessary mutation.

Text to translate:
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
      translatedText,
      sourceLang,
      targetLang,
      detectedLang: sourceLang === 'auto' ? 'detected' : sourceLang,
      isMock: false,
    });
  } catch (err: any) {
    console.error('[API Translate Error]:', err?.message || err);

    // Provide friendly fallback if Gemini API call errors out
    const body = await req.clone().json().catch(() => ({}));
    if (body.text && body.targetLang) {
      const mock = getMockTranslation(body.text, body.sourceLang || 'auto', body.targetLang, body.style || 'normal');
      return NextResponse.json({
        translatedText: mock.translatedText,
        sourceLang: body.sourceLang || 'auto',
        targetLang: body.targetLang,
        detectedLang: mock.detectedLang,
        isMock: true,
        notice: 'Live translation service is temporarily unavailable. Displaying demo translation.',
      });
    }

    return NextResponse.json(
      { error: err?.message || 'Translation service encounter an error.' },
      { status: 500 }
    );
  }
}
