import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, change, changeType = 'up', color = '#FF7A00', index = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
            className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col justify-between"
        >
            <div className="flex justify-between items-start mb-4">
                <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${color}26`, color: color }}
                >
                    <Icon size={24} />
                </div>
                <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-sm font-medium ${changeType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    {changeType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{change}</span>
                </div>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
        </motion.div>
    );
}
