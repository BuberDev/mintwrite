import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Mint Write terms of service — rules for using our AI Web3 content generation platform.',
    alternates: { canonical: 'https://mintwrite.com/terms' },
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="text-xs font-mono text-primary uppercase tracking-widest mb-12 inline-block hover:opacity-70 transition-opacity"
                >
                    ← Back to Mint Write
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-2 mt-6">Terms of Service</h1>
                <p className="text-zinc-500 text-sm mb-12">Last updated: 29 April 2026</p>

                <div className="space-y-10 text-zinc-300 leading-relaxed text-sm">

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">1. Acceptance of Terms</h2>
                        <p>
                            By creating an account or using Mint Write (mintwrite.com), you agree to be bound by these Terms of Service. If you do not agree, do not use the service. These terms constitute a legally binding agreement between you and Mint Write.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">2. Description of Service</h2>
                        <p>
                            Mint Write is an AI-powered content marketing platform designed for Web3 founders and crypto projects. The service generates Twitter/X threads, Discord announcements, tokenomics explainers, blog posts, AMA scripts, whitepaper summaries, and community updates using large language models via OpenRouter.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">3. Account Registration</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>You must be at least 16 years old to create an account.</li>
                            <li>You must provide accurate information during registration.</li>
                            <li>You are responsible for maintaining the security of your account credentials.</li>
                            <li>You must verify your email address before accessing the service.</li>
                            <li>You may not create accounts for fraudulent purposes or on behalf of others without their explicit consent.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">4. Subscription Plans and Billing</h2>
                        <p className="mb-3">Mint Write offers three subscription tiers:</p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li><strong>Free:</strong> 5 generations per month, 3 content types, 1 project profile. No payment required.</li>
                            <li><strong>Pro:</strong> $49/month (or $39/month billed annually). Unlimited generations, all 7 content types, 5 project profiles.</li>
                            <li><strong>Agency:</strong> $149/month (or $119/month billed annually). Everything in Pro, unlimited projects, API access, dedicated account manager.</li>
                        </ul>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Subscriptions renew automatically at the end of each billing period unless cancelled.</li>
                            <li>Prices are shown in USD exclusive of applicable taxes. EU customers may be charged VAT where applicable.</li>
                            <li>We reserve the right to change pricing with 30 days' notice to existing subscribers.</li>
                            <li>Payments are processed by Stripe. Card details are never stored on our servers.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">5. Refund Policy</h2>
                        <p className="mb-3">
                            <strong>EU/EEA consumers — 14-day right of withdrawal:</strong> If you are a consumer located in the EU or EEA, you have the right to withdraw from a subscription contract within 14 days of purchase without giving any reason ("cooling-off period"), unless you have already used the service (i.e., generated content). By using the service before the 14-day period expires, you acknowledge and agree that you waive your right of withdrawal.
                        </p>
                        <p className="mb-3">
                            <strong>All other users:</strong> Subscription fees are non-refundable except in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-3">
                            <li>The service was unavailable (downtime exceeding 72 consecutive hours in a billing period)</li>
                            <li>Billing error (duplicate charge or incorrect amount)</li>
                            <li>Technical issue that prevented you from accessing paid features despite our support team being unable to resolve it within 5 business days</li>
                        </ul>
                        <p>
                            To request a refund, email{' '}
                            <a href="mailto:support@mintwrite.com" className="text-primary hover:opacity-70 underline">
                                support@mintwrite.com
                            </a>{' '}
                            within 30 days of the charge. Include your account email and the reason for the request.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">6. Ownership of Generated Content</h2>
                        <p className="mb-3">
                            <strong>You own the content you generate.</strong> Subject to your compliance with these Terms, Mint Write grants you a perpetual, worldwide, royalty-free licence to use, modify, publish, and distribute content generated through the service for any lawful purpose.
                        </p>
                        <p>
                            Mint Write does not claim any intellectual property rights over outputs generated by your inputs. We may, however, use anonymised and aggregated usage data (not your content) to improve the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">7. Acceptable Use</h2>
                        <p className="mb-3">You agree not to use Mint Write to generate or distribute:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Content that constitutes investment advice, financial promotions, or securities solicitation in a regulated manner without proper authorisation</li>
                            <li>Deliberately false or misleading information about any blockchain project, token, or protocol</li>
                            <li>Content promoting scams, rug pulls, or fraudulent token offerings</li>
                            <li>Spam or unsolicited mass communications</li>
                            <li>Content that infringes third-party intellectual property rights</li>
                            <li>Hateful, defamatory, or unlawfully discriminatory content</li>
                        </ul>
                        <p className="mt-3">
                            Violations may result in immediate account suspension without refund.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">8. Financial and Regulatory Disclaimer</h2>
                        <p>
                            Content generated by Mint Write is for informational and marketing purposes only. It does not constitute financial, investment, legal, or tax advice. Users are solely responsible for ensuring that content they publish complies with applicable laws and regulations in their jurisdiction, including advertising standards, securities regulations, and consumer protection laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">9. Service Availability and Limitations</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>We aim for high availability but do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance where possible.</li>
                            <li>AI generation quality may vary. We do not guarantee that outputs will be accurate, complete, or suitable for any particular purpose.</li>
                            <li>Free tier users are limited to 5 generations per month. This limit resets on the first day of each calendar month.</li>
                            <li>We reserve the right to add rate limiting to prevent abuse of the service.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">10. Termination</h2>
                        <p>
                            You may cancel your subscription at any time via the billing portal in your account settings. Access to paid features continues until the end of the current billing period. We may suspend or terminate your account if you violate these Terms, with or without prior notice depending on the severity of the violation.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">11. Limitation of Liability</h2>
                        <p className="mb-3">
                            To the maximum extent permitted by applicable law, Mint Write shall not be liable for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Any indirect, incidental, special, or consequential damages</li>
                            <li>Loss of profits, revenue, data, or business opportunities</li>
                            <li>Damages resulting from your use of AI-generated content</li>
                            <li>Regulatory penalties or legal consequences arising from your publication of generated content</li>
                        </ul>
                        <p className="mt-3">
                            Our total liability shall not exceed the amount you paid to us in the 3 months preceding the claim.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">12. Changes to Terms</h2>
                        <p>
                            We may update these Terms from time to time. We will notify you of material changes by email at least 14 days before they take effect. Continued use of the service after the effective date constitutes acceptance of the updated Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">13. Governing Law</h2>
                        <p>
                            These Terms are governed by and construed in accordance with the laws of Poland and the European Union. Any disputes shall be subject to the exclusive jurisdiction of the courts of Poland, without prejudice to mandatory consumer protection rights under the law of your country of residence.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">14. Contact</h2>
                        <p>
                            For any questions regarding these Terms:{' '}
                            <a href="mailto:support@mintwrite.com" className="text-primary hover:opacity-70 underline">
                                support@mintwrite.com
                            </a>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
