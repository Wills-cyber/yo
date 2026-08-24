"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Coins, PartyPopper, PiggyBank, Plane, Plus, Shield, Target, X } from "lucide-react";
import { useCurrentUser } from "@/lib/auth";
import { useBank, useBankData } from "@/lib/bank";
import { fmtMoney } from "@/lib/utils";
import { toast } from "@/components/toast";
import { ProGate } from "@/components/pro-gate";

const ICONS: Record<string, typeof Plane> = {
  plane: Plane,
  shield: Shield,
  target: Target,
  coins: Coins,
};

export default function GoalsPage() {
  const user = useCurrentUser();
  const data = useBankData(user?.id);
  const addGoal = useBank((s) => s.addGoal);
  const fundGoal = useBank((s) => s.fundGoal);

  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("2000");
  const [monthly, setMonthly] = useState("200");
  const [icon, setIcon] = useState("plane");
  const [fundFor, setFundFor] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState("100");
  const [fromAccount, setFromAccount] = useState("");

  if (!user || !data) return null;

  const goal = data.goals.find((g) => g.id === fundFor);
  const from = data.accounts.find((a) => a.id === fromAccount) ?? data.accounts[0];

  const content = (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        {data.goals.map((g, i) => {
          const pct = Math.min(100, Math.round((g.saved / g.target) * 100));
          const Icon = ICONS[g.icon] ?? Target;
          const r = 52;
          const circ = 2 * Math.PI * r;
          const monthsLeft =
            g.monthly > 0 ? Math.ceil(Math.max(0, g.target - g.saved) / g.monthly) : null;
          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="glass glass-hover flex items-center gap-6 p-6"
            >
              <div className="relative h-[120px] w-[120px] shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r={r}
                    fill="none"
                    stroke="#c1f84e"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ - (circ * pct) / 100 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Icon size={18} className="text-volt-400" />
                  <span className="mt-1 font-mono text-lg font-bold text-white">{pct}%</span>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-white">{g.name}</h3>
                <div className="mt-1 font-mono text-sm text-zinc-400">
                  {fmtMoney(g.saved)} <span className="text-zinc-600">/ {fmtMoney(g.target)}</span>
                </div>
                {pct >= 100 ? (
                  <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-mint/10 px-2.5 py-1 text-xs font-bold text-mint">
                    <PartyPopper size={12} /> Goal reached!
                  </div>
                ) : (
                  <div className="mt-2 text-xs text-zinc-500">
                    {fmtMoney(g.monthly)}/mo auto ·{" "}
                    {monthsLeft === 0 ? "fully funded" : `~${monthsLeft} month${monthsLeft === 1 ? "" : "s"} to go`}
                  </div>
                )}
                {pct < 100 && (
                  <button
                    onClick={() => {
                      setFundFor(g.id);
                      setFromAccount(data.accounts[0].id);
                    }}
                    className="btn-ghost mt-3 px-4 py-2 text-xs"
                  >
                    <Plus size={13} className="text-volt-400" /> Add funds
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* New goal */}
      <AnimatePresence>
        {adding ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass overflow-hidden"
            onSubmit={(e) => {
              e.preventDefault();
              if (name.trim().length < 2) return toast.error("Name your goal", "At least 2 characters.");
              addGoal(user.id, {
                name: name.trim(),
                target: Math.max(50, parseFloat(target) || 0),
                monthly: Math.max(0, parseFloat(monthly) || 0),
                icon,
              });
              toast.success("Goal created", `“${name.trim()}” is now tracking.`);
              setAdding(false);
              setName("");
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-white">New savings goal</h3>
                <button type="button" onClick={() => setAdding(false)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06]">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label">Goal name</label>
                  <input className="input" placeholder="e.g. New MacBook" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="label">Icon</label>
                  <div className="flex gap-2">
                    {Object.entries(ICONS).map(([key, I]) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setIcon(key)}
                        className={`flex h-[46px] w-[46px] items-center justify-center rounded-xl border transition-all ${
                          icon === key
                            ? "border-volt-500/50 bg-volt-500/15 text-volt-400"
                            : "border-white/10 bg-white/[0.03] text-zinc-500 hover:border-white/20"
                        }`}
                      >
                        <I size={17} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label">Target amount</label>
                  <input type="number" min="50" className="input font-mono" value={target} onChange={(e) => setTarget(e.target.value)} />
                </div>
                <div>
                  <label className="label">Monthly contribution</label>
                  <input type="number" min="0" className="input font-mono" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn-primary mt-6 w-full md:w-auto">
                <Target size={16} /> Create goal
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setAdding(true)}
            className="glass glass-hover flex w-full items-center justify-center gap-2 border-dashed py-8 text-sm font-semibold text-zinc-400 hover:text-volt-300"
            style={{ borderStyle: "dashed" }}
          >
            <Plus size={17} /> Start a new goal
          </motion.button>
        )}
      </AnimatePresence>

      {/* Fund modal */}
      <AnimatePresence>
        {goal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setFundFor(null)}
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
                <h3 className="font-display text-lg font-bold text-white">Fund “{goal.name}”</h3>
                <button onClick={() => setFundFor(null)} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06]">
                  <X size={16} />
                </button>
              </div>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="label">From account</label>
                  <div className="relative">
                    <select className="input appearance-none pr-10" value={from.id} onChange={(e) => setFromAccount(e.target.value)}>
                      {data.accounts.map((a) => (
                        <option key={a.id} value={a.id} className="bg-ink-850">
                          {a.name} — {fmtMoney(a.balance)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>
                <div>
                  <label className="label">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-zinc-500">$</span>
                    <input type="number" min="1" className="input pl-8 font-mono" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} />
                  </div>
                </div>
                <button
                  className="btn-primary w-full"
                  onClick={() => {
                    const res = fundGoal(user.id, goal.id, from.id, parseFloat(fundAmount));
                    if (!res.ok) return toast.error("Couldn't add funds", res.error);
                    toast.success("Saved toward your goal", `${fmtMoney(parseFloat(fundAmount))} moved to “${goal.name}”.`);
                    setFundFor(null);
                  }}
                >
                  <PiggyBank size={16} /> Move {fmtMoney(parseFloat(fundAmount) || 0)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div>
      <div className="mb-8 animate-fade-up">
        <h1 className="flex items-center gap-3 font-display text-3xl font-bold tracking-tight text-white">
          Savings goals
          {user.pro && (
            <span className="rounded-md bg-volt-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-volt-400">
              Pro
            </span>
          )}
        </h1>
        <p className="mt-2 text-sm text-zinc-500">Ring-fence money for what matters — with automated monthly pacing.</p>
      </div>
      {user.pro ? (
        content
      ) : (
        <ProGate feature="Savings goals & vaults">{content}</ProGate>
      )}
    </div>
  );
}
