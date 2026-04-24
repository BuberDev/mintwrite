import type { Project } from '@/types'

export function buildDiscordAnnouncementPrompt(
  project: Project,
  context: Record<string, string>
): string {
  const { eventType, details, callToAction } = context

  return `
Write a Discord announcement for the following Web3 project.

PROJECT:
- Name: ${project.name}
- Token: $${project.ticker}
- Category: ${project.category}
- Tagline: ${project.tagline}

ANNOUNCEMENT TYPE: ${eventType}

DETAILS:
${details}

CALL TO ACTION: ${callToAction}

REQUIREMENTS:
- Use Discord markdown formatting: **bold** for section headers, > for key callouts, - for bullet points
- Start with a relevant emoji that matches the announcement type (🚀 for launch, 🤝 for partnership, 📢 for update, etc.)
- Structure: Opening hook → What's happening → Key details (bullets) → Why it matters → Call to action
- Keep total length between 150–300 words — Discord readers scan, not read
- Include a clear timestamp or date if relevant
- End with the call to action in bold
- Tone: direct, community-friendly, zero corporate jargon
- Do NOT use excessive emoji — max 3–4 total
`.trim()
}
