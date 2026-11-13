import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "../_components/site-header";
import { PreviewSidebar, ScrollbarAutoHide } from "./_chrome";
import "./docs-preview.css";

// Design preview for a new docs style; not a public page yet.
export const metadata: Metadata = { title: { absolute: "文档样式预览 · Forge UI" }, robots: { index: false, follow: false } };

export default function DocsPreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className="docs-v2 flex min-h-screen flex-col">
      <ScrollbarAutoHide />
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1">
        <PreviewSidebar />
        <main className="min-w-0 flex-1 px-6 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
