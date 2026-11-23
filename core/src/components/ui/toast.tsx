"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useReducedMotion } from "../../internal/motion";
import type { MotionPreference } from "../../lib/motion";
import { IconButton } from "./icon-button";
import { Button } from "./button";
import { CloseCircleLinear, CheckCircleLinear, RefreshLinear } from "../../icons";

export interface ToastOptions { title: string; description?: string; /** Milliseconds; 0 keeps the notification until dismissed. */ duration?: number; status?: "loading" | "success" | "error"; action?: { label: string; onClick: () => void }; }
export interface ToastApi { toast: (options: ToastOptions) => string; dismiss: (id: string) => void; update: (id: string, options: Partial<ToastOptions>) => void }
const Context = createContext<ToastApi | null>(null);
export function useToast(): ToastApi {
  const value = useContext(Context);
  if (!value) throw new Error("useToast requires ToastProvider");
  return value;
}

type ToastData = { status?: ToastOptions["status"]; action?: ToastOptions["action"]; duration: number };

function toManagerOptions(options: Partial<ToastOptions>) {
  const duration = options.duration ?? 4000;
  return {
    ...(options.title !== undefined && { title: options.title }),
    ...(options.description !== undefined && { description: options.description }),
    ...(options.duration !== undefined || options.title !== undefined ? { timeout: duration } : {}),
    ...(options.status !== undefined && { type: options.status }),
    data: { status: options.status, action: options.action, duration } satisfies ToastData,
  };
}

/** Exposes Forge's `toast / dismiss / update` API on top of Base UI's toast manager. */
function ToastApiBridge({ children }: { children: ReactNode }) {
  const manager = ToastPrimitive.useToastManager();
  const api = useMemo<ToastApi>(() => ({
    toast: (options) => manager.add(toManagerOptions(options)),
    dismiss: (id) => manager.close(id),
    update: (id, options) => manager.update(id, (previous) => {
      const data = previous.data as ToastData | undefined;
      return toManagerOptions({ status: data?.status, action: data?.action, duration: data?.duration, ...options });
    }),
  }), [manager]);
  return <Context.Provider value={api}>{children}</Context.Provider>;
}

function ToastList({ motion, locale }: { motion: MotionPreference; locale: "zh" | "en" }) {
  const { toasts, close } = ToastPrimitive.useToastManager();
  const reduced = useReducedMotion(motion);
  return toasts.map((toast) => {
    const data = toast.data as ToastData | undefined;
    const status = data?.status;
    const duration = data?.duration ?? 4000;
    const title = String(toast.title ?? "");
    return (
      <ToastPrimitive.Root key={toast.id} toast={toast} swipeDirection="right" data-toast-id={toast.id} className="forge-toast">
        <ToastPrimitive.Content className="rounded-xl border border-fg-grey-200 bg-background p-4 shadow-lg">
          <div className="flex items-start gap-4">
            {status && <span aria-hidden className={status === "error" ? "text-fg-red" : "text-fg-grey-700"}>{status === "loading" ? <RefreshLinear size={20} className={reduced ? "" : "forge-action-spinner"} /> : status === "success" ? <CheckCircleLinear size={20} /> : <CloseCircleLinear size={20} />}</span>}
            <div className="min-w-0 flex-1">
              <ToastPrimitive.Title className="text-sm font-medium text-fg-black" />
              <ToastPrimitive.Description className="mt-1 text-sm leading-6 text-fg-grey-700 empty:hidden" />
            </div>
            <ToastPrimitive.Close render={<IconButton aria-label={`${locale === "en" ? "Dismiss notification" : "关闭通知"}：${title}`} variant="ghost" size="sm" motion={motion}><CloseCircleLinear size={18} /></IconButton>} />
          </div>
          {data?.action && (
            <div className="mt-3">
              <ToastPrimitive.Action render={<Button variant="secondary" size="sm" motion={motion} />} onClick={() => { data.action!.onClick(); close(toast.id); }}>{data.action.label}</ToastPrimitive.Action>
            </div>
          )}
          {duration !== 0 && <div className="forge-toast-timer" aria-hidden><span key={toast.updateKey} style={{ animationDuration: `${duration}ms`, animationName: reduced ? "none" : undefined }} /></div>}
        </ToastPrimitive.Content>
      </ToastPrimitive.Root>
    );
  });
}

/**
 * Notifications in the bottom-right corner. Hover or focus pauses every timer,
 * swipe right dismisses, F6 moves focus to the notifications.
 */
export function ToastProvider({ children, motion = "auto", locale = "zh", stacked = false }: { children: ReactNode; motion?: MotionPreference; locale?: "zh" | "en"; stacked?: boolean }) {
  return (
    <ToastPrimitive.Provider>
      <ToastApiBridge>{children}</ToastApiBridge>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          aria-label={locale === "en" ? "Notifications" : "通知"}
          data-stacked={stacked || undefined}
          data-motion={motion}
          className="forge-toast-list fixed bottom-4 right-4 z-[100] w-[360px] max-w-[calc(100vw-2rem)]"
        >
          <ToastList motion={motion} locale={locale} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
