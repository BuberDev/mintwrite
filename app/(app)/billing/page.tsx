"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Building2, Crown } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export default function BillingPage() {
  const [tierInfo, setTierInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTier() {
      try {
        const res = await fetch('/api/user/tier')
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setTierInfo(data)
      } catch (err) {
        toast.error("Failed to load your plan info")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTier()
  }, [])

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for testing the waters',
      features: ['5 generations / month', '3 content types', '1 project', 'Basic support'],
      icon: Zap,
      buttonText: 'Current Plan',
      variant: 'free',
      disabled: true,
    },
    {
      name: 'Pro',
      price: '$49',
      description: 'For serious Web3 founders',
      features: ['Unlimited generations', 'All 7 content types', '5 projects', 'Priority support', 'History export'],
      icon: Crown,
      buttonText: 'Upgrade to Pro',
      variant: 'pro',
      highlight: true,
    },
    {
      name: 'Agency',
      price: '$149',
      description: 'For teams managing multiple projects',
      features: ['Everything in Pro', 'Unlimited projects', 'API Access (Coming soon)', 'Dedicated account manager'],
      icon: Building2,
      buttonText: 'Get Agency',
      variant: 'agency',
    }
  ]

  const handleUpgrade = async (plan: string) => {
    toast.info(`Redirecting to checkout for ${plan}...`)
    // Here we would call the checkout API from Phase 5
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
            <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">Billing Terminal // SECURE</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight leading-none">License Management</h1>
          <p className="text-dark-400 text-lg max-w-xl">
            Protocol licensing and bandwidth allocation. Select a tier to scale your synthesis capacity.
          </p>
        </div>
      </motion.header>

      {tierInfo && (
        <section className="max-w-xl">
          <div className="bg-dark-900/50 p-10 border border-dark-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-4xl font-black font-mono">NODE</span>
            </div>
            
            <div className="flex items-center justify-between mb-10 border-b border-dark-800 pb-6">
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.2em]">Active License</p>
                <h3 className="text-xl font-bold tracking-tight">{tierInfo.tier.toUpperCase()}</h3>
              </div>
              <Badge variant={tierInfo.tier as any}>{tierInfo.tier}</Badge>
            </div>
            
            <div className="space-y-6">
              <div className="flex justify-between text-[11px] font-mono text-dark-500 uppercase tracking-widest">
                <span>Bandwidth Consumption</span>
                <span className="text-dark-100">{tierInfo.generationsUsed} / {tierInfo.generationsLimit === 1000000 ? '∞' : tierInfo.generationsLimit}</span>
              </div>
              <div className="h-[2px] w-full bg-dark-800 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-brand-500 transition-all duration-500" 
                  style={{ width: `${(tierInfo.generationsUsed / tierInfo.generationsLimit) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-dark-500 font-mono italic">
                * Resetting in {30 - new Date().getDate()} days.
              </p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <Card 
            key={plan.name} 
            className={cn(
              "flex flex-col h-full p-10 border-dark-600 transition-all duration-500 bg-black/20",
              plan.highlight ? "border-brand-500 ring-1 ring-brand-500/20" : "hover:border-dark-400"
            )}
          >
            <div className="flex items-center gap-4 mb-10">
              <div className={cn(
                "h-12 w-12 rounded-none flex items-center justify-center border transition-colors",
                plan.highlight ? "bg-brand-500 text-dark-950 border-brand-500" : "bg-dark-800 text-dark-400 border-dark-700"
              )}>
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
                <span className="text-xs text-dark-500 font-mono ml-2 uppercase">/ cycle</span>
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

            <Button 
              variant={plan.highlight ? 'primary' : 'outline'} 
              className={cn(
                "w-full h-14 rounded-none font-black text-[10px] uppercase tracking-[0.2em] transition-all",
                plan.highlight ? "shadow-2xl shadow-brand-500/10 hover:tracking-[0.3em]" : "border-dark-700 hover:bg-dark-800"
              )}
              disabled={plan.disabled}
              onClick={() => handleUpgrade(plan.name)}
            >
              {plan.buttonText}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
