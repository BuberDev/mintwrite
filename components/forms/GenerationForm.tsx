"use client"

import { ContentType, FieldDefinition } from "@/types"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface GenerationFormProps {
  contentType: ContentType
  onSubmit: (data: Record<string, string>) => void
  isLoading: boolean
}

export function GenerationForm({ contentType, onSubmit, isLoading }: GenerationFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simple validation
    const newErrors: Record<string, string> = {}
    contentType.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {contentType.fields.map((field) => (
        <div key={field.name}>
          {field.type === 'select' ? (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-dark-400 ml-1">
                {field.label}
              </label>
              <select
                className="input-field"
                value={formData[field.name] || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                disabled={isLoading}
              >
                <option value="" disabled>{field.placeholder || 'Select an option'}</option>
                {field.options?.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {errors[field.name] && (
                <p className="text-xs text-red-400 ml-1 animate-fade-in">{errors[field.name]}</p>
              )}
            </div>
          ) : field.type === 'textarea' ? (
            <Textarea
              label={field.label}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              hint={field.hint}
              error={errors[field.name]}
              disabled={isLoading}
            />
          ) : (
            <Input
              label={field.label}
              placeholder={field.placeholder}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              error={errors[field.name]}
              disabled={isLoading}
            />
          )}
        </div>
      ))}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
      >
        Generate {contentType.label}
      </Button>
    </form>
  )
}
