"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  BarChart3,
  Check,
  CreditCard,
  Loader2,
  PiggyBank,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { useCurrentUser, useAuth } from "@/lib/auth";
import { PRO_PRICE } from "@/lib/types";
import { toast } from "@/components/toast";

const FREE_FEATURES = [
  "Everyday + savings vault",
  "5 external transfers / month",
  "Virtual card with freeze",
  "Basic spending analytics",
  "Instant top-ups (demo)",
];

const PRO_FEATURES = [
  { icon: ArrowLeftRight, t: "Unlimited external transfers", d: "Send as often as you like — no monthly counter." },
  { icon: BarChart3, t: "30-day cash-flow forecast", d: "Projected balance with confidence bands." },
  { icon: PiggyBank, t: "Savings goals & vaults", d: "Automated contributions and progress rings." },
  { icon: CreditCard, t: "Ultraviolet & Sunset card finishes", d: "Two premium card looks, instantly applied." },
  { icon: Sparkles, t: "2% simulated cashback", d: "Demo cashback tracking on card spends." },
  { icon: ShieldCheck, t: "Priority support tier", d: "A badge that means nothing, worn proudly." },
];

function CheckoutModal({ onClose }: { onClose: () => void }) {
  const upgradeToPro = useAuth((s) => s.upgradeToPro);
  const [cardNo, setCardNo] = useState("4242 4242 4242 4242");
  const [expcvc, setExpcvc] = useState({ exp: "12/29", cvc: "123" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const pay = () => {
    setBusy(true);
    setTimeout(() => {
      upgradeToPro();
      setBusy(false);
      setDone(true);
      toast.pro("Welcome to NovaBank Pro", "Unlimited transfers, forecasts and goals unlocked.");
      setTimeout(onClose, 2400);
    }, 1400);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 48, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: 48, scale: 0.96, opacity: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="glass w-full max-w-md overflow-hidden p-0"
      >
        {done ? (
          <div className="flex flex-col items-center px-8 py-14 text-center">
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 16 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-volt-500/15 text-volt-400"
            >
              <Sparkles size={36} />
            </motion.span>
            <h3 className="mt-6 font-display text-2xl font-bold text-white">You're Pro now</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Everything is unlocked. Go forth and transfer irresponsibly (it's fake).
            </p>
          </div>
        ) : (
          <div className="p-7">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-white">Upgrade to Pro</h3>
              <button onClick={onClose} className="rounded-lg p-1.5 text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200">
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold text-white">${PRO_PRICE}</span>
              <span className="text-sm text-zinc-500">/ month · cancel anytime · demo dollars</span>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="label">Card number</label>
                <div className="relative">
                  <input
                    className="input pr-12 font-mono"
                    value={cardNo}
                    onChange={(e) =>
                      setCardNo(
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 16)
                          .replace(/(.{4})/g, "$1 ")
                          .trim()
                      )
                    }
                  />
                  <CreditCard size={17} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expiry</label>
                  <input
                    className="input font-mono"
                    value={expcvc.exp}
                    onChange={(e) => setExpcvc({ ...expcvc, exp: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label">CVC</label>
                  <input
                    className="input font-mono"
                    value={expcvc.cvc}
                    onChange={(e) => setExpcvc({ ...expcvc, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  />
                </div>
              </div>
              <p className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-[11px] leading-relaxed text-zinc-500">
                Simulated checkout — use any test card (4242 4242 4242 4242 prefilled). No charge is
                ever made.
              </p>
              <button onClick={pay} disabled={busy} className="btn-primary w-full py-4 text-base">
                {busy ? (
                  <>
                    <Loader2 size={17} className="animate-spin" /> Processing payment…
                  </>
                ) : (
                  <>
                    <Zap size={17} /> Pay ${PRO_PRICE}/mo
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function ProPage() {
  const user = useCurrentUser();
  const downgrade = useAuth((s) => s.downgrade);
  const [showCheckout, setShowCheckout] = useState(false);
  const [confirmDown, setConfirmDown] = useState(false);

  if (!user) return null;

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-[32px] text-center">
        <div className="pro-ring absolute inset-0 opacity-[0.22] blur-[80px]" />
        <div className="glass relative rounded-[32px] px-6 py-14 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-volt-500/30 bg-volt-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-volt-300">
              <Sparkles size={13} /> NovaBank Pro
            </span>
            <h1 className="mx-auto mt-6 max-w-xl font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
              {user.pro ? "You're on the power tier" : "Unlock the power tier"}
            </h1>
            <p className="mx-auto mt-4 max-w-md leading-relaxed text-zinc-400">
              {user.pro
                ? `Pro since ${new Date(user.proSince ?? Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric" })}. Every superpower below is active right now.`
                : `$${PRO_PRICE}/month in demo dollars. No invoices, no regrets — cancel with one click.`}
            </p>
            {!user.pro && (
              <button onClick={() => setShowCheckout(true)} className="btn-primary mx-auto mt-8 px-8 py-4 text-base">
                <Zap size={18} /> Upgrade to Pro
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass p-7"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white">Free</h2>
            {!user.pro && (
              <span className="rounded-md bg-white/[0.07] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Current plan
              </span>
            )}
          </div>
          <div className="mt-1 font-mono text-3xl font-bold text-zinc-300">$0<span className="text-sm text-zinc-600">/mo</span></div>
          <ul className="mt-6 space-y-3">
            {FREE_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                <Check size={15} className="mt-0.5 shrink-0 text-zinc-500" /> {f}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="pro-ring relative rounded-2xl p-[1.5px]"
        >
          <div className="h-full rounded-[14.5px] bg-ink-900/95 p-7">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-white">
                Pro <Sparkles size={15} className="text-volt-400" />
              </h2>
              {user.pro && (
                <span className="rounded-md bg-volt-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-volt-300">
                  Active
                </span>
              )}
            </div>
            <div className="mt-1 font-mono text-3xl font-bold text-volt-300">
              ${PRO_PRICE}<span className="text-sm text-zinc-600">/mo</span>
            </div>
            <div className="mt-6 grid gap-3.5">
              {PRO_FEATURES.map((f) => (
                <div key={f.t} className="flex items-start gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-volt-500/20 bg-volt-500/10 text-volt-400">
                    <f.icon size={15} />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-white">{f.t}</div>
                    <div className="text-xs text-zinc-500">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
            {!user.pro && (
              <button onClick={() => setShowCheckout(true)} className="btn-primary mt-7 w-full py-3.5">
                Go Pro now
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* Manage subscription */}
      {user.pro && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="glass flex flex-wrap items-center justify-between gap-4 p-6"
        >
          <div>
            <h3 className="text-sm font-bold text-white">Manage subscription</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Billing renews monthly in demo dollars. Priority support tier: <span className="text-volt-300">active</span>.
            </p>
          </div>
          {confirmDown ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Really cancel Pro?</span>
              <button
                onClick={() => {
                  downgrade();
                  setConfirmDown(false);
                  toast.success("Pro cancelled", "Back to the free plan — your data stays put.");
                }}
                className="btn border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-xs text-rose-300 hover:bg-rose-400/20"
              >
                Yes, cancel
              </button>
              <button onClick={() => setConfirmDown(false)} className="btn-ghost px-4 py-2 text-xs">
                Keep Pro
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDown(true)}
              className="btn-ghost px-4 py-2 text-xs text-zinc-400 hover:text-rose-300"
            >
              Cancel subscription
            </button>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
      </AnimatePresence>
    </div>
  );
}
