"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { CardDensity } from "./card-utils";

import { type ReactNode } from "react";
import { CloseCircleLinear } from "../../icons";
import { cn } from "../../lib/utils";
import { accentColors, type AccentColor } from "./accent-utils";

export type ListGroupTab = { value: string; label: string };

export function ListGroup({
  title,
  subtitle,
  color = "blue",
  badge,
  items,
  action,
  tabs,
  activeTab,
  onTabChange,
  closable,
  onClose,
  density = "default",
  className,
}: {
  title: string;
  subtitle?: string;
  color?: AccentColor;
  badge?: ReactNode;
  items: ReactNode;
  action?: ReactNode;
  tabs?: ListGroupTab[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  closable?: boolean;
  onClose?: () => void;
  density?: CardDensity;
  className?: string;
}) {
  const accent = accentColors[color];
  const hasTabs = Boolean(tabs && tabs.length > 0);
  const itemsClass = cn("self-stretch flex flex-col", density === "compact" ? "px-4 py-4 gap-3" : "px-5 py-5 gap-4");

  const card = (
    <div
      className={cn(
        "bg-background rounded-[20px] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-start items-stretch overflow-hidden",
        className
      )}
    >
      <div className={cn("self-stretch inline-flex justify-start items-start", density === "compact" ? "px-4 pt-4 gap-3" : "px-5 pt-5 gap-3")}>
        <div className={cn("flex-1 inline-flex flex-col justify-start items-start", "gap-2")}>
          <div className="inline-flex items-center gap-3">
            <span className="text-fg-black text-sm font-medium leading-5 tracking-fg">
              {title}
            </span>
            {badge}
          </div>
          {subtitle && (
            <span className="text-fg-grey-700 text-xs font-medium leading-4.5 tracking-fg">
              {subtitle}
            </span>
          )}
        </div>
        {closable ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="p-3.5 bg-background rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex items-center gap-2 text-fg-grey-700"
          >
            <CloseCircleLinear size={20} />
          </button>
        ) : (
          action && <div className="shrink-0">{action}</div>
        )}
      </div>

      {hasTabs && (
        <div className="self-stretch px-5 pt-5">
          <TabsPrimitive.List
            activateOnFocus
            className="p-1 bg-background rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex w-full"
          >
            {tabs!.map((tab) => {
              const isActive = tab.value === activeTab;
              return (
                <TabsPrimitive.Tab
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "flex-1 rounded-full text-sm transition-colors",
                    "px-3.5 py-2.5",
                    isActive
                      ? `${accent.bgTint} ${accent.text} font-semibold`
                      : "text-fg-grey-700 font-medium hover:bg-fg-grey-100"
                  )}
                >
                  {tab.label}
                </TabsPrimitive.Tab>
              );
            })}
          </TabsPrimitive.List>
        </div>
      )}

      {hasTabs ? <TabsPrimitive.Panel value={activeTab ?? tabs![0].value} className={itemsClass}>{items}</TabsPrimitive.Panel> : <div className={itemsClass}>{items}</div>}
    </div>
  );
  if (!hasTabs) return card;
  return (
    <TabsPrimitive.Root value={activeTab ?? tabs![0].value} onValueChange={(value) => onTabChange?.(value as string)} render={<div className="contents" />}>
      {card}
    </TabsPrimitive.Root>
  );
}

export type ListGroupProps = Parameters<typeof ListGroup>[0];
