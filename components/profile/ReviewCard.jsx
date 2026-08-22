'use client';
import { motion } from 'framer-motion';
import { Star, BadgeCheck } from 'lucide-react';

export default function ReviewCard({ name, avatar, rating, date, text, project, amount }) {
  return (
    <motion.div 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3 items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br ${avatar}`}>
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-semibold text-gray-900">{name}</h4>
              <BadgeCheck className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < rating ? 'fill-[#FF7A00] text-[#FF7A00]' : 'fill-gray-200 text-gray-200'}`} 
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">{date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-900">{amount}</div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {text}
      </p>
      
      <div className="inline-flex px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs font-medium text-gray-600">
        Project: {project}
      </div>
    </motion.div>
  );
}
