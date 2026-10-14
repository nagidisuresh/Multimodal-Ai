import { describe, it, expect } from 'vitest';
import { LANGUAGES, getLanguageByCode, getBCP47 } from '../lib/languages';

describe('Language Configuration', () => {
  it('should support at least 21 languages', () => {
    expect(LANGUAGES.length).toBeGreaterThanOrEqual(21);
  });

  it('should include Telugu, Hindi, Tamil, and English', () => {
    const codes = LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('te');
    expect(codes).toContain('hi');
    expect(codes).toContain('ta');
  });

  it('should return correct BCP47 code for Telugu', () => {
    expect(getBCP47('te')).toBe('te-IN');
  });

  it('should fallback to default for unknown language code', () => {
    const lang = getLanguageByCode('unknown-code');
    expect(lang.code).toBe('en');
  });
});
