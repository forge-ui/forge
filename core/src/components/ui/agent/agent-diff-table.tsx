"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens. Not a replacement for DataTable.
 */

import { useState } from "react";
import { cn } from "../../../lib/utils";
import { Button } from "../button";
import { SurfaceCard } from "../surface-card";

export type AgentDiffColumn = {
  key: string;
  label: string;
};

export type AgentDiffChange = "keep" | "remove" | "add";

export type AgentDiffRow = {
  id: string;
  cells: Record<string, string>;
  change: AgentDiffChange;
};

export function AgentDiffTable({
  title,
  columns,
  rows,
  applyLabel = "Apply changes",
  appliedLabel = "edits applied",
  onApply,
  className = "",
}: {
  title: string;
  columns: AgentDiffColumn[];
  rows: AgentDiffRow[];
  applyLabel?: string;
  appliedLabel?: string;
  onApply?: (includedIds: string[]) => void;
  className?: string;
}) {
  const [included, setIncluded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rows.filter((row) => row.change !== "keep").map((row) => [row.id, true])),
  );
  const [applied, setApplied] = useState(false);
  const changed = rows.filter((row) => row.change !== "keep" && included[row.id]);
  const removals = changed.filter((row) => row.change === "remove").length;
  const additions = changed.filter((row) => row.change === "add").length;

  function toggle(id: string) {
    if (applied) return;
    setIncluded((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <SurfaceCard
      className={className}
      title={title}
      subtitle={applied ? undefined : "Click changed rows to toggle"}
      padding="none"
      footer={
        applied ? (
          <p className="text-sm font-medium text-fg-green-500">
            {changed.length} {appliedLabel}
          </p>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-fg-grey-500">
              {removals} {removals === 1 ? "removal" : "removals"} · {additions}{" "}
              {additions === 1 ? "addition" : "additions"}
            </p>
            <Button
              size="sm"
              color="purple"
              disabled={changed.length === 0}
              onClick={() => {
                setApplied(true);
                onApply?.(changed.map((row) => row.id));
              }}
            >
              {applyLabel.replace("changes", `${changed.length} ${changed.length === 1 ? "change" : "changes"}`)}
            </Button>
          </div>
        )
      }
    >
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-fg-grey-200 text-xs text-fg-grey-500">
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-2.5 font-semibold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const active = row.change !== "keep" && included[row.id];
            const interactive = row.change !== "keep" && !applied;
            return (
              <tr
                key={row.id}
                onClick={interactive ? () => toggle(row.id) : undefined}
                className={cn(
                  "border-b border-fg-grey-100 last:border-0",
                  interactive && "cursor-pointer",
                  active && row.change === "remove" && "bg-fg-red-50",
                  active && row.change === "add" && "bg-fg-green-50",
                  row.change !== "keep" && !active && "opacity-50",
                )}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-2.5 text-fg-black">
                    {row.cells[column.key]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </SurfaceCard>
  );
}
