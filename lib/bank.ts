"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Account,
  BankCard,
  BankData,
  CardTheme,
  FREE_TRANSFER_LIMIT,
  Goal,
  Transaction,
} from "./types";
import { monthKey, uid } from "./utils";
import { seedBank } from "./seed";

type Result = { ok: boolean; error?: string };

interface BankState {
  byUser: Record<string, BankData>;
  ensureSeeded: (userId: string, name: string) => void;
  transfer: (
    userId: string,
    pro: boolean,
    fromId: string,
    amount: number,
    to: { kind: "internal"; accountId: string } | { kind: "external"; recipient: string },
    note?: string
  ) => Result;
  topUp: (userId: string, accountId: string, amount: number) => Result;
  toggleFreeze: (userId: string, cardId: string) => void;
  toggleCardSetting: (userId: string, cardId: string, key: "online" | "atm") => void;
  setCardTheme: (userId: string, cardId: string, theme: CardTheme) => void;
  addGoal: (userId: string, goal: Omit<Goal, "id" | "saved">) => void;
  fundGoal: (userId: string, goalId: string, fromAccountId: string, amount: number) => Result;
}

const patch = (
  state: BankState,
  userId: string,
  fn: (d: BankData) => BankData
): Pick<BankState, "byUser"> => ({
  byUser: { ...state.byUser, [userId]: fn(state.byUser[userId]) },
});

const refreshCycle = (d: BankData): BankData =>
  d.transferCycle === monthKey() ? d : { ...d, transferCycle: monthKey(), transfersUsed: 0 };

export const useBank = create<BankState>()(
  persist(
    (set, get) => ({
      byUser: {},

      ensureSeeded: (userId, name) => {
        const s = get();
        if (!s.byUser[userId]) {
          set((st) => ({ byUser: { ...st.byUser, [userId]: seedBank(name) } }));
        } else {
          set((st) => patch(st as BankState, userId, refreshCycle));
        }
      },

      transfer: (userId, pro, fromId, amount, to, note) => {
        const data = get().byUser[userId];
        if (!data) return { ok: false, error: "Account data missing." };
        const from = data.accounts.find((a) => a.id === fromId);
        if (!from) return { ok: false, error: "Source account not found." };
        if (!isFinite(amount) || amount <= 0) return { ok: false, error: "Enter a valid amount." };
        if (amount > from.balance) return { ok: false, error: "Insufficient funds in this account." };

        const isExternal = to.kind === "external";
        if (isExternal && !pro && data.transfersUsed >= FREE_TRANSFER_LIMIT)
          return {
            ok: false,
            error: `Free plan limit reached (${FREE_TRANSFER_LIMIT} external transfers/month). Upgrade to Pro for unlimited transfers.`,
          };
        if (isExternal && to.kind === "external" && to.recipient.trim().length < 2)
          return { ok: false, error: "Enter a recipient name." };

        set((st) =>
          patch(st as BankState, userId, (d) => {
            const dOut: Transaction = {
              id: uid("txn"),
              accountId: fromId,
              label: isExternal
                ? `Sent to ${(to as { recipient: string }).recipient.trim()}`
                : `Transfer to ${d.accounts.find((a) => to.kind === "internal" && a.id === to.accountId)?.name}`,
              counterparty: isExternal ? (to as { recipient: string }).recipient.trim() : "NovaBank internal",
              category: "Transfer",
              amount: -amount,
              date: new Date().toISOString(),
              status: isExternal ? "pending" : "completed",
              note,
            };
            const accounts: Account[] = d.accounts.map((a) => {
              if (a.id === fromId) return { ...a, balance: +(a.balance - amount).toFixed(2) };
              if (to.kind === "internal" && a.id === to.accountId)
                return { ...a, balance: +(a.balance + amount).toFixed(2) };
              return a;
            });
            const credit: Transaction[] =
              to.kind === "internal"
                ? [
                    {
                      ...dOut,
                      id: uid("txn"),
                      accountId: to.accountId,
                      label: `Transfer from ${from.name}`,
                      amount,
                    },
                  ]
                : [];
            return {
              ...d,
              accounts,
              transactions: [dOut, ...credit, ...d.transactions],
              transfersUsed: isExternal ? d.transfersUsed + 1 : d.transfersUsed,
            };
          })
        );
        return { ok: true };
      },

      topUp: (userId, accountId, amount) => {
        if (!isFinite(amount) || amount <= 0) return { ok: false, error: "Enter a valid amount." };
        if (amount > 10000) return { ok: false, error: "Demo top-ups are capped at $10,000." };
        set((st) =>
          patch(st as BankState, userId, (d) => ({
            ...d,
            accounts: d.accounts.map((a) =>
              a.id === accountId ? { ...a, balance: +(a.balance + amount).toFixed(2) } : a
            ),
            transactions: [
              {
                id: uid("txn"),
                accountId,
                label: "Instant top-up",
                counterparty: "NovaBank",
                category: "Income",
                amount,
                date: new Date().toISOString(),
                status: "completed",
              },
              ...d.transactions,
            ],
          }))
        );
        return { ok: true };
      },

      toggleFreeze: (userId, cardId) =>
        set((st) =>
          patch(st as BankState, userId, (d) => ({
            ...d,
            cards: d.cards.map((c) => (c.id === cardId ? { ...c, frozen: !c.frozen } : c)),
          }))
        ),

      toggleCardSetting: (userId, cardId, key) =>
        set((st) =>
          patch(st as BankState, userId, (d) => ({
            ...d,
            cards: d.cards.map((c) => (c.id === cardId ? { ...c, [key]: !c[key] } : c)),
          }))
        ),

      setCardTheme: (userId, cardId, theme) =>
        set((st) =>
          patch(st as BankState, userId, (d) => ({
            ...d,
            cards: d.cards.map((c) => (c.id === cardId ? { ...c, theme } : c)),
          }))
        ),

      addGoal: (userId, goal) =>
        set((st) =>
          patch(st as BankState, userId, (d) => ({
            ...d,
            goals: [...d.goals, { ...goal, id: uid("goal"), saved: 0 }],
          }))
        ),

      fundGoal: (userId, goalId, fromAccountId, amount) => {
        const data = get().byUser[userId];
        const from = data?.accounts.find((a) => a.id === fromAccountId);
        const goal = data?.goals.find((g) => g.id === goalId);
        if (!from || !goal) return { ok: false, error: "Goal or account not found." };
        if (!isFinite(amount) || amount <= 0) return { ok: false, error: "Enter a valid amount." };
        if (amount > from.balance) return { ok: false, error: "Insufficient funds in this account." };
        set((st) =>
          patch(st as BankState, userId, (d) => ({
            ...d,
            accounts: d.accounts.map((a) =>
              a.id === fromAccountId ? { ...a, balance: +(a.balance - amount).toFixed(2) } : a
            ),
            goals: d.goals.map((g) =>
              g.id === goalId ? { ...g, saved: +(g.saved + amount).toFixed(2) } : g
            ),
            transactions: [
              {
                id: uid("txn"),
                accountId: fromAccountId,
                label: `Saved toward “${goal.name}”`,
                counterparty: "NovaBank goals",
                category: "Transfer",
                amount: -amount,
                date: new Date().toISOString(),
                status: "completed",
              },
              ...d.transactions,
            ],
          }))
        );
        return { ok: true };
      },
    }),
    { name: "novabank:bank" }
  )
);

export const useBankData = (userId: string | null | undefined): BankData | null => {
  const byUser = useBank((s) => s.byUser);
  return userId ? byUser[userId] ?? null : null;
};
