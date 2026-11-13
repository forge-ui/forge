import { pageMetadata } from "@/lib/seo";
import { SiteHeader } from "../_components/site-header";
import { DocsNav } from "./_nav";
import { ScrollbarAutoHide } from "./_ui";
import "./docs.css";


export const metadata = pageMetadata("/docs");

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="docs-ui flex min-h-screen flex-col">
      <ScrollbarAutoHide />
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1400px] flex-1">
        <DocsNav />
        <main className="min-w-0 flex-1 px-6 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
