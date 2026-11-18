import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "动效 · Forge Agent · Forge UI" },
  alternates: { canonical: "/agent/motion" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
