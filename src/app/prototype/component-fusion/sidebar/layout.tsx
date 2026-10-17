import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { EmbeddedSidebarPreview } from "../_sidebar-preview";

export const metadata: Metadata = {
  title: "侧栏交互预览 · Forge",
  robots: { index: false, follow: false },
};

export default function EmbeddedSidebarLayout({ children }: { children: ReactNode }) {
  return <>
    <Suspense fallback={<div className="min-h-screen bg-fg-white" />}>
      <EmbeddedSidebarPreview />
    </Suspense>
    {children}
  </>;
}
