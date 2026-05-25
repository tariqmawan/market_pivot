import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const API = "http://localhost:3000/api";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showLoginModal: boolean;
  showSignupModal: boolean;

  // Actions
  login:  (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
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
      refreshToken:    null,
      isAuthenticated: false,
      isLoading:       false,
      error:           null,
      showLoginModal:  false,
      showSignupModal: false,

      // ── LOGIN ──────────────────────────────────────────────────────────────
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API}/auth/login`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ email, password }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            set({ error: data.error ?? "Login failed", isLoading: false });
            return;
          }

          const { user, accessToken, refreshToken } = data.data;

          set({
            user: { ...user, isAdmin: user.role === "admin" },
            accessToken,
            refreshToken,
            isAuthenticated:  true,
            isLoading:        false,
            showLoginModal:   false,
            showSignupModal:  false,
            error:            null,
          });
        } catch {
          set({ error: "Server se connect nahi ho paya", isLoading: false });
        }
      },

      // ── SIGNUP ─────────────────────────────────────────────────────────────
      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API}/auth/register`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ name, email, password }),
          });

          const data = await res.json();

          if (!res.ok || !data.success) {
            set({ error: data.error ?? "Signup failed", isLoading: false });
            return;
          }

          const { user, accessToken, refreshToken } = data.data;

          set({
            user: { ...user, isAdmin: user.role === "admin" },
            accessToken,
            refreshToken,
            isAuthenticated:  true,
            isLoading:        false,
            showLoginModal:   false,
            showSignupModal:  false,
            error:            null,
          });
        } catch {
          set({ error: "Server se connect nahi ho paya", isLoading: false });
        }
      },

      // ── LOGOUT ─────────────────────────────────────────────────────────────
      logout: async () => {
        const { accessToken, refreshToken } = get();
        try {
          if (accessToken) {
            await fetch(`${API}/auth/logout`, {
              method:  "POST",
              headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ refreshToken }),
            });
          }
        } catch {
          // Logout silently fail hone dena theek hai
        }
        set({
          user:            null,
          accessToken:     null,
          refreshToken:    null,
          isAuthenticated: false,
          error:           null,
        });
      },

      // ── REFRESH TOKEN ──────────────────────────────────────────────────────
      refreshAccessToken: async (): Promise<boolean> => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const res = await fetch(`${API}/auth/refresh`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ refreshToken }),
          });

          const data = await res.json();
          if (!res.ok || !data.success) {
            // Refresh bhi fail — logout karo
            set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
            return false;
          }

          set({
            accessToken:  data.data.accessToken,
            refreshToken: data.data.refreshToken,
          });
          return true;
        } catch {
          return false;
        }
      },

      updateUser: (updates: Partial<User>) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...updates } });
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
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ── API helper — token auto-attach + auto-refresh ───────────────────────────
export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const { accessToken, refreshAccessToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  let res = await fetch(`${API}${url}`, { ...options, headers });

  // 401 aaya — token refresh karke dobara try karo
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const newToken = useAuthStore.getState().accessToken;
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${API}${url}`, { ...options, headers });
    }
  }

  return res;
}
