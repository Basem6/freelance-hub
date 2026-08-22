import { motion } from 'framer-motion';

const MOCK_MESSAGES = [
    { id: 1, name: 'Sarah Jenkins', avatar: 'SJ', color: 'bg-blue-100 text-blue-600', msg: 'The new designs look amazing! Can we...', time: '5m ago', unread: true, online: true },
    { id: 2, name: 'David Chen', avatar: 'DC', color: 'bg-purple-100 text-purple-600', msg: 'Invoice #4023 has been paid.', time: '2h ago', unread: true, online: false },
    { id: 3, name: 'Emma Wilson', avatar: 'EW', color: 'bg-green-100 text-green-600', msg: 'Are you available for a quick call?', time: 'Yesterday', unread: false, online: true },
    { id: 4, name: 'TechStart Inc', avatar: 'TI', color: 'bg-orange-100 text-orange-600', msg: 'We need to revise the timeline.', time: 'Yesterday', unread: false, online: false },
];

export default function MessagesPreview() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full flex flex-col"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                </div>
            </div>

            <div className="space-y-4 flex-1">
                {MOCK_MESSAGES.map((msg, index) => (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (index * 0.1) }}
                        key={msg.id} 
                        className="flex items-start space-x-3 group cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        <div className="relative">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${msg.color}`}>
                                {msg.avatar}
                            </div>
                            {msg.online && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <p className={`text-sm truncate ${msg.unread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                                    {msg.name}
                                </p>
                                <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{msg.time}</span>
                            </div>
                            <p className={`text-sm truncate ${msg.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                {msg.msg}
                            </p>
                        </div>
                        {msg.unread && (
                            <div className="w-2 h-2 bg-[#FF7A00] rounded-full mt-2 flex-shrink-0"></div>
                        )}
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-4 text-center text-sm font-medium text-[#FF7A00] hover:text-orange-600 py-2 border border-orange-100 hover:bg-orange-50 rounded-xl transition-colors">
                View All Messages
            </button>
        </motion.div>
    );
}
