/**
 * ─── Stripe: Client Initialization ────────────────────────────────────────────
 *
 * Tests that the Stripe singleton is properly guarded against missing
 * or placeholder API keys.
 */

import { describe, it, expect, vi, afterEach } from "vitest";

describe("getStripe", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  it("should throw when STRIPE_SECRET_KEY is not set", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const { getStripe } = await import("@/lib/stripe");
    expect(() => getStripe()).toThrowError("STRIPE_SECRET_KEY is not configured");
  });

  it("should throw when STRIPE_SECRET_KEY contains placeholder dots", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_...";
    const { getStripe } = await import("@/lib/stripe");
    expect(() => getStripe()).toThrowError("STRIPE_SECRET_KEY is not configured");
  });

  it("should return a Stripe instance when key is valid", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_valid_key_12345";
    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    expect(stripe).toBeDefined();
    expect(typeof stripe.checkout).toBe("object");
  });

  it("should return the same instance on repeated calls (singleton)", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_singleton_key";
    const { getStripe } = await import("@/lib/stripe");
    const a = getStripe();
    const b = getStripe();
    expect(a).toBe(b);
  });
});
