"use client";

import { type ReactNode } from "react";
import { Modal as CoreModal } from "@forge-ui-official/core";

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
  return <CoreModal variant="template" open={open} onOpenChange={(nextOpen) => { if (!nextOpen) onClose(); }} title={title ?? ""} width={width} className={className}>{children}</CoreModal>;
}
