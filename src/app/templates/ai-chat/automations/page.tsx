"use client";

import { useState } from "react";
import { Button, Modal, TextArea, TextField, Toggle, cn, useToast } from "@forge-ui-official/core";
import { ClockCircleLinear, FolderLinear } from "@forge-ui-official/core/icons";
import { PlayIcon } from "@solar-icons/react/linear/play";
import { PageFrame } from "../_shell";
import { AUTOMATIONS, PROJECTS, type Automation } from "../_data";

const resultTone = { 成功: "text-fg-grey-700", 失败: "text-fg-red", 跳过: "text-fg-grey-700" } as const;

const SCHEDULES = ["每天 09:00", "每个工作日 09:00", "每周一 09:00", "每月 1 日 10:00"];

export default function AutomationsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState(AUTOMATIONS);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({ name: "", prompt: "", schedule: SCHEDULES[0] });

  const update = (id: string, patch: Partial<Automation>) => setItems((previous) => previous.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const runNow = (item: Automation) => {
    update(item.id, { lastRun: { time: "正在运行…", result: "成功" } });
    window.setTimeout(() => {
      update(item.id, { lastRun: { time: "刚刚", result: "成功" } });
      toast({ title: `「${item.name}」已运行完成`, status: "success" });
    }, 1600);
  };

  const create = () => {
    if (!draft.name.trim() || !draft.prompt.trim()) return;
    setItems((previous) => [
      { id: `a-${Date.now()}`, name: draft.name.trim(), prompt: draft.prompt.trim(), schedule: draft.schedule, next: draft.schedule.replace(/^每(天|个工作日)/, "明天"), lastRun: { time: "还没运行过", result: "跳过" }, enabled: true, channel: "站内通知" },
      ...previous,
    ]);
    setCreating(false);
    setDraft({ name: "", prompt: "", schedule: SCHEDULES[0] });
    toast({ title: "自动化已创建", status: "success" });
  };

  return (
    <PageFrame title="自动化" description="让助手按时间表自动做事，结果发到你指定的地方。" action={<Button size="sm" color="black" onClick={() => setCreating(true)}>新建自动化</Button>}>
      <div className="grid gap-3 sm:grid-cols-3">
        <Summary label="运行中" value={`${items.filter((item) => item.enabled).length} 个`} />
        <Summary label="本周运行" value="18 次" />
        <Summary label="需要处理" value={`${items.filter((item) => item.lastRun.result === "失败").length} 个失败`} danger={items.some((item) => item.lastRun.result === "失败")} />
      </div>
      <div className="flex flex-col divide-y divide-fg-grey-100 rounded-2xl border border-fg-grey-200">
        {items.map((item) => {
          const project = PROJECTS.find((entry) => entry.id === item.projectId);
          return (
            <article key={item.id} className={cn("flex flex-col gap-3 p-5 md:flex-row md:items-center md:gap-6", !item.enabled && "opacity-60")}>
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-medium">{item.name}</span>
                  {project && (
                    <span className="flex items-center gap-1 text-xs text-fg-grey-700">
                      <FolderLinear size={12} />
                      {project.name}
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 text-sm text-fg-grey-900">{item.prompt}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-grey-700">
                  <span className="flex items-center gap-1">
                    <ClockCircleLinear size={12} />
                    {item.schedule}
                  </span>
                  <span>下次 {item.enabled ? item.next : "已暂停"}</span>
                  <span>
                    上次 {item.lastRun.time}
                    {item.lastRun.time !== "还没运行过" && item.lastRun.time !== "正在运行…" && <span className={cn("ml-1", resultTone[item.lastRun.result], item.lastRun.result === "失败" && "font-medium")}>{item.lastRun.result}</span>}
                  </span>
                  <span>发送到 {item.channel}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Button size="sm" variant="tertiary" color="grey" iconLeft={<PlayIcon size={14} />} disabled={item.lastRun.time === "正在运行…"} onClick={() => runNow(item)}>
                  立即运行
                </Button>
                <Toggle checked={item.enabled} onChange={(checked) => update(item.id, { enabled: checked })} ariaLabel={`${item.enabled ? "暂停" : "启用"}${item.name}`} />
              </div>
            </article>
          );
        })}
      </div>
      <Modal
        open={creating}
        onOpenChange={setCreating}
        title="新建自动化"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="tertiary" onClick={() => setCreating(false)}>
              取消
            </Button>
            <Button color="black" disabled={!draft.name.trim() || !draft.prompt.trim()} onClick={create}>
              创建
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <TextField label="名称" placeholder="例如：每日构建巡检" value={draft.name} onChange={(value) => setDraft((previous) => ({ ...previous, name: value }))} />
          <TextArea label="要做的事" placeholder="像跟同事交代一样写清楚：查什么、怎么判断、结果发给谁" value={draft.prompt} onChange={(value) => setDraft((previous) => ({ ...previous, prompt: value }))} rows={4} />
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">频率</span>
            <div className="flex flex-wrap gap-2">
              {SCHEDULES.map((schedule) => (
                <Button variant="unstyled" key={schedule} type="button" onClick={() => setDraft((previous) => ({ ...previous, schedule }))} className={cn("h-9 rounded-full border px-3.5 text-sm transition-colors", draft.schedule === schedule ? "border-fg-black bg-fg-black text-white" : "border-fg-grey-200 hover:border-fg-grey-400")}>
                  {schedule}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </PageFrame>
  );
}

function Summary({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-fg-grey-50 p-4">
      <span className="text-xs text-fg-grey-700">{label}</span>
      <span className={cn("text-xl font-semibold tracking-fg", danger && "text-fg-red")}>{value}</span>
    </div>
  );
}
