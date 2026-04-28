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

const BASE_URL = 'https://mintwrite.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Mint Write — AI Web3 Content Marketing Platform',
    template: '%s | Mint Write',
  },
  description:
    'Generate Twitter/X threads, Discord announcements, tokenomics explainers, blog posts, AMA scripts and whitepapers for your Web3 project in under 60 seconds. AI-native content tool for crypto founders — 100× cheaper than a Web3 agency.',
  keywords: [
    'Web3 content generator',
    'crypto Twitter thread writer',
    'Discord announcement generator crypto',
    'tokenomics explainer AI',
    'blockchain content marketing',
    'DeFi marketing tool',
    'Web3 AI copywriter',
    'NFT marketing generator',
    'DAO community content',
    'crypto blog post writer',
    'Web3 whitepaper summary',
    'AMA script generator crypto',
    'AI content marketing Web3',
    'blockchain marketing automation',
    'Web3 founder marketing tool',
    'crypto content automation',
    'DeFi copywriting tool',
    'GameFi marketing',
    'RWA content generator',
    'L2 project marketing',
  ],
  authors: [{ name: 'Mint Write', url: BASE_URL }],
  creator: 'Mint Write',
  publisher: 'Mint Write',
  category: 'technology',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Mint Write — AI Web3 Content Marketing Platform',
    description:
      'Standard LLMs fail in Web3 because they lack protocol-level context. Mint Write is an AI intelligence layer built specifically for crypto founders. Generate threads, Discord posts, tokenomics explainers and more in 60 seconds.',
    url: BASE_URL,
    siteName: 'Mint Write',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mint Write — AI Web3 Content Marketing Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mint Write — AI Web3 Content Marketing Platform',
    description:
      'Generate Twitter/X threads, Discord announcements, tokenomics explainers for your Web3 project in 60 seconds. No generic AI. Built for crypto.',
    images: ['/og-image.png'],
    creator: '@mintwriteai',
    site: '@mintwriteai',
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    // google: 'YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN',
    // yandex: 'YOUR_YANDEX_TOKEN',
    // bing: 'YOUR_BING_WEBMASTER_TOKEN',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Mint Write',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  sameAs: [
    'https://twitter.com/mintwriteai',
  ],
  description:
    'AI-native content marketing platform for Web3 founders. Generate Twitter/X threads, Discord announcements, tokenomics explainers, and more in under 60 seconds.',
}

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Mint Write',
  url: BASE_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: [
    {
      '@type': 'Offer',
      name: 'Free',
      price: '0',
      priceCurrency: 'USD',
      description: '5 generations per month, 3 content types, 1 project profile',
    },
    {
      '@type': 'Offer',
      name: 'Pro',
      price: '49',
      priceCurrency: 'USD',
      description: 'Unlimited generations, all 7 content types, 5 project profiles, export PDF/Markdown, TokenForge AI import',
    },
    {
      '@type': 'Offer',
      name: 'Agency',
      price: '149',
      priceCurrency: 'USD',
      description: 'Everything in Pro, unlimited projects, API access, dedicated account manager',
    },
  ],
  description:
    'AI-powered Web3 content marketing platform. Generate Twitter/X threads, Discord announcements, tokenomics explainers, blog posts, AMA scripts, and whitepaper summaries for your crypto project in under 60 seconds.',
  screenshot: `${BASE_URL}/og-image.png`,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '47',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark", inter.variable, outfit.variable, serif.variable)}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
      </head>
      <body className="font-sans">
        {children}
        <Toast />
      </body>
    </html>
  )
}
