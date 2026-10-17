"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const routes: { key: string; family: string; anchor?: string }[] = [
  { key: "calendarcard-api", family: "calendar", anchor: "calendarcard" },
  { key: "calendarcard", family: "calendar", anchor: "calendarcard" },
  { key: "tab-contents", family: "tab" },
  { key: "liquidtabs", family: "tab" },
  { key: "interaction-044", family: "accordion", anchor: "interaction-044" },
  { key: "animated-widgets", family: "input-field" },
  { key: "otpinput", family: "input-field" },
  { key: "accordion", family: "accordion" },
  { key: "addmember", family: "agent" },
  { key: "selection", family: "input-field" },
  { key: "overlays", family: "modal" },
  { key: "buttons", family: "button-link" },
  { key: "usage", family: "button-link" },
  { key: "menus", family: "menu" },
  { key: "navigation", family: "menu" },
  { key: "tooltip", family: "tooltip" },
  { key: "toast", family: "feedback" },
  { key: "tabs", family: "tab" },
];

const index = [
  ["按钮与链接", "button-link"],
  ["菜单", "menu"],
  ["页签与切换", "tab"],
  ["表单与输入", "input-field"],
  ["提示气泡", "tooltip"],
  ["确认弹窗", "modal"],
  ["折叠面板", "accordion"],
  ["消息反馈", "feedback"],
  ["日历与日程", "calendar"],
  ["智能体", "agent"],
] as const;

function matchHash(hash: string) {
  const ordered = [...routes].sort((a, b) => b.key.length - a.key.length);
  return ordered.find((item) => hash === item.key || hash.startsWith(`${item.key}-`) || hash.startsWith(item.key));
}

function useLocationHash() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("hashchange", onStoreChange);
      return () => window.removeEventListener("hashchange", onStoreChange);
    },
    () => window.location.hash.slice(1).toLowerCase(),
    () => "",
  );
}

export function LegacyInteractionRedirect({ surface }: { surface: "components" | "cases" }) {
  const router = useRouter();
  const hash = useLocationHash();
  const match = hash && hash !== "api" ? matchHash(hash) : undefined;

  useEffect(() => {
    if (!match) return;
    const anchor = match.anchor ? `#${match.anchor}` : "";
    router.replace(`/${surface}/${match.family}${anchor}`);
  }, [match, router, surface]);

  if (match) return <p className="text-sm text-fg-grey-700">正在打开对应页面…</p>;

  return (
    <div className="flex max-w-xl flex-col gap-4">
      <h1 className="font-display text-3xl font-bold tracking-fg text-fg-black">交互动效已按组件拆开</h1>
      <p className="text-sm leading-6 text-fg-grey-700">
        这个地址没有单独的动效页。请从下面进入对应的{surface === "cases" ? "案例" : "组件"}。
      </p>
      <ul className="flex flex-col gap-2">
        {index.map(([label, family]) => (
          <li key={family}>
            <Link href={`/${surface}/${family}`} className="text-sm font-semibold text-fg-blue underline underline-offset-4">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
