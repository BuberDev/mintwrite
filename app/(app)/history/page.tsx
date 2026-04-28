"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Eye, Calendar, RefreshCw, X, Download } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

export default function HistoryPage() {
  const [generations, setGenerations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedGen, setSelectedGen] = useState<any>(null)

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

  const handleDownload = (gen: any) => {
    const blob = new Blob([gen.output], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const filename = `mintwrite-${gen.projectName}-${gen.contentTypeId}.md`
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Markdown exported")
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
                    <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.2em]">{gen.contentTypeLabel}</p>
                    <h3 className="text-xl font-bold tracking-tight">{gen.projectName}</h3>
                    <p className="text-[10px] text-dark-500 font-mono uppercase">
                      STAMP // {format(new Date(gen.createdAt), 'yyyy.MM.dd HH:mm')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(gen.output)} className="h-10 px-4 rounded-none border border-dark-700 hover:border-brand-500 transition-all text-[10px] font-black uppercase tracking-widest">
                      <Copy className="h-3.5 w-3.5 mr-2" /> Copy Output
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedGen(gen)}
                      className="h-10 px-4 rounded-none border-dark-700 hover:bg-dark-800 text-[10px] font-black uppercase tracking-widest"
                    >
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedGen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGen(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-dark-900 border border-dark-600 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            >
              <div className="p-8 border-b border-dark-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">{selectedGen.contentTypeLabel}</p>
                  <h2 className="text-2xl font-bold mt-1">{selectedGen.projectName} Detail View</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedGen(null)} className="hover:bg-dark-800">
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                {/* Context Section */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-mono text-dark-500 uppercase tracking-widest border-b border-dark-800 pb-2">Synthesis Context</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedGen.context && Object.entries(selectedGen.context).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <p className="text-[9px] font-mono text-dark-600 uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-sm font-medium text-dark-200">{value as string}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Output Section */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between border-b border-dark-800 pb-2">
                    <h4 className="text-[10px] font-mono text-dark-500 uppercase tracking-widest">Engine Output</h4>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleCopy(selectedGen.output)} className="text-[9px] font-bold text-brand-500 uppercase hover:underline">Copy All</button>
                      <button onClick={() => handleDownload(selectedGen)} className="text-[9px] font-bold text-dark-400 uppercase hover:underline flex items-center gap-1">
                        <Download className="h-3 w-3" /> MD
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/40 p-8 border border-dark-800">
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      {selectedGen.output}
                    </p>
                  </div>
                </section>
              </div>

              <div className="p-8 border-t border-dark-800 bg-dark-900/50 flex justify-between items-center">
                <p className="text-[10px] font-mono text-dark-500">
                  TIMESTAMP: {format(new Date(selectedGen.createdAt), 'yyyy.MM.dd HH:mm:ss')}
                </p>
                <Button onClick={() => setSelectedGen(null)} className="bg-brand-500 text-black hover:bg-brand-600 font-bold px-8">
                  Close Ledger
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
