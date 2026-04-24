"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Eye, Calendar, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { motion } from "framer-motion"

export default function HistoryPage() {
  const [generations, setGenerations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/generations')
        const data = await res.json()
        setGenerations(data)
      } catch (err) {
        toast.error("Failed to fetch history")
      } finally {
        setIsLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4">
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-dark-600 pb-12"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-2 bg-dark-500" />
            <span className="text-[10px] font-mono text-dark-500 uppercase tracking-[0.3em]">Vault Status // ACTIVE</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight leading-none">Archive Ledger</h1>
          <p className="text-dark-400 text-lg max-w-xl">
            Historical synthesis logs. Review, export, or redeploy previously engineered social architecture.
          </p>
        </div>
        
        <div className="flex items-center gap-6 bg-dark-900/50 p-6 border border-dark-600 backdrop-blur-sm">
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-mono text-dark-500 uppercase tracking-widest">Total Logs</p>
            <p className="text-sm font-bold font-mono">{generations.length}</p>
          </div>
        </div>
      </motion.header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-dark-500">Decrypting Archives...</p>
        </div>
      ) : generations.length === 0 ? (
        <div className="py-40 text-center border border-dashed border-dark-700">
          <p className="text-dark-500 font-mono text-xs uppercase tracking-widest">No entry found in archive.</p>
        </div>
      ) : (
        <div className="divide-y divide-dark-800 border-y border-dark-800">
          {generations.map((gen, i) => (
            <motion.div 
              key={gen.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="py-10 flex flex-col lg:flex-row gap-10 group hover:bg-white/[0.01] transition-colors px-6"
            >
              <div className="lg:w-32 shrink-0">
                <span className="text-[10px] font-mono text-dark-600 tracking-widest">[LOG-0{generations.length - i}]</span>
              </div>
              
              <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.2em]">{gen.content_type_label}</p>
                    <h3 className="text-xl font-bold tracking-tight">{gen.project_name}</h3>
                    <p className="text-[10px] text-dark-500 font-mono uppercase">
                      STAMP // {format(new Date(gen.created_at), 'yyyy.MM.dd HH:mm')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(gen.output)} className="h-10 px-4 rounded-none border border-dark-700 hover:border-brand-500 transition-all text-[10px] font-black uppercase tracking-widest">
                      <Copy className="h-3.5 w-3.5 mr-2" /> Copy Output
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 px-4 rounded-none border-dark-700 hover:bg-dark-800 text-[10px] font-black uppercase tracking-widest">
                      <Eye className="h-3.5 w-3.5 mr-2" /> Detail View
                    </Button>
                  </div>
                </div>

                <div className="bg-dark-900/40 p-8 border-l-2 border-dark-700 group-hover:border-brand-500 transition-all">
                  <p className="text-sm text-dark-300 line-clamp-3 whitespace-pre-wrap leading-relaxed font-medium">
                    {gen.output}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
