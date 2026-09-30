"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

type StreamingTextOptions = {
  text: string;
  streaming: boolean;
  status?: "streaming" | "complete" | "stopped";
  reducedMotion: boolean;
  duration: number;
};

type PlaybackMode = "live" | "replay" | "drain" | "static" | "stopped";
type StreamingTextState = {
  text: string;
  animating: boolean;
  busy: boolean;
  done: boolean;
  generation: number;
  motionDisabled: boolean;
};
type Snapshot = StreamingTextState & { source: string; mode: PlaybackMode };
type Playback = {
  input: string;
  mode: PlaybackMode;
  text: string;
  position: number;
  generation: number;
  revealedAt: number | null;
  committedAt: number | null;
  frameAt: number | null;
  motionDisabled: boolean;
};

const LATIN = /^[\p{Script=Latin}\p{Number}\p{Mark}'’_-]+$/u;
const EXTENSION = /^[\p{Mark}\u{1f3fb}-\u{1f3ff}\u{e0020}-\u{e007f}]$/u;
const REGIONAL = /^[\u{1f1e6}-\u{1f1ff}]$/u;
const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function segmentGraphemes(text: string): { segment: string; index: number }[] {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    return Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text));
  }
  // Older engines still keep surrogate pairs, combining marks and joined emoji together.
  const result: { segment: string; index: number }[] = [];
  let index = 0;
  for (const point of text) {
    const previous = result[result.length - 1];
    if (previous && (EXTENSION.test(point) || point === "\u200d" || previous.segment.endsWith("\u200d") ||
      (point === "\n" && previous.segment === "\r") ||
      (REGIONAL.test(point) && REGIONAL.test(previous.segment)))) {
      previous.segment += point;
    } else {
      result.push({ segment: point, index });
    }
    index += point.length;
  }
  return result;
}

/** A live stream retains its final grapheme: the next chunk may extend it. */
function boundaries(text: string, live: boolean): number[] {
  const segments = segmentGraphemes(text);
  const safeEnd = live && segments.length ? segments[segments.length - 1].index : text.length;
  const ends: number[] = [];
  for (let index = 0; index < segments.length; index++) {
    const current = segments[index];
    let end = current.index + current.segment.length;
    if (LATIN.test(current.segment)) {
      while (index + 1 < segments.length && LATIN.test(segments[index + 1].segment)) {
        index++;
        end = segments[index].index + segments[index].segment.length;
      }
    }
    if (end <= safeEnd) ends.push(end);
  }
  return ends;
}

function boundaryBefore(ends: number[], position: number): number {
  let low = 0;
  let high = ends.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    if (ends[middle] <= position) low = middle + 1;
    else high = middle;
  }
  return low ? ends[low - 1] : 0;
}

function modeFor(options: StreamingTextOptions, previous?: PlaybackMode): PlaybackMode {
  if (options.status === "streaming") return "live";
  if (options.status === "stopped") return "stopped";
  if (options.status === "complete") {
    return previous === "live" || previous === "replay" || previous === "drain" ? "drain" : "static";
  }
  return options.streaming ? "replay" : "static";
}

function immediateText(text: string, live: boolean): string {
  // Do not expose half a UTF-16 surrogate when transport chunks split an emoji.
  return live && /[\ud800-\udbff]$/.test(text) ? text.slice(0, -1) : text;
}

function initialSnapshot(options: StreamingTextOptions, ready = true): Snapshot {
  const mode = modeFor(options);
  const active = mode === "live" || mode === "replay";
  const waitingForClient = active && !ready;
  const animate = active && ready && !options.reducedMotion && options.duration > 0;
  const text = animate || waitingForClient ? "" : immediateText(options.text, mode === "live");
  const animating = animate && boundaries(options.text, mode === "live").length > 0;
  const busy = waitingForClient || mode === "live" || animating;
  return { text, animating, busy, done: !busy && mode !== "stopped", generation: 0, motionDisabled: ready && active && !animate, source: options.text, mode };
}

/** Buffers growing text independently from the renderer's entrance animations. */
export function useStreamingText({ text, streaming, status, reducedMotion, duration }: StreamingTextOptions): StreamingTextState {
  // The motion preference has a conservative SSR snapshot. Wait until hydration
  // reads the actual media query before deciding whether a replay should animate.
  const ready = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  const [snapshot, setSnapshot] = useState(() => initialSnapshot({ text, streaming, status, reducedMotion, duration }, ready));
  const playback = useRef<Playback | null>(null);
  const committed = useRef<Snapshot | null>(null);

  useLayoutEffect(() => { committed.current = snapshot; }, [snapshot]);

  useLayoutEffect(() => {
    if (!ready) return;
    const options = { text, streaming, status, reducedMotion, duration };
    const previous = playback.current;
    const changed = previous !== null && !text.startsWith(previous.input);
    const startingReplay = previous !== null && status === undefined && streaming && previous.mode === "static";
    const stopping = previous !== null && status === "stopped" && previous.mode !== "stopped";
    const reset = !stopping && (changed || startingReplay);
    const mode = modeFor(options, reset ? undefined : previous?.mode);
    const initial = previous && !reset ? null : initialSnapshot(options);
    const state: Playback = previous && !reset ? previous : {
      input: text,
      mode,
      text: initial!.text,
      position: initial!.text.length,
      generation: previous ? previous.generation + 1 : 0,
      revealedAt: null,
      committedAt: null,
      frameAt: null,
      motionDisabled: initial!.motionDisabled,
    };
    if (stopping) {
      const visible = committed.current;
      state.text = visible?.generation === state.generation ? visible.text : "";
      state.position = state.text.length;
      state.revealedAt = null;
      state.frameAt = null;
    }
    state.input = text;
    state.mode = mode;
    playback.current = state;

    let disposed = false;
    let frame: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const fadeDuration = Number.isFinite(duration) ? Math.max(0, duration) : 0;
    // Once displayed without motion, this answer stays immediate. Re-enabling
    // motion must not remount and replay text the reader has already seen.
    if (mode !== "static" && (reducedMotion || fadeDuration === 0)) state.motionDisabled = true;
    const animated = !state.motionDisabled && !reducedMotion && fadeDuration > 0 && mode !== "static" && mode !== "stopped";
    const ends = animated ? boundaries(text, mode === "live") : [];
    const target = Math.max(state.text.length, ends[ends.length - 1] ?? 0);

    if (mode === "static" || (mode !== "stopped" && !animated)) {
      state.text = immediateText(text, mode === "live");
      state.position = state.text.length;
      state.revealedAt = null;
      state.frameAt = null;
    }

    function publish(now: number) {
      const pending = animated && state.text.length < target;
      const settling = animated && state.revealedAt !== null && now < state.revealedAt + fadeDuration;
      const animating = pending || settling;
      const busy = mode === "live" || animating;
      const next: Snapshot = {
        text: state.text,
        animating,
        busy,
        done: !busy && mode !== "stopped",
        generation: state.generation,
        motionDisabled: state.motionDisabled,
        source: text,
        mode,
      };
      setSnapshot((current) => Object.keys(next).every((key) => current[key as keyof Snapshot] === next[key as keyof Snapshot]) ? current : next);
    }

    function finish(now: number) {
      publish(now);
      if (state.revealedAt !== null && animated) {
        const remaining = state.revealedAt + fadeDuration - now;
        if (remaining > 0) {
          timer = setTimeout(() => { if (!disposed) finish(performance.now()); }, remaining);
        }
      }
    }

    function tick(now: number) {
      if (disposed) return;
      const elapsed = state.frameAt === null ? 0 : Math.min(32, Math.max(0, now - state.frameAt));
      state.frameAt = now;
      const backlog = target - state.position;
      const speed = Math.min(0.45, Math.max(0.15, backlog / 800));
      state.position = Math.min(target, state.position + elapsed * speed);
      if (state.committedAt === null || now - state.committedAt >= 120 || state.position >= target) {
        const end = boundaryBefore(ends, state.position);
        if (end > state.text.length) {
          state.text = text.slice(0, end);
          state.revealedAt = now;
          state.committedAt = now;
          publish(now);
        }
      }
      if (state.position < target) frame = requestAnimationFrame(tick);
      else finish(now);
    }

    // Input transitions must be committed before paint, especially stop and reduced motion.
    const now = performance.now();
    publish(now);
    // Chunks can arrive before every scheduled frame. Advance the same persistent
    // clock here so replacing an effect cannot starve playback by cancelling RAF.
    if (animated && state.text.length < target) tick(now);
    else finish(now);

    return () => {
      disposed = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [text, streaming, status, reducedMotion, duration, ready]);

  // A replaced input must not fire a completion callback from the previous render.
  const mode = modeFor({ text, streaming, status, reducedMotion, duration }, snapshot.mode);
  return {
    text: snapshot.text,
    animating: snapshot.animating,
    busy: snapshot.busy,
    done: snapshot.done && snapshot.source === text && snapshot.mode === mode,
    generation: snapshot.generation,
    motionDisabled: snapshot.motionDisabled,
  };
}
