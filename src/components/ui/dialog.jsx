import * as React from "react";

export function Dialog({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl md:max-w-4xl lg:max-w-5xl p-2 sm:p-6 md:p-8 relative flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">
            {title}
          </h2>
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
