import { type ReactNode } from "react";
import { CopyLinear, AltArrowDownLinear } from "solar-icon-set";
import { Breadcrumbs, type BreadcrumbItem } from "@forge-ui/react";
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
  return (
    <header className="flex flex-col gap-5">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs items={breadcrumbs} color="black" />
      )}
      <div className="flex items-start justify-between gap-6">
        <h1 className="font-display text-4xl font-bold tracking-fg text-fg-black">
          {title}
        </h1>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-full bg-fg-grey-100 px-4 py-2 text-sm font-semibold text-fg-black hover:bg-fg-grey-200 transition-colors"
        >
          <CopyLinear size={14} color="#71717A" />
          复制页面
          <span aria-hidden className="h-4 w-px bg-fg-grey-300" />
          <AltArrowDownLinear size={12} color="#71717A" />
        </button>
      </div>
      {description && (
        <p className="max-w-2xl text-base font-normal leading-[1.8] text-fg-grey-900">
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
    <section id={id} className="flex scroll-mt-24 flex-col gap-5">
      <h2 className="font-display text-3xl font-semibold tracking-fg text-fg-black">
        {title}
      </h2>
      <div className="flex flex-col gap-4 text-base font-normal leading-[1.8] text-fg-grey-900">
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
    <div className="mx-auto flex w-full max-w-5xl gap-16">
      <article className="flex min-w-0 flex-1 flex-col gap-10">{children}</article>
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
