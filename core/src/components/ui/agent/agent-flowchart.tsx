"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens. Static/selectable nodes, no drag engine.
 */

import { useState } from "react";
import { cn } from "../../../lib/utils";
import { SurfaceCard } from "../surface-card";

export type AgentFlowKind = "trigger" | "action" | "condition";

export type AgentFlowNode = {
  id: string;
  kind: AgentFlowKind;
  title: string;
  body?: string;
  x?: number;
  y?: number;
};

export type AgentFlowEdge = {
  from: string;
  to: string;
  label?: string;
};

const KIND_LABEL: Record<AgentFlowKind, string> = {
  trigger: "Trigger",
  action: "Action",
  condition: "Condition",
};

const KIND_CLASS: Record<AgentFlowKind, string> = {
  trigger: "bg-accent-soft text-accent",
  action: "bg-fg-green-50 text-fg-green-500",
  condition: "bg-fg-yellow-50 text-fg-yellow-700",
};

export function AgentFlowchart({
  title = "Workflow",
  nodes,
  edges = [],
  selectedId: controlledId,
  onSelect,
  className = "",
}: {
  title?: string;
  nodes: AgentFlowNode[];
  edges?: AgentFlowEdge[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const [uncontrolled, setUncontrolled] = useState(nodes[0]?.id);
  const selectedId = controlledId ?? uncontrolled;
  const selected = nodes.find((node) => node.id === selectedId);
  const outgoing = edges.filter((edge) => edge.from === selectedId);

  function select(id: string) {
    if (controlledId === undefined) setUncontrolled(id);
    onSelect?.(id);
  }

  return (
    <SurfaceCard className={className} title={title} padding="none">
      <div className="forge-dot-canvas relative min-h-72 overflow-auto p-6">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4">
          {nodes.map((node, index) => {
            const edge = edges.find((item) => item.from === node.id);
            return (
              <div key={node.id} className="flex w-full flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={() => select(node.id)}
                  className={cn(
                    "w-full rounded-2xl bg-white p-4 text-left outline outline-1 outline-offset-[-1px]",
                    selectedId === node.id ? "outline-accent" : "outline-fg-grey-200",
                  )}
                >
                  <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", KIND_CLASS[node.kind])}>
                    {KIND_LABEL[node.kind]}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-fg-black">{node.title}</p>
                  {node.body && <p className="mt-1 text-xs leading-5 text-fg-grey-700">{node.body}</p>}
                </button>
                {index < nodes.length - 1 && (
                  <div className="flex flex-col items-center text-fg-grey-500">
                    <span className="h-6 w-px bg-fg-grey-200" />
                    {edge?.label && <span className="text-[11px] font-medium">{edge.label}</span>}
                    <span className="h-6 w-px bg-fg-grey-200" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {selected && (
        <div className="border-t border-fg-grey-200 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-grey-500">Selected</p>
          <p className="mt-1 text-sm font-medium text-fg-black">{selected.title}</p>
          {outgoing.length > 0 && (
            <p className="mt-1 text-xs text-fg-grey-700">
              Next: {outgoing.map((edge) => edge.label ?? nodes.find((node) => node.id === edge.to)?.title).join(" · ")}
            </p>
          )}
        </div>
      )}
    </SurfaceCard>
  );
}
