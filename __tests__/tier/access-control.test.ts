/**
 * ─── Tier Access Control ──────────────────────────────────────────────────────
 *
 * Tests the tier-based access control logic which determines what content
 * types a user can access and whether they've hit their generation limit.
 */

import { describe, it, expect } from "vitest";
import { canAccessContentType } from "@/lib/utils/tier";
import type { ContentType } from "@/types";

// ─── canAccessContentType ─────────────────────────────────────────────────────

describe("canAccessContentType", () => {
  const freeContentType: ContentType = {
    id: "twitter-thread",
    label: "X Thread",
    description: "Test",
    icon: "twitter",
    tier: "free",
    outputLabel: "Thread",
    outputDescription: "Test",
    fields: [],
    buildPrompt: () => "",
  };

  const proContentType: ContentType = {
    id: "tokenomics-explainer",
    label: "Tokenomics",
    description: "Test",
    icon: "bar-chart",
    tier: "pro",
    outputLabel: "Explainer",
    outputDescription: "Test",
    fields: [],
    buildPrompt: () => "",
  };

  describe("free tier users", () => {
    it("should access free content types", () => {
      expect(canAccessContentType("free", freeContentType)).toBe(true);
    });

    it("should NOT access pro content types", () => {
      expect(canAccessContentType("free", proContentType)).toBe(false);
    });
  });

  describe("pro tier users", () => {
    it("should access free content types", () => {
      expect(canAccessContentType("pro", freeContentType)).toBe(true);
    });

    it("should access pro content types", () => {
      expect(canAccessContentType("pro", proContentType)).toBe(true);
    });
  });

  describe("agency tier users", () => {
    it("should access free content types", () => {
      expect(canAccessContentType("agency", freeContentType)).toBe(true);
    });

    it("should access pro content types", () => {
      expect(canAccessContentType("agency", proContentType)).toBe(true);
    });
  });
});
