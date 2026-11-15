import assert from "node:assert/strict";
import { test } from "node:test";
import { clientIp, createLimiter } from "../src/lib/rate-limit.mjs";

test("allows up to the limit per key, then reports the wait until the window resets", () => {
  const limiter = createLimiter({ limit: 2, windowMs: 1000 });
  assert.equal(limiter.hit("a", 0).allowed, true);
  assert.equal(limiter.hit("a", 100).allowed, true);
  assert.deepEqual(limiter.hit("a", 400), { allowed: false, retryAfterMs: 600 });
  assert.equal(limiter.hit("b", 400).allowed, true, "keys are counted separately");
  assert.equal(limiter.hit("a", 1000).allowed, true, "a new window starts");
});

test("stays within maxKeys", () => {
  const limiter = createLimiter({ limit: 1, windowMs: 1000, maxKeys: 2 });
  limiter.hit("a", 0);
  limiter.hit("b", 0);
  limiter.hit("c", 0);
  assert.equal(limiter.hit("a", 10).allowed, true, "the oldest live window was dropped");
});

test("reads the first forwarded address", () => {
  const request = (headers) => new Request("https://example.com", { headers });
  assert.equal(clientIp(request({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" })), "1.2.3.4");
  assert.equal(clientIp(request({ "x-real-ip": "5.6.7.8" })), "5.6.7.8");
  assert.equal(clientIp(request({})), "unknown");
});
