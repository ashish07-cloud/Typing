import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Ensure this matches your server port
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

    // Only logout if token is invalid AND request was auth-related
    if (status === 401 && url?.includes("/auth/me")) {
      useAuthStore.getState().logout();
    }

    return Promise.reject(error);
  }
);


export default api;