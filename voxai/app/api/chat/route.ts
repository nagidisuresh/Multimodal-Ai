import { NextRequest, NextResponse } from 'next/server';
import { ChatRequestSchema } from '@/types/api';
import { getGeminiClient, generateWithFallback } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rateLimit';
import { getMockChatReply } from '@/lib/mockEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'anon';
    const rate = checkRateLimit(`chat:${ip}`, { limit: 50, windowMs: 60000 });
    if (!rate.success) {
      return NextResponse.json(
        { error: 'Rate limit reached. Please wait a moment before sending another message.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid chat payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { messages, mode, language } = parsed.data;
    const client = getGeminiClient();

    // Mode-specific system instructions
    let modeInstruction = '';
    if (mode === 'translation') {
      modeInstruction = 'You are in Translation Assistant Mode. Focus on translating and explaining linguistic nuances.';
    } else if (mode === 'assistant') {
      modeInstruction = 'You are in Voice Assistant Mode. Keep responses conversational, concise (under 3 sentences where possible), and natural when spoken aloud.';
    } else {
      modeInstruction = 'You are a helpful, concise, culturally aware AI assistant.';
    }

    const systemInstruction = `${modeInstruction}
Reply in the user's preferred language (code: ${language}).
Keep explanations clear, structured, and easy to read. Use markdown formatting where appropriate.`;

    // Demo Mode if no Gemini client
    if (!client) {
      const lastMsg = messages[messages.length - 1]?.content || '';
      const mockReply = getMockChatReply(lastMsg, language);

      // Return as text stream so client streaming works smoothly in Demo Mode
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = mockReply.split(' ');
          for (const word of words) {
            controller.enqueue(encoder.encode(word + ' '));
            await new Promise((r) => setTimeout(r, 25));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-VoxAI-Mock': 'true',
        },
      });
    }

    // Format messages for GoogleGenerativeAI
    const contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Generate streaming response with fallback
    const streamResult = await generateWithFallback(async (modelName) => {
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction,
      });

      return await model.generateContentStream({
        contents,
      });
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResult.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
              controller.enqueue(encoder.encode(chunkText));
            }
          }
          controller.close();
        } catch (streamErr) {
          controller.error(streamErr);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err: any) {
    console.error('[API Chat Error]:', err?.message || err);

    // Fallback friendly response
    const encoder = new TextEncoder();
    const fallbackText = `I apologize, but I encountered a temporary connection issue with the AI engine. Please verify your internet connection or check back in a few moments. (Details: ${err?.message || 'Unknown'})`;
    return new Response(encoder.encode(fallbackText), {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }
}
