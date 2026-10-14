import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Server-side Gemini API client.
 * Calls Gemini ONLY from Next.js server route handlers.
 * Never accesses secrets on the client.
 */

export function getGeminiApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.trim() === '' || key.startsWith('your_') || key.length < 15) {
    return null;
  }
  return key.trim();
}

export function getGeminiModelName(): string {
  return process.env.GEMINI_MODEL || 'gemini-1.5-flash';
}

export function getGeminiClient(): GoogleGenerativeAI | null {
  const key = getGeminiApiKey();
  if (!key) return null;
  return new GoogleGenerativeAI(key);
}

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
].filter((m): m is string => Boolean(m));

/**
 * Execute generation with automatic fallback to alternative Gemini models
 */
export async function generateWithFallback(
  fn: (modelName: string) => Promise<any>
): Promise<any> {
  const models = Array.from(new Set(CANDIDATE_MODELS));
  let lastError: any = null;

  for (const model of models) {
    try {
      return await fn(model);
    } catch (err: any) {
      lastError = err;
      const msg = err?.message || '';
      // If 404 or model not found, try next candidate
      if (msg.includes('404') || msg.includes('not found') || msg.includes('no longer available')) {
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}
