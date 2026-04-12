import { createContext, useContext, type ReactNode } from 'react';

interface AuthModalContextType {
  openAuthModal: (onSuccess?: () => void) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  // AuthModal is always mounted — CSS handles visibility.
  // The onSuccess callback is called by AuthModal after a successful auth.
  function openAuthModal(onSuccess?: () => void) {
    // Store onSuccess in sessionStorage so AuthModal can retrieve it after redirect
    if (onSuccess) {
      sessionStorage.setItem('auth_callback', '1');
    }
    // Dispatch a custom event that AuthModal listens for
    window.dispatchEvent(new CustomEvent('open_auth_modal', { detail: { onSuccess: !!onSuccess } }));
  }

  function closeAuthModal() {
    sessionStorage.removeItem('auth_callback');
    window.dispatchEvent(new CustomEvent('close_auth_modal'));
  }

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) throw new Error('useAuthModal must be used within AuthModalProvider');
  return ctx;
}
