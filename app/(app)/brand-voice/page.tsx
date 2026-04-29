"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Fingerprint, Plus, X, Trash2, Zap, Lock, RefreshCw,
  ChevronDown, ChevronUp, CheckCircle2, Clock, Mic2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { createPortal } from "react-dom"

const TONE_COLORS = [
  "bg-brand-500/10 text-brand-400 border-brand-500/20",
  "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "bg-pink-500/10 text-pink-400 border-pink-500/20",
]

function Chip({ label, index }: { label: string; index: number }) {
  const color = TONE_COLORS[index % TONE_COLORS.length]
  return (
    <span className={cn("text-[9px] font-mono font-bold uppercase tracking-widest border px-2 py-0.5", color)}>
      {label}
    </span>
  )
}

// ─── Create Brand Voice Modal ─────────────────────────────────────────────────

function CreateBrandVoiceModal({
  isOpen,
  onClose,
  projects,
  onCreated,
}: {
  isOpen: boolean
  onClose: () => void
  projects: any[]
  onCreated: (bv: any) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState("")
  const [projectId, setProjectId] = useState("")
  const [sampleText, setSampleText] = useState("")
  const [samples, setSamples] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const addSample = () => {
    const trimmed = sampleText.trim()
    if (!trimmed || trimmed.length < 20) {
      toast.error("Sample must be at least 20 characters")
      return
    }
    setSamples(prev => [...prev, trimmed])
    setSampleText("")
  }

  const removeSample = (i: number) => setSamples(prev => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (samples.length === 0) {
      toast.error("Add at least one content sample")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch("/api/brand-voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, projectId: projectId || null, samples }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success("Brand Voice profile created!")
      onCreated(d)
      onClose()
      setName(""); setProjectId(""); setSamples([])
    } catch (err: any) {
      toast.error(err.message || "Failed to create brand voice")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-2xl bg-dark-900 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />

            <div className="p-8 border-b border-white/5 bg-black/40 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.4em] mb-2">Brand Voice Configuration</p>
                <h2 className="text-2xl font-display font-bold">New Voice Profile</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/5 rounded-none border border-white/10 h-10 w-10">
                <X className="h-5 w-5 text-white/70" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-dark-900/50">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Profile Name</label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Founder Voice" required className="h-12 bg-black/40 border-white/10 focus:border-brand-500/50 rounded-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Link to Project (optional)</label>
                  <select
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    className="w-full h-12 bg-black/40 border border-white/10 px-3 text-sm focus:outline-none focus:border-brand-500/50 rounded-none"
                  >
                    <option value="">Global (all projects)</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.ticker})</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  Content Samples <span className="text-dark-500">({samples.length} added)</span>
                </label>
                <textarea
                  value={sampleText}
                  onChange={e => setSampleText(e.target.value)}
                  placeholder="Paste a tweet, post, or any content you've written. The more authentic, the better the analysis..."
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 p-4 text-sm focus:outline-none focus:border-brand-500/50 resize-none text-white placeholder:text-dark-600"
                />
                <Button type="button" variant="outline" onClick={addSample} className="h-10 px-4 rounded-none border-dark-700 text-xs font-bold uppercase tracking-widest">
                  <Plus className="size-3 mr-2" /> Add Sample
                </Button>
                {samples.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {samples.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 bg-black/30 border border-dark-700 p-3">
                        <span className="text-[9px] font-mono text-dark-500 shrink-0 mt-0.5">[{String(i + 1).padStart(2, "0")}]</span>
                        <p className="text-xs text-dark-300 flex-1 line-clamp-2">{s}</p>
                        <button type="button" onClick={() => removeSample(i)} className="text-dark-600 hover:text-red-400 shrink-0">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full h-14 rounded-none font-black text-[11px] uppercase tracking-[0.3em]">
                <Fingerprint className="size-4 mr-3" /> Create Voice Profile
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BrandVoicePage() {
  const [voices, setVoices] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAgency, setIsAgency] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = async () => {
    try {
      const [voicesRes, projectsRes] = await Promise.all([
        fetch("/api/brand-voice"),
        fetch("/api/projects"),
      ])
      if (voicesRes.status === 403) { setIsAgency(false); return }
      setVoices(await voicesRes.json())
      setProjects(await projectsRes.json())
    } catch { toast.error("Failed to load data") }
    finally { setIsLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleAnalyze = async (id: string) => {
    setAnalyzing(id)
    try {
      const res = await fetch(`/api/brand-voice/${id}/analyze`, { method: "POST" })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success("Voice profile analyzed!")
      await load()
    } catch (err: any) {
      toast.error(err.message || "Analysis failed")
    } finally {
      setAnalyzing(null)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" brand voice?`)) return
    try {
      await fetch(`/api/brand-voice/${id}`, { method: "DELETE" })
      toast.success("Brand Voice deleted")
      setVoices(prev => prev.filter(v => v.id !== id))
    } catch { toast.error("Failed to delete") }
  }

  if (!isAgency) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="p-16 border border-dark-600 bg-black/20">
          <Lock className="size-12 text-dark-500 mx-auto mb-8" />
          <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em] mb-4">Agency Feature</p>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-6">Custom Brand Voice</h1>
          <p className="text-dark-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Train Mint Write on your writing style. Upload samples, get AI analysis, and inject your unique voice into every generation.
          </p>
          <Button asChild variant="primary" className="h-14 px-10 rounded-none font-black text-[10px] uppercase tracking-[0.2em]">
            <Link href="/billing">Upgrade to Agency</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-24 px-4 flex items-center justify-center">
        <RefreshCw className="size-6 text-dark-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-dark-600 pb-12"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-2 bg-brand-500" />
            <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">Agency Tier // AI Voice Training</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight leading-none">Brand Voice</h1>
          <p className="text-dark-400 text-lg max-w-xl">
            Train the AI on your writing style. Every generation reflects your authentic voice.
          </p>
        </div>
        <Button onClick={() => setShowCreate(true)} variant="primary" className="h-14 px-8 rounded-none font-black text-[10px] uppercase tracking-[0.2em] shrink-0">
          <Plus className="size-4 mr-2" /> New Voice Profile
        </Button>
      </motion.header>

      {/* Empty State */}
      {voices.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border border-dashed border-dark-700 p-20 text-center">
          <Mic2 className="size-12 text-dark-600 mx-auto mb-6" />
          <p className="text-dark-300 font-semibold mb-2">No voice profiles yet</p>
          <p className="text-dark-500 text-sm mb-8">Add content samples and let AI extract your unique writing DNA.</p>
          <Button onClick={() => setShowCreate(true)} variant="primary" className="h-12 px-8 rounded-none font-black text-[10px] uppercase tracking-widest">
            <Plus className="size-4 mr-2" /> Create First Profile
          </Button>
        </motion.div>
      )}

      {/* Voice Cards */}
      <div className="space-y-4">
        {voices.map((voice, i) => {
          const analysis = voice.analysis as any
          const isExpanded = expanded === voice.id
          return (
            <motion.div
              key={voice.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border border-dark-600 bg-black/20 hover:border-dark-500 transition-colors"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="size-10 border border-brand-500/20 bg-brand-500/5 flex items-center justify-center">
                    <Fingerprint className="size-5 text-brand-500/60" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-sm">{voice.name}</h3>
                      {voice.isAnalyzed ? (
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                          <CheckCircle2 className="size-2.5 inline mr-1" /> Analyzed
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5">
                          <Clock className="size-2.5 inline mr-1" /> Pending
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-dark-500 font-mono">
                      {voice.samples?.length ?? 0} sample{(voice.samples?.length ?? 0) !== 1 ? "s" : ""}
                      {voice.project ? ` · ${voice.project.name}` : " · Global"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!voice.isAnalyzed && (
                    <Button
                      onClick={() => handleAnalyze(voice.id)}
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-none border-brand-500/30 text-brand-500 hover:bg-brand-500/10 text-[9px] font-black uppercase tracking-widest"
                      isLoading={analyzing === voice.id}
                    >
                      <Zap className="size-3 mr-1.5" /> Analyze
                    </Button>
                  )}
                  {voice.isAnalyzed && (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : voice.id)}
                      className="text-dark-500 hover:text-dark-200 transition-colors p-1"
                    >
                      {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(voice.id, voice.name)}
                    className="text-dark-600 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Analysis */}
              <AnimatePresence>
                {isExpanded && analysis && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-dark-800"
                  >
                    <div className="p-6 space-y-6 bg-black/30">
                      <p className="text-[10px] font-mono text-dark-500 uppercase tracking-widest">Voice DNA Analysis</p>

                      {analysis.summary && (
                        <div className="border-l-2 border-brand-500/30 pl-4">
                          <p className="text-sm text-dark-200 italic">"{analysis.summary}"</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {analysis.tone?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Tone</p>
                            <div className="flex flex-wrap gap-1.5">
                              {analysis.tone.map((t: string, i: number) => <Chip key={t} label={t} index={i} />)}
                            </div>
                          </div>
                        )}
                        {analysis.style?.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Style</p>
                            <div className="flex flex-wrap gap-1.5">
                              {analysis.style.map((s: string, i: number) => <Chip key={s} label={s} index={i + 2} />)}
                            </div>
                          </div>
                        )}
                        {(analysis.formalityLevel || analysis.sentenceLength) && (
                          <div className="space-y-2">
                            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Profile</p>
                            <div className="flex flex-col gap-1.5">
                              {analysis.formalityLevel && <Chip label={analysis.formalityLevel} index={0} />}
                              {analysis.sentenceLength && <Chip label={`${analysis.sentenceLength} sentences`} index={1} />}
                            </div>
                          </div>
                        )}
                      </div>

                      {analysis.keywords?.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Key Vocabulary</p>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.keywords.map((k: string, i: number) => (
                              <span key={k} className="text-[9px] font-mono text-dark-400 bg-dark-900 border border-dark-700 px-2 py-0.5">
                                {k}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleAnalyze(voice.id)}
                          variant="outline"
                          size="sm"
                          isLoading={analyzing === voice.id}
                          className="h-9 px-4 rounded-none border-dark-700 text-[9px] uppercase tracking-widest"
                        >
                          <RefreshCw className="size-3 mr-1.5" /> Re-analyze
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <CreateBrandVoiceModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        projects={projects}
        onCreated={bv => { setVoices(prev => [bv, ...prev]); load() }}
      />
    </div>
  )
}
