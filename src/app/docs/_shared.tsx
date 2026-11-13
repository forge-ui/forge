import { type ReactNode } from "react";
import Link from "next/link";
import { type BreadcrumbItem } from "@forge-ui-official/core";
import { CopyPageMenu } from "../_components/copy-page-menu";
import { DocsToc, type TocItem } from "./_toc";

// ============================================================
// Docs article helpers — 仅 docs 子路由使用，不属于 UI Kit
// ============================================================

export function DocHeader({
  breadcrumbs,
  title,
  description,
}: {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
}) {
  // Only the parent section is shown above the title; the sidebar already shows where the page sits.
  const section = breadcrumbs && breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : undefined;
  return (
    <header className="flex flex-col gap-4">
      {section && (section.href ? <Link href={section.href} className="w-fit text-sm font-medium text-fg-black hover:underline">{section.label}</Link> : <p className="text-sm font-medium text-fg-black">{section.label}</p>)}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="min-w-0 break-words font-display text-[32px] font-semibold leading-tight tracking-[-0.01em] text-fg-black">
          {title}
        </h1>
        <CopyPageMenu title={title} />
      </div>
      {description && (
        <p className="max-w-2xl text-lg leading-8 text-fg-grey-700">
          {description}
        </p>
      )}
    </header>
  );
}

export function DocSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex min-w-0 w-full max-w-full scroll-mt-24 flex-col gap-4">
      <h2 className="min-w-0 break-words text-2xl font-semibold leading-8 text-fg-black">
        {title}
      </h2>
      <div className="docs-prose flex min-w-0 w-full max-w-full flex-col gap-4 overflow-x-auto">
        {children}
      </div>
    </section>
  );
}

export function DocArticle({
  toc,
  children,
}: {
  toc?: TocItem[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1080px] gap-14">
      <article className="flex min-w-0 max-w-[760px] flex-1 flex-col gap-10 pt-10 pb-28 [&>*]:min-w-0 [&>*]:max-w-full">{children}</article>
      {toc && toc.length > 0 && <DocsToc items={toc} />}
    </div>
  );
}

export function DocTBD({ note }: { note?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-fg-grey-300 bg-fg-grey-50 px-4 py-5 text-sm text-fg-grey-700">
      <span className="font-semibold text-fg-black">TBD</span>
      {note ? ` — ${note}` : " — 内容待填"}
    </div>
  );
}
