"use client";

import { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@forge-ui-official/core";
import { CheckCircleLinear, CloseCircleLinear, CopyLinear } from "@forge-ui-official/core/icons";

export function CopyButton({ value, label = "复制", compact = false, variant = "tertiary" }: { value: string; label?: string; compact?: boolean; variant?: "primary" | "tertiary" }) {
  const [state, setState] = useState<"idle" | "copying" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const feedback = state === "copied" ? "已复制" : state === "failed" ? "复制失败，请重试" : state === "copying" ? "正在复制" : label;
  const icon = state === "copied" ? <CheckCircleLinear size={16} /> : state === "failed" ? <CloseCircleLinear size={16} /> : <CopyLinear size={16} />;

  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    setState("copying");
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = setTimeout(() => setState("idle"), 2500);
  }

  return <span className="relative inline-flex shrink-0">
    {compact ? <IconButton aria-label={feedback} title={feedback} variant="tertiary" size="sm" color="grey" disabled={state === "copying"} onClick={copy}>{icon}</IconButton> : <Button size="sm" variant={variant} iconLeft={icon} disabled={state === "copying"} onClick={copy}>{feedback}</Button>}
    <span role="status" className="sr-only">{state === "copied" || state === "failed" ? feedback : ""}</span>
    {compact && state !== "idle" && state !== "copying" && <span aria-hidden className="pointer-events-none absolute bottom-full right-0 z-20 mb-2 whitespace-nowrap rounded-lg bg-fg-grey-900 px-2.5 py-1.5 text-xs text-white">{feedback}</span>}
  </span>;
}
