import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosClient from "../api/axiosClient";

const getUserKey = (user) => user?.id || "guest";

const useHistoryStore = create(
  persist(
    (set, get) => ({
      historyByUser: {},

      getHistory: (user) => {
        const key = getUserKey(user);
        return get().historyByUser[key] || [];
      },

      addResult: async (user, result) => {
        const key = getUserKey(user);

        // 1. OPTIMISTIC UPDATE (Update local state immediately)
        set((state) => ({
          historyByUser: {
            ...state.historyByUser,
            [key]: [result, ...(state.historyByUser[key] || [])],
          },
        }));

        // 2. BACKEND SYNC (Only for logged-in users)
        if (user) {
          try {
            // We map the local result object to the Backend's expected schema
            await axiosClient.post("/tests", {
              rawLog: result.rawLog,
              mode: result.mode,
              limit: result.limit,
              deviceType: "desktop", // optional but clean
            });
            console.log("✅ Result synced with cloud database.");
          } catch (err) {
            console.error(
              "❌ Cloud sync failed:",
              err.response?.data || err.message,
            );
            // Optional: You could implement a retry queue here for true production-grade reliability
          }
        }
      },

      clearHistory: (user) => {
        const key = getUserKey(user);
        set((state) => ({
          historyByUser: { ...state.historyByUser, [key]: [] },
        }));
      },
    }),
    {
      name: "typing-history", // Key in localStorage
    },
  ),
);

export default useHistoryStore;
