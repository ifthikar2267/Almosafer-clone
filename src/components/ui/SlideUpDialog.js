"use client";

import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Reusable slide-up dialog (bottom sheet / full-screen).
 * @param {boolean} open
 * @param {function} onClose
 * @param {string} [title] - Optional header title
 * @param {"full"|"bottom"} [variant="full"] - "full" = full height; "bottom" = panel at bottom (max-h 65vh)
 * @param {React.ReactNode} children
 */
export default function SlideUpDialog({ open, onClose, title, variant = "full", children }) {
  const isBottom = variant === "bottom";

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {isBottom ? (
        <div className="fixed inset-x-0 bottom-0 flex justify-center">
          <Dialog.Panel className="bg-white w-full max-h-[65vh] rounded-t-2xl p-1">
            {children}
          </Dialog.Panel>
        </div>
      ) : (
        <div className="fixed inset-x-0 top-0 bottom-0 bg-white shadow-lg animate-slide-up p-5 overflow-y-auto">
          {title != null && (
            <div className="relative flex items-center mb-6">
              <button onClick={onClose} className="absolute left-0">
                <XMarkIcon className="w-6 h-6 text-cyan-600" />
              </button>
              <h2 className="mx-auto text-lg font-semibold text-gray-800">{title}</h2>
            </div>
          )}
          {children}
        </div>
      )}
    </Dialog>
  );
}
