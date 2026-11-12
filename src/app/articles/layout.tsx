import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import { SiteHeader } from "../_components/site-header";
import "./articles.css";

export const metadata = pageMetadata("/articles");

export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="w-full flex-1 px-5 pt-16 pb-24 sm:pt-20">{children}</main>
    </div>
  );
}
