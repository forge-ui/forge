"use client";

import { useState, type ReactNode } from "react";
import {
  BarChartStatCard,
  Button,
  ChatBubble,
  ChatInputBar,
  CheckboxWithLabel,
  CommandSearch,
  FileUpload,
  ProgressBar,
  SmallCalendar,
  Stepper,
  WheelChartStatCard,
  type CommandSearchItem,
  type FileItem,
} from "@forge-ui-official/core";

const commandItems: CommandSearchItem[] = [
  { id: "stats", label: "打开统计", hint: "StatCard", shortcut: "1", group: "导航" },
  { id: "calendar", label: "打开日程", hint: "Calendar", shortcut: "2", group: "导航" },
  { id: "chat", label: "打开对话", hint: "Chat", shortcut: "3", group: "导航" },
];

const openingTasks = [
  { id: "sync", label: "同步本周完成数据", done: true },
  { id: "window", label: "整理发版窗口", done: false },
  { id: "pdf", label: "上传周报 PDF", done: false },
  { id: "review", label: "设计评审会议", done: false },
] as const;

const bare = "!bg-transparent !shadow-none !outline-none";

function Glass({
  children,
  className = "",
  delay = "0ms",
  tone = "card",
}: {
  children: ReactNode;
  className?: string;
  delay?: string;
  tone?: "card" | "soft";
}) {
  return (
    <div className={`home-glass home-rise ${tone === "soft" ? "home-glass-soft" : ""} ${className}`} style={{ animationDelay: delay }}>
      {children}
    </div>
  );
}

function WeekStat() {
  return (
    <BarChartStatCard
      className={`home-stat ${bare}`}
      title="本周完成"
      value="146"
      trend="+12%"
      trendDirection="up"
      subtitle="较上周"
      theme="white"
      barColor="blue"
      bars={[18, 26, 22, 40, 30]}
      density="compact"
      width="full"
    />
  );
}

function RingCard() {
  return (
    <WheelChartStatCard
      className={`home-ring-card ${bare}`}
      title="进度"
      value="48%"
      wheelPercent={48}
      wheelColor="blue"
      subtitle="本周目标"
      theme="white"
      density="compact"
      width="full"
    />
  );
}

function CalendarPanel() {
  return (
    <SmallCalendar
      className={`home-calendar-card ${bare}`}
      title="日历"
      subtitle="10月 2026"
      color="blue"
      width="full"
      events={[
        { day: 26, title: "设计评审", timeRange: "10:00-11:00", color: "blue" },
        { day: 28, title: "发版窗口", timeRange: "14:00-15:30", color: "blue" },
      ]}
    />
  );
}

function CommandMenu() {
  return (
    <CommandSearch
      className={`home-command ${bare}`}
      items={commandItems}
      locale="zh"
      color="blue"
      motion="auto"
      autoFocus={false}
      placeholder="搜索命令…"
      groupLabel="导航"
    />
  );
}

function StepCard() {
  const [step, setStep] = useState(2);
  return (
    <div className="home-steps">
      <p className="home-kicker">步骤</p>
      <Stepper
        color="blue"
        motion="auto"
        locale="zh"
        current={step}
        onStepChange={setStep}
        items={[
          { id: "pick", label: "选择" },
          { id: "arrange", label: "整理" },
          { id: "check", label: "核对" },
        ]}
      />
    </div>
  );
}

function UploadCard() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: "week", name: "本周统计.pdf", size: "240 KB", state: "uploading", progress: 84 },
  ]);
  return (
    <FileUpload
      className="home-upload"
      color="blue"
      locale="zh"
      label="上传"
      buttonLabel="添加文件"
      files={files}
      onUpload={() => {}}
      onRemove={(id) => setFiles((current) => current.filter((file) => file.id !== id))}
    />
  );
}

function Thread() {
  const [draft, setDraft] = useState("");
  return (
    <div className="home-thread">
      <div className="home-thread-head">
        <p>对话</p>
        <span>Forge</span>
      </div>
      <div className="home-thread-log">
        <ChatBubble type="received" color="blue" motion="auto" content="把周报发我一下。" time="15:18" />
        <ChatBubble type="sent" color="blue" motion="auto" variant="file" fileName="本周统计.pdf" fileSize="240 KB" time="15:20" />
      </div>
      <ChatInputBar
        className="w-full max-w-full"
        locale="zh"
        motion="auto"
        color="blue"
        density="compact"
        placeholder="写一条消息…"
        value={draft}
        onChange={setDraft}
        onSend={() => setDraft("")}
        showAttachment={false}
        quickActions={[]}
        defaultQuickActionsOpen={false}
      />
    </div>
  );
}

function TodoCard() {
  const [tasks, setTasks] = useState(openingTasks.map((task) => ({ ...task })));
  const done = tasks.filter((task) => task.done).length;
  return (
    <div className="home-todo">
      <div className="home-todo-head">
        <p>今日待办</p>
        <span>{done}/{tasks.length}</span>
      </div>
      <ProgressBar value={tasks.length ? (done / tasks.length) * 100 : 0} color="blue" size="sm" motion="auto" />
      <div className="home-todo-list">
        {tasks.map((task) => (
          <CheckboxWithLabel
            key={task.id}
            color="blue"
            motion="auto"
            label={task.label}
            checked={task.done}
            onChange={(next) => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done: next } : item))}
          />
        ))}
      </div>
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
    </div>
  );
}

function Stage() {
  return (
    <div className="home-stage" data-home-stage>
      <Glass className="home-slot home-slot-stat" delay="40ms"><WeekStat /></Glass>
      <Glass className="home-slot home-slot-cal" delay="90ms" tone="card"><CalendarPanel /></Glass>
      <Glass className="home-slot home-slot-ring" delay="130ms" tone="soft"><RingCard /></Glass>
      <Glass className="home-slot home-slot-cmd" delay="170ms"><CommandMenu /></Glass>
      <Glass className="home-slot home-slot-steps" delay="210ms" tone="soft"><StepCard /></Glass>
      <Glass className="home-slot home-slot-upload" delay="250ms"><UploadCard /></Glass>
      <Glass className="home-slot home-slot-chat" delay="290ms"><Thread /></Glass>
      <Glass className="home-slot home-slot-todo" delay="330ms"><TodoCard /></Glass>
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
