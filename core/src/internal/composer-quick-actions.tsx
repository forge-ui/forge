"use client";

// Adapted from Pin UI PromptComposer. MIT attribution: core/THIRD_PARTY_NOTICES.md.
import { motion, type Transition } from "motion/react";
import { useId, useState, type ReactNode } from "react";
import { useReducedMotion } from "./motion";
import type { ChatInputBarQuickAction } from "../components/ui/chat-input-bar";

export const composerMorph: Transition = { type: "spring", visualDuration: 0.42, bounce: 0.16 };
const morph = composerMorph;
const tilts = [-5, 2.5, -2, 3, -4.5];

/** Clipped at the surface centre; the surface itself occludes the lower card. */
export function QuickActionFan({ actions, open, selectedId, disabled, label, onChoose, onClose }: {
  actions: ChatInputBarQuickAction[]; open: boolean; selectedId?: string; disabled?: boolean; label: string;
  onChoose: (action: ChatInputBarQuickAction) => void; onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const up = open && !disabled;
  return <div className="forge-quick-fan" role="group" aria-label={label} data-open={up || undefined}
    onPointerLeave={() => setHovered(null)} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); onClose(); } }}>
    {actions.map((action, index) => {
      const lifted = hovered === index && up;
      const lean = hovered === null || lifted ? 0 : index < hovered ? -1 : 1;
      const near = hovered !== null && Math.abs(hovered - index) === 1;
      const tilt = tilts[index % tilts.length];
      const rise = index === Math.floor(actions.length / 2) ? 6 : index % 2 ? 3 : 0;
      return <motion.button key={action.id} type="button" className={`forge-quick-card forge-quick-card--${action.kind ?? "custom"}`}
        style={{ left: `${5 + (index + 0.5) * 90 / actions.length}%`, width: `calc(90% / ${actions.length} + 8px)`, zIndex: lifted ? 10 : index + 1 }}
        disabled={disabled || !up} tabIndex={up ? 0 : -1} aria-hidden={!up || undefined}
        onPointerEnter={event => { if (event.pointerType === "mouse" && up) setHovered(index); }} onFocus={() => setHovered(index)} onBlur={() => setHovered(null)}
        onClick={() => { setHovered(null); onChoose(action); }}
        initial={reduced ? false : { y: "115%", rotate: 0, scale: 0.92 }} animate={up ? { y: -rise + (lifted ? -16 : near ? -3 : 0), x: lean * (near ? 10 : 4), rotate: lifted ? tilt * 0.3 : tilt + lean * (near ? 1.5 : 0.5), scale: lifted ? 1.05 : 1, opacity: 1 } : { y: "115%", x: 0, rotate: 0, scale: 0.92, opacity: reduced ? 0 : 1 }}
        transition={reduced ? { duration: 0 } : { ...morph, delay: up ? hovered === null ? 0.05 + index * 0.045 : 0 : selectedId === action.id ? 0.06 : 0, opacity: { duration: 0.22 } }}
        whileTap={reduced || !up ? undefined : { scale: 0.97, y: -10 - rise }}>
        <motion.span className="forge-quick-cardFace" initial={false} animate={{ "--forge-quick-peel": action.kind === "docs" && lifted && !reduced ? 1.2 : 1 } as Record<string, number>} transition={reduced ? { duration: 0 } : morph}>
          {(action.kind === "note" || action.kind === "event") && <span className="forge-quick-band" />}
          {action.kind === "docs" && <span className="forge-quick-peel" aria-hidden="true" />}
          <span className="forge-quick-label">{action.label}</span>
          <span className="forge-quick-artBox">{action.kind ? <QuickActionArt id={action.kind} live={lifted} /> : action.icon}</span>
        </motion.span>
      </motion.button>;
    })}
  </div>;
}

export function QuickActionArt({ id, live }: { id: NonNullable<ChatInputBarQuickAction["kind"]>; live: boolean }) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const go = live && !reduced;
  const spin = { transformBox: "fill-box" as const, transformOrigin: "center" };

  if (id === "image") {
    return (
      <svg className="forge-quick-art" viewBox="0 0 80 64" fill="none" aria-hidden="true">
        <motion.path
          d="M52 4c1.3 7.4 3.6 9.7 11 11-7.4 1.3-9.7 3.6-11 11-1.3-7.4-3.6-9.7-11-11 7.4-1.3 9.7-3.6 11-11Z"
          fill="var(--forge-quick-art-deep)"
          style={spin}
          animate={go ? { rotate: 90, scale: 1.2 } : { rotate: 0, scale: 1 }}
          transition={reduced ? { duration: 0 } : morph}
        />
        <motion.path
          d="M24 22 35 41H13Z"
          stroke="var(--forge-quick-art)"
          strokeWidth="5"
          strokeLinejoin="round"
          style={spin}
          animate={go ? { rotate: -14, y: -2 } : { rotate: 0, y: 0 }}
          transition={reduced ? { duration: 0 } : morph}
        />
        <rect x="12" y="48" width="18" height="18" rx="4.5" stroke="var(--forge-quick-art)" strokeWidth="5" />
        <motion.circle
          cx="52"
          cy="54"
          r="9"
          stroke="var(--forge-quick-art)"
          strokeWidth="5"
          animate={go ? { y: -3 } : { y: 0 }}
          transition={reduced ? { duration: 0 } : { ...morph, delay: go ? 0.04 : 0 }}
        />
      </svg>
    );
  }

  if (id === "note") {
    return (
      <span className="forge-quick-lines" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="forge-quick-line"
            animate={go ? { scaleX: [0.15, 1] } : { scaleX: 1 }}
            transition={go ? { duration: 0.5, ease: [0.2, 0, 0, 1], delay: i * 0.06 } : reduced ? { duration: 0 } : morph}
          />
        ))}
      </span>
    );
  }

  if (id === "event") {
    return (
      <motion.span className="forge-quick-date" aria-hidden="true" animate={go ? { y: -3, scale: 1.06 } : { y: 0, scale: 1 }} transition={reduced ? { duration: 0 } : morph}>
        12
      </motion.span>
    );
  }

  if (id === "voice") {
    return (
      <svg className="forge-quick-art" viewBox="0 0 80 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id={`pcmp-mic-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--forge-quick-art)" />
            <stop offset="1" stopColor="var(--forge-quick-art-deep)" />
          </linearGradient>
        </defs>
        <path d="M18 34c0 13 9.5 22 22 22s22-9 22-22" stroke="var(--forge-quick-art)" strokeWidth="5" strokeLinecap="round" />
        <motion.rect x="28" y="2" width="24" height="44" rx="12" fill={`url(#pcmp-mic-${uid})`} animate={go ? { y: -2 } : { y: 0 }} transition={reduced ? { duration: 0 } : morph} />
        <motion.g
          style={spin}
          animate={go ? { scale: [1, 1.14, 1] } : { scale: 1 }}
          transition={go ? { duration: 0.9, repeat: Infinity, ease: "easeInOut" } : reduced ? { duration: 0 } : morph}
        >
          <circle cx="40" cy="46" r="11" fill="var(--forge-quick-rec)" />
          <circle cx="40" cy="46" r="4" fill="var(--forge-quick-rec-dot)" />
        </motion.g>
      </svg>
    );
  }

  return (
    <svg className="forge-quick-art" viewBox="0 0 80 64" fill="none" aria-hidden="true">
      <motion.g style={spin} animate={go ? { rotate: -4, y: -2 } : { rotate: 0, y: 0 }} transition={reduced ? { duration: 0 } : morph}>
        <rect x="16" y="4" width="48" height="60" rx="8" fill="var(--forge-quick-art)" />
        <motion.rect
          x="31"
          y="24"
          width="24"
          height="5.5"
          rx="2.75"
          fill="var(--forge-quick-card)"
          style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
          animate={go ? { scaleX: 1.15 } : { scaleX: 1 }}
          transition={reduced ? { duration: 0 } : morph}
        />
        <motion.rect
          x="31"
          y="36"
          width="24"
          height="5.5"
          rx="2.75"
          fill="var(--forge-quick-card)"
          style={{ transformBox: "fill-box", transformOrigin: "0% 50%" }}
          animate={go ? { scaleX: 0.7 } : { scaleX: 1 }}
          transition={reduced ? { duration: 0 } : morph}
        />
      </motion.g>
    </svg>
  );
}

export function QuickActionGlyph({ id }: { id: NonNullable<ChatInputBarQuickAction["kind"]> }) {
  const paths: Record<NonNullable<ChatInputBarQuickAction["kind"]>, ReactNode> = {
    image: <path d="M8 1.8c.6 3.3 1.6 4.3 4.9 4.9-3.3.6-4.3 1.6-4.9 4.9-.6-3.3-1.6-4.3-4.9-4.9 3.3-.6 4.3-1.6 4.9-4.9Z" fill="currentColor" />,
    note: (
      <>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.2 6.5h5.6M5.2 9.5h3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    event: (
      <>
        <rect x="2.5" y="3.2" width="11" height="10.3" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.5 6.6h11M5.5 1.8v2.6M10.5 1.8v2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    voice: (
      <>
        <rect x="5.6" y="1.8" width="4.8" height="7.6" rx="2.4" fill="currentColor" />
        <path d="M3.6 7.6a4.4 4.4 0 0 0 8.8 0M8 12v2.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
    docs: (
      <>
        <path
          d="M4 1.9h5.2L12.6 5.3v7.6a1.3 1.3 0 0 1-1.3 1.3H4a1.3 1.3 0 0 1-1.3-1.3V3.2A1.3 1.3 0 0 1 4 1.9Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path d="M5.4 8.5h4.6M5.4 11h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </>
    ),
  };
  return (
    <svg className="forge-quick-chipIcon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}
