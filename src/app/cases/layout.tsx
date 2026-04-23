import { SiteHeader } from "../_components/site-header";
import { CasesNav } from "./_nav";
import { CasesToc } from "./_toc";

export default function CasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        <CasesNav />
        <main className="min-w-0 flex-1 px-8 py-10 lg:px-12">
          <div className="mx-auto flex w-full max-w-5xl gap-16">
            <article className="flex min-w-0 flex-1 flex-col gap-10">
              {children}
            </article>
            <CasesToc />
          </div>
        </main>
      </div>
    </div>
  );
}
