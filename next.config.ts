import type { NextConfig } from "next";

const API_PROXY_TARGET =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/api\/v\d+\/?$/, "") ||
  "http://localhost:7070";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    // Proxy API calls through the same origin so the browser doesn't need
    // CORS headers when the upstream API is hosted on a different host
    // (e.g. a Microsoft Dev Tunnel URL pointing to a local dev server).
    // Production builds should use a real public API URL and disable this.
    if (process.env.NEXT_PUBLIC_API_BASE_URL?.includes("devtunnels.ms")) {
      return [
        {
          source: "/api/proxy/:path*",
          destination: `${API_PROXY_TARGET}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "hel1.your-objectstorage.com",
      },
    ],
  },
};

export default nextConfig;
