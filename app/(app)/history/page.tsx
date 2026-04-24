"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Copy, Eye, Calendar, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

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
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Generation History</h1>
        <p className="text-dark-400 mt-2">Access and reuse your past generated content.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="h-8 w-8 animate-spin text-brand-500" />
        </div>
      ) : generations.length === 0 ? (
        <Card variant="glass" className="py-20 text-center">
          <p className="text-dark-500">No generations yet. Start by creating some content!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {generations.map((gen) => (
            <Card key={gen.id} className="p-0 overflow-hidden border-dark-600 hover:border-dark-400 transition-colors">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-dark-700 flex items-center justify-center text-xl">
                      {/* Would need a lookup for icon based on typeId */}
                      ✨
                    </div>
                    <div>
                      <h3 className="font-bold">{gen.content_type_label}</h3>
                      <p className="text-xs text-dark-500 flex items-center gap-1.5 mt-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(gen.created_at), 'MMM d, yyyy • h:mm a')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="free" className="bg-dark-800">{gen.project_name}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleCopy(gen.output)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="secondary" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-dark-900/50 rounded-xl p-4 border border-dark-700">
                  <p className="text-sm text-dark-300 line-clamp-3 whitespace-pre-wrap">
                    {gen.output}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
