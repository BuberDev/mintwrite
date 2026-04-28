/**
 * ─── Auth: Rate Limit Helpers ─────────────────────────────────────────────────
 *
 * Tests the pure helper functions used by the rate limiting system.
 * The actual rate limiting logic hits Postgres and is tested at integration
 * level, but the key builders and fingerprint functions are pure.
 */

import { describe, it, expect } from "vitest";
import {
  buildRateLimitKey,
  buildRequestFingerprint,
} from "@/lib/auth/rate-limit";

describe("buildRateLimitKey", () => {
  it("should combine scope and value with a colon", () => {
    expect(buildRateLimitKey("auth-signin", "user@example.com")).toBe(
      "auth-signin:user@example.com"
    );
  });

  it("should handle empty scope", () => {
    expect(buildRateLimitKey("", "value")).toBe(":value");
  });

  it("should handle empty value", () => {
    expect(buildRateLimitKey("scope", "")).toBe("scope:");
  });
});

describe("buildRequestFingerprint", () => {
  it("should combine IP and user agent", () => {
    const fp = buildRequestFingerprint("192.168.1.1", "Mozilla/5.0");
    expect(fp).toBe("192.168.1.1|Mozilla/5.0");
  });

  it("should use 'unknown-ip' when IP is null", () => {
    const fp = buildRequestFingerprint(null, "Mozilla/5.0");
    expect(fp).toBe("unknown-ip|Mozilla/5.0");
  });

  it("should use 'unknown-ua' when user agent is null", () => {
    const fp = buildRequestFingerprint("192.168.1.1", null);
    expect(fp).toBe("192.168.1.1|unknown-ua");
  });

  it("should truncate user agent to 80 chars", () => {
    const longUA = "Mozilla/5.0 " + "x".repeat(200);
    const fp = buildRequestFingerprint("1.2.3.4", longUA);
    const uaPart = fp.split("|")[1];
    expect(uaPart.length).toBe(80);
  });

  it("should handle both null values", () => {
    const fp = buildRequestFingerprint(null, null);
    expect(fp).toBe("unknown-ip|unknown-ua");
  });
});
