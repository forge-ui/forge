import type { NextConfig } from "next";

const markdownSections = ["docs", "components", "cases", "blocks", "guides"];

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  // llms.txt v2: every documentation page has a markdown twin at the same URL plus ".md".
  async rewrites() {
    return markdownSections.flatMap((section) => [
      { source: `/${section}.md`, destination: `/md/${section}` },
      { source: `/${section}/:path*.md`, destination: `/md/${section}/:path*` },
    ]);
  },
  async headers() {
    return markdownSections.flatMap((section) => [
      { source: `/${section}`, headers: [{ key: "Link", value: `</${section}.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"` }] },
      { source: `/${section}/:path((?!.*\\.md$).*)`, headers: [{ key: "Link", value: `</${section}/:path.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"` }] },
    ]);
  },
};

export default nextConfig;
