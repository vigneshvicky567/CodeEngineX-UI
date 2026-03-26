import { create } from 'zustand';

interface User {
  id?: string;
  email?: string;
  username?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  tokens: { access_token: string | null; refresh_token: string | null };
  isLoggedIn: boolean;
  login: (user: User, tokens: { access_token: string; refresh_token?: string }) => void;
  logout: () => void;
  setLoggedIn: (isLoggedIn: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: { access_token: null, refresh_token: null },
  isLoggedIn: false,
  login: (user, tokens) => set({ user, tokens: { access_token: tokens.access_token, refresh_token: tokens.refresh_token || null }, isLoggedIn: true }),
  logout: () => set({ user: null, tokens: { access_token: null, refresh_token: null }, isLoggedIn: false }),
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));
