// File: src/components/chat/ChatMessageBubble.tsx
import React, { useState } from 'react';
import {
  FiMoreVertical,
  FiClipboard,
  FiTrash2,
  FiAlertCircle,
  FiCheck,
} from 'react-icons/fi';
import { BiCheckDouble } from 'react-icons/bi';

// We'll pass in some extra props for "onDelete", "onForward"
interface MessageProps {
  id: string;
  text?: string;
  images?: string[];
  fromMe: boolean;         // If it's the user's own message
  time: string;
  avatar?: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatMessageBubbleProps {
  message: MessageProps;
  onDeleteMessage: (messageId: string) => void; 
  onForwardMessage: (messageId: string, text: string) => void;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  onDeleteMessage,
  onForwardMessage,
}) => {
  // Bubbles: green if from me, white if from others
  const bubbleBg = message.fromMe ? 'bg-[#DCF8C6]' : 'bg-white'; 
  const bubbleSide = message.fromMe ? 'ml-auto' : 'mr-auto';

  // Hover menu
  const [isHovering, setIsHovering] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // (1) Copy
  const handleCopyToClipboard = () => {
    if (message.text) {
      navigator.clipboard.writeText(message.text);
      alert('Copied to clipboard!'); 
    }
  };

  // (2) Delete
  const handleDeleteMessage = () => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    onDeleteMessage(message.id);
  };

  // (3) Forward
  const handleForwardMessage = () => {
    if (!message.text) return;
    onForwardMessage(message.id, message.text);
  };

  // Show check icons for "sent/delivered/read"
  const renderStatusIcon = () => {
    if (!message.fromMe || !message.status) return null;
    switch (message.status) {
      case 'sent':
        return <FiCheck className="inline-block ml-1" aria-label="Sent" />;
      case 'delivered':
        return <BiCheckDouble className="inline-block ml-1" aria-label="Delivered" />;
      case 'read':
        return <BiCheckDouble className="inline-block ml-1 text-blue-500" aria-label="Read" />;
      default:
        return null;
    }
  };

  // Image modal
  const handleImageClick = (src: string) => {
    setSelectedImage(src);
    setIsImageModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedImage(null);
    setIsImageModalOpen(false);
  };

  return (
    <div className={`flex mb-3 items-end ${bubbleSide}`}>
      {/* (Optional) Avatar on the left if not from me */}
      {!message.fromMe && message.avatar && (
        <img
          src={message.avatar}
          alt="User Avatar"
          className="w-10 h-10 rounded-full mr-3 self-end"
        />
      )}

      {/* Container for bubble + menu */}
      <div
        className="relative max-w-sm md:max-w-md lg:max-w-lg pr-12"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setShowMenu(false);
        }}
      >
        {/* The bubble itself */}
        <div className={`${bubbleBg} px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition duration-200`}>
          {/* Text (right-click to copy) */}
          {message.text && (
            <p
              className="text-sm whitespace-pre-wrap break-words"
              onContextMenu={(e) => {
                e.preventDefault();
                handleCopyToClipboard();
              }}
            >
              {message.text}
            </p>
          )}

          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {message.images.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="attachment"
                  className="w-24 h-24 object-cover rounded cursor-pointer transition-transform hover:scale-105"
                  onClick={() => handleImageClick(src)}
                />
              ))}
            </div>
          )}

          {/* Time + Status */}
          <div
            className={`mt-2 flex items-center text-xs opacity-70 ${
              message.fromMe ? 'justify-end' : 'justify-between'
            }`}
          >
            {!message.fromMe && <span>{message.time}</span>}
            {message.fromMe && (
              <span>
                {message.time}
                {renderStatusIcon()}
              </span>
            )}
          </div>
        </div>

        {/* The 3-dots button (only on hover) */}
        {isHovering && (
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="absolute top-1/2 right-0 -translate-y-1/2 
                       bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition duration-200"
          >
            <FiMoreVertical className="text-gray-600" />
          </button>
        )}

        {/* The pop-up menu */}
        {showMenu && (
          <div
            className="absolute top-1/2 left-10 -translate-y-1/3
                       bg-white border border-gray-200 rounded shadow-md
                       py-2 px-3 text-xs flex flex-col w-30 z-20"
          >
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center hover:bg-gray-100 py-1 px-2 rounded"
            >
              <FiClipboard className="mr-2" />
              Copy
            </button>
            <button
              onClick={handleForwardMessage}
              className="flex items-center hover:bg-gray-100 py-1 px-2 rounded"
            >
              <FiAlertCircle className="mr-2" />
              Forward
            </button>
            <button
              onClick={handleDeleteMessage}
              className="flex items-center hover:bg-gray-100 py-1 px-2 rounded"
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Image modal overlay */}
      {isImageModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          onClick={handleCloseModal}
        >
          <img src={selectedImage} alt="Full View" className="max-w-full max-h-full rounded" />
        </div>
      )}
    </div>
  );
};

export default ChatMessageBubble;
