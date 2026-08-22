import { motion } from 'framer-motion';

const MOCK_DATA = [
    { month: 'May', amount: 2400, max: 5000 },
    { month: 'Jun', amount: 3200, max: 5000 },
    { month: 'Jul', amount: 4800, max: 5000 },
    { month: 'Aug', amount: 3800, max: 5000 },
    { month: 'Sep', amount: 5000, max: 5000 },
    { month: 'Oct', amount: 4200, max: 5000 },
];

export default function EarningsChart() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
        >
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Earnings Overview</h2>
                    <p className="text-sm text-gray-500">Monthly revenue for the last 6 months</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">$23,400</p>
                </div>
            </div>

            <div className="h-64 flex items-end justify-between space-x-2 pt-4">
                {MOCK_DATA.map((item, index) => {
                    const heightPercent = (item.amount / item.max) * 100;
                    return (
                        <div key={index} className="flex flex-col items-center flex-1 group">
                            <div className="w-full relative flex justify-center h-full items-end pb-2">
                                {/* Tooltip */}
                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs py-1 px-2 rounded pointer-events-none z-10 whitespace-nowrap">
                                    ${item.amount}
                                </div>
                                {/* Bar */}
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercent}%` }}
                                    transition={{ duration: 1, delay: 0.3 + (index * 0.1), ease: "easeOut" }}
                                    className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-orange-300 to-[#FF7A00] group-hover:opacity-80 transition-opacity relative"
                                ></motion.div>
                            </div>
                            <span className="text-xs text-gray-500 mt-2 font-medium">{item.month}</span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
