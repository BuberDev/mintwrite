import { db } from "@/lib/db/drizzle"
import { generations, users } from "@/lib/db/schema"
import { NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/session"
import { eq, desc, sql } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  try {
    const results = await db.query.generations.findMany({
      where: eq(generations.userId, userId),
      orderBy: [desc(generations.createdAt)],
    })
    return NextResponse.json(results)
  } catch (error) {
    console.error('Failed to fetch generations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const userId = await getCurrentUserId()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  try {
    const { projectId, projectName, contentTypeId, contentTypeLabel, context, output } = await req.json()

    const [newGeneration] = await db.transaction(async (tx) => {
      const [res] = await tx.insert(generations)
        .values({
          userId,
          projectId,
          projectName,
          contentTypeId,
          contentTypeLabel,
          context,
          output,
        })
        .returning()

      // Increment user's generation count
      await tx.update(users)
        .set({ 
          generationsUsedThisMonth: sql`${users.generationsUsedThisMonth} + 1`,
          updatedAt: new Date()
        })
        .where(eq(users.id, userId))

      return [res]
    })

    return NextResponse.json(newGeneration)
  } catch (error) {
    console.error('Failed to save generation:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
