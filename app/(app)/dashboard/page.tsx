"use client"

import { CONTENT_TYPES } from "@/lib/ai/content-types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ArrowRight, 
  Lock, 
  Sparkles, 
  Twitter, 
  MessagesSquare, 
  Users, 
  BarChart3, 
  FileText, 
  Mic2, 
  BookOpen,
  Plus
} from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { CreateProjectModal } from "@/components/modals/CreateProjectModal"
import { useState, useEffect } from "react"

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const allTypes = Object.values(CONTENT_TYPES)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        if (Array.isArray(data)) {
          setProjects(data)
        }
      } catch (err) {
        console.error("Failed to fetch projects")
      } finally {
        setIsLoadingProjects(false)
      }
    }
    fetchProjects()
  }, [])

  const refreshProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      if (Array.isArray(data)) {
        setProjects(data)
      }
    } catch (err) {
      console.error("Failed to refresh projects")
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 py-8 px-4">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-dark-600 pb-12"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">System Online // v2.4.1</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight leading-none">Intelligence Hub</h1>
          <p className="text-dark-400 text-lg max-w-xl">
            Protocol-level content synthesis. Select an specialized engine to begin documentation.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
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
          
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="outline" 
            className="h-20 px-8 border-brand-500/20 bg-brand-500/5 text-brand-500 hover:bg-brand-500/10 hover:border-brand-500/40 transition-all group"
          >
            <Plus className="size-4 mr-3 group-hover:scale-125 transition-transform" />
            <span className="font-mono text-[10px] uppercase tracking-widest">New Project</span>
          </Button>
        </div>
      </motion.header>

      <CreateProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refreshProjects}
      />

      {/* Projects Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-mono text-dark-500 uppercase tracking-[0.4em] font-bold">Active Projects</h2>
          <div className="h-px flex-1 bg-dark-800 mx-8" />
        </div>

        {projects.length === 0 && !isLoadingProjects ? (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="group cursor-pointer p-12 border border-dashed border-dark-700 bg-white/[0.01] hover:bg-white/[0.02] hover:border-brand-500/50 transition-all text-center flex flex-col items-center gap-4"
          >
            <div className="h-12 w-12 rounded-full bg-dark-800 flex items-center justify-center text-dark-500 group-hover:text-brand-500 transition-colors">
              <Plus className="size-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-dark-300">No project contexts initialized.</p>
              <p className="text-xs text-dark-500">Create your first project to enable specialized AI engines.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-dark-900 border border-dark-600 p-6 hover:border-brand-500 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 bg-brand-500/10 flex items-center justify-center text-brand-500 font-mono text-xs font-bold border border-brand-500/20">
                    ${project.ticker}
                  </div>
                  <span className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-brand-500 transition-colors">{project.name}</h3>
                <p className="text-xs text-dark-400 line-clamp-1 mb-6">{project.tagline}</p>
                
                <div className="flex items-center gap-2">
                  <Link href={`/generate/twitter-thread?project=${project.id}`} className="flex-1">
                    <Button variant="ghost" size="sm" className="w-full h-9 rounded-none bg-dark-800 text-[9px] font-black uppercase tracking-widest hover:bg-brand-500 hover:text-black transition-all">
                      Write
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Engines Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-mono text-dark-500 uppercase tracking-[0.4em] font-bold">Available Engines</h2>
          <div className="h-px flex-1 bg-dark-800 mx-8" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allTypes.map((type, i) => {
            const isPro = type.tier === 'pro'
            const modelId = `CS-ENG-00${i + 1}`
            const Icon = ICON_MAP[type.icon] || Sparkles
            
            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
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
                      <Icon className="size-8" />
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
    </div>
  )
}
