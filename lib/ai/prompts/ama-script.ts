import type { Project } from '@/types'

export function buildAmaScriptPrompt(
  project: Project,
  context: Record<string, string>
): string {
  const { amaType, expectedQuestions, toughQuestion } = context

  return `
Write a full AMA (Ask Me Anything) script for the following Web3 project.

PROJECT:
- Name: ${project.name}
- Token: $${project.ticker}
- Category: ${project.category}
- Tagline: ${project.tagline}

AMA TYPE: ${amaType}

EXPECTED QUESTIONS:
${expectedQuestions}

TOUGHEST QUESTION TO PREPARE FOR:
${toughQuestion || 'Not specified'}

REQUIREMENTS:
- Format: Q: [question] followed by A: [full answer]
- Each answer: 3–5 sentences. Specific, credible, no fluff.
- For investor AMAs: emphasise market opportunity, defensibility, tokenomics
- For community AMAs: emphasise utility, roadmap, team commitment, community benefits
- For the tough question (if provided): give a direct, honest answer. Do NOT deflect. Acknowledging challenges builds credibility.
- Do NOT give vague answers like "We will announce soon" or "Stay tuned" — if details aren't known, say "We haven't finalised this yet, but our current thinking is..."
- Where token price or returns are implied, add "(NFA)" inline
- Tone: founder-direct, technically confident, community-warm
- End with a suggested closing statement the founder can use to wrap up the AMA
`.trim()
}
