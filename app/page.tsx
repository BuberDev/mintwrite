"use client"

import React, { useState } from "react"
import {
  ArrowRight, Menu, X, Check, Zap, Shield, Sparkles,
  ChevronRight, Twitter, MessageSquare, BookOpen,
  FileText, Users, Presentation, Lightbulb, Play
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Footer } from "@/components/ui/footer-section"
import { AnimatedGroup } from "@/components/ui/animated-group"

import { HeroSection } from "@/components/ui/hero-section-1"
import { Demo } from "@/components/ui/demo"

// ─── Shared Components (User Provided Button Logic) ──────────────────────────
// Note: UserButton is kept for legacy sections (Features, Pricing, CTA)
// but standard Button is now preferred for new sections.

interface UserButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient" | "primary";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const UserButton = React.forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      primary: "bg-brand-500 text-primary-foreground hover:bg-brand-400 shadow-lg shadow-primary/10",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800/50 text-white",
      gradient: "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95"
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant as keyof typeof variants] || variants.default, sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
UserButton.displayName = "UserButton";

// ─── Content Sections ────────────────────────────────────────────────────────

// ─── Capability Ledger (Formerly Features) ──────────────────────────────────

const Capabilities = () => {
  const capabilities = [
    { title: "Thread Architect", label: "Twitter/X", code: "TH-812", desc: "Native 8-12 tweet sequences engineered for algorithmic retention. Not just content, but social architecture." },
    { title: "Community Pulse", label: "Discord", code: "DC-402", desc: "Announcement frameworks with built-in community hooks and markdown-optimized formatting." },
    { title: "Protocol Spec", label: "Tokenomics", code: "TK-001", desc: "Technical documentation distilled into human-readable value propositions. Zero fluff, pure utility." },
    { title: "Medium Lead", label: "Long-form", code: "LF-750", desc: "High-authority articles for project launches, milestones, and technical vision statements." },
    { title: "Dialogue Scripts", label: "AMA/IR", code: "IR-992", desc: "Strategic Q&A frameworks for community engagement and investor relations." },
  ]

  return (
    <section id="features" className="py-32 px-6 bg-zinc-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-12">
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-bold font-display tracking-tighter leading-[0.9] mb-8">
              Engineered for <br /> <span className="text-primary">High-Stakes</span> Content.
            </h2>
          </div>
          <div className="max-w-sm text-zinc-400 pt-4 border-t border-primary/20">
            <p className="text-sm font-mono uppercase tracking-widest mb-4">Core Capabilities // v2.4</p>
            <p className="text-base leading-relaxed">
              Standard LLMs fail in Web3 because they lack protocol-level context. Mint Write is a specific intelligence layer designed for founders.
            </p>
          </div>
        </div>

        <div className="divide-y divide-white/5 border-y border-white/5">
          {capabilities.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="group py-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center hover:bg-white/[0.02] transition-colors px-4"
            >
              <div className="md:col-span-1 text-xs font-mono text-zinc-500">
                [{item.code}]
              </div>
              <div className="md:col-span-4">
                <h3 className="text-2xl font-bold font-display tracking-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-primary/60 font-black">
                  {item.label}
                </span>
              </div>
              <div className="md:col-span-5 text-zinc-400 text-sm leading-relaxed">
                {item.desc}
              </div>
              <div className="md:col-span-2 flex justify-end">
                <div className="h-px w-12 bg-white/10 group-hover:w-24 group-hover:bg-primary transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Subscription Matrix (Formerly Pricing) ──────────────────────────────────

const PricingMatrix = () => {
  const [cycle, setCycle] = useState<"monthly" | "annual">("monthly")

  const tiers = [
    {
      id: "free",
      name: "Free",
      priceMonthly: "0",
      priceAnnual: "0",
      type: "Lead generation",
      features: ["5 Monthly Generations", "3 of 7 Content Types", "1 Project Profile", "Community Support"],
      cta: "Start Free",
      primary: false
    },
    {
      id: "pro",
      name: "Pro",
      priceMonthly: "49",
      priceAnnual: "39",
      type: "Web3 Founders",
      features: ["Unlimited Generations", "All 7 Content Types", "5 Project Profiles", "History Export PDF/MD", "TokenForge AI Import", "Priority Email Support"],
      cta: "Get Pro",
      primary: true
    },
    {
      id: "agency",
      name: "Agency",
      priceMonthly: "149",
      priceAnnual: "119",
      type: "Teams & Agencies",
      features: ["Everything in Pro", "Unlimited Projects", "API Access", "Dedicated Account Manager", "Multi-user Workspace (Soon)", "Custom Brand Voice (Soon)"],
      cta: "Get Agency",
      primary: false
    }
  ]

  return (
    <section id="pricing" className="py-32 px-6 bg-zinc-950 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4">Value Proposition</p>
          <h2 className="text-5xl md:text-6xl font-bold font-display tracking-tight mb-8">Scale Your <span className="italic">Authority</span>.</h2>

          {/* Cycle Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", cycle === "monthly" ? "text-white" : "text-zinc-600")}>Monthly</span>
            <button
              onClick={() => setCycle(cycle === "monthly" ? "annual" : "monthly")}
              className="relative w-14 h-7 rounded-none bg-white/5 border border-white/10 p-1 transition-colors hover:border-white/20"
            >
              <motion.div
                animate={{ x: cycle === "monthly" ? 0 : 28 }}
                className="w-5 h-5 rounded-none bg-primary"
              />
            </button>
            <span className={cn("text-xs font-bold uppercase tracking-widest transition-colors", cycle === "annual" ? "text-white" : "text-zinc-600")}>Annual</span>
            <Badge variant="default" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-black">20% OFF</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-white/5 rounded-none overflow-hidden bg-black/40 backdrop-blur-xl">
          {tiers.map((tier, i) => (
            <div
              key={tier.name}
              className={cn(
                "p-12 flex flex-col border-white/5",
                i < 2 && "md:border-r border-b md:border-b-0",
                tier.primary && "bg-white/[0.02] relative"
              )}
            >
              {tier.primary && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 px-2 py-1 rounded-none">
                    Preferred
                  </div>
                </div>
              )}
              <div className="mb-12">
                <p className="text-[10px] font-mono uppercase text-zinc-500 mb-2">[{tier.type}]</p>
                <h3 className="text-3xl font-bold mb-4">{tier.name}</h3>
                <div className="flex items-baseline h-12">
                  <span className="text-sm font-mono mr-1 text-primary">$</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cycle}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-5xl font-bold tracking-tighter"
                    >
                      {cycle === "monthly" ? tier.priceMonthly : tier.priceAnnual}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs text-zinc-500 ml-2">/{cycle === "monthly" ? "mo" : "mo, billed annually"}</span>
                </div>
              </div>

              <div className="space-y-4 mb-16 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold text-zinc-400">
                    <div className="size-1 bg-primary" />
                    {f}
                  </div>
                ))}
              </div>

              <Link
                href={`/api/billing?plan=${tier.id}&cycle=${cycle}`}
                className={cn(
                  "flex items-center justify-center w-full h-14 rounded-none font-bold uppercase tracking-[0.2em] text-xs transition-all",
                  tier.primary
                    ? "bg-primary text-black hover:bg-primary/90 hover:tracking-[0.3em]"
                    : "border border-white/10 text-white hover:bg-white/5"
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Narrative CTA ──────────────────────────────────────────────────────────

const FinalCTA = () => {
  return (
    <section className="py-48 px-6 text-center bg-zinc-950 text-white border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-primary mb-12">Execution Phase</p>
        <h2 className="text-6xl md:text-8xl font-bold font-display tracking-tight mb-12">Stop <span className="text-zinc-500">Drafting.</span> <br /> Start Leading.</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button size="lg" className="h-16 px-12 rounded-none text-sm uppercase tracking-widest font-black bg-primary text-black hover:bg-primary/90">
            Get Access Now
          </Button>
          <Link href="#pricing" className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-400 hover:text-primary transition-colors py-4">
            Browse Methodology
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
      <main>
        <HeroSection />
        <Capabilities />

        <Demo />

        <PricingMatrix />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
