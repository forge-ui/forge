import type { Metadata } from "next";
import pages from "@/app/_seo/pages.json";
import { languageAlternates } from "./i18n-routes";

// www is where the site is served; the apex domain redirects here.
export const SITE_URL = "https://www.forgeui.org";
export const SITE_NAME = "Forge UI";
const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Forge UI · 中文后台 React 组件库" };
const OG_IMAGE_EN = { url: "/og-en.png", width: 1200, height: 630, alt: "Forge UI · React admin UI kit" };

type PageEntry = { title: string; description: string; noindex?: boolean; lang?: "en" };

/** Title, description, canonical URL and share cards for a route listed in src/app/_seo/pages.json. */
export function pageMetadata(path: string, entry: PageEntry | undefined = (pages as Record<string, PageEntry>)[path]): Metadata {
  if (!entry) throw new Error(`No SEO entry for ${path}; run node scripts/generate-seo.mjs`);
  // Absolute titles: a section layout with its own title would otherwise cut off the root template.
  const home = path === "/" || path === "/en";
  const shareTitle = home ? entry.title : `${entry.title} · ${SITE_NAME}`;
  const title = { absolute: shareTitle };
  return {
    title,
    description: entry.description,
    alternates: { canonical: path, languages: languageAlternates(path) },
    // Explicit either way: a route under /templates must be able to opt back into indexing.
    robots: { index: !entry.noindex, follow: true },
    openGraph: { type: "website", siteName: SITE_NAME, locale: entry.lang === "en" ? "en_US" : "zh_CN", url: path, title: shareTitle, description: entry.description, images: [entry.lang === "en" ? OG_IMAGE_EN : OG_IMAGE] },
    twitter: { card: "summary_large_image", title: shareTitle, description: entry.description, images: [(entry.lang === "en" ? OG_IMAGE_EN : OG_IMAGE).url] },
  };
}
