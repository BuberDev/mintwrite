// ─── Project ──────────────────────────────────────────────────────────────────

export type ProjectCategory =
  | 'defi'
  | 'gamefi'
  | 'dao'
  | 'rwa'
  | 'infrastructure'
  | 'nft'
  | 'layer2'

export interface Project {
  id: string
  userId: string
  name: string
  ticker: string
  category: ProjectCategory
  tagline: string
  website: string | null
  twitter: string | null
  discord: string | null
  createdAt: Date
  updatedAt: Date
}

export type ProjectInput = Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>

// ─── User & Tiers ─────────────────────────────────────────────────────────────

export type UserTier = 'free' | 'pro' | 'agency'

export interface UserTierInfo {
  tier: UserTier
  generationsUsedThisMonth: number
  generationsLimit: number
  canGenerate: boolean
}

// ─── Content Types ────────────────────────────────────────────────────────────

export type FieldType = 'text' | 'textarea' | 'select'

export interface FieldDefinition {
  name: string
  label: string
  type: FieldType
  placeholder: string
  required: boolean
  maxLength?: number
  options?: string[]
  hint?: string
}

export interface ContentType {
  id: string
  label: string
  description: string
  icon: string
  fields: FieldDefinition[]
  buildPrompt: (project: Project, context: Record<string, string>) => string
  tier: 'free' | 'pro'
  outputLabel: string
  outputDescription: string
}

// ─── Generation ───────────────────────────────────────────────────────────────

export interface Generation {
  id: string
  userId: string
  projectId: string
  projectName: string
  contentTypeId: string
  contentTypeLabel: string
  context: Record<string, string>
  output: string
  createdAt: Date
}

export type GenerationInput = {
  projectId: string
  contentTypeId: string
  context: Record<string, string>
}

// ─── AI Output ────────────────────────────────────────────────────────────────

export interface GenerationMetadata {
  platform: string
  characterCount: number
  suggestedHashtags: string[]
  postingTip: string
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiError {
  error: string
  code?: string
}

export type ApiResponse<T> = T | ApiError

export function isApiError(res: unknown): res is ApiError {
  return typeof res === 'object' && res !== null && 'error' in res
}
