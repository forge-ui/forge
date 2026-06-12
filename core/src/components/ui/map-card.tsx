/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { cn } from "../../lib/utils";
import { MenuDotsBold, MagniferLinear } from "solar-icon-set";
import { type AccentColor } from "./accent-utils";
import { resolveCardWidthClass, type CardWidth } from "./card-utils";
import { MAP_PATHS, MAP_VIEWBOX } from "./map-data";

// ============================================================
// MapCard — Figma "Map" (node 6498:224709)
// World map with highlighted continents + region sales list.
// 3 variants × 3 colors = 9 combinations.
//   "sm"   — compact card, small map, 5 regions
//   "md"   — medium card, taller map, 4 regions
//   "lg"   — full-width map background with floating search panel
// ============================================================

export type MapVariant = "sm" | "md" | "lg";
export type MapContinent =
  | "north-america"
  | "south-america"
  | "europe"
  | "africa"
  | "asia"
  | "oceania";

export interface MapRegion {
  name: string;
  /** Square flag image URL (44×44) */
  flag: string;
  /** e.g. "340 Sales" */
  salesLabel: string;
  /** e.g. "$17,678" */
  value: string;
}

// Accent hex values for SVG fill (can't use Tailwind classes in SVG)
const accentHex: Record<AccentColor, string> = {
  purple: "var(--fg-violet)",
  blue: "var(--fg-blue)",
  black: "var(--fg-black)",
};

// Continent index → MapContinent ID
const CONTINENT_IDS: MapContinent[] = [
  "north-america",
  "south-america",
  "europe",
  "africa",
  "asia",
  "oceania",
];

function WorldMapSvg({
  highlights = [],
  color,
  className,
}: {
  highlights?: MapContinent[];
  color: AccentColor;
  className?: string;
}) {
  const accentFill = accentHex[color];
  const neutral = "var(--fg-grey-300)";
  const highlightSet = new Set(highlights.map((h) => CONTINENT_IDS.indexOf(h)));

  return (
    <svg
      viewBox={MAP_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      className={className}
    >
      {MAP_PATHS.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={highlightSet.has(p.c) ? accentFill : neutral}
          stroke="var(--fg-grey-50)"
          strokeWidth={0.25}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

function RegionRow({ region }: { region: MapRegion }) {
  return (
    <div className="self-stretch inline-flex justify-start items-center gap-2">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <img
          src={region.flag}
          alt=""
          className="w-11 h-11 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg truncate">
            {region.name}
          </span>
          <span className="text-fg-grey-700 text-xs font-normal leading-4 tracking-fg">
            {region.salesLabel}
          </span>
        </div>
      </div>
      <span className="text-fg-black text-sm font-semibold leading-5 tracking-fg shrink-0">
        {region.value}
      </span>
    </div>
  );
}

function CardHeader({
  title,
  subtitle,
  onMenuClick,
}: {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}) {
  return (
    <div className="px-6 pt-6 inline-flex justify-start items-start gap-3">
      <div className="flex-1 flex flex-col gap-2">
        <span className="text-fg-black text-xl font-semibold leading-8 tracking-fg">
          {title}
        </span>
        {subtitle && (
          <span className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
            {subtitle}
          </span>
        )}
      </div>
      {onMenuClick && (
        <button
          onClick={onMenuClick}
          className="p-3.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex items-center justify-center cursor-pointer hover:bg-fg-grey-100 text-fg-grey-700"
        >
          <MenuDotsBold size={20} className="rotate-90" />
        </button>
      )}
    </div>
  );
}

export function MapCard({
  title = "Top Region",
  subtitle = "Sales by region",
  color = "purple",
  variant = "sm",
  regions = [],
  highlights = ["north-america", "oceania"],
  onMenuClick,
  width,
  className,
}: {
  title?: string;
  subtitle?: string;
  color?: AccentColor;
  variant?: MapVariant;
  regions?: MapRegion[];
  highlights?: MapContinent[];
  onMenuClick?: () => void;
  /** Use full to fill dashboard/grid columns. Use fixed only for Figma-size showcases. */
  width?: CardWidth;
  className?: string;
}) {
  const [search, setSearch] = useState("");

  const filteredRegions = search
    ? regions.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase()),
      )
    : regions;

  // Large — full-width map + floating search panel
  if (variant === "lg") {
    return (
      <div
        className={cn(
          "bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex-col overflow-hidden",
          resolveCardWidthClass("full", "w-full"),
          className,
        )}
      >
        <CardHeader title={title} subtitle={subtitle} onMenuClick={onMenuClick} />

        <div className="relative pt-6">
          <div className="bg-fg-grey-50 overflow-hidden">
            <WorldMapSvg highlights={highlights} color={color} className="w-full h-[420px]" />
          </div>

          {/* Floating search panel */}
          <div className="absolute right-6 top-10 w-96 max-w-[calc(100%-3rem)] bg-white rounded-2xl shadow-[0px_4px_30px_0px_rgba(77,84,100,0.05)] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col">
            <div className="px-6 pt-6 flex flex-col gap-2">
              <div className="self-stretch px-4 py-3 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex items-center gap-1 overflow-hidden text-fg-grey-700">
                <MagniferLinear size={20} className="shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search. . ."
                  className="flex-1 text-sm font-normal leading-5 tracking-fg text-fg-black placeholder:text-fg-grey-700 outline-none bg-transparent"
                />
              </div>
            </div>
            <div className="p-6 flex flex-col gap-5 overflow-hidden">
              {filteredRegions.map((r) => (
                <RegionRow key={r.name} region={r} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Small / Medium — card with map on top, region list below
  const widthClass = resolveCardWidthClass(width, variant === "sm" ? "w-96" : "w-[480px]");
  const mapHeight = variant === "sm" ? "h-44" : "h-56";

  return (
    <div
      className={cn(
        "bg-white rounded-card outline outline-1 outline-offset-[-1px] outline-fg-grey-200 flex-col overflow-hidden",
        widthClass,
        className,
      )}
    >
      <CardHeader title={title} subtitle={subtitle} onMenuClick={onMenuClick} />

      <div className="pt-6">
        <div className="bg-fg-grey-50 overflow-hidden">
          <WorldMapSvg highlights={highlights} color={color} className={cn("w-full", mapHeight)} />
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-5 overflow-hidden">
        {regions.map((r) => (
          <RegionRow key={r.name} region={r} />
        ))}
      </div>
    </div>
  );
}
