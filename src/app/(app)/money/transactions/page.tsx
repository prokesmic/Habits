import { mockTransactions } from "@/data/mockTransactions";
import { formatDistanceToNow } from "date-fns";

export default function TransactionsPage() {
  const items = mockTransactions;
  const balance = items.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 p-6 text-white shadow-sm shadow-slate-900/10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <span>💰</span>
              <span>Money</span>
            </span>
            <div>
              <h1 className="text-2xl font-semibold md:text-3xl">Transactions</h1>
              <p className="mt-1 text-sm opacity-95">Stakes, winnings, payouts, and fees</p>
            </div>
          </div>
          <div className="rounded-2xl bg-white/20 px-4 py-2 text-sm font-semibold">
            Net: ${balance}
          </div>
        </div>
      </section>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-2 py-2">Type</th>
              <th className="px-2 py-2">Amount</th>
              <th className="px-2 py-2">Description</th>
              <th className="px-2 py-2">When</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t border-slate-100">
                <td className="px-2 py-2 capitalize">{t.type}</td>
                <td className={`px-2 py-2 font-semibold ${t.amount >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {t.amount >= 0 ? "+" : "-"}${Math.abs(t.amount)}
                </td>
                <td className="px-2 py-2">{t.description}</td>
                <td className="px-2 py-2 text-slate-500">{formatDistanceToNow(t.createdAt, { addSuffix: true })}</td>
                <td className="px-2 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      t.status === "completed"
                        ? "border border-green-200 bg-green-50 text-green-700"
                        : t.status === "pending"
                        ? "border border-amber-200 bg-amber-50 text-amber-700"
                        : "border border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


