import { mockTransactions } from "@/data/mockTransactions";
import { formatDistanceToNow } from "date-fns";

export default function TransactionsPage() {
  const items = mockTransactions;
  const balance = items.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Transactions</h1>
          <p className="text-sm text-slate-500">Stakes, winnings, payouts, and fees</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          Net: ${balance}
        </div>
      </header>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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


