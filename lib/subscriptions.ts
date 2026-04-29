import { BillingPlan } from "./db/billing";

export type SubscriptionTier = {
  id: BillingPlan;
  name: string;
  description: string;
  priceMonthly: number;
  /** Annual total in USD (monthly rate × 12 × 0.8) */
  priceAnnual: number;
  /** Monthly equivalent when billed annually (displayed on pricing page) */
  priceAnnualMonthly: number;
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  highlighted?: boolean;
};

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Lead generation and testing.",
    priceMonthly: 0,
    priceAnnual: 0,
    priceAnnualMonthly: 0,
    features: [
      "5 generations / month",
      "3 of 7 content types",
      "1 project profile",
      "Basic generation history",
      "Community support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "The standard for Web3 founders.",
    priceMonthly: 49,
    priceAnnual: 468,   // $39/mo × 12
    priceAnnualMonthly: 39,
    features: [
      "Unlimited generations",
      "All 7 content types",
      "5 project profiles",
      "Unlimited generation history",
      "Export as PDF / Markdown",
      "TokenForge AI Import",
      "Priority email support",
    ],
    highlighted: true,
    stripePriceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  },
  {
    id: "agency",
    name: "Agency",
    description: "For agencies and in-house teams.",
    priceMonthly: 149,
    priceAnnual: 1428,  // $119/mo × 12
    priceAnnualMonthly: 119,
    features: [
      "Everything in Pro",
      "Unlimited projects",
      "Multi-user workspace",
      "Custom brand voice",
      "API access for bulk creation",
      "Dedicated account manager",
    ],
    stripePriceIdMonthly: process.env.STRIPE_AGENCY_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: process.env.STRIPE_AGENCY_ANNUAL_PRICE_ID,
  },
];

export function getTierById(id: string): SubscriptionTier | undefined {
  return SUBSCRIPTION_TIERS.find((t) => t.id === id);
}

export function getStripePriceId(plan: BillingPlan, cycle: "monthly" | "annual"): string | undefined {
  const tier = getTierById(plan);
  if (!tier) return undefined;
  return cycle === "annual" ? tier.stripePriceIdAnnual : tier.stripePriceIdMonthly;
}
