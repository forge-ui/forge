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
    title: "确认删除这笔订单？",
    description: "删除后无法恢复，请确认是否继续。",
    confirmLabel: "删除",
    cancelLabel: "取消",
    icon: <TrashBinMinimalisticBold size={32} color="currentColor" />,
  },
  {
    color: "green",
    title: "发送确认消息？",
    description: "删除后无法恢复，请确认是否继续。",
    confirmLabel: "发送",
    cancelLabel: "取消",
    icon: <CheckCircleBold size={32} color="currentColor" />,
  },
  {
    color: "yellow",
    title: "保存修改？",
    description: "删除后无法恢复，请确认是否继续。",
    confirmLabel: "保存修改",
    cancelLabel: "不保存",
    icon: <DangerTriangleBold size={32} color="currentColor" />,
  },
  {
    color: "purple",
    title: "升级专业版？",
    description: "删除后无法恢复，请确认是否继续。",
    confirmLabel: "升级",
    cancelLabel: "取消",
    icon: <CrownBold size={32} color="currentColor" />,
  },
  {
    color: "blue",
    title: "激活账号？",
    description: "删除后无法恢复，请确认是否继续。",
    confirmLabel: "开启",
    cancelLabel: "取消",
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
      <Section title="不带图标" description="省略 icon 的简洁变体。">
        <SubSection title="Spread / no icon" stack>
          <ConfirmationDialog
            color="red"
            title="确认删除这笔订单？"
            description="删除后无法恢复，请确认是否继续。"
            confirmLabel="删除"
            cancelLabel="取消"
            layout="spread"
          />
        </SubSection>
      </Section>
    </div>
  );
}
