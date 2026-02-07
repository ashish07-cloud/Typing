import { create } from "zustand";
import { persist } from "zustand/middleware";

const useSettingStore = create(
  persist(
    (set) => ({
      // ── Preferences ─────────────────────
      mode: "time",          // "time" | "words"
      activeTime: 60,        // seconds
      wordLimit: 25,         // number of words

      // ── Setters ─────────────────────────
      setMode: (mode) => set({ mode }),
      setActiveTime: (activeTime) => set({ activeTime }),
      setWordLimit: (wordLimit) => set({ wordLimit }),
    }),
    {
      name: "typing-settings", // localStorage key
      version: 1,
    }
  )
);

export default useSettingStore;
