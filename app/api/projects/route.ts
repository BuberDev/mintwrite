import { db } from "@/lib/db/drizzle"
import { projects, users } from "@/lib/db/schema"
import { ProjectInputSchema } from "@/lib/ai/schema"
import { NextResponse } from "next/server"
import { getCurrentAuth, getCurrentUserId } from "@/lib/auth/session"
import { eq, desc } from "drizzle-orm"

export const dynamic = 'force-dynamic'

export async function GET() {
  const userId = await getCurrentUserId()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  try {
    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, userId),
      orderBy: [desc(projects.createdAt)],
    })
    return NextResponse.json(userProjects)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const auth = await getCurrentAuth()
  const userId = auth?.user.id
  const user = auth?.user
  if (!userId || !user) return new Response("Unauthorized", { status: 401 })

  try {
    const json = await req.json()
    const result = ProjectInputSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 })
    }

    // Ensure user exists in our DB (Drizzle style)
    await db.insert(users)
      .values({
        id: userId,
        email: user.email,
        emailNormalized: user.email.toLowerCase(),
        displayName: user.displayName || user.email.split('@')[0],
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { 
          email: user.email,
          updatedAt: new Date()
        }
      })

    const { name, ticker, category, tagline, website, twitter, discord } = result.data

    const [newProject] = await db.insert(projects)
      .values({
        userId,
        name,
        ticker,
        category,
        tagline,
        website,
        twitter,
        discord,
      })
      .returning()

    return NextResponse.json(newProject)
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
