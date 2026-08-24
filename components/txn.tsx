"use client";

import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Car,
  CircleDollarSign,
  Coffee,
  CreditCard,
  HeartPulse,
  Plane,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Tv,
  Zap,
} from "lucide-react";
import { Transaction, TxnCategory } from "@/lib/types";
import { cx, fmtDate, fmtMoney } from "@/lib/utils";

const META: Record<TxnCategory, { icon: typeof Zap; fg: string; bg: string }> = {
  Income: { icon: Banknote, fg: "text-mint", bg: "bg-mint/[0.12]" },
  Groceries: { icon: ShoppingCart, fg: "text-amber-300", bg: "bg-amber-300/[0.12]" },
  Dining: { icon: Coffee, fg: "text-orange-300", bg: "bg-orange-300/[0.12]" },
  Transport: { icon: Car, fg: "text-sky-300", bg: "bg-sky-300/[0.12]" },
  Shopping: { icon: ShoppingBag, fg: "text-fuchsia-300", bg: "bg-fuchsia-300/[0.12]" },
  Subscriptions: { icon: Tv, fg: "text-violet-300", bg: "bg-violet-300/[0.12]" },
  Utilities: { icon: Zap, fg: "text-yellow-200", bg: "bg-yellow-200/[0.12]" },
  Travel: { icon: Plane, fg: "text-cyan-300", bg: "bg-cyan-300/[0.12]" },
  Health: { icon: HeartPulse, fg: "text-rose-300", bg: "bg-rose-300/[0.12]" },
  Transfer: { icon: ArrowUpRight, fg: "text-zinc-300", bg: "bg-zinc-300/[0.10]" },
  Cashback: { icon: Sparkles, fg: "text-volt-300", bg: "bg-volt-300/[0.12]" },
};

export function CategoryBadge({ category }: { category: TxnCategory }) {
  const M = META[category];
  return (
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${M.bg} ${M.fg}`}>
      <M.icon size={17} />
    </span>
  );
}

export function TxnRow({ txn, index = 0 }: { txn: Transaction; index?: number }) {
  const incoming = txn.amount > 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4 }}
      className="flex items-center gap-4 rounded-2xl border border-transparent px-4 py-3.5 transition-all duration-200 hover:border-white/[0.07] hover:bg-white/[0.03]"
    >
      <CategoryBadge category={txn.category} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-zinc-100">{txn.label}</div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500">
          <span>{fmtDate(txn.date)}</span>
          <span className="h-0.5 w-0.5 rounded-full bg-zinc-600" />
          <span>{txn.category}</span>
          {txn.status === "pending" && (
            <span className="rounded-md bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
              Pending
            </span>
          )}
        </div>
      </div>
      <div
        className={cx(
          "flex items-center gap-1 font-mono text-sm font-semibold",
          incoming ? "text-mint" : "text-zinc-300"
        )}
      >
        {incoming ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} className="text-zinc-600" />}
        {fmtMoney(txn.amount, { sign: true })}
      </div>
    </motion.div>
  );
}

export { META as CATEGORY_META };

export const CATEGORY_ICON_FALLBACK = CreditCard;
