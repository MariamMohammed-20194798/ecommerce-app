import axios from "axios";

const fallbackApiBaseUrl = "http://localhost:3001/api";
const CART_SESSION_STORAGE_KEY = "cartSessionId";

export const getStoredCartSessionId = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(CART_SESSION_STORAGE_KEY);
};

export const storeCartSessionId = (sessionId: string | null | undefined) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!sessionId) {
    window.localStorage.removeItem(CART_SESSION_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(CART_SESSION_STORAGE_KEY, sessionId);
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? fallbackApiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("accessToken");
    const sessionId = getStoredCartSessionId();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (sessionId) {
      config.headers["x-session-id"] = sessionId;
    }
  }

  return config;
});

api.interceptors.response.use((response) => {
  const sessionId = response.headers["x-session-id"];
  if (typeof sessionId === "string" && sessionId.trim().length > 0) {
    storeCartSessionId(sessionId);
  }

  return response;
});

export default api;
