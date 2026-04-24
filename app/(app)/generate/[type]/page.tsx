"use client"

import { getContentType } from "@/lib/ai/content-types"
import { GenerationForm } from "@/components/forms/GenerationForm"
import { ContentOutput } from "@/components/output/ContentOutput"
import { useState, useEffect } from "react"
import { useCompletion } from "ai/react"
import { toast } from "sonner"
import { ChevronLeft, Sparkles, Wand2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { motion } from "framer-motion"

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
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6"
      >
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-dark-800 border border-dark-600 hover:bg-dark-700 transition-colors">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-[1.5rem] bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-4xl shadow-2xl shadow-brand-500/5">
            {contentType.icon}
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">{contentType.label}</h1>
            <p className="text-dark-300">{contentType.description}</p>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Form Column */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 space-y-8"
        >
          <div className="p-8 rounded-[2.5rem] bg-dark-800/80 border border-dark-600 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-8 border-b border-dark-700 pb-6">
              <div className="h-8 w-8 rounded-lg bg-dark-700 flex items-center justify-center">
                <span className="text-xs font-bold text-dark-300">01</span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-dark-100">
                Provide Context
              </h3>
            </div>
            <GenerationForm 
              contentType={contentType} 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="p-6 rounded-[2rem] bg-brand-500/5 border border-brand-500/10 flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0">
              <Wand2 className="h-5 w-5 text-brand-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-400 mb-1">Senior Designer Tip</h4>
              <p className="text-xs text-dark-300 leading-relaxed">
                Add specific metrics (e.g., "$1.2M TVL", "10k Holders") to make the AI output more authoritative and high-conversion.
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
