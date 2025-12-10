import axios from "axios";

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://mutual-facts-pastor-hint.trycloudflare.com/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

