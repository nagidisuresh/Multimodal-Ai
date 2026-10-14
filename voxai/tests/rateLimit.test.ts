import { describe, it, expect } from 'vitest';
import { checkRateLimit } from '../lib/rateLimit';

describe('Rate Limiter', () => {
  it('should allow requests under the limit', () => {
    const id = 'test-client-1';
    const res1 = checkRateLimit(id, { limit: 5, windowMs: 1000 });
    expect(res1.success).toBe(true);
    expect(res1.remaining).toBe(4);
  });

  it('should reject requests exceeding the limit', () => {
    const id = 'test-client-2';
    for (let i = 0; i < 3; i++) {
      checkRateLimit(id, { limit: 3, windowMs: 2000 });
    }
    const overflow = checkRateLimit(id, { limit: 3, windowMs: 2000 });
    expect(overflow.success).toBe(false);
    expect(overflow.remaining).toBe(0);
  });
});
