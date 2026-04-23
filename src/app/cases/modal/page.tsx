"use client";

import {
  ConfirmationDialog,
  type ConfirmationDialogColor,
  type ConfirmationDialogLayout,
} from "@forge-ui/react";
import {
  TrashBinMinimalisticBold,
  CheckCircleBold,
  DangerTriangleBold,
  CrownBold,
  ShieldCheckBold,
} from "solar-icon-set";
import { PageHeading, Section, SubSection } from "../_shared";

type DialogSpec = {
  color: ConfirmationDialogColor;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  icon: React.ReactNode;
};

const dialogSpecs: DialogSpec[] = [
  {
    color: "red",
    title: "Delete this order?",
    description: "Lorem ipsum dolor sit amet lorem? This action can't be undone",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    icon: <TrashBinMinimalisticBold size={32} color="currentColor" />,
  },
  {
    color: "green",
    title: "Send confirmation?",
    description: "Lorem ipsum dolor sit amet lorem? This action can't be undone",
    confirmLabel: "Send",
    cancelLabel: "Cancel",
    icon: <CheckCircleBold size={32} color="currentColor" />,
  },
  {
    color: "yellow",
    title: "Save changes?",
    description: "Lorem ipsum dolor sit amet lorem? This action can't be undone",
    confirmLabel: "Yes, Save",
    cancelLabel: "Don't Save",
    icon: <DangerTriangleBold size={32} color="currentColor" />,
  },
  {
    color: "purple",
    title: "Upgrade to Pro?",
    description: "Lorem ipsum dolor sit amet lorem? This action can't be undone",
    confirmLabel: "Upgrade",
    cancelLabel: "Cancel",
    icon: <CrownBold size={32} color="currentColor" />,
  },
  {
    color: "blue",
    title: "Activate account?",
    description: "Lorem ipsum dolor sit amet lorem? This action can't be undone",
    confirmLabel: "Activate",
    cancelLabel: "Cancel",
    icon: <ShieldCheckBold size={32} color="currentColor" />,
  },
];

const layouts: ConfirmationDialogLayout[] = ["spread", "right"];

export default function ModalCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Modal"
        hint="ConfirmationDialog — 5 色 × 2 布局（spread 居中两端分布 / right 左对齐右端按钮）。"
      />

      {dialogSpecs.map((spec) => (
        <Section
          key={spec.color}
          title={`Color: ${spec.color}`}
          description={`Figma 对应 "${spec.confirmLabel}" 确认动作。`}
        >
          {layouts.map((layout) => (
            <SubSection key={layout} title={`Layout: ${layout}`} stack>
              <ConfirmationDialog
                color={spec.color}
                title={spec.title}
                description={spec.description}
                confirmLabel={spec.confirmLabel}
                cancelLabel={spec.cancelLabel}
                icon={spec.icon}
                layout={layout}
              />
            </SubSection>
          ))}
        </Section>
      ))}

      {/* ============ No icon variant ============ */}
      <Section title="No Icon" description="省略 icon 的简洁变体。">
        <SubSection title="Spread / no icon" stack>
          <ConfirmationDialog
            color="red"
            title="Delete this order?"
            description="Lorem ipsum dolor sit amet lorem? This action can't be undone"
            confirmLabel="Delete"
            cancelLabel="Cancel"
            layout="spread"
          />
        </SubSection>
      </Section>
    </div>
  );
}
