import { z } from 'zod'

// ─── Generation output schema ─────────────────────────────────────────────────
//
// The AI streams raw text. After completion, we parse optional metadata
// from the end of the stream if the model includes it.
// The primary output is always plain text content.

export const GenerationMetadataSchema = z.object({
  platform: z.string(),
  characterCount: z.number().int().positive(),
  suggestedHashtags: z.array(z.string()),
  postingTip: z.string(),
})

export type GenerationMetadata = z.infer<typeof GenerationMetadataSchema>

// ─── API request schema ───────────────────────────────────────────────────────

export const GenerateRequestSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
  contentTypeId: z.string().min(1, 'Content type is required'),
  context: z.record(z.string(), z.string()),
  brandVoiceId: z.string().optional(),
})

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>

// ─── Project schemas ──────────────────────────────────────────────────────────

export const ProjectCategorySchema = z.enum([
  'defi',
  'gamefi',
  'dao',
  'rwa',
  'infrastructure',
  'nft',
  'layer2',
])

export const ProjectInputSchema = z.object({
  name: z.string().min(1).max(60),
  ticker: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[A-Z0-9]+$/, 'Ticker must be uppercase letters and numbers only'),
  category: ProjectCategorySchema,
  tagline: z.string().min(10).max(160),
  website: z.string().url().optional().or(z.literal('')),
  twitter: z.string().optional(),
  discord: z.string().optional(),
})

export type ProjectInput = z.infer<typeof ProjectInputSchema>
