"use client";
import { useCallback, useEffect, useRef, type ReactNode } from "react";
import type { FusionSettings } from "./types";
export function useActionTimers() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const clear = useCallback(() => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  useEffect(() => clear, [clear]);
  const later = useCallback((action: () => void, delay: number) => { const timer = setTimeout(() => { timers.current.delete(timer); action(); }, delay); timers.current.add(timer); return timer; }, []);
  return { later, clear };
}
export function ActionStage({ children, settings, className = "" }: { children: ReactNode; settings: FusionSettings; className?: string }) {
  return <div className={`fusion-actions ${className}`} data-color={settings.color} data-motion={settings.motion}>{children}</div>;
}
export function ActionHint({ children }: { children: ReactNode }) { return <p className="fusion-action-hint" role="status">{children}</p>; }
