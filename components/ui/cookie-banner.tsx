'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        try {
            const consent = localStorage.getItem('mw_cookie_consent')
            if (!consent) {
                setVisible(true)
            }
        } catch {
            // localStorage not available (SSR / private mode)
        }
    }, [])

    function accept() {
        try {
            localStorage.setItem('mw_cookie_consent', 'accepted')
        } catch { }
        setVisible(false)
    }

    function decline() {
        try {
            localStorage.setItem('mw_cookie_consent', 'declined')
        } catch { }
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-700 shadow-2xl"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                    We use strictly necessary cookies to keep you logged in. With your consent, we also use analytics cookies to understand how visitors use Mint Write (aggregate data only).{' '}
                    <Link href="/privacy" className="text-primary underline hover:opacity-70">
                        Privacy Policy
                    </Link>
                </p>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={decline}
                        className="text-xs font-mono uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors px-4 py-2 border border-zinc-700 hover:border-zinc-500"
                    >
                        Decline
                    </button>
                    <button
                        onClick={accept}
                        className="text-xs font-mono uppercase tracking-widest bg-primary text-black font-bold px-4 py-2 hover:opacity-90 transition-opacity"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    )
}
