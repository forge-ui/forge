"use client";

import { useSyncExternalStore } from "react";
import { MoonLinear, SunLinear } from "@forge-ui-official/core/icons";
import { THEME_STORAGE_KEY } from "@/lib/theme-boot";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.dataset.theme === "dark";

export function ThemeToggle() {
  // The server renders light; the boot script may already have switched <html> to dark.
  const dark = useSyncExternalStore(subscribe, isDark, () => false);

  const toggle = () => {
    const next = !dark;
    if (next) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Private mode: the choice just isn't remembered.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "切换到浅色" : "切换到深色"}
      title={dark ? "浅色" : "深色"}
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-grey-900 transition-colors hover:bg-fg-grey-100 hover:text-fg-black"
    >
      {dark ? <SunLinear size={20} /> : <MoonLinear size={20} />}
    </button>
  );
}
