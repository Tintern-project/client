"use client";
import React, { useEffect, useRef } from "react";
import styles from "./Popup.module.css";

export const Popup = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Body scroll prevention
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${styles.popupOverlay}`}
    >
      <div
        ref={popupRef}
        className={`bg-white rounded-xl w-11/12 max-w-2xl max-h-[80vh] sm:max-h-[75vh] flex flex-col shadow-2xl ${styles.popupContent}`}
      >
        {/* Header with subtle underline */}
        <div className="px-3 sm:px-5 py-3 sm:py-4 text-center">
          <h3 className="text-lg sm:text-xl font-medium text-gray-900 relative">
            {title}
            <span className={styles.titleUnderline} />
          </h3>
        </div>

        {/* Content area with hidden scroll and subtle inner shadow */}
        <div
          className={`mb-4 sm:mb-5 py-0 px-4 sm:px-10 overflow-y-auto flex-grow relative ${styles.scrollbarHide}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Popup;
