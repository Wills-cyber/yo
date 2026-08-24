"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Sparkles,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/lib/auth";
import { useBank, useBankData } from "@/lib/bank";
import { FREE_TRANSFER_LIMIT } from "@/lib/types";
import { fmtMoney } from "@/lib/utils";
import { toast } from "@/components/toast";

type Mode = "external" | "internal";

export default function TransferPage() {
  const user = useCurrentUser();
  const data = useBankData(user?.id);
  const transfer = useBank((s) => s.transfer);

  const [mode, setMode] = useState<Mode>("external");
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [phase, setPhase] = useState<"form" | "sending" | "done">("form");

  const from = useMemo(
    () => data?.accounts.find((a) => a.id === fromId) ?? data?.accounts[0],
    [data, fromId]
  );
  const toOptions = data?.accounts.filter((a) => a.id !== from?.id) ?? [];
  const to = toOptions.find((a) => a.id === toId) ?? toOptions[0];

  if (!user || !data) return null;

  const amt = parseFloat(amount) || 0;
  const balanceIssue = from && amt > from.balance ? `Max available: ${fmtMoney(from.balance)}` : null;

  const fee = 0;
  const transfersLeft = Math.max(0, FREE_TRANSFER_LIMIT - data.transfersUsed);

  const send = () => {
    if (!from) return;
    const to_ =
      mode === "internal"
        ? ({ kind: "internal", accountId: to!.id } as const)
        : ({ kind: "external", recipient } as const);
    setPhase("sending");
    setTimeout(() => {
      const res = transfer(user.id, user.pro, from.id, amt, to_, note || undefined);
      if (!res.ok) {
        setPhase("form");
        toast.error("Transfer declined", res.error);
        return;
      }
      setPhase("done");
      toast.success(
        mode === "internal" ? "Transfer complete" : "Money on its way",
        `${fmtMoney(amt)} ${mode === "internal" ? `moved to ${to!.name}` : `sent to ${recipient}`}.`
      );
    }, 1100);
  };

  const canSubmit =
    from &&
    amt > 0 &&
    !balanceIssue &&
    (mode === "internal" ? !!to : recipient.trim().length >= 2);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="animate-fade-up text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Move money</h1>
        <p className="mt-2 text-sm text-zinc-500">External sends and internal vault moves — all instant in the sim.</p>
      </div>

      {/* Mode switch */}
      <div className="glass mx-auto flex w-full max-w-md gap-1 rounded-2xl p-1.5 animate-fade-up" style={{ animationDelay: "60ms" }}>
        {(
          [
            { id: "external", label: "Send to someone", icon: User2 },
            { id: "internal", label: "Between my accounts", icon: Building2 },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              mode === m.id ? "text-ink-950" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {mode === m.id && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-xl bg-volt-400"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <m.icon size={15} /> {m.label}
            </span>
          </button>
        ))}
      </div>

      <motion.div layout className="glass relative overflow-hidden p-6 md:p-8">
        <AnimatePresence mode="wait">
          {phase === "done" ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10 text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-mint/15 text-mint"
              >
                <CheckCircle2 size={38} />
              </motion.span>
              <h2 className="mt-6 font-display text-2xl font-bold text-white">
                {fmtMoney(amt)} sent
              </h2>
              <p className="mt-2 max-w-xs text-sm text-zinc-400">
                {mode === "internal"
                  ? `Moved from ${from?.name} to ${to?.name} instantly.`
                  : `Delivered to ${recipient} — it'll show as pending for a moment (even demos like drama).`}
              </p>
              <button
                onClick={() => {
                  setPhase("form");
                  setAmount("");
                  setNote("");
                }}
                className="btn-primary mt-8"
              >
                <ArrowLeftRight size={16} /> Make another transfer
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" exit={{ opacity: 0, x: -20 }} className="space-y-6">
              {/* From account */}
              <div>
                <label className="label">From</label>
                <div className="relative">
                  <select
                    className="input appearance-none pr-10"
                    value={from?.id}
                    onChange={(e) => setFromId(e.target.value)}
                  >
                    {data.accounts.map((a) => (
                      <option key={a.id} value={a.id} className="bg-ink-850">
                        {a.name} — {fmtMoney(a.balance)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>

              {/* To */}
              {mode === "internal" ? (
                <div>
                  <label className="label">To</label>
                  <div className="relative">
                    <select
                      className="input appearance-none pr-10"
                      value={to?.id}
                      onChange={(e) => setToId(e.target.value)}
                    >
                      {toOptions.map((a) => (
                        <option key={a.id} value={a.id} className="bg-ink-850">
                          {a.name} — {fmtMoney(a.balance)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="label">Recipient name</label>
                  <input
                    className="input"
                    placeholder="e.g. Maya Chen"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="label">Amount</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-mono text-lg text-zinc-500">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="input py-4 pl-10 font-mono text-2xl font-bold"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                  {amt > 0 && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => from && setAmount(String(from.balance))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-volt-500/15 px-2.5 py-1 text-xs font-bold text-volt-300 transition-colors hover:bg-volt-500/25"
                    >
                      MAX
                    </motion.button>
                  )}
                </div>
                {balanceIssue && <p className="mt-2 text-xs font-medium text-rose-300">{balanceIssue}</p>}
              </div>

              <div>
                <label className="label">Note <span className="normal-case tracking-normal text-zinc-600">(optional)</span></label>
                <input
                  className="input"
                  placeholder="Dinner last night"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={48}
                />
              </div>

              {/* Summary */}
              <div className="space-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Fee</span>
                  <span className="font-mono text-mint">Free</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Arrival</span>
                  <span className="font-mono text-zinc-200">{mode === "internal" ? "Instant" : "Seconds (demo)"}</span>
                </div>
                <div className="flex justify-between border-t border-white/[0.06] pt-2 font-semibold text-white">
                  <span>Total debit</span>
                  <span className="font-mono">{fmtMoney(amt + fee)}</span>
                </div>
              </div>

              {!user.pro && mode === "external" && (
                <div className="flex items-center justify-between rounded-xl border border-volt-500/15 bg-volt-500/[0.06] px-4 py-3 text-xs">
                  <span className="text-zinc-300">
                    Free plan: <span className="font-bold text-volt-300">{transfersLeft}</span> of {FREE_TRANSFER_LIMIT} external sends left this month
                  </span>
                  <Link href="/pro" className="inline-flex items-center gap-1 font-bold text-volt-400 hover:text-volt-300">
                    <Sparkles size={12} /> Go unlimited
                  </Link>
                </div>
              )}

              <button onClick={send} disabled={!canSubmit || phase === "sending"} className="btn-primary w-full py-4 text-base">
                {phase === "sending" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Processing…
                  </>
                ) : (
                  <>
                    Send {amt > 0 ? fmtMoney(amt) : "money"} <ArrowRight size={17} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
