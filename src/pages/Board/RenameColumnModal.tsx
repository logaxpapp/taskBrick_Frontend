import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface RenameColumnModalProps {
  isOpen: boolean;
  columnId: string;
  initialName: string;
  onClose: () => void;
  onRename: (colId: string, newName: string) => void; 
}

const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const RenameColumnModal: React.FC<RenameColumnModalProps> = ({
  isOpen,
  columnId,
  initialName,
  onClose,
  onRename,
}) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
    }
  }, [isOpen, initialName]);

  const handleSave = () => {
    if (!name.trim()) return;
    onRename(columnId, name);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center p-4 overflow-y-auto"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div
              className="bg-white rounded shadow-lg w-full max-w-sm p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Rename Column</h2>
                <button onClick={onClose}>
                  <FiX className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600">Column Name</label>
                  <input
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  className="px-4 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-1 text-sm rounded bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RenameColumnModal;
