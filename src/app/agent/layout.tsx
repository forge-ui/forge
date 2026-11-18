import type { ReactNode } from "react";
import { SiteHeader } from "../_components/site-header";
import { AgentNav } from "./_nav";

export default function AgentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        <AgentNav />
        <main className="min-w-0 flex-1 px-8 py-10 lg:px-12">
          <article className="mx-auto flex w-full max-w-5xl flex-col gap-10 [&>*]:min-w-0 [&>*]:max-w-full">{children}</article>
        </main>
      </div>
    </div>
  );
}
