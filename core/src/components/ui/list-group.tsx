"use client";

import { type ReactNode } from "react";
import { CloseCircleLinear } from "solar-icon-set";
import { cn } from "../../lib/utils";
import { accentColors, type AccentColor } from "./accent-utils";

export type ListGroupTab = { value: string; label: string };

export function ListGroup({
  title,
  subtitle,
  color = "purple",
  badge,
  items,
  action,
  tabs,
  activeTab,
  onTabChange,
  closable,
  onClose,
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
  className?: string;
}) {
  const accent = accentColors[color];

  return (
    <div
      className={cn(
        "bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex flex-col justify-start items-stretch overflow-hidden",
        className
      )}
    >
      <div className="self-stretch px-6 pt-6 inline-flex justify-start items-start gap-3">
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-2">
          <div className="inline-flex items-center gap-3">
            <span className="text-fg-black text-xl font-semibold leading-8 tracking-fg">
              {title}
            </span>
            {badge}
          </div>
          {subtitle && (
            <span className="text-fg-grey-700 text-sm font-medium leading-5 tracking-fg">
              {subtitle}
            </span>
          )}
        </div>
        {closable ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-3.5 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex items-center gap-2 text-fg-grey-700"
          >
            <CloseCircleLinear size={20} />
          </button>
        ) : (
          action && <div className="shrink-0">{action}</div>
        )}
      </div>

      {tabs && tabs.length > 0 && (
        <div className="self-stretch px-6 pt-6">
          <div
            role="tablist"
            className="p-1 bg-white rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 inline-flex w-full"
          >
            {tabs.map((tab) => {
              const isActive = tab.value === activeTab;
              return (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onTabChange?.(tab.value)}
                  className={cn(
                    "flex-1 px-3.5 py-2.5 rounded-full text-sm transition-colors",
                    isActive
                      ? `${accent.bgTint} ${accent.text} font-bold`
                      : "text-fg-grey-700 font-semibold hover:bg-fg-grey-100"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="self-stretch px-6 py-6 flex flex-col gap-5">{items}</div>
    </div>
  );
}
