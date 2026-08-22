'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import {
  Search, SlidersHorizontal, X, Star, BadgeCheck, DollarSign,
  ChevronDown, CheckCircle, AlertCircle, Loader2, Filter,
  ArrowRight, Users, Globe, Zap,
} from 'lucide-react';
import Link from 'next/link';
import api from '../../utils/api';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  'All', 'Web Development', 'UI/UX Design', 'Mobile Apps',
  'AI & Machine Learning', 'Digital Marketing', 'Content Writing',
  'Data Analysis', 'Graphic Design',
];


const EXPERIENCE_LABELS = { entry: 'Entry Level', intermediate: 'Intermediate', expert: 'Expert' };
const AVAILABILITY_LABELS = { available: 'Available Now', busy: 'Unavailable' };

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'rate_low', label: 'Lowest Rate' },
  { value: 'rate_high', label: 'Highest Rate' },
  { value: 'projects', label: 'Most Projects' },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-1/2 bg-gray-100 rounded" />
          <div className="h-4 w-2/3 bg-gray-100 rounded" />
          <div className="h-3 w-1/3 bg-gray-100 rounded" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-4/5 bg-gray-100 rounded" />
      </div>
      <div className="flex gap-2">
        {[1,2,3].map(i => <div key={i} className="h-7 w-16 bg-gray-100 rounded-full" />)}
      </div>
      <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded" />
        </div>
        <div className="h-9 w-28 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Freelancer Card ──────────────────────────────────────────────────────────
function FreelancerCard({ freelancer: f }) {
  const skills = Array.isArray(f?.skills) ? f.skills : [];
  const shown = skills.slice(0, 4);
  const extra = Math.max(0, skills.length - 4);
  const initials = (f?.fullName || f?.name || '').split(' ').map(n => (n || '')[0] || '').join('') || '?';

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden"
    >
      {/* Hover accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-[#FF7A00] to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="p-6 space-y-4">
        {/* Header row */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="size-8 rounded-full overflow-hidden">
                <Image
                  src={f.image || "/avatars/avatar-1.png"}
                  alt={f.fullName || "Client"}
                  width={8}
                  height={8}
                  className="w-full h-full object-cover"
                />
            </div>
          </div>

          {/* Name + title + availability */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-0.5">
                <h3 className="text-base font-bold text-[#111111] truncate group-hover:text-[#FF7A00] transition-colors">
                  {f.fullName}
                </h3>
                <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  f
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${f ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  {AVAILABILITY_LABELS["available"]}
                </span>
            </div>
            <p className="text-sm text-gray-500 truncate mb-1.5">{f.major || "Engineer"} </p>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" />
              <span className="text-sm font-semibold text-[#111111]">{f.rating || "0"}</span>
              <span className="text-xs text-gray-400">({f.reviews||0} reviews)</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{f.bio || "i am frontend Develper with react"}</p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5">
          {shown.map((s, idx) => (
            <span key={`${String(s) || 'skill'}-${idx}`} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600 hover:border-[#FF7A00] hover:text-[#FF7A00] transition-colors">
              {s}
            </span>
          ))}
          {extra > 0 && (
            <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-400">+{extra}</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4 gap-3 flex-wrap">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span className="font-semibold text-gray-800">{f.completedProjects ||0}</span> jobs
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span className="font-bold text-[#FF7A00]">${f.hourlyRate ||0 }</span>/hr
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {((f) ? "English" : '')}
            </span>
          </div>
          <Link
            href={`/hire/${f._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FF7A00] to-orange-400 text-white text-xs font-bold rounded-xl shadow shadow-orange-400/30 hover:shadow-md hover:shadow-orange-400/40 transition-all shrink-0"
          >
            View Profile <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Filters Panel ────────────────────────────────────────────────────────────
function FiltersPanel({ filters, setFilters, freelancers }) {
  const allLanguages = useMemo(() => {
    const s = new Set();
    (freelancers || []).forEach(f => (f.languages || []).forEach(l => s.add(l)));
    return [...s].sort();
  }, [freelancers]);

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
    <div className="space-y-7 sticky top-23">
      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Category</p>
        <div className="space-y-1">
          {CATEGORIES.filter(c => c !== 'All').map(cat => (
            <CheckRow key={cat} id={`fc-${cat}`} label={cat}
              checked={(filters.categories || []).includes(cat)}
              onChange={() => toggle('categories', cat)} />
          ))}
        </div>
      </div>

      {/* Experience */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Experience Level</p>
        <div className="space-y-1">
          {['entry', 'intermediate', 'expert'].map(e => (
            <CheckRow key={e} id={`fe-${e}`} label={EXPERIENCE_LABELS[e]}
              checked={(filters.experience || []).includes(e)}
              onChange={() => toggle('experience', e)} />
          ))}
        </div>
      </div>

  

      {/* Min Rating */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Minimum Rating</p>
        <div className="space-y-1">
          {[4.5, 4.0, 3.5].map(r => (
            <label key={r} htmlFor={`fr-${r}`} className="flex items-center gap-2 cursor-pointer group py-0.5">
              <input id={`fr-${r}`} type="radio" name="minRating"
                checked={filters.minRating === r}
                onChange={() => setFilters(p => ({ ...p, minRating: r }))}
                className="w-4 h-4 accent-[#FF7A00] cursor-pointer" />
              <span className="text-sm text-gray-600 group-hover:text-[#FF7A00] transition-colors flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#FF7A00] text-[#FF7A00]" /> {r}+ stars
              </span>
            </label>
          ))}
          {filters.minRating && (
            <button onClick={() => setFilters(p => ({ ...p, minRating: undefined }))}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-1">
              Clear rating filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Active Chips ─────────────────────────────────────────────────────────────
function ActiveChips({ filters, setFilters }) {
  const chips = [
    ...(filters.categories || []).map(c => ({ label: c, remove: () => setFilters(p => ({ ...p, categories: p.categories.filter(v => v !== c) })) })),
    ...(filters.experience || []).map(e => ({ label: EXPERIENCE_LABELS[e], remove: () => setFilters(p => ({ ...p, experience: p.experience.filter(v => v !== e) })) })),
    ...(filters.availability || []).map(av => ({ label: AVAILABILITY_LABELS[av], remove: () => setFilters(p => ({ ...p, availability: p.availability.filter(v => v !== av) })) })),
    ...(filters.languages || []).map(l => ({ label: l, remove: () => setFilters(p => ({ ...p, languages: p.languages.filter(v => v !== l) })) })),
    ...(filters.rateMin !== undefined ? [{ label: `Min $${filters.rateMin}/hr`, remove: () => setFilters(p => ({ ...p, rateMin: undefined })) }] : []),
    ...(filters.rateMax !== undefined ? [{ label: `Max $${filters.rateMax}/hr`, remove: () => setFilters(p => ({ ...p, rateMax: undefined })) }] : []),
    ...(filters.minRating !== undefined ? [{ label: `${filters.minRating}+ stars`, remove: () => setFilters(p => ({ ...p, minRating: undefined })) }] : []),
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
export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('rating');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() =>  { 
    const alldata = async function () {
      try {
          const response = await api.get('/freelancers');
          // support either { freelancers: [...] } or raw array
          const data = response.data?.freelancers ?? response.data ?? [];
          setFreelancers(data);
      } catch (error) {
          console.error('Error fetching freelancers:', error);
      } finally {
          setLoading(false);
      }
    }
    alldata()
  },[]);

  const filtered = useMemo(() => {
    let r = [...freelancers];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter(f => f.name.toLowerCase().includes(q) || f.title.toLowerCase().includes(q) || f.bio.toLowerCase().includes(q) || f.skills.some(s => s.toLowerCase().includes(q)));
    }
    if (activeCategory !== 'All') r = r.filter(f => f.category === activeCategory);
    if (filters.categories?.length) r = r.filter(f => filters.categories.includes(f.category));
    if (filters.experience?.length) r = r.filter(f => filters.experience.includes(f.experience));
    if (filters.availability?.length) r = r.filter(f => filters.availability.includes(f.availability));
    if (filters.languages?.length) r = r.filter(f => f.languages.some(l => filters.languages.includes(l)));
    if (filters.rateMin !== undefined) r = r.filter(f => f.hourlyRate >= filters.rateMin);
    if (filters.rateMax !== undefined) r = r.filter(f => f.hourlyRate <= filters.rateMax);
    if (filters.minRating !== undefined) r = r.filter(f => f.rating >= filters.minRating);
    r.sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'rate_low') return a.hourlyRate - b.hourlyRate;
      if (sort === 'rate_high') return b.hourlyRate - a.hourlyRate;
      if (sort === 'projects') return b.completedProjects - a.completedProjects;
      return 0;
    });
    return r;
  }, [search, activeCategory, filters, sort , freelancers]);

  const activeFilterCount =
    (filters.categories?.length || 0) + (filters.experience?.length || 0) +
    (filters.availability?.length || 0) + (filters.languages?.length || 0) +
    (filters.rateMin !== undefined ? 1 : 0) + (filters.rateMax !== undefined ? 1 : 0) +
    (filters.minRating !== undefined ? 1 : 0);

  const hasFilters = activeFilterCount > 0;
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="min-h-screen bg-[#F8F8F8]">


      {/* ── Body ── */}
      <div className=" px-4 sm:px-6 py-8">
        <div className="flex gap-7">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 mt-15 shrink-0">
            <div className="sticky top-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
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
              <FiltersPanel filters={filters} setFilters={setFilters} freelancers={freelancers} />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0 mt-15">
            {/* Toolbar */}
              
            {/* Grid */}
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
                <h3 className="text-xl font-bold text-[#111111] mb-2">No freelancers found</h3>
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
                    {visible.map(f => <FreelancerCard key={f.id} freelancer={f} />)}
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
                <FiltersPanel filters={filters} setFilters={setFilters} freelancers={freelancers} />
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
