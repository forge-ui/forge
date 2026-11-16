"use client";

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { ChatInputBar, Conversation, IconButton } from "@forge-ui-official/core";
import { ClockCircleLinear, PenNewSquareLinear, PlusLinear, StarsLinear } from "@forge-ui-official/core/icons";

export const PANEL_WIDTH = 400;

// On wide screens the open panel takes its width from the page instead of covering it, so what
// the agent operates stays in view. Sticky headers follow; fixed full-width bars do not.
function insetPage(open: boolean) {
  const root = document.documentElement;
  if (open && matchMedia("(min-width: 1024px)").matches) {
    root.style.marginRight = `${PANEL_WIDTH}px`;
    // Lets the app tighten its layout while the panel is open, e.g. hide a secondary column.
    root.setAttribute("data-forge-agent-open", "");
  } else {
    root.style.removeProperty("margin-right");
    root.removeAttribute("data-forge-agent-open");
  }
}

export type AgentSession = { id: string; title: string };

export type AgentPanelProps = {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The floating launcher; turn it off when the app opens the panel from its own button. */
  launcher?: boolean;
  launcherLabel?: string;
  /** Shown above the composer when there is nothing in the conversation yet. */
  empty?: ReactNode;
  /** Changes when content arrives, to keep following the latest reply. */
  followKey?: unknown;
  children?: ReactNode;
  onNewChat?: () => void;
  /** Earlier conversations, listed under the history button. */
  sessions?: AgentSession[];
  currentSessionId?: string;
  onSelectSession?: (id: string) => void;
  /** Above the composer: errors, attachments, notices. */
  notice?: ReactNode;
  composer: ComponentProps<typeof ChatInputBar>;
};

/**
 * The Forge Agent panel without a runtime: launcher, side panel, header, conversation and composer.
 * ForgeAgent drives it with the chat runtime; an app with its own runtime (e.g. the Ask AI harness)
 * renders its turns inside it.
 */
export function AgentPanel({ title, open, onOpenChange, launcher = true, launcherLabel, empty, followKey, children, onNewChat, sessions, currentSessionId, onSelectSession, notice, composer }: AgentPanelProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const history = useRef<HTMLDivElement>(null);

  useEffect(() => {
    insetPage(open);
    return () => insetPage(false);
  }, [open]);

  useEffect(() => {
    if (!historyOpen) return;
    const close = (event: PointerEvent) => { if (!history.current?.contains(event.target as Node)) setHistoryOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [historyOpen]);

  if (!open) {
    if (!launcher) return null;
    return (
      <button
        type="button"
        data-forge-agent="launcher"
        onClick={() => onOpenChange(true)}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_color-mix(in_srgb,var(--accent)_55%,transparent)] transition hover:brightness-110 hover:scale-[1.03]"
      >
        <StarsLinear size={18} />
        {launcherLabel ?? title}
      </button>
    );
  }

  return (
    <aside aria-label={title} data-forge-agent="panel" className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col border-l border-fg-grey-200 bg-background shadow-2xl lg:shadow-none">
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-fg-grey-200 pl-4 pr-2">
        <span className="flex items-center gap-1.5 text-[13px] font-semibold text-fg-black"><StarsLinear size={16} className="text-fg-blue" />{title}</span>
        <div className="flex items-center">
          {sessions && sessions.length > 0 && onSelectSession && (
            <div ref={history} className="relative">
              <IconButton variant="ghost" shape="square" size="sm" aria-label="历史对话" title="历史对话" aria-expanded={historyOpen} onClick={() => setHistoryOpen(value => !value)}><ClockCircleLinear size={16} /></IconButton>
              {historyOpen && (
                <ul role="menu" aria-label="历史对话" className="absolute right-0 top-9 z-10 max-h-80 w-64 overflow-y-auto rounded-xl border border-fg-grey-200 bg-background p-1 shadow-[0px_4px_30px_0px_rgba(77,84,100,0.20)]">
                  {sessions.map(session => (
                    <li key={session.id} role="none">
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={session.id === currentSessionId}
                        onClick={() => { onSelectSession(session.id); setHistoryOpen(false); }}
                        className="w-full truncate rounded-lg px-3 py-2 text-left text-[13px] text-fg-black hover:bg-fg-grey-100 aria-checked:bg-fg-grey-100 aria-checked:font-semibold"
                      >
                        {session.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {onNewChat && <IconButton variant="ghost" shape="square" size="sm" aria-label="新对话" title="新对话" onClick={onNewChat}><PenNewSquareLinear size={16} /></IconButton>}
          {/* The icon set has no bare cross; a turned plus keeps the same stroke. */}
          <IconButton variant="ghost" shape="square" size="sm" aria-label="关闭" title="关闭" onClick={() => onOpenChange(false)}><PlusLinear size={18} className="rotate-45" /></IconButton>
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">
        <Conversation followKey={followKey}>
          {children ?? empty}
        </Conversation>
      </div>
      <div className="shrink-0 px-3 pb-3">
        {notice}
        <ChatInputBar multiline sendOnEnter density="compact" showAttachment={false} {...composer} />
      </div>
    </aside>
  );
}
