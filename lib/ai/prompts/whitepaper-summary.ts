import type { Project } from '@/types'

export function buildWhitepaperSummaryPrompt(
  project: Project,
  context: Record<string, string>
): string {
  const { problemStatement, solution, tokenRole } = context

  return `
Write the Executive Summary section of a whitepaper for the following Web3 project.

PROJECT:
- Name: ${project.name}
- Token: $${project.ticker}
- Category: ${project.category}
- Tagline: ${project.tagline}

THE PROBLEM:
${problemStatement}

THE SOLUTION:
${solution}

THE TOKEN'S ROLE:
${tokenRole}

REQUIREMENTS:
- Length: 400–600 words
- This is the first thing investors and technical reviewers will read — it must be precise and compelling
- Structure:
  ## Executive Summary
  **Abstract** (2–3 sentence technical summary)
  **The Problem** (paragraph)
  **Our Approach** (paragraph)
  **The ${project.name} Protocol** (paragraph — technical but accessible)
  **The $${project.ticker} Token** (paragraph — role in ecosystem, not price speculation)
  **Conclusion** (1–2 sentences)
- Tone: formal, academic-adjacent but readable. Like a well-written YC application, not a marketing brochure.
- Avoid: marketing superlatives, forward-looking price statements, unsubstantiated claims
- Include: specific technical mechanisms if mentioned in the solution, clear problem quantification if possible
- End the executive summary section (NOT the full whitepaper) — this is one section, not the whole document
`.trim()
}
