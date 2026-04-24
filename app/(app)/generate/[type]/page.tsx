"use client"

import { getContentType } from "@/lib/ai/content-types"
import { GenerationForm } from "@/components/forms/GenerationForm"
import { ContentOutput } from "@/components/output/ContentOutput"
import { useState, useEffect } from "react"
import { useCompletion } from "ai/react"
import { toast } from "sonner"
import { 
  ChevronLeft, 
  Sparkles, 
  Wand2, 
  Twitter, 
  MessagesSquare, 
  Users, 
  BarChart3, 
  FileText, 
  Mic2, 
  BookOpen 
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const ICON_MAP: Record<string, any> = {
  'twitter': Twitter,
  'discord': MessagesSquare,
  'users': Users,
  'bar-chart': BarChart3,
  'file-text': FileText,
  'mic': Mic2,
  'book-open': BookOpen,
}

export default function GeneratePage({ params }: { params: { type: string } }) {
  const contentType = getContentType(params.type)
  const [lastContext, setLastContext] = useState<Record<string, string>>({})
  const [projects, setProjects] = useState<any[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()
        setProjects(data)
        if (data.length > 0) {
          setSelectedProjectId(data[0].id)
        }
      } catch (err) {
        toast.error("Failed to fetch projects")
      } finally {
        setIsInitialLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/generate',
    onFinish: async (prompt, result) => {
      toast.success("Content generated successfully!")
      
      try {
        const project = projects.find(p => p.id === selectedProjectId)
        await fetch('/api/generations', {
          method: 'POST',
          body: JSON.stringify({
            projectId: selectedProjectId,
            projectName: project?.name || 'Unknown Project',
            contentTypeId: contentType.id,
            contentTypeLabel: contentType.label,
            context: lastContext,
            output: result,
          })
        })
      } catch (err) {
        console.error("Failed to save generation:", err)
      }
    },
    onError: (err) => {
      toast.error("Failed to generate content. Please try again.")
      console.error(err)
    }
  })

  const handleSubmit = async (context: Record<string, string>) => {
    if (!selectedProjectId) {
      toast.error("Please select or create a project first")
      return
    }
    
    setLastContext(context)
    await complete('', {
      body: {
        projectId: selectedProjectId,
        contentTypeId: contentType.id,
        context,
      }
    })
  }

  const handleRegenerate = () => {
    handleSubmit(lastContext)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-dark-600 pb-12"
      >
        <div className="flex items-center gap-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-none bg-dark-900 border border-dark-600 hover:bg-dark-800 transition-all group">
              <ChevronLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-none bg-brand-500/5 border border-brand-500/20 flex items-center justify-center text-brand-500/60 shadow-2xl shadow-brand-500/5">
              {(() => {
                const Icon = ICON_MAP[contentType.icon] || Sparkles
                return <Icon className="size-10" />
              })()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="size-1.5 bg-brand-500 animate-pulse" />
                <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">Engine Active // {contentType.id.toUpperCase()}</span>
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight leading-none">{contentType.label}</h1>
              <p className="text-dark-400 text-sm">{contentType.description}</p>
            </div>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-6 bg-dark-900/50 p-6 border border-dark-600 backdrop-blur-sm">
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Model Latency</p>
            <p className="text-sm font-bold font-mono">14.2MS</p>
          </div>
          <div className="h-8 w-px bg-dark-700" />
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Auth Level</p>
            <p className="text-sm font-bold uppercase tracking-tighter">Foundational</p>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 space-y-10"
        >
          <div className="p-10 rounded-none bg-black/20 border border-dark-600 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-6xl font-black font-mono">01</span>
            </div>
            
            <div className="flex items-center gap-4 mb-10 border-b border-dark-800 pb-8">
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.2em]">Calibration Phase</p>
                <h3 className="text-lg font-bold tracking-tight">Context Injection</h3>
              </div>
            </div>
            
            <GenerationForm 
              contentType={contentType} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="p-8 rounded-none bg-brand-500/[0.02] border border-brand-500/10 flex items-start gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-brand-500/[0.05] to-transparent pointer-events-none" />
            <div className="h-12 w-12 rounded-none bg-brand-500/10 border border-brand-500/20 flex items-center justify-center shrink-0">
              <Wand2 className="h-6 w-6 text-brand-500" />
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">Vector Tuning</p>
              <h4 className="text-sm font-bold text-dark-100 uppercase tracking-tighter">Strategic Insight</h4>
              <p className="text-sm text-dark-400 leading-relaxed italic">
                "Inject specific metrics like TVL or Holder count. Generic AI drafts for users; CryptoScribe drafts for investors."
              </p>
            </div>
          </div>
        </motion.div>

        {/* Output Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="relative group">
            {/* Animated Glow behind output */}
            {isLoading && (
              <div className="absolute inset-0 bg-brand-500/5 blur-[100px] animate-pulse rounded-full" />
            )}
            <ContentOutput 
              content={completion} 
              contentType={contentType} 
              isGenerating={isLoading}
              onRegenerate={handleRegenerate}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
