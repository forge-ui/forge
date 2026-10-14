"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { TrashBinTrashLinear } from "../icons";
import { useReducedMotion } from "./motion";
import type { ButtonProps } from "../components/ui/button";

const colors = { purple: "var(--fg-violet)", dark: "var(--fg-violet-800)", blue: "var(--fg-blue)", "blue-dark": "var(--fg-blue-800)", red: "var(--fg-red)", green: "var(--fg-green-500)", yellow: "var(--fg-yellow)", grey: "var(--fg-grey-700)", black: "var(--fg-black)" };
export function HoldButton({ children, color = "red", size = "lg", disabled, motion = "auto", holdDuration = 1200, onConfirm, onUndo,
  confirmed, locale = "zh", holdLabels, iconLeft, iconRight, className = "", type = "button", ...props }: ButtonProps) {
  const reduced = useReducedMotion(motion);
  const [done, setDone] = useState(false);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const finished = confirmed ?? done;
  const button = useRef<HTMLButtonElement>(null);
  const undo = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frame = useRef(0);
  const pressed = useRef(false);
  const callback = useRef(onConfirm);
  const holdTime = Number.isFinite(holdDuration) ? Math.max(100, holdDuration) : 1200;
  useEffect(() => { callback.current = onConfirm; }, [onConfirm]);
  function stop() {
    if (timer.current !== null) clearTimeout(timer.current);
    if (frame.current) cancelAnimationFrame(frame.current);
    timer.current = null; frame.current = 0; pressed.current = false; setHolding(false); setProgress(0);
  }
  function start() {
    if (disabled || finished || pressed.current) return;
    pressed.current = true; setHolding(true);
    const began = performance.now();
    const tick = (now: number) => { setProgress(Math.min(1, (now - began) / holdTime)); frame.current = requestAnimationFrame(tick); };
    if (!reduced) frame.current = requestAnimationFrame(tick);
    timer.current = setTimeout(() => {
      timer.current = null;
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0; setHolding(false); setProgress(1); setDone(true); callback.current?.();
    }, holdTime);
  }
  useEffect(() => {
    const cancel = () => { if (timer.current !== null) clearTimeout(timer.current); if (frame.current) cancelAnimationFrame(frame.current); timer.current = null; frame.current = 0; pressed.current = false; setHolding(false); setProgress(0); };
    const visibility = () => { if (document.hidden) cancel(); };
    window.addEventListener("blur", cancel); document.addEventListener("visibilitychange", visibility);
    return () => { window.removeEventListener("blur", cancel); document.removeEventListener("visibilitychange", visibility); cancel(); };
  }, [disabled, holdDuration]);
  useEffect(() => { if (finished) undo.current?.focus({ preventScroll: true }); }, [finished]);
  const text = children ?? holdLabels?.idle ?? (locale === "zh" ? "长按删除" : "Hold to delete");
  const icon = iconLeft ?? <TrashBinTrashLinear size={20} color="currentColor" />;
  const label = <>{icon}<span>{text}</span>{iconRight}</>;
  const style = { "--forge-hold-color": colors[color], "--forge-hold-progress": progress, "--forge-hold-return": `${holdTime / 2.4}ms`, ...props.style } as CSSProperties;
  return <div className={`forge-hold-row forge-hold-${size} ${className}`} data-motion={motion} data-reduced={reduced || undefined} data-holding={holding || undefined} data-shaking={holding && progress > .55 && !reduced || undefined} data-confirmed={finished || undefined} style={style}>
    <button {...props} style={undefined} ref={button} type={type} disabled={disabled} className="forge-hold-trigger" aria-label={props["aria-label"] ?? (typeof text === "string" ? text : undefined)} tabIndex={finished ? -1 : props.tabIndex} aria-hidden={finished || undefined}
      title={props.title ?? (locale === "zh" ? "按住鼠标、空格或回车，松开取消" : "Hold mouse, Space or Enter; release to cancel")}
      onPointerDown={event => { props.onPointerDown?.(event); if (!event.defaultPrevented && event.button === 0) { event.currentTarget.setPointerCapture?.(event.pointerId); start(); } }}
      onPointerUp={event => { stop(); props.onPointerUp?.(event); }} onPointerCancel={event => { stop(); props.onPointerCancel?.(event); }} onLostPointerCapture={event => { stop(); props.onLostPointerCapture?.(event); }}
      onKeyDown={event => { props.onKeyDown?.(event); if (event.defaultPrevented) return; if (event.key === " " || event.key === "Enter") { event.preventDefault(); if (!event.repeat) start(); } if (event.key === "Escape") stop(); }}
      onKeyUp={event => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); stop(); } props.onKeyUp?.(event); }} onBlur={event => { stop(); props.onBlur?.(event); }}
      onClick={event => event.preventDefault()} onContextMenu={event => event.preventDefault()}>
      <span className="forge-hold-label">{label}</span><span className="forge-hold-label forge-hold-fill" aria-hidden="true">{label}</span>
    </button>
    <div className="forge-hold-done" aria-hidden={!finished} inert={!finished}>
      <span role={finished ? "status" : undefined}>{holdLabels?.done ?? (locale === "zh" ? "已删除" : "Deleted")}</span>
      <button type="button" ref={undo} disabled={disabled} onClick={() => { stop(); setDone(false); onUndo?.(); button.current?.focus({ preventScroll: true }); }}>{holdLabels?.undo ?? (locale === "zh" ? "撤销" : "Undo")}</button>
    </div>
  </div>;
}
