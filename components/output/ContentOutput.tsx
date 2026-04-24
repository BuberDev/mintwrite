"use client"

import { ContentType } from "@/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Copy, Check, RefreshCw, Download } from "lucide-react"
import { useState } from "react"
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
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success("Content copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy content")
    }
  }

  const renderFormattedContent = () => {
    if (!content) return null

    // For Twitter threads, split by ---
    if (contentType.id === 'twitter-thread') {
      const tweets = content.split('---').filter(t => t.trim())
      return (
        <div className="space-y-4">
          {tweets.map((tweet, i) => (
            <div key={i} className="bg-dark-900/50 rounded-none p-4 border border-dark-600 relative group">
              <span className="absolute top-4 right-4 text-[10px] font-bold text-dark-500 uppercase">
                Tweet {i + 1}
              </span>
              <p className="whitespace-pre-wrap text-sm leading-relaxed pr-12">
                {tweet.trim()}
              </p>
            </div>
          ))}
        </div>
      )
    }

    // Default markdown/plain text display
    return (
      <div className="bg-dark-900/50 rounded-none p-6 border border-dark-600 prose prose-invert max-w-none">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {content}
        </p>
      </div>
    )
  }

  return (
    <Card variant="glass-elevated" className="h-full flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold">{contentType.outputLabel}</h2>
          <p className="text-sm text-dark-400">{contentType.outputDescription}</p>
        </div>
        <div className="flex items-center gap-2">
          {content && (
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-brand-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onRegenerate} 
            disabled={isGenerating || !content}
            className={isGenerating ? 'animate-spin' : ''}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isGenerating && !content ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-dark-500">
            <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
            <p className="text-sm font-medium animate-pulse">AI is crafting your content...</p>
          </div>
        ) : content ? (
          renderFormattedContent()
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-dark-500 border-2 border-dashed border-dark-700 rounded-none">
            <p className="text-sm">Generated content will appear here</p>
          </div>
        )}
      </div>

      {content && (
        <div className="mt-6 flex items-center justify-between pt-6 border-t border-dark-600">
          <div className="text-[10px] font-bold text-dark-500 uppercase tracking-widest">
            {content.length} Characters • {content.split(/\s+/).length} Words
          </div>
          <Button variant="ghost" size="sm" className="gap-2 text-xs">
            <Download className="h-3 w-3" />
            Export as MD
          </Button>
        </div>
      )}
    </Card>
  )
}
