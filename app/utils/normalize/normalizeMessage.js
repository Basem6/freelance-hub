const getEntityId = (entity) => entity?.id || entity?._id || entity?.userId || entity?.user?._id || entity?.user?.id;
export const normalizeMessage = (message, currentUserId) => {
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