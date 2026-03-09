import api from "@kembang/api-client";

// API client is already initialized with NEXT_PUBLIC_API_BASE_URL in the api-client package
// This file just re-exports the api instance

console.log("[API] Client initialized with baseURL:", api.instance.defaults.baseURL);

// Add request interceptor for logging
api.instance.interceptors.request.use(
  (config) => {
    console.log("[API] Request:", config.method?.toUpperCase(), config.url);
    const auth = config.headers.Authorization;
    if (auth && typeof auth === 'string') {
      console.log("[API] Auth token:", auth.substring(0, 15) + "...");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { api };
export default api;
