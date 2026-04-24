import { auth, currentUser } from "@clerk/nextjs/server"
import { db, getOrCreateUser } from "@/lib/db/client"
import { ProjectInputSchema } from "@/lib/ai/schema"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId } = auth()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  try {
    const res = await db.query(
      'SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return NextResponse.json(res.rows)
  } catch (error) {
    console.error('Failed to fetch projects:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { userId } = auth()
  const user = await currentUser()
  if (!userId || !user) return new Response("Unauthorized", { status: 401 })

  try {
    const json = await req.json()
    const result = ProjectInputSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 })
    }

    // Ensure user exists in our DB
    await getOrCreateUser(userId, user.emailAddresses[0].emailAddress)

    const { name, ticker, category, tagline, website, twitter, discord } = result.data

    const res = await db.query(
      `INSERT INTO projects (user_id, name, ticker, category, tagline, website, twitter, discord)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [userId, name, ticker, category, tagline, website, twitter, discord]
    )

    return NextResponse.json(res.rows[0])
  } catch (error) {
    console.error('Failed to create project:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
