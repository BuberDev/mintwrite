import type { Project } from '@/types'

export function buildTwitterThreadPrompt(
  project: Project,
  context: Record<string, string>
): string {
  const { topic, keyPoints, tone } = context

  return `
Write a Twitter/X thread for the following Web3 project.

PROJECT:
- Name: ${project.name}
- Token: $${project.ticker}
- Category: ${project.category}
- Tagline: ${project.tagline}

THREAD TOPIC: ${topic}

KEY POINTS TO COVER:
${keyPoints}

TONE: ${tone}

REQUIREMENTS:
- 8 to 12 tweets
- Tweet 1 is a hook — it must make people stop scrolling. Use a bold statement, surprising fact, or direct question. No "Thread 🧵" openers.
- Number every tweet: 1/ 2/ 3/ etc.
- Each tweet must be under 280 characters
- Last tweet is a CTA: what should the reader do next? Follow, join Discord, check the link, etc.
- Separate each tweet with --- on its own line
- Do NOT use "to the moon", "100x", "guaranteed", or any hype language
- Where token price or investment potential is implied, add "NFA" (not financial advice)
- End the thread with the project's Twitter handle if available
`.trim()
}
