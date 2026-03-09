import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import api from "@/lib/api";

interface User {
  id: string;
  email: string;
  tenant_id: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

// Safe storage wrapper for Next.js SSR and Turbopack
const safeStorage: StateStorage = {
  getItem: (name: string) => {
    try {
      if (
        typeof window !== "undefined" &&
        window.localStorage &&
        typeof window.localStorage.getItem === "function"
      ) {
        return window.localStorage.getItem(name);
      }
    } catch (e) {}
    return null;
  },
  setItem: (name: string, value: string) => {
    try {
      if (
        typeof window !== "undefined" &&
        window.localStorage &&
        typeof window.localStorage.setItem === "function"
      ) {
        window.localStorage.setItem(name, value);
      }
    } catch (e) {}
  },
  removeItem: (name: string) => {
    try {
      if (
        typeof window !== "undefined" &&
        window.localStorage &&
        typeof window.localStorage.removeItem === "function"
      ) {
        window.localStorage.removeItem(name);
      }
    } catch (e) {}
  },
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token, user) => {
        api.setToken(token);
        api.setTenantId(user.tenant_id);
        set({ token, user });
      },
      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: "kembang-auth",
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => {
        // This runs when the auth state is rehydrated from localStorage
        return (state, error) => {
          if (error || !state?.token) return;
          // Set the API token when rehydrating
          api.setToken(state.token);
          // Also set tenant ID if user exists
          if (state.user?.tenant_id) {
            api.setTenantId(state.user.tenant_id);
          }
        };
      },
    },
  ),
);
