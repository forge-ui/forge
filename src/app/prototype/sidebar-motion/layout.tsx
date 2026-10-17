import type { Metadata } from "next";
import { SidebarMotionPreview } from "./preview";

export const metadata: Metadata = {
  title: "应用布局 · 侧栏动效 · Forge",
  robots: { index: false, follow: false },
};

export default function SidebarMotionLayout({ children }: { children: React.ReactNode }) {
  return <SidebarMotionPreview>{children}</SidebarMotionPreview>;
}
