"use client";

import { useSyncExternalStore } from "react";

const query = "(max-width: 767px)";
const subscribe = (listener: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
};

/** Immersive templates retain AppLayout's native navigation trigger on phones. */
export function useTemplateMobile() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
