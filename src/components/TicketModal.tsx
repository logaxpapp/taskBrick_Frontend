// File: src/components/Header/TicketModal.tsx
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');

  if (!isOpen) return null;

  const handleCreateTicket = () => {
    // Example logic
    alert(`Ticket "${ticketTitle}" created!`);
    setTicketTitle('');
    setTicketDesc('');
    onClose();
  };

  return (
    <div className="absolute left-40 top-20 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Create a New Ticket</h3>
        <button onClick={onClose}>
          <XMarkIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ticket Title
          </label>
          <input
            type="text"
            placeholder="Enter ticket title"
            className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={ticketTitle}
            onChange={(e) => setTicketTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            placeholder="Enter ticket description"
            className="w-full mt-1 px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
            value={ticketDesc}
            onChange={(e) => setTicketDesc(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 transition"
          onClick={handleCreateTicket}
        >
          Create Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketModal;
