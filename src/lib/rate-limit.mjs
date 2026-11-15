/**
 * Fixed-window counters kept in memory. On serverless each instance counts on its own, so the real
 * ceiling is the limit times the number of warm instances: enough to stop one visitor or script from
 * running up the model bill, not an exact quota.
 */
export function createLimiter({ limit, windowMs, maxKeys = 10000 }) {
  const windows = new Map();
  return {
    /** Counts one hit for `key`; returns how long to wait when the limit is already reached. */
    hit(key, now = Date.now()) {
      let entry = windows.get(key);
      if (!entry || entry.resetAt <= now) {
        if (windows.size >= maxKeys) {
          for (const [stale, value] of windows) if (value.resetAt <= now) windows.delete(stale);
          // Still full of live windows: drop the oldest rather than grow without bound.
          if (windows.size >= maxKeys) windows.delete(windows.keys().next().value);
        }
        entry = { count: 0, resetAt: now + windowMs };
        windows.set(key, entry);
      }
      if (entry.count >= limit) return { allowed: false, retryAfterMs: entry.resetAt - now };
      entry.count++;
      return { allowed: true, retryAfterMs: 0 };
    },
  };
}

/** The visitor's address as Vercel reports it; falls back to one shared bucket when unknown. */
export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}
