export type AccountType = "Everyday" | "Savings" | "Joint";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  number: string;
  balance: number;
  currency: string;
  gradient: string;
}

export type TxnCategory =
  | "Income"
  | "Groceries"
  | "Dining"
  | "Transport"
  | "Shopping"
  | "Subscriptions"
  | "Utilities"
  | "Travel"
  | "Health"
  | "Transfer"
  | "Cashback";

export interface Transaction {
  id: string;
  accountId: string;
  label: string;
  counterparty: string;
  category: TxnCategory;
  amount: number; // signed: + incoming, - outgoing
  date: string; // ISO
  status: "completed" | "pending";
  note?: string;
}

export type CardTheme = "volt" | "carbon" | "violet" | "sunset";

export interface BankCard {
  id: string;
  accountId: string;
  holder: string;
  last4: string;
  fullNumber: string;
  cvv: string;
  exp: string;
  frozen: boolean;
  theme: CardTheme;
  online: boolean;
  atm: boolean;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  icon: string; // lucide icon key
  monthly: number;
}

export interface BankData {
  accounts: Account[];
  transactions: Transaction[];
  cards: BankCard[];
  goals: Goal[];
  transfersUsed: number;
  transferCycle: string; // YYYY-MM of the free-tier counter
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  passHash: string;
  pro: boolean;
  proSince?: string;
  createdAt: string;
  supportTier: "standard" | "priority";
}

export const FREE_TRANSFER_LIMIT = 5;
export const PRO_PRICE = 9.99;

export const CATEGORIES: TxnCategory[] = [
  "Income",
  "Groceries",
  "Dining",
  "Transport",
  "Shopping",
  "Subscriptions",
  "Utilities",
  "Travel",
  "Health",
  "Transfer",
  "Cashback",
];
