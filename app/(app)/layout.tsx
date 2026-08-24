"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth, useCurrentUser } from "@/lib/auth";
import { useBank } from "@/lib/bank";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/app-shell";
import { LogoMark } from "@/components/logo";

function Splash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5">
      <div className="animate-pulse">
        <LogoMark size={52} />
      </div>
      <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/2 animate-[shimmer_1.2s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-volt-400 to-transparent bg-[length:200%_100%]" />
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useCurrentUser();
  const token = useAuth((s) => s.token);
  const ensureSeeded = useBank((s) => s.ensureSeeded);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && (!user || !token)) router.replace("/login");
  }, [mounted, user, token, router]);

  useEffect(() => {
    if (mounted && user) ensureSeeded(user.id, user.name);
  }, [mounted, user, ensureSeeded]);

  if (!mounted || !user || !token) return <Splash />;

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="pb-24 lg:pb-12 lg:pl-[240px]">
        <div className="mx-auto max-w-[1100px] px-5 pt-8 md:px-10 md:pt-10">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
