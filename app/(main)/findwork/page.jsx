'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SlidersHorizontal, X, Star, Clock, Users, DollarSign,
  ChevronDown, CheckCircle, Briefcase, ArrowRight, Bookmark,
  AlertCircle, Loader2, Filter, TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import api from '../../utils/api';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'All', 'Web Development', 'UI/UX Design', 'Mobile Apps',
  'AI & Machine Learning', 'Digital Marketing', 'Content Writing',
  'Data Analysis', 'Graphic Design',
];

const EXPERIENCE_LABELS = { entry: 'Entry Level', intermediate: 'Intermediate', expert: 'Expert' };
const STATUS_LABELS = { open: 'Open', closed: 'Closed' };
const BUDGET_LABELS = { fixed: 'Fixed Price' };

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'budget_high', label: 'Highest Budget' },
  { value: 'budget_low', label: 'Lowest Budget' },
  { value: 'proposals_low', label: 'Fewest Proposals' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(date) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 30) {
    return `${days} days ago`;
  }

  const months = Math.floor(days / 30);

  if (months < 12) {
    return `${months} months ago`;
  }

  const years = Math.floor(months / 12);

  return `${years} years ago`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
        </div>
        <div className="h-5 w-5 bg-gray-100 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-gray-100 rounded-lg" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(i => <div key={i} className="h-7 w-16 bg-gray-100 rounded-full" />)}
      </div>
      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-32 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project: p }) {
  const [bookmarked, setBookmarked] = useState(false);
  const shown = p.skills.slice(0, 5);
  const extra = p.skills.length - 5;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden"
    >
      {/* Orange top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF7A00] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="p-6 space-y-4">
        {/* Badges + Bookmark */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${p.status === 'open' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`} />
              {STATUS_LABELS[p.status]}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#FF7A00] border border-orange-200">
              {p.category}
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
              {BUDGET_LABELS["fixed"]}
            </span>
          </div>
          <button
            onClick={() => setBookmarked(v => !v)}
            className={`shrink-0 p-1.5 rounded-full border transition-all ${bookmarked ? 'bg-orange-50 border-orange-200 text-[#FF7A00]' : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'}`}
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Title + Description */}
        <div>
          <h3 className="text-base font-bold text-[#111111] leading-snug mb-1.5 group-hover:text-[#FF7A00] transition-colors line-clamp-2">
            {p.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{p.description}</p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {shown.map((s , i) => (
            <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors">
              {s}
            </span>
          ))}
          
        </div>

        {/* Client */}
        <div className="flex items-center gap-2.5 py-3 px-3 bg-gray-50 rounded-xl border border-gray-100">
          <div className="size-8 rounded-full overflow-hidden">
          <Image
            src={p.clientId?.image || "/avatars/avatar-1.png"}
            alt={p.clientId?.fullName || "Client"}
            width={8}
            height={8}
            className="w-full h-full object-cover"
          />
        </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-800 truncate">{p.clientId.fullName}</span>
              {/* {p.clientId && <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />} */}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="w-3 h-3 fill-[#FF7A00] text-[#FF7A00]" />
              <span className="font-medium">{p.clientId.rating ||0}</span>
              <span>({p.clientId.reviews || 0}  reviews)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-gray-100">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span className="font-semibold text-gray-800">{p.budget}</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {p.proposals || 0} proposals
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeAgo(p.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {/* {EXPERIENCE_LABELS[p.experience]} */}
            </span>
          </div>
          <Link
            href={`/findworks/${p._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-orange-400 text-white text-xs font-bold rounded-xl shadow shadow-orange-400/30 hover:shadow-md hover:shadow-orange-400/40 transition-all shrink-0"
          >
            View Project <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Filters Panel ────────────────────────────────────────────────────────────
function FiltersPanel({ filters, setFilters }) {
  const toggle = (key, value) =>
    setFilters(prev => {
      const arr = prev[key] || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });

  const CheckRow = ({ id, label, checked, onChange }) => (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer group py-0.5">
      <input id={id} type="checkbox" checked={checked} onChange={onChange}
        className="w-4 h-4 accent-[#FF7A00] rounded cursor-pointer" />
      <span className="text-sm text-gray-600 group-hover:text-[#FF7A00] transition-colors">{label}</span>
    </label>
  );

  return (
    <div className="space-y-7">
      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Category</p>
        <div className="space-y-1">
          {CATEGORIES.filter(c => c !== 'All').map(cat => (
            <CheckRow key={cat} id={`cat-${cat}`} label={cat}
              checked={(filters.categories || []).includes(cat)}
              onChange={() => toggle('categories', cat)} />
          ))}
        </div>
      </div>

      {/* Project Type */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Project Type</p>
        <div className="space-y-1">
          {['fixed', 'hourly'].map(t => (
            <CheckRow key={t} id={`type-${t}`} label={BUDGET_LABELS[t]}
              checked={(filters.budgetTypes || []).includes(t)}
              onChange={() => toggle('budgetTypes', t)} />
          ))}
        </div>
      </div>


      {/* Budget */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Budget ($)</p>
        <div className="space-y-2">
          {[['Min', 'budgetMin', '0'], ['Max', 'budgetMax', '50,000']].map(([label, key, ph]) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <input type="number" placeholder={ph}
                value={filters[key] ?? ''}
                onChange={e => setFilters(p => ({ ...p, [key]: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#FF7A00] focus:ring-2 focus:ring-[#FF7A00]/20 transition-all" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Active Chips ─────────────────────────────────────────────────────────────
function ActiveChips({ filters, setFilters }) {
  const chips = [
    ...(filters.categories || []).map(c => ({ label: c, remove: () => setFilters(p => ({ ...p, categories: p.categories.filter(v => v !== c) })) })),
    ...(filters.budgetTypes || []).map(t => ({ label: BUDGET_LABELS[t], remove: () => setFilters(p => ({ ...p, budgetTypes: p.budgetTypes.filter(v => v !== t) })) })),
    ...(filters.experience || []).map(e => ({ label: EXPERIENCE_LABELS[e], remove: () => setFilters(p => ({ ...p, experience: p.experience.filter(v => v !== e) })) })),
    ...(filters.statuses || []).map(s => ({ label: STATUS_LABELS[s], remove: () => setFilters(p => ({ ...p, statuses: p.statuses.filter(v => v !== s) })) })),
    ...(filters.budgetMin !== undefined ? [{ label: `Min $${filters.budgetMin}`, remove: () => setFilters(p => ({ ...p, budgetMin: undefined })) }] : []),
    ...(filters.budgetMax !== undefined ? [{ label: `Max $${filters.budgetMax}`, remove: () => setFilters(p => ({ ...p, budgetMax: undefined })) }] : []),
  ];
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      {chips.map((c, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-orange-50 border border-orange-200 text-[#FF7A00] text-xs font-semibold rounded-full">
          {c.label}
          <button onClick={c.remove} className="hover:text-orange-800 transition-colors"><X className="w-3 h-3" /></button>
        </span>
      ))}
      <button onClick={() => setFilters({})} className="text-xs text-gray-400 hover:text-red-500 font-medium underline underline-offset-2 transition-colors">
        Clear all
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FindWorkPage() {
  const [MOCK_PROJECTS , setMOCK_PROJECTS] = useState([])
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('newest');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  console.log("Dd")
  console.log(MOCK_PROJECTS)
  useEffect(() =>  { 
    const alldata = async function () {
      try {
          const response = await api.get('/projects');
          const data = response.data.projects
          console.log(data[0])
          setMOCK_PROJECTS(data)
      } catch (error) {
          console.error('Error creating project:', error);
      } finally {
          setLoading(false)
      }
    }
    alldata()
  },[]);
  console.log(MOCK_PROJECTS)
  const filtered = useMemo(() => {
    let r = [...MOCK_PROJECTS]
      if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(f => f.name.toLowerCase().includes(q) || f.title.toLowerCase().includes(q) || f.bio.toLowerCase().includes(q) || f.skills.some(s => s.toLowerCase().includes(q)));
    }
    if (activeCategory !== 'All') r = r.filter(f => f.category === activeCategory);
    if (filters.categories?.length) r = r.filter(f => filters.categories.includes(f.category));
    r.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'rate_low') return a.hourlyRate - b.hourlyRate;
      if (sort === 'rate_high') return b.hourlyRate - a.hourlyRate;
      if (sort === 'projects') return b.completedProjects - a.completedProjects;
      return 0;
    });
    return r;
  }, [search, activeCategory, filters, sort , MOCK_PROJECTS]);
  const activeFilterCount =
    (filters.categories?.length || 0) + (filters.budgetTypes?.length || 0) +
    (filters.experience?.length || 0) + (filters.statuses?.length || 0) +
    (filters.budgetMin !== undefined ? 1 : 0) + (filters.budgetMax !== undefined ? 1 : 0);

  const hasFilters = activeFilterCount > 0;
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  return (
    <div className="min-h-screen bg-[#F8F8F8]">

      {/* ── Body ── */}
      <div className="px-4 sm:px-6 py-8">
        <div className="flex gap-7">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block mt-15 ">
            <div className=" bg-white sticky top-1 rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" /> Filters
                </h3>
                {hasFilters && (
                  <button onClick={() => setFilters({})} className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium">
                    Clear
                  </button>
                )}
              </div>
              <FiltersPanel filters={filters} setFilters={setFilters} />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0 mt-15">
            

            {/* Cards */}
            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                  <AlertCircle className="w-10 h-10 text-[#FF7A00]" />
                </div>
                <h3 className="text-xl font-bold text-[#111111] mb-2">No projects found</h3>
                <p className="text-gray-500 text-sm max-w-xs mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('All'); setFilters({}); }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#FF7A00] to-orange-400 text-white text-sm font-bold rounded-xl shadow shadow-orange-400/30 hover:shadow-md transition-all">
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <AnimatePresence mode="popLayout">
                    {visible.map((p , i) => <ProjectCard key={i} project={p} />)}
                  </AnimatePresence>
                </div>
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button onClick={() => setVisibleCount(v => v + 6)}
                      className="px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-[#FF7A00] hover:text-[#FF7A00] shadow-sm transition-all">
                      Load More ({filtered.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 max-w-[85vw] bg-white shadow-2xl lg:hidden flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
                <h3 className="font-bold text-[#111111] flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" /> Filters
                </h3>
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                <FiltersPanel filters={filters} setFilters={setFilters} />
              </div>
              <div className="p-5 border-t border-gray-100 space-y-2 shrink-0">
                <button onClick={() => setDrawerOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-[#FF7A00] to-orange-400 text-white text-sm font-bold rounded-xl shadow shadow-orange-400/30">
                  Show {filtered.length} Results
                </button>
                {hasFilters && (
                  <button onClick={() => setFilters({})}
                    className="w-full py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:border-red-300 hover:text-red-500 transition-all">
                    Clear All Filters
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
