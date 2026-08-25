import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

/**
 * Resolves the backend API base URL:
 * 1. Checks VITE_API_URL environment variable (from Vercel / .env)
 * 2. In local dev (Vite), falls back to "http://localhost:5000/api"
 * 3. In production, sanitizes and formats the Render / deployed backend URL
 */
export const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;

  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    let cleanUrl = envUrl.trim();
    if (cleanUrl.endsWith("/")) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    if (!cleanUrl.endsWith("/api")) {
      cleanUrl = `${cleanUrl}/api`;
    }
    return cleanUrl;
  }

  // Local development fallback
  if (import.meta.env.DEV) {
    return "http://localhost:5000/api";
  }

  // Production fallback
  return "/api";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest.headers["X-Retry"]
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      useAuthStore.getState().logout();
      toast.error("Session expired. Please log in again.");
      processQueue(error);
      isRefreshing = false;
      return Promise.reject(error);
    }

    if (status && status >= 500) {
      toast.error("Server error. Please try again later.", { id: "server-error" });
    } else if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
      toast.error("Cannot connect to server. Please check your network connection or verify the backend is running.", {
        id: "network-error",
      });
    }

    return Promise.reject(error);
  },
);

export default api;
