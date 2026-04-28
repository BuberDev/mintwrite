/**
 * ─── Auth: Password Utilities ─────────────────────────────────────────────────
 *
 * Tests the core cryptographic primitives that guard user accounts:
 * hashing, verification, timing-safe comparison, email normalization,
 * and password strength validation.
 *
 * These are pure functions with zero side-effects – the fastest, most
 * deterministic tests in the suite.
 */

import { describe, it, expect } from "vitest";
import {
  hashPassword,
  verifyPassword,
  normalizeEmail,
  validatePasswordStrength,
} from "@/lib/auth/password";

// ─── hashPassword / verifyPassword ────────────────────────────────────────────

describe("hashPassword + verifyPassword", () => {
  it("should produce a valid scrypt hash string", () => {
    const hash = hashPassword("Str0ngP@ssword!!");
    const parts = hash.split("$");
    expect(parts).toHaveLength(6);
    expect(parts[0]).toBe("scrypt");
  });

  it("should verify a correct password", () => {
    const password = "MyS3cureP@ssw0rd!!";
    const hash = hashPassword(password);
    expect(verifyPassword(password, hash)).toBe(true);
  });

  it("should reject an incorrect password", () => {
    const hash = hashPassword("CorrectPassword1!");
    expect(verifyPassword("WrongPassword1!", hash)).toBe(false);
  });

  it("should produce unique salts per hash (no two hashes are the same)", () => {
    const password = "SamePassword123!";
    const hash1 = hashPassword(password);
    const hash2 = hashPassword(password);
    expect(hash1).not.toBe(hash2);
    // Both should still verify
    expect(verifyPassword(password, hash1)).toBe(true);
    expect(verifyPassword(password, hash2)).toBe(true);
  });

  it("should reject a malformed hash string", () => {
    expect(verifyPassword("anything", "not-a-valid-hash")).toBe(false);
  });

  it("should reject a hash with wrong algorithm prefix", () => {
    expect(verifyPassword("anything", "bcrypt$16384$8$1$salt$hash")).toBe(false);
  });

  it("should reject a hash with non-numeric parameters", () => {
    expect(verifyPassword("anything", "scrypt$abc$8$1$salt$hash")).toBe(false);
  });

  it("should handle empty password gracefully", () => {
    const hash = hashPassword("");
    expect(verifyPassword("", hash)).toBe(true);
    expect(verifyPassword("anything", hash)).toBe(false);
  });

  it("should handle unicode passwords correctly", () => {
    const password = "Pässwörd123!é";
    const hash = hashPassword(password);
    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("Passwörd123!é", hash)).toBe(false);
  });
});

// ─── normalizeEmail ───────────────────────────────────────────────────────────

describe("normalizeEmail", () => {
  it("should lowercase the email", () => {
    expect(normalizeEmail("User@Example.COM")).toBe("user@example.com");
  });

  it("should trim whitespace", () => {
    expect(normalizeEmail("  user@example.com  ")).toBe("user@example.com");
  });

  it("should handle already-normalized email", () => {
    expect(normalizeEmail("user@example.com")).toBe("user@example.com");
  });

  it("should preserve valid characters in the local part", () => {
    expect(normalizeEmail("User.Name+Tag@Example.COM")).toBe(
      "user.name+tag@example.com"
    );
  });
});

// ─── validatePasswordStrength ─────────────────────────────────────────────────

describe("validatePasswordStrength", () => {
  it("should accept a strong password", () => {
    expect(validatePasswordStrength("MyStrongPass1!")).toBeNull();
  });

  it("should reject a password shorter than 12 characters", () => {
    expect(validatePasswordStrength("Short1!")).toBe(
      "Use at least 12 characters."
    );
  });

  it("should reject a password without uppercase", () => {
    expect(validatePasswordStrength("alllowercase1!")).toBe(
      "Add at least one uppercase letter."
    );
  });

  it("should reject a password without lowercase", () => {
    expect(validatePasswordStrength("ALLUPPERCASE1!")).toBe(
      "Add at least one lowercase letter."
    );
  });

  it("should reject a password without numbers", () => {
    expect(validatePasswordStrength("NoNumbersHere!")).toBe(
      "Add at least one number."
    );
  });

  it("should trim the password before validating length", () => {
    // "MyStr0ngP@ss1" = 13 chars after trim → valid
    expect(validatePasswordStrength("   MyStr0ngP@ss1   ")).toBeNull();
  });

  it("should reject a password that becomes too short after trimming", () => {
    // "MyStr0ng!!" = 10 chars after trim → too short
    expect(validatePasswordStrength("   MyStr0ng!!   ")).toBe(
      "Use at least 12 characters."
    );
  });
});
