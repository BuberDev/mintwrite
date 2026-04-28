"use client"

import { getContentType } from "@/lib/ai/content-types"
import { GenerationForm } from "@/components/forms/GenerationForm"
import { ContentOutput } from "@/components/output/ContentOutput"
import { useState, useEffect, useRef } from "react"
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
import { CreateProjectModal } from "@/components/modals/CreateProjectModal"

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Persistence across re-renders
  const contentRef = useRef("")

  useEffect(() => {
    // Load from cache if exists
    const cached = localStorage.getItem(`mint_cache_${params.type}`)
    if (cached) {
      setGeneratedContent(cached)
      contentRef.current = cached
    }

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
  }, [params.type])

  const handleProjectCreated = (newProject: any) => {
    setProjects(prev => [newProject, ...prev])
    setSelectedProjectId(newProject.id)
    setIsModalOpen(false)
  }

  const handleSubmit = async (context: Record<string, string>) => {
    if (!selectedProjectId) {
      toast.error("Please select a project")
      return
    }

    setIsLoading(true)
    setGeneratedContent("")
    contentRef.current = ""
    setLastContext(context)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProjectId,
          contentTypeId: contentType.id,
          context,
        })
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        contentRef.current += chunk
        setGeneratedContent(contentRef.current)
        // Persistence
        localStorage.setItem(`mint_cache_${params.type}`, contentRef.current)
      }

      toast.success("Content generated!")
      
      // Save to database
      const project = projects.find(p => p.id === selectedProjectId)
      await fetch('/api/generations', {
        method: 'POST',
        body: JSON.stringify({
          projectId: selectedProjectId,
          projectName: project?.name || 'Unknown Project',
          contentTypeId: contentType.id,
          contentTypeLabel: contentType.label,
          context: lastContext,
          output: contentRef.current,
        })
      })

    } catch (err) {
      console.error("[MintWrite] Manual Fetch Error:", err)
      toast.error("Generation failed. Check console.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = () => handleSubmit(lastContext)

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
                <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">Engine Active // {contentType.id.toUpperCase()}</span>
              </div>
              <h1 className="text-4xl font-display font-bold tracking-tight leading-none">{contentType.label}</h1>
              <p className="text-dark-400 text-sm">{contentType.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-dark-900/50 p-6 border border-dark-600 backdrop-blur-sm">
          <div className="space-y-2">
            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Active Context</p>
            {projects.length > 0 ? (
              <select 
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-transparent text-sm font-bold border-none p-0 focus:ring-0 cursor-pointer hover:text-brand-500 transition-colors"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-dark-900 text-white">
                    {p.name} ({p.ticker})
                  </option>
                ))}
              </select>
            ) : (
              <Button onClick={() => setIsModalOpen(true)} variant="ghost" size="sm" className="h-6 px-2 text-[10px] bg-brand-500/10 text-brand-500 hover:bg-brand-500/20">
                + Create Project
              </Button>
            )}
          </div>
          <div className="h-8 w-px bg-dark-700" />
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Auth Level</p>
            <p className="text-sm font-bold uppercase tracking-tighter">Foundational</p>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-7"
        >
          <ContentOutput
            key={generatedContent.length > 0 ? 'has-content' : 'empty'}
            content={generatedContent}
            contentType={contentType}
            isGenerating={isLoading}
            onRegenerate={handleRegenerate}
          />
        </motion.div>
      </div>

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  )
}
