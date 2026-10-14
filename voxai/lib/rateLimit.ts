/**
 * In-memory token/sliding-window rate limiter.
 * Protects server routes from abuse without external Redis dependencies.
 */
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const cache = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  limit?: number; // requests per window
  windowMs?: number; // window in milliseconds
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetInMs: number } {
  const limit = options.limit || 30; // 30 requests
  const windowMs = options.windowMs || 60 * 1000; // per 1 minute
  const now = Date.now();

  const record = cache.get(identifier);

  if (!record || now > record.resetAt) {
    cache.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetInMs: Math.max(0, record.resetAt - now),
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: limit - record.count,
    resetInMs: Math.max(0, record.resetAt - now),
  };
}

// Periodically clean stale records
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of cache.entries()) {
      if (now > record.resetAt) {
        cache.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}
