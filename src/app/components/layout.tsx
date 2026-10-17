import { SiteHeader } from "../_components/site-header";
import { CaseLink } from "./_case-link";
import { ComponentsNav } from "./_nav";
import { ComponentsToc } from "./_toc";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-fg-grey-50">
      <SiteHeader />
      <div className="mx-auto flex w-full max-w-[1440px] flex-1">
        <ComponentsNav />
        <main className="min-w-0 flex-1 px-8 py-10 lg:px-12">
          <div className="mx-auto flex w-full max-w-5xl gap-16">
            <article className="flex min-w-0 max-w-full flex-1 flex-col gap-10 [&>*]:min-w-0 [&>*]:max-w-full">
              {children}
              <CaseLink />
            </article>
            <ComponentsToc />
          </div>
        </main>
      </div>
    </div>
  );
}
