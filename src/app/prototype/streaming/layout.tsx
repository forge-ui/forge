import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "流式消息 Demo · Forge",
  robots: { index: false, follow: false },
};

export default function PrototypeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
