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
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
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

// ─── Features (Content Types) ───────────────────────────────────────────────

const Features = () => {
  const contentTypes = [
    { title: "Twitter Threads", icon: Twitter, desc: "8-12 tweet threads optimized for the X algorithm with perfect hooks." },
    { title: "Discord Updates", icon: MessageSquare, desc: "Formatted community announcements with markdown, emojis, and CTAs." },
    { title: "Tokenomics", icon: Zap, desc: "Human-readable explainers for vesting, allocation, and utility." },
    { title: "Blog Posts", icon: BookOpen, desc: "Medium-ready articles explaining your launch milestones and vision." },
    { title: "AMA Scripts", icon: Users, desc: "Ready-to-use Q&A scripts for community and investor sessions." },
    { title: "Whitepapers", icon: FileText, desc: "Technical executive summaries that build investor confidence." },
    { title: "Project Strategy", icon: Lightbulb, desc: "Content calendars and tone calibration for your protocol." },
  ]

  return (
    <section id="features" className="py-32 px-6 bg-background/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <Badge variant="pro" className="mb-6">7 Core Templates</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">The ultimate Web3 content engine</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Generic AI doesn't understand your protocol. We do. Our engine is trained on thousands of successful Web3 launches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {contentTypes.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card variant="glass" className="h-full p-8 rounded-[2rem] border-white/5 hover:border-brand-500/30 transition-all group cursor-default">
                <div className="h-14 w-14 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <type.icon className="h-7 w-7 text-brand-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">{type.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{type.desc}</p>
              </Card>
            </motion.div>
          ))}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-1"
          >
            <Card variant="glass" className="h-full p-8 rounded-[2rem] border-brand-500/20 bg-brand-500/5 flex flex-col items-center justify-center text-center group cursor-pointer">
              <Sparkles className="h-10 w-10 text-brand-500 mb-4 animate-pulse" />
              <h3 className="text-xl font-bold mb-2">More coming</h3>
              <p className="text-muted-foreground/80 text-xs">V2.0 Roadmap: Full Content Calendars & Brand Voice Training</p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing Section ────────────────────────────────────────────────────────

const Pricing = () => {
  const tiers = [
    {
      name: "Free",
      price: "0",
      desc: "Perfect for testing the engine.",
      features: ["5 Generations per month", "3 Content types", "7-day history", "Standard support"],
      cta: "Get Started Free",
      variant: "secondary" as const,
    },
    {
      name: "Pro",
      price: "49",
      popular: true,
      desc: "For serious Web3 founders.",
      features: ["Unlimited generations", "All 7 content types", "Unlimited history", "TokenForge AI Import", "Priority support"],
      cta: "Start Pro Trial",
      variant: "primary" as const,
    },
    {
      name: "Agency",
      price: "149",
      desc: "Scale multiple projects.",
      features: ["Everything in Pro", "Unlimited projects", "Team collaboration", "API Access", "Dedicated account manager"],
      cta: "Contact Sales",
      variant: "secondary" as const,
    }
  ]

  return (
    <section id="pricing" className="py-32 px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[600px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display">Simple, value-based pricing</h2>
          <p className="text-muted-foreground text-lg">Stop paying $5,000/mo to agencies. Scale with AI.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              variant={tier.popular ? "default" : "glass"}
              className={cn(
                "p-10 rounded-[2.5rem] flex flex-col h-full relative border-white/5",
                tier.popular && "border-brand-500/50 shadow-[0_0_60px_rgba(0,212,170,0.1)]"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-primary-foreground text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-full">
                  Recommended
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-display">${tier.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-muted-foreground text-sm mt-4">{tier.desc}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-foreground/80">
                    <div className="h-5 w-5 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-brand-500" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>

              <UserButton 
                variant={tier.variant} 
                className={cn(
                  "w-full h-14 rounded-2xl font-bold text-base",
                  tier.name === "Pro" && "bg-brand-500 text-primary-foreground hover:bg-brand-400"
                )}
              >
                {tier.cta}
              </UserButton>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Section ────────────────────────────────────────────────────────────

const CTA = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-5xl mx-auto bg-card border border-border rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <Badge variant="pro" className="mb-8">Join 200+ founders</Badge>
        <h2 className="text-4xl md:text-6xl font-bold mb-8 font-display tracking-tight">Ready to scale <br className="hidden md:block" /> your community?</h2>
        <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Generate your first content pack in under 60 seconds. No credit card required to start.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/dashboard">
            <UserButton variant="gradient" size="lg" className="rounded-2xl px-12 h-16 text-lg shadow-2xl">
              Get Started Free
            </UserButton>
          </Link>
          <Link href="#pricing">
            <UserButton variant="ghost" size="lg" className="rounded-2xl px-10 h-16 text-lg border border-white/10">
              View Pricing
            </UserButton>
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
        <Features />
        
        <Demo />

        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
