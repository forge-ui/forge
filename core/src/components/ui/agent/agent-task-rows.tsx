"use client";

/**
 * Interaction pattern adapted from Beautiful UI (MIT, Shane Levine).
 * Forge rewrite: fg-* tokens + solar-icon-set.
 */

import { CheckCircleLinear, CloseCircleLinear } from "solar-icon-set";
import { cn } from "../../../lib/utils";
import { StatusBadge, type StatusBadgeColor } from "../data-table";

export type AgentTaskStatus = "running" | "failed" | "completed";

export type AgentTaskChild = {
  label: string;
  value?: string;
  status?: AgentTaskStatus;
};

export type AgentTask = {
  id: string;
  title: string;
  status: AgentTaskStatus;
  meta?: string;
  children?: AgentTaskChild[];
};

const STATUS_COLOR: Record<AgentTaskStatus, StatusBadgeColor> = {
  running: "blue",
  failed: "red",
  completed: "green",
};

const STATUS_LABEL: Record<AgentTaskStatus, string> = {
  running: "Running",
  failed: "Failed",
  completed: "Completed",
};

export function AgentTaskRows({
  tasks,
  variant = "list",
  className = "",
}: {
  tasks: AgentTask[];
  variant?: "list" | "capsules";
  className?: string;
}) {
  if (variant === "capsules") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center gap-2 rounded-full bg-fg-grey-50 px-3 py-1.5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200"
          >
            <span className="text-sm font-medium text-fg-black">{task.title}</span>
            {task.meta && <span className="text-xs text-fg-grey-500">{task.meta}</span>}
            <StatusBadge label={STATUS_LABEL[task.status]} color={STATUS_COLOR[task.status]} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {tasks.map((task) => (
        <div
          key={task.id}
          className="rounded-xl bg-white px-3 py-2.5 outline outline-1 outline-offset-[-1px] outline-fg-grey-200"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg-black">{task.title}</p>
              {task.meta && <p className="text-xs text-fg-grey-500">{task.meta}</p>}
            </div>
            <StatusBadge label={STATUS_LABEL[task.status]} color={STATUS_COLOR[task.status]} />
          </div>
          {task.children && task.children.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1 border-t border-fg-grey-100 pt-2">
              {task.children.map((child) => (
                <li key={child.label} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-fg-grey-700">{child.label}</span>
                  <span className="inline-flex items-center gap-1 text-fg-black">
                    {child.status === "completed" && <CheckCircleLinear size={12} color="var(--fg-green-500)" />}
                    {child.status === "failed" && <CloseCircleLinear size={12} color="var(--fg-red)" />}
                    {child.status === "running" && (
                      <span className="forge-pulse-dot h-1.5 w-1.5 rounded-full bg-fg-blue" />
                    )}
                    {child.value}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
