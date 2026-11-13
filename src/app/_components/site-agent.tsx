"use client";

import { usePathname, useRouter } from "next/navigation";
import { z } from "zod";
import { ForgeAgent, defineTool } from "@forge-ui-official/agent";
import { SCALE_STEPS, normalizeHex, previewVariables } from "@/lib/theme.mjs";
import { THEME_STORAGE_KEY } from "@/lib/theme-boot";

// Variables the accent preview set on <html>, so it can be undone.
let previewKeys: string[] = [];

function currentReference() {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(SCALE_STEPS.map(step => [step, style.getPropertyValue(`--fg-blue-${step}`).trim()]));
}

function clearAccentPreview() {
  for (const key of previewKeys) document.documentElement.style.removeProperty(key);
  previewKeys = [];
}

function setColorMode(mode: "light" | "dark") {
  if (mode === "dark") document.documentElement.dataset.theme = "dark";
  else delete document.documentElement.dataset.theme;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // The change still applies to this page.
  }
}

function previewAccent(color: string) {
  clearAccentPreview();
  if (color === "reset") return { reset: true };
  const hex = normalizeHex(color);
  if (!hex) throw new Error("色值格式不对，需要 #RRGGBB");
  const mode = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  const variables = previewVariables({ color: hex, radius: "default", font: "default", mode }, currentReference()) as Record<string, string>;
  for (const [key, value] of Object.entries(variables)) document.documentElement.style.setProperty(key, value);
  previewKeys = Object.keys(variables);
  return { color: hex, mode, hint: "刷新页面即可恢复，或让我恢复默认。主题定制页可以生成 CSS：/docs/theme" };
}

const HIDDEN = /^\/(templates|prototype|blocks\/[^/]+\/preview)/;

export function SiteAgent() {
  const pathname = usePathname();
  const router = useRouter();
  if (HIDDEN.test(pathname)) return null;

  const tools = [
    defineTool({
      name: "open_page",
      label: "打开页面",
      description: "在官网里打开一个页面。path 是站内路径，如 /components/button-link、/blocks/orders-table-section、/docs/quick-start。",
      input: z.object({ path: z.string().regex(/^\/[^\s]*$/, "必须是以 / 开头的站内路径") }),
      execute: ({ path }) => {
        router.push(path);
        return { opened: path };
      },
    }),
    defineTool({
      name: "set_color_mode",
      label: "切换深浅色",
      description: "把整站切换成浅色或深色。",
      input: z.object({ mode: z.enum(["light", "dark"]) }),
      execute: ({ mode }) => {
        setColorMode(mode);
        return { mode };
      },
    }),
    defineTool({
      name: "preview_accent_color",
      label: "预览主色",
      description: "用某个颜色作为主色，整站临时预览（刷新后恢复）。color 为 6 位十六进制色值，如 #16A34A；传 reset 恢复默认。",
      input: z.object({ color: z.string().max(10) }),
      needsApproval: true,
      execute: ({ color }) => previewAccent(color),
    }),
    defineTool({
      name: "copy_text",
      label: "复制到剪贴板",
      description: "把一段文字（通常是安装命令或代码）复制到用户的剪贴板。",
      input: z.object({ text: z.string().min(1).max(5000) }),
      needsApproval: true,
      execute: async ({ text }) => {
        await navigator.clipboard.writeText(text);
        return { copied: true };
      },
    }),
  ];

  return (
    <ForgeAgent
      endpoint="/api/agent"
      title="问 Forge"
      greeting="想做什么页面、查哪个组件，都可以问我。"
      suggestions={["做订单列表页用哪些组件？", "StatusBadge 怎么设置颜色？", "把主色换成绿色看看", "怎么让 Claude Code 按 Forge 写页面？"]}
      storageKey="forge-agent:site"
      context={() => ({
        path: window.location.pathname,
        title: document.title,
        heading: document.querySelector("h1")?.textContent?.trim(),
        colorMode: document.documentElement.dataset.theme === "dark" ? "dark" : "light",
      })}
      tools={tools}
      toolLabels={{ search: "检索文档", recommend: "推荐组件", get_component: "查组件", get_block: "查页面组件", get_tokens: "查设计 token", check_code: "检查代码" }}
    />
  );
}
