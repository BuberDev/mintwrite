"use client"

import { ContentType } from "@/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check, RefreshCw, Download } from "lucide-react"
import { useState, useMemo } from "react"
import { toast } from "sonner"

interface ContentOutputProps {
  content: string
  contentType: ContentType
  isGenerating: boolean
  onRegenerate: () => void
}

export function ContentOutput({ content, contentType, isGenerating, onRegenerate }: ContentOutputProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!content) return
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy")
    }
  }

  // Dead-simple formatting logic
  const displayContent = useMemo(() => {
    if (!content) return null

    // Logic for X Threads
    if (contentType.id === 'twitter-thread') {
      const parts = content.split('---').map(p => p.trim()).filter(Boolean)
      
      // If we have distinct parts, show as separate posts
      if (parts.length > 1) {
        return (
          <div className="space-y-6">
            {parts.map((part, i) => (
              <div key={i} className="p-5 bg-white/[0.03] border border-white/10 rounded-sm relative">
                <span className="absolute top-2 right-3 text-[9px] font-mono text-white/30 uppercase tracking-tighter">Post {i + 1}</span>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap pr-10">{part}</p>
              </div>
            ))}
          </div>
        )
      }
    }

    // Default Fallback: Raw text display with guaranteed visibility
    return (
      <div className="p-6 bg-white/[0.03] border border-white/10 rounded-sm">
        <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    )
  }, [content, contentType.id])

  const handleExport = () => {
    if (!content) return
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const filename = `${contentType.id}-${new Date().toISOString().split('T')[0]}.md`
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Markdown file exported")
  }

  return (
    <Card className="h-full flex flex-col min-h-[500px] bg-[#0A0A0A] border-white/10 p-8 relative overflow-hidden">
      {/* Absolute indicator for debug */}
      <div className="absolute top-2 right-10 z-50">
        <span className="text-[8px] font-mono text-white/10">DATA_LEN: {content?.length || 0}</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">{contentType.outputLabel}</h2>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">{contentType.outputDescription}</p>
        </div>
        <div className="flex items-center gap-3">
          {content && (
            <Button variant="outline" size="icon" onClick={handleCopy} className="h-10 w-10 border-white/10 hover:bg-white/5 text-white">
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRegenerate} 
            disabled={isGenerating || !content}
            className={`h-10 w-10 border border-white/5 hover:bg-white/5 text-white ${isGenerating ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isGenerating && !content ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <RefreshCw className="h-10 w-10 animate-spin text-amber-500/50" />
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">Synthesizing...</p>
          </div>
        ) : content ? (
          <div key={content.length}>
             {displayContent}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full border border-dashed border-white/5 rounded-sm bg-white/[0.01]">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/20">Awaiting Signal</p>
          </div>
        )}
      </div>

      {content && (
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[9px] font-mono text-white/40 uppercase">
            <span>{content.length} chars</span>
            <div className="h-1 w-1 bg-white/10 rounded-full" />
            <span>{content.split(/\s+/).length} words</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleExport}
            className="h-9 text-[10px] uppercase font-bold tracking-widest text-white/60 hover:text-white"
          >
            <Download className="h-3.5 w-3.5 mr-2" /> Export MD
          </Button>
        </div>
      )}
    </Card>
  )
}
