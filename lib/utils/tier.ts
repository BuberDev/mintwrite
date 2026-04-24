import { db } from "@/lib/db/client"
import { ContentType, UserTier } from "@/types"

export async function getUserTierInfo(userId: string) {
  const res = await db.query(
    'SELECT tier, generations_used_this_month FROM users WHERE id = $1',
    [userId]
  )

  if (res.rows.length === 0) {
    return {
      tier: 'free' as UserTier,
      generationsUsed: 0,
      generationsLimit: 5,
      canGenerate: true,
      projectLimit: 1,
    }
  }

  const { tier, generations_used_this_month } = res.rows[0]
  
  const limits: Record<UserTier, { gens: number; projects: number }> = {
    free: { gens: 5, projects: 1 },
    pro: { gens: 1000000, projects: 5 }, // Virtually unlimited
    agency: { gens: 1000000, projects: 1000000 },
  }

  const userTier = tier as UserTier
  const limit = limits[userTier]

  return {
    tier: userTier,
    generationsUsed: generations_used_this_month,
    generationsLimit: limit.gens,
    canGenerate: generations_used_this_month < limit.gens,
    projectLimit: limit.projects,
  }
}

export function canAccessContentType(tier: UserTier, contentType: ContentType) {
  if (tier === 'agency' || tier === 'pro') return true
  return contentType.tier === 'free'
}
