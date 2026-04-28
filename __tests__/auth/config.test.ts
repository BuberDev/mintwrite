/**
 * ─── Auth: Config Guards ──────────────────────────────────────────────────────
 *
 * Tests that the auth config helper functions accurately detect whether
 * secrets are configured. This prevents the app from silently operating
 * with placeholder values.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Auth Config", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.resetModules();
  });

  async function loadConfig() {
    return await import("@/lib/auth/config");
  }

  describe("isAuthConfigured", () => {
    it("should return true when POSTGRES_URL and AUTH_SESSION_SECRET are set", async () => {
      process.env.AUTH_SESSION_SECRET = "real-secret-value";
      process.env.POSTGRES_URL = "postgresql://test@localhost/db";
      const { isAuthConfigured } = await loadConfig();
      expect(isAuthConfigured()).toBe(true);
    });

    it("should return false when AUTH_SESSION_SECRET is placeholder", async () => {
      process.env.AUTH_SESSION_SECRET = "your_secret_here...";
      process.env.POSTGRES_URL = "postgresql://test@localhost/db";
      const { isAuthConfigured } = await loadConfig();
      expect(isAuthConfigured()).toBe(false);
    });

    it("should return false when AUTH_SESSION_SECRET is missing", async () => {
      delete process.env.AUTH_SESSION_SECRET;
      process.env.POSTGRES_URL = "postgresql://test@localhost/db";
      const { isAuthConfigured } = await loadConfig();
      expect(isAuthConfigured()).toBe(false);
    });
  });

  describe("isOAuthConfigured", () => {
    it("should return true when both Google OAuth credentials are set", async () => {
      process.env.GOOGLE_CLIENT_ID = "real-client-id";
      process.env.GOOGLE_CLIENT_SECRET = "real-client-secret";
      const { isOAuthConfigured } = await loadConfig();
      expect(isOAuthConfigured()).toBe(true);
    });

    it("should return false when GOOGLE_CLIENT_ID is placeholder", async () => {
      process.env.GOOGLE_CLIENT_ID = "your_client_id...";
      process.env.GOOGLE_CLIENT_SECRET = "real-client-secret";
      const { isOAuthConfigured } = await loadConfig();
      expect(isOAuthConfigured()).toBe(false);
    });

    it("should return false when GOOGLE_CLIENT_SECRET is missing", async () => {
      process.env.GOOGLE_CLIENT_ID = "real-client-id";
      delete process.env.GOOGLE_CLIENT_SECRET;
      const { isOAuthConfigured } = await loadConfig();
      expect(isOAuthConfigured()).toBe(false);
    });
  });

  describe("getAppUrl", () => {
    it("should return NEXT_PUBLIC_APP_URL when set", async () => {
      process.env.NEXT_PUBLIC_APP_URL = "https://mintwrite.app";
      const { getAppUrl } = await loadConfig();
      expect(getAppUrl()).toBe("https://mintwrite.app");
    });

    it("should fall back to requestUrl when env is not set", async () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      const { getAppUrl } = await loadConfig();
      expect(getAppUrl("https://fallback.com")).toBe("https://fallback.com");
    });

    it("should fall back to localhost when nothing is provided", async () => {
      delete process.env.NEXT_PUBLIC_APP_URL;
      const { getAppUrl } = await loadConfig();
      expect(getAppUrl()).toBe("http://localhost:3000");
    });
  });

  describe("getSignInPath / getSignUpPath", () => {
    it("should return /sign-in", async () => {
      const { getSignInPath } = await loadConfig();
      expect(getSignInPath()).toBe("/sign-in");
    });

    it("should return /sign-up", async () => {
      const { getSignUpPath } = await loadConfig();
      expect(getSignUpPath()).toBe("/sign-up");
    });
  });
});
