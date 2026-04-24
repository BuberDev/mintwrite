import type { Project } from '@/types'

export function buildBlogPostPrompt(
  project: Project,
  context: Record<string, string>
): string {
  const { launchDate, problemSolved, keyMilestones } = context

  return `
Write a token launch blog post for the following Web3 project. This will be published on Medium or Mirror.

PROJECT:
- Name: ${project.name}
- Token: $${project.ticker}
- Category: ${project.category}
- Tagline: ${project.tagline}
- Launch date: ${launchDate}

THE PROBLEM SOLVED:
${problemSolved}

KEY MILESTONES BEFORE LAUNCH:
${keyMilestones || 'Not provided — focus on the problem/solution narrative'}

REQUIREMENTS:
- Length: 650–900 words
- Structure:
  ## The Problem (no jargon in the opening — accessible to crypto newcomers)
  ## Our Solution
  ## How It Works (technical but readable)
  ## The $${project.ticker} Token
  ## What We've Built So Far
  ## What's Next: Launch on ${launchDate}
  ## Join Us
- Opening paragraph: describe the problem in human terms, not crypto terms. Make a non-crypto person understand why this matters.
- Do NOT start with "In the world of DeFi..." or "Blockchain is revolutionizing..." — these are clichés
- Use concrete numbers and facts wherever possible. Vague claims destroy credibility.
- End with a clear call to action: where to follow, join, or participate
- Include NFA disclaimer at the end: "This is not financial advice. $${project.ticker} is a utility token. Always do your own research."
- Tone: founder's authentic voice — excited but grounded, technical but human
`.trim()
}
