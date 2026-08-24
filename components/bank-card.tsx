"use client";

import { motion } from "framer-motion";
import { Contact, Snowflake } from "lucide-react";
import { BankCard, CardTheme } from "@/lib/types";
import { LogoMark } from "@/components/logo";

const THEMES: Record<CardTheme, { bg: string; chip: string; text: string; sub: string }> = {
  volt: {
    bg: "bg-gradient-to-br from-[#141d07] via-[#1c2707] to-[#0c1206]",
    chip: "bg-gradient-to-br from-volt-300 to-volt-600",
    text: "text-volt-300",
    sub: "text-lime-100/40",
  },
  carbon: {
    bg: "bg-gradient-to-br from-zinc-900 via-zinc-800 to-black",
    chip: "bg-gradient-to-br from-zinc-300 to-zinc-500",
    text: "text-zinc-200",
    sub: "text-zinc-500",
  },
  violet: {
    bg: "bg-gradient-to-br from-[#1d1033] via-[#27144a] to-[#120a20]",
    chip: "bg-gradient-to-br from-violet-300 to-violet-600",
    text: "text-violet-200",
    sub: "text-violet-300/40",
  },
  sunset: {
    bg: "bg-gradient-to-br from-[#33150c] via-[#471c10] to-[#200d08]",
    chip: "bg-gradient-to-br from-amber-300 to-orange-600",
    text: "text-amber-200",
    sub: "text-amber-300/40",
  },
};

export function CardArt({
  card,
  revealed,
}: {
  card: BankCard;
  revealed?: boolean;
}) {
  const T = THEMES[card.theme];
  const number = revealed
    ? card.fullNumber
    : `•••• •••• •••• ${card.last4}`;
  return (
    <div
      className={`relative aspect-[8/5] w-full overflow-hidden rounded-3xl border border-white/10 ${T.bg} p-6 shadow-card`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* texture lines */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden>
        <defs>
          <pattern id={`wave-${card.id}`} width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M0 40 Q20 20 40 40 T80 40" fill="none" stroke="white" strokeWidth="0.7" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#wave-${card.id})`} />
      </svg>
      <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full bg-white/[0.06] blur-2xl" />

      {card.frozen && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-sky-950/60 backdrop-blur-[3px]">
          <Snowflake size={30} className="text-sky-300" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-sky-200">Frozen</span>
        </div>
      )}

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <LogoMark size={30} />
          <Contact size={22} className={T.sub} />
        </div>
        <div>
          <div className={`mb-3 h-7 w-11 rounded-md ${T.chip} opacity-90`} />
          <div
            className={`font-mono text-lg font-semibold tracking-[0.14em] ${T.text}`}
            style={{ wordSpacing: "0.3em" }}
          >
            {number}
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className={`text-[9px] uppercase tracking-[0.2em] ${T.sub}`}>Card holder</div>
            <div className={`mt-0.5 font-mono text-sm font-semibold ${T.text}`}>{card.holder}</div>
          </div>
          <div className="text-right">
            <div className={`text-[9px] uppercase tracking-[0.2em] ${T.sub}`}>
              {revealed ? "CVV" : "Expires"}
            </div>
            <div className={`mt-0.5 font-mono text-sm font-semibold ${T.text}`}>
              {revealed ? card.cvv : card.exp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FlippableCard({
  card,
  flipped,
  onFlip,
}: {
  card: BankCard;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <motion.button
      onClick={onFlip}
      animate={{ rotateY: flipped ? 180 : 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative w-full text-left outline-none"
      aria-label="Flip card"
    >
      <div style={{ backfaceVisibility: "hidden" }}>
        <CardArt card={card} revealed={false} />
      </div>
      <div
        className="absolute inset-0"
        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
      >
        <CardArt card={card} revealed />
      </div>
    </motion.button>
  );
}
