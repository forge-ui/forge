"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  ConfirmationDialog,
  Toggle,
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
  /** 色板与无障碍名称用语义，不单用颜色名。 */
  semantic: string;
  token: string;
  swatch: string;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  icon: ReactNode;
};

const dialogSpecs: DialogSpec[] = [
  {
    color: "red",
    semantic: "删除",
    token: "--fg-red",
    swatch: "bg-fg-red",
    title: "确认删除这笔订单？",
    description: "删除后无法恢复，请确认是否继续。",
    confirmLabel: "删除",
    cancelLabel: "取消",
    icon: <TrashBinMinimalisticBold size={32} color="currentColor" />,
  },
  {
    color: "green",
    semantic: "成功",
    token: "--fg-green-500",
    swatch: "bg-fg-green-500",
    title: "确认发送这条消息？",
    description: "发送后对方会立即收到，这次操作会记为已完成。",
    confirmLabel: "发送",
    cancelLabel: "取消",
    icon: <CheckCircleBold size={32} color="currentColor" />,
  },
  {
    color: "yellow",
    semantic: "警告",
    token: "--fg-yellow",
    swatch: "bg-fg-yellow",
    title: "离开前要保存修改吗？",
    description: "还有未保存的内容。不保存就离开，这些修改会丢失。",
    confirmLabel: "保存修改",
    cancelLabel: "不保存",
    icon: <DangerTriangleBold size={32} color="currentColor" />,
  },
  {
    color: "purple",
    semantic: "升级",
    token: "--fg-violet",
    swatch: "bg-fg-violet",
    title: "升级专业版？",
    description: "升级后可使用全部专业功能，费用从下一个账单周期开始计算。",
    confirmLabel: "升级",
    cancelLabel: "取消",
    icon: <CrownBold size={32} color="currentColor" />,
  },
  {
    color: "blue",
    semantic: "激活",
    token: "--fg-blue",
    swatch: "bg-fg-blue",
    title: "激活这个账号？",
    description: "激活后即可登录并使用全部功能，之后仍可在设置里关闭。",
    confirmLabel: "开启",
    cancelLabel: "取消",
    icon: <ShieldCheckBold size={32} color="currentColor" />,
  },
];

const layouts: ConfirmationDialogLayout[] = ["spread", "right"];

export default function ModalCasePage() {
  const [color, setColor] = useState<ConfirmationDialogColor>("red");
  const [hideIcon, setHideIcon] = useState(false);
  const swatches = useRef<(HTMLButtonElement | null)[]>([]);
  const spec = dialogSpecs.find((item) => item.color === color) ?? dialogSpecs[0];
  const index = dialogSpecs.indexOf(spec);

  function select(next: number) {
    const item = dialogSpecs[next];
    if (!item) return;
    setColor(item.color);
    swatches.current[next]?.focus();
  }

  function onSwatchKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    if (key !== "ArrowLeft" && key !== "ArrowRight" && key !== "ArrowUp" && key !== "ArrowDown" && key !== "Home" && key !== "End") return;
    event.preventDefault();
    if (key === "Home") {
      select(0);
      return;
    }
    if (key === "End") {
      select(dialogSpecs.length - 1);
      return;
    }
    const delta = key === "ArrowLeft" || key === "ArrowUp" ? -1 : 1;
    select((index + delta + dialogSpecs.length) % dialogSpecs.length);
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="确认弹窗"
        hint="在删除、发送等重要操作前说明结果并请求确认。"
      />

      <Section
        title="确认弹窗"
        description="选择删除、成功、警告、升级或激活。左右方向键切换后，两端展开和右侧操作同时更新文案、图标和按钮颜色。"
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 p-2">
          <div
            role="radiogroup"
            aria-label="确认语义"
            aria-orientation="horizontal"
            className="flex items-center"
            style={{ gap: 8 }}
            onKeyDown={onSwatchKeyDown}
          >
            {dialogSpecs.map((item, itemIndex) => {
              const selected = item.color === color;
              return (
                <button
                  key={item.color}
                  ref={(node) => {
                    swatches.current[itemIndex] = node;
                  }}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-label={item.semantic}
                  title={item.semantic}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(itemIndex)}
                  className={`shrink-0 cursor-pointer rounded-full border-0 p-0 ${item.swatch}`}
                  style={{
                    width: 24,
                    height: 24,
                    outline: selected ? `2px solid var(${item.token})` : "none",
                    outlineOffset: selected ? 2 : 0,
                    transform: selected ? "scale(1.1)" : "none",
                    transition: "none",
                  }}
                />
              );
            })}
          </div>

          <p className="text-sm text-fg-grey-700" aria-live="polite">
            当前语义：{spec.semantic}
          </p>

          <div
            id="无图标"
            data-case-section="无图标"
            className="flex scroll-mt-24 items-center gap-2"
          >
            <span className="text-sm font-medium text-fg-grey-900">无图标</span>
            <Toggle
              checked={hideIcon}
              onChange={setHideIcon}
              ariaLabel="无图标"
              color="black"
              size="sm"
            />
          </div>
        </div>

        {layouts.map((layout) => (
          <SubSection key={layout} title={`Layout: ${layout}`} stack>
            <ConfirmationDialog
              color={spec.color}
              title={spec.title}
              description={spec.description}
              confirmLabel={spec.confirmLabel}
              cancelLabel={spec.cancelLabel}
              icon={hideIcon ? undefined : spec.icon}
              layout={layout}
            />
          </SubSection>
        ))}
      </Section>
    </div>
  );
}
