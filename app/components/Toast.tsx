'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import type { ToastType } from '../context/ToastContext';

// Helper interface for ToastItem props
interface ToastItemProps {
  toast: {
    id: number;
    message: string;
    type: ToastType;
    isExiting?: boolean;
  };
  onHide: (id: number) => void;
}

// Helper function for toast styles
const getToastStyles = (type: ToastType): { borderColorClass: string } => {
  switch (type) {
    case 'success': return { borderColorClass: 'border-green-500' };
    case 'error':   return { borderColorClass: 'border-red-500' };
    case 'warning': return { borderColorClass: 'border-yellow-500' };
    case 'info':    return { borderColorClass: 'border-blue-500' };
    default:      return { borderColorClass: 'border-gray-400' }; // Neutral default
  }
};

// ToastItem sub-component
const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in after a short delay to allow initial styles to apply and trigger transition
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50); // ms, adjust as needed for desired animation feel
    return () => clearTimeout(timer);
  }, []);

  const { borderColorClass } = getToastStyles(toast.type);
  
  // Determine if the toast should be in its "visible" state for animation
  const shouldBeVisible = isVisible && !toast.isExiting;

  return (
    <div
      className={`
        w-full p-4 rounded-lg shadow-xl bg-neutral-800 text-neutral-100 
        border-l-4 ${borderColorClass}
        flex items-center justify-between
        transition-all duration-300 ease-in-out transform
        ${shouldBeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}
      `}
    >
      <span className="flex-grow break-words mr-3">{toast.message}</span>
      <button
        onClick={() => onHide(toast.id)}
        className="ml-auto flex-shrink-0 p-1 rounded-full text-neutral-400 hover:text-neutral-100 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500"
        aria-label="Close toast"
      >
        <svg
          className="w-5 h-5" // Icon size adjusted
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  );
};

const Toast: React.FC = () => {
  const { toasts, hideToast } = useToast();

  if (!toasts.length) {
    return null;
  }

  // getBackgroundColor is removed as getToastStyles is now a module-level helper
  // and ToastItem handles its own rendering based on toast properties.

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center space-y-3 w-full max-w-md px-4">
      {toasts.map((toast) => (
        // Use the new ToastItem component
        <ToastItem key={toast.id} toast={toast} onHide={hideToast} />
      ))}
    </div>
  );
};

export default Toast;