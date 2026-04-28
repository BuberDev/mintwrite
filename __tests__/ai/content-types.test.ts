/**
 * ─── AI: Content Types Registry ───────────────────────────────────────────────
 *
 * Tests the content type registry which is the single source of truth for
 * what content the AI can generate, tier gating, and prompt building.
 */

import { describe, it, expect } from "vitest";
import {
  CONTENT_TYPES,
  getContentType,
  getFreeContentTypes,
  getAllContentTypes,
} from "@/lib/ai/content-types";

// ─── Registry structure ───────────────────────────────────────────────────────

describe("CONTENT_TYPES registry", () => {
  it("should have exactly 7 content types", () => {
    expect(Object.keys(CONTENT_TYPES)).toHaveLength(7);
  });

  it("should have unique IDs matching their keys", () => {
    for (const [key, ct] of Object.entries(CONTENT_TYPES)) {
      expect(ct.id).toBe(key);
    }
  });

  it("should have 3 free-tier types", () => {
    const free = Object.values(CONTENT_TYPES).filter((ct) => ct.tier === "free");
    expect(free).toHaveLength(3);
    const freeIds = free.map((ct) => ct.id).sort();
    expect(freeIds).toEqual(["community-update", "discord-announcement", "twitter-thread"]);
  });

  it("should have 4 pro-tier types", () => {
    const pro = Object.values(CONTENT_TYPES).filter((ct) => ct.tier === "pro");
    expect(pro).toHaveLength(4);
    const proIds = pro.map((ct) => ct.id).sort();
    expect(proIds).toEqual(["ama-script", "blog-post", "tokenomics-explainer", "whitepaper-summary"]);
  });

  it("every content type should have required fields", () => {
    for (const ct of Object.values(CONTENT_TYPES)) {
      expect(ct.id).toBeTruthy();
      expect(ct.label).toBeTruthy();
      expect(ct.description).toBeTruthy();
      expect(ct.icon).toBeTruthy();
      expect(ct.outputLabel).toBeTruthy();
      expect(ct.outputDescription).toBeTruthy();
      expect(typeof ct.buildPrompt).toBe("function");
      expect(ct.fields.length).toBeGreaterThan(0);
    }
  });

  it("every field should have name, label, type, and required flag", () => {
    for (const ct of Object.values(CONTENT_TYPES)) {
      for (const field of ct.fields) {
        expect(field.name).toBeTruthy();
        expect(field.label).toBeTruthy();
        expect(["text", "textarea", "select"]).toContain(field.type);
        expect(typeof field.required).toBe("boolean");
      }
    }
  });

  it("select fields should have options array", () => {
    for (const ct of Object.values(CONTENT_TYPES)) {
      for (const field of ct.fields) {
        if (field.type === "select") {
          expect(field.options).toBeDefined();
          expect(field.options!.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("every content type should have at least one required field", () => {
    for (const ct of Object.values(CONTENT_TYPES)) {
      const hasRequired = ct.fields.some((f) => f.required);
      expect(hasRequired).toBe(true);
    }
  });
});

// ─── getContentType ───────────────────────────────────────────────────────────

describe("getContentType", () => {
  it("should return the correct content type by ID", () => {
    const ct = getContentType("twitter-thread");
    expect(ct.id).toBe("twitter-thread");
    expect(ct.label).toBe("X (Twitter) Thread");
    expect(ct.tier).toBe("free");
  });

  it("should throw for unknown content type", () => {
    expect(() => getContentType("nonexistent")).toThrowError(
      'Unknown content type: "nonexistent"'
    );
  });

  it("should throw for empty string", () => {
    expect(() => getContentType("")).toThrowError('Unknown content type: ""');
  });
});

// ─── getFreeContentTypes ──────────────────────────────────────────────────────

describe("getFreeContentTypes", () => {
  it("should return only free-tier content types", () => {
    const free = getFreeContentTypes();
    expect(free.length).toBe(3);
    for (const ct of free) {
      expect(ct.tier).toBe("free");
    }
  });
});

// ─── getAllContentTypes ────────────────────────────────────────────────────────

describe("getAllContentTypes", () => {
  it("should return all 7 content types", () => {
    const all = getAllContentTypes();
    expect(all.length).toBe(7);
  });
});

// ─── buildPrompt ──────────────────────────────────────────────────────────────

describe("buildPrompt for each content type", () => {
  const mockProject = {
    id: "test-project-id",
    userId: "user_123",
    name: "TestToken",
    ticker: "TST",
    category: "defi" as const,
    tagline: "A test token for testing purposes.",
    website: "https://testtoken.io",
    twitter: "@testtoken",
    discord: "discord.gg/test",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it("twitter-thread: should produce a non-empty prompt", () => {
    const ct = getContentType("twitter-thread");
    const prompt = ct.buildPrompt(mockProject, {
      topic: "Token launch",
      keyPoints: "- 100M supply\n- DEX listing",
      tone: "Community-friendly",
    });
    expect(prompt).toBeTruthy();
    expect(prompt).toContain("TestToken");
  });

  it("discord-announcement: should produce a non-empty prompt", () => {
    const ct = getContentType("discord-announcement");
    const prompt = ct.buildPrompt(mockProject, {
      eventType: "Token launch",
      details: "Launching on Uniswap",
      callToAction: "Add liquidity",
    });
    expect(prompt).toBeTruthy();
    expect(prompt.length).toBeGreaterThan(50);
  });

  it("community-update: should produce a non-empty prompt", () => {
    const ct = getContentType("community-update");
    const prompt = ct.buildPrompt(mockProject, {
      weekNumber: "Week 12",
      milestones: "- Audit completed\n- 500 members",
    });
    expect(prompt).toBeTruthy();
  });

  it("tokenomics-explainer: should produce a non-empty prompt", () => {
    const ct = getContentType("tokenomics-explainer");
    const prompt = ct.buildPrompt(mockProject, {
      totalSupply: "100,000,000",
      allocationSummary: "Team 15%, Community 40%",
      tokenUtility: "Governance and staking",
    });
    expect(prompt).toBeTruthy();
  });

  it("blog-post: should produce a non-empty prompt", () => {
    const ct = getContentType("blog-post");
    const prompt = ct.buildPrompt(mockProject, {
      launchDate: "June 15, 2026",
      problemSolved: "Fragmented liquidity",
    });
    expect(prompt).toBeTruthy();
  });

  it("ama-script: should produce a non-empty prompt", () => {
    const ct = getContentType("ama-script");
    const prompt = ct.buildPrompt(mockProject, {
      amaType: "Community (Discord/Telegram)",
      expectedQuestions: "- Why buy?\n- Roadmap?",
    });
    expect(prompt).toBeTruthy();
  });

  it("whitepaper-summary: should produce a non-empty prompt", () => {
    const ct = getContentType("whitepaper-summary");
    const prompt = ct.buildPrompt(mockProject, {
      problemStatement: "Retail investors lack access",
      solution: "Automated vault protocol",
      tokenRole: "Governs protocol parameters",
    });
    expect(prompt).toBeTruthy();
  });
});
