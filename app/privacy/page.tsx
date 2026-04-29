import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Mint Write privacy policy — how we collect, use, and protect your personal data in compliance with GDPR.',
    alternates: { canonical: 'https://mintwrite.com/privacy' },
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 py-24 px-6">
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/"
                    className="text-xs font-mono text-primary uppercase tracking-widest mb-12 inline-block hover:opacity-70 transition-opacity"
                >
                    ← Back to Mint Write
                </Link>

                <h1 className="text-4xl font-bold tracking-tight mb-2 mt-6">Privacy Policy</h1>
                <p className="text-zinc-500 text-sm mb-12">Last updated: 29 April 2026</p>

                <div className="space-y-10 text-zinc-300 leading-relaxed text-sm">

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">1. Controller</h2>
                        <p>
                            Mint Write ("<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>") is the data controller for personal data processed through mintwrite.com and all associated services.
                        </p>
                        <p className="mt-3">
                            Contact for privacy matters:{' '}
                            <a href="mailto:privacy@mintwrite.com" className="text-primary hover:opacity-70 transition-opacity underline">
                                privacy@mintwrite.com
                            </a>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">2. What Data We Collect</h2>
                        <p className="mb-3">We collect the following categories of personal data:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Account data:</strong> email address, display name, and either a hashed password or an OAuth provider identifier (Google). We never store plaintext passwords.
                            </li>
                            <li>
                                <strong>Billing data:</strong> Stripe customer ID, subscription plan, billing cycle, invoice references. Payment card details are processed entirely by Stripe and are never stored on our servers.
                            </li>
                            <li>
                                <strong>Generated content:</strong> your project profiles (name, ticker, tagline, website, social handles) and the inputs and outputs of AI content generation sessions, associated with your account.
                            </li>
                            <li>
                                <strong>Technical data:</strong> IP address, browser user-agent, and session tokens stored as HttpOnly cookies.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">3. Legal Basis for Processing (GDPR)</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>
                                <strong>Contract performance (Art. 6(1)(b) GDPR):</strong> processing account and billing data is necessary to provide you with the service.
                            </li>
                            <li>
                                <strong>Legitimate interest (Art. 6(1)(f) GDPR):</strong> fraud prevention, security monitoring, and improving the reliability of the service.
                            </li>
                            <li>
                                <strong>Consent (Art. 6(1)(a) GDPR):</strong> analytics cookies are only placed if you explicitly accept via the cookie consent banner.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">4. Third-Party Processors</h2>
                        <p className="mb-4">
                            We work with the following sub-processors. Each has signed a Data Processing Agreement (DPA) and provides appropriate safeguards for international data transfers:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-zinc-800 text-zinc-300">
                                <thead>
                                    <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider">
                                        <th className="text-left p-3">Processor</th>
                                        <th className="text-left p-3">Purpose</th>
                                        <th className="text-left p-3">Location</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    <tr>
                                        <td className="p-3 font-medium text-zinc-100">Vercel Inc.</td>
                                        <td className="p-3">Application hosting and PostgreSQL database</td>
                                        <td className="p-3">USA (EU–US DPA)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-medium text-zinc-100">Stripe Inc.</td>
                                        <td className="p-3">Payment processing and subscription management</td>
                                        <td className="p-3">USA (EU–US DPA)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-medium text-zinc-100">Resend Inc.</td>
                                        <td className="p-3">Transactional email delivery (verification, notifications)</td>
                                        <td className="p-3">USA (EU–US DPA)</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-medium text-zinc-100">OpenRouter / Anthropic</td>
                                        <td className="p-3">AI content generation (your prompts are sent to AI models)</td>
                                        <td className="p-3">USA (EU–US DPA)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="mt-4 text-zinc-400">
                            <strong>Important regarding AI generation:</strong> your project context and generation inputs are transmitted to OpenRouter and the underlying AI model (currently Anthropic Claude) solely to produce the requested output. We do not use your inputs to train AI models, and we contractually prohibit our AI providers from doing so.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">5. Cookies</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border border-zinc-800 text-zinc-300">
                                <thead>
                                    <tr className="border-b border-zinc-800 bg-zinc-900 text-zinc-400 text-xs uppercase tracking-wider">
                                        <th className="text-left p-3">Cookie</th>
                                        <th className="text-left p-3">Type</th>
                                        <th className="text-left p-3">Purpose</th>
                                        <th className="text-left p-3">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    <tr>
                                        <td className="p-3 font-mono text-xs text-zinc-100">mintwrite_session</td>
                                        <td className="p-3">Strictly necessary</td>
                                        <td className="p-3">Authenticates your session. HttpOnly, Secure.</td>
                                        <td className="p-3">30 days</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-mono text-xs text-zinc-100">Analytics cookies</td>
                                        <td className="p-3">Analytics (consent)</td>
                                        <td className="p-3">Aggregate usage analytics. Only set with your consent.</td>
                                        <td className="p-3">1 year</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">6. Data Retention</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Account and content data: retained for as long as your account is active.</li>
                            <li>Upon account deletion: personal data is deleted within 30 days, except where retention is required by law.</li>
                            <li>Billing records: retained for 7 years to comply with tax and accounting regulations.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">7. Your Rights (GDPR)</h2>
                        <p className="mb-3">
                            If you are located in the EU, EEA, or UK, you have the following rights regarding your personal data:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Right of access</strong> — request a copy of the data we hold about you</li>
                            <li><strong>Right to rectification</strong> — correct inaccurate data</li>
                            <li><strong>Right to erasure</strong> — request deletion of your data ("right to be forgotten")</li>
                            <li><strong>Right to data portability</strong> — receive your data in a machine-readable format</li>
                            <li><strong>Right to object</strong> — object to processing based on legitimate interest</li>
                            <li><strong>Right to withdraw consent</strong> — at any time, without affecting prior processing</li>
                        </ul>
                        <p className="mt-4">
                            To exercise any of these rights, contact us at{' '}
                            <a href="mailto:privacy@mintwrite.com" className="text-primary hover:opacity-70 underline">
                                privacy@mintwrite.com
                            </a>
                            . We will respond within 30 days.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">8. Security</h2>
                        <p>
                            All data is transmitted over HTTPS/TLS. Passwords are hashed using bcrypt and never stored in plaintext. Session tokens are stored as HttpOnly, Secure cookies to mitigate XSS and CSRF risks. Access to production databases is restricted to authorised personnel only.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">9. Children's Privacy</h2>
                        <p>
                            Mint Write is not directed to individuals under the age of 16. We do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">10. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. When we make material changes, we will notify registered users by email and update the "last updated" date above. Continued use of the service after notification constitutes acceptance of the revised policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-100 mb-3 uppercase tracking-wide">11. Contact</h2>
                        <p>
                            For any privacy-related questions or data subject requests:{' '}
                            <a href="mailto:privacy@mintwrite.com" className="text-primary hover:opacity-70 underline">
                                privacy@mintwrite.com
                            </a>
                        </p>
                    </section>

                </div>
            </div>
        </div>
    )
}
