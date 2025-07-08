import React from "react";

export default function ConfirmDialog({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, loading = false }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-2 sm:px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-sm md:max-w-md p-2 sm:p-6 md:p-8 relative flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900">{title}</h2>
          )}
          <button
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="text-blue-900 text-base mb-6">{message}</div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-blue-900 font-semibold shadow hover:bg-gray-300 transition-all duration-150"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-500 text-white font-bold shadow hover:from-red-700 hover:to-pink-600 transition-all duration-150 flex items-center gap-2 disabled:opacity-60"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <span className="loader border-white border-t-red-400 mr-2 w-4 h-4 rounded-full border-2 border-solid animate-spin"></span>}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
