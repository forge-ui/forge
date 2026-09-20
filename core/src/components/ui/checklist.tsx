"use client";

/**
 * Complete-to-bottom checklist. Forge rewrite: Checkbox geometry,
 * fg-* tokens, CSS + Web Animations. No Motion dependency.
 */

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { cn } from "../../lib/utils";
import { type CheckboxColor } from "./checkbox";

export type ChecklistColor = Exclude<CheckboxColor, "orange">;
export type ChecklistSize = "sm" | "md";

export type ChecklistTask = {
  id: string;
  label: string;
  done?: boolean;
};

type Stage = "idle" | "tick" | "strike" | "nudge" | "settled" | "unstrike" | "untick";

const FILL: Record<ChecklistColor, string> = {
  purple: "bg-fg-violet",
  blue: "bg-fg-blue",
  green: "bg-fg-green-500",
  red: "bg-fg-red",
  black: "bg-fg-black",
};

const SIZE: Record<ChecklistSize, { row: string; text: string; line: string }> = {
  sm: { row: "gap-2.5 rounded-xl px-3 py-2", text: "text-sm leading-5", line: "1.5px" },
  md: { row: "gap-3 rounded-[14px] px-3.5 py-2.5", text: "text-[15px] leading-6", line: "2px" },
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function ChecklistMark({
  filled,
  popping,
  color,
}: {
  filled: boolean;
  popping?: boolean;
  color: ChecklistColor;
}) {
  return (
    <span className={cn("relative h-5 w-5 shrink-0", popping && "forge-checklist-pop")}>
      <span className="absolute inset-0 rounded-md border-2 border-fg-grey-300 bg-white" />
      <span
        className={cn(
          "absolute inset-0 origin-center rounded-md",
          FILL[color],
          filled ? "forge-checklist-fill-on" : "forge-checklist-fill-off",
        )}
      />
      <svg aria-hidden className="absolute inset-0 h-5 w-5" viewBox="0 0 20 20" fill="none">
        <path
          className={filled ? "forge-checklist-tick-on" : "forge-checklist-tick-off"}
          d="M5.28 10.36L8.33 13.22L14.72 6.86"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function ChecklistItem({
  label,
  checked,
  defaultChecked = false,
  size = "md",
  color = "purple",
  onCheckedChange,
  onSettled,
  onReverted,
  className = "",
}: {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  size?: ChecklistSize;
  color?: ChecklistColor;
  onCheckedChange?: (checked: boolean) => void;
  onSettled?: () => void;
  onReverted?: () => void;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [own, setOwn] = useState(defaultChecked);
  const done = checked ?? own;
  const [stage, setStage] = useState<Stage>(done ? "settled" : "idle");
  const [was, setWas] = useState(done);
  const settledRef = useRef(onSettled);
  const revertedRef = useRef(onReverted);

  useEffect(() => {
    settledRef.current = onSettled;
    revertedRef.current = onReverted;
  }, [onSettled, onReverted]);

  if (was !== done) {
    setWas(done);
    setStage(done ? "tick" : "unstrike");
  }

  useEffect(() => {
    if (reduced) {
      if (done && stage !== "settled") {
        const id = window.setTimeout(() => {
          setStage("settled");
          settledRef.current?.();
        }, 0);
        return () => window.clearTimeout(id);
      }
      if (!done && stage !== "idle") {
        const id = window.setTimeout(() => {
          setStage("idle");
          revertedRef.current?.();
        }, 0);
        return () => window.clearTimeout(id);
      }
      return;
    }

    if (stage === "tick") {
      const id = window.setTimeout(() => setStage("strike"), 240);
      return () => window.clearTimeout(id);
    }
    if (stage === "strike") {
      const id = window.setTimeout(() => setStage("nudge"), 320);
      return () => window.clearTimeout(id);
    }
    if (stage === "nudge") {
      const id = window.setTimeout(() => {
        setStage("settled");
        settledRef.current?.();
      }, 280);
      return () => window.clearTimeout(id);
    }
    if (stage === "unstrike") {
      const id = window.setTimeout(() => setStage("untick"), 240);
      return () => window.clearTimeout(id);
    }
    if (stage === "untick") {
      const id = window.setTimeout(() => {
        setStage("idle");
        revertedRef.current?.();
      }, 200);
      return () => window.clearTimeout(id);
    }
  }, [stage, done, reduced]);

  const struck = stage === "strike" || stage === "nudge" || stage === "settled";
  const filled = stage !== "idle" && stage !== "untick";
  const popping = stage === "tick";

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={done}
      onClick={() => {
        const next = !done;
        if (checked === undefined) setOwn(next);
        onCheckedChange?.(next);
      }}
      className={cn(
        "flex w-fit max-w-full cursor-pointer items-start text-left outline-none",
        "rounded-[14px] bg-white outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
        "hover:bg-fg-grey-50 focus-visible:outline-fg-violet",
        SIZE[size].row,
        stage === "nudge" && "forge-checklist-nudge",
        className,
      )}
    >
      <ChecklistMark filled={filled} popping={popping} color={color} />
      <span
        className={cn(
          "forge-checklist-label min-w-0 font-medium tracking-fg",
          SIZE[size].text,
          struck ? "text-fg-grey-500" : "text-fg-black",
        )}
        data-struck={struck ? "true" : "false"}
        style={{ "--forge-checklist-line": SIZE[size].line } as CSSProperties}
      >
        {label}
      </span>
    </button>
  );
}

function useFlip(orderKey: string) {
  const ref = useRef<HTMLUListElement>(null);
  const prev = useRef<Map<string, number>>(new Map());

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = new Map<string, number>();
    for (const node of root.querySelectorAll<HTMLElement>("[data-checklist-row]")) {
      const id = node.dataset.checklistRow;
      if (!id) continue;
      const top = node.getBoundingClientRect().top;
      next.set(id, top);
      const first = prev.current.get(id);
      if (first !== undefined && !reduced) {
        const dy = first - top;
        if (Math.abs(dy) > 1) {
          node.animate(
            [{ transform: `translateY(${dy}px)` }, { transform: "none" }],
            { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
          );
        }
      }
    }
    prev.current = next;
  }, [orderKey]);

  return ref;
}

export function Checklist({
  tasks,
  defaultTasks = [],
  size = "md",
  color = "purple",
  onTasksChange,
  className = "",
}: {
  tasks?: ChecklistTask[];
  defaultTasks?: ChecklistTask[];
  size?: ChecklistSize;
  color?: ChecklistColor;
  onTasksChange?: (tasks: ChecklistTask[]) => void;
  className?: string;
}) {
  const [own, setOwn] = useState(defaultTasks);
  const current = tasks ?? own;
  const [parked, setParked] = useState<string[]>(() =>
    (tasks ?? defaultTasks).filter((task) => task.done).map((task) => task.id),
  );
  const [note, setNote] = useState("");

  const finished = parked
    .map((id) => current.find((task) => task.id === id))
    .filter((task): task is ChecklistTask => task?.done === true);
  const open = current.filter((task) => !finished.some((item) => item.id === task.id));
  const visible = [...open, ...finished];
  const listRef = useFlip(visible.map((task) => task.id).join("|"));

  function toggle(task: ChecklistTask, done: boolean) {
    const next = current.map((item) => (item.id === task.id ? { ...item, done } : item));
    if (tasks === undefined) setOwn(next);
    onTasksChange?.(next);
    setNote(`${task.label} ${done ? "completed" : "reopened"}`);
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <ul ref={listRef} className="flex flex-col gap-2">
        {visible.map((task) => (
          <li key={task.id} data-checklist-row={task.id} className="max-w-full">
            <ChecklistItem
              label={task.label}
              checked={Boolean(task.done)}
              size={size}
              color={color}
              onCheckedChange={(done) => toggle(task, done)}
              onSettled={() =>
                setParked((ids) => (ids.includes(task.id) ? ids : [...ids, task.id]))
              }
              onReverted={() => setParked((ids) => ids.filter((id) => id !== task.id))}
            />
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {note}
      </p>
    </div>
  );
}
