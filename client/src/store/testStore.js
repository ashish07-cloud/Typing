// transient state (current words, active index)
import { create } from "zustand";

export const useTestStore = create((set) => ({
  mode: "words", // 'time' | 'words'
  settings: {
    wordLimit: 25,
    timeLimit: 30,
    language: "english",
  },
  status: "idle", // 'idle' | 'running' | 'finished'
  results: null,

  setMode: (mode) => set({ mode }),
  setSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
  setStatus: (status) => set({ status }),
  setResults: (results) => set({ results }),
  resetTest: () => set({ status: "idle", results: null }),
}));