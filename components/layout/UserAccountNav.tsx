"use client"

import * as React from "react"
import Link from "next/link"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { 
  LogOut, 
  User, 
  CreditCard,
  ShieldAlert,
  ChevronUp,
  Settings
} from "lucide-react"

interface UserAccountNavProps {
  user: {
    email: string | null | undefined
    displayName: string | null | undefined
    avatarUrl: string | null | undefined
  }
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/sign-out", { method: "POST" })
    } finally {
      window.location.assign("/")
    }
  }

  const handleSignOutAll = async () => {
    try {
      await fetch("/api/auth/sign-out-all", { method: "POST" })
    } finally {
      window.location.assign("/")
    }
  }

  const initials = user?.displayName?.slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || "MW"

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex w-full items-center gap-3 p-4 text-left transition-all hover:bg-dark-800 group outline-none border-t border-dark-600">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden border border-dark-600 bg-dark-800 text-[10px] font-black uppercase text-dark-100 transition-colors group-hover:border-brand-500">
            {user?.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.displayName || "User"} 
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              initials
            )}
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <span className="truncate text-sm font-bold text-dark-100 group-hover:text-brand-500 transition-colors">
              {user?.displayName || "User"}
            </span>
            <span className="truncate text-[10px] text-dark-500 font-mono">
              {user?.email}
            </span>
          </div>
          <ChevronUp className="h-4 w-4 text-dark-600 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          align="start"
          sideOffset={8}
          className="z-[100] w-[240px] overflow-hidden border border-dark-600 bg-dark-900 p-1 shadow-2xl animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="px-3 py-2.5 border-b border-dark-600 mb-1 flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 overflow-hidden border border-dark-600 bg-dark-800 flex items-center justify-center text-[8px] font-black uppercase text-dark-100">
              {user?.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.displayName || "User"} 
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                initials
              )}
            </div>
            <div className="flex flex-col overflow-hidden">
              <p className="text-[9px] font-mono text-brand-500 uppercase tracking-widest mb-0.5">Account</p>
              <p className="text-xs font-bold text-dark-100 truncate">{user?.email}</p>
            </div>
          </div>

          <DropdownMenu.Item asChild>
            <Link
              href="/account"
              className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-xs font-bold text-dark-300 outline-none transition-colors hover:bg-dark-800 hover:text-brand-500 group"
            >
              <User className="h-4 w-4 text-dark-500 group-hover:text-brand-500" />
              Manage Account
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Link
              href="/billing"
              className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-xs font-bold text-dark-300 outline-none transition-colors hover:bg-dark-800 hover:text-brand-500 group"
            >
              <CreditCard className="h-4 w-4 text-dark-500 group-hover:text-brand-500" />
              Billing & Subscription
            </Link>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1 h-px bg-dark-600" />

          <DropdownMenu.Item
            onSelect={(e) => {
              e.preventDefault()
              handleSignOut()
            }}
            className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-xs font-bold text-red-400/80 outline-none transition-colors hover:bg-red-400/10 hover:text-red-400 group"
          >
            <LogOut className="h-4 w-4 text-red-400/60 group-hover:text-red-400" />
            Sign Out
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onSelect={(e) => {
              e.preventDefault()
              handleSignOutAll()
            }}
            className="flex cursor-pointer items-center gap-3 px-3 py-2 text-[10px] font-bold text-dark-500 outline-none transition-colors hover:bg-dark-800 hover:text-dark-300 group"
          >
            <ShieldAlert className="h-4 w-4 text-dark-600 group-hover:text-dark-400" />
            Sign Out All Devices
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
