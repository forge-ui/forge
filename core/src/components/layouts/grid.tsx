import type { ComponentPropsWithRef, CSSProperties } from "react";
import { cn } from "../../lib/utils";

export type GridBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type GridResponsive<T> = T | Partial<Record<GridBreakpoint, T>>;
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;
export type GridGap = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 48;
export type GridSpan = GridColumns | "full";

export interface GridProps extends ComponentPropsWithRef<"div"> {
  columns?: GridResponsive<GridColumns>;
  /** Pixel presets, not Tailwind spacing units. */
  gap?: GridResponsive<GridGap>;
  rowGap?: GridResponsive<GridGap>;
  columnGap?: GridResponsive<GridGap>;
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
}

export interface GridItemProps extends ComponentPropsWithRef<"div"> {
  span?: GridResponsive<GridSpan>;
  /** One-based column start. `auto` resets a previous breakpoint's start. */
  start?: GridResponsive<GridColumns | "auto">;
}

const breakpoints: GridBreakpoint[] = ["base", "sm", "md", "lg", "xl", "2xl"];
type Variables = CSSProperties & Record<`--forge-grid-${string}`, string | number>;

function resolve<T>(value: GridResponsive<T> | undefined, fallback: T): T[] {
  let current = fallback;
  return breakpoints.map((breakpoint) => {
    if (value !== undefined) {
      current = typeof value === "object" && value !== null
        ? (value as Partial<Record<GridBreakpoint, T>>)[breakpoint] ?? current
        : value as T;
    }
    return current;
  });
}

/** Responsive CSS Grid. Owns tracks and gaps, never page padding or width limits. */
export function Grid({
  columns = 12, gap = 16, rowGap, columnGap, alignItems = "stretch",
  className, style, ...props
}: GridProps) {
  const variables: Variables = {};
  const tracks = resolve(columns, 12);
  const gaps = resolve(gap, 16);
  const rows = resolve(rowGap, undefined);
  const cols = resolve(columnGap, undefined);
  breakpoints.forEach((breakpoint, index) => {
    variables[`--forge-grid-columns-${breakpoint}`] = tracks[index];
    variables[`--forge-grid-row-gap-${breakpoint}`] = `${rows[index] ?? gaps[index]}px`;
    variables[`--forge-grid-column-gap-${breakpoint}`] = `${cols[index] ?? gaps[index]}px`;
  });
  return <div {...props} className={cn("forge-grid", className)} style={{ ...variables, alignItems, ...style }} />;
}

/** Layout placement belongs here; child cards remain independent of the grid. */
export function GridItem({ span = "full", start = "auto", className, style, ...props }: GridItemProps) {
  const variables: Variables = {};
  const spans = resolve(span, "full");
  const starts = resolve(start, "auto");
  breakpoints.forEach((breakpoint, index) => {
    const full = spans[index] === "full";
    variables[`--forge-grid-start-${breakpoint}`] = full ? 1 : starts[index];
    variables[`--forge-grid-end-${breakpoint}`] = full ? -1 : `span ${spans[index]}`;
  });
  return <div {...props} className={cn("forge-grid-item", className)} style={{ ...variables, ...style }} />;
}
