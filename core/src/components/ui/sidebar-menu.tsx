"use client";

/* eslint-disable @next/next/no-img-element */

import { type ReactNode, useState } from "react";
import { HamburgerMenuLinear } from "solar-icon-set";
import { cn } from "../../lib/utils";
import { MenuItem } from "./menu-item";
import { ProfileCard } from "./profile-card";
import { accentColors, type AccentColor } from "./accent-utils";

export type SidebarMenuAccent = AccentColor;
export type SidebarMenuMode = "full" | "minimized";
export type SidebarMenuBgMode = "white" | "colored";

export type SidebarMenuItem = {
  icon?: ReactNode;
  label: string;
  href?: string;
  active?: boolean;
  expanded?: boolean;
  badge?: number;
  children?: SidebarMenuItem[];
};

function SidebarRow({
  item,
  accent,
  surface,
  isChild = false,
}: {
  item: SidebarMenuItem;
  accent: SidebarMenuAccent;
  surface: "default" | "onColoredBg";
  isChild?: boolean;
}) {
  const [expanded, setExpanded] = useState(item.expanded ?? false);
  const hasChildren = item.children && item.children.length > 0;
  const kind = isChild ? "submenu" : hasChildren ? "dropdown" : "single";

  return (
    <div className="flex flex-col gap-1">
      <MenuItem
        lead={item.icon ? { kind: "icon", icon: item.icon } : undefined}
        label={item.label}
        active={item.active}
        accent={accent}
        surface={surface}
        kind={kind}
        badge={item.badge}
        onClick={() => {
          if (hasChildren) setExpanded((v) => !v);
        }}
      />
      {hasChildren && expanded && (
        <div className="flex flex-col gap-1">
          {item.children!.map((child, i) => (
            <SidebarRow
              key={i}
              item={child}
              accent={accent}
              surface={surface}
              isChild
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarMenu({
  logo,
  logoText = "Forge",
  teamName,
  teamAvatar,
  teamMemberCount,
  mainMenuItems,
  favoriteItems,
  profile,
  accent = "purple",
  mode = "full",
  bgMode = "white",
  onMenuCollapse,
  className,
}: {
  logo?: ReactNode;
  logoText?: string;
  teamName?: string;
  teamAvatar?: string;
  teamMemberCount?: number;
  mainMenuItems: SidebarMenuItem[];
  favoriteItems?: SidebarMenuItem[];
  profile?: { avatar: string; name: string; role: string };
  accent?: SidebarMenuAccent;
  mode?: SidebarMenuMode;
  bgMode?: SidebarMenuBgMode;
  onMenuCollapse?: () => void;
  className?: string;
}) {
  const accentTheme = accentColors[accent];
  const surface: "default" | "onColoredBg" =
    bgMode === "colored" ? "onColoredBg" : "default";

  const shellBg = bgMode === "colored" ? accentTheme.bg : "bg-white";
  const titleColor = bgMode === "colored" ? "text-white" : "text-fg-black";
  const iconColor =
    bgMode === "colored"
      ? "text-white/75 hover:text-white"
      : "text-fg-grey-700 hover:text-fg-black";
  const dividerColor =
    bgMode === "colored" ? "border-white/10" : "border-fg-grey-200";
  const sectionLabelColor =
    bgMode === "colored" ? "text-white/75" : "text-fg-grey-700";

  if (mode === "minimized") {
    const flattenForRail = (items: SidebarMenuItem[]): SidebarMenuItem[] =>
      items.flatMap((item) => {
        const self = { ...item, children: undefined };
        const children = item.children?.filter((c) => c.icon) ?? [];
        return [self, ...children];
      });
    const railMain = flattenForRail(mainMenuItems);
    const railFav = favoriteItems ? flattenForRail(favoriteItems) : [];

    return (
      <div
        className={cn(
          "w-20 self-stretch shadow-[0px_4px_30px_0px_rgba(102,112,133,0.03)] flex flex-col items-center gap-4 py-6",
          shellBg,
          className
        )}
      >
        <button
          type="button"
          onClick={onMenuCollapse}
          aria-label="Expand"
          className={cn("p-3 rounded-full", iconColor)}
        >
          <HamburgerMenuLinear size={20} />
        </button>

        <div className="flex-1 flex flex-col items-center gap-2">
          {railMain.map((item, i) => (
            <MenuItem
              key={`m-${i}`}
              lead={item.icon ? { kind: "icon", icon: item.icon } : undefined}
              active={item.active}
              accent={accent}
              surface={surface}
              kind="single"
              badge={item.badge}
            />
          ))}

          {railFav.length > 0 && (
            <div
              aria-hidden
              className={cn(
                "w-8 h-px my-2",
                bgMode === "colored" ? "bg-white/20" : "bg-fg-grey-200"
              )}
            />
          )}

          {railFav.map((item, i) => (
            <MenuItem
              key={`f-${i}`}
              lead={item.icon ? { kind: "icon", icon: item.icon } : undefined}
              active={item.active}
              accent={accent}
              surface={surface}
              kind="single"
              badge={item.badge}
            />
          ))}
        </div>

        {profile && (
          <img
            src={profile.avatar}
            alt={profile.name}
            className={cn(
              "w-10 h-10 rounded-full object-cover",
              bgMode === "colored" && "outline outline-2 outline-white/20"
            )}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-64 self-stretch shadow-[0px_4px_30px_0px_rgba(102,112,133,0.03)] flex flex-col",
        shellBg,
        className
      )}
    >
      <div className="h-20 p-6 flex items-center gap-2.5">
        <div className="flex-1 flex items-center gap-2">
          {logo ?? (
            <div className="w-8 h-8 relative overflow-hidden">
              <div
                className={cn(
                  "w-7 h-5 absolute left-[2px] top-[2px] rounded-sm",
                  bgMode === "colored" ? "bg-white" : accentTheme.bg
                )}
              />
              <div
                className={cn(
                  "w-1.5 h-1 absolute left-[5px] top-[5px] rounded-sm",
                  bgMode === "colored" ? "bg-white/60" : "bg-purple-300"
                )}
              />
            </div>
          )}
          <span className={cn("text-2xl font-semibold leading-8 tracking-fg", titleColor)}>
            {logoText}
          </span>
        </div>
        <button
          type="button"
          onClick={onMenuCollapse}
          aria-label="Collapse"
          className={cn("w-5 h-5 transition-colors", iconColor)}
        >
          <HamburgerMenuLinear size={20} />
        </button>
      </div>

      {teamName && (
        <div className="px-4 py-3">
          <ProfileCard
            avatar={teamAvatar ?? ""}
            name={teamName}
            subtitle={
              teamMemberCount !== undefined
                ? `${teamMemberCount} Members`
                : undefined
            }
            accent={accent}
            surface={surface}
          />
        </div>
      )}

      <div className="flex-1 p-4 flex flex-col gap-6 overflow-hidden overflow-y-auto">
        <div className="flex flex-col gap-3">
          <div className="px-3 flex items-start gap-2">
            <span
              className={cn(
                "flex-1 text-xs font-bold leading-4 tracking-fg uppercase",
                sectionLabelColor
              )}
            >
              Main Menu
            </span>
          </div>
          {mainMenuItems.map((item, i) => (
            <SidebarRow key={i} item={item} accent={accent} surface={surface} />
          ))}
        </div>

        {favoriteItems && favoriteItems.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="px-3 flex items-start gap-2">
              <span
                className={cn(
                  "flex-1 text-xs font-bold leading-4 tracking-fg uppercase",
                  sectionLabelColor
                )}
              >
                Favorite
              </span>
            </div>
            {favoriteItems.map((item, i) => (
              <SidebarRow key={i} item={item} accent={accent} surface={surface} />
            ))}
          </div>
        )}
      </div>

      {profile && (
        <div className={cn("p-4 border-t", dividerColor)}>
          <ProfileCard
            avatar={profile.avatar}
            name={profile.name}
            subtitle={profile.role}
            accent={accent}
            surface={surface}
          />
        </div>
      )}
    </div>
  );
}
