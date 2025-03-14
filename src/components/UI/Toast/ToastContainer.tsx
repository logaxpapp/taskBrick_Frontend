import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast, { ToastProps } from './Toast';

/** 
 * Props:
 * - toasts: an array of ToastProps (minus the onClose).
 * - onClose: function to remove a toast by id
 */
interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onClose: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      <AnimatePresence>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            variant={t.variant}
            duration={t.duration}
            onClose={onClose}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
