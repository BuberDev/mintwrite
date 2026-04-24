import type { Project } from '@/types'

export function buildCommunityUpdatePrompt(
  project: Project,
  context: Record<string, string>
): string {
  const { weekNumber, milestones, nextWeek } = context

  return `
Write a weekly community update for the following Web3 project.

PROJECT:
- Name: ${project.name}
- Token: $${project.ticker}
- Category: ${project.category}

PERIOD: ${weekNumber}

ACCOMPLISHED THIS PERIOD:
${milestones}

COMING UP NEXT:
${nextWeek || 'Not specified — skip the "What\'s Next" section'}

REQUIREMENTS:
- Format for Discord / Telegram (markdown-friendly)
- Structure:
  **📋 ${project.name} — ${weekNumber} Update**

  **What we shipped:**
  (bullet list of milestones)

  **By the numbers:**
  (if metrics are mentioned in milestones, extract them here)

  **What's coming:**
  (only if nextWeek was provided)

  **Community shoutouts:**
  (one line thanking the community — keep it genuine, not corporate)
- Keep it under 250 words
- Use **bold** for section headers
- One emoji per section header maximum
- Tone: transparent, direct, grateful. No corporate PR language.
- The community should feel like insiders, not press release recipients.
`.trim()
}
