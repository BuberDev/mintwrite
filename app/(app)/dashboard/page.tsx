"use client"

import { CONTENT_TYPES } from "@/lib/ai/content-types"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import Link from "next/link"
import { ArrowRight, Lock, Sparkles, Zap } from "lucide-react"
import { motion } from "framer-motion"

export default function DashboardPage() {
  const allTypes = Object.values(CONTENT_TYPES)

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-2">
          <Badge variant="pro" className="bg-brand-500/10 text-brand-400 border-brand-500/20 mb-2">
            Beta Access
          </Badge>
          <h1 className="text-4xl font-display font-bold tracking-tight">Content Hub</h1>
          <p className="text-dark-300 text-lg">
            Choose your engine and start scaling your protocol's reach.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-dark-800/50 p-2 rounded-2xl border border-dark-600">
          <div className="h-10 w-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-brand-500 fill-brand-500" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-dark-400 uppercase tracking-widest leading-none mb-1">Weekly Goal</p>
            <p className="text-sm font-bold">12 of 20 Assets</p>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTypes.map((type, i) => {
          const isPro = type.tier === 'pro'
          
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                variant={isPro ? 'default' : 'glass'}
                className={cn(
                  "group relative flex flex-col h-full p-7 rounded-[2rem] border-dark-600 hover:border-brand-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(0,212,170,0.05)] overflow-hidden",
                  isPro && "opacity-80"
                )}
              >
                {/* Decorative background glow for pro cards */}
                {isPro && (
                  <div className="absolute top-0 right-0 p-4">
                    <Lock className="h-4 w-4 text-dark-500" />
                  </div>
                )}

                <div className="flex items-center justify-between mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {type.icon}
                  </div>
                  <Badge variant={type.tier} className={cn(
                    "px-3 py-1",
                    type.tier === 'free' ? "bg-dark-700 text-dark-300" : "bg-brand-500/10 text-brand-400 border-brand-500/20"
                  )}>
                    {type.tier.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold group-hover:text-brand-500 transition-colors mb-3">
                    {type.label}
                  </h3>
                  <p className="text-sm text-dark-300 leading-relaxed">
                    {type.description}
                  </p>
                </div>

                <div className="mt-8">
                  {isPro ? (
                    <Button variant="secondary" className="w-full h-12 rounded-xl gap-2 bg-dark-800 text-dark-400 border-dark-700 cursor-not-allowed">
                      Upgrade to Unlock
                    </Button>
                  ) : (
                    <Link href={`/generate/${type.id}`}>
                      <Button variant="primary" className="w-full h-12 rounded-xl gap-2 font-bold shadow-lg shadow-brand-500/10">
                        Select Model
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
