import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? "/forge" : "",
  assetPrefix: isProd ? "/forge/" : "",
  devIndicators: false,
  allowedDevOrigins: ["192.168.110.25", "localhost", "127.0.0.1"],
};

export default nextConfig;
