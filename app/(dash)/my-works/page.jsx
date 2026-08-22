'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { logout, updateUser } from '@/app/lib/Features/authSlice';
import api from '@/app/utils/api';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Eye, Star, Search, Grid, List, Plus, 
  ChevronDown, Edit2, Trash2, ExternalLink, Play, 
  X, Check, UploadCloud
} from 'lucide-react';
import { compressImage } from '@/app/utils/compressImage';
import Link from 'next/link';

const CATEGORY_OPTIONS = [
  'Web Development',
  'UI/UX Design',
  'Mobile App',
  'Marketing',
  'Data Science',
];

const DEFAULT_COVER_IMAGE = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80';

export default function MyWorksPage() {
  const router = useRouter();
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  const normalizeWorks = (payload) => {
    let entries = [];

    if (Array.isArray(payload)) {
      entries = payload;
    } else if (payload && typeof payload === 'object') {
      entries = Object.entries(payload).flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((item, index) => ({ __key: `${key}-${index}`, ...item }));
        }

        if (value && typeof value === 'object') {
          return [{ __key: key, ...value }];
        }

        return [];
      });
    }

    return entries.map((work, index) => ({
      ...work,
      id: work?.id ?? work?._id ?? work?.workId ?? work?.__key ?? `${index}`,
      title: work?.title || 'Untitled Work',
      category: work?.category || 'Web Development',
      description: work?.description || '',
      liveUrl: work?.liveUrl || work?.live_url || '',
      githubUrl: work?.githubUrl || work?.github_url || '',
      featured: Boolean(work?.featured),
      tags: Array.isArray(work?.tags) ? work.tags : [],
      coverImage: work?.coverImage || work?.image || work?.cover || DEFAULT_COVER_IMAGE,
      views: Number(work?.views || 0),
      date: work?.date || work?.createdAt || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    }));
  };

  const syncPortfolioToUser = (nextWorks) => {
    dispatch(updateUser({ portfolio: nextWorks }));
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const authRes = await api.get('/api/auth/me');
        if (!authRes.data.success) {
          dispatch(logout());
          router.push('/login');
          return;
        }
        if(authRes.data.user.role==="client"){
          return;
        }
        else{
        const worksRes = await api.get('/api/freelancer/allworks');
        const allWorks = normalizeWorks(worksRes?.data || []);
        setWorks(allWorks);
        syncPortfolioToUser(allWorks);
        }
      } catch (error) {
        console.error('Error fetching works:', error);
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);
  
  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {});
      dispatch(logout());
      router.push('/login');
    } catch (error) { console.error('Logout failed:', error); }
  };
  const [works, setWorks] = useState(() => normalizeWorks(user?.portfolio || []));
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // New Work Form State
  const [newWork, setNewWork] = useState({
    title: '', category: CATEGORY_OPTIONS[0], description: '', liveUrl: '', githubUrl: '', featured: false, tags: [], coverImage: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const categories = ['All', ...CATEGORY_OPTIONS];
  
  const filteredWorks = works.filter(work => {
    const matchesCategory = activeCategory === 'All' || work.category === activeCategory;
    const matchesSearch = work.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          work.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'Most Viewed') return b.views - a.views;
    if (sortBy === 'Featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return b.id - a.id; // Newest (by id descending)
  });

  const totalWorks = works.length;
  const totalViews = works.reduce((sum, w) => sum + w.views, 0);
  const featuredWorks = works.filter(w => w.featured).length;

  const handleDelete = async (id) => {
    try {
      await api.delete(`/freelancer/deletework/${id}`);
      const nextWorks = works.filter(w => w.id !== id);
      setWorks(nextWorks);
      syncPortfolioToUser(nextWorks);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error('Error deleting work:', error);
      const errorMessage = error?.response?.data?.message || 'Unable to delete work from database.';
      alert(errorMessage);
    }
  };

  const toggleFeature = (id) => {
    const nextWorks = works.map(w => w.id === id ? { ...w, featured: !w.featured } : w);
    setWorks(nextWorks);
    syncPortfolioToUser(nextWorks);
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!newWork.tags.includes(tagInput.trim())) {
        setNewWork({ ...newWork, tags: [...newWork.tags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewWork({ ...newWork, tags: newWork.tags.filter(t => t !== tagToRemove) });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      const compressedImage = await compressImage(file);
      const formData = new FormData();
      formData.append('file', compressedImage);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!cloudinaryRes.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const cloudinaryData = await cloudinaryRes.json();
      const imageUrl = cloudinaryData.secure_url;

      setNewWork(prev => ({ ...prev, coverImage: imageUrl }));
      setCoverImagePreview(imageUrl);
    } catch (error) {
      console.error('Cover image upload error:', error);
      alert('Unable to upload image to Cloudinary. Please try another image.');
    } finally {
      setIsUploadingCover(false);
      event.target.value = '';
    }
  };

  const handleAddWork = async () => {
    if (!newWork.title.trim() || !newWork.description.trim()) {
      alert('Please add a title and description before saving your work.');
      return;
    }

    const payload = {
      title: newWork.title.trim(),
      category: newWork.category,
      description: newWork.description.trim(),
      liveUrl: newWork.liveUrl.trim(),
      githubUrl: newWork.githubUrl.trim(),
      featured: newWork.featured,
      tags: newWork.tags,
      coverImage: newWork.coverImage || DEFAULT_COVER_IMAGE,
    };

    try {
      const response = await api.post('/freelancer/work', payload);
      const nextWorks = normalizeWorks(response?.data?.freelancer?.portfolio || response?.data?.portfolio || []);
      setWorks(nextWorks);
      syncPortfolioToUser(nextWorks);
      setShowModal(false);
      setCoverImagePreview('');
      setNewWork({
        title: '',
        category: CATEGORY_OPTIONS[0],
        description: '',
        liveUrl: '',
        githubUrl: '',
        featured: false,
        tags: [],
        coverImage: '',
      });
    } catch (error) {
      console.error('Error adding work:', error);
      const errorMessage = error?.response?.data?.message || 'Unable to add work. Please try again.';
      alert(errorMessage);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8F8F8] text-[#111111] font-sans md:ml-64">
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">My Portfolio & Works</h1>
            <p className="text-gray-500">Showcase your best projects to attract clients</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 flex items-center space-x-2 bg-gradient-to-r from-[#FF7A00] to-orange-500 text-white px-6 py-3 rounded-full font-medium shadow-lg shadow-orange-500/30"
          >
            <Plus size={20} />
            <span>Add New Work</span>
          </motion.button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF7A00]">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Works</p>
              <p className="text-2xl font-bold">{totalWorks}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Loved Works</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <Star size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">Featured Works</p>
              <p className="text-2xl font-bold">{featuredWorks}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 lg:gap-0">
          <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'bg-[#FF7A00] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4 w-full lg:w-auto justify-between lg:justify-end">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 text-sm w-48 md:w-64"
              />
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
              <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-full ${viewMode === 'grid' ? 'bg-white shadow text-[#FF7A00]' : 'text-gray-500'}`}>
                <Grid size={18} />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-full ${viewMode === 'list' ? 'bg-white shadow text-[#FF7A00]' : 'text-gray-500'}`}>
                <List size={18} />
              </button>
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-gray-200 text-sm font-medium hover:bg-gray-50"
              >
                <span>{sortBy}</span>
                <ChevronDown size={16} />
              </button>
              <AnimatePresence>
                {isSortDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10"
                  >
                    {['Newest', 'Most Viewed', 'Featured'].map(option => (
                      <button
                        key={option}
                        onClick={() => { setSortBy(option); setIsSortDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Works Grid / List */}
        {filteredWorks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-[#FF7A00] mb-4">
              <Briefcase size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">No works found</h3>
            <p className="text-gray-500 mb-6">There are no works matching your criteria.</p>
            <button onClick={() => setShowModal(true)} className="bg-[#FF7A00] text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition-colors">
              Add your first work
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="show" 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredWorks.map(work => (
                <motion.div 
                  key={work.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  layout
                  className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group ${work.featured ? '' : ''}`}
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={work.coverImage || DEFAULT_COVER_IMAGE}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                       {work.liveUrl && (
                      <Link href={work.liveUrl}>
                        <button className="w-12 h-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-[#FF7A00] transition-colors">
                          <ExternalLink size={20} />
                        </button>
                      </Link>
        )}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-3 py-1 bg-gray-100 text-xs font-semibold rounded-full text-gray-700">{work.category}</span>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => toggleFeature(work.id)} className={`p-1.5 rounded-md hover:bg-gray-100 ${work.featured ? 'text-yellow-500' : 'text-gray-400'}`}>
                          <Star size={16} fill={work.featured ? "currentColor" : "none"} />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-gray-100 text-blue-500">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => setDeleteConfirmId(work.id)} className="p-1.5 rounded-md hover:bg-red-50 text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {deleteConfirmId === work.id ? (
                      <div className="my-4 p-4 bg-red-50 rounded-lg border border-red-100 text-center">
                        <p className="text-sm text-red-800 font-medium mb-3">Are you sure you want to delete this?</p>
                        <div className="flex justify-center space-x-3">
                          <button onClick={() => handleDelete(work.id)} className="px-3 py-1 bg-red-500 text-white rounded text-xs font-bold hover:bg-red-600">Yes</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 bg-white text-gray-600 border border-gray-300 rounded text-xs font-bold hover:bg-gray-50">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-1">{work.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">{work.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {work.tags.map((tag, i) => (
                            <span key={i} className="text-[11px] px-2 py-1 bg-gray-50 border border-gray-100 rounded-md text-gray-500">{tag}</span>
                          ))}
                        </div>
                      </>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium">

                      <div className="flex items-center space-x-3">
                        <span>{work.date}</span>
                        
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Views</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filteredWorks.map(work => (
                      <motion.tr 
                        key={work.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`border-b border-gray-50 hover:bg-gray-50 group ${work.featured ? 'bg-orange-50/30' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-20 h-14 rounded-lg flex-shrink-0 relative overflow-hidden group-hover:shadow-md transition-shadow">
                              <img src={work.coverImage || DEFAULT_COVER_IMAGE} alt={work.title} className="w-full h-full object-cover" />
                              {work.featured && <div className="absolute top-0 right-0 bg-yellow-400 text-white p-0.5 rounded-bl-lg"><Star size={10} fill="currentColor" /></div>}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">{work.title}</p>
                              <div className="flex gap-1 mt-1">
                                {work.tags.slice(0, 2).map((t, i) => <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{t}</span>)}
                                {work.tags.length > 2 && <span className="text-[10px] text-gray-400">+{work.tags.length - 2}</span>}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4"><span className="px-3 py-1 bg-gray-100 text-xs font-semibold rounded-full text-gray-700">{work.category}</span></td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium"><div className="flex items-center space-x-1"><Eye size={14} className="text-gray-400"/><span>0</span></div></td>
                        <td className="px-6 py-4 text-sm text-gray-500">{work.date}</td>
                        <td className="px-6 py-4">
                          {deleteConfirmId === work.id ? (
                            <div className="flex items-center justify-end space-x-2">
                              <span className="text-xs text-red-500 font-bold mr-2">Delete?</span>
                              <button onClick={() => handleDelete(work.id)} className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><Check size={14} /></button>
                              <button onClick={() => setDeleteConfirmId(null)} className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"><X size={14} /></button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              
                              <button className="p-2 rounded-lg hover:bg-blue-100 text-blue-500 transition-colors">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => setDeleteConfirmId(work.id)} className="p-2 rounded-lg hover:bg-red-100 text-red-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      {/* Add New Work Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold">Add New Work</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                      <input 
                        type="text" 
                        value={newWork.title}
                        onChange={(e) => setNewWork({...newWork, title: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50"
                        placeholder="e.g. E-commerce Redesign"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        value={newWork.category}
                        onChange={(e) => setNewWork({...newWork, category: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 bg-white"
                      >
                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      value={newWork.description}
                      onChange={(e) => setNewWork({...newWork, description: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50 min-h-[100px] resize-y"
                      placeholder="Briefly describe the project..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Live URL (Optional)</label>
                      <input 
                        type="url" 
                        value={newWork.liveUrl}
                        onChange={(e) => setNewWork({...newWork, liveUrl: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL (Optional)</label>
                      <input 
                        type="url" 
                        value={newWork.githubUrl}
                        onChange={(e) => setNewWork({...newWork, githubUrl: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/50"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                    <div className="flex flex-col gap-3">
                      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 transition hover:border-[#FF7A00] hover:bg-orange-50 hover:text-[#FF7A00]">
                        <UploadCloud size={18} />
                        <span>{isUploadingCover ? 'Uploading...' : 'Upload cover image'}</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploadingCover} />
                      </label>

                      {coverImagePreview || newWork.coverImage ? (
                        <img
                          src={coverImagePreview || newWork.coverImage}
                          alt="Work cover preview"
                          className="h-40 w-full rounded-xl border border-gray-200 object-cover"
                        />
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Press Enter to add)</label>
                    <div className="p-2 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#FF7A00]/50 flex flex-wrap gap-2 items-center min-h-[46px]">
                      {newWork.tags.map(tag => (
                        <span key={tag} className="flex items-center bg-gray-100 px-2.5 py-1 rounded-md text-sm text-gray-700">
                          {tag}
                          <button onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-gray-400 hover:text-red-500"><X size={14}/></button>
                        </span>
                      ))}
                      <input 
                        type="text" 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="flex-1 min-w-[120px] outline-none bg-transparent py-1 text-sm"
                        placeholder={newWork.tags.length === 0 ? "e.g. React, UI/UX" : ""}
                      />
                    </div>
                  </div>


                  <div className="flex items-center mt-2">
                    <input 
                      type="checkbox" 
                      id="featured"
                      checked={newWork.featured}
                      onChange={(e) => setNewWork({...newWork, featured: e.target.checked})}
                      className="w-4 h-4 text-[#FF7A00] rounded focus:ring-[#FF7A00] border-gray-300"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 flex items-center">
                      Mark as Featured <Star size={14} className="ml-1 text-yellow-500" fill="currentColor"/>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddWork}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF7A00] to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                >
                  Add Work
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
