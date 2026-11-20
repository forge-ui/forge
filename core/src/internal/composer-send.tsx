"use client";

import { motion } from "motion/react";
import { ArrowUpLinear, RefreshLinear, StopBold } from "../icons";
import type { ComposerStatus } from "../components/ui/composer-types";
import { composerMorph } from "./composer-quick-actions";
import { useReducedMotion } from "./motion";

/** The composer's send button; turns into stop while a reply streams. Shared by ChatInputBar and Composer. */
export function SendButton({
  status, onStop, stopLabel, stoppingLabel,
  onClick,
  disabled,
  sendLabel,
  compact,
}: {
  status: ComposerStatus;
  onStop?: () => void;
  stopLabel: string;
  stoppingLabel: string;
  onClick: () => void;
  disabled: boolean;
  sendLabel?: string;
  compact?: boolean;
}) {
  const reduced = useReducedMotion();
  if (status !== "idle") {
    const stopping = status === "stopping";
    const label = stopping ? stoppingLabel : stopLabel;
    return <motion.button whileTap={reduced ? undefined : { scale: 0.88 }} transition={reduced ? { duration: 0 } : composerMorph} type="button" aria-label={label} title={label} aria-busy={stopping || undefined} disabled={stopping || !onStop}
      onClick={() => onStop?.()} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fg-black text-white disabled:cursor-not-allowed disabled:opacity-50">
      {stopping ? <RefreshLinear size={16} color="currentColor" /> : <StopBold size={16} color="currentColor" />}
    </motion.button>;
  }
  if (sendLabel) {
    return (
      <motion.button whileTap={reduced ? undefined : { scale: 0.88 }} transition={reduced ? { duration: 0 } : composerMorph}
        type="button"
        aria-label={sendLabel}
        onClick={onClick}
        disabled={disabled}
        className="flex h-9 shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-accent px-4 text-sm font-medium text-white transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-fg-grey-300"
      >
        {sendLabel}
        <ArrowUpLinear size={15} color="var(--fg-white)" />
      </motion.button>
    );
  }
  return (
    <motion.button whileTap={reduced ? undefined : { scale: 0.88 }} transition={reduced ? { duration: 0 } : composerMorph}
      type="button"
      aria-label="发送消息"
      title="发送消息"
      onClick={onClick}
      disabled={disabled}
      className={`forge-composer-send shrink-0 ${compact ? "w-9 h-9" : "w-10 h-10"} bg-accent rounded-full flex items-center justify-center transition hover:brightness-90 disabled:cursor-not-allowed disabled:bg-fg-grey-300`}
    >
      <motion.span aria-hidden="true" animate={!disabled && !reduced ? { y: [0, -1.5, 0] } : { y: 0 }} transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}><ArrowUpLinear size={compact ? 16 : 18} color="currentColor" /></motion.span>
    </motion.button>
  );
}
