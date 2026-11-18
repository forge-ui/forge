import type { MetadataRoute } from "next";
import pages from "./_seo/pages.json";
import { AGENT_ENTRIES } from "./agent/_kit/_agent-meta";
import { blocks } from "./blocks/_catalog";
import { SITE_URL } from "@/lib/seo";

// Every indexable page from src/app/_seo/pages.json plus the block detail and Forge Agent pages; redirects,
// templates and prototypes are noindex and stay out.
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...Object.entries(pages as Record<string, { noindex?: boolean }>).filter(([, entry]) => !entry.noindex).map(([route]) => route),
    ...blocks.map(block => `/blocks/${block.name}`),
    "/agent", "/agent/scenarios", "/agent/motion", "/agent/api",
    ...AGENT_ENTRIES.map(entry => `/agent/${entry.slug}`),
  ];
  return [...new Set(routes)].sort().map(route => ({
    url: SITE_URL + (route === "/" ? "" : route),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : route.split("/").length === 2 ? 0.9 : 0.7,
  }));
}
