import { z } from 'zod';

// Chat request schema
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model', 'assistant', 'system']),
  content: z.string().min(1, 'Message cannot be empty').max(10000, 'Message is too long'),
});

export const ChatRequestSchema = z.object({
  messages: z.array(ChatMessageSchema).min(1, 'At least one message is required').max(30),
  mode: z.enum(['general', 'translation', 'assistant']).default('general'),
  language: z.string().default('en'),
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Translate request schema
export const TranslateRequestSchema = z.object({
  text: z.string().min(1, 'Text to translate is required').max(10000, 'Text exceeds 10,000 character limit'),
  sourceLang: z.string().min(1, 'Source language is required'),
  targetLang: z.string().min(1, 'Target language is required'),
  style: z.enum(['normal', 'formal', 'casual', 'professional', 'simple']).default('normal'),
});

export type TranslateRequest = z.infer<typeof TranslateRequestSchema>;

export interface TranslateResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  detectedLang?: string;
  isMock?: boolean;
}

// Transcribe request schema
export const TranscribeRequestSchema = z.object({
  language: z.string().optional().default('en-US'),
  audioBase64: z.string().optional(),
});

export type TranscribeRequest = z.infer<typeof TranscribeRequestSchema>;

export interface TranscribeResponse {
  transcript: string;
  detectedLanguage?: string;
  isMock?: boolean;
}

// Voice Translate request schema
export const VoiceTranslateRequestSchema = z.object({
  text: z.string().optional(),
  audioBase64: z.string().optional(),
  sourceLang: z.string().default('auto'),
  targetLang: z.string().min(1, 'Target language is required'),
  speaker: z.enum(['personA', 'personB', 'single']).default('single'),
});

export type VoiceTranslateRequest = z.infer<typeof VoiceTranslateRequestSchema>;

export interface VoiceTranslateResponse {
  transcript: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  isMock?: boolean;
}

// Health response
export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  geminiConfigured: boolean;
  model: string;
}
