import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";
import { SiteHeader } from "../_components/site-header";
import "./articles.css";

export const metadata = pageMetadata("/articles");

export default function ArticlesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[44rem] flex-1 px-5 pt-16 pb-24 sm:pt-20">
        {children}
        <footer className="mt-24 flex items-center justify-between text-sm text-fg-grey-700">
          <span>© {new Date().getFullYear()} Forge UI · MIT</span>
          <a href="/articles/rss.xml" className="hover:text-fg-black">RSS</a>
        </footer>
      </main>
    </div>
  );
}
