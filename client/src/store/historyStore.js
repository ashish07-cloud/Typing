import { create } from "zustand";
import { persist } from "zustand/middleware";

const getUserKey = (user) => user?.id || "guest";

const useHistoryStore = create(
  persist(
    (set, get) => ({
      historyByUser: {},

      getHistory: (user) => {
        const key = getUserKey(user);
        return get().historyByUser[key] || [];
      },

      addResult: (user, result) => {
        const key = getUserKey(user);

        set((state) => ({
          historyByUser: {
            ...state.historyByUser,
            [key]: [result, ...(state.historyByUser[key] || [])],
          },
        }));
      },

      clearHistory: (user) => {
        const key = getUserKey(user);

        set((state) => ({
          historyByUser: {
            ...state.historyByUser,
            [key]: [],
          },
        }));
      },
    }),
    {
      name: "typing-history",
    }
  )
);

export default useHistoryStore;
