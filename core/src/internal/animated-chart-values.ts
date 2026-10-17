"use client";
import { useEffect, useRef, useState } from "react";
import type { MotionPreference } from "../lib/motion";
import { useReducedMotion } from "./motion";

/** Interruptible interpolation; no queued frames survive a new data set or unmount. */
export function useAnimatedChartValues(values: number[], motion: MotionPreference = "auto", duration = 500) {
  const reduced = useReducedMotion(motion);
  const signature = values.join(",");
  const [display, setDisplay] = useState(values);
  const current = useRef(values);
  useEffect(() => {
    const target = signature.split(",").filter(Boolean).map(Number);
    if (reduced) { current.current = target; return; }
    const from = target.map((_, i) => current.current[i] ?? 0);
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => { const progress = Math.min(1, (now - start) / duration), eased = 1 - (1 - progress) ** 3; current.current = target.map((value, i) => from[i] + (value - from[i]) * eased); setDisplay(current.current); if (progress < 1) frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [signature, reduced, duration]);
  return reduced || display.length !== values.length ? values : display;
}
