import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db/client"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET() {
  const { userId } = auth()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  try {
    const res = await db.query(
      'SELECT * FROM generations WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    )
    return NextResponse.json(res.rows)
  } catch (error) {
    console.error('Failed to fetch generations:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const { userId } = auth()
  if (!userId) return new Response("Unauthorized", { status: 401 })

  try {
    const { projectId, projectName, contentTypeId, contentTypeLabel, context, output } = await req.json()

    const res = await db.query(
      `INSERT INTO generations (user_id, project_id, project_name, content_type_id, content_type_label, context, output)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, projectId, projectName, contentTypeId, contentTypeLabel, context, output]
    )

    // Increment user's generation count
    await db.query(
      'UPDATE users SET generations_used_this_month = generations_used_this_month + 1 WHERE id = $1',
      [userId]
    )

    return NextResponse.json(res.rows[0])
  } catch (error) {
    console.error('Failed to save generation:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
