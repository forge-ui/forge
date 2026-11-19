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
  // Forge Agent moved out of the component library into /agent.
  async redirects() {
    return [
      { source: "/components/agent", destination: "/agent/api", permanent: true },
      { source: "/cases/agent", destination: "/agent/scenarios", permanent: true },
      { source: "/components/chat-input-bar", destination: "/agent/chat-input-bar", permanent: true },
      { source: "/cases/chat-input-bar", destination: "/agent/chat-input-bar", permanent: true },
    ];
  },
  async headers() {
    return markdownSections.flatMap((section) => [
      { source: `/${section}`, headers: [{ key: "Link", value: `</${section}.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"` }] },
      { source: `/${section}/:path((?!.*\\.md$).*)`, headers: [{ key: "Link", value: `</${section}/:path.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"` }] },
    ]);
  },
};

export default nextConfig;
