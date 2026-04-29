"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users2, Crown, Shield, Eye, Plus, X, Mail, Trash2, RefreshCw, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Role = "admin" | "member" | "viewer"

const ROLE_META: Record<Role, { icon: any; label: string; color: string }> = {
  admin:  { icon: Crown,  label: "Admin",  color: "text-brand-500 bg-brand-500/10 border-brand-500/20" },
  member: { icon: Shield, label: "Member", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  viewer: { icon: Eye,    label: "Viewer", color: "text-dark-300 bg-dark-800 border-dark-700" },
}

function RoleBadge({ role }: { role: Role }) {
  const meta = ROLE_META[role] ?? ROLE_META.member
  const Icon = meta.icon
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[9px] font-mono font-black uppercase tracking-widest border px-2 py-0.5", meta.color)}>
      <Icon className="size-2.5" /> {meta.label}
    </span>
  )
}

export default function WorkspacePage() {
  const [workspace, setWorkspace] = useState<any>(null)
  const [userRole, setUserRole] = useState<Role>("viewer")
  const [members, setMembers] = useState<any[]>([])
  const [invites, setInvites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAgency, setIsAgency] = useState(true)

  // Create workspace form
  const [showCreate, setShowCreate] = useState(false)
  const [wsName, setWsName] = useState("")
  const [creating, setCreating] = useState(false)

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<Role>("member")
  const [inviting, setInviting] = useState(false)

  const loadData = async () => {
    try {
      const [wsRes, membersRes] = await Promise.all([
        fetch("/api/workspace"),
        fetch("/api/workspace/members"),
      ])

      if (wsRes.status === 403) { setIsAgency(false); return }

      const wsData = await wsRes.json()
      const membersData = await membersRes.json()

      setWorkspace(wsData?.workspace ?? null)
      setUserRole(wsData?.role ?? membersData?.userRole ?? "viewer")
      setMembers(membersData?.members ?? [])
      setInvites(membersData?.invites ?? [])
    } catch {
      toast.error("Failed to load workspace data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wsName.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wsName }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error)
      }
      toast.success("Workspace created!")
      setShowCreate(false)
      setWsName("")
      await loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to create workspace")
    } finally {
      setCreating(false)
    }
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setInviting(true)
    try {
      const res = await fetch("/api/workspace/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success(`Invite sent to ${inviteEmail}`)
      setInviteEmail("")
      await loadData()
    } catch (err: any) {
      toast.error(err.message || "Failed to send invite")
    } finally {
      setInviting(false)
    }
  }

  const handleRemoveMember = async (memberId: string, email: string) => {
    if (!confirm(`Remove ${email} from workspace?`)) return
    try {
      await fetch(`/api/workspace/members/${memberId}`, { method: "DELETE" })
      toast.success("Member removed")
      await loadData()
    } catch {
      toast.error("Failed to remove member")
    }
  }

  const handleChangeRole = async (memberId: string, role: Role) => {
    try {
      await fetch(`/api/workspace/members/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      toast.success("Role updated")
      await loadData()
    } catch {
      toast.error("Failed to update role")
    }
  }

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      await fetch(`/api/workspace/invites/${inviteId}`, { method: "DELETE" })
      toast.success("Invite revoked")
      await loadData()
    } catch {
      toast.error("Failed to revoke invite")
    }
  }

  // ─── Agency Gate ───────────────────────────────────────────────────────────
  if (!isAgency) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="p-16 border border-dark-600 bg-black/20">
          <Lock className="size-12 text-dark-500 mx-auto mb-8" />
          <p className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em] mb-4">Agency Feature</p>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-6">Multi-user Workspace</h1>
          <p className="text-dark-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Invite your team, assign roles, and collaborate on Web3 content. Available exclusively on the Agency plan.
          </p>
          <Button asChild variant="primary" className="h-14 px-10 rounded-none font-black text-[10px] uppercase tracking-[0.2em]">
            <Link href="/billing">Upgrade to Agency</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-24 px-4 flex items-center justify-center">
        <RefreshCw className="size-6 text-dark-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-24 px-4">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-dark-600 pb-12"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="size-2 bg-brand-500" />
            <span className="text-[10px] font-mono text-brand-500 uppercase tracking-[0.3em]">Agency Tier // Workspace</span>
          </div>
          <h1 className="text-5xl font-display font-bold tracking-tight leading-none">Team Workspace</h1>
          <p className="text-dark-400 text-lg max-w-xl">
            Manage your team, assign roles, and collaborate across all projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleBadge role={userRole} />
        </div>
      </motion.header>

      {/* No workspace yet */}
      {!workspace && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
          <AnimatePresence>
            {!showCreate ? (
              <motion.div key="prompt" className="border border-dashed border-dark-700 p-16 text-center">
                <Users2 className="size-12 text-dark-600 mx-auto mb-6" />
                <p className="text-dark-300 font-semibold mb-2">No workspace configured</p>
                <p className="text-dark-500 text-sm mb-8">Create a workspace to start inviting team members.</p>
                <Button onClick={() => setShowCreate(true)} variant="primary" className="h-12 px-8 rounded-none font-black text-[10px] uppercase tracking-widest">
                  <Plus className="size-4 mr-2" /> Create Workspace
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleCreateWorkspace}
                className="border border-dark-600 bg-black/20 p-10 space-y-6"
              >
                <p className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">New Workspace</p>
                <h2 className="text-2xl font-bold">Workspace Configuration</h2>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-dark-400 uppercase tracking-widest">Workspace Name</label>
                  <Input
                    value={wsName}
                    onChange={e => setWsName(e.target.value)}
                    placeholder="e.g. Uniswap Labs"
                    className="h-14 bg-black/40 border-dark-700 focus:border-brand-500/50 rounded-none"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" variant="primary" isLoading={creating} className="h-12 px-8 rounded-none font-black text-[10px] uppercase tracking-widest">
                    Launch Workspace
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)} className="h-12 px-6 rounded-none border-dark-700">
                    Cancel
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Workspace exists */}
      {workspace && (
        <div className="space-y-10">
          {/* Workspace Info */}
          <div className="bg-black/20 border border-dark-600 p-8">
            <p className="text-[10px] font-mono text-dark-500 uppercase tracking-widest mb-2">Active Workspace</p>
            <h2 className="text-2xl font-bold mb-1">{workspace.name}</h2>
            <p className="text-xs font-mono text-dark-500">{members.length} member{members.length !== 1 ? "s" : ""} · {invites.length} pending invite{invites.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Members List */}
          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-[10px] font-mono text-dark-500 uppercase tracking-[0.4em] font-bold">Team Members</h2>
              <div className="h-px flex-1 bg-dark-800" />
              <span className="text-[10px] font-mono text-dark-600">{members.length} / ∞</span>
            </div>

            <div className="divide-y divide-dark-800 border border-dark-600">
              {members.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.01] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-9 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-xs font-bold text-dark-300 overflow-hidden">
                      {m.user?.avatarUrl
                        ? <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        : (m.user?.displayName?.[0] ?? "?").toUpperCase()
                      }
                    </div>
                    <div>
                      <p className="text-sm font-bold">{m.user?.displayName || "Unknown"}</p>
                      <p className="text-xs text-dark-500 font-mono">{m.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {userRole === "admin" && m.role !== "admin" ? (
                      <select
                        value={m.role}
                        onChange={e => handleChangeRole(m.id, e.target.value as Role)}
                        className="text-[9px] font-mono uppercase tracking-widest bg-dark-900 border border-dark-700 px-2 py-1 focus:outline-none focus:border-brand-500/50"
                      >
                        <option value="member">Member</option>
                        <option value="viewer">Viewer</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <RoleBadge role={m.role as Role} />
                    )}
                    {userRole === "admin" && m.role !== "admin" && (
                      <button
                        onClick={() => handleRemoveMember(m.id, m.user?.email)}
                        className="text-dark-600 hover:text-red-400 transition-colors p-1"
                        title="Remove member"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Invite Form */}
          {userRole === "admin" && (
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-[10px] font-mono text-dark-500 uppercase tracking-[0.4em] font-bold">Invite Member</h2>
                <div className="h-px flex-1 bg-dark-800" />
              </div>
              <form onSubmit={handleInvite} className="border border-dark-600 bg-black/20 p-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-dark-500" />
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="teammate@protocol.xyz"
                      className="pl-12 h-14 bg-black/40 border-dark-700 focus:border-brand-500/50 rounded-none"
                      required
                    />
                  </div>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as Role)}
                    className="h-14 bg-black/40 border border-dark-700 px-4 text-sm focus:outline-none focus:border-brand-500/50 rounded-none min-w-[120px]"
                  >
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                  </select>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={inviting}
                    className="h-14 px-8 rounded-none font-black text-[10px] uppercase tracking-widest shrink-0"
                  >
                    Send Invite
                  </Button>
                </div>
              </form>
            </section>
          )}

          {/* Pending Invites */}
          {invites.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <h2 className="text-[10px] font-mono text-dark-500 uppercase tracking-[0.4em] font-bold">Pending Invites</h2>
                <div className="h-px flex-1 bg-dark-800" />
              </div>
              <div className="divide-y divide-dark-800 border border-dark-600">
                {invites.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-9 bg-dark-900 border border-dashed border-dark-700 flex items-center justify-center">
                        <Mail className="size-4 text-dark-500" />
                      </div>
                      <div>
                        <p className="text-sm font-mono">{inv.email}</p>
                        <p className="text-[10px] text-dark-500 uppercase tracking-widest">
                          Expires {new Date(inv.expiresAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <RoleBadge role={inv.role as Role} />
                      {userRole === "admin" && (
                        <button
                          onClick={() => handleRevokeInvite(inv.id)}
                          className="text-dark-600 hover:text-red-400 transition-colors p-1"
                          title="Revoke invite"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
