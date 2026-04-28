import { BillingPlan } from "./db/billing";

export type SubscriptionTier = {
  id: BillingPlan;
  name: string;
  description: string;
  priceMonthly: number;
  priceAnnual: number;
  features: string[];
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  highlighted?: boolean;
};

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "free",
    name: "Free",
    description: "Ideal for testing the engine.",
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      "5 Monthly Generations",
      "Standard Latency",
      "Community Access",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    description: "Foundational tools for individual creators.",
    priceMonthly: 19,
    priceAnnual: 190,
    features: [
      "50 Monthly Generations",
      "Priority Latency",
      "Email Support",
      "Project History",
    ],
    stripePriceIdMonthly: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: process.env.STRIPE_STANDARD_ANNUAL_PRICE_ID,
  },
  {
    id: "pro",
    name: "Professional",
    description: "High-throughput generation for serious work.",
    priceMonthly: 49,
    priceAnnual: 490,
    features: [
      "Unlimited Generations",
      "Ultra-Low Latency",
      "24/7 Priority Support",
      "Advanced Vectors",
      "History Export",
    ],
    highlighted: true,
    stripePriceIdMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Multi-protocol solutions for teams and agencies.",
    priceMonthly: 199,
    priceAnnual: 1990,
    features: [
      "Everything in Professional",
      "White-label API",
      "Team Clusters",
      "Brand Voice DNA",
      "Dedicated Account Lead",
    ],
    stripePriceIdMonthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID,
    stripePriceIdAnnual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID,
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
