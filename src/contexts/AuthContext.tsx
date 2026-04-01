import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(AuthService.getUser());
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await AuthService.login(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(email, password, firstName, lastName);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return { success: result.success, error: result.error };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const result = await AuthService.updateProfile(data);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return { success: result.success, error: result.error };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
