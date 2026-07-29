"use client";

import { useState } from "react";
import NextLink from "next/link";
import { AltArrowDownLinear } from "solar-icon-set";
import type { AppLayoutMenuItem, AppLayoutMode } from "../components/layouts/app-layout";
import { cn } from "../lib/utils";

export const accentTokens = {
  purple: {
    activeBg: "bg-fg-violet",
    activeBgLight: "bg-fg-violet",
    activeBgDark: "bg-white/20",
    accentBar: "bg-fg-violet",
    accentBarDark: "bg-white",
    addButton: "bg-fg-violet",
    onAccentMuted: "text-fg-violet-100",
  },
  blue: {
    activeBg: "bg-fg-blue",
    activeBgLight: "bg-fg-blue",
    activeBgDark: "bg-white/20",
    accentBar: "bg-fg-blue",
    accentBarDark: "bg-white",
    addButton: "bg-fg-blue",
    onAccentMuted: "text-fg-blue-100",
  },
  black: {
    activeBg: "bg-fg-black",
    activeBgLight: "bg-fg-black",
    activeBgDark: "bg-white/20",
    accentBar: "bg-fg-black",
    accentBarDark: "bg-white",
    addButton: "bg-fg-black",
    onAccentMuted: "text-fg-grey-400",
  },
} as const;

export const modeConfig = {
  light: {
    outer: "bg-white",
    sidebar: "bg-white shadow-subtle",
    logoText: "text-fg-black",
    hamburger: "text-fg-grey-700 hover:text-fg-black",
    teamSwitcher: "bg-fg-grey-50 outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
    teamName: "text-fg-black",
    teamCount: "text-fg-grey-700",
    teamChevron: "text-fg-grey-700",
    sectionTitle: "text-fg-grey-700",
    menuItem: "text-fg-grey-700 hover:bg-fg-grey-100",
    menuItemActiveText: "text-white font-bold",
    badgeBg: "bg-fg-red",
    profileBg: "bg-fg-grey-50 outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
    profileName: "text-fg-black",
    profileRole: "text-fg-grey-700",
    profileChevron: "text-fg-grey-900",
    contentArea: "bg-fg-grey-50 rounded-3xl outline outline-1 outline-offset-[-1px] outline-fg-grey-200",
    topbarText: "text-fg-black",
    topbarSubtext: "text-fg-grey-700",
    topbarIcon: "text-fg-grey-700 hover:text-fg-black",
    dividerColor: "bg-fg-grey-200",
    breadcrumbText: "text-fg-grey-700",
    breadcrumbActive: "text-fg-black",
    useAccentBgForActive: true,
  },
  dark: {
    outer: "bg-fg-black",
    sidebar: "bg-fg-black",
    logoText: "text-white",
    hamburger: "text-white/70 hover:text-white",
    teamSwitcher: "bg-white/10",
    teamName: "text-white",
    teamCount: "text-white/70",
    teamChevron: "text-white/70",
    sectionTitle: "text-white/50",
    menuItem: "text-white/70 hover:bg-white/10",
    menuItemActiveText: "text-white font-bold",
    badgeBg: "bg-fg-red",
    profileBg: "bg-white/10",
    profileName: "text-white",
    profileRole: "text-white/70",
    profileChevron: "text-white/70",
    contentArea: "bg-fg-grey-50 rounded-3xl",
    topbarText: "text-fg-black",
    topbarSubtext: "text-fg-grey-700",
    topbarIcon: "text-fg-grey-700 hover:text-fg-black",
    dividerColor: "bg-fg-grey-200",
    breadcrumbText: "text-fg-grey-700",
    breadcrumbActive: "text-fg-black",
    useAccentBgForActive: false,
  },
} as const;

function normalizeRoutePath(value?: string) {
  if (!value) return null;
  const path = value.split(/[?#]/, 1)[0];
  if (!path.startsWith("/")) return null;
  return path.replace(/\/+$/, "") || "/";
}

function hrefMatchesPathname(pathname: string, href?: string) {
  const currentPath = normalizeRoutePath(pathname);
  const targetPath = normalizeRoutePath(href);
  if (!currentPath || !targetPath) return false;
  return currentPath === targetPath || (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`));
}

export function findActiveSidebarMenuItem(
  items: AppLayoutMenuItem[] | undefined,
  pathname: string,
): AppLayoutMenuItem | null {
  let activeItem: AppLayoutMenuItem | null = null;
  let activePathLength = -1;

  function visit(item: AppLayoutMenuItem) {
    const children = item.children ?? [];
    if (children.length === 0 && hrefMatchesPathname(pathname, item.href)) {
      const targetPath = normalizeRoutePath(item.href);
      if (targetPath && targetPath.length > activePathLength) {
        activeItem = item;
        activePathLength = targetPath.length;
      }
    }
    for (const child of children) visit(child);
  }

  for (const item of items ?? []) visit(item);
  return activeItem;
}

function hasActiveDescendant(item: AppLayoutMenuItem, activeItem: AppLayoutMenuItem | null): boolean {
  return !!activeItem && !!item.children?.some((child) => child === activeItem || hasActiveDescendant(child, activeItem));
}

function findFirstNavigableHref(item: AppLayoutMenuItem): string | undefined {
  if (item.href) return item.href;
  for (const child of item.children ?? []) {
    const href = findFirstNavigableHref(child);
    if (href) return href;
  }
  return undefined;
}

function findFirstChildNavigableHref(item: AppLayoutMenuItem): string | undefined {
  for (const child of item.children ?? []) {
    const href = findFirstNavigableHref(child);
    if (href) return href;
  }
  return undefined;
}

export function SidebarMenuItemRow({
  item,
  config,
  accentActive,
  accentBar,
  pathname,
  activeItem,
  depth = 0,
  collapsed = false,
}: {
  item: AppLayoutMenuItem;
  config: (typeof modeConfig)[AppLayoutMode];
  accentActive: string;
  accentBar: string;
  pathname: string;
  activeItem?: AppLayoutMenuItem | null;
  depth?: number;
  collapsed?: boolean;
}) {
  const childItems = item.children ?? [];
  const hasChildren = childItems.length > 0;
  const resolvedActiveItem = activeItem === undefined
    ? findActiveSidebarMenuItem([item], pathname)
    : activeItem;
  const isActive = !hasChildren && item === resolvedActiveItem;
  const isChildActive = hasActiveDescendant(item, resolvedActiveItem);
  const isBranchActive = isActive || isChildActive;
  const [manualExpansion, setManualExpansion] = useState<{
    pathname: string;
    expanded: boolean;
  } | null>(null);
  const expanded = manualExpansion?.pathname === pathname
    ? manualExpansion.expanded
    : isBranchActive;

  if (collapsed && depth === 0) {
    const link = hasChildren ? findFirstChildNavigableHref(item) ?? item.href : item.href;
    const iconOnly = (
      <span className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
        isBranchActive ? cn(accentActive, "text-white") : config.menuItem
      )}>
        {item.icon}
      </span>
    );
    return link ? (
      <NextLink
        href={link}
        prefetch
        aria-current={!hasChildren && isActive ? "page" : undefined}
        className="flex justify-center"
        title={item.label}
      >
        {iconOnly}
      </NextLink>
    ) : (
      <span className="flex justify-center" title={item.label}>
        {iconOnly}
      </span>
    );
  }

  const rowClassName = cn(
    "self-stretch px-3.5 py-3 rounded-full inline-flex items-center gap-2 transition-colors relative",
    depth > 0 && "pl-[46px]",
    isActive ? cn(accentActive, config.menuItemActiveText) : config.menuItem
  );

  const rowContent = (
    <>
      {isActive && depth === 0 && (
        <div className={cn("w-1 h-12 absolute left-[-16px] top-0 rounded-tr-lg rounded-br-lg", accentBar)} />
      )}
      {item.icon && <span className="w-6 h-6 flex justify-center items-center shrink-0">{item.icon}</span>}
      <span className="flex-1 text-sm font-semibold leading-5 tracking-fg line-clamp-1 text-left">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span className={cn("px-1.5 py-0.5 rounded-full inline-flex flex-col justify-center items-center gap-2", config.badgeBg)}>
          <span className="text-white text-2xs font-semibold leading-3.5 tracking-fg">{item.badge}</span>
        </span>
      )}
      {hasChildren && (
        <span className="w-6 h-6 flex justify-center items-center shrink-0">
          <span className={cn("transition-transform inline-flex", expanded && "rotate-180")}>
            <AltArrowDownLinear size={16} />
          </span>
        </span>
      )}
    </>
  );

  const row = item.href && !hasChildren ? (
    <NextLink
      href={item.href}
      prefetch
      aria-current={isActive ? "page" : undefined}
      className={rowClassName}
    >
      {rowContent}
    </NextLink>
  ) : hasChildren ? (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={() => setManualExpansion({ pathname, expanded: !expanded })}
      className={rowClassName}
    >
      {rowContent}
    </button>
  ) : (
    <span className={cn(rowClassName, "cursor-default opacity-70")} aria-disabled="true">
      {rowContent}
    </span>
  );

  const children = hasChildren && expanded && (
    <div className="flex flex-col">
      {childItems.map((child, i) => (
        <SidebarMenuItemRow key={child.href ?? `${child.label}-${i}`} item={child} config={config} accentActive={accentActive} accentBar={accentBar} pathname={pathname} activeItem={resolvedActiveItem} depth={depth + 1} />
      ))}
    </div>
  );

  return <div className="flex flex-col">{row}{children}</div>;
}
