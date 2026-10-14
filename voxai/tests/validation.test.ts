import { describe, it, expect } from 'vitest';
import { TranslateRequestSchema, ChatRequestSchema } from '../types/api';

describe('Zod API Schemas Validation', () => {
  it('should validate valid translation request', () => {
    const valid = {
      text: 'Hello world',
      sourceLang: 'en',
      targetLang: 'es',
      style: 'formal',
    };
    const parsed = TranslateRequestSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('should reject empty translation text', () => {
    const invalid = {
      text: '',
      sourceLang: 'en',
      targetLang: 'es',
    };
    const parsed = TranslateRequestSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('should validate chat request with messages', () => {
    const validChat = {
      messages: [{ role: 'user', content: 'What is the capital of France?' }],
      mode: 'general',
      language: 'en',
    };
    const parsed = ChatRequestSchema.safeParse(validChat);
    expect(parsed.success).toBe(true);
  });

  it('should reject empty chat messages array', () => {
    const invalidChat = {
      messages: [],
      mode: 'general',
    };
    const parsed = ChatRequestSchema.safeParse(invalidChat);
    expect(parsed.success).toBe(false);
  });
});
