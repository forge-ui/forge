"use client";

import type { ReactNode } from "react";
import type { MotionPreference } from "../../lib/motion";
import { cn } from "../../lib/utils";

export interface TabsContentProps {
  /** Changing this key remounts content and starts its entry transition. Keep form state above this component. */
  activeKey: string | number; children: ReactNode; motion?: MotionPreference;
  id?: string; labelledBy?: string; ariaLabel?: string; className?: string;
}
export function TabsContent({ activeKey, children, motion = "auto", id, labelledBy, ariaLabel = "标签内容", className }: TabsContentProps) {
  return <div key={activeKey} id={id} role="tabpanel" tabIndex={0} aria-labelledby={labelledBy} aria-label={labelledBy ? undefined : ariaLabel} data-motion={motion} data-state="open" className={cn("forge-motion-surface", className)}>{children}</div>;
}
