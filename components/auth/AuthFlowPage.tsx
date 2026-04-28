"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, Shield, Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "sign-in" | "sign-up";

type Props = {
  mode: AuthMode;
};

type AuthError = {
  error: string;
  code?: string;
  issues?: Array<{ path?: (string | number)[]; message: string }>;
  redirectUrl?: string;
};

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.42 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.038l5.657-5.657C34.999 6.053 29.749 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.038l5.657-5.657C34.999 6.053 29.749 4 24 4 15.318 4 7.86 8.84 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.622 0 10.721-2.149 14.616-5.639l-6.744-5.715C29.842 34.846 27.072 36 24 36c-5.397 0-9.618-3.322-11.271-7.956l-6.522 5.02C7.736 39.523 15.236 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a11.95 11.95 0 0 1-4.431 5.646h.001l6.744 5.715C36.741 39.835 44 34 44 24c0-1.341-.138-2.651-.389-3.917z" />
    </svg>
  );
}

export default function AuthFlowPage({ mode }: Props) {
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  const cycle = searchParams.get("cycle") === "annual" ? "annual" : "monthly";
  const plan = searchParams.get("plan") ?? "standard";
  const initialEmail = searchParams.get("email") ?? "";
  const rawRedirectUrl = searchParams.get("redirect_url") || "/dashboard";
  const redirectUrl = rawRedirectUrl.startsWith("/") ? rawRedirectUrl : "/dashboard";
  const postAuthRedirect = intent === "upgrade" ? `/api/billing?plan=${plan}&cycle=${cycle}` : redirectUrl;
  const errorParam = searchParams.get("error");
  const verificationNotice = searchParams.get("verification");
  
  const [formState, setFormState] = useState({
    email: initialEmail,
    password: "",
    confirmPassword: "",
    displayName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(errorParam ? decodeURIComponent(errorParam) : null);
  const [verificationMessage, setVerificationMessage] = useState<string | null>(
    verificationNotice === "sent"
      ? "Verification link dispatched. Check your terminal."
      : verificationNotice === "resent"
        ? "Sequence re-initiated. Fresh link sent."
        : null,
  );
  const [errorCode, setErrorCode] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/auth/me", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.json() as Promise<{ user: { id: string } | null }>;
      })
      .then((payload) => {
        if (!cancelled && payload?.user) {
          window.location.replace(postAuthRedirect);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [postAuthRedirect]);

  const pageMeta = useMemo(() => {
    if (mode === "sign-in") {
      return {
        eyebrow: "Authentication Required",
        title: "Access your Mint Write workspace.",
        subtitle:
          "Securely initialize your session to continue drafting high-authority Web3 content.",
        switchLabel: "New to the protocol?",
        switchHref: `/sign-up?${new URLSearchParams({
          redirect_url: redirectUrl,
          ...(intent ? { intent } : {}),
          ...(searchParams.get("cycle") ? { cycle: searchParams.get("cycle")! } : {}),
          ...(searchParams.get("plan") ? { plan: searchParams.get("plan")! } : {}),
        }).toString()}`,
        submitLabel: "Sign in",
        googleLabel: "Continue with Google",
        forgotHref: `/forgot-password?${new URLSearchParams({
          redirect_url: redirectUrl,
          ...(formState.email ? { email: formState.email } : {}),
        }).toString()}`,
      };
    }

    return {
      eyebrow: "Protocol Initialization",
      title: "Start your Mint Write journey.",
      subtitle:
        "Join the ranks of elite Web3 creators using professional-grade editorial automation.",
      switchLabel: "Already registered?",
      switchHref: `/sign-in?${new URLSearchParams({
        redirect_url: redirectUrl,
        ...(intent ? { intent } : {}),
        ...(searchParams.get("cycle") ? { cycle: searchParams.get("cycle")! } : {}),
        ...(searchParams.get("plan") ? { plan: searchParams.get("plan")! } : {}),
      }).toString()}`,
      submitLabel: "Create account",
      googleLabel: "Continue with Google",
    };
  }, [formState.email, intent, mode, redirectUrl, searchParams]);

  const googleHref = `/api/auth/google/start?redirect_url=${encodeURIComponent(postAuthRedirect)}`;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setErrorCode(null);
    setVerificationMessage(null);

    try {
      const endpoint = mode === "sign-in" ? "/api/auth/sign-in" : "/api/auth/sign-up";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          redirect_url: postAuthRedirect,
          intent,
          cycle,
          plan,
        }),
      });

      const body = (await response.json().catch(() => null)) as AuthError | null;

      if (!response.ok || !body) {
        if (body?.code === "email_not_verified") {
          setErrorCode(body.code);
        }
        throw new Error(body?.error || "Unable to continue.");
      }

      window.location.assign(body.redirectUrl || postAuthRedirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formState.email) {
      setError("Enter your email address first.");
      return;
    }

    setIsResendingVerification(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formState.email }),
      });

      if (!response.ok) throw new Error("Unable to resend verification link.");
      setVerificationMessage("A fresh verification sequence has been dispatched.");
      setErrorCode(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sequence failed.");
    } finally {
      setIsResendingVerification(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-12 text-zinc-100 sm:px-6 sm:py-16 selection:bg-primary/30 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-none animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-none animate-pulse-slow" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        {/* Info Section */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[10px] font-mono uppercase tracking-[0.4em] text-primary"
            >
              {pageMeta.eyebrow}
            </motion.p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl font-display uppercase italic">
              {pageMeta.title}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">
              {pageMeta.subtitle}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-6 rounded-none bg-white/[0.03] border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
              <Shield className="h-6 w-6 text-primary/80 mb-4" />
              <h3 className="font-semibold text-white mb-2 uppercase tracking-tight">Secure Protocol</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                HttpOnly cookies & advanced session encryption protect your workspace.
              </p>
            </div>
            <div className="p-6 rounded-none bg-white/[0.03] border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-all">
              <Zap className="h-6 w-6 text-primary/80 mb-4" />
              <h3 className="font-semibold text-white mb-2 uppercase tracking-tight">Unified Access</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Link your identities and maintain a single source of truth for your brand.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href={pageMeta.switchHref}
              className="group inline-flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              {pageMeta.switchLabel}
              <span className="text-primary group-hover:translate-x-1 transition-transform uppercase font-black tracking-widest text-[10px]">
                {mode === "sign-in" ? "Create one" : "Sign in"}
                <ArrowRight className="inline ml-1 h-3 w-3" />
              </span>
            </Link>
          </div>
        </motion.section>

        {/* Form Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto w-full max-w-md relative"
        >
          {/* Card Border Effect */}
          <div className="absolute -inset-px bg-gradient-to-r from-primary/30 to-zinc-800/20 rounded-none opacity-50" />
          
          <div className="relative rounded-none border border-white/10 bg-zinc-900/90 p-8 md:p-12 shadow-2xl backdrop-blur-2xl ring-1 ring-white/5">
            <div className="mb-10 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-none blur group-hover:opacity-100 transition-opacity opacity-0" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-none border border-white/10 bg-zinc-950 p-2 shadow-2xl overflow-hidden">
                  <img 
                    src="/logo_mint_write.png" 
                    alt="Mint Write Logo" 
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-black text-center text-white font-display mb-2 uppercase tracking-tighter">
              {mode === "sign-in" ? "Protocol Entry" : "Workspace Init"}
            </h2>
            <p className="text-center text-zinc-500 text-[11px] font-mono uppercase tracking-widest mb-10 leading-relaxed">
              {mode === "sign-in"
                ? "Credential handshake required."
                : "Initialize brand authority sequence."}
            </p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-8 rounded-none border border-red-500/20 bg-red-500/5 p-4 text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-3"
                >
                  <div className="h-1.5 w-1.5 rounded-none bg-red-500" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {verificationMessage && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-8 rounded-none border border-emerald-500/20 bg-emerald-500/5 p-4 text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-3"
                >
                  <div className="h-1.5 w-1.5 rounded-none bg-emerald-500" />
                  {verificationMessage}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-6">
              <Link
                href={googleHref}
                className="inline-flex h-14 w-full items-center justify-center gap-4 rounded-none border border-white/5 bg-white/[0.03] px-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/[0.06] hover:border-white/15 active:scale-[0.98]"
              >
                <GoogleMark />
                {pageMeta.googleLabel}
              </Link>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-600">
                  <span className="bg-zinc-900 px-3">Manual Entry</span>
                </div>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                {mode === "sign-up" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest ml-1" htmlFor="displayName">
                      Label Identity
                    </label>
                    <input
                      id="displayName"
                      value={formState.displayName}
                      onChange={(e) => setFormState(s => ({ ...s, displayName: e.target.value }))}
                      className="w-full h-14 rounded-none border border-white/5 bg-black/40 px-5 text-zinc-100 outline-none transition-all placeholder:text-zinc-800 focus:border-primary/30"
                      placeholder="Protocol Name"
                      type="text"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest ml-1" htmlFor="email">
                    Access ID
                  </label>
                  <input
                    id="email"
                    value={formState.email}
                    onChange={(e) => setFormState(s => ({ ...s, email: e.target.value }))}
                    className="w-full h-14 rounded-none border border-white/5 bg-black/40 px-5 text-zinc-100 outline-none transition-all placeholder:text-zinc-800 focus:border-primary/30"
                    placeholder="user@protocol.io"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest ml-1" htmlFor="password">
                    Passkey
                  </label>
                  <input
                    id="password"
                    value={formState.password}
                    onChange={(e) => setFormState(s => ({ ...s, password: e.target.value }))}
                    className="w-full h-14 rounded-none border border-white/5 bg-black/40 px-5 text-zinc-100 outline-none transition-all placeholder:text-zinc-800 focus:border-primary/30"
                    placeholder="••••••••••••"
                    type="password"
                  />
                </div>

                {mode === "sign-up" && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest ml-1" htmlFor="confirmPassword">
                      Validation
                    </label>
                    <input
                      id="confirmPassword"
                      value={formState.confirmPassword}
                      onChange={(e) => setFormState(s => ({ ...s, confirmPassword: e.target.value }))}
                      className="w-full h-14 rounded-none border border-white/5 bg-black/40 px-5 text-zinc-100 outline-none transition-all placeholder:text-zinc-800 focus:border-primary/30"
                      placeholder="Repeat Passkey"
                      type="password"
                    />
                  </div>
                )}

                {mode === "sign-in" && (
                  <div className="flex items-center justify-between px-1">
                    <Link href={pageMeta.forgotHref!} className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 hover:text-primary transition-colors">
                      Lost credentials?
                    </Link>
                    {errorCode === "email_not_verified" && (
                      <button
                        type="button"
                        onClick={() => void handleResendVerification()}
                        className="text-[10px] font-mono uppercase tracking-widest text-primary hover:underline"
                      >
                        {isResendingVerification ? "Syncing..." : "Resend Link"}
                      </button>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative group mt-4 h-14 w-full overflow-hidden rounded-none bg-white text-black text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {pageMeta.submitLabel}
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

