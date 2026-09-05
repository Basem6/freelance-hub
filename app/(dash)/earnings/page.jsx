'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { logout } from '@/app/lib/Features/authSlice';
import api from '@/app/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign, TrendingUp, Clock, ArrowDownCircle, CreditCard,
  CheckCircle, AlertCircle, Loader2, ArrowRight, ChevronDown,
  Wallet, BarChart2, Filter, Download, X, ArrowUpRight
} from 'lucide-react';
import EarningsChart from '@/components/dashboard/EarningsChart';
import OptionSelect from '@/components/ui/OptionSelect';

/* ─────────── Mock Data ─────────── */
const MOCK_TRANSACTIONS = [
  { id: 't1', project: 'E-Commerce Redesign', client: 'Sarah Johnson', amount: 1800, date: 'Aug 12, 2026', status: 'paid' },
  { id: 't2', project: 'Mobile App MVP', client: 'TechStart Inc.', amount: 2400, date: 'Aug 5, 2026', status: 'paid' },
  { id: 't3', project: 'Brand Identity Kit', client: 'Amira Hassan', amount: 950, date: 'Jul 28, 2026', status: 'pending' },
  { id: 't4', project: 'Dashboard Analytics', client: 'David Park', amount: 3200, date: 'Jul 15, 2026', status: 'paid' },
  { id: 't5', project: 'API Integration', client: 'Mike Chen', amount: 1200, date: 'Jul 10, 2026', status: 'processing' },
  { id: 't6', project: 'Landing Page Revamp', client: 'Nova Agency', amount: 700, date: 'Jun 30, 2026', status: 'paid' },
  { id: 't7', project: 'SEO Audit & Reports', client: 'Growth Co.', amount: 550, date: 'Jun 18, 2026', status: 'paid' },
  { id: 't8', project: 'CRM Customization', client: 'RetailPro', amount: 1600, date: 'Jun 5, 2026', status: 'pending' },
];

const STATUS_CONFIG = {
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Loader2 },
};

const STAT_CARDS = [
  {
    id: 'total',
    label: 'Total Earned',
    value: '$23,400',
    sub: 'All time',
    icon: DollarSign,
    gradient: 'from-[#FF7A00] to-orange-400',
    bg: 'bg-orange-50',
    text: 'text-[#FF7A00]',
    trend: '+18%',
    trendUp: true,
  },
  {
    id: 'month',
    label: 'This Month',
    value: '$4,200',
    sub: 'August 2026',
    icon: TrendingUp,
    gradient: 'from-violet-500 to-purple-400',
    bg: 'bg-violet-50',
    text: 'text-violet-600',
    trend: '+9%',
    trendUp: true,
  },
  {
    id: 'pending',
    label: 'Pending',
    value: '$2,550',
    sub: 'Awaiting release',
    icon: Clock,
    gradient: 'from-yellow-400 to-amber-300',
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
    trend: '2 payments',
    trendUp: null,
  },
  {
    id: 'withdrawn',
    label: 'Withdrawn',
    value: '$16,850',
    sub: 'To your bank',
    icon: Wallet,
    gradient: 'from-emerald-500 to-teal-400',
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    trend: 'Last: Aug 1',
    trendUp: null,
  },
];

/* ─────────── Withdraw Modal ─────────── */
function WithdrawModal({ onClose, available }) {
  const [withdrawMethod, setWithdrawMethod] = useState('Bank Account (****4242)');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'success'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <ArrowDownCircle size={20} className="text-[#FF7A00]" />
            <h2 className="text-lg font-bold text-gray-900">Withdraw Funds</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex justify-between items-center">
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-xl font-bold text-[#FF7A00]">${available}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="10"
                    max={available}
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] text-lg font-semibold"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Minimum withdrawal: $10.00</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Withdraw To</label>
                <OptionSelect value={withdrawMethod} options={['Bank Account (****4242)', 'PayPal (user@example.com)']} onChange={setWithdrawMethod} buttonClassName="bg-white px-4 py-3" />
              </div>

              <p className="text-xs text-gray-400">Withdrawals typically process in 1–3 business days.</p>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#FF7A00] to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Withdrawal Requested!</h3>
              <p className="text-gray-500 text-sm mb-6">
                ${amount} will be transferred to your bank account within 1–3 business days.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-gradient-to-r from-[#FF7A00] to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────── Main Page ─────────── */
export default function EarningsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get('/api/auth/me');
        if (!res.data.success) {
          dispatch(logout());
          router.push('/login');
          return;
        }
        if (res.data.user?.role === 'client') {
          router.push('/projects');
          return;
        }
      } catch {
        dispatch(logout());
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const filtered = filter === 'all'
    ? MOCK_TRANSACTIONS
    : MOCK_TRANSACTIONS.filter((t) => t.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center md:ml-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-[#FF7A00] animate-spin" />
          <p className="text-gray-400 text-sm">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F8F8] text-gray-900 md:ml-64">
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            <p className="text-gray-500 mt-1">Track your income, payments, and withdrawals</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
              <Download size={16} />
              <span>Export</span>
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowWithdraw(true)}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-[#FF7A00] to-orange-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-orange-200 hover:shadow-xl transition-all"
            >
              <ArrowDownCircle size={17} />
              <span>Withdraw Funds</span>
            </motion.button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {STAT_CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center`}>
                    <Icon size={22} className={card.text} />
                  </div>
                  {card.trendUp !== null ? (
                    <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${card.trendUp ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      <ArrowUpRight size={12} className="mr-0.5" />
                      {card.trend}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 font-medium">{card.trend}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Chart */}
        <div className="mb-8">
          <EarningsChart />
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border-b border-gray-100 gap-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">Transaction History</h2>
              <p className="text-xs text-gray-400 mt-0.5">{filtered.length} transactions</p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter size={14} className="text-gray-400" />
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {['all', 'paid', 'pending', 'processing'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
                      filter === f ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-6 py-3.5">Project</th>
                  <th className="text-left px-6 py-3.5">Client</th>
                  <th className="text-left px-6 py-3.5">Date</th>
                  <th className="text-left px-6 py-3.5">Status</th>
                  <th className="text-right px-6 py-3.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((tx, i) => {
                    const StatusIcon = STATUS_CONFIG[tx.status].icon;
                    return (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-[#FF7A00] transition-colors">{tx.project}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">{tx.client}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_CONFIG[tx.status].color}`}>
                            <StatusIcon size={11} />
                            <span>{STATUS_CONFIG[tx.status].label}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={`text-sm font-bold ${tx.status === 'paid' ? 'text-green-600' : 'text-gray-700'}`}>
                            +${tx.amount.toLocaleString()}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <DollarSign size={36} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdraw && (
          <WithdrawModal onClose={() => setShowWithdraw(false)} available="6,550" />
        )}
      </AnimatePresence>
    </div>
  );
}
