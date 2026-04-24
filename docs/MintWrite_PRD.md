# MintWrite AI — Product Requirements Document

> **Version:** 1.0 · **Status:** Draft · **Date:** April 2026 · **CONFIDENTIAL**

| Field | Value |
|---|---|
| **Author** | Dawid Bubernak (Founder) |
| **Version** | 1.0 |
| **Last Updated** | April 2026 |
| **Target Launch** | Q4 2026 (Beta) |
| **Document Type** | Product Requirements Document (PRD) |

---

## 1. Executive Summary

MintWrite AI is a web-based SaaS platform that generates professional marketing and community content for Web3 projects — Twitter/X threads, Discord announcements, whitepaper drafts, tokenomics explainers, blog posts, and AMA scripts — in under 60 seconds.

Web3 founders are technical builders, not copywriters. Generic AI tools like ChatGPT don't understand blockchain terminology, tokenomics vocabulary, community culture, or regulatory disclaimers. The result is either bad content that damages credibility, or expensive marketing agencies at $5,000–$20,000/month.

MintWrite AI fills this gap at **$49/month**.

### The Core Problem

Every Web3 project needs consistent, high-quality content to build community trust, attract investors, and drive token adoption. But:

- Most founders are developers, not marketers
- Generic AI tools generate generic crypto content with wrong terminology and no regulatory awareness
- Web3 marketing agencies charge $5,000–$20,000/month — impossible for early-stage projects
- Writing a single Twitter thread, Discord announcement, and blog post for one launch milestone takes 4–8 hours manually

### The Solution

A founder inputs their project data once (name, token, category, key milestones). MintWrite AI generates a complete, platform-ready content pack in under 60 seconds — with correct Web3 terminology, community tone, and built-in "not financial advice" disclaimers where needed.

**Cross-sell opportunity:** TokenForge AI users can import their tokenomics data directly into MintWrite to generate tokenomics explainer content. Two products, same customer, natural funnel.

---

## 2. Market & Opportunity

### 2.1 Market Size

| Metric | Value |
|---|---|
| Active Web3 projects worldwide | 15,000+ |
| New Web3 projects launching monthly | 2,000–5,000 |
| Average Web3 marketing agency retainer | $5,000–$20,000/month |
| Web3 market size (2026) | $4.97 Billion |
| Web3 market size (2031, projected) | $29.97 Billion |
| Market CAGR | 43.21% |
| MintWrite AI price | $49–$149/month |
| Cost advantage vs. agency | **100x cheaper** |

### 2.2 Why Now

Three forces converge in 2026 that make this the right moment:

1. **AI writing quality crossed the credibility threshold** — Claude 3.5+ can produce content indistinguishable from a senior copywriter when given good domain prompts
2. **Web3 content volume exploded** — X (Twitter) algorithm rewards consistency; projects that post daily outperform those posting weekly by 4–7x in community growth
3. **No AI-native Web3 content tool exists** — ChainGPT is a broad blockchain AI platform (analytics, smart contracts, NFTs), not a content marketing SaaS. Generic tools (Jasper, Copy.ai) have no Web3 knowledge layer

### 2.3 Competitive Landscape

| Competitor | Category | Gap |
|---|---|---|
| ChainGPT | Broad blockchain AI | Not a content tool. No marketing templates. |
| Jasper AI | Generic content | No Web3 knowledge. Wrong terminology. No disclaimers. |
| Copy.ai | Generic content | Same as Jasper. |
| Lunar Strategy | Web3 marketing agency | $5K–$20K/month. Not a product. |
| Coinbound | Web3 marketing agency | Enterprise only. No self-serve. |
| **MintWrite AI** | **AI-native Web3 content** | **Web3-specific. $49/month. 60-second output.** |

**Verdict:** No direct AI-native Web3 content SaaS competitor exists at the SMB price point. The market is served only by expensive agencies and generic tools that require heavy manual editing.

---

## 3. Target Users & Personas

### Persona A — The Web3 Founder

| Field | Detail |
|---|---|
| **Name** | Alex, 26–38 years old |
| **Role** | Co-founder of a DeFi / GameFi / DAO / RWA / L2 project |
| **Technical Level** | Mid-to-senior developer, non-technical in marketing |
| **Pain** | Spends 4–8 hours writing one launch announcement. Posts inconsistently. Community growth is slow. |
| **Goal** | Publish quality content every week without hiring a marketing team |
| **Willingness to Pay** | $49/month without hesitation if it saves 5+ hours per week |
| **Where to Find Them** | Twitter/X, Discord (Web3 accelerators), Alliance DAO, Outlier Ventures |

### Persona B — The Crypto Marketing Manager

| Field | Detail |
|---|---|
| **Name** | Jana, 28–40 years old |
| **Role** | In-house marketing manager at a funded Web3 startup (5–30 employees) |
| **Pain** | Manages content for multiple channels simultaneously. Drafts everything manually. |
| **Goal** | 3x content output without hiring more writers |
| **Willingness to Pay** | $149/month (Agency tier) — budget approved by management |
| **Where to Find Them** | LinkedIn, Web3 marketing communities, Crypto Twitter |

### Persona C — The Web3 Content Agency

| Field | Detail |
|---|---|
| **Name** | Marco's agency, 3–10 person team |
| **Role** | Boutique Web3 marketing agency serving 5–15 clients simultaneously |
| **Pain** | Writing custom content for each client is time-intensive. Margins get squeezed. |
| **Goal** | Deliver 3x more content per client with same team size. Increase margins. |
| **Willingness to Pay** | $149/month — passes cost to clients. ROI immediate. |
| **Where to Find Them** | LinkedIn, Token Engineering Community, Web3 agency networks |

---

## 4. Core User Journey (Happy Path)

The entire experience from landing to first generated content must take **under 5 minutes**.

| Step | What Happens |
|---|---|
| **1. Landing Page** | Founder arrives via Twitter, ProductHunt, or TokenForge AI upsell. Sees demo output. Clicks 'Generate Free'. |
| **2. Sign Up** | Google OAuth or email. No credit card required for free tier. |
| **3. Project Setup** | One-time setup: project name, token ticker, category (DeFi/GameFi/DAO/RWA/Infra), tagline, key links. Saved to profile. |
| **4. Content Request** | User selects a content type (e.g., "Token Launch Thread") and fills 3–5 context fields (milestone, key metrics, target audience). |
| **5. AI Generation** | MintWrite generates platform-ready content in 15–30 seconds. |
| **6. Preview & Edit** | User sees formatted output. Can inline-edit directly in the app. |
| **7. Copy / Export** | One-click copy formatted for Twitter, Discord, or Medium. Pro: export as PDF or download content calendar. |
| **8. Regenerate** | Doesn't like the tone? One click to regenerate with a different angle. |
| **9. Upgrade** | Hits free tier limit (3 generations). Upgrades to Pro ($49/month) via Lemon Squeezy. |

---

## 5. Content Types (MVP)

Each content type maps to a real, recurring pain point for Web3 projects.

### 5.1 IN Scope (MVP) — 7 Content Types

| # | Content Type | Input Required | Output |
|---|---|---|---|
| 1 | **Twitter/X Thread** | Milestone or announcement, 3 key points, tone | 8–12 tweet thread, numbered, hook optimized |
| 2 | **Discord Announcement** | Event or update, target audience (community/investors) | Formatted Discord message with emoji, sections, CTA |
| 3 | **Tokenomics Explainer** | Tokenomics data (manual or import from TokenForge AI) | Human-readable post explaining allocation, vesting, utility |
| 4 | **Token Launch Blog Post** | Project description, token purpose, launch date | 600–900 word Medium-ready article |
| 5 | **Weekly Community Update** | 3–5 milestone bullet points, week number | Discord/Telegram weekly update post |
| 6 | **AMA Script** | Topic, audience type (community/investor/press), 5 expected questions | Full Q&A script with suggested answers |
| 7 | **Whitepaper Executive Summary** | Project description, problem, solution, token role | 400–600 word executive summary section |

### 5.2 OUT of Scope (Post-MVP)

- Full whitepaper generation (v2 — complex, 20+ sections)
- Email newsletter generation
- LinkedIn post generator
- Multi-language support
- Scheduled posting / social media integrations (Zapier-level: v3)
- Content calendar builder (v2)
- Brand voice training (fine-tuning on user's past content)
- Team collaboration / approval workflows

---

## 6. Technical Architecture

### 6.1 Tech Stack

Identical to TokenForge AI — zero new infrastructure to learn, fast to ship.

| Layer | Technology + Rationale |
|---|---|
| **Frontend** | Next.js 14 + Tailwind CSS — dark theme, Vercel-native, SSR |
| **Backend** | Next.js API Routes — no separate server for MVP |
| **AI Engine** | Claude 3.5 Sonnet API — best long-form writing quality |
| **Auth** | Clerk — Google OAuth + email, free up to 10K MAU |
| **Payments** | Lemon Squeezy — EU VAT handling, webhook support |
| **Database** | Vercel Postgres — store projects, generation history, user tiers |
| **Hosting** | Vercel — free tier, auto-deploy from GitHub |

### 6.2 AI Prompt Architecture

MintWrite uses a two-layer prompt system — same pattern as TokenForge AI, different domain knowledge.

**System Prompt encodes:**
- Web3 content best practices (hook structures, thread formatting, Discord markdown)
- Correct blockchain/crypto terminology (TVL, TGE, vesting cliff, epoch, DAO governance, etc.)
- Platform-specific formatting rules (Twitter character limits, Discord markdown, Medium structure)
- Regulatory awareness: auto-insert "not financial advice" disclaimers where appropriate
- Tone calibration: technical credibility + community warmth, never hype/pump language
- Common failure patterns to avoid: overpromising, vague utility claims, missing CTAs

**User Prompt is dynamically built from:**
- Project profile (name, ticker, category, tagline)
- Content type selected
- Context fields filled for that specific generation
- Optional: imported tokenomics data from TokenForge AI

**Output format:**
- Plain text with platform-appropriate formatting
- Metadata: suggested posting time, recommended hashtags, character count
- For Twitter: individual tweet array with character counts per tweet

### 6.3 TokenForge AI Integration

Users who also have a TokenForge AI account can connect the two:

1. On MintWrite project setup, add optional "Import from TokenForge" button
2. On click: call TokenForge API (or allow JSON paste) to pull `AllocationItem[]` and `VestingEntry[]`
3. Pre-fill "Tokenomics Explainer" and "Token Launch Blog Post" context fields automatically
4. Cross-sell prompt: TokenForge free tier users see "Generate content for your tokenomics" CTA after viewing results

---

## 7. UX/UI Design Principles

### 7.1 Design Rules (Non-Negotiable)

- **Dark mode default** — Web3 audience expectation
- **Output first** — the generated content is the hero of every screen. UI is minimal chrome around it
- **One action per screen** — don't show all 7 content types at once; guide through selection
- **Copy button is always visible** — the primary job is to copy and paste content; make it frictionless
- **Regenerate is one click** — no form re-fill to try a different angle
- **Mobile-responsive** — founders check results on phone

### 7.2 Color & Brand

Differentiated from TokenForge AI to feel like a separate product, but same design system:

| Element | TokenForge AI | MintWrite AI |
|---|---|---|
| Primary accent | Purple `#6C63FF` | Teal `#00D4AA` |
| Background | `#0a0c1a` (dark navy) | `#080f17` (dark slate) |
| Secondary | Dark cards on dark bg | Same pattern |
| Typography | Inter / system-ui | Same |

### 7.3 Key Screens (MVP)

| Screen | Purpose |
|---|---|
| **Landing Page** | Hero with live demo output + pricing + "Built by the TokenForge team" trust signal |
| **Project Setup** | One-time form: project name, ticker, category, tagline, links. Saved permanently. |
| **Content Hub** | Grid of 7 content type cards. Select one to generate. |
| **Generation Form** | 3–5 context fields specific to chosen content type. Simple, focused. |
| **Output View** | Generated content with copy button, character count, regenerate button, and edit-in-place. |
| **History** | List of past generations. Re-open, copy, or regenerate any previous output. |
| **Pricing Page** | 3 tiers. Free / Pro $49 / Agency $149. Annual discount toggle. |

---

## 8. Pricing & Business Model

### Tiers

| | Free | Pro *(Recommended)* | Agency |
|---|---|---|---|
| **Price** | $0/month | $49/month or $399/year | $149/month or $1,199/year |
| **Generations/month** | 5 total | Unlimited | Unlimited |
| **Content Types** | 3 of 7 | All 7 | All 7 |
| **Generation History** | Last 5 | Unlimited | Unlimited |
| **Export (PDF / Markdown)** | ✗ | ✓ | ✓ |
| **TokenForge AI Import** | ✗ | ✓ | ✓ |
| **Multiple Projects** | 1 | 5 | Unlimited |
| **Regenerations per output** | 1 | Unlimited | Unlimited |
| **Purpose** | Lead generation | Primary revenue driver | Agencies & in-house teams |

### Revenue Projections (Conservative)

| Timeline | Users | Est. MRR |
|---|---|---|
| Month 1 (soft launch to TokenForge users) | 10 Pro | ~$490 |
| Month 3 | 40 Pro + 5 Agency | ~$2,705 |
| Month 6 | 100 Pro + 15 Agency | ~$7,135 |
| Month 12 | 250 Pro + 35 Agency | ~$17,465 |
| Month 18 | 500 Pro + 70 Agency | ~$34,950 |

### Cross-Sell Economics

TokenForge AI funnels directly into MintWrite AI — same customer, adjacent pain point. If TokenForge reaches 150 Pro users (Month 12 target), and 30% convert to MintWrite Pro, that's 45 paying customers **before a single marketing dollar is spent on MintWrite**.

---

## 9. Go-To-Market Strategy

### Phase 0 — Pre-Launch: TokenForge Funnel (Week 1–2)

Before any public marketing, activate the existing TokenForge AI audience:

- Email all TokenForge beta users: *"You've designed your tokenomics — now let AI write your launch content"*
- Add MintWrite upsell banner on TokenForge results page
- Offer TokenForge Pro users 30-day free MintWrite Pro trial

This should generate the first 10–20 paying users with zero acquisition cost.

### Phase 1 — Beta (Week 3–4): 20–50 Users

- Twitter/X thread: *"I built an AI that writes Web3 content with correct crypto terminology — here's why generic AI tools get it wrong"*
- Post in same Web3 communities as TokenForge: Token Engineering Community Discord, Alliance DAO, Outlier Ventures
- Offer free Pro access to 10 Web3 founders in exchange for feedback and a testimonial

### Phase 2 — Launch (Week 5–6): ProductHunt + Content Push

- ProductHunt launch (Tuesday morning UTC, same playbook as TokenForge)
- Show side-by-side: *"ChatGPT wrote this tokenomics explainer vs MintWrite AI wrote this"* — let quality speak
- Reddit: r/CryptoStartups, r/ethdev — educational threads about Web3 content marketing
- 60-second demo video: from blank project to complete Twitter thread in real time

### Phase 3 — Growth (Month 2+): SEO + Partnerships

- SEO keywords: *"Web3 content generator"*, *"crypto Twitter thread writer"*, *"Discord announcement generator crypto"*, *"tokenomics explainer template"*
- Partner with Web3 accelerators (same targets as TokenForge): free Agency access for accelerator cohorts
- Affiliate: 20% recurring for referrals (same affiliate program as TokenForge — one dashboard, two products)

---

## 10. Development Timeline

Based on 4–8 hours per week, parallel to TokenForge AI maintenance. MintWrite is architecturally simpler than TokenForge (no complex validation logic, no charts) — MVP is faster to ship.

| Week | Deliverable |
|---|---|
| **Week 1** | Project setup. Reuse TokenForge scaffold. Configure new brand colors. Core prompt system: 7 system prompts (one per content type) + dynamic user prompt builder. |
| **Week 2** | Project profile form + storage. Content Hub screen (7 type cards). Generation form per type (3–5 fields each). |
| **Week 3** | Output view: formatted display, copy button, regenerate, inline edit. Generation history (list + re-open). |
| **Week 4** | Auth (Clerk, reuse TokenForge config). Database: users + projects + generations tables. Free tier generation counter. |
| **Week 5** | Payments (Lemon Squeezy). Pro tier gating: unlimited generations, all content types, history, export. |
| **Week 6** | TokenForge AI import integration. Landing page. Pricing page. Mobile responsiveness polish. |
| **Week 7** | Beta testing with 5–10 Web3 founders from TokenForge network. Bug fixes. Collect feedback. |
| **Week 8** | ProductHunt preparation + launch. Twitter launch thread. Reddit posts. |

---

## 11. Success Metrics (KPIs)

Reviewed monthly. These are go/no-go signals, not vanity metrics.

| Metric | Target (Month 3) |
|---|---|
| Monthly Active Users | 60+ |
| Free → Pro Conversion Rate | > 10% |
| MRR | > $2,000 |
| Monthly Churn Rate | < 7% |
| NPS Score | > 45 |
| Avg. Generations per Active User/Month | > 8 |
| TokenForge → MintWrite Cross-sell Rate | > 25% |

### Kill Criteria

> If MRR < $500 after 3 months of active marketing → **pivot or kill**.
>
> If free-to-paid conversion < 4% after 80 free signups → pricing or product problem, investigate.
>
> If avg. generations per active user < 4/month → content quality or relevance problem.
>
> If TokenForge cross-sell rate < 10% → the products aren't as complementary as assumed.

---

## 12. Risk Register

| Risk | Probability | Mitigation |
|---|---|---|
| AI content quality not good enough vs. human writer | Medium | Invest heavily in prompt engineering; launch with human review option |
| Web3 market downturn reduces new projects | Medium | Shift focus to Persona C (agencies) — they serve existing projects regardless of market |
| Generic AI tools (ChatGPT, Claude direct) good enough for users | Medium–High | Differentiate on Web3 specificity, speed, templates, and project memory — not raw writing ability |
| TokenForge cross-sell doesn't materialise | Low–Medium | Run independent acquisition from day 1; don't depend solely on TokenForge funnel |
| Regulatory crackdown on AI-generated crypto content | Low | Built-in disclaimers; content is informational, not financial advice |

---

## 13. Product Synergy Map

MintWrite AI is product #2 in a growing Web3 founder toolkit. The long-term vision:

```
TokenForge AI         →    Design your tokenomics
MintWrite AI       →    Write your launch content
[Future: AuditPrep]   →    Prepare your smart contracts for audit
[Future: DeckForge]   →    Build your investor pitch deck
```

Each product targets the same customer at a different stage of their project lifecycle. One login. One brand ecosystem. Higher LTV per customer.

---

*MintWrite AI · PRD v1.0 · April 2026 · CONFIDENTIAL*
