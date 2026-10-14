const getEntityId = (entity) => entity?.id || entity?._id || entity?.userId || entity?.user?._id || entity?.user?.id;
export const normalizeConversation = (conversation, currentUserId) => {
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
    online: Boolean(otherParticipant?.online),
    messages: (conversation.messages || []).map((message) => normalizeMessage(message, currentUserId)),
    };
};
