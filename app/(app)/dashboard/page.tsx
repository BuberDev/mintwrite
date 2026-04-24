"use client"

import { CONTENT_TYPES } from "@/lib/ai/content-types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Zap, 
  Twitter, 
  MessagesSquare, 
  Users, 
  BarChart3, 
  FileText, 
  Mic2, 
  BookOpen 
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, any> = {
  'twitter': Twitter,
  'discord': MessagesSquare,
  'users': Users,
  'bar-chart': BarChart3,
  'file-text': FileText,
  'mic': Mic2,
  'book-open': BookOpen,
}

export default function DashboardPage() {
  const allTypes = Object.values(CONTENT_TYPES)

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 px-4">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-dark-600 pb-12"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-2 bg-brand-500 animate-pulse" />
            <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">System Online // v2.4.1</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight leading-none">Intelligence Hub</h1>
          <p className="text-dark-400 text-lg max-w-xl">
            Protocol-level content synthesis. Select an specialized engine to begin documentation.
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-dark-900/50 p-6 border border-dark-600 backdrop-blur-sm">
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Active Session</p>
            <p className="text-sm font-bold font-mono">0x71...C42B</p>
          </div>
          <div className="h-8 w-px bg-dark-700" />
          <div className="space-y-1">
            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Output Goal</p>
            <p className="text-sm font-bold">12 / 20 <span className="text-dark-500 font-normal ml-1 text-[10px]">Assets</span></p>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {allTypes.map((type, i) => {
          const isPro = type.tier === 'pro'
          const modelId = `CS-ENG-00${i + 1}`
          
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                variant={isPro ? 'default' : 'glass'}
                className={cn(
                  "group relative flex flex-col h-full p-8 border-dark-600 hover:border-brand-500 transition-all duration-500 bg-black/20",
                  isPro && "opacity-60 grayscale"
                )}
              >
                <div className="flex items-start justify-between mb-12">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-brand-500/60 uppercase">[{modelId}]</span>
                    <h3 className="text-2xl font-bold tracking-tight leading-none group-hover:text-brand-500 transition-colors">
                      {type.label}
                    </h3>
                  </div>
                  <div className="text-brand-500/40 grayscale group-hover:grayscale-0 group-hover:text-brand-500 transition-all duration-500 transform group-hover:scale-110">
                    {(() => {
                      const Icon = ICON_MAP[type.icon] || Sparkles
                      return <Icon className="size-8" />
                    })()}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <p className="text-sm text-dark-400 leading-relaxed font-medium">
                    {type.description}
                  </p>
                  
                  <div className="pt-6 border-t border-dark-800 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-dark-500">
                      <span>Latency</span>
                      <span className="text-dark-300">~14ms</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-dark-500">
                      <span>Token Optimization</span>
                      <span className="text-dark-300">L4 Complex</span>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  {isPro ? (
                    <Button variant="outline" className="w-full h-14 bg-dark-900/50 border-dark-700 text-dark-500 text-[10px] font-black uppercase tracking-[0.2em] cursor-not-allowed">
                      <Lock className="size-3 mr-2" /> Upgrade Required
                    </Button>
                  ) : (
                    <Link href={`/generate/${type.id}`}>
                      <Button variant="primary" className="w-full h-14 font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/10 transition-all hover:tracking-[0.3em]">
                        Launch Engine
                        <ArrowRight className="h-3 w-3 ml-2 transition-transform group-hover:translate-x-1" />
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

