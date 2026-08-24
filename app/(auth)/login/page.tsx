"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/toast";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    // Small delay makes the simulated auth feel tangible
    setTimeout(() => {
      const res = login(email, password);
      if (!res.ok) {
        setError(res.error ?? "Login failed.");
        setBusy(false);
        return;
      }
      toast.success("Welcome back", "Session started securely.");
      router.push("/dashboard");
    }, 650);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your simulated NovaBank account.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">Password</label>
            <span className="mb-1.5 text-xs text-zinc-600">Forgot? It's a demo — make a new account.</span>
          </div>
          <div className="relative">
            <input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              className="input pr-12"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-volt-400"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-lg border border-rose-400/20 bg-rose-400/[0.07] px-3.5 py-2.5 text-sm text-rose-300"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button type="submit" disabled={busy} className="btn-primary w-full py-3.5">
          {busy ? <Loader2 size={17} className="animate-spin" /> : <ArrowRight size={17} />}
          {busy ? "Verifying…" : "Log in"}
        </button>

        <p className="pt-2 text-center text-sm text-zinc-500">
          New to NovaBank?{" "}
          <Link href="/register" className="font-semibold text-volt-400 transition-colors hover:text-volt-300">
            Open a free account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
