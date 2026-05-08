import { type ReactNode } from "react";
import {
  TagLinear,
  ClockCircleLinear,
  CheckCircleLinear,
} from "solar-icon-set";
import { cn } from "../../lib/utils";
import { accentColors, type AccentColor } from "./accent-utils";

export type NotificationItemColor = AccentColor;

export function NotificationItem({
  tag,
  time,
  title,
  body,
  unread = false,
  color = "purple",
  onMarkRead,
  actionLabel = "Mark as Read",
  className,
  leadIcon,
}: {
  tag?: string;
  time?: string;
  title: string;
  body?: string;
  unread?: boolean;
  color?: NotificationItemColor;
  onMarkRead?: () => void;
  actionLabel?: string;
  className?: string;
  leadIcon?: ReactNode;
}) {
  const accent = accentColors[color];

  return (
    <div
      className={cn(
        "self-stretch px-5 py-4 flex flex-col items-end gap-2",
        unread && "bg-yellow-50",
        className
      )}
    >
      <div className="self-stretch flex flex-col gap-2">
        {(tag || time) && (
          <div className="inline-flex items-start gap-2">
            {tag && (
              <span className="flex items-center gap-1 text-fg-grey-700 text-xs font-medium leading-4 tracking-fg">
                <TagLinear size={16} />
                {tag}
              </span>
            )}
            {time && (
              <span className="flex items-center gap-1 text-fg-grey-700 text-xs font-medium leading-4 tracking-fg">
                <ClockCircleLinear size={16} />
                {time}
              </span>
            )}
          </div>
        )}
        <div className="self-stretch flex items-start gap-2">
          {leadIcon && <span className="shrink-0 mt-0.5">{leadIcon}</span>}
          <span className="self-stretch text-fg-black text-base font-semibold leading-6 tracking-fg">
            {title}
          </span>
        </div>
        {body && (
          <p className="self-stretch text-fg-grey-800 text-sm font-normal leading-5 tracking-fg">
            {body}
          </p>
        )}
      </div>
      {onMarkRead && (
        <button
          type="button"
          onClick={onMarkRead}
          className={cn(
            "inline-flex items-center gap-1 text-sm font-bold leading-5 tracking-fg",
            accent.text
          )}
        >
          <CheckCircleLinear size={20} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
