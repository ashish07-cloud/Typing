import { create } from "zustand";
import axiosClient from "../api/axiosClient";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: true,

  // ---------- AUTH STATE ----------
  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    set({ user, token, loading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },

  // ---------- API ACTIONS ----------
  login: async (credentials) => {
    const res = await axiosClient.post("/auth/login", credentials);
    const { user, token } = res.data;
    localStorage.setItem("token", token);
    set({ user, token });
  },

  register: async (data) => {
    const res = await axiosClient.post("/auth/register", data);
    const { user, token } = res.data;
    localStorage.setItem("token", token);
    set({ user, token });
  },

  fetchMe: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const res = await axiosClient.get("/auth/me");
      set({ user: res.data.user, loading: false });
    } catch {
      localStorage.removeItem("token");
      set({ user: null, token: null, loading: false });
    }
  },
}));

export default useAuthStore;
