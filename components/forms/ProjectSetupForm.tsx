"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { ProjectCategory } from "@/types"

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'defi', label: 'DeFi' },
  { value: 'gamefi', label: 'GameFi' },
  { value: 'dao', label: 'DAO' },
  { value: 'rwa', label: 'RWA' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'nft', label: 'NFT' },
  { value: 'layer2', label: 'Layer 2' },
]

export function ProjectSetupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    category: "defi" as ProjectCategory,
    tagline: "",
    website: "",
    twitter: "",
    discord: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to create project")

      toast.success("Project created successfully!")
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Project Name"
            placeholder="e.g. EtherFlow"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Token Ticker"
            placeholder="e.g. FLOW"
            value={formData.ticker}
            onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-dark-400 ml-1">
            Category
          </label>
          <select
            className="input-field"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="One-line Tagline"
          placeholder="e.g. The first yield-bearing stablecoin for institutional LPs"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Website (Optional)"
            type="url"
            placeholder="https://etherflow.fi"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          />
          <Input
            label="Twitter Handle (Optional)"
            placeholder="@EtherFlow_Fi"
            value={formData.twitter}
            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Complete Setup
        </Button>
      </form>
    </Card>
  )
}
