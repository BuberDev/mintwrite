"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Building2, Zap } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Lead generation and testing',
      features: [
        '5 generations / month',
        '3 of 7 content types',
        '1 project profile',
        'Basic generation history',
        'Standard community support'
      ],
      icon: Zap,
      buttonText: 'Start for Free',
      href: '/dashboard',
      variant: 'free',
    },
    {
      name: 'Pro',
      price: isAnnual ? '$39' : '$49',
      description: 'The standard for Web3 founders',
      features: [
        'Unlimited generations',
        'All 7 content types',
        '5 project profiles',
        'Unlimited generation history',
        'Export as PDF / Markdown',
        'TokenForge AI Import',
        'Priority email support'
      ],
      icon: Crown,
      buttonText: 'Get Pro Access',
      href: '/dashboard',
      variant: 'pro',
      highlight: true,
    },
    {
      name: 'Agency',
      price: isAnnual ? '$119' : '$149',
      description: 'For agencies and in-house teams',
      features: [
        'Everything in Pro',
        'Unlimited projects',
        'Multi-user workspace (Soon)',
        'Custom brand voice (Soon)',
        'API access for bulk creation',
        'Dedicated account manager'
      ],
      icon: Building2,
      buttonText: 'Get Agency Access',
      href: '/dashboard',
      variant: 'agency',
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900 text-dark-100 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16">
          <Badge variant="pro" className="mb-4">Pricing Plans</Badge>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            The right plan for your <span className="text-brand-500">Web3 growth.</span>
          </h1>
          <p className="text-dark-400 max-w-2xl mx-auto mb-10 text-lg">
            Whether you're a solo founder or a high-growth agency, we have a plan that scales with you.
          </p>

          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-dark-100' : 'text-dark-500'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-12 h-6 rounded-none bg-dark-700 relative p-1 transition-colors"
            >
              <div className={`h-4 w-4 rounded-none bg-brand-500 transition-all duration-200 ${isAnnual ? 'ml-6' : 'ml-0'}`} />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-dark-100' : 'text-dark-500'}`}>
              Annual <span className="text-brand-500 font-bold ml-1">(-20%)</span>
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              variant={plan.highlight ? 'glass-elevated' : 'default'}
              className={`flex flex-col h-full border-dark-600 ${plan.highlight ? 'ring-2 ring-brand-500' : ''}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-none ${plan.highlight ? 'bg-brand-500 text-dark-950' : 'bg-dark-700 text-dark-300'}`}>
                  <plan.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-dark-400 ml-2">/ month</span>
                </div>
                {isAnnual && plan.name !== 'Free' && (
                  <p className="text-xs text-brand-500 font-bold mt-2 animate-fade-in">Billed annually</p>
                )}
                <p className="text-sm text-dark-400 mt-4 leading-relaxed">{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-dark-300">
                    <Check className="h-4 w-4 text-brand-500 mt-0.5 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="w-full">
                <Button
                  variant={plan.highlight ? 'primary' : 'secondary'}
                  className="w-full h-12 text-md"
                >
                  {plan.buttonText}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-24 max-w-3xl mx-auto text-center border-t border-dark-600 pt-16">
          <h2 className="text-2xl font-bold mb-6 italic text-dark-400">"This article is for informational purposes only and does not constitute financial advice. Always do your own research."</h2>
          <p className="text-dark-500 text-sm">
            That's the disclaimer our AI automatically inserts where needed. Just one of the many reasons why generic AI tools are no match for MintWrite AI.
          </p>
        </div>
      </div>
    </div>
  )
}
