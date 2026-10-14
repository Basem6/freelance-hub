import { motion } from 'framer-motion';
import { CheckCheck } from "lucide-react";

export function MessageBubble({ msg, isMe }) {
    return (
        <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
        >
        <div
            className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isMe
                ? 'bg-linear-to-br from-[#FF7A00] to-orange-500 text-white rounded-br-md'
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
            }`}
        >
            <p>{msg.text}</p>
            <div className={`flex items-center justify-end mt-1 space-x-1 ${isMe ? 'opacity-70' : 'opacity-50'}`}>
            <span className="text-[10px]">{msg.time}</span>
            {isMe && <CheckCheck size={12} />}
            </div>
        </div>
        </motion.div>
    );
}