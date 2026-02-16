import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosClient from "../api/axiosClient";

// Helper to apply theme to DOM
const applyTheme = (prefs) => {
  if (!prefs) return;
  const root = document.documentElement;
  root.setAttribute("data-theme", prefs.theme || "olive");
  root.style.setProperty("--font-size", `${prefs.fontSize || 16}px`);
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isInitialized: false,

      initialize: async () => {
        const token = get().token;

        if (!token) {
          set({ isInitialized: true });
          return;
        }

        try {
          const res = await axiosClient.get("/auth/me");
          applyTheme(res.data.user.preferences);
          set({ user: res.data.user, isInitialized: true });
        } catch (error) {
          set({ user: null, token: null, isInitialized: true });
        }
      },

      login: async (credentials) => {
        const res = await axiosClient.post("/auth/login", credentials);
        const { user, token } = res.data;
        applyTheme(user.preferences);
        set({ user, token, isInitialized: true });
      },

      register: async (userData) => {
        const res = await axiosClient.post("/auth/register", userData);
        const { user, token } = res.data;
        applyTheme(user.preferences);
        set({ user, token, isInitialized: true });
      },

      updatePreferences: async (newPrefs) => {
        const res = await axiosClient.put("/auth/preferences", {
          preferences: newPrefs,
        });
        applyTheme(res.data.preferences);
        set({
          user: { ...get().user, preferences: res.data.preferences },
        });
      },

      logout: () => {
        set({ user: null, token: null });
        document.documentElement.removeAttribute("data-theme");
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),

      // 🔥 THIS IS THE FIX
      onRehydrateStorage: () => (state) => {
        if (state?.user?.preferences) {
          applyTheme(state.user.preferences);
        }
      },
    },
  ),
);

export default useAuthStore;
