"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { counterpart, isEnglishPath } from "@/lib/i18n-routes";

export function LanguageSwitch() {
  const pathname = usePathname() ?? "/";
  const english = isEnglishPath(pathname);
  return (
    <Link
      href={counterpart(pathname)}
      hrefLang={english ? "zh-CN" : "en"}
      lang={english ? "zh-CN" : "en"}
      aria-label={english ? "切换到中文" : "Switch to English"}
      className="inline-flex h-9 shrink-0 items-center rounded-lg px-2.5 text-sm font-semibold tracking-fg text-fg-grey-900 transition-colors hover:bg-fg-grey-100 hover:text-fg-black"
    >
      {english ? "中文" : "EN"}
    </Link>
  );
}
