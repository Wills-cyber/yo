import { Account, BankData, BankCard, Transaction, TxnCategory } from "./types";
import { cardNumber, uid } from "./utils";

const firstNames = ["Ava", "Liam", "Noah", "Mia", "Ethan", "Sofia", "Lucas", "Zoe", "Kai", "Nora"];
const merchantPool: Array<[string, string, TxnCategory, [number, number]]> = [
  ["Whole Foods Market", "Whole Foods", "Groceries", [18, 140]],
  ["Trader Joe's", "Trader Joe's", "Groceries", [12, 90]],
  ["Blue Bottle Coffee", "Blue Bottle", "Dining", [4, 16]],
  ["Chipotle", "Chipotle", "Dining", [9, 24]],
  ["Sweetgreen", "Sweetgreen", "Dining", [11, 22]],
  ["Uber", "Uber", "Transport", [8, 42]],
  ["Lyft", "Lyft", "Transport", [7, 35]],
  ["Shell", "Shell", "Transport", [25, 70]],
  ["Amazon", "Amazon", "Shopping", [10, 160]],
  ["Apple Store", "Apple", "Shopping", [19, 220]],
  ["H&M", "H&M", "Shopping", [15, 120]],
  ["Netflix", "Netflix", "Subscriptions", [9, 18]],
  ["Spotify", "Spotify", "Subscriptions", [10, 12]],
  ["iCloud+", "Apple", "Subscriptions", [1, 4]],
  ["City Power & Light", "City Power", "Utilities", [38, 120]],
  ["Comcast", "Comcast", "Utilities", [30, 80]],
  ["Delta Airlines", "Delta", "Travel", [140, 520]],
  ["Airbnb", "Airbnb", "Travel", [90, 360]],
  ["CVS Pharmacy", "CVS", "Health", [6, 58]],
  ["Gym Membership", "Equinox", "Health", [45, 90]],
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(8 + Math.random() * 12), Math.floor(Math.random() * 59), 0, 0);
  return d.toISOString();
}

export function seedBank(name: string): BankData {
  const everyday: Account = {
    id: uid("acc"),
    name: "Everyday",
    type: "Everyday",
    number: "NB " + String(Math.floor(10000000 + Math.random() * 89999999)),
    balance: 4820.42,
    currency: "USD",
    gradient: "from-volt-500/20 to-emerald-400/5",
  };
  const savings: Account = {
    id: uid("acc"),
    name: "High-yield Vault",
    type: "Savings",
    number: "NB " + String(Math.floor(10000000 + Math.random() * 89999999)),
    balance: 16450.0,
    currency: "USD",
    gradient: "from-sky-400/15 to-violet-500/5",
  };

  const txns: Transaction[] = [];

  // Salary on the 1st of the last 3 months
  for (let m = 0; m < 3; m++) {
    const d = new Date();
    d.setMonth(d.getMonth() - m, 1);
    d.setHours(9, 0, 0, 0);
    txns.push({
      id: uid("txn"),
      accountId: everyday.id,
      label: "Salary — Northwind Labs",
      counterparty: "Northwind Labs",
      category: "Income",
      amount: 6350,
      date: d.toISOString(),
      status: "completed",
    });
  }

  // Random spend over last 45 days
  for (let i = 0; i < 42; i++) {
    const [label, cp, cat, [lo, hi]] = pick(merchantPool);
    const amount = +(lo + Math.random() * (hi - lo)).toFixed(2);
    txns.push({
      id: uid("txn"),
      accountId: everyday.id,
      label,
      counterparty: cp,
      category: cat,
      amount: -amount,
      date: daysAgo(Math.floor(Math.random() * 45)),
      status: Math.random() > 0.97 ? "pending" : "completed",
    });
  }

  // A couple of inbound transfers + cashback
  [...Array(4)].forEach(() => {
    txns.push({
      id: uid("txn"),
      accountId: everyday.id,
      label: `Transfer from ${pick(firstNames)}`,
      counterparty: pick(firstNames),
      category: "Transfer",
      amount: +(25 + Math.random() * 300).toFixed(2),
      date: daysAgo(Math.floor(Math.random() * 30)),
      status: "completed",
    });
  });
  txns.push({
    id: uid("txn"),
    accountId: everyday.id,
    label: "Monthly interest",
    counterparty: "NovaBank",
    category: "Income",
    amount: 41.85,
    date: daysAgo(6),
    status: "completed",
  });

  txns.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  const num = cardNumber();
  const card: BankCard = {
    id: uid("card"),
    accountId: everyday.id,
    holder: name.toUpperCase(),
    last4: num.slice(-4),
    fullNumber: num,
    cvv: String(Math.floor(100 + Math.random() * 900)),
    exp: "08/29",
    frozen: false,
    theme: "volt",
    online: true,
    atm: true,
  };

  return {
    accounts: [everyday, savings],
    transactions: txns,
    cards: [card],
    goals: [
      { id: uid("goal"), name: "Japan trip", target: 3200, saved: 1140, icon: "plane", monthly: 300 },
      { id: uid("goal"), name: "Emergency fund", target: 10000, saved: 6800, icon: "shield", monthly: 500 },
    ],
    transfersUsed: 0,
    transferCycle: monthKeyNow(),
  };
}

function monthKeyNow() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
