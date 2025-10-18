"use client";

import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
};

type ToastContextValue = {
  toast: (t: Omit<Toast, 'id'>) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9);
    const toastItem: Toast = {
      id,
      duration: 4000,
      variant: 'default',
      ...t,
    };
    setToasts((s) => [...s, toastItem]);
    if (toastItem.duration && toastItem.duration > 0) {
      setTimeout(() => {
        setToasts((s) => s.filter((x) => x.id !== id));
      }, toastItem.duration);
    }
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`max-w-sm w-full rounded-md shadow-lg px-4 py-3 text-sm font-medium text-white transition-opacity duration-200 ${
              t.variant === 'success'
                ? 'bg-green-600'
                : t.variant === 'error'
                ? 'bg-red-600'
                : t.variant === 'warning'
                ? 'bg-yellow-600 text-black'
                : 'bg-gray-800'
            }`}
          >
            {t.title && <div className="font-semibold">{t.title}</div>}
            {t.description && <div className="text-sm mt-1">{t.description}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

export default ToastProvider;
