import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 items-end">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-xl shadow-2xl border-2 border-blue-200 bg-gradient-to-br from-white via-blue-50 to-blue-100 text-blue-900 font-semibold text-base flex items-center gap-3 animate-fade-in-up ${toast.type === 'error' ? 'border-red-300 bg-red-50 text-red-700' : toast.type === 'success' ? 'border-green-300 bg-green-50 text-green-700' : ''}`}
            style={{ minWidth: 220, maxWidth: 320 }}
          >
            {toast.type === 'success' && (
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            )}
            {toast.type === 'error' && (
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
            {toast.type === 'info' && (
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01" /></svg>
            )}
            <span className="truncate">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
