"use client";

import { type ReactNode } from "react";
import { CloseIcon } from "@forge-ui/react";
import { cn } from "@forge-ui/react";

// ============================================================
// Modal — examples 业务页通用弹窗壳
// 不在 UI Kit (Figma 没设计通用 Modal，只有 ConfirmationDialog 特化弹窗)
// 仅 src/app/examples/ 下业务示例使用
// ============================================================

export function Modal({
  open,
  onClose,
  title,
  width = "w-[560px]",
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: string;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div
        className={cn(
          "bg-white rounded-card shadow-lg overflow-hidden flex flex-col",
          width,
          className
        )}
      >
        {title && (
          <>
            <div className="flex items-center justify-between pt-6 px-6">
              <h3 className="text-xl font-semibold text-fg-black leading-8 tracking-fg">
                {title}
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center bg-transparent cursor-pointer text-fg-black"
              >
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="h-px w-full bg-fg-grey-200 mt-6" />
          </>
        )}
        {children}
      </div>
    </div>
  );
}
