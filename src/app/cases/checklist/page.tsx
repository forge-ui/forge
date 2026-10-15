"use client";

import { Checklist, ChecklistItem } from "@forge-ui-official/core";
import { PageHeading, Section, SubSection } from "../_shared";

const ONBOARDING = [
  { id: "vendor", label: "核对供应商联系人", done: true },
  { id: "certs", label: "核验冷链证书" },
  { id: "windows", label: "发布周末冷库作业时段" },
  { id: "reorder", label: "发送华丰食品补货单" },
];

const SETUP = [
  { id: "profile", label: "填写门店名称" },
  { id: "hours", label: "设置周末营业时间" },
  { id: "pos", label: "接入收银导出数据" },
];

export default function ChecklistCasePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeading
        title="待办清单"
        hint="勾选待办事项，已完成的内容自动移到列表底部。"
      />

      <Section title="完成后移至底部" description="点未完成行，等划线结束后沉底。">
        <SubSection title="入门引导" stack>
          <Checklist defaultTasks={ONBOARDING} />
        </SubSection>
      </Section>

      <Section title="尺寸" description="sm 更紧，适合设置页侧栏。">
        <SubSection title="sm" stack>
          <Checklist size="sm" defaultTasks={SETUP} />
        </SubSection>
      </Section>

      <Section title="颜色" description="勾选色与 Checkbox 对齐。">
        <SubSection title="blue" stack>
          <Checklist color="blue" defaultTasks={SETUP} />
        </SubSection>
      </Section>

      <Section title="ChecklistItem" description="单独一行，不重排。">
        <SubSection title="独立使用" stack>
          <div className="flex flex-col gap-2">
            <ChecklistItem label="起草开心果口味周末促销说明" />
            <ChecklistItem label="已发送" defaultChecked />
          </div>
        </SubSection>
      </Section>
    </div>
  );
}
