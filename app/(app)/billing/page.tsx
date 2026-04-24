"use client"

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
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
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Subscription & Billing</h1>
        <p className="text-dark-400 mt-2">Manage your plan and usage limits.</p>
      </header>

      {tierInfo && (
        <Card variant="glass" className="max-w-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Current Usage</h3>
            <Badge variant={tierInfo.tier as any}>{tierInfo.tier}</Badge>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-dark-400">Generations</span>
              <span className="font-medium">{tierInfo.generationsUsed} / {tierInfo.generationsLimit === 1000000 ? '∞' : tierInfo.generationsLimit}</span>
            </div>
            <div className="h-2 w-full bg-dark-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 transition-all duration-500" 
                style={{ width: `${(tierInfo.generationsUsed / tierInfo.generationsLimit) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.name} 
            variant={plan.highlight ? 'glass-elevated' : 'default'}
            className={`flex flex-col h-full border-dark-600 ${plan.highlight ? 'ring-2 ring-brand-500/50' : ''}`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${plan.highlight ? 'bg-brand-500 text-dark-950' : 'bg-dark-700 text-dark-300'}`}>
                <plan.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-dark-400 ml-2">/ month</span>
              <p className="text-sm text-dark-400 mt-2">{plan.description}</p>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-dark-300">
                  <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button 
              variant={plan.highlight ? 'primary' : 'secondary'} 
              className="w-full"
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
