import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider?: "google" | "apple" | "facebook" | "twitter" | "email";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  showLoginModal: boolean;
  showSignupModal: boolean;
  login: (provider?: string) => Promise<void>;
  signup: (provider?: string) => Promise<void>;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      showLoginModal: false,
      showSignupModal: false,

      login: async (provider = "email") => {
        set({ isLoading: true, error: null });

        try {
          // Simulate OAuth flow or API call
          // In production, this would redirect to OAuth provider
          await new Promise((resolve) => setTimeout(resolve, 1500));

          // Demo: Create a mock user
          const mockUser: User = {
            id: `user_${Date.now()}`,
            email: `demo@${provider}.com`,
            name: `Demo User (${provider})`,
            provider: provider as User["provider"],
          };

          set({ user: mockUser, isAuthenticated: true, isLoading: false, showLoginModal: false });
        } catch (err) {
          set({ error: "Login failed. Please try again.", isLoading: false });
        }
      },

      signup: async (provider = "email") => {
        set({ isLoading: true, error: null });

        try {
          // Simulate signup flow
          await new Promise((resolve) => setTimeout(resolve, 1500));

          const mockUser: User = {
            id: `user_${Date.now()}`,
            email: `newuser@${provider}.com`,
            name: `New User (${provider})`,
            provider: provider as User["provider"],
          };

          set({ user: mockUser, isAuthenticated: true, isLoading: false, showSignupModal: false });
        } catch (err) {
          set({ error: "Signup failed. Please try again.", isLoading: false });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      openLoginModal: () => {
        set({ showLoginModal: true, showSignupModal: false });
      },

      closeLoginModal: () => {
        set({ showLoginModal: false });
      },

      openSignupModal: () => {
        set({ showSignupModal: true, showLoginModal: false });
      },

      closeSignupModal: () => {
        set({ showSignupModal: false });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: "markets-pivot-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
