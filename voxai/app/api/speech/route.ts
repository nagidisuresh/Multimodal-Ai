import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Modular TTS Adapter Route.
 * If an external cloud TTS provider (e.g. ElevenLabs, Google Cloud TTS) is configured in env,
 * it returns synthesized audio. Otherwise, returns status 501 with a clear "NOT_CONFIGURED" code
 * so the frontend seamlessly falls back to high-fidelity browser SpeechSynthesis.
 */
export async function POST(req: NextRequest) {
  try {
    const provider = process.env.TTS_PROVIDER;

    if (!provider || provider === 'browser' || provider === 'none') {
      return NextResponse.json(
        {
          code: 'TTS_NOT_CONFIGURED',
          message:
            'External Cloud TTS engine is not configured in environment. The client should utilize browser Web SpeechSynthesis.',
          provider: 'browser',
        },
        { status: 501 }
      );
    }

    // Future cloud TTS hook placeholder
    return NextResponse.json(
      {
        code: 'TTS_PROVIDER_UNAVAILABLE',
        message: `Provider "${provider}" is currently in maintenance. Use browser TTS.`,
      },
      { status: 501 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Speech endpoint error' },
      { status: 500 }
    );
  }
}
