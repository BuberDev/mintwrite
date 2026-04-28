import { streamText } from 'ai'
import { MINTWRITE_SYSTEM_PROMPT } from '@/lib/ai/prompts/system'
import { getContentType } from '@/lib/ai/content-types'
import { GenerateRequestSchema } from '@/lib/ai/schema'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db/drizzle'
import { projects } from '@/lib/db/schema'
import { getUserTierInfo } from '@/lib/utils/tier'
import { getCurrentUserId } from '@/lib/auth/session'
import { getOpenRouterModel, isOpenRouterConfigured } from '@/lib/ai/openrouter'
import { eq, and } from 'drizzle-orm'

export const maxDuration = 120
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    // Guard: API key must be present before doing any work
    if (!isOpenRouterConfigured()) {
      return NextResponse.json(
        {
          error:
            'AI generation is not configured. Add OPENROUTER_API_KEY to your environment variables.',
        },
        { status: 503 },
      )
    }

    const json = await req.json()
    const result = GenerateRequestSchema.safeParse(json)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: result.error.format() },
        { status: 400 },
      )
    }

    const { projectId, contentTypeId, context } = result.data
    const userId = await getCurrentUserId()

    if (!userId) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Verify the project belongs to the authenticated user
    const project = await db.query.projects.findFirst({
      where: and(
        eq(projects.id, projectId),
        eq(projects.userId, userId)
      )
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const contentType = getContentType(contentTypeId)

    // Enforce tier limits
    const { tier, canGenerate } = await getUserTierInfo(userId)

    if (!canGenerate) {
      return NextResponse.json(
        { error: 'Monthly generation limit reached. Upgrade to Pro for unlimited access.' },
        { status: 403 },
      )
    }

    if (contentType.tier === 'pro' && tier === 'free') {
      return NextResponse.json(
        { error: 'This content type is only available for Pro users.' },
        { status: 403 },
      )
    }

    const userPrompt = contentType.buildPrompt(project as any, context)

    const response = await streamText({
      model: getOpenRouterModel(),
      system: MINTWRITE_SYSTEM_PROMPT,
      prompt: userPrompt,
      temperature: 0.7,
    })

    return new Response(response.textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('[MintWrite] Generation error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
