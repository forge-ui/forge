"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AltArrowDownLinear } from "solar-icon-set";
import { DropdownDivider, DropdownPanel } from "../components/ui/dropdown-panel";
import { PlusIcon } from "../components/ui/plain-icons";
import type { AskAiSessionItem } from "./ask-ai-types";

/** Drawer header control copied from the Forge Starter history menu. */
export function AskHistoryDropdown({
  sessions,
  currentSessionId,
  onNewSession,
  onSelectSession,
}: {
  sessions: AskAiSessionItem[];
  currentSessionId?: string;
  onNewSession: () => void;
  onSelectSession: (id: string) => void;
}) {
  const current = sessions.find((row) => row.id === currentSessionId);
  const [open, setOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState<Element | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const host = () =>
    triggerRef.current?.closest("dialog")
    ?? triggerRef.current?.closest("[data-ask-ai-fs-layer]")
    ?? document.body;

  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    const panel = panelRef.current;
    const root = portalRoot instanceof HTMLElement ? portalRoot : null;
    if (!rect || !panel || !root) return;
    const rootRect = root.getBoundingClientRect();
    const menuWidth = panel.offsetWidth || 288;
    const menuHeight = panel.offsetHeight;
    const left = Math.max(8, Math.min(rect.left - rootRect.left, rootRect.width - menuWidth - 8));
    const below = rect.bottom - rootRect.top + 6;
    const top =
      menuHeight && below + menuHeight > rootRect.height - 8
        ? Math.max(8, rect.top - rootRect.top - menuHeight - 6)
        : below;
    panel.style.top = `${top}px`;
    panel.style.left = `${left}px`;
    panel.style.visibility = "visible";
  }, [portalRoot]);

  useLayoutEffect(() => {
    if (open && portalRoot) place();
  }, [open, portalRoot, place, sessions.length]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setOpen(false);
    };
    const reposition = () => place();
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape, true);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape, true);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [open, place]);

  return (
    <div data-ask-session-dropdown className="relative min-w-0 max-w-[14rem]">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="历史对话"
        className="inline-flex h-9 max-w-full items-center gap-1 rounded-lg bg-background px-2.5 text-left text-sm font-medium text-fg-grey-700 outline outline-1 outline-fg-grey-200 hover:bg-fg-grey-50 focus-visible:outline-2 focus-visible:outline-fg-grey-500"
        onClick={() => {
          if (open) {
            setOpen(false);
            return;
          }
          setPortalRoot(host());
          setOpen(true);
        }}
      >
        <span className="min-w-0 truncate">{current?.title || "历史对话"}</span>
        <AltArrowDownLinear size={14} />
      </button>
      {open && portalRoot
        ? createPortal(
            <div
              ref={panelRef}
              data-ask-session-menu
              role="listbox"
              aria-label="历史对话"
              className="absolute z-[90] bg-background"
              style={{ visibility: "hidden", zIndex: 90, backgroundColor: "var(--background)" }}
            >
              <DropdownPanel width="w-72" padding="p-1.5" className="bg-background shadow-lg">
                <button
                  type="button"
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium leading-5 text-fg-grey-700 hover:bg-fg-grey-50 focus-visible:outline-2 focus-visible:outline-fg-grey-500"
                  onClick={() => {
                    onNewSession();
                    setOpen(false);
                  }}
                >
                  <PlusIcon size={16} />
                  新建对话
                </button>
                <DropdownDivider />
                {sessions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={item.id === current?.id}
                    className={`block w-full truncate rounded-lg px-2.5 py-2 text-left text-sm leading-5 focus-visible:outline-2 focus-visible:outline-fg-grey-500 ${
                      item.id === current?.id
                        ? "bg-accent-soft font-medium text-accent"
                        : "text-fg-grey-700 hover:bg-fg-grey-50"
                    }`}
                    onClick={() => {
                      onSelectSession(item.id);
                      setOpen(false);
                    }}
                  >
                    {item.title}
                  </button>
                ))}
                {sessions.length === 0 ? (
                  <p className="px-2.5 py-3 text-center text-sm text-fg-grey-500">暂无最近对话</p>
                ) : null}
              </DropdownPanel>
            </div>,
            portalRoot,
          )
        : null}
    </div>
  );
}
