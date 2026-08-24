"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Banknote,
  Plus,
  Sparkles,
  TrendingUp,
  Vault,
  X,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useCurrentUser } from "@/lib/auth";
import { useBank, useBankData } from "@/lib/bank";
import { fmtMoney } from "@/lib/utils";
import { AnimatedNumber } from "@/components/animated-number";
import { TxnRow } from "@/components/txn";
import { toast } from "@/components/toast";
import { LogoMark } from "@/components/logo";

function TopUpModal({ accountId, onClose }: { accountId: string; onClose: () => void }) {
  const user = useCurrentUser();
  const topUp = useBank((s) => s.topUp);
  const [amount, setAmount] = useState("250");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 40, scale: 0.97, opacity: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-sm p-6"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">Instant top-up</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200">
            <X size={16} />
          </button>
        </div>
        <p className="mt-1 text-xs text-zinc-500">Free, instant, capped at $10,000 per top-up.</p>
        <div className="mt-5">
          <label className="label">Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-zinc-500">$</span>
            <input
              type="number"
              min="1"
              className="input pl-8 font-mono text-lg font-semibold"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="mt-3 flex gap-2">
            {[100, 250, 1000].map((v) => (
              <button key={v} onClick={() => setAmount(String(v))} className="btn-ghost flex-1 py-2 text-xs">
                ${v.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
        <button
          className="btn-primary mt-6 w-full"
          onClick={() => {
            if (!user) return;
            const res = topUp(user.id, accountId, parseFloat(amount));
            if (!res.ok) return toast.error("Top-up failed", res.error);
            toast.success("Top-up complete", `${fmtMoney(parseFloat(amount))} added instantly.`);
            onClose();
          }}
        >
          <Banknote size={16} /> Add funds
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const user = useCurrentUser();
  const data = useBankData(user?.id);
  const [topUpFor, setTopUpFor] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!data) return null;
    const total = data.accounts.reduce((s, a) => s + a.balance, 0);
    const now = new Date();
    const mTxns = data.transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const income = mTxns.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const spend = Math.abs(mTxns.filter((t) => t.amount < 0).reduce((s, t) => s + t.amount, 0));

    // Balance trend for the Everyday account over the past 30 days
    const primary = data.accounts[0];
    const days: { date: string; bal: number }[] = [];
    let running = primary.balance;
    const byDay = new Map<string, number>();
    for (const t of data.transactions) {
      if (t.accountId !== primary.id) continue;
      const key = new Date(t.date).toISOString().slice(0, 10);
      byDay.set(key, (byDay.get(key) ?? 0) + t.amount);
    }
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.unshift({
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        bal: Math.max(0, +running.toFixed(2)),
      });
      running -= byDay.get(key) ?? 0;
    }
    return { total, income, spend, days, recent: data.transactions.slice(0, 7) };
  }, [data]);

  if (!user || !data || !stats) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="animate-fade-up">
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold tracking-tight text-white md:text-3xl">
              {greeting()}, {user.name.split(" ")[0]}
            </h1>
            {user.pro && (
              <span className="inline-flex items-center gap-1 rounded-full bg-volt-500/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-volt-300">
                <Sparkles size={11} /> Pro
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-zinc-500">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            {" · "}Everything is simulated — play freely.
          </p>
        </div>
        <div className="flex gap-2.5 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <button onClick={() => setTopUpFor(data.accounts[0].id)} className="btn-ghost">
            <Plus size={16} className="text-volt-400" /> Top up
          </button>
          <Link href="/transfer" className="btn-primary">
            <ArrowUpRight size={16} /> Send money
          </Link>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass relative overflow-hidden p-6 md:col-span-1"
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-volt-500/10 blur-2xl" />
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
            <LogoMark size={16} /> Net worth
          </div>
          <div className="mt-3 font-display text-4xl font-bold tracking-tight text-white">
            <AnimatedNumber value={stats.total} format={(n) => fmtMoney(n)} />
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-mint">
            <TrendingUp size={13} /> across {data.accounts.length} accounts
          </div>
        </motion.div>

        {[
          { label: "Money in this month", value: stats.income, icon: ArrowDownLeft, cls: "text-mint", delay: 0.08 },
          { label: "Money out this month", value: stats.spend, icon: ArrowUpRight, cls: "text-rose-300", delay: 0.16 },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: s.delay }}
            className="glass glass-hover p-6"
          >
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] ${s.cls}`}>
              <s.icon size={14} /> {s.label}
            </div>
            <div className="mt-3 font-display text-3xl font-bold tracking-tight text-white">
              <AnimatedNumber value={s.value} format={(n) => fmtMoney(n)} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + accounts */}
      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white">Balance trend</h2>
            <span className="text-xs text-zinc-500">Everyday · last 30 days</span>
          </div>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer>
              <AreaChart data={stats.days} margin={{ left: -18, right: 6, top: 4 }}>
                <defs>
                  <linearGradient id="dashBal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c1f84e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#c1f84e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" axisLine={false} tickLine={false} interval={6} />
                <YAxis hide domain={["dataMin - 300", "dataMax + 300"]} />
                <Tooltip
                  contentStyle={{
                    background: "#0e1518",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number | string) => [fmtMoney(Number(v)), "Balance"]}
                  labelStyle={{ color: "#a1a1aa" }}
                />
                <Area
                  type="monotone"
                  dataKey="bal"
                  stroke="#c1f84e"
                  strokeWidth={2.5}
                  fill="url(#dashBal)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#c1f84e", stroke: "#05080a" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="space-y-4"
        >
          {data.accounts.map((a) => (
            <button
              key={a.id}
              onClick={() => setTopUpFor(a.id)}
              className={`glass glass-hover group w-full bg-gradient-to-br p-5 text-left ${a.gradient}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.07] text-volt-400">
                    <Vault size={16} />
                  </span>
                  <div>
                    <div className="text-sm font-bold text-white">{a.name}</div>
                    <div className="font-mono text-[11px] text-zinc-500">{a.number}</div>
                  </div>
                </div>
                <ArrowRight size={15} className="text-zinc-600 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-volt-400" />
              </div>
              <div className="mt-4 font-mono text-2xl font-bold text-white">{fmtMoney(a.balance)}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wider text-zinc-500">
                {a.type === "Savings" ? "4.1% demo APY" : "Primary spending"} · tap to top up
              </div>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Recent transactions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.24 }}
        className="glass p-4 md:p-6"
      >
        <div className="flex items-center justify-between px-2 pb-2">
          <h2 className="font-display text-base font-bold text-white">Recent activity</h2>
          <span className="text-xs text-zinc-500">{data.transactions.length} transactions</span>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {stats.recent.map((t, i) => (
            <TxnRow key={t.id} txn={t} index={i} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {topUpFor && <TopUpModal accountId={topUpFor} onClose={() => setTopUpFor(null)} />}
      </AnimatePresence>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
