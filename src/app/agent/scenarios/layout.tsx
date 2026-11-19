import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: { absolute: "场景 · Forge Agent · Forge UI" },
  alternates: { canonical: "/agent/scenarios" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
