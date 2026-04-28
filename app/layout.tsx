import { Inter, Outfit, Source_Serif_4 } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { Toast } from '@/components/ui/toast'
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

const serif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  style: ['italic', 'normal'],
})

export const metadata: Metadata = {
  title: {
    default: 'Mint Write — Web3 Content Marketing Platform',
    template: '%s | Mint Write',
  },
  description:
    'Generate X threads, Discord announcements, tokenomics explainers, and more for your Web3 project in under 60 seconds.',
  keywords: [
    'Web3 content generator',
    'crypto X thread writer',
    'Discord announcement generator crypto',
    'tokenomics explainer',
    'blockchain content marketing',
    'DeFi marketing tool',
  ],
  openGraph: {
    title: 'Mint Write — Web3 Content Marketing Platform',
    description: 'Standard LLMs fail in Web3 because they lack protocol-level context. Mint Write is a specific intelligence layer designed for founders. No generic AI. Built for crypto.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", inter.variable, outfit.variable, serif.variable)}>
      <body className="font-sans">
        {children}
        <Toast />
      </body>
    </html>
  )
}
