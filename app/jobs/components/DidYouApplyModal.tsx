// components/DidYouApplyModal.tsx
import { useEffect } from "react";

interface DidYouApplyModalProps {
  open: boolean;
  onClose: () => void;
  onYes: () => void;
  isLoading?: boolean;
}

export const DidYouApplyModal = ({
  open,
  onClose,
  onYes,
  isLoading = false,
}: DidYouApplyModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-lg font-medium text-gray-900 mb-4 text-center">
          Did you apply for this position?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onYes}
            disabled={isLoading}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Applying...' : 'Yes'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};
