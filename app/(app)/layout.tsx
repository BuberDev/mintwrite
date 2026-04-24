"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { LayoutDashboard, History, PlusCircle, CreditCard, Settings, Menu, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useUser()
  const [tierInfo, setTierInfo] = useState<any>(null)

  useEffect(() => {
    async function fetchTier() {
      try {
        const res = await fetch('/api/user/tier')
        const data = await res.json()
        setTierInfo(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchTier()
  }, [pathname])
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'History', icon: History, href: '/history' },
    { label: 'New Project', icon: PlusCircle, href: '/projects/new' },
    { label: 'Billing', icon: CreditCard, href: '/billing' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ]

  return (
    <div className="flex min-h-screen bg-dark-900 text-dark-100">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 border-r border-dark-600 bg-dark-900 lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-dark-950 font-bold text-xl">C</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              Crypto<span className="text-brand-500">Scribe</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl text-dark-300 hover:text-dark-100 hover:bg-dark-800 transition-all duration-200 group"
            >
              <item.icon className="h-5 w-5 text-dark-500 group-hover:text-brand-500 transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-600">
          <div className="bg-dark-800/50 rounded-2xl p-4 border border-dark-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-dark-400 uppercase tracking-widest">Plan</span>
              <Badge variant={tierInfo?.tier || 'free'}>{tierInfo?.tier || 'Free'}</Badge>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-dark-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 transition-all duration-500" 
                  style={{ width: `${tierInfo ? Math.min((tierInfo.generationsUsed / tierInfo.generationsLimit) * 100, 100) : 0}%` }}
                />
              </div>
              <p className="text-[11px] text-dark-400 text-center">
                {tierInfo?.generationsUsed || 0} of {tierInfo?.generationsLimit === 1000000 ? '∞' : tierInfo?.generationsLimit || 5} used
              </p>
              {tierInfo?.tier === 'free' && (
                <Link href="/billing">
                  <Button variant="primary" size="sm" className="w-full mt-2 py-2 text-xs">
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-dark-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col max-w-[120px]">
              <span className="text-sm font-semibold truncate">{user?.fullName || 'User'}</span>
              <span className="text-[10px] text-dark-500 truncate">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-dark-600 bg-dark-900 flex items-center justify-between px-4 sticky top-0 z-50">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-dark-950 font-bold text-lg">C</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
