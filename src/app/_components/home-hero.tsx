"use client";

import { useState, type ReactNode } from "react";
import {
  BarChart,
  Button,
  CalendarCard,
  ChartCard,
  ChatBubble,
  ChatInputBar,
  Checklist,
  CommandSearch,
  FileUpload,
  ProgressBar,
  Stepper,
  SurfaceCard,
  type ChatInputBarQuickAction,
  type ChecklistTask,
  type CommandSearchItem,
} from "@forge-ui-official/core";
import { CalendarLinear, ChartSquareLinear, ChatRoundLinear } from "@forge-ui-official/core/icons";

const quickCards: ChatInputBarQuickAction[] = [
  { id: "image", label: "创建图片", kind: "image", placeholder: "描述你想创建的图片…" },
  { id: "note", label: "写笔记", kind: "note", placeholder: "写下想记录的内容…" },
  { id: "event", label: "安排日程", kind: "event", placeholder: "什么活动，什么时候？" },
  { id: "voice", label: "语音输入", kind: "voice", placeholder: "输入要转写的内容…" },
  { id: "docs", label: "分析文档", kind: "docs", placeholder: "上传文档，或者提一个问题…" },
];

const commandItems: CommandSearchItem[] = [
  { id: "stats", label: "打开统计", hint: "本周", shortcut: "1", icon: <ChartSquareLinear size={16} /> },
  { id: "calendar", label: "打开日程", hint: "十月", shortcut: "2", icon: <CalendarLinear size={16} /> },
  { id: "chat", label: "打开对话", shortcut: "3", icon: <ChatRoundLinear size={16} /> },
];

const weekBars = [
  { value: 22, label: "一" },
  { value: 34, label: "二" },
  { value: 16, label: "三" },
  { value: 48, label: "四" },
  { value: 28, label: "五" },
];

const openingTasks: ChecklistTask[] = [
  { id: "copy", label: "完善引导文案" },
  { id: "notes", label: "整理版本说明" },
  { id: "ship", label: "检查发布清单" },
  { id: "review", label: "设计评审会议", done: true },
];

const showcaseDay = new Date(2026, 9, 26);

function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <SurfaceCard
      title={title}
      action={action}
      padding="none"
      className={`home-panel flex h-full min-h-0 flex-col ${className}`}
      headerClassName="home-panel-head border-0"
      contentClassName="home-panel-body"
    >
      {children}
    </SurfaceCard>
  );
}

function WeekStat() {
  const [index, setIndex] = useState(3);
  return (
    <ChartCard
      className="home-stat flex h-full min-h-0"
      title="本周完成"
      subtitle="共 146 · 较上周 +12%"
      width="full"
      minHeight="min-h-0"
      action={<></>}
    >
      <BarChart
        data={weekBars}
        accent="blue"
        color="bg-fg-blue"
        inactiveColor="bg-fg-blue-100"
        motion="auto"
        height="h-14"
        showLabels
        barWidth="wide"
        activeIndex={index}
        onSelect={setIndex}
        ariaLabel="本周完成"
      />
    </ChartCard>
  );
}

function CommandMenu() {
  return (
    <CommandSearch
      className="home-command"
      items={commandItems}
      locale="zh"
      color="blue"
      motion="auto"
      autoFocus={false}
      placeholder="搜索命令…"
      groupLabel="命令"
    />
  );
}

function RingCard() {
  return (
    <Panel title="进度" className="home-ring">
      <ProgressBar variant="ring" value={48} color="blue" motion="auto" showPercentage label="完成进度" />
    </Panel>
  );
}

function StepCard() {
  const [step, setStep] = useState(2);
  return (
    <Panel title="步骤" className="home-steps">
      <Stepper
        color="blue"
        motion="auto"
        locale="zh"
        current={step}
        onStepChange={setStep}
        items={[
          { id: "pick", label: "挑选" },
          { id: "place", label: "排进" },
          { id: "check", label: "核对" },
        ]}
      />
    </Panel>
  );
}

function UploadCard() {
  return (
    <Panel title="上传" className="home-upload-panel">
      <FileUpload
        className="home-upload"
        color="blue"
        locale="zh"
        files={[{ id: "week", name: "本周统计.pdf", size: "240 KB", state: "uploading", progress: 84 }]}
      />
    </Panel>
  );
}

function Thread() {
  return (
    <div className="home-thread">
      <ChatBubble type="received" color="blue" motion="auto" senderName="Forge" content="统计、日程和看板都可以直接拿来用。" />
      <ChatBubble type="sent" color="blue" variant="file" motion="auto" fileName="本周统计.pdf" fileSize="240 KB" />
      <ChatInputBar
        className="w-full max-w-full"
        locale="zh"
        motion="auto"
        color="blue"
        placeholder="写一条消息"
        quickActions={quickCards}
        quickActionsLabel="快捷卡片"
        defaultQuickActionsOpen
        hasMessages={false}
        showAttachment={false}
      />
    </div>
  );
}

function CalendarPanel() {
  return (
    <Panel title="日历" className="home-calendar">
      <CalendarCard color="blue" size="compact" variant="plain" motion="auto" locale="zh-CN" defaultDate={showcaseDay} className="home-calendar-card" />
    </Panel>
  );
}

function TodoCard() {
  const [tasks, setTasks] = useState(openingTasks);
  const done = tasks.filter((task) => task.done).length;
  return (
    <Panel
      title="今日待办"
      className="home-todo"
      action={<span className="text-sm tabular-nums text-fg-grey-700">{done}/{tasks.length}</span>}
    >
      <ProgressBar value={tasks.length ? (done / tasks.length) * 100 : 0} color="blue" size="sm" label="完成进度" motion="auto" />
      <Checklist tasks={tasks} onTasksChange={setTasks} size="sm" color="blue" locale="zh" motion="auto" />
      <Button
        color="blue"
        variant="tertiary"
        size="sm"
        motion="auto"
        className="w-full"
        onClick={() => setTasks(openingTasks.map((task) => ({ ...task, done: false })))}
      >
        重新开始
      </Button>
    </Panel>
  );
}

function Stage() {
  return (
    <div className="home-stage" data-home-stage>
      <div className="home-slot home-slot-stat"><WeekStat /></div>
      <div className="home-slot home-slot-cal"><CalendarPanel /></div>
      <div className="home-slot home-slot-tools">
        <div className="home-tools">
          <RingCard />
          <StepCard />
        </div>
      </div>
      <div className="home-slot home-slot-cmd"><CommandMenu /></div>
      <div className="home-slot home-slot-upload"><UploadCard /></div>
      <div className="home-slot home-slot-chat">
        <Panel title="对话" className="home-chat">
          <Thread />
        </Panel>
      </div>
      <div className="home-slot home-slot-todo"><TodoCard /></div>
    </div>
  );
}

export function HomeHero({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="home-hero-copy">{children}</div>
      <div className="home-hero-stage" id="home-hero-wall" data-home-wall>
        <Stage />
      </div>
    </>
  );
}
