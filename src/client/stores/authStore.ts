import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toAuthUser, type UserRole } from "../lib/roles";

const API = "http://localhost:3000/api";

let refreshPromise: Promise<boolean> | null = null;

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showLoginModal: boolean;
  showSignupModal: boolean;

  login:  (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, adminSetupSecret?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  hydrateSession: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  openLoginModal:   () => void;
  closeLoginModal:  () => void;
  openSignupModal:  () => void;
  closeSignupModal: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:            null,
      accessToken:     null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,
      showLoginModal:  false,
      showSignupModal: false,

      login: async (email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API}/auth/login`, {
            method:      "POST",
            credentials: "include",
            headers:     { "Content-Type": "application/json" },
            body:        JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            set({ error: data.error ?? "Login failed", isLoading: false });
            return false;
          }

          const { user, accessToken } = data.data;

          set({
            user: toAuthUser(user),
            accessToken,
            isAuthenticated:  true,
            isLoading:        false,
            showLoginModal:   false,
            showSignupModal:  false,
            error:            null,
          });
          return true;
        } catch {
          set({ error: "Server se connect nahi ho paya", isLoading: false });
          return false;
        }
      },

      signup: async (
        name: string,
        email: string,
        password: string,
        adminSetupSecret?: string
      ): Promise<boolean> => {
        set({ isLoading: true, error: null });
        try {
          const body: Record<string, string> = { name, email, password };
          if (adminSetupSecret) body.adminSetupSecret = adminSetupSecret;

          const res = await fetch(`${API}/auth/register`, {
            method:      "POST",
            credentials: "include",
            headers:     { "Content-Type": "application/json" },
            body:        JSON.stringify(body),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            set({ error: data.error ?? data.message ?? "Signup failed", isLoading: false });
            return false;
          }

          const { user, accessToken } = data.data;

          set({
            user: toAuthUser(user),
            accessToken,
            isAuthenticated:  true,
            isLoading:        false,
            showLoginModal:   false,
            showSignupModal:  false,
            error:            null,
          });
          return true;
        } catch {
          set({ error: "Server se connect nahi ho paya", isLoading: false });
          return false;
        }
      },

      logout: async () => {
        const { accessToken } = get();
        try {
          if (accessToken) {
            await fetch(`${API}/auth/logout`, {
              method:      "POST",
              credentials: "include",
              headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${accessToken}`,
              },
            });
          }
        } catch {
          // silent
        }
        set({
          user:            null,
          accessToken:     null,
          isAuthenticated: false,
          error:           null,
        });
      },

      refreshAccessToken: async (): Promise<boolean> => {
        if (refreshPromise) return refreshPromise;

        refreshPromise = (async () => {
          try {
            const res = await fetch(`${API}/auth/refresh`, {
              method:      "POST",
              credentials: "include",
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
              set({ user: null, accessToken: null, isAuthenticated: false });
              return false;
            }

            set({ accessToken: data.data.accessToken });
            return true;
          } catch {
            return false;
          }
        })();

        const result = await refreshPromise;
        refreshPromise = null;
        return result;
      },

      hydrateSession: async () => {
        const { accessToken, isAuthenticated } = get();
        if (!isAuthenticated || !accessToken) return;

        try {
          const res = await fetch(`${API}/auth/me`, {
            credentials: "include",
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await res.json();
          if (res.ok && data.success) {
            set({ user: toAuthUser(data.data) });
          }
        } catch {
          // ignore
        }
      },

      updateUser: (updates: Partial<User>) => {
        const current = get().user;
        if (!current) return;
        set({ user: toAuthUser({ ...current, ...updates }) });
      },

      openLoginModal:   () => set({ showLoginModal: true,  showSignupModal: false }),
      closeLoginModal:  () => set({ showLoginModal: false }),
      openSignupModal:  () => set({ showSignupModal: true, showLoginModal: false }),
      closeSignupModal: () => set({ showSignupModal: false }),
      setError:         (error) => set({ error }),
    }),
    {
      name:    "markets-pivot-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user:            state.user,
        accessToken:     state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const { accessToken, refreshAccessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let res = await fetch(`${API}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = useAuthStore.getState().accessToken;
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API}${url}`, {
        ...options,
        headers,
        credentials: "include",
      });
    }
  }

  return res;
}
