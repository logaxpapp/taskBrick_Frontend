import { useState } from "react";
import { ToastProps, ToastVariant } from "./Toast";
import { nanoid } from "nanoid";

/**
 * Custom hook to manage toast notifications.
 */
export const useToastManager = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  /**
   * Adds a toast notification
   */
  const addToast = (message: string, variant: ToastVariant = "info", duration = 3000) => {
    const newToast: ToastProps = {
      id: nanoid(), // Unique ID for the toast
      message,
      variant,
      duration,
      onClose: removeToast,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  /**
   * Removes a toast notification
   */
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
};
