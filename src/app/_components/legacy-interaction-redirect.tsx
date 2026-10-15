"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const destinations: Record<string, string> = {
  otpinput: "input-field", calendarcard: "calendar", liquidtabs: "tab", addmember: "agent",
  buttons: "button-link", menus: "menu", tabs: "tab", navigation: "menu", tooltip: "tooltip",
  selection: "input-field", overlays: "modal", accordion: "grid", "tab-contents": "tab", toast: "modal",
  "interaction-044": "grid",
};

/** Preserve old bookmarks after removing the standalone category. */
export function LegacyInteractionRedirect({ surface }: { surface: "components" | "cases" }) {
  const router = useRouter();
  useEffect(() => {
    const hash = window.location.hash.slice(1).toLowerCase();
    const key = Object.keys(destinations).find(value => hash.startsWith(value));
    const family = key ? destinations[key] : "button-link";
    const anchor = key && ["otpinput", "calendarcard", "liquidtabs", "addmember", "interaction-044"].includes(key) ? `#${surface === "components" && key === "calendarcard" ? "calendarcard-api" : hash}` : "";
    router.replace(`/components/${family}${anchor}`);
  }, [router, surface]);
  return <p className="text-sm text-fg-grey-700">正在打开对应分类的示例…</p>;
}
