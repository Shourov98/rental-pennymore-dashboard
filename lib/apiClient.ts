import axios from "axios";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://age-logo-edge-valve.trycloudflare.com/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;
  const accessToken = localStorage.getItem("accessToken");
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

      localStorage.setItem("accessToken", response.data.data.accessToken);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
