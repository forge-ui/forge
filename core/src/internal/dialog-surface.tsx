"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog } from "@base-ui/react/dialog";
import { Drawer } from "@base-ui/react/drawer";
import { createContext, useContext, useLayoutEffect, useRef, type ReactNode, type Ref } from "react";
import type { MotionPreference } from "../lib/motion";
import { cn } from "../lib/utils";

const ParentOpen = createContext(true);

export interface DialogSurfaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  children: ReactNode;
  motion?: MotionPreference;
  /** Renders a side sheet that can be swiped away. */
  side?: "left" | "right";
  /** `alert` needs an explicit choice: outside presses do not dismiss it. */
  role?: "dialog" | "alert";
  className?: string;
  appearance?: "default" | "template";
  popupRef?: Ref<HTMLDivElement>;
}

/**
 * Shared shell for Modal, Drawer and ConfirmationDialog. A nested surface closes
 * with its parent: the host is asked to close it and it hides immediately.
 */
export function DialogSurface({ open, onOpenChange, label, children, motion = "auto", side, role = "dialog", className, appearance = "default", popupRef }: DialogSurfaceProps) {
  const parentOpen = useContext(ParentOpen);
  const active = open && parentOpen;
  const change = useRef(onOpenChange);
  useLayoutEffect(() => { change.current = onOpenChange; }, [onOpenChange]);
  useLayoutEffect(() => { if (!parentOpen && open) change.current(false); }, [parentOpen, open]);
  const handleChange = (next: boolean) => { if (next !== active) change.current(next); };

  const body = (
    <div inert={!active || undefined} data-forge-dialog-content className="flex min-h-0 min-w-0 flex-1 flex-col overflow-auto" style={{ maxHeight: "inherit", borderRadius: "inherit" }}>
      <ParentOpen.Provider value={active}>{children}</ParentOpen.Provider>
    </div>
  );
  const backdropClass = cn("forge-overlay-backdrop", appearance === "template" && "forge-overlay-backdrop--template");

  if (side) {
    return (
      <Drawer.Root open={active} onOpenChange={handleChange} swipeDirection={side}>
        <Drawer.Portal>
          <Drawer.Backdrop data-motion={motion} className={backdropClass} />
          <Drawer.Viewport className={cn("fixed inset-0 z-50 flex items-stretch", side === "right" ? "justify-end" : "justify-start")}>
            <Drawer.Popup ref={popupRef} aria-label={label} data-motion={motion} data-side={side} className={cn("forge-drawer flex flex-col border-0 bg-background p-0 text-fg-black shadow-xl outline-none", className)}>
              {body}
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  const Primitive = role === "alert" ? AlertDialog : Dialog;
  return (
    <Primitive.Root open={active} onOpenChange={handleChange}>
      <Primitive.Portal>
        <Primitive.Backdrop data-motion={motion} className={backdropClass} />
        <Primitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
          <Primitive.Popup
            ref={popupRef}
            aria-label={label}
            data-motion={motion}
            className={cn(
              "flex flex-col border-0 bg-background p-0 text-fg-black outline-none rounded-card",
              appearance === "template" ? "forge-template-modal shadow-lg" : "forge-modal shadow-xl",
              className,
            )}
          >
            {body}
          </Primitive.Popup>
        </Primitive.Viewport>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
