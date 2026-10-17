"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AppLayout, Button, type AppLayoutMenuItem, type AppLayoutMode } from "@forge-ui-official/core";
import { menuSections, previewRoot, routeLabels } from "../sidebar-motion/menu";

type SidebarSettings = {
  locale: "zh" | "en";
  color: "blue" | "purple" | "black";
  motion: "auto" | "none";
};

const embeddedRoot = "/prototype/component-fusion/sidebar";
const frameWidth = 1100;
const frameHeight = 600;
const english: Record<string, string> = {
  工作区: "Workspace", 工作台: "Dashboard", 项目管理: "Projects", 进行中的项目: "Active projects",
  已归档项目: "Archived projects", 协作: "Collaboration", 我的任务: "My tasks", 团队成员: "Team members",
  工作报告: "Reports", 管理: "Administration", 访问管理: "Access management", 角色权限: "Roles and permissions",
  操作记录: "Activity log", 应用设置: "Settings",
};

function settingsQuery(settings: SidebarSettings) {
  return new URLSearchParams({ locale: settings.locale, color: settings.color, motion: settings.motion }).toString();
}

function isSettings(value: unknown): value is SidebarSettings {
  if (!value || typeof value !== "object") return false;
  const settings = value as Partial<SidebarSettings>;
  return (settings.locale === "zh" || settings.locale === "en")
    && (settings.color === "blue" || settings.color === "purple" || settings.color === "black")
    && (settings.motion === "auto" || settings.motion === "none");
}

/** Render the real desktop AppLayout in its own viewport without changing the accepted sidebar route. */
export function SidebarFusionPreview({ locale, color, motion }: SidebarSettings) {
  const frame = useRef<HTMLIFrameElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [source] = useState(() => `${embeddedRoot}?${settingsQuery({ locale, color, motion })}`);
  const syncSettings = useCallback(() => {
    frame.current?.contentWindow?.postMessage({ type: "forge-sidebar-settings", locale, color, motion }, window.location.origin);
  }, [locale, color, motion]);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(Math.min(1, entry.contentRect.width / frameWidth));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    syncSettings();
    const receive = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.source === frame.current?.contentWindow && event.data?.type === "forge-sidebar-ready") syncSettings();
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [syncSettings]);

  return <div className="flex min-w-0 flex-col gap-3">
    <div ref={container} className="relative w-full overflow-hidden rounded-xl border border-fg-grey-200 bg-fg-white" style={{ height: frameHeight * scale }}>
      <iframe
        ref={frame}
        title={locale === "zh" ? "应用布局侧栏交互预览" : "AppLayout sidebar interaction preview"}
        src={source}
        onLoad={syncSettings}
        className="absolute left-0 top-0 origin-top-left border-0"
        style={{ width: frameWidth, height: frameHeight, transform: `scale(${scale})` }}
      />
    </div>
    <div className="flex flex-wrap items-center justify-between gap-3 text-xs leading-5 text-fg-grey-700">
      <p>{locale === "zh" ? "点击 Forge 旁的菜单按钮收起侧栏，再切换菜单和子菜单。窄屏可打开完整预览体验。" : "Collapse the sidebar beside Forge, then try menus and submenus. Open the full preview on a narrow screen."}</p>
      <a href={`${embeddedRoot}?${settingsQuery({ locale, color, motion })}`} target="_blank" rel="noopener noreferrer" className={`text-sm font-semibold hover:underline ${color === "blue" ? "text-fg-blue" : color === "purple" ? "text-fg-violet" : "text-fg-black"}`}>
        {locale === "zh" ? "打开完整预览" : "Open full preview"}
      </a>
    </div>
  </div>;
}

/** Dedicated iframe page; menus and sidebar interaction reuse the accepted AppLayout implementation. */
export function EmbeddedSidebarPreview() {
  const params = useSearchParams();
  const [settings, setSettings] = useState<SidebarSettings>(() => ({
    locale: params.get("locale") === "en" ? "en" : "zh",
    color: params.get("color") === "purple" ? "purple" : params.get("color") === "black" ? "black" : "blue",
    motion: params.get("motion") === "none" ? "none" : "auto",
  }));
  const [mode, setMode] = useState<AppLayoutMode>("light");
  const pathname = usePathname();
  const zh = settings.locale === "zh";
  const translate = (label: string) => zh ? label : english[label] ?? label;
  const query = settingsQuery(settings);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent || event.data?.type !== "forge-sidebar-settings" || !isSettings(event.data)) return;
      const next = { locale: event.data.locale, color: event.data.color, motion: event.data.motion };
      setSettings(next);
      const url = new URL(window.location.href);
      url.search = settingsQuery(next);
      window.history.replaceState(window.history.state, "", url);
    };
    window.addEventListener("message", receive);
    if (window.parent !== window) window.parent.postMessage({ type: "forge-sidebar-ready" }, window.location.origin);
    return () => window.removeEventListener("message", receive);
  }, []);

  const adaptItem = (item: AppLayoutMenuItem): AppLayoutMenuItem => {
    const children = item.children?.map(adaptItem);
    if (item.href) return { ...item, label: translate(item.label), href: `${item.href.replace(previewRoot, embeddedRoot)}?${query}`, children };
    return { ...item, label: translate(item.label), children: children ?? [] };
  };
  const sections = menuSections.map(section => ({ label: translate(section.label ?? ""), items: section.items.map(adaptItem) }));
  const section = pathname.slice(embeddedRoot.length).replace(/^\/+|\/+$/g, "");
  const title = translate(routeLabels[section] ?? "工作台");

  return <div lang={settings.locale === "zh" ? "zh-CN" : "en"}>
    <AppLayout
      language={zh ? "zh-CN" : "en-US"}
      menuSections={sections}
      mode={mode}
      accent={settings.color}
      motion={settings.motion}
      logoText="Forge"
      appName={zh ? "应用布局预览" : "AppLayout preview"}
      appSubtitle={zh ? "本地体验" : "Local preview"}
      profilePosition="sidebar"
      profile={{ name: zh ? "林晓" : "Lin Xiao", role: zh ? "设计师" : "Designer", avatar: "/images/protask/crm/john-hoegan-avatar.png" }}
      hideSidebarWidgets
      pageTitle={title}
      showDatePicker={false}
      showKebab={false}
      showFavorite={false}
    >
      <section className="flex flex-col gap-5 rounded-2xl border border-fg-grey-200 bg-fg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-fg-grey-700">{zh ? "当前页面" : "Current page"}</p>
            <h1 className="text-2xl font-semibold leading-8 tracking-fg text-fg-black">{title}</h1>
          </div>
          <Button size="sm" color={settings.color} variant="secondary" onClick={() => setMode(value => value === "light" ? "dark" : "light")}>
            {mode === "light" ? (zh ? "切换深色侧栏" : "Dark sidebar") : (zh ? "切换浅色侧栏" : "Light sidebar")}
          </Button>
        </div>
        <p className="text-sm leading-6 text-fg-grey-700">{zh ? "反复收起、展开侧栏，观察图标、菜单名称和选中背景的衔接。进入子菜单时，对应分组会自动展开。" : "Collapse and expand the sidebar to see icons, labels and the active background move together. Choosing a submenu opens its parent group."}</p>
        <div className="grid grid-cols-3 divide-x divide-fg-grey-200 border-y border-fg-grey-200 py-5">
          {[{ value: "08", label: zh ? "进行中的项目" : "Active projects" }, { value: "12", label: zh ? "我的任务" : "My tasks" }, { value: "03", label: zh ? "待处理提醒" : "Pending updates" }].map(item => <div key={item.label} className="flex flex-col gap-2 px-5 first:pl-0">
            <span className="text-2xl font-semibold leading-8 text-fg-black">{item.value}</span>
            <span className="text-sm text-fg-grey-700">{item.label}</span>
          </div>)}
        </div>
        <p className="text-xs leading-5 text-fg-grey-600">{zh ? "示例菜单仅在此预览内跳转，使用现有 AppLayout。" : "Example menus stay inside this preview and use the existing AppLayout."}</p>
      </section>
    </AppLayout>
  </div>;
}
