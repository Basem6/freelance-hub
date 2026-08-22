'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { logout } from '@/app/lib/Features/authSlice';
import api from '@/app/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, Clock, CheckCircle, XCircle, ChevronRight,
  Search, Filter, DollarSign, Calendar, Eye, X,
  TrendingUp, AlertCircle, Send, Star
} from 'lucide-react';

/* ─────────── Mock Data ─────────── */
const MOCK_OFFERS = [
  {
    id: 'o1',
    projectTitle: 'E-Commerce Website Redesign',
    client: 'Sarah Johnson',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4',
    budget: 1800,
    myBid: 1650,
    deadline: 'Sep 15, 2026',
    submittedAt: 'Aug 10, 2026',
    status: 'pending',
    description: 'Complete redesign of an e-commerce platform with a modern UI, cart functionality, and payment gateway integration.',
    skills: ['React', 'Tailwind CSS', 'Stripe'],
    coverLetter: "I have 5+ years of experience building scalable e-commerce solutions and would love to help with your redesign...",
  },
  {
    id: 'o2',
    projectTitle: 'Mobile App for Fitness Tracking',
    client: 'TechStart Inc.',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techstart&backgroundColor=c0aede',
    budget: 3000,
    myBid: 2800,
    deadline: 'Oct 1, 2026',
    submittedAt: 'Aug 8, 2026',
    status: 'accepted',
    description: 'A cross-platform mobile app for tracking workouts, meals, and health metrics with real-time sync.',
    skills: ['React Native', 'Firebase', 'Node.js'],
    coverLetter: "Having built 3 fitness apps previously, I understand the importance of smooth UX and reliable syncing...",
  },
  {
    id: 'o3',
    projectTitle: 'Brand Identity & Logo Design',
    client: 'Amira Hassan',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amira&backgroundColor=ffd5dc',
    budget: 800,
    myBid: 750,
    deadline: 'Aug 30, 2026',
    submittedAt: 'Aug 5, 2026',
    status: 'rejected',
    description: 'Create a full brand identity including logo, color palette, typography, and brand guidelines.',
    skills: ['Figma', 'Illustrator', 'Branding'],
    coverLetter: 'I specialize in clean, minimal brand identities and my portfolio showcases...',
  },
  {
    id: 'o4',
    projectTitle: 'Dashboard Analytics Platform',
    client: 'David Park',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david&backgroundColor=d1f7c4',
    budget: 4500,
    myBid: 4200,
    deadline: 'Nov 10, 2026',
    submittedAt: 'Aug 3, 2026',
    status: 'pending',
    description: 'Build a data visualization dashboard with real-time charts, filters, and export capabilities.',
    skills: ['React', 'D3.js', 'PostgreSQL', 'GraphQL'],
    coverLetter: "I've built enterprise-grade analytics dashboards for companies like...",
  },
  {
    id: 'o5',
    projectTitle: 'API Integration & Automation',
    client: 'Mike Chen',
    clientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike&backgroundColor=b6e3f4',
    budget: 1200,
    myBid: 1100,
    deadline: 'Sep 5, 2026',
    submittedAt: 'Jul 28, 2026',
    status: 'accepted',
    description: 'Integrate third-party APIs (Slack, Notion, Google Sheets) and automate workflows with webhooks.',
    skills: ['Node.js', 'REST APIs', 'Webhooks'],
    coverLetter: "I specialize in API integration and automation...",
  },
];

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-400',
    icon: Clock,
  },
  accepted: {
    label: 'Accepted',
    color: 'bg-green-100 text-green-700 border-green-200',
    dot: 'bg-green-400',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-400',
    icon: XCircle,
  },
};

/* ─────────── Detail Modal ─────────── */
function OfferDetailModal({ offer, onClose }) {
  const cfg = STATUS_CONFIG[offer.status];
  const Icon = cfg.icon;

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
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[88vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1">{offer.projectTitle}</h2>
            <div className="flex items-center space-x-2">
              <img src={offer.clientAvatar} alt={offer.client} className="w-5 h-5 rounded-full" />
              <span className="text-sm text-gray-500">{offer.client}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
              <Icon size={11} />
              <span>{cfg.label}</span>
            </span>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Client Budget</p>
              <p className="text-lg font-bold text-gray-900">${offer.budget.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-xs text-[#FF7A00] mb-1">Your Bid</p>
              <p className="text-lg font-bold text-[#FF7A00]">${offer.myBid.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Deadline</p>
              <p className="text-sm font-semibold text-gray-800">{offer.deadline}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400 mb-1">Submitted</p>
              <p className="text-sm font-semibold text-gray-800">{offer.submittedAt}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Project Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{offer.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {offer.skills.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Cover Letter</h3>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-600 leading-relaxed italic">"{offer.coverLetter}"</p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          {offer.status === 'accepted' ? (
            <button className="w-full py-3 bg-gradient-to-r from-[#FF7A00] to-orange-500 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-orange-200 transition-all flex items-center justify-center space-x-2">
              <Send size={16} />
              <span>Go to Project</span>
            </button>
          ) : offer.status === 'pending' ? (
            <div className="flex space-x-3">
              <button className="flex-1 py-3 border border-red-200 text-red-600 rounded-xl font-medium text-sm hover:bg-red-50 transition-colors">
                Withdraw Offer
              </button>
              <button className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-100 transition-colors">
                Edit Bid
              </button>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-400">This offer was not accepted. Keep applying!</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────── Main Page ─────────── */
export default function MyOffersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState(MOCK_OFFERS);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOffer, setSelectedOffer] = useState(null);

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
        // Attempt to fetch real offers
        try {
          const offersRes = await api.get('/api/freelancer/myoffers');
          const data = offersRes?.data?.offers ?? offersRes?.data ?? [];
          if (Array.isArray(data) && data.length > 0) {
            setOffers(data);
          }
        } catch {
          // Use mock data if endpoint not available
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

  const stats = {
    total: offers.length,
    pending: offers.filter((o) => o.status === 'pending').length,
    accepted: offers.filter((o) => o.status === 'accepted').length,
    rejected: offers.filter((o) => o.status === 'rejected').length,
  };

  const filtered = offers.filter((o) => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch =
      o.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.client.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center md:ml-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-[#FF7A00] animate-spin" />
          <p className="text-gray-400 text-sm">Loading your offers...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">My Offers</h1>
            <p className="text-gray-500 mt-1">Track proposals you've submitted to clients</p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Offers', value: stats.total, icon: Briefcase, bg: 'bg-gray-100', text: 'text-gray-600' },
            { label: 'Pending Review', value: stats.pending, icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-600' },
            { label: 'Accepted', value: stats.accepted, icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-600' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, bg: 'bg-red-100', text: 'text-red-500' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center space-x-4"
              >
                <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={20} className={s.text} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Acceptance Rate Banner */}
        {stats.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-[#FF7A00] to-orange-500 rounded-2xl p-5 mb-8 text-white flex items-center justify-between shadow-lg shadow-orange-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-sm font-medium opacity-80">Acceptance Rate</p>
                <p className="text-2xl font-bold">
                  {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-80">{stats.accepted} accepted out of {stats.total}</p>
              <p className="text-xs opacity-60 mt-0.5">Keep improving your proposals!</p>
            </div>
          </motion.div>
        )}

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-3 border-b border-gray-100">
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
              {['all', 'pending', 'accepted', 'rejected'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                    filter === f ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {f}
                  {f !== 'all' && (
                    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      f === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      f === 'accepted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {stats[f]}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00]"
              />
            </div>
          </div>

          {/* Offers List */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <Briefcase size={32} className="text-[#FF7A00]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No offers found</h3>
              <p className="text-gray-400 text-sm">
                {filter !== 'all' ? `No ${filter} offers yet.` : 'Start applying to projects to see your offers here.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              <AnimatePresence>
                {filtered.map((offer, i) => {
                  const cfg = STATUS_CONFIG[offer.status];
                  const StatusIcon = cfg.icon;
                  const savingsPercent = Math.round(((offer.budget - offer.myBid) / offer.budget) * 100);

                  return (
                    <motion.div
                      key={offer.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedOffer(offer)}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 hover:bg-gray-50 cursor-pointer transition-colors group gap-4"
                    >
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={offer.clientAvatar}
                            alt={offer.client}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-orange-100 transition-all"
                          />
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${cfg.dot}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-[#FF7A00] transition-colors">
                            {offer.projectTitle}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">{offer.client}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="flex items-center space-x-1 text-xs text-gray-400">
                              <DollarSign size={12} />
                              <span>Budget: <strong className="text-gray-700">${offer.budget.toLocaleString()}</strong></span>
                            </span>
                            <span className="flex items-center space-x-1 text-xs text-[#FF7A00] font-semibold">
                              <Send size={11} />
                              <span>My Bid: ${offer.myBid.toLocaleString()}</span>
                            </span>
                            <span className="flex items-center space-x-1 text-xs text-gray-400">
                              <Calendar size={11} />
                              <span>{offer.submittedAt}</span>
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {offer.skills.slice(0, 3).map((skill) => (
                              <span key={skill} className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-medium">
                                {skill}
                              </span>
                            ))}
                            {offer.skills.length > 3 && (
                              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full">+{offer.skills.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end space-x-3 sm:space-x-0 sm:space-y-2 flex-shrink-0">
                        <span className={`inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                          <StatusIcon size={11} />
                          <span>{cfg.label}</span>
                        </span>
                        <div className="flex items-center space-x-1 text-gray-300 group-hover:text-[#FF7A00] transition-colors">
                          <Eye size={14} />
                          <ChevronRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedOffer && (
          <OfferDetailModal offer={selectedOffer} onClose={() => setSelectedOffer(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
