import { io, Socket } from 'socket.io-client';
import { store } from '../app/store';
import { conversationActions } from '../app/store/slices/conversationSlice';
import { messageActions } from '../app/store/slices/messageSlice';

// We'll store the socket instance in a module-level variable
let socket: Socket | null = null;

/**
 * Initialize the Socket.IO client.
 * userId / orgId can come from your Redux store or local storage.
 */
export function initSocketConnection(userId: string, orgId: string) {
  // If already connected, skip
  if (socket) return socket;

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

socket = io(baseUrl, {
  query: { userId, orgId },
  transports: ['websocket'],
});


  socket.on('connect', () => {
    console.log('Socket connected:', socket?.id);
    // You might dispatch an action to set "online" or do something else
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    // dispatch presence/offline actions, etc.
  });

  /**
   * Listen for real-time events from server
   */

  // 1) “messageReceived”
  socket.on('messageReceived', (msg) => {
    console.log('[Socket] messageReceived:', msg);
    // Dispatch an action that adds this message to your Redux/RTK Query cache
    store.dispatch(messageActions.socketMessageReceived(msg));
  });

  // 2) “typingStatus”
  socket.on('typingStatus', (payload) => {
    console.log('[Socket] typingStatus:', payload);
    // e.g. update conversation state that “payload.userId isTyping = payload.isTyping”
    store.dispatch(conversationActions.setTyping(payload));
  });

  // 3) “messageRead”
  socket.on('messageRead', (payload) => {
    console.log('[Socket] messageRead:', payload);
    // e.g. update readBy array in message
    store.dispatch(messageActions.updateReadReceipt(payload));
  });

  // 4) presence events (optional)
  socket.on('userOnline', (data) => {
    console.log('[Socket] userOnline:', data);
    store.dispatch(conversationActions.setUserOnline(data.userId));
  });
  socket.on('userOffline', (data) => {
    console.log('[Socket] userOffline:', data);
    store.dispatch(conversationActions.setUserOffline(data.userId));
  });

  // 5) handle “errorMessage”
  socket.on('errorMessage', (errMsg) => {
    console.error('[Socket] errorMessage:', errMsg);
    // Possibly dispatch an error action or show toast
  });

  return socket;
}

/**
 * Expose some helper emits
 */
export function joinConversation(conversationId: string) {
  socket?.emit('joinConversation', conversationId);
}

export function sendTypingStatus(conversationId: string, isTyping: boolean) {
  socket?.emit('typing', { conversationId, isTyping });
}

export function sendMessage(payload: {
  conversationId: string;
  senderId: string;
  text: string;
  type?: string;
  attachmentUrl?: string;
}) {
  socket?.emit('sendMessage', payload);
}

export function markMessageRead(messageId: string) {
  socket?.emit('markRead', { messageId });
}
