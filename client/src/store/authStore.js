import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosClient from "../api/axiosClient";

// Helper to apply theme to DOM
import { THEMES } from "../styles/themes";

const applyTheme = (prefs) => {
  if (!prefs) return;

  const themeName = prefs.theme || "olive";
  const theme = THEMES[themeName];

  if (!theme) return;

  const root = document.documentElement;

  root.style.setProperty("--bg-color", theme.bg);
  root.style.setProperty("--main-color", theme.main);
  root.style.setProperty("--sub-color", theme.sub);
  root.style.setProperty("--text-color", theme.text);
  root.style.setProperty("--error-color", theme.error);

  root.style.setProperty("--font-size", `${prefs.fontSize || 16}px`);

  root.setAttribute("data-theme", themeName);
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
        const current = get().user?.preferences || {};

        const fullPrefs = {
          theme: newPrefs.theme ?? current.theme ?? "olive",
          soundEnabled: newPrefs.soundEnabled ?? current.soundEnabled ?? true,
          showWpmGraph: newPrefs.showWpmGraph ?? current.showWpmGraph ?? true,
          caretStyle: newPrefs.caretStyle ?? current.caretStyle ?? "line",
          fontSize: newPrefs.fontSize ?? current.fontSize ?? 16,
        };

        const res = await axiosClient.put("/auth/preferences", {
          preferences: fullPrefs,
        });

        set({
          user: {
            ...get().user,
            preferences: res.data.preferences,
          },
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
