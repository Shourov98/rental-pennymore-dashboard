import axios from "axios";

import {
  clearSessionAccessToken,
  getSessionAccessToken,
  setSessionAccessToken,
} from "./sessionToken";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (() => {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  })();

const AUTH_ENDPOINTS = [
  "/auth/login",
  "/auth/admin/login",
  "/auth/logout",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/verify-password-otp",
  "/auth/resend-password-otp",
  "/auth/resend-verification",
  "/auth/reset-password",
];

const isAuthEndpoint = (url?: string) =>
  AUTH_ENDPOINTS.some((endpoint) => url?.includes(endpoint));

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  if (isAuthEndpoint(config.url ?? "")) return config;

  const accessToken = getSessionAccessToken();
  if (!accessToken) return config;
  config.headers = config.headers ?? {};
  if (!("Authorization" in config.headers)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

type RefreshTokenResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    expiresIn?: string;
  };
  timestamp: string;
};

const forceSessionLogout = () => {
  if (typeof window === "undefined") return;
  clearSessionAccessToken();
  if (window.location.pathname !== "/signin") {
    window.location.href = "/signin";
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;
    const errorCode = error.response?.data?.errorCode;

    if (errorCode === "EMAIL_BLOCKED") {
      forceSessionLogout();
      return Promise.reject(error);
    }

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${BASE_URL}/auth/refresh-token`,
        null,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );

      setSessionAccessToken(response.data.data.accessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      forceSessionLogout();
      return Promise.reject(refreshError);
    }
  },
);
