import type { User } from '../types';
import apiClient, {
  getStoredAuth,
  saveAuth,
  clearAuth,
  updateToken,
  getErrorMessage,
} from './apiClient';

// ── Backend DTO types ─────────────────────────────────────────
interface AuthResponseDto {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    createdAt: string;
    role: string;
  };
  token: string;
  refreshToken?: string;
}

interface CurrentUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// ── Mapping ────────────────────────────────────────────────────
function mapUser(dto: AuthResponseDto['user']): User {
  return {
    id: dto.id,
    email: dto.email,
    firstName: dto.firstName,
    lastName: dto.lastName,
    phone: dto.phone,
    createdAt: dto.createdAt,
    role: (dto.role ?? 'customer').toLowerCase() as 'admin' | 'customer',
  };
}

// ── Auth Service ──────────────────────────────────────────────
export const AuthService = {
  getUser(): User | null {
    const auth = getStoredAuth();
    if (!auth) return null;
    // Backwards compat: existing stored users may lack role
    return { ...auth.user, role: (auth.user as { role?: string }).role as 'admin' | 'customer' ?? 'customer' };
  },

  isAuthenticated(): boolean {
    return !!getStoredAuth()?.token;
  },

  async login(
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log('authService.login called', { email, password });
      const response = await apiClient.post<AuthResponseDto>('/auth/login', {
        email,
        password,
      });

      const { user: userDto, token, refreshToken } = response.data;
      const user = mapUser(userDto);

      saveAuth({ user, token, refreshToken });
      return { success: true, user };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  },

  async register(
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await apiClient.post<AuthResponseDto>('/auth/register', {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      });

      const { user: userDto, token, refreshToken } = response.data;
      const user = mapUser(userDto);

      saveAuth({ user, token, refreshToken });
      return { success: true, user };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Ignore errors — clear local auth regardless
    }
    clearAuth();
  },

  async logoutLocal(): Promise<void> {
    clearAuth();
  },

  async updateProfile(
    data: Partial<User>,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    const auth = getStoredAuth();
    if (!auth) return { success: false, error: 'Not authenticated' };

    try {
      const response = await apiClient.patch<CurrentUserDto>('/auth/me', {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });

      const updatedUser: User = {
        ...auth.user,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
      };

      saveAuth({ ...auth, user: updatedUser });
      return { success: true, user: updatedUser };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<CurrentUserDto>('/auth/me');
      const dto = response.data;
      const auth = getStoredAuth();
      if (!auth) return null;

      const user: User = {
        ...auth.user,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        role: (dto.role ?? 'customer').toLowerCase() as 'admin' | 'customer',
      };
      saveAuth({ ...auth, user });
      return user;
    } catch {
      return null;
    }
  },

  async forgotPassword(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return { success: true, message: response.data?.message };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  },

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post('/auth/reset-password', {
        email,
        token,
        newPassword,
      });
      return { success: true, message: response.data?.message };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return { success: true, message: response.data?.message };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  },

  // ── Token helpers ──────────────────────────────────────────
  updateToken,
  clearAuth,
  getStoredAuth,
};
