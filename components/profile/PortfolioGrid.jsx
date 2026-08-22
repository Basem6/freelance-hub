'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

const gradients = [
  'from-blue-500 to-indigo-600',
  'from-orange-400 to-pink-500',
  'from-teal-400 to-emerald-600',
  'from-purple-500 to-fuchsia-500',
  'from-yellow-400 to-orange-500',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-green-500 to-teal-600',
];

export default function PortfolioGrid({ user }) {
  const [activeFilter, setActiveFilter] = useState('All');
  console.log(user)
  // Get unique categories from portfolio
  const filters = useMemo(() => {
    if (!user?.portfolio?.length) return ['All'];
    const categories = ['All', ...new Set(user.portfolio.map(item => item.category))];
    return categories;
  }, [user?.portfolio]);

  // Filter items
  const filteredItems = useMemo(() => {
    if (!user?.portfolio?.length) return [];
    if (activeFilter === 'All') return user.portfolio;
    return user.portfolio.filter(item => item.category === activeFilter);
  }, [user?.portfolio, activeFilter]);

  // Add gradient to each item
  const itemsWithGradient = filteredItems.map((item, i) => ({
    ...item,
    gradient: gradients[i % gradients.length],
  }));

  if (!user?.portfolio?.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 min-w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Portfolio</h2>
        <div className="text-center py-12">
          <p className="text-gray-700 text-4xl">No portfolio work yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 min-w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">Portfolio</h2>
        
        {/* Filters */}
        {filters.length > 1 && (
          <div className="flex gap-2 bg-gray-50 p-1 rounded-lg border border-gray-100 overflow-x-auto w-full sm:w-auto">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === filter 
                    ? 'bg-white text-[#FF7A00] shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {itemsWithGradient.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={item._id}
              className="group relative rounded-xl overflow-hidden cursor-pointer"
            >
              {/* Image or Gradient Fallback */}
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className={`w-full aspect-[4/3] bg-gradient-to-br ${item.gradient} flex items-center justify-center p-6`}>
                  <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-lg border border-white/20" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gray-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg line-clamp-1">{item.title}</h3>
                      <p className="text-white/70 text-xs mt-1">{item.category}</p>
                    </div>
                    {item.liveUrl && (
                      <Link href={item.liveUrl} target="_blank" rel="noopener noreferrer">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md hover:bg-[#FF7A00] transition-colors ml-2 flex-shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                      </Link>
                    )}
                  </div>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span 
                          key={tag} 
                          className="text-xs font-medium text-white/80 bg-white/20 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}