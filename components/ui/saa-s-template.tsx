"use client"

import React from "react"
import { ArrowRight, Menu, X, Rocket, Shield, Zap, Layout } from "lucide-react"
import { cn } from "@/lib/utils"

// Inline Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "gradient"
  size?: "default" | "sm" | "lg"
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "default", size = "default", className = "", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-white text-black hover:bg-gray-100",
      secondary: "bg-gray-800 text-white hover:bg-gray-700",
      ghost: "hover:bg-gray-800/50 text-white",
      gradient: "bg-gradient-to-b from-white via-white/95 to-white/60 text-black hover:scale-105 active:scale-95"
    }
    
    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-10 px-5 text-sm",
      lg: "h-12 px-8 text-base"
    }
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

// Navigation Component
const Navigation = React.memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  return (
    <header className="fixed top-0 w-full z-50 border-b border-gray-800/50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-brand-500 flex items-center justify-center text-dark-950 font-bold text-xs">C</div>
            <span className="text-xl font-bold text-white tracking-tight">CryptoScribe</span>
          </div>
          
          <div className="hidden md:flex items-center justify-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-sm text-white/60 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-sm text-white/60 hover:text-white transition-colors">
              About
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button type="button" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button type="button" variant="default" size="sm">
              Sign Up
            </Button>
          </div>

          <button
            type="button"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-gray-800/50 animate-fade-in">
          <div className="px-6 py-4 flex flex-col gap-4">
            <a
              href="#features"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#about"
              className="text-sm text-white/60 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <div className="flex flex-col gap-2 pt-4 border-t border-gray-800/50">
              <Button type="button" variant="ghost" size="sm">
                Sign in
              </Button>
              <Button type="button" variant="default" size="sm">
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
})

Navigation.displayName = "Navigation"

// Hero Component
const Hero = React.memo(() => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start px-6 py-32 md:py-48 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none" />

      <aside className="mb-8 inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-700 bg-gray-800/50 backdrop-blur-sm max-w-full animate-fade-in">
        <span className="text-xs text-center whitespace-nowrap text-dark-300">
          New version 2.0 is now live!
        </span>
        <a
          href="#changelog"
          className="flex items-center gap-1 text-xs text-brand-400 hover:text-brand-300 transition-all active:scale-95 whitespace-nowrap"
          aria-label="Read more about the new version"
        >
          Read more
          <ArrowRight size={12} />
        </a>
      </aside>

      <h1
        className="text-4xl md:text-6xl lg:text-7xl font-bold text-center max-w-4xl px-6 leading-tight mb-8 font-display animate-slide-up"
        style={{
          background: "linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.02em"
        }}
      >
        Automate your Web3 <br />marketing engine with AI
      </h1>

      <p className="text-base md:text-lg text-center text-dark-300 max-w-2xl px-6 mb-12 animate-slide-up [animation-delay:200ms]">
        Generate professional Twitter threads, Discord updates, and blog posts 
        tailored for your protocol in seconds.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10 mb-20 animate-slide-up [animation-delay:400ms]">
        <Button
          type="button"
          variant="gradient"
          size="lg"
          className="rounded-xl flex items-center justify-center min-w-[200px] h-14"
          aria-label="Get started with the template"
        >
          Start Generating
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="rounded-xl flex items-center justify-center min-w-[200px] h-14 border border-dark-600"
        >
          View Documentation
        </Button>
      </div>

      <div className="w-full max-w-6xl relative animate-slide-up [animation-delay:600ms]">
        <div className="relative z-10 p-2 glass rounded-3xl border border-white/10 shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
            alt="Web3 Dashboard Preview"
            className="w-full h-auto rounded-2xl shadow-2xl"
            loading="eager"
          />
        </div>
      </div>
    </section>
  )
})

Hero.displayName = "Hero"

// Main Component
export default function SaasTemplate() {
  return (
    <main className="min-h-screen bg-dark-950 text-white font-sans selection:bg-brand-500/30 selection:text-brand-200">
      <Navigation />
      <Hero />
    </main>
  )
}
