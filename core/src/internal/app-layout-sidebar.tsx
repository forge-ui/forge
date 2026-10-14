"use client";

import type { MotionPreference } from "../lib/motion";
import { MotionCollapse, useReducedMotion } from "./motion";
import { motion as animated } from "motion/react";

import { type CSSProperties, useState } from "react";
import NextLink from "next/link";
import { AltArrowDownLinear } from "../icons";
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
  motion = "auto",
  indicatorId,
  index = 0,
}: {
  item: AppLayoutMenuItem;
  config: (typeof modeConfig)[AppLayoutMode];
  accentActive: string;
  accentBar: string;
  pathname: string;
  activeItem?: AppLayoutMenuItem | null;
  depth?: number;
  collapsed?: boolean;
  motion?: MotionPreference;
  indicatorId?: string;
  index?: number;
}) {
  const reduced = useReducedMotion(motion);
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

  const rail = collapsed && depth === 0;
  const highlighted = rail ? isBranchActive : !collapsed && isActive;
  const link = hasChildren ? findFirstChildNavigableHref(item) ?? item.href : item.href;
  const disclosure = hasChildren && !rail;
  const toggleExpanded = () => setManualExpansion({ pathname, expanded: !expanded });
  const rowClassName = cn(
    "forge-sidebar-row relative isolate self-stretch inline-flex items-center gap-2 rounded-full px-3.5 py-3 transition-colors",
    depth > 0 && "pl-[46px]",
    highlighted ? config.menuItemActiveText : config.menuItem
  );
  const rowProps = {
    className: rowClassName,
    "data-collapsed": rail,
    "data-motion": motion,
    "data-branch": hasChildren,
    "data-badge": item.badge !== undefined && item.badge > 0,
    title: rail ? item.label : undefined,
    "aria-label": rail ? `${item.label}${item.badge ? `，${item.badge}` : ""}` : undefined,
    style: { "--forge-sidebar-label-delay": `${120 + Math.min(index, 8) * 35}ms` } as CSSProperties,
  };

  const rowContent = (
    <>
      {highlighted && (
        <animated.span
          aria-hidden="true"
          data-forge-sidebar-highlight
          layout="position"
          layoutId={reduced ? undefined : indicatorId}
          initial={false}
          transition={reduced ? { duration: 0 } : { type: "tween", duration: 0.5, ease: [0.34, 1.16, 0.64, 1] }}
          // The sidebar width already transitions in CSS. Keep its live radius
          // out of Motion's scale correction, which uses a stale width snapshot.
          className={cn("pointer-events-none absolute inset-0 -z-10 rounded-[inherit]", accentActive)}
        />
      )}
      {isActive && depth === 0 && !rail && (
        <div className={cn("w-1 h-12 absolute left-[-16px] top-0 rounded-tr-lg rounded-br-lg", accentBar)} />
      )}
      {item.icon && <span className="w-6 h-6 flex justify-center items-center shrink-0">{item.icon}</span>}
      <span aria-hidden={rail || undefined} className="forge-sidebar-label forge-sidebar-item-label min-w-0 flex-1 whitespace-nowrap text-sm font-semibold leading-5 tracking-fg line-clamp-1 text-left">{item.label}</span>
      {item.badge !== undefined && item.badge > 0 && (
        <span className={cn("forge-sidebar-badge px-1.5 py-0.5 rounded-full inline-flex flex-col justify-center items-center gap-2", config.badgeBg)}>
          <span className="text-white text-2xs font-semibold leading-3.5 tracking-fg">{item.badge}</span>
        </span>
      )}
      {hasChildren && (
        <span aria-hidden={rail || undefined} className="forge-sidebar-label w-6 h-6 flex justify-center items-center shrink-0">
          <span className="forge-chevron inline-flex" data-motion={motion} data-expanded={expanded}>
            <AltArrowDownLinear size={16} />
          </span>
        </span>
      )}
    </>
  );

  // Keep the same row and contents while its interaction changes from disclosure
  // to navigation; replacing button with link interrupts every CSS transition.
  const row = link ? (
    <NextLink
      href={link}
      prefetch
      role={disclosure ? "button" : undefined}
      aria-expanded={disclosure ? expanded : undefined}
      onClick={disclosure ? (event) => { event.preventDefault(); toggleExpanded(); } : undefined}
      onKeyDown={disclosure ? (event) => {
        if (event.key === " ") { event.preventDefault(); if (!event.repeat) toggleExpanded(); }
      } : undefined}
      aria-current={isActive ? "page" : undefined}
      {...rowProps}
    >
      {rowContent}
    </NextLink>
  ) : hasChildren ? (
    <button
      type="button"
      aria-expanded={rail ? undefined : expanded}
      disabled={rail}
      onClick={toggleExpanded}
      {...rowProps}
    >
      {rowContent}
    </button>
  ) : (
    <span {...rowProps} className={cn(rowClassName, "cursor-default opacity-70")} aria-disabled="true">
      {rowContent}
    </span>
  );

  const children = hasChildren && (
    <MotionCollapse open={expanded && !collapsed} motion={motion}><div className="flex flex-col">
      {childItems.map((child, i) => (
        <SidebarMenuItemRow motion={motion} indicatorId={indicatorId} index={i} key={child.href ?? `${child.label}-${i}`} item={child} config={config} accentActive={accentActive} accentBar={accentBar} pathname={pathname} activeItem={resolvedActiveItem} depth={depth + 1} collapsed={collapsed} />
      ))}
    </div></MotionCollapse>
  );

  return <div className="flex flex-col">{row}{children}</div>;
}
