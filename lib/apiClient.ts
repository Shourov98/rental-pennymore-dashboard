import axios from "axios";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://age-logo-edge-valve.trycloudflare.com/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type RefreshTokenResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken?: string;
    expiresIn?: string;
  };
  timestamp: string;
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${BASE_URL}/auth/refresh-token`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      localStorage.setItem("accessToken", response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
      }

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
