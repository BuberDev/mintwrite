/**
 * ─── AI: OpenRouter Configuration ─────────────────────────────────────────────
 *
 * Tests that the OpenRouter provider singleton is properly guarded
 * and configured.
 */

import { describe, it, expect, vi, afterEach } from "vitest";

describe("OpenRouter configuration", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  describe("hasRealEnvValue", () => {
    it("should return true for a real API key", async () => {
      const { hasRealEnvValue } = await import("@/lib/ai/openrouter");
      expect(hasRealEnvValue("sk-or-v1-real-key")).toBe(true);
    });

    it("should return false for undefined", async () => {
      const { hasRealEnvValue } = await import("@/lib/ai/openrouter");
      expect(hasRealEnvValue(undefined)).toBe(false);
    });

    it("should return false for empty string", async () => {
      const { hasRealEnvValue } = await import("@/lib/ai/openrouter");
      expect(hasRealEnvValue("")).toBe(false);
    });

    it("should return false for placeholder with dots", async () => {
      const { hasRealEnvValue } = await import("@/lib/ai/openrouter");
      expect(hasRealEnvValue("your_api_key_here...")).toBe(false);
    });
  });

  describe("isOpenRouterConfigured", () => {
    it("should return true when OPENROUTER_API_KEY is set and valid", async () => {
      process.env.OPENROUTER_API_KEY = "sk-or-v1-real-key";
      const { isOpenRouterConfigured } = await import("@/lib/ai/openrouter");
      expect(isOpenRouterConfigured()).toBe(true);
    });

    it("should return false when OPENROUTER_API_KEY is not set", async () => {
      delete process.env.OPENROUTER_API_KEY;
      const { isOpenRouterConfigured } = await import("@/lib/ai/openrouter");
      expect(isOpenRouterConfigured()).toBe(false);
    });

    it("should return false when OPENROUTER_API_KEY is placeholder", async () => {
      process.env.OPENROUTER_API_KEY = "your_key_here...";
      const { isOpenRouterConfigured } = await import("@/lib/ai/openrouter");
      expect(isOpenRouterConfigured()).toBe(false);
    });
  });

  describe("getOpenRouterProvider", () => {
    it("should throw when API key is not configured", async () => {
      delete process.env.OPENROUTER_API_KEY;
      const { getOpenRouterProvider } = await import("@/lib/ai/openrouter");
      expect(() => getOpenRouterProvider()).toThrowError(
        "OPENROUTER_API_KEY is not configured"
      );
    });
  });

  describe("DEFAULT_OPENROUTER_MODEL", () => {
    it("should default to claude-sonnet-4-5", async () => {
      delete process.env.OPENROUTER_DEFAULT_MODEL;
      const { DEFAULT_OPENROUTER_MODEL } = await import("@/lib/ai/openrouter");
      expect(DEFAULT_OPENROUTER_MODEL).toBe("anthropic/claude-sonnet-4-5");
    });

    it("should use env override when set", async () => {
      process.env.OPENROUTER_DEFAULT_MODEL = "openai/gpt-4o";
      const { DEFAULT_OPENROUTER_MODEL } = await import("@/lib/ai/openrouter");
      expect(DEFAULT_OPENROUTER_MODEL).toBe("openai/gpt-4o");
    });
  });
});
