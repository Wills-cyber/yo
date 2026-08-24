"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, BarChart3, CreditCard, LayoutDashboard, Sparkles } from "lucide-react";

const TABS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { href: "/transfer", icon: ArrowLeftRight, label: "Send" },
  { href: "/cards", icon: CreditCard, label: "Cards" },
  { href: "/analytics", icon: BarChart3, label: "Stats" },
  { href: "/pro", icon: Sparkles, label: "Pro" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.06] bg-ink-900/90 backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`flex flex-col items-center gap-1 py-3 text-[10px] font-semibold transition-colors ${
                active ? "text-volt-400" : "text-zinc-500"
              }`}
            >
              <t.icon size={19} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
