import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      { source: "/cases", destination: "/components", permanent: false },
      { source: "/cases/chat-input-bar", destination: "/components/chat-input-bar", permanent: false },
      { source: "/cases/:path+", destination: "/components/:path+", permanent: false },
    ];
  },
  allowedDevOrigins: ["localhost", "127.0.0.1"],
};

export default nextConfig;
