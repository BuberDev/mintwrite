"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Footer } from "@/components/ui/footer-section"

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
      features: ["Everything in Pro", "Unlimited Projects", "API Access", "Dedicated Account Manager", "Multi-user Workspace", "Custom Brand Voice"],
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
                rel="nofollow"
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

// ─── Narrative CTA ──────────────────────────────────────────────────────────

const HowItWorks = () => {
  const steps = [
    {
      num: '01',
      title: 'Create your project profile',
      desc: 'Enter your project name, token ticker, category (DeFi, GameFi, RWA…), tagline, and social links. This is your brand voice — stored once, used every time.',
    },
    {
      num: '02',
      title: 'Choose your content type',
      desc: 'Pick from 7 content types: X Thread, Discord Announcement, Tokenomics Explainer, Blog Post, AMA Script, Whitepaper Summary, or Community Update.',
    },
    {
      num: '03',
      title: 'Add context and generate',
      desc: 'Fill in a few fields (topic, key points, tone) and hit Generate. Your Web3-native content streams to screen in under 60 seconds. Copy, edit, publish.',
    },
  ]

  return (
    <section id="how-it-works" className="py-32 px-6 bg-black text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4">Workflow</p>
          <h2 className="text-5xl md:text-6xl font-bold font-display tracking-tight mb-6">
            Three steps to <span className="italic text-primary">publish-ready</span> content.
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-sm">
            No prompt engineering. No agency briefing. No waiting 3 days for a draft.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/10">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={cn(
                'p-12 flex flex-col border-white/10',
                i < 2 && 'md:border-r',
              )}
            >
              <span className="text-5xl font-black font-mono text-primary/20 mb-8">{step.num}</span>
              <h3 className="text-xl font-bold mb-4 tracking-tight">{step.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Process Preview (Distilled Intelligence) ───────────────────────────────

const ProcessPreview = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [text, setText] = useState("")
  const fullText = `🧵 We've been building in silence. Today we break it.\n\nIntroducing $PROTO — a DeFi primitive that eliminates impermanent loss at the protocol level. Here's how it works: 1/8\n\nThe problem with existing AMMs: liquidity providers lose value during volatile periods. This "impermanent loss" has drained billions from LPs since Uniswap v2 launched.\n\nProtocol-level IL protection changes this entirely. 2/8`

  useEffect(() => {
    if (isPlaying) {
      let i = 0
      const interval = setInterval(() => {
        setText(fullText.slice(0, i))
        i++
        if (i > fullText.length) clearInterval(interval)
      }, 20)
      return () => clearInterval(interval)
    } else {
      setText("")
    }
  }, [isPlaying])

  const steps = [
    { num: '01 /', title: 'INGESTION', desc: 'Protocol Spec Upload' },
    { num: '02 /', title: 'CALIBRATION', desc: 'Tone & Vector Tuning' },
    { num: '03 /', title: 'SYNTHESIS', desc: 'Multi-Platform Output' },
  ]

  return (
    <section id="process" className="py-32 px-6 bg-zinc-950 text-white border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
        <div className="text-[200px] font-black italic tracking-tighter uppercase leading-none">INTELLIGENCE</div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary mb-6">Process Preview</p>
            <h2 className="text-5xl md:text-7xl font-bold font-display tracking-tighter leading-none mb-8">
              Distilled <br /> <span className="text-primary italic">Intelligence.</span>
            </h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-md leading-relaxed">
              Watch how we ingest raw protocol documentation and output production-grade social architecture in seconds. No prompt engineering required.
            </p>

            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.title} className="flex items-start gap-6 group">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono text-primary font-bold">{step.num}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">{step.title}</h3>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video bg-black border border-white/10 relative overflow-hidden group shadow-2xl">
              {/* Header */}
              <div className="absolute top-0 inset-x-0 h-10 border-b border-white/10 bg-white/[0.02] flex items-center justify-between px-4 z-10">
                <div className="flex items-center gap-4">
                  <div className="size-2 rounded-full bg-red-500/20" />
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">CS_CORE_SYSTEM // BUFFER_ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-1 bg-primary animate-pulse" />
                  <span className="text-[9px] font-mono text-primary uppercase">Syncing...</span>
                </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-12 pt-16 font-mono text-xs text-zinc-400 overflow-hidden">
                {isPlaying ? (
                  <pre className="whitespace-pre-wrap leading-relaxed text-zinc-300">
                    {text}
                    <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-1 align-middle" />
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="size-20 rounded-full border border-primary/30 flex items-center justify-center bg-primary/10 hover:bg-primary hover:text-black transition-all group/play"
                    >
                      <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-current border-b-[12px] border-b-transparent ml-2" />
                    </button>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold group-hover:text-zinc-400 transition-colors">Click to synthesize demo</p>
                  </div>
                )}
              </div>

              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 size-24 border-r border-b border-primary/20 pointer-events-none" />
            <div className="absolute -top-4 -left-4 size-24 border-l border-t border-primary/20 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Preview ──────────────────────────────────────────────────────────────

const FaqPreview = () => {
  const faqs = [
    {
      q: 'How is this different from ChatGPT?',
      a: 'Generic AI models produce corporate-sounding copy with incorrect Web3 terminology. Mint Write is built on a protocol-level intelligence layer: it knows the difference between TGE and ICO, understands vesting mechanics, and writes in authentic founder voice.',
    },
    {
      q: 'Who owns the content I generate?',
      a: 'You do. Mint Write grants you a perpetual, worldwide licence to use, publish, and modify all generated content. We claim no IP rights over your outputs.',
    },
    {
      q: 'Is it really 100× cheaper than an agency?',
      a: 'Yes. Web3 content agencies charge $3,000–$10,000/month. Mint Write Pro is $49/month with unlimited generations.',
    },
    {
      q: 'Does the free plan require a credit card?',
      a: 'No. Free is genuinely free — 5 generations/month, 3 content types, 1 project profile. Upgrade when you need more.',
    },
  ]

  return (
    <section className="py-32 px-6 bg-zinc-950 text-white border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4">FAQ</p>
          <h2 className="text-4xl font-bold tracking-tight">Common questions.</h2>
        </div>
        <div className="divide-y divide-white/10 border border-white/10">
          {faqs.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex items-center justify-between gap-4 cursor-pointer p-6 list-none hover:bg-white/[0.02] transition-colors">
                <span className="font-semibold text-sm leading-relaxed">{item.q}</span>
                <span className="text-primary shrink-0 text-lg font-mono group-open:rotate-45 transition-transform duration-200">+</span>
              </summary>
              <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">{item.a}</div>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/faq" className="text-xs font-mono uppercase tracking-widest text-primary hover:opacity-70 transition-opacity">
            View all questions →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Roadmap ─────────────────────────────────────────────────────────────────

const Roadmap = () => {
  const items = [
    { status: 'live', label: 'Live', title: 'X Thread Generator', desc: '280-char formatted threads with hooks and calls to action.' },
    { status: 'live', label: 'Live', title: 'Discord Announcements', desc: 'Role-mention formatted messages for server drops and updates.' },
    { status: 'live', label: 'Live', title: 'Tokenomics Explainer', desc: 'Markdown tables, vesting schedules, and emission narratives.' },
    { status: 'live', label: 'Live', title: 'Multi-user Workspaces', desc: 'Invite your team. Shared project profiles, roles, and review queues.' },
    { status: 'live', label: 'Live', title: 'Custom Brand Voice', desc: 'Upload past content — Mint Write learns your project\'s unique tone.' },
    { status: 'live', label: 'Live', title: 'API Access', desc: 'Generate content programmatically. Pipe directly into your CMS or bot.' },
    { status: 'live', label: 'Live', title: 'TokenForge AI Import', desc: 'Paste your tokenomics JSON — auto-generate full community explainer.' },
  ]

  const badge: Record<string, string> = {
    live: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    building: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    planned: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  }

  return (
    <section className="py-32 px-6 bg-black text-white border-t border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4">Roadmap</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">What we're building.</h2>
          <p className="text-zinc-400 text-sm">Transparent. Public. Shaped by community feedback.</p>
        </div>
        <div className="space-y-0 border border-white/10 divide-y divide-white/10">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-8 px-8 py-6 hover:bg-white/[0.02] transition-colors">
              <span className={cn('mt-0.5 shrink-0 text-[9px] font-mono uppercase tracking-widest border px-2 py-0.5', badge[item.status])}>
                {item.label}
              </span>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-zinc-500 text-xs mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const FinalCTA = () => {
  return (
    <section className="py-48 px-6 text-center bg-zinc-950 text-white border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.4em] text-primary mb-12">Execution Phase</p>
        <h2 className="text-6xl md:text-8xl font-bold font-display tracking-tight mb-12">Stop <span className="text-zinc-500">Drafting.</span> <br /> Start Leading.</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button asChild size="lg" className="h-16 px-12 rounded-none text-sm uppercase tracking-widest font-black bg-primary text-black hover:bg-primary/90">
            <Link href="/sign-up">Get Access Now</Link>
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
        <HowItWorks />
        <ProcessPreview />
        <Demo />
        <PricingMatrix />
        <Roadmap />
        <FaqPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
