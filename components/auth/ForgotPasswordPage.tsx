"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Mail, ChevronLeft, ShieldCheck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";
  const initialEmail = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
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
    setMessage(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          redirect_url: redirectUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to send reset link.");
      }

      setMessage("Recovery protocol initiated. Check your inbox for the secure link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset link.");
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
                Recover Access <br /> to your <span className="text-primary/80">Identity.</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-zinc-400">
                Initiate our secure recovery protocol to restore your workspace credentials. Your security is our highest priority.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-6 rounded-none border border-white/5 bg-white/[0.02] backdrop-blur-sm group hover:border-white/10 transition-colors">
                <ShieldCheck className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Encrypted Flow</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">Multi-layered encryption for all recovery links.</p>
              </div>
              <div className="p-6 rounded-none border border-white/5 bg-white/[0.02] backdrop-blur-sm group hover:border-white/10 transition-colors">
                <Sparkles className="h-6 w-6 text-primary mb-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Zero Exposure</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">No credentials revealed during recovery.</p>
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
                <Mail className="h-32 w-32" />
              </div>

              <div className="mb-10 text-center">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-none bg-zinc-950 border border-white/10 p-2 mb-8 shadow-2xl">
                  <img 
                    src="/logo_mint_write.png" 
                    alt="Mint Write Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 font-display uppercase tracking-tighter">Protocol Recovery</h2>
                <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-600">Enter your verified access ID.</p>
              </div>

              <AnimatePresence mode="wait">
                {message ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 rounded-none border border-primary/20 bg-primary/5 text-center"
                  >
                    <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Check your inbox</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{message}</p>
                    <Link 
                      href={signInHref}
                      className="mt-8 inline-flex items-center justify-center w-full h-14 rounded-none bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-200 transition-colors"
                    >
                      Return to Auth <ArrowRight className="h-3 w-3 ml-2" />
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
                      <label className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-600 font-bold ml-1" htmlFor="email">
                        Operator Access ID
                      </label>
                      <input
                        id="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className="w-full h-14 rounded-none border border-white/5 bg-black/40 px-5 text-white outline-none transition-all placeholder:text-zinc-800 focus:border-primary/30"
                        placeholder="operator@protocol.io"
                        type="email"
                        required
                        autoComplete="email"
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
                          Initiate Recovery <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </button>
                    
                    <p className="text-center text-[10px] text-zinc-600 font-mono uppercase tracking-widest pt-4">
                      Protocol v2.4 // Identity Recovery
                    </p>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
