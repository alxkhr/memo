import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "./connect/user";

interface State {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user: User, token: string) => {
        set({ user, token });
      },
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "connect",
      getStorage: () => localStorage,
    }
  )
);
