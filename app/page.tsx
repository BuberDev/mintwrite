"use client"

import React, { useState } from "react"
import { 
  ArrowRight, Menu, X, Check, Zap, Shield, Sparkles, 
  ChevronRight, Twitter, MessageSquare, BookOpen, 
  FileText, Users, Presentation, Lightbulb, Play
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Footer } from "@/components/ui/footer-section"

// ─── Shared Components (User Provided Button Logic) ──────────────────────────

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
      primary: "bg-brand-500 text-dark-950 hover:bg-brand-400 shadow-lg shadow-brand-500/10",
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

// ─── Navigation ─────────────────────────────────────────────────────────────

const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-dark-950 font-bold text-lg group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/20">
              C
            </div>
            <span className="text-xl font-bold text-white tracking-tight font-display">
              Crypto<span className="text-brand-500">Scribe</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center justify-center gap-10 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a href="#features" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-white/50 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-sm font-medium text-white/50 hover:text-white transition-colors">About</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in">
              <UserButton type="button" variant="ghost" size="sm">Sign in</UserButton>
            </Link>
            <Link href="/dashboard">
              <UserButton type="button" variant="primary" size="sm" className="rounded-xl px-6">
                Start Generating
              </UserButton>
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              <a href="#features" className="text-lg font-medium text-white/70" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#pricing" className="text-lg font-medium text-white/70" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#about" className="text-lg font-medium text-white/70" onClick={() => setMobileMenuOpen(false)}>About</a>
              <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
                <Link href="/sign-in" className="w-full">
                  <UserButton type="button" variant="ghost" size="lg" className="w-full justify-center">Sign in</UserButton>
                </Link>
                <Link href="/dashboard" className="w-full">
                  <UserButton type="button" variant="primary" size="lg" className="w-full justify-center rounded-xl">Start Generating</UserButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
})
Navigation.displayName = "Navigation"

// ─── Hero (User Provided) ───────────────────────────────────────────────────

const Hero = React.memo(() => {
  return (
    <section className="relative pt-40 pb-20 px-6 flex flex-col items-center justify-start overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.aside 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm"
      >
        <span className="text-xs text-dark-300">New version 2.0 is out!</span>
        <a href="#pricing" className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-all">
          View Plans <ArrowRight size={12} />
        </a>
      </motion.aside>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl lg:text-8xl font-bold text-center max-w-5xl px-6 leading-[1.1] mb-8 font-display"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.04em"
        }}
      >
        Write Web3 content <br />
        <span className="text-brand-500">in under 60 seconds.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-center text-dark-200 max-w-2xl px-6 mb-12 leading-relaxed"
      >
        Professional Twitter threads, Discord updates, and Tokenomics explainers 
        tailored for your protocol with correct blockchain terminology.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-5 mb-24 z-10"
      >
        <Link href="/dashboard">
          <UserButton variant="gradient" size="lg" className="rounded-2xl px-12 h-16 text-lg shadow-2xl shadow-white/10">
            Start Generating Free
          </UserButton>
        </Link>
        <Link href="#demo">
          <UserButton variant="ghost" size="lg" className="rounded-2xl px-10 h-16 text-lg border border-white/10 glass">
            <Play className="mr-2 h-5 w-5 fill-white" /> Watch Demo
          </UserButton>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full max-w-6xl relative"
      >
        <div className="relative z-10 p-2 glass rounded-[2.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,212,170,0.1)]">
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
            alt="CryptoScribe Dashboard"
            className="w-full h-auto rounded-[2.2rem] shadow-2xl"
            loading="eager"
          />
        </div>
      </motion.div>
    </section>
  )
})
Hero.displayName = "Hero"

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
    <section id="features" className="py-32 px-6 bg-dark-950/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <Badge variant="pro" className="mb-6">7 Core Templates</Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display tracking-tight">The ultimate Web3 content engine</h2>
          <p className="text-dark-300 text-lg max-w-2xl mx-auto leading-relaxed">
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
                <p className="text-dark-300 text-sm leading-relaxed">{type.desc}</p>
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
              <p className="text-dark-400 text-xs">V2.0 Roadmap: Full Content Calendars & Brand Voice Training</p>
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
          <p className="text-dark-300 text-lg">Stop paying $5,000/mo to agencies. Scale with AI.</p>
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-500 text-dark-950 text-[10px] font-black uppercase tracking-widest py-1 px-4 rounded-full">
                  Recommended
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold font-display">${tier.price}</span>
                  <span className="text-dark-400 text-sm">/month</span>
                </div>
                <p className="text-dark-300 text-sm mt-4">{tier.desc}</p>
              </div>

              <div className="space-y-4 mb-10 flex-1">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-center gap-3 text-sm text-dark-200">
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
                  tier.name === "Pro" && "bg-brand-500 text-dark-950 hover:bg-brand-400"
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
      <div className="max-w-5xl mx-auto bg-dark-900 border border-white/5 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <Badge variant="pro" className="mb-8">Join 200+ founders</Badge>
        <h2 className="text-4xl md:text-6xl font-bold mb-8 font-display tracking-tight">Ready to scale <br className="hidden md:block" /> your community?</h2>
        <p className="text-dark-300 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
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
    <div className="flex flex-col min-h-screen bg-dark-950 text-white selection:bg-brand-500/30 selection:text-brand-200">
      <Navigation />
      <main>
        <Hero />
        
        {/* Trust Signals */}
        <section className="py-16 border-y border-white/5 bg-black/40">
          <div className="max-w-7xl mx-auto flex flex-col items-center gap-10 px-6">
            <p className="text-[11px] font-black text-dark-500 uppercase tracking-[0.5em]">
              Powering content for founders at
            </p>
            <div className="flex flex-wrap justify-center gap-10 lg:gap-20 opacity-30 grayscale invert hover:opacity-50 transition-opacity">
               {['UNISWAP', 'AAVE', 'LIDO', 'CHAINLINK', 'ARBITRUM', 'OPTIMISM'].map(logo => (
                 <span key={logo} className="font-black text-2xl italic tracking-tighter cursor-default">
                   {logo}
                 </span>
               ))}
            </div>
            <p className="text-xs text-dark-400 mt-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-500" />
              Built by the TokenForge AI team
            </p>
          </div>
        </section>

        <Features />
        
        {/* Live Demo Teaser Section */}
        <section id="demo" className="py-32 px-6 bg-black">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <Badge variant="agency" className="mb-6">Live Demo</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 font-display">From project data to <br /> viral threads in seconds.</h2>
              <div className="space-y-8">
                {[
                  { step: "01", title: "Input Project Context", desc: "Select your project category and key milestones." },
                  { step: "02", title: "AI Generation", desc: "Our engine writes platform-optimized copy in 15-30s." },
                  { step: "03", title: "Refine & Publish", desc: "One-click copy to X, Discord, or Medium." }
                ].map((item) => (
                  <div key={item.step} className="flex gap-6 group">
                    <div className="h-12 w-12 rounded-xl bg-dark-800 border border-white/10 flex items-center justify-center text-brand-500 font-bold shrink-0 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-dark-300 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
              <Card variant="glass-elevated" className="p-4 rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden relative z-10">
                <div className="bg-dark-900 rounded-[2rem] overflow-hidden border border-white/5">
                   {/* Simulating a generation UI */}
                   <div className="p-6 border-b border-white/5 bg-dark-800 flex items-center justify-between">
                     <div className="flex gap-1.5">
                       <div className="h-3 w-3 rounded-full bg-red-500/50" />
                       <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                       <div className="h-3 w-3 rounded-full bg-green-500/50" />
                     </div>
                     <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">Generating Content...</span>
                   </div>
                   <div className="p-8 space-y-6">
                      <div className="space-y-2">
                        <div className="h-2 w-20 bg-dark-700 rounded" />
                        <div className="h-12 w-full bg-dark-800 border border-white/5 rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 w-24 bg-dark-700 rounded" />
                        <div className="h-24 w-full bg-dark-800 border border-white/5 rounded-xl" />
                      </div>
                      <div className="h-12 w-full bg-brand-500/20 border border-brand-500/30 rounded-xl flex items-center justify-center">
                        <div className="h-2 w-24 bg-brand-500/40 rounded animate-pulse" />
                      </div>
                   </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
