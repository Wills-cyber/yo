# ⚡ NovaBank — Simulated Banking App

A fully simulated neobank built with **Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Recharts and Zustand**. No real money, no backend — the entire "bank" (auth, balances, transfers, cards, goals) runs in your browser via `localStorage`.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Or a production build:

```bash
npm run build && npm start
```

## Features

### Auth
- **Register** with validation, live password-strength meter, and demo acknowledgement
- **Login / logout** with salted demo-grade hashing and session tokens (per-device, localStorage)
- Route-guarded app area with animated splash while the session resolves

### Core banking
- **Dashboard** — animated net-worth counter, money in/out this month, 30-day balance-trend chart, account vaults, recent activity
- **Transfers** — send to anyone (external) or move between your own accounts; balance checks, fee summary, animated confirmation
- **Instant top-ups** — capped demo deposits with quick-amount chips
- **Cards** — flippable virtual card (reveal number/CVV), freeze/unfreeze, online & ATM toggles, card finishes/themes
- **Analytics** — category donut, 6-month cash-flow bars, month comparison strip

### Pro tier ($9.99/mo in demo dollars)
Simulated checkout (test card prefilled) unlocks:
- **Unlimited external transfers** (free plan: 5/month, enforced and counted)
- **30-day cash-flow forecast** with confidence band
- **AI-style spending insights** (top category, savings rate, subscription audit)
- **Savings goals** with progress rings, monthly pacing and funding flows
- **Ultraviolet & Sunset** premium card finishes
- Pro badge, priority-support flavor, and one-click cancel

Pro-locked surfaces render behind a blurred `ProGate` overlay so free users can preview what they're missing.

## Project layout

```
app/
  page.tsx              # landing
  (auth)/login|register # split-screen auth
  (app)/                # guarded app shell (sidebar + mobile nav)
    dashboard  transfer  cards  analytics  goals  pro
components/             # sidebar, toasts, card art, pro gate, txn rows…
lib/
  auth.ts  bank.ts      # zustand stores (persisted to localStorage)
  seed.ts               # realistic simulated account history
  types.ts  utils.ts
```

## Notes

- This is a **simulation for demonstration purposes** — credentials and "money" never leave your browser and the password hashing is demo-grade only.
- Fonts are self-hosted via Fontsource (no external font fetching).
