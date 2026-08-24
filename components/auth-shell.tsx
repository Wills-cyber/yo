"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fingerprint, Radar, ShieldCheck, Zap } from "lucide-react";
import { Logo } from "@/components/logo";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-volt-500/[0.09] blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-[380px] w-[380px] rounded-full bg-sky-500/[0.07] blur-[100px]" />
        <Link href="/">
          <Logo />
        </Link>

        <div className="relative">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-md font-display text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl"
          >
            Banking, minus the{" "}
            <span className="text-volt-400">bank.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.7 }}
            className="mt-5 max-w-md leading-relaxed text-zinc-400"
          >
            A fully simulated account with realistic balances, transactions and cards — perfect for
            exploring what modern banking should feel like.
          </motion.p>

          <div className="mt-10 space-y-4">
            {[
              { icon: ShieldCheck, t: "Encrypted at rest", d: "Demo-grade local encryption for every profile." },
              { icon: Zap, t: "Instant everything", d: "Transfers, top-ups and card controls with zero waiting." },
              { icon: Radar, t: "Smart insights", d: "Your spending, decoded into trends that make sense." },
            ].map((f, i) => (
              <motion.div
                key={f.t}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.12, duration: 0.6 }}
                className="flex items-start gap-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-volt-500/20 bg-volt-500/10 text-volt-400">
                  <f.icon size={17} />
                </span>
                <div>
                  <div className="text-sm font-bold text-white">{f.t}</div>
                  <div className="text-sm text-zinc-500">{f.d}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <Fingerprint size={14} className="text-volt-500/70" />
          Simulation environment — nothing here is a real financial product.
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col items-center justify-center px-6 py-12">
        <div className="absolute left-6 top-6 lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[400px]"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">{title}</h1>
          <p className="mt-2 text-sm text-zinc-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </main>
  );
}
