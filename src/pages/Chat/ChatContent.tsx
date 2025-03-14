// File: src/components/chat/ChatContent.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  FiCamera,
  FiVideo,
  FiPhone,
  FiSettings,
  FiPaperclip,
  FiSmile,
  FiAtSign,
  FiBold,
  FiItalic,
  FiArrowRight,
} from 'react-icons/fi';

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import { useAppSelector, useAppDispatch } from '../../app/hooks/redux';
import { setMessagesForConvo } from '../../app/store/slices/messageSlice';
import { useListMessagesQuery } from '../../api/message/messageApi';
import { useGetConversationQuery } from '../../api/conversation/conversationApi';
import { useGetUserQuery } from '../../api/user/userApi';
import { sendMessage, sendTypingStatus } from '../../socket/socketClient';

import ChatMessageBubble from './ChatMessageBubble';

interface ChatContentProps {
  activeConversationId: string | null;
  onDeleteMessage: (msgId: string) => void;             // new prop
  onForwardMessage: (msgId: string, text: string) => void; // new prop
}

const ChatContent: React.FC<ChatContentProps> = ({ 
  activeConversationId,
  onDeleteMessage,
  onForwardMessage,
 }) => {
  const dispatch = useAppDispatch();

  // 1) Grab your logged-in user from Redux
  const { user } = useAppSelector((state) => state.auth);
  const { onlineUserIds } = useAppSelector((state) => state.conversation.presence);

  // If no conversation is selected, show placeholder
  if (!activeConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-gray-400">Select a conversation to start chatting</p>
      </div>
    );
  }

  // 2) Fetch conversation details
  const { data: conversation } = useGetConversationQuery(activeConversationId);

  // 3) If 1-on-1, find the “other” user’s ID
  let otherUserId: string | undefined;
  let participantCount = 0;
  if (conversation && Array.isArray(conversation.participants)) {
    participantCount = conversation.participants.length;
    if (participantCount === 2 && user?._id) {
      const participant = (conversation.participants as any[]).find(
        (p: any) => p._id !== user._id
      );
      otherUserId = typeof participant === 'string' ? participant : participant?._id;
    }
  }

  // 4) If we have exactly 2 participants, fetch the other user data
  const { data: otherUser } = useGetUserQuery(otherUserId || '', {
    skip: !otherUserId, // skip if no otherUserId
  });

  // 5) Determine presence of the other user
  const isOnline = otherUserId ? onlineUserIds.includes(otherUserId) : false;

  // 6) If 1-on-1, build avatar & name
  const displayName1on1 = otherUser
    ? `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.trim() || otherUser.email
    : 'Unknown User';
  const avatarUrl1on1 =
    otherUser?.profileImage || 'https://i.pravatar.cc/150?img=12';
  const presenceStatus = isOnline ? 'Online' : 'Offline';

  // 7) Otherwise (3+ participants) => Group Chat
  const isGroupChat = participantCount > 2;

  // 8) Fetch messages
  const { data: fetchedMessages } = useListMessagesQuery(
    { conversationId: activeConversationId },
    { skip: !activeConversationId }
  );

  // 9) Store them in Redux
  useEffect(() => {
    if (fetchedMessages) {
      dispatch(
        setMessagesForConvo({
          conversationId: activeConversationId,
          messages: fetchedMessages,
        })
      );
    }
  }, [fetchedMessages, activeConversationId, dispatch]);

  // 10) Read from Redux
  const conversationMessages = useAppSelector(
    (state) => state.message.messagesByConvo[activeConversationId] || []
  );

  // local state for typed message
  const [typedMessage, setTypedMessage] = useState('');

  // handleSend
  const handleSend = () => {
    if (!typedMessage.trim() || !user?._id) return;
    sendMessage({
      conversationId: activeConversationId,
      senderId: user._id,
      text: typedMessage,
      type: 'TEXT',
    });
    setTypedMessage('');
  };

  // typing
  const handleTyping = (isTyping: boolean) => {
    if (user?._id) {
      sendTypingStatus(activeConversationId, isTyping);
    }
  };

  // file attach
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleAttachFileClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log('Selected file:', file);
    e.target.value = '';
    // Implement your upload logic
  };

  // emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiSelect = (emoji: any) => {
    setTypedMessage((prev) => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // mention
  const handleMention = () => {
    setTypedMessage((prev) => prev + '@');
  };

  // bold/italic
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const insertMarkdown = (wrapper: '**' | '_') => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const selectedText = typedMessage.slice(start, end);
    const newText =
      typedMessage.slice(0, start) + wrapper + selectedText + wrapper + typedMessage.slice(end);

    setTypedMessage(newText);
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current!.selectionStart = start + wrapper.length;
      textareaRef.current!.selectionEnd = end + wrapper.length;
    }, 0);
  };

  // My own display info
  const myDisplayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
    : 'Me';
  const myAvatarUrl =
    user?.profileImage || 'https://i.pravatar.cc/150?img=12';

  return (
    <div className="flex-1 flex flex-col bg-white">

      {/* ---------- HEADER AREA ---------- */}
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">

        {/* LEFT SECTION: If group chat, label "Group Chat"; else show "Me → Them" */}
        <div className="flex items-center gap-3">

          {/*  If group chat, show "Group Chat" text & participant count */}
          {isGroupChat ? (
            <div>
              <p className="font-semibold text-gray-800">Group Chat</p>
              <p className="text-xs text-gray-500">
                {conversation?.participants?.length || 0} participants
              </p>
            </div>
          ) : (
            // Else, we show "Me => otherUser"
            <div className="flex items-center gap-2">
              {/* My small avatar + name */}
              <img
                src={myAvatarUrl}
                alt={myDisplayName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <p className="text-xs text-gray-500">{myDisplayName || 'You'}</p>

              <FiArrowRight className="text-gray-400" />

              {/* Other user's bigger avatar + name/presence */}
              <img
                src={avatarUrl1on1}
                alt={displayName1on1}
                className="w-6 h-6 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800 text-sm">
                  {displayName1on1}
                </p>
                <p
                  className={`text-xs ${
                    isOnline ? 'text-green-500' : 'text-gray-400'
                  }`}
                >
                  {presenceStatus}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SECTION: camera/video/phone/settings */}
        <div className="flex items-center space-x-4 text-gray-500">
          <FiCamera className="cursor-pointer hover:text-gray-700" title="Send Photo" />
          <FiVideo className="cursor-pointer hover:text-gray-700" title="Start Video Call" />
          <FiPhone className="cursor-pointer hover:text-gray-700" title="Start Voice Call" />
          <FiSettings className="cursor-pointer hover:text-gray-700" title="Chat Settings" />
        </div>
      </div>

      {/* ---------- MESSAGES LIST ---------- */}
      <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-3  max-h-[65vh] md:max-h-[calc(90vh-150px)]">
  {conversationMessages.map((msg) => {
    const fromMe = msg.senderId === user?._id;
    const timeString = msg.createdAt
      ? new Date(msg.createdAt).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';
    return (
      <div key={msg._id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'} `}>
        <ChatMessageBubble
          message={{
            id: msg._id,
            text: msg.text,
            fromMe,
            time: timeString,
            images: msg.attachmentUrl ? [msg.attachmentUrl] : [],
          }}
          onDeleteMessage={onDeleteMessage}
          onForwardMessage={onForwardMessage}
        />
      </div>
    );
  })}
</div>

      {/* ---------- INPUT TOOLBAR + TEXTAREA ---------- */}
      <div className="border-t border-gray-200 p-2 relative">
        {/* optional top icons */}
        <div className="flex items-center space-x-2 mb-2 px-2">
          {/* attach file */}
          <button title="Attach File" onClick={handleAttachFileClick}>
            <FiPaperclip className="text-gray-500 hover:text-gray-700" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          {/* emoji */}
          <button title="Insert Emoji" onClick={() => setShowEmojiPicker((p) => !p)}>
            <FiSmile className="text-gray-500 hover:text-gray-700" />
          </button>

          {/* mention */}
          <button title="Mention" onClick={handleMention}>
            <FiAtSign className="text-gray-500 hover:text-gray-700" />
          </button>

          {/* bold */}
          <button title="Bold" onClick={() => insertMarkdown('**')}>
            <FiBold className="text-gray-500 hover:text-gray-700" />
          </button>
          {/* italic */}
          <button title="Italic" onClick={() => insertMarkdown('_')}>
            <FiItalic className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* emoji picker */}
        {showEmojiPicker && (
          <div className="absolute top-12 left-4 z-10">
            <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
          </div>
        )}

        {/* text area + send button */}
        <div className="flex items-center space-x-2">
          <textarea
            ref={textareaRef}
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm
                       focus:outline-none focus:ring-1 focus:ring-purple-400
                       resize-none h-10 overflow-hidden leading-tight"
            placeholder="Type your message..."
            value={typedMessage}
            onChange={(e) => {
              setTypedMessage(e.target.value);
              handleTyping(true);
            }}
            onBlur={() => handleTyping(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                handleTyping(false);
              }
            }}
          />
          <button
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
            onClick={() => {
              handleSend();
              handleTyping(false);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatContent;
