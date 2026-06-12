/* eslint-disable @next/next/no-img-element */
import { type ReactNode } from "react";
import { AltArrowUpBold, AltArrowDownBold } from "solar-icon-set";
import { cn } from "../../lib/utils";
import {
  CircleIcon,
  type CircleIconColor,
  type CircleIconSize,
  type CircleIconVariant,
} from "./badge";
import { Avatar, type AvatarSize } from "./avatar";

export type ListItemIconLead = {
  kind: "icon";
  icon: ReactNode;
  color?: CircleIconColor;
  variant?: CircleIconVariant;
  size?: CircleIconSize;
};

export type ListItemAvatarLead = {
  kind: "avatar";
  src?: string;
  initials?: string;
  alt?: string;
  online?: boolean;
  size?: AvatarSize;
};

// Square image lead — Figma "Square Img" 类型，w-11 h-11 rounded-lg
export type ListItemImageLead = {
  kind: "image";
  src: string;
  alt?: string;
};

export type ListItemLead =
  | ListItemIconLead
  | ListItemAvatarLead
  | ListItemImageLead;

export function ListItem({
  lead,
  title,
  subtitle,
  value,
  trend,
  trendDirection = "up",
  tailSubtext,
  trailing,
  className,
}: {
  lead?: ListItemLead;
  title: string;
  subtitle?: string;
  value?: string;
  trend?: string;
  trendDirection?: "up" | "down";
  tailSubtext?: string;
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2 w-full", className)}>
      {lead && <ListItemLeadSlot lead={lead} />}

      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-sm font-semibold text-fg-black leading-5 tracking-fg line-clamp-1">
          {title}
        </span>
        {subtitle && (
          <span className="text-xs text-fg-grey-700 leading-4 tracking-fg line-clamp-1">
            {subtitle}
          </span>
        )}
      </div>

      {trailing ? (
        <div className="shrink-0">{trailing}</div>
      ) : (
        (value || trend || tailSubtext) && (
          <div className="flex flex-col items-end shrink-0 gap-1">
            {value && (
              <span className="text-sm font-semibold text-fg-black leading-5 tracking-fg">
                {value}
              </span>
            )}
            {trend && <TrendTag value={trend} direction={trendDirection} />}
            {tailSubtext && !trend && (
              <span className="text-xs text-fg-grey-700 leading-4 tracking-fg">
                {tailSubtext}
              </span>
            )}
          </div>
        )
      )}
    </div>
  );
}

// ============================================================
// DescriptionItem — Figma "1 Column" 布局：字段标签 + 主内容 + 可选 actions
// 结构：[lead] label(灰) \n content(主色 或 Label badge) [actions]
// ============================================================

export type DescriptionItemLead = ListItemIconLead | ListItemImageLead;

export function DescriptionItem({
  lead,
  label,
  content,
  actions,
  className,
}: {
  lead?: DescriptionItemLead;
  label: string;
  content: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-start gap-2 w-full", className)}>
      {lead && <ListItemLeadSlot lead={lead} />}
      <div className="flex-1 min-w-0 inline-flex flex-col justify-center items-start gap-1">
        <span className="text-fg-grey-700 text-sm font-semibold leading-5 tracking-fg">
          {label}
        </span>
        {typeof content === "string" ? (
          <span className="text-fg-black text-sm font-medium leading-5 tracking-fg">
            {content}
          </span>
        ) : (
          content
        )}
      </div>
      {actions && (
        <div className="shrink-0 flex items-center gap-2 text-fg-grey-700">
          {actions}
        </div>
      )}
    </div>
  );
}

function ListItemLeadSlot({ lead }: { lead: ListItemLead }) {
  if (lead.kind === "avatar") {
    return (
      <Avatar
        src={lead.src}
        initials={lead.initials}
        alt={lead.alt}
        online={lead.online}
        size={lead.size ?? "md"}
      />
    );
  }
  if (lead.kind === "image") {
    return (
      <img
        src={lead.src}
        alt={lead.alt ?? ""}
        className="w-11 h-11 rounded-lg object-cover shrink-0"
      />
    );
  }
  return (
    <CircleIcon
      color={lead.color ?? "purple"}
      variant={lead.variant ?? "light"}
      size={lead.size ?? "lg"}
    >
      {lead.icon}
    </CircleIcon>
  );
}

function TrendTag({ value, direction }: { value: string; direction: "up" | "down" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-bold leading-4 tracking-fg",
        direction === "up" ? "text-fg-green-500" : "text-fg-red"
      )}
    >
      {value}
      {direction === "up" ? (
        <AltArrowUpBold size={12} />
      ) : (
        <AltArrowDownBold size={12} />
      )}
    </span>
  );
}
