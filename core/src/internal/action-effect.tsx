"use client";

import { useEffect, useRef, type PointerEvent } from "react";
import { CheckCircleLinear, CloseCircleLinear, RefreshLinear } from "../icons";
import type { MotionPreference } from "../lib/motion";
import { useReducedMotion } from "./motion";

export type ActionResult = "idle" | "success" | "error";

/** Pointer effects never own the consumer's operation or its success state. */
export function useActionEffect(effect: string | undefined, motion: MotionPreference, disabled = false) {
  const reduced = useReducedMotion(motion);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return {
    move(event: PointerEvent<HTMLElement>) {
      if (reduced || disabled || event.pointerType === "touch") return;
      const node = event.currentTarget;
      const box = node.getBoundingClientRect();
      const x = (event.clientX - box.left) / Math.max(box.width, 1);
      const y = (event.clientY - box.top) / Math.max(box.height, 1);
      node.style.setProperty("--forge-pointer-x", `${x * 100}%`);
      node.style.setProperty("--forge-pointer-y", `${y * 100}%`);
      if (effect === "magnetic") {
        node.style.setProperty("--forge-magnet-x", `${(x - .5) * 12}px`);
        node.style.setProperty("--forge-magnet-y", `${(y - .5) * 8}px`);
      }
    },
    leave(event: PointerEvent<HTMLElement>) {
      event.currentTarget.style.setProperty("--forge-magnet-x", "0px");
      event.currentTarget.style.setProperty("--forge-magnet-y", "0px");
    },
    press(node: HTMLElement) {
      if (reduced || disabled || !effect) return;
      if (timer.current) clearTimeout(timer.current);
      node.dataset.actionPressed = "true";
      timer.current = setTimeout(() => { delete node.dataset.actionPressed; }, 650);
    },
  };
}

export function ActionStatus({ loading, result, motion = "auto" }: { loading?: boolean; result?: ActionResult; motion?: MotionPreference }) {
  const reduced = useReducedMotion(motion);
  if (loading) return <RefreshLinear size={18} aria-hidden className={reduced ? undefined : "forge-action-spinner"} />;
  if (result === "success") return <CheckCircleLinear size={18} aria-hidden />;
  if (result === "error") return <CloseCircleLinear size={18} aria-hidden />;
  return null;
}
