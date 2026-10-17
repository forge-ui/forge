"use client";
import { useRef, type ReactNode } from "react";
import { TrashBinTrashLinear } from "../icons";
import type { MotionPreference } from "../lib/motion";

export function SwipeRow({ children, onAction, label, motion }: { children: ReactNode; onAction: () => void; label: string; motion: MotionPreference }) {
  const drag = useRef<{ id: number; x: number; y: number; horizontal: boolean } | null>(null);
  return <div className="forge-swipe-row" data-motion={motion}>
    <button type="button" className="forge-swipe-action" onClick={onAction} aria-label={label}><TrashBinTrashLinear size={20} /><span>{label}</span></button>
    <div className="forge-swipe-content" onPointerDown={(event) => { if (event.button !== 0 || event.isPrimary === false || drag.current) return; if ((event.target as HTMLElement).closest("button, a, input")) return; drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, horizontal: false }; }}
      onPointerMove={(event) => { const start = drag.current; if (!start || start.id !== event.pointerId) return; const x = event.clientX - start.x; const y = event.clientY - start.y; if (!start.horizontal && Math.abs(y) > Math.abs(x) + 8) { drag.current = null; return; } if (Math.abs(x) > 8) { start.horizontal = true; event.currentTarget.setPointerCapture?.(event.pointerId); event.currentTarget.style.translate = `${Math.max(-180, Math.min(0, x))}px 0`; } }}
      onPointerUp={(event) => { const start = drag.current; if (!start || start.id !== event.pointerId) return; drag.current = null; if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); event.currentTarget.style.translate = ""; if (start.horizontal && event.clientX - start.x < -100) onAction(); }}
      onPointerCancel={(event) => { if (drag.current?.id !== event.pointerId) return; if (event.currentTarget.hasPointerCapture?.(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); drag.current = null; event.currentTarget.style.translate = ""; }}>
      {children}
    </div>
  </div>;
}
