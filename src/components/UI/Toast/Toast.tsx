import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;            // unique ID
  message: string;
  variant?: ToastVariant;
  duration?: number;     // auto-dismiss in ms (e.g. 3000)
  onClose: (id: string) => void;
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  warning: 'bg-yellow-500',
  info: 'bg-blue-600',
};

const Toast: React.FC<ToastProps> = ({ id, message, variant = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key={id}
        className={`shadow-lg text-white px-4 py-2 rounded flex items-center space-x-2 ${variantStyles[variant]}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.3 }}
      >
        <span className="flex-1">{message}</span>
        <button onClick={() => onClose(id)} className="hover:opacity-80">
          <FiX />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
