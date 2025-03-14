// File: src/components/chat/Chat.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

import ChatSidebar from './ChatSidebar';
import ChatContent from './ChatContent';
import ForwardMessageModal from './ForwardMessageModal'; 

import { useAppSelector } from '../../app/hooks/redux';
import { useDeleteMessageMutation } from '../../api/message/messageApi';
import { initSocketConnection, sendMessage } from '../../socket/socketClient';

import { useListUserConversationsQuery } from '../../api/conversation/conversationApi';
import { useListAllOrgUsersQuery } from '../../api/organization/organizationApi';
import { useCreateConversationMutation } from '../../api/conversation/conversationApi';

const Chat: React.FC = () => {
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const { selectedOrgId } = useAppSelector((state) => state.organization);

  // RTK Query: to list all user convos (for the forward modal)
  const { data: userConversations = [] } = useListUserConversationsQuery(
    { orgId: selectedOrgId || '', userId: user?._id || '' },
    { skip: !user?._id || !selectedOrgId }
  );

  // RTK Query: all org users
  const { data: allUsersData } = useListAllOrgUsersQuery(selectedOrgId || '', { skip: !selectedOrgId });
  const orgUsers = allUsersData ? allUsersData.users : [];

  // Also need the create conversation if user picks a user to forward to
  const [createConversation] = useCreateConversationMutation();

  // Initialize the socket once user/org is known
  useEffect(() => {
    if (user && user._id && selectedOrgId) {
      initSocketConnection(user._id, selectedOrgId);
    }
  }, [user, selectedOrgId]);

  // (1) For delete:
  const [deleteMessage] = useDeleteMessageMutation();

  // (2) Handle actual "delete" logic
  const handleDeleteMessage = async (msgId: string) => {
    try {
      await deleteMessage(msgId).unwrap();
      // Possibly also remove from Redux via messageActions, or rely on invalidation
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // ---------- FORWARD MODAL STATE -----------
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardMsgText, setForwardMsgText] = useState('');
  const [forwardMsgId, setForwardMsgId] = useState('');

  // (3) Handle "forward" logic:
  const handleForwardMessage = (msgId: string, text: string) => {
    setForwardMsgId(msgId);
    setForwardMsgText(text);
    setShowForwardModal(true);
  };

  // When the user picks a conversation or user in the modal
  async function handleConfirmForward(targetConversationId?: string, targetUserId?: string) {
    if (!user?._id) return;
    if (!selectedOrgId) return;

    try {
      let convoId = targetConversationId;

      if (!convoId && targetUserId) {
        // create a new 1-on-1 conversation with that user
        const payload = {
          orgId: selectedOrgId,
          participants: [user._id, targetUserId],
        };
        const newConv = await createConversation(payload).unwrap();
        convoId = newConv._id;
      }

      if (!convoId) {
        console.error('No target conversation found => cannot forward');
        return;
      }

      // now send the message
      sendMessage({
        conversationId: convoId,
        senderId: user._id,
        text: forwardMsgText,
        type: 'TEXT',
      });
    } catch (err) {
      console.error('Failed to forward message:', err);
    }
  }

  return (
    <div className="flex h-[calc(90vh-0.5rem)] bg-gray-50 overflow-hidden">
      {/* Sidebar (animated width) */}
      <motion.div
        initial={{ width: 320 }}
        animate={{ width: isSidebarCollapsed ? 60 : 320 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white shadow-lg flex flex-col"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-2 py-2 border-b border-gray-200">
          {!isSidebarCollapsed && (
            <h2 className="text-base font-semibold text-gray-700">Conversations</h2>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 rounded hover:bg-gray-100 transition"
          >
            {isSidebarCollapsed ? (
              <FiChevronRight className="text-gray-500" />
            ) : (
              <FiChevronLeft className="text-gray-500" />
            )}
          </button>
        </div>

        <ChatSidebar
          onSelectConversation={(id) => setActiveConversationId(id)}
          activeConversationId={activeConversationId}
          isCollapsed={isSidebarCollapsed}
        />
      </motion.div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence>
          {activeConversationId ? (
            <motion.div
              key={activeConversationId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              <ChatContent
                activeConversationId={activeConversationId}
                onDeleteMessage={handleDeleteMessage}
                onForwardMessage={handleForwardMessage}
              />
            </motion.div>
          ) : (
            <motion.div
              key="no-conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center text-gray-400"
            >
              Select a conversation to start chatting
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Forward Message Modal */}
      <ForwardMessageModal
        show={showForwardModal}
        onClose={() => setShowForwardModal(false)}
        messageText={forwardMsgText}
        conversations={userConversations}    // pass existing convos
        orgUsers={orgUsers}                 // pass org user list
        onConfirmForward={handleConfirmForward}
      />
    </div>
  );
};

export default Chat;
