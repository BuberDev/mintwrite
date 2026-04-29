import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-none bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-none bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring',
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            <img
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width="3276"
                                height="4095"
                            />
                        </AnimatedGroup>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/sign-up"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-none border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm font-mono tracking-tight uppercase">Mint Write // Editorial Engine v2.4</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-none duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem] font-bold tracking-tighter leading-[0.9]">
                                        Technical <span className="text-primary italic">Authority</span> for Web3 Founders.
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground">
                                        Standard LLMs fail in Web3 because they lack protocol-level context. Mint Write is the specific intelligence layer designed for high-stakes editorial, technical specs, and strategic communication.{' '}
                                        <span className="text-primary font-semibold">100× cheaper than a Web3 agency.</span>
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-none border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-none px-5 text-base">
                                            <Link href="/dashboard">
                                                <span className="text-nowrap">Start Building</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-none px-5">
                                        <Link href="#demo">
                                            <span className="text-nowrap">Watch Demo</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-none border shadow-lg shadow-zinc-950/15 ring-1 aspect-[15/8]">
                                    <DashboardMockup />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="border-y border-border/50 bg-background py-12">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="shrink-0">
                                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary">Protocol Validation</p>
                                <p className="text-xs text-muted-foreground mt-1">Validated across 12+ EVM chains.</p>
                            </div>

                            <div className="flex-1 flex flex-wrap justify-center md:justify-end items-center gap-x-12 gap-y-8 grayscale opacity-40 hover:opacity-100 transition-opacity duration-700">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-muted-foreground">[01]</span>
                                    <span className="text-sm font-black tracking-tighter uppercase">Ethereum</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-muted-foreground">[02]</span>
                                    <span className="text-sm font-black tracking-tighter uppercase">Arbitrum</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-muted-foreground">[03]</span>
                                    <span className="text-sm font-black tracking-tighter uppercase">Polygon</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-muted-foreground">[04]</span>
                                    <span className="text-sm font-black tracking-tighter uppercase">Optimism</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-muted-foreground">[05]</span>
                                    <span className="text-sm font-black tracking-tighter uppercase">Base</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const DashboardMockup = () => {
    const [activeTab, setActiveTab] = React.useState(0)
    const views = [
        {
            name: 'Thread Architect',
            code: 'TH-812',
            title: 'L2 Scaling Strategy',
            file: 'ETH-L2-V2.MD',
            content: [
                '1/ Scaling Ethereum is no longer just a technical hurdle; it\'s an editorial challenge. Modularity requires a new vocabulary. 🧵',
                '2/ Most LLMs fail because they treat "Data Availability" as a generic term. Mint Write understands Celestia, Avail, and EigenDA at the protocol level.',
                '3/ Technical precision meets viral hooks. That\'s the Mint Write advantage. Zero fluff. Pure utility. [SIGNAL OVER NOISE]'
            ],
            metrics: { signals: '82%', reach: 'High' }
        },
        {
            name: 'Protocol Spec',
            code: 'TK-001',
            title: 'Tokenomics V3 Draft',
            file: 'TOKEN-MODEL.SPEC',
            content: [
                '[PHASE-01] Deflationary mechanisms implemented via dynamic burn based on protocol volume.',
                '[PHASE-02] Staking rewards derived from non-inflationary yield sources only.',
                '[PHASE-03] Governance weight proportional to time-locked liquidity metrics.'
            ],
            metrics: { logic: 'Validated', safety: 'Tier-1' }
        },
        {
            name: 'Governance Proposal',
            code: 'GP-204',
            title: 'MIP-12 Integration',
            file: 'GOV-MIP-12.MD',
            content: [
                '## ABSTRACT: Proposal to integrate cross-chain liquidity anchors for the protocol treasury.',
                '## RATIONALE: Current slippage on cross-chain swaps exceeds 4.2% during high volatility periods.',
                '## EXECUTION: Deployment of smart contract bridges on Arbitrum and Optimism nodes.'
            ],
            metrics: { quorum: '65%', impact: 'High' }
        },
        {
            name: 'Strategic Update',
            code: 'ST-910',
            title: 'Q3 Ecosystem Report',
            file: 'STRAT-Q3.SPEC',
            content: [
                '1/ TOTAL VALUE LOCKED: Growth of 124% YoY driven by institutional vaults.',
                '2/ PROTOCOL REVENUE: $1.2M generated via sequencer fees and MEV recapture.',
                '3/ ROADMAP: Shift towards fully modular ZK-stack deployment by Q1 2025.'
            ],
            metrics: { growth: '124%', alpha: 'Tier-1' }
        },
        {
            name: 'Community Pulse',
            code: 'DC-402',
            title: 'Protocol Launch',
            file: 'COMM-LAUNCH.TXT',
            content: [
                '**ANNOUNCEMENT**: The Mint Write Protocol is now live on Mainnet. @everyone',
                'Precision writing meets technical authority. Our editorial engine is now processing protocol specs.',
                'Join the movement for higher signal content in Web3.'
            ],
            metrics: { hype: 'Optimized', engagement: 'Max' }
        }
    ]

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % views.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const view = views[activeTab]

    return (
        <div className="bg-[#050505] border border-white/5 shadow-2xl rounded-none overflow-hidden flex h-full text-white font-sans selection:bg-primary/30">
            {/* Sidebar */}
            <div className="w-56 border-r border-white/5 bg-black p-6 space-y-10 hidden md:flex flex-col">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-4 bg-zinc-800 border border-white/10" />
                            <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-400">Ethereum Mainnet</span>
                        </div>
                        <ArrowRight className="size-2.5 text-zinc-600" />
                    </div>
                    <div className="h-px w-full bg-white/5" />
                </div>

                <nav className="flex-1 space-y-1">
                    <p className="text-[8px] font-mono text-zinc-600 uppercase mb-4 tracking-widest">Workspace / Intelligence</p>
                    {views.map((item, i) => (
                        <div
                            key={item.name}
                            onClick={() => setActiveTab(i)}
                            className={cn(
                                "flex items-center gap-3 py-2 px-3 transition-all duration-200 cursor-pointer group rounded-none",
                                activeTab === i ? "bg-white/5 border border-white/10" : "opacity-40 hover:opacity-100"
                            )}
                        >
                            <span className={cn("text-[9px] font-mono transition-colors", activeTab === i ? "text-primary" : "text-zinc-600")}>[{item.code}]</span>
                            <span className={cn("text-[10px] font-bold uppercase tracking-tight transition-colors", activeTab === i ? "text-white" : "text-zinc-400")}>{item.name}</span>
                        </div>
                    ))}
                </nav>

                <div className="pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <div className="size-6 bg-zinc-800 rounded-none border border-white/10 flex items-center justify-center text-[8px] font-black">DB</div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-bold uppercase tracking-tight">Executive Node</span>
                            <span className="text-[8px] text-zinc-600 font-mono tracking-tighter">0xDB...F42A</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col bg-[#0a0a0a]">
                <header className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-black/40">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5">
                            <span className="text-[9px] font-mono text-zinc-500 tracking-tighter">Search (⌘K)</span>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">
                            Index: <span className="text-zinc-300">{view.file}</span>
                        </span>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div className="flex gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-[7px] font-mono text-zinc-600 uppercase">Gas Price</span>
                                <span className="text-[9px] font-black text-primary uppercase italic">24 Gwei</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[7px] font-mono text-zinc-600 uppercase">Block Height</span>
                                <span className="text-[9px] font-black text-zinc-300 uppercase">19,842,102</span>
                            </div>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="size-4 border border-white/10 flex items-center justify-center">
                            <div className="size-1 bg-zinc-500" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col p-0">
                    <div className="bg-black/20 px-8 py-4 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-white/90">{view.title}</h3>
                            <div className="h-3 w-px bg-white/10" />
                            <span className="text-[9px] font-mono text-zinc-600 tracking-widest uppercase">Editorial Intelligence v4.0</span>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-5 px-3 border border-white/10 bg-white/5 text-[8px] font-bold uppercase flex items-center tracking-widest text-zinc-400">Snapshot Saved</div>
                            <div className="h-5 px-3 border border-primary/20 bg-primary/5 text-[8px] font-bold uppercase flex items-center tracking-widest text-primary">Finalized</div>
                        </div>
                    </div>

                    <div className="flex-1 p-10 space-y-12 overflow-hidden text-left relative">
                        <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none">
                            <div className="text-[140px] font-black italic tracking-tighter uppercase leading-none">TERMINAL</div>
                        </div>

                        <div className="space-y-8">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                    className="space-y-8 max-w-2xl"
                                >
                                    {view.content.map((text, i) => (
                                        <div key={i} className="group relative">
                                            <p className={cn(
                                                "text-[14px] font-mono leading-relaxed transition-colors tracking-tight",
                                                i === 0 ? "text-white font-bold border-l-2 border-primary pl-6" : "text-zinc-500 pl-6"
                                            )}>
                                                {text}
                                            </p>
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="pt-8 flex gap-8 items-center">
                            <div className="h-11 px-10 border border-primary flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] text-black bg-primary hover:bg-primary/90 transition-all cursor-pointer active:scale-[0.98]">
                                Finalize Output
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Network Confirmation</span>
                                <span className="text-[10px] font-bold text-white tracking-widest uppercase">REQUIRED</span>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="h-12 border-t border-white/5 bg-black/40 px-8 flex items-center justify-between text-[8px] font-mono text-zinc-600 tracking-[0.2em] uppercase">
                    <div className="flex gap-8 items-center">
                        <div className="flex items-center gap-2">
                            <div className="size-1 bg-primary" />
                            <span>Primary Node: 0x8A...2F4</span>
                        </div>
                        <span>Security: AES-256-GCM</span>
                        <span>Protocol: MV-LITE-X</span>
                    </div>
                    <div className="flex gap-6 items-center">
                        <span className="text-zinc-400">Session ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
                        <div className="size-4 border border-white/10" />
                    </div>
                </footer>
            </div>
        </div>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'How it works', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-none border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-none border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="/sign-in">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="/sign-up">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="/dashboard">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="h-11 w-11 flex items-center justify-center rounded-none overflow-hidden p-1.5">
                <img src="/logo_mint_write.png" alt="Mint Write Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase whitespace-nowrap">Mint <span className="text-primary">Write</span></span>
        </div>
    )
}
