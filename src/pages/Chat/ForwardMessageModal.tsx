// File: src/components/modals/ForwardMessageModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ConversationSummary {
  _id: string;
  name?: string;       // If your conversation has a name
  participants: any[]; // or typed
}
interface OrgUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Props for the modal
interface ForwardMessageModalProps {
  show: boolean;
  onClose: () => void;

  // The text to forward, if you need it inside the modal or for display
  messageText?: string;

  // List of existing conversations
  conversations: ConversationSummary[];

  // List of org users
  orgUsers: OrgUser[];

  // When user finalizes a choice
  onConfirmForward: (targetConversationId?: string, targetUserId?: string) => void;
}

const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  show,
  onClose,
  messageText,
  conversations,
  orgUsers,
  onConfirmForward,
}) => {
  const [activeTab, setActiveTab] = useState<'conversations' | 'users'>('conversations');

  if (!show) return null;

  function handleSelectConversation(convoId: string) {
    onConfirmForward(convoId, undefined);
    onClose();
  }

  function handleSelectUser(userId: string) {
    onConfirmForward(undefined, userId);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-white p-6 rounded shadow max-w-md w-full"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>

        <h2 className="text-xl font-semibold mb-4">Forward Message</h2>
        {/* Optional: show the text to forward */}
        {messageText && (
          <div className="mb-2 border p-2 rounded bg-gray-50 text-sm text-gray-700">
            <strong>Message:</strong> {messageText}
          </div>
        )}

        {/* Tabs: Existing Convos vs. Users */}
        <div className="flex space-x-4 border-b pb-1 mb-2">
          <button
            className={`text-sm font-medium ${activeTab === 'conversations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('conversations')}
          >
            Conversations
          </button>
          <button
            className={`text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'conversations' && (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {conversations.length === 0 && (
              <p className="text-gray-500">No existing conversations found.</p>
            )}
            {conversations.map((conv) => {
              // If you store a "name", or maybe show participants
              const displayName = conv.name || `Convo: ${conv._id}`;
              return (
                <div
                  key={conv._id}
                  onClick={() => handleSelectConversation(conv._id)}
                  className="cursor-pointer p-2 border-b hover:bg-gray-100"
                >
                  {displayName}
                </div>
              );
            })}
          </div>
        )}
        {activeTab === 'users' && (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {orgUsers.length === 0 && (
              <p className="text-gray-500">No users found in org.</p>
            )}
            {orgUsers.map((user) => {
              const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
              return (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user._id)}
                  className="cursor-pointer p-2 border-b hover:bg-gray-100"
                >
                  {name} ({user.email})
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForwardMessageModal;
