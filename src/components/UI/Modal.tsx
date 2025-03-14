import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0 },
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          />
          {/* Modal container */}
          <motion.div
            className="
              fixed z-50 inset-0 
              flex items-center justify-center
              p-4
            "
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="bg-white w-full max-w-md rounded shadow-lg overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <FiX />
                </button>
              </div>
              {/* Body */}
              <div className="p-4">
                {children}
              </div>
              {/* Footer */}
              {footer && (
                <div className="border-t border-gray-200 p-4 flex justify-end">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
