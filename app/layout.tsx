import { Inter, Outfit } from 'next/font/google'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import './globals.css'
import { Toast } from '@/components/ui/Toast'
import { cn } from "@/lib/utils";

// Removed missing Geist font

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const outfit = Outfit({ 
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: {
    default: 'CryptoScribe AI — Web3 Content Marketing Platform',
    template: '%s | CryptoScribe AI',
  },
  description:
    'Generate Twitter threads, Discord announcements, tokenomics explainers, and more for your Web3 project in under 60 seconds.',
  keywords: [
    'Web3 content generator',
    'crypto Twitter thread writer',
    'Discord announcement generator crypto',
    'tokenomics explainer',
    'blockchain content marketing',
    'DeFi marketing tool',
  ],
  openGraph: {
    title: 'CryptoScribe AI — Web3 Content Marketing Platform',
    description: 'AI content marketing for Web3 founders. No generic AI. Built for crypto.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider 
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#f59e0b',
          colorBackground: '#171717',
          colorInputBackground: '#262626',
          colorInputText: '#e5e5e5',
          colorTextOnPrimaryBackground: '#000000',
        }
      }}
    >
      <html lang="en" className={cn("dark", inter.variable, outfit.variable)}>
        <body className="font-sans">
          {children}
          <Toast />
        </body>
      </html>
    </ClerkProvider>
  )
}
