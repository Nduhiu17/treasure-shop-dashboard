import * as React from "react";

export function WideDialog({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-2 sm:p-8 md:p-12 relative flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-blue-900">
              {title}
            </h2>
          )}
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="overflow-y-auto max-h-[80vh] w-full">{children}</div>
      </div>
    </div>
  );
}
