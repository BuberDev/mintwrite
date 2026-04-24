"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { LayoutDashboard, History, PlusCircle, CreditCard, Settings, Menu, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="h-9 w-9 bg-black border border-dark-600 flex items-center justify-center rounded-none overflow-hidden p-1.5">
              <img src="/logo_mint_write.png" alt="Mint Write Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tighter uppercase">
              Mint <span className="text-brand-500">Write</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-none text-dark-300 hover:text-dark-100 hover:bg-dark-800 transition-all duration-200 group"
            >
              <span className="text-[9px] font-mono text-dark-500 group-hover:text-brand-500 transition-colors w-6">
                [0{i + 1}]
              </span>
              <item.icon className="h-4 w-4 text-dark-500 group-hover:text-brand-500 transition-colors" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-dark-600">
          <div className="bg-dark-900/50 rounded-none p-4 border border-dark-600">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[9px] font-mono text-brand-500 uppercase tracking-widest">Protocol Status</p>
                <h4 className="text-xs font-bold uppercase tracking-tighter">Active Node</h4>
              </div>
              <Badge variant={tierInfo?.tier || 'free'}>{tierInfo?.tier || 'Free'}</Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-mono text-dark-500">
                <span>Bandwidth</span>
                <span>{tierInfo?.generationsUsed || 0} / {tierInfo?.generationsLimit === 1000000 ? '∞' : tierInfo?.generationsLimit || 5}</span>
              </div>
              <div className="h-[3px] w-full bg-dark-700 rounded-none overflow-hidden">
                <div 
                  className="h-full bg-brand-500 transition-all duration-500" 
                  style={{ width: `${tierInfo ? Math.min((tierInfo.generationsUsed / tierInfo.generationsLimit) * 100, 100) : 0}%` }}
                />
              </div>
              {tierInfo?.tier === 'free' && (
                <Link href="/billing">
                  <Button variant="primary" size="sm" className="w-full mt-4 h-9 text-[10px] font-black uppercase tracking-widest">
                    Upgrade Access
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
            <div className="h-8 w-8 rounded-none bg-brand-500 flex items-center justify-center">
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
