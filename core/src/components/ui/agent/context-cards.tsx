/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { DocumentTextLinear } from "solar-icon-set";
import { cn } from "../../../lib/utils";
import { SurfaceCard } from "../surface-card";

export type ContextChunk = {
  id: string;
  title: string;
  body: string;
  sourceLabel?: string;
  sourceKind?: string;
  charCount?: number;
};

export function ContextCards({
  chunks,
  total,
  className = "",
}: {
  chunks: ContextChunk[];
  total?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-xs font-semibold uppercase tracking-fg text-fg-grey-500">
        All chunks{typeof total === "number" ? ` · ${total}` : ""}
      </p>
      {chunks.map((chunk) => (
        <SurfaceCard key={chunk.id} padding="sm">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="text-sm font-semibold text-fg-black">{chunk.title}</h3>
            {chunk.charCount !== undefined && (
              <span className="shrink-0 text-xs text-fg-grey-500">{chunk.charCount.toLocaleString()} characters</span>
            )}
          </div>
          <p className="text-sm leading-6 text-fg-grey-700">{chunk.body}</p>
          {(chunk.sourceLabel || chunk.sourceKind) && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-fg-grey-500">
              <DocumentTextLinear size={14} color="var(--fg-grey-500)" />
              {chunk.sourceKind && <span className="font-semibold text-fg-grey-700">{chunk.sourceKind}</span>}
              {chunk.sourceLabel}
            </p>
          )}
        </SurfaceCard>
      ))}
    </div>
  );
}
