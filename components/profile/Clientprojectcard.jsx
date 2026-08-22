'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Calendar, MapPin, Tag, Briefcase } from 'lucide-react';

export default function ClientProjectsCard({ projects }) {
  if (!projects?.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Posted Projects</h2>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No projects posted yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Posted Projects</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              key={project._id}
              className="bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:border-[#FF7A00]/30 transition-all"
            >
              {/* Header with Status */}
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">{project.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  project.status === 'open' 
                    ? 'bg-green-100 text-green-800' 
                    : project.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {project.description}
              </p>

              {/* Skills */}
              {project.skills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.slice(0, 2).map((skill) => (
                    <span 
                      key={skill} 
                      className="text-xs px-2.5 py-1 bg-orange-50 text-orange-700 border border-orange-100 rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {project.skills.length > 2 && (
                    <span className="text-xs px-2.5 py-1 text-gray-600 font-medium">
                      +{project.skills.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gray-100 my-4" />

              {/* Details */}
              <div className="space-y-3 mb-4">
                {/* Budget */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign size={16} className="text-[#FF7A00]" />
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    ${project.budget} {project.currency}
                  </span>
                </div>

                {/* Deadline */}
                {project.deadline && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} className="text-[#FF7A00]" />
                      <span className="text-sm font-medium">Deadline</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {new Date(project.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} className="text-[#FF7A00]" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {project.isRemote ? '🌍 Remote' : '📍 On-site'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full mt-4 px-4 py-2.5 bg-[#FF7A00] text-white rounded-lg font-semibold hover:bg-[#FF6A00] active:scale-95 transition-all text-sm">
                View & Apply
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}