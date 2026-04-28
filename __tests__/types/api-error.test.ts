/**
 * ─── Type Definitions ─────────────────────────────────────────────────────────
 *
 * Tests the type-guard functions and type contracts exported from types/.
 */

import { describe, it, expect } from "vitest";
import { isApiError } from "@/types";

describe("isApiError", () => {
  it("should return true for an object with 'error' key", () => {
    expect(isApiError({ error: "Something went wrong" })).toBe(true);
  });

  it("should return true for error with code", () => {
    expect(isApiError({ error: "Bad request", code: "INVALID" })).toBe(true);
  });

  it("should return false for null", () => {
    expect(isApiError(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isApiError(undefined)).toBe(false);
  });

  it("should return false for a string", () => {
    expect(isApiError("error")).toBe(false);
  });

  it("should return false for a number", () => {
    expect(isApiError(42)).toBe(false);
  });

  it("should return false for an object without 'error' key", () => {
    expect(isApiError({ message: "hello" })).toBe(false);
  });

  it("should return false for an empty object", () => {
    expect(isApiError({})).toBe(false);
  });

  it("should return true even if error value is empty string", () => {
    expect(isApiError({ error: "" })).toBe(true);
  });

  it("should return false for an array", () => {
    expect(isApiError([{ error: "test" }])).toBe(false);
  });
});
