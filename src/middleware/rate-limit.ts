import type { MiddlewareHandler } from "hono";
import { getEnv } from "../db/client.ts";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export function edgeRateLimiter(options?: {
  maxRequests?: number;
  windowMs?: number;
}): MiddlewareHandler {
  const max = options?.maxRequests ?? Number(getEnv("RATE_LIMIT_MAX_REQ") || 60);
  const windowMs = options?.windowMs ?? Number(getEnv("RATE_LIMIT_WINDOW_SEC") || 60) * 1000;

  // In-memory rate limiting map keyed by client identifier (IP or fallback)
  const store = new Map<string, RateLimitRecord>();

  // Lazy cleanup of stale records every 2 minutes
  let lastCleanup = Date.now();

  return async (c, next) => {
    // Check if rate limiting is explicitly disabled
    if (getEnv("RATE_LIMIT_ENABLED") === "false") {
      return next();
    }

    const now = Date.now();

    if (now - lastCleanup > 120000) {
      for (const [key, record] of store.entries()) {
        if (now > record.resetAt) {
          store.delete(key);
        }
      }
      lastCleanup = now;
    }

    // Determine client identifier: CF-Connecting-IP, X-Forwarded-For, or fallback
    const forwarded = c.req.header("cf-connecting-ip") ||
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
      "edge-client-default";

    const record = store.get(forwarded);

    if (!record || now > record.resetAt) {
      store.set(forwarded, {
        count: 1,
        resetAt: now + windowMs,
      });
      c.header("X-RateLimit-Limit", String(max));
      c.header("X-RateLimit-Remaining", String(max - 1));
      c.header("X-RateLimit-Reset", String(Math.ceil((now + windowMs) / 1000)));
      return next();
    }

    if (record.count >= max) {
      const retryAfterSec = Math.max(1, Math.ceil((record.resetAt - now) / 1000));
      c.header("Retry-After", String(retryAfterSec));
      c.header("X-RateLimit-Limit", String(max));
      c.header("X-RateLimit-Remaining", "0");
      c.header("X-RateLimit-Reset", String(Math.ceil(record.resetAt / 1000)));
      return c.json(
        {
          error: "Too Many Requests: Rate limit exceeded",
          status: 429,
          retryAfterSeconds: retryAfterSec,
          timestamp: new Date().toISOString(),
        },
        429
      );
    }

    record.count++;
    c.header("X-RateLimit-Limit", String(max));
    c.header("X-RateLimit-Remaining", String(max - record.count));
    c.header("X-RateLimit-Reset", String(Math.ceil(record.resetAt / 1000)));

    return next();
  };
}
