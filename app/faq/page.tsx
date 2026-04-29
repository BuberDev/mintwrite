import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'FAQ — Frequently Asked Questions',
    description: 'Answers to the most common questions about Mint Write — the AI Web3 content generation platform for crypto founders.',
    alternates: { canonical: 'https://mintwrite.com/faq' },
}

const faqs = [
    {
        q: 'What exactly does Mint Write generate?',
        a: 'Mint Write generates seven types of Web3-native content: Twitter/X threads (8–12 tweets), Discord announcements, tokenomics explainers, long-form blog posts, AMA scripts, whitepaper summaries, and community updates. Each type is formatted and toned for its specific platform and Web3 audience.',
    },
    {
        q: 'How is this different from ChatGPT or Claude?',
        a: 'Generic AI models lack Web3 context — they confuse TGE with ICO, misstate tokenomics mechanics, and produce content that sounds corporate instead of founder-native. Mint Write is built on a Web3-specific intelligence layer: a deep system prompt trained on DeFi, GameFi, L2, RWA, and DAO content that enforces correct terminology, community tone, and regulatory disclaimers automatically.',
    },
    {
        q: 'Who owns the content I generate?',
        a: 'You do. Mint Write grants you a perpetual, worldwide licence to use, publish, and modify all generated content however you see fit. We do not claim any intellectual property rights over your outputs.',
    },
    {
        q: 'Is this really 100× cheaper than a Web3 agency?',
        a: 'Yes. A reputable Web3 content agency typically charges $3,000–$10,000/month for a content retainer. Mint Write Pro is $49/month with unlimited generations. Even accounting for editing time, the savings are significant.',
    },
    {
        q: 'Which blockchains and ecosystems are supported?',
        a: 'Mint Write is chain-agnostic. The AI is familiar with Ethereum, Solana, BNB Chain, Arbitrum, Optimism, Base, Polygon, Avalanche, Cosmos, Polkadot, and most major EVM-compatible networks. You specify your project\'s chain and the content will reflect it correctly.',
    },
    {
        q: 'How long does generation take?',
        a: 'Most content types are generated in under 60 seconds. The generation streams to your screen in real time, so you see content appearing immediately. Complex outputs like whitepaper summaries may take up to 2 minutes.',
    },
    {
        q: 'Can I regenerate if I don\'t like the output?',
        a: 'Yes. Every output has a Regenerate button. You can tweak your inputs and regenerate as many times as you like. Pro users have unlimited regenerations.',
    },
    {
        q: 'What is a "project profile"?',
        a: 'A project profile stores your blockchain project\'s key details: name, token ticker, category (DeFi/GameFi/RWA/etc.), tagline, website, Twitter handle, and Discord link. The AI uses this context to produce content that sounds like it was written by your own team — not a generic content farm.',
    },
    {
        q: 'Does the Free plan require a credit card?',
        a: 'No. The Free plan is genuinely free — no credit card required. You get 5 generations per month with access to 3 content types and 1 project profile. Upgrade to Pro when you need more.',
    },
    {
        q: 'Can I cancel my subscription at any time?',
        a: 'Yes. You can cancel your subscription at any time via the billing portal in your account settings. You retain access to paid features until the end of your current billing period. No cancellation fees.',
    },
    {
        q: 'What happens to my data if I delete my account?',
        a: 'Your account and all associated content data is deleted within 30 days of account closure. Billing records are retained for 7 years as required by tax law. See our Privacy Policy for full details.',
    },
    {
        q: 'Does Mint Write use my content to train AI models?',
        a: 'No. Your inputs and generated outputs are not used to train AI models. We transmit your prompts to OpenRouter/Anthropic solely to generate your requested output, and we contractually prohibit our AI providers from using your data for model training.',
    },
]

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="text-xs font-mono text-primary uppercase tracking-widest mb-12 inline-block hover:opacity-70 transition-opacity"
                >
                    ← Back to Mint Write
                </Link>

                <div className="mb-16 mt-6">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-4">Knowledge Base</p>
                    <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
                    <p className="text-zinc-400 text-lg">
                        Can't find your answer?{' '}
                        <a href="mailto:support@mintwrite.com" className="text-primary hover:opacity-70 underline">
                            Email us
                        </a>
                        .
                    </p>
                </div>

                <div className="space-y-0 divide-y divide-zinc-800 border border-zinc-800">
                    {faqs.map((item, i) => (
                        <details key={i} className="group">
                            <summary className="flex items-center justify-between gap-4 cursor-pointer p-6 list-none hover:bg-zinc-900 transition-colors">
                                <span className="font-semibold text-zinc-100 text-sm leading-relaxed pr-4">{item.q}</span>
                                <span className="text-primary shrink-0 text-lg font-mono group-open:rotate-45 transition-transform duration-200">+</span>
                            </summary>
                            <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
                                {item.a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="mt-16 p-8 border border-zinc-800 bg-zinc-900/50 text-center">
                    <p className="text-zinc-400 text-sm mb-4">Still have questions?</p>
                    <a
                        href="mailto:support@mintwrite.com"
                        className="inline-block text-xs font-mono uppercase tracking-widest bg-primary text-black font-bold px-6 py-3 hover:opacity-90 transition-opacity"
                    >
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    )
}
