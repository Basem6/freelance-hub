'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/lib/hooks';
import { logout, setUser } from '@/app/lib/Features/authSlice';
import { useSocket } from "../../hooks/useSocket";
import api from '@/app/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Send, Paperclip, MoreVertical, Phone, Video,
  ChevronLeft, Circle, Check, CheckCheck, MessageSquare,
  Smile, Image as ImageIcon, X, Star, Archive, Trash2
} from 'lucide-react';
import { useSocketContext } from '../../providers/SocketProvider';
const getEntityId = (entity) => entity?.id || entity?._id || entity?.userId || entity?.user?._id || entity?.user?.id;

const normalizeMessage = (message, currentUserId) => {
  message = message || {};
  const senderId = getEntityId(message.sender) || message.senderId || message.from;

  return {
  ...message,
  id: String(message.id || message._id || `m${Date.now()}-${Math.random()}`),
  text: message.body || message.content || message.message || '',
  from: senderId && currentUserId && String(senderId) === String(currentUserId) ? 'me' : 'other',
  time: message.time || (message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Now'),
  };
};

const normalizeConversation = (conversation, currentUserId) => {
  conversation = conversation || {};
  const participants = Array.isArray(conversation.participants) ? conversation.participants : [];
  const otherParticipant = participants.find((participant) => (
    String(getEntityId(participant)) !== String(currentUserId)
  ));

  return {
  ...conversation,
  id: String(conversation.id || conversation._id || conversation.conversationId || ''),
  participantId: getEntityId(conversation.otherUser) || getEntityId(conversation.participant) || getEntityId(otherParticipant) || conversation.participantId,
  name: conversation.name || conversation.otherUser?.name || conversation.otherUser?.fullName || conversation.participant?.name || conversation.participant?.fullName || otherParticipant?.name || otherParticipant?.fullName || 'Conversation',
  avatar: conversation.avatar || conversation.otherUser?.avatar || conversation.otherUser?.image || conversation.participant?.avatar || conversation.participant?.image || otherParticipant?.avatar || otherParticipant?.image || '/avatars/avatar-1.png',
  lastMessage: conversation.lastMessage?.text || conversation.lastMessage?.body || conversation.lastMessage || '',
  time: conversation.time || (conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''),
  unread: conversation.unread || conversation.unreadCount || 0,
  online: Boolean(conversation.online || conversation.otherUser?.online),
  messages: (conversation.messages || []).map((message) => normalizeMessage(message, currentUserId)),
  };
};

/* ─────────────── Components ─────────────── */
function ConversationItem({ conv, isActive, onClick }) {
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

function MessageBubble({ msg, isMe }) {
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

/* ─────────────── Main Page ─────────────── */
export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileList, setShowMobileList] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);
  const { notifications, setNotifications , socket ,isConnected } = useSocketContext();
  const currentUserId = user?.id || user?._id;
  const requestedUserId = searchParams.get('userId');
  const activeConv = conversations.find((c) => String(c.id) === String(activeConvId));
  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(conversations)
  
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get('/api/auth/me');
        if (!res.data.success) {
          dispatch(logout());
          router.push('/login');
          return;
        }
        if (res.data.user) {
          dispatch(setUser(res.data.user));
        }
        const conversationsResponse = await api.get('/api/chat/conversations');
        const rawConversations = conversationsResponse.data.conversations || conversationsResponse.data.data || conversationsResponse.data || [];
        const nextConversations = (Array.isArray(rawConversations) ? rawConversations : []).map((conversation) => normalizeConversation(conversation, currentUserId));
        let selectedConversation = nextConversations.find((conversation) => (
          requestedUserId && String(conversation.participantId) === String(requestedUserId)
        ));

        if (requestedUserId && !selectedConversation) {
          const createResponse = await api.post('/api/chat/conversations', { participantId: requestedUserId });
          const created = normalizeConversation(
            createResponse.data.conversation || createResponse.data.data || createResponse.data,
            currentUserId
          );
          if (created.id) {
            selectedConversation = created;
            nextConversations.unshift(created);
          }
        }

        setConversations(nextConversations);
        setActiveConvId(selectedConversation?.id || nextConversations[0]?.id || null);
      } catch (er){
        console.log(er)
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [currentUserId, dispatch, requestedUserId, router]);

  useEffect(() => {
    if (!activeConvId) return undefined;

    const loadMessages = async () => {
      try {
        const response = await api.get(`/api/chat/conversations/${activeConvId}/messages`);
        const rawMessages = response.data.messages || response.data.data || response.data || [];
        const messages = (Array.isArray(rawMessages) ? rawMessages : []).map((message) => normalizeMessage(message, currentUserId));
        setConversations((previous) => previous.map((conversation) => (
          String(conversation.id) === String(activeConvId) ? { ...conversation, messages, unread: 0 } : conversation
        )));
      } catch (error) {
        console.error('Unable to load conversation messages', error);
      }
    };

    loadMessages();
    socket?.emit('joinConversation', activeConvId);
    return () => socket?.emit('leaveConversation', activeConvId);
  }, [activeConvId, currentUserId, socket]);

  useEffect(() => {
    if (!socket) return;
    const handleUserTyping = ({ userId }) => {
      if (String(userId) !== String(currentUserId)) {
        setIsOtherUserTyping(true);
      }
    };
    const handleUserStopTyping = ({ userId }) => {
      if (String(userId) !== String(currentUserId)) {
        setIsOtherUserTyping(false);
      }
    };

    socket.on("user-typing", handleUserTyping);
    socket.on("user-stop-typing", handleUserStopTyping);
    const handleIncomingMessage = (payload) => {
  const messageData = payload || {};

  const message = normalizeMessage(
    messageData,
    currentUserId
  );

  const conversationId =
    payload?.conversationId ||
    messageData.conversationId ||
    messageData.conversation?._id ||
    messageData.conversation?.id;

  if (!conversationId) return;

  setConversations((previous) => {
    const index = previous.findIndex(
      (conversation) =>
        String(conversation.id) === String(conversationId)
    );

    // 🆕 المحادثة غير موجودة
    if (index === -1) {
      const sender = messageData.sender;

      if (!sender) {
        console.log("❌ No sender data", messageData);
        return previous;
      }

      const newConversation = normalizeConversation(
        {
          id: conversationId,
          participants: [sender, user],
          lastMessage: messageData.body || messageData.text || "",
          updatedAt: messageData.createdAt,
          messages: [message],
          unread: 1,
        },
        currentUserId
      );

      // 🔥 أضف المحادثة في أول القائمة
      return [
        newConversation,
        ...previous,
      ];
    }

    // 💬 المحادثة موجودة
    const conversation = previous[index];

    const updatedConversation = {
      ...conversation,

      messages: conversation.messages.some(
        (item) => String(item.id) === String(message.id)
      )
        ? conversation.messages
        : [...conversation.messages, message],

      lastMessage: messageData.body || messageData.text || "",
      time: message.time,

      unread:
        String(conversationId) === String(activeConvId)
          ? 0
          : (conversation.unread || 0) + 1,
    };

    // 🔥 نقل المحادثة لأول القائمة
    return [
      updatedConversation,
      ...previous.slice(0, index),
      ...previous.slice(index + 1),
    ];
  });
};

    ['message:new', 'message', 'newMessage', 'receiveMessage'].forEach((event) => {
      socket.on(event, handleIncomingMessage);
    });

    return () => {
        ['message:new', 'message', 'newMessage', 'receiveMessage'].forEach((event) => {
          socket.off(event, handleIncomingMessage);
        });
        socket.off("user-typing", handleUserTyping);
        socket.off("user-stop-typing", handleUserStopTyping);
      setIsOtherUserTyping(false);
    };
}, [socket, currentUserId, activeConvId]);
  useEffect(() => {
  if (!socket) return;

  const handleNewNotification = (data) => {
    if (data?.type !== "message") return;

    const conversationId = String(data.conversationId);
    const messageData = data.message;

    if (!conversationId || !messageData) return;

    const message = normalizeMessage(
      messageData,
      currentUserId
    );

    setConversations((prev) => {
      const index = prev.findIndex(
        (conv) => String(conv.id) === conversationId
      );

      // 🆕 الشخص مش موجود في المحادثات
      if (index === -1) {
        const sender = messageData.sender;

        if (!sender) return prev;

        const newConversation = normalizeConversation(
          {
            id: conversationId,
            participants: [sender],
            lastMessage: messageData.body || messageData.text || "",
            updatedAt: messageData.createdAt,
            messages: [message],
            unread: 1,
          },
          currentUserId
        );

        // 🔥 يظهر أول القائمة فورًا
        return [
          newConversation,
          ...prev,
        ];
      }

      // 💬 المحادثة موجودة
      const conversation = prev[index];

      const updatedConversation = {
        ...conversation,
        lastMessage: messageData.body || messageData.text || "",
        time: message.time,

        messages: conversation.messages.some(
          (item) => String(item.id) === String(message.id)
        )
          ? conversation.messages
          : [...conversation.messages, message],

        unread:
          String(conversationId) === String(activeConvId)
            ? 0
            : (conversation.unread || 0) + 1,
      };

      return [
        updatedConversation,
        ...prev.slice(0, index),
        ...prev.slice(index + 1),
      ];
    });
  };

  socket.on("notification:new", handleNewNotification);

  return () => {
    socket.off("notification:new", handleNewNotification);
  };
}, [socket, currentUserId, activeConvId]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvId, conversations]);

  const handleSend = () => {
    const text = messageInput.trim();

    if (!text || !activeConvId || sending || !socket?.connected) return;

    clearTimeout(typingTimeoutRef.current);
    socket.emit("stop-typing", {
        conversationId: activeConvId,
    });
    
    setSending(true);

    console.log("📤 Sending via socket");

    socket.emit(
        "send-message",
        {
            conversationId: activeConvId,
            body: text,
        },
        (response) => {
            console.log("📥 Server response:", response);

            if (!response?.success) {
                console.error("Send failed:", response?.message);
                setSending(false);
                return;
            }

            setMessageInput("");
            setSending(false);
        }
    );
};

  const handleSelectConv = (id) => {
    setActiveConvId(id);
    setConversations((prev) =>
      prev.map((c) => (String(c.id) === String(id) ? { ...c, unread: 0 } : c))
    );
    setShowMobileList(false);
  };
  const handleMessageChange = (e) => {
    const value = e.target.value;

    setMessageInput(value);

    if (!socket?.connected || !activeConvId) return;

    socket.emit("typing", {
        conversationId: activeConvId,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stop-typing", {
            conversationId: activeConvId,
        });
    }, 1000);
};
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center md:ml-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 rounded-full border-4 border-orange-200 border-t-[#FF7A00] animate-spin" />
          <p className="text-gray-400 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8F8F8] md:ml-64">
      <div className="flex-1 flex overflow-hidden" style={{ height: '100vh' }}>

        {/* ── Conversation List ── */}
        <div
          className={`w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col shrink-0 ${
            !showMobileList ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold text-gray-900">Messages</h1>
              <span className={`text-xs font-semibold bg-[#FF7A00] transition-transform origin-center ${conversations.reduce((s, c) => s + c.unread, 0)==0 ?"scale-0":"scale-100"} text-white px-2 py-0.5 rounded-full`}>
                {conversations.reduce((s, c) => s + c.unread, 0)} New
              </span>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00]"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto py-2 space-y-0.5">
            {filteredConvs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <MessageSquare size={32} className="mb-2 opacity-40" />
                <p className="text-sm">No conversations found</p>
              </div>
            ) : (
              filteredConvs.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={String(conv.id) === String(activeConvId)}
                  onClick={() => handleSelectConv(conv.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* ── Chat Thread ── */}
        <div className={`flex-1 flex flex-col bg-gray-50 ${showMobileList ? 'hidden md:flex' : 'flex'}`}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setShowMobileList(true)}
                    className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 mr-1"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="relative">
                    <img
                      src={activeConv.avatar||"/avatars/avatar-1.png"}
                      alt={activeConv.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-100"
                    />
                    {activeConv.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{activeConv.name}</p>
                    <p className="text-xs text-gray-400">
                      {isConnected && activeConv.online ? (
                        <span className="text-green-500 font-medium">● Online</span>
                      ) : (
                        'Last seen recently'
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  
                  <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                <div className="flex justify-center mb-4">
                  <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
                    Today
                  </span>
                </div>
                <AnimatePresence>
                  {activeConv.messages.map((msg) => (
                    <MessageBubble key={msg.id} msg={msg} isMe={msg.from === 'me'} />
                  ))}
                </AnimatePresence>
                {isOtherUserTyping && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Typing</span>
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-600 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-600 animate-bounce [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-600 animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="bg-white border-t border-gray-100 px-4 py-3 shrink-0">
                <div className="flex items-end space-x-3">
                  <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 shrink-0 transition-colors">
                    <Paperclip size={20} />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={handleMessageChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7A00]/30 focus:border-[#FF7A00] leading-relaxed max-h-28 overflow-y-auto"
                      style={{ minHeight: '48px' }}
                    />
                  </div>
                  <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 shrink-0 transition-colors">
                    <Smile size={20} />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!messageInput.trim() || sending}
                    className="shrink-0 w-11 h-11 bg-linear-to-br from-[#FF7A00] to-orange-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-orange-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={18} />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mb-5">
                <MessageSquare size={40} className="text-[#FF7A00]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">No conversation selected</h2>
              <p className="text-gray-400 max-w-xs">
                Choose a conversation from the list to start messaging.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
