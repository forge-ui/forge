import { SiteHeader } from "../_components/site-header";
import { DocsNav } from "./_nav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        <DocsNav />
        <main className="min-w-0 flex-1 px-8 py-10 lg:px-12">{children}</main>
      </div>
    </div>
  );
}
