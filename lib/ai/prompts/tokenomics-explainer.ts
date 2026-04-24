import type { Project } from '@/types'

export function buildTokenomicsExplainerPrompt(
  project: Project,
  context: Record<string, string>
): string {
  const { totalSupply, allocationSummary, tokenUtility } = context

  return `
Write a tokenomics explainer post for the following Web3 project. This will be published on Mirror or Medium.

PROJECT:
- Name: ${project.name}
- Token: $${project.ticker}
- Category: ${project.category}
- Tagline: ${project.tagline}

TOKEN SUPPLY: ${totalSupply}

ALLOCATION:
${allocationSummary}

TOKEN UTILITY:
${tokenUtility}

REQUIREMENTS:
- Length: 500–700 words
- Structure:
  ## Why Tokenomics Matter
  ## $${project.ticker} Token Supply
  ## How Tokens Are Allocated
  ## Vesting & Lock-up Schedule
  ## What $${project.ticker} Is Used For
  ## What This Means for the Community
- Explain every concept in plain English. If you mention "vesting cliff", explain what that means in parentheses.
- Present allocation percentages and vesting schedules clearly — use a simple list format, not a table
- Explain WHY each allocation is designed the way it is (e.g., "Team tokens vest over 24 months to ensure long-term commitment")
- Highlight any investor-friendly design choices (low TGE unlock, long cliff, community-majority allocation)
- End with the NFA disclaimer: "This article is for informational purposes only and does not constitute financial advice. Always do your own research."
- Tone: educational, credible, community-first
`.trim()
}
