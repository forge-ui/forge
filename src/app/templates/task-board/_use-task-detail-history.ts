"use client";

import { useEffect, useRef } from "react";
import type { DraftExitGuard } from "./_subtasks";

const INDEX = "__forgeTaskDetailIndex";
type Entry = { index: number; url: string };
type Pending = { source: Entry; target: Entry; phase: "restore" | "decision" | "leave"; approved: boolean };
const entryIndex = () => Number.isInteger(history.state?.[INDEX]) ? history.state[INDEX] as number : 0;

export function useTaskDetailHistory(guard: { current: DraftExitGuard | null }, onRead: (hash: string) => void) {
  const accepted = useRef<Entry>({ index: 0, url: "" });
  const pending = useRef<Pending | null>(null);
  const read = useRef(onRead);
  useEffect(() => { read.current = onRead; });
  useEffect(() => {
    const accept = () => {
      accepted.current = { index: entryIndex(), url: location.href };
      pending.current = null;
      read.current(location.hash);
    };
    history.replaceState({ ...history.state, [INDEX]: entryIndex() }, "");
    accept();
    const pop = () => {
      const target = { index: entryIndex(), url: location.href };
      const request = pending.current;
      if (request?.phase === "restore") {
        if (target.index !== request.source.index) { history.go(request.source.index - target.index); return; }
        request.phase = "decision";
        if (request.approved) { request.phase = "leave"; history.go(request.target.index - request.source.index); }
        return;
      }
      if (request?.phase === "leave") { accept(); return; }
      if (target.url === accepted.current.url || !guard.current) { accept(); return; }
      const next: Pending = { source: accepted.current, target, phase: "restore", approved: false };
      pending.current = next;
      let synchronous = true;
      guard.current(() => {
        if (pending.current !== next) return;
        next.approved = true;
        if (synchronous) return;
        if (next.phase === "decision") {
          next.phase = "leave";
          const delta = next.target.index - next.source.index;
          if (delta) history.go(delta);
          else {
            history.pushState({ ...history.state, [INDEX]: next.source.index + 1 }, "", next.target.url);
            accept();
          }
        }
      });
      synchronous = false;
      if (next.approved) { accept(); return; }
      // Put the browser back on the edited entry before asking the user to leave.
      // Traversing preserves both Back and Forward entries; replacing the URL would not.
      if (next.source.index !== target.index) history.go(next.source.index - target.index);
      else {
        // A manually changed fragment may reuse a history state marker.
        history.replaceState({ ...history.state, [INDEX]: next.source.index }, "", next.source.url);
        next.phase = "decision";
      }
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [guard]);

  return (hash: string, replace = false) => {
    pending.current = null;
    const url = `${location.pathname}${location.search}${hash}`;
    const index = entryIndex() + (replace ? 0 : 1);
    history[replace ? "replaceState" : "pushState"]({ ...history.state, [INDEX]: index }, "", url);
    accepted.current = { index, url: location.href };
  };
}
