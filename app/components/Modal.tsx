"use client";

import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  darkMode?: boolean;
}

export function Modal({ isOpen, onClose, children, darkMode = true }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`
                  w-full max-w-3xl transform overflow-hidden rounded-2xl p-6 text-left align-middle
                  ${darkMode ? "bg-[#2A2A2A] text-[#F5F5F5]" : "bg-white text-gray-900"}
                  transition-all
                `}
              >
                <button
                  onClick={onClose}
                  className={`
                    absolute right-4 top-4 p-1 rounded-full hover:bg-opacity-20 transition-colors
                    ${darkMode ? "text-[#F5F5F5] hover:bg-[#F5F5F5]" : "text-gray-900 hover:bg-gray-100"}
                  `}
                >
                  <X className="h-6 w-6" />
                </button>
                
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}