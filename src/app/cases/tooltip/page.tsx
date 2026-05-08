"use client";

import {
  InfoCircleBoldDuotone,
  QuestionCircleBoldDuotone,
} from "solar-icon-set";
import {
  Tooltip,
  TooltipBubble,
  TooltipAnchor,
  type TooltipPosition,
  type TooltipSize,
  type TooltipAnchorState,
} from "@forge-ui-official/core";
import { PageHeading, Section, SubSection, Labeled } from "../_shared";

const positions: TooltipPosition[] = ["top", "right", "bottom", "left"];
const sizes: TooltipSize[] = ["sm", "lg"];
const anchorStates: TooltipAnchorState[] = ["idle", "active"];

const shortText = "Text Here";
const longText = "Text Here Lorem Ipsum Dolor Sit Amet";

// 让 open 态的 tooltip 有足够的空间显示，避免跨出 Labeled 边界撞到邻居
const positionPadding: Record<TooltipPosition, string> = {
  top: "pt-10 pb-2 px-10",
  bottom: "pb-10 pt-2 px-10",
  left: "pl-52 pr-2 py-4",
  right: "pr-52 pl-2 py-4",
};

export default function TooltipCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="Tooltip"
        hint="TooltipBubble / Tooltip / TooltipAnchor — 静态气泡、悬浮提示、图标触发器。"
      />

      {/* ============ Tooltip Bubble ============ */}
      <Section
        title="Tooltip Bubble"
        description="静态气泡，4 方向 × 2 尺寸（sm 单行、lg 多行 w-44）。"
      >
        {sizes.map((s) => (
          <SubSection key={s} title={`Size: ${s}`}>
            {positions.map((p) => (
              <Labeled key={p} label={p}>
                <TooltipBubble
                  content={s === "sm" ? shortText : longText}
                  position={p}
                  size={s}
                />
              </Labeled>
            ))}
          </SubSection>
        ))}
      </Section>

      {/* ============ Tooltip Anchor ============ */}
      <Section
        title="Tooltip Anchor"
        description="14×14 图标触发器，idle / active 两态。"
      >
        <SubSection title="Info icon (states)">
          {anchorStates.map((st) => (
            <Labeled key={st} label={st}>
              <TooltipAnchor
                icon={<InfoCircleBoldDuotone size={14} />}
                state={st}
              />
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Question icon (states)">
          {anchorStates.map((st) => (
            <Labeled key={st} label={st}>
              <TooltipAnchor
                icon={<QuestionCircleBoldDuotone size={14} />}
                state={st}
              />
            </Labeled>
          ))}
        </SubSection>
      </Section>

      {/* ============ Anchor + Tooltip ============ */}
      <Section
        title="Anchor + Tooltip"
        description="图标触发器 + 常显 tooltip，展示 4 个方向的组合效果。"
      >
        <SubSection title="Positions (open, info + sm)">
          {positions.map((p) => (
            <Labeled key={p} label={p}>
              <div className={positionPadding[p]}>
                <Tooltip content={shortText} position={p} size="sm" open>
                  <TooltipAnchor
                    icon={<InfoCircleBoldDuotone size={14} />}
                    state="active"
                  />
                </Tooltip>
              </div>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Positions (open, question + lg)">
          {positions.map((p) => (
            <Labeled key={p} label={p}>
              <div className={positionPadding[p]}>
                <Tooltip content={longText} position={p} size="lg" open>
                  <TooltipAnchor
                    icon={<QuestionCircleBoldDuotone size={14} />}
                    state="active"
                  />
                </Tooltip>
              </div>
            </Labeled>
          ))}
        </SubSection>

        <SubSection title="Hover trigger (hover 图标试试)">
          <Labeled label="hover">
            <div className="pt-10">
              <Tooltip content={shortText} position="top">
                <TooltipAnchor
                  icon={<InfoCircleBoldDuotone size={14} />}
                  state="idle"
                />
              </Tooltip>
            </div>
          </Labeled>
        </SubSection>
      </Section>
    </div>
  );
}
