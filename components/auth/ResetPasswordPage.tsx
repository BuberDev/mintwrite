"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, KeyRound, ChevronLeft, ShieldAlert, Sparkles, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInHref = useMemo(
    () =>
      `/sign-in?${new URLSearchParams({
        redirect_url: redirectUrl,
        ...(email ? { email } : {}),
      }).toString()}`,
    [email, redirectUrl],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const body = (await response.json().catch(() => null)) as { error?: string; redirectUrl?: string } | null;

      if (!response.ok || !body) {
        throw new Error(body?.error || "Unable to reset password.");
      }

      window.location.assign(body.redirectUrl || redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 sm:py-16 selection:bg-primary/30 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-none pointer-events-none" />

      <section className="mx-auto max-w-6xl relative z-10">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          
          {/* Narrative Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Link
                href={signInHref}
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-colors hover:text-white group"
              >
                <ChevronLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                Back to Auth
              </Link>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary">Security Layer</p>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-display leading-[0.9] uppercase italic">
                Reset your <br /> <span className="text-primary/80">Credentials.</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-zinc-400">
                Choose a high-entropy password to finalize your account recovery. For your safety, all other active sessions will be terminated.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-6 rounded-none border border-white/5 bg-white/[0.02] backdrop-blur-sm group hover:border-white/10 transition-colors">
                <Lock className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Secure Update</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">Passwords are hashed using industry-standard protocols.</p>
              </div>
              <div className="p-6 rounded-none border border-white/5 bg-white/[0.02] backdrop-blur-sm group hover:border-white/10 transition-colors">
                <Sparkles className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Session Flush</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">Invalidates all other active access tokens.</p>
              </div>
            </div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Card Border Effect */}
            <div className="absolute -inset-px bg-gradient-to-r from-primary/30 to-zinc-800/20 rounded-none opacity-50" />

            <div className="relative rounded-none border border-white/10 bg-zinc-900/90 p-8 md:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                <KeyRound className="h-32 w-32" />
              </div>

              <div className="mb-10 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-none bg-zinc-950 border border-white/10 p-2 mb-8 shadow-2xl">
                  <img 
                    src="/logo_mint_write.png" 
                    alt="Mint Write Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 font-display uppercase tracking-tighter">New Credentials</h2>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Finalize your account recovery.</p>
              </div>

              {!token ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 rounded-none border border-amber-500/20 bg-amber-500/5 text-center"
                >
                  <ShieldAlert className="h-10 w-10 text-amber-500 mx-auto mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">Invalid Token</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    This reset link is invalid or expired. Request a new one from the recovery portal.
                  </p>
                  <Link 
                    href="/forgot-password"
                    className="mt-8 inline-flex items-center justify-center w-full h-14 rounded-none bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-colors"
                  >
                    Request New Link <ArrowRight className="h-3 w-3 ml-2" />
                  </Link>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="rounded-none border border-red-500/20 bg-red-500/5 p-4 text-[10px] font-bold text-red-400 uppercase tracking-widest"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 font-bold ml-1" htmlFor="password">
                      New Passkey
                    </label>
                    <input
                      id="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full h-14 rounded-none border border-white/5 bg-black/40 px-5 text-white outline-none transition-all placeholder:text-zinc-800 focus:border-primary/30"
                      placeholder="At least 12 characters"
                      type="password"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 font-bold ml-1" htmlFor="confirmPassword">
                      Confirm Passkey
                    </label>
                    <input
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full h-14 rounded-none border border-white/5 bg-black/40 px-5 text-white outline-none transition-all placeholder:text-zinc-800 focus:border-primary/30"
                      placeholder="Repeat your passkey"
                      type="password"
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full h-14 rounded-none bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Set New Passkey <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </button>
                  
                  <p className="text-center text-[10px] text-zinc-600 font-mono uppercase tracking-widest pt-4">
                    Security Update // Session Flush Enabled
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
