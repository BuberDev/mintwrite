"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Crown, ShieldCheck, ArrowRight } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { motion } from "framer-motion"
import Link from "next/link"

type BillingCycle = "monthly" | "annual"
type BillingPlan = "free" | "pro" | "agency"

type BillingState = {
  ownerId: string | null
  plan: BillingPlan
  cycle: BillingCycle | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  stripeSessionId: string | null
  stripeInvoiceId: string | null
  stripeInvoiceUrl: string | null
  stripeStatus: string | null
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingState | null>(null)
  const [cycle, setCycle] = useState<BillingCycle>("monthly")

  useEffect(() => {
    async function fetchBilling() {
      try {
        const res = await fetch("/api/billing/status")
        if (!res.ok) throw new Error("Failed to fetch billing state")
        const data = await res.json()
        setBilling(data.billing ?? null)
      } catch {
        toast.error("Failed to load billing information")
      }
    }

    fetchBilling()
  }, [])

  const plans = useMemo(() => {
    const isPaidUser = billing?.plan !== "free" && billing?.plan !== undefined && billing?.stripeSubscriptionId != null;

    function freeButtonText() {
      if (billing?.plan === "free") return "Current plan";
      return isPaidUser ? "Downgrade in portal" : "Downgrade";
    }
    function proButtonText() {
      if (billing?.plan === "pro") return "Current plan";
      return isPaidUser ? "Change plan in portal" : "Upgrade to Pro";
    }
    function agencyButtonText() {
      if (billing?.plan === "agency") return "Current plan";
      return isPaidUser ? "Change plan in portal" : "Upgrade to Agency";
    }

    return [
      {
        name: "Free",
        price: "$0",
        description: "Lead generation and testing.",
        features: [
          "5 generations / month",
          "3 of 7 content types",
          "1 project profile",
          "Basic generation history",
          "Community support",
        ],
        icon: Sparkles,
        buttonText: freeButtonText(),
        variant: "free" as const,
        disabled: true,
      },
      {
        name: "Pro",
        price: cycle === "annual" ? "$39 / mo" : "$49",
        description: "The standard for Web3 founders.",
        features: [
          "Unlimited generations",
          "All 7 content types",
          "5 project profiles",
          "Unlimited generation history",
          "Export as PDF / Markdown",
          "TokenForge AI Import",
          "Priority email support",
        ],
        icon: Crown,
        buttonText: proButtonText(),
        variant: "pro" as const,
        highlight: true,
      },
      {
        name: "Agency",
        price: cycle === "annual" ? "$119 / mo" : "$149",
        description: "For agencies and in-house teams.",
        features: [
          "Everything in Pro",
          "Unlimited projects",
          "API access for bulk creation",
          "Dedicated account manager",
          "Multi-user workspace (Soon)",
          "Custom brand voice (Soon)",
        ],
        icon: ShieldCheck,
        buttonText: agencyButtonText(),
        variant: "agency" as const,
      },
    ]
  }, [billing?.plan, billing?.stripeSubscriptionId, cycle])

  const billingHref = (plan: Exclude<BillingPlan, "free">) => {
    if (billing?.plan !== "free" && billing?.stripeSubscriptionId) {
      return "/api/billing/portal"
    }
    return `/api/billing?plan=${plan}&cycle=${cycle}`
  }

  const handlePortal = async () => {
    globalThis.location.assign("/api/billing/portal")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-dark-600 pb-12"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-2 bg-brand-500" />
            <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">Billing Terminal // Stripe</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight leading-none">License Management</h1>
          <p className="text-dark-400 text-lg max-w-xl">
            Manage your Stripe subscription, billing cycle, invoices, and account portal from one place.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-none border border-dark-600 bg-dark-900 p-1">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${cycle === "monthly" ? "bg-brand-500 text-dark-950" : "text-dark-300"}`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycle("annual")}
            className={`px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${cycle === "annual" ? "bg-brand-500 text-dark-950" : "text-dark-300"}`}
          >
            Annual
          </button>
        </div>
      </motion.header>

      {billing && (
        <section className="max-w-2xl">
          <div className="bg-dark-900/50 p-10 border border-dark-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-4xl font-black font-mono">MW</span>
            </div>

            <div className="flex items-center justify-between mb-10 border-b border-dark-800 pb-6">
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.2em]">Active License</p>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold tracking-tight">{billing.plan.toUpperCase()}</h3>
                  {billing.stripeStatus && billing.stripeStatus !== "active" && billing.plan !== "free" && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-500/10 px-2 py-1 border border-red-500/20">
                      {billing.stripeStatus.replace("_", " ")}
                    </span>
                  )}
                </div>
              </div>
              <Badge variant={billing.plan as any}>{billing.plan}</Badge>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-none border border-dark-700 bg-black/30 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark-500">Stripe customer</p>
                <p className="mt-2 break-all text-sm text-dark-100">{billing.stripeCustomerId ?? "Not created yet"}</p>
              </div>
              <div className="rounded-none border border-dark-700 bg-black/30 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark-500">Subscription</p>
                <p className="mt-2 break-all text-sm text-dark-100">{billing.stripeSubscriptionId ?? "Not created yet"}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-none border border-dark-700 bg-black/30 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark-500">Billing cycle</p>
                <p className="mt-2 text-sm text-dark-100">{billing.cycle ?? cycle}</p>
              </div>
              <div className="rounded-none border border-dark-700 bg-black/30 p-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-dark-500">Latest invoice</p>
                {billing.stripeInvoiceUrl ? (
                  <Link href={billing.stripeInvoiceUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-medium text-dark-100 underline decoration-white/30 underline-offset-4">
                    Open invoice
                  </Link>
                ) : (
                  <p className="mt-2 text-sm text-dark-400">Available after the next successful charge.</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" onClick={handlePortal} className="h-11 rounded-none px-4 text-xs font-black uppercase tracking-[0.2em]">
                Open customer portal
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-none px-4 text-xs font-black uppercase tracking-[0.2em]">
                <Link href="/account">
                  View account
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <Card
            key={plan.name}
            className={`flex flex-col h-full p-10 border-dark-600 transition-all duration-500 bg-black/20 ${plan.highlight ? "border-brand-500 ring-1 ring-brand-500/20" : "hover:border-dark-400"}`}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className={`h-12 w-12 rounded-none flex items-center justify-center border transition-colors ${plan.highlight ? "bg-brand-500 text-dark-950 border-brand-500" : "bg-dark-800 text-dark-400 border-dark-700"}`}>
                <plan.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">[0{i + 1}]</span>
                <h3 className="text-xl font-bold tracking-tight leading-none">{plan.name}</h3>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold tracking-tighter">{plan.price}</span>
                <span className="text-xs text-dark-500 font-mono ml-2 uppercase">{cycle === "annual" && plan.variant !== "free" ? "billed annually" : "/ mo"}</span>
              </div>
              <p className="text-sm text-dark-400 mt-4 leading-relaxed font-medium">{plan.description}</p>
            </div>

            <ul className="flex-1 space-y-4 mb-12">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold text-dark-400">
                  <div className="size-1 bg-brand-500" />
                  {feature}
                </li>
              ))}
            </ul>

            {plan.variant === "free" ? (
              <Button variant="outline" className="w-full h-14 rounded-none font-black text-[10px] uppercase tracking-[0.2em]" disabled>
                {plan.buttonText}
              </Button>
            ) : (
              <Button
                asChild
                variant={plan.highlight ? "primary" : "outline"}
                className={`w-full h-14 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-all ${plan.highlight ? "shadow-2xl shadow-brand-500/10 hover:tracking-[0.3em]" : "border-dark-700 hover:bg-dark-800"}`}
              >
                <Link href={billingHref(plan.variant)}>
                  <span className="inline-flex items-center gap-2">
                    {plan.buttonText}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </Button>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
