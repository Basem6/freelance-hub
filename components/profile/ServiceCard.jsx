'use client';
import { motion } from 'framer-motion';
import { Check, Clock, RotateCcw } from 'lucide-react';

export default function ServiceCard({ tier, price, description, features, deliveryDays, revisions, popular }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`relative bg-white rounded-2xl p-6 flex flex-col h-full transition-all duration-300 shadow-sm ${
        popular ? 'border-2 border-[#FF7A00] shadow-md z-10' : 'border border-gray-100 hover:shadow-md'
      }`}
    >
      {popular && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FF7A00] text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide shadow-sm">
          Most Popular
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tier}</h3>
        <p className="text-gray-500 text-sm leading-relaxed min-h-[40px]">{description}</p>
      </div>

      <div className="mb-6 flex items-end gap-1">
        <span className="text-3xl font-black text-gray-900">${price}</span>
        <span className="text-sm text-gray-500 font-medium mb-1">/project</span>
      </div>

      <div className="flex-grow">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Includes:</h4>
        <ul className="space-y-3 mb-6">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <div className="mt-0.5 min-w-[16px] text-green-500">
                <Check className="w-4 h-4" />
              </div>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-gray-100 mb-6 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{deliveryDays} days</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RotateCcw className="w-4 h-4 text-gray-400" />
          <span>{revisions} revisions</span>
        </div>
      </div>

      <button 
        className={`w-full py-3 rounded-lg font-semibold transition-colors flex justify-center items-center ${
          popular 
            ? 'bg-[#FF7A00] hover:bg-[#e66e00] text-white shadow-sm' 
            : 'bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200'
        }`}
      >
        Order Now
      </button>
    </motion.div>
  );
}
