import { motion } from 'framer-motion';
import { Plus, Users, FileText, DollarSign, ArrowRight } from 'lucide-react';

const ACTIONS = [
    { id: 1, title: 'Post a Project', subtitle: 'Hire top talent', icon: Plus, color: 'bg-orange-50 text-[#FF7A00]', iconColor: 'text-[#FF7A00]' },
    { id: 2, title: 'Find Freelancers', subtitle: 'Browse profiles', icon: Users, color: 'bg-blue-50 text-blue-600', iconColor: 'text-blue-600' },
    { id: 3, title: 'View Contracts', subtitle: 'Manage agreements', icon: FileText, color: 'bg-purple-50 text-purple-600', iconColor: 'text-purple-600' },
    { id: 4, title: 'Withdraw Earnings', subtitle: 'Transfer to bank', icon: DollarSign, color: 'bg-green-50 text-green-600', iconColor: 'text-green-600' },
];

export default function QuickActions() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
        >
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {ACTIONS.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={action.id}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group text-left w-full"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${action.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm mb-0.5">{action.title}</h3>
                                    <p className="text-xs text-gray-500">{action.subtitle}</p>
                                </div>
                            </div>
                            <div className={`opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 ${action.iconColor}`}>
                                <ArrowRight size={18} />
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
