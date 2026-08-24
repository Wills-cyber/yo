"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Brain, CalendarRange, Percent } from "lucide-react";
import { useCurrentUser } from "@/lib/auth";
import { useBankData } from "@/lib/bank";
import { TxnCategory } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";
import { ProGate } from "@/components/pro-gate";

const PIE_COLORS: Record<string, string> = {
  Groceries: "#fbbf24",
  Dining: "#fb923c",
  Transport: "#7dd3fc",
  Shopping: "#f0abfc",
  Subscriptions: "#c4b5fd",
  Utilities: "#fef08a",
  Travel: "#67e8f9",
  Health: "#fda4af",
  Transfer: "#d4d4d8",
};

const tooltipStyle = {
  background: "#0e1518",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  fontSize: 12,
};

export default function AnalyticsPage() {
  const user = useCurrentUser();
  const data = useBankData(user?.id);

  const model = useMemo(() => {
    if (!data) return null;
    const now = new Date();

    // Category split for the current month (debits only)
    const catMap = new Map<string, number>();
    for (const t of data.transactions) {
      if (t.amount >= 0) continue;
      const d = new Date(t.date);
      if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
        catMap.set(t.category, (catMap.get(t.category) ?? 0) + Math.abs(t.amount));
      }
    }
    const categories = [...catMap.entries()]
      .map(([name, value]) => ({ name: name as TxnCategory, value: +value.toFixed(2) }))
      .sort((a, b) => b.value - a.value);

    // Last 6 months cashflow
    const months: { name: string; in: number; out: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      let inSum = 0;
      let outSum = 0;
      for (const t of data.transactions) {
        const td = new Date(t.date);
        if (td.getMonth() === m && td.getFullYear() === y) {
          if (t.amount > 0) inSum += t.amount;
          else outSum += Math.abs(t.amount);
        }
      }
      months.push({
        name: d.toLocaleDateString("en-US", { month: "short" }),
        in: +inSum.toFixed(0),
        out: +outSum.toFixed(0),
      });
    }

    // 30-day net per day → naive 30-day forecast
    const daily = new Map<string, number>();
    for (const t of data.transactions) {
      const key = new Date(t.date).toISOString().slice(0, 10);
      daily.set(key, (daily.get(key) ?? 0) + t.amount);
    }
    let net30 = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      net30 += daily.get(d.toISOString().slice(0, 10)) ?? 0;
    }
    const avgNet = net30 / 30;
    const startBal = data.accounts.reduce((s, a) => s + a.balance, 0);
    const forecast = [];
    let bal = startBal;
    for (let i = 0; i <= 30; i += 3) {
      bal = startBal + avgNet * i;
      forecast.push({
        day: i === 0 ? "Today" : `+${i}d`,
        balance: +(bal).toFixed(0),
        low: +(bal - avgNet * i * 0.35).toFixed(0),
      });
    }

    // Insights
    const topCat = categories[0];
    const totalOut = categories.reduce((s, c) => s + c.value, 0);
    const subs = categories.find((c) => c.name === "Subscriptions");
    const monthIn = months[months.length - 1]?.in ?? 0;
    const savingsRate = monthIn > 0 ? Math.max(0, Math.round(((monthIn - totalOut) / monthIn) * 100)) : 0;

    return { categories, months, forecast, topCat, totalOut, subs, savingsRate, avgNet };
  }, [data]);

  if (!user || !data || !model) return null;

  return (
    <div className="space-y-8">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Analytics</h1>
        <p className="mt-2 text-sm text-zinc-500">Your simulated spending, decoded.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Category donut */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white">Spending by category</h2>
            <span className="text-xs text-zinc-500">This month</span>
          </div>
          {model.categories.length === 0 ? (
            <p className="py-16 text-center text-sm text-zinc-500">No spending yet this month.</p>
          ) : (
            <div className="mt-2 grid items-center gap-2 sm:grid-cols-[1fr_1.1fr]">
              <div className="relative h-[200px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={model.categories}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={88}
                      paddingAngle={3}
                      strokeWidth={0}
                    >
                      {model.categories.map((c) => (
                        <Cell key={c.name} fill={PIE_COLORS[c.name] ?? "#a1a1aa"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={tooltipStyle}
                      formatter={(v: number | string) => fmtMoney(Number(v))}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Total</span>
                  <span className="font-mono text-lg font-bold text-white">{fmtMoney(model.totalOut)}</span>
                </div>
              </div>
              <ul className="space-y-2">
                {model.categories.slice(0, 6).map((c) => (
                  <li key={c.name} className="flex items-center gap-2.5 text-sm">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: PIE_COLORS[c.name] ?? "#a1a1aa" }}
                    />
                    <span className="flex-1 text-zinc-300">{c.name}</span>
                    <span className="font-mono text-sm font-semibold text-zinc-100">
                      {fmtMoney(c.value)}
                    </span>
                    <span className="w-10 text-right font-mono text-[11px] text-zinc-600">
                      {Math.round((c.value / model.totalOut) * 100)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Cashflow bars */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="glass p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-bold text-white">Cash flow</h2>
            <span className="text-xs text-zinc-500">Last 6 months</span>
          </div>
          <div className="mt-4 h-[240px]">
            <ResponsiveContainer>
              <BarChart data={model.months} margin={{ left: -14, right: 4, top: 4 }} barGap={3}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(v: number | string, name: string) => [fmtMoney(Number(v), { decimals: 0 }), name === "in" ? "In" : "Out"]}
                  labelStyle={{ color: "#a1a1aa" }}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <Bar dataKey="in" fill="#4ade80" radius={[5, 5, 0, 0]} />
                <Bar dataKey="out" fill="#3f3f46" radius={[5, 5, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 12 }} formatter={(v) => (v === "in" ? "Money in" : "Money out")} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Pro: forecast */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.16 }}
      >
        {user.pro ? (
          <div className="glass relative overflow-hidden p-6">
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-volt-500/10 blur-3xl" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-white">
                Cash-flow forecast
                <span className="rounded-md bg-volt-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-volt-400">
                  Pro
                </span>
              </h2>
              <span className="text-xs text-zinc-500">Projected next 30 days from your 30-day net pace</span>
            </div>
            <div className="mt-4 h-[260px]">
              <ResponsiveContainer>
                <LineChart data={model.forecast} margin={{ left: -8, right: 8, top: 6 }}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} />
                  <YAxis hide domain={["dataMin - 200", "dataMax + 200"]} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(v: number | string) => [fmtMoney(Number(v), { decimals: 0 }), "Projected"]}
                    labelStyle={{ color: "#a1a1aa" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#c1f84e"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 4, fill: "#c1f84e", stroke: "#05080a" }}
                  />
                  <Line type="monotone" dataKey="low" stroke="#52525b" strokeDasharray="4 6" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <ProGate feature="30-day cash-flow forecast">
            <div className="glass p-6">
              <h2 className="font-display text-base font-bold text-white">Cash-flow forecast</h2>
              <div className="mt-4 h-[240px]">
                <ResponsiveContainer>
                  <LineChart data={model.forecast} margin={{ left: -8, right: 8, top: 6 }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Line type="monotone" dataKey="balance" stroke="#c1f84e" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ProGate>
        )}
      </motion.div>

      {/* Pro: insights */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
      >
        {user.pro ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Brain,
                title: "Biggest category",
                body: model.topCat
                  ? `${model.topCat.name} leads at ${fmtMoney(model.topCat.value)} this month. A 10% trim would save ${fmtMoney(model.topCat.value * 0.1)}.`
                  : "Spend something first, then I'll judge (gently).",
              },
              {
                icon: Percent,
                title: "Savings rate",
                body: `You kept ${model.savingsRate}% of this month's income. ${model.savingsRate >= 20 ? "Elite tier. Keep it rolling." : "Target 20% — try moving a fixed slice on payday."}`,
              },
              {
                icon: CalendarRange,
                title: "Subscriptions check",
                body: model.subs
                  ? `Recurring charges total ${fmtMoney(model.subs.value)}/mo — that's ${fmtMoney(model.subs.value * 12)} a year.`
                  : "No recurring subscriptions detected this month.",
              },
            ].map((c) => (
              <div key={c.title} className="glass glass-hover p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-volt-500/20 bg-volt-500/10 text-volt-400">
                  <c.icon size={17} />
                </span>
                <h3 className="mt-4 text-sm font-bold text-white">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{c.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <ProGate feature="AI-style spending insights">
            <div className="grid gap-4 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-volt-500/10 text-volt-400">
                    <Brain size={17} />
                  </span>
                  <h3 className="mt-4 text-sm font-bold text-white">Insight #{i}</h3>
                  <p className="mt-1.5 text-sm text-zinc-400">
                    Personalized insight based on your spending patterns appears here for Pro members.
                  </p>
                </div>
              ))}
            </div>
          </ProGate>
        )}
      </motion.div>

      {/* Month comparison strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28 }}
        className="glass flex flex-wrap items-center justify-between gap-4 p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint/10 text-mint">
            <ArrowUpRight size={17} />
          </span>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Net pace (30d)</div>
            <div className={`font-mono text-lg font-bold ${model.avgNet >= 0 ? "text-mint" : "text-rose-300"}`}>
              {fmtMoney(model.avgNet, { sign: true })}/day
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-zinc-400">
            <ArrowDownRight size={17} />
          </span>
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500">Projected month-end</div>
            <div className="font-mono text-lg font-bold text-white">
              {fmtMoney(model.forecast[model.forecast.length - 1]?.balance ?? 0, { decimals: 0 })}
            </div>
          </div>
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-zinc-500">
          Projections use your recent transaction pace. This is a simulation — not financial advice.
        </p>
      </motion.div>
    </div>
  );
}
