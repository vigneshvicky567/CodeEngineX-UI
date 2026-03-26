import { create } from 'zustand';
import { clearTokens, getAccessToken, saveTokens } from '../lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, refreshToken?: string, user?: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  login: async (token, refreshToken, user) => {
    await saveTokens(token, refreshToken);
    set({ isLoggedIn: true, user: user || null });
  },
  logout: async () => {
    await clearTokens();
    set({ isLoggedIn: false, user: null });
  },
  checkAuth: async () => {
    const token = await getAccessToken();
    if (token) {
      set({ isLoggedIn: true });
      return true;
    }
    set({ isLoggedIn: false });
    return false;
  },
}));
