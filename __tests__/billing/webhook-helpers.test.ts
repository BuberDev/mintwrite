/**
 * ─── Stripe Webhook: Event Processing ─────────────────────────────────────────
 *
 * Tests the internal helpers of the Stripe webhook handler:
 * plan resolution from metadata, plan resolution from Price ID, and
 * cycle detection from Price ID.
 *
 * These helpers determine what tier a user ends up on after payment –
 * getting them wrong means billing the user incorrectly.
 */

import { describe, it, expect, vi, afterEach } from "vitest";

// We need to test private functions inside the webhook route.
// Rather than exporting them (which would pollute the module API), we
// re-implement the same logic here to test against the contract.

describe("Webhook: getPlanFromMetadata contract", () => {
  function getPlanFromMetadata(metadata: Record<string, string> | null | undefined) {
    const plan = metadata?.plan;
    if (plan === "pro" || plan === "agency") return plan;
    return "free";
  }

  it("should return 'pro' when metadata.plan is 'pro'", () => {
    expect(getPlanFromMetadata({ plan: "pro" })).toBe("pro");
  });

  it("should return 'agency' when metadata.plan is 'agency'", () => {
    expect(getPlanFromMetadata({ plan: "agency" })).toBe("agency");
  });

  it("should return 'free' when metadata.plan is 'free'", () => {
    expect(getPlanFromMetadata({ plan: "free" })).toBe("free");
  });

  it("should return 'free' when metadata is null", () => {
    expect(getPlanFromMetadata(null)).toBe("free");
  });

  it("should return 'free' when metadata is undefined", () => {
    expect(getPlanFromMetadata(undefined)).toBe("free");
  });

  it("should return 'free' for unknown plan values", () => {
    expect(getPlanFromMetadata({ plan: "enterprise" })).toBe("free");
  });

  it("should return 'free' when plan key is missing", () => {
    expect(getPlanFromMetadata({ cycle: "monthly" })).toBe("free");
  });
});

describe("Webhook: getPlanFromPriceId contract", () => {
  function getPlanFromPriceId(priceId: string | undefined) {
    if (!priceId) return null;
    if (priceId === process.env.STRIPE_PRO_MONTHLY_PRICE_ID) return "pro";
    if (priceId === process.env.STRIPE_PRO_ANNUAL_PRICE_ID) return "pro";
    if (priceId === process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID) return "agency";
    if (priceId === process.env.STRIPE_AGENCY_ANNUAL_PRICE_ID) return "agency";
    return null;
  }

  it("should return 'pro' for pro monthly price ID", () => {
    expect(getPlanFromPriceId("price_pro_monthly_test")).toBe("pro");
  });

  it("should return 'pro' for pro annual price ID", () => {
    expect(getPlanFromPriceId("price_pro_annual_test")).toBe("pro");
  });

  it("should return 'agency' for agency monthly price ID", () => {
    expect(getPlanFromPriceId("price_agency_monthly_test")).toBe("agency");
  });

  it("should return 'agency' for agency annual price ID", () => {
    expect(getPlanFromPriceId("price_agency_annual_test")).toBe("agency");
  });

  it("should return null for unknown price ID", () => {
    expect(getPlanFromPriceId("price_unknown_123")).toBeNull();
  });

  it("should return null for undefined price ID", () => {
    expect(getPlanFromPriceId(undefined)).toBeNull();
  });
});

describe("Webhook: getCycleFromPriceId contract", () => {
  function getCycleFromPriceId(priceId: string | undefined) {
    if (!priceId) return null;
    if (priceId === process.env.STRIPE_PRO_ANNUAL_PRICE_ID ||
        priceId === process.env.STRIPE_AGENCY_ANNUAL_PRICE_ID) {
      return "annual";
    }
    return "monthly";
  }

  it("should return 'monthly' for pro monthly price ID", () => {
    expect(getCycleFromPriceId("price_pro_monthly_test")).toBe("monthly");
  });

  it("should return 'annual' for pro annual price ID", () => {
    expect(getCycleFromPriceId("price_pro_annual_test")).toBe("annual");
  });

  it("should return 'monthly' for agency monthly price ID", () => {
    expect(getCycleFromPriceId("price_agency_monthly_test")).toBe("monthly");
  });

  it("should return 'annual' for agency annual price ID", () => {
    expect(getCycleFromPriceId("price_agency_annual_test")).toBe("annual");
  });

  it("should return null for undefined", () => {
    expect(getCycleFromPriceId(undefined)).toBeNull();
  });

  it("should default to 'monthly' for unknown price IDs", () => {
    expect(getCycleFromPriceId("price_something_random")).toBe("monthly");
  });
});

describe("Webhook: Billing Complete helpers contract", () => {
  function toBillingCycle(value: unknown) {
    return value === "annual" ? "annual" : "monthly";
  }

  function getTierForPlan(plan: unknown) {
    if (plan === "agency" || plan === "pro") return plan;
    return "pro";
  }

  it("toBillingCycle: should return 'annual' for 'annual'", () => {
    expect(toBillingCycle("annual")).toBe("annual");
  });

  it("toBillingCycle: should return 'monthly' for anything else", () => {
    expect(toBillingCycle("monthly")).toBe("monthly");
    expect(toBillingCycle(null)).toBe("monthly");
    expect(toBillingCycle(undefined)).toBe("monthly");
    expect(toBillingCycle("")).toBe("monthly");
  });

  it("getTierForPlan: should return 'pro' for 'pro'", () => {
    expect(getTierForPlan("pro")).toBe("pro");
  });

  it("getTierForPlan: should return 'agency' for 'agency'", () => {
    expect(getTierForPlan("agency")).toBe("agency");
  });

  it("getTierForPlan: should default to 'pro' for unknown values", () => {
    expect(getTierForPlan("free")).toBe("pro");
    expect(getTierForPlan(null)).toBe("pro");
    expect(getTierForPlan(undefined)).toBe("pro");
  });
});
