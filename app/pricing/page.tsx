import { Metadata } from 'next'
import PricingClient from './PricingClient'

export const metadata: Metadata = {
  title: 'Pricing — Web3 Content Marketing Plans',
  description:
    'Mint Write pricing: Free, Pro ($49/mo), and Agency ($149/mo) plans for Web3 founders and crypto marketing teams. Unlimited AI content generation. 100× cheaper than a Web3 agency.',
  alternates: {
    canonical: 'https://mintwrite.com/pricing',
  },
  openGraph: {
    title: 'Mint Write Pricing — Web3 Content Marketing Plans',
    description:
      'Free, Pro ($49/mo), and Agency ($149/mo) plans. Unlimited AI-generated Twitter/X threads, Discord announcements, tokenomics explainers, and more for Web3 projects.',
    url: 'https://mintwrite.com/pricing',
    type: 'website',
  },
}

export default function PricingPage() {
  return <PricingClient />
}
