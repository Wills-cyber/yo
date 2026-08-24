"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Sparkles,
} from "lucide-react";
import { useAuth, useCurrentUser } from "@/lib/auth";
import { initials } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { toast } from "@/components/toast";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/transfer", label: "Transfers", icon: ArrowLeftRight },
  { href: "/cards", label: "Cards", icon: CreditCard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/goals", label: "Goals", icon: PiggyBank, pro: true },
  { href: "/pro", label: "Go Pro", icon: Sparkles, accent: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const logout = useAuth((s) => s.logout);

  if (!user) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-white/[0.06] bg-ink-900/80 backdrop-blur-xl max-lg:hidden">
      <div className="px-6 pt-7">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </div>

      <nav className="mt-10 flex-1 space-y-1 px-3.5">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href);
          const locked = item.pro && !user.pro;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-volt-500/[0.12] text-volt-300"
                  : item.accent
                    ? "text-zinc-300 hover:bg-white/[0.05]"
                    : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-full bg-volt-400"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon
                size={17}
                className={
                  item.accent && !active ? "text-volt-400" : active ? "text-volt-400" : "text-zinc-600 group-hover:text-zinc-400"
                }
              />
              <span className="flex-1">{item.label}</span>
              {locked && (
                <span className="rounded-md bg-volt-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-volt-400">
                  Pro
                </span>
              )}
              {item.accent && !locked && !user.pro && (
                <span className="h-1.5 w-1.5 rounded-full bg-volt-400" />
              )}
              {item.accent && user.pro && (
                <span className="rounded-md bg-volt-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-volt-400">
                  Active
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="glass flex items-center gap-3 p-3.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-ink-950 ${
              user.pro ? "bg-gradient-to-br from-volt-300 to-sky-300" : "bg-zinc-600"
            }`}
          >
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-zinc-100">{user.name.split(" ")[0]}</div>
            <div className="truncate text-[11px] text-zinc-500">
              {user.pro ? "Pro member" : "Free plan"}
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              toast.success("Logged out", "See you soon.");
              router.push("/login");
            }}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-zinc-200"
            aria-label="Log out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
