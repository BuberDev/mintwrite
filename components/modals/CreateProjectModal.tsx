"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, Rocket, Globe, Twitter, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (project: any) => void
}

const CATEGORIES = [
  { id: 'defi', label: 'DeFi' },
  { id: 'gamefi', label: 'GameFi' },
  { id: 'dao', label: 'DAO' },
  { id: 'rwa', label: 'RWA' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'nft', label: 'NFT' },
  { id: 'layer2', label: 'Layer 2' },
]

export function CreateProjectModal({ isOpen, onClose, onSuccess }: CreateProjectModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    category: "defi",
    tagline: "",
    website: "",
    twitter: "",
    discord: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation for tagline length
    if (formData.tagline.length < 10) {
      toast.error("Tagline must be at least 10 characters for proper AI context.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          ticker: formData.ticker.toUpperCase(), // Ensure uppercase for API
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create project")
      }

      toast.success("Project launched successfully!")
      onSuccess(data)
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to initialize project engine.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 9999 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="relative w-full max-w-xl bg-dark-900 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
            
            <div className="p-10 border-b border-white/5 bg-black/40 flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-brand-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                  <span className="text-[11px] font-mono text-brand-500 uppercase tracking-[0.4em] font-bold">Project Configuration</span>
                </div>
                <h2 className="text-3xl font-display font-bold tracking-tight text-white">New Intelligence Context</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="hover:bg-white/5 rounded-none border border-white/10 h-12 w-12 transition-all"
              >
                <X className="h-6 w-6 text-white/70" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-dark-900/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1 font-bold">Identity Name</label>
                  <Input 
                    placeholder="e.g. Uniswap" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="bg-black/40 border-white/10 focus:border-brand-500/50 h-14 transition-all"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1 font-bold">Ticker Symbol</label>
                  <Input 
                    placeholder="UNI" 
                    value={formData.ticker}
                    onChange={(e) => setFormData(prev => ({ ...prev, ticker: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') }))}
                    required
                    className="bg-black/40 border-white/10 focus:border-brand-500/50 h-14 text-center font-mono font-bold transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1 font-bold">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-black/40 border border-white/10 rounded-none h-14 pl-12 pr-4 text-sm focus:outline-none focus:border-brand-500/50 appearance-none"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-dark-900 text-white">
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1 font-bold">Tagline (min. 10 chars)</label>
                  <Input 
                    placeholder="Decentralized trading protocol..." 
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    required
                    className="bg-black/40 border-white/10 focus:border-brand-500/50 h-14 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">Terminal URL</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input 
                      placeholder="https://..." 
                      className="pl-12 bg-black/20 border-white/5 h-12 text-sm text-white/60"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-mono text-white/40 uppercase tracking-widest ml-1">X Handle</label>
                  <div className="relative">
                    <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                    <Input 
                      placeholder="@handle" 
                      className="pl-12 bg-black/20 border-white/5 h-12 text-sm text-white/60"
                      value={formData.twitter}
                      onChange={(e) => setFormData(prev => ({ ...prev, twitter: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-full h-20 font-black text-[12px] uppercase tracking-[0.4em] shadow-[0_24px_48px_rgba(245,158,11,0.2)] group"
                  isLoading={isLoading}
                >
                  <Rocket className="h-5 w-5 mr-4 transition-transform group-hover:-translate-y-2 group-hover:translate-x-2" />
                  Launch Project Engine
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}
