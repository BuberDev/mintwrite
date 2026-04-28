import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ChevronLeft, CreditCard, FileText, ShieldCheck, Sparkles, UserCircle2 } from "lucide-react";
import { requireCurrentAuth } from "@/lib/auth/session";
import { getBillingState, isPostgresConfigured } from "@/lib/db/billing";
import { listOAuthAccountsForUser, listSessionsForUser } from "@/lib/auth/store";
import SignOutButton from "@/components/auth/SignOutButton";
import SignOutAllButton from "@/components/auth/SignOutAllButton";

export const runtime = "nodejs";
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-image-preview": "none",
      "max-snippet": 0,
      "max-video-preview": 0,
    },
  },
};

export default async function AccountPage() {
  const auth = await requireCurrentAuth("/account");

  if (!auth?.user) {
    redirect("/sign-in?redirect_url=%2Faccount");
  }

  const user = auth.user;
  const billing = isPostgresConfigured() ? await getBillingState(user.id) : null;
  const sessions = isPostgresConfigured() ? await listSessionsForUser(user.id, auth.session.id) : [];
  const oauthAccounts = isPostgresConfigured() ? await listOAuthAccountsForUser(user.id) : [];
  const primaryEmail = user.email ?? "Unavailable";
  const displayName = user.displayName || "Your account";
  const hasStripeCustomer = Boolean(billing?.stripeCustomerId);
  const billingHref = hasStripeCustomer ? "/api/billing/portal" : "/billing";
  const billingLabel = hasStripeCustomer ? "Manage billing" : "Upgrade";
  const latestInvoiceHref = billing?.stripeInvoiceUrl ?? null;
  
  // Map internal tier to display label
  const planLabel = (user.tier || "free").toUpperCase();
  const cycleLabel = billing?.cycle ?? "monthly";

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 sm:py-16 selection:bg-primary/30">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-white group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to dashboard
            </Link>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary">Identity Hub</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl font-display">
            Command Center.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Manage your digital footprint, monitor active sessions, and oversee your subscription protocol from one unified interface.
          </p>
        </div>

        <div className="mt-16 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm flex items-center gap-4">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={displayName} 
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <UserCircle2 className="h-6 w-6 text-zinc-500" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-3 text-zinc-500 mb-1">
                    <p className="text-[10px] font-mono uppercase tracking-widest">Operator</p>
                  </div>
                  <h2 className="text-xl font-bold text-white truncate">{displayName}</h2>
                  <p className="text-xs text-zinc-500 truncate">{primaryEmail}</p>
                </div>
              </div>

              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-zinc-500 mb-4">
                  <Sparkles className="h-4 w-4" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">Protocol Tier</p>
                </div>
                <h2 className="text-xl font-bold text-white">{planLabel}</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  {billing?.stripeStatus === "active" ? "Status: ACTIVE" : "Status: FOUNDATIONAL"}
                </p>
              </div>

              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 text-zinc-500 mb-4">
                  <ShieldCheck className="h-4 w-4" />
                  <p className="text-[10px] font-mono uppercase tracking-widest">Security</p>
                </div>
                <h2 className="text-xl font-bold text-white">{sessions.length} Active</h2>
                <p className="mt-1 text-xs text-zinc-500">Distributed sessions</p>
              </div>
            </div>

            {/* Main Settings */}
            <section className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                <Sparkles className="h-32 w-32" />
              </div>
              
              <div className="flex flex-col lg:flex-row gap-12 lg:items-start lg:justify-between">
                <div className="max-w-xl">
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4">Settings & Security</p>
                  <h2 className="text-2xl font-bold text-white mb-4 font-display">Manage profile and access.</h2>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    Review your connected identities, manage session persistence, and handle billing through our secure Stripe integration. Each session is protected via HttpOnly encryption.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3 min-w-[200px]">
                  <Link
                    href={billingHref}
                    className="flex h-11 items-center justify-center rounded-xl bg-white text-black text-sm font-bold transition-all hover:bg-zinc-200"
                  >
                    {billingLabel}
                  </Link>
                  <Link
                    href="/api/auth/google/link/start"
                    className="flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white text-sm font-bold transition-all hover:bg-white/10"
                  >
                    {oauthAccounts.some(a => a.provider === "google") ? "Identity Linked" : "Link Google"}
                  </Link>
                  <SignOutButton />
                  <SignOutAllButton />
                </div>
              </div>

              {/* Sessions List */}
              <div className="mt-12 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Active Access Tokens</p>
                </div>
                <div className="grid gap-3">
                  {sessions.map((session) => (
                    <div key={session.id} className="group relative rounded-2xl border border-white/5 bg-black/40 p-5 transition-all hover:border-white/10">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`h-2 w-2 rounded-full ${session.current ? "bg-primary animate-pulse" : "bg-zinc-600"}`} />
                          <div>
                            <p className="text-sm font-bold text-white">
                              {session.current ? "Primary Session" : "Remote Session"}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-500 mt-1 uppercase tracking-tighter">
                              {session.userAgent || "Generic User Agent"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Expires</p>
                          <p className="text-xs text-zinc-300">{new Date(session.expiresAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar / Billing Details */}
          <aside className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-8">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4">Protocol Status</p>
              <h2 className="text-2xl font-bold text-white mb-6 font-display">Billing Snapshot</h2>
              
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-white/5 bg-black/40">
                  <div className="flex items-center gap-3 text-zinc-500 mb-3">
                    <CreditCard className="h-4 w-4" />
                    <p className="text-[10px] font-mono uppercase tracking-widest">Billing Protocol</p>
                  </div>
                  <p className="text-sm font-bold text-white capitalize">{cycleLabel} Billing</p>
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-black/40">
                  <div className="flex items-center gap-3 text-zinc-500 mb-3">
                    <FileText className="h-4 w-4" />
                    <p className="text-[10px] font-mono uppercase tracking-widest">Latest Record</p>
                  </div>
                  {latestInvoiceHref ? (
                    <Link href={latestInvoiceHref} target="_blank" className="text-sm font-bold text-primary hover:underline flex items-center gap-2">
                      View Statement
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <p className="text-xs text-zinc-500 italic">Awaiting first settlement.</p>
                  )}
                </div>

                <div className="p-5 rounded-2xl border border-white/5 bg-black/40">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-3">Linked Accounts</p>
                  <div className="flex flex-wrap gap-2">
                    {oauthAccounts.length > 0 ? (
                      oauthAccounts.map(a => (
                        <span key={a.id} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase">
                          {a.provider} LINKED
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-zinc-500 italic">No external identities linked.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/billing"
                  className="group flex items-center justify-between p-4 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all"
                >
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">Compare Protocols</span>
                  <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

