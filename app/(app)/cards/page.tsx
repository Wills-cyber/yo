"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AtSign,
  Eye,
  Globe2,
  Lock,
  MousePointerClick,
  Snowflake,
  Sparkles,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/lib/auth";
import { useBank, useBankData } from "@/lib/bank";
import { CardTheme } from "@/lib/types";
import { FlippableCard } from "@/components/bank-card";
import { toast } from "@/components/toast";
import { fmtMoney } from "@/lib/utils";

const THEME_SWATCHES: { id: CardTheme; name: string; bg: string; pro?: boolean }[] = [
  { id: "volt", name: "Volt", bg: "bg-gradient-to-br from-volt-400 to-emerald-600" },
  { id: "carbon", name: "Carbon", bg: "bg-gradient-to-br from-zinc-500 to-zinc-800" },
  { id: "violet", name: "Ultraviolet", bg: "bg-gradient-to-br from-violet-400 to-fuchsia-700", pro: true },
  { id: "sunset", name: "Sunset", bg: "bg-gradient-to-br from-amber-400 to-rose-600", pro: true },
];

function Toggle({ on, onChange, label, icon: Icon, disabled }: {
  on: boolean;
  onChange: () => void;
  label: string;
  icon: typeof Globe2;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      className="glass glass-hover flex w-full items-center gap-4 p-4 text-left disabled:opacity-50"
    >
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${on ? "bg-volt-500/15 text-volt-400" : "bg-white/[0.05] text-zinc-500"}`}>
        <Icon size={17} />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-zinc-100">{label}</span>
        <span className="block text-xs text-zinc-500">{on ? "Enabled" : "Disabled"}</span>
      </span>
      <span
        className={`relative h-6 w-11 rounded-full transition-colors duration-300 ${on ? "bg-volt-500" : "bg-white/10"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${on ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

export default function CardsPage() {
  const user = useCurrentUser();
  const data = useBankData(user?.id);
  const toggleFreeze = useBank((s) => s.toggleFreeze);
  const toggleSetting = useBank((s) => s.toggleCardSetting);
  const setTheme = useBank((s) => s.setCardTheme);

  const [flipped, setFlipped] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  if (!user || !data) return null;
  const card = data.cards[activeCard] ?? data.cards[0];
  const account = data.accounts.find((a) => a.id === card.accountId);

  return (
    <div className="space-y-10">
      <div className="animate-fade-up">
        <h1 className="font-display text-3xl font-bold tracking-tight text-white">Cards</h1>
        <p className="mt-2 text-sm text-zinc-500">Tap the card to reveal its details — like magic, but simulated.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        {/* Card visual */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-[440px]"
          >
            <FlippableCard card={card} flipped={flipped} onFlip={() => {
              setFlipped(!flipped);
              if (!flipped) toast.pro("Details revealed", "Nobody else can see this — it's all local.");
            }} />
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-zinc-600">
              <MousePointerClick size={13} /> Click to flip · linked to {account?.name}
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              toggleFreeze(user.id, card.id);
              toast[card.frozen ? "success" : "pro"](
                card.frozen ? "Card unfrozen" : "Card frozen",
                card.frozen ? "Your card is active again." : "All card payments are blocked until you unfreeze."
              );
            }}
            className={`mx-auto flex items-center gap-2.5 rounded-2xl border px-6 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.98] ${
              card.frozen
                ? "border-sky-400/40 bg-sky-400/10 text-sky-300 hover:bg-sky-400/20"
                : "border-white/10 bg-white/[0.03] text-zinc-200 hover:border-sky-400/30 hover:text-sky-300"
            }`}
          >
            <Snowflake size={17} />
            {card.frozen ? "Unfreeze card" : "Freeze card"}
          </motion.button>
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          <Toggle
            on={card.online}
            onChange={() => toggleSetting(user.id, card.id, "online")}
            label="Online payments"
            icon={Globe2}
          />
          <Toggle
            on={card.atm}
            onChange={() => toggleSetting(user.id, card.id, "atm")}
            label="ATM withdrawals"
            icon={AtSign}
          />
          <div className="glass flex w-full items-center gap-4 p-4 opacity-80">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-zinc-500">
              <Eye size={17} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold text-zinc-100">Spend limit</span>
              <span className="block text-xs text-zinc-500">{fmtMoney(2000)} / month (demo fixed)</span>
            </span>
            <Wifi size={15} className="text-zinc-600" />
          </div>

          {/* Themes */}
          <div className="glass mt-4 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Card finish</h3>
              {!user.pro && (
                <Link href="/pro" className="inline-flex items-center gap-1 text-xs font-bold text-volt-400 hover:text-volt-300">
                  <Sparkles size={12} /> 2 more on Pro
                </Link>
              )}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {THEME_SWATCHES.map((t) => {
                const locked = t.pro && !user.pro;
                const active = card.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      if (locked) {
                        toast.pro("Pro finish", `${t.name} is a Pro card finish.`);
                        return;
                      }
                      setTheme(user.id, card.id, t.id);
                    }}
                    className={`group relative aspect-square rounded-2xl ${t.bg} transition-all duration-300 ${
                      active ? "ring-2 ring-volt-400 ring-offset-2 ring-offset-ink-900" : "hover:scale-105"
                    }`}
                    title={t.name}
                  >
                    {locked && (
                      <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-[1px]">
                        <Lock size={14} className="text-white/80" />
                      </span>
                    )}
                    <span className="sr-only">{t.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[11px] uppercase tracking-wider text-zinc-600">
              {THEME_SWATCHES.find((t) => t.id === card.theme)?.name} finish
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
