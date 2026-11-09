import type { MetadataRoute } from "next";
import searchIndex from "./_components/search-index.json";
import { blocks } from "./blocks/_catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = new Set(["/", "/components", "/templates", "/blocks", ...searchIndex.map(item => item.id.split(/[?#]/)[0]).filter(route => route.startsWith("/") && !route.includes("[")), ...blocks.map(block => `/blocks/${block.name}`)]);
  return [...routes].sort().map(route => ({ url: `https://forgeui.org${route}`, changeFrequency: "weekly", priority: route === "/" ? 1 : route === "/blocks" ? 0.9 : 0.7 }));
}
