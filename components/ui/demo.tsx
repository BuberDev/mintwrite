'use client'

import React from 'react'
import { XIcon, MessagesSquare, BarChart3, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const EXAMPLES = [
    {
        id: 'twitter',
        label: 'X Thread',
        icon: XIcon,
        code: '01',
        content: [
            "🧵 We've been building in silence. Today we break it.\n\nIntroducing $PROTO — a DeFi primitive that eliminates impermanent loss at the protocol level. Here's how it works: 1/8",
            "The problem with existing AMMs: liquidity providers lose value during volatile periods. This \"impermanent loss\" has drained billions from LPs since Uniswap v2 launched.\n\nProtocol-level IL protection changes this entirely. 2/8",
            "PROTO's mechanism: dual-reserve architecture + dynamic fee rebalancing.\n\nWhen price moves >5% in 1hr, the protocol automatically hedges LP positions using a dedicated insurance reserve funded by protocol fees.\n\nNo governance. No manual claims. 3/8",
            "Tokenomics (100M $PROTO total supply):\n• 40% — protocol-owned liquidity\n• 25% — team (24mo cliff, 36mo linear vest)\n• 20% — ecosystem grants\n• 15% — public TGE\n\nNo VC allocation. Community-first. 4/8",
        ],
    },
    {
        id: 'discord',
        label: 'Discord',
        icon: MessagesSquare,
        code: '02',
        content: [
            `**📢 PROTO Protocol — TGE Announcement**\n\n> The wait is over. $PROTO goes live on June 15th.\n\n**What's happening:**\n• Public TGE on Uniswap v3 at 14:00 UTC\n• Initial liquidity: $500K protocol-owned\n• Starting price: $0.05 per $PROTO\n\n**How to participate:**\n1. Bridge ETH to Arbitrum\n2. Visit app.proto.xyz at 14:00 UTC\n3. Connect wallet — no whitelist required\n\n**⚠️ Reminder:** This is not financial advice. DYOR. Beware of scam links — only use app.proto.xyz\n\n📚 Full tokenomics: docs.proto.xyz/tokenomics\n🐦 Follow for live updates: @ProtoProtocol`,
        ],
    },
    {
        id: 'tokenomics',
        label: 'Tokenomics',
        icon: BarChart3,
        code: '03',
        content: [
            `## $PROTO Tokenomics Overview\n\n**Total Supply:** 100,000,000 PROTO (hard cap, no minting function)\n\n**Distribution:**\n\n| Allocation | % | Vesting |\n|---|---|---|\n| Protocol-Owned Liquidity | 40% | Locked 24mo, then linearly released over 12mo |\n| Team & Advisors | 25% | 12mo cliff + 36mo linear vesting |\n| Ecosystem Grants | 20% | 48mo emissions schedule, DAO-governed |\n| Public TGE | 15% | Unlocked at TGE |\n\n**Emission model:** Deflationary. 0.1% of every swap fee is used for token buyback-and-burn. At current projected TVL ($50M), estimated annual burn rate: ~120,000 PROTO.\n\n**Circulating supply at TGE:** 15,000,000 PROTO (15% of total)`,
        ],
    },
]

export function Demo() {
    const [active, setActive] = React.useState(0)

    const example = EXAMPLES[active]
    const Icon = example.icon

    return (
        <section id="demo" className="py-32 relative border-t border-white/5 bg-zinc-950 text-white">
            <div className="mx-auto max-w-7xl px-6">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary mb-4">Live Output Preview</p>
                    <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-6">
                        See what gets <span className="text-primary italic">generated.</span>
                    </h2>
                    <p className="text-zinc-400 text-sm max-w-xl mx-auto">
                        Real example outputs from a fictional DeFi project. No prompt engineering required — just fill in your project details.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Tab selector */}
                    <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2">
                        {EXAMPLES.map((ex, i) => {
                            const TabIcon = ex.icon
                            return (
                                <button
                                    key={ex.id}
                                    onClick={() => setActive(i)}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 text-left border transition-all duration-200 w-full',
                                        active === i
                                            ? 'border-primary bg-primary/10 text-white'
                                            : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
                                    )}
                                >
                                    <TabIcon className="h-4 w-4 shrink-0" />
                                    <span className="text-xs font-mono uppercase tracking-widest">{ex.label}</span>
                                </button>
                            )
                        })}

                        <div className="hidden lg:block mt-8 space-y-3 border-t border-white/10 pt-6">
                            {['Web3-native terminology', 'Regulatory disclaimers', 'Platform formatting', 'No hallucinations'].map(f => (
                                <div key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                                    <Check className="h-3 w-3 text-primary shrink-0" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Output panel */}
                    <div className="lg:col-span-9">
                        <div className="border border-white/10 bg-black/40 backdrop-blur-sm">
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <Icon className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{example.label} Output</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-mono text-zinc-600 uppercase">Generated in 4.2s</span>
                                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4 min-h-[320px]">
                                {example.content.map((block, i) => (
                                    <div key={block.slice(0, 30)} className="group relative">
                                        {example.id === 'twitter' && (
                                            <span className="absolute -top-1 -left-1 text-[9px] font-mono text-primary/40">
                                                [{i + 1}/{example.content.length}]
                                            </span>
                                        )}
                                        <pre className={cn(
                                            "text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans",
                                            example.id === 'twitter' && "pl-6 pb-2 border-b border-white/5 last:border-0"
                                        )}>
                                            {block}
                                        </pre>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 border-t border-white/10 bg-white/[0.02] flex items-center justify-between">
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                                    Example output — fictional project for illustration
                                </span>
                                <Badge variant="default" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                                    AI-generated
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
