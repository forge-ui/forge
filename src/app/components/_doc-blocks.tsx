"use client";

import { type ReactNode } from "react";
import { componentLabel } from "./_labels";
import { PreviewBlock } from "./_preview-block";
import { ApiTable, type ApiTableRow } from "./_api-table";

export function ExampleGrid({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid items-start gap-4 [&>*]:min-w-0"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))" }}
    >
      {children}
    </div>
  );
}

export function DocExample({
  id,
  title,
  summary,
  code,
  minHeight = 180,
  apiId,
  children,
}: {
  id: string;
  title: string;
  summary: string;
  code: string;
  minHeight?: number;
  apiId?: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="flex min-w-0 scroll-mt-24 flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-fg text-fg-black">
          {componentLabel(title)}
        </h3>
        <a href={`#api-${apiId ?? id}`} className="shrink-0 text-sm font-semibold text-fg-blue">
          参数
        </a>
      </div>
      <p className="text-sm leading-[1.7] text-fg-grey-900">{summary}</p>
      <PreviewBlock code={code} minHeight={minHeight}>
        {children}
      </PreviewBlock>
    </div>
  );
}

export function ApiBlock({ id, title, rows }: { id: string; title: string; rows: ApiTableRow[] }) {
  return (
    <div id={`api-${id}`} className="flex scroll-mt-24 flex-col gap-2">
      <h3 className="text-sm font-semibold tracking-fg text-fg-black">
        {componentLabel(title)}
      </h3>
      <ApiTable rows={rows} />
    </div>
  );
}
