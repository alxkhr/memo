import { create } from "zustand";
import { User } from "./user";

const USER_KEY = "user";
const TOKEN_KEY = "token";

interface ConnectStore {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useConnectStore = create<ConnectStore>((set) => ({
  user: localStorage.getItem(USER_KEY)
    ? JSON.parse(localStorage.getItem(USER_KEY)!)
    : null,
  token: localStorage.getItem(TOKEN_KEY) || null,
  login: (user: User, token: string) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    set({ user: null, token: null });
  },
}));
