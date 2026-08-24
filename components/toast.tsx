"use client";

import { create } from "zustand";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { uid } from "@/lib/utils";

type ToastKind = "success" | "error" | "pro";
interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  body?: string;
}

interface ToastState {
  toasts: Toast[];
  push: (kind: ToastKind, title: string, body?: string) => void;
  dismiss: (id: string) => void;
}

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (kind, title, body) => {
    const id = uid("toast");
    set((s) => ({ toasts: [...s.toasts.slice(-3), { id, kind, title, body }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 5200);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (title: string, body?: string) => useToasts.getState().push("success", title, body),
  error: (title: string, body?: string) => useToasts.getState().push("error", title, body),
  pro: (title: string, body?: string) => useToasts.getState().push("pro", title, body),
};

const config: Record<ToastKind, { icon: typeof CheckCircle2; cls: string }> = {
  success: { icon: CheckCircle2, cls: "text-mint border-mint/30" },
  error: { icon: XCircle, cls: "text-rose-400 border-rose-400/30" },
  pro: { icon: Sparkles, cls: "text-volt-400 border-volt-500/40" },
};

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  const dismiss = useToasts((s) => s.dismiss);
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[340px] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => {
          const C = config[t.kind];
          const Icon = C.icon;
          return (
            <motion.button
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={() => dismiss(t.id)}
              className={`glass pointer-events-auto flex items-start gap-3 border p-4 text-left shadow-card ${C.cls.split(" ")[1]}`}
            >
              <Icon size={20} className={`mt-0.5 shrink-0 ${C.cls.split(" ")[0]}`} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-zinc-100">{t.title}</span>
                {t.body && <span className="mt-0.5 block text-xs leading-relaxed text-zinc-400">{t.body}</span>}
              </span>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
