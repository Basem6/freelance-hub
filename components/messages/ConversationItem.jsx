import { motion } from 'framer-motion';
export function ConversationItem({ conv, isActive, onClick }) {
    return (
        <motion.div
        whileHover={{ x: 2 }}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3.5 cursor-pointer rounded-xl mx-2 transition-all ${
            isActive ? 'bg-orange-50 border border-orange-100' : 'hover:bg-gray-50'
        }`}
        >
        <div className="relative shrink-0">
            <img
            src={conv.avatar||"/avatars/avatar-1.png"}
            alt={conv.name}
            className={`w-11 h-11 rounded-full object-cover ring-2 ${isActive ? 'ring-orange-200' : 'ring-gray-100'}`}
            />
            {conv.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
            )}
        </div>

        <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-0.5">
            <div className='flex flex-col gap-1'>
                <span className={`text-sm font-semibold truncate ${isActive ? 'text-[#FF7A00]' : 'text-gray-900'}`}>
                {conv.name}
                </span>
                <span className="text-xs text-gray-400 shrink-0 ml-1">{conv.lastMessage}</span>
            </div>
            
            <span className="text-xs text-gray-400 shrink-0 ml-1">{conv.time}</span>
            </div>
            <div className="flex justify-between items-center">
            
            </div>
        </div>
        </motion.div>
    );
}