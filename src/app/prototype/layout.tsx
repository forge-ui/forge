import type { Metadata } from "next";
import type { ReactNode } from "react";

// Internal acceptance pages: keep them out of search results but let crawlers follow links.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
