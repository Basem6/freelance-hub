import {
  DollarSign,
  TrendingUp,
  Clock,
  ArrowDownCircle,
  CheckCircle,
  Loader2,
  Wallet,
  Download,
} from "lucide-react";

import { MotionButton, MotionDiv } from "../../../components/ui/Motion";

const STATUS_CONFIG = {
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    color: "bg-blue-100 text-blue-700",
    icon: Loader2,
  },
};

const STAT_CARDS = [
  {
    id: "total",
    label: "Total Earned",
    value: "$0",
    sub: "All time",
    icon: DollarSign,
    gradient: "from-[#FF7A00] to-orange-400",
    bg: "bg-orange-50",
    text: "text-[#FF7A00]",
    trendUp: true,
  },
  {
    id: "month",
    label: "This Month",
    value: "0",
    sub: "August 2026",
    icon: TrendingUp,
    gradient: "from-violet-500 to-purple-400",
    bg: "bg-violet-50",
    text: "text-violet-600",
    trendUp: true,
  },
  {
    id: "pending",
    label: "Pending",
    value: "$0",
    sub: "Awaiting release",
    icon: Clock,
    gradient: "from-yellow-400 to-amber-300",
    bg: "bg-yellow-50",
    text: "text-yellow-600",
    trendUp: null,
  },
  {
    id: "withdrawn",
    label: "Withdrawn",
    value: "$0",
    sub: "To your bank",
    icon: Wallet,
    gradient: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    trendUp: null,
  },
];

export default function EarningsPage() {
  const filtered = [];

  return (
    <div className="flex min-h-screen bg-[#F8F8F8] text-gray-900 w-full">
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Earnings
            </h1>

            <p className="text-gray-500 mt-1">
              Track your income, payments, and withdrawals
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Export */}
            <button
              type="button"
              className="flex pointer-events-auto cursor-no-drop items-center space-x-2 px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download size={16} />
              <span>Export</span>
            </button>

            {/* Withdraw */}
            <MotionButton
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center pointer-events-auto cursor-no-drop space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#FF7A00] to-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-orange-200 hover:shadow-xl transition-all"
            >
              <ArrowDownCircle size={17} />
              <span>Withdraw Funds</span>
            </MotionButton>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {STAT_CARDS.map((card, i) => {
            const Icon = card.icon;

            return (
              <MotionDiv
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}
                  >
                    <Icon size={22} className={card.text} />
                  </div>
                </div>

                <p className="text-sm text-gray-500 mb-1">
                  {card.label}
                </p>

                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {card.sub}
                </p>
              </MotionDiv>
            );
          })}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-100 gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Transaction History
              </h2>

              <p className="text-xs text-gray-400 mt-0.5">
                {filtered.length} transactions
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {["all", "paid", "pending", "processing"].map((f) => (
                  <button
                    type="button"
                    key={f}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3.5">
                    Project
                  </th>

                  <th className="text-left px-6 py-3.5">
                    Client
                  </th>

                  <th className="text-left px-6 py-3.5">
                    Date
                  </th>

                  <th className="text-left px-6 py-3.5">
                    Status
                  </th>

                  <th className="text-right px-6 py-3.5">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((tx) => {
                  const StatusIcon =
                    STATUS_CONFIG[tx.status].icon;

                  return (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-[#FF7A00] transition-colors">
                          {tx.project}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {tx.client}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500">
                          {tx.date}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[tx.status].color}`}
                        >
                          <StatusIcon size={11} />

                          <span>
                            {STATUS_CONFIG[tx.status].label}
                          </span>
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <span
                          className={`text-sm font-bold ${
                            tx.status === "paid"
                              ? "text-green-600"
                              : "text-gray-700"
                          }`}
                        >
                          +${tx.amount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty State */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <DollarSign
                  size={36}
                  className="mb-3 opacity-30"
                />

                <p className="text-sm font-medium">
                  No transactions found
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}