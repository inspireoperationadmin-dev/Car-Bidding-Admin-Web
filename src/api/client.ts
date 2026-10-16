import axios from "axios";
import { APP_ENV } from "../config/env";

const apiClient = axios.create({
  baseURL: APP_ENV.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
let isRedirecting = false;

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const handleLogout = () => {
  if (isRedirecting) return;
  isRedirecting = true;
  localStorage.removeItem("authToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("authUser");
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    // 1. Handle 403 Forbidden (Insufficient permissions / invalid role) immediately
    if (response?.status === 403) {
      handleLogout();
      return Promise.reject(error);
    }

    // 2. Handle 401 Unauthorized (Session expired or invalid token)
    if (response?.status === 401) {
      const isLoginRequest = originalRequest?.url?.includes("/auth/login");
      const isRefreshRequest = originalRequest?.url?.includes("/auth/refresh");

      // If it's not a login or refresh request, attempt token refresh
      if (!isLoginRequest && !isRefreshRequest && originalRequest) {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          handleLogout();
          return Promise.reject(error);
        }

        if (!isRefreshing) {
          isRefreshing = true;

          try {
            const refreshRes = await axios.post(
              `${APP_ENV.apiBaseUrl}/auth/refresh`,
              { refreshToken }
            );

            const { token, refreshToken: newRefreshToken } = refreshRes.data.data;

            if (token) {
              localStorage.setItem("authToken", token);
              if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
              }

              isRefreshing = false;
              onRefreshed(token);

              originalRequest.headers.Authorization = `Bearer ${token}`;
              return apiClient(originalRequest);
            } else {
              throw new Error("No token returned in refresh response");
            }
          } catch (refreshErr) {
            isRefreshing = false;
            refreshSubscribers = [];
            handleLogout();
            return Promise.reject(refreshErr);
          }
        }

        // Wait for active token refresh to complete
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      // If refresh failed or login failed with 401
      if (isRefreshRequest) {
        handleLogout();
      }
    }

    return Promise.reject(error);
  }
);

export { apiClient };
export default apiClient;
