export type TransactionType = "stake" | "win" | "payout" | "refund" | "fee";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // positive for inflow, negative for outflow
  description: string;
  relatedId?: string; // challenge or stake id
  createdAt: Date;
  status: "pending" | "completed" | "failed";
}


