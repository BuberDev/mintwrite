/**
 * ─── Auth: Crypto Utilities ───────────────────────────────────────────────────
 *
 * Tests the low-level crypto building blocks: ID generation, secure token
 * generation, SHA-256 hashing, and constant-time comparison.
 *
 * These underpin session tokens, email verification tokens, and password
 * reset tokens.
 */

import { describe, it, expect } from "vitest";
import {
  generateId,
  generateSecureToken,
  sha256Base64url,
  constantTimeEquals,
} from "@/lib/auth/crypto";

// ─── generateId ───────────────────────────────────────────────────────────────

describe("generateId", () => {
  it("should return a string starting with the given prefix", () => {
    const id = generateId("user");
    expect(id).toMatch(/^user_/);
  });

  it("should generate unique IDs on consecutive calls", () => {
    const ids = Array.from({ length: 100 }, () => generateId("test"));
    const unique = new Set(ids);
    expect(unique.size).toBe(100);
  });

  it("should support different prefixes", () => {
    expect(generateId("session")).toMatch(/^session_/);
    expect(generateId("oauth")).toMatch(/^oauth_/);
    expect(generateId("auth_token")).toMatch(/^auth_token_/);
  });
});

// ─── generateSecureToken ──────────────────────────────────────────────────────

describe("generateSecureToken", () => {
  it("should return a base64url-encoded string", () => {
    const token = generateSecureToken(32);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("should return different tokens on each call", () => {
    const token1 = generateSecureToken(32);
    const token2 = generateSecureToken(32);
    expect(token1).not.toBe(token2);
  });

  it("should respect the byteLength parameter", () => {
    // base64url encoding: ~4/3 ratio
    const token16 = generateSecureToken(16);
    const token48 = generateSecureToken(48);
    expect(token48.length).toBeGreaterThan(token16.length);
  });

  it("should default to 32 bytes when no argument is given", () => {
    const token = generateSecureToken();
    // 32 bytes → 43 chars in base64url (no padding)
    expect(token.length).toBe(43);
  });
});

// ─── sha256Base64url ──────────────────────────────────────────────────────────

describe("sha256Base64url", () => {
  it("should produce a deterministic hash for the same input", () => {
    const hash1 = sha256Base64url("hello world");
    const hash2 = sha256Base64url("hello world");
    expect(hash1).toBe(hash2);
  });

  it("should produce different hashes for different inputs", () => {
    const hash1 = sha256Base64url("hello");
    const hash2 = sha256Base64url("world");
    expect(hash1).not.toBe(hash2);
  });

  it("should produce a base64url-encoded string (no +, /, or =)", () => {
    const hash = sha256Base64url("test value");
    expect(hash).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("should handle empty string", () => {
    const hash = sha256Base64url("");
    expect(hash).toBeTruthy();
    expect(typeof hash).toBe("string");
  });
});

// ─── constantTimeEquals ───────────────────────────────────────────────────────

describe("constantTimeEquals", () => {
  it("should return true for identical strings", () => {
    expect(constantTimeEquals("abc123", "abc123")).toBe(true);
  });

  it("should return false for different strings of same length", () => {
    expect(constantTimeEquals("abc123", "abc124")).toBe(false);
  });

  it("should return false for different-length strings", () => {
    expect(constantTimeEquals("short", "much-longer-string")).toBe(false);
  });

  it("should return true for empty strings", () => {
    expect(constantTimeEquals("", "")).toBe(true);
  });

  it("should return false when one is empty and one is not", () => {
    expect(constantTimeEquals("", "notempty")).toBe(false);
  });
});
