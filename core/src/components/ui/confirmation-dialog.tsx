import { type ReactNode } from "react";
import { cn } from "../../lib/utils";

// ============================================================
// ConfirmationDialog - 确认弹窗
// color: red, green, yellow, purple, blue
// layout: spread (居中文本 + 两端按钮), right (左对齐文本 + 右对齐按钮)
// ============================================================

const iconBgColors = {
  red: "bg-rose-100",
  green: "bg-emerald-50",
  yellow: "bg-fg-yellow-50",
  purple: "bg-purple-100",
  blue: "bg-indigo-50",
} as const;

const iconTextColors = {
  red: "text-fg-red",
  green: "text-emerald-500",
  yellow: "text-fg-yellow",
  purple: "text-fg-violet",
  blue: "text-blue-600",
} as const;

const confirmBgColors = {
  red: "bg-fg-red",
  green: "bg-emerald-500",
  yellow: "bg-fg-yellow text-fg-black",
  purple: "bg-fg-violet",
  blue: "bg-blue-600",
} as const;

export type ConfirmationDialogColor = keyof typeof confirmBgColors;
export type ConfirmationDialogLayout = "spread" | "right";

export function ConfirmationDialog({
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  color,
  icon,
  layout = "spread",
  onConfirm,
  onCancel,
  className,
}: {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  color: ConfirmationDialogColor;
  icon?: ReactNode;
  layout?: ConfirmationDialogLayout;
  onConfirm?: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[480px] p-6 bg-white rounded-card flex flex-col items-center gap-8",
        className
      )}
    >
      <div
        className={cn(
          "self-stretch flex flex-col gap-4",
          layout === "spread" ? "items-center" : "items-start"
        )}
      >
        {icon && (
          <div
            className={cn(
              "p-4 rounded-full inline-flex",
              iconBgColors[color],
              iconTextColors[color]
            )}
          >
            {icon}
          </div>
        )}

        <div
          className={cn(
            "self-stretch flex flex-col gap-3",
            layout === "spread" ? "items-center" : "items-start"
          )}
        >
          <h3
            className={cn(
              "self-stretch text-xl font-semibold text-fg-black leading-8 tracking-fg",
              layout === "spread" && "text-center"
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "self-stretch text-base font-normal text-fg-grey-700 leading-6 tracking-fg",
              layout === "spread" && "text-center"
            )}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "w-full flex items-center",
          layout === "spread" ? "justify-between" : "justify-end gap-3"
        )}
      >
        <button
          type="button"
          onClick={onCancel}
          className="w-32 px-4 py-3.5 rounded-full outline outline-1 outline-offset-[-1px] outline-fg-grey-200 text-fg-grey-700 font-bold text-sm cursor-pointer"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "w-32 px-4 py-3.5 rounded-full text-white font-bold text-sm cursor-pointer",
            confirmBgColors[color]
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}
