"use client";

import { useSyncExternalStore } from "react";
import type { Heading } from "@/lib/articles";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/** Sticky chapter list; the last heading scrolled past the top of the viewport is highlighted. */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const activeId = useSyncExternalStore(
    subscribe,
    () => headings.findLast(heading => (document.getElementById(heading.id)?.getBoundingClientRect().top ?? Infinity) <= 120)?.id ?? headings[0]?.id,
    () => undefined,
  );

  return (
    <nav aria-label="本文目录" className="flex flex-col gap-3 text-sm">
      <p className="font-semibold text-fg-black">本文目录</p>
      <ul className="flex flex-col border-l border-fg-grey-200">
        {headings.map(heading => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              aria-current={heading.id === activeId ? "location" : undefined}
              className={`-ml-px block border-l py-1.5 leading-5 transition-colors ${heading.level === 3 ? "pl-7" : "pl-4"} ${heading.id === activeId ? "border-fg-black font-medium text-fg-black" : "border-transparent text-fg-grey-700 hover:text-fg-black"}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
