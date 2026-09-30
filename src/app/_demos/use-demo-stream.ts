"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type DemoStreamOptions = {
  text: string;
  locale: "en" | "zh";
  jitter: boolean;
};

type Phase = "idle" | "waiting" | "streaming" | "settling" | "complete" | "stopped";

type Snapshot = {
  receivedText: string;
  receivedCount: number;
  phase: Phase;
  runId: number;
  elapsedMs: number;
};

const EMPTY: Snapshot = { receivedText: "", receivedCount: 0, phase: "idle", runId: 0, elapsedMs: 0 };
const CHUNK_SIZES = { en: [9, 14, 8, 18, 11, 16, 10, 13], zh: [3, 5, 4, 7, 3, 6] };
const CHUNK_DELAYS = [92, 124, 84, 116, 103, 129, 88, 110];

/** Simulates transport only. Core owns the display buffer and animation. */
export function useDemoStream({ text, locale, jitter }: DemoStreamOptions) {
  const [snapshot, setSnapshot] = useState<Snapshot>(EMPTY);
  const runIdRef = useRef(0);
  const runtimeRef = useRef({
    token: 0,
    active: false,
    networkDone: false,
    startedAt: 0,
    networkTimer: null as number | null,
  });

  const cancelWork = useCallback(() => {
    const runtime = runtimeRef.current;
    runtime.token += 1;
    runtime.active = false;
    if (runtime.networkTimer !== null) window.clearTimeout(runtime.networkTimer);
    runtime.networkTimer = null;
    return runtime.token;
  }, []);

  const reset = useCallback(() => {
    cancelWork();
    runIdRef.current += 1;
    setSnapshot({ ...EMPTY, runId: runIdRef.current });
  }, [cancelWork]);

  const stop = useCallback(() => {
    const runtime = runtimeRef.current;
    if (!runtime.active) return;
    const elapsedMs = Math.round(performance.now() - runtime.startedAt);
    cancelWork();
    // The received prefix stays intact; Core freezes its own visible prefix.
    setSnapshot((current) => ({ ...current, phase: "stopped", elapsedMs }));
  }, [cancelWork]);

  const finish = useCallback((runId: number) => {
    const runtime = runtimeRef.current;
    if (runId !== runIdRef.current || !runtime.active || !runtime.networkDone) return;
    const elapsedMs = Math.round(performance.now() - runtime.startedAt);
    cancelWork();
    setSnapshot((current) => current.runId === runId && current.phase === "settling"
      ? { ...current, phase: "complete", elapsedMs }
      : current);
  }, [cancelWork]);

  const start = useCallback(() => {
    const token = cancelWork();
    const runtime = runtimeRef.current;
    const startedAt = performance.now();
    const runId = ++runIdRef.current;
    runtime.active = true;
    runtime.networkDone = false;
    runtime.startedAt = startedAt;
    setSnapshot({ ...EMPTY, phase: "waiting", runId });

    const graphemeEnds = [0];
    for (const segment of new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(text)) {
      graphemeEnds.push(segment.index + segment.segment.length);
    }
    const sizes = CHUNK_SIZES[locale];
    let received = 0;
    let chunkIndex = 0;
    let boundaryIndex = 0;

    const receive = () => {
      if (runtime.token !== token || !runtime.active) return;
      runtime.networkTimer = null;
      const target = Math.min(text.length, received + sizes[chunkIndex % sizes.length]);
      while (boundaryIndex + 1 < graphemeEnds.length && graphemeEnds[boundaryIndex] < target) {
        boundaryIndex += 1;
      }
      received = graphemeEnds[boundaryIndex];
      chunkIndex += 1;
      runtime.networkDone = received === text.length;
      setSnapshot({
        receivedText: text.slice(0, received),
        receivedCount: received,
        phase: runtime.networkDone ? "settling" : "streaming",
        runId,
        elapsedMs: Math.round(performance.now() - startedAt),
      });

      if (!runtime.networkDone) {
        const pause = jitter && chunkIndex % 7 === 0 ? 650 : 0;
        const delay = CHUNK_DELAYS[chunkIndex % CHUNK_DELAYS.length] + (locale === "zh" ? 20 : 0) + pause;
        runtime.networkTimer = window.setTimeout(receive, delay);
      }
    };

    runtime.networkTimer = window.setTimeout(receive, 600);
  }, [cancelWork, jitter, locale, text]);

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => { if (!cancelled) reset(); });
    return () => { cancelled = true; cancelWork(); };
  }, [cancelWork, jitter, locale, reset, text]);

  return { ...snapshot, start, stop, reset, finish };
}
