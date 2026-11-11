import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import { SiteHeader } from "../_components/site-header";
import "./articles.css";

export const metadata = pageMetadata("/articles");

export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-12 sm:px-8">{children}</main>
    </div>
  );
}
