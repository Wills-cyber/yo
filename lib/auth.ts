"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "./types";
import { hashPass, uid } from "./utils";

interface AuthState {
  users: UserProfile[];
  userId: string | null;
  token: string | null;
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  upgradeToPro: () => void;
  downgrade: () => void;
}

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      userId: null,
      token: null,

      register: (name, email, password) => {
        name = name.trim();
        email = email.trim().toLowerCase();
        if (name.length < 2) return { ok: false, error: "Please enter your full name." };
        if (!emailOk(email)) return { ok: false, error: "That email address doesn't look right." };
        if (password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
        if (get().users.some((u) => u.email === email))
          return { ok: false, error: "An account with this email already exists." };

        const user: UserProfile = {
          id: uid("usr"),
          name,
          email,
          passHash: hashPass(password, email),
          pro: false,
          createdAt: new Date().toISOString(),
          supportTier: "standard",
        };
        set((s) => ({
          users: [...s.users, user],
          userId: user.id,
          token: uid("tok"),
        }));
        return { ok: true };
      },

      login: (email, password) => {
        email = email.trim().toLowerCase();
        const user = get().users.find((u) => u.email === email);
        if (!user) return { ok: false, error: "No account found for this email." };
        if (user.passHash !== hashPass(password, email))
          return { ok: false, error: "Incorrect password. Try again." };
        set({ userId: user.id, token: uid("tok") });
        return { ok: true };
      },

      logout: () => set({ userId: null, token: null }),

      upgradeToPro: () =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === s.userId
              ? { ...u, pro: true, proSince: new Date().toISOString(), supportTier: "priority" }
              : u
          ),
        })),

      downgrade: () =>
        set((s) => ({
          users: s.users.map((u) =>
            u.id === s.userId ? { ...u, pro: false, proSince: undefined, supportTier: "standard" } : u
          ),
        })),
    }),
    { name: "novabank:auth" }
  )
);

export const useCurrentUser = () => {
  const users = useAuth((s) => s.users);
  const userId = useAuth((s) => s.userId);
  return users.find((u) => u.id === userId) ?? null;
};
