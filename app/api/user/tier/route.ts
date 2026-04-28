import { getUserTierInfo } from "@/lib/utils/tier"
import { NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/session"

export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  try {
    const tierInfo = await getUserTierInfo(userId)
    return NextResponse.json(tierInfo)
  } catch (error) {
    console.error('Failed to fetch tier info:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
