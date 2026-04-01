import type { User } from '../types';

const AUTH_KEY = 'melizzo_auth';

function loadAuth(): { user: User | null; token: string | null } {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
}

function saveAuth(user: User | null, token: string | null) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
}

export const AuthService = {
  getUser(): User | null {
    return loadAuth().user;
  },

  isAuthenticated(): boolean {
    return loadAuth().user !== null;
  },

  async login(email: string, _password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((r) => setTimeout(r, 800));

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      firstName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      lastName: '',
      createdAt: new Date().toISOString(),
    };

    saveAuth(user, `mock_token_${Date.now()}`);
    return { success: true, user };
  },

  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((r) => setTimeout(r, 1000));

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    if (!firstName) {
      return { success: false, error: 'First name is required' };
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString(),
    };

    saveAuth(user, `mock_token_${Date.now()}`);
    return { success: true, user };
  },

  logout() {
    saveAuth(null, null);
  },

  async updateProfile(data: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    await new Promise((r) => setTimeout(r, 500));
    const current = loadAuth();
    if (!current.user) {
      return { success: false, error: 'Not authenticated' };
    }
    const updated = { ...current.user, ...data };
    saveAuth(updated, current.token);
    return { success: true, user: updated };
  },
};
