"use client";

import {
  ConfirmationDialog,
  type ConfirmationDialogColor,
  type ConfirmationDialogLayout,
} from "@forge-ui-official/core";
import {
  TrashBinMinimalisticBold,
  CheckCircleBold,
  DangerTriangleBold,
  CrownBold,
  ShieldCheckBold,
} from "@forge-ui-official/core/icons";
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
        title="确认弹窗"
        hint="在删除、发送等重要操作前说明结果并请求确认。"
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
