// Minimal in-memory rate limiter — SERVER ONLY.
//
// No rate-limiting infrastructure (Redis/Upstash, a KV store, etc.) exists
// anywhere else in this repo, so this is a deliberately small, dependency-free
// fixed-window limiter rather than a new external service. It is a
// best-effort spam-slowing layer, not a hard security boundary:
//
//   - State lives in a plain in-memory Map, scoped to one running process.
//   - On serverless platforms (Vercel), each cold-started instance starts
//     with an empty map, and traffic can land on different warm instances,
//     so a determined abuser can exceed the nominal limit across instances.
//   - It DOES still meaningfully throttle the common case: a script hammering
//     one warm instance, or a single browser double-submitting.
//
// If stricter, cross-instance limiting is ever needed, swap this module's
// internals for a real store (Upstash Redis, etc.) — callers only depend on
// the `checkRateLimit()` signature below, not the storage mechanism.

type Bucket = { count: number; windowStartMs: number };

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so the map doesn't grow forever on a long-lived
// warm instance — runs at most once per call, only when the map gets large.
const MAX_TRACKED_KEYS = 5000;

function cleanupIfNeeded(nowMs: number, windowMs: number) {
  if (buckets.size < MAX_TRACKED_KEYS) return;
  for (const [key, bucket] of buckets) {
    if (nowMs - bucket.windowStartMs > windowMs) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Fixed-window limit: at most `limit` calls per `windowMs` for a given key.
 * Returns ok:false once the window's count is exhausted, with the number of
 * seconds until the window resets.
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  cleanupIfNeeded(now, windowMs);

  const existing = buckets.get(key);
  if (!existing || now - existing.windowStartMs > windowMs) {
    buckets.set(key, { count: 1, windowStartMs: now });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.windowStartMs + windowMs - now) / 1000));
    return { ok: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, retryAfterSeconds: 0 };
}

/** Best-effort client IP extraction behind Vercel's proxy. Never throws. */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
