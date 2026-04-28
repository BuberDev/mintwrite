/**
 * ─── Subscription Tiers & Stripe Price Mapping ────────────────────────────────
 *
 * Tests the subscription tier configuration, price resolution, and
 * Stripe Price ID mapping. This is the financial backbone of the SaaS –
 * wrong values here mean wrong charges.
 */

import { describe, it, expect } from "vitest";
import {
  SUBSCRIPTION_TIERS,
  getTierById,
  getStripePriceId,
} from "@/lib/subscriptions";

// ─── SUBSCRIPTION_TIERS ───────────────────────────────────────────────────────

describe("SUBSCRIPTION_TIERS", () => {
  it("should define exactly 3 tiers: free, pro, agency", () => {
    expect(SUBSCRIPTION_TIERS).toHaveLength(3);
    const ids = SUBSCRIPTION_TIERS.map((t) => t.id);
    expect(ids).toEqual(["free", "pro", "agency"]);
  });

  it("should have free tier at $0", () => {
    const free = SUBSCRIPTION_TIERS.find((t) => t.id === "free")!;
    expect(free.priceMonthly).toBe(0);
    expect(free.priceAnnual).toBe(0);
    expect(free.priceAnnualMonthly).toBe(0);
  });

  it("should have pro tier at $49/mo", () => {
    const pro = SUBSCRIPTION_TIERS.find((t) => t.id === "pro")!;
    expect(pro.priceMonthly).toBe(49);
    expect(pro.priceAnnualMonthly).toBe(39);
    expect(pro.highlighted).toBe(true);
  });

  it("should have agency tier at $149/mo", () => {
    const agency = SUBSCRIPTION_TIERS.find((t) => t.id === "agency")!;
    expect(agency.priceMonthly).toBe(149);
    expect(agency.priceAnnualMonthly).toBe(119);
  });

  it("should have annual price = monthly * 12 * discount factor for pro", () => {
    const pro = SUBSCRIPTION_TIERS.find((t) => t.id === "pro")!;
    // $39 × 12 = $468
    expect(pro.priceAnnual).toBe(468);
  });

  it("should have annual price = monthly * 12 * discount factor for agency", () => {
    const agency = SUBSCRIPTION_TIERS.find((t) => t.id === "agency")!;
    // $119 × 12 = $1428
    expect(agency.priceAnnual).toBe(1428);
  });

  it("should not have Stripe price IDs on the free tier", () => {
    const free = SUBSCRIPTION_TIERS.find((t) => t.id === "free")!;
    expect(free.stripePriceIdMonthly).toBeUndefined();
    expect(free.stripePriceIdAnnual).toBeUndefined();
  });

  it("should have Stripe price IDs on pro and agency tiers (from env)", () => {
    const pro = SUBSCRIPTION_TIERS.find((t) => t.id === "pro")!;
    const agency = SUBSCRIPTION_TIERS.find((t) => t.id === "agency")!;

    // Values from __tests__/setup.ts
    expect(pro.stripePriceIdMonthly).toBe("price_pro_monthly_test");
    expect(pro.stripePriceIdAnnual).toBe("price_pro_annual_test");
    expect(agency.stripePriceIdMonthly).toBe("price_agency_monthly_test");
    expect(agency.stripePriceIdAnnual).toBe("price_agency_annual_test");
  });

  it("should have features list for every tier", () => {
    for (const tier of SUBSCRIPTION_TIERS) {
      expect(tier.features.length).toBeGreaterThan(0);
      for (const feature of tier.features) {
        expect(typeof feature).toBe("string");
        expect(feature.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("should have a name and description for every tier", () => {
    for (const tier of SUBSCRIPTION_TIERS) {
      expect(tier.name.trim().length).toBeGreaterThan(0);
      expect(tier.description.trim().length).toBeGreaterThan(0);
    }
  });
});

// ─── getTierById ──────────────────────────────────────────────────────────────

describe("getTierById", () => {
  it("should return free tier for 'free'", () => {
    const tier = getTierById("free");
    expect(tier?.id).toBe("free");
    expect(tier?.name).toBe("Free");
  });

  it("should return pro tier for 'pro'", () => {
    const tier = getTierById("pro");
    expect(tier?.id).toBe("pro");
    expect(tier?.name).toBe("Pro");
  });

  it("should return agency tier for 'agency'", () => {
    const tier = getTierById("agency");
    expect(tier?.id).toBe("agency");
    expect(tier?.name).toBe("Agency");
  });

  it("should return undefined for unknown tier", () => {
    expect(getTierById("enterprise")).toBeUndefined();
    expect(getTierById("")).toBeUndefined();
  });
});

// ─── getStripePriceId ─────────────────────────────────────────────────────────

describe("getStripePriceId", () => {
  it("should return monthly price ID for pro monthly", () => {
    expect(getStripePriceId("pro", "monthly")).toBe("price_pro_monthly_test");
  });

  it("should return annual price ID for pro annual", () => {
    expect(getStripePriceId("pro", "annual")).toBe("price_pro_annual_test");
  });

  it("should return monthly price ID for agency monthly", () => {
    expect(getStripePriceId("agency", "monthly")).toBe("price_agency_monthly_test");
  });

  it("should return annual price ID for agency annual", () => {
    expect(getStripePriceId("agency", "annual")).toBe("price_agency_annual_test");
  });

  it("should return undefined for free tier (no Stripe prices)", () => {
    expect(getStripePriceId("free", "monthly")).toBeUndefined();
    expect(getStripePriceId("free", "annual")).toBeUndefined();
  });

  it("should return undefined for unknown plan", () => {
    expect(getStripePriceId("enterprise" as any, "monthly")).toBeUndefined();
  });
});
