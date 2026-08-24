"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CreditCard,
  Globe2,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/logo";

const fade = (i: number) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
});

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* backdrop glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-volt-500/[0.07] blur-[120px]" />
      <div className="pointer-events-none absolute right-[-200px] top-[30%] h-[400px] w-[400px] rounded-full bg-sky-500/[0.06] blur-[100px]" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" aria-label="NovaBank home">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost px-5 py-2.5">
            Log in
          </Link>
          <Link href="/register" className="btn-primary px-5 py-2.5">
            Open account <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-14 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <motion.div {...fade(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-volt-500/25 bg-volt-500/[0.08] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-volt-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-volt-400" />
                SIMULATED BANK · NO REAL MONEY
              </span>
            </motion.div>
            <motion.h1
              {...fade(1)}
              className="mt-6 font-display text-5xl font-bold leading-[1.04] tracking-tight text-white md:text-6xl xl:text-7xl"
            >
              Money that moves
              <br />
              at <span className="relative inline-block text-volt-400">
                your speed.
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M3 9C80 2 220 2 297 9" stroke="#c1f84e" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
                </svg>
              </span>
            </motion.h1>
            <motion.p {...fade(2)} className="mt-7 max-w-xl text-lg leading-relaxed text-zinc-400">
              NovaBank is a fully simulated neobank playground — instant transfers, smart spending
              analytics, virtual cards, savings goals, and a Pro tier with power features. Open an
              account in 30 seconds.
            </motion.p>
            <motion.div {...fade(3)} className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/register" className="btn-primary px-7 py-3.5 text-base">
                Create free account <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="btn-ghost px-7 py-3.5 text-base">
                I already have one
              </Link>
            </motion.div>
            <motion.div {...fade(4)} className="mt-12 flex flex-wrap gap-8">
              {[
                ["$2.4B", "simulated volume"],
                ["0.9s", "avg. transfer time"],
                ["128k", "demo accounts opened"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-bold text-white">{v}</div>
                  <div className="mt-0.5 text-xs uppercase tracking-[0.16em] text-zinc-500">{l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero visual: phone-ish card stack */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-[400px]"
          >
            <div className="glass shadow-card relative overflow-hidden rounded-[28px] p-6">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-volt-500/15 blur-3xl" />
              <div className="flex items-center justify-between">
                <LogoMark size={28} />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-volt-400">Everyday</span>
              </div>
              <div className="mt-8">
                <div className="text-xs uppercase tracking-[0.16em] text-zinc-500">Total balance</div>
                <div className="mt-1 font-display text-4xl font-bold text-white">$21,270.42</div>
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-mint/10 px-2.5 py-1 text-xs font-semibold text-mint">
                  <ArrowUpRight size={13} /> +4.2% this month
                </div>
              </div>
              {/* fake sparkline */}
              <svg viewBox="0 0 340 90" className="mt-6 w-full">
                <defs>
                  <linearGradient id="hero-g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c1f84e" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#c1f84e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 66 C30 60, 45 70, 70 58 S120 30, 150 42 S210 62, 240 38 S300 20, 340 14 L340 90 L0 90 Z"
                  fill="url(#hero-g)"
                />
                <path
                  d="M0 66 C30 60, 45 70, 70 58 S120 30, 150 42 S210 62, 240 38 S300 20, 340 14"
                  fill="none"
                  stroke="#c1f84e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="mt-5 space-y-3">
                {[
                  ["Whole Foods Market", "-$84.20", "2h ago"],
                  ["Salary — Northwind Labs", "+$6,350.00", "Tue"],
                  ["Blue Bottle Coffee", "-$6.40", "Mon"],
                ].map(([n, a, t], i) => (
                  <motion.div
                    key={n}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + i * 0.15 }}
                    className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                  >
                    <div className="text-sm font-medium text-zinc-200">{n}</div>
                    <div className="text-right">
                      <div className={`font-mono text-sm font-semibold ${a.startsWith("+") ? "text-mint" : "text-zinc-300"}`}>
                        {a}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-zinc-600">{t}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* floating chip */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="glass absolute -right-6 top-16 hidden rounded-2xl p-4 shadow-glow md:block"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-volt-500/15 text-volt-400">
                  <Zap size={17} />
                </span>
                <div>
                  <div className="text-xs font-bold text-white">Instant send</div>
                  <div className="text-[10px] text-zinc-500">0 fees · arrives in seconds</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <motion.h2 {...fade(0)} className="text-center font-display text-3xl font-bold text-white md:text-4xl">
          Everything a bank should be.{" "}
          <span className="text-zinc-500">Nothing it shouldn't.</span>
        </motion.h2>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Zap, t: "Instant transfers", d: "Send money to friends or between your vaults in under a second — free plan includes 5 external sends a month." },
            { icon: BarChart3, t: "Live analytics", d: "Category breakdowns, cash-flow trends and smart insights that update with every transaction." },
            { icon: CreditCard, t: "Virtual cards", d: "Freeze, unfreeze, flip to reveal details, and control online & ATM usage per card." },
            { icon: ShieldCheck, t: "Goals & vaults", d: "Ring-fence money for what matters with automated monthly contributions and progress tracking." },
          ].map((f, i) => (
            <motion.div key={f.t} {...fade(i + 1)} className="glass glass-hover group p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-volt-500/20 bg-volt-500/10 text-volt-400 transition-transform duration-300 group-hover:scale-110">
                <f.icon size={20} />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-white">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pro teaser */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <motion.div
          {...fade(0)}
          className="glass relative overflow-hidden rounded-[32px] p-10 md:p-14"
        >
          <div className="pro-ring absolute -left-24 -top-24 h-72 w-72 rounded-full opacity-20 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-volt-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-volt-400">
                <Sparkles size={13} /> NovaBank Pro
              </span>
              <h2 className="mt-5 font-display text-3xl font-bold text-white md:text-4xl">
                Unlock the power tier
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-zinc-400">
                Unlimited external transfers, cash-flow forecasting, custom card finishes, 2% simulated
                cashback and priority everything — for $9.99 a month in demo dollars.
              </p>
              <Link href="/register" className="btn-primary mt-8 px-7 py-3.5">
                Try Pro free <ArrowRight size={17} />
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Globe2, t: "Unlimited sends" },
                { icon: BarChart3, t: "Cash-flow forecast" },
                { icon: CreditCard, t: "Pro card finishes" },
                { icon: Lock, t: "Savings goals+" },
                { icon: Sparkles, t: "2% simulated cashback" },
                { icon: ShieldCheck, t: "Priority support" },
              ].map((p) => (
                <li
                  key={p.t}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-zinc-200"
                >
                  <p.icon size={16} className="shrink-0 text-volt-400" /> {p.t}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6">
          <Logo />
          <p className="text-xs text-zinc-600">
            NovaBank is a simulation for demonstration purposes. No real funds, no real bank.
          </p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <Link href="/login" className="transition-colors hover:text-volt-400">Log in</Link>
            <Link href="/register" className="transition-colors hover:text-volt-400">Register</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
