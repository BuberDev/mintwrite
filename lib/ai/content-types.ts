import type { ContentType, Project } from '@/types'
import { buildTwitterThreadPrompt } from './prompts/twitter-thread'
import { buildDiscordAnnouncementPrompt } from './prompts/discord-announcement'
import { buildTokenomicsExplainerPrompt } from './prompts/tokenomics-explainer'
import { buildBlogPostPrompt } from './prompts/blog-post'
import { buildCommunityUpdatePrompt } from './prompts/community-update'
import { buildAmaScriptPrompt } from './prompts/ama-script'
import { buildWhitepaperSummaryPrompt } from './prompts/whitepaper-summary'

// ─── Content Type Registry ────────────────────────────────────────────────────
//
// Single source of truth for all content types.
// Adding a new type = adding one entry here. Nothing else changes.
//
// Free tier: twitter-thread, discord-announcement, community-update
// Pro tier:  tokenomics-explainer, blog-post, ama-script, whitepaper-summary

export const CONTENT_TYPES: Record<string, ContentType> = {
  'twitter-thread': {
    id: 'twitter-thread',
    label: 'Twitter / X Thread',
    description: 'Hook-optimised thread for announcements, launches, or updates',
    icon: 'twitter',
    tier: 'free',
    outputLabel: 'Your Twitter Thread',
    outputDescription: 'Each tweet is separated. Copy the full thread or individual tweets.',
    fields: [
      {
        name: 'topic',
        label: 'What is this thread about?',
        type: 'text',
        placeholder: 'e.g. Our token launch on June 15th',
        required: true,
        maxLength: 120,
      },
      {
        name: 'keyPoints',
        label: 'Key points to cover (one per line)',
        type: 'textarea',
        placeholder: 'e.g.\n- 100M total supply\n- 12-month vesting for team\n- DEX listing on Uniswap',
        required: true,
        maxLength: 600,
        hint: 'List 3–5 facts, milestones, or arguments. AI will structure them into a thread.',
      },
      {
        name: 'tone',
        label: 'Tone',
        type: 'select',
        placeholder: '',
        required: true,
        options: ['Technical & credible', 'Community-friendly', 'Investor-focused', 'Educational'],
      },
    ],
    buildPrompt: buildTwitterThreadPrompt,
  },

  'discord-announcement': {
    id: 'discord-announcement',
    label: 'Discord Announcement',
    description: 'Formatted Discord message with emoji, sections, and CTA',
    icon: 'discord',
    tier: 'free',
    outputLabel: 'Your Discord Announcement',
    outputDescription: 'Paste directly into Discord. Formatting uses Discord markdown.',
    fields: [
      {
        name: 'eventType',
        label: 'Type of announcement',
        type: 'select',
        placeholder: '',
        required: true,
        options: [
          'Token launch',
          'Partnership',
          'Product update',
          'AMA event',
          'Airdrop',
          'Governance vote',
          'Milestone achieved',
        ],
      },
      {
        name: 'details',
        label: 'Key details',
        type: 'textarea',
        placeholder:
          'e.g. We are launching on Uniswap on June 15 at 14:00 UTC. Initial price $0.05. Liquidity locked for 1 year.',
        required: true,
        maxLength: 500,
      },
      {
        name: 'callToAction',
        label: 'Call to action',
        type: 'text',
        placeholder: 'e.g. Add liquidity, Vote in the snapshot, Join the AMA',
        required: true,
        maxLength: 100,
      },
    ],
    buildPrompt: buildDiscordAnnouncementPrompt,
  },

  'community-update': {
    id: 'community-update',
    label: 'Weekly Community Update',
    description: 'Weekly project update for Discord, Telegram, or Twitter',
    icon: 'users',
    tier: 'free',
    outputLabel: 'Your Community Update',
    outputDescription: 'Structured weekly update ready for Discord or Telegram.',
    fields: [
      {
        name: 'weekNumber',
        label: 'Week / period',
        type: 'text',
        placeholder: 'e.g. Week 12 · May 2026',
        required: true,
        maxLength: 40,
      },
      {
        name: 'milestones',
        label: 'What was accomplished this week? (one per line)',
        type: 'textarea',
        placeholder:
          'e.g.\n- Smart contract audit completed\n- 500 new Discord members\n- Whitepaper v2 published',
        required: true,
        maxLength: 600,
      },
      {
        name: 'nextWeek',
        label: "What's coming next week?",
        type: 'textarea',
        placeholder: 'e.g.\n- Token generation event\n- Uniswap listing\n- Community AMA',
        required: false,
        maxLength: 400,
      },
    ],
    buildPrompt: buildCommunityUpdatePrompt,
  },

  'tokenomics-explainer': {
    id: 'tokenomics-explainer',
    label: 'Tokenomics Explainer',
    description:
      'Human-readable post explaining your token model to community and investors',
    icon: 'bar-chart',
    tier: 'pro',
    outputLabel: 'Your Tokenomics Explainer',
    outputDescription: 'Ready to post on Medium, Mirror, or your blog. Includes NFA disclaimer.',
    fields: [
      {
        name: 'totalSupply',
        label: 'Total token supply',
        type: 'text',
        placeholder: 'e.g. 100,000,000',
        required: true,
        maxLength: 30,
      },
      {
        name: 'allocationSummary',
        label: 'Token allocation (paste or summarise)',
        type: 'textarea',
        placeholder:
          'e.g.\n- Team: 15% (12-month cliff, 24-month vesting)\n- Investors: 20% (6-month cliff, 18-month vesting)\n- Community: 40% (no lock)\n- Treasury: 25%',
        required: true,
        maxLength: 800,
        hint: 'Paste from your TokenForge AI output or summarise manually.',
      },
      {
        name: 'tokenUtility',
        label: 'What is the token used for?',
        type: 'textarea',
        placeholder:
          'e.g. Governance voting, staking for protocol fees, paying for platform services',
        required: true,
        maxLength: 400,
      },
    ],
    buildPrompt: buildTokenomicsExplainerPrompt,
  },

  'blog-post': {
    id: 'blog-post',
    label: 'Token Launch Blog Post',
    description: '600–900 word Medium-ready article for your token launch',
    icon: 'file-text',
    tier: 'pro',
    outputLabel: 'Your Blog Post',
    outputDescription: 'Formatted for Medium or Mirror. Includes NFA disclaimer.',
    fields: [
      {
        name: 'launchDate',
        label: 'Token launch date',
        type: 'text',
        placeholder: 'e.g. June 15, 2026',
        required: true,
        maxLength: 40,
      },
      {
        name: 'problemSolved',
        label: 'What problem does your project solve?',
        type: 'textarea',
        placeholder:
          'e.g. DeFi liquidity is fragmented across 200+ protocols. We aggregate it into one interface.',
        required: true,
        maxLength: 400,
      },
      {
        name: 'keyMilestones',
        label: 'Key milestones achieved before launch',
        type: 'textarea',
        placeholder: 'e.g. Audit completed, 10K beta users, $2M TVL in testnet',
        required: false,
        maxLength: 400,
      },
    ],
    buildPrompt: buildBlogPostPrompt,
  },

  'ama-script': {
    id: 'ama-script',
    label: 'AMA Script',
    description: 'Full Q&A script with suggested answers for community or investor AMAs',
    icon: 'mic',
    tier: 'pro',
    outputLabel: 'Your AMA Script',
    outputDescription:
      'Prepared answers for your AMA. Edit to match your voice before the session.',
    fields: [
      {
        name: 'amaType',
        label: 'AMA audience',
        type: 'select',
        placeholder: '',
        required: true,
        options: [
          'Community (Discord/Telegram)',
          'Investor (VC/Angel)',
          'Press/Media',
          'Twitter Space',
        ],
      },
      {
        name: 'expectedQuestions',
        label: 'List the questions you expect (one per line)',
        type: 'textarea',
        placeholder:
          'e.g.\n- Why should I buy your token?\n- How is the team compensated?\n- What\'s your roadmap for Q3?',
        required: true,
        maxLength: 800,
        hint: 'List 5–8 questions. AI will generate thorough, credible answers.',
      },
      {
        name: 'toughQuestion',
        label: "What's the hardest question you'll face?",
        type: 'text',
        placeholder: 'e.g. Why did your previous project fail?',
        required: false,
        maxLength: 200,
      },
    ],
    buildPrompt: buildAmaScriptPrompt,
  },

  'whitepaper-summary': {
    id: 'whitepaper-summary',
    label: 'Whitepaper Executive Summary',
    description: '400–600 word executive summary for the opening of your whitepaper',
    icon: 'book-open',
    tier: 'pro',
    outputLabel: 'Your Executive Summary',
    outputDescription:
      'Drop this into the first page of your whitepaper. Edit technical details before publishing.',
    fields: [
      {
        name: 'problemStatement',
        label: 'The problem your project solves',
        type: 'textarea',
        placeholder:
          'e.g. Retail investors have no access to institutional-grade DeFi yield strategies.',
        required: true,
        maxLength: 400,
      },
      {
        name: 'solution',
        label: 'Your solution in 2–3 sentences',
        type: 'textarea',
        placeholder:
          'e.g. We built an automated vault protocol that routes capital to the highest-risk-adjusted yield source on Ethereum and Arbitrum.',
        required: true,
        maxLength: 400,
      },
      {
        name: 'tokenRole',
        label: 'Role of the token in the ecosystem',
        type: 'textarea',
        placeholder:
          'e.g. The $YIELD token governs protocol parameters and captures 30% of protocol revenue via staking.',
        required: true,
        maxLength: 300,
      },
    ],
    buildPrompt: buildWhitepaperSummaryPrompt,
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getContentType(id: string): ContentType {
  const type = CONTENT_TYPES[id]
  if (!type) throw new Error(`Unknown content type: "${id}"`)
  return type
}

export function getFreeContentTypes(): ContentType[] {
  return Object.values(CONTENT_TYPES).filter((t) => t.tier === 'free')
}

export function getAllContentTypes(): ContentType[] {
  return Object.values(CONTENT_TYPES)
}

export function buildUserPrompt(
  contentTypeId: string,
  project: Project,
  context: Record<string, string>
): string {
  const contentType = getContentType(contentTypeId)
  return contentType.buildPrompt(project, context)
}
