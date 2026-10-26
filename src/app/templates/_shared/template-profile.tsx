"use client";

import { Avatar, KebabMenu } from "@forge-ui-official/core";
import { useRouter } from "next/navigation";

export function TemplateProfile({ template, onHelp }: {
  template: "tasks" | "agent";
  onHelp: () => void;
}) {
  const router = useRouter();
  return <div className="template-profile" aria-label="示例用户与模板导航">
    <Avatar size="sm" src="/images/protask/crm/john-hoegan-avatar.png" alt="林晓" />
    <div className="template-profile-text min-w-0 flex-1">
      <p className="text-sm font-semibold text-fg-black">林晓</p>
      <p className="text-xs text-fg-grey-700">本地模板预览</p>
    </div>
    <KebabMenu accent="black" items={[
      { label: "使用说明", onSelect: onHelp },
      { label: template === "tasks" ? "打开智能体工作台" : "打开任务看板", onSelect: () => router.push(template === "tasks" ? "/templates/agent" : "/templates/task-board") },
      { label: "返回模板库", onSelect: () => router.push("/templates") },
    ]} />
  </div>;
}
