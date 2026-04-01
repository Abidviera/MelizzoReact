import { createContext, useContext, type ReactNode } from 'react';
import { Toaster, toast } from 'react-hot-toast';

interface NotificationContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  return (
    <NotificationContext.Provider
      value={{
        success: (message, duration) => toast.success(message, { duration: duration || 3000 }),
        error: (message, duration) => toast.error(message, { duration: duration || 4000 }),
        warning: (message, duration) => toast(message, { duration: duration || 4000, style: { background: '#92400e', color: '#fff' } }),
        info: (message, duration) => toast(message, { duration: duration || 3000, style: { background: '#1e40af', color: '#fff' } }),
      }}
    >
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1A0804',
            color: '#FAFEF9',
            border: '1px solid rgba(58,110,95,0.3)',
            borderRadius: '4px',
            fontFamily: "'Syne', sans-serif",
            fontSize: '14px',
            letterSpacing: '0.5px',
          },
          success: {
            iconTheme: { primary: '#3A6E5F', secondary: '#FAFEF9' },
          },
          error: {
            iconTheme: { primary: '#C34E7C', secondary: '#FAFEF9' },
          },
        }}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
}
