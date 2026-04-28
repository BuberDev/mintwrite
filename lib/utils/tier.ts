import { db } from "@/lib/db/drizzle"
import { users } from "@/lib/db/schema"
import { ContentType, UserTier } from "@/types"
import { eq } from "drizzle-orm"

export async function getUserTierInfo(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      tier: true,
      generationsUsedThisMonth: true,
    }
  })

  if (!user) {
    return {
      tier: 'free' as UserTier,
      generationsUsed: 0,
      generationsLimit: 5,
      canGenerate: true,
      projectLimit: 1,
    }
  }

  const limits: Record<UserTier | string, { gens: number; projects: number }> = {
    free: { gens: 5, projects: 1 },
    pro: { gens: 10_000_000, projects: 5 },
    agency: { gens: 10_000_000, projects: 10_000_000 },
  }

  const userTier = user.tier
  const limit = limits[userTier] || limits.free

  return {
    tier: userTier as UserTier,
    generationsUsed: user.generationsUsedThisMonth,
    generationsLimit: limit.gens,
    canGenerate: user.generationsUsedThisMonth < limit.gens, // BYPASS FOR TESTING: later user.generationsUsedThisMonth < limit.gens
    projectLimit: limit.projects,
  }
}

export function canAccessContentType(tier: UserTier | string, contentType: ContentType) {
  if (tier === 'agency' || tier === 'pro') return true;
  return contentType.tier === 'free';
}

