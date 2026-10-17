"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarCard,
  ChatBubble,
  ChatInputBar,
  type ChatInputBarQuickAction,
  FileUpload,
  NotificationItem,
  ProgressBar,
  RatingStars,
  Stepper,
  Toggle,
} from "@forge-ui-official/core";

const quickCards: ChatInputBarQuickAction[] = [
  { id: "image", label: "创建图片", kind: "image", placeholder: "描述你想创建的图片…" },
  { id: "note", label: "写笔记", kind: "note", placeholder: "写下想记录的内容…" },
  { id: "event", label: "安排日程", kind: "event", placeholder: "什么活动，什么时候？" },
  { id: "voice", label: "语音输入", kind: "voice", placeholder: "输入要转写的内容…" },
  { id: "docs", label: "分析文档", kind: "docs", placeholder: "上传文档，或者提一个问题…" },
];

function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="home-panel">
      {title ? <p className="home-panel-title">{title}</p> : null}
      <div className="home-panel-body">{children}</div>
    </section>
  );
}

function useTicker(step: number, max: number, every: number) {
  const [value, setValue] = useState(step * 4);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const timer = window.setInterval(() => {
      setValue((current) => (current >= max ? step : current + step));
    }, every);
    return () => window.clearInterval(timer);
  }, [every, max, step]);
  return value;
}

function RatingPanel() {
  const [score, setScore] = useState(4);
  return (
    <Panel title="评分">
      <RatingStars value={score} onChange={setScore} motion="auto" locale="zh" size="md" ariaLabel="完成度" />
    </Panel>
  );
}

function SwitchPanel() {
  const [flags, setFlags] = useState({ motion: true, online: true, mail: false, alert: true });
  const rows = [
    ["motion", "动效"],
    ["online", "在线"],
    ["mail", "邮件"],
    ["alert", "提醒"],
  ] as const;
  return (
    <Panel title="开关">
      {rows.map(([key, label]) => (
        <div className="home-split" key={key}>
          <span className="text-sm text-fg-grey-700">{label}</span>
          <Toggle
            checked={flags[key]}
            onChange={(next) => setFlags((current) => ({ ...current, [key]: next }))}
            color="blue"
            motion="auto"
            ariaLabel={label}
          />
        </div>
      ))}
    </Panel>
  );
}

function RingPanel() {
  const value = useTicker(4, 100, 160);
  return (
    <Panel title="进度">
      <ProgressBar variant="ring" value={value} color="blue" motion="auto" showPercentage label="完成进度" />
    </Panel>
  );
}

function StepPanel() {
  const [step, setStep] = useState(2);
  return (
    <Panel title="步骤">
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

function UploadPanel() {
  const progress = useTicker(6, 100, 180);
  return (
    <Panel title="上传">
      <FileUpload
        className="home-upload"
        color="blue"
        locale="zh"
        files={[{ id: "week", name: "本周统计.pdf", size: "240 KB", state: "uploading", progress }]}
      />
    </Panel>
  );
}

function NoticePanel() {
  const [unread, setUnread] = useState(true);
  return (
    <Panel title="通知">
      <NotificationItem
        tag="评审"
        time="10:00"
        title="首页可以看了"
        body="统计和日程已经排进这一面墙。"
        unread={unread}
        color="blue"
        onMarkRead={() => setUnread(false)}
      />
    </Panel>
  );
}

function Thread() {
  const [shown, setShown] = useState(1);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(3);
      return;
    }
    const timers = [650, 1400].map((delay, index) => window.setTimeout(() => setShown(index + 2), delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);
  return (
    <div className="home-thread">
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
      <ChatBubble type="received" color="blue" motion="auto" senderName="Forge" content="统计、日程和看板都可以直接拿来用。" />
      {shown > 1 ? (
        <ChatBubble type="sent" color="blue" variant="file" motion="auto" fileName="本周统计.pdf" fileSize="240 KB" />
      ) : null}
      {shown > 2 ? <ChatBubble type="sent" color="black" motion="auto" content="输入栏可以打字。" /> : null}
    </div>
  );
}

function CalendarPanel() {
  return (
    <Panel title="日历">
      <CalendarCard color="blue" size="compact" variant="plain" motion="auto" className="max-w-full" />
    </Panel>
  );
}

function ChatPanel() {
  return (
    <Panel title="对话">
      <Thread />
    </Panel>
  );
}

function Wall() {
  return (
    <div className="home-wall">
      <div className="home-span">
        <div className="home-span-cols">
          <div className="home-col">
            <RatingPanel />
            <SwitchPanel />
          </div>
          <div className="home-col">
            <CalendarPanel />
          </div>
        </div>
        <ChatPanel />
      </div>
      <div className="home-col">
        <RingPanel />
        <StepPanel />
        <UploadPanel />
        <NoticePanel />
      </div>
    </div>
  );
}

export function HomeHero({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="home-hero-copy">{children}</div>
      <div className="home-hero-stage" id="home-hero-wall" data-home-wall>
        <Wall />
      </div>
    </>
  );
}
