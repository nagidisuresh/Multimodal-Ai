import { NextResponse } from 'next/server';
import { getGeminiApiKey, getGeminiModelName } from '@/lib/gemini';
import { HealthResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export async function GET() {
  const hasKey = Boolean(getGeminiApiKey());
  const model = getGeminiModelName();

  const body: HealthResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: hasKey,
    model,
  };

  return NextResponse.json(body, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
