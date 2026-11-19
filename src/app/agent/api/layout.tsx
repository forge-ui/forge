import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "全部组件与 API · Forge Agent · Forge UI" },
  alternates: { canonical: "/agent/api" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
