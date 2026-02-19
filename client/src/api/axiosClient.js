import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  // This will now use the Tunnel URL from your .env file
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    console.error("🌐 Network Error:", status, url);

    if (status === 401 && url?.includes("/auth/me")) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);

export default api;