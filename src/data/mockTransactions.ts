import type { Transaction } from "@/types/money";

const hoursAgo = (h: number) => {
  const d = new Date();
  d.setHours(d.getHours() - h);
  return d;
};

export const mockTransactions: Transaction[] = [
  { id: "tx1", type: "win", amount: 50, description: "Won 7-Day Gym Sprint", relatedId: "ch1", createdAt: hoursAgo(6), status: "completed" },
  { id: "tx2", type: "stake", amount: -10, description: "Stake for Meditation Duel", relatedId: "ch2", createdAt: hoursAgo(14), status: "completed" },
  { id: "tx3", type: "payout", amount: -25, description: "Payout to bank", createdAt: hoursAgo(24), status: "completed" },
  { id: "tx4", type: "refund", amount: 10, description: "Refund from cancelled challenge", relatedId: "ch3", createdAt: hoursAgo(40), status: "completed" },
  { id: "tx5", type: "fee", amount: -2, description: "Platform fee", createdAt: hoursAgo(40), status: "completed" },
];


