/**
 * ─── AI: Request Validation Schemas ───────────────────────────────────────────
 *
 * Tests that the Zod schemas for API requests enforce correct constraints
 * before hitting the AI generation pipeline.
 */

import { describe, it, expect } from "vitest";
import {
  GenerateRequestSchema,
  ProjectInputSchema,
  ProjectCategorySchema,
  GenerationMetadataSchema,
} from "@/lib/ai/schema";

// ─── GenerateRequestSchema ────────────────────────────────────────────────────

describe("GenerateRequestSchema", () => {
  it("should accept valid generate request", () => {
    const result = GenerateRequestSchema.safeParse({
      projectId: "proj_123",
      contentTypeId: "twitter-thread",
      context: { topic: "Token launch" },
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty projectId", () => {
    const result = GenerateRequestSchema.safeParse({
      projectId: "",
      contentTypeId: "twitter-thread",
      context: {},
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty contentTypeId", () => {
    const result = GenerateRequestSchema.safeParse({
      projectId: "proj_123",
      contentTypeId: "",
      context: {},
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing context", () => {
    const result = GenerateRequestSchema.safeParse({
      projectId: "proj_123",
      contentTypeId: "twitter-thread",
    });
    expect(result.success).toBe(false);
  });

  it("should accept empty context object", () => {
    const result = GenerateRequestSchema.safeParse({
      projectId: "proj_123",
      contentTypeId: "twitter-thread",
      context: {},
    });
    expect(result.success).toBe(true);
  });

  it("should accept context with multiple string key-value pairs", () => {
    const result = GenerateRequestSchema.safeParse({
      projectId: "proj_123",
      contentTypeId: "twitter-thread",
      context: {
        topic: "Token launch",
        keyPoints: "100M supply",
        tone: "Community-friendly",
      },
    });
    expect(result.success).toBe(true);
  });
});

// ─── ProjectInputSchema ──────────────────────────────────────────────────────

describe("ProjectInputSchema", () => {
  const validProject = {
    name: "TestToken",
    ticker: "TST",
    category: "defi",
    tagline: "A revolutionary DeFi protocol for the masses.",
  };

  it("should accept valid project input", () => {
    const result = ProjectInputSchema.safeParse(validProject);
    expect(result.success).toBe(true);
  });

  it("should accept project with all optional fields", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      website: "https://testtoken.io",
      twitter: "@testtoken",
      discord: "discord.gg/test",
    });
    expect(result.success).toBe(true);
  });

  it("should accept empty string for optional website", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      website: "",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid website URL", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      website: "not-a-url",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty name", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject name > 60 chars", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      name: "x".repeat(61),
    });
    expect(result.success).toBe(false);
  });

  it("should reject ticker with lowercase", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      ticker: "tst",
    });
    expect(result.success).toBe(false);
  });

  it("should reject ticker > 10 chars", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      ticker: "TOOLONGTICKER",
    });
    expect(result.success).toBe(false);
  });

  it("should accept valid uppercase ticker", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      ticker: "BTC",
    });
    expect(result.success).toBe(true);
  });

  it("should accept ticker with numbers", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      ticker: "TST2",
    });
    expect(result.success).toBe(true);
  });

  it("should reject tagline < 10 chars", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      tagline: "Short",
    });
    expect(result.success).toBe(false);
  });

  it("should reject tagline > 160 chars", () => {
    const result = ProjectInputSchema.safeParse({
      ...validProject,
      tagline: "x".repeat(161),
    });
    expect(result.success).toBe(false);
  });
});

// ─── ProjectCategorySchema ────────────────────────────────────────────────────

describe("ProjectCategorySchema", () => {
  const validCategories = ["defi", "gamefi", "dao", "rwa", "infrastructure", "nft", "layer2"];

  it.each(validCategories)("should accept '%s'", (category) => {
    expect(() => ProjectCategorySchema.parse(category)).not.toThrow();
  });

  it("should reject unknown category", () => {
    expect(() => ProjectCategorySchema.parse("unknown")).toThrow();
  });

  it("should reject empty string", () => {
    expect(() => ProjectCategorySchema.parse("")).toThrow();
  });
});

// ─── GenerationMetadataSchema ─────────────────────────────────────────────────

describe("GenerationMetadataSchema", () => {
  it("should accept valid metadata", () => {
    const result = GenerationMetadataSchema.safeParse({
      platform: "twitter",
      characterCount: 280,
      suggestedHashtags: ["#crypto", "#DeFi"],
      postingTip: "Post at 9am UTC",
    });
    expect(result.success).toBe(true);
  });

  it("should reject negative characterCount", () => {
    const result = GenerationMetadataSchema.safeParse({
      platform: "twitter",
      characterCount: -1,
      suggestedHashtags: [],
      postingTip: "Tip",
    });
    expect(result.success).toBe(false);
  });

  it("should reject non-integer characterCount", () => {
    const result = GenerationMetadataSchema.safeParse({
      platform: "twitter",
      characterCount: 280.5,
      suggestedHashtags: [],
      postingTip: "Tip",
    });
    expect(result.success).toBe(false);
  });

  it("should accept empty suggestedHashtags array", () => {
    const result = GenerationMetadataSchema.safeParse({
      platform: "discord",
      characterCount: 500,
      suggestedHashtags: [],
      postingTip: "Post in announcements",
    });
    expect(result.success).toBe(true);
  });
});
