"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";

export function ProGate({ children, feature }: { children: React.ReactNode; feature: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none blur-[6px] saturate-50" aria-hidden>
        {children}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-2xl border border-volt-500/20 bg-ink-950/70 p-6 text-center backdrop-blur-sm"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-volt-500/30 bg-volt-500/10 text-volt-400">
          <Lock size={20} />
        </span>
        <div>
          <div className="font-display text-base font-bold text-white">{feature}</div>
          <div className="mt-1 text-xs text-zinc-400">Available on NovaBank Pro</div>
        </div>
        <Link href="/pro" className="btn-primary mt-1 px-5 py-2.5 text-xs">
          <Sparkles size={14} /> Upgrade to unlock
        </Link>
      </motion.div>
    </div>
  );
}
