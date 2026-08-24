"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { useAuth } from "@/lib/auth";
import { useBank } from "@/lib/bank";
import { toast } from "@/components/toast";

function strength(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string; cls: string } {
  if (!pw) return { score: 0, label: "", cls: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "", cls: "" },
    { label: "Weak", cls: "bg-rose-400" },
    { label: "Okay", cls: "bg-amber-400" },
    { label: "Good", cls: "bg-lime-400" },
    { label: "Strong", cls: "bg-mint" },
  ];
  return { score: s as 0 | 1 | 2 | 3 | 4, ...map[s] } as {
    score: 0 | 1 | 2 | 3 | 4;
    label: string;
    cls: string;
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuth((s) => s.register);
  const ensureSeeded = useBank((s) => s.ensureSeeded);
  const users = useAuth((s) => s.users);
  const userId = useAuth((s) => s.userId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const pw = useMemo(() => strength(password), [password]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    if (!agree) {
      setError("Please acknowledge that this is a simulated bank.");
      return;
    }
    setBusy(true);
    setError(null);
    setTimeout(() => {
      const res = register(name, email, password);
      if (!res.ok) {
        setError(res.error ?? "Registration failed.");
        setBusy(false);
        return;
      }
      // Seed the brand-new user's simulated finances
      const st = useAuth.getState();
      if (st.userId) {
        ensureSeeded(st.userId, st.users.find((u) => u.id === st.userId)?.name ?? name);
      }
      toast.success("Account created", "Your simulated finances are ready.");
      router.push("/dashboard");
    }, 750);
  };

  return (
    <AuthShell title="Open your account" subtitle="30 seconds, no paperwork, no real money.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input
            id="name"
            className="input"
            placeholder="Alex Rivers"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
          <label className="label" htmlFor="password">Password</label>
          <div className="relative">
            <input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              className="input pr-12"
              placeholder="8+ characters"
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
          {pw.score > 0 && (
            <div className="mt-2.5 flex items-center gap-3">
              <div className="flex h-1 flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                      i <= pw.score ? pw.cls : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              <span className="w-12 text-right text-[11px] font-semibold text-zinc-400">{pw.label}</span>
            </div>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5 transition-colors hover:border-white/[0.14]">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[#c1f84e]"
          />
          <span className="text-xs leading-relaxed text-zinc-400">
            I understand NovaBank is a <span className="font-semibold text-zinc-200">simulation</span> and
            no real money, cards, or banking services are involved.
          </span>
        </label>

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
          {busy ? "Provisioning your demo bank…" : "Create account"}
        </button>

        <p className="pt-2 text-center text-sm text-zinc-500">
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-volt-400 transition-colors hover:text-volt-300">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
