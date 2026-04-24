import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { MINTWRITE_SYSTEM_PROMPT } from '@/lib/ai/prompts/system'
import { getContentType } from '@/lib/ai/content-types'
import { GenerateRequestSchema } from '@/lib/ai/schema'
import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/db/client'
import { getUserTierInfo } from '@/lib/utils/tier'

// Set timeout to 2 minutes as requested
export const maxDuration = 120
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const result = GenerateRequestSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 }
      )
    }

    const { projectId, contentTypeId, context } = result.data
    const { userId } = auth()
    if (!userId) return new Response("Unauthorized", { status: 401 })

    // Fetch real project from DB
    const projectRes = await db.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, userId]
    )

    if (projectRes.rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const project = projectRes.rows[0]
    const contentType = getContentType(contentTypeId)

    // Check tier limits
    const { tier, canGenerate } = await getUserTierInfo(userId)
    
    if (!canGenerate) {
      return NextResponse.json(
        { error: 'Monthly generation limit reached. Upgrade to Pro for unlimited access.' },
        { status: 403 }
      )
    }

    if (contentType.tier === 'pro' && tier === 'free') {
      return NextResponse.json(
        { error: 'This content type is only available for Pro users.' },
        { status: 403 }
      )
    }

    const userPrompt = contentType.buildPrompt(project, context)

    const response = await streamText({
      model: anthropic('claude-3-5-sonnet-20240620'),
      system: MINTWRITE_SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.7,
    })

    return response.toDataStreamResponse()
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}
