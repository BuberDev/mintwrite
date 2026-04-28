/**
 * ─── Auth: Zod Validation Schemas ─────────────────────────────────────────────
 *
 * Tests that all auth input schemas enforce the correct constraints.
 * These form the first line of defence in every auth API route.
 */

import { describe, it, expect } from "vitest";
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
  authEmailSchema,
  authPasswordSchema,
} from "@/lib/auth/schemas";

// ─── authEmailSchema ──────────────────────────────────────────────────────────

describe("authEmailSchema", () => {
  it("should accept a valid email", () => {
    expect(authEmailSchema.parse("user@example.com")).toBe("user@example.com");
  });

  it("should trim whitespace", () => {
    expect(authEmailSchema.parse("  user@example.com  ")).toBe("user@example.com");
  });

  it("should reject empty string", () => {
    expect(() => authEmailSchema.parse("")).toThrow();
  });

  it("should reject invalid email format", () => {
    expect(() => authEmailSchema.parse("not-an-email")).toThrow();
  });

  it("should reject email longer than 254 chars", () => {
    // Need total > 254 chars. 'a'.repeat(243) + '@example.com' = 255 chars
    const longLocal = "a".repeat(243);
    expect(() => authEmailSchema.parse(`${longLocal}@example.com`)).toThrow();
  });
});

// ─── authPasswordSchema ───────────────────────────────────────────────────────

describe("authPasswordSchema", () => {
  it("should accept password >= 12 characters", () => {
    expect(authPasswordSchema.parse("Password1234")).toBe("Password1234");
  });

  it("should reject password < 12 characters", () => {
    expect(() => authPasswordSchema.parse("Short1!")).toThrow();
  });

  it("should reject password > 200 characters", () => {
    expect(() => authPasswordSchema.parse("a".repeat(201))).toThrow();
  });
});

// ─── signInSchema ─────────────────────────────────────────────────────────────

describe("signInSchema", () => {
  it("should accept valid email and password", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "ValidPassw0rd!",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing email", () => {
    const result = signInSchema.safeParse({
      password: "ValidPassw0rd!",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing password", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty object", () => {
    const result = signInSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ─── signUpSchema ─────────────────────────────────────────────────────────────

describe("signUpSchema", () => {
  const validSignUp = {
    email: "new@example.com",
    password: "StrongP@ss123!",
    confirmPassword: "StrongP@ss123!",
  };

  it("should accept valid sign-up data", () => {
    const result = signUpSchema.safeParse(validSignUp);
    expect(result.success).toBe(true);
  });

  it("should accept optional displayName", () => {
    const result = signUpSchema.safeParse({
      ...validSignUp,
      displayName: "John Doe",
    });
    expect(result.success).toBe(true);
  });

  it("should reject mismatched passwords", () => {
    const result = signUpSchema.safeParse({
      ...validSignUp,
      confirmPassword: "DifferentPass123!",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("confirmPassword");
    }
  });

  it("should reject when confirmPassword is missing", () => {
    const result = signUpSchema.safeParse({
      email: "user@example.com",
      password: "StrongP@ss123!",
    });
    expect(result.success).toBe(false);
  });

  it("should trim displayName", () => {
    const result = signUpSchema.safeParse({
      ...validSignUp,
      displayName: "  John Doe  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.displayName).toBe("John Doe");
    }
  });

  it("should reject displayName longer than 80 chars", () => {
    const result = signUpSchema.safeParse({
      ...validSignUp,
      displayName: "x".repeat(81),
    });
    expect(result.success).toBe(false);
  });
});

// ─── forgotPasswordSchema ─────────────────────────────────────────────────────

describe("forgotPasswordSchema", () => {
  it("should accept valid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "notanemail" });
    expect(result.success).toBe(false);
  });

  it("should reject empty email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "" });
    expect(result.success).toBe(false);
  });
});

// ─── resetPasswordSchema ──────────────────────────────────────────────────────

describe("resetPasswordSchema", () => {
  const validReset = {
    token: "abc123tokenvalue",
    password: "NewStrongPass1!",
    confirmPassword: "NewStrongPass1!",
  };

  it("should accept valid reset data", () => {
    const result = resetPasswordSchema.safeParse(validReset);
    expect(result.success).toBe(true);
  });

  it("should reject missing token", () => {
    const result = resetPasswordSchema.safeParse({
      password: "NewStrongPass1!",
      confirmPassword: "NewStrongPass1!",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty token", () => {
    const result = resetPasswordSchema.safeParse({
      ...validReset,
      token: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      ...validReset,
      confirmPassword: "MismatchedPass1!",
    });
    expect(result.success).toBe(false);
  });
});

// ─── resendVerificationSchema ─────────────────────────────────────────────────

describe("resendVerificationSchema", () => {
  it("should accept valid email", () => {
    const result = resendVerificationSchema.safeParse({ email: "user@example.com" });
    expect(result.success).toBe(true);
  });

  it("should reject missing email", () => {
    const result = resendVerificationSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
