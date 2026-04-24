# MintWrite AI

AI-powered content marketing platform for Web3 projects. Generates Twitter threads, Discord announcements, tokenomics explainers, blog posts, AMA scripts, and whitepaper summaries in under 60 seconds.

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill in your keys (see Environment Variables below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ | Claude API key |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | ✅ | Clerk publishable key |
| `CLERK_SECRET_KEY` | ✅ | Clerk secret key |
| `POSTGRES_URL` | ✅ | Vercel Postgres URL |
| `LEMON_SQUEEZY_API_KEY` | ✅ | Lemon Squeezy API key |
| `LEMON_SQUEEZY_STORE_ID` | ✅ | Your LS store ID |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | ✅ | Webhook signing secret |
| `LEMON_SQUEEZY_PRO_VARIANT_ID` | ✅ | Pro plan ($49/mo) variant ID |
| `LEMON_SQUEEZY_AGENCY_VARIANT_ID` | ✅ | Agency plan ($149/mo) variant ID |

## Database setup

Run the SQL schema in your Vercel Postgres dashboard:

```bash
psql $POSTGRES_URL -f lib/db/schema.sql
```

## Project structure

```
app/
  (auth)/          # Clerk sign-in / sign-up pages
  (app)/           # Protected app routes
    dashboard/     # Content Hub — 7 content type cards
    generate/[type]/ # Generation form + streaming output
    history/       # Past generations
  api/
    generate/      # Streaming AI endpoint (maxDuration: 120)
    projects/      # Project CRUD
    generations/   # Save & list generation history
    webhooks/lemon/ # Lemon Squeezy payment webhooks
  page.tsx         # Landing page
  pricing/         # Pricing table

lib/
  ai/
    content-types.ts  # Registry of all 7 content types (add new types here)
    prompts/          # System prompt + 7 user prompt builders
    schema.ts         # Zod validation schemas
  db/
    client.ts         # Vercel Postgres queries
    schema.sql        # Table definitions
  payments/lemon.ts   # Checkout URLs + webhook verification
  utils/tier.ts       # Tier capability checks

components/
  forms/
    GenerationForm.tsx   # Dynamic form driven by content type registry
    ProjectSetupForm.tsx # One-time project setup
  output/
    ContentOutput.tsx    # Streaming output display
    CopyButton.tsx       # Copy with confirmation feedback
```

## Adding a new content type

1. Create `lib/ai/prompts/your-type.ts` with `buildYourTypePrompt(project, context)`
2. Add the type definition to `CONTENT_TYPES` in `lib/ai/content-types.ts`
3. Add the prompt builder to `PROMPT_BUILDERS` in the same file

Nothing else changes. The UI, API, and form are data-driven from the registry.

## Architecture decisions

**Streaming API** — uses Vercel AI SDK `streamText` with `maxDuration: 120` to avoid Vercel's 10s serverless timeout. The client reads the stream and renders output in real time.

**Content type registry** — all 7 types are defined as data objects, not as code branches. Adding a new type requires zero changes to UI or API.

**Tier checks** — `lib/utils/tier.ts` is the single place where tier capabilities are defined. Server-side checks in API routes; client-side checks for UI gating only.

**CleanCode / SOLID** — single-responsibility modules, no magic strings, explicit return types, no `any`, Zod validation on all external data.

## Related products

- [TokenForge AI](../tokenforge-ai) — Tokenomics design tool (same customer, cross-sell opportunity)
